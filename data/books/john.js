/**
 * John — long-form bilingual content (guided-study modules, key verses,
 * the seven signs, the seven "I AM" sayings, gospel explanation).
 *
 * The registry stays lightweight; this is the canonical content source.
 * The existing john.html and john-study.html pages already ship this content
 * inline and keep working unchanged — this module formalizes it as data.
 */
export const john = {
  id: 'john',

  keyVerses: [
    { reference: 'John 1:1,14 · 约翰福音 1:1,14', zh: '太初有道，道与神同在，道就是神……道成了肉身，住在我们中间。', en: 'In the beginning was the Word… The Word became flesh and made his dwelling among us.' },
    { reference: 'John 8:12 · 约翰福音 8:12', zh: '我是世界的光。跟从我的，就不在黑暗里走，必要得着生命的光。', en: 'I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life.' },
    { reference: 'John 20:31 · 约翰福音 20:31', zh: '但记这些事，要叫你们信耶稣是基督，是神的儿子，并且叫你们信了他，就可以因他的名得生命。', en: 'But these are written that you may believe that Jesus is the Messiah, the Son of God, and that by believing you may have life in his name.' },
    { reference: 'John 3:16 · 约翰福音 3:16', zh: '神爱世人，甚至将他的独生子赐给他们，叫一切信他的，不至灭亡，反得永生。', en: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' }
  ],

  // Seven signs (John 2–11).
  signs: [
    { titleZh: '水变酒',            titleEn: 'Turning water to wine',        meaningZh: '带来新的喜乐与丰盛',   meaningEn: 'bringing new joy & abundance' },
    { titleZh: '医治大臣的儿子',    titleEn: "Healing the official's son",   meaningZh: '他话语中赐生命的权柄', meaningEn: 'the life-giving authority of His word' },
    { titleZh: '医治毕士大池边的人', titleEn: 'Healing the man at Bethesda',  meaningZh: '恢复长久软弱的人',     meaningEn: 'restoring the long-term weak' },
    { titleZh: '喂饱五千人',        titleEn: 'Feeding the 5,000',            meaningZh: '生命最终极的供应',     meaningEn: 'the ultimate provision of life' },
    { titleZh: '在水面上行走',      titleEn: 'Walking on water',             meaningZh: '胜过恐惧与混乱',       meaningEn: 'absolute victory over fear & chaos' },
    { titleZh: '医治生来瞎眼的',    titleEn: 'Healing the man born blind',   meaningZh: '从黑暗领入光明',       meaningEn: 'leading from darkness into light' },
    { titleZh: '叫拉撒路复活',      titleEn: 'Raising Lazarus from the dead', meaningZh: '完全胜过死亡',        meaningEn: 'total victory over death' }
  ],

  // Seven "I AM" sayings.
  iAm: [
    { titleZh: '生命的粮',       titleEn: 'The Bread of Life',             ref: 'John 6:35',  answersZh: '回应人的饥饿',   answersEn: 'answers human hunger' },
    { titleZh: '世界的光',       titleEn: 'The Light of the World',        ref: 'John 8:12',  answersZh: '回应人的黑暗',   answersEn: 'answers human darkness' },
    { titleZh: '羊的门',         titleEn: 'The Door for the Sheep',        ref: 'John 10:9',  answersZh: '回应对安全的需要', answersEn: 'answers the need for safety' },
    { titleZh: '好牧人',         titleEn: 'The Good Shepherd',             ref: 'John 10:11', answersZh: '回应对引导的需要', answersEn: 'answers the need for guidance' },
    { titleZh: '复活与生命',     titleEn: 'The Resurrection & the Life',    ref: 'John 11:25', answersZh: '回应死亡的现实', answersEn: 'answers the reality of death' },
    { titleZh: '道路、真理、生命', titleEn: 'The Way, the Truth & the Life', ref: 'John 14:6',  answersZh: '回应属灵的迷失', answersEn: 'answers spiritual lostness' },
    { titleZh: '真葡萄树',       titleEn: 'The True Vine',                 ref: 'John 15:1',  answersZh: '回应属灵的不结果', answersEn: 'answers spiritual fruitlessness' }
  ],

  // Guided-study module outline (full copy lives in john-study.html).
  studyModules: [
    { id: 's1',  titleZh: '他到底是谁？',       titleEn: 'Who is He?' },
    { id: 's2',  titleZh: '人的困境，与神的答案', titleEn: 'The human condition & the divine answer' },
    { id: 's3',  titleZh: '道成了肉身',         titleEn: 'The Word became flesh' },
    { id: 's4',  titleZh: '我是世界的光',       titleEn: 'I am the light of the world' },
    { id: 's5',  titleZh: '是邀请，不是强加',   titleEn: 'An invitation, not an imposition' },
    { id: 's6',  titleZh: '七个神迹',           titleEn: 'The seven signs' },
    { id: 's7',  titleZh: '七个「我是」',       titleEn: 'The seven "I AM" sayings' },
    { id: 's8',  titleZh: '光中的相遇',         titleEn: 'Encounters in the light' },
    { id: 's9',  titleZh: '楼上的呼召',         titleEn: 'The upper room · the call to abide' },
    { id: 's10', titleZh: '十架的高峰：成了',   titleEn: 'The climax of the cross: It is finished' },
    { id: 's11', titleZh: '复活与生命',         titleEn: 'The resurrection & the life' },
    { id: 's12', titleZh: '永生的实际',         titleEn: 'The reality of eternal life' },
    { id: 's13', titleZh: '结论',               titleEn: 'The verdict' }
  ],

  worship: {
    classic: [
      { titleEn: 'Amazing Grace', titleZh: '奇异恩典', artist: 'John Newton, 1779', publicDomain: true },
      { titleEn: 'Be Thou My Vision', titleZh: '成为我异象', artist: 'Trad. Irish, trans. 1905', publicDomain: true }
    ],
    modern: [
      { titleEn: 'In Christ Alone', titleZh: '唯独基督', artist: 'Getty & Townend', publicDomain: false },
      { titleEn: 'Yet Not I But Through Christ in Me', titleZh: '不再是我，乃是基督', artist: 'CityAlight', publicDomain: false },
      { titleEn: 'Goodness of God', titleZh: '神的良善', artist: 'Bethel Music', publicDomain: false }
    ]
  }
};

export default john;
