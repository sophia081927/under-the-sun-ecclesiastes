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
    input: String(input || '').slice(0, 1000),
    lang: lang === 'en' ? 'en' : 'zh',
  };
  let res;
  try {
    res = await fetch(String(PRAYER_API_ENDPOINT).trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: opts.signal,
    });
  } catch (e) {
    if (e && e.name === 'AbortError') throw fail('aborted');
    throw fail('network');
  }
  if (!res.ok) {
    let code = 'http_' + res.status;
    try { const d = await res.json(); if (d && d.error) code = d.error; } catch (e) {}
    throw fail(code);
  }
  let data;
  try { data = await res.json(); } catch (e) { throw fail('parse'); }
  if (!data || !data.prayer || !Array.isArray(data.verses)) throw fail('format');
  return data;
}
