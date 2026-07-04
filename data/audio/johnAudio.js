/**
 * John — Listening-Mode chapter metadata (John 1–21). Placeholder architecture:
 * audio paths are pre-wired; drop real MP3s at these paths to activate them.
 * Structure parallels data/books/ecclesiastes.js so the same Listening engine
 * can drive John once audio (or TTS) is turned on.
 *
 *   audio/john/chapter-01-zh.mp3 … chapter-21-zh.mp3   (Chinese)
 *   audio/john/chapter-01-en.mp3 … chapter-21-en.mp3   (English)
 */
export const johnAudio = {
  id: 'john',
  audioBasePath: 'audio/john/',
  ready: false, // flip to true when narration exists; UI shows "coming soon" until then
  chapters: [
    { num: 1,  titleZh: '道成肉身，光来到世界', titleEn: 'The Word made flesh; the Light enters the world' },
    { num: 2,  titleZh: '水变酒，洁净圣殿', titleEn: 'Water into wine; cleansing the temple' },
    { num: 3,  titleZh: '重生与神爱世人', titleEn: 'Born again; "God so loved the world"' },
    { num: 4,  titleZh: '活水与撒玛利亚妇人', titleEn: 'Living water and the Samaritan woman' },
    { num: 5,  titleZh: '子赐生命', titleEn: 'The Son gives life' },
    { num: 6,  titleZh: '生命的粮', titleEn: 'The Bread of Life' },
    { num: 7,  titleZh: '活水江河', titleEn: 'Rivers of living water' },
    { num: 8,  titleZh: '世界的光', titleEn: 'The Light of the world' },
    { num: 9,  titleZh: '瞎眼得看见', titleEn: 'The blind man receives sight' },
    { num: 10, titleZh: '好牧人', titleEn: 'The Good Shepherd' },
    { num: 11, titleZh: '复活与生命', titleEn: 'The Resurrection and the Life' },
    { num: 12, titleZh: '一粒麦子落在地里', titleEn: 'A grain of wheat falls to the ground' },
    { num: 13, titleZh: '彼此相爱', titleEn: 'Love one another' },
    { num: 14, titleZh: '道路、真理、生命', titleEn: 'The Way, the Truth, the Life' },
    { num: 15, titleZh: '葡萄树与枝子', titleEn: 'The Vine and the branches' },
    { num: 16, titleZh: '圣灵与忧愁变喜乐', titleEn: 'The Spirit; sorrow turned to joy' },
    { num: 17, titleZh: '耶稣的祷告', titleEn: 'Jesus prays for his own' },
    { num: 18, titleZh: '被捕与受审', titleEn: 'Betrayal and trial' },
    { num: 19, titleZh: '十字架', titleEn: 'The cross' },
    { num: 20, titleZh: '复活', titleEn: 'The resurrection' },
    { num: 21, titleZh: '恢复彼得与跟随主', titleEn: 'Peter restored; "Follow me"' }
  ].map((c) => ({
    ...c,
    audio: {
      zh: `audio/john/chapter-${String(c.num).padStart(2, '0')}-zh.mp3`,
      en: `audio/john/chapter-${String(c.num).padStart(2, '0')}-en.mp3`
    }
  }))
};

export default johnAudio;
