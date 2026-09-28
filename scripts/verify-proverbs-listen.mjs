// Verifies Proverbs Listen sessions' Scripture is VERBATIM vs the trusted corpus,
// independently of the chapter modules:
//   en — worker/scripture-assets/en/PRO/<ch>.json (World English Bible, public domain)
//   zh — worker/scripture-assets/zh/PRO/<ch>.json (新标点和合本, cmn-cu89s)
// For each selected ref it rebuilds the expected text straight from the corpus
// (applying the same Chinese-merge rule) and compares it to what the player's
// resolveScripture() produces from the chapter data. Spoken labels and references
// are navigation speech and are NOT compared. Also exercises the merged-verse
// boundaries (23:31–32, 26:18–19) with an exact bilingual corpus comparison — not a
// substring check — and prints an estimated listen duration.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { proverbsListen } from '../data/listen/proverbsListen.js';
import { resolveScripture, buildSegments, parseRef } from '../components/listenPlayer.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(dir, '..');
const corpus = (lang, ch) => JSON.parse(fs.readFileSync(path.join(ROOT, 'worker/scripture-assets', lang, 'PRO', ch + '.json'), 'utf8'));
const loadChapter = async (n) => (await import(`../data/books/proverbs/ch${String(n).padStart(2, '0')}.js`)).default;

// Rebuild the expected verse group straight from the corpus, mirroring the merge rule:
// a zh-merged verse is absent from the zh corpus (its text sits on the anchor), so we
// pull the start back to the anchor and extend the end across trailing merged verses.
function corpusGroup(enJson, zhJson, from, to) {
  let lo = from, hi = to;
  while (!(String(lo) in zhJson) && lo > 1) lo--;
  while ((String(hi + 1) in enJson) && !(String(hi + 1) in zhJson)) hi++;
  const zhParts = [], enParts = [];
  for (let n = lo; n <= hi; n++) {
    if (String(n) in zhJson) zhParts.push(String(zhJson[String(n)]).trim());
    if (String(n) in enJson) enParts.push(String(enJson[String(n)]).trim());
  }
  return { zh: zhParts.join(' '), en: enParts.join(' '), lo, hi };
}

function estimateSeconds(session, chData) {
  const out = {};
  for (const lang of ['zh', 'en']) {
    const segs = buildSegments(session, chData, lang);
    let sec = 0;
    for (const s of segs) {
      if (lang === 'zh') {
        const chars = (s.text.match(/[一-鿿]/g) || []).length;
        sec += chars / 4.0;           // ~4 Chinese chars/sec at rate 1.0
      } else {
        const words = s.text.trim().split(/\s+/).filter(Boolean).length;
        sec += words / 2.6;           // ~156 words/min
      }
      sec += 0.35;                    // inter-segment gap
    }
    out[lang] = Math.round(sec);
  }
  return out;
}

export async function verifyListenSession(session) {
  const errors = [];
  const chData = await loadChapter(session.n);
  const enJson = corpus('en', String(session.n));
  const zhJson = corpus('zh', String(session.n));

  // Session-level validity: overlapping/duplicate refs (which after merge-expansion would
  // read the same Scripture twice) must be rejected, not silently accepted.
  try {
    resolveScripture(chData, (session.scripture || []).map((s) => s.ref));
  } catch (e) {
    errors.push(`ch${session.n} invalid scripture selection: ${e.message}`);
  }

  for (const item of (session.scripture || [])) {
    let pr;
    try { pr = parseRef(item.ref); } catch (e) { errors.push(`ch${session.n} bad ref ${item.ref}: ${e.message}`); continue; }
    if (pr.ch !== session.n) { errors.push(`ch${session.n} ref ${item.ref} is not in this chapter`); continue; }
    const [resolved] = resolveScripture(chData, [item.ref]);
    const exp = corpusGroup(enJson, zhJson, pr.from, pr.to);
    if (!resolved.zh.trim()) errors.push(`ch${session.n} ${item.ref}: empty ZH after resolve`);
    if (!resolved.en.trim()) errors.push(`ch${session.n} ${item.ref}: empty EN after resolve`);
    if (resolved.zh !== exp.zh) errors.push(`ch${session.n} ${item.ref} ZH not verbatim vs corpus:\n    got:    ${JSON.stringify(resolved.zh)}\n    corpus: ${JSON.stringify(exp.zh)}`);
    if (resolved.en !== exp.en) errors.push(`ch${session.n} ${item.ref} EN not verbatim vs corpus:\n    got:    ${JSON.stringify(resolved.en)}\n    corpus: ${JSON.stringify(exp.en)}`);
  }

  // Study fields present + bilingual (NOT Scripture, excluded from the corpus check).
  for (const f of ['introZh', 'introEn', 'reflectZh', 'reflectEn', 'prayerZh', 'prayerEn', 'titleZh', 'titleEn']) {
    if (!session[f] || !String(session[f]).trim()) errors.push(`ch${session.n} missing ${f}`);
  }
  return errors;
}

// Independent merge-boundary probe against the corpus (no session needed).
// Every ref form of the unit is compared EXACTLY (===) with the text rebuilt from the
// corpus in BOTH languages — a substring/"includes" check would pass on a group that
// silently gained, lost or reordered a neighbouring verse at the boundary.
export async function verifyMergeBoundary(n, mergeRefs, mergedVerse) {
  const errors = [];
  const chData = await loadChapter(n);
  const zhJson = corpus('zh', String(n));
  const enJson = corpus('en', String(n));
  // The Chinese corpus must NOT contain the merged verse key (it lives on the anchor).
  if (String(mergedVerse) in zhJson) errors.push(`ch${n}: expected zh corpus to omit v${mergedVerse} (merged), but it is present`);
  // Selecting the whole unit, the merged verse alone, or the anchor alone must all
  // yield the SAME zh (combined, read once) and the SAME en (both verses).
  const outputs = mergeRefs.map((r) => resolveScripture(chData, [r])[0]);
  const zhSet = new Set(outputs.map((o) => o.zh));
  const enSet = new Set(outputs.map((o) => o.en));
  if (zhSet.size !== 1) errors.push(`ch${n}: merged-unit ZH differs across ${mergeRefs.join(', ')} → ${[...zhSet].map((x) => JSON.stringify(x)).join(' | ')}`);
  if (enSet.size !== 1) errors.push(`ch${n}: merged-unit EN differs across ${mergeRefs.join(', ')}`);
  const zh = outputs[0].zh;
  if (!zh || !zh.trim()) errors.push(`ch${n}: merged-unit ZH is empty`);
  // Exact bilingual corpus comparison, per ref form, including the unit's boundaries.
  mergeRefs.forEach((ref, i) => {
    const out = outputs[i];
    const pr = parseRef(ref);
    const exp = corpusGroup(enJson, zhJson, pr.from, pr.to);
    if (out.from !== exp.lo || out.to !== exp.hi) {
      errors.push(`ch${n} ${ref}: merged unit resolved to ${out.from}-${out.to}, corpus merge rule gives ${exp.lo}-${exp.hi}`);
    }
    if (out.zh !== exp.zh) errors.push(`ch${n} ${ref} ZH not verbatim vs corpus:\n    got:    ${JSON.stringify(out.zh)}\n    corpus: ${JSON.stringify(exp.zh)}`);
    if (out.en !== exp.en) errors.push(`ch${n} ${ref} EN not verbatim vs corpus:\n    got:    ${JSON.stringify(out.en)}\n    corpus: ${JSON.stringify(exp.en)}`);
  });
  // The verse just outside the unit must NOT be pulled in (boundary must not creep).
  for (const outside of [outputs[0].from - 1, outputs[0].to + 1]) {
    const neighbour = enJson[String(outside)] && String(enJson[String(outside)]).trim();
    if (neighbour && outputs[0].en.includes(neighbour)) errors.push(`ch${n}: merged-unit EN wrongly includes v${outside} (outside the unit)`);
    const neighbourZh = zhJson[String(outside)] && String(zhJson[String(outside)]).trim();
    if (neighbourZh && outputs[0].zh.includes(neighbourZh)) errors.push(`ch${n}: merged-unit ZH wrongly includes v${outside} (outside the unit)`);
  }
  // No duplication: the anchor's zh appears exactly once.
  const anchorZh = zhJson[String(outputs[0].from)];
  if (anchorZh && zh.split(anchorZh).length - 1 !== 1) errors.push(`ch${n}: merged ZH anchor text should appear exactly once`);
  // EN must include the merged verse's own text (not dropped).
  if (enJson[String(mergedVerse)] && !outputs[0].en.includes(String(enJson[String(mergedVerse)]).trim()))
    errors.push(`ch${n}: merged-unit EN omits v${mergedVerse}`);
  return errors;
}

// The merged units of Proverbs in 和合本 that Phase A must keep honest.
export const MERGE_BOUNDARIES = [
  { n: 23, refs: ['23:31-32', '23:32', '23:31'], merged: 32 },
  { n: 26, refs: ['26:18-19', '26:19', '26:18'], merged: 19 },
];

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let problems = 0;
  for (const session of proverbsListen.sessions) {
    const errors = await verifyListenSession(session);
    if (errors.length === 0) {
      const chData = await loadChapter(session.n);
      const est = estimateSeconds(session, chData);
      console.log(`Proverbs Listen ${session.n}: OK — Scripture verbatim vs corpus; est. duration zh ~${est.zh}s / en ~${est.en}s (rate 1.0, estimate)`);
    } else {
      problems += errors.length;
      console.log(`Proverbs Listen ${session.n}: ${errors.length} problem(s):`);
      for (const e of errors) console.log('  - ' + e);
    }
  }
  // Boundary probes (run even though 23/26 have no authored session yet).
  for (const b of MERGE_BOUNDARIES) {
    const errors = await verifyMergeBoundary(b.n, b.refs, b.merged);
    if (errors.length === 0) console.log(`Merge boundary ch${b.n} (v${b.merged}): OK — zh + en match the corpus exactly, zh combined once`);
    else { problems += errors.length; console.log(`Merge boundary ch${b.n}: ${errors.length} problem(s):`); for (const e of errors) console.log('  - ' + e); }
  }
  console.log(problems === 0 ? '\nProverbs Listen: all checks passed.' : `\nProverbs Listen: ${problems} problem(s).`);
  process.exit(problems === 0 ? 0 : 1);
}
