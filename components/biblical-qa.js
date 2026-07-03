/* ============================================================
   biblical-qa.js — reusable Biblical Q&A UI component
   ------------------------------------------------------------
   Vanilla ES-module equivalent of a <BiblicalQA /> component.
   (This site is static HTML with native ES modules — no React /
   build step — so the reusable unit is a mount function, not a
   .jsx file. Behaviour is identical: drop a container on any page
   and call mountBiblicalQA(container).)

   Usage:
     import { mountBiblicalQA } from './components/biblical-qa.js';
     mountBiblicalQA(document.getElementById('biblical-qa'));

   - Self-contained scoped CSS (injected once) so it looks the same
     on the Tailwind homepage and the custom-CSS book pages.
   - Bilingual; auto-detects the page language and re-renders when
     the page toggles it (observes <html lang> and <body class>).
   - Fixed "guided prompt" chips remain, AND users can type freely.
   ============================================================ */

import { getBiblicalResponse, resolveById, getCrisisResponse, getFallbackResponse } from '../data/qaEngine.js';

const UI = {
  zh: {
    title: '用圣经回应人生问题',
    subtitle: '你可以把真实的问题、焦虑、疑惑和生命处境带到这里。',
    inputLabel: '你想问什么?',
    placeholder: '例如:我为什么总觉得空虚?神真的爱我吗?我很焦虑怎么办?',
    button: '用圣经回应我',
    loading: '正在从圣经中寻找回应……',
    guided: '不知从何问起?试试这些:',
    lVerse: '相关经文', lExpl: '简短解释', lReflect: '默想问题', lNext: '下一步', lPray: '祷告', lRead: '相关书卷',
    safetyFooter: '如果你正处于紧急危机中,请立即拨打 988(美国)或联系你信任的人。'
  },
  en: {
    title: 'Biblical Q&A',
    subtitle: 'Bring your real questions, struggles, doubts, and life situations into the light of Scripture.',
    inputLabel: 'What would you like to ask?',
    placeholder: 'For example: Why do I feel empty? Does God really love me? What does the Bible say about anxiety?',
    button: 'Answer from Scripture',
    loading: 'Searching Scripture for a response...',
    guided: 'Not sure where to start? Try one:',
    lVerse: 'Relevant Scripture', lExpl: 'Reflection', lReflect: 'Question for Reflection', lNext: 'Next Step', lPray: 'Prayer', lRead: 'Related Books',
    safetyFooter: 'If you are in immediate crisis, please call or text 988 (United States) or reach out to someone you trust.'
  }
};

const GUIDED = [
  { zh: '我为什么总觉得空虚?', en: 'Why do I feel empty?' },
  { zh: '我很焦虑怎么办?', en: 'What does the Bible say about anxiety?' },
  { zh: '神真的爱我吗?', en: 'Does God really love me?' },
  { zh: '我想认识耶稣', en: 'How can I know Jesus?' }
];

const LOADING_MS = 700; // brief, mobile-friendly; crisis responses skip this entirely

const BOOK_LINKS = {
  ecclesiastes: { zh: '读传道书', en: 'Read Ecclesiastes', href: 'ecclesiastes.html' },
  john:         { zh: '读约翰福音', en: 'Read John', href: 'john.html' }
};

const CSS = `
.bqa-root{--bqa-bg:#1b1e24;--bqa-bg2:#22262e;--bqa-ink:#ece7dd;--bqa-muted:#9a948a;--bqa-faint:#6f6a62;
  --bqa-sun:#d9a441;--bqa-sun2:#e8c77e;--bqa-line:rgba(217,164,65,.22);--bqa-soft:rgba(236,231,221,.10);--bqa-warn:#e0855b;
  font-family:Georgia,"Times New Roman","Songti SC","Noto Serif SC",serif;color:var(--bqa-ink);
  max-width:760px;margin:0 auto;box-sizing:border-box}
.bqa-root *{box-sizing:border-box}
.bqa-head{text-align:center;margin-bottom:22px}
.bqa-eyebrow{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--bqa-sun);margin-bottom:10px}
.bqa-title{font-size:clamp(22px,4vw,30px);line-height:1.25;color:var(--bqa-ink);font-weight:400;margin:0}
.bqa-sub{margin-top:12px;font-size:15px;color:var(--bqa-muted);line-height:1.7}
.bqa-box{background:var(--bqa-bg);border:1px solid var(--bqa-line);border-radius:12px;padding:24px 22px;box-shadow:0 14px 40px rgba(0,0,0,.22)}
.bqa-label{font-size:14.5px;color:var(--bqa-sun2);letter-spacing:.02em;margin-bottom:11px}
.bqa-input{width:100%;background:#14161a;border:1px solid var(--bqa-line);border-radius:8px;color:var(--bqa-ink);
  font-family:inherit;font-size:16px;line-height:1.6;padding:13px 14px;resize:vertical;min-height:76px;display:block}
.bqa-input:focus{outline:none;border-color:var(--bqa-sun)}
.bqa-go{margin-top:13px;display:flex;justify-content:flex-end}
.bqa-btn{background:var(--bqa-sun);color:#14161a;border:none;border-radius:30px;cursor:pointer;font-family:inherit;
  font-weight:700;padding:12px 28px;font-size:15px;letter-spacing:.03em;transition:background .2s}
.bqa-btn:hover{background:var(--bqa-sun2)}
.bqa-guided{margin-top:20px}
.bqa-guided .g-hint{font-size:12.5px;color:var(--bqa-faint);letter-spacing:.05em;margin-bottom:10px}
.bqa-chips{display:flex;flex-wrap:wrap;gap:8px}
.bqa-chip{font-size:13.5px;color:var(--bqa-muted);border:1px solid var(--bqa-soft);border-radius:30px;padding:8px 15px;
  cursor:pointer;background:#14161a;font-family:inherit;transition:all .2s;line-height:1.4;text-align:left}
.bqa-chip:hover{border-color:var(--bqa-sun);color:var(--bqa-sun2);background:rgba(217,164,65,.06)}
.bqa-answer{margin-top:22px}
.bqa-card{background:var(--bqa-bg2);border:1px solid var(--bqa-soft);border-radius:12px;padding:24px 22px;animation:bqaRise .4s ease}
@keyframes bqaRise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.bqa-card.crisis{background:rgba(224,133,91,.10);border:1px solid rgba(224,133,91,.5)}
.bqa-qecho{font-size:14px;color:var(--bqa-faint);font-style:italic;border-left:2px solid var(--bqa-line);padding-left:12px;margin-bottom:18px;line-height:1.6}
.bqa-ctitle{font-size:20px;color:var(--bqa-sun2);font-weight:600;margin-bottom:16px;line-height:1.35}
.bqa-card.crisis .bqa-ctitle{color:var(--bqa-warn)}
.bqa-sect{margin-top:18px}
.bqa-slabel{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--bqa-sun);opacity:.9;margin-bottom:8px}
.bqa-verse{border-left:2px solid var(--bqa-sun);padding:4px 0 4px 15px;font-size:16px;line-height:1.72;color:var(--bqa-ink)}
.bqa-body{font-size:15.5px;color:var(--bqa-ink);line-height:1.78}
.bqa-sect.pray .bqa-body{color:var(--bqa-sun2);font-style:italic}
.bqa-links{margin-top:20px;padding-top:16px;border-top:1px solid var(--bqa-soft);display:flex;flex-wrap:wrap;gap:10px}
.bqa-links a{font-size:13.5px;color:#14161a;background:var(--bqa-sun);border-radius:30px;padding:8px 17px;text-decoration:none;transition:background .2s}
.bqa-links a:hover{background:var(--bqa-sun2)}
.bqa-loading{display:flex;align-items:center;justify-content:center;gap:10px;padding:26px 18px;color:var(--bqa-sun2);font-size:14.5px;letter-spacing:.02em;animation:bqaFade .3s ease}
.bqa-loading .dot{width:7px;height:7px;border-radius:50%;background:var(--bqa-sun);opacity:.4;animation:bqaPulse 1s infinite ease-in-out}
.bqa-loading .dot:nth-child(2){animation-delay:.16s}.bqa-loading .dot:nth-child(3){animation-delay:.32s}
@keyframes bqaPulse{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
@keyframes bqaFade{from{opacity:0}to{opacity:1}}
.bqa-safety{margin-top:16px;font-size:12px;color:var(--bqa-faint);line-height:1.65;text-align:center}
@media(max-width:540px){.bqa-box{padding:20px 16px}.bqa-card{padding:20px 16px}}
`;

function injectStyles() {
  if (document.getElementById('bqa-styles')) return;
  const s = document.createElement('style');
  s.id = 'bqa-styles';
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

export function mountBiblicalQA(container, opts) {
  if (!container) return;
  opts = opts || {};
  injectStyles();

  let lastQuestion = null; // remember the last asked question to re-render on lang switch
  let lastResp = null;     // the resolved response (id + variantIndex) — re-rendered on lang switch without re-rotating

  // Re-render the last response in a new language WITHOUT advancing the variant
  // counter, so a language toggle keeps the same cited verse.
  function reresolve(prev, lang) {
    if (!prev) return null;
    if (prev.id === 'crisis') return getCrisisResponse(lang);
    if (prev.id === 'fallback') return getFallbackResponse(lang);
    return resolveById(prev.id, lang, prev.variantIndex || 0);
  }

  container.classList.add('bqa-root');
  container.innerHTML = `
    <div class="bqa-head">
      <div class="bqa-eyebrow" data-k="eyebrow"></div>
      <h2 class="bqa-title" data-k="title"></h2>
      <p class="bqa-sub" data-k="subtitle"></p>
    </div>
    <div class="bqa-box">
      <div class="bqa-label" data-k="inputLabel"></div>
      <textarea class="bqa-input" data-el="input" rows="3"></textarea>
      <div class="bqa-go"><button class="bqa-btn" data-el="btn"></button></div>
      <div class="bqa-guided">
        <div class="g-hint" data-k="guided"></div>
        <div class="bqa-chips" data-el="chips"></div>
      </div>
    </div>
    <div class="bqa-answer" data-el="answer" aria-live="polite"></div>
    <p class="bqa-safety" data-k="safetyFooter"></p>
  `;

  const el = (n) => container.querySelector(`[data-el="${n}"]`);
  const input = el('input'), btn = el('btn'), chips = el('chips'), answer = el('answer');

  function renderCard(q, r, lang) {
    const t = UI[lang];
    const crisis = r.id === 'crisis';
    let links = '';
    if (r.relatedBooks && r.relatedBooks.length) {
      const parts = r.relatedBooks.map((b) => {
        const lk = BOOK_LINKS[b];
        return lk ? `<a href="${lk.href}">${esc(lang === 'zh' ? lk.zh : lk.en)}</a>` : '';
      }).join('');
      if (parts) links = `<div class="bqa-sect"><div class="bqa-slabel">${esc(t.lRead)}</div><div class="bqa-links">${parts}</div></div>`;
    }
    answer.innerHTML = `
      <div class="bqa-card${crisis ? ' crisis' : ''}">
        ${q ? `<div class="bqa-qecho">${esc(q)}</div>` : ''}
        <div class="bqa-ctitle">${esc(r.title)}</div>
        <div class="bqa-sect"><div class="bqa-slabel">${esc(t.lVerse)}</div><div class="bqa-verse">${esc(r.verse)}</div></div>
        <div class="bqa-sect"><div class="bqa-slabel">${esc(t.lExpl)}</div><div class="bqa-body">${esc(r.explanation)}</div></div>
        <div class="bqa-sect"><div class="bqa-slabel">${esc(t.lReflect)}</div><div class="bqa-body">${esc(r.reflection)}</div></div>
        <div class="bqa-sect"><div class="bqa-slabel">${esc(t.lNext)}</div><div class="bqa-body">${esc(r.nextStep)}</div></div>
        <div class="bqa-sect pray"><div class="bqa-slabel">${esc(t.lPray)}</div><div class="bqa-body">${esc(r.prayer)}</div></div>
        ${links}
      </div>`;
    answer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  let loadTimer = 0;
  function renderLoading(lang) {
    const t = UI[lang];
    answer.innerHTML =
      `<div class="bqa-loading"><span>${esc(t.loading)}</span>` +
      `<span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
    answer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function ask(q) {
    const lang = detectLang(opts);
    const question = (q != null ? q : input.value || '').trim();
    if (!question) return;
    lastQuestion = question;
    if (loadTimer) { clearTimeout(loadTimer); loadTimer = 0; }

    // Resolve ONCE (advances the verse-variant counter exactly once per ask),
    // then reuse for the delayed render — never call the engine twice per ask.
    const r = getBiblicalResponse(question, lang);
    lastResp = r;
    // §1.3 — crisis responses bypass the loading animation entirely.
    if (r.id === 'crisis') { renderCard(question, r, lang); return; }

    // normal Q&A: brief loading state, then fade-in the same resolved card.
    renderLoading(lang);
    loadTimer = setTimeout(() => {
      loadTimer = 0;
      const l = detectLang(opts);
      renderCard(question, reresolve(r, l), l);
    }, LOADING_MS);
  }

  function renderChrome() {
    const lang = detectLang(opts);
    const t = UI[lang];
    container.querySelectorAll('[data-k]').forEach((n) => {
      const k = n.dataset.k;
      n.textContent = k === 'eyebrow' ? t.title : (t[k] || '');
    });
    // keep the big title distinct from the eyebrow: eyebrow shows a short kicker
    const eb = container.querySelector('[data-k="eyebrow"]');
    if (eb) eb.textContent = lang === 'zh' ? '本站核心 · 随便问' : 'The heart of this site · Ask';
    input.placeholder = t.placeholder;
    btn.textContent = t.button;
    // guided chips
    chips.innerHTML = '';
    GUIDED.forEach((g) => {
      const b = document.createElement('button');
      b.className = 'bqa-chip';
      b.type = 'button';
      b.textContent = lang === 'zh' ? g.zh : g.en;
      b.addEventListener('click', () => { input.value = b.textContent; ask(b.textContent); });
      chips.appendChild(b);
    });
    // re-render the last answer in the new language (same verse, no re-rotation)
    if (lastResp) renderCard(lastQuestion, reresolve(lastResp, lang), lang);
  }

  btn.addEventListener('click', () => ask());
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); }
  });

  renderChrome();

  // re-render on page language toggle (works for both the Tailwind homepage
  // which sets <html lang>, and the book pages which toggle <body class>)
  // Debounce with setTimeout (not requestAnimationFrame): rAF is suspended in
  // background/hidden tabs, which would defer a language re-render; setTimeout
  // still fires, so switching language always updates the visible answer.
  let deb = 0;
  const obs = new MutationObserver(() => {
    clearTimeout(deb);
    deb = setTimeout(renderChrome, 0);
  });
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  return { rerender: renderChrome, ask };
}
