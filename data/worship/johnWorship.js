/**
 * John — worship track metadata, organized by the major theological themes of
 * the Gospel. Copyright-safe: titles + public listening links only, no lyrics.
 *
 * Each track has a stable `id` (checked against an independent expected manifest in
 * scripts/verify-worship-corpus.mjs, so a missing / reordered / duplicated / mis-mapped
 * card is caught — not just a missing field).
 *
 * Scripture is STRUCTURED and VERBATIM:
 *   scripture: { book, ch, from, to, zh, en }
 *     - book/ch/from/to = machine-checkable reference (corpus book code).
 *     - zh = 新标点和合本（简体）, en = World English Bible (WEB), quoted VERBATIM
 *       from worker/scripture-assets and checked by scripts/verify-worship-corpus.mjs.
 *     - This round uses COMPLETE verses only (no excerpting).
 *   connectionZh/En (optional) = editorial application, rendered separately and
 *     clearly marked as NOT Scripture. (John needs none; its old lines were the verse.)
 *   reflectionPromptZh/En = a question, unchanged.
 * The display reference ("约翰福音 1:14 / John 1:14") and the version label are
 * GENERATED from the structured ref by components/worshipPanel.js.
 */
export const johnWorship = {
  id: 'john',
  intro: {
    zh: '按约翰福音的主题聆听敬拜——从道成肉身，到生命之光、活水、复活与永生。',
    en: 'Worship gathered around the themes of John — from the Word made flesh to the Light of Life, Living Water, resurrection, and eternal life.'
  },
  tracks: [
    { id: 'word-made-flesh', themeZh: '道成肉身', themeEn: 'The Word became flesh',
      titleZh: '普天颂赞 · O Come All Ye Faithful', titleEn: 'O Come All Ye Faithful', artist: 'Traditional',
      spotifyLink: 'https://open.spotify.com/search/O%20Come%20All%20Ye%20Faithful',
      youtubeLink: 'https://www.youtube.com/results?search_query=O+Come+All+Ye+Faithful+worship',
      scripture: { book: 'JHN', ch: 1, from: 14, to: 14,
        zh: '道成了肉身，住在我们中间，充充满满地有恩典有真理。我们也见过他的荣光，正是父独生子的荣光。',
        en: 'The Word became flesh and lived among us. We saw his glory, such glory as of the only born Son of the Father, full of grace and truth.' },
      reflectionPromptZh: '神亲自靠近——今天你愿让他靠近哪一处？', reflectionPromptEn: 'God came near — where will you let Him come near today?' },
    { id: 'light-of-life', themeZh: '生命之光', themeEn: 'The Light of Life',
      titleZh: 'Way Maker · 生命的主', titleEn: 'Way Maker', artist: 'Sinach',
      spotifyLink: 'https://open.spotify.com/search/Way%20Maker',
      youtubeLink: 'https://www.youtube.com/results?search_query=Way+Maker+worship',
      scripture: { book: 'JHN', ch: 8, from: 12, to: 12,
        zh: '耶稣又对众人说：「我是世界的光。跟从我的，就不在黑暗里走，必要得着生命的光。」',
        en: 'Again, therefore, Jesus spoke to them, saying, “I am the light of the world. He who follows me will not walk in the darkness, but will have the light of life.”' },
      reflectionPromptZh: '你最需要光照进的黑暗，是什么？', reflectionPromptEn: 'What darkness most needs His light right now?' },
    { id: 'living-water', themeZh: '活水', themeEn: 'Living Water',
      titleZh: 'Come to the Water · 来到水边', titleEn: 'Come to the Water', artist: 'Worship',
      spotifyLink: 'https://open.spotify.com/search/Come%20to%20the%20Water',
      youtubeLink: 'https://www.youtube.com/results?search_query=Come+to+the+Water+worship',
      scripture: { book: 'JHN', ch: 4, from: 14, to: 14,
        zh: '人若喝我所赐的水就永远不渴。我所赐的水要在他里头成为泉源，直涌到永生。」',
        en: 'but whoever drinks of the water that I will give him will never thirst again; but the water that I will give him will become in him a well of water springing up to eternal life.”' },
      reflectionPromptZh: '你心里那口井，是不是又干了？', reflectionPromptEn: 'Is the well in you running dry again?' },
    { id: 'bread-of-life', themeZh: '生命的粮', themeEn: 'Bread of Life',
      titleZh: 'Taste and See · 你尝主恩', titleEn: 'Taste and See', artist: 'Worship',
      spotifyLink: 'https://open.spotify.com/search/Taste%20and%20See%20worship',
      youtubeLink: 'https://www.youtube.com/results?search_query=Taste+and+See+worship',
      scripture: { book: 'JHN', ch: 6, from: 35, to: 35,
        zh: '耶稣说：「我就是生命的粮。到我这里来的，必定不饿；信我的，永远不渴。',
        en: 'Jesus said to them, “I am the bread of life. Whoever comes to me will not be hungry, and whoever believes in me will never be thirsty.' },
      reflectionPromptZh: '什么正在喂养你的灵魂——够吗？', reflectionPromptEn: 'What is feeding your soul — and is it enough?' },
    { id: 'good-shepherd', themeZh: '好牧人', themeEn: 'The Good Shepherd',
      titleZh: '耶和华是我牧者(诗 23)', titleEn: 'The Lord’s My Shepherd (Psalm 23)', artist: 'Traditional / Townend',
      spotifyLink: 'https://open.spotify.com/search/The%20Lord%20is%20My%20Shepherd',
      youtubeLink: 'https://www.youtube.com/results?search_query=The+Lord+is+My+Shepherd+worship',
      scripture: { book: 'JHN', ch: 10, from: 11, to: 11,
        zh: '我是好牧人；好牧人为羊舍命。',
        en: '“I am the good shepherd. The good shepherd lays down his life for the sheep.' },
      reflectionPromptZh: '你在哪件事上需要被牧养、被带领？', reflectionPromptEn: 'Where do you need to be shepherded and led?' },
    { id: 'resurrection-life', themeZh: '复活与生命', themeEn: 'Resurrection and Life',
      titleZh: 'Living Hope · 活着的盼望', titleEn: 'Living Hope', artist: 'Phil Wickham',
      spotifyLink: 'https://open.spotify.com/search/Living%20Hope',
      youtubeLink: 'https://www.youtube.com/results?search_query=Living+Hope+Phil+Wickham',
      scripture: { book: 'JHN', ch: 11, from: 25, to: 25,
        zh: '耶稣对她说：「复活在我，生命也在我。信我的人虽然死了，也必复活；',
        en: 'Jesus said to her, “I am the resurrection and the life. He who believes in me will still live, even if he dies.' },
      reflectionPromptZh: '死亡若不是最后一句话，今天会不同吗？', reflectionPromptEn: 'If death is not the last word, how does today change?' },
    { id: 'way-truth-life', themeZh: '道路、真理、生命', themeEn: 'The Way, the Truth, the Life',
      titleZh: 'Yes I Will · 我要信靠', titleEn: 'Yes I Will', artist: 'Vertical Worship',
      spotifyLink: 'https://open.spotify.com/search/Yes%20I%20Will%20Vertical%20Worship',
      youtubeLink: 'https://www.youtube.com/results?search_query=Yes+I+Will+Vertical+Worship',
      scripture: { book: 'JHN', ch: 14, from: 6, to: 6,
        zh: '耶稣说：「我就是道路、真理、生命；若不借着我，没有人能到父那里去。',
        en: 'Jesus said to him, “I am the way, the truth, and the life. No one comes to the Father, except through me.' },
      reflectionPromptZh: '你在寻的是方法，还是那一位？', reflectionPromptEn: 'Are you looking for a method, or for Him?' },
    { id: 'abiding', themeZh: '住在基督里', themeEn: 'Abiding in Christ',
      titleZh: 'Abide · 住在你里面', titleEn: 'Abide', artist: 'Aaron Williams / worship',
      spotifyLink: 'https://open.spotify.com/search/Abide%20worship',
      youtubeLink: 'https://www.youtube.com/results?search_query=Abide+worship+song',
      scripture: { book: 'JHN', ch: 15, from: 4, to: 4,
        zh: '你们要常在我里面，我也常在你们里面。枝子若不常在葡萄树上，自己就不能结果子；你们若不常在我里面，也是这样。',
        en: 'Remain in me, and I in you. As the branch can’t bear fruit by itself unless it remains in the vine, so neither can you, unless you remain in me.' },
      reflectionPromptZh: '这一周，“住在他里面”是什么样子？', reflectionPromptEn: 'What would "abiding" look like this week?' },
    { id: 'the-cross', themeZh: '十字架', themeEn: 'The Cross',
      titleZh: 'The Power of the Cross · 十架大能', titleEn: 'The Power of the Cross', artist: 'Getty & Townend',
      spotifyLink: 'https://open.spotify.com/search/The%20Power%20of%20the%20Cross',
      youtubeLink: 'https://www.youtube.com/results?search_query=The+Power+of+the+Cross+Getty',
      scripture: { book: 'JHN', ch: 19, from: 30, to: 30,
        zh: '耶稣尝了那醋，就说：「成了！」便低下头，将灵魂交付　[神]了。',
        en: 'When Jesus therefore had received the vinegar, he said, “It is finished!” Then he bowed his head and gave up his spirit.' },
      reflectionPromptZh: '有什么，是你还想靠自己了结的？', reflectionPromptEn: 'What are you still trying to finish on your own?' },
    { id: 'eternal-life', themeZh: '永生', themeEn: 'Eternal Life',
      titleZh: 'Great Are You Lord · 主你本为大', titleEn: 'Great Are You Lord', artist: 'All Sons & Daughters',
      spotifyLink: 'https://open.spotify.com/search/Great%20Are%20You%20Lord',
      youtubeLink: 'https://www.youtube.com/results?search_query=Great+Are+You+Lord+worship',
      scripture: { book: 'JHN', ch: 3, from: 16, to: 16,
        zh: '「　神爱世人，甚至将他的独生子赐给[他们]，叫一切信他的，不致灭亡，反得永生。',
        en: 'For God so loved the world, that he gave his only born Son, that whoever believes in him should not perish, but have eternal life.' },
      reflectionPromptZh: '永生若从现在开始，你会从哪一步走起？', reflectionPromptEn: 'If eternal life starts now, where would you begin?' }
  ]
};

export default johnWorship;
