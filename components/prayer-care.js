/* ============================================================
   prayer-care.js — Prayer Sanctuary Board · 圣经代祷关怀舱
   ------------------------------------------------------------
   Vanilla ES-module equivalent of a <PrayerCarePanel /> component
   (this site is static HTML with native ES modules — no React /
   build step — so the reusable unit is a mount function, not a
   .jsx file). Drop a container on any page and call
   mountPrayerCare(container).

   Usage:
     import { mountPrayerCare } from './components/prayer-care.js';
     mountPrayerCare(document.getElementById('prayer-care'));

   A quiet spiritual care room, not a chatbot: a person writes what
   they are carrying, and Scripture guides an intercessory prayer,
   revealed gently (title → scripture → prayer).

   Language is never mixed inside a response card: the whole card
   renders in the page's current language (zh or en).

   Audio (all local static MP3, never speech synthesis):
     • Human female prayer narration — plays through the standard
       HTML5 <audio> player if the MP3 exists; otherwise a calm
       "human prayer narration in production" line is shown.
     • Soft prayer-sanctuary background music — OPTIONAL and fully
       user-controlled. Never autoplays; starts only on a tap, plays
       softly, loops. If the ambient file is absent the card is simply
       silent (no control, no error).
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
    loading: '正在用圣经的话为你预备一段祷告……',
    guided: '也可以从这里开始:',
    scriptureLabel: '相关经文', prayerLabel: '祷告',
    narrationReady: '真人女声祷告', narrationInProduction: '真人祷告朗读正在制作中',
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
    loading: 'Preparing a prayer for you from Scripture...',
    guided: 'You can also begin here:',
    scriptureLabel: 'Scripture', prayerLabel: 'Prayer',
    narrationReady: 'Human female prayer narration', narrationInProduction: 'Human prayer narration is in production',
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

const LOADING_MS = 700;   // brief, reverent pause; crisis responses skip this entirely
const PROBE_MS = 2500;    // how long to wait for an MP3 before showing the calm state
const AMBIENT_VOL = 0.32; // soft by default

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
.pray-card{background:var(--pr-bg2);border:1px solid var(--pr-soft);border-radius:12px;padding:26px 24px;animation:prRise .45s ease}
@keyframes prRise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.pray-card.crisis{background:rgba(224,133,91,.10);border:1px solid rgba(224,133,91,.5)}
.pray-qecho{font-size:14px;color:var(--pr-faint);font-style:italic;border-left:2px solid var(--pr-line);padding-left:12px;margin-bottom:18px;line-height:1.6}
.pray-ctitle{font-size:20px;color:var(--pr-sun2);font-weight:600;margin-bottom:18px;line-height:1.35;text-align:center}
.pray-card.crisis .pray-ctitle{color:var(--pr-warn)}
.pray-sect{margin-top:18px}
.pray-slabel{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--pr-sun);opacity:.9;margin-bottom:8px}
.pray-verse{border-left:2px solid var(--pr-sun);padding:4px 0 4px 15px;font-size:16px;line-height:1.72;color:var(--pr-ink)}
.pray-body{font-size:15.5px;color:var(--pr-sun2);line-height:1.85;font-style:italic;white-space:pre-line}
/* staged reveal — gentle, devotional; opacity+transform only so mobile never reflows */
.pray-reveal{opacity:0;transform:translateY(6px);animation:prReveal .5s ease forwards}
@keyframes prReveal{to{opacity:1;transform:none}}
.pray-audiowrap{margin-top:22px;padding-top:18px;border-top:1px solid var(--pr-soft)}
.pray-audio{display:flex;flex-direction:column;gap:12px;align-items:center;text-align:center}
.pray-badge{display:inline-block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-style:normal;
  color:var(--pr-faint);border:1px solid var(--pr-soft);border-radius:30px;padding:5px 14px}
.pray-badge.ready{color:#14161a;background:var(--pr-sun);border-color:var(--pr-sun)}
.pray-msg{font-size:13.5px;color:var(--pr-muted);letter-spacing:.02em;line-height:1.6}
.pray-player{width:100%;max-width:420px;height:38px;filter:saturate(.85) brightness(.95)}
.pray-ambient{display:flex;align-items:center;gap:9px;margin-top:4px}
.pray-ambient-btn{display:inline-flex;align-items:center;gap:8px;background:#14161a;border:1px solid var(--pr-line);
  color:var(--pr-sun2);border-radius:30px;padding:8px 16px;font-family:inherit;font-size:13px;letter-spacing:.03em;
  cursor:pointer;transition:all .2s}
.pray-ambient-btn:hover{border-color:var(--pr-sun);background:rgba(217,164,65,.06)}
.pray-ambient-btn .ic{font-size:11px}
.pray-close{margin-top:22px;text-align:center}
.pray-close-btn{background:transparent;border:1px solid var(--pr-soft);color:var(--pr-muted);border-radius:30px;
  padding:9px 22px;font-family:inherit;font-size:13.5px;letter-spacing:.04em;cursor:pointer;transition:all .2s}
.pray-close-btn:hover{border-color:var(--pr-sun);color:var(--pr-sun2)}
.pray-loading{display:flex;align-items:center;justify-content:center;gap:10px;padding:26px 18px;color:var(--pr-sun2);font-size:14.5px;letter-spacing:.02em;animation:prFade .3s ease}
.pray-loading .dot{width:7px;height:7px;border-radius:50%;background:var(--pr-sun);opacity:.4;animation:prPulse 1s infinite ease-in-out}
.pray-loading .dot:nth-child(2){animation-delay:.16s}.pray-loading .dot:nth-child(3){animation-delay:.32s}
@keyframes prPulse{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
@keyframes prFade{from{opacity:0}to{opacity:1}}
@media(max-width:540px){.pray-box{padding:20px 16px}.pray-card{padding:22px 17px}}
@media(prefers-reduced-motion:reduce){.pray-reveal{animation:none;opacity:1;transform:none}.pray-card{animation:none}}
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

function detectLang(opts) {
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

/* Resolve to an <audio> element ONLY if the file truly loads; else null.
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

export function mountPrayerCare(container, opts) {
  if (!container) return;
  opts = opts || {};
  injectStyles();

  let lastQuestion = null; // last request, for language re-render
  let lastId = null;       // resolved prayer id, re-rendered on language toggle
  let renderGen = 0;       // bumped each render so a stale probe can't fill a newer card
  let ambientEl = null;    // the single soft background track (user-controlled)

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

  function smoothScroll(node) {
    if (!node) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    node.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
  }
  function updateClear() { clearBtn.classList.toggle('show', !!(input.value && input.value.trim())); }
  input.addEventListener('input', updateClear);
  clearBtn.addEventListener('click', () => { input.value = ''; updateClear(); input.focus(); });

  // Stop and release any playing ambient track (on close, or when a new prayer appears).
  function stopAmbient() {
    if (ambientEl) { try { ambientEl.pause(); ambientEl.currentTime = 0; } catch (e) {} ambientEl = null; }
  }

  // Narration slot: calm "in production" by default, quietly upgraded to a real
  // player if the MP3 loads. `gen` guards a late probe from filling a newer card.
  function mountNarration(slot, path, lang, gen) {
    const t = UI[lang];
    slot.innerHTML =
      `<div class="pray-audio">` +
      `<span class="pray-badge">${esc(t.narrationInProduction)}</span>` +
      `</div>`;
    if (!path) return;
    probeAudio(path).then((audio) => {
      if (!audio || gen !== renderGen || !slot.isConnected) return;
      slot.innerHTML =
        `<div class="pray-audio"><span class="pray-badge ready">${esc(t.narrationReady)}</span></div>`;
      audio.className = 'pray-player';
      audio.controls = true; // spoken narration does not loop
      slot.querySelector('.pray-audio').appendChild(audio);
    });
  }

  // Ambient slot: only appears if the soft background track actually exists.
  // Never autoplays — the track starts only when the user taps the button.
  function mountAmbient(slot, path, lang, gen) {
    if (!path) return;
    const t = UI[lang];
    probeAudio(path).then((audio) => {
      if (!audio || gen !== renderGen || !slot.isConnected) return;
      audio.loop = true;              // loop allowed for ambient background only
      audio.volume = AMBIENT_VOL;     // soft by default
      const row = document.createElement('div');
      row.className = 'pray-audio';
      const btnEl = document.createElement('button');
      btnEl.type = 'button';
      btnEl.className = 'pray-ambient-btn';
      const label = () => `<span class="ic">${audio.paused ? '▷' : '❚❚'}</span>` +
        `<span>${esc(t.ambientReady)} · ${esc(audio.paused ? t.ambientPlay : t.ambientPause)}</span>`;
      btnEl.innerHTML = label();
      btnEl.addEventListener('click', () => {
        if (audio.paused) { ambientEl = audio; audio.play().catch(() => {}); }
        else { audio.pause(); }
        btnEl.innerHTML = label();
      });
      audio.addEventListener('pause', () => { btnEl.innerHTML = label(); });
      audio.addEventListener('play', () => { btnEl.innerHTML = label(); });
      row.appendChild(btnEl);
      slot.appendChild(row);
    });
  }

  function renderCard(q, r, lang) {
    const t = UI[lang];
    const gen = ++renderGen;
    stopAmbient();
    const crisis = r.id === 'crisis';
    const path = lang === 'en' ? r.audioPathEn : r.audioPathZh;
    const ambientPath = lang === 'en' ? r.ambientPathEn : r.ambientPathZh;
    // staged reveal delays (skipped under reduced-motion via CSS)
    answer.innerHTML = `
      <div class="pray-card${crisis ? ' crisis' : ''}">
        <div class="pray-ctitle pray-reveal" style="animation-delay:0ms">${esc(r.title)}</div>
        <div class="pray-sect pray-reveal" style="animation-delay:170ms"><div class="pray-slabel">${esc(t.scriptureLabel)}</div><div class="pray-verse">${esc(r.scripture)}</div></div>
        <div class="pray-sect pray-reveal" style="animation-delay:340ms"><div class="pray-slabel">${esc(t.prayerLabel)}</div><div class="pray-body">${esc(r.prayerBody)}</div></div>
        ${path ? `<div class="pray-audiowrap pray-reveal" style="animation-delay:500ms" data-el="narration"></div>` : ''}
        ${ambientPath ? `<div class="pray-reveal" style="animation-delay:560ms" data-el="ambient"></div>` : ''}
        <div class="pray-close pray-reveal" style="animation-delay:600ms">
          <button type="button" class="pray-close-btn" data-el="close">${esc(t.close)}</button>
        </div>
      </div>`;
    if (path) mountNarration(answer.querySelector('[data-el="narration"]'), path, lang, gen);
    if (ambientPath) mountAmbient(answer.querySelector('[data-el="ambient"]'), ambientPath, lang, gen);
    const closeBtn = answer.querySelector('[data-el="close"]');
    if (closeBtn) closeBtn.addEventListener('click', closePrayer);
    smoothScroll(answer.querySelector('.pray-card'));
  }

  // Gentle close / reset — clears the card, stops any ambient, returns to the calm entry.
  function closePrayer() {
    stopAmbient();
    lastId = null; lastQuestion = null;
    answer.innerHTML = '';
    input.value = ''; updateClear();
    input.focus();
    smoothScroll(container.querySelector('.pray-box'));
  }

  let loadTimer = 0;
  function renderLoading(lang) {
    const t = UI[lang];
    answer.innerHTML =
      `<div class="pray-loading"><span>${esc(t.loading)}</span>` +
      `<span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
    smoothScroll(answer.querySelector('.pray-loading') || answer);
  }

  function pray(q) {
    const lang = detectLang(opts);
    const request = (q != null ? q : input.value || '').trim();
    if (!request) return;
    lastQuestion = request;
    if (loadTimer) { clearTimeout(loadTimer); loadTimer = 0; }

    const r = getPrayerResponse(request, lang);
    lastId = r.id;
    // Crisis responses bypass the loading animation entirely — help must be immediate.
    if (r.id === 'crisis') { renderCard(request, r, lang); return; }

    renderLoading(lang);
    loadTimer = setTimeout(() => {
      loadTimer = 0;
      const l = detectLang(opts);
      renderCard(request, resolvePrayerById(r.id, l), l);
    }, LOADING_MS);
  }

  function renderChrome() {
    const lang = detectLang(opts);
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
    // re-render the current prayer in the new language (same prayer, re-probes audio)
    if (lastId) renderCard(lastQuestion, resolvePrayerById(lastId, lang), lang);
  }

  btn.addEventListener('click', () => pray());
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); pray(); }
  });

  renderChrome();

  // Re-render on page language toggle (Tailwind homepage sets <html lang>;
  // book pages toggle <body class>). setTimeout debounce (not rAF, which is
  // suspended in hidden tabs) so a background toggle still updates the card.
  let deb = 0;
  const obs = new MutationObserver(() => {
    clearTimeout(deb);
    deb = setTimeout(renderChrome, 0);
  });
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  return { rerender: renderChrome, pray, close: closePrayer };
}
