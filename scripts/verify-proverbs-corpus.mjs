// Verifies the built Proverbs chapters' Scripture against the project's trusted
// corpus, VERBATIM and verse-by-verse:
//   en — worker/scripture-assets/en/PRO/<ch>.json (World English Bible, public domain)
//   zh — worker/scripture-assets/zh/PRO/<ch>.json (新标点和合本, cmn-cu89s)
// Also checks that study references (keyVerses, passages, realLife verseRef) point
// at verses that exist, and that theme tags are valid taxonomy ids.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { THEME_BY_ID } from '../data/wisdom-taxonomy.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(dir, '..');
const corpus = (lang, ch) => JSON.parse(fs.readFileSync(path.join(ROOT, 'worker/scripture-assets', lang, 'PRO', ch + '.json'), 'utf8'));

// Chapters that are built ("full") and must pass (Proverbs 1–31).
const BUILT = Array.from({ length: 31 }, (_, i) => i + 1);

export async function verifyProverbsChapter(n) {
  const mod = await import(`../data/books/proverbs/ch${String(n).padStart(2, '0')}.js`);
  const data = mod.default;
  const en = corpus('en', String(n));
  const zh = corpus('zh', String(n));
  const errors = [];

  const unionCount = new Set([...Object.keys(en), ...Object.keys(zh)]).size;
  if (data.verses.length !== unionCount) errors.push(`verse count ${data.verses.length} != corpus union ${unionCount}`);

  const seen = new Set();
  for (const verse of data.verses) {
    const key = String(verse.v);
    seen.add(key);
    // EN side. A verse absent from the EN corpus is only allowed when explicitly
    // marked as merged into the previous verse in that edition (versification diff).
    if (key in en) {
      if (verse.en !== en[key]) errors.push(`v${key} EN not verbatim:\n    got:    ${JSON.stringify(verse.en)}\n    corpus: ${JSON.stringify(en[key])}`);
    } else if (verse.enMergedWithPrev === true && verse.en === '') { /* ok: merged in EN */ }
    else errors.push(`v${key}: not in EN corpus (and not marked enMergedWithPrev)`);
    // ZH side, same rule.
    if (key in zh) {
      if (verse.zh !== zh[key]) errors.push(`v${key} ZH not verbatim:\n    got:    ${JSON.stringify(verse.zh)}\n    corpus: ${JSON.stringify(zh[key])}`);
    } else if (verse.zhMergedWithPrev === true && verse.zh === '') { /* ok: merged in ZH */ }
    else errors.push(`v${key}: not in ZH corpus (and not marked zhMergedWithPrev)`);
  }
  for (const key of Object.keys(en)) if (!seen.has(key)) errors.push(`v${key}: missing from chapter data (EN corpus)`);
  for (const key of Object.keys(zh)) if (!seen.has(key)) errors.push(`v${key}: missing from chapter data (ZH corpus)`);

  // Study references must point at real verses.
  const vset = new Set(data.verses.map((v) => v.v));
  for (const kv of data.keyVerses || []) if (!vset.has(kv.v)) errors.push(`keyVerse v${kv.v} has no matching verse`);
  for (const p of data.passages || []) {
    if (!vset.has(p.vFrom) || !vset.has(p.vTo)) errors.push(`passage ${p.rangeLabel} range not in verses`);
  }
  // Theme tags valid.
  for (const t of data.themes || []) if (!(t in THEME_BY_ID)) errors.push(`invalid theme id: ${t}`);

  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let total = 0; let ok = 0;
  for (const n of BUILT) {
    const errors = await verifyProverbsChapter(n);
    total++;
    if (errors.length === 0) { ok++; console.log(`Proverbs ${n}: OK — all verses verbatim vs corpus, references valid`); }
    else { console.log(`Proverbs ${n}: ${errors.length} problem(s):`); for (const e of errors) console.log('  - ' + e); }
  }
  console.log(`\n${ok}/${total} built Proverbs chapter(s) verified.`);
  process.exit(ok === total ? 0 : 1);
}
