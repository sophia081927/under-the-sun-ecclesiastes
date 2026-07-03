/**
 * Reusable media panel — the one component that renders any book's media hub.
 * Works for Ecclesiastes, John, and every future book (data-driven, not hard-coded).
 *
 * Usage (any page, no build step):
 *   import { renderBookMediaPanel } from './components/bookMediaPanel.js';
 *   renderBookMediaPanel(document.getElementById('media'), 'john', 'zh');
 *
 * Reads: getBookById(id).mediaHub[lang] + feature flags + capability page paths.
 * Renders: audio card (title/guide + Listen), worship card (title/guide + Worship
 * + Spotify/YouTube). Missing capabilities show an elegant "Coming soon" state.
 */
import { getBookById } from '../data/bibleRegistry.js';

const L = {
  zh: { audio: '听书解经', worship: '敬拜', listen: '进入聆听', openWorship: '进入敬拜',
        soon: '敬请期待', spotify: 'Spotify', youtube: 'YouTube', listenOn: '收听平台' },
  en: { audio: 'Audio commentary', worship: 'Worship', listen: 'Open Listening', openWorship: 'Open Worship',
        soon: 'Coming soon', spotify: 'Spotify', youtube: 'YouTube', listenOn: 'Listen on' }
};

let injected = false;
function injectStyles() {
  if (injected) return; injected = true;
  const css = `
  .bmp{display:grid;gap:14px;margin:0 auto}
  .bmp-card{border:1px solid rgba(236,231,221,.10);border-radius:14px;background:rgba(27,30,36,.6);
    padding:20px 20px;backdrop-filter:blur(6px)}
  .bmp-ey{font-size:11px;letter-spacing:.2em;text-transform:uppercase;opacity:.85;margin-bottom:8px}
  .bmp-title{font-size:19px;font-weight:600;line-height:1.35;color:#ece7dd;
    font-family:Georgia,"Songti SC","Noto Serif SC",serif}
  .bmp-guide{font-size:14.5px;color:#9a948a;line-height:1.7;margin-top:8px}
  .bmp-actions{margin-top:16px;display:flex;flex-wrap:wrap;gap:10px;align-items:center}
  .bmp-btn{display:inline-flex;align-items:center;gap:7px;min-height:48px;padding:12px 22px;border-radius:40px;
    font-size:14px;font-weight:600;letter-spacing:.03em;cursor:pointer;border:1px solid transparent;
    text-decoration:none;transition:filter .2s,background .2s,border-color .2s}
  .bmp-btn:hover{filter:brightness(1.08)}
  .bmp-btn.solid{color:#14161a}
  .bmp-btn.ghost{background:transparent}
  .bmp-btn.soon{color:#6f6a62;border-color:rgba(236,231,221,.12);cursor:default}
  .bmp-links{display:flex;gap:8px;flex-wrap:wrap}
  .bmp-link{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:9px 16px;border-radius:30px;
    font-size:12.5px;letter-spacing:.04em;color:#9a948a;border:1px solid rgba(236,231,221,.12);
    text-decoration:none;transition:color .2s,border-color .2s}
  .bmp-link:hover{color:#e8c77e;border-color:rgba(217,164,65,.4)}
  @media(max-width:520px){ .bmp-actions{gap:8px} .bmp-btn{width:100%;justify-content:center} }
  `;
  const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
}

export function renderBookMediaPanel(el, bookId, lang = 'zh') {
  if (!el) return;
  injectStyles();
  const book = getBookById(bookId);
  if (!book) { el.innerHTML = ''; return; }
  const t = L[lang] || L.zh;
  const m = (book.mediaHub && book.mediaHub[lang]) || {};
  const f = book.features || {};
  const acc = book.accentColor || '#D4AF37';

  const audioBtn = (f.listen && book.listen)
    ? `<a class="bmp-btn solid" style="background:${acc}" href="${book.listen}">♪ ${t.listen}</a>`
    : `<span class="bmp-btn soon">♪ ${t.listen} · ${t.soon}</span>`;

  const worshipBtn = (f.worship && book.worship)
    ? `<a class="bmp-btn ghost" style="border-color:${acc}66;color:${acc}" href="${book.worship}">🎵 ${t.openWorship}</a>`
    : `<span class="bmp-btn soon">🎵 ${t.openWorship} · ${t.soon}</span>`;

  const links = (m.spotifyLink || m.youtubeLink) ? `
    <div class="bmp-links">
      ${m.spotifyLink ? `<a class="bmp-link" href="${m.spotifyLink}" target="_blank" rel="noopener">${t.spotify} ↗</a>` : ''}
      ${m.youtubeLink ? `<a class="bmp-link" href="${m.youtubeLink}" target="_blank" rel="noopener">${t.youtube} ↗</a>` : ''}
    </div>` : '';

  el.innerHTML = `
    <div class="bmp">
      <div class="bmp-card">
        <div class="bmp-ey" style="color:${acc}">${t.audio}</div>
        <div class="bmp-title">${m.audioTitle || ''}</div>
        <div class="bmp-guide">${m.audioGuide || ''}</div>
        <div class="bmp-actions">${audioBtn}</div>
      </div>
      <div class="bmp-card">
        <div class="bmp-ey" style="color:${acc}">${t.worship}</div>
        <div class="bmp-title">${m.worshipTitle || ''}</div>
        <div class="bmp-guide">${m.worshipGuide || ''}</div>
        <div class="bmp-actions">${worshipBtn} ${links}</div>
      </div>
    </div>`;
}

export default renderBookMediaPanel;
