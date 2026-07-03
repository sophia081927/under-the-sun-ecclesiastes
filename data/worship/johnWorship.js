/**
 * John — worship track metadata, organized by the major theological themes of
 * the Gospel. Copyright-safe: titles + public listening links only, no lyrics.
 *
 * Track schema: { titleZh, titleEn, artist, themeZh, themeEn,
 *   spotifyLink, youtubeLink, scriptureConnectionZh/En, reflectionPromptZh/En }
 */
export const johnWorship = {
  id: 'john',
  intro: {
    zh: '按约翰福音的主题聆听敬拜——从道成肉身，到生命之光、活水、复活与永生。',
    en: 'Worship gathered around the themes of John — from the Word made flesh to the Light of Life, Living Water, resurrection, and eternal life.'
  },
  tracks: [
    { themeZh: '道成肉身', themeEn: 'The Word became flesh',
      titleZh: '普天颂赞 · O Come All Ye Faithful', titleEn: 'O Come All Ye Faithful', artist: 'Traditional',
      spotifyLink: 'https://open.spotify.com/search/O%20Come%20All%20Ye%20Faithful',
      youtubeLink: 'https://www.youtube.com/results?search_query=O+Come+All+Ye+Faithful+worship',
      scriptureConnectionZh: '道成了肉身，住在我们中间(约 1:14)。', scriptureConnectionEn: 'The Word became flesh and dwelt among us (John 1:14).',
      reflectionPromptZh: '神亲自靠近——今天你愿让他靠近哪一处？', reflectionPromptEn: 'God came near — where will you let Him come near today?' },
    { themeZh: '生命之光', themeEn: 'The Light of Life',
      titleZh: 'Way Maker · 生命的主', titleEn: 'Way Maker', artist: 'Sinach',
      spotifyLink: 'https://open.spotify.com/search/Way%20Maker',
      youtubeLink: 'https://www.youtube.com/results?search_query=Way+Maker+worship',
      scriptureConnectionZh: '我是世界的光(约 8:12)。', scriptureConnectionEn: 'I am the light of the world (John 8:12).',
      reflectionPromptZh: '你最需要光照进的黑暗，是什么？', reflectionPromptEn: 'What darkness most needs His light right now?' },
    { themeZh: '活水', themeEn: 'Living Water',
      titleZh: 'Come to the Water · 来到水边', titleEn: 'Come to the Water', artist: 'Worship',
      spotifyLink: 'https://open.spotify.com/search/Come%20to%20the%20Water',
      youtubeLink: 'https://www.youtube.com/results?search_query=Come+to+the+Water+worship',
      scriptureConnectionZh: '我所赐的水……直涌到永生(约 4:14)。', scriptureConnectionEn: 'The water I give… wells up to eternal life (John 4:14).',
      reflectionPromptZh: '你心里那口井，是不是又干了？', reflectionPromptEn: 'Is the well in you running dry again?' },
    { themeZh: '生命的粮', themeEn: 'Bread of Life',
      titleZh: 'Taste and See · 你尝主恩', titleEn: 'Taste and See', artist: 'Worship',
      spotifyLink: 'https://open.spotify.com/search/Taste%20and%20See%20worship',
      youtubeLink: 'https://www.youtube.com/results?search_query=Taste+and+See+worship',
      scriptureConnectionZh: '我就是生命的粮(约 6:35)。', scriptureConnectionEn: 'I am the bread of life (John 6:35).',
      reflectionPromptZh: '什么正在喂养你的灵魂——够吗？', reflectionPromptEn: 'What is feeding your soul — and is it enough?' },
    { themeZh: '好牧人', themeEn: 'The Good Shepherd',
      titleZh: '耶和华是我牧者(诗 23)', titleEn: 'The Lord’s My Shepherd (Psalm 23)', artist: 'Traditional / Townend',
      spotifyLink: 'https://open.spotify.com/search/The%20Lord%20is%20My%20Shepherd',
      youtubeLink: 'https://www.youtube.com/results?search_query=The+Lord+is+My+Shepherd+worship',
      scriptureConnectionZh: '我是好牧人，好牧人为羊舍命(约 10:11)。', scriptureConnectionEn: 'I am the good shepherd; the good shepherd lays down his life (John 10:11).',
      reflectionPromptZh: '你在哪件事上需要被牧养、被带领？', reflectionPromptEn: 'Where do you need to be shepherded and led?' },
    { themeZh: '复活与生命', themeEn: 'Resurrection and Life',
      titleZh: 'Living Hope · 活着的盼望', titleEn: 'Living Hope', artist: 'Phil Wickham',
      spotifyLink: 'https://open.spotify.com/search/Living%20Hope',
      youtubeLink: 'https://www.youtube.com/results?search_query=Living+Hope+Phil+Wickham',
      scriptureConnectionZh: '复活在我，生命也在我(约 11:25)。', scriptureConnectionEn: 'I am the resurrection and the life (John 11:25).',
      reflectionPromptZh: '死亡若不是最后一句话，今天会不同吗？', reflectionPromptEn: 'If death is not the last word, how does today change?' },
    { themeZh: '道路、真理、生命', themeEn: 'The Way, the Truth, the Life',
      titleZh: 'Yes I Will · 我要信靠', titleEn: 'Yes I Will', artist: 'Vertical Worship',
      spotifyLink: 'https://open.spotify.com/search/Yes%20I%20Will%20Vertical%20Worship',
      youtubeLink: 'https://www.youtube.com/results?search_query=Yes+I+Will+Vertical+Worship',
      scriptureConnectionZh: '我就是道路、真理、生命(约 14:6)。', scriptureConnectionEn: 'I am the way, the truth, and the life (John 14:6).',
      reflectionPromptZh: '你在寻的是方法，还是那一位？', reflectionPromptEn: 'Are you looking for a method, or for Him?' },
    { themeZh: '住在基督里', themeEn: 'Abiding in Christ',
      titleZh: 'Abide · 住在你里面', titleEn: 'Abide', artist: 'Aaron Williams / worship',
      spotifyLink: 'https://open.spotify.com/search/Abide%20worship',
      youtubeLink: 'https://www.youtube.com/results?search_query=Abide+worship+song',
      scriptureConnectionZh: '你们要常在我里面(约 15:4)。', scriptureConnectionEn: 'Abide in me, and I in you (John 15:4).',
      reflectionPromptZh: '这一周，“住在他里面”是什么样子？', reflectionPromptEn: 'What would "abiding" look like this week?' },
    { themeZh: '十字架', themeEn: 'The Cross',
      titleZh: 'The Power of the Cross · 十架大能', titleEn: 'The Power of the Cross', artist: 'Getty & Townend',
      spotifyLink: 'https://open.spotify.com/search/The%20Power%20of%20the%20Cross',
      youtubeLink: 'https://www.youtube.com/results?search_query=The+Power+of+the+Cross+Getty',
      scriptureConnectionZh: '耶稣说：“成了！”(约 19:30)。', scriptureConnectionEn: 'Jesus said, "It is finished" (John 19:30).',
      reflectionPromptZh: '有什么，是你还想靠自己了结的？', reflectionPromptEn: 'What are you still trying to finish on your own?' },
    { themeZh: '永生', themeEn: 'Eternal Life',
      titleZh: 'Great Are You Lord · 主你本为大', titleEn: 'Great Are You Lord', artist: 'All Sons & Daughters',
      spotifyLink: 'https://open.spotify.com/search/Great%20Are%20You%20Lord',
      youtubeLink: 'https://www.youtube.com/results?search_query=Great+Are+You+Lord+worship',
      scriptureConnectionZh: '叫一切信他的，反得永生(约 3:16)。', scriptureConnectionEn: 'Whoever believes in him shall… have eternal life (John 3:16).',
      reflectionPromptZh: '永生若从现在开始，你会从哪一步走起？', reflectionPromptEn: 'If eternal life starts now, where would you begin?' }
  ]
};

export default johnWorship;
