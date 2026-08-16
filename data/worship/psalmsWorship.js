/**
 * Psalms — worship track metadata. Same schema as ecclesiastesWorship.js / johnWorship.js.
 * Copyright-safe: titles + public listening links only, no lyrics.
 * Psalms is the Bible's own songbook — of the three volumes, the most at home in worship.
 */
export const psalmsWorship = {
  id: 'psalms',
  intro: {
    zh: '当你说不出祷告的时候，让这些诗歌替你的心开口。',
    en: 'When you have no words to pray, let these songs give your heart a voice.'
  },
  tracks: [
    { themeZh: '干渴中的渴慕', themeEn: 'Thirst and longing',
      titleZh: '如鹿切慕溪水 · As the Deer', titleEn: 'As the Deer', artist: 'Martin Nystrom',
      spotifyLink: 'https://open.spotify.com/search/As%20the%20Deer%20Nystrom',
      youtubeLink: 'https://www.youtube.com/results?search_query=As+the+Deer+worship',
      scriptureConnectionZh: '“我的心切慕你，如鹿切慕溪水”（诗 42:1）。', scriptureConnectionEn: '"As the deer pants for streams of water, so my soul longs for You" (Ps 42:1).',
      reflectionPromptZh: '此刻你心里最深的渴，是什么？', reflectionPromptEn: 'What is the deepest thirst in you right now?' },
    { themeZh: '牧者与你同行', themeEn: 'The Shepherd walks with you',
      titleZh: '耶和华是我牧者 · The Lord’s My Shepherd', titleEn: 'The Lord’s My Shepherd', artist: 'Scottish Psalter / Crimond (public domain)',
      spotifyLink: 'https://open.spotify.com/search/The%20Lord%20is%20My%20Shepherd%20Crimond',
      youtubeLink: 'https://www.youtube.com/results?search_query=The+Lord+is+My+Shepherd+Crimond',
      scriptureConnectionZh: '“我虽然行过死荫的幽谷，也不怕遭害，因为你与我同在”（诗 23:4）。', scriptureConnectionEn: '"Even though I walk through the valley of the shadow of death, I will fear no evil, for You are with me" (Ps 23:4).',
      reflectionPromptZh: '你最近走过的“幽谷”里，你更需要答案，还是同在？', reflectionPromptEn: 'In your recent "valley," did you need an answer more, or a presence?' },
    { themeZh: '患难中的避难所', themeEn: 'Refuge in trouble',
      titleZh: '坚固保障 · A Mighty Fortress', titleEn: 'A Mighty Fortress Is Our God', artist: 'Martin Luther, 1529 (public domain)',
      spotifyLink: 'https://open.spotify.com/search/A%20Mighty%20Fortress%20Is%20Our%20God',
      youtubeLink: 'https://www.youtube.com/results?search_query=A+Mighty+Fortress+Is+Our+God+hymn',
      scriptureConnectionZh: '“神是我们的避难所，是我们的力量，是我们在患难中随时的帮助”（诗 46:1）。', scriptureConnectionEn: '"God is our refuge and strength, an ever-present help in times of trouble" (Ps 46:1).',
      reflectionPromptZh: '你现在最想找一个能躲进去的地方吗？', reflectionPromptEn: 'Do you long for somewhere safe to hide right now?' },
    { themeZh: '在喧嚣中安静', themeEn: 'Stillness amid the noise',
      titleZh: '我灵镇静 · Be Still, My Soul', titleEn: 'Be Still, My Soul', artist: 'von Schlegel; tune Finlandia (public domain)',
      spotifyLink: 'https://open.spotify.com/search/Be%20Still%20My%20Soul%20Finlandia',
      youtubeLink: 'https://www.youtube.com/results?search_query=Be+Still+My+Soul+hymn',
      scriptureConnectionZh: '“你们要休息，要知道我是神”（诗 46:10）。', scriptureConnectionEn: '"Be still, and know that I am God" (Ps 46:10).',
      reflectionPromptZh: '你已经有多久没有让心真正安静下来？', reflectionPromptEn: 'How long has it been since your heart was truly still?' },
    { themeZh: '藏身在神里面', themeEn: 'Hidden in God',
      titleZh: '你是我的避难所 · You Are My Hiding Place', titleEn: 'You Are My Hiding Place', artist: 'Michael Ledner',
      spotifyLink: 'https://open.spotify.com/search/You%20Are%20My%20Hiding%20Place',
      youtubeLink: 'https://www.youtube.com/results?search_query=You+Are+My+Hiding+Place+worship',
      scriptureConnectionZh: '“你是我藏身之处；你必保护我脱离苦难”（诗 32:7）。', scriptureConnectionEn: '"You are my hiding place; You will protect me from trouble" (Ps 32:7).',
      reflectionPromptZh: '当你害怕的时候，你会先躲到哪里去？', reflectionPromptEn: 'When you are afraid, where do you run to first?' }
  ]
};

export default psalmsWorship;
