// Proverbs — data structure + all 31 chapters (P1 master + P2 chapters 2–31).
import test from 'node:test'; import assert from 'node:assert/strict';
import { verifyProverbsChapter } from './verify-proverbs-corpus.mjs';
import { proverbsBook, proverbsChapters, proverbsDivisions } from '../data/books/proverbs/index.js';
import { WISDOM_THEMES, THEME_BY_ID } from '../data/wisdom-taxonomy.js';
import ch01 from '../data/books/proverbs/ch01.js';
import fs from 'node:fs';
import { proverbsWorship } from '../data/worship/proverbsWorship.js';

test('Proverbs worship Scripture connections match complete WEB corpus verses', () => {
  assert.equal(proverbsWorship.tracks.length, 7);
  for (const track of proverbsWorship.tracks) {
    const match = track.scriptureConnectionEn.match(/^(.*) \(Proverbs (\d+):(\d+)(?:-(\d+))?; WEB\)$/);
    assert.ok(match, 'every connection identifies the WEB verse range');
    const [, text, chapter, first, last] = match;
    const corpus = JSON.parse(fs.readFileSync(new URL(`../worker/scripture-assets/en/PRO/${chapter}.json`, import.meta.url), 'utf8'));
    const expected = [];
    for (let verse = +first; verse <= +(last || first); verse++) {
      assert.ok(corpus[verse]);
      expected.push(corpus[verse]);
    }
    assert.equal(text, expected.join(' '));
  }
});

const ALL = Array.from({ length: 31 }, (_, i) => i + 1);
const load = async (n) => (await import(`../data/books/proverbs/ch${String(n).padStart(2, '0')}.js`)).default;

// ---- Scripture: verbatim vs corpus for the whole book ----
for (const n of ALL) {
  test(`Proverbs ${n} Scripture is verbatim vs corpus (EN WEB + ZH 和合本)`, async () => {
    const errors = await verifyProverbsChapter(n);
    assert.deepEqual(errors, [], `corpus problems in Proverbs ${n}:\n` + errors.join('\n'));
  });
}

// ---- Whole-book data structure ----
test('book index has 31 chapters, all built (full)', () => {
  assert.equal(proverbsChapters.length, 31);
  for (const c of proverbsChapters) assert.equal(c.status, 'full', `ch${c.n} should be full`);
  assert.equal(proverbsBook.id, 'proverbs');
  assert.equal(proverbsDivisions.length, 6);
});

test('every chapter is assigned to a valid division', () => {
  const ids = new Set(proverbsDivisions.map((d) => d.id));
  for (const c of proverbsChapters) assert.ok(ids.has(c.section), `ch${c.n} section ${c.section} invalid`);
});

// ---- Taxonomy ----
test('taxonomy has the full theme set with valid ids', () => {
  assert.ok(WISDOM_THEMES.length >= 24);
  for (const t of WISDOM_THEMES) { assert.ok(t.id && t.en && t.zh); assert.equal(THEME_BY_ID[t.id], t); }
});

// ---- Every chapter: template completeness, no placeholders, valid references ----
const bilingualOk = (o) => o && typeof o.zh === 'string' && o.zh.trim() && typeof o.en === 'string' && o.en.trim();
for (const n of ALL) {
  test(`Proverbs ${n} is complete (all sections, no placeholders, valid references)`, async () => {
    const d = await load(n);
    for (const f of ['titleZh', 'titleEn', 'bigIdea', 'overview', 'verses', 'passages', 'keyVerses', 'realLife', 'reflect', 'prayer', 'oneThing', 'dailyChallenge', 'ask', 'sources', 'themes'])
      assert.ok(d[f] != null, `ch${n} missing ${f}`);

    // No leftover placeholder text anywhere in the authored (non-verses) content.
    const authored = { ...d, verses: undefined };
    const blob = JSON.stringify(authored);
    assert.ok(!blob.includes('待撰写'), `ch${n} still has zh placeholder`);
    assert.ok(!blob.includes('To be written'), `ch${n} still has en placeholder`);

    // Themes
    assert.ok(d.themes.length >= 1, `ch${n} needs themes`);
    for (const t of d.themes) assert.ok(t in THEME_BY_ID, `ch${n} invalid theme ${t}`);

    // Bilingual key blocks
    assert.ok(bilingualOk(d.bigIdea), `ch${n} bigIdea`);
    assert.ok(bilingualOk(d.prayer), `ch${n} prayer`);
    assert.ok(bilingualOk(d.oneThing), `ch${n} oneThing`);
    assert.ok(bilingualOk(d.dailyChallenge), `ch${n} dailyChallenge`);

    // Overview arrays aligned + non-empty
    assert.ok(Array.isArray(d.overview.zh) && d.overview.zh.length >= 1, `ch${n} overview zh`);
    assert.equal(d.overview.zh.length, d.overview.en.length, `ch${n} overview zh/en length mismatch`);

    // Verse set for reference validation
    const vset = new Set(d.verses.map((v) => v.v));

    // Passages: real ranges + bilingual say/mean/forMe
    assert.ok(d.passages.length >= 2, `ch${n} needs >=2 passages`);
    for (const p of d.passages) {
      assert.ok(vset.has(p.vFrom) && vset.has(p.vTo), `ch${n} passage ${p.rangeLabel} range not in verses`);
      for (const k of ['sayZh', 'sayEn', 'meanZh', 'meanEn', 'forMeZh', 'forMeEn', 'titleZh', 'titleEn'])
        assert.ok(p[k] && String(p[k]).trim(), `ch${n} passage missing ${k}`);
    }

    // Key verses: 3–8, each references a present verse, bilingual notes
    assert.ok(d.keyVerses.length >= 3 && d.keyVerses.length <= 8, `ch${n} keyVerses count ${d.keyVerses.length}`);
    for (const kv of d.keyVerses) {
      assert.ok(vset.has(kv.v), `ch${n} keyVerse v${kv.v} not in verses`);
      for (const k of ['meansZh', 'meansEn', 'mattersZh', 'mattersEn', 'todayZh', 'todayEn'])
        assert.ok(kv[k] && String(kv[k]).trim(), `ch${n} keyVerse v${kv.v} missing ${k}`);
    }

    // Real life: >=3, verseRef null or references a present verse
    assert.ok(d.realLife.length >= 3, `ch${n} needs >=3 realLife`);
    for (const r of d.realLife) {
      for (const k of ['tag', 'tagZh', 'titleZh', 'titleEn', 'bodyZh', 'bodyEn'])
        assert.ok(r[k] && String(r[k]).trim(), `ch${n} realLife missing ${k}`);
      if (r.verseRef) {
        const m = r.verseRef.match(/Proverbs \d+:(\d+)/);
        assert.ok(m && vset.has(Number(m[1])), `ch${n} realLife verseRef ${r.verseRef} not in verses`);
      }
    }

    // Reflection: exactly 5, bilingual
    assert.equal(d.reflect.length, 5, `ch${n} needs exactly 5 reflection questions`);
    for (const r of d.reflect) assert.ok(bilingualOk(r), `ch${n} reflect item`);

    // Ask prompts: 3–6 each, aligned
    assert.ok(d.ask.promptsZh.length >= 3 && d.ask.promptsEn.length === d.ask.promptsZh.length, `ch${n} ask prompts`);
  });
}

// ---- Rendered UI: key-verse references show the CURRENT chapter number ----
import { renderProverbsChapter, renderChapterFooterNav } from '../components/proverbsReader.js';

for (const n of [1, 2, 23, 31]) {
  test(`rendered Key Verse references show "Proverbs ${n}:" (not a fixed chapter)`, async () => {
    const d = await load(n);
    const html = renderProverbsChapter(d);
    const refs = [...html.matchAll(/<div class="pv-key-ref">([^<]+)<\/div>/g)].map((m) => m[1]);
    assert.ok(refs.length >= 3, `ch${n} should render key-verse refs`);
    for (const r of refs) {
      const m = r.match(/^Proverbs (\d+):(\d+)$/);
      assert.ok(m, `ch${n} malformed key ref: ${r}`);
      assert.equal(Number(m[1]), n, `ch${n} key ref shows wrong chapter: ${r}`);
    }
    // the one-thing disclaimer must not hard-code a foreign "Proverbs 1:7"
    if (n !== 1) assert.ok(!html.includes('Proverbs 1:7'), `ch${n} still hard-codes Proverbs 1:7`);
  });
}

// ---- Chapter navigation, incl. end-of-book state on Chapter 31 ----
test('Chapter 31 footer nav shows End of Proverbs (not "coming soon"), Prev → 30', () => {
  const html = renderChapterFooterNav(proverbsChapters, 31);
  assert.ok(html.includes('End of Proverbs') && html.includes('《箴言》全书读完'), 'ch31 must show end-of-book state');
  assert.ok(!html.includes('coming soon') && !html.includes('筹备中'), 'ch31 must not say coming soon');
  assert.ok(html.includes('proverbs.html?ch=30'), 'ch31 Previous should link to chapter 30');
});
test('middle chapter nav links both ways; chapter 1 has no Previous', () => {
  const mid = renderChapterFooterNav(proverbsChapters, 15);
  assert.ok(mid.includes('proverbs.html?ch=14') && mid.includes('proverbs.html?ch=16'), 'ch15 prev/next links');
  assert.ok(!mid.includes('End of Proverbs') && !mid.includes('coming soon'));
  const first = renderChapterFooterNav(proverbsChapters, 1);
  assert.ok(first.includes('proverbs.html?ch=2'), 'ch1 next → ch2');
  assert.ok(!first.includes('ch=0'), 'ch1 has no previous link');
});

// ---- Proverbs 23:26 speaker fidelity (father/teacher, not "God says") ----
test('Proverbs 23:26 keeps the father/teacher speaker; God-turn marked as application', async () => {
  const d = await load(23);
  const blob = JSON.stringify({ keyVerses: d.keyVerses, reflect: d.reflect, prayer: d.prayer, passages: d.passages });
  assert.ok(!blob.includes('神说“要将你的心归我”'), 'reflection must not say God says "give me your heart"');
  assert.ok(!blob.includes('you say “give me your heart”'), 'prayer must not claim God said this verse');
  const kv26 = d.keyVerses.find((k) => k.v === 26);
  assert.ok(kv26 && (kv26.meansEn.includes('father') || kv26.meansZh.includes('父亲')), '23:26 should name the father/teacher speaker');
});

// ---- Chapter 1 remains the reference master ----
test('Chapter 1 master specifics intact', () => {
  assert.equal(ch01.verses.length, 33);
  assert.equal(ch01.reflect.length, 5);
  assert.ok(ch01.themes.includes('fear-of-the-lord') && ch01.themes.includes('wisdom'));
  const warn = ch01.realLife.find((r) => r.tag === 'WARNING SIGNS');
  assert.ok(warn && warn.verseRef === null, 'ch1 WARNING SIGNS is application-only');
});
