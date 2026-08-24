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
  return `<section class="reading" aria-labelledby="scripture-heading">
      <div class="section-label" id="scripture-heading"><span class="zh">经文</span><span class="en">Scripture</span></div>
      <div class="source-note"><span class="zh">新标点和合本（简体）</span><span class="en">World English Bible (WEB)</span> · <span class="public-domain"><span class="zh">公共领域</span><span class="en">Public Domain</span></span></div>
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
