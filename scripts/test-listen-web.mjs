// Phase 2B-1: listen-page English Scripture migrated to the WEB corpus.
import test from 'node:test'; import assert from 'node:assert/strict';
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { collectListen, checkListenEntry, PINS } from './verify-listen-corpus.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const read = (p) => fs.readFileSync(path.join(dir, '..', p), 'utf8');

test('all listen-page English entries match the WEB corpus (21 John + 12 Ecclesiastes)', () => {
  const entries = collectListen();
  assert.equal(entries.length, 33, `expected 33 listen entries, found ${entries.length}`);
  assert.equal(entries.length, PINS.size);
  for (const e of entries) checkListenEntry(e); // throws on any deviation
});

test('no NIV- or KJV-signature wording remains in the two listen pages', () => {
  const blob = read('john-listen.html') + '\n' + read('listen.html');
  for (const frag of [
    'made his dwelling among us', 'one and only Son', 'crossed over from death', 'will never go hungry',
    'even though they die', 'vexation of spirit', 'thy Creator', 'Cast thy bread', 'hath set the world',
    'loveth silver', 'reading paraphrase', 'not verbatim Scripture',
  ]) assert.ok(!blob.includes(frag), `NIV/KJV/old-disclosure residue present: "${frag}"`);
});

test('disclosure now states WEB (public domain), not NIV-derived paraphrase', () => {
  for (const f of ['john-listen.html', 'listen.html']) {
    const s = read(f);
    assert.match(s, /World English Bible \(WEB, public domain\)/, `${f} disclosure should cite WEB`);
  }
});

// --- Negative tests: the verifier MUST reject each corruption ---
const entryFor = (ref, inner) => ({ ref, inner, raw: '“' + inner + '”', file: 'test.html' });

test('NEG: an over-truncated verse is rejected', () => {
  assert.throws(() => checkListenEntry(entryFor('John 3:16', 'For God so loved the world')),
    /does not match pinned WEB text/);
});

test('NEG: run-together words are rejected (word boundaries enforced)', () => {
  assert.throws(() => checkListenEntry(entryFor('John 1:14', 'The Word becameflesh and lived among us. We saw his glory, such glory as of the only born Son of the Father, full of grace and truth.')),
    /does not match pinned WEB text/);
});

test('NEG: an NIV-style reworded verse is rejected', () => {
  assert.throws(() => checkListenEntry(entryFor('John 4:14', 'Whoever drinks the water I give them will never thirst.')),
    /does not match pinned WEB text/);
});

test('NEG: John 19:30 with its internal speech quote removed is rejected', () => {
  const words = 'When Jesus therefore had received the vinegar, he said, It is finished! Then he bowed his head and gave up his spirit.';
  // same words as the pin, but the inner ‘…’ speech quote is gone
  assert.throws(() => checkListenEntry({ ref: 'John 19:30', inner: words, raw: '“' + words + '”', file: 'test.html' }),
    /missing internal speech quote/);
});

// --- Marker (ellipsis) integrity: deleting a … must fail, even though the words are unchanged ---
test('NEG: removing the INTERNAL ellipsis (Ecclesiastes 12:1,13) is rejected', () => {
  const merged = 'Remember also your Creator in the days of your youth Fear God and keep his commandments; for this is the whole duty of man.';
  assert.throws(() => checkListenEntry(entryFor('Ecclesiastes 12:1,13', merged)),
    /excerpt markers/);
});
test('NEG: removing the LEADING ellipsis (John 14:6) is rejected', () => {
  const noLead = 'I am the way, the truth, and the life. No one comes to the Father, except through me.';
  assert.throws(() => checkListenEntry(entryFor('John 14:6', noLead)),
    /excerpt markers/);
});
test('NEG: removing the TRAILING ellipsis (John 4:14) is rejected', () => {
  const noTrail = '…whoever drinks of the water that I will give him will never thirst again.';
  assert.throws(() => checkListenEntry(entryFor('John 4:14', noTrail)),
    /excerpt markers/);
});
