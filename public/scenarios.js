// 대화 상황(시나리오)과 체험 모드용 대본. 서버와 화면이 함께 사용합니다.
// 상황마다 수준별 설명(desc), 미션(goal), 체험 대본(demo)이 따로 있어요.
// 대본 한 줄은 [써니의 말, 한국어 뜻, [[추천 대답, 뜻], ...]] 이에요. 마지막 줄은 대화를 끝내는 써니의 끝인사예요.
// 상황의 순서가 곧 대화 1~10단계 순서예요. 기록은 "chat:수준:id"로 남으니 id는 바꾸지 마세요.

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
          ["Nice! You did great. See you!", "좋아요! 정말 잘했어요. 또 만나요!", []],
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
          ["That sounds fun! You did a great job today. See you next time!", "재미있겠네요! 오늘 정말 잘했어요. 다음에 또 봐요!", []],
        ],
      },
      intermediate: {
        desc: "영어를 배우는 이유와 요즘 관심사 말하기",
        goal: "영어를 배우는 이유와 요즘 빠져 있는 것을 이유와 함께 말해 보세요",
        demo: [
          ["Hi, I'm Sunny! So, tell me a little bit about yourself.", "안녕하세요, 써니예요! 자기소개 좀 해 주세요.", [["I'm Minji, and I work as a designer in Seoul.", "저는 민지이고, 서울에서 디자이너로 일해요."], ["I'm John. I just moved to Busan for work.", "저는 존이에요. 일 때문에 얼마 전 부산으로 이사 왔어요."]]],
          ["Oh, nice! What made you want to learn English?", "오, 좋네요! 영어를 배우고 싶어진 계기가 뭐예요?", [["I want to travel more, so I'd like to talk with people in English.", "여행을 더 다니고 싶어서 영어로 사람들과 이야기하고 싶어요."], ["I need it for work because I have meetings with foreign clients.", "외국 고객과 회의가 있어서 일 때문에 필요해요."]]],
          ["That makes sense. What do you usually do to relax after a long day?", "그렇군요. 힘든 하루가 끝나면 보통 뭐 하면서 쉬어요?", [["I usually go for a walk and listen to podcasts.", "보통 산책하면서 팟캐스트를 들어요."], ["Honestly, I just binge-watch dramas on Netflix.", "솔직히 넷플릭스에서 드라마를 몰아 봐요."]]],
          ["Ha, I can relate! What's the best podcast or show you've come across lately, and why did you like it?", "하하, 저도 그래요! 요즘 들은 팟캐스트나 본 드라마 중에 제일 좋았던 게 뭐예요? 왜 좋았어요?", [["I really liked a Korean thriller series because the story was so unpredictable.", "이야기를 전혀 예측할 수 없어서 한국 스릴러 드라마가 정말 좋았어요."], ["I love a podcast about travel because it gives me ideas for my next trip.", "다음 여행 아이디어를 얻을 수 있어서 여행 팟캐스트를 정말 좋아해요."]]],
          ["Thanks for sharing! You explain things really clearly, and it was great getting to know you. See you next time!", "얘기해 줘서 고마워요! 설명을 정말 잘하시고, 알게 돼서 정말 반가웠어요. 다음에 또 봬요!", []],
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
          ["Here you go. Enjoy your drink!", "여기 있어요. 맛있게 드세요!", []],
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
          ["Hi there! What can I get started for you today?", "안녕하세요! 오늘 뭘로 준비해 드릴까요?", [["I'm not sure yet. What would you recommend?", "아직 못 정했어요. 뭘 추천하세요?"], ["I usually get an americano, but I'd like to try something new today.", "평소엔 아메리카노를 마시는데, 오늘은 새로운 걸 마셔 보고 싶어요."]]],
          ["Our honey latte is really popular. It's a little sweet, though. Would you like to try it?", "저희 허니 라떼가 인기가 많아요. 조금 달긴 한데, 한번 드셔 보시겠어요?", [["Sure, but could you make it a little less sweet?", "좋아요, 그런데 조금 덜 달게 해 주실 수 있나요?"], ["Sounds good, but can I get it with oat milk instead?", "좋네요, 그런데 오트 밀크로 바꿔 주실 수 있나요?"]]],
          ["Sure, no problem. Would you like anything to eat with that?", "물론이죠. 같이 드실 것도 필요하세요?", [["Sure, I'll have a blueberry muffin, because I skipped breakfast this morning.", "네, 아침을 걸러서 블루베리 머핀 하나 주세요."], ["No, thanks. I just had lunch, so just the drink is fine.", "아니요, 괜찮아요. 방금 점심을 먹어서 음료만 주세요."]]],
          ["Got it. That'll be six fifty. Is this for here or to go?", "알겠습니다. 6달러 50센트예요. 드시고 가세요, 가져가세요?", [["To go, please. Can I pay by card?", "가져갈게요. 카드로 계산할 수 있나요?"], ["For here. Do you have Wi-Fi?", "먹고 갈게요. 와이파이 있나요?"]]],
          ["Of course. Your drink will be ready in a few minutes. Enjoy!", "그럼요. 음료는 몇 분 뒤에 나와요. 맛있게 드세요!", [["Thanks a lot!", "정말 고마워요!"]]],
        ],
      },
    },
  },
  restaurant: {
    icon: "🍽️", title: "식당",
    prompt: "You are a server at a casual American restaurant. Seat the learner, take their drink and food order, answer questions about the menu and handle special requests, then bring the check.",
    levels: {
      beginner: {
        desc: "음식 주문하고 계산하기",
        goal: "~, please 로 음료와 음식을 주문해 보세요",
        demo: [
          ["Hi! Table for two?", "안녕하세요! 두 분이세요?", [["Yes, two.", "네, 두 명이요."], ["No, just one.", "아니요, 한 명이요."]]],
          ["Okay, this way. Water or soda?", "네, 이쪽으로 오세요. 물이요, 탄산음료요?", [["Water, please.", "물 주세요."], ["Soda, please.", "탄산음료 주세요."]]],
          ["Ready to order? Burger or pasta?", "주문하시겠어요? 버거요, 파스타요?", [["Burger, please.", "버거 주세요."], ["Pasta, please.", "파스타 주세요."]]],
          ["Here's your check. Card or cash?", "계산서 여기 있어요. 카드요, 현금이요?", [["Card, please.", "카드로 할게요."], ["Cash. Here you go.", "현금이요. 여기 있어요."]]],
          ["Thank you! Have a great night!", "감사합니다! 좋은 저녁 보내세요!", []],
        ],
      },
      elementary: {
        desc: "메뉴 묻고 주문하고 계산하기",
        goal: "메뉴에 대해 묻고, 주문과 계산서 요청을 문장으로 말해 보세요",
        demo: [
          ["Hi, welcome! Table for how many?", "안녕하세요, 어서 오세요! 몇 분이세요?", [["A table for two, please.", "두 명 자리로 주세요."], ["It's just me today.", "오늘은 저 혼자예요."]]],
          ["Sure, follow me. What would you like to drink?", "네, 이쪽으로 오세요. 음료는 뭘로 드릴까요?", [["Can I have a glass of water?", "물 한 잔 주시겠어요?"], ["I'd like an iced tea, please.", "아이스티로 주세요."]]],
          ["Sure! Our chicken sandwich is really popular. Do you have any questions about the menu?", "네! 저희 치킨 샌드위치가 인기가 많아요. 메뉴 중에 궁금한 거 있으세요?", [["Is the chicken sandwich spicy?", "치킨 샌드위치 매워요?"], ["What comes with the chicken sandwich?", "치킨 샌드위치에는 뭐가 같이 나와요?"]]],
          ["It's a little spicy, and it comes with fries. Would you like to try it?", "조금 맵고, 감자튀김이 같이 나와요. 한번 드셔 보실래요?", [["Sure, I'll have the chicken sandwich.", "네, 치킨 샌드위치로 할게요."], ["No, thanks. I'll have the cheeseburger.", "아니요, 괜찮아요. 치즈버거로 할게요."]]],
          ["How was everything? Can I get you anything else?", "식사는 어떠셨어요? 더 필요한 건 없으세요?", [["It was great. Can I get the check, please?", "정말 좋았어요. 계산서 좀 주시겠어요?"], ["Everything was delicious. Just the check, please.", "다 맛있었어요. 계산서만 주세요."]]],
          ["Here's your check. Thanks for coming in, and have a great night!", "계산서 여기 있어요. 와 주셔서 감사해요. 좋은 저녁 보내세요!", []],
        ],
      },
      intermediate: {
        desc: "메뉴 묻고 원하는 대로 바꿔 주문하기",
        goal: "음식이 어떤지 물어보고, 양파 빼기나 드레싱 따로 같은 요청을 해 보세요",
        demo: [
          ["Hi there, welcome in! How many are in your party tonight?", "안녕하세요, 어서 오세요! 오늘 일행이 몇 분이세요?", [["There are two of us. Could we get a booth by the window, if one's free?", "두 명이에요. 창가 쪽 부스 자리가 비어 있으면 거기 앉을 수 있을까요?"], ["There'll be three of us, but one of my friends is running a little late.", "세 명인데, 친구 한 명이 좀 늦을 거예요."]]],
          ["No problem, right this way. Can I start you off with something to drink while you look over the menu?", "그럼요, 이쪽으로 오세요. 메뉴 보시는 동안 음료 먼저 드릴까요?", [["I'll just have water for now, because I'm trying to cut back on soda.", "탄산음료를 줄이는 중이라 일단 물만 주세요."], ["Could I get an iced tea, please? It's really hot out there today.", "아이스티 한 잔 주시겠어요? 오늘 밖이 정말 덥네요."]]],
          ["Sure thing, I'll be right back with that. So, does anything on the menu catch your eye?", "네, 금방 가져다드릴게요. 메뉴 중에 눈에 들어오는 거 있으세요?", [["The grilled chicken salad looks good, but is it filling enough for dinner?", "그릴드 치킨 샐러드가 맛있어 보이는데, 저녁으로 먹어도 배부를까요?"], ["Actually, I'm curious about the grilled chicken salad. What kind of dressing comes with it?", "사실 그릴드 치킨 샐러드가 궁금해요. 드레싱은 어떤 게 같이 나와요?"]]],
          ["Oh, that's one of my favorites! It's pretty filling, and it comes with avocado, red onions, and our house ranch dressing. Does that sound good, or would you like to change anything?", "오, 제가 정말 좋아하는 메뉴예요! 양이 꽤 든든하고, 아보카도랑 적양파가 들어가고 저희 집 랜치 드레싱이 같이 나와요. 그대로 괜찮으세요, 아니면 바꾸고 싶은 게 있으세요?", [["That sounds great, but could I get it with no onions and the dressing on the side?", "좋네요. 그런데 양파는 빼고 드레싱은 따로 주실 수 있나요?"], ["I'll go with that, but I'm not a big fan of onions, so could you leave them off?", "그걸로 할게요. 그런데 양파를 별로 안 좋아해서 빼 주실 수 있을까요?"]]],
          ["How was everything tonight? Will this be on one check, or would you like separate checks?", "오늘 식사는 어떠셨어요? 한 번에 계산해 드릴까요, 따로 계산해 드릴까요?", [["Everything was delicious, thanks. Could we get separate checks, please?", "다 정말 맛있었어요, 감사해요. 따로 계산해 주시겠어요?"], ["It was amazing, thanks! One check is fine, because it's my treat tonight.", "정말 맛있었어요, 고마워요! 오늘은 제가 사는 거라 한 번에 계산할게요."]]],
          ["So glad you enjoyed it! I'll bring that right over. Thanks so much for coming in, and enjoy the rest of your evening!", "맛있게 드셨다니 정말 다행이에요! 바로 가져다드릴게요. 와 주셔서 감사하고, 남은 저녁 즐겁게 보내세요!", []],
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
          ["How about this? Black or white?", "이건 어때요? 검은색이요, 흰색이요?", [["White, please.", "흰색이요."], ["Black, please.", "검은색이요."]]],
          ["Here you go.", "여기 있어요.", [["How much?", "얼마예요?"], ["How much is it?", "이거 얼마예요?"]]],
          ["It's ten dollars.", "10달러예요.", [["Okay. I'll take it.", "좋아요. 살게요."], ["Is card okay?", "카드 돼요?"]]],
          ["Thank you! Have a nice day.", "고마워요! 좋은 하루 보내세요.", [["You too!", "당신도요!"]]],
        ],
      },
      elementary: {
        desc: "옷 사이즈, 가격 묻기",
        goal: "찾는 옷과 사이즈를 말하고 가격을 물어보세요",
        demo: [
          ["Hi! Are you looking for anything special?", "안녕하세요! 특별히 찾으시는 게 있나요?", [["I'm looking for a T-shirt.", "티셔츠를 찾고 있어요."], ["Just looking, thanks.", "그냥 둘러보는 중이에요."]]],
          ["Okay! We have some new T-shirts. What size do you wear?", "네! 새로 들어온 티셔츠가 있어요. 어떤 사이즈 입으세요?", [["I usually wear a medium.", "보통 미디엄을 입어요."], ["I'm not sure. Maybe a large?", "잘 모르겠어요. 라지일까요?"]]],
          ["Here you go. Would you like to try it on?", "여기 있어요. 입어 보시겠어요?", [["Yes, please. How much is it?", "네, 입어 볼게요. 얼마예요?"], ["No, thanks. How much is it?", "아니요, 괜찮아요. 얼마예요?"]]],
          ["It's twenty dollars. It's on sale today! Would you like to get it?", "20달러예요. 오늘 할인 중이에요! 이걸로 하시겠어요?", [["Yes, I'll take it.", "네, 이걸로 살게요."], ["Yes, I'll pay by card.", "네, 카드로 계산할게요."]]],
          ["Great choice! Have a nice day.", "좋은 선택이에요! 좋은 하루 보내세요.", [["Thank you!", "감사합니다!"]]],
        ],
      },
      intermediate: {
        desc: "사이즈 교환과 환불 요청하기",
        goal: "사이즈가 안 맞는 옷을 교환하거나 환불해 달라고 말해 보세요",
        demo: [
          ["Hi, welcome back! How can I help you today?", "다시 오셨네요! 오늘은 뭘 도와드릴까요?", [["I bought this jacket yesterday, but it's a little too tight.", "어제 이 재킷을 샀는데 조금 꽉 껴요."], ["I'd like to return this jacket, because it's too small for me.", "이 재킷이 너무 작아서 반품하고 싶어요."]]],
          ["I'm sorry to hear that. Do you have the receipt with you?", "저런, 영수증 가지고 계세요?", [["Yes, here it is. I haven't worn it at all.", "네, 여기요. 한 번도 안 입었어요."], ["I think so. Let me check my bag.", "있을 거예요. 가방 좀 볼게요."]]],
          ["Thanks. Would you like to exchange it for a bigger size or get a refund?", "감사합니다. 더 큰 사이즈로 교환하시겠어요, 환불하시겠어요?", [["I'd rather exchange it. Do you have it in a large?", "교환할게요. 라지 있나요?"], ["I was going to ask for a refund, but I'll exchange it if you have a large.", "환불받으려고 했는데, 라지가 있으면 교환할게요."]]],
          ["Let me check. Yes, we have a large in stock. Would you like to try it on first?", "확인해 볼게요. 네, 라지 재고 있어요. 먼저 입어 보시겠어요?", [["No need. I'm sure it'll fit, because I usually wear a large.", "괜찮아요. 평소에 라지를 입어서 맞을 거예요."], ["That's okay. I'm actually in a bit of a hurry, so I'll just take it.", "괜찮아요. 사실 좀 급해서 그냥 가져갈게요."]]],
          ["All set! Thanks for your patience.", "다 됐습니다! 기다려 주셔서 감사해요.", [["Thanks for your help!", "도와주셔서 고마워요!"]]],
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
          ["Go straight, then turn left. Okay?", "쭉 가다가 왼쪽으로 도세요. 아시겠죠?", [["Straight, then left?", "쭉 가서 왼쪽이요?"], ["Okay! Is it close?", "알겠어요! 가까워요?"]]],
          ["Yes! It's very close. Good luck!", "네! 아주 가까워요. 잘 찾아가세요!", []],
        ],
      },
      elementary: {
        desc: "역, 화장실, 장소 찾기",
        goal: "가고 싶은 곳을 묻고, 얼마나 먼지 물어보세요",
        demo: [
          ["Hi! You look lost. Can I help you?", "안녕하세요! 길을 잃으신 것 같네요. 도와드릴까요?", [["Where is the subway station?", "지하철역이 어디예요?"], ["I'm looking for a bank.", "은행을 찾고 있어요."]]],
          ["Go straight two blocks, then turn left.", "두 블록 직진한 다음 왼쪽으로 도세요.", [["Is it far from here?", "여기서 멀어요?"], ["How long does it take?", "얼마나 걸려요?"]]],
          ["It's close. It's only about five minutes on foot. Do you need anything else?", "가까워요. 걸어서 5분밖에 안 걸려요. 더 필요한 거 있으세요?", [["No, that's all. Thank you so much!", "아니요, 그거면 돼요. 정말 감사합니다!"], ["I'm okay now. Thanks for your help!", "이제 괜찮아요. 도와주셔서 감사해요!"]]],
          ["You're welcome! Enjoy your trip!", "별말씀을요! 즐거운 여행 하세요!", []],
        ],
      },
      intermediate: {
        desc: "교통편 비교하고 갈아타는 법 묻기",
        goal: "가는 방법을 두 가지 이상 물어보고 더 나은 쪽을 골라 보세요",
        demo: [
          ["Hey, you look a little lost. Can I help you find something?", "길을 좀 헤매시는 것 같네요. 찾는 거 도와드릴까요?", [["Yes, I'm trying to get to Central Park, but my phone died.", "센트럴 파크에 가려는데 휴대폰이 꺼졌어요."], ["Thanks! What's the best way to get to Central Park from here?", "고마워요! 여기서 센트럴 파크까지 어떻게 가는 게 제일 좋아요?"]]],
          ["You could walk, but it takes about twenty minutes. The subway is much faster. Want me to tell you which train to take?", "걸어갈 수도 있는데 20분쯤 걸려요. 지하철이 훨씬 빨라요. 어떤 열차를 타면 되는지 알려 드릴까요?", [["Yes, please. Which line should I take, and where do I get off?", "네, 부탁해요. 어느 노선을 타고 어디서 내려야 하나요?"], ["That would be great, because I'm actually in a bit of a hurry.", "그래 주시면 좋겠어요. 사실 좀 급하거든요."]]],
          ["Take the C train uptown and get off at 72nd Street. It's just three stops.", "C선 업타운 방향을 타고 72번가에서 내리세요. 세 정거장이에요.", [["Do I need to transfer, or is it a direct train?", "갈아타야 하나요, 아니면 한 번에 가나요?"], ["Great. Where can I buy a ticket?", "좋아요. 표는 어디서 사나요?"]]],
          ["It's a direct train, and you don't need a ticket. Just tap your card or phone at the gate. Does that make sense?", "한 번에 가는 열차고, 표는 따로 필요 없어요. 개찰구에서 카드나 휴대폰을 찍기만 하면 돼요. 이해되세요?", [["Yes, that's really helpful. Thanks for explaining it so clearly!", "네, 정말 도움 됐어요. 쉽게 설명해 주셔서 고마워요!"], ["Totally. I didn't know I could just use my phone, so thanks a lot!", "네, 완벽해요. 휴대폰으로 바로 되는 줄 몰랐는데, 정말 고마워요!"]]],
          ["Anytime! Enjoy the park. The weather's perfect for a walk.", "언제든지요! 공원 즐기세요. 산책하기 딱 좋은 날씨예요.", [["Thanks, have a good one!", "고마워요, 좋은 하루 보내세요!"]]],
        ],
      },
    },
  },
  weekend: {
    icon: "🎨", title: "주말과 취미",
    prompt: "You are the learner's friendly coworker or classmate, chatting on a Monday morning. Ask about their weekend and hobbies: what they did, what they enjoy and why, and swap recommendations.",
    levels: {
      beginner: {
        desc: "좋아하는 것과 주말 이야기",
        goal: "Yes, I do. 와 I like ~ 로 좋아하는 것을 짧게 말해 보세요",
        demo: [
          ["Hi! Good weekend?", "안녕하세요! 주말 잘 보냈어요?", [["Yes, it was great!", "네, 정말 좋았어요!"], ["It was okay.", "그냥 그랬어요."]]],
          ["Do you go out on weekends?", "주말에는 보통 밖에 나가요?", [["Yes, I do.", "네, 나가요."], ["No, I stay home.", "아니요, 집에 있어요."]]],
          ["Cool! Do you like movies?", "좋네요! 영화 좋아해요?", [["Yes, I love movies!", "네, 영화 정말 좋아해요!"], ["Not really.", "별로 안 좋아해요."]]],
          ["Music or books? Which do you like?", "음악이랑 책 중에선 뭐가 좋아요?", [["I like music.", "음악이 좋아요."], ["I like books.", "책이 좋아요."]]],
          ["Me too! Great job. See you!", "저도요! 아주 잘했어요. 이따 봐요!", []],
        ],
      },
      elementary: {
        desc: "주말에 한 일과 취미 말하기",
        goal: "주말에 한 일을 과거형 문장으로 말하고, 좋아하는 취미도 소개해 보세요",
        demo: [
          ["Good morning! How was your weekend?", "좋은 아침이에요! 주말 어떻게 보냈어요?", [["It was great, thanks.", "좋았어요, 고마워요."], ["It was busy but fun.", "바빴지만 재미있었어요."]]],
          ["Great! What did you do on Saturday?", "좋네요! 토요일에는 뭐 했어요?", [["I went hiking with my friends.", "친구들이랑 등산 갔어요."], ["I watched a movie at home.", "집에서 영화를 봤어요."]]],
          ["That sounds fun! What did you do on Sunday?", "재미있었겠네요! 일요일에는 뭐 했어요?", [["I cleaned my room and relaxed.", "방 청소하고 쉬었어요."], ["I had lunch with my family.", "가족이랑 점심을 먹었어요."]]],
          ["Nice! So, what's your favorite hobby?", "좋네요! 그럼 제일 좋아하는 취미는 뭐예요?", [["I like taking pictures of nature.", "자연 사진 찍는 걸 좋아해요."], ["My favorite hobby is cooking.", "제일 좋아하는 취미는 요리예요."]]],
          ["Cool! When do you usually do it?", "멋지네요! 보통 언제 해요?", [["I usually do it on weekends.", "보통 주말에 해요."], ["I do it every evening after work.", "매일 저녁 퇴근하고 해요."]]],
          ["Sounds great! You speak English really well. Have a good week!", "좋네요! 영어 정말 잘하시네요. 이번 주도 잘 보내요!", []],
        ],
      },
      intermediate: {
        desc: "주말 이야기 들려주고 취미 추천하기",
        goal: "주말에 있었던 일을 이야기처럼 들려주고, 취미를 좋아하는 이유와 추천을 말해 보세요",
        demo: [
          ["Morning! You look pretty relaxed for a Monday. How was your weekend?", "좋은 아침이에요! 월요일치고 꽤 여유로워 보이네요. 주말 어땠어요?", [["It was great, actually. I finally went hiking on that trail everyone keeps talking about.", "사실 정말 좋았어요. 다들 얘기하던 그 등산로에 드디어 가 봤거든요."], ["Pretty good. I tried baking bread for the first time, so it was kind of an adventure.", "꽤 좋았어요. 처음으로 빵을 구워 봐서 나름 모험이었어요."]]],
          ["Ooh, now I'm curious! How did it go?", "오, 궁금해지네요! 어땠어요?", [["It started raining halfway up, but we kept going, and the view was totally worth it.", "중간에 비가 오기 시작했는데 그래도 계속 올라갔고, 경치가 고생한 보람이 있었어요."], ["Honestly, I burned the first loaf, but the second one turned out pretty well.", "솔직히 첫 번째 빵은 태웠는데, 두 번째는 꽤 잘 나왔어요."]]],
          ["Ha, that's the spirit! So what do you enjoy most about it?", "하하, 바로 그 자세예요! 그럼 그걸 할 때 뭐가 제일 좋아요?", [["I love being outside because it helps me clear my head after a stressful week.", "밖에 있는 게 좋아요. 스트레스 많은 한 주를 보내고 나면 머리가 맑아지거든요."], ["It's really relaxing, so it's a nice break from staring at screens all day.", "마음이 정말 편해져서, 하루 종일 화면만 보다가 쉬어 가기에 딱 좋아요."]]],
          ["I totally get that. I've been looking for a new hobby myself. What would you recommend for a complete beginner like me?", "정말 공감돼요. 저도 요즘 새 취미를 찾고 있거든요. 저 같은 완전 초보한테는 뭘 추천해요?", [["I'd recommend hiking, because you don't need much gear. Just start with a short, easy trail.", "등산을 추천해요. 장비가 별로 필요 없거든요. 짧고 쉬운 코스부터 시작해 보세요."], ["I'd recommend baking cookies first. They're hard to mess up, so you'll feel confident quickly.", "처음엔 쿠키부터 구워 보는 걸 추천해요. 망치기 어려워서 금방 자신감이 붙을 거예요."]]],
          ["Oh, I love that idea! Would you be up for doing it together sometime?", "오, 그거 좋네요! 언제 한번 같이 해 볼래요?", [["Sure, I'd love that! How about this Saturday afternoon, if you're free?", "좋죠! 시간 괜찮으면 이번 토요일 오후 어때요?"], ["I'd love to, but this weekend is packed. Could we do it next weekend instead?", "그러고 싶은데 이번 주말은 일정이 꽉 찼어요. 대신 다음 주말에 해도 될까요?"]]],
          ["It's a plan, then! You're a great storyteller, by the way. Talk to you later!", "그럼 그렇게 해요! 그나저나 이야기를 정말 재미있게 하시네요. 이따 또 얘기해요!", []],
        ],
      },
    },
  },
  hotel: {
    icon: "🏨", title: "호텔",
    prompt: "You are a front desk clerk at a hotel. Check the learner in (name on the reservation, number of nights, breakfast, Wi-Fi, room key), or help them with a problem in their room, such as noise, a broken air conditioner or the wrong bed type, by offering a room change or a late checkout.",
    levels: {
      beginner: {
        desc: "체크인하고 와이파이 묻기",
        goal: "체크인하고 Wi-Fi password? 로 비밀번호를 물어보세요",
        demo: [
          ["Hi! Checking in? Your name, please.", "안녕하세요! 체크인하세요? 성함이 어떻게 되세요?", [["Yes. Minji Kim.", "네. 김민지예요."], ["I'm John Lee.", "저는 존 리예요."]]],
          ["Thanks! One night or two?", "감사합니다! 1박이세요, 2박이세요?", [["Two nights.", "2박이요."], ["One night.", "1박이요."]]],
          ["Great. Would you like breakfast?", "알겠습니다. 조식 드시겠어요?", [["Yes, please.", "네, 주세요."], ["No, thank you.", "아니요, 괜찮아요."]]],
          ["Okay! Here's your key. Any questions?", "네! 여기 방 키예요. 궁금한 거 있으세요?", [["Wi-Fi password?", "와이파이 비밀번호요?"], ["What's the Wi-Fi password?", "와이파이 비밀번호가 뭐예요?"]]],
          ["It's your room number. Enjoy your stay!", "비밀번호는 방 번호예요. 즐거운 시간 보내세요!", []],
        ],
      },
      elementary: {
        desc: "체크인하며 조식과 와이파이 묻기",
        goal: "예약자 이름과 며칠 묵을지 문장으로 말하고, 조식과 와이파이도 물어보세요",
        demo: [
          ["Good evening, and welcome! What name is the reservation under?", "안녕하세요, 어서 오세요! 예약하신 분 성함이 어떻게 되세요?", [["It's under Minji Kim.", "김민지 이름으로 예약했어요."], ["The reservation is under John Lee.", "존 리 이름으로 예약돼 있어요."]]],
          ["Thank you, let me check. How many nights are you staying?", "감사합니다, 확인해 볼게요. 몇 박 묵으세요?", [["I'm staying for two nights.", "2박 묵을 거예요."], ["I'll be here for three nights.", "3박 있을 거예요."]]],
          ["Perfect. Here's your key card. Your room is on the fifth floor. Do you have any questions?", "알겠습니다. 여기 카드 키 드릴게요. 방은 5층이에요. 궁금한 거 있으세요?", [["What time is breakfast?", "조식은 몇 시예요?"], ["Where can I have breakfast?", "조식은 어디서 먹어요?"]]],
          ["Breakfast is from seven to ten in the lobby restaurant. Anything else?", "조식은 7시부터 10시까지 로비 레스토랑에서 드실 수 있어요. 또 궁금한 거 있으세요?", [["What's the Wi-Fi password?", "와이파이 비밀번호가 뭐예요?"], ["Can I use the Wi-Fi in my room?", "방에서도 와이파이를 쓸 수 있어요?"]]],
          ["The Wi-Fi is free in every room. The password is on your key card. Would you like a wake-up call tomorrow?", "와이파이는 모든 객실에서 무료예요. 비밀번호는 카드 키에 적혀 있어요. 내일 모닝콜 해 드릴까요?", [["Yes, please call me at seven.", "네, 7시에 깨워 주세요."], ["No, thanks. I'll use my phone alarm.", "아니요, 괜찮아요. 휴대폰 알람 쓸게요."]]],
          ["All right. Have a good night, and enjoy your stay!", "알겠습니다. 좋은 밤 보내시고, 편히 쉬다 가세요!", []],
        ],
      },
      intermediate: {
        desc: "방 문제 알리고 늦은 체크아웃 요청하기",
        goal: "방에 생긴 문제를 구체적으로 설명하고, 방 교체와 늦은 체크아웃을 정중하게 부탁해 보세요",
        demo: [
          ["Good morning! How was your first night with us?", "안녕하세요! 첫날 밤은 잘 보내셨어요?", [["Not great, actually. The air conditioner isn't working, so I couldn't sleep at all.", "사실 별로였어요. 에어컨이 안 돼서 한숨도 못 잤어요."], ["To be honest, it was pretty noisy because my room is right next to the elevator.", "솔직히 방이 엘리베이터 바로 옆이라서 꽤 시끄러웠어요."]]],
          ["Oh no, I'm so sorry about that. I'd be happy to move you to another room. What kind of room would work best for you?", "저런, 정말 죄송합니다. 다른 방으로 옮겨 드릴게요. 어떤 방으로 해 드릴까요?", [["Could I get a quiet room on a higher floor, if one's available?", "가능하면 높은 층에 있는 조용한 방으로 주실 수 있을까요?"], ["Actually, I booked a king bed but got two twin beds, so a king room would be great.", "사실 킹 침대로 예약했는데 트윈 룸을 받았어요. 그래서 킹 침대 방이면 좋겠어요."]]],
          ["Good news! We have a quiet king room on the tenth floor. It won't be ready until two o'clock, though. How does that sound?", "다행히 10층에 조용한 킹 침대 방이 있어요. 다만 2시는 돼야 준비가 끝나요. 괜찮으세요?", [["That sounds great, but could someone help me move my bags?", "좋아요. 그런데 짐 옮기는 것 좀 도와주실 수 있을까요?"], ["That works for me, so I'll head out for lunch and come back after two.", "괜찮아요. 그럼 점심 먹으러 나갔다가 2시 넘어서 올게요."]]],
          ["Great. We'll take care of your bags for you, and your new key will be ready at two. Is there anything else I can do to make up for the trouble?", "좋아요. 짐은 저희가 옮겨 드리고, 새 키는 2시에 준비해 둘게요. 불편을 드렸는데, 저희가 더 해 드릴 수 있는 게 있을까요?", [["Actually, would it be possible to get a late checkout on my last day?", "실은 마지막 날에 체크아웃을 늦게 할 수 있을까요?"], ["My flight isn't until the evening, so could I check out a little later?", "비행기가 저녁이라서 조금 늦게 체크아웃해도 될까요?"]]],
          ["Absolutely. I'll extend your checkout to one o'clock at no extra charge. Thanks for being so understanding, and enjoy the rest of your stay!", "물론이죠. 추가 요금 없이 체크아웃을 1시로 늦춰 드릴게요. 이해해 주셔서 감사하고, 남은 기간도 편히 쉬다 가세요!", []],
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
          ["How long are you planning to stay, and where will you be staying?", "얼마나 머무를 예정이고, 어디서 지내시나요?", [["About two weeks. I booked a hotel near Times Square.", "2주 정도요. 타임스스퀘어 근처 호텔을 예약했어요."], ["Just five days. My company booked me a hotel near the conference center.", "5일만요. 회사에서 학회장 근처 호텔을 잡아 줬어요."]]],
          ["Have you been to the U.S. before?", "전에 미국에 와 본 적 있나요?", [["Yes, I came here once for a family trip three years ago.", "네, 3년 전에 가족 여행으로 한 번 왔어요."], ["No, this is my first time, so I'm pretty excited.", "아니요, 처음이라 꽤 설레요."]]],
          ["Do you have a return ticket?", "돌아가는 항공권 있나요?", [["Yes, I'm flying back to Seoul on the twentieth.", "네, 20일에 서울로 돌아가요."], ["Yes, here's my itinerary.", "네, 여기 일정표요."]]],
          ["Everything looks fine. Enjoy your stay.", "모두 괜찮네요. 즐거운 시간 보내세요.", [["Thank you. Have a nice day!", "고마워요. 좋은 하루 보내세요!"]]],
        ],
      },
    },
  },
  pharmacy: {
    icon: "💊", title: "약국",
    prompt: "You are a pharmacist at a drugstore. Ask about the learner's symptoms, how long and how bad they are, and any allergies or other medicines, then suggest a common over-the-counter medicine, explain how to take it, and advise seeing a doctor if it gets worse, keeping all medical advice general.",
    levels: {
      beginner: {
        desc: "아픈 곳 말하고 약 사기",
        goal: "I have a ~ 로 아픈 곳을 말하고 약을 사 보세요",
        demo: [
          ["Hi! Not feeling well?", "안녕하세요! 몸이 안 좋으세요?", [["I have a headache.", "머리가 아파요."], ["I have a cold.", "감기에 걸렸어요."]]],
          ["Oh no! A fever, too?", "저런! 열도 나요?", [["Yes, a little.", "네, 조금요."], ["No, no fever.", "아니요, 열은 없어요."]]],
          ["Okay. Pills or liquid?", "알겠어요. 알약이요, 물약이요?", [["Pills, please.", "알약으로 주세요."], ["Liquid, please.", "물약으로 주세요."]]],
          ["Three times a day, okay?", "하루에 세 번 드세요. 아셨죠?", [["Okay. How much?", "알겠어요. 얼마예요?"], ["Okay, thank you.", "네, 고마워요."]]],
          ["Five dollars. Feel better soon!", "5달러예요. 얼른 나으세요!", []],
        ],
      },
      elementary: {
        desc: "증상 말하고 약 먹는 법 묻기",
        goal: "어디가 언제부터 아픈지 문장으로 말하고, 약 먹는 법을 물어보세요",
        demo: [
          ["Hi there! How can I help you today?", "안녕하세요! 오늘 뭘 도와드릴까요?", [["I have a bad headache.", "머리가 많이 아파요."], ["I have a sore throat and a cough.", "목이 아프고 기침이 나요."]]],
          ["Oh, I'm sorry. When did it start?", "저런, 힘드시겠어요. 언제부터 아프셨어요?", [["It started this morning.", "오늘 아침부터요."], ["It started two days ago.", "이틀 전부터요."]]],
          ["I see. Do you have a fever, too?", "그렇군요. 열도 있으세요?", [["No, I don't have a fever.", "아니요, 열은 없어요."], ["Yes, I think I have a fever.", "네, 열이 있는 것 같아요."]]],
          ["Okay. This medicine should help. Do you have any questions?", "알겠어요. 이 약이 잘 들을 거예요. 궁금한 점 있으세요?", [["How often do I take it?", "얼마나 자주 먹어요?"], ["Do I take it with food?", "밥이랑 같이 먹어야 해요?"]]],
          ["Take one pill three times a day, after meals. Is that all for today?", "하루 세 번, 식후에 한 알씩 드세요. 오늘은 이거면 되세요?", [["Yes, that's all. How much is it?", "네, 이거면 돼요. 얼마예요?"], ["Yes, thank you for your help.", "네, 도와주셔서 감사해요."]]],
          ["That's eight dollars. Please see a doctor if it gets worse. Feel better soon!", "8달러예요. 더 심해지면 꼭 병원에 가 보세요. 얼른 나으세요!", []],
        ],
      },
      intermediate: {
        desc: "증상 자세히 설명하고 복용법·부작용 묻기",
        goal: "증상이 언제부터 얼마나 심한지 설명하고, 약의 부작용이나 복용법을 물어보세요",
        demo: [
          ["Hi there! You look a little under the weather. What seems to be the problem?", "안녕하세요! 몸이 좀 안 좋아 보이시네요. 어디가 불편하세요?", [["I've had a sore throat and a runny nose since Monday, and it's not going away.", "월요일부터 목이 아프고 콧물이 나는데 낫질 않아요."], ["I keep getting headaches, and they've been bothering me for three days now.", "두통이 계속 와서 벌써 사흘째 고생하고 있어요."]]],
          ["Oh no, that sounds rough. How bad is it, and have you taken anything for it yet?", "저런, 힘드시겠어요. 얼마나 심하세요? 약은 좀 드셔 보셨어요?", [["It's not terrible, but it keeps me up at night. I haven't taken anything yet.", "아주 심하진 않은데 밤에 잠을 설쳐요. 아직 아무 약도 안 먹었어요."], ["It's pretty bad, actually. I took a painkiller yesterday, but it didn't really help.", "사실 꽤 심해요. 어제 진통제를 먹었는데 별로 효과가 없었어요."]]],
          ["Got it. Before I recommend anything, are you allergic to any medicine, or taking anything else right now?", "알겠어요. 약을 추천해 드리기 전에, 혹시 약 알레르기가 있거나 지금 드시는 다른 약이 있나요?", [["Actually, I'm allergic to aspirin, so I need something without it.", "사실 아스피린 알레르기가 있어서 아스피린이 안 들어간 약이 필요해요."], ["No allergies, and I'm not taking any other medicine right now.", "알레르기는 없고, 지금 먹는 다른 약도 없어요."]]],
          ["Good to know. In that case, I'd go with this one, since it works well for colds and headaches. Do you have any questions about it?", "알겠어요. 그렇다면 이 약이 좋겠어요. 감기랑 두통에 잘 듣거든요. 궁금한 점 있으세요?", [["Does it have any side effects? I'm asking because I have to drive tomorrow.", "부작용이 있나요? 내일 운전을 해야 해서 여쭤봐요."], ["Could you tell me how often to take it? Is it okay to take on an empty stomach?", "얼마나 자주 먹으면 되는지 알려 주실래요? 빈속에 먹어도 괜찮나요?"]]],
          ["Take one tablet every six hours, with food. It might make you a little drowsy, so don't drive right after you take it. Any other questions?", "여섯 시간마다 한 알씩 식사와 함께 드세요. 조금 졸릴 수 있으니 드시고 바로 운전하진 마세요. 더 궁금한 거 있으세요?", [["Actually, just one more. What should I do if it doesn't get any better?", "사실 하나만 더요. 계속 안 나으면 어떻게 해야 하나요?"], ["No, that's all, thanks. I'll take it with dinner, since I won't be driving tonight.", "아니요, 그게 다예요. 오늘 밤엔 운전할 일이 없으니 저녁 먹을 때 먹을게요."]]],
          ["If it doesn't clear up in a few days, please see a doctor. You explained your symptoms really clearly, by the way. Take it easy and feel better soon!", "며칠이 지나도 낫지 않으면 꼭 병원에 가 보세요. 참, 증상을 정말 알기 쉽게 설명해 주셨어요. 푹 쉬시고 얼른 나으세요!", []],
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
          ["Hi! Are you having a good day?", "안녕하세요! 오늘 하루 잘 보내고 있어요?", [["Yes, I am.", "네, 좋아요."], ["No, I'm tired.", "아니요, 피곤해요."]]],
          ["Do you like pizza?", "피자 좋아해요?", [["Yes, I like pizza.", "네, 피자 좋아해요."], ["No, I like rice.", "아니요, 밥을 좋아해요."]]],
          ["Me too! Dogs or cats?", "저도요! 강아지요, 고양이요?", [["I like dogs.", "강아지 좋아해요."], ["I like cats.", "고양이 좋아해요."]]],
          ["So cute! Great job. See you!", "너무 귀여워요! 정말 잘했어요. 또 만나요!", []],
        ],
      },
      elementary: {
        desc: "오늘 하루, 음식, 주말 계획",
        goal: "오늘 먹은 것과 주말 계획을 말해 보세요",
        demo: [
          ["Hi! How are you today?", "안녕하세요! 오늘 기분 어때요?", [["I'm good, thanks.", "좋아요, 고마워요."], ["I'm a little tired.", "조금 피곤해요."]]],
          ["What did you eat today?", "오늘 뭐 먹었어요?", [["I ate kimchi stew.", "김치찌개 먹었어요."], ["I had a sandwich.", "샌드위치 먹었어요."]]],
          ["Yum! What are your plans for the weekend?", "맛있겠다! 주말 계획이 뭐예요?", [["I'm going to meet my friends.", "친구들을 만날 거예요."], ["I'm going to stay home and rest.", "집에서 쉴 거예요."]]],
          ["Sounds nice! Your English is getting better. Have a great weekend!", "좋네요! 영어 실력이 점점 늘고 있어요. 주말 잘 보내세요!", []],
        ],
      },
      intermediate: {
        desc: "요즘 있었던 일과 생각을 길게 나누기",
        goal: "최근 있었던 일을 하나 골라 무슨 일이었고 기분이 어땠는지 말해 보세요",
        demo: [
          ["Hey! How's your week been so far?", "이번 주는 지금까지 어땠어요?", [["Pretty busy, actually. I had a big presentation on Monday.", "사실 꽤 바빴어요. 월요일에 큰 발표가 있었거든요."], ["Not bad. I had a job interview yesterday, so I'm glad it's over.", "나쁘지 않아요. 어제 면접이 있었는데 끝나서 후련해요."]]],
          ["Oh, how did it go? Were you nervous?", "오, 어땠어요? 긴장했어요?", [["I was really nervous at first, but it went better than I expected.", "처음엔 정말 긴장했는데 생각보다 잘됐어요."], ["It was okay, but I think I talked too fast.", "괜찮았는데 너무 빨리 말한 것 같아요."]]],
          ["Good for you for getting through it! What do you usually do to calm your nerves before something stressful?", "그래도 잘 해냈네요! 스트레스 받는 일을 앞두고는 보통 어떻게 긴장을 풀어요?", [["I usually take a deep breath and practice a few more times.", "보통 심호흡하고 몇 번 더 연습해요."], ["I listen to music because it really helps me relax and focus.", "긴장이 풀리고 집중하는 데 도움이 돼서 음악을 들어요."]]],
          ["Good tip! Do you have anything fun planned to reward yourself?", "좋은 방법이네요! 스스로에게 줄 보상으로 재미있는 계획 있어요?", [["I'm going to try a new restaurant with my friends this weekend.", "이번 주말에 친구들이랑 새로 생긴 식당에 가 보려고요."], ["Not yet. Maybe I'll just sleep in on Saturday.", "아직요. 토요일엔 그냥 늦잠 잘까 봐요."]]],
          ["You deserve it! I really enjoyed chatting with you.", "그럴 자격 있어요! 이야기 정말 즐거웠어요.", [["Me too. Thanks for listening!", "저도요. 들어 줘서 고마워요!"]]],
        ],
      },
    },
  },
};

// 고른 수준에 맞는 상황 정보 (수준 값이 이상하면 왕초보로)
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
export function scenarioFor(id, level) {
  const sc = has(SCENARIOS, id) ? SCENARIOS[id] : SCENARIOS.free;
  return { ...sc, ...(has(sc.levels, level) ? sc.levels[level] : sc.levels.beginner) };
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
