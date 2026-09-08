/* ============================================================
   scripture-resolver.js — turn verse references into trusted text
   ------------------------------------------------------------
   The model may choose WHERE to look (book / chapter / verses).
   The words themselves always come from the public-domain corpus
   that loadChapter() serves — never from a model, never from a
   fallback verse, never guessed.

   resolveVerses(selections, lang, loadChapter)
     selections  1–3 × { book: USFM code, chapter, verseStart, verseEnd? }
                 verseEnd is optional and must stay in the same chapter;
                 at most 8 verses per selection.
     lang        'en' → World English Bible (WEB) | 'zh' → 和合本
     loadChapter async (lang, book, chapter) → { "1": "…", "2": "…" }
     returns     [{ ref, version, text }] in the order requested.

   Every problem throws. A reference we cannot verify must fail loudly
   rather than come back as a plausible-looking substitute.
   ============================================================ */

/* The 66-book Protestant canon: USFM code → names + chapter count.
   Chapter counts follow the WEB / 和合本 versification (Joel 3, Malachi 4). */
export const BOOKS = Object.freeze({
  GEN: { en: 'Genesis', zh: '创世记', chapters: 50 },
  EXO: { en: 'Exodus', zh: '出埃及记', chapters: 40 },
  LEV: { en: 'Leviticus', zh: '利未记', chapters: 27 },
  NUM: { en: 'Numbers', zh: '民数记', chapters: 36 },
  DEU: { en: 'Deuteronomy', zh: '申命记', chapters: 34 },
  JOS: { en: 'Joshua', zh: '约书亚记', chapters: 24 },
  JDG: { en: 'Judges', zh: '士师记', chapters: 21 },
  RUT: { en: 'Ruth', zh: '路得记', chapters: 4 },
  '1SA': { en: '1 Samuel', zh: '撒母耳记上', chapters: 31 },
  '2SA': { en: '2 Samuel', zh: '撒母耳记下', chapters: 24 },
  '1KI': { en: '1 Kings', zh: '列王纪上', chapters: 22 },
  '2KI': { en: '2 Kings', zh: '列王纪下', chapters: 25 },
  '1CH': { en: '1 Chronicles', zh: '历代志上', chapters: 29 },
  '2CH': { en: '2 Chronicles', zh: '历代志下', chapters: 36 },
  EZR: { en: 'Ezra', zh: '以斯拉记', chapters: 10 },
  NEH: { en: 'Nehemiah', zh: '尼希米记', chapters: 13 },
  EST: { en: 'Esther', zh: '以斯帖记', chapters: 10 },
  JOB: { en: 'Job', zh: '约伯记', chapters: 42 },
  PSA: { en: 'Psalms', zh: '诗篇', chapters: 150 },
  PRO: { en: 'Proverbs', zh: '箴言', chapters: 31 },
  ECC: { en: 'Ecclesiastes', zh: '传道书', chapters: 12 },
  SNG: { en: 'Song of Solomon', zh: '雅歌', chapters: 8 },
  ISA: { en: 'Isaiah', zh: '以赛亚书', chapters: 66 },
  JER: { en: 'Jeremiah', zh: '耶利米书', chapters: 52 },
  LAM: { en: 'Lamentations', zh: '耶利米哀歌', chapters: 5 },
  EZK: { en: 'Ezekiel', zh: '以西结书', chapters: 48 },
  DAN: { en: 'Daniel', zh: '但以理书', chapters: 12 },
  HOS: { en: 'Hosea', zh: '何西阿书', chapters: 14 },
  JOL: { en: 'Joel', zh: '约珥书', chapters: 3 },
  AMO: { en: 'Amos', zh: '阿摩司书', chapters: 9 },
  OBA: { en: 'Obadiah', zh: '俄巴底亚书', chapters: 1 },
  JON: { en: 'Jonah', zh: '约拿书', chapters: 4 },
  MIC: { en: 'Micah', zh: '弥迦书', chapters: 7 },
  NAM: { en: 'Nahum', zh: '那鸿书', chapters: 3 },
  HAB: { en: 'Habakkuk', zh: '哈巴谷书', chapters: 3 },
  ZEP: { en: 'Zephaniah', zh: '西番雅书', chapters: 3 },
  HAG: { en: 'Haggai', zh: '哈该书', chapters: 2 },
  ZEC: { en: 'Zechariah', zh: '撒迦利亚书', chapters: 14 },
  MAL: { en: 'Malachi', zh: '玛拉基书', chapters: 4 },
  MAT: { en: 'Matthew', zh: '马太福音', chapters: 28 },
  MRK: { en: 'Mark', zh: '马可福音', chapters: 16 },
  LUK: { en: 'Luke', zh: '路加福音', chapters: 24 },
  JHN: { en: 'John', zh: '约翰福音', chapters: 21 },
  ACT: { en: 'Acts', zh: '使徒行传', chapters: 28 },
  ROM: { en: 'Romans', zh: '罗马书', chapters: 16 },
  '1CO': { en: '1 Corinthians', zh: '哥林多前书', chapters: 16 },
  '2CO': { en: '2 Corinthians', zh: '哥林多后书', chapters: 13 },
  GAL: { en: 'Galatians', zh: '加拉太书', chapters: 6 },
  EPH: { en: 'Ephesians', zh: '以弗所书', chapters: 6 },
  PHP: { en: 'Philippians', zh: '腓立比书', chapters: 4 },
  COL: { en: 'Colossians', zh: '歌罗西书', chapters: 4 },
  '1TH': { en: '1 Thessalonians', zh: '帖撒罗尼迦前书', chapters: 5 },
  '2TH': { en: '2 Thessalonians', zh: '帖撒罗尼迦后书', chapters: 3 },
  '1TI': { en: '1 Timothy', zh: '提摩太前书', chapters: 6 },
  '2TI': { en: '2 Timothy', zh: '提摩太后书', chapters: 4 },
  TIT: { en: 'Titus', zh: '提多书', chapters: 3 },
  PHM: { en: 'Philemon', zh: '腓利门书', chapters: 1 },
  HEB: { en: 'Hebrews', zh: '希伯来书', chapters: 13 },
  JAS: { en: 'James', zh: '雅各书', chapters: 5 },
  '1PE': { en: '1 Peter', zh: '彼得前书', chapters: 5 },
  '2PE': { en: '2 Peter', zh: '彼得后书', chapters: 3 },
  '1JN': { en: '1 John', zh: '约翰壹书', chapters: 5 },
  '2JN': { en: '2 John', zh: '约翰贰书', chapters: 1 },
  '3JN': { en: '3 John', zh: '约翰叁书', chapters: 1 },
  JUD: { en: 'Jude', zh: '犹大书', chapters: 1 },
  REV: { en: 'Revelation', zh: '启示录', chapters: 22 },
});

const VERSIONS = { en: 'World English Bible (WEB)', zh: '和合本' };
const MAX_SELECTIONS = 3;
const MAX_VERSES = 8;

const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const fail = (code, detail) => { throw new Error(detail === undefined ? code : `${code}: ${detail}`); };
const label = (value) => (typeof value === 'string' ? value : String(value));

/* Validate one reference completely — before any corpus is touched. */
function plan(selection, index) {
  const at = `#${index + 1}`;
  if (!selection || typeof selection !== 'object' || Array.isArray(selection)) fail('invalid_selection', at);

  if (typeof selection.book !== 'string') fail('invalid_book', at);
  const code = selection.book.trim().toUpperCase();
  if (!has(BOOKS, code)) fail('unknown_book', label(selection.book));
  const book = BOOKS[code];

  const chapter = selection.chapter;
  if (!Number.isSafeInteger(chapter) || chapter < 1 || chapter > book.chapters) fail('invalid_chapter', `${code} ${label(chapter)}`);

  const verseStart = selection.verseStart;
  if (!Number.isSafeInteger(verseStart) || verseStart < 1) fail('invalid_verse_start', `${code} ${chapter}:${label(verseStart)}`);

  let verseEnd = verseStart;
  if (selection.verseEnd !== undefined) {
    verseEnd = selection.verseEnd;
    if (!Number.isSafeInteger(verseEnd) || verseEnd < 1) fail('invalid_verse_end', `${code} ${chapter}:${label(selection.verseEnd)}`);
    if (verseEnd < verseStart) fail('reversed_range', `${code} ${chapter}:${verseStart}-${verseEnd}`);
  }
  if (verseEnd - verseStart + 1 > MAX_VERSES) fail('range_too_long', `${code} ${chapter}:${verseStart}-${verseEnd}`);

  return { code, book, chapter, verseStart, verseEnd };
}

/* Ask the corpus for one chapter. Anything other than a verse map is a failure. */
async function fetchChapter(loadChapter, lang, item) {
  const where = `${item.code} ${item.chapter}`;
  let chapter;
  try {
    chapter = await loadChapter(lang, item.code, item.chapter);
  } catch (cause) {
    throw new Error(`chapter_unavailable: ${where}`, { cause });
  }
  if (!chapter || typeof chapter !== 'object' || Array.isArray(chapter)) fail('chapter_unavailable', where);
  return chapter;
}

export async function resolveVerses(selections, lang, loadChapter) {
  if (lang !== 'en' && lang !== 'zh') fail('unsupported_language', label(lang));
  if (typeof loadChapter !== 'function') fail('missing_loader');
  if (!Array.isArray(selections) || selections.length < 1 || selections.length > MAX_SELECTIONS) {
    fail('invalid_selection_count', Array.isArray(selections) ? selections.length : label(selections));
  }

  const items = selections.map(plan);
  const chapters = new Map();
  const resolved = [];

  for (const item of items) {
    const key = `${item.code} ${item.chapter}`;
    if (!chapters.has(key)) chapters.set(key, await fetchChapter(loadChapter, lang, item));
    const chapter = chapters.get(key);

    const verses = [];
    for (let n = item.verseStart; n <= item.verseEnd; n += 1) {
      const raw = has(chapter, String(n)) ? chapter[String(n)] : undefined;
      if (typeof raw !== 'string' || !raw.trim()) fail('missing_verse', `${key}:${n}`);
      verses.push(raw);
    }

    const span = item.verseEnd > item.verseStart ? `${item.verseStart}-${item.verseEnd}` : `${item.verseStart}`;
    resolved.push({
      ref: `${item.book[lang]} ${item.chapter}:${span}`,
      version: VERSIONS[lang],
      text: verses.join(' '),
    });
  }

  return resolved;
}

export default { resolveVerses, BOOKS };
