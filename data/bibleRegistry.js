/**
 * Central multilingual Bible-book registry — the single source of truth.
 *
 * Keep this file LIGHTWEIGHT: identity, routing, labels, colors, status, and
 * feature flags only. Long content (chapters, reflections, worship, audio)
 * lives in per-book files under data/books/<id>.js.
 *
 * To add a book: append one entry here + add its content/pages. The home page
 * (index.html) renders every entry automatically.
 *
 * Fields:
 *   id, order, status('active'|'upcoming')
 *   titleZh/En, bookType(+Zh)
 *   route         clean route (informational; static host also serves <page>)
 *   page          reading page for active books; Coming-Soon page for upcoming
 *   listen/study/deck   capability page paths (or null)
 *   listenRoute   clean listen route (informational)
 *   theme*, tagline*, description*   bilingual copy
 *   keyVerse      { zh:{reference,text}, en:{reference,text} }
 *   bgColor       Tailwind gradient classes; accentColor hex
 *   languages, audioEnabled
 *   features      capability flags: read/listen/ask/reflection/worship/bilingual
 *                 (+ study/deck used by the home page). Flip on when a file exists.
 */
export const bibleRegistry = [
  {
    id: 'ecclesiastes',
    order: 1,
    titleZh: '传道书',
    titleEn: 'Ecclesiastes',
    status: 'active',
    route: '/ecclesiastes',
    listenRoute: '/ecclesiastes/listen',
    page: 'ecclesiastes.html',
    listen: 'listen.html',
    study: null,
    deck: 'deck-en.html',
    bookType: 'Wisdom Literature',
    bookTypeZh: '智慧书',
    themeZh: '虚空、智慧、时间、死亡、永恒、敬畏神',
    themeEn: 'Vanity, wisdom, time, death, eternity, and the fear of God',
    taglineZh: '在虚空的世界里，寻找不虚空的永恒。',
    taglineEn: 'Finding eternity and purpose in a fleeting world under the sun.',
    descriptionZh: '传道书带领读者诚实面对人生的虚空、劳碌、时间、死亡与意义，并最终指向敬畏神的智慧。',
    descriptionEn: 'Ecclesiastes invites readers to confront vanity, labor, time, mortality, and meaning, ultimately pointing toward the wisdom of fearing God.',
    keyVerse: {
      zh: { reference: '传道书 1:14', text: '我见日光之下所行的一切事，都是虚空，都是捕风。' },
      en: { reference: 'Ecclesiastes 1:14', text: 'I have seen all the things that are done under the sun; all of them are meaningless, a chasing after the wind.' }
    },
    bgColor: 'from-[#4A0E17] to-[#12161A]',
    accentColor: '#D4AF37',
    languages: ['zh', 'en'],
    audioEnabled: true,
    features: { read: true, listen: true, ask: true, reflection: true, worship: true, bilingual: true, study: false, deck: true }
  },
  {
    id: 'john',
    order: 2,
    titleZh: '约翰福音',
    titleEn: 'John',
    status: 'active',
    route: '/john',
    listenRoute: null,
    page: 'john.html',
    listen: null,
    study: 'john-study.html',
    deck: 'john-deck-en.html',
    bookType: 'Gospel',
    bookTypeZh: '福音书',
    themeZh: '道成肉身、生命、真光、信、永生',
    themeEn: 'The Word made flesh, life, true light, belief, and eternal life',
    taglineZh: '生命在祂里头，这生命就是人的光。',
    taglineEn: 'The eternal Word made flesh, bringing true light into darkness.',
    descriptionZh: '约翰福音启示耶稣基督是神的儿子，是生命、真光、道路、真理与生命。',
    descriptionEn: 'The Gospel of John reveals Jesus Christ as the Son of God, the source of life, true light, the way, the truth, and the life.',
    keyVerse: {
      zh: { reference: '约翰福音 1:4-5', text: '生命在他里头，这生命就是人的光。光照在黑暗里，黑暗却不接受光。' },
      en: { reference: 'John 1:4-5', text: 'In him was life, and that life was the light of all mankind. The light shines in the darkness, and the darkness has not overcome it.' }
    },
    bgColor: 'from-[#2D1A3A] to-[#12161A]',
    accentColor: '#E8D7FF',
    languages: ['zh', 'en'],
    audioEnabled: false,
    features: { read: true, listen: false, ask: true, reflection: true, worship: true, bilingual: true, study: true, deck: true }
  },
  {
    id: 'job',
    order: 3,
    titleZh: '约伯记',
    titleEn: 'Job',
    status: 'upcoming',
    route: '/job',
    listenRoute: null,
    page: 'job.html',
    listen: null,
    study: null,
    deck: null,
    bookType: 'Wisdom Literature',
    bookTypeZh: '智慧书',
    themeZh: '苦难、沉默、信心、神的主权、疗愈',
    themeEn: 'Suffering, silence, faith, divine sovereignty, and healing',
    taglineZh: '当苦难骤降，在静默中俯伏与疗愈。',
    taglineEn: 'Navigating unexplainable suffering and divine sovereignty.',
    descriptionZh: '约伯记探索义人受苦、人的有限、神的沉默与神主权之下的信心。',
    descriptionEn: 'Job explores righteous suffering, human limitation, divine silence, and faith under the sovereignty of God.',
    keyVerse: {
      zh: { reference: '约伯记 1:21', text: '赏赐的是耶和华，收取的也是耶和华；耶和华的名是应当称颂的。' },
      en: { reference: 'Job 1:21', text: 'The Lord gave and the Lord has taken away; may the name of the Lord be praised.' }
    },
    bgColor: 'from-[#1A2A3A] to-[#12161A]',
    accentColor: '#B8C7D9',
    languages: ['zh', 'en'],
    audioEnabled: false,
    features: { read: false, listen: false, ask: false, reflection: false, worship: false, bilingual: true, study: false, deck: false }
  },
  {
    id: 'matthew',
    order: 4,
    titleZh: '马太福音',
    titleEn: 'Matthew',
    status: 'upcoming',
    route: '/matthew',
    listenRoute: null,
    page: 'matthew.html',
    listen: null,
    study: null,
    deck: null,
    bookType: 'Gospel',
    bookTypeZh: '福音书',
    themeZh: '天国、弥赛亚、门徒、教训、成全',
    themeEn: 'The kingdom of heaven, the Messiah, discipleship, teaching, and fulfillment',
    taglineZh: '天国近了，君王已经来到。',
    taglineEn: 'The kingdom of heaven is near, and the King has come.',
    descriptionZh: '马太福音呈现耶稣是应许中的弥赛亚君王，祂成全律法和先知，并呼召人进入天国生命。',
    descriptionEn: 'The Gospel of Matthew presents Jesus as the promised Messianic King who fulfills the Law and the Prophets and calls people into the life of the kingdom.',
    keyVerse: {
      zh: { reference: '马太福音 4:17', text: '天国近了，你们应当悔改！' },
      en: { reference: 'Matthew 4:17', text: 'Repent, for the kingdom of heaven has come near.' }
    },
    bgColor: 'from-[#2B2615] to-[#12161A]',
    accentColor: '#D8C27A',
    languages: ['zh', 'en'],
    audioEnabled: false,
    features: { read: false, listen: false, ask: false, reflection: false, worship: false, bilingual: true, study: false, deck: false }
  }
];

/** Feature labels (bilingual) — used by the home page to show what a book offers. */
export const featureLabels = {
  read:   { zh: '阅读', en: 'Read',   key: 'page'   },
  listen: { zh: '聆听', en: 'Listen', key: 'listen' },
  study:  { zh: '导览', en: 'Study',  key: 'study'  },
  deck:   { zh: '图解', en: 'Deck',   key: 'deck'   },
  ask:    { zh: '提问', en: 'Ask',    key: null     },
};

export const getBookById = (id) => bibleRegistry.find((book) => book.id === id);
export const getActiveBooks = () =>
  bibleRegistry.filter((b) => b.status === 'active').sort((a, b) => a.order - b.order);
export const getUpcomingBooks = () =>
  bibleRegistry.filter((b) => b.status === 'upcoming').sort((a, b) => a.order - b.order);

/** Back-compat aliases. */
export const activeBooks = getActiveBooks;
export const getBook = getBookById;

export default bibleRegistry;
