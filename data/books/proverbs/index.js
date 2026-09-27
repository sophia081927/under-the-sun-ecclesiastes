/*
 * Proverbs — book metadata and chapter index.
 * ---------------------------------------------------------------------------
 * Product positioning: "Wisdom for everyday life / 日常生活中的属天智慧".
 * Chapter 1 is the fully built master ("full"); chapters 2–31 are placeholders
 * ("upcoming") to be built in a later phase against the approved Chapter 1
 * template. Section divisions below follow the book's own structure and are used
 * to keep whole-book logic coherent (not shown to readers as academic text).
 *
 * Scripture sources (verbatim, verified against the project corpus):
 *   English — World English Bible (WEB, public domain), worker/scripture-assets/en/PRO
 *   Chinese — 新标点和合本（简体，公共领域, cmn-cu89s / eBible.org), worker/scripture-assets/zh/PRO
 */

// The six canonical divisions of Proverbs (metadata for whole-book coherence).
export const proverbsDivisions = [
  { id: 'invitation', chapters: '1–9',   titleZh: '智慧的邀请与父亲的教导', titleEn: 'Wisdom’s Invitation & a Father’s Instruction' },
  { id: 'solomon',    chapters: '10–22', titleZh: '所罗门的智慧箴言（日常生活）', titleEn: 'Proverbs of Solomon — Wisdom for Daily Living' },
  { id: 'sayings',    chapters: '22:17–24', titleZh: '智慧人的言语', titleEn: 'Sayings of the Wise' },
  { id: 'hezekiah',   chapters: '25–29', titleZh: '所罗门箴言的后续汇编', titleEn: 'Further Proverbs of Solomon (Hezekiah’s collection)' },
  { id: 'agur',       chapters: '30',    titleZh: '亚古珥的话', titleEn: 'The Words of Agur' },
  { id: 'lemuel',     chapters: '31',    titleZh: '利慕伊勒王的教训与才德的妇人', titleEn: 'King Lemuel & the Woman of Noble Character' },
];

// Assign each chapter to its primary division (22:17ff begins "Sayings of the Wise",
// which mid-chapter boundary is noted in proverbsDivisions above).
function divisionFor(n) {
  if (n <= 9) return 'invitation';
  if (n <= 22) return 'solomon';
  if (n <= 24) return 'sayings';
  if (n <= 29) return 'hezekiah';
  if (n === 30) return 'agur';
  return 'lemuel';
}

// n:1 is the built master. 2–31 carry neutral placeholder titles + provisional
// (empty) theme tags to be filled when their content is built in P2.
const CH1 = {
  titleZh: '智慧的开端',
  titleEn: 'The Beginning of Wisdom',
  themes: ['fear-of-the-lord', 'wisdom', 'decision-making', 'friendship', 'money', 'parenting', 'temptation', 'consequences', 'listening'],
  status: 'full',
};

export const proverbsChapters = Array.from({ length: 31 }, (_, i) => {
  const n = i + 1;
  if (n === 1) return { n, section: divisionFor(n), ...CH1 };
  return {
    n,
    section: divisionFor(n),
    titleZh: `箴言 第 ${n} 章`,
    titleEn: `Proverbs ${n}`,
    themes: [], // provisional — populated when the chapter is built (P2)
    status: 'upcoming',
  };
});

export const proverbsBook = {
  id: 'proverbs',
  titleZh: '箴言',
  titleEn: 'Proverbs',
  taglineZh: '日常生活中的属天智慧',
  taglineEn: 'Wisdom for everyday life',
  subtitleZh: '把圣经的智慧带进每天的真实选择',
  subtitleEn: 'Bringing the Bible’s wisdom into today’s real choices',
  introZh: '《箴言》是一卷帮助我们把智慧活出来的书。它不只是格言的合集，而是邀请我们从敬畏耶和华开始，学习怎样说话、怎样交友、怎样看待金钱、怎样做决定、怎样面对诱惑与冲突。第 1 章为整卷定下基调：真正的智慧不是从“知道很多”开始，而是从敬畏神、愿意受教开始。',
  introEn: 'Proverbs is a book that helps us live wisdom out. It is not merely a collection of sayings, but an invitation — beginning with the fear of the LORD — to learn how to speak, choose friends, handle money, make decisions, and face temptation and conflict. Chapter 1 sets the tone for the whole book: real wisdom does not begin with knowing a lot, but with honoring God and being willing to be taught.',
  divisions: proverbsDivisions,
  chapters: proverbsChapters,
  sources: {
    zh: '新标点和合本（简体，公共领域）',
    en: 'World English Bible (WEB, Public Domain)',
    sourceUrl: 'https://ebible.org/',
  },
};
