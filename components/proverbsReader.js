/*
 * proverbsReader.js — renders a built Proverbs chapter ("full") into the
 * Proverbs page. It reuses the site's bilingual pattern (both zh + en spans are
 * emitted; CSS shows the active language) and the tested escapeHtml helper.
 *
 * Scripture is rendered in clearly-marked Scripture blocks; every study/
 * application block (Big Idea, Overview, Understand, Wisdom for Real Life,
 * Reflection, Prayer, One Thing, Daily Challenge) carries its own labelled
 * heading so readers never mistake commentary for the Bible text. Key-verse and
 * scenario cards pull their Scripture text from the chapter's verses[] by number,
 * so it always matches the verified corpus.
 */
import { escapeHtml } from './chapterReader.js';
const esc = escapeHtml;

export function proverbsHref(n, listen = false) {
  return `${listen ? 'proverbs-listen' : 'proverbs'}.html?ch=${n}`;
}

const bi = (zh, en) => `<span class="zh" lang="zh-CN">${esc(zh)}</span><span class="en" lang="en">${esc(en)}</span>`;
const label = (zh, en) => `<div class="pv-label">${bi(zh, en)}</div>`;

export function renderChapterNav(chapters, active) {
  return chapters.map((c) => {
    const state = c.status === 'full' ? 'full' : 'upcoming';
    const dis = state === 'full' ? '' : 'aria-disabled="true" ';
    const href = state === 'full' ? proverbsHref(c.n) : '#';
    return `<a class="pv-chip ${active === c.n ? 'active' : ''} ${state}" ${dis}href="${href}" aria-label="Proverbs ${c.n}${state === 'full' ? '' : ' (coming soon)'}"><span>${c.n}</span></a>`;
  }).join('');
}

export function renderProverbsChapter(data) {
  const byNum = new Map(data.verses.map((v) => [v.v, v]));
  const scriptureVerse = (v) => {
    const verse = byNum.get(v);
    if (!verse) return '';
    return `<p class="pv-verse-line"><span class="pv-vn" aria-hidden="true">${verse.v}</span><span class="zh" lang="zh-CN">${esc(verse.zh)}</span><span class="en" lang="en">${esc(verse.en)}</span></p>`;
  };

  // BIG IDEA
  const bigIdea = `<section class="pv-sec pv-bigidea" aria-labelledby="pv-bigidea-h">
      <h2 id="pv-bigidea-h" class="pv-h">${bi('核心思想', 'Big Idea')}</h2>
      <p class="pv-idea">${bi(data.bigIdea.zh, data.bigIdea.en)}</p>
      <p class="pv-microdisclaimer">${bi('（这是本章的概括，不是圣经经文。）', '(This is a summary of the chapter, not Scripture.)')}</p>
    </section>`;

  // CHAPTER OVERVIEW
  const overviewParas = data.overview.zh.map((z, i) => `<p>${bi(z, data.overview.en[i])}</p>`).join('');
  const overview = `<section class="pv-sec" aria-labelledby="pv-ov-h">
      <h2 id="pv-ov-h" class="pv-h">${bi('本章导读', 'Chapter Overview')}</h2>
      <div class="pv-prose">${overviewParas}</div>
    </section>`;

  // READ THE CHAPTER (Scripture)
  const verseHtml = data.verses.map((v) => scriptureVerse(v.v)).join('');
  const s = data.sources || {};
  const srcUrl = esc(s.sourceUrl || 'https://ebible.org/');
  const sourceNote = `<div class="pv-source">
      <div class="pv-source-title">${bi('经文版本与出处', 'Scripture & sources')}</div>
      <div>${bi('中文：新标点和合本（简体，公共领域）', 'Chinese: Chinese Union Version, New Punctuation (public domain)')}</div>
      <div>${bi('英文：World English Bible（WEB，公共领域）', 'English: World English Bible (WEB, public domain)')}</div>
      <div><a href="${srcUrl}" target="_blank" rel="noopener">${bi('来源 eBible.org', 'Source: eBible.org')}</a> · ${bi('研读、默想与祷告由本站整理，不属于圣经译文。', 'Study notes, reflections and prayers are prepared for this site and are not part of the Bible translation.')}</div>
    </div>`;
  const read = `<section class="pv-sec pv-scripture" aria-labelledby="pv-read-h">
      <h2 id="pv-read-h" class="pv-h pv-h-scripture">${bi('读这一章', 'Read the Chapter')}</h2>
      ${sourceNote}
      <div class="pv-verses">${verseHtml}</div>
    </section>`;

  // KEY VERSES (Scripture text from verses[]; commentary clearly separate)
  const keyCards = (data.keyVerses || []).map((kv) => {
    const verse = byNum.get(kv.v);
    const ref = `Proverbs 1:${kv.v}`;
    return `<article class="pv-key">
      <div class="pv-key-ref">${esc(ref)}</div>
      <blockquote class="pv-key-scripture"><span class="zh" lang="zh-CN">${esc(verse.zh)}</span><span class="en" lang="en">${esc(verse.en)}</span></blockquote>
      <div class="pv-key-note"><span class="pv-mini">${bi('这节的意思', 'What it means')}</span><p>${bi(kv.meansZh, kv.meansEn)}</p></div>
      <div class="pv-key-note"><span class="pv-mini">${bi('为什么重要', 'Why it matters')}</span><p>${bi(kv.mattersZh, kv.mattersEn)}</p></div>
      <div class="pv-key-note"><span class="pv-mini">${bi('今天', 'Today')}</span><p>${bi(kv.todayZh, kv.todayEn)}</p></div>
    </article>`;
  }).join('');
  const keyVerses = `<section class="pv-sec" aria-labelledby="pv-key-h">
      <h2 id="pv-key-h" class="pv-h">${bi('重点经文', 'Key Verses')}</h2>
      <div class="pv-key-grid">${keyCards}</div>
    </section>`;

  // UNDERSTAND THE PASSAGE
  const passHtml = (data.passages || []).map((p) => `<article class="pv-passage">
      <h3 class="pv-passage-h"><span class="pv-range">${esc(p.rangeLabel)}</span> ${bi(p.titleZh, p.titleEn)}</h3>
      <div class="pv-qa"><span class="pv-mini">${bi('经文说什么？', 'What does it say?')}</span><p>${bi(p.sayZh, p.sayEn)}</p></div>
      <div class="pv-qa"><span class="pv-mini">${bi('它是什么意思？', 'What does it mean?')}</span><p>${bi(p.meanZh, p.meanEn)}</p></div>
      <div class="pv-qa"><span class="pv-mini">${bi('与我有什么关系？', 'What does this mean for me?')}</span><p>${bi(p.forMeZh, p.forMeEn)}</p></div>
    </article>`).join('');
  const understand = `<section class="pv-sec" aria-labelledby="pv-un-h">
      <h2 id="pv-un-h" class="pv-h">${bi('逐段理解', 'Understand the Passage')}</h2>
      <p class="pv-microdisclaimer">${bi('以下为帮助理解的研读说明，以经文本身为准。', 'These are study notes to aid understanding; the text itself is the authority.')}</p>
      ${passHtml}
    </section>`;

  // WISDOM FOR REAL LIFE
  const rlHtml = (data.realLife || []).map((r) => {
    const refChip = r.verseRef ? `<span class="pv-rl-ref">${esc(r.verseRef)}</span>` : '';
    return `<article class="pv-rl">
      <div class="pv-rl-tag">${bi(r.tagZh, r.tag)} ${refChip}</div>
      <h3 class="pv-rl-h">${bi(r.titleZh, r.titleEn)}</h3>
      <p>${bi(r.bodyZh, r.bodyEn)}</p>
    </article>`;
  }).join('');
  const realLife = `<section class="pv-sec pv-realified" aria-labelledby="pv-rl-h">
      <h2 id="pv-rl-h" class="pv-h">${bi('活出智慧：现实场景', 'Wisdom for Real Life')}</h2>
      <p class="pv-microdisclaimer">${bi('这些是把经文应用到生活的提示，不是圣经经文。', 'These are prompts for applying Scripture to life — not Bible verses.')}</p>
      <div class="pv-rl-grid">${rlHtml}</div>
    </section>`;

  // REFLECTION
  const reflHtml = (data.reflect || []).map((q, i) => `<li><span class="pv-qnum">${i + 1}</span>${bi(q.zh, q.en)}</li>`).join('');
  const reflection = `<section class="pv-sec" aria-labelledby="pv-refl-h">
      <h2 id="pv-refl-h" class="pv-h">${bi('默想问题', 'Reflection Questions')}</h2>
      <ol class="pv-reflect">${reflHtml}</ol>
    </section>`;

  // PRAYER (+ soft AI entry)
  const prayer = `<section class="pv-sec pv-prayer" aria-labelledby="pv-pray-h">
      <h2 id="pv-pray-h" class="pv-h">${bi('祷告', 'Prayer')}</h2>
      <p class="pv-prayer-body">${bi(data.prayer.zh, data.prayer.en)}</p>
      <p class="pv-microdisclaimer">${bi('（这是祷告文字，不是圣经经文。）', '(This is a prayer, not Scripture.)')}</p>
      <a class="pv-softlink" href="index.html#prayer-care">${bi('为一个决定祷告 →', 'Pray about a decision →')}</a>
    </section>`;

  // ONE THING + DAILY CHALLENGE
  const oneThing = `<section class="pv-sec pv-onething" aria-labelledby="pv-one-h">
      <h2 id="pv-one-h" class="pv-h">${bi('记住这一句', 'One Thing to Remember')}</h2>
      <p class="pv-one">${bi(data.oneThing.zh, data.oneThing.en)}</p>
      <p class="pv-microdisclaimer">${bi('（概括句；箴言 1:7 的经文原文见「重点经文」。）', '(A takeaway summary; see Key Verses for the exact text of Proverbs 1:7.)')}</p>
    </section>`;
  const challenge = `<section class="pv-sec pv-challenge" aria-labelledby="pv-ch-h">
      <h2 id="pv-ch-h" class="pv-h">${bi('今日智慧行动', 'Daily Wisdom Challenge')}</h2>
      <p class="pv-challenge-body">${bi(data.dailyChallenge.zh, data.dailyChallenge.en)}</p>
      <p class="pv-microdisclaimer">${bi('（生活应用建议，不是圣经经文。）', '(An application prompt, not Scripture.)')}</p>
    </section>`;

  // QUESTIONS TO SIT WITH — these are reflection prompts, NOT clickable Q&A
  // (Proverbs-specific Bible Q&A is not built yet; sending these to the general
  // Q&A could mis-match or fall back, which would mislead). A single, clearly
  // labelled general Q&A link is offered separately below.
  const askItems = (data.ask?.promptsZh || []).map((z, i) =>
    `<li>${bi(z, data.ask.promptsEn[i])}</li>`).join('');
  const ask = `<section class="pv-sec pv-ask" aria-labelledby="pv-ask-h">
      <h2 id="pv-ask-h" class="pv-h">${bi('可以进一步思考的问题', 'Questions to sit with')}</h2>
      <p class="pv-microdisclaimer">${bi('这些是思考提示，帮助你默想本章；目前还不是可点击的问答。', 'These are reflection prompts to ponder this chapter — not clickable Q&A yet.')}</p>
      <ul class="pv-ask-prompts">${askItems}</ul>
      <p class="pv-ask-general"><a href="ask.html#biblical-qa">${bi('有其他圣经问题？前往 Bible Q&A（《箴言》专项问答正在准备中）', 'Have another Bible question? Visit Bible Q&A (Proverbs-specific Q&A is coming soon).')}</a></p>
    </section>`;

  return bigIdea + overview + read + keyVerses + understand + realLife + reflection + prayer + oneThing + challenge + ask;
}

// Prev / Next chapter controls (only links to chapters that are built).
export function renderChapterFooterNav(chapters, active) {
  const isFull = (n) => chapters.some((c) => c.n === n && c.status === 'full');
  const prev = active > 1 && isFull(active - 1) ? `<a class="pv-nav-prev" href="${proverbsHref(active - 1)}">${bi('← 上一章', '← Previous')}</a>` : '<span></span>';
  const next = isFull(active + 1) ? `<a class="pv-nav-next" href="${proverbsHref(active + 1)}">${bi('下一章 →', 'Next →')}</a>` : `<span class="pv-nav-soon">${bi('下一章筹备中', 'Next chapter coming soon')}</span>`;
  return `<div class="pv-chapter-nav">${prev}${next}</div>`;
}
