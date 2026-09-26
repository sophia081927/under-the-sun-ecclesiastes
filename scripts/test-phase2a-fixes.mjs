import test from 'node:test'; import assert from 'node:assert/strict';
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import worker from '../worker/prayer-worker.js';
import { collectEntries, checkEntry, corpusFor, EXCERPTS, keyOf } from './verify-web-corpus.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const read = (p) => fs.readFileSync(path.join(dir, '..', p), 'utf8');

// ============================================================
//  Fix (1): every English Scripture entry is verbatim WEB corpus text.
//  checkEntry enforces word-for-word full verses, pinned excerpt ranges,
//  preserved word boundaries, and internal speech quotes.
// ============================================================
test('every English Scripture entry passes the strict WEB-corpus check', () => {
  const entries = collectEntries();
  assert.ok(entries.length >= 50, `expected the Scripture entries, found ${entries.length}`);
  for (const e of entries) checkEntry(e); // throws on any deviation
});

test('exactly the 8 documented excerpts are present, each seen once', () => {
  const seen = collectEntries().filter((e) => EXCERPTS.has(keyOf(e))).map(keyOf);
  for (const k of EXCERPTS.keys()) assert.equal(seen.filter((x) => x === k).length, 1, `excerpt not found exactly once: ${k}`);
});

// --- Negative tests: the verifier MUST reject each of these corruptions ---
test('NEG: Matthew 28:20 truncated to just "Behold" is rejected', () => {
  assert.throws(() => checkEntry({ ref: 'Matthew 28:20', text: '“Behold”', where: 'qaEngine 【Matthew 28:20】' }),
    /excerpt does not match its pinned range/);
});
test('NEG: John 4:13-14 with its internal closing quote removed is rejected', () => {
  const good = '“Jesus answered her, ‘Everyone who drinks of this water will thirst again, but whoever drinks of the water that I will give him will never thirst again; but the water that I will give him will become in him a well of water springing up to eternal life.’”';
  assert.doesNotThrow(() => checkEntry({ ref: 'John 4:13-14', text: good, where: 'qaEngine 【John 4:13-14】' }));
  const bad = good.replace('life.’”', 'life.”'); // delete the inner closing ’
  assert.throws(() => checkEntry({ ref: 'John 4:13-14', text: bad, where: 'qaEngine 【John 4:13-14】' }),
    /missing internal speech quote/);
});
test('NEG: two run-together words in a verse are rejected (word boundaries enforced)', () => {
  const bad = '“I have seen all the works that are doneunder the sun; and behold, all is vanity and a chasing after wind.”';
  assert.throws(() => checkEntry({ ref: 'Ecclesiastes 1:14', text: bad, where: 'bibleRegistry Ecclesiastes 1:14' }),
    /full verse does not match corpus word-for-word/);
});

// ============================================================
//  Fix (1b): no NIV label remains
// ============================================================
test('no (NIV) label remains in the three edited data files', () => {
  for (const f of ['data/qaEngine.js', 'data/prayerEngine.js', 'data/bibleRegistry.js'])
    assert.ok(!read(f).includes('(NIV)'), `${f} still contains a (NIV) label`);
});

// ============================================================
//  Fix (3): internal direct-speech quotes preserved (outer “ ”, inner ‘ ’)
// ============================================================
test('qaEngine keeps internal direct-speech quotes as nested single quotes', () => {
  const s = read('data/qaEngine.js');
  const nested = [
    '“Jesus answered her, ‘Everyone who drinks',
    '“Jesus said to him, ‘I am the way, the truth, and the life. No one comes to the Father, except through me.’”',
    '“Jesus said to her, ‘I am the resurrection and the life.',
    '“Again, therefore, Jesus spoke to them, saying, ‘I am the light of the world.',
    '‘Lord, how often shall my brother sin against me, and I forgive him? Until seven times?’ Jesus said to him, ‘I don’t tell you until seven times, but, until seventy times seven.’',
  ];
  for (const frag of nested) assert.ok(s.includes(frag), `missing nested-quote form: ${frag.slice(0, 40)}…`);
  assert.ok(!s.includes('said to him, I am the way'), 'John 14:6 lost its speech quote');
  assert.ok(!s.includes('spoke to them, saying, I am the light'), 'John 8:12 lost its speech quote');
});

// ============================================================
//  Fix (2): Q&A explanation/nextStep prose agrees with the WEB verse it cites
// ============================================================
test('Matthew 18 explanation matches its WEB verse (seventy times seven)', () => {
  const s = read('data/qaEngine.js');
  assert.ok(!s.includes('seventy-seven'), 'explanation still says "seventy-seven"');
  assert.ok(s.includes('“seventy times seven”'), 'explanation should quote WEB “seventy times seven”');
});

test('inline Scripture quotes in Q&A prose use WEB wording, not NIV', () => {
  const s = read('data/qaEngine.js');
  for (const frag of [
    '“wipe away every tear from their eyes” (Rev 21:4)',
    '“In the world you have trouble; but cheer up! I have overcome the world” (John 16:33)',
    '“God commends his own love toward us, in that while we were yet sinners, Christ died for us” (Romans 5:8)',
    '“I will not leave you orphans,”',
    '“I am with you always, even to the end of the age” (Matthew 28:20)',
    '“Vengeance belongs to me; I will repay” (Rom 12:19)',
    '“has also set eternity in their hearts.”',
  ]) assert.ok(s.includes(frag), `missing WEB inline quote: ${frag}`);
  for (const frag of [
    'wipe every tear from their eyes',
    'in this world you will have trouble. But take heart',
    'demonstrates his own love for us in this',
    'leave you as orphans',
    'to the very end of the age',
    'It is mine to avenge',
  ]) assert.ok(!s.includes(frag), `NIV inline quote still present: ${frag}`);
});

// ============================================================
//  Fix (5)/(2): Worker Origin gate, CORS preflight, upstream protection
// ============================================================
const env = {
  ANTHROPIC_API_KEY: 'test-only-not-a-real-key',
  PRAYER_RATE_LIMITER: { limit: async () => ({ success: true }) },
  SCRIPTURE_ASSETS: { fetch: async () => new Response(JSON.stringify({ '35': 'Jesus wept.' })) },
};
const modelData = { crisis: false, understanding: 'I hear you.', verses: [{ book: 'JHN', chapter: 11, verseStart: 35 }], explanation: 'Jesus shares our grief.', prayer: 'God, comfort them.', encouragement: 'Reach out to a friend.', safety: '' };
const upstreamOk = () => new Response(JSON.stringify({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(modelData) }] }));
const ALLOWED = 'https://lightoflifebible.org';
const req = (origin) => {
  const headers = { 'Content-Type': 'application/json' };
  if (origin !== undefined) headers.Origin = origin;
  return new Request('https://worker.test', { method: 'POST', headers, body: JSON.stringify({ input: 'Please pray for my grief', lang: 'en' }) });
};
const optionsReq = (origin) => {
  const headers = { 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type' };
  if (origin !== undefined) headers.Origin = origin;
  return new Request('https://worker.test', { method: 'OPTIONS', headers });
};
// Shared browser-preflight header contract. Used by the real test AND the negative test.
function assertCorsPreflightHeaders(headers, origin) {
  assert.equal(headers.get('Access-Control-Allow-Origin'), origin, 'Access-Control-Allow-Origin mismatch');
  assert.match(headers.get('Access-Control-Allow-Methods') || '', /\bPOST\b/, 'Access-Control-Allow-Methods must include POST');
  assert.match(headers.get('Access-Control-Allow-Headers') || '', /content-type/i, 'Access-Control-Allow-Headers must include Content-Type');
}

test('allowed Origin POST returns a real 200 success with the expected body', async () => {
  let called = 0; globalThis.fetch = async () => { called++; return upstreamOk(); };
  const res = await worker.fetch(req(ALLOWED), env);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.crisis, false);
  assert.ok(body.understanding && body.prayer && body.encouragement, 'success body missing fields');
  assert.equal(body.verses[0].text, 'Jesus wept.');
  assert.equal(called, 1, 'upstream should be called exactly once on success');
});

for (const [label, origin] of [['missing', undefined], ['empty', ''], ['null-literal', 'null'], ['disallowed', 'https://evil.test']]) {
  test(`Origin ${label} → 403 origin_denied and upstream is NOT called`, async () => {
    let called = 0; globalThis.fetch = async () => { called++; return upstreamOk(); };
    const res = await worker.fetch(req(origin), env);
    assert.equal(res.status, 403);
    assert.equal((await res.json()).error, 'origin_denied');
    assert.equal(called, 0, 'a rejected request must never reach Anthropic upstream');
  });
}

test('browser OPTIONS preflight from an allowed Origin → 204 with full CORS headers', async () => {
  const res = await worker.fetch(optionsReq(ALLOWED), env);
  assert.equal(res.status, 204);
  assertCorsPreflightHeaders(res.headers, ALLOWED); // checks ACAO + ACAM(POST) + ACAH(Content-Type)
});

test('OPTIONS preflight from a disallowed / missing Origin → 403 (never 204)', async () => {
  assert.equal((await worker.fetch(optionsReq('https://evil.test'), env)).status, 403);
  assert.equal((await worker.fetch(optionsReq(undefined), env)).status, 403);
});

test('NEG: CORS check fails if Access-Control-Allow-Headers omits Content-Type', () => {
  // Simulates the worker being mis-reconfigured to drop Content-Type from the allow-list.
  const missing = new Headers({ 'Access-Control-Allow-Origin': ALLOWED, 'Access-Control-Allow-Methods': 'POST, OPTIONS' });
  assert.throws(() => assertCorsPreflightHeaders(missing, ALLOWED), /Access-Control-Allow-Headers must include Content-Type/);
  // Sanity: the real worker response does satisfy the contract.
});
