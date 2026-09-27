/*
 * Proverbs — book metadata and chapter index.
 * Positioning: "Wisdom for everyday life / 日常生活中的属天智慧".
 * proverbsChapters[] is generated from the per-chapter files (titles/themes/section/status).
 * Scripture sources (verbatim, verified vs the project corpus by scripts/verify-proverbs-corpus.mjs):
 *   English — World English Bible (WEB, public domain), worker/scripture-assets/en/PRO
 *   Chinese — 新标点和合本（简体，公共领域, cmn-cu89s / eBible.org), worker/scripture-assets/zh/PRO
 */
export const proverbsDivisions = [
  { id: 'invitation', chapters: '1–9', titleZh: '智慧的邀请与父亲的教导', titleEn: 'Wisdom’s Invitation & a Father’s Instruction' },
  { id: 'solomon', chapters: '10–22', titleZh: '所罗门的智慧箴言（日常生活）', titleEn: 'Proverbs of Solomon — Wisdom for Daily Living' },
  { id: 'sayings', chapters: '22:17–24', titleZh: '智慧人的言语', titleEn: 'Sayings of the Wise' },
  { id: 'hezekiah', chapters: '25–29', titleZh: '所罗门箴言的后续汇编', titleEn: 'Further Proverbs of Solomon (Hezekiah’s collection)' },
  { id: 'agur', chapters: '30', titleZh: '亚古珥的话', titleEn: 'The Words of Agur' },
  { id: 'lemuel', chapters: '31', titleZh: '利慕伊勒王的教训与才德的妇人', titleEn: 'King Lemuel & the Woman of Noble Character' },
];

export const proverbsChapters = [
  { n: 1, section: 'invitation', titleZh: '智慧的开端', titleEn: 'The Beginning of Wisdom', themes: ['fear-of-the-lord', 'wisdom', 'decision-making', 'friendship', 'money', 'parenting', 'temptation', 'consequences', 'listening'], status: 'full' },
  { n: 2, section: 'invitation', titleZh: '寻找智慧如寻宝', titleEn: 'Search for Wisdom Like Treasure', themes: ['wisdom', 'fear-of-the-lord', 'trust-in-god', 'listening', 'temptation', 'sexual-integrity', 'integrity', 'consequences'], status: 'full' },
  { n: 3, section: 'invitation', titleZh: '专心仰赖耶和华', titleEn: 'Trust in the LORD With All Your Heart', themes: ['trust-in-god', 'fear-of-the-lord', 'wisdom', 'money', 'discipline', 'generosity', 'relationships', 'humility-pride', 'consequences'], status: 'full' },
  { n: 4, section: 'invitation', titleZh: '保守你的心', titleEn: 'Guard Your Heart', themes: ['wisdom', 'parenting', 'discipline', 'self-control', 'integrity', 'listening', 'consequences', 'decision-making'], status: 'full' },
  { n: 5, section: 'invitation', titleZh: '忠于所爱的人', titleEn: 'Faithful to the One You Love', themes: ['sexual-integrity', 'marriage-family', 'temptation', 'self-control', 'contentment', 'fear-of-the-lord', 'consequences', 'listening'], status: 'full' },
  { n: 6, section: 'invitation', titleZh: '日常生活的智慧警戒', titleEn: 'Everyday Warnings From Wisdom', themes: ['work', 'money', 'speech', 'integrity', 'self-control', 'temptation', 'sexual-integrity', 'consequences', 'marriage-family'], status: 'full' },
  { n: 7, section: 'invitation', titleZh: '一个少年人的迷途', titleEn: 'A Young Man Led Astray', themes: ['temptation', 'sexual-integrity', 'self-control', 'wisdom', 'decision-making', 'consequences', 'marriage-family', 'listening'], status: 'full' },
  { n: 8, section: 'invitation', titleZh: '智慧的呼唤', titleEn: 'Wisdom Calls Out', themes: ['wisdom', 'fear-of-the-lord', 'listening', 'decision-making', 'integrity', 'leadership', 'trust-in-god'], status: 'full' },
  { n: 9, section: 'invitation', titleZh: '两席筵宴', titleEn: 'Two Invitations', themes: ['wisdom', 'fear-of-the-lord', 'decision-making', 'temptation', 'listening', 'consequences', 'self-control'], status: 'full' },
  { n: 10, section: 'solomon', titleZh: '义人与恶人的两条路', titleEn: 'Two Ways: The Righteous and the Wicked', themes: ['speech', 'work', 'money', 'integrity', 'consequences', 'wisdom', 'fear-of-the-lord'], status: 'full' },
  { n: 11, section: 'solomon', titleZh: '正直、谦卑与慷慨', titleEn: 'Integrity, Humility, and Generosity', themes: ['integrity', 'humility-pride', 'generosity', 'speech', 'money', 'trust-in-god', 'consequences'], status: 'full' },
  { n: 12, section: 'solomon', titleZh: '受教的心与医人的舌', titleEn: 'A Teachable Heart and a Healing Tongue', themes: ['discipline', 'listening', 'speech', 'work', 'integrity', 'relationships', 'consequences'], status: 'full' },
  { n: 13, section: 'solomon', titleZh: '同行的人与长久的果子', titleEn: 'The Company You Keep and the Fruit That Lasts', themes: ['discipline', 'listening', 'friendship', 'speech', 'money', 'parenting', 'consequences'], status: 'full' },
  { n: 14, section: 'solomon', titleZh: '看似正确的路', titleEn: 'The Way That Seems Right', themes: ['wisdom', 'fear-of-the-lord', 'speech', 'anger-conflict', 'work', 'money', 'integrity', 'consequences', 'generosity'], status: 'full' },
  { n: 15, section: 'solomon', titleZh: '回答柔和', titleEn: 'A Gentle Answer', themes: ['speech', 'anger-conflict', 'listening', 'contentment', 'fear-of-the-lord', 'humility-pride', 'relationships', 'wisdom'], status: 'full' },
  { n: 16, section: 'solomon', titleZh: '人筹算，神引导', titleEn: 'We Plan, God Directs', themes: ['trust-in-god', 'decision-making', 'humility-pride', 'speech', 'self-control', 'integrity', 'wisdom', 'fear-of-the-lord'], status: 'full' },
  { n: 17, section: 'solomon', titleZh: '和睦与真友情', titleEn: 'Peace and True Friendship', themes: ['relationships', 'friendship', 'speech', 'anger-conflict', 'self-control', 'contentment', 'wisdom', 'justice'], status: 'full' },
  { n: 18, section: 'solomon', titleZh: '生死在舌头的权下', titleEn: 'Death and Life in the Tongue', themes: ['speech', 'relationships', 'friendship', 'humility-pride', 'listening', 'trust-in-god', 'marriage-family', 'wisdom'], status: 'full' },
  { n: 19, section: 'solomon', titleZh: '纯正胜过富足', titleEn: 'Integrity over Wealth', themes: ['integrity', 'money', 'generosity', 'anger-conflict', 'listening', 'trust-in-god', 'contentment', 'wisdom'], status: 'full' },
  { n: 20, section: 'solomon', titleZh: '神鉴察人心', titleEn: 'The LORD Weighs the Heart', themes: ['integrity', 'self-control', 'justice', 'speech', 'work', 'money', 'trust-in-god', 'consequences'], status: 'full' },
  { n: 21, section: 'solomon', titleZh: '神衡量人心', titleEn: 'The LORD Weighs the Hearts', themes: ['justice', 'integrity', 'trust-in-god', 'self-control', 'speech', 'money', 'humility-pride', 'consequences'], status: 'full' },
  { n: 22, section: 'solomon', titleZh: '美名与智者之言', titleEn: 'A Good Name and the Words of the Wise', themes: ['integrity', 'money', 'parenting', 'generosity', 'humility-pride', 'justice', 'work', 'listening'], status: 'full' },
  { n: 23, section: 'sayings', titleZh: '你要买真理', titleEn: 'Buy the Truth', themes: ['self-control', 'money', 'discipline', 'parenting', 'fear-of-the-lord', 'listening', 'contentment', 'sexual-integrity'], status: 'full' },
  { n: 24, section: 'sayings', titleZh: '义人跌倒，仍要兴起', titleEn: 'The Righteous Rise Again', themes: ['wisdom', 'justice', 'work', 'self-control', 'contentment', 'consequences', 'fear-of-the-lord', 'relationships'], status: 'full' },
  { n: 25, section: 'hezekiah', titleZh: '合宜的言语与谦卑', titleEn: 'The Right Word and a Humble Heart', themes: ['speech', 'humility-pride', 'self-control', 'relationships', 'leadership', 'anger-conflict', 'integrity'], status: 'full' },
  { n: 26, section: 'hezekiah', titleZh: '愚昧人、懒惰人与传舌的人', titleEn: 'The Fool, the Sluggard, and the Gossip', themes: ['wisdom', 'speech', 'anger-conflict', 'work', 'integrity', 'relationships', 'self-control', 'consequences'], status: 'full' },
  { n: 27, section: 'hezekiah', titleZh: '铁磨铁：真朋友的价值', titleEn: 'Iron Sharpens Iron: The Worth of a True Friend', themes: ['friendship', 'relationships', 'humility-pride', 'speech', 'work', 'listening', 'contentment'], status: 'full' },
  { n: 28, section: 'hezekiah', titleZh: '正直的胆量，认罪的自由', titleEn: 'The Courage of Integrity, the Freedom of Confession', themes: ['integrity', 'justice', 'money', 'generosity', 'trust-in-god', 'leadership', 'consequences', 'humility-pride'], status: 'full' },
  { n: 29, section: 'hezekiah', titleZh: '受教的心，掌控的怒气', titleEn: 'A Teachable Heart, a Governed Temper', themes: ['discipline', 'listening', 'anger-conflict', 'self-control', 'humility-pride', 'justice', 'leadership', 'trust-in-god', 'parenting'], status: 'full' },
  { n: 30, section: 'agur', titleZh: '亚古珥的话：谦卑、知足与惊奇', titleEn: 'The Words of Agur: Humility, Contentment, and Wonder', themes: ['humility-pride', 'trust-in-god', 'contentment', 'wisdom', 'self-control', 'fear-of-the-lord', 'money', 'anger-conflict'], status: 'full' },
  { n: 31, section: 'lemuel', titleZh: '君王之母的叮咛与智慧的画像', titleEn: 'A Mother’s Counsel and a Portrait of Wisdom', themes: ['wisdom', 'fear-of-the-lord', 'work', 'generosity', 'justice', 'marriage-family', 'speech', 'integrity'], status: 'full' },
];

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
  sources: { zh: '新标点和合本（简体，公共领域）', en: 'World English Bible (WEB, Public Domain)', sourceUrl: 'https://ebible.org/' },
};
