// Phase P1: Proverbs data structure + Chapter 1 master.
import test from 'node:test'; import assert from 'node:assert/strict';
import { verifyProverbsChapter } from './verify-proverbs-corpus.mjs';
import { proverbsBook, proverbsChapters, proverbsDivisions } from '../data/books/proverbs/index.js';
import { WISDOM_THEMES, THEME_BY_ID } from '../data/wisdom-taxonomy.js';
import ch01 from '../data/books/proverbs/ch01.js';

// ---- Scripture: verbatim vs corpus (the critical guarantee) ----
test('Proverbs 1 Scripture is verbatim vs the project corpus (EN WEB + ZH 和合本)', async () => {
  const errors = await verifyProverbsChapter(1);
  assert.deepEqual(errors, [], 'corpus verification found problems:\n' + errors.join('\n'));
});

// ---- Whole-book data structure ----
test('book index has 31 chapters; ch1 full, 2–31 upcoming', () => {
  assert.equal(proverbsChapters.length, 31);
  assert.equal(proverbsChapters[0].n, 1);
  assert.equal(proverbsChapters[0].status, 'full');
  for (let i = 1; i < 31; i++) assert.equal(proverbsChapters[i].status, 'upcoming', `ch${i + 1} should be upcoming`);
  assert.equal(proverbsBook.id, 'proverbs');
  assert.equal(proverbsDivisions.length, 6, 'six canonical divisions');
});

test('every chapter is assigned to a valid division', () => {
  const ids = new Set(proverbsDivisions.map((d) => d.id));
  for (const c of proverbsChapters) assert.ok(ids.has(c.section), `ch${c.n} section ${c.section} invalid`);
});

// ---- Taxonomy ----
test('taxonomy has the full theme set with valid ids', () => {
  assert.ok(WISDOM_THEMES.length >= 24, `expected >=24 themes, got ${WISDOM_THEMES.length}`);
  for (const t of WISDOM_THEMES) {
    assert.ok(t.id && t.en && t.zh, `theme missing fields: ${JSON.stringify(t)}`);
    assert.equal(THEME_BY_ID[t.id], t);
  }
});

test('Chapter 1 theme tags are all valid taxonomy ids', () => {
  for (const t of ch01.themes) assert.ok(t in THEME_BY_ID, `invalid theme ${t}`);
  assert.ok(ch01.themes.includes('fear-of-the-lord') && ch01.themes.includes('wisdom'));
});

// ---- Chapter 1 template completeness ----
test('Chapter 1 has every template part', () => {
  for (const f of ['bigIdea', 'overview', 'verses', 'passages', 'keyVerses', 'realLife', 'reflect', 'prayer', 'oneThing', 'dailyChallenge', 'ask', 'sources']) {
    assert.ok(ch01[f] != null, `missing field: ${f}`);
  }
  assert.equal(ch01.verses.length, 33, 'Proverbs 1 has 33 verses');
  assert.equal(ch01.passages.length, 4, 'four passage segments');
  assert.ok(ch01.keyVerses.length >= 4 && ch01.keyVerses.length <= 6, '4–6 key verses');
  assert.equal(ch01.realLife.length, 5, 'five real-life scenarios');
  assert.equal(ch01.reflect.length, 5, 'five reflection questions');
  // bilingual coverage on the key blocks
  assert.ok(ch01.bigIdea.zh && ch01.bigIdea.en);
  assert.ok(ch01.prayer.zh && ch01.prayer.en);
  assert.equal(ch01.overview.zh.length, ch01.overview.en.length, 'overview zh/en paragraph counts match');
});

test('the WARNING SIGNS scenario is application-only (no verseRef), others cite a verse', () => {
  const warn = ch01.realLife.find((r) => r.tag === 'WARNING SIGNS');
  assert.ok(warn && warn.verseRef === null, 'WARNING SIGNS must be application-only');
  const withRefs = ch01.realLife.filter((r) => r.verseRef);
  assert.ok(withRefs.length === 4, 'the other four scenarios cite a verse');
});
