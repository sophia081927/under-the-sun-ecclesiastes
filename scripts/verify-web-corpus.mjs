// Verifies every English Scripture entry in the Q&A / prayer / registry data
// against the project's trusted WEB corpus (worker/scripture-assets/en).
//
// Rigour (so it cannot pass a corrupted verse):
//   * FULL verses must match the cited corpus verse(s) word-for-word.
//   * The 8 intentional excerpts are pinned to an EXACT expected range, which
//     must itself be a contiguous word-run of the corpus verse(s); the entry
//     must then equal that pinned range exactly (over-truncation fails).
//   * Word boundaries are preserved, so two words run together ("aband") fail.
//   * Direct-speech entries must keep their inner speech quotes (anchors below),
//     so deleting an internal closing quote fails.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(dir, '..');
const CORPUS = path.join(ROOT, 'worker/scripture-assets/en');
const BOOK = {
  Genesis:'GEN', Exodus:'EXO', Psalm:'PSA', Psalms:'PSA', Proverbs:'PRO', Ecclesiastes:'ECC',
  Isaiah:'ISA', Jeremiah:'JER', Matthew:'MAT', Mark:'MRK', Luke:'LUK', John:'JHN',
  Acts:'ACT', Romans:'ROM', Ephesians:'EPH', Philippians:'PHP', Colossians:'COL', Hebrews:'HEB',
  James:'JAS', Job:'JOB', Revelation:'REV',
  '1 John':'1JN', '1 Peter':'1PE', '1 Thessalonians':'1TH', '2 Corinthians':'2CO',
};
const loadCh = (code, ch) => JSON.parse(fs.readFileSync(path.join(CORPUS, code, ch + '.json'), 'utf8'));

// Word list: lowercase, drop apostrophes/quote glyphs (so "LORD’s"→"lords" and inner
// ‘ ’ delimiters vanish) but split on every other non-alphanumeric, KEEPING word breaks.
export const words = (s) => (s || '')
  .toLowerCase().normalize('NFKD')
  .replace(/[‘’“”"'`]/g, '')
  .split(/[^a-z0-9]+/).filter(Boolean);
const arrEq = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
const isContiguousSub = (sub, arr) => {
  if (!sub.length) return false;
  for (let i = 0; i + sub.length <= arr.length; i++) if (arrEq(sub, arr.slice(i, i + sub.length))) return true;
  return false;
};

export function corpusFor(ref) {
  const m = ref.match(/^(\d?\s?[A-Za-z]+)\s+(\d+):(.+)$/);
  if (!m) throw new Error('cannot parse ref: ' + ref);
  const book = m[1].trim(), ch = m[2], spec = m[3].trim();
  const code = BOOK[book];
  if (!code) throw new Error('unknown book: ' + book + '  (ref ' + ref + ')');
  const data = loadCh(code, ch);
  const nums = [];
  for (const part of spec.split(',')) {
    const r = part.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!r) throw new Error('bad verse spec: ' + part);
    const a = +r[1], b = r[2] ? +r[2] : a;
    for (let v = a; v <= b; v++) nums.push(String(v));
  }
  return nums.map((n) => { if (!(n in data)) throw new Error('missing verse ' + code + '/' + ch + ':' + n); return data[n]; }).join(' ');
}

// The 8 intentional excerpts, pinned to an EXACT expected range (verbatim WEB words).
export const EXCERPTS = new Map([
  ['qaEngine|Matthew 28:20',        'Behold, I am with you always, even to the end of the age.'],
  ['qaEngine|Psalm 46:1',           'God is our refuge and strength, a very present help in trouble.'],
  ['prayerEngine|Psalm 46:1',       'God is our refuge and strength, a very present help in trouble.'],
  ['prayerEngine|Psalm 139:1',      'LORD, you have searched me, and you know me.'],
  ['prayerEngine|James 5:16',       'The insistent prayer of a righteous person is powerfully effective.'],
  ['bibleRegistry|Job 1:21',        'The LORD gave, and the LORD has taken away. Blessed be the LORD’s name.'],
  ['bibleRegistry|Matthew 4:17',    'Repent! For the Kingdom of Heaven is at hand.'],
  ['bibleRegistry|Revelation 21:5', 'Behold, I am making all things new.'],
]);

// Direct-speech entries must keep these exact inner-quote anchors (open + close).
export const INNER_QUOTES = new Map([
  ['qaEngine|John 4:13-14',    ['‘Everyone who drinks', 'eternal life.’']],
  ['qaEngine|John 14:6',       ['‘I am the way', 'except through me.’']],
  ['qaEngine|John 11:25',      ['‘I am the resurrection', 'even if he dies.’']],
  ['qaEngine|John 8:12',       ['‘I am the light of the world', 'the light of life.’']],
  ['qaEngine|Matthew 18:21-22',['‘Lord, how often', 'Until seven times?’', '‘I don’t tell you', 'seventy times seven.’']],
]);

export const keyOf = (e) => e.where.split(' ')[0] + '|' + e.ref;

// Throws with a descriptive message if the entry does not faithfully render the corpus.
export function checkEntry(e) {
  const key = keyOf(e);
  const corpusWords = words(corpusFor(e.ref));
  const entryWords = words(e.text);
  if (!entryWords.length) throw new Error(`empty entry: ${key}`);

  if (EXCERPTS.has(key)) {
    const expected = EXCERPTS.get(key);
    const expWords = words(expected);
    if (!isContiguousSub(expWords, corpusWords)) throw new Error(`pinned excerpt is not a corpus word-run: ${key}`);
    if (!arrEq(entryWords, expWords)) throw new Error(`excerpt does not match its pinned range (${key}): "${e.text.trim()}"`);
  } else {
    if (!arrEq(entryWords, corpusWords)) throw new Error(`full verse does not match corpus word-for-word (${key}): "${e.text.trim()}"`);
  }

  if (INNER_QUOTES.has(key)) {
    for (const anchor of INNER_QUOTES.get(key)) {
      if (!e.text.includes(anchor)) throw new Error(`missing internal speech quote "${anchor}" in ${key}`);
    }
  }
  return true;
}

// Extract { ref, text, where } entries from the three data files.
export function collectEntries() {
  const out = [];
  const qa = fs.readFileSync(path.join(ROOT, 'data/qaEngine.js'), 'utf8');
  for (const m of qa.matchAll(/【([ -~][^】]*)】([\s\S]*?)\(WEB\)/g))
    out.push({ ref: m[1].trim(), text: m[2], where: 'qaEngine 【' + m[1].trim() + '】' });
  const pe = fs.readFileSync(path.join(ROOT, 'data/prayerEngine.js'), 'utf8');
  for (const m of pe.matchAll(/scripture:\s*'([A-Z0-9][^—']*?)\s+—\s+([\s\S]*?)'\s*,/g))
    out.push({ ref: m[1].trim(), text: m[2], where: 'prayerEngine ' + m[1].trim() });
  const br = fs.readFileSync(path.join(ROOT, 'data/bibleRegistry.js'), 'utf8');
  for (const m of br.matchAll(/en:\s*\{\s*reference:\s*'([^']+)',\s*text:\s*'([\s\S]*?)'\s*\}/g))
    out.push({ ref: m[1].trim(), text: m[2], where: 'bibleRegistry ' + m[1].trim() });
  return out;
}

// Run as a script → report.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const entries = collectEntries();
  let ok = 0; const fails = [];
  for (const e of entries) {
    try { checkEntry(e); ok++; } catch (err) { fails.push({ e, msg: err.message }); }
  }
  const excerptsSeen = entries.filter((e) => EXCERPTS.has(keyOf(e))).length;
  console.log(`Checked ${entries.length} English Scripture entries → ${ok} OK, ${fails.length} FAIL  (excerpts pinned: ${EXCERPTS.size}, seen: ${excerptsSeen})`);
  for (const f of fails) console.log('\nFAIL:', f.e.where, '\n  ' + f.msg);
  process.exit(fails.length ? 1 : 0);
}
