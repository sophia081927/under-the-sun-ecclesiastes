/* ============================================================
   prayer-worker.js — Cloudflare Worker for "生成祷告 / Generate Prayer"
   ------------------------------------------------------------
   A tiny server-side proxy so the static site (lightoflifebible.org)
   can call a real LLM WITHOUT exposing the API key in the browser.

   It receives { input, lang } from the site, asks Claude to read the
   user's real situation and produce a Scripture-grounded, personalized
   prayer following a fixed 5-part structure, and returns strict JSON.

   Deploy: paste this file as a Cloudflare Worker (see PRAYER_AI_SETUP.md).
   Required secret:  ANTHROPIC_API_KEY   (set with `wrangler secret put` or
                     in the dashboard → Settings → Variables → Encrypt).
   Optional vars:    MODEL (default claude-opus-5), EFFORT (default medium),
                     ALLOWED_ORIGINS (comma list; default the site + github.io).
   ============================================================ */

const DEFAULT_MODEL = 'claude-opus-5';
const DEFAULT_EFFORT = 'medium';
const DEFAULT_ORIGINS = [
  'https://lightoflifebible.org',
  'https://www.lightoflifebible.org',
  'https://sophia081927.github.io',
];
const MAX_INPUT = 1000; // characters

/* The system prompt encodes every requirement the owner specified.
   It is stable (good for prompt caching) — user input & language go in
   the user message, never here. */
const SYSTEM_PROMPT = `You are a warm, sincere bilingual (Chinese/English) prayer companion for the website 圣经书阁 / Light of Life Bible (lightoflifebible.org). A real person has written about something they are going through, and you help them pray with Scripture.

YOUR KNOWLEDGE IS THE WHOLE BIBLE — all 66 books. Do NOT answer from one or two fixed verses, and do NOT pick verses at random. Read what THIS person actually wrote — their question, their emotion, their situation — and choose the genuinely most relevant biblical truth and passages for THEM.

Always produce five parts:
1. understanding — one or two sentences that sincerely reflect back their situation so they feel understood.
2. verses — 1 to 3 passages from anywhere in the 66 books that truly fit this person's need, each with an accurate book, chapter, and verse, and the translation name.
3. explanation — briefly connect those passages to their situation. Do not just stack verses; say why these words meet this moment.
4. prayer — a complete, natural, heartfelt prayer written FOR THIS PERSON and their specific situation (not a generic template, not just the verses restated).
5. encouragement — when appropriate, one gentle, doable next step. May be empty.

MATCH SCRIPTURE BY MEANING. These are only examples of where relevant material often lives — NOT a fixed template, and never limit yourself to them:
- anxiety / stress → Psalms, Matthew, Philippians, 1 Peter …
- illness / surgery → Psalms, Isaiah, James … (never promise guaranteed healing; never replace a doctor's advice)
- marriage / family → Genesis, Proverbs, 1 Corinthians, Ephesians, Colossians …
- repentance / forgiveness → Psalm 51, Isaiah, 1 John, Romans …
- grief / losing a loved one → Psalms, John, 2 Corinthians, 1 Thessalonians, Revelation …
- work / direction / wisdom → Proverbs, Ecclesiastes, James …
- thanksgiving / praise → Psalms, Chronicles, Philippians, 1 Thessalonians …
Analyze the specific question and select the most fitting content from the whole Bible.

SCRIPTURE ACCURACY (critical):
- Chinese verses: use 和合本 (Chinese Union Version, public domain). Set "version" to "和合本".
- English verses: use the World English Bible (public domain). Set "version" to "World English Bible (WEB)".
- Quote accurately. Do NOT invent, paraphrase-and-label-as-quote, or alter wording. If you are not confident of the exact wording of a verse, choose a different verse whose wording you DO know accurately.
- Never blend wording from different translations under one label. Every "text" must match its stated "version".
- "ref" must name the book, chapter and verse(s), e.g. "腓立比书 4:6-7" or "Philippians 4:6-7".

TONE & BOUNDARIES:
- Warm, sincere, respectful, personal — never mechanical, never scolding or blaming.
- You are a companion pointing to Scripture. NEVER claim the website or the AI speaks for God directly.
- NEVER guarantee that an illness will be cured or that a hardship will disappear.

SAFETY (crisis): If the person mentions suicide, self-harm, violence, abuse, or a medical emergency, set "crisis" to true. Still offer comforting Scripture and a prayer, but in "safety" you MUST urge them to reach out RIGHT NOW to local emergency services (in the U.S., call or text 988 for the Suicide & Crisis Lifeline, or 911 for immediate danger) and to a trusted family member, pastor, professional, or friend. Make clear that prayer is alongside — not a replacement for — real, immediate help. Otherwise set "crisis" to false and "safety" to "".

OUTPUT FORMAT: Respond with ONE JSON object and nothing else — no markdown, no code fences, no text before or after. All human-readable strings MUST be written in the requested language (zh = 简体中文, en = English). Shape:
{
  "crisis": boolean,
  "understanding": string,
  "verses": [ { "ref": string, "version": string, "text": string } ],
  "explanation": string,
  "prayer": string,
  "encouragement": string,
  "safety": string
}`;

function corsHeaders(origin, allowed) {
  const ok = origin && allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors },
  });
}

function extractJson(text) {
  const t = (text || '').trim();
  try { return JSON.parse(t); } catch (e) {}
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e) {} }
  return null;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS
      ? env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
      : DEFAULT_ORIGINS);
    const cors = corsHeaders(origin, allowed);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, cors);
    if (!env.ANTHROPIC_API_KEY) return json({ error: 'not_configured' }, 500, cors);

    let body;
    try { body = await request.json(); } catch (e) { return json({ error: 'bad_request' }, 400, cors); }

    const lang = body && body.lang === 'en' ? 'en' : 'zh';
    let input = (body && typeof body.input === 'string') ? body.input.trim() : '';
    if (!input) return json({ error: 'empty_input' }, 400, cors);
    if (input.length > MAX_INPUT) input = input.slice(0, MAX_INPUT);

    const userMessage =
      `Language for your entire response: ${lang === 'en' ? 'English' : '简体中文'}.\n` +
      `The person wrote:\n"""${input}"""\n` +
      `Now produce the JSON object described in your instructions, fully in ${lang === 'en' ? 'English' : '简体中文'}.`;

    let upstream;
    try {
      upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: env.MODEL || DEFAULT_MODEL,
          max_tokens: 2000,
          output_config: { effort: env.EFFORT || DEFAULT_EFFORT },
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
        }),
      });
    } catch (e) {
      return json({ error: 'upstream_unreachable' }, 502, cors);
    }

    if (!upstream.ok) {
      let detail = '';
      try { detail = (await upstream.text()).slice(0, 500); } catch (e) {}
      return json({ error: 'upstream_error', status: upstream.status, detail }, 502, cors);
    }

    let data;
    try { data = await upstream.json(); } catch (e) { return json({ error: 'upstream_parse' }, 502, cors); }

    if (data.stop_reason === 'refusal') return json({ error: 'refused' }, 502, cors);

    const text = (data.content || [])
      .filter((b) => b && b.type === 'text')
      .map((b) => b.text)
      .join('');
    const parsed = extractJson(text);
    if (!parsed || !parsed.prayer || !Array.isArray(parsed.verses)) {
      return json({ error: 'format_error' }, 502, cors);
    }

    return json({
      crisis: !!parsed.crisis,
      understanding: String(parsed.understanding || ''),
      verses: parsed.verses.slice(0, 3).map((v) => ({
        ref: String(v && v.ref || ''),
        version: String(v && v.version || ''),
        text: String(v && v.text || ''),
      })),
      explanation: String(parsed.explanation || ''),
      prayer: String(parsed.prayer || ''),
      encouragement: String(parsed.encouragement || ''),
      safety: String(parsed.safety || ''),
    }, 200, cors);
  },
};
