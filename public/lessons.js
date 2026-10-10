// 말하기 연습용 문장. 수준마다 1~10단계가 있고, 쉬운 단계부터 차례로 열려요.
// 각 문장은 [영어, 한국어 뜻, 도움말]이고, 도움말은 왕초보는 한글 발음, 초급은 문장 패턴, 중급은 표현 팁이에요.
// 단계 순서는 배열 순서예요. id는 기록(점수)과 이어져 있으니 바꾸지 마세요.
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
      id: "b-answer", icon: "👌", title: "짧게 대답하기",
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
      id: "b-me", icon: "🙋", title: "나를 소개해요",
      items: [
        ["I'm Minji.", "저는 민지예요.", "아임 민지"],
        ["I'm from Korea.", "한국에서 왔어요.", "아임 프럼 코리아"],
        ["I'm a student.", "저는 학생이에요.", "아임 어 스튜던트"],
        ["I live in Seoul.", "서울에 살아요.", "아이 리브 인 서울"],
        ["I like coffee.", "커피를 좋아해요.", "아이 라익 커피"],
        ["I have a dog.", "강아지가 있어요.", "아이 해브 어 독"],
      ],
    },
    {
      id: "b-number", icon: "🔢", title: "숫자 세기",
      items: [
        ["One, two, three.", "하나, 둘, 셋.", "원, 투, 쓰리"],
        ["Four, five, six.", "넷, 다섯, 여섯.", "포, 파이브, 식스"],
        ["Seven, eight, nine, ten.", "일곱, 여덟, 아홉, 열.", "세븐, 에잇, 나인, 텐"],
        ["Just one.", "하나만요.", "저스트 원"],
        ["Two people, please.", "두 명이요.", "투 피플, 플리즈"],
        ["I'm twenty years old.", "저는 스무 살이에요.", "아임 트웬티 이어즈 올드"],
      ],
    },
    {
      id: "b-feel", icon: "😊", title: "기분 말하기",
      items: [
        ["I'm hungry.", "배고파요.", "아임 헝그리"],
        ["I'm full.", "배불러요.", "아임 풀"],
        ["I'm tired.", "피곤해요.", "아임 타이어드"],
        ["I'm sleepy.", "졸려요.", "아임 슬리피"],
        ["I'm cold.", "추워요.", "아임 콜드"],
        ["I'm so happy!", "너무 기뻐요!", "아임 쏘 해피"],
      ],
    },
    {
      id: "b-like", icon: "❤️", title: "좋아요, 별로예요",
      items: [
        ["I like it.", "마음에 들어요.", "아이 라이킷"],
        ["I love it!", "정말 좋아요!", "아이 러빗"],
        ["I don't like it.", "별로예요.", "아이 돈 라이킷"],
        ["It's good.", "좋네요.", "잇츠 굿"],
        ["It's delicious.", "맛있어요.", "잇츠 딜리셔스"],
        ["Not bad.", "나쁘지 않아요.", "낫 배드"],
      ],
    },
    {
      id: "b-day", icon: "🏠", title: "매일 하는 말",
      items: [
        ["Good night.", "잘 자요.", "굿 나잇"],
        ["I'm home.", "다녀왔어요.", "아임 홈"],
        ["Let's eat.", "밥 먹자.", "렛츠 잇"],
        ["Let's go!", "가자!", "렛츠 고"],
        ["Wait a minute.", "잠깐만요.", "웨잇 어 미닛"],
        ["Good job!", "잘했어요!", "굿 잡"],
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
      id: "b-place", icon: "🗺️", title: "길 찾기",
      items: [
        ["Go straight.", "쭉 가세요.", "고 스트레잇"],
        ["Turn left.", "왼쪽으로 도세요.", "턴 레프트"],
        ["Turn right.", "오른쪽으로 도세요.", "턴 라잇"],
        ["Over there.", "저쪽이에요.", "오버 데어"],
        ["Is it far?", "멀어요?", "이즈 잇 파"],
        ["Where is the station?", "역이 어디예요?", "웨어 이즈 더 스테이션"],
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
      id: "e-family", icon: "👨‍👩‍👧", title: "가족과 친구",
      items: [
        ["I have one older sister.", "언니(누나)가 한 명 있어요.", "older sister : 언니·누나, younger brother : 남동생"],
        ["My father is a teacher.", "아버지는 선생님이에요.", "My father is ~ : 아버지는 ~예요"],
        ["She is very kind.", "그녀는 아주 친절해요.", "very + 형용사 : 아주 ~해요"],
        ["My brother likes soccer.", "남동생은 축구를 좋아해요.", "he·she 뒤의 동사에는 -s를 붙여요 (likes)"],
        ["My best friend lives in Busan.", "제일 친한 친구는 부산에 살아요.", "best friend : 제일 친한 친구"],
        ["We often eat dinner together.", "우리는 자주 같이 저녁을 먹어요.", "often : 자주, together : 함께"],
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
      id: "e-daily", icon: "⏰", title: "하루 일과",
      items: [
        ["I usually get up at seven.", "저는 보통 7시에 일어나요.", "usually : 보통, 대개"],
        ["I take a shower in the morning.", "아침에 샤워를 해요.", "take a shower : 샤워하다"],
        ["I go to work by subway.", "지하철로 출근해요.", "by + 교통수단 : ~로 (by bus, by taxi)"],
        ["I have lunch at twelve.", "12시에 점심을 먹어요.", "have lunch : 점심을 먹다"],
        ["I come home at six.", "6시에 집에 와요.", "come home : 집에 오다 (to 없이 써요)"],
        ["I go to bed at eleven.", "11시에 자요.", "go to bed : 잠자리에 들다"],
      ],
    },
    {
      id: "e-weather", icon: "☀️", title: "날씨와 계절",
      items: [
        ["What's the weather like today?", "오늘 날씨 어때요?", "What's ~ like? : ~는 어때요?"],
        ["It's sunny today.", "오늘은 화창해요.", "날씨는 It's ~ 로 말해요"],
        ["It's raining outside.", "밖에 비가 와요.", "It's raining : 지금 비가 와요"],
        ["It's really hot and humid.", "정말 덥고 습해요.", "humid : 습한"],
        ["I like spring the best.", "봄을 제일 좋아해요.", "like ~ the best : ~를 제일 좋아해요"],
        ["Don't forget your umbrella.", "우산 잊지 마세요.", "Don't forget ~ : ~ 잊지 마세요"],
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
      id: "e-shop", icon: "🛍️", title: "쇼핑하기",
      items: [
        ["I'm looking for a jacket.", "재킷을 찾고 있어요.", "I'm looking for ~ : ~를 찾고 있어요"],
        ["Can I try this on?", "이거 입어 봐도 돼요?", "try on : 입어 보다, 신어 보다"],
        ["It's too big for me.", "저한테 너무 커요.", "too + 형용사 : 너무 ~해요"],
        ["Do you have a smaller size?", "더 작은 사이즈 있어요?", "smaller : 더 작은, bigger : 더 큰"],
        ["Do you have it in black?", "검은색도 있어요?", "in + 색깔 : ~색으로"],
        ["I'll take this one.", "이걸로 살게요.", "I'll take ~ : ~로 살게요"],
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
      id: "e-past", icon: "⏪", title: "지난 일 말하기",
      items: [
        ["I had pizza for lunch.", "점심으로 피자를 먹었어요.", "had : 먹었어요 (have의 과거)"],
        ["I went to the movies yesterday.", "어제 영화 보러 갔어요.", "went : 갔어요 (go의 과거)"],
        ["I met my friend last night.", "어젯밤에 친구를 만났어요.", "met : 만났어요 (meet의 과거)"],
        ["I stayed home last weekend.", "지난 주말엔 집에 있었어요.", "stay → stayed : 보통 동사는 -ed를 붙여요"],
        ["It was really fun.", "정말 재미있었어요.", "was : ~였어요 (is의 과거)"],
        ["I didn't sleep well.", "잠을 잘 못 잤어요.", "didn't + 동사 : ~하지 않았어요"],
      ],
    },
    {
      id: "e-future", icon: "⏩", title: "계획 말하기",
      items: [
        ["I'm going to meet my friends this weekend.", "이번 주말에 친구들을 만날 거예요.", "be going to + 동사 : ~할 거예요 (정해 둔 계획)"],
        ["I'm going to visit my parents on Sunday.", "일요일에 부모님 댁에 갈 거예요.", "on + 요일 : ~요일에"],
        ["I will call you tomorrow.", "내일 전화할게요.", "will : ~할게요 (지금 정한 일)"],
        ["I want to travel to Japan next year.", "내년에 일본 여행을 하고 싶어요.", "next year : 내년, next week : 다음 주"],
        ["What are you doing tonight?", "오늘 밤에 뭐 해요?", "be ~ing : 가까운 계획을 말할 때도 써요"],
        ["Let's have lunch together next week.", "다음 주에 같이 점심 먹어요.", "Let's ~ : 같이 ~해요"],
      ],
    },
  ],

  intermediate: [
    {
      id: "i-small", icon: "👋", title: "스몰토크",
      items: [
        ["Long time no see! How have you been?", "오랜만이에요! 어떻게 지냈어요?", "How have you been? : 그동안 어떻게 지냈어요?"],
        ["What have you been up to lately?", "요즘 뭐 하면서 지냈어요?", "be up to ~ : ~를 하며 지내다"],
        ["Same old, same old. Nothing special.", "늘 똑같죠 뭐. 별일 없어요.", "Same old, same old : 늘 그렇죠 뭐"],
        ["I've been swamped with work lately.", "요즘 일 때문에 정신이 없어요.", "be swamped with ~ : ~로 정신없이 바쁘다"],
        ["You haven't changed a bit.", "하나도 안 변했네요.", "not ~ a bit : 조금도 ~하지 않다"],
        ["We should grab coffee sometime.", "언제 커피 한잔해요.", "grab coffee : 가볍게 커피 한잔하다"],
      ],
    },
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
      id: "i-feelings", icon: "😮‍💨", title: "감정 표현",
      items: [
        ["I'm a bit stressed out these days.", "요즘 스트레스를 좀 받고 있어요.", "stressed out : 스트레스로 지친"],
        ["I was really disappointed with the ending.", "결말이 정말 실망스러웠어요.", "be disappointed with ~ : ~에 실망하다"],
        ["I can't wait to see you.", "빨리 보고 싶어요.", "I can't wait to ~ : 빨리 ~하고 싶어요"],
        ["It really gets on my nerves.", "그게 정말 신경에 거슬려요.", "get on my nerves : 신경을 긁다, 짜증 나게 하다"],
        ["I'm so relieved that everything worked out.", "다 잘 풀려서 정말 다행이에요.", "work out : (일이) 잘 풀리다"],
        ["Don't worry about it. It's not a big deal.", "걱정 마요. 별일 아니에요.", "not a big deal : 별일 아니다"],
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
      id: "i-compare", icon: "⚖️", title: "비교와 추천",
      items: [
        ["This one is way better than the old one.", "이게 예전 것보다 훨씬 나아요.", "way + 비교급 : 훨씬 더 (말할 때 자주 써요)"],
        ["It's not as expensive as I thought.", "생각만큼 비싸지 않아요.", "not as ~ as … : …만큼 ~하지 않다"],
        ["If I were you, I'd take the train.", "제가 당신이라면 기차를 타겠어요.", "If I were you : 제가 당신이라면 (조언할 때)"],
        ["You should definitely try the local food.", "현지 음식은 꼭 드셔 보세요.", "should definitely : 꼭 ~해 보세요"],
        ["It's really worth a visit.", "정말 가 볼 만해요.", "worth + 명사·~ing : ~할 가치가 있다"],
        ["It's the best movie I've seen this year.", "올해 본 영화 중에 최고예요.", "the best ~ I've seen : 내가 본 ~ 중 최고"],
      ],
    },
    {
      id: "i-plans", icon: "🗓️", title: "계획과 바람",
      items: [
        ["I'm thinking about changing jobs next year.", "내년에 이직할까 생각 중이에요.", "I'm thinking about ~ing : ~할까 생각 중이에요"],
        ["I'm planning to take a few days off in May.", "5월에 며칠 휴가를 낼 계획이에요.", "take a day off : 하루 쉬다, 휴가를 내다"],
        ["I'm really looking forward to the trip.", "여행이 정말 기대돼요.", "look forward to + 명사·~ing : ~가 기대돼요"],
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
      id: "i-phone", icon: "📞", title: "전화와 예약",
      items: [
        ["I'd like to make a reservation for four people.", "네 명 예약하고 싶어요.", "make a reservation for + 인원 : ~명 예약하다"],
        ["Hi, I'm calling about my order.", "안녕하세요, 제 주문 때문에 전화드렸어요.", "I'm calling about ~ : ~ 때문에 전화했어요"],
        ["Sorry, I didn't catch that.", "죄송해요, 잘 못 알아들었어요.", "catch : (말을) 알아듣다"],
        ["Could you speak up a little?", "조금 크게 말씀해 주시겠어요?", "speak up : 더 크게 말하다"],
        ["Could you put me through to the front desk?", "프런트로 연결해 주시겠어요?", "put ~ through : 전화를 연결해 주다"],
        ["Can I leave a message?", "메시지를 남겨도 될까요?", "leave a message : 메시지를 남기다"],
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
      id: "i-work", icon: "💼", title: "직장 영어",
      items: [
        ["Could we push the meeting to Thursday?", "회의를 목요일로 미룰 수 있을까요?", "push A to B : A를 B로 미루다"],
        ["I'll get back to you by tomorrow.", "내일까지 다시 연락드릴게요.", "get back to ~ : ~에게 다시 연락하다, 답을 주다"],
        ["Let me double-check and let you know.", "다시 확인해 보고 알려 드릴게요.", "double-check : 한 번 더 확인하다"],
        ["I'm afraid I can't make it to the meeting.", "죄송하지만 회의에 못 갈 것 같아요.", "I'm afraid ~ : 안 좋은 소식을 정중하게, make it : 참석하다"],
        ["Could you walk me through the plan?", "계획을 차근차근 설명해 주시겠어요?", "walk ~ through : ~에게 하나씩 설명해 주다"],
        ["Thanks for the heads-up.", "미리 알려 줘서 고마워요.", "heads-up : 미리 알려 줌"],
      ],
    },
  ],
};

// 단계와 상관없이 언제든 할 수 있는 발음 보너스
export const BONUS = {
  beginner: {
    id: "b-sounds", icon: "👄", title: "기초 발음 (R, L, F, V, TH)",
    items: [
      ["rice", "쌀, 밥", "R: 혀끝이 입천장에 닿지 않게 혀를 둥글게 말아요"],
      ["light", "빛, 불", "L: 혀끝을 윗니 뒤에 붙였다 떼요"],
      ["coffee", "커피", "F: 윗니로 아랫입술을 살짝 물고 바람을 내보내요"],
      ["very good", "아주 좋아요", "V: F처럼 입술을 물고 목을 울려요"],
      ["thank you", "고마워요", "TH: 혀끝을 윗니와 아랫니 사이로 살짝 내밀어요"],
      ["pizza", "피자", "P: 두 입술을 붙였다가 '퍼' 하고 터뜨려요"],
    ],
  },
  elementary: {
    id: "e-sounds", icon: "👄", title: "헷갈리는 발음 (R/L, F/P, TH)",
    items: [
      ["I really like rice.", "저는 밥을 정말 좋아해요.", "R/L : really와 like, rice를 구별해요"],
      ["The light is red.", "불이 빨간색이에요.", "R/L : light는 L, red는 R"],
      ["Coffee for five people.", "다섯 명을 위한 커피.", "F/P : coffee, for, five는 F, people은 P"],
      ["Thank you very much.", "정말 고마워요.", "TH/V : 혀를 내밀어 thank, 입술을 물어 very"],
      ["I think this is the best.", "이게 최고인 것 같아요.", "TH : think는 바람만, this는 목을 울려요"],
      ["She sells sea shells.", "그녀는 조개껍데기를 팔아요.", "S/SH : sea는 '씨', she는 '쉬'"],
    ],
  },
  intermediate: {
    id: "i-flow", icon: "🎵", title: "연음과 리듬",
    items: [
      ["What do you want to do?", "뭐 하고 싶어요?", "want to는 빠르게 '워너'처럼 이어 말해요"],
      ["I'm going to check it out.", "한번 가서 볼게요.", "going to는 '고너', check it out은 '체키라웃'"],
      ["Did you eat yet?", "밥 먹었어요?", "Did you는 '디쥬'처럼 붙여 말해요"],
      ["Let me know if you need anything.", "필요한 거 있으면 말해 줘요.", "Let me는 '레미', need anything은 '니드애니씽'"],
      ["Not at all.", "전혀요, 천만에요.", "t가 모음 사이에서 'ㄹ'처럼 '나래롤'"],
      ["Can I get a cup of coffee?", "커피 한 잔 주시겠어요?", "get a는 '게러', cup of는 '커퍼'"],
    ],
  },
};

export const ALL_LESSONS = Object.entries(LESSONS).flatMap(([level, list]) => [
  ...list.map((l, i) => ({ ...l, level, stage: i + 1 })),
  { ...BONUS[level], level, bonus: true },
]);
