/**
 * Ecclesiastes — long-form bilingual content (chapters, reflections, worship,
 * audio metadata). The registry (data/bibleRegistry.js) stays lightweight;
 * this file is the canonical content source that future pages/features import.
 *
 * NOTE: the existing ecclesiastes.html and listen.html pages already ship this
 * content inline and keep working unchanged. This module formalizes the same
 * structure as data so new pages (or a future build) can consume it cleanly.
 */
export const ecclesiastes = {
  id: 'ecclesiastes',
  audioBasePath: 'audio/ecclesiastes/', // chapter-01-zh.mp3 … chapter-12-en.mp3

  // Thematic groupings used by Listening Mode "by theme".
  themes: [
    { id: 'meaning',  titleZh: '虚空与人生意义', titleEn: 'Vanity & the meaning of life', chapters: [1, 2, 6] },
    { id: 'wisdom',   titleZh: '智慧与愚昧',     titleEn: 'Wisdom & folly',                chapters: [4, 7, 10] },
    { id: 'time',     titleZh: '时间与永恒',     titleEn: 'Time & eternity',               chapters: [3, 8] },
    { id: 'death',    titleZh: '死亡与盼望',     titleEn: 'Death & hope',                  chapters: [9, 11] },
    { id: 'fear-god', titleZh: '敬畏神',         titleEn: 'The fear of God',               chapters: [5, 12] }
  ],

  chapters: [
    { num: 1, theme: 'meaning', titleZh: '一切都是虚空', titleEn: 'All is vapor',
      keyVerse: { reference: '传道书 1:14 · Ecclesiastes 1:14',
        zh: '我见日光之下所做的一切事，都是虚空，都是捕风。',
        en: 'I have seen all the things that are done under the sun, and have found them all to be futile, a pursuit of the wind.' },
      reflectionZh: '你最近想抓住、却抓不住的，是什么？', reflectionEn: 'What have you been trying to hold onto, that keeps slipping away?',
      prayerZh: '主啊，我承认自己抓不住生命。求你让我在你里面寻得安稳。', prayerEn: 'Lord, I admit I cannot hold my life. Let me find rest in You.',
      audio: { zh: 'audio/ecclesiastes/chapter-01-zh.mp3', en: 'audio/ecclesiastes/chapter-01-en.mp3' } },
    { num: 2, theme: 'meaning', titleZh: '成功的空洞', titleEn: 'The emptiness of success',
      keyVerse: { reference: '传道书 2:11 · Ecclesiastes 2:11',
        zh: '我察看我手所经营的一切事……谁知都是虚空，都是捕风，在日光之下毫无益处。',
        en: 'Yet when I considered all the works that my hands had accomplished and what I had toiled to achieve, I found everything to be futile, a pursuit of the wind; there was nothing to be gained under the sun.' },
      reflectionZh: '如果你得到了想要的一切，那份空虚会自动消失吗？', reflectionEn: 'If you got everything you wanted, would the emptiness simply disappear?',
      prayerZh: '主啊，别让我把人生建在留不住的东西上。求你作我真正的满足。', prayerEn: 'Lord, keep me from building my life on what cannot last. Be my true satisfaction.',
      audio: { zh: 'audio/ecclesiastes/chapter-02-zh.mp3', en: 'audio/ecclesiastes/chapter-02-en.mp3' } },
    { num: 3, theme: 'time', titleZh: '凡事都有定时', titleEn: 'A time for everything',
      keyVerse: { reference: '传道书 3:1,11 · Ecclesiastes 3:1,11',
        zh: '凡事都有定期，天下万务都有定时……神造万物，各按其时成为美好，又将永生安置在世人心里。',
        en: 'To everything there is a season, and a time for every purpose under heaven: He has made everything beautiful in its time. He has also set eternity in the hearts of men, yet they cannot fathom the work that God has done from beginning to end.' },
      reflectionZh: '在你无法掌控的事上，你能不能试着松开手？', reflectionEn: 'In what you cannot control, can you try to loosen your grip?',
      prayerZh: '主啊，教我接受人的有限，信靠那位超越时间的掌管者。', prayerEn: 'Lord, teach me to accept my limits and trust the One beyond time.',
      audio: { zh: 'audio/ecclesiastes/chapter-03-zh.mp3', en: 'audio/ecclesiastes/chapter-03-en.mp3' } },
    { num: 4, theme: 'wisdom', titleZh: '竞争、孤独与压迫', titleEn: 'Rivalry, loneliness, oppression',
      keyVerse: { reference: '传道书 4:9 · Ecclesiastes 4:9', zh: '两个人总比一个人好，因为二人劳碌同得美好的果效。', en: 'Two are better than one, because they have a good return for their labor.' },
      reflectionZh: '有谁是你可以不设防、真实相待的人？', reflectionEn: 'Who is someone you can be truly, unguardedly yourself with?',
      prayerZh: '主啊，救我脱离无止境的比较，给我真实的同行者。', prayerEn: 'Lord, free me from endless comparison, and give me real companions.',
      audio: { zh: 'audio/ecclesiastes/chapter-04-zh.mp3', en: 'audio/ecclesiastes/chapter-04-en.mp3' } },
    { num: 5, theme: 'fear-god', titleZh: '钱不能满足人', titleEn: 'Money cannot satisfy',
      keyVerse: { reference: '传道书 5:10 · Ecclesiastes 5:10', zh: '贪爱银子的，不因得银子知足；贪爱丰富的，也不因得利益知足。', en: 'He who loves money is never satisfied by money, and he who loves wealth is never satisfied by income. This too is futile.' },
      reflectionZh: '你心里那个“再多一点就好了”的声音，指向的是什么？', reflectionEn: 'That voice inside — "just a little more" — what is it really reaching for?',
      prayerZh: '主啊，把我心里那个填不满的洞，交在你手里。', prayerEn: 'Lord, I bring You the hole in me that nothing fills.',
      audio: { zh: 'audio/ecclesiastes/chapter-05-zh.mp3', en: 'audio/ecclesiastes/chapter-05-en.mp3' } },
    { num: 6, theme: 'meaning', titleZh: '拥有不等于享受', titleEn: 'Having is not enjoying',
      keyVerse: { reference: '传道书 6:9 · Ecclesiastes 6:9', zh: '眼睛所看的，比心里妄想的倒好。这也是虚空，也是捕风。', en: 'Better what the eye can see than the wandering of desire. This too is futile and a pursuit of the wind.' },
      reflectionZh: '你是否太忙于得到，以至于忘了领受眼前的好？', reflectionEn: 'Are you so busy acquiring that you forget to receive the good in front of you?',
      prayerZh: '主啊，教我以感恩的心，领受今天你手中的礼物。', prayerEn: "Lord, teach me to receive today's gifts from Your hand with thanks.",
      audio: { zh: 'audio/ecclesiastes/chapter-06-zh.mp3', en: 'audio/ecclesiastes/chapter-06-en.mp3' } },
    { num: 7, theme: 'wisdom', titleZh: '智慧面对死亡', titleEn: 'Wisdom faces death',
      keyVerse: { reference: '传道书 7:2 · Ecclesiastes 7:2', zh: '往遭丧的家去，强如往宴乐的家去；因为死是众人的结局，活人也必将这事放在心上。', en: 'It is better to enter a house of mourning than a house of feasting, since death is the end of every man, and the living should take this to heart.' },
      reflectionZh: '如果记得自己会死，你今天会把什么看得更重、更轻？', reflectionEn: 'Remembering you will die — what would you hold more tightly today, and what more loosely?',
      prayerZh: '主啊，求你指教我数算自己的日子，好得着智慧的心。', prayerEn: 'Lord, teach me to number my days, that I may gain a heart of wisdom.',
      audio: { zh: 'audio/ecclesiastes/chapter-07-zh.mp3', en: 'audio/ecclesiastes/chapter-07-en.mp3' } },
    { num: 8, theme: 'time', titleZh: '公义延迟，人心困惑', titleEn: 'Delayed justice, human confusion',
      keyVerse: { reference: '传道书 8:17 · Ecclesiastes 8:17', zh: '我就看明神一切的作为，知道人查不出日光之下所做的事。', en: 'I saw every work of God, and that a man is unable to comprehend the work that is done under the sun. Despite his efforts to search it out, he cannot find its meaning; even if the wise man claims to know, he is unable to comprehend.' },
      reflectionZh: '哪一件“想不通”的事，你愿意暂时交托，而不是硬要答案？', reflectionEn: 'What unresolved thing could you entrust for now, instead of forcing an answer?',
      prayerZh: '主啊，在我看不明白的事上，求你给我信靠的心。', prayerEn: 'Lord, where I cannot understand, give me a trusting heart.',
      audio: { zh: 'audio/ecclesiastes/chapter-08-zh.mp3', en: 'audio/ecclesiastes/chapter-08-en.mp3' } },
    { num: 9, theme: 'death', titleZh: '死亡临到众人', titleEn: 'Death comes to all',
      keyVerse: { reference: '传道书 9:7 · Ecclesiastes 9:7', zh: '你只管去欢欢喜喜吃你的饭，心中快乐喝你的酒，因为神已经悦纳你的作为。', en: 'Go, eat your bread with joy, and drink your wine with a cheerful heart, for God has already approved your works:' },
      reflectionZh: '此刻有哪一件平凡的好，值得你停下来，好好领受？', reflectionEn: 'What ordinary good, right now, is worth pausing to receive?',
      prayerZh: '主啊，谢谢你今天所赐的饭食、工作与呼吸。教我珍惜。', prayerEn: "Lord, thank You for today's food, work, and breath. Teach me to treasure them.",
      audio: { zh: 'audio/ecclesiastes/chapter-09-zh.mp3', en: 'audio/ecclesiastes/chapter-09-en.mp3' } },
    { num: 10, theme: 'wisdom', titleZh: '愚昧如何破坏人生', titleEn: 'How folly damages life',
      keyVerse: { reference: '传道书 10:12 · Ecclesiastes 10:12', zh: '智慧人的口说出恩言；愚昧人的嘴吞灭自己。', en: "The words of a wise man’s mouth are gracious, but the lips of a fool consume him." },
      reflectionZh: '有没有一个小习惯，正在悄悄消耗你？', reflectionEn: 'Is there a small habit quietly draining you?',
      prayerZh: '主啊，在小事上也求你的智慧，守住我的言语与脚步。', prayerEn: 'Lord, give me wisdom even in small things; guard my words and my steps.',
      audio: { zh: 'audio/ecclesiastes/chapter-10-zh.mp3', en: 'audio/ecclesiastes/chapter-10-en.mp3' } },
    { num: 11, theme: 'death', titleZh: '在不确定中仍然行动', titleEn: 'Acting amid uncertainty',
      keyVerse: { reference: '传道书 11:1 · Ecclesiastes 11:1', zh: '当将你的粮食撒在水面，因为日久必能得着。', en: 'Cast your bread upon the waters, for after many days you will find it again.' },
      reflectionZh: '有哪一件好事，你一直因为“没把握”而迟迟不做？', reflectionEn: "What good thing have you delayed simply because you weren't sure?",
      prayerZh: '主啊，给我勇气在不确定中仍然去行你看为好的事。', prayerEn: 'Lord, give me courage to do good even when the outcome is unsure.',
      audio: { zh: 'audio/ecclesiastes/chapter-11-zh.mp3', en: 'audio/ecclesiastes/chapter-11-en.mp3' } },
    { num: 12, theme: 'fear-god', titleZh: '趁年幼记念造你的主', titleEn: 'Remember your Creator',
      keyVerse: { reference: '传道书 12:1,13 · Ecclesiastes 12:1,13', zh: '你趁着年幼……当记念造你的主。……敬畏神，谨守他的诫命，这是人所当尽的本分。', en: 'Remember your Creator in the days of your youth, before the days of adversity come and the years approach of which you will say, “I find no pleasure in them,” When all has been heard, the conclusion of the matter is this: Fear God and keep His commandments, because this is the whole duty of man.' },
      reflectionZh: '如果人生真有一位源头与归宿，这会怎样改变你今天的一步？', reflectionEn: 'If life truly has a Source and a home, how might that change your next step today?',
      prayerZh: '主啊，你是我生命的源头与归宿。今天，我愿意抬头认你。', prayerEn: "Lord, You are my life's Source and home. Today, I look up and acknowledge You.",
      audio: { zh: 'audio/ecclesiastes/chapter-12-zh.mp3', en: 'audio/ecclesiastes/chapter-12-en.mp3' } }
  ],

  // Worship-track metadata (page renders the same set; here as data for future features).
  worship: {
    classic: [
      { titleEn: 'Amazing Grace', titleZh: '奇异恩典', artist: 'John Newton, 1779', publicDomain: true },
      { titleEn: 'Be Thou My Vision', titleZh: '成为我异象', artist: 'Trad. Irish, trans. 1905', publicDomain: true },
      { titleEn: 'Be Still, My Soul', titleZh: '我灵镇静', artist: 'von Schlegel; tune Finlandia', publicDomain: true }
    ],
    modern: [
      { titleEn: 'Still', titleZh: '安静', artist: 'Hillsong Worship', publicDomain: false },
      { titleEn: 'Goodness of God', titleZh: '神的良善', artist: 'Bethel Music', publicDomain: false },
      { titleEn: 'Yet Not I But Through Christ in Me', titleZh: '不再是我，乃是基督', artist: 'CityAlight', publicDomain: false }
    ]
  }
};

export default ecclesiastes;
