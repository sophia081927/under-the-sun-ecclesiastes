/**
 * Ecclesiastes — worship track metadata. Same schema as johnWorship.js.
 * Copyright-safe: titles + public listening links only, no lyrics.
 *
 * Scripture is STRUCTURED and VERBATIM (新标点和合本 / WEB), checked against corpus and an
 * independent manifest by scripts/verify-worship-corpus.mjs. Editorial application is kept
 * in connectionZh/En and rendered separately, marked "本站整理（非经文）". Cards without a
 * Scripture anchor (grace / Abide / in-Christ themes drawn from hymns, not Ecclesiastes)
 * are editorial-only and registered as such in the manifest.
 */
export const ecclesiastesWorship = {
  id: 'ecclesiastes',
  intro: {
    zh: '当日光之下的一切归于虚空，转眼仰望那位不改变的主。',
    en: 'When everything under the sun turns to vapor, turn your eyes upon the One who does not change.'
  },
  tracks: [
    { id: 'turn-eyes', themeZh: '转眼仰望耶稣', themeEn: 'Turn your eyes upon Jesus',
      titleZh: 'Turn Your Eyes Upon Jesus · 定睛在耶稣', titleEn: 'Turn Your Eyes Upon Jesus', artist: 'Helen Lemmel (public domain)',
      spotifyLink: 'https://open.spotify.com/search/Turn%20Your%20Eyes%20Upon%20Jesus',
      youtubeLink: 'https://www.youtube.com/results?search_query=Turn+Your+Eyes+Upon+Jesus+worship',
      scripture: [{ book: 'ECC', ch: 2, from: 11, to: 11,
        zh: '后来，我察看我手所经营的一切事和我劳碌所成的功。谁知都是虚空，都是捕风；在日光之下毫无益处。',
        en: 'Then I looked at all the works that my hands had worked, and at the labor that I had labored to do; and behold, all was vanity and a chasing after wind, and there was no profit under the sun.' }],
      connectionZh: '日光之下的劳碌终究是捕风——转眼仰望那位不改变的主。',
      connectionEn: 'All toil under the sun is finally a chasing after wind — so turn your eyes to the One who does not change.',
      reflectionPromptZh: '此刻，你的眼睛定睛在哪里？', reflectionPromptEn: 'Where are your eyes fixed right now?' },
    { id: 'found-by-grace', themeZh: '恩典中被寻回', themeEn: 'Found by grace',
      titleZh: '奇异恩典 · Amazing Grace', titleEn: 'Amazing Grace', artist: 'John Newton, 1779 (public domain)',
      spotifyLink: 'https://open.spotify.com/search/Amazing%20Grace',
      youtubeLink: 'https://www.youtube.com/results?search_query=Amazing+Grace+hymn',
      connectionZh: '人抓不住自己的生命——是恩典先寻回了人。',
      connectionEn: 'We cannot hold on to our own lives — grace found us first.',
      reflectionPromptZh: '你努力很多，却仍觉迷失吗？', reflectionPromptEn: 'You have tried so hard — do you still feel lost?' },
    { id: 'peace-in-sorrow', themeZh: '在忧伤中得安宁', themeEn: 'Peace amid sorrow',
      titleZh: '我心灵得安宁 · It Is Well', titleEn: 'It Is Well With My Soul', artist: 'Spafford, 1873 (public domain)',
      spotifyLink: 'https://open.spotify.com/search/It%20Is%20Well%20With%20My%20Soul',
      youtubeLink: 'https://www.youtube.com/results?search_query=It+Is+Well+With+My+Soul+hymn',
      scripture: [
        { book: 'ECC', ch: 3, from: 1, to: 1,
          zh: '凡事都有定期， 天下万务都有定时。',
          en: 'For everything there is a season, and a time for every purpose under heaven:' },
        { book: 'ECC', ch: 3, from: 4, to: 4,
          zh: '哭有时，笑有时； 哀恸有时，跳舞有时；',
          en: 'a time to weep, and a time to laugh; a time to mourn, and a time to dance;' }
      ],
      connectionZh: '在神的时序里，连忧伤也有它的时候；仍可对祂说“我心安宁”。',
      connectionEn: 'In God’s seasons even sorrow has its time — and still we can say, “It is well.”',
      reflectionPromptZh: '你能在无法掌控之处，仍说“我心安宁”吗？', reflectionPromptEn: 'Can you say “it is well” where you cannot control?' },
    { id: 'unchanging-refuge', themeZh: '永不改变的避难所', themeEn: 'The unchanging refuge',
      titleZh: '求主同住 · Abide With Me', titleEn: 'Abide With Me', artist: 'Henry Lyte, 1847 (public domain)',
      spotifyLink: 'https://open.spotify.com/search/Abide%20With%20Me',
      youtubeLink: 'https://www.youtube.com/results?search_query=Abide+With+Me+hymn',
      connectionZh: '世事盛衰、不断变迁，惟有主永不改变。',
      connectionEn: 'Change and decay are all around — but the Lord never changes.',
      reflectionPromptZh: '你人生里哪一样，正在朽坏、抓不住？', reflectionPromptEn: 'What in your life is decaying, slipping away?' },
    { id: 'strength-in-christ', themeZh: '在基督里的力量', themeEn: 'Strength in Christ',
      titleZh: '不再是我 · Yet Not I But Through Christ', titleEn: 'Yet Not I But Through Christ in Me', artist: 'CityAlight',
      spotifyLink: 'https://open.spotify.com/search/Yet%20Not%20I%20But%20Through%20Christ%20in%20Me',
      youtubeLink: 'https://www.youtube.com/results?search_query=Yet+Not+I+But+Through+Christ+in+Me+CityAlight',
      connectionZh: '靠自己终究有限——真正的生命与力量在基督里。',
      connectionEn: 'Self-reliance is finally limited — real life and strength are found in Christ.',
      reflectionPromptZh: '你还在靠自己撑吗？', reflectionPromptEn: 'Are you still holding on by your own strength?' }
  ]
};

export default ecclesiastesWorship;
