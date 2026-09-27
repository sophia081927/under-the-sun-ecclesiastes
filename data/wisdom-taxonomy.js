/*
 * wisdom-taxonomy.js — shared topic taxonomy for "wisdom for everyday life".
 * ---------------------------------------------------------------------------
 * Built for Proverbs, but intentionally GENERIC: each theme has a stable `id`,
 * bilingual labels, and a short plain-language description. Other features
 * (Bible Q&A, topic browsing, search) can reuse these ids to tag content across
 * books, so the taxonomy is not hard-wired to Proverbs.
 *
 * A chapter/passage may carry several theme ids (see data/books/proverbs/index.js
 * for the Proverbs chapter → themes mapping).
 */
export const WISDOM_THEMES = [
  { id: 'wisdom',          en: 'Wisdom',              zh: '智慧',        descEn: 'Skill for living well before God; not just knowledge, but knowing how to live.', descZh: '在神面前好好生活的能力；不只是知识，而是懂得怎样生活。' },
  { id: 'fear-of-the-lord',en: 'Fear of the LORD',    zh: '敬畏耶和华',  descEn: 'Reverent trust and honor toward God as the starting point of wisdom.', descZh: '以敬畏、信靠尊崇神，作为智慧的开端。' },
  { id: 'speech',          en: 'Speech',              zh: '言语',        descEn: 'Words that heal or harm — honesty, restraint, and timely speech.', descZh: '医治或伤害人的话语——诚实、节制、合时的言语。' },
  { id: 'relationships',   en: 'Relationships',       zh: '人际关系',    descEn: 'Living wisely with others in love, patience, and truth.', descZh: '以爱心、忍耐与真实与他人智慧相处。' },
  { id: 'friendship',      en: 'Friendship',          zh: '朋友',        descEn: 'Choosing companions well; the influence of the people around us.', descZh: '慎选同伴；身边的人对我们的影响。' },
  { id: 'marriage-family', en: 'Marriage & Family',   zh: '婚姻家庭',    descEn: 'Faithfulness, honor, and love within marriage and the home.', descZh: '在婚姻与家庭中的忠诚、尊重与爱。' },
  { id: 'parenting',       en: 'Parenting',           zh: '教养孩子',    descEn: 'Guiding and instructing children with love and consistency.', descZh: '以爱心与一致性引导、教导孩子。' },
  { id: 'work',            en: 'Work & Diligence',    zh: '工作与勤奋',  descEn: 'Faithful effort, diligence, and honest labor.', descZh: '忠心的努力、勤奋与诚实的劳作。' },
  { id: 'money',           en: 'Money & Stewardship', zh: '金钱与管理',  descEn: 'Handling wealth with integrity, generosity, and contentment.', descZh: '以正直、慷慨与知足对待财富。' },
  { id: 'integrity',       en: 'Integrity',           zh: '正直',        descEn: 'Being the same person in public and in private; honesty of heart.', descZh: '人前人后一致；心里的诚实。' },
  { id: 'self-control',    en: 'Self-Control',        zh: '节制',        descEn: 'Governing desires, impulses, and appetites.', descZh: '管理自己的欲望、冲动与胃口。' },
  { id: 'anger-conflict',  en: 'Anger & Conflict',    zh: '愤怒与冲突',  descEn: 'Handling anger, quarrels, and conflict with wisdom.', descZh: '以智慧处理愤怒、争吵与冲突。' },
  { id: 'temptation',      en: 'Temptation',          zh: '诱惑',        descEn: 'Recognizing and resisting enticement toward wrong.', descZh: '辨识并抵挡走向错误的引诱。' },
  { id: 'sexual-integrity',en: 'Sexual Integrity',    zh: '情欲与忠贞',  descEn: 'Faithfulness and purity in desire and relationships.', descZh: '在情欲与关系中的忠贞与纯洁。' },
  { id: 'humility-pride',  en: 'Humility & Pride',    zh: '谦卑与骄傲',  descEn: 'The danger of pride and the grace found in humility.', descZh: '骄傲的危险与谦卑里的恩典。' },
  { id: 'justice',         en: 'Justice',             zh: '公义',        descEn: 'Fairness, defending the weak, and doing what is right.', descZh: '公平、扶助弱者、行正确的事。' },
  { id: 'decision-making', en: 'Decision Making',     zh: '决策',        descEn: 'Seeking wisdom before choosing, not only after mistakes.', descZh: '在选择之前寻求智慧，而不是出错之后。' },
  { id: 'discipline',      en: 'Discipline',          zh: '管教与纪律',  descEn: 'Correction, training, and steady habits that shape character.', descZh: '塑造品格的管教、训练与稳定习惯。' },
  { id: 'trust-in-god',    en: 'Trust in God',        zh: '信靠神',      descEn: 'Leaning on God rather than one’s own understanding.', descZh: '倚靠神，而不是倚靠自己的聪明。' },
  { id: 'leadership',      en: 'Leadership',          zh: '领导',        descEn: 'Leading and guiding others with wisdom and justice.', descZh: '以智慧与公义带领、引导他人。' },
  { id: 'generosity',      en: 'Generosity',          zh: '慷慨',        descEn: 'Open-handed giving and care for those in need.', descZh: '慷慨施与，关顾有需要的人。' },
  { id: 'listening',       en: 'Listening & Learning',zh: '聆听与受教',  descEn: 'A teachable heart that receives instruction and correction.', descZh: '受教的心，愿意领受教导与责备。' },
  { id: 'consequences',    en: 'Consequences',        zh: '选择与后果',  descEn: 'How choices bear fruit — the paths of wisdom and folly.', descZh: '选择如何结出果子——智慧与愚昧的两条路。' },
  { id: 'contentment',     en: 'Contentment',         zh: '知足',        descEn: 'Peace and gratitude that do not depend on circumstances.', descZh: '不倚赖环境的平安与感恩。' },
];

export const THEME_BY_ID = Object.fromEntries(WISDOM_THEMES.map((t) => [t.id, t]));

// Convenience: validate a list of theme ids (used by book data + future tooling).
export function validThemeIds(ids) {
  return Array.isArray(ids) && ids.every((id) => id in THEME_BY_ID);
}
