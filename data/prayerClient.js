import { validPrayer } from './prayerSchema.js';
/* prayerClient.js — talks to the prayer Worker.
   ------------------------------------------------------------
   Sends the reader's real words to the server-side proxy (which calls Claude)
   and returns a structured 5-part prayer. On ANY failure it throws a typed
   error (err.code) — the UI shows an honest failure, never a fake success. */
import { PRAYER_API_ENDPOINT } from './prayerConfig.js';

export function prayerApiConfigured() {
  return !!(PRAYER_API_ENDPOINT && String(PRAYER_API_ENDPOINT).trim());
}

function fail(code) { const e = new Error(code); e.code = code; return e; }

export async function requestAIPrayer(input, lang, opts) {
  opts = opts || {};
  if (!prayerApiConfigured()) throw fail('not_configured');
  const payload = {
    input: String(input || '').trim(),
    lang: lang === 'en' ? 'en' : 'zh',
  };
  if (!payload.input) throw fail('empty_input');
  if (payload.input.length > 1000) throw fail('input_too_long');
  const ctrl = new AbortController();
  let timedOut = false;
  const abort = () => ctrl.abort();
  if (opts.signal?.aborted) throw fail('aborted');
  opts.signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(() => { timedOut = true; ctrl.abort(); }, 50000);
  try {
  let res;
  try {
    res = await fetch(String(PRAYER_API_ENDPOINT).trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
  } catch (e) {
    if (ctrl.signal.aborted) throw fail(timedOut ? 'timeout' : 'aborted');
    throw fail('network');
  }
  if (!res.ok) {
    let code = 'http_' + res.status;
    try { const d = await res.json(); if (d && d.error) code = d.error; } catch (e) {}
    throw fail(code);
  }
  let data;
  try { data = await res.json(); } catch (e) { throw fail('parse'); }
  if (!validPrayer(data, payload.lang)) throw fail('format');
  return data;
  } finally { clearTimeout(timer); opts.signal?.removeEventListener('abort', abort); }
}
