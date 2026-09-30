// Verifies worship-track Scripture is VERBATIM vs the trusted corpus, from the
// STRUCTURED reference (book/ch/from/to) — never by parsing display text:
//   zh — worker/scripture-assets/zh/<BOOK>/<ch>.json (新标点和合本，简体)
//   en — worker/scripture-assets/en/<BOOK>/<ch>.json (World English Bible, WEB)
//
// It ALSO locks each card to an INDEPENDENT expected manifest (EXPECTED_MANIFEST),
// so a card cannot be dropped, reordered, duplicated, or re-mapped to another verse
// without failing — the per-track verbatim check alone cannot catch that (e.g. swapping
// a card's ref to John 1:14 is still "verbatim", but the manifest says it must be 4:14).
//
// Only structured `scripture` fields are Scripture. Editorial `connection` and legacy
// `scriptureConnection` (Psalms thematic pairings, not-yet-migrated books) are excluded.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(dir, '..');
const corpus = (lang, book, ch) =>
  JSON.parse(fs.readFileSync(path.join(ROOT, 'worker/scripture-assets', lang, book, ch + '.json'), 'utf8'));

// ── Independent expected card manifest (id + reference), authored here, NOT derived
//    from the data file being checked. Order matters and ids must match one-to-one. ──
// Each entry is either a Scripture card ({ id, book, ch, from, to } or { id, refs:[…] }
// for NON-CONTIGUOUS verses) or an editorial-only card ({ id, editorial: true }). Every
// card of a migrated dataset — including editorial-only ones — must be listed here.
export const EXPECTED_MANIFEST = {
  john: [
    { id: 'word-made-flesh',   book: 'JHN', ch: 1,  from: 14, to: 14 },
    { id: 'light-of-life',     book: 'JHN', ch: 8,  from: 12, to: 12 },
    { id: 'living-water',      book: 'JHN', ch: 4,  from: 14, to: 14 },
    { id: 'bread-of-life',     book: 'JHN', ch: 6,  from: 35, to: 35 },
    { id: 'good-shepherd',     book: 'JHN', ch: 10, from: 11, to: 11 },
    { id: 'resurrection-life', book: 'JHN', ch: 11, from: 25, to: 25 },
    { id: 'way-truth-life',    book: 'JHN', ch: 14, from: 6,  to: 6  },
    { id: 'abiding',           book: 'JHN', ch: 15, from: 4,  to: 4  },
    { id: 'the-cross',         book: 'JHN', ch: 19, from: 30, to: 30 },
    { id: 'eternal-life',      book: 'JHN', ch: 3,  from: 16, to: 16 },
  ],
  ecclesiastes: [
    { id: 'turn-eyes',         book: 'ECC', ch: 2,  from: 11, to: 11 },
    { id: 'found-by-grace',    editorial: true },
    // 3:1 and 3:4 are NON-CONTIGUOUS — two separate refs, never a 3:1-4 range.
    { id: 'peace-in-sorrow',   refs: [{ book: 'ECC', ch: 3, from: 1, to: 1 }, { book: 'ECC', ch: 3, from: 4, to: 4 }] },
    { id: 'unchanging-refuge', editorial: true },
    { id: 'strength-in-christ', editorial: true },
  ],
  revelation: [
    { id: 'throne',            book: 'REV', ch: 4,  from: 8,  to: 8  },
    { id: 'holy',              book: 'REV', ch: 4,  from: 8,  to: 8  },
    { id: 'worthy-lamb',       book: 'REV', ch: 5,  from: 9,  to: 9  },
    { id: 'king-of-kings',     book: 'REV', ch: 19, from: 16, to: 16 },
    { id: 'victory',           book: 'REV', ch: 12, from: 11, to: 11 },
    { id: 'all-new',           book: 'REV', ch: 21, from: 5,  to: 5  },
    { id: 'god-with-us',       book: 'REV', ch: 21, from: 4,  to: 4  },
    // 22:17 and 22:20 are NON-CONTIGUOUS — two separate refs, never a 22:17-20 range.
    { id: 'come-lord-jesus',   refs: [{ book: 'REV', ch: 22, from: 17, to: 17 }, { book: 'REV', ch: 22, from: 20, to: 20 }] },
  ],
};

// Normalize a manifest entry to { editorial, refs[] }.
const expandExpected = (ex) => ex.editorial
  ? { editorial: true, refs: [] }
  : { editorial: false, refs: ex.refs || [{ book: ex.book, ch: ex.ch, from: ex.from, to: ex.to }] };

// Datasets whose Scripture has been migrated to the structured/verbatim shape.
export const MIGRATED = Object.keys(EXPECTED_MANIFEST);

function corpusText(lang, s) {
  const json = corpus(lang, s.book, String(s.ch));
  const parts = [];
  for (let v = s.from; v <= s.to; v++) {
    if (!(String(v) in json)) throw new Error(`corpus has no ${s.book} ${s.ch}:${v} (${lang})`);
    parts.push(String(json[String(v)]).trim());
  }
  return parts.join(' ');
}

export function verifyWorshipTrackScripture(s, label) {
  const errors = [];
  for (const f of ['book', 'ch', 'from', 'to']) if (s[f] == null) errors.push(`${label}: scripture.${f} missing`);
  if (!Number.isInteger(s.ch) || !Number.isInteger(s.from) || !Number.isInteger(s.to)) errors.push(`${label}: ch/from/to must be integers`);
  if (Number.isInteger(s.from) && Number.isInteger(s.to) && s.to < s.from) errors.push(`${label}: to (${s.to}) < from (${s.from})`);
  if (errors.length) return errors;
  for (const lang of ['zh', 'en']) {
    const stored = String((lang === 'zh' ? s.zh : s.en) ?? '');
    if (!stored.trim()) { errors.push(`${label}: empty ${lang} scripture`); continue; }
    let expected;
    try { expected = corpusText(lang, s); } catch (e) { errors.push(`${label}: ${e.message}`); continue; }
    if (stored !== expected) errors.push(`${label} ${s.book} ${s.ch}:${s.from}${s.to > s.from ? '-' + s.to : ''} ${lang.toUpperCase()} not verbatim vs corpus:\n    got:    ${JSON.stringify(stored)}\n    corpus: ${JSON.stringify(expected)}`);
  }
  return errors;
}

const sameRef = (a, b) => a.book === b.book && a.ch === b.ch && a.from === b.from && a.to === b.to;

/**
 * Verify a worship dataset. When an EXPECTED_MANIFEST exists for data.id (a migrated
 * book), the cards are locked to it: exact count, ids one-to-one in order (no missing /
 * extra / reordered / duplicate), and each card's structured ref === the expected ref;
 * then each Scripture is checked verbatim vs corpus.
 *   opts.requireAll = true → a migrated dataset MUST have a manifest.
 */
export function verifyWorshipDataset(data, opts = {}) {
  const errors = [];
  const tracks = (data && data.tracks) || [];
  if (!tracks.length) { errors.push(`${data && data.id}: no tracks`); return errors; }
  const expected = EXPECTED_MANIFEST[data && data.id];

  if (!expected) {
    if (opts.requireAll) errors.push(`${data.id}: migrated dataset has no expected manifest`);
    // legacy/thematic dataset: only sanity-check any structured scripture present.
    tracks.forEach((tk, i) => { if (tk.scripture) errors.push(...verifyWorshipTrackScripture(tk.scripture, `${data.id} track#${i + 1}`)); });
    return errors;
  }

  if (tracks.length !== expected.length) errors.push(`${data.id}: ${tracks.length} cards, expected ${expected.length}`);
  const ids = tracks.map((t) => t.id);
  if (new Set(ids).size !== ids.length) errors.push(`${data.id}: duplicate card id(s): ${ids.filter((v, i) => ids.indexOf(v) !== i).join(', ')}`);

  expected.forEach((exRaw, i) => {
    const ex = expandExpected(exRaw);
    const tk = tracks[i];
    const label = `${data.id} card#${i + 1} (${exRaw.id})`;
    if (!tk) { errors.push(`${label}: missing card`); return; }
    if (tk.id !== exRaw.id) errors.push(`${data.id} card#${i + 1}: id "${tk.id}" != expected "${exRaw.id}" (missing/reordered card)`);
    const trackRefs = Array.isArray(tk.scripture) ? tk.scripture : (tk.scripture ? [tk.scripture] : []);

    if (ex.editorial) {
      if (trackRefs.length) errors.push(`${label}: registered as editorial-only but carries Scripture`);
      if (!String(tk.connectionZh || '').trim() || !String(tk.connectionEn || '').trim())
        errors.push(`${label}: editorial-only card must have connectionZh + connectionEn`);
      return;
    }

    if (trackRefs.length !== ex.refs.length) {
      errors.push(`${label}: ${trackRefs.length} scripture ref(s), expected ${ex.refs.length} (non-contiguous verses must be separate refs, not a range)`);
    }
    ex.refs.forEach((exRef, j) => {
      const s = trackRefs[j];
      if (!s) { errors.push(`${label}: missing scripture ref #${j + 1} (${exRef.book} ${exRef.ch}:${exRef.from}-${exRef.to})`); return; }
      if (!sameRef(s, exRef)) {
        errors.push(`${label} ref#${j + 1}: ${s.book} ${s.ch}:${s.from}-${s.to} != expected ${exRef.book} ${exRef.ch}:${exRef.from}-${exRef.to} (mis-mapped)`);
      }
      errors.push(...verifyWorshipTrackScripture(s, `${label} ref#${j + 1}`));
    });
  });
  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const loaders = {
    john: async () => (await import('../data/worship/johnWorship.js')).johnWorship,
    ecclesiastes: async () => (await import('../data/worship/ecclesiastesWorship.js')).ecclesiastesWorship,
    revelation: async () => (await import('../data/worship/revelationWorship.js')).revelationWorship,
  };
  let problems = 0;
  for (const id of MIGRATED) {
    const data = await loaders[id]();
    const errors = verifyWorshipDataset(data, { requireAll: true });
    if (errors.length === 0) console.log(`Worship ${id}: OK — ${data.tracks.length} cards locked to manifest, all Scripture verbatim vs corpus (zh 和合本 / en WEB)`);
    else { problems += errors.length; console.log(`Worship ${id}: ${errors.length} problem(s):`); for (const e of errors) console.log('  - ' + e); }
  }
  console.log(problems === 0 ? '\nWorship Scripture: all checks passed.' : `\nWorship Scripture: ${problems} problem(s).`);
  process.exit(problems === 0 ? 0 : 1);
}
