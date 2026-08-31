export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));
const esc = escapeHtml;

export function currentLanguage() {
  return document.body.classList.contains('lang-zh') ? 'zh' : 'en';
}

export function chapterHref(n, listen = false) {
  return `${listen ? 'revelation-listen' : 'revelation'}.html?ch=${n}`;
}

export function renderChapterNav(chapters, active) {
  return chapters.map((c) => {
    const state = c.status === 'full' ? 'full' : 'outline';
    return `<a class="chapter-chip ${active === c.n ? 'active' : ''} ${state}" href="${chapterHref(c.n)}" aria-label="Revelation ${c.n}">
      <span>${c.n}</span><i aria-hidden="true"></i>
    </a>`;
  }).join('');
}

export function renderFullChapter(data) {
  const verseHtml = data.verses.map((verse) => `<article class="verse" id="v${verse.v}">
    <div class="verse-num">${verse.v}</div>
    <p class="zh" lang="zh-CN">${esc(verse.zh)}</p>
    <p class="en" lang="en">${esc(verse.en)}</p>
  </article>`).join('');
  const understanding = data.understanding.map((item) => `<article class="study-card">
    <h3><span class="zh" lang="zh-CN">${esc(item.titleZh)}</span><span class="en" lang="en">${esc(item.titleEn)}</span></h3>
    <p><span class="zh" lang="zh-CN">${esc(item.bodyZh)}</span><span class="en" lang="en">${esc(item.bodyEn)}</span></p>
  </article>`).join('');
  const reflections = data.reflect.map((item, i) => `<li><span class="qnum">${i + 1}</span><span class="zh" lang="zh-CN">${esc(item.zh)}</span><span class="en" lang="en">${esc(item.en)}</span></li>`).join('');
  // Scripture version + source block. Both translation NAMES stay visible in either
  // interface language (only the labels switch). Per-chapter source links appear when
  // the chapter data provides verified URLs (data.sources.zhUrl / enUrl).
  const s = data.sources || {};
  const zhUrl = esc(s.zhUrl || '');
  const enUrl = esc(s.enUrl || '');
  const linkStyle = 'color:var(--gold2,#f0dfa9);text-decoration:underline';
  const srcLinks = (zhUrl || enUrl)
    ? ` · ${zhUrl ? `<a href="${zhUrl}" target="_blank" rel="noopener" style="${linkStyle}"><span class="zh">查看中文原文</span><span class="en">Chinese source text</span></a>` : ''}${(zhUrl && enUrl) ? ' · ' : ''}${enUrl ? `<a href="${enUrl}" target="_blank" rel="noopener" style="${linkStyle}"><span class="zh">查看英文原文</span><span class="en">English source text</span></a>` : ''}`
    : '';
  const sourceNote = `<div class="source-note" style="line-height:1.7">
        <div style="color:var(--gold,#e4c97a);font-weight:600;margin-bottom:2px"><span class="zh">经文版本与出处</span><span class="en">Scripture &amp; sources</span></div>
        <div><span class="zh">中文：新标点和合本（简体）· 英文：World English Bible Classic（WEB）</span><span class="en">Chinese: Chinese Union Version, New Punctuation (Simplified) · English: World English Bible Classic (WEB)</span></div>
        <div><span class="public-domain"><span class="zh">来源 eBible.org · 公共领域</span><span class="en">Source: eBible.org · Public Domain</span></span>${srcLinks}</div>
        <div style="margin-top:2px"><span class="zh">各语言保留各自译本，措辞与标点可能不同；研读说明、默想与祷告由本站整理，不属于圣经译文。</span><span class="en">Each language keeps its own translation, so wording and punctuation may differ. Study notes, reflection questions, and prayers are prepared for this site and are not part of the Bible translation.</span></div>
      </div>`;
  return `<section class="reading" aria-labelledby="scripture-heading">
      <div class="section-label" id="scripture-heading"><span class="zh">经文</span><span class="en">Scripture</span></div>
      ${sourceNote}
      <div class="verses">${verseHtml}</div>
    </section>
    <section class="understanding">
      <div class="section-label"><span class="zh">理解与思考</span><span class="en">Understanding & Reflection</span></div>
      <div class="study-grid">${understanding}</div>
      <div class="humility-note"><span class="zh">以下内容为辅助研读，不是圣经正文。对于存在不同理解的经文，我们会说明主要观点，并以经文本身为准。</span><span class="en">These notes are study aids, not Scripture. Where faithful Christians differ, we name the major views and return to the text itself.</span></div>
    </section>
    <section class="reflection">
      <div class="section-label"><span class="zh">今日默想</span><span class="en">Reflection</span></div>
      <ol>${reflections}</ol>
    </section>
    <section class="prayer-card">
      <div class="section-label"><span class="zh">祷告</span><span class="en">Prayer</span></div>
      <p><span class="zh" lang="zh-CN">${esc(data.prayer.zh)}</span><span class="en" lang="en">${esc(data.prayer.en)}</span></p>
    </section>`;
}

export function renderOutline(meta) {
  return `<section class="outline-card">
    <div class="status"><span class="zh">随讲道系列逐步更新</span><span class="en">Being prepared as the teaching series progresses</span></div>
    <h2><span class="zh">这一章发生了什么？</span><span class="en">What happens in this chapter?</span></h2>
    <p><span class="zh" lang="zh-CN">${esc(meta.summary.zh)}</span><span class="en" lang="en">${esc(meta.summary.en)}</span></p>
    <h2><span class="zh">盼望锚点</span><span class="en">Anchor of hope</span></h2>
    <p class="anchor"><span class="zh" lang="zh-CN">${esc(meta.comfortAnchor.zh)}</span><span class="en" lang="en">${esc(meta.comfortAnchor.en)}</span></p>
    <div class="outline-actions">
      <a href="revelation.html?ch=21"><span class="zh">先看故事的结局：万物更新 →</span><span class="en">See the ending: all things made new →</span></a>
    </div>
  </section>`;
}

export function toListenBlocks(data, lang) {
  const l = lang === 'zh' ? 'zh' : 'en';
  return [
    { label: l === 'zh' ? `启示录第 ${data.n} 章` : `Revelation ${data.n}`, text: data.verses.map((v) => v[l]).join(l === 'zh' ? '' : ' ') },
    { label: l === 'zh' ? '盼望锚点' : 'Anchor of hope', text: data.comfortAnchor[l] },
    { label: l === 'zh' ? '祷告' : 'Prayer', text: data.prayer[l] }
  ];
}
