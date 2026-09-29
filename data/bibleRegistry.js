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
    lifeThemeZh: '寻找人生意义', lifeThemeEn: 'Search for Meaning',
    needZh: '我正在寻找人生的意义。', needEn: 'I’m searching for meaning.', needOrder: 3,
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
    deckLanguages: ['zh', 'en'],
    deckByLanguage: { zh: 'deck-zh.html', en: 'deck-en.html' },
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
      en: { reference: 'Ecclesiastes 1:14', text: 'I have seen all the works that are done under the sun; and behold, all is vanity and a chasing after wind.' }
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
    lifeThemeZh: '认识耶稣', lifeThemeEn: 'Know Jesus',
    needZh: '我想认识耶稣。', needEn: 'I want to know Jesus.', needOrder: 1,
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
    deckLanguages: ['zh', 'en'],
    deckByLanguage: { zh: 'john-deck-zh.html', en: 'john-deck-en.html' },
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
      en: { reference: 'John 1:4-5', text: 'In him was life, and the life was the light of men. The light shines in the darkness, and the darkness hasn’t overcome it.' }
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
    lifeThemeZh: '向神倾心', lifeThemeEn: 'Pray Honestly',
    needZh: '我需要安慰，也想向神倾心。', needEn: 'I need comfort and a place to pray honestly.', needOrder: 2,
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
    deck: 'psalms-deck-zh.html',
    deckLanguages: ['zh', 'en'],
    deckByLanguage: { zh: 'psalms-deck-zh.html', en: 'psalms-deck-en.html' },
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
      en: { reference: 'Psalm 34:18', text: 'The LORD is near to those who have a broken heart, and saves those who have a crushed spirit.' }
    },
    mediaHub: {
      zh: {
        audioTitle: '诗篇精选 · 聆听',
        audioGuide: '🎧 点击聆听：在恐惧、忧闷与避难中，向神诚实地喊话。',
        worshipTitle: '《展开清晨的翅膀》 · 中文录音',
        worshipGuide: '读完诗篇139篇，用诗歌继续默想神的认识、引导和扶持。',
        spotifyLink: '',
        youtubeLink: 'https://www.youtube.com/watch?v=qLCYbDytY74'
      },
      en: {
        audioTitle: 'Psalms · Listen',
        audioGuide: '🎧 Click to listen: honest cries to God in fear, sorrow, and refuge.',
        worshipTitle: 'You Are My Hiding Place · Selah · English',
        worshipGuide: '🎵 God is our refuge and strength, a very present help in trouble.',
        spotifyLink: '',
        youtubeLink: 'https://www.youtube.com/watch?v=iukRJ9Wnr6A'
      }
    },
    bgColor: 'from-[#1A2E3A] to-[#12161A]',
    accentColor: '#A8C5D6',
    audioPathBase: 'audio/psalms/',
    languages: ['zh', 'en'],
    audioEnabled: true,
    features: { read: true, listen: true, ask: true, reflection: true, worship: true, bilingual: true, study: false, deck: true }
  },
  {
    id: 'job',
    order: 5,
    slug: 'job',
    titleZh: '约伯记',
    titleEn: 'Job',
    status: 'upcoming',
    lifeThemeZh: '苦难中的信心', lifeThemeEn: 'Faith in Suffering',
    needZh: '我正在经历苦难，也想知道神在哪里。', needEn: 'I’m suffering and wondering where God is.', needOrder: 7,
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
      en: { reference: 'Job 1:21', text: 'The LORD gave, and the LORD has taken away. Blessed be the LORD’s name.' }
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
    order: 6,
    slug: 'matthew',
    titleZh: '马太福音',
    titleEn: 'Matthew',
    status: 'upcoming',
    lifeThemeZh: '跟随耶稣', lifeThemeEn: 'Follow Jesus',
    needZh: '我想学习怎样跟随耶稣。', needEn: 'I want to learn how to follow Jesus.', needOrder: 6,
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
      en: { reference: 'Matthew 4:17', text: 'Repent! For the Kingdom of Heaven is at hand.' }
    },
    bgColor: 'from-[#2B2615] to-[#12161A]',
    accentColor: '#D8C27A',
    audioPathBase: 'audio/matthew/',
    languages: ['zh', 'en'],
    audioEnabled: false,
    features: { read: false, listen: false, ask: false, reflection: false, worship: false, bilingual: true, study: false, deck: false }
  },
  {
    id: 'revelation',
    order: 4,
    slug: 'revelation',
    titleZh: '启示录',
    titleEn: 'Revelation',
    status: 'active',
    lifeThemeZh: '活在盼望中', lifeThemeEn: 'Live with Hope',
    needZh: '我对未来感到不安，需要盼望。', needEn: 'I’m afraid of the future and need hope.', needOrder: 5,
    safeHash: '#/revelation',
    listenHash: '#/revelation/listen',
    worshipHash: '#/revelation/worship',
    route: '/revelation',
    listenRoute: '/revelation/listen',
    worshipRoute: '/revelation/worship',
    page: 'revelation.html',
    listen: 'revelation-listen.html',
    worship: 'revelation-worship.html',
    study: null,
    deck: 'revelation-deck-zh.html',
    deckLanguages: ['zh', 'en'],
    deckByLanguage: { zh: 'revelation-deck-zh.html', en: 'revelation-deck-en.html' },
    chapters: 22,
    bookType: 'Apocalyptic Prophecy',
    bookTypeZh: '启示文学',
    themeZh: '耶稣掌权、警醒、忠心、忍耐、盼望、得胜、万物更新',
    themeEn: 'Jesus reigns, watchfulness, faithfulness, endurance, hope, victory, and all things made new',
    taglineZh: '在动荡中，看见耶稣带来的安慰与盼望。',
    taglineEn: 'The comfort and hope Jesus brings in troubled times.',
    descriptionZh: '启示录让受压的教会看见：神仍然掌权，羔羊已经得胜，邪恶不会拥有最后的话语，神最终要使万物更新。',
    descriptionEn: 'Revelation shows pressured churches that God still reigns, the Lamb has conquered, evil will not have the last word, and God will make all things new.',
    keyVerse: {
      zh: { reference: '启示录 21:5', text: '看哪，我将一切都更新了！' },
      en: { reference: 'Revelation 21:5', text: 'Behold, I am making all things new.' }
    },
    mediaHub: {
      zh: {
        audioTitle: '启示录第一章 · 深度听书解经',
        audioGuide: '🎧 点击聆听：荣耀的基督在教会中间，对惧怕的人说"不要惧怕"。',
        worshipTitle: '《Revelation Song · 启示录之歌》',
        worshipGuide: '🎵 在宝座前俯伏敬拜，与万民同声高唱"圣哉，圣哉，圣哉"。',
        spotifyLink: 'https://open.spotify.com/search/Revelation%20Song',
        youtubeLink: 'https://www.youtube.com/results?search_query=Revelation+Song+worship'
      },
      en: {
        audioTitle: 'Revelation Chapter 1 · Audio Commentary',
        audioGuide: '🎧 Click to listen: the glorified Christ among the churches says, "Do not be afraid."',
        worshipTitle: 'Revelation Song',
        worshipGuide: '🎵 Fall before the throne and join every nation singing "Holy, holy, holy."',
        spotifyLink: 'https://open.spotify.com/search/Revelation%20Song',
        youtubeLink: 'https://www.youtube.com/results?search_query=Revelation+Song+worship'
      }
    },
    bgColor: 'from-[#241B33] to-[#12161A]',
    accentColor: '#E4C97A',
    audioPathBase: 'audio/revelation/',
    languages: ['zh', 'en'],
    audioEnabled: true,
    features: { read: true, listen: true, ask: true, reflection: true, worship: true, bilingual: true, study: false, deck: true }
  },
  {
    id: 'proverbs',
    order: 7,
    slug: 'proverbs',
    titleZh: '箴言',
    titleEn: 'Proverbs',
    status: 'active',
    lifeThemeZh: '活出智慧', lifeThemeEn: 'Live Wisely',
    needZh: '我需要智慧做决定，也想知道怎样面对现实生活。', needEn: 'I need wisdom for a decision or everyday life.', needOrder: 4,
    safeHash: '#/proverbs',
    listenHash: '#/proverbs/listen',
    worshipHash: '#/proverbs/worship',
    route: '/proverbs',
    listenRoute: '/proverbs/listen',
    worshipRoute: '/proverbs/worship',
    page: 'proverbs.html',
    listen: 'proverbs-listen.html',
    worship: 'proverbs-worship.html',
    study: null,
    deck: null,
    bookType: 'Wisdom Literature',
    bookTypeZh: '智慧书',
    themeZh: '智慧、敬畏耶和华、言语、金钱、朋友、决策、正直',
    themeEn: 'Wisdom, the fear of the LORD, speech, money, friends, decisions, and integrity',
    taglineZh: '日常生活中的属天智慧。',
    taglineEn: 'Wisdom for everyday life.',
    descriptionZh: '《箴言》把圣经的智慧带进每天的真实选择：敬畏耶和华、如何说话、交友、看待金钱、面对诱惑与做决定。全 31 章中英对照，附研读、默想、祷告与整卷图解。',
    descriptionEn: 'Proverbs brings the Bible’s wisdom into everyday choices — the fear of the LORD, speech, friends, money, temptation, and decisions. All 31 chapters, bilingual, with study notes, reflection, prayer, and a visual guide.',
    keyVerse: {
      zh: { reference: '箴言 1:7', text: '敬畏耶和华是知识的开端； 愚妄人藐视智慧和训诲。' },
      en: { reference: 'Proverbs 1:7', text: 'The fear of the LORD is the beginning of knowledge, but the foolish despise wisdom and instruction.' }
    },
    mediaHub: {
      zh: {
        audioTitle: '箴言 · 深度听书解经',
        audioGuide: '🎧 真人录音制作中，敬请期待。',
        worshipTitle: '《箴言》敬拜 · 智慧与敬畏',
        worshipGuide: '🎵 用诗歌把敬畏、信靠与顺服，唱进每天的选择里。',
        spotifyLink: 'https://open.spotify.com/search/敬畏耶和华%20智慧%20赞美诗',
        youtubeLink: 'https://www.youtube.com/results?search_query=敬畏耶和华+智慧+赞美诗'
      },
      en: {
        audioTitle: 'Proverbs · Audio Commentary',
        audioGuide: '🎧 Human narration in production — coming soon.',
        worshipTitle: 'Proverbs Worship · Wisdom & the Fear of the LORD',
        worshipGuide: '🎵 Let songs carry the fear of the LORD, trust, and surrender into everyday choices.',
        spotifyLink: 'https://open.spotify.com/search/fear%20of%20the%20lord%20wisdom%20worship',
        youtubeLink: 'https://www.youtube.com/results?search_query=fear+of+the+Lord+wisdom+worship'
      }
    },
    bgColor: 'from-[#2A2410] to-[#12161A]',
    accentColor: '#E6C776',
    audioPathBase: 'audio/proverbs/',
    languages: ['zh', 'en'],
    audioEnabled: false,
    features: { read: true, listen: true, ask: false, reflection: true, worship: true, bilingual: true, study: false, deck: false, guide: true }
  }
];

/** Feature labels (bilingual) — used by the home page to show what a book offers. */
export const featureLabels = {
  read:    { zh: '阅读', en: 'Read',    key: 'page'    },
  listen:  { zh: '聆听', en: 'Listen',  key: 'listen'  },
  worship: { zh: '敬拜', en: 'Worship', key: 'worship' },
  study:   { zh: '导览', en: 'Study',   key: 'study'   },
  deck:    { zh: '图解', en: 'Deck',    key: 'deck'    },
  guide:   { zh: '图解', en: 'Visual Guide', key: null  },
  ask:     { zh: '提问', en: 'Ask',     key: null      },
};

/**
 * Resolve a GitHub-Pages-safe hash (e.g. '#/john/listen') to its static file.
 * Returns a filename string, or null if it can't be resolved.
 */
export const resolveHash = (hash) => {
  const clean = String(hash || '').replace(/^#\/?/, '').replace(/\/+$/, '');
  if (!clean) return null;
  const [slug, segment2, segment3] = clean.split('/');
  const book = getBookBySlug(slug);
  if (!book) return null;
  if (/^\d+$/.test(segment2 || '')) {
    const chapter = Number(segment2);
    if (book.chapters && chapter >= 1 && chapter <= book.chapters) {
      const file = segment3 === 'listen' ? book.listen : book.page;
      return file ? `${file}?ch=${chapter}` : null;
    }
    return book.page || null;
  }
  if (segment2 === 'listen') return book.listen || book.page || null;
  if (segment2 === 'worship') return book.worship || book.page || null;
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
