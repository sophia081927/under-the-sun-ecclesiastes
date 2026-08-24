/* ============================================================
   qaEngine.js — Universal Scripture Answer Engine
   ------------------------------------------------------------
   Lightweight, local, no-API keyword→Scripture matching for the
   Bible Library. Bilingual (zh / en). Crisis detection runs FIRST.

   Public API:
     qaRegistry                       — array of topics
     getBiblicalResponse(input, lang) — main entry; returns a response object
     getFallbackResponse(lang)        — warm, Scripture-centered fallback
     detectCrisis(input, lang)        — returns crisis response or null

   A response object has:
     { id, title, verse, explanation, reflection, nextStep, prayer,
       relatedBooks? }

   MATCHING ORDER:
     (1) crisis (always first, bypasses everything)
     (2) topic keyword match — LONGEST matched keyword wins; a tie on
         length is broken by the topic's `priority` (lower wins). Priorities
         are UNIQUE, so resolution is fully deterministic and never depends
         on array order.
     (3) warm fallback — only when nothing matches.
   Keyword hygiene: keywordsZh holds only Chinese, keywordsEn only English.
   Overly generic single tokens (bare 意义 / 价值 / meaning / truth / alone …)
   are avoided in favour of multi-word phrases, so short tokens can't steal
   a question from a more specific topic.

   SCRIPTURE PRINCIPLE (whole Bible): answers may cite ANY book — Psalms,
   Proverbs, Isaiah, Matthew, John, Romans, Philippians, 1 Peter, 1 John,
   Hebrews, Revelation, etc. `relatedBooks` only links to the books we host.
   We never invent a verse.

   TRANSLATION ATTRIBUTION: Chinese verses use 和合本 (public domain — no
   attribution). English verses append their translation abbreviation, e.g.
   "(NIV)", consistently everywhere.
   ============================================================ */

export const qaRegistry = [
  {
    id: 'emptiness', priority: 1,
    keywordsZh: ['空虚','虚空','没意义','没有意义','毫无意义','无聊','不满足','捕风','空洞','迷茫'],
    keywordsEn: ['empty','emptiness','meaningless','no meaning','pointless','vanity','not satisfied','unsatisfied','chasing the wind'],
    relatedBooks: ['ecclesiastes','john'],
    variants: [
      { verse: { zh: '【传道书 3:11】“神造万物,各按其时成为美好,又将永生安置在世人心里。”', en: '【Ecclesiastes 3:11】“He has made everything beautiful in its time. He has also set eternity in the human heart.” (NIV)' } },
      { verse: { zh: '【约翰福音 4:13-14】“凡喝这水的还要再渴;人若喝我所赐的水就永远不渴。我所赐的水要在他里头成为泉源,直涌到永生。”', en: '【John 4:13-14】“Everyone who drinks this water will be thirsty again, but whoever drinks the water I give them will never thirst. Indeed, the water I give them will become in them a spring of water welling up to eternal life.” (NIV)' } }
    ],
    zh: {
      title: '当你感到空虚',
      verse: '【传道书 1:14】“我见日光之下所行的一切事,都是虚空,都是捕风。”',
      explanation: '圣经很诚实地指出,人若只活在“日光之下”,即使拥有成就、金钱、关系或名声,仍然可能感到空虚。这样的空虚不一定代表你失败了,而是在提醒你:人的灵魂不是为短暂的事物而造,而是为永恒和神自己而造——传道书 3:11 说,神“将永生安置在世人心里”。',
      reflection: '最近哪一件你很努力追求的事,在得到之后反而让你觉得空虚?',
      nextStep: '你可以继续阅读《传道书》第 1 章和第 3 章,也可以进入《约翰福音》认识那位带来生命与真光的耶稣。',
      prayer: '主耶稣,求你安慰我空虚干渴的心。求你带我从日光之下的捕风,转向你里面真正的生命和永恒。阿们。'
    },
    en: {
      title: 'When You Feel Empty',
      verse: '【Ecclesiastes 1:14】“I have seen all the things that are done under the sun; all of them are meaningless, a chasing after the wind.” (NIV)',
      explanation: 'The Bible honestly shows that life “under the sun” cannot fully satisfy the human soul. Achievement, money, relationships, or status may still leave us empty. This emptiness does not simply mean you have failed; it may be a reminder that your soul was made for eternity and for God Himself — Ecclesiastes 3:11 says God “has set eternity in the human heart.”',
      reflection: 'What is one thing you have chased recently that still left you feeling empty after you received it?',
      nextStep: 'You may continue reading Ecclesiastes chapters 1 and 3, and then read John to encounter Jesus, the true light and life.',
      prayer: 'Lord Jesus, comfort my weary and empty heart. Lead me from chasing the wind under the sun to finding true life and eternity in You. Amen.'
    }
  },

  {
    id: 'anxiety', priority: 2,
    keywordsZh: ['焦虑','害怕','压力','担心','忧愁','忧虑','睡不着','恐惧','不安','紧张','惊慌','放不下'],
    keywordsEn: ['anxious','anxiety','fear','afraid','fearful','stress','stressed','worry','worried','cannot sleep',"can't sleep",'nervous','panic','overwhelmed'],
    relatedBooks: ['john','psalms','revelation'],
    variants: [
      { verse: { zh: '【腓立比书 4:6-7】“应当一无挂虑,只要凡事借着祷告、祈求和感谢,将你们所要的告诉神。神所赐出人意外的平安,必在基督耶稣里保守你们的心怀意念。”', en: '【Philippians 4:6-7】“Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.” (NIV)' } },
      { verse: { zh: '【马太福音 6:34】“所以,不要为明天忧虑,因为明天自有明天的忧虑;一天的难处一天当就够了。”', en: '【Matthew 6:34】“Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.” (NIV)' } }
    ],
    zh: {
      title: '当你焦虑害怕',
      verse: '【约翰福音 14:27】“我留下平安给你们;我将我的平安赐给你们。我所赐的,不像世人所赐的。你们心里不要忧愁,也不要胆怯。”',
      explanation: '世界给人的平安常常取决于环境:金钱、成绩、关系、健康、未来是否可控。但耶稣所赐的平安,不是建立在环境完全顺利之上,而是建立在祂与我们同在、祂掌管明天之上。祂没有说“别怕,没事的”,而是说“在世上你们有苦难,但你们可以放心,我已经胜了世界”(约 16:33)。',
      reflection: '现在最让你焦虑的一件事是什么?你是否愿意在祷告中把它交托给主?',
      nextStep: '你可以阅读《约翰福音》第 14 章,慢慢思想耶稣所说的平安;也可以到“聆听”页,让这些话被轻声读给你听。',
      prayer: '主耶稣,我现在心里焦虑沉重。求你把你的平安赐给我,帮助我不被恐惧掌控,而是学习把明天交在你手中。阿们。'
    },
    en: {
      title: 'When You Feel Anxious',
      verse: '【John 14:27】“Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.” (NIV)',
      explanation: 'The peace of the world often depends on circumstances: money, grades, relationships, health, and a controllable future. But the peace Jesus gives is deeper. It is rooted in His presence and His authority over tomorrow. He did not say “don’t worry, it’s nothing,” but “in this world you will have trouble. But take heart! I have overcome the world” (John 16:33).',
      reflection: 'What is the biggest worry weighing on your heart today? Are you willing to bring it to Jesus in prayer?',
      nextStep: 'You may read John chapter 14 slowly and reflect on the peace Jesus promises. You can also open the Listen page and let these words be read gently to you.',
      prayer: 'Lord Jesus, my heart feels anxious and heavy. Please give me Your peace and help me entrust my tomorrow into Your hands. Amen.'
    }
  },

  {
    id: 'godlove', priority: 3,
    keywordsZh: ['神爱我','神爱','神真的爱','神真的爱我吗','神爱我吗','神在乎','神在意','被爱','没有人爱','没有人爱我','值得被爱','我值得被爱吗','神还爱我吗','爱我吗','配不配'],
    keywordsEn: ['god love','does god love','does god love me','god really love','loved by god','god care','am i loved','no one loves','no one loves me','worth loving','worthy of love','unlovable','god still love'],
    relatedBooks: ['john'],
    variants: [
      { verse: { zh: '【罗马书 5:8】“惟有基督在我们还作罪人的时候为我们死,神的爱就在此向我们显明了。”', en: '【Romans 5:8】“But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.” (NIV)' } },
      { verse: { zh: '【约翰一书 4:9-10】“神差他独生子到世间来,使我们借着他得生,神爱我们的心在此就显明了。不是我们爱神,乃是神爱我们,差他的儿子为我们的罪作了挽回祭,这就是爱了。”', en: '【1 John 4:9-10】“This is how God showed his love among us: He sent his one and only Son into the world that we might live through him. This is love: not that we loved God, but that he loved us and sent his Son as an atoning sacrifice for our sins.” (NIV)' } }
    ],
    zh: {
      title: '当你怀疑神是否爱你',
      verse: '【约翰福音 15:9】“我爱你们,正如父爱我一样;你们要常在我的爱里。”',
      explanation: '圣经回答“神真的爱我吗”的方式,不是一句空洞的保证,而是一个付出代价的动作:神舍下他的独生子(约 3:16);“惟有基督在我们还作罪人的时候为我们死,神的爱就在此向我们显明了”(罗马书 5:8)。而且请注意,这份爱临到的是“世人”——不是“够好的人”“表现好的人”,里面就有此刻正在问这个问题的你。你不需要先变得可爱,才配得这份爱。',
      reflection: '你是否常常觉得,要先变好、先做到某些事,才配得被神爱?',
      nextStep: '从《约翰福音》第 3 章读起,再读第 15 章;也可以读约翰一书 4:9-10,看神的爱是如何主动临到我们的。',
      prayer: '神啊,我常常怀疑自己是否值得被爱。求你让我真的知道——不只是在道理上,而是在心里——你爱我,爱到舍下你的儿子。求你帮助我住在你的爱里。阿们。'
    },
    en: {
      title: 'When You Doubt God Loves You',
      verse: '【John 15:9】“As the Father has loved me, so have I loved you. Now remain in my love.” (NIV)',
      explanation: 'The Bible answers “does God love me?” not with an empty reassurance but with a costly action: God gave His one and only Son (John 3:16), and “God demonstrates his own love for us in this: While we were still sinners, Christ died for us” (Romans 5:8). Notice the word — “the world.” Not “the good enough,” but the world, which includes you, right now, asking this question. You do not have to become lovable first in order to be loved.',
      reflection: 'Do you often feel you must first become better, or do certain things, before you can be loved by God?',
      nextStep: 'Begin with John chapter 3, then John 15; you may also read 1 John 4:9–10 to see how God’s love reached us first.',
      prayer: 'God, I so often doubt whether I am worth loving. Help me truly know — not just in my head but in my heart — that You love me, enough to give Your Son. Help me remain in Your love. Amen.'
    }
  },

  {
    id: 'jesus', priority: 4,
    keywordsZh: ['耶稣','认识神','认识耶稣','救恩','永生','信耶稣','怎么信','如何信','福音','耶稣是谁','得救','成为基督徒','怎么开始'],
    keywordsEn: ['jesus','know god','know jesus','salvation','eternal life','believe in jesus','gospel','who is jesus','be saved','become a christian','how to believe','how do i start'],
    relatedBooks: ['john'],
    zh: {
      title: '当你想认识耶稣',
      verse: '【约翰福音 3:16】“神爱世人,甚至将他的独生子赐给他们,叫一切信他的,不至灭亡,反得永生。”',
      explanation: '约翰福音告诉我们,神不是遥远冷漠的神。祂借着耶稣基督亲自进入人的世界,为要把生命、真光、赦免和永恒带给我们。认识耶稣不是先通过一场考试,而是从“看”开始——看这个人是谁。你不需要先解决所有疑问,才能开始。',
      reflection: '如果耶稣真的是神赐给人的生命与光,你愿意从哪里开始认识祂?',
      nextStep: '建议你从《约翰福音》第 1 章开始阅读,认识耶稣是谁;书阁里也有《约翰福音导览》一章一章带你走。',
      prayer: '主耶稣,如果你真是生命的光,求你帮助我认识你,带我一步一步走近神。阿们。'
    },
    en: {
      title: 'When You Want to Know Jesus',
      verse: '【John 3:16】“For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.” (NIV)',
      explanation: 'The Gospel of John shows that God is not distant or indifferent. Through Jesus Christ, God entered our world to bring life, light, forgiveness, and eternal hope. Knowing Jesus does not begin with passing a test — it begins with looking, at who this person is. You do not need to resolve every doubt before you begin.',
      reflection: 'If Jesus truly is the light and life from God, where would you like to begin knowing Him?',
      nextStep: 'You may begin with John chapter 1 and discover who Jesus is. The Library also has a John study guide that walks you through it.',
      prayer: 'Lord Jesus, if You are truly the light of life, help me know You and draw near to God step by step. Amen.'
    }
  },

  {
    /* insecurity — the specific phrases 孤单无助 / "feel alone" / 不安全 / 害怕失去
       are longer than the bare tokens they overlap, so longest-match keeps them
       here; generic 孤单/孤独/lonely resolve to `loneliness`. */
    id: 'insecurity', priority: 5,
    keywordsZh: ['没有安全感','不安全','害怕失去','没人保护','缺乏安全感','心里不踏实','怕被抛弃','孤单无助'],
    keywordsEn: ['insecure','insecurity','no sense of security','unsafe','afraid of losing','afraid of being abandoned','not protected','feel alone'],
    relatedBooks: ['john','psalms','revelation'],
    variants: [
      { verse: { zh: '【以赛亚书 41:10】“你不要害怕,因为我与你同在;不要惊惶,因为我是你的神。我必坚固你,我必帮助你;我必用我公义的右手扶持你。”', en: '【Isaiah 41:10】“So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.” (NIV)' } },
      { verse: { zh: '【约翰福音 10:27-29】“我的羊听我的声音,我也认识他们,他们也跟着我。我又赐给他们永生;他们永不灭亡,谁也不能从我手里把他们夺去。”', en: '【John 10:27-29】“My sheep listen to my voice; I know them, and they follow me. I give them eternal life, and they shall never perish; no one will snatch them out of my hand.” (NIV)' } }
    ],
    zh: {
      title: '当你没有安全感',
      verse: '【诗篇 46:1】“神是我们的避难所,是我们的力量,是我们在患难中随时的帮助。”',
      explanation: '没有安全感,常常不是因为你不够坚强,而是因为人的心本来就需要一个比环境、关系、金钱和自我能力更稳固的依靠。圣经告诉我们,神不是遥远的旁观者,祂是人的避难所和力量。真正的安全感,不是所有事情都在我们的掌控中,而是在不可控的人生里,知道有一位永不改变的神托住我们。',
      reflection: '你现在最害怕失去的是什么?这件事是否已经变成了你安全感的来源?',
      nextStep: '你可以慢慢读诗篇46篇,也可以继续读《约翰福音》第10章,思想耶稣如何像好牧人一样认识、保护和带领属祂的人。',
      prayer: '主啊,我承认我里面有很多不安和害怕。求你让我知道,你是我的避难所和力量。即使环境不稳定,求你帮助我把安全感建立在你不改变的爱和同在里面。阿们。'
    },
    en: {
      title: 'When You Feel Insecure',
      verse: '【Psalm 46:1】“God is our refuge and strength, an ever-present help in trouble.” (NIV)',
      explanation: 'Insecurity does not simply mean you are weak. It often reveals that the human heart needs a refuge stronger than circumstances, relationships, money, or self-control. Scripture tells us that God is not a distant observer; He is our refuge and strength. True security does not mean everything is under our control. It means we are held by the unchanging God even when life feels uncertain.',
      reflection: 'What are you most afraid of losing right now? Has that thing become the foundation of your security?',
      nextStep: 'You may slowly read Psalm 46, and then read John chapter 10 to reflect on Jesus as the Good Shepherd who knows, protects, and leads His people.',
      prayer: 'Lord, I confess that my heart feels insecure and afraid. Help me know You as my refuge and strength. Even when life feels unstable, teach me to rest in Your unchanging love and presence. Amen.'
    }
  },

  {
    id: 'meaning', priority: 6,
    keywordsZh: ['人生的意义','生命的意义','活着的意义','为什么活着','人生目的','人生的目的','我为什么活着','意义是什么'],
    keywordsEn: ['meaning of life','purpose of life','why am i here','why am i alive','why do i exist','life purpose','what is the meaning','reason to live'],
    relatedBooks: ['ecclesiastes','revelation'],
    variants: [
      { verse: { zh: '【传道书 3:11】“神造万物,各按其时成为美好,又将永生安置在世人心里。”', en: '【Ecclesiastes 3:11】“He has made everything beautiful in its time. He has also set eternity in the human heart.” (NIV)' } },
      { verse: { zh: '【约翰福音 17:3】“认识你独一的真神,并且认识你所差来的耶稣基督,这就是永生。”', en: '【John 17:3】“Now this is eternal life: that they know you, the only true God, and Jesus Christ, whom you have sent.” (NIV)' } }
    ],
    zh: {
      title: '探讨人生的意义',
      verse: '【传道书 12:13】“这些事都已听见了,总意就是:敬畏神,谨守他的诫命,这是人所当尽的本分。”',
      explanation: '谢谢你提出这个最深刻的问题。传道书的前十一章都在诚实地证明:如果我们把意义建立在“日光之下”的成就、金钱、享乐和短暂的关系上,结果必然是虚空和捕风。神已将永恒安置在人心里(传道书 3:11),生命的终极意义不是由我们自己发明出来的,而是由赋予我们生命的造物主定义的。在敬畏神、与祂连接的秩序里,人才能找回受造的本分与真正的价值。',
      reflection: '在你过往的经历中,哪一个时刻让你最真实地感受到“活着的价值”?那和永恒有什么连接吗?',
      nextStep: '你可以直接步入《传道书》第12章去品读所罗门关于生命终局的反思,也可以读《约翰福音》17:3,看耶稣如何定义永生。',
      prayer: '主耶稣,谢谢你用传道书戳破了我自以为是的虚妄意义。求你带我走出日光之下的虚空迷茫,在敬畏你、顺服你的真理中,找回我受造的真正目的与平安。阿们。'
    },
    en: {
      title: 'Exploring the Meaning of Life',
      verse: '【Ecclesiastes 12:13】“Now all has been heard; here is the conclusion of the matter: Fear God and keep his commandments, for this is the duty of all mankind.” (NIV)',
      explanation: 'Thank you for asking the ultimate question. The book of Ecclesiastes honestly proves that if you anchor your purpose in things “under the sun” — wealth, pleasure, or career — it all ends in chasing the wind. Yet God has set eternity in the human heart (Ecclesiastes 3:11). The meaning of life is not something we invent; it is something we discover when we reconnect with our Creator. True purpose is found in revering God and aligning our fleeting days with His eternal design.',
      reflection: 'When in your life did you feel a true sense of purpose? Was it tied to something temporary or something eternal?',
      nextStep: 'You may dive into Ecclesiastes chapter 12 for its conclusion on worldly vanity, and John 17:3 to see how Jesus defines eternal life.',
      prayer: 'Lord Jesus, deliver me from chasing false meanings under the sun. Lift my eyes to Your throne, and let me discover my true identity and destiny in loving and fearing You. Amen.'
    }
  },

  {
    id: 'truth', priority: 7,
    keywordsZh: ['真的有什么','真的有神吗','神存在吗','什么是真理','真理是什么','真的有永恒吗','真的有天堂吗','真实存在'],
    keywordsEn: ['is god real','does god exist','what is truth','is there a god','is there anything beyond this life','is heaven real'],
    relatedBooks: ['john'],
    variants: [
      { verse: { zh: '【约翰福音 1:1,4-5】“太初有道,道与神同在,道就是神。……生命在他里头,这生命就是人的光。光照在黑暗里,黑暗却不接受光。”', en: '【John 1:1,4-5】“In the beginning was the Word, and the Word was with God, and the Word was God. … In him was life, and that life was the light of all mankind. The light shines in the darkness, and the darkness has not overcome it.” (NIV)' } },
      { verse: { zh: '【希伯来书 11:1】“信就是所望之事的实底,是未见之事的确据。”', en: '【Hebrews 11:1】“Now faith is confidence in what we hope for and assurance about what we do not see.” (NIV)' } }
    ],
    zh: {
      title: '寻找真实的真理',
      verse: '【约翰福音 14:6】“耶稣说:我就是道路、真理、生命;若不借着我,没有人能到父那里去。”',
      explanation: '你这个问题很像是在问:在我们看得见的世界之外,是否真的有神、永恒、真理和盼望。圣经给出了一个震撼的宣告:真理不是一套冷冰冰的哲学理论,也不是一堆道德教条。真理是一个活生生的、有血有肉、带着无尽之爱来到世间寻找你的位格——主耶稣基督。在这个充满面具、转瞬即逝的虚假世界里,唯有祂的爱、祂的十字架和祂的救赎是真实的,永不改变。',
      reflection: '在这个多变、充满不确定性的时代里,对你而言,目前最“真实、绝对不可动摇”的东西是什么?',
      nextStep: '建议你步入《约翰福音》第1章,去看那道成肉身、充充满满有恩典有真理的耶稣。',
      prayer: '主耶稣,这个世界太虚假、太多变,我的心常常感到虚无。如果你真的是那条唯一的道路、绝对的真理和永恒的生命,求你向我显现,撕碎我的怀疑,让我摸到你的真实。阿们。'
    },
    en: {
      title: 'Seeking the Absolute Truth',
      verse: '【John 14:6】“Jesus answered, ‘I am the way and the truth and the life. No one comes to the Father except through me.’” (NIV)',
      explanation: 'Your question sounds like a deeper search: Is there truly God, truth, eternity, and hope beyond what we can see? Scripture does not begin with a cold theory; it brings a radical revelation. Truth is not a cold philosophical concept or an abstract moral law. Truth is a Person who loved you and broke into history to find you — Jesus Christ. He is the only solid reality that never shifts.',
      reflection: 'In this unstable era, what is the single most “real and unshakeable” foundation in your life right now?',
      nextStep: 'We encourage you to open John chapter 1 to see the Word made flesh, full of grace and truth.',
      prayer: 'Lord Jesus, the world feels full of masks and shifting illusions. If You truly are the absolute Way, Truth, and Life, reveal Your reality to my heart and guide my steps out of doubt. Amen.'
    }
  },

  {
    id: 'loneliness', priority: 8,
    keywordsZh: ['孤独','孤单','没人懂我','被遗忘','没人陪'],
    keywordsEn: ['lonely','no one understands me','forgotten','feel abandoned'],
    relatedBooks: ['john','psalms'],
    variants: [
      { verse: { zh: '【马太福音 28:20】“凡我所吩咐你们的,都教训他们遵守,我就常与你们同在,直到世界的末了。”', en: '【Matthew 28:20】“…And surely I am with you always, to the very end of the age.” (NIV)' } }
    ],
    zh: {
      title: '当你感到孤独',
      verse: '【约翰福音 14:18】“我不撇下你们为孤儿,我必到你们这里来。”',
      explanation: '孤独有时不是身边没有人,而是那种“没有人真正懂我”的感觉。圣经从不轻看这种痛。诗篇23篇说,即使走过死荫的幽谷,也有牧者与你同行;耶稣在离世前对门徒说“我不撇下你们为孤儿”,复活后又应许“我就常与你们同在,直到世界的末了”(马太福音 28:20)。你所渴望的那种“被完全认识、又不被离弃”的同在,正是神向你伸出的。',
      reflection: '在你觉得最孤单的时候,你最想要的是有人做什么——是说话,是陪伴,还是只是知道有人没有走开?',
      nextStep: '你可以慢慢读诗篇23篇,再读《约翰福音》第14章,听耶稣如何应许那位永不离开的保惠师。',
      prayer: '主啊,我心里很孤独,常觉得没有人真正懂我。谢谢你应许不撇下我为孤儿。求你让我此刻真实地知道:你与我同在,你认识我,也不离开我。阿们。'
    },
    en: {
      title: 'When You Feel Lonely',
      verse: '【John 14:18】“I will not leave you as orphans; I will come to you.” (NIV)',
      explanation: 'Loneliness is often not the absence of people, but the ache that “no one truly knows me.” Scripture never makes light of that pain. Psalm 23 says that even through the darkest valley, a Shepherd walks with you; before He left, Jesus told His disciples, “I will not leave you as orphans,” and after rising He promised, “I am with you always, to the very end of the age” (Matthew 28:20). The presence you long for — to be fully known and never abandoned — is exactly what God holds out to you.',
      reflection: 'When you feel most alone, what do you most long for someone to do — to speak, to stay, or simply to let you know they have not left?',
      nextStep: 'You may read Psalm 23 slowly, then John chapter 14, and hear Jesus promise the Comforter who never leaves.',
      prayer: 'Lord, I feel lonely, as if no one truly knows me. Thank You for promising not to leave me as an orphan. Let me truly know, right now, that You are with me, that You know me, and that You will not leave. Amen.'
    }
  },

  {
    id: 'success', priority: 9,
    keywordsZh: ['成功','成就','努力','奋斗','事业','拼命','升职','赚了很多','什么都有','还是不满足','还是空','为什么还是','明明有','钱','财富'],
    keywordsEn: ['success','successful','achieve','accomplish','career','hard work','worked hard','promotion','have everything','still empty','still not enough','after success','not satisfied even','money','wealth','rich'],
    relatedBooks: ['ecclesiastes','john'],
    zh: {
      title: '当你成功了却仍不满足',
      verse: '【传道书 2:11】“后来,我察看我手所经营的一切事和我劳碌所成的功。谁知都是虚空,都是捕风,在日光之下毫无益处。”',
      explanation: '写下这些话的人,比你我更努力、成就更大——他什么都得到了,却发现“再多一点”永远填不满。问题从来不在你不够努力,而在于:成就按其本质是留不住的,它撑不起你压在它身上的全部重量。你不是失败,你只是碰到了“日光之下”一切成功共同的天花板。',
      reflection: '你是否一直在等某个成就到手,以为“到那时”就会满足?那一刻真的到过吗?',
      nextStep: '读《传道书》第 2 章,看作者如何走过你正在走的路;若愿意再走一步,《约翰福音》第 4 章有一句话值得停下来想:“人若喝我所赐的水,就永远不渴。”',
      prayer: '主啊,我努力了这么久,心里却还是不满足。求你让我看清:我真正渴的,不是更多的成就,而是你。阿们。'
    },
    en: {
      title: 'When Success Still Leaves You Empty',
      verse: '【Ecclesiastes 2:11】“Yet when I surveyed all that my hands had done and what I had toiled to achieve, everything was meaningless, a chasing after the wind; nothing was gained under the sun.” (NIV)',
      explanation: 'The man who wrote these words worked harder and achieved more than you or I — he got all of it, and found that “a little more” never lands. The problem was never that you tried too little. Achievement, by its nature, cannot be kept; it was never built to carry the full weight you rest on it. You are not a failure — you have reached the ceiling every success shares “under the sun.”',
      reflection: 'Have you been waiting for some achievement, believing that “once I get there” you will finally feel satisfied? Did that moment ever truly arrive?',
      nextStep: 'Read Ecclesiastes 2 and watch the author walk the road you are on. If you want to go a step further, pause on John 4: “Whoever drinks the water I give them will never thirst.”',
      prayer: 'Lord, I have worked so long and still feel unsatisfied. Help me see that what I truly thirst for is not more achievement, but You. Amen.'
    }
  },

  {
    id: 'marriage', priority: 10,
    keywordsZh: ['婚姻','夫妻','老公','老婆','丈夫','妻子','感情','离婚','吵架','相处','家庭'],
    keywordsEn: ['marriage','married','spouse','husband','wife','relationship','divorce','family'],
    relatedBooks: ['ecclesiastes','john'],
    zh: {
      title: '当你的关系里有伤痛',
      verse: '【传道书 4:9-10】“两个人总比一个人好,因为二人劳碌同得美好的果效。若是跌倒,这人可以扶起他的同伴;若是孤身跌倒,没有别人扶起他来,这人就有祸了。”',
      explanation: '传道书讲“两个人比一个人好”,从来不是童话般的婚姻,而是真实的同行——会跌倒,也需要有人扶。婚姻里的痛,往往正因为我们本是为深深的连结而造,所以断裂才这么疼。圣经不给一个“照做就好”的公式,但它承认你的痛是真的,也指向一位愿意进入你重担的神。',
      reflection: '在这段关系里,你最盼望被理解、被扶起来的,是哪一部分?',
      nextStep: '这类的痛通常也需要真实的人来陪伴——一位牧者、辅导员,或成熟的属灵同伴。愿意的话,先在祷告里把这份重担交给神,再迈出寻求帮助的一步。',
      prayer: '神啊,我的关系让我很痛。求你亲自进入我们之间,医治那些破裂的地方,也给我智慧和恩典,知道下一步该怎么走。阿们。'
    },
    en: {
      title: 'When Your Relationships Hurt',
      verse: '【Ecclesiastes 4:9-10】“Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up. But pity anyone who falls and has no one to help them up.” (NIV)',
      explanation: 'Ecclesiastes speaks of “two being better than one,” but never a fairy-tale marriage — it describes real companionship, where people fall and need to be lifted. Pain in a relationship often hurts so much precisely because we were made for deep connection. Scripture offers no simple “just do this” formula, but it honors that your pain is real, and points to a God willing to enter your burden with you.',
      reflection: 'In this relationship, what is the part of you that most longs to be understood, and lifted back up?',
      nextStep: 'This kind of pain usually also needs real people alongside you — a pastor, counselor, or mature spiritual friend. If you are willing, bring the weight to God in prayer first, then take a step toward seeking help.',
      prayer: 'God, my relationship is a place of real pain. Step into it Yourself, heal what is broken, and give me the wisdom and grace to know the next step to take. Amen.'
    }
  },

  {
    id: 'suffering', priority: 11,
    keywordsZh: ['痛苦','苦难','受苦','为什么是我','患难','绝望','撑不下去','难熬','折磨','走不出','看不到希望','很苦','熬不住'],
    keywordsEn: ['suffering','suffer','pain','why me','hardship','despair','hopeless','no hope','going through','painful','trial','hurting'],
    relatedBooks: ['john','ecclesiastes','psalms','revelation'],
    zh: {
      title: '当你正在受苦',
      verse: '【约翰福音 16:33】“我将这些事告诉你们,是要叫你们在我里面有平安。在世上你们有苦难,但你们可以放心,我已经胜了世界。”',
      explanation: '圣经从不轻看你的痛苦。传道书说,人生里有“哀恸的时候”(传 3:4),它不催你赶快好起来。而耶稣自己也没有绕过苦难:他哭过、被离弃过、受过死。他对苦难中的人说的不是“这没什么”,而是先承认真实,再加上一句:“我已经胜了世界。”你不需要假装坚强,才能到他面前来。',
      reflection: '如果可以对神说一句最真实的话,不加掩饰,你此刻最想说什么?',
      nextStep: '读《约翰福音》第 11 章,看耶稣站在朋友的坟前落泪——他明白失去是什么。(关于苦难、失去与无法解释的痛,书阁未来会加入《约伯记》模块。)',
      prayer: '主啊,我很痛,有时甚至说不出话。谢谢你没有要求我先坚强起来。求你在我的苦难里与我同在,让我知道我不是一个人在撑。阿们。'
    },
    en: {
      title: 'When You Are Suffering',
      verse: '【John 16:33】“I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.” (NIV)',
      explanation: 'Scripture never makes light of your pain. Ecclesiastes says there is “a time to mourn” (Ecc 3:4) — it does not rush you to feel better. And Jesus did not go around suffering: he wept, he was abandoned, he died. To those in pain he does not say “it’s nothing,” but names the truth first, then adds: “I have overcome the world.” You do not have to pretend to be strong to come to him.',
      reflection: 'If you could say one completely honest thing to God, with nothing hidden, what would you most want to say right now?',
      nextStep: 'Read John 11 and watch Jesus weep at the grave of his friend — he knows what loss is. (A Job module is planned for the Library, for suffering and unexplained pain.)',
      prayer: 'Lord, I am in pain, sometimes with no words for it. Thank You that You do not ask me to be strong first. Be with me in my suffering, and let me know I am not carrying this alone. Amen.'
    }
  },

  {
    id: 'death', priority: 12,
    keywordsZh: ['死','死亡','离世','去世','过世','怕死','死后','人死后','人都会死','活着有什么意义','没了'],
    keywordsEn: ['death','die','dying','mortal','pass away','passed away','afraid to die','everyone dies','what happens when we die','after death'],
    relatedBooks: ['ecclesiastes','john','revelation'],
    zh: {
      title: '当你面对死亡的问题',
      verse: '【约翰福音 11:25】“耶稣对她说:复活在我,生命也在我。信我的人虽然死了,也必复活。”',
      explanation: '传道书诚实到令人发冷:在“日光之下”,死亡使所有人归于平等,它不粉饰这堵墙。但它留了一个缝隙——“灵仍归于赐灵的神”(传 12:7)。而《约翰福音》从墙的另一边回应:耶稣不是说他“有关于复活的道理”,而是说“复活在我”。面对死亡,他给的不是一套解释,而是他自己。',
      reflection: '当你想到死亡,你最深的害怕或疑问,具体是什么?',
      nextStep: '先读《传道书》第 12 章,让它诚实地把你带到墙前;再读《约翰福音》第 11 章,看耶稣如何面对死亡与坟墓。',
      prayer: '神啊,死亡让我害怕,也让我困惑。求你让我认识那位说“复活在我”的耶稣,让我在必朽的日子里,抓住不朽的盼望。阿们。'
    },
    en: {
      title: 'When You Face the Question of Death',
      verse: '【John 11:25】“Jesus said to her, ‘I am the resurrection and the life. The one who believes in me will live, even though they die.’” (NIV)',
      explanation: 'Ecclesiastes is honest to the point of chill: “under the sun,” death levels everyone, and it does not soften that wall. Yet it leaves a crack — “the spirit returns to God who gave it” (Ecc 12:7). And John answers from the other side: Jesus does not say he has a teaching about resurrection — he says, “I am the resurrection.” In the face of death, what he offers is not an explanation, but himself.',
      reflection: 'When you think about death, what exactly is your deepest fear or question?',
      nextStep: 'Read Ecclesiastes 12 first and let it bring you honestly to the wall; then read John 11 and see how Jesus stands before death and the grave.',
      prayer: 'God, death frightens and unsettles me. Help me know the Jesus who said, “I am the resurrection,” so that in my mortal days I may hold on to a hope that does not perish. Amen.'
    }
  },

  {
    id: 'satisfaction', priority: 13,
    keywordsZh: ['满足','填满','口渴','永远不渴','活水','生命的粮','喂不饱','填不满','总是想要更多','知足','够了没'],
    keywordsEn: ['satisfy','satisfied','fill me','thirst','thirsty','never thirst','living water','bread of life','always want more','content','contentment'],
    relatedBooks: ['john'],
    zh: {
      title: '当你总是渴、总想要更多',
      verse: '【约翰福音 4:14】“人若喝我所赐的水,就永远不渴。我所赐的水要在他里头成为泉源,直涌到永生。”',
      explanation: '传道书诊断出那个“喝了还要再渴”的循环——你追一样东西,得到了,过不久又空了。约翰福音接着说:问题不在于你喝得不够多,而在于你喝的是哪一种水。耶稣说他能给的,是一种在你里头“成为泉源”的水——不是从外面一次次去舀,而是从里面不断涌出来。真正的满足,不是得到更多,而是连接到源头。',
      reflection: '你有没有一样“得到之后很快又渴了”的东西?那份反复的渴,可能在指向什么?',
      nextStep: '读《约翰福音》第 4 章那个井边的对话,再读第 6 章;你会看到耶稣一次次把人从“再要一点”引向“到我这里来”。',
      prayer: '主耶稣,我追了很多东西想让自己满足,却总是很快又空了。求你把你所说的“活水”给我,在我里头成为涌流的泉源。阿们。'
    },
    en: {
      title: 'When You Are Always Thirsty for More',
      verse: '【John 4:14】“Whoever drinks the water I give them will never thirst. Indeed, the water I give them will become in them a spring of water welling up to eternal life.” (NIV)',
      explanation: 'Ecclesiastes diagnoses the loop of “thirsty again” — you chase something, get it, and soon you are empty once more. John responds: the problem is not that you drank too little, but which water you drank. Jesus says the water he gives becomes “a spring” inside you — not something you keep scooping from outside, but something welling up from within. Real satisfaction is not getting more; it is being connected to the Source.',
      reflection: 'Is there something you got, only to feel thirsty again soon after? What might that repeated thirst be pointing to?',
      nextStep: 'Read the well-side conversation in John 4, then John 6. You will watch Jesus turn people, again and again, from “just a little more” toward “come to me.”',
      prayer: 'Lord Jesus, I have chased so many things to satisfy myself, and keep running dry. Give me the “living water” You spoke of, and let it become a spring welling up within me. Amen.'
    }
  },

  {
    id: 'seeker', priority: 14,
    keywordsZh: ['不信','无神','无神论','还没信','不是基督徒','可以读圣经','也能读','怀疑神','没有信仰','不信教','将信将疑'],
    keywordsEn: ['not a christian','dont believe',"don't believe",'do not believe','not religious','atheist','agnostic','can i read','skeptic','skeptical','no faith','not sure god'],
    relatedBooks: ['ecclesiastes','john'],
    zh: {
      title: '当你还不确定信不信',
      verse: '【传道书 3:11】“神造万物,各按其时成为美好,又将永生(原文是永远)安置在世人心里。”',
      explanation: '当然可以读——《传道书》可能是圣经里最为你写的一卷。它反复说“日光之下”,意思正是:不预设神、不预设来世,只诚实地看眼前这个世界。你完全可以作为一个怀疑者来读它,因为它本身就是从怀疑者的前提出发的。开始读圣经,不需要你先“信什么”,只需要你愿意诚实。',
      reflection: '如果暂时放下“信或不信”的结论,只问一句:你心里有没有一种“对永恒的隐约渴望”,是这个世界填不满的?',
      nextStep: '从《传道书》第 1 章读起,把它当作对工作、享乐、成功的普通观察来读,看它有没有说中你真实的经历。本站所有和信仰有关的内容都是自选的,清楚标注。',
      prayer: '(如果你还不确定神是否存在,不必勉强祷告。你可以只是诚实地说:)“如果你真的在,求你让我看见。”诚实的寻找,本身就是一个开始。'
    },
    en: {
      title: 'When You Are Not Sure You Believe',
      verse: '【Ecclesiastes 3:11】“He has made everything beautiful in its time. He has also set eternity in the human heart.” (NIV)',
      explanation: 'Yes, you can read it — Ecclesiastes may be the book in the Bible most written for you. Its recurring phrase “under the sun” means exactly this: life examined honestly, with no God and no afterlife assumed. You can read it as a skeptic, because it argues from the skeptic’s own premises. Reading the Bible does not require you to “believe” something first; it only asks for honesty.',
      reflection: 'Setting aside the conclusion of “believe or not” for a moment — is there a faint longing for something eternal in you that this world has not filled?',
      nextStep: 'Start with Ecclesiastes 1, reading it as plain observation about work, pleasure, and success — and notice whether it names something true about your life. Everything about faith here is opt-in and clearly labeled.',
      prayer: '(If you are not sure God is even there, you do not have to force a prayer. You can simply say, honestly:) “If You are real, help me see.” An honest search is itself a beginning.'
    }
  },

  {
    id: 'light', priority: 15,
    keywordsZh: ['黑暗','走在黑暗','迷失','迷路','没方向','找不到方向','人生方向','看不清','该往哪','道路'],
    keywordsEn: ['darkness','in the dark','lost','no direction','which way','the way','direction in life',"can't see",'cannot see','where do i go'],
    relatedBooks: ['john'],
    zh: {
      title: '当你在黑暗里找不到方向',
      verse: '【约翰福音 8:12】“我是世界的光。跟从我的,就不在黑暗里走,必要得着生命的光。”',
      explanation: '在黑暗里,人最需要的往往不是更多的信息,而是光——一个能让你看清脚下这一步的东西。耶稣没有说“我给你指个方向”,而是说“我就是道路”(约 14:6)。跟从光,不代表你一下子看清整条路;它代表你在走的这一步上,不再是自己一个人摸黑。',
      reflection: '此刻你最想“看清”的,是哪一件事、哪一个决定?',
      nextStep: '读《约翰福音》第 8 章和第 14 章;若你此刻正迷茫,不妨先只求认识那位光,而不必急着看清全程。',
      prayer: '主啊,我在黑暗里,看不清该往哪走。求你作我的光,照亮我脚下的下一步,让我不再独自摸索。阿们。'
    },
    en: {
      title: 'When You Are Lost in the Dark',
      verse: '【John 8:12】“I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life.” (NIV)',
      explanation: 'In the dark, what a person needs most is often not more information, but light — something that lets you see the one step in front of you. Jesus did not say “I will point you a direction”; he said “I am the way” (John 14:6). Following the light does not mean the whole road becomes clear at once; it means that in the step you are taking now, you are no longer feeling through the dark alone.',
      reflection: 'What is the one thing, or the one decision, you most want to “see clearly” right now?',
      nextStep: 'Read John 8 and John 14. If you feel lost right now, try seeking to know the Light first — you do not have to see the whole road at once.',
      prayer: 'Lord, I am in the dark and cannot see which way to go. Be my light, shine on the next step in front of me, and let me stop groping through this alone. Amen.'
    }
  },

  {
    id: 'guilt', priority: 16,
    keywordsZh: ['内疚','罪恶感','后悔','良心不安','我做错了','神会原谅我吗'],
    keywordsEn: ['guilt','i feel guilty','regret','will god forgive me','ashamed'],
    relatedBooks: ['john','psalms'],
    zh: {
      title: '当你被内疚缠住',
      verse: '【约翰一书 1:9】“我们若认自己的罪,神是信实的,是公义的,必要赦免我们的罪,洗净我们一切的不义。”',
      explanation: '内疚有两种:一种把你带向修复与赦免,一种只是把你按在过去反复羞辱。圣经里的认罪,不是没完没了地自责,而是把罪如实说出来,交给一位“信实又公义”的神——他赦免,不是因为你的罪不严重,而是因为他的怜悯足够大。诗篇51篇里,大卫犯了大错,也正是这样把罪摊开,求神洗净、重造。',
      reflection: '有没有一件事,你一直在心里判自己有罪,却从未把它如实地交给神,求赦免?',
      nextStep: '读约翰一书 1:9,再读诗篇51篇,看认罪之后神如何“造清洁的心”。',
      prayer: '神啊,我把这件一直压着我的事,如实交在你面前。谢谢你信实又公义,愿意赦免、洗净我。求你让我不再靠自责活着,而是靠你的怜悯。阿们。'
    },
    en: {
      title: 'When Guilt Won’t Let Go',
      verse: '【1 John 1:9】“If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.” (NIV)',
      explanation: 'There are two kinds of guilt: one leads you toward repair and forgiveness; the other just pins you to the past and shames you on repeat. Confession in the Bible is not endless self-blame — it is naming the wrong honestly and handing it to a God who is “faithful and just.” He forgives not because your sin was small, but because His mercy is large enough. In Psalm 51 David laid his grave failure open the same way, and asked to be washed and remade.',
      reflection: 'Is there something you keep sentencing yourself for, but have never honestly handed to God to ask for forgiveness?',
      nextStep: 'Read 1 John 1:9, then Psalm 51, and see how God “creates a clean heart” after confession.',
      prayer: 'God, I bring You honestly the thing that keeps weighing on me. Thank You that You are faithful and just, willing to forgive and cleanse. Help me stop living on self-blame, and live on Your mercy instead. Amen.'
    }
  },

  {
    id: 'forgiving', priority: 17,
    keywordsZh: ['无法原谅','怎么饶恕','恨一个人','被伤害了','放不下仇恨'],
    keywordsEn: ['how to forgive','cannot forgive','i hate someone','they hurt me'],
    relatedBooks: ['john'],
    zh: {
      title: '当你无法原谅',
      verse: '【马太福音 18:21-22】“主啊,我弟兄得罪我,我当饶恕他几次呢?到七次可以吗?耶稣说:我对你说,不是到七次,乃是到七十个七次。”',
      explanation: '饶恕不是说“你没有伤害我”,也不是假装伤口不存在。它是一个艰难的决定:不再让仇恨来定义你、绑架你。耶稣把饶恕说成“七十个七次”——不是算账,而是一种新的活法。这很难,尤其当对方从未道歉。但保留苦毒,常常最先毒害的是自己;神也说“伸冤在我”(罗12:19),意思是你可以把公义交给他,不必自己扛。',
      reflection: '你放不下的那份怨恨,如今最重地压在谁的身上——对方,还是你自己?',
      nextStep: '读马太福音 18 章那个不饶恕人的比喻,再读以弗所书 4:32,慢慢求神给你迈出一小步的力量。',
      prayer: '主啊,有一个伤口我一直放不下,也还没准备好原谅。我先把这份重担、这份想讨回公道的心,交在你手里。求你医治我,也在你的时间里,给我饶恕的力量。阿们。'
    },
    en: {
      title: 'When You Can’t Forgive',
      verse: '【Matthew 18:21-22】“Lord, how many times shall I forgive my brother or sister who sins against me? Up to seven times? Jesus answered, I tell you, not seven times, but seventy-seven times.” (NIV)',
      explanation: 'Forgiveness does not mean “you didn’t hurt me,” nor pretending the wound isn’t there. It is a hard decision: to stop letting hatred define and hijack you. Jesus frames it as “seventy-seven times” — not bookkeeping, but a whole new way to live. It is hard, especially when the other person never apologized. But holding bitterness usually poisons you first; and God says “It is mine to avenge” (Rom 12:19) — meaning you can hand the justice to Him and not carry it yourself.',
      reflection: 'The resentment you can’t put down — who does it weigh on most heavily now: the other person, or you?',
      nextStep: 'Read the parable of the unforgiving servant in Matthew 18, then Ephesians 4:32, and ask God slowly for strength to take one small step.',
      prayer: 'Lord, there is a wound I can’t put down, and I’m not ready to forgive. First I hand You this weight, and my craving to settle the score. Heal me, and in Your time, give me the strength to forgive. Amen.'
    }
  },

  {
    id: 'grief', priority: 18,
    keywordsZh: ['失去亲人','失去了亲人','亲人去世','走不出来','太想念','哀伤'],
    keywordsEn: ['lost a loved one','grieving','someone died','miss them so much'],
    relatedBooks: ['john','psalms','revelation'],
    zh: {
      title: '当你失去了所爱的人',
      verse: '【马太福音 5:4】“哀恸的人有福了,因为他们必得安慰。”',
      explanation: '哀伤不是软弱,也不是不属灵。耶稣没有说“别哭”,他自己就在朋友拉撒路的坟前哭了(约11:35)——神完全明白失去是什么滋味。哀恸的人“有福”,不是因为悲伤本身是好的,而是因为神应许亲自安慰,并且有一天要“擦去他们一切的眼泪”(启21:4)。你不需要赶快好起来,也不需要假装坚强,才可以来到他面前。',
      reflection: '如果你能对神说出这份思念里最真实的一句话,你会说什么?',
      nextStep: '读诗篇34篇,那里说“神靠近伤心的人”;若你愿意,也读约翰福音11章,看耶稣如何面对死亡与眼泪。',
      prayer: '主啊,我失去了我所爱的,心里空了一块。谢谢你没有要求我快点好起来。求你亲自靠近我的伤心,在我流泪的时候与我同在,也让我抓住有一天你要擦去一切眼泪的应许。阿们。'
    },
    en: {
      title: 'When You Have Lost Someone You Love',
      verse: '【Matthew 5:4】“Blessed are those who mourn, for they will be comforted.” (NIV)',
      explanation: 'Grief is not weakness, nor unspiritual. Jesus did not say “don’t cry” — He Himself wept at the tomb of His friend Lazarus (John 11:35). God fully knows what loss feels like. Those who mourn are “blessed” not because sorrow itself is good, but because God promises to comfort them Himself, and one day to “wipe every tear from their eyes” (Rev 21:4). You do not have to get better quickly, or pretend to be strong, to come to Him.',
      reflection: 'If you could say the truest sentence inside this missing-them to God, what would it be?',
      nextStep: 'Read Psalm 34, where “the Lord is close to the brokenhearted”; and if you’re willing, John 11, to see how Jesus faces death and tears.',
      prayer: 'Lord, I have lost someone I love, and there is an empty place in me. Thank You that You do not ask me to hurry up and heal. Draw close to my grief, be with me as I weep, and let me hold the promise that one day You will wipe away every tear. Amen.'
    }
  },

  {
    id: 'burnout', priority: 19,
    keywordsZh: ['太累了','工作压力','疲惫不堪','撑得好辛苦','喘不过气'],
    keywordsEn: ['burned out','exhausted','work stress','so tired'],
    relatedBooks: ['ecclesiastes','psalms'],
    zh: {
      title: '当你累到快撑不住',
      verse: '【马太福音 11:28-30】“凡劳苦担重担的人,可以到我这里来,我就使你们得安息……因为我的轭是容易的,我的担子是轻省的。”',
      explanation: '累,不只是身体的事。长期扛着超过自己能承受的重担,人会被掏空。传道书早就说过:日光之下的劳碌,若没有安息,只是捕风。耶稣的邀请不是“再加把劲”,而是“到我这里来”——把重担卸下,换上他“容易的轭”。真正的休息,不只是睡一觉,而是把那份“全靠我撑”的重压,交回给托住万有的神。',
      reflection: '你现在扛着的重担里,有哪一部分其实不是你该独自扛的?',
      nextStep: '读马太福音 11:28-30,也可以读传道书 2 章,看清“劳碌若没有神,终归捕风”;累的时候,也可以到“聆听”页,让经文读给你听。',
      prayer: '主啊,我太累了,感觉快撑不住。谢谢你没有叫我更努力,而是叫我到你这里来得安息。我把这压得我喘不过气的担子交给你,求你让我重新得力。阿们。'
    },
    en: {
      title: 'When You’re Worn Down to Empty',
      verse: '【Matthew 11:28-30】“Come to me, all you who are weary and burdened, and I will give you rest… For my yoke is easy and my burden is light.” (NIV)',
      explanation: 'Exhaustion is not only physical. Carrying a weight beyond what you can bear, for too long, hollows a person out. Ecclesiastes said it long ago: toil under the sun, without rest, is chasing the wind. Jesus’ invitation is not “try harder,” but “come to me” — lay the load down and take His “easy yoke.” Real rest is not just a night’s sleep; it is handing the crushing “it all depends on me” back to the God who holds all things together.',
      reflection: 'In the load you’re carrying now, which part was never actually yours to carry alone?',
      nextStep: 'Read Matthew 11:28-30, and Ecclesiastes 2 to see that toil without God ends in chasing the wind; when you’re tired, you can also open the Listen page and let Scripture be read to you.',
      prayer: 'Lord, I am so worn down I can barely carry this. Thank You that You do not tell me to try harder, but to come to You for rest. I hand You the load that has left me breathless — please renew my strength. Amen.'
    }
  },

  {
    id: 'envy', priority: 20,
    keywordsZh: ['嫉妒','比不上别人','凭什么是他','心里不平衡','攀比'],
    keywordsEn: ['jealous','envy','comparing myself','why them not me'],
    relatedBooks: ['ecclesiastes','psalms'],
    zh: {
      title: '当你嫉妒、心里不平',
      verse: '【诗篇 73:25-26】“除你以外,在天上我有谁呢?除你以外,在地上我也没有所爱慕的……但神是我心里的力量,又是我的福分,直到永远。”',
      explanation: '嫉妒常常从一个问题开始:“凭什么是他,不是我?”诗篇73篇的作者也这样,看见恶人享福,几乎站不住。转机发生在他“进了神的圣所”,重新看见结局与永恒——攀比就松开了。嫉妒让你一直盯着别人手里有什么;这节经文邀请你先回到“神是我的福分”,从那里重新衡量自己真正拥有的。',
      reflection: '你最近一次的攀比,如果诚实说,你真正羡慕的,是那样东西,还是它背后你以为会有的安全感或价值感?',
      nextStep: '读诗篇73篇全篇,看作者如何从“心怀不平”走到“神是我的福分”;也可以读传道书,看“人靠比较得来的,终归捕风”。',
      prayer: '神啊,我承认我心里在嫉妒、不平。求你帮助我把眼光从别人手里,转回到你身上;让我真的相信,有你,就已经是我最大的福分。阿们。'
    },
    en: {
      title: 'When Envy Leaves You Bitter',
      verse: '【Psalm 73:25-26】“Whom have I in heaven but you? And earth has nothing I desire besides you… God is the strength of my heart and my portion forever.” (NIV)',
      explanation: 'Envy often begins with a question: “Why them, and not me?” The writer of Psalm 73 felt it too — he saw the wicked thrive and nearly lost his footing. The turn came when he “entered the sanctuary of God” and saw the end and eternity again; the comparison loosened. Envy keeps your eyes fixed on what’s in someone else’s hands; this verse invites you back to “God is my portion,” and to re-measure what you truly have from there.',
      reflection: 'Your latest comparison — honestly, is it the thing itself you envy, or the security or worth you imagine it would give you?',
      nextStep: 'Read all of Psalm 73 and watch the writer move from bitterness to “God is my portion”; and read Ecclesiastes on how what we gain by comparison ends in chasing the wind.',
      prayer: 'God, I admit the envy and unrest in my heart. Help me turn my eyes from other people’s hands back to You; and help me truly believe that having You is already my greatest portion. Amen.'
    }
  },

  {
    id: 'belonging', priority: 21,
    keywordsZh: ['漂泊','没有归属感','异乡','不属于这里','想家','移民的孤独'],
    keywordsEn: ['do not belong','homesick','foreigner','far from home','immigrant'],
    relatedBooks: ['john','psalms'],
    zh: {
      title: '当你觉得无处归属',
      verse: '【诗篇 139:9-10】“我若展开清晨的翅膀,飞到海极居住,就是在那里,你的手必引导我;你的右手也必扶持我。”',
      explanation: '漂泊、想家、在异乡觉得“我不属于这里”——这种没有归属的感觉,很深也很真实。圣经里许多人也是寄居的、客旅(来11:13),他们“羡慕一个更美的家乡”。诗篇139篇给出的安慰是:无论你飞到多远、身在何方,神的手一直在那里引导、扶持你。你或许在地上没有一处完全属于的地方;但有一位神,无论你在哪里,他都与你同在——而信的人真正的家乡,是在他那里。',
      reflection: '在你漂泊或想家的感觉里,你最深渴望的“归属”,是一个地方,还是被谁完全接纳、看见?',
      nextStep: '读诗篇139篇,看神如何无处不在地与你同在;若你愿意,读腓立比书 3:20,看信的人真正的“国籍”在哪里。',
      prayer: '神啊,我常常觉得漂泊、无处归属。谢谢你应许,无论我在多远的地方,你的手都在引导我、扶持我。求你作我漂泊中的家,让我在你里面找到真正的归属。阿们。'
    },
    en: {
      title: 'When You Feel You Don’t Belong',
      verse: '【Psalm 139:9-10】“If I rise on the wings of the dawn, if I settle on the far side of the sea, even there your hand will guide me, your right hand will hold me fast.” (NIV)',
      explanation: 'Drifting, homesick, feeling “I don’t belong here” in a foreign place — that ache of not belonging is deep and real. Many people in the Bible were sojourners and strangers too (Heb 11:13), “longing for a better country.” Psalm 139 offers this comfort: however far you fly, wherever you are, God’s hand is already there to guide and hold you. You may have no place on earth that fully belongs to you; but there is a God who is with you wherever you are — and the believer’s true home is in Him.',
      reflection: 'In your drifting or homesickness, the “belonging” you long for most — is it a place, or to be fully accepted and seen by someone?',
      nextStep: 'Read Psalm 139 and see how God is with you everywhere; and if you’re willing, Philippians 3:20, on where the believer’s true “citizenship” is.',
      prayer: 'God, I so often feel adrift, like I belong nowhere. Thank You for promising that however far I go, Your hand still guides and holds me. Be my home in my wandering, and let me find true belonging in You. Amen.'
    }
  }
];

/* ---- crisis keywords (checked FIRST, before any topic matching) ---- */
const CRISIS_ZH = ['想死','自杀','不想活','不想活了','伤害自己','被打','家暴','被侵犯','轻生','活不下去','想结束生命','没人救我','结束生命','结束自己','撑不住了','不想醒来'];
const CRISIS_EN = ['suicide','kill myself','killing myself','want to die','self harm','self-harm','abuse','domestic violence','assault',
  'end my life','hurt myself','no reason to live','cannot go on','cant go on',"can't go on",'want to disappear'];

/* Crisis card — NEVER gets verse variants; stays byte-for-byte stable. */
const CRISIS_CARD = {
  zh: {
    id: 'crisis',
    title: '请立刻寻求帮助',
    verse: '【诗篇 34:18】“耶和华靠近伤心的人,拯救灵性痛悔的人。”',
    explanation: '你现在经历的痛苦非常重要,不应该一个人承担。圣经告诉我们,神靠近伤心的人;同时,也请你立刻联系可信任的家人、朋友、牧师、辅导员,或当地紧急服务。这比任何一节经文都更紧要。',
    reflection: '现在,你可以立刻联系一个可信任的人吗?',
    nextStep: '如果你正处在危险中,请立即联系当地紧急服务。如果你在美国,可以拨打或发短信 988(自杀与危机生命热线,全天候、免费、保密),或发送 HOME 到 741741;若有即时危险请拨 911。',
    prayer: '主啊,求你保护这个正在痛苦中的人,赐下及时的帮助、保护和陪伴。阿们。'
  },
  en: {
    id: 'crisis',
    title: 'Please Seek Help Immediately',
    verse: '【Psalm 34:18】“The Lord is close to the brokenhearted and saves those who are crushed in spirit.” (NIV)',
    explanation: 'What you are going through matters deeply, and you should not carry it alone. Scripture tells us that God is near to the brokenhearted. Please also contact a trusted family member, friend, pastor, counselor, or local emergency service immediately — this matters more than any single verse.',
    reflection: 'Can you reach out to a trusted person right now?',
    nextStep: 'If you are in immediate danger, contact local emergency services. In the United States, call or text 988 (Suicide & Crisis Lifeline, 24/7, free, confidential), or text HOME to 741741; if you are in immediate danger, call 911.',
    prayer: 'Lord, please protect this person in pain and surround them with timely help, safety, and care. Amen.'
  }
};
export function getCrisisResponse(lang) { return { ...CRISIS_CARD[lang === 'en' ? 'en' : 'zh'] }; }

export function detectCrisis(input, lang) {
  const lc = (input || '').toLowerCase();
  const hit = CRISIS_ZH.some((kw) => lc.includes(kw)) || CRISIS_EN.some((kw) => lc.includes(kw));
  if (!hit) return null;
  return getCrisisResponse(lang);
}

/* Warm, Scripture-centered fallback — shown ONLY when nothing else matches.
   Never reads like a database/FAQ error. An unmatched question is treated as
   a real question worth bringing to God (Matthew 11:28). */
export function getFallbackResponse(lang) {
  const fallback = {
    zh: {
      id: 'fallback',
      title: '把真实的问题带到神面前',
      verse: '【马太福音 11:28】“凡劳苦担重担的人,可以到我这里来,我就使你们得安息。”',
      explanation: '谢谢你把这个问题带到这里。圣经很看重人内心真实的惧怕、不安、孤单、挣扎和寻找。耶稣没有要求人先把自己整理好才来到祂面前,祂邀请劳苦担重担的人到祂这里来。你现在的问题,也可以成为你开始靠近神的地方。',
      reflection: '如果你可以诚实地把心里最重的一句话告诉神,那会是什么?',
      nextStep: '你可以先安静读《马太福音》11:28,也可以继续阅读《约翰福音》第 1 章,认识那位愿意进入人黑暗与重担中的耶稣。',
      prayer: '主耶稣,我带着真实的问题来到你面前。求你在我的重担中赐下安息,在我的不明白中赐下光,在我的寻找中带领我更认识你。阿们。'
    },
    en: {
      id: 'fallback',
      title: 'Bring Your Real Question Before God',
      verse: '【Matthew 11:28】“Come to me, all you who are weary and burdened, and I will give you rest.” (NIV)',
      explanation: 'Thank you for bringing this question here. Scripture takes seriously the real fears, burdens, loneliness, struggles, and searching of the human heart. Jesus does not ask people to fix themselves before coming to Him. He invites the weary and burdened to come. Your question may become the very place where you begin drawing near to God.',
      reflection: 'If you could honestly bring one sentence from your heart to God, what would it be?',
      nextStep: 'You may sit quietly with Matthew 11:28, and then continue with John chapter 1 to encounter Jesus, who enters our darkness and carries our burdens.',
      prayer: 'Lord Jesus, I bring my real question before You. Give me rest in my burden, light in my confusion, and lead me to know You more deeply. Amen.'
    }
  };
  return fallback[lang === 'en' ? 'en' : 'zh'];
}

/* ---- verse-variant rotation ------------------------------------------------
   Each topic MAY carry an optional `variants: [{ verse:{zh,en}, nextStep?:{zh,en} }]`.
   The pool of verses is [ primary verse (index 0), ...variants (1..n) ]. A
   module-level per-topic counter advances the index on each fresh match (0→1→2→0,
   deterministic — no randomness), so repeated identical questions rotate their
   cited verse while every other field stays the same. Topics with no `variants`
   behave exactly as before (fully backward-compatible). */
const _variantCounter = {};
function nextVariantIndex(item) {
  const pool = 1 + ((item.variants && item.variants.length) || 0);
  const i = (_variantCounter[item.id] || 0) % pool;
  _variantCounter[item.id] = i + 1;
  return i;
}

/* Build a topic response in `lang` at a specific variant index WITHOUT advancing
   the counter (used for language re-render so a language toggle keeps the same
   verse). variantIndex 0 = primary verse; 1..n = item.variants[0..n-1]. */
export function resolveById(id, lang, variantIndex = 0) {
  const L = lang === 'en' ? 'en' : 'zh';
  const item = qaRegistry.find((t) => t.id === id);
  if (!item) return getFallbackResponse(L);
  const resp = { id: item.id, relatedBooks: item.relatedBooks, ...item[L], variantIndex };
  const v = (item.variants && variantIndex > 0) ? item.variants[variantIndex - 1] : null;
  if (v) {
    if (v.verse && v.verse[L]) resp.verse = v.verse[L];
    if (v.nextStep && v.nextStep[L]) resp.nextStep = v.nextStep[L];
  }
  return resp;
}

/* Main entry.
   (1) crisis first. (2) LONGEST matched keyword wins across all topics; a tie
   on matched-keyword length is broken by the topic's unique `priority` (lower
   wins) — deterministic, never array-order dependent. Both keyword lists are
   matched regardless of UI language (a zh user may type an English word).
   (3) on a topic match, the cited verse rotates through the topic's variants. */
export function getBiblicalResponse(userInput, currentLanguage = 'zh') {
  const input = (userInput || '').trim().toLowerCase();
  const lang = currentLanguage === 'en' ? 'en' : 'zh';

  if (!input) return getFallbackResponse(lang);

  const crisisResponse = detectCrisis(input, lang);
  if (crisisResponse) return crisisResponse;

  let best = null, bestLen = 0, bestPriority = Infinity;
  for (const item of qaRegistry) {
    const keywords = item.keywordsZh.concat(item.keywordsEn);
    let longest = 0;
    for (const kw of keywords) {
      const k = kw.toLowerCase();
      if (k.length > longest && input.includes(k)) longest = k.length;
    }
    if (longest === 0) continue;
    if (longest > bestLen || (longest === bestLen && item.priority < bestPriority)) {
      best = item; bestLen = longest; bestPriority = item.priority;
    }
  }
  if (best) return resolveById(best.id, lang, nextVariantIndex(best));
  return getFallbackResponse(lang);
}
