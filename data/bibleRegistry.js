/**
 * Central multilingual Bible-book registry — the single source of truth.
 *
 * GitHub-Pages-safe navigation: the platform ships flat .html files (refresh-safe,
 * never 404). This registry also exposes hash routes (safeHash/listenHash/
 * worshipHash) that index.html resolves to those flat files, so shareable
 * #/<book>/<view> links work and survive refresh. `page`/`listen`/`worship`
 * hold the actual static file each hash resolves to.
 *
 * Keep this file LIGHTWEIGHT. Long content lives in data/books, data/worship,
 * data/audio, data/media.
 */
export const bibleRegistry = [
  {
    id: 'ecclesiastes',
    order: 1,
    slug: 'ecclesiastes',
    titleZh: '传道书',
    titleEn: 'Ecclesiastes',
    status: 'active',
    // GitHub-Pages-safe hash routes + the static files they resolve to
    safeHash: '#/ecclesiastes',
    listenHash: '#/ecclesiastes/listen',
    worshipHash: '#/ecclesiastes/worship',
    route: '/ecclesiastes',
    listenRoute: '/ecclesiastes/listen',
    worshipRoute: '/ecclesiastes/worship',
    page: 'ecclesiastes.html',
    listen: 'listen.html',
    worship: 'ecclesiastes-worship.html',
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
      en: { reference: 'Ecclesiastes 1:14', text: 'I have seen all the things that are done under the sun, and have found them all to be futile, a pursuit of the wind.' }
    },
    mediaHub: {
      zh: {
        audioTitle: '传道书 · 深度听书解经',
        audioGuide: '🎧 点击聆听：在虚空、劳碌与捕风中寻找永恒的锚',
        worshipTitle: '《一生一世》',
        worshipGuide: '🎵 当一切繁华落尽，转眼仰望耶稣。',
        spotifyLink: 'https://open.spotify.com/search/一生一世+赞美诗',
        youtubeLink: 'https://www.youtube.com/results?search_query=一生一世+赞美诗'
      },
      en: {
        audioTitle: 'Ecclesiastes · Audio Commentary',
        audioGuide: '🎧 Click to listen: finding eternity and purpose in a fleeting world under the sun.',
        worshipTitle: 'Turn Your Eyes Upon Jesus',
        worshipGuide: '🎵 When the noise of the world fades, turn your eyes upon Jesus.',
        spotifyLink: 'https://open.spotify.com/search/Turn+Your+Eyes+Upon+Jesus',
        youtubeLink: 'https://www.youtube.com/results?search_query=Turn+Your+Eyes+Upon+Jesus+worship'
      }
    },
    bgColor: 'from-[#4A0E17] to-[#12161A]',
    accentColor: '#D4AF37',
    audioPathBase: 'audio/ecclesiastes/',
    languages: ['zh', 'en'],
    audioEnabled: true,
    features: { read: true, listen: true, ask: true, reflection: true, worship: true, bilingual: true, study: false, deck: true }
  },
  {
    id: 'john',
    order: 2,
    slug: 'john',
    titleZh: '约翰福音',
    titleEn: 'John',
    status: 'active',
    safeHash: '#/john',
    listenHash: '#/john/listen',
    worshipHash: '#/john/worship',
    route: '/john',
    listenRoute: '/john/listen',
    worshipRoute: '/john/worship',
    page: 'john.html',
    listen: 'john-listen.html',
    worship: 'john-worship.html',
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
      en: { reference: 'John 1:4-5', text: 'In Him was life, and that life was the light of men. The Light shines in the darkness, and the darkness has not overcome it.' }
    },
    mediaHub: {
      zh: {
        audioTitle: '约翰福音第一章 · 深度听书解经',
        audioGuide: '🎧 点击聆听：太初有道与生命真光的属灵奥秘',
        worshipTitle: '《主耶稣我是真光》',
        worshipGuide: '🎵 走出日光之下的捕风，合一沉浸于真光的救赎。',
        spotifyLink: 'https://open.spotify.com/search/主耶稣我是真光',
        youtubeLink: 'https://www.youtube.com/results?search_query=主耶稣我是真光+赞美诗'
      },
      en: {
        audioTitle: 'Gospel of John Chapter 1 · Audio Commentary',
        audioGuide: '🎧 Click to listen: the Logos, eternal life, and the true Light beyond the sun.',
        worshipTitle: 'Way Maker',
        worshipGuide: '🎵 Step out of the fleeting wind and walk into the marvelous light.',
        spotifyLink: 'https://open.spotify.com/search/Way+Maker',
        youtubeLink: 'https://www.youtube.com/results?search_query=Way+Maker+worship'
      }
    },
    bgColor: 'from-[#2D1A3A] to-[#12161A]',
    accentColor: '#E8D7FF',
    audioPathBase: 'audio/john/',
    languages: ['zh', 'en'],
    audioEnabled: true,
    features: { read: true, listen: true, ask: true, reflection: true, worship: true, bilingual: true, study: true, deck: true }
  },
  {
    id: 'psalms',
    order: 3,
    slug: 'psalms',
    titleZh: '诗篇精选',
    titleEn: 'Psalms',
    status: 'active',
    safeHash: '#/psalms',
    listenHash: '#/psalms/listen',
    worshipHash: '#/psalms/worship',
    route: '/psalms',
    listenRoute: '/psalms/listen',
    worshipRoute: '/psalms/worship',
    page: 'psalms.html',
    listen: 'psalms-listen.html',
    worship: 'psalms-worship.html',
    study: null,
    deck: null,
    bookType: 'Poetry & Worship',
    bookTypeZh: '诗歌书',
    themeZh: '真实向神喊话：恐惧、忧闷、悔改、避难、同在',
    themeEn: 'Honest cries to God: fear, sorrow, repentance, refuge, presence',
    taglineZh: '当你说不出祷告的时候，诗篇替你开口。',
    taglineEn: 'When you have no words to pray, the Psalms give you a voice.',
    descriptionZh: '诗篇精选十一篇——不是完美信徒的赞美，而是真实的人向神喊出恐惧、质问与盼望，与传道书“日光之下”的诚实彼此呼应。',
    descriptionEn: 'Eleven selected Psalms — not the praise of perfect believers, but real people crying out fear, protest, and hope to God, echoing the honesty of Ecclesiastes “under the sun.”',
    keyVerse: {
      zh: { reference: '诗篇 34:18', text: '耶和华靠近伤心的人，拯救灵性痛悔的人。' },
      en: { reference: 'Psalm 34:18', text: 'The LORD is near to the brokenhearted; He saves the contrite in spirit.' }
    },
    mediaHub: {
      zh: {
        audioTitle: '诗篇精选 · 聆听',
        audioGuide: '🎧 点击聆听：在恐惧、忧闷与避难中，向神诚实地喊话。',
        worshipTitle: '《你是我的避难所》',
        worshipGuide: '🎵 神是我们的避难所，是我们在患难中随时的帮助。',
        spotifyLink: 'https://open.spotify.com/search/你是我的避难所',
        youtubeLink: 'https://www.youtube.com/results?search_query=你是我的避难所+赞美诗'
      },
      en: {
        audioTitle: 'Psalms · Listen',
        audioGuide: '🎧 Click to listen: honest cries to God in fear, sorrow, and refuge.',
        worshipTitle: 'You Are My Hiding Place',
        worshipGuide: '🎵 God is our refuge and strength, an ever-present help in trouble.',
        spotifyLink: 'https://open.spotify.com/search/You+Are+My+Hiding+Place',
        youtubeLink: 'https://www.youtube.com/results?search_query=You+Are+My+Hiding+Place+worship'
      }
    },
    bgColor: 'from-[#1A2E3A] to-[#12161A]',
    accentColor: '#A8C5D6',
    audioPathBase: 'audio/psalms/',
    languages: ['zh', 'en'],
    audioEnabled: true,
    features: { read: true, listen: true, ask: true, reflection: true, worship: false, bilingual: true, study: false, deck: false }
  },
  {
    id: 'job',
    order: 4,
    slug: 'job',
    titleZh: '约伯记',
    titleEn: 'Job',
    status: 'upcoming',
    safeHash: '#/job',
    listenHash: null,
    worshipHash: null,
    route: '/job',
    listenRoute: null,
    worshipRoute: null,
    page: 'job.html',
    listen: null,
    worship: null,
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
      en: { reference: 'Job 1:21', text: 'The LORD gave, and the LORD has taken away. Blessed be the name of the LORD.' }
    },
    bgColor: 'from-[#1A2A3A] to-[#12161A]',
    accentColor: '#B8C7D9',
    audioPathBase: 'audio/job/',
    languages: ['zh', 'en'],
    audioEnabled: false,
    features: { read: false, listen: false, ask: false, reflection: false, worship: false, bilingual: true, study: false, deck: false }
  },
  {
    id: 'matthew',
    order: 5,
    slug: 'matthew',
    titleZh: '马太福音',
    titleEn: 'Matthew',
    status: 'upcoming',
    safeHash: '#/matthew',
    listenHash: null,
    worshipHash: null,
    route: '/matthew',
    listenRoute: null,
    worshipRoute: null,
    page: 'matthew.html',
    listen: null,
    worship: null,
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
      en: { reference: 'Matthew 4:17', text: 'Repent, for the kingdom of heaven is near.' }
    },
    bgColor: 'from-[#2B2615] to-[#12161A]',
    accentColor: '#D8C27A',
    audioPathBase: 'audio/matthew/',
    languages: ['zh', 'en'],
    audioEnabled: false,
    features: { read: false, listen: false, ask: false, reflection: false, worship: false, bilingual: true, study: false, deck: false }
  }
];

/** Feature labels (bilingual) — used by the home page to show what a book offers. */
export const featureLabels = {
  read:    { zh: '阅读', en: 'Read',    key: 'page'    },
  listen:  { zh: '聆听', en: 'Listen',  key: 'listen'  },
  worship: { zh: '敬拜', en: 'Worship', key: 'worship' },
  study:   { zh: '导览', en: 'Study',   key: 'study'   },
  deck:    { zh: '图解', en: 'Deck',    key: 'deck'    },
  ask:     { zh: '提问', en: 'Ask',     key: null      },
};

/**
 * Resolve a GitHub-Pages-safe hash (e.g. '#/john/listen') to its static file.
 * Returns a filename string, or null if it can't be resolved.
 */
export const resolveHash = (hash) => {
  const clean = String(hash || '').replace(/^#\/?/, '').replace(/\/+$/, '');
  if (!clean) return null;
  const [slug, view] = clean.split('/');
  const book = getBookBySlug(slug);
  if (!book) return null;
  if (view === 'listen') return book.listen || book.page || null;
  if (view === 'worship') return book.worship || book.page || null;
  return book.page || null;
};

export const getBookById = (id) => bibleRegistry.find((book) => book.id === id);
export const getBookBySlug = (slug) => bibleRegistry.find((book) => book.slug === slug);
export const getActiveBooks = () =>
  bibleRegistry.filter((b) => b.status === 'active').sort((a, b) => a.order - b.order);
export const getUpcomingBooks = () =>
  bibleRegistry.filter((b) => b.status === 'upcoming').sort((a, b) => a.order - b.order);

/** Back-compat aliases. */
export const activeBooks = getActiveBooks;
export const getBook = getBookById;

export default bibleRegistry;
