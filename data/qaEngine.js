/* ============================================================
   qaEngine.js — Universal Scripture Answer Engine
   ------------------------------------------------------------
   Lightweight, local, no-API keyword→Scripture matching for the
   Bible Library. Bilingual (zh / en). Crisis detection runs FIRST.

   Public API:
     qaRegistry                       — array of topics (ordered by priority)
     getBiblicalResponse(input, lang) — main entry; returns a response object
     getFallbackResponse(lang)        — gentle "into the light" fallback
     detectCrisis(input, lang)        — returns crisis response or null

   A response object has:
     { id, title, verse, explanation, reflection, nextStep, prayer,
       relatedBooks? }

   Content is Scripture-centered and drawn only from Ecclesiastes & John
   (plus Psalm 34:18 for the crisis card). We never invent a verse.
   ============================================================ */

export const qaRegistry = [
  {
    id: 'emptiness', priority: 1,
    keywordsZh: ['空虚','虚空','没意义','没有意义','毫无意义','无聊','不满足','人生意义','活着的意义','捕风','空洞','迷茫'],
    keywordsEn: ['empty','emptiness','meaningless','meaning of life','no meaning','pointless','vanity','not satisfied','unsatisfied','chasing the wind','purpose'],
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
      verse: '【Ecclesiastes 1:14】“I have seen all the things that are done under the sun; all of them are meaningless, a chasing after the wind.”',
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
      verse: '【John 14:27】“Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.”',
      explanation: 'The peace of the world often depends on circumstances: money, grades, relationships, health, and a controllable future. But the peace Jesus gives is deeper. It is rooted in His presence and His authority over tomorrow. He did not say “don’t worry, it’s nothing,” but “in this world you will have trouble. But take heart! I have overcome the world” (John 16:33).',
      reflection: 'What is the biggest worry weighing on your heart today? Are you willing to bring it to Jesus in prayer?',
      nextStep: 'You may read John chapter 14 slowly and reflect on the peace Jesus promises. You can also open the Listen page and let these words be read gently to you.',
      prayer: 'Lord Jesus, my heart feels anxious and heavy. Please give me Your peace and help me entrust my tomorrow into Your hands. Amen.'
    }
  },

  {
    id: 'godlove', priority: 3,
    keywordsZh: ['神爱我','神爱','神真的爱','神在乎','神在意','被爱','没有人爱','值得被爱','神还爱我吗','爱我吗','配不配'],
    keywordsEn: ['god love','does god love','god really love','loved by god','god care','am i loved','no one loves','worth loving','unlovable','god still love'],
    relatedBooks: ['john'],
    zh: {
      title: '当你怀疑神是否爱你',
      verse: '【约翰福音 15:9】“我爱你们,正如父爱我一样;你们要常在我的爱里。”',
      explanation: '圣经回答“神真的爱我吗”的方式,不是一句空洞的保证,而是一个付出代价的动作:神舍下他的独生子(约 3:16)。而且请注意,这份爱临到的是“世人”——不是“够好的人”“表现好的人”,里面就有此刻正在问这个问题的你。你不需要先变得可爱,才配得这份爱。',
      reflection: '你是否常常觉得,要先变好、先做到某些事,才配得被神爱?',
      nextStep: '从《约翰福音》第 3 章读起,再读第 15 章;你会看到这份爱不是遥远的概念,而是耶稣亲自走进人的处境。',
      prayer: '神啊,我常常怀疑自己是否值得被爱。求你让我真的知道——不只是在道理上,而是在心里——你爱我,爱到舍下你的儿子。求你帮助我住在你的爱里。阿们。'
    },
    en: {
      title: 'When You Doubt God Loves You',
      verse: '【John 15:9】“As the Father has loved me, so have I loved you. Now remain in my love.”',
      explanation: 'The Bible answers “does God really love me?” not with an empty reassurance but with a costly action: God gave His one and only Son (John 3:16). And notice the word — “the world.” Not “the good enough,” but the world, which includes you, right now, asking this question. You do not have to become lovable first in order to be loved.',
      reflection: 'Do you often feel you must first become better, or do certain things, before you can be loved by God?',
      nextStep: 'Begin with John chapter 3, then read John 15. You will see this love is not a distant idea, but Jesus stepping personally into the human situation.',
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
      verse: '【John 3:16】“For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.”',
      explanation: 'The Gospel of John shows that God is not distant or indifferent. Through Jesus Christ, God entered our world to bring life, light, forgiveness, and eternal hope. Knowing Jesus does not begin with passing a test — it begins with looking, at who this person is. You do not need to resolve every doubt before you begin.',
      reflection: 'If Jesus truly is the light and life from God, where would you like to begin knowing Him?',
      nextStep: 'You may begin with John chapter 1 and discover who Jesus is. The Library also has a John study guide that walks you through it.',
      prayer: 'Lord Jesus, if You are truly the light of life, help me know You and draw near to God step by step. Amen.'
    }
  },

  {
    id: 'success', priority: 5,
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
      verse: '【Ecclesiastes 2:11】“Yet when I surveyed all that my hands had done and what I had toiled to achieve, everything was meaningless, a chasing after the wind; nothing was gained under the sun.”',
      explanation: 'The man who wrote these words worked harder and achieved more than you or I — he got all of it, and found that “a little more” never lands. The problem was never that you tried too little. Achievement, by its nature, cannot be kept; it was never built to carry the full weight you rest on it. You are not a failure — you have reached the ceiling every success shares “under the sun.”',
      reflection: 'Have you been waiting for some achievement, believing that “once I get there” you will finally feel satisfied? Did that moment ever truly arrive?',
      nextStep: 'Read Ecclesiastes 2 and watch the author walk the road you are on. If you want to go a step further, pause on John 4: “Whoever drinks the water I give them will never thirst.”',
      prayer: 'Lord, I have worked so long and still feel unsatisfied. Help me see that what I truly thirst for is not more achievement, but You. Amen.'
    }
  },

  {
    id: 'marriage', priority: 6,
    keywordsZh: ['婚姻','夫妻','老公','老婆','丈夫','妻子','感情','离婚','吵架','孤单','孤独','没人懂','相处','家庭'],
    keywordsEn: ['marriage','married','spouse','husband','wife','relationship','divorce','lonely','loneliness','alone','no one understands','family'],
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
      verse: '【Ecclesiastes 4:9-10】“Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up. But pity anyone who falls and has no one to help them up.”',
      explanation: 'Ecclesiastes speaks of “two being better than one,” but never a fairy-tale marriage — it describes real companionship, where people fall and need to be lifted. Pain in a relationship often hurts so much precisely because we were made for deep connection. Scripture offers no simple “just do this” formula, but it honors that your pain is real, and points to a God willing to enter your burden with you.',
      reflection: 'In this relationship, what is the part of you that most longs to be understood, and lifted back up?',
      nextStep: 'This kind of pain usually also needs real people alongside you — a pastor, counselor, or mature spiritual friend. If you are willing, bring the weight to God in prayer first, then take a step toward seeking help.',
      prayer: 'God, my relationship is a place of real pain. Step into it Yourself, heal what is broken, and give me the wisdom and grace to know the next step to take. Amen.'
    }
  },

  {
    id: 'suffering', priority: 7,
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
      verse: '【John 16:33】“I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.”',
      explanation: 'Scripture never makes light of your pain. Ecclesiastes says there is “a time to mourn” (Ecc 3:4) — it does not rush you to feel better. And Jesus did not go around suffering: he wept, he was abandoned, he died. To those in pain he does not say “it’s nothing,” but names the truth first, then adds: “I have overcome the world.” You do not have to pretend to be strong to come to him.',
      reflection: 'If you could say one completely honest thing to God, with nothing hidden, what would you most want to say right now?',
      nextStep: 'Read John 11 and watch Jesus weep at the grave of his friend — he knows what loss is. (A Job module is planned for the Library, for suffering and unexplained pain.)',
      prayer: 'Lord, I am in pain, sometimes with no words for it. Thank You that You do not ask me to be strong first. Be with me in my suffering, and let me know I am not carrying this alone. Amen.'
    }
  },

  {
    id: 'death', priority: 8,
    keywordsZh: ['死','死亡','离世','去世','过世','怕死','死后','人都会死','活着有什么意义','没了'],
    keywordsEn: ['death','die','dying','mortal','pass away','passed away','afraid to die','after death','everyone dies','what happens when we die'],
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
      verse: '【John 11:25】“Jesus said to her, ‘I am the resurrection and the life. The one who believes in me will live, even though they die.’”',
      explanation: 'Ecclesiastes is honest to the point of chill: “under the sun,” death levels everyone, and it does not soften that wall. Yet it leaves a crack — “the spirit returns to God who gave it” (Ecc 12:7). And John answers from the other side: Jesus does not say he has a teaching about resurrection — he says, “I am the resurrection.” In the face of death, what he offers is not an explanation, but himself.',
      reflection: 'When you think about death, what exactly is your deepest fear or question?',
      nextStep: 'Read Ecclesiastes 12 first and let it bring you honestly to the wall; then read John 11 and see how Jesus stands before death and the grave.',
      prayer: 'God, death frightens and unsettles me. Help me know the Jesus who said, “I am the resurrection,” so that in my mortal days I may hold on to a hope that does not perish. Amen.'
    }
  },

  {
    id: 'satisfaction', priority: 9,
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
      verse: '【John 4:14】“Whoever drinks the water I give them will never thirst. Indeed, the water I give them will become in them a spring of water welling up to eternal life.”',
      explanation: 'Ecclesiastes diagnoses the loop of “thirsty again” — you chase something, get it, and soon you are empty once more. John responds: the problem is not that you drank too little, but which water you drank. Jesus says the water he gives becomes “a spring” inside you — not something you keep scooping from outside, but something welling up from within. Real satisfaction is not getting more; it is being connected to the Source.',
      reflection: 'Is there something you got, only to feel thirsty again soon after? What might that repeated thirst be pointing to?',
      nextStep: 'Read the well-side conversation in John 4, then John 6. You will watch Jesus turn people, again and again, from “just a little more” toward “come to me.”',
      prayer: 'Lord Jesus, I have chased so many things to satisfy myself, and keep running dry. Give me the “living water” You spoke of, and let it become a spring welling up within me. Amen.'
    }
  },

  {
    id: 'seeker', priority: 10,
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
      verse: '【Ecclesiastes 3:11】“He has made everything beautiful in its time. He has also set eternity in the human heart.”',
      explanation: 'Yes, you can read it — Ecclesiastes may be the book in the Bible most written for you. Its recurring phrase “under the sun” means exactly this: life examined honestly, with no God and no afterlife assumed. You can read it as a skeptic, because it argues from the skeptic’s own premises. Reading the Bible does not require you to “believe” something first; it only asks for honesty.',
      reflection: 'Setting aside the conclusion of “believe or not” for a moment — is there a faint longing for something eternal in you that this world has not filled?',
      nextStep: 'Start with Ecclesiastes 1, reading it as plain observation about work, pleasure, and success — and notice whether it names something true about your life. Everything about faith here is opt-in and clearly labeled.',
      prayer: '(If you are not sure God is even there, you do not have to force a prayer. You can simply say, honestly:) “If You are real, help me see.” An honest search is itself a beginning.'
    }
  },

  {
    id: 'light', priority: 11,
    keywordsZh: ['黑暗','走在黑暗','迷失','迷路','没方向','找不到方向','人生方向','看不清','该往哪','道路','真理'],
    keywordsEn: ['darkness','in the dark','lost','no direction','which way','the way','direction in life',"can't see",'cannot see','where do i go','truth'],
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
      verse: '【John 8:12】“I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life.”',
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
      verse: '【Psalm 34:18】“The Lord is close to the brokenhearted and saves those who are crushed in spirit.”',
      explanation: 'What you are going through matters deeply, and you should not carry it alone. Scripture tells us that God is near to the brokenhearted. Please also contact a trusted family member, friend, pastor, counselor, or local emergency service immediately — this matters more than any single verse.',
      reflection: 'Can you reach out to a trusted person right now?',
      nextStep: 'If you are in immediate danger, contact local emergency services. In the United States, call or text 988 (Suicide & Crisis Lifeline, 24/7, free, confidential), or text HOME to 741741; if you are in immediate danger, call 911.',
      prayer: 'Lord, please protect this person in pain and surround them with timely help, safety, and care. Amen.'
    }
  };
  return crisis[lang === 'en' ? 'en' : 'zh'];
}

export function getFallbackResponse(lang) {
  const fallback = {
    zh: {
      id: 'fallback',
      title: '把问题带到光中',
      verse: '【约翰福音 1:5】“光照在黑暗里,黑暗却不接受光。”',
      explanation: '你提出的问题可能超出了目前这个本地问答库的范围,但圣经的核心应许仍然真实:主耶稣是照进黑暗的真光。你生命中的迷茫、痛苦和疑问,祂都看见。你可以换一种说法再问一次(例如“我很空虚”“神真的爱我吗”“我很焦虑”)。',
      reflection: '你愿意把这个问题继续带到神面前,求祂一步一步光照你吗?',
      nextStep: '你可以先阅读《约翰福音》第 1 章,或继续浏览《传道书》中关于人生意义的内容。',
      prayer: '主耶稣,求你用你的光照进我的问题和困惑中,带领我认识真理和生命。阿们。'
    },
    en: {
      id: 'fallback',
      title: 'Bring Your Question Into the Light',
      verse: '【John 1:5】“The light shines in the darkness, and the darkness has not overcome it.”',
      explanation: 'Your question may be beyond this first, local response database, but the central promise of Scripture remains true: Jesus is the true light who shines into darkness. He sees your confusion, pain, and questions. You might try rephrasing (for example, “I feel empty,” “does God really love me,” “I feel anxious”).',
      reflection: 'Are you willing to bring this question before God and ask Him to guide you step by step?',
      nextStep: 'You may begin with John chapter 1, or continue exploring Ecclesiastes on the meaning of life.',
      prayer: 'Lord Jesus, shine Your light into my questions and confusion. Lead me toward truth and life. Amen.'
    }
  };
  return fallback[lang === 'en' ? 'en' : 'zh'];
}

/* Main entry. Crisis check runs first, then priority-ordered keyword match.
   For robustness we match BOTH language keyword sets regardless of UI language
   (a Chinese user may type an English word and vice versa). */
export function getBiblicalResponse(userInput, currentLanguage = 'zh') {
  const input = (userInput || '').trim().toLowerCase();
  const lang = currentLanguage === 'en' ? 'en' : 'zh';

  if (!input) return getFallbackResponse(lang);

  const crisisResponse = detectCrisis(input, lang);
  if (crisisResponse) return crisisResponse;

  const sorted = [...qaRegistry].sort((a, b) => a.priority - b.priority);
  for (const item of sorted) {
    const keywords = item.keywordsZh.concat(item.keywordsEn);
    if (keywords.some((kw) => input.includes(kw.toLowerCase()))) {
      return { id: item.id, relatedBooks: item.relatedBooks, ...item[lang] };
    }
  }
  return getFallbackResponse(lang);
}
