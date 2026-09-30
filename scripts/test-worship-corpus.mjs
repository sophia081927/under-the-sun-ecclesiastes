// Worship Scripture — corpus verbatim + render separation + backward-compat.
import test from 'node:test'; import assert from 'node:assert/strict';
import { verifyWorshipDataset, verifyWorshipTrackScripture } from './verify-worship-corpus.mjs';
import { buildWorshipTracksHtml, scriptureRefDisplay } from '../components/worshipPanel.js';
import { johnWorship } from '../data/worship/johnWorship.js';
import { psalmsWorship } from '../data/worship/psalmsWorship.js';
import { proverbsWorship } from '../data/worship/proverbsWorship.js';
import { ecclesiastesWorship } from '../data/worship/ecclesiastesWorship.js';
import { revelationWorship } from '../data/worship/revelationWorship.js';

const clone = (o) => JSON.parse(JSON.stringify(o));

// ---- Positive: John Scripture is verbatim vs corpus, every card present ----
test('John worship: all tracks have structured Scripture, verbatim vs corpus', () => {
  const errors = verifyWorshipDataset(johnWorship, { requireAll: true });
  assert.deepEqual(errors, [], errors.join('\n'));
  assert.ok(johnWorship.tracks.length >= 10);
  for (const tk of johnWorship.tracks) assert.ok(tk.scripture && tk.scripture.book === 'JHN');
});

// ---- Negative: a one-character change must be caught ----
test('a single altered character fails verbatim check', () => {
  const bad = clone(johnWorship);
  bad.tracks[0].scripture.zh = bad.tracks[0].scripture.zh.replace('道成了肉身', '道成为肉身');
  const errors = verifyWorshipDataset(bad, { requireAll: true });
  assert.ok(errors.some((e) => /not verbatim/.test(e)), errors.join('\n'));
});

// ---- Negative: editorial prose in a scripture field must fail ----
test('editorial text placed in a scripture field fails (cannot masquerade as verbatim)', () => {
  const bad = clone(johnWorship);
  bad.tracks[1].scripture.en = 'I am the light of the world — so step into it today.';
  const errors = verifyWorshipDataset(bad, { requireAll: true });
  assert.ok(errors.some((e) => /not verbatim/.test(e)), errors.join('\n'));
});

// ---- Negative: a missing card is not silently skipped ----
test('a migrated dataset with a card missing structured scripture is flagged', () => {
  const bad = clone(johnWorship);
  delete bad.tracks[2].scripture;
  const errors = verifyWorshipDataset(bad, { requireAll: true });
  assert.ok(errors.some((e) => /scripture ref\(s\), expected|missing scripture ref/.test(e)), errors.join('\n'));
});

// ---- Negative: a bad reference (to < from) is rejected ----
test('an inverted verse range is rejected', () => {
  const errors = verifyWorshipTrackScripture({ book: 'JHN', ch: 1, from: 14, to: 13, zh: 'x', en: 'y' }, 'test');
  assert.ok(errors.some((e) => /to .* < from/.test(e)), errors.join('\n'));
});

// ---- Generated reference display ----
test('scriptureRefDisplay generates the reference from structure (both languages, ranges)', () => {
  assert.equal(scriptureRefDisplay({ book: 'JHN', ch: 1, from: 14, to: 14 }, 'zh'), '约翰福音 1:14');
  assert.equal(scriptureRefDisplay({ book: 'JHN', ch: 1, from: 14, to: 14 }, 'en'), 'John 1:14');
  assert.equal(scriptureRefDisplay({ book: 'REV', ch: 22, from: 17, to: 20 }, 'zh'), '启示录 22:17-20');
});

// ---- Rendering: Scripture / reference / version / editorial are separate ----
test('render: John shows a Scripture block with generated ref + version label, separate from reflection', () => {
  const zh = buildWorshipTracksHtml(johnWorship, 'zh', '#E8D7FF');
  assert.match(zh, /class="wp-scripture"/);
  assert.match(zh, /新标点和合本（简体）/);
  assert.match(zh, /约翰福音 1:14/);
  assert.match(zh, /道成了肉身，住在我们中间/);       // verbatim verse present
  assert.match(zh, /class="wp-refl"/);               // reflection is its own block
  assert.ok(!/公有领域/.test(zh), 'no blanket public-domain tag over the Chinese version');

  const en = buildWorshipTracksHtml(johnWorship, 'en', '#E8D7FF');
  assert.match(en, /World English Bible \(WEB\)/);
  assert.match(en, /John 1:14/);
  assert.match(en, /The Word became flesh and lived among us/);
});

// ---- Rendering: internal quotes preserved, injection escaped ----
test('render: text is escaped (injection safe) while internal quotes are preserved', () => {
  const synthetic = { id: 'x', tracks: [{
    themeZh: 't', themeEn: 't', titleZh: 'a', titleEn: 'a',
    scripture: { book: 'JHN', ch: 1, from: 1, to: 1, zh: '「太初有道」<b>&"', en: 'In the beginning <b>&"' },
  }] };
  const zh = buildWorshipTracksHtml(synthetic, 'zh');
  assert.match(zh, /「太初有道」/, 'Chinese quotation marks preserved');
  assert.match(zh, /&lt;b&gt;&amp;&quot;/, 'angle brackets, ampersand and quote escaped');
  assert.ok(!/<b>&"/.test(zh), 'no raw unescaped markup');
});

// ---- Backward compat: Psalms (thematic) unchanged, no verbatim/version claim ----
test('render: Psalms stays legacy/neutral — no Scripture block, no version label, no editorial tag', () => {
  const zh = buildWorshipTracksHtml(psalmsWorship, 'zh', '#A8C5D6');
  assert.ok(!/class="wp-scripture"/.test(zh), 'no verbatim Scripture block for thematic Psalms');
  assert.ok(!/新标点和合本/.test(zh), 'no version label claimed');
  assert.ok(!/本站整理（非经文）|Editorial \(not Scripture\)/.test(zh), 'legacy note is not labeled "not Scripture"');
  assert.match(zh, /class="wp-conn"/);               // still renders the neutral note
});

// ---- Backward compat: Proverbs (already live) unchanged ----
test('render: Proverbs worship stays legacy/neutral (no regression)', () => {
  const zh = buildWorshipTracksHtml(proverbsWorship, 'zh', '#E6C776');
  assert.ok(!/class="wp-scripture"/.test(zh));
  assert.ok(!/新标点和合本/.test(zh));
  assert.match(zh, /class="wp-conn"/);
});

// ---- Ecclesiastes & Revelation: migrated, verbatim, manifest-locked ----
test('Ecclesiastes worship: Scripture verbatim + manifest (incl. editorial-only cards)', () => {
  const errors = verifyWorshipDataset(ecclesiastesWorship, { requireAll: true });
  assert.deepEqual(errors, [], errors.join('\n'));
});
test('Revelation worship: Scripture verbatim + manifest', () => {
  const errors = verifyWorshipDataset(revelationWorship, { requireAll: true });
  assert.deepEqual(errors, [], errors.join('\n'));
});

// ---- Non-contiguous verses must be SEPARATE refs, not a continuous range ----
test('collapsing Ecclesiastes 3:1 & 3:4 into a 3:1-4 range is rejected', () => {
  const bad = clone(ecclesiastesWorship);
  const card = bad.tracks.find((t) => t.id === 'peace-in-sorrow');
  card.scripture = [{ book: 'ECC', ch: 3, from: 1, to: 4, zh: '（不连续经节被误当作连续范围）', en: '(non-contiguous flattened to a range)' }];
  const errors = verifyWorshipDataset(bad, { requireAll: true });
  assert.ok(errors.some((e) => /scripture ref\(s\), expected 2|non-contiguous/.test(e)), errors.join('\n'));
});
test('render: non-contiguous refs produce two separate reference lines (3:1 and 3:4)', () => {
  const zh = buildWorshipTracksHtml(ecclesiastesWorship, 'zh', '#D4AF37');
  assert.match(zh, /传道书 3:1 ·/);
  assert.match(zh, /传道书 3:4 ·/);
  assert.ok(!/传道书 3:1-4/.test(zh), 'must not present a 3:1-4 range');
  const rev = buildWorshipTracksHtml(revelationWorship, 'zh', '#E4C97A');
  assert.match(rev, /启示录 22:17 ·/);
  assert.match(rev, /启示录 22:20 ·/);
  assert.ok(!/启示录 22:17-20/.test(rev));
});

// ---- Editorial-only cards are registered and enforced ----
test('an editorial-only card that carries Scripture is rejected', () => {
  const bad = clone(ecclesiastesWorship);
  const card = bad.tracks.find((t) => t.id === 'found-by-grace');
  card.scripture = [{ book: 'ECC', ch: 1, from: 2, to: 2, zh: '虚空的虚空，凡事都是虚空。', en: 'Vanity of vanities, all is vanity.' }];
  const errors = verifyWorshipDataset(bad, { requireAll: true });
  assert.ok(errors.some((e) => /editorial-only but carries Scripture/.test(e)), errors.join('\n'));
});
test('an editorial-only card missing its connection text is rejected', () => {
  const bad = clone(ecclesiastesWorship);
  const card = bad.tracks.find((t) => t.id === 'unchanging-refuge');
  delete card.connectionEn;
  const errors = verifyWorshipDataset(bad, { requireAll: true });
  assert.ok(errors.some((e) => /must have connectionZh \+ connectionEn/.test(e)), errors.join('\n'));
});
test('render: Ecclesiastes editorial-only card is labeled editorial, no Scripture block', () => {
  const zh = buildWorshipTracksHtml(ecclesiastesWorship, 'zh', '#D4AF37');
  assert.match(zh, /本站整理（非经文）<\/span>人抓不住自己的生命/);   // found-by-grace editorial
  // the turn-eyes card carries both a verbatim verse and an editorial connection
  assert.match(zh, /传道书 2:11 · 新标点和合本（简体）/);
  assert.match(zh, /本站整理（非经文）<\/span>日光之下的劳碌/);
});

// ---- Manifest lock: a card cannot be dropped, reordered, duplicated, or re-mapped ----
test('re-mapping a card to another (still-verbatim) verse fails the manifest', () => {
  // "活水" (living-water, JHN 4:14) swapped to a verbatim copy of JHN 1:14 — passes the
  // per-verse verbatim check, but the manifest says card#3 must be 4:14.
  const bad = clone(johnWorship);
  bad.tracks[2].scripture = clone(bad.tracks[0].scripture);  // now living-water holds 1:14
  const errors = verifyWorshipDataset(bad, { requireAll: true });
  assert.ok(errors.some((e) => /mis-mapped|!= expected/.test(e)), errors.join('\n'));
});

test('deleting a whole card is caught (count + missing/reorder)', () => {
  const bad = clone(johnWorship);
  bad.tracks.splice(4, 1);   // remove the good-shepherd card entirely
  const errors = verifyWorshipDataset(bad, { requireAll: true });
  assert.ok(errors.some((e) => /cards, expected|missing card|reordered/.test(e)), errors.join('\n'));
});

test('duplicating a card is caught (duplicate id + count)', () => {
  const bad = clone(johnWorship);
  bad.tracks.splice(3, 0, clone(bad.tracks[0]));  // insert a second copy of card#1
  const errors = verifyWorshipDataset(bad, { requireAll: true });
  assert.ok(errors.some((e) => /duplicate card id/.test(e)), errors.join('\n'));
});

test('reordering two cards is caught by the id sequence', () => {
  const bad = clone(johnWorship);
  [bad.tracks[0], bad.tracks[1]] = [bad.tracks[1], bad.tracks[0]];
  const errors = verifyWorshipDataset(bad, { requireAll: true });
  assert.ok(errors.some((e) => /id ".*" != expected|mis-mapped/.test(e)), errors.join('\n'));
});

// ---- Editorial separation, exercised with real connection samples ----
const verseBlock = (html) => (html.match(/<p class="wp-verse">([\s\S]*?)<\/p>/) || [, ''])[1];

test('render: scripture + editorial connection — tag shown, editorial NOT inside the verse block (zh & en)', () => {
  const d = { id: 'edtest', tracks: [{
    id: 't', themeZh: '主题', themeEn: 'Theme', titleZh: '歌', titleEn: 'Song',
    scripture: { book: 'JHN', ch: 1, from: 1, to: 1, zh: '太初有道，道与神同在，道就是神。', en: 'In the beginning was the Word.' },
    connectionZh: '这是本站的应用性解释，不是经文。', connectionEn: 'This is the site’s editorial application, not Scripture.',
  }] };
  const zh = buildWorshipTracksHtml(d, 'zh');
  // tag present and directly attached to the editorial text
  assert.match(zh, /<span class="wp-tag">本站整理（非经文）<\/span>这是本站的应用性解释，不是经文。/);
  // verse block holds ONLY the verse — editorial must not leak in
  assert.equal(verseBlock(zh), '太初有道，道与神同在，道就是神。');
  assert.ok(!verseBlock(zh).includes('本站的应用性解释'), 'editorial must not appear in the verse block');
  // and the verse must not appear inside an editorial (tagged) block
  assert.ok(!/wp-tag">[\s\S]*?太初有道/.test(zh), 'the verse must not appear inside the editorial block');

  const en = buildWorshipTracksHtml(d, 'en');
  assert.match(en, /<span class="wp-tag">Editorial \(not Scripture\)<\/span>This is the site’s editorial application, not Scripture\./);
  assert.equal(verseBlock(en), 'In the beginning was the Word.');
});

test('render: editorial-only card — labeled editorial, no Scripture block (zh & en)', () => {
  const d = { id: 'edonly', tracks: [{
    id: 't', themeZh: '主题', themeEn: 'Theme', titleZh: '歌', titleEn: 'Song',
    connectionZh: '仅有本站整理的说明。', connectionEn: 'Editorial note only.',
  }] };
  const zh = buildWorshipTracksHtml(d, 'zh');
  assert.ok(!/class="wp-scripture"/.test(zh), 'no Scripture block when there is no verse');
  assert.match(zh, /<span class="wp-tag">本站整理（非经文）<\/span>仅有本站整理的说明。/);
  const en = buildWorshipTracksHtml(d, 'en');
  assert.match(en, /<span class="wp-tag">Editorial \(not Scripture\)<\/span>Editorial note only\./);
});
