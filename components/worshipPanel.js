/**
 * Reusable worship-track list renderer. Works for any book's worship data
 * (data/worship/<id>Worship.js). Data-driven, mobile-first, self-styled.
 *
 *   import { renderWorshipTracks } from './components/worshipPanel.js';
 *   renderWorshipTracks(el, johnWorship, 'zh', '#E8D7FF');
 */
let injected = false;
function injectStyles() {
  if (injected) return; injected = true;
  const css = `
  .wp{display:grid;gap:14px}
  .wp-track{border:1px solid rgba(236,231,221,.10);border-radius:13px;background:rgba(27,30,36,.55);padding:18px 20px}
  .wp-theme{font-size:11px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:9px}
  .wp-title{font-size:18px;font-weight:600;color:#ece7dd;font-family:Georgia,"Songti SC","Noto Serif SC",serif;line-height:1.4}
  .wp-artist{font-size:12.5px;color:#6f6a62;font-style:italic;margin-top:3px}
  .wp-conn{font-size:14px;color:#9a948a;line-height:1.7;margin-top:12px}
  .wp-refl{font-size:14px;color:#e8c77e;font-style:italic;line-height:1.7;margin-top:8px}
  .wp-links{margin-top:14px;display:flex;flex-wrap:wrap;gap:8px}
  .wp-link{display:inline-flex;align-items:center;min-height:44px;padding:9px 16px;border-radius:30px;font-size:12.5px;
    letter-spacing:.04em;color:#9a948a;border:1px solid rgba(236,231,221,.12);text-decoration:none;transition:color .2s,border-color .2s}
  .wp-link:hover{color:#e8c77e;border-color:rgba(217,164,65,.4)}
  `;
  const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
}

export function renderWorshipTracks(el, data, lang = 'zh', accent = '#D4AF37') {
  if (!el || !data) return;
  injectStyles();
  const g = (o, k) => o[k + (lang === 'zh' ? 'Zh' : 'En')] || '';
  const tracks = (data.tracks || []).map((tk) => `
    <div class="wp-track">
      <div class="wp-theme" style="color:${accent}">${g(tk, 'theme')}</div>
      <div class="wp-title">${tk.titleZh && lang === 'zh' ? tk.titleZh : (tk.titleEn || tk.titleZh || '')}</div>
      ${tk.artist ? `<div class="wp-artist">${tk.artist}</div>` : ''}
      ${g(tk, 'scriptureConnection') ? `<div class="wp-conn">${g(tk, 'scriptureConnection')}</div>` : ''}
      ${g(tk, 'reflectionPrompt') ? `<div class="wp-refl">${g(tk, 'reflectionPrompt')}</div>` : ''}
      <div class="wp-links">
        ${tk.spotifyLink ? `<a class="wp-link" href="${tk.spotifyLink}" target="_blank" rel="noopener">Spotify ↗</a>` : ''}
        ${tk.youtubeLink ? `<a class="wp-link" href="${tk.youtubeLink}" target="_blank" rel="noopener">YouTube ↗</a>` : ''}
      </div>
    </div>`).join('');
  el.innerHTML = `<div class="wp">${tracks}</div>`;
}

export default renderWorshipTracks;
