// 대화 상황(시나리오)과 체험 모드용 대본. 서버와 화면이 함께 사용합니다.
// 상황마다 수준별 설명(desc), 미션(goal), 체험 대본(demo)이 따로 있어요.
// 대본 한 줄은 [써니의 말, 한국어 뜻, [[추천 대답, 뜻], ...]] 이에요.

export const SCENARIOS = {
  intro: {
    icon: "👋", title: "자기소개",
    prompt: "You are meeting the learner for the first time at a friendly language cafe. Get to know them: name, where they live, job or school, hobbies.",
    levels: {
      beginner: {
        desc: "이름과 나라 말하기",
        goal: "이름과 어디서 왔는지 짧게 말해 보세요",
        demo: [
          ["Hi! I'm Sunny. What's your name?", "안녕하세요! 저는 써니예요. 이름이 뭐예요?", [["I'm Minji.", "저는 민지예요."], ["I'm John.", "저는 존이에요."]]],
          ["Nice to meet you! Are you from Korea?", "만나서 반가워요! 한국에서 왔어요?", [["Yes, I am.", "네, 맞아요."], ["Yes, Korea.", "네, 한국이요."]]],
          ["Cool! Do you like coffee?", "좋네요! 커피 좋아해요?", [["Yes, I do.", "네, 좋아해요."], ["No, I like tea.", "아니요, 차를 좋아해요."]]],
          ["Me too! You are doing great.", "저도요! 정말 잘하고 있어요.", [["Thank you!", "고마워요!"], ["Bye!", "안녕!"]]],
        ],
      },
      elementary: {
        desc: "이름, 사는 곳, 직업, 취미 말하기",
        goal: "이름, 사는 곳, 하는 일, 취미를 한 문장씩 말해 보세요",
        demo: [
          ["Hi! I'm Sunny. What's your name?", "안녕하세요! 저는 써니예요. 이름이 뭐예요?", [["My name is Minji.", "제 이름은 민지예요."], ["I'm John.", "저는 존이에요."]]],
          ["Nice to meet you! Where do you live?", "만나서 반가워요! 어디에 살아요?", [["I live in Seoul.", "저는 서울에 살아요."], ["I live in Busan.", "저는 부산에 살아요."]]],
          ["Cool! What do you do?", "멋지네요! 무슨 일을 하세요?", [["I am a student.", "저는 학생이에요."], ["I work at a bank.", "저는 은행에서 일해요."]]],
          ["What do you like to do in your free time?", "시간 있을 때 뭐 하는 걸 좋아해요?", [["I like watching movies.", "영화 보는 걸 좋아해요."], ["I like hiking.", "등산을 좋아해요."]]],
          ["That sounds fun! You are doing great today.", "재미있겠네요! 오늘 정말 잘하고 있어요.", [["Thank you!", "고마워요!"], ["Nice talking to you.", "이야기해서 즐거웠어요."]]],
        ],
      },
      intermediate: {
        desc: "영어를 배우는 이유와 요즘 관심사 말하기",
        goal: "영어를 배우는 이유와 요즘 빠져 있는 것을 이유와 함께 말해 보세요",
        demo: [
          ["Hi, I'm Sunny! So, tell me a little bit about yourself.", "안녕하세요, 써니예요! 자기소개 좀 해 주세요.", [["I'm Minji, and I work as a designer in Seoul.", "저는 민지이고, 서울에서 디자이너로 일해요."], ["I'm John. I just moved to Busan for work.", "저는 존이에요. 일 때문에 얼마 전 부산으로 이사 왔어요."]]],
          ["Oh, nice! What made you want to learn English?", "오, 좋네요! 영어를 배우고 싶어진 계기가 뭐예요?", [["I want to travel more, so I'd like to talk with people in English.", "여행을 더 다니고 싶어서 영어로 사람들과 이야기하고 싶어요."], ["I need it for work because I have meetings with foreign clients.", "외국 고객과 회의가 있어서 일 때문에 필요해요."]]],
          ["That makes sense. What do you usually do to relax after a long day?", "그렇군요. 힘든 하루가 끝나면 보통 뭐 하면서 쉬어요?", [["I usually go for a walk and listen to podcasts.", "보통 산책하면서 팟캐스트를 들어요."], ["Honestly, I just binge-watch dramas on Netflix.", "솔직히 넷플릭스에서 드라마를 몰아 봐요."]]],
          ["Ha, I can relate! What's the best show you've watched recently, and why?", "하하, 공감돼요! 최근에 본 것 중 최고는 뭐예요? 왜요?", [["I really liked a Korean thriller because the story was so unpredictable.", "이야기를 전혀 예측할 수 없어서 한국 스릴러가 정말 좋았어요."], ["I haven't watched much lately because I've been really busy.", "요즘 정말 바빠서 별로 못 봤어요."]]],
          ["Sounds great! You explain things really clearly. Nice job today!", "좋네요! 설명을 정말 잘하시네요. 오늘 잘했어요!", [["Thanks! It was fun talking with you.", "고마워요! 이야기해서 즐거웠어요."]]],
        ],
      },
    },
  },
  cafe: {
    icon: "☕", title: "카페 주문",
    prompt: "You are a barista at a coffee shop. Take the learner's order: drink, size, hot or iced, for here or to go, then the price.",
    levels: {
      beginner: {
        desc: "음료 한 잔 주문하기",
        goal: "음료 하나를 주문해 보세요. 한두 단어로 대답해도 돼요",
        demo: [
          ["Hi! Coffee or tea?", "안녕하세요! 커피요, 차요?", [["Coffee, please.", "커피 주세요."], ["Tea, please.", "차 주세요."]]],
          ["Okay! Hot or iced?", "네! 따뜻한 거요, 아이스요?", [["Iced, please.", "아이스로 주세요."], ["Hot, please.", "따뜻한 걸로 주세요."]]],
          ["Small or large?", "작은 거요, 큰 거요?", [["Small, please.", "작은 거요."], ["Large, please.", "큰 거요."]]],
          ["Here you go. Four dollars.", "여기 있어요. 4달러예요.", [["Thank you!", "고마워요!"], ["Here.", "여기요."]]],
        ],
      },
      elementary: {
        desc: "음료 주문하고 계산하기",
        goal: "음료 종류, 사이즈, 먹고 갈지 가져갈지 말해 보세요",
        demo: [
          ["Hi there! What can I get for you?", "안녕하세요! 무엇을 드릴까요?", [["Can I get a latte, please?", "라떼 하나 주세요."], ["One americano, please.", "아메리카노 하나 주세요."]]],
          ["Sure! Hot or iced?", "네! 따뜻한 걸로요, 아이스로요?", [["Iced, please.", "아이스로 주세요."], ["Hot, please.", "따뜻한 걸로 주세요."]]],
          ["What size would you like? Small, medium, or large?", "어떤 사이즈로 드릴까요?", [["Medium, please.", "미디엄으로 주세요."], ["Large, please.", "라지로 주세요."]]],
          ["For here or to go?", "드시고 가세요, 가져가세요?", [["To go, please.", "가져갈게요."], ["For here.", "먹고 갈게요."]]],
          ["That's five dollars. Have a nice day!", "5달러입니다. 좋은 하루 보내세요!", [["Thank you!", "감사합니다!"], ["Here you go.", "여기 있어요."]]],
        ],
      },
      intermediate: {
        desc: "추천받고 내 취향대로 바꿔 주문하기",
        goal: "메뉴를 추천받고, 우유 변경이나 덜 달게 같은 요청을 해 보세요",
        demo: [
          ["Hi there! What can I get started for you today?", "안녕하세요! 오늘 뭘로 준비해 드릴까요?", [["I'm not sure yet. What would you recommend?", "아직 못 정했어요. 뭘 추천하세요?"], ["Can I get an iced latte with oat milk?", "오트 밀크로 아이스 라떼 주실 수 있나요?"]]],
          ["Our honey latte is really popular. It's a little sweet, though.", "저희 허니 라떼가 인기가 많아요. 조금 달긴 해요.", [["Could you make it less sweet?", "덜 달게 해 주실 수 있나요?"], ["Sounds good, but can I get it with oat milk instead?", "좋네요, 그런데 오트 밀크로 바꿔 주실 수 있나요?"]]],
          ["Sure, no problem. Would you like anything to eat with that?", "물론이죠. 같이 드실 것도 필요하세요?", [["What goes well with it?", "이거랑 뭐가 잘 어울려요?"], ["I'm good, thanks. Just the drink.", "괜찮아요. 음료만 주세요."]]],
          ["Got it. That'll be six fifty. Is this for here or to go?", "알겠습니다. 6달러 50센트예요. 드시고 가세요, 가져가세요?", [["To go, please. Can I pay by card?", "가져갈게요. 카드로 계산할 수 있나요?"], ["For here. Do you have Wi-Fi?", "먹고 갈게요. 와이파이 있나요?"]]],
          ["Of course. Your drink will be ready in a few minutes. Enjoy!", "그럼요. 음료는 몇 분 뒤에 나와요. 맛있게 드세요!", [["Thanks a lot!", "정말 고마워요!"]]],
        ],
      },
    },
  },
  directions: {
    icon: "🗺️", title: "길 묻기",
    prompt: "You are a friendly local on a street in New York. The learner is a tourist asking for directions. Give clear directions (go straight, turn left/right, next to, take the subway...).",
    levels: {
      beginner: {
        desc: "화장실, 역 위치 묻기",
        goal: "Where is ~? 로 가고 싶은 곳을 물어보세요",
        demo: [
          ["Hi! Are you lost?", "안녕하세요! 길을 잃었어요?", [["Yes.", "네."], ["Yes, I'm lost.", "네, 길을 잃었어요."]]],
          ["Where do you want to go?", "어디에 가고 싶어요?", [["The station.", "역이요."], ["Where is the restroom?", "화장실이 어디예요?"]]],
          ["Go straight. Then turn left.", "쭉 가세요. 그다음 왼쪽으로 도세요.", [["Straight, then left?", "쭉 가서 왼쪽이요?"], ["Thank you!", "고마워요!"]]],
          ["Yes! It's very close.", "네! 아주 가까워요.", [["Thank you so much!", "정말 고마워요!"], ["Bye!", "안녕히 계세요!"]]],
        ],
      },
      elementary: {
        desc: "역, 화장실, 장소 찾기",
        goal: "가고 싶은 곳을 묻고, 얼마나 먼지 물어보세요",
        demo: [
          ["Hi! You look lost. Can I help you?", "안녕하세요! 길을 잃으신 것 같네요. 도와드릴까요?", [["Where is the subway station?", "지하철역이 어디예요?"], ["I'm looking for a bank.", "은행을 찾고 있어요."]]],
          ["Go straight two blocks, then turn left.", "두 블록 직진한 다음 왼쪽으로 도세요.", [["Is it far?", "멀어요?"], ["Can I walk there?", "걸어갈 수 있어요?"]]],
          ["No, it's about five minutes on foot.", "아니요, 걸어서 5분 정도예요.", [["Thank you so much!", "정말 감사합니다!"], ["Is there a cafe near here?", "근처에 카페가 있나요?"]]],
          ["You're welcome! Enjoy your trip!", "천만에요! 즐거운 여행 되세요!", [["Thanks, bye!", "고마워요, 안녕히 계세요!"]]],
        ],
      },
      intermediate: {
        desc: "교통편 비교하고 갈아타는 법 묻기",
        goal: "가는 방법을 두 가지 이상 물어보고 더 나은 쪽을 골라 보세요",
        demo: [
          ["Hey, you look a little lost. Can I help you find something?", "길을 좀 헤매시는 것 같네요. 찾는 거 도와드릴까요?", [["Yes, I'm trying to get to Central Park, but my phone died.", "센트럴 파크에 가려는데 휴대폰이 꺼졌어요."], ["Thanks! Is there a subway station around here?", "고마워요! 이 근처에 지하철역 있나요?"]]],
          ["Sure. You can walk, but it takes about twenty minutes. The subway is faster.", "걸어갈 수도 있지만 20분쯤 걸려요. 지하철이 더 빨라요.", [["Which line should I take, and where do I get off?", "몇 호선을 타고 어디서 내려야 하나요?"], ["I don't mind walking. Could you tell me the way?", "걷는 건 괜찮아요. 가는 길 알려 주실래요?"]]],
          ["Take the C train uptown and get off at 72nd Street. It's just three stops.", "C선 업타운 방향을 타고 72번가에서 내리세요. 세 정거장이에요.", [["Do I need to transfer, or is it a direct train?", "갈아타야 하나요, 아니면 한 번에 가나요?"], ["Great. Where can I buy a ticket?", "좋아요. 표는 어디서 사나요?"]]],
          ["It's direct, and you can just tap your card at the gate.", "한 번에 가요. 개찰구에서 카드를 찍기만 하면 돼요.", [["That's really helpful. Thanks for explaining it so clearly!", "정말 도움 됐어요. 쉽게 설명해 주셔서 고마워요!"]]],
          ["Anytime! Enjoy the park. The weather's perfect for a walk.", "언제든지요! 공원 즐기세요. 산책하기 딱 좋은 날씨예요.", [["Thanks, have a good one!", "고마워요, 좋은 하루 보내세요!"]]],
        ],
      },
    },
  },
  airport: {
    icon: "✈️", title: "공항·입국",
    prompt: "You are an immigration officer at a US airport. Ask about the purpose of the visit, length of stay, where they will stay, and their return ticket. Be polite and calm.",
    levels: {
      beginner: {
        desc: "입국 심사에 짧게 대답하기",
        goal: "여권을 내밀고, 여행 목적과 기간을 짧게 대답해 보세요",
        demo: [
          ["Hello. Passport, please.", "안녕하세요. 여권 주세요.", [["Here you are.", "여기 있어요."], ["Here.", "여기요."]]],
          ["Vacation or business?", "여행이에요, 출장이에요?", [["Vacation.", "여행이요."], ["Business.", "출장이요."]]],
          ["How long? One week?", "얼마나요? 일주일이요?", [["One week.", "일주일이요."], ["Five days.", "5일이요."]]],
          ["Are you staying at a hotel?", "호텔에 머무르세요?", [["Yes, a hotel.", "네, 호텔이요."], ["My friend's house.", "친구 집이요."]]],
          ["Okay. Welcome!", "좋아요. 환영합니다!", [["Thank you!", "고마워요!"]]],
        ],
      },
      elementary: {
        desc: "입국 심사 질문에 문장으로 대답하기",
        goal: "방문 목적, 머무는 기간, 숙소를 문장으로 말해 보세요",
        demo: [
          ["Hello. May I see your passport, please?", "안녕하세요. 여권 좀 보여주시겠어요?", [["Here you are.", "여기 있습니다."], ["Sure.", "네."]]],
          ["What is the purpose of your visit?", "방문 목적이 무엇인가요?", [["I'm here for vacation.", "휴가로 왔어요."], ["For business.", "출장이에요."]]],
          ["How long will you stay?", "얼마나 머무르실 건가요?", [["For one week.", "일주일이요."], ["About ten days.", "열흘 정도요."]]],
          ["Where will you stay?", "어디에서 머무르시나요?", [["At a hotel in Manhattan.", "맨해튼에 있는 호텔이요."], ["At my friend's house.", "친구 집이요."]]],
          ["Okay. Enjoy your stay!", "좋습니다. 즐거운 시간 보내세요!", [["Thank you!", "감사합니다!"]]],
        ],
      },
      intermediate: {
        desc: "추가 질문에 일정과 숙소를 자세히 설명하기",
        goal: "여행 일정, 숙소, 돌아가는 날짜를 구체적으로 설명해 보세요",
        demo: [
          ["Good afternoon. Passport, please. What brings you to the United States?", "안녕하세요. 여권 주세요. 미국에는 무슨 일로 오셨어요?", [["I'm here on vacation. I'm visiting New York and Boston.", "휴가로 왔어요. 뉴욕과 보스턴에 가요."], ["I'm attending a conference in Chicago for work.", "업무로 시카고 학회에 참석해요."]]],
          ["How long are you planning to stay, and where will you be staying?", "얼마나 머무를 예정이고, 어디서 지내시나요?", [["About two weeks. I booked a hotel near Times Square.", "2주 정도요. 타임스스퀘어 근처 호텔을 예약했어요."], ["Ten days. I'm staying with a friend who lives in Brooklyn.", "열흘이요. 브루클린에 사는 친구 집에서 지내요."]]],
          ["Have you been to the U.S. before?", "전에 미국에 와 본 적 있나요?", [["Yes, I came here once for a family trip three years ago.", "네, 3년 전에 가족 여행으로 한 번 왔어요."], ["No, this is my first time, so I'm pretty excited.", "아니요, 처음이라 꽤 설레요."]]],
          ["Do you have a return ticket?", "돌아가는 항공권 있나요?", [["Yes, I'm flying back to Seoul on the twentieth.", "네, 20일에 서울로 돌아가요."], ["Yes, here's my itinerary.", "네, 여기 일정표요."]]],
          ["Everything looks fine. Enjoy your stay.", "모두 괜찮네요. 즐거운 시간 보내세요.", [["Thank you. Have a nice day!", "고마워요. 좋은 하루 보내세요!"]]],
        ],
      },
    },
  },
  shopping: {
    icon: "🛍️", title: "쇼핑",
    prompt: "You are a clerk in a clothing store. Help the learner find clothes, sizes and colors, try things on, pay, or exchange and return items.",
    levels: {
      beginner: {
        desc: "색 고르고 가격 묻기",
        goal: "How much? 로 가격을 묻고 물건을 사 보세요",
        demo: [
          ["Hi! Can I help you?", "안녕하세요! 도와드릴까요?", [["Just looking.", "그냥 구경해요."], ["A T-shirt, please.", "티셔츠요."]]],
          ["This T-shirt? Black or white?", "이 티셔츠요? 검은색이요, 흰색이요?", [["White, please.", "흰색이요."], ["Black, please.", "검은색이요."]]],
          ["Here you go.", "여기 있어요.", [["How much?", "얼마예요?"], ["How much is it?", "이거 얼마예요?"]]],
          ["It's ten dollars.", "10달러예요.", [["Okay. I'll take it.", "좋아요. 살게요."], ["Card, okay?", "카드 돼요?"]]],
          ["Thank you! Have a nice day.", "고마워요! 좋은 하루 보내세요.", [["You too!", "당신도요!"]]],
        ],
      },
      elementary: {
        desc: "옷 사이즈, 가격 묻기",
        goal: "찾는 옷과 사이즈를 말하고 가격을 물어보세요",
        demo: [
          ["Hi! Are you looking for anything special?", "안녕하세요! 특별히 찾으시는 게 있나요?", [["I'm looking for a T-shirt.", "티셔츠를 찾고 있어요."], ["Just looking, thanks.", "그냥 둘러보는 중이에요."]]],
          ["What size do you wear?", "어떤 사이즈를 입으세요?", [["Medium, please.", "미디엄이요."], ["I'm not sure.", "잘 모르겠어요."]]],
          ["Here you go. Would you like to try it on?", "여기 있어요. 입어 보시겠어요?", [["Yes, please.", "네, 입어 볼게요."], ["How much is it?", "얼마예요?"]]],
          ["It's twenty dollars. It's on sale today!", "20달러예요. 오늘 할인 중이에요!", [["I'll take it.", "이걸로 살게요."], ["Do you have it in blue?", "파란색도 있나요?"]]],
          ["Great choice! Have a nice day.", "좋은 선택이에요! 좋은 하루 보내세요.", [["Thank you!", "감사합니다!"]]],
        ],
      },
      intermediate: {
        desc: "사이즈 교환과 환불 요청하기",
        goal: "사이즈가 안 맞는 옷을 교환하거나 환불해 달라고 말해 보세요",
        demo: [
          ["Hi, welcome back! How can I help you today?", "다시 오셨네요! 오늘은 뭘 도와드릴까요?", [["I bought this jacket yesterday, but it's a little too tight.", "어제 이 재킷을 샀는데 조금 꽉 껴요."], ["I'd like to return this, if that's possible.", "가능하면 이거 반품하고 싶어요."]]],
          ["I'm sorry to hear that. Do you have the receipt with you?", "저런, 영수증 가지고 계세요?", [["Yes, here it is. I haven't worn it at all.", "네, 여기요. 한 번도 안 입었어요."], ["I think so. Let me check my bag.", "있을 거예요. 가방 좀 볼게요."]]],
          ["Thanks. Would you like to exchange it for a bigger size or get a refund?", "감사합니다. 더 큰 사이즈로 교환하시겠어요, 환불하시겠어요?", [["I'd rather exchange it. Do you have it in a large?", "교환할게요. 라지 있나요?"], ["I'd prefer a refund, since I'm not crazy about the color anyway.", "어차피 색이 썩 마음에 들진 않아서 환불이 좋겠어요."]]],
          ["Let me check. Yes, we have a large in stock. Would you like to try it on first?", "확인해 볼게요. 네, 라지 재고 있어요. 먼저 입어 보시겠어요?", [["Sure, where's the fitting room?", "네, 탈의실이 어디예요?"], ["No need, I'm sure it'll fit.", "괜찮아요, 맞을 거예요."]]],
          ["All set! Thanks for your patience.", "다 됐습니다! 기다려 주셔서 감사해요.", [["Thanks for your help!", "도와주셔서 고마워요!"]]],
        ],
      },
    },
  },
  free: {
    icon: "💬", title: "자유 대화",
    prompt: "Have a relaxed everyday conversation about whatever the learner wants: their day, food, weekend plans, hobbies, opinions.",
    levels: {
      beginner: {
        desc: "기분, 음식처럼 쉬운 주제",
        goal: "좋아하는 것을 I like ~ 로 말해 보세요",
        demo: [
          ["Hi! Are you happy today?", "안녕하세요! 오늘 기분 좋아요?", [["Yes, I'm happy.", "네, 좋아요."], ["I'm tired.", "피곤해요."]]],
          ["Do you like pizza?", "피자 좋아해요?", [["Yes, I like pizza.", "네, 피자 좋아해요."], ["No, I like rice.", "아니요, 밥을 좋아해요."]]],
          ["Me too! Dogs or cats?", "저도요! 강아지요, 고양이요?", [["I like dogs.", "강아지 좋아해요."], ["I like cats.", "고양이 좋아해요."]]],
          ["So cute! Great job today!", "너무 귀여워요! 오늘 잘했어요!", [["Thank you!", "고마워요!"]]],
        ],
      },
      elementary: {
        desc: "오늘 하루, 음식, 주말 계획",
        goal: "오늘 먹은 것과 주말 계획을 말해 보세요",
        demo: [
          ["Hi! How are you today?", "안녕하세요! 오늘 기분 어때요?", [["I'm good, thanks.", "좋아요, 고마워요."], ["I'm a little tired.", "조금 피곤해요."]]],
          ["What did you eat today?", "오늘 뭐 먹었어요?", [["I ate kimchi stew.", "김치찌개 먹었어요."], ["I had a sandwich.", "샌드위치 먹었어요."]]],
          ["Yum! What are your plans for the weekend?", "맛있겠다! 주말 계획이 뭐예요?", [["I will meet my friends.", "친구들을 만날 거예요."], ["I will stay home.", "집에 있을 거예요."]]],
          ["Sounds nice! Your English is getting better.", "좋네요! 영어 실력이 늘고 있어요.", [["Thank you!", "고마워요!"]]],
        ],
      },
      intermediate: {
        desc: "요즘 있었던 일과 생각을 길게 나누기",
        goal: "최근 있었던 일을 하나 골라 무슨 일이었고 기분이 어땠는지 말해 보세요",
        demo: [
          ["Hey! How's your week been so far?", "이번 주는 어땠어요?", [["Pretty busy, actually. I had a big presentation on Monday.", "사실 꽤 바빴어요. 월요일에 큰 발표가 있었거든요."], ["Not bad. It's been pretty relaxing.", "나쁘지 않아요. 꽤 여유로웠어요."]]],
          ["Oh, how did it go? Were you nervous?", "오, 어땠어요? 긴장했어요?", [["I was really nervous at first, but it went better than I expected.", "처음엔 정말 긴장했는데 생각보다 잘됐어요."], ["It was okay, but I think I talked too fast.", "괜찮았는데 너무 빨리 말한 것 같아요."]]],
          ["That's great. What do you do to calm down before something stressful?", "다행이에요. 스트레스 받는 일 앞두고는 어떻게 마음을 가라앉혀요?", [["I usually take a deep breath and practice a few more times.", "보통 심호흡하고 몇 번 더 연습해요."], ["I listen to music. It really helps me focus.", "음악을 들어요. 집중하는 데 정말 도움이 돼요."]]],
          ["Good tip! Do you have anything fun planned to reward yourself?", "좋은 방법이네요! 스스로에게 줄 보상으로 재미있는 계획 있어요?", [["I'm going to try a new restaurant with my friends this weekend.", "이번 주말에 친구들이랑 새로 생긴 식당에 가 보려고요."], ["Not yet. Maybe I'll just sleep in on Saturday.", "아직요. 토요일엔 그냥 늦잠 잘까 봐요."]]],
          ["You deserve it! I really enjoyed chatting with you.", "그럴 자격 있어요! 이야기 정말 즐거웠어요.", [["Me too. Thanks for listening!", "저도요. 들어 줘서 고마워요!"]]],
        ],
      },
    },
  },
};

// 고른 수준에 맞는 상황 정보 (수준 값이 이상하면 왕초보로)
export function scenarioFor(id, level) {
  const sc = SCENARIOS[id] || SCENARIOS.free;
  return { ...sc, ...(sc.levels[level] || sc.levels.beginner) };
}

// 체험 모드: API 키가 없을 때 쓰는 간단한 대본 + 자주 하는 실수 교정
const COMMON_MISTAKES = [
  [/\bi am (go|eat|like|live|work|want)\b/i, (m) => `I ${m[1].toLowerCase()}`, "'am'과 일반동사는 함께 쓰지 않아요."],
  [/\b(he|she|it) (don't)\b/i, (m) => `${m[1]} doesn't`, "he/she/it 뒤에는 doesn't를 써요."],
  [/\b(he|she) (like|want|live|work|go)\b/i, (m) => `${m[1]} ${m[2]}s`, "he/she 뒤의 동사에는 -s를 붙여요."],
  [/\bi (is|are)\b/i, () => "I am", "I 뒤에는 am을 써요."],
  [/\byesterday i (go|eat|meet|see)\b/i, (m) => `yesterday I ${{ go: "went", eat: "ate", meet: "met", see: "saw" }[m[1].toLowerCase()]}`, "어제 일은 과거형으로 말해요."],
];

// 대화가 끝났을 때 보여 줄 기본 한마디 (체험 대본, 또는 AI가 한마디를 빠뜨렸을 때)
export const FINISH_FEEDBACK = {
  beginner: "짧은 말로도 끝까지 대화했어요! 다음엔 추천 대답을 누르지 말고 직접 말해 보세요.",
  elementary: "완전한 문장으로 잘 대답했어요. 다음엔 대답 뒤에 한 문장을 더 덧붙여 보세요.",
  intermediate: "대화를 자연스럽게 이어 갔어요. 다음엔 because나 actually로 이유와 예를 하나 더 넣어 보세요.",
};

// 대본의 마지막 줄이 써니의 끝인사예요. 그 줄을 말하면 대화가 끝나요.
export function demoReply(scenarioId, history = [], userText = "", level = "beginner") {
  const sc = scenarioFor(scenarioId, level);
  const step = history.filter((t) => t.role === "ai").length;
  const last = sc.demo.length - 1;
  const [reply, reply_ko, sugg] = sc.demo[Math.min(step, last)];
  let correction = null;
  for (const [re, fix, why] of COMMON_MISTAKES) {
    const m = userText.match(re);
    if (m) {
      correction = { original: userText, corrected: userText.replace(re, fix(m)), explanation_ko: why };
      break;
    }
  }
  const done = step > 0 && step >= last;
  return {
    reply,
    reply_ko,
    correction,
    suggestions: done ? [] : sugg.map(([en, ko]) => ({ en, ko })),
    done,
    feedback_ko: done ? FINISH_FEEDBACK[level] || FINISH_FEEDBACK.beginner : "",
    maxTurns: last,
    demo: true,
  };
}
