/* ============================================================
   prayer-care.js — Prayer Sanctuary Board · 圣经代祷关怀舱
   ------------------------------------------------------------
   Vanilla ES-module equivalent of a <PrayerCarePanel /> component
   (this site is static HTML with native ES modules — no React /
   build step — so the reusable unit is a mount function, not a
   .jsx file).

   Exports:
     mountPrayerCare(container)          — the standalone panel
     renderPrayerBoard(target, resp,     — render a Prayer Sanctuary
        lang, opts)                        Board into ANY element (also
                                           used by the Biblical Q&A
                                           prayer-intercept)

   A quiet spiritual care room, not a chatbot. The board reveals
   gently with a sequential typewriter effect (title → scripture →
   prayer), and — when a prayer is active — a soft, looping, LOCAL
   worship-ambient track plays if present (never streamed from the
   internet, never speech synthesis). A visible pause control and a
   close gate keep it fully in the reader's hands.

   Language is never mixed inside a card: the whole board renders in
   the page's current language (zh or en).
   ============================================================ */

import { getPrayerResponse, resolvePrayerById } from '../data/prayerEngine.js';

const UI = {
  zh: {
    eyebrow: '圣经代祷关怀舱 · 安静的代祷',
    title: '用圣经为我祷告',
    subtitle: '把此刻真实的重担带到神面前，让神的话语引导一段安静的祷告。',
    inputLabel: '你此刻想为什么祷告?',
    placeholder: '例如：请为我的婚姻祷告；请为我的未来祷告；请为我的孩子祷告...',
    submitButton: '为我祷告',
    guided: '也可以从这里开始:',
    scriptureLabel: '相关经文', prayerLabel: '祷告',
    narrationReady: '真人女声祷告', narrationInProduction: '真人祷告朗读正在制作中',
    narrationAi: 'AI 女声朗读 · 真人版制作中', ttsListen: '朗读祷告', ttsStop: '停止朗读',
    ambientReady: '安静祷告背景', ambientPlay: '播放', ambientPause: '暂停',
    close: '关闭祷告'
  },
  en: {
    eyebrow: 'Prayer Sanctuary Board · a quiet intercession',
    title: 'Pray with Scripture',
    subtitle: 'Bring your real burden before God, and let Scripture guide a quiet prayer.',
    inputLabel: 'What would you like prayer for?',
    placeholder: 'For example: Please pray for my marriage; please pray for my future; please pray for my child...',
    submitButton: 'Pray for Me',
    guided: 'You can also begin here:',
    scriptureLabel: 'Scripture', prayerLabel: 'Prayer',
    narrationReady: 'Human female prayer narration', narrationInProduction: 'Human prayer narration is in production',
    narrationAi: 'AI narration · human recording in production', ttsListen: 'Read the prayer aloud', ttsStop: 'Stop',
    ambientReady: 'Quiet prayer background', ambientPlay: 'Play', ambientPause: 'Pause',
    close: 'Close Prayer'
  }
};

const GUIDED = [
  { zh: '请为我的婚姻祷告', en: 'Please pray for my marriage' },
  { zh: '请为我的未来祷告', en: 'Please pray for my future' },
  { zh: '请为我的孩子祷告', en: 'Please pray for my child' },
  { zh: '请为我焦虑睡不着祷告', en: 'Please pray for my anxiety' }
];

const PROBE_MS = 2500;    // how long to wait for an MP3 before showing the calm state
const AMBIENT_VOL = 0.30; // soft by default

const CSS = `
.pray-root{--pr-bg:#1b1e24;--pr-bg2:#22262e;--pr-ink:#ece7dd;--pr-muted:#9a948a;--pr-faint:#6f6a62;
  --pr-sun:#d9a441;--pr-sun2:#e8c77e;--pr-line:rgba(217,164,65,.22);--pr-soft:rgba(236,231,221,.10);--pr-warn:#e0855b;
  font-family:Georgia,"Times New Roman","Songti SC","Noto Serif SC",serif;color:var(--pr-ink);
  max-width:760px;margin:0 auto;box-sizing:border-box}
.pray-root *{box-sizing:border-box}
.pray-head{text-align:center;margin-bottom:22px}
.pray-eyebrow{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--pr-sun);margin-bottom:10px}
.pray-title{font-size:clamp(22px,4vw,30px);line-height:1.25;color:var(--pr-ink);font-weight:400;margin:0}
.pray-sub{margin-top:12px;font-size:15px;color:var(--pr-muted);line-height:1.7}
.pray-box{background:var(--pr-bg);border:1px solid var(--pr-line);border-radius:12px;padding:24px 22px;
  box-shadow:0 14px 40px rgba(0,0,0,.22);position:relative}
.pray-box::before{content:"";position:absolute;top:-1px;left:22px;right:22px;height:1px;
  background:linear-gradient(90deg,transparent,var(--pr-sun),transparent);opacity:.5}
.pray-label{font-size:14.5px;color:var(--pr-sun2);letter-spacing:.02em;margin-bottom:11px}
.pray-inputwrap{position:relative}
.pray-input{width:100%;background:#14161a;border:1px solid var(--pr-line);border-radius:8px;color:var(--pr-ink);
  font-family:inherit;font-size:16px;line-height:1.6;padding:13px 44px 13px 14px;resize:vertical;min-height:76px;display:block}
.pray-input:focus{outline:none;border-color:var(--pr-sun)}
.pray-clear{position:absolute;top:6px;right:6px;display:none;align-items:center;justify-content:center;
  width:22px;height:22px;padding:9px;box-sizing:content-box;background:transparent;border:none;border-radius:50%;
  color:var(--pr-muted);font-size:19px;line-height:1;cursor:pointer;font-family:inherit;transition:color .2s}
.pray-clear.show{display:inline-flex}
.pray-clear:hover{color:var(--pr-sun2)}
.pray-clear:focus-visible{outline:2px solid var(--pr-sun);outline-offset:1px}
.pray-go{margin-top:13px;display:flex;justify-content:flex-end}
.pray-btn{background:var(--pr-sun);color:#14161a;border:none;border-radius:30px;cursor:pointer;font-family:inherit;
  font-weight:700;padding:12px 30px;font-size:15px;letter-spacing:.03em;transition:background .2s}
.pray-btn:hover{background:var(--pr-sun2)}
.pray-guided{margin-top:20px}
.pray-guided .g-hint{font-size:12.5px;color:var(--pr-faint);letter-spacing:.05em;margin-bottom:10px}
.pray-chips{display:flex;flex-wrap:wrap;gap:8px}
.pray-chip{font-size:13.5px;color:var(--pr-muted);border:1px solid var(--pr-soft);border-radius:30px;padding:8px 15px;
  cursor:pointer;background:#14161a;font-family:inherit;transition:all .2s;line-height:1.4;text-align:left}
.pray-chip:hover{border-color:var(--pr-sun);color:var(--pr-sun2);background:rgba(217,164,65,.06)}
.pray-answer{margin-top:22px}
.pray-card{background:var(--pr-bg2);border:1px solid var(--pr-soft);border-radius:12px;padding:26px 24px;animation:prRise .5s ease}
@keyframes prRise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.pray-card.crisis{background:rgba(224,133,91,.10);border:1px solid rgba(224,133,91,.5)}
.pray-ctitle{font-size:20px;color:var(--pr-sun2);font-weight:600;margin-bottom:18px;line-height:1.35;text-align:center;min-height:1.35em}
.pray-card.crisis .pray-ctitle{color:var(--pr-warn)}
.pray-sect{margin-top:18px}
.pray-slabel{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--pr-sun);opacity:.9;margin-bottom:8px}
.pray-verse{border-left:2px solid var(--pr-sun);padding:4px 0 4px 15px;font-size:16px;line-height:1.72;color:var(--pr-ink);min-height:1.72em}
.pray-body{font-size:15.5px;color:var(--pr-sun2);line-height:1.85;font-style:italic;white-space:pre-line;min-height:1.85em}
/* the typing caret — a soft gold pulse while a block is being revealed */
.pray-typing::after{content:"▍";color:var(--pr-sun);margin-left:1px;animation:prCaret 1s steps(1) infinite;opacity:.6}
@keyframes prCaret{50%{opacity:0}}
.pray-tail{margin-top:22px;opacity:0;transition:opacity .6s ease}
.pray-audiowrap{padding-top:18px;border-top:1px solid var(--pr-soft)}
.pray-audio{display:flex;flex-direction:column;gap:12px;align-items:center;text-align:center}
.pray-badge{display:inline-block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-style:normal;
  color:var(--pr-faint);border:1px solid var(--pr-soft);border-radius:30px;padding:5px 14px}
.pray-badge.ready{color:#14161a;background:var(--pr-sun);border-color:var(--pr-sun)}
.pray-player{width:100%;max-width:420px;height:38px;filter:saturate(.85) brightness(.95)}
.pray-ambient{display:flex;align-items:center;justify-content:center;margin-top:14px}
.pray-ambient-btn{display:inline-flex;align-items:center;gap:8px;background:#14161a;border:1px solid var(--pr-line);
  color:var(--pr-sun2);border-radius:30px;padding:8px 16px;font-family:inherit;font-size:13px;letter-spacing:.03em;
  cursor:pointer;transition:all .2s}
.pray-ambient-btn:hover{border-color:var(--pr-sun);background:rgba(217,164,65,.06)}
.pray-ambient-btn .ic{font-size:11px}
.pray-close{margin-top:22px;text-align:center}
.pray-close-btn{background:transparent;border:1px solid var(--pr-soft);color:var(--pr-muted);border-radius:30px;
  padding:9px 22px;font-family:inherit;font-size:13.5px;letter-spacing:.04em;cursor:pointer;transition:all .2s}
.pray-close-btn:hover{border-color:var(--pr-sun);color:var(--pr-sun2)}
@media(max-width:540px){.pray-box{padding:20px 16px}.pray-card{padding:22px 17px}}
@media(prefers-reduced-motion:reduce){.pray-card{animation:none}.pray-typing::after{display:none}}
`;

function injectStyles() {
  if (document.getElementById('prayer-styles')) return;
  const s = document.createElement('style');
  s.id = 'prayer-styles';
  s.textContent = CSS;
  document.head.appendChild(s);
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function reduceMotion() {
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

function detectLangFrom(opts) {
  if (opts && typeof opts.getLang === 'function') {
    const g = opts.getLang();
    if (g === 'zh' || g === 'en') return g;
  }
  if (document.body.classList.contains('lang-zh')) return 'zh';
  const hl = (document.documentElement.lang || '').toLowerCase();
  if (hl.indexOf('zh') === 0) return 'zh';
  if (hl.indexOf('en') === 0) return 'en';
  try { const s = localStorage.getItem('bible_lang'); if (s === 'zh' || s === 'en') return s; } catch (e) {}
  return 'zh';
}

function smoothScroll(node) {
  if (!node) return;
  node.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'nearest' });
}

/* Resolve to an <audio> element ONLY if the local file truly loads; else null.
   No speech synthesis, no external/streamed audio — same-origin static MP3 only. */
function probeAudio(path) {
  return new Promise((res) => {
    const a = new Audio();
    let done = false;
    const ok = () => { if (!done) { done = true; res(a); } };
    a.preload = 'metadata';
    a.oncanplay = ok;
    a.onloadedmetadata = ok;
    a.onerror = () => { if (!done) { done = true; res(null); } };
    a.src = path;
    setTimeout(() => { if (!done) { done = true; res(null); } }, PROBE_MS);
  });
}

/* ---- one soft ambient track plays at a time across the whole page ---- */
let _activeAmbient = null;
function stopActiveAmbient() {
  if (_activeAmbient) { try { _activeAmbient.pause(); _activeAmbient.currentTime = 0; } catch (e) {} _activeAmbient = null; }
}

/* ---- TTS fallback (spoken prayer) — used ONLY when no real MP3 is present.
   A real recording at audio/prayers/<topic>-<lang>.mp3 always wins and auto-upgrades. */
function ttsSupported() { return ('speechSynthesis' in window) && ('SpeechSynthesisUtterance' in window); }
function pickPrayerVoice(lang) {
  try {
    const vs = window.speechSynthesis.getVoices() || [];
    const want = lang === 'zh' ? 'zh' : 'en';
    const pool = vs.filter((v) => (v.lang || '').toLowerCase().indexOf(want) === 0);
    if (!pool.length) return null;                 // never assign a wrong-language voice (keeps EN from going silent)
    const fem = pool.filter((v) => /female|zira|huihui|tingting|xiaoxiao|yaoyao|hanhan|mei|susan|linda|hazel|aria|jenny/i.test(v.name || ''));
    return fem[0] || pool[0];
  } catch (e) { return null; }
}
function stopActiveSpeech() {
  if (ttsSupported()) { try { window.speechSynthesis.cancel(); } catch (e) {} }
}
/* Speak an ordered list of text segments, one utterance each, then call done(). */
function speakSegments(segments, lang, onDone) {
  stopActiveSpeech();
  const voice = pickPrayerVoice(lang);
  const list = (segments || []).filter(Boolean);
  let i = 0;
  (function next() {
    if (i >= list.length) { onDone && onDone(); return; }
    const u = new SpeechSynthesisUtterance(list[i]);
    u.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
    if (voice) u.voice = voice;
    u.rate = 0.9;
    u.onend = () => { i++; next(); };
    u.onerror = () => { i++; next(); };
    window.speechSynthesis.speak(u);
  })();
}

/* ---- render bookkeeping: each board render gets a token stamped on its target
   so a superseded typewriter / audio probe never writes into a newer board ---- */
let _gen = 0;

/* Gentle sequential typewriter. Types `text` into `el` within ~totalMs (speed is
   bounded so long prayers stay snappy), then calls done(). Reduced-motion or a
   superseded render fills instantly. */
function typeInto(target, token, el, text, totalMs, done) {
  text = text || '';
  if (reduceMotion() || !text) { el.textContent = text; done && done(); return; }
  const n = text.length;
  const per = Math.max(8, Math.min(26, totalMs / n));
  el.classList.add('pray-typing');
  let i = 0;
  (function step() {
    if (target.dataset.prayerGen !== token) { el.classList.remove('pray-typing'); return; }
    i++;
    el.textContent = text.slice(0, i);
    if (i < n) { setTimeout(step, per); }
    else { el.classList.remove('pray-typing'); done && done(); }
  })();
}

function mountNarration(slot, path, lang, target, token, speakText) {
  const t = UI[lang];
  slot.innerHTML = `<div class="pray-audio"><span class="pray-badge">${esc(t.narrationInProduction)}</span></div>`;
  probeAudio(path).then((audio) => {
    if (target.dataset.prayerGen !== token || !slot.isConnected) return;
    if (audio) {
      // Real human-voice MP3 present → play it (wins over TTS).
      slot.innerHTML = `<div class="pray-audio"><span class="pray-badge ready">${esc(t.narrationReady)}</span></div>`;
      audio.className = 'pray-player';
      audio.controls = true; // spoken narration does not loop
      slot.querySelector('.pray-audio').appendChild(audio);
      return;
    }
    // No MP3 yet → synthetic female voice so the prayer can be heard now.
    if (!ttsSupported() || !(speakText && speakText.length)) return; // keep the calm "in production" badge
    slot.innerHTML = `<div class="pray-audio"><span class="pray-badge">${esc(t.narrationAi)}</span>` +
      `<button type="button" class="pray-ambient-btn" data-el="ttsbtn"><span class="ic">▷</span><span data-el="ttslabel">${esc(t.ttsListen)}</span></button></div>`;
    const btn = slot.querySelector('[data-el="ttsbtn"]');
    const lbl = slot.querySelector('[data-el="ttslabel"]');
    const ic = btn.querySelector('.ic');
    let speaking = false;
    const reset = () => { speaking = false; lbl.textContent = t.ttsListen; ic.textContent = '▷'; };
    btn.addEventListener('click', () => {
      if (speaking) { stopActiveSpeech(); reset(); return; }
      speaking = true; lbl.textContent = t.ttsStop; ic.textContent = '❚❚';
      speakSegments(speakText, lang, () => { if (slot.isConnected && target.dataset.prayerGen === token) reset(); });
    });
  });
}

/* Soft worship-ambient: LOCAL looping track. Auto-starts (it follows the submit
   gesture, so browsers allow it) at a soft volume while the prayer is active, with
   a visible pause/resume control. Absent file → silent, no control, no error. */
function mountAmbient(slot, path, lang, target, token) {
  if (!path) return;
  const t = UI[lang];
  probeAudio(path).then((audio) => {
    if (!audio || target.dataset.prayerGen !== token || !slot.isConnected) return;
    audio.loop = true;
    audio.volume = AMBIENT_VOL;
    stopActiveAmbient();
    _activeAmbient = audio;
    audio.play().catch(() => {}); // if the browser declines, the control still lets the reader start it
    const row = document.createElement('div');
    row.className = 'pray-ambient';
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pray-ambient-btn';
    const label = () => `<span class="ic">${audio.paused ? '▷' : '❚❚'}</span>` +
      `<span>${esc(t.ambientReady)} · ${esc(audio.paused ? t.ambientPlay : t.ambientPause)}</span>`;
    b.innerHTML = label();
    b.addEventListener('click', () => {
      if (audio.paused) { stopActiveAmbient(); _activeAmbient = audio; audio.play().catch(() => {}); }
      else { audio.pause(); }
      b.innerHTML = label();
    });
    audio.addEventListener('pause', () => { b.innerHTML = label(); });
    audio.addEventListener('play', () => { b.innerHTML = label(); });
    row.appendChild(b);
    slot.appendChild(row);
  });
}

/* Render a Prayer Sanctuary Board (title → scripture → prayer, typed sequentially)
   into `target`. `response` is a resolved prayer object from the engine. `opts`:
     onClose()  — called after the reader closes the board (host may restore state). */
export function renderPrayerBoard(target, response, lang, opts) {
  if (!target || !response) return;
  opts = opts || {};
  injectStyles();
  const L = lang === 'en' ? 'en' : 'zh';
  const t = UI[L];
  const r = response;
  const crisis = r.id === 'crisis';
  const token = String(++_gen);
  target.dataset.prayerGen = token;
  stopActiveAmbient();
  stopActiveSpeech();

  const path = L === 'en' ? r.audioPathEn : r.audioPathZh;
  const ambientPath = L === 'en' ? r.ambientPathEn : r.ambientPathZh;

  target.innerHTML = `
    <div class="pray-card${crisis ? ' crisis' : ''}">
      <div class="pray-ctitle" data-el="ttl"></div>
      <div class="pray-sect"><div class="pray-slabel">${esc(t.scriptureLabel)}</div><div class="pray-verse" data-el="scr"></div></div>
      <div class="pray-sect"><div class="pray-slabel">${esc(t.prayerLabel)}</div><div class="pray-body" data-el="bdy"></div></div>
      <div class="pray-tail" data-el="tail">
        ${crisis ? '' : `<div class="pray-audiowrap" data-el="narration"></div>`}
        ${ambientPath ? `<div data-el="ambient"></div>` : ''}
        <div class="pray-close"><button type="button" class="pray-close-btn" data-el="close">${esc(t.close)}</button></div>
      </div>
    </div>`;

  const pick = (n) => target.querySelector(`[data-el="${n}"]`);
  const ttl = pick('ttl'), scr = pick('scr'), bdy = pick('bdy'), tail = pick('tail');

  function closeBoard() {
    stopActiveAmbient();
    stopActiveSpeech();
    if (target.dataset.prayerGen === token) { target.dataset.prayerGen = ''; target.innerHTML = ''; }
    if (typeof opts.onClose === 'function') opts.onClose();
  }
  function revealTail() {
    if (target.dataset.prayerGen !== token) return;
    tail.style.opacity = '1';
    const nslot = pick('narration');
    if (nslot) mountNarration(nslot, path, L, target, token, [r.scripture, r.prayerBody]);
    if (ambientPath) mountAmbient(pick('ambient'), ambientPath, L, target, token); // auto-plays the soft loop
    const cb = pick('close');
    if (cb) cb.addEventListener('click', closeBoard);
  }

  if (crisis) {
    // Help must be immediate — no typewriter, no music for a crisis card.
    ttl.textContent = r.title; scr.textContent = r.scripture; bdy.textContent = r.prayerBody;
    tail.style.opacity = '1';
    const cb = pick('close'); if (cb) cb.addEventListener('click', closeBoard);
  } else {
    typeInto(target, token, ttl, r.title, 600, () =>
      typeInto(target, token, scr, r.scripture, 1100, () =>
        typeInto(target, token, bdy, r.prayerBody, 1600, revealTail)));
  }
  smoothScroll(target.querySelector('.pray-card'));
  return { close: closeBoard };
}

export function mountPrayerCare(container, opts) {
  if (!container) return;
  opts = opts || {};
  injectStyles();

  let lastRequest = null;
  let lastId = null;

  container.classList.add('pray-root');
  container.innerHTML = `
    <div class="pray-head">
      <div class="pray-eyebrow" data-k="eyebrow"></div>
      <h2 class="pray-title" data-k="title"></h2>
      <p class="pray-sub" data-k="subtitle"></p>
    </div>
    <div class="pray-box">
      <div class="pray-label" data-k="inputLabel"></div>
      <div class="pray-inputwrap">
        <textarea class="pray-input" data-el="input" rows="3"></textarea>
        <button type="button" class="pray-clear" data-el="clear" aria-label="Clear">×</button>
      </div>
      <div class="pray-go"><button class="pray-btn" data-el="btn"></button></div>
      <div class="pray-guided">
        <div class="g-hint" data-k="guided"></div>
        <div class="pray-chips" data-el="chips"></div>
      </div>
    </div>
    <div class="pray-answer" data-el="answer" aria-live="polite"></div>
  `;

  const el = (n) => container.querySelector(`[data-el="${n}"]`);
  const input = el('input'), btn = el('btn'), chips = el('chips'), answer = el('answer'), clearBtn = el('clear');

  function updateClear() { clearBtn.classList.toggle('show', !!(input.value && input.value.trim())); }
  input.addEventListener('input', updateClear);
  clearBtn.addEventListener('click', () => { input.value = ''; updateClear(); input.focus(); });

  function boardOpts() {
    return { onClose: () => { lastId = null; lastRequest = null; input.value = ''; updateClear(); input.focus(); } };
  }

  function pray(q) {
    const lang = detectLangFrom(opts);
    const request = (q != null ? q : input.value || '').trim();
    if (!request) return;
    lastRequest = request;
    const r = getPrayerResponse(request, lang);
    lastId = r.id;
    renderPrayerBoard(answer, r, lang, boardOpts());
  }

  function renderChrome() {
    const lang = detectLangFrom(opts);
    const t = UI[lang];
    container.querySelectorAll('[data-k]').forEach((n) => {
      const k = n.dataset.k;
      n.textContent = t[k] || '';
    });
    input.placeholder = t.placeholder;
    btn.textContent = t.submitButton;
    clearBtn.setAttribute('aria-label', lang === 'zh' ? '清除' : 'Clear');
    updateClear();
    chips.innerHTML = '';
    GUIDED.forEach((g) => {
      const b = document.createElement('button');
      b.className = 'pray-chip';
      b.type = 'button';
      b.textContent = lang === 'zh' ? g.zh : g.en;
      b.addEventListener('click', () => { input.value = b.textContent; updateClear(); pray(b.textContent); });
      chips.appendChild(b);
    });
    // re-render the current prayer in the new language (same prayer id, re-typed)
    if (lastId) renderPrayerBoard(answer, resolvePrayerById(lastId, lang), lang, boardOpts());
  }

  btn.addEventListener('click', () => pray());
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); pray(); }
  });

  renderChrome();

  let deb = 0;
  const obs = new MutationObserver(() => {
    clearTimeout(deb);
    deb = setTimeout(renderChrome, 0);
  });
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  return { rerender: renderChrome, pray };
}
