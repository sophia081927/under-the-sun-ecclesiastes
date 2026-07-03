/**
 * Central multilingual Bible-book registry — the single source of truth.
 *
 * To add a new book: append one object below and add its content file(s).
 * Nothing else needs to change — the home page (index.html) renders every
 * entry automatically from this data.
 *
 * Fields:
 *   id            unique slug
 *   order         display order on the home page
 *   status        'active'  -> clickable card (page must exist)
 *                 'upcoming'-> elegant "Coming soon" card (not clickable)
 *   route         clean route for a future router (informational for now)
 *   page          main reading page for an active book (e.g. 'john.html')
 *   listen        Listening-Mode page, or null
 *   study         guided-study page, or null
 *   deck          visual-deck page, or null
 *   bookType(+Zh) category
 *   theme*, tagline*, description*   bilingual copy
 *   bgColor       Tailwind gradient utility classes (used by index.html)
 *   accentColor   hex accent for the card
 *   audioEnabled  whether an Audio Bible / Listening Mode exists yet
 *   languages     supported languages
 *   features      feature flags — future-proof capability map per book.
 *                 Turn a flag on once its content file exists.
 */
export const bibleRegistry = [
  {
    id: 'ecclesiastes',
    order: 1,
    titleZh: '传道书',
    titleEn: 'Ecclesiastes',
    status: 'active',
    route: '/ecclesiastes',
    page: 'ecclesiastes.html',
    listen: 'listen.html',
    study: null,
    deck: 'deck-en.html',
    bookType: 'Wisdom Literature',
    bookTypeZh: '智慧书',
    themeZh: '虚空、智慧、时间、死亡、永恒、敬畏神',
    themeEn: 'Vanity, wisdom, time, death, eternity, and the fear of God',
    taglineZh: '在虚空的世界里，寻找不虚空的永恒',
    taglineEn: 'Finding eternity and purpose in a fleeting world under the sun.',
    descriptionZh: '传道书带领读者诚实面对人生的虚空、劳碌、时间、死亡与意义，并最终指向敬畏神的智慧。',
    descriptionEn: 'Ecclesiastes invites readers to confront vanity, labor, time, mortality, and meaning, ultimately pointing toward the wisdom of fearing God.',
    bgColor: 'from-[#4A0E17] to-[#12161A]',
    accentColor: '#D4AF37',
    audioEnabled: true,
    languages: ['zh', 'en'],
    features: { read: true, listen: true, study: false, deck: true, ask: true }
  },
  {
    id: 'job',
    order: 2,
    titleZh: '约伯记',
    titleEn: 'Job',
    status: 'upcoming',
    route: '/job',
    page: null,
    listen: null,
    study: null,
    deck: null,
    bookType: 'Wisdom Literature',
    bookTypeZh: '智慧书',
    themeZh: '苦难、沉默、信心、神的主权、疗愈',
    themeEn: 'Suffering, silence, faith, divine sovereignty, and healing',
    taglineZh: '当苦难骤降，在静默中俯伏与疗愈',
    taglineEn: 'Navigating unexplainable suffering and divine sovereignty.',
    descriptionZh: '约伯记探索义人受苦、人的有限、神的沉默与神主权之下的信心。',
    descriptionEn: 'Job explores righteous suffering, human limitation, divine silence, and faith under the sovereignty of God.',
    bgColor: 'from-[#1A2A3A] to-[#12161A]',
    accentColor: '#B8C7D9',
    audioEnabled: false,
    languages: ['zh', 'en'],
    features: { read: false, listen: false, study: false, deck: false, ask: false }
  },
  {
    id: 'john',
    order: 3,
    titleZh: '约翰福音',
    titleEn: 'John',
    status: 'active',
    route: '/john',
    page: 'john.html',
    listen: null,
    study: 'john-study.html',
    deck: 'john-deck-en.html',
    bookType: 'Gospel',
    bookTypeZh: '福音书',
    themeZh: '道成肉身、生命、真光、信、永生',
    themeEn: 'The Word made flesh, life, true light, belief, and eternal life',
    taglineZh: '生命在祂里头，这生命就是人的光',
    taglineEn: 'The eternal Word made flesh, bringing true light into darkness.',
    descriptionZh: '约翰福音启示耶稣基督是神的儿子，是生命、真光、道路、真理与生命。',
    descriptionEn: 'The Gospel of John reveals Jesus Christ as the Son of God, the source of life, true light, the way, the truth, and the life.',
    bgColor: 'from-[#2D1A3A] to-[#12161A]',
    accentColor: '#E8D7FF',
    audioEnabled: false,
    languages: ['zh', 'en'],
    features: { read: true, listen: false, study: true, deck: true, ask: true }
  },
  {
    id: 'matthew',
    order: 4,
    titleZh: '马太福音',
    titleEn: 'Matthew',
    status: 'upcoming',
    route: '/matthew',
    page: null,
    listen: null,
    study: null,
    deck: null,
    bookType: 'Gospel',
    bookTypeZh: '福音书',
    themeZh: '天国、君王、应验、门徒、大使命',
    themeEn: 'The kingdom, the King, fulfillment, discipleship, and the Great Commission',
    taglineZh: '天国近了——那位应验一切应许的君王',
    taglineEn: 'The promised King in whom every promise finds its yes.',
    descriptionZh: '马太福音将耶稣呈现为应验旧约应许的君王与弥赛亚，宣告天国的降临与门徒之路。',
    descriptionEn: 'Matthew presents Jesus as the promised King and Messiah who fulfills the Scriptures, announcing the kingdom of heaven and the way of discipleship.',
    bgColor: 'from-[#2A2410] to-[#12161A]',
    accentColor: '#D9C89A',
    audioEnabled: false,
    languages: ['zh', 'en'],
    features: { read: false, listen: false, study: false, deck: false, ask: false }
  }
];

/** Feature labels (bilingual) — used by the home page to show what each book offers. */
export const featureLabels = {
  read:   { zh: '阅读', en: 'Read',   key: 'page'   },
  listen: { zh: '聆听', en: 'Listen', key: 'listen' },
  study:  { zh: '导览', en: 'Study',  key: 'study'  },
  deck:   { zh: '图解', en: 'Deck',   key: 'deck'   },
  ask:    { zh: '提问', en: 'Ask',    key: null     },
};

/** Convenience helpers (optional, for future pages). */
export const activeBooks = () => bibleRegistry.filter(b => b.status === 'active');
export const getBook = (id) => bibleRegistry.find(b => b.id === id) || null;

export default bibleRegistry;
