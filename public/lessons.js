// 말하기 연습용 문장. 수준마다 주제와 문장이 달라요.
// 각 문장은 [영어, 한국어 뜻, 도움말]이고, 도움말은 왕초보는 한글 발음, 초급은 문장 패턴, 중급은 표현 팁이에요.
export const LESSONS = {
  beginner: [
    {
      id: "b-hello", icon: "🙂", title: "인사 한마디",
      items: [
        ["Hello!", "안녕하세요!", "헬로우"],
        ["Good morning.", "좋은 아침이에요.", "굿 모닝"],
        ["Thank you.", "고마워요.", "땡큐"],
        ["I'm sorry.", "미안해요.", "아임 쏘리"],
        ["Nice to meet you.", "만나서 반가워요.", "나이스 투 밋 유"],
        ["See you later.", "나중에 봐요.", "씨 유 레이러"],
      ],
    },
    {
      id: "b-me", icon: "🙋", title: "나를 소개해요",
      items: [
        ["I'm Minji.", "저는 민지예요.", "아임 민지"],
        ["I'm from Korea.", "한국에서 왔어요.", "아임 프럼 코리아"],
        ["I'm a student.", "저는 학생이에요.", "아임 어 스튜던트"],
        ["I live in Seoul.", "서울에 살아요.", "아이 리브 인 서울"],
        ["I like coffee.", "커피를 좋아해요.", "아이 라익 커피"],
        ["I'm happy.", "기분이 좋아요.", "아임 해피"],
      ],
    },
    {
      id: "b-answer", icon: "👍", title: "짧게 대답하기",
      items: [
        ["Yes, please.", "네, 그렇게 해 주세요.", "예스, 플리즈"],
        ["No, thank you.", "아니요, 괜찮아요.", "노, 땡큐"],
        ["I'm okay.", "저는 괜찮아요.", "아임 오케이"],
        ["Me too.", "저도요.", "미 투"],
        ["I don't know.", "잘 모르겠어요.", "아이 돈 노우"],
        ["One more time, please.", "한 번 더 말해 주세요.", "원 모어 타임, 플리즈"],
      ],
    },
    {
      id: "b-please", icon: "🍔", title: "이거 주세요",
      items: [
        ["Water, please.", "물 주세요.", "워러, 플리즈"],
        ["Coffee, please.", "커피 주세요.", "커피, 플리즈"],
        ["This one, please.", "이걸로 주세요.", "디스 원, 플리즈"],
        ["Two, please.", "두 개 주세요.", "투, 플리즈"],
        ["How much?", "얼마예요?", "하우 머치"],
        ["Check, please.", "계산할게요.", "첵, 플리즈"],
      ],
    },
    {
      id: "b-help", icon: "🆘", title: "도와주세요",
      items: [
        ["Excuse me.", "저기요, 실례합니다.", "익스큐즈 미"],
        ["Where is the restroom?", "화장실이 어디예요?", "웨어 이즈 더 레스트룸"],
        ["I'm lost.", "길을 잃었어요.", "아임 로스트"],
        ["Help me, please.", "도와주세요.", "헬프 미, 플리즈"],
        ["Slowly, please.", "천천히 말해 주세요.", "슬로울리, 플리즈"],
        ["I don't understand.", "이해가 안 돼요.", "아이 돈 언더스탠드"],
      ],
    },
    {
      id: "b-sounds", icon: "👄", title: "기초 발음 (R, L, F, V, TH)", tag: "발음",
      items: [
        ["rice", "쌀, 밥", "R: 혀끝이 입천장에 닿지 않게 혀를 둥글게 말아요"],
        ["light", "빛, 불", "L: 혀끝을 윗니 뒤에 붙였다 떼요"],
        ["coffee", "커피", "F: 윗니로 아랫입술을 살짝 물고 바람을 내보내요"],
        ["very good", "아주 좋아요", "V: F처럼 입술을 물고 목을 울려요"],
        ["thank you", "고마워요", "TH: 혀끝을 윗니와 아랫니 사이로 살짝 내밀어요"],
        ["pizza", "피자", "P: 두 입술을 붙였다가 '퍼' 하고 터뜨려요"],
      ],
    },
  ],

  elementary: [
    {
      id: "e-intro", icon: "🙋", title: "자기소개",
      items: [
        ["Hello, nice to meet you.", "안녕하세요, 만나서 반가워요."],
        ["My name is Minji.", "제 이름은 민지예요.", "My name is ~ : 제 이름은 ~예요"],
        ["I live in Seoul with my family.", "가족과 함께 서울에 살아요.", "with ~ : ~와 함께"],
        ["I work at a bank.", "은행에서 일해요.", "work at + 장소 : ~에서 일해요"],
        ["My hobby is reading books.", "제 취미는 책 읽기예요.", "My hobby is ~ing : 제 취미는 ~하기예요"],
        ["I want to speak English well.", "영어를 잘하고 싶어요.", "want to + 동사 : ~하고 싶어요"],
      ],
    },
    {
      id: "e-order", icon: "🍔", title: "주문하기",
      items: [
        ["Can I see the menu, please?", "메뉴 좀 볼 수 있을까요?", "Can I ~? : ~해도 될까요?"],
        ["I'd like a cheeseburger.", "치즈버거로 할게요.", "I'd like ~ : ~로 할게요, ~ 주세요"],
        ["Can I get it to go?", "포장해 갈 수 있나요?", "to go : 가져가는, for here : 먹고 가는"],
        ["No ice, please.", "얼음은 빼 주세요.", "No ~, please : ~는 빼 주세요"],
        ["Can I have the check, please?", "계산서 주시겠어요?"],
        ["Do you take credit cards?", "신용카드 되나요?", "Do you take ~? : ~ 받나요?"],
      ],
    },
    {
      id: "e-travel", icon: "🧳", title: "여행 영어",
      items: [
        ["Where is the train station?", "기차역이 어디예요?", "Where is ~? : ~이 어디예요?"],
        ["How much is this?", "이거 얼마예요?"],
        ["I'm here for vacation.", "휴가로 왔어요.", "I'm here for ~ : ~ 때문에 왔어요"],
        ["Could you take a picture of us?", "저희 사진 좀 찍어 주실래요?", "Could you ~? : ~해 주실래요?"],
        ["I'd like to check in, please.", "체크인하고 싶어요.", "I'd like to + 동사 : ~하고 싶어요"],
        ["Is there a bus to the airport?", "공항 가는 버스가 있나요?", "Is there ~? : ~가 있나요?"],
      ],
    },
    {
      id: "e-daily", icon: "📅", title: "일상 이야기",
      items: [
        ["I usually get up at seven.", "저는 보통 7시에 일어나요.", "usually : 보통, 대개"],
        ["I go to work by subway.", "지하철로 출근해요.", "by + 교통수단 : ~로 (by bus, by taxi)"],
        ["I had pizza for lunch.", "점심으로 피자를 먹었어요.", "had : 먹었어요 (have의 과거)"],
        ["I went to the movies yesterday.", "어제 영화 보러 갔어요.", "went : 갔어요 (go의 과거)"],
        ["I'm going to meet my friends this weekend.", "이번 주말에 친구들을 만날 거예요.", "be going to + 동사 : ~할 거예요"],
        ["It was really fun.", "정말 재미있었어요."],
      ],
    },
    {
      id: "e-like", icon: "😊", title: "기분과 좋아하는 것",
      items: [
        ["I'm a little tired today.", "오늘 조금 피곤해요.", "a little : 조금"],
        ["I like watching movies.", "영화 보는 걸 좋아해요.", "like + ~ing : ~하는 걸 좋아해요"],
        ["I don't like spicy food.", "매운 음식은 안 좋아해요.", "I don't like ~ : ~를 안 좋아해요"],
        ["My favorite food is kimchi stew.", "제일 좋아하는 음식은 김치찌개예요.", "My favorite ~ is … : 제일 좋아하는 ~는 …예요"],
        ["That sounds great!", "그거 좋네요!"],
        ["Could you say that again, please?", "다시 한번 말씀해 주시겠어요?"],
      ],
    },
    {
      id: "e-sounds", icon: "👄", title: "헷갈리는 발음 (R/L, F/P, TH)", tag: "발음",
      items: [
        ["I really like rice.", "저는 밥을 정말 좋아해요.", "R/L : really와 like, rice를 구별해요"],
        ["The light is red.", "불이 빨간색이에요.", "R/L : light는 L, red는 R"],
        ["Coffee for five people.", "다섯 명을 위한 커피.", "F/P : coffee, for, five는 F, people은 P"],
        ["Thank you very much.", "정말 고마워요.", "TH/V : 혀를 내밀어 thank, 입술을 물어 very"],
        ["I think this is the best.", "이게 최고인 것 같아요.", "TH : think는 바람만, this는 목을 울려요"],
        ["She sells sea shells.", "그녀는 조개껍데기를 팔아요.", "S/SH : sea는 '씨', she는 '쉬'"],
      ],
    },
  ],

  intermediate: [
    {
      id: "i-story", icon: "📖", title: "경험 말하기",
      items: [
        ["I've been to Japan twice, but never to Europe.", "일본은 두 번 가 봤지만 유럽은 한 번도 못 가 봤어요.", "I've been to ~ : ~에 가 본 적 있어요"],
        ["When I was in college, I used to play the guitar.", "대학생 때는 기타를 치곤 했어요.", "used to + 동사 : 예전엔 ~하곤 했어요 (지금은 아님)"],
        ["I was so nervous that I couldn't sleep.", "너무 긴장해서 잠을 못 잤어요.", "so ~ that … : 너무 ~해서 …했어요"],
        ["It turned out to be better than I expected.", "생각했던 것보다 좋았어요.", "turn out to be ~ : 알고 보니 ~였어요"],
        ["Last weekend, I finally got around to cleaning my room.", "지난 주말에 미루던 방 청소를 드디어 했어요.", "get around to ~ing : 미루던 일을 드디어 하다"],
        ["Long story short, we missed the last train.", "간단히 말하면, 막차를 놓쳤어요.", "Long story short : 이야기를 짧게 줄이면"],
      ],
    },
    {
      id: "i-opinion", icon: "💡", title: "의견과 이유",
      items: [
        ["In my opinion, working from home saves a lot of time.", "제 생각엔 재택근무가 시간을 많이 아껴 줘요.", "In my opinion : 제 생각에는 (의견을 시작할 때)"],
        ["The main reason is that it's much cheaper.", "가장 큰 이유는 훨씬 싸다는 거예요.", "The main reason is that ~ : 가장 큰 이유는 ~예요"],
        ["I see your point, but I don't completely agree.", "무슨 말인지 알겠지만 완전히 동의하진 않아요.", "I see your point, but : 부드럽게 반대할 때"],
        ["It depends on the situation.", "상황에 따라 달라요.", "It depends on ~ : ~에 따라 달라요"],
        ["To be honest, I'd rather stay home tonight.", "솔직히 오늘 밤은 그냥 집에 있고 싶어요.", "I'd rather + 동사 : (차라리) ~하는 게 낫겠어요"],
        ["That's a good question. Let me think about it.", "좋은 질문이네요. 잠깐 생각해 볼게요.", "대답할 시간을 벌 때 쓰는 말"],
      ],
    },
    {
      id: "i-plans", icon: "🗓️", title: "계획과 바람",
      items: [
        ["I'm thinking about changing jobs next year.", "내년에 이직할까 생각 중이에요.", "I'm thinking about ~ing : ~할까 생각 중이에요"],
        ["I'm planning to take a few days off in May.", "5월에 며칠 휴가를 낼 계획이에요.", "take a day off : 하루 쉬다, 휴가를 내다"],
        ["I'm really looking forward to the trip.", "여행이 정말 기대돼요.", "look forward to + 명사/~ing : ~가 기대돼요"],
        ["If I had more time, I would learn to cook.", "시간이 더 있으면 요리를 배울 텐데요.", "If I had ~, I would … : 지금은 아니지만 ~라면 …할 텐데"],
        ["Hopefully, the weather will be nice.", "날씨가 좋으면 좋겠어요.", "Hopefully : 바라건대, ~면 좋겠어요"],
        ["Let's play it by ear.", "상황 봐 가면서 정해요.", "play it by ear : 미리 정하지 않고 그때그때 정하다"],
      ],
    },
    {
      id: "i-polite", icon: "🙏", title: "정중하게 부탁하기",
      items: [
        ["Would you mind opening the window?", "창문 좀 열어 주시겠어요?", "Would you mind ~ing? : ~해 주셔도 괜찮을까요? (아주 정중)"],
        ["I was wondering if you could help me.", "혹시 좀 도와주실 수 있을까 해서요.", "I was wondering if ~ : 조심스럽게 부탁할 때"],
        ["Could I possibly change my reservation?", "혹시 예약을 바꿀 수 있을까요?", "possibly : 부탁을 더 공손하게 만들어요"],
        ["Sorry to bother you, but this isn't what I ordered.", "번거롭게 해서 죄송한데, 이건 제가 주문한 게 아니에요.", "Sorry to bother you : 말을 걸거나 불편을 말할 때"],
        ["Would it be okay if I left a little early?", "조금 일찍 가도 괜찮을까요?", "Would it be okay if I + 과거형 : ~해도 괜찮을까요?"],
        ["Thanks for your help. I really appreciate it.", "도와줘서 고마워요. 정말 감사해요.", "I really appreciate it : Thank you보다 진심을 담은 감사"],
      ],
    },
    {
      id: "i-trouble", icon: "🧳", title: "여행 중 문제 해결",
      items: [
        ["My flight was canceled. What are my options?", "비행기가 취소됐어요. 어떤 방법이 있나요?", "What are my options? : 제가 할 수 있는 방법이 뭐가 있나요?"],
        ["The air conditioner in my room isn't working.", "방 에어컨이 작동을 안 해요.", "~ isn't working : ~가 고장 났어요, 안 돼요"],
        ["I think there's a mistake on my bill.", "계산서에 실수가 있는 것 같아요.", "I think ~ : 단정하지 않고 부드럽게 말할 때"],
        ["I left my phone in the taxi.", "택시에 휴대폰을 두고 내렸어요.", "leave(left) A in B : A를 B에 두고 오다"],
        ["Is there any way I could get a late checkout?", "늦게 체크아웃할 방법이 있을까요?", "Is there any way ~? : 혹시 ~할 방법이 있을까요?"],
        ["Could you recommend a good place to eat around here?", "이 근처에 맛있는 식당 추천해 주실래요?", "around here : 이 근처에"],
      ],
    },
    {
      id: "i-flow", icon: "🎵", title: "연음과 리듬", tag: "발음",
      items: [
        ["What do you want to do?", "뭐 하고 싶어요?", "want to는 빠르게 '워너'처럼 이어 말해요"],
        ["I'm going to check it out.", "한번 가서 볼게요.", "going to는 '고너', check it out은 '체키라웃'"],
        ["Did you eat yet?", "밥 먹었어요?", "Did you는 '디쥬'처럼 붙여 말해요"],
        ["Let me know if you need anything.", "필요한 거 있으면 말해 줘요.", "Let me는 '레미', need anything은 '니드애니씽'"],
        ["Not at all.", "전혀요, 천만에요.", "t가 모음 사이에서 'ㄹ'처럼 '나래롤'"],
        ["Can I get a cup of coffee?", "커피 한 잔 주시겠어요?", "get a는 '게러', cup of는 '커퍼'"],
      ],
    },
  ],
};

export const ALL_LESSONS = Object.entries(LESSONS).flatMap(([level, list]) => list.map((l) => ({ ...l, level })));
