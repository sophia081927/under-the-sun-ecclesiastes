/**
 * Revelation — worship track metadata, organized by the major themes of the book:
 * the throne, the worthy Lamb, holiness, the reign of Christ, victory, all things
 * new, the river of life, and the longing "Come, Lord Jesus."
 * Copyright-safe: titles + public listening/search links only, no lyrics.
 *
 * Track schema: { themeZh, themeEn, titleZh, titleEn, artist,
 *   spotifyLink, youtubeLink, scriptureConnectionZh/En, reflectionPromptZh/En }
 */
export const revelationWorship = {
  id: 'revelation',
  intro: {
    zh: '按启示录的主题聆听敬拜——从宝座前的颂赞，到得胜的羔羊、圣洁、得胜、万物更新，与"主耶稣啊，我愿你来"。',
    en: 'Worship gathered around the themes of Revelation — from the throne to the victorious Lamb, holiness, victory, all things made new, and "Come, Lord Jesus."'
  },
  tracks: [
    { themeZh: '宝座前的敬拜', themeEn: 'Worship before the throne',
      titleZh: 'Revelation Song · 启示录之歌', titleEn: 'Revelation Song', artist: 'Kari Jobe / Gateway',
      spotifyLink: 'https://open.spotify.com/search/Revelation%20Song',
      youtubeLink: 'https://www.youtube.com/results?search_query=Revelation+Song+worship',
      scriptureConnectionZh: '圣哉，圣哉，圣哉，主神是昔在、今在、以后永在的全能者（启 4:8）。', scriptureConnectionEn: 'Holy, holy, holy is the Lord God Almighty, who was and is and is to come (Rev 4:8).',
      reflectionPromptZh: '若此刻你站在那宝座前，什么会显得不再那么重？', reflectionPromptEn: 'Standing before that throne, what would suddenly matter less?' },
    { themeZh: '圣哉全能的主神', themeEn: 'Holy, Holy, Holy',
      titleZh: '圣哉三一歌 · Holy, Holy, Holy', titleEn: 'Holy, Holy, Holy', artist: 'Reginald Heber, 1826 · public domain',
      spotifyLink: 'https://open.spotify.com/search/Holy%20Holy%20Holy%20hymn',
      youtubeLink: 'https://www.youtube.com/results?search_query=Holy+Holy+Holy+hymn',
      scriptureConnectionZh: '他们昼夜不住地说：圣哉，圣哉，圣哉（启 4:8）。', scriptureConnectionEn: 'Day and night they never stop saying: Holy, holy, holy (Rev 4:8).',
      reflectionPromptZh: '"圣洁"不只是道德，更是神与你我不同。今天你愿如何敬畏他？', reflectionPromptEn: 'Holiness is more than morals — it is God’s otherness. How will you revere Him today?' },
    { themeZh: '配得敬拜的羔羊', themeEn: 'Worthy is the Lamb',
      titleZh: 'Is He Worthy · 他配得吗', titleEn: 'Is He Worthy?', artist: 'Andrew Peterson',
      spotifyLink: 'https://open.spotify.com/search/Is%20He%20Worthy%20Andrew%20Peterson',
      youtubeLink: 'https://www.youtube.com/results?search_query=Is+He+Worthy+Andrew+Peterson',
      scriptureConnectionZh: '你配拿书卷，因为你曾被杀，用血买了人来归神（启 5:9）。', scriptureConnectionEn: 'You are worthy to take the scroll, for you were slain and with your blood purchased people for God (Rev 5:9).',
      reflectionPromptZh: '得胜的方式竟是舍己被杀——这如何改变你对"刚强"的理解？', reflectionPromptEn: 'The Lamb conquers by being slain — how does that reshape what "strength" means?' },
    { themeZh: '万王之王，万主之主', themeEn: 'King of kings',
      titleZh: 'King of Kings · 万王之王', titleEn: 'King of Kings', artist: 'Hillsong Worship',
      spotifyLink: 'https://open.spotify.com/search/King%20of%20Kings%20Hillsong',
      youtubeLink: 'https://www.youtube.com/results?search_query=King+of+Kings+Hillsong+worship',
      scriptureConnectionZh: '在他衣服和大腿上有名写着：万王之王，万主之主（启 19:16）。', scriptureConnectionEn: 'On his robe and thigh he has a name written: King of kings and Lord of lords (Rev 19:16).',
      reflectionPromptZh: '有哪一处"王权"，你还没交给这位真正的王？', reflectionPromptEn: 'What throne in your life still needs to be handed to the true King?' },
    { themeZh: '得胜的确据', themeEn: 'Victory that holds',
      titleZh: 'Raise a Hallelujah · 高举哈利路亚', titleEn: 'Raise a Hallelujah', artist: 'Bethel Music',
      spotifyLink: 'https://open.spotify.com/search/Raise%20a%20Hallelujah',
      youtubeLink: 'https://www.youtube.com/results?search_query=Raise+a+Hallelujah+worship',
      scriptureConnectionZh: '弟兄胜过它，是因羔羊的血和自己所见证的道（启 12:11）。', scriptureConnectionEn: 'They overcame him by the blood of the Lamb and the word of their testimony (Rev 12:11).',
      reflectionPromptZh: '在你还没看见结局的争战里，你要怎样先献上赞美？', reflectionPromptEn: 'In a battle whose end you cannot yet see, how will you worship first?' },
    { themeZh: '万物更新', themeEn: 'All things new',
      titleZh: 'Yes and Amen · 是的，阿们', titleEn: 'Yes and Amen', artist: 'Housefires / Chris Tomlin',
      spotifyLink: 'https://open.spotify.com/search/Yes%20and%20Amen%20worship',
      youtubeLink: 'https://www.youtube.com/results?search_query=Yes+and+Amen+worship',
      scriptureConnectionZh: '坐宝座的说：看哪，我将一切都更新了（启 21:5）。', scriptureConnectionEn: 'He who sits on the throne said: Behold, I am making all things new (Rev 21:5).',
      reflectionPromptZh: '有哪一样你以为无法挽回的，需要交给这位"使一切更新"的神？', reflectionPromptEn: 'What feels beyond repair that you can entrust to the God who makes all things new?' },
    { themeZh: '神与人同住', themeEn: 'God dwells with us',
      titleZh: 'Living Hope · 活着的盼望', titleEn: 'Living Hope', artist: 'Phil Wickham',
      spotifyLink: 'https://open.spotify.com/search/Living%20Hope%20Phil%20Wickham',
      youtubeLink: 'https://www.youtube.com/results?search_query=Living+Hope+Phil+Wickham',
      scriptureConnectionZh: '神要擦去他们一切的眼泪，不再有死亡、悲哀、哭号、疼痛（启 21:4）。', scriptureConnectionEn: 'God will wipe away every tear; death, mourning, crying, and pain will be no more (Rev 21:4).',
      reflectionPromptZh: '你盼望神亲手擦去哪一滴眼泪？', reflectionPromptEn: 'Which tear are you longing for God’s own hand to wipe away?' },
    { themeZh: '主耶稣啊，我愿你来', themeEn: 'Come, Lord Jesus',
      titleZh: 'Even So Come · 主啊我願你來', titleEn: 'Even So Come', artist: 'Passion / Chris Tomlin',
      spotifyLink: 'https://open.spotify.com/search/Even%20So%20Come',
      youtubeLink: 'https://www.youtube.com/results?search_query=Even+So+Come+worship',
      scriptureConnectionZh: '圣灵和新妇都说：来！……主耶稣啊，我愿你来（启 22:17,20）。', scriptureConnectionEn: 'The Spirit and the Bride say, "Come!"… Come, Lord Jesus (Rev 22:17,20).',
      reflectionPromptZh: '"主啊，你来"——今天你带着怎样的心境说这句话？', reflectionPromptEn: 'With what heart do you say "Come, Lord" today?' }
  ]
};

export default revelationWorship;
