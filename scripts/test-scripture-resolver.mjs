import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveVerses, BOOKS } from '../worker/scripture-resolver.js';

/* A stand-in corpus. Wording here is arbitrary test data — the point is that
   whatever these bytes are, they are exactly what comes back out. */
const CORPUS = {
  en: {
    'JHN 3': { 16: 'For God so loved the world,', 17: 'For God didn\'t send his Son into the world to judge the world,' },
    'PSA 23': Object.fromEntries(Array.from({ length: 12 }, (_, i) => [i + 1, `verse ${i + 1}`])),
    'JHN 11': { 35: '  Jesus\n wept.  ' },
  },
  zh: { 'JHN 3': { 16: '神爱世人，', 17: '因为神差他的儿子降世，' } },
};
let loads = [];
const loadChapter = async (lang, book, chapter) => {
  loads.push(`${lang} ${book} ${chapter}`);
  const found = CORPUS[lang] && CORPUS[lang][`${book} ${chapter}`];
  if (!found) throw new Error('not in corpus');
  return found;
};
const only = (selection, lang = 'en') => resolveVerses([selection], lang, loadChapter);
const watchLoads = () => { loads = []; };

test('the whitelist is the 66-book canon with both full names', () => {
  const codes = Object.keys(BOOKS);
  assert.equal(codes.length, 66);
  assert.ok(codes.every(c => /^[123]?[A-Z]{2,3}$/.test(c) && BOOKS[c].en && BOOKS[c].zh && BOOKS[c].chapters >= 1));
  assert.equal(BOOKS.JHN.zh, '约翰福音');
  assert.equal(BOOKS['1CO'].en, '1 Corinthians');
});

test('a single verse comes back verbatim with an English ref and version', async () => {
  assert.deepEqual(await only({ book: 'JHN', chapter: 3, verseStart: 16 }), [
    { ref: 'John 3:16', version: 'World English Bible (WEB)', text: 'For God so loved the world,' },
  ]);
});

test('a range is joined verse by verse with single spaces', async () => {
  const [verse] = await only({ book: 'JHN', chapter: 3, verseStart: 16, verseEnd: 17 });
  assert.equal(verse.ref, 'John 3:16-17');
  assert.equal(verse.text, `${CORPUS.en['JHN 3'][16]} ${CORPUS.en['JHN 3'][17]}`);
});

test('zh uses the Chinese book name and 和合本', async () => {
  assert.deepEqual(await only({ book: 'JHN', chapter: 3, verseStart: 16, verseEnd: 17 }, 'zh'), [
    { ref: '约翰福音 3:16-17', version: '和合本', text: '神爱世人， 因为神差他的儿子降世，' },
  ]);
});

test('source whitespace and wording are preserved exactly', async () => {
  const [verse] = await only({ book: 'JHN', chapter: 11, verseStart: 35 });
  assert.equal(verse.text, CORPUS.en['JHN 11'][35]);
});

test('up to three selections resolve in the requested order, one load per chapter', async () => {
  watchLoads();
  const out = await resolveVerses([
    { book: 'PSA', chapter: 23, verseStart: 4 },
    { book: 'JHN', chapter: 3, verseStart: 16 },
    { book: 'psa', chapter: 23, verseStart: 1, verseEnd: 2 },
  ], 'en', loadChapter);
  assert.deepEqual(out.map(v => v.ref), ['Psalms 23:4', 'John 3:16', 'Psalms 23:1-2']);
  assert.deepEqual(loads, ['en PSA 23', 'en JHN 3']);
});

test('a span of exactly eight verses is allowed, nine is not', async () => {
  const [verse] = await only({ book: 'PSA', chapter: 23, verseStart: 1, verseEnd: 8 });
  assert.equal(verse.text.split(' ').length, 16); // "verse N" × 8
  await assert.rejects(only({ book: 'PSA', chapter: 23, verseStart: 1, verseEnd: 9 }), /range_too_long/);
});

test('books outside the canon are refused, and nothing is loaded', async () => {
  watchLoads();
  for (const book of ['ENO', 'TOB', 'John', 'JHN3', '', 3, null, undefined]) {
    await assert.rejects(only({ book, chapter: 1, verseStart: 1 }), /invalid_book|unknown_book/);
  }
  assert.deepEqual(loads, []);
});

test('chapters must be integers inside the real book', async () => {
  for (const chapter of [0, -1, 1.5, '3', NaN, Infinity, null, undefined, 22]) {
    await assert.rejects(only({ book: 'JHN', chapter, verseStart: 1 }), /invalid_chapter/); // John has 21
  }
  await assert.rejects(only({ book: 'JUD', chapter: 2, verseStart: 1 }), /invalid_chapter/);
});

test('verse numbers must be integers and in order, checked before any load', async () => {
  watchLoads();
  for (const verseStart of [0, -2, 1.5, '16', null, undefined]) {
    await assert.rejects(only({ book: 'JHN', chapter: 3, verseStart }), /invalid_verse_start/);
  }
  for (const verseEnd of [0, 2.5, '17', null]) {
    await assert.rejects(only({ book: 'JHN', chapter: 3, verseStart: 16, verseEnd }), /invalid_verse_end/);
  }
  await assert.rejects(only({ book: 'JHN', chapter: 3, verseStart: 17, verseEnd: 16 }), /reversed_range/);
  assert.deepEqual(loads, []);
});

test('the selection list itself must hold one to three objects', async () => {
  for (const selections of [[], null, undefined, 'JHN 3:16', { book: 'JHN' },
    [1, 2, 3].map(() => ({ book: 'JHN', chapter: 3, verseStart: 16 })).concat({ book: 'JHN', chapter: 3, verseStart: 16 })]) {
    await assert.rejects(resolveVerses(selections, 'en', loadChapter), /invalid_selection_count/);
  }
  for (const selection of [null, 'JHN 3:16', 42, ['JHN', 3, 16]]) {
    await assert.rejects(only(selection), /invalid_selection/);
  }
});

test('language and loader must be supplied explicitly', async () => {
  for (const lang of ['fr', 'EN', '', undefined, null]) {
    await assert.rejects(resolveVerses([{ book: 'JHN', chapter: 3, verseStart: 16 }], lang, loadChapter), /unsupported_language/);
  }
  await assert.rejects(resolveVerses([{ book: 'JHN', chapter: 3, verseStart: 16 }], 'en', null), /missing_loader/);
});

test('a chapter the corpus cannot serve fails instead of substituting', async () => {
  await assert.rejects(only({ book: 'GEN', chapter: 1, verseStart: 1 }), /chapter_unavailable: GEN 1/);
  for (const bad of [null, undefined, 'John 3:16 For God so loved the world', 42, ['a', 'b']]) {
    await assert.rejects(resolveVerses([{ book: 'JHN', chapter: 3, verseStart: 16 }], 'en', async () => bad), /chapter_unavailable/);
  }
});

test('a verse missing, blank or non-textual in the corpus is never invented', async () => {
  await assert.rejects(only({ book: 'JHN', chapter: 3, verseStart: 16, verseEnd: 18 }), /missing_verse: JHN 3:18/);
  for (const value of ['', '   ', 16, null, { text: 'For God so loved the world,' }, ['For God so loved the world,']]) {
    await assert.rejects(
      resolveVerses([{ book: 'JHN', chapter: 3, verseStart: 16 }], 'en', async () => ({ 16: value })),
      /missing_verse: JHN 3:16/,
    );
  }
});

test('inherited properties are not mistaken for verses', async () => {
  const inherited = Object.create({ 16: 'not a verse from the corpus' });
  await assert.rejects(resolveVerses([{ book: 'JHN', chapter: 3, verseStart: 16 }], 'en', async () => inherited), /missing_verse/);
  await assert.rejects(
    resolveVerses([{ book: 'JHN', chapter: 3, verseStart: 1 }], 'en', async () => ({ constructor: 'x', toString: 'y' })),
    /missing_verse/,
  );
});

test('one bad selection fails the whole call — no partial result', async () => {
  await assert.rejects(resolveVerses([
    { book: 'JHN', chapter: 3, verseStart: 16 },
    { book: 'JHN', chapter: 3, verseStart: 99 },
  ], 'en', loadChapter), /missing_verse: JHN 3:99/);
});
