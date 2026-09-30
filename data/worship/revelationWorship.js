/**
 * Revelation — worship track metadata, organized by the major themes of the book:
 * the throne, the worthy Lamb, holiness, the reign of Christ, victory, all things
 * new, and the longing "Come, Lord Jesus." Copyright-safe: titles + public links only.
 *
 * Scripture is STRUCTURED and VERBATIM (新标点和合本 / WEB), checked against corpus and an
 * independent manifest by scripts/verify-worship-corpus.mjs. Non-contiguous verses are
 * separate refs (e.g. 22:17 and 22:20), never shown as a continuous range.
 */
export const revelationWorship = {
  id: 'revelation',
  intro: {
    zh: '按启示录的主题聆听敬拜——从宝座前的颂赞，到得胜的羔羊、圣洁、得胜、万物更新，与"主耶稣啊，我愿你来"。',
    en: 'Worship gathered around the themes of Revelation — from the throne to the victorious Lamb, holiness, victory, all things made new, and "Come, Lord Jesus."'
  },
  tracks: [
    { id: 'throne', themeZh: '宝座前的敬拜', themeEn: 'Worship before the throne',
      titleZh: 'Revelation Song · 启示录之歌', titleEn: 'Revelation Song', artist: 'Kari Jobe / Gateway',
      spotifyLink: 'https://open.spotify.com/search/Revelation%20Song',
      youtubeLink: 'https://www.youtube.com/results?search_query=Revelation+Song+worship',
      scripture: [{ book: 'REV', ch: 4, from: 8, to: 8,
        zh: '四活物各有六个翅膀，遍体内外都满了眼睛。他们昼夜不住地说： 圣哉！圣哉！圣哉！ 主　神是昔在、今在、 以后[永]在的全能者。',
        en: 'The four living creatures, each one of them having six wings, are full of eyes around and within. They have no rest day and night, saying, “Holy, holy, holy is the Lord God, the Almighty, who was and who is and who is to come!”' }],
      reflectionPromptZh: '若此刻你站在那宝座前，什么会显得不再那么重？', reflectionPromptEn: 'Standing before that throne, what would suddenly matter less?' },
    { id: 'holy', themeZh: '圣哉全能的主神', themeEn: 'Holy, Holy, Holy',
      titleZh: '圣哉三一歌 · Holy, Holy, Holy', titleEn: 'Holy, Holy, Holy', artist: 'Reginald Heber, 1826 · public domain',
      spotifyLink: 'https://open.spotify.com/search/Holy%20Holy%20Holy%20hymn',
      youtubeLink: 'https://www.youtube.com/results?search_query=Holy+Holy+Holy+hymn',
      scripture: [{ book: 'REV', ch: 4, from: 8, to: 8,
        zh: '四活物各有六个翅膀，遍体内外都满了眼睛。他们昼夜不住地说： 圣哉！圣哉！圣哉！ 主　神是昔在、今在、 以后[永]在的全能者。',
        en: 'The four living creatures, each one of them having six wings, are full of eyes around and within. They have no rest day and night, saying, “Holy, holy, holy is the Lord God, the Almighty, who was and who is and who is to come!”' }],
      reflectionPromptZh: '“圣洁”不只是道德，更是神与你我不同。今天你愿如何敬畏他？', reflectionPromptEn: 'Holiness is more than morals — it is God’s otherness. How will you revere Him today?' },
    { id: 'worthy-lamb', themeZh: '配得敬拜的羔羊', themeEn: 'Worthy is the Lamb',
      titleZh: 'Is He Worthy · 他配得吗', titleEn: 'Is He Worthy?', artist: 'Andrew Peterson',
      spotifyLink: 'https://open.spotify.com/search/Is%20He%20Worthy%20Andrew%20Peterson',
      youtubeLink: 'https://www.youtube.com/results?search_query=Is+He+Worthy+Andrew+Peterson',
      scripture: [{ book: 'REV', ch: 5, from: 9, to: 9,
        zh: '他们唱新歌，说： 你配拿书卷， 配揭开七印； 因为你曾被杀， 用自己的血 从各族、各方、各民、各国中买了人来， 叫他们归于　神，',
        en: 'They sang a new song, saying, “You are worthy to take the book and to open its seals, for you were killed, and bought us for God with your blood out of every tribe, language, people, and nation,' }],
      reflectionPromptZh: '得胜的方式竟是舍己被杀——这如何改变你对"刚强"的理解？', reflectionPromptEn: 'The Lamb conquers by being slain — how does that reshape what "strength" means?' },
    { id: 'king-of-kings', themeZh: '万王之王，万主之主', themeEn: 'King of kings',
      titleZh: 'King of Kings · 万王之王', titleEn: 'King of Kings', artist: 'Hillsong Worship',
      spotifyLink: 'https://open.spotify.com/search/King%20of%20Kings%20Hillsong',
      youtubeLink: 'https://www.youtube.com/results?search_query=King+of+Kings+Hillsong+worship',
      scripture: [{ book: 'REV', ch: 19, from: 16, to: 16,
        zh: '在他衣服和大腿上有名写着说：「万王之王，万主之主。」',
        en: 'He has on his garment and on his thigh a name written, “KING OF KINGS AND LORD OF LORDS.”' }],
      reflectionPromptZh: '有哪一处"王权"，你还没交给这位真正的王？', reflectionPromptEn: 'What throne in your life still needs to be handed to the true King?' },
    { id: 'victory', themeZh: '得胜的确据', themeEn: 'Victory that holds',
      titleZh: 'Raise a Hallelujah · 高举哈利路亚', titleEn: 'Raise a Hallelujah', artist: 'Bethel Music',
      spotifyLink: 'https://open.spotify.com/search/Raise%20a%20Hallelujah',
      youtubeLink: 'https://www.youtube.com/results?search_query=Raise+a+Hallelujah+worship',
      scripture: [{ book: 'REV', ch: 12, from: 11, to: 11,
        zh: '弟兄胜过它，是因羔羊的血和自己所见证的道。他们虽至于死，也不爱惜性命。',
        en: 'They overcame him because of the Lamb’s blood, and because of the word of their testimony. They didn’t love their life, even to death.' }],
      reflectionPromptZh: '在你还没看见结局的争战里，你要怎样先献上赞美？', reflectionPromptEn: 'In a battle whose end you cannot yet see, how will you worship first?' },
    { id: 'all-new', themeZh: '万物更新', themeEn: 'All things new',
      titleZh: 'Yes and Amen · 是的，阿们', titleEn: 'Yes and Amen', artist: 'Housefires / Chris Tomlin',
      spotifyLink: 'https://open.spotify.com/search/Yes%20and%20Amen%20worship',
      youtubeLink: 'https://www.youtube.com/results?search_query=Yes+and+Amen+worship',
      scripture: [{ book: 'REV', ch: 21, from: 5, to: 5,
        zh: '坐宝座的说：「看哪，我将一切都更新了！」又说：「你要写上；因这些话是可信的，是真实的。」',
        en: 'He who sits on the throne said, “Behold, I am making all things new.” He said, “Write, for these words of God are faithful and true.”' }],
      reflectionPromptZh: '有哪一样你以为无法挽回的，需要交给这位"使一切更新"的神？', reflectionPromptEn: 'What feels beyond repair that you can entrust to the God who makes all things new?' },
    { id: 'god-with-us', themeZh: '神与人同住', themeEn: 'God dwells with us',
      titleZh: 'Living Hope · 活着的盼望', titleEn: 'Living Hope', artist: 'Phil Wickham',
      spotifyLink: 'https://open.spotify.com/search/Living%20Hope%20Phil%20Wickham',
      youtubeLink: 'https://www.youtube.com/results?search_query=Living+Hope+Phil+Wickham',
      scripture: [{ book: 'REV', ch: 21, from: 4, to: 4,
        zh: '神要擦去他们一切的眼泪；不再有死亡，也不再有悲哀、哭号、疼痛，因为以前的事都过去了。」',
        en: 'He will wipe away every tear from their eyes. Death will be no more; neither will there be mourning, nor crying, nor pain any more. The first things have passed away.”' }],
      reflectionPromptZh: '你盼望神亲手擦去哪一滴眼泪？', reflectionPromptEn: 'Which tear are you longing for God’s own hand to wipe away?' },
    { id: 'come-lord-jesus', themeZh: '主耶稣啊，我愿你来', themeEn: 'Come, Lord Jesus',
      titleZh: 'Even So Come · 主啊我願你來', titleEn: 'Even So Come', artist: 'Passion / Chris Tomlin',
      spotifyLink: 'https://open.spotify.com/search/Even%20So%20Come',
      youtubeLink: 'https://www.youtube.com/results?search_query=Even+So+Come+worship',
      scripture: [
        { book: 'REV', ch: 22, from: 17, to: 17,
          zh: '[圣]灵和新妇都说：「来！」听见的人也该说：「来！」口渴的人也当来；愿意的，都可以白白取生命的水[喝]。',
          en: 'The Spirit and the bride say, “Come!” He who hears, let him say, “Come!” He who is thirsty, let him come. He who desires, let him take the water of life freely.' },
        { book: 'REV', ch: 22, from: 20, to: 20,
          zh: '证明这事的说：「是了，我必快来！」阿们！主耶稣啊，我愿你来！',
          en: 'He who testifies these things says, “Yes, I am coming soon.” Amen! Yes, come, Lord Jesus!' }
      ],
      reflectionPromptZh: '"主啊，你来"——今天你带着怎样的心境说这句话？', reflectionPromptEn: 'With what heart do you say "Come, Lord" today?' }
  ]
};

export default revelationWorship;
