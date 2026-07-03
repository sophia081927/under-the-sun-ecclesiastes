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
    relatedBooks: ['john'],
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
    relatedBooks: ['john'],
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
    relatedBooks: ['ecclesiastes'],
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
    keywordsZh: ['真的有什么','真的有神吗','神存在吗','什么是真理','真理是什么','真的有永恒吗','真的有天堂吗','真实存在','人死后'],
    keywordsEn: ['is god real','does god exist','what is truth','is there a god','is there anything beyond this life','is heaven real','after death'],
    relatedBooks: ['john'],
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
    relatedBooks: ['john'],
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
    relatedBooks: ['john','ecclesiastes'],
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
    keywordsZh: ['死','死亡','离世','去世','过世','怕死','死后','人都会死','活着有什么意义','没了'],
    keywordsEn: ['death','die','dying','mortal','pass away','passed away','afraid to die','everyone dies','what happens when we die'],
    relatedBooks: ['ecclesiastes','john'],
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
  }
];

/* ---- crisis keywords (checked FIRST, before any topic matching) ---- */
const CRISIS_ZH = ['想死','自杀','不想活','不想活了','伤害自己','被打','家暴','被侵犯','轻生','活不下去','想结束生命','没人救我','结束生命','结束自己','撑不住了','不想醒来'];
const CRISIS_EN = ['suicide','kill myself','killing myself','want to die','self harm','self-harm','abuse','domestic violence','assault',
  'end my life','hurt myself','no reason to live','cannot go on','cant go on',"can't go on",'want to disappear'];

export function detectCrisis(input, lang) {
  const lc = (input || '').toLowerCase();
  const hit = CRISIS_ZH.some((kw) => lc.includes(kw)) || CRISIS_EN.some((kw) => lc.includes(kw));
  if (!hit) return null;

  const crisis = {
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
  return crisis[lang === 'en' ? 'en' : 'zh'];
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

/* Main entry.
   (1) crisis first. (2) LONGEST matched keyword wins across all topics; a tie
   on matched-keyword length is broken by the topic's unique `priority` (lower
   wins) — deterministic, never array-order dependent. Both keyword lists are
   matched regardless of UI language (a zh user may type an English word). */
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
  if (best) return { id: best.id, relatedBooks: best.relatedBooks, ...best[lang] };
  return getFallbackResponse(lang);
}
