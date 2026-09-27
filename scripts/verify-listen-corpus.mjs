// Verifies the English Scripture on the two listen pages (john-listen.html,
// listen.html) against the project's trusted WEB corpus.
//
// Each entry is pinned to an EXACT expected English string. The verifier checks:
//   * content: the page's English matches the pinned text word-for-word
//     (so truncation and run-together words are caught, word boundaries kept);
//   * authenticity: every "…"-separated segment of the pinned text is a
//     CONTIGUOUS run of the cited corpus verse(s), appearing in corpus order
//     (so nothing is reworded into an NIV-style paraphrase, and excerpts are
//     genuine continuous slices with a recorded range);
//   * quotes: direct-speech entries keep their inner speech quotes.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { corpusFor, words } from './verify-web-corpus.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(dir, '..');
const CORPUS = path.join(ROOT, 'worker/scripture-assets/en');
const BOOK = { John: 'JHN', Ecclesiastes: 'ECC' }; // only books used by the listen pages
const arrEq = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

// The cited verses of a ref (e.g. "Ecclesiastes 3:1,11"), each as its own string.
function versesFor(ref) {
  const m = ref.match(/^([A-Za-z]+)\s+(\d+):(.+)$/);
  const code = BOOK[m[1]]; const ch = m[2]; const spec = m[3].trim();
  const data = JSON.parse(fs.readFileSync(path.join(CORPUS, code, ch + '.json'), 'utf8'));
  const out = [];
  for (const part of spec.split(',')) {
    const r = part.trim().match(/^(\d+)(?:-(\d+))?$/);
    const a = +r[1]; const b = r[2] ? +r[2] : a;
    for (let v = a; v <= b; v++) out.push(data[String(v)]);
  }
  return out;
}
// Flattened corpus words for a ref, plus the word indices where one cited verse
// ends and the next begins (so an internal … between two cited verses is allowed).
function refWordInfo(ref) {
  const cw = []; const boundaries = new Set(); const verses = versesFor(ref);
  verses.forEach((v, i) => { for (const w of words(v)) cw.push(w); if (i < verses.length - 1) boundaries.add(cw.length); });
  return { cw, boundaries };
}
// returns the start index of the match at/after `from` (or, by default, the index
// just past it), or -1 if `sub` is not a contiguous run of `arr` at/after `from`.
const contiguousAt = (sub, arr, from, returnStart = false) => {
  for (let i = from; i + sub.length <= arr.length; i++) if (arrEq(sub, arr.slice(i, i + sub.length))) return returnStart ? i : i + sub.length;
  return -1;
};

// ref -> exact expected English (… = U+2026 marks a gap between contiguous corpus segments).
export const PINS = new Map([
  ['John 1:14', 'The Word became flesh and lived among us. We saw his glory, such glory as of the only born Son of the Father, full of grace and truth.'],
  ['John 2:11', 'This beginning of his signs Jesus did in Cana of Galilee, and revealed his glory; and his disciples believed in him.'],
  ['John 3:16', 'For God so loved the world, that he gave his only born Son, that whoever believes in him should not perish, but have eternal life.'],
  ['John 4:14', '…whoever drinks of the water that I will give him will never thirst again…'],
  ['John 5:24', '…he who hears my word and believes him who sent me has eternal life, and doesn’t come into judgment, but has passed out of death into life.'],
  ['John 6:35', '…I am the bread of life. Whoever comes to me will not be hungry, and whoever believes in me will never be thirsty.'],
  ['John 7:38', 'He who believes in me, as the Scripture has said, from within him will flow rivers of living water.'],
  ['John 8:12', '…I am the light of the world. He who follows me will not walk in the darkness, but will have the light of life.'],
  ['John 9:25', '…One thing I do know: that though I was blind, now I see.'],
  ['John 10:11', 'I am the good shepherd. The good shepherd lays down his life for the sheep.'],
  ['John 11:25', '…I am the resurrection and the life. He who believes in me will still live, even if he dies.'],
  ['John 12:24', 'Most certainly I tell you, unless a grain of wheat falls into the earth and dies, it remains by itself alone. But if it dies, it bears much fruit.'],
  ['John 13:34', 'A new commandment I give to you, that you love one another. Just as I have loved you, you also love one another.'],
  ['John 14:6', '…I am the way, the truth, and the life. No one comes to the Father, except through me.'],
  ['John 15:5', 'I am the vine. You are the branches. He who remains in me and I in him bears much fruit, for apart from me you can do nothing.'],
  ['John 16:33', 'I have told you these things, that in me you may have peace. In the world you have trouble; but cheer up! I have overcome the world.'],
  ['John 17:3', 'This is eternal life, that they should know you, the only true God, and him whom you sent, Jesus Christ.'],
  ['John 18:37', '…For this reason I have been born, and for this reason I have come into the world, that I should testify to the truth…'],
  ['John 19:30', 'When Jesus therefore had received the vinegar, he said, ‘It is finished!’ Then he bowed his head and gave up his spirit.'],
  ['John 20:29', '…Blessed are those who have not seen and have believed.'],
  ['John 21:17', '…Lord, you know everything. You know that I have affection for you…'],
  ['Ecclesiastes 1:14', 'I have seen all the works that are done under the sun; and behold, all is vanity and a chasing after wind.'],
  ['Ecclesiastes 2:11', 'Then I looked at all the works that my hands had worked, and at the labor that I had labored to do; and behold, all was vanity and a chasing after wind, and there was no profit under the sun.'],
  ['Ecclesiastes 3:1,11', 'For everything there is a season, and a time for every purpose under heaven… He has made everything beautiful in its time. He has also set eternity in their hearts…'],
  ['Ecclesiastes 4:9', 'Two are better than one, because they have a good reward for their labor.'],
  ['Ecclesiastes 5:10', 'He who loves silver shall not be satisfied with silver, nor he who loves abundance, with increase. This also is vanity.'],
  ['Ecclesiastes 6:9', 'Better is the sight of the eyes than the wandering of the desire. This also is vanity and a chasing after wind.'],
  ['Ecclesiastes 7:2', 'It is better to go to the house of mourning than to go to the house of feasting; for that is the end of all men, and the living should take this to heart.'],
  ['Ecclesiastes 8:17', '…man can’t find out the work that is done under the sun…'],
  ['Ecclesiastes 9:5,7', '…Go your way—eat your bread with joy, and drink your wine with a merry heart; for God has already accepted your works.'],
  ['Ecclesiastes 10:12', 'The words of a wise man’s mouth are gracious; but a fool is swallowed by his own lips.'],
  ['Ecclesiastes 11:1', 'Cast your bread on the waters; for you shall find it after many days.'],
  ['Ecclesiastes 12:1,13', 'Remember also your Creator in the days of your youth… Fear God and keep his commandments; for this is the whole duty of man.'],
]);

// Direct-speech entries that must keep an inner speech quote.
export const INNER_QUOTES = new Map([
  ['John 19:30', ['‘It is finished!’']],
]);

const FILES = { 'john-listen.html': 'John ', 'listen.html': 'Ecclesiastes ' };

export function collectListen() {
  const out = [];
  for (const file of Object.keys(FILES)) {
    const s = fs.readFileSync(path.join(ROOT, file), 'utf8');
    for (const m of s.matchAll(/core:\{ref:'[^']*·\s*([^']+)',\s*zh:'[^']*',\s*en:'([\s\S]*?)'\s*\}/g)) {
      const ref = m[1].trim();
      const raw = m[2];
      const inner = raw.replace(/^[\s“”"]+|[\s“”"]+$/g, ''); // strip outer display quotes
      out.push({ ref, raw, inner, file });
    }
  }
  return out;
}

// Ellipsis-aware segmentation: split on … (U+2026) and keep every part (including
// the empty parts a leading/trailing … produces), each reduced to its word string.
// Two texts compare equal ONLY if they have the same ellipsis count, the same
// leading/trailing markers, and the same words in each segment. So deleting or
// adding a … changes the segment shape and fails the comparison.
const segShape = (t) => t.split('…').map((p) => words(p).join(' '));

// Verify a pinned expected string is genuinely built from contiguous corpus runs,
// and that its …-markers correspond to real omissions:
//   * every non-empty segment is a contiguous corpus run, in corpus order;
//   * a leading … <=> the first segment does not start at the verse start;
//   * a trailing … <=> the last segment does not reach the verse end;
//   * an internal … between two segments <=> corpus text is skipped there
//     (they are not directly adjacent in the corpus).
export function pinIsAuthentic(ref, expected) {
  const { cw, boundaries } = refWordInfo(ref);
  const parts = expected.split('…');
  const leading = parts[0].trim() === '';
  const trailing = parts[parts.length - 1].trim() === '';
  const segs = parts.map((p) => p.trim()).filter(Boolean);
  if (!segs.length) return false;
  let pos = 0; let firstStart = -1; let lastEnd = -1; let prevEnd = -1;
  for (let i = 0; i < segs.length; i++) {
    const sw = words(segs[i]);
    const start = contiguousAt(sw, cw, pos, true); // start index of this contiguous run
    if (start < 0) return false;
    const end = start + sw.length;
    if (i === 0) firstStart = start;
    // an internal … must skip ≥1 corpus word, OR sit exactly on a cited-verse boundary
    // (e.g. "3:1,11" quotes v1 then v11 — adjacent in the cited text but verses apart).
    if (i > 0 && !(start > prevEnd || boundaries.has(prevEnd))) return false;
    lastEnd = end; pos = end; prevEnd = end;
  }
  if (leading !== (firstStart > 0)) return false;       // leading marker must match a real leading omission
  if (trailing !== (lastEnd < cw.length)) return false; // trailing marker must match a real trailing omission
  return true;
}

export function checkListenEntry(e) {
  const pin = PINS.get(e.ref);
  if (!pin) throw new Error(`no pin for ${e.file} ${e.ref}`);
  if (!pinIsAuthentic(e.ref, pin)) throw new Error(`pin for ${e.ref} is not a faithful, correctly-marked corpus excerpt`);
  if (!arrEq(segShape(e.inner), segShape(pin))) throw new Error(`listen entry does not match pinned WEB text / excerpt markers (${e.file} ${e.ref}): "${e.inner}"`);
  for (const anchor of INNER_QUOTES.get(e.ref) || []) {
    if (!e.raw.includes(anchor)) throw new Error(`missing internal speech quote "${anchor}" in ${e.file} ${e.ref}`);
  }
  return true;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--pins')) {
    let ok = 0; const bad = [];
    for (const [ref, exp] of PINS) { if (pinIsAuthentic(ref, exp)) ok++; else bad.push(ref); }
    console.log(`Pins validated against corpus: ${ok}/${PINS.size} OK`);
    for (const r of bad) console.log('  BAD PIN:', r);
    process.exit(bad.length ? 1 : 0);
  }
  const entries = collectListen();
  let ok = 0; const fails = [];
  for (const e of entries) { try { checkListenEntry(e); ok++; } catch (err) { fails.push({ e, msg: err.message }); } }
  console.log(`Checked ${entries.length} listen-page English entries → ${ok} OK, ${fails.length} FAIL  (pins: ${PINS.size})`);
  for (const f of fails) console.log('\nFAIL:', f.e.file, f.e.ref, '\n  ' + f.msg);
  process.exit(fails.length || entries.length !== PINS.size ? 1 : 0);
}
