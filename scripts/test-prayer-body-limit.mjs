// Phase 2B-2: request-body size hardening for the prayer Worker.
// Verifies the Content-Length pre-check rejects oversized bodies BEFORE reading
// them / calling Anthropic, while the authoritative post-read check still guards
// requests whose Content-Length is missing or untrustworthy. Legit requests pass.
import test from 'node:test'; import assert from 'node:assert/strict';
import worker from '../worker/prayer-worker.js';

const MAX_BODY = 16000;
const ALLOWED = 'https://lightoflifebible.org';
const env = {
  ANTHROPIC_API_KEY: 'test-only-not-a-real-key',
  PRAYER_RATE_LIMITER: { limit: async () => ({ success: true }) },
  SCRIPTURE_ASSETS: { fetch: async () => new Response(JSON.stringify({ '35': 'Jesus wept.' })) },
};
const modelData = { crisis: false, understanding: 'I hear you.', verses: [{ book: 'JHN', chapter: 11, verseStart: 35 }], explanation: 'Jesus shares our grief.', prayer: 'God, comfort them.', encouragement: 'Reach out to a friend.', safety: '' };
const upstreamOk = () => new Response(JSON.stringify({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(modelData) }] }));

// A minimal Request-shaped mock so we control Content-Length exactly (a real
// Request recomputes Content-Length from its body, which would hide the pre-check).
const mockReq = ({ origin = ALLOWED, contentLength, body = JSON.stringify({ input: 'Please pray for my grief', lang: 'en' }), method = 'POST' } = {}) => {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (origin !== undefined) headers.set('Origin', origin);
  if (contentLength !== undefined) headers.set('Content-Length', String(contentLength));
  return { method, headers, text: async () => body };
};

test('oversized Content-Length → 413, body is NEVER read, and upstream is NOT called', async () => {
  let called = 0; globalThis.fetch = async () => { called++; return upstreamOk(); };
  // Count body reads directly: the Content-Length pre-check must short-circuit
  // BEFORE request.text() runs. If someone later moves the pre-check after the
  // body read, bodyReads becomes 1 and this test fails.
  let bodyReads = 0;
  const req = {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json', Origin: ALLOWED, 'Content-Length': String(MAX_BODY + 10000) }),
    text: async () => { bodyReads++; return '{"input":"hi","lang":"en"}'; },
  };
  const res = await worker.fetch(req, env);
  assert.equal(res.status, 413);
  assert.equal((await res.json()).error, 'input_too_long');
  assert.equal(bodyReads, 0, 'oversized body must be rejected before request.text() is ever read');
  assert.equal(called, 0, 'oversized body must never reach Anthropic upstream');
});

test('no Content-Length but actual body over the limit → still 413, upstream NOT called', async () => {
  let called = 0; globalThis.fetch = async () => { called++; return upstreamOk(); };
  const bigBody = '{"input":"' + 'a'.repeat(MAX_BODY + 1) + '","lang":"en"}'; // no Content-Length header set
  const res = await worker.fetch(mockReq({ contentLength: undefined, body: bigBody }), env);
  assert.equal(res.status, 413);
  assert.equal((await res.json()).error, 'input_too_long');
  assert.equal(called, 0, 'post-read length check must still block when Content-Length is absent');
});

test('untrustworthy (non-numeric) Content-Length falls through to the post-read check', async () => {
  let called = 0; globalThis.fetch = async () => { called++; return upstreamOk(); };
  const bigBody = '{"input":"' + 'a'.repeat(MAX_BODY + 1) + '","lang":"en"}';
  const res = await worker.fetch(mockReq({ contentLength: 'not-a-number', body: bigBody }), env);
  assert.equal(res.status, 413);
  assert.equal(called, 0, 'garbage Content-Length must not bypass the post-read check');
});

test('normal legitimate request (small body, honest Content-Length) passes through to a 200', async () => {
  let called = 0; globalThis.fetch = async () => { called++; return upstreamOk(); };
  const body = JSON.stringify({ input: 'Please pray for my grief', lang: 'en' });
  const res = await worker.fetch(mockReq({ contentLength: Buffer.byteLength(body), body }), env);
  assert.equal(res.status, 200);
  const out = await res.json();
  assert.equal(out.verses[0].text, 'Jesus wept.');
  assert.equal(called, 1, 'a legitimate request should call upstream exactly once');
});

test('a real browser-style Request (auto Content-Length) still works end-to-end', async () => {
  let called = 0; globalThis.fetch = async () => { called++; return upstreamOk(); };
  const real = new Request('https://worker.test', {
    method: 'POST',
    headers: { Origin: ALLOWED, 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: 'Please pray for my grief', lang: 'en' }),
  });
  const res = await worker.fetch(real, env);
  assert.equal(res.status, 200);
  assert.equal(called, 1);
});
