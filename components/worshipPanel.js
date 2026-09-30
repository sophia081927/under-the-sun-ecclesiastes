/**
 * Reusable worship-track list renderer. Works for any book's worship data
 * (data/worship/<id>Worship.js). Data-driven, mobile-first, self-styled.
 *
 *   import { renderWorshipTracks } from './components/worshipPanel.js';
 *   renderWorshipTracks(el, johnWorship, 'zh', '#E8D7FF');
 *
 * Two track shapes are supported, side by side (backward compatible):
 *   (A) STRUCTURED (accurate): track.scripture = { book, ch, from, to, zh, en }
 *       → rendered as a VERBATIM quote block with a GENERATED reference
 *         ("约翰福音 1:14 / John 1:14") and the per-language version label
 *         (zh 新标点和合本（简体） / en World English Bible (WEB)).
 *       track.connectionZh/En (optional) = editorial application, rendered in a
 *         separate block explicitly marked "本站整理（非经文）/ editorial".
 *   (B) LEGACY (neutral): track.scriptureConnectionZh/En (Psalms thematic pairings,
 *       Proverbs, and not-yet-migrated books) → rendered as before, a neutral note.
 *       Legacy text is NEVER labeled a verbatim quote and NEVER labeled "not Scripture".
 * The reference and version label come only from the structured fields — never by
 * parsing display text. All rendered text is HTML-escaped (internal quotes preserved).
 */

// Corpus book code → display names per language (for GENERATED references).
const BOOK_NAMES = {
  JHN: { zh: '约翰福音', en: 'John' },
  ECC: { zh: '传道书', en: 'Ecclesiastes' },
  REV: { zh: '启示录', en: 'Revelation' },
  PSA: { zh: '诗篇', en: 'Psalms' },
  PRO: { zh: '箴言', en: 'Proverbs' },
};
const VERSION = { zh: '新标点和合本（简体）', en: 'World English Bible (WEB)' };
const EDITORIAL_TAG = { zh: '本站整理（非经文）', en: 'Editorial (not Scripture)' };

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/** Generated display reference from a structured scripture ref, e.g. "约翰福音 1:14". */
export function scriptureRefDisplay(s, lang) {
  const bn = BOOK_NAMES[s.book] || { zh: s.book, en: s.book };
  const name = lang === 'zh' ? bn.zh : bn.en;
  const range = (s.to && s.to > s.from) ? `${s.ch}:${s.from}-${s.to}` : `${s.ch}:${s.from}`;
  return `${name} ${range}`;
}

let injected = false;
function injectStyles() {
  if (injected) return; injected = true;
  const css = `
  .wp{display:grid;gap:14px}
  .wp-track{border:1px solid rgba(236,231,221,.10);border-radius:13px;background:rgba(27,30,36,.55);padding:18px 20px}
  .wp-theme{font-size:11px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:9px}
  .wp-title{font-size:18px;font-weight:600;color:#ece7dd;font-family:Georgia,"Songti SC","Noto Serif SC",serif;line-height:1.4}
  .wp-artist{font-size:12.5px;color:#6f6a62;font-style:italic;margin-top:3px}
  .wp-scripture{margin-top:12px;padding-left:13px;border-left:2px solid rgba(230,199,118,.55)}
  .wp-verse{font-size:15px;color:#d8d2c6;line-height:1.85;font-family:Georgia,"Songti SC","Noto Serif SC",serif}
  .wp-src{font-size:11.5px;color:#6f6a62;margin-top:7px;letter-spacing:.02em}
  .wp-conn{font-size:14px;color:#9a948a;line-height:1.7;margin-top:12px}
  .wp-tag{display:inline-block;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:#8a8f96;margin-right:8px}
  .wp-refl{font-size:14px;color:#e8c77e;font-style:italic;line-height:1.7;margin-top:8px}
  .wp-links{margin-top:14px;display:flex;flex-wrap:wrap;gap:8px}
  .wp-link{display:inline-flex;align-items:center;min-height:44px;padding:9px 16px;border-radius:30px;font-size:12.5px;
    letter-spacing:.04em;color:#9a948a;border:1px solid rgba(236,231,221,.12);text-decoration:none;transition:color .2s,border-color .2s}
  .wp-link:hover{color:#e8c77e;border-color:rgba(217,164,65,.4)}
  `;
  const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
}

/**
 * Pure HTML builder (no DOM) so it is unit-testable in Node.
 * Returns the full `<div class="wp">…</div>` markup.
 */
export function buildWorshipTracksHtml(data, lang = 'zh', accent = '#D4AF37') {
  if (!data) return '';
  const isZh = lang === 'zh';
  const g = (o, k) => o[k + (isZh ? 'Zh' : 'En')] || '';
  const tracks = (data.tracks || []).map((tk) => {
    const theme = esc(g(tk, 'theme'));
    const title = esc(isZh ? (tk.titleZh || tk.titleEn || '') : (tk.titleEn || tk.titleZh || ''));
    const artist = tk.artist ? `<div class="wp-artist">${esc(tk.artist)}</div>` : '';

    // (A) Structured, verbatim Scripture — one block per reference. `scripture` may be a
    // single ref or an ARRAY of refs (non-contiguous verses each get their own block, with
    // their own generated reference — a gap is never shown as a continuous range).
    const scr = Array.isArray(tk.scripture) ? tk.scripture : (tk.scripture ? [tk.scripture] : []);
    const scriptureHtml = scr.map((s) => {
      const verse = esc(isZh ? s.zh : s.en);
      const ref = esc(scriptureRefDisplay(s, lang));
      return `<div class="wp-scripture" style="border-color:${accent}">`
        + `<p class="wp-verse">${verse}</p>`
        + `<div class="wp-src">${ref} · ${esc(VERSION[lang] || VERSION.zh)}</div></div>`;
    }).join('');

    // Editorial application that accompanies structured Scripture — clearly marked.
    const conn = g(tk, 'connection');
    const connHtml = conn
      ? `<div class="wp-conn"><span class="wp-tag">${esc(EDITORIAL_TAG[lang] || EDITORIAL_TAG.zh)}</span>${esc(conn)}</div>`
      : '';

    // (B) Legacy neutral note (only when there is no structured Scripture) — unchanged,
    // never claimed verbatim, never labeled "not Scripture".
    const legacy = !scr.length ? g(tk, 'scriptureConnection') : '';
    const legacyHtml = legacy ? `<div class="wp-conn">${esc(legacy)}</div>` : '';

    const refl = g(tk, 'reflectionPrompt');
    const reflHtml = refl ? `<div class="wp-refl">${esc(refl)}</div>` : '';

    const links = `<div class="wp-links">`
      + (tk.spotifyLink ? `<a class="wp-link" href="${tk.spotifyLink}" target="_blank" rel="noopener">Spotify ↗</a>` : '')
      + (tk.youtubeLink ? `<a class="wp-link" href="${tk.youtubeLink}" target="_blank" rel="noopener">YouTube ↗</a>` : '')
      + `</div>`;

    return `<div class="wp-track">`
      + `<div class="wp-theme" style="color:${accent}">${theme}</div>`
      + `<div class="wp-title">${title}</div>`
      + `${artist}${scriptureHtml}${connHtml}${legacyHtml}${reflHtml}${links}</div>`;
  }).join('');
  return `<div class="wp">${tracks}</div>`;
}

export function renderWorshipTracks(el, data, lang = 'zh', accent = '#D4AF37') {
  if (!el || !data) return;
  injectStyles();
  el.innerHTML = buildWorshipTracksHtml(data, lang, accent);
}

export default renderWorshipTracks;
