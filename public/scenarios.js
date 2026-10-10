// 대화 상황(시나리오)과 체험 모드용 대본. 서버와 화면이 함께 사용합니다.

export const SCENARIOS = {
  intro: {
    icon: "👋", title: "자기소개", desc: "이름, 사는 곳, 취미 말하기",
    prompt: "You are meeting the learner for the first time at a friendly language cafe. Ask about their name, where they live, their job or school, and hobbies.",
    demo: [
      ["Hi! I'm Sunny. What's your name?", "안녕하세요! 저는 써니예요. 이름이 뭐예요?", [["My name is Minji.", "제 이름은 민지예요."], ["I'm John.", "저는 존이에요."]]],
      ["Nice to meet you! Where do you live?", "만나서 반가워요! 어디에 살아요?", [["I live in Seoul.", "저는 서울에 살아요."], ["I live in Busan.", "저는 부산에 살아요."]]],
      ["Cool! What do you do?", "멋지네요! 무슨 일을 하세요?", [["I am a student.", "저는 학생이에요."], ["I work at a bank.", "저는 은행에서 일해요."]]],
      ["What do you like to do in your free time?", "시간 있을 때 뭐 하는 걸 좋아해요?", [["I like watching movies.", "영화 보는 걸 좋아해요."], ["I like hiking.", "등산을 좋아해요."]]],
      ["That sounds fun! You are doing great today.", "재미있겠네요! 오늘 정말 잘하고 있어요.", [["Thank you!", "고마워요!"], ["Nice talking to you.", "이야기해서 즐거웠어요."]]],
    ],
  },
  cafe: {
    icon: "☕", title: "카페 주문", desc: "음료 주문하고 계산하기",
    prompt: "You are a barista at a coffee shop. Take the learner's order: drink, size, hot or iced, for here or to go, then the price.",
    demo: [
      ["Hi there! What can I get for you?", "안녕하세요! 무엇을 드릴까요?", [["Can I get a latte, please?", "라떼 하나 주세요."], ["One americano, please.", "아메리카노 하나 주세요."]]],
      ["Sure! Hot or iced?", "네! 따뜻한 걸로요, 아이스로요?", [["Iced, please.", "아이스로 주세요."], ["Hot, please.", "따뜻한 걸로 주세요."]]],
      ["What size would you like? Small, medium, or large?", "어떤 사이즈로 드릴까요?", [["Medium, please.", "미디엄으로 주세요."], ["Large, please.", "라지로 주세요."]]],
      ["For here or to go?", "드시고 가세요, 가져가세요?", [["To go, please.", "가져갈게요."], ["For here.", "먹고 갈게요."]]],
      ["That's five dollars. Have a nice day!", "5달러입니다. 좋은 하루 보내세요!", [["Thank you!", "감사합니다!"], ["Here you go.", "여기 있어요."]]],
    ],
  },
  directions: {
    icon: "🗺️", title: "길 묻기", desc: "역, 화장실, 장소 찾기",
    prompt: "You are a friendly local on a street in New York. The learner is a tourist asking for directions. Give simple directions (go straight, turn left/right, next to...).",
    demo: [
      ["Hi! You look lost. Can I help you?", "안녕하세요! 길을 잃으신 것 같네요. 도와드릴까요?", [["Where is the subway station?", "지하철역이 어디예요?"], ["I'm looking for a bank.", "은행을 찾고 있어요."]]],
      ["Go straight two blocks, then turn left.", "두 블록 직진한 다음 왼쪽으로 도세요.", [["Is it far?", "멀어요?"], ["Can I walk there?", "걸어갈 수 있어요?"]]],
      ["No, it's about five minutes on foot.", "아니요, 걸어서 5분 정도예요.", [["Thank you so much!", "정말 감사합니다!"], ["Is there a cafe near here?", "근처에 카페가 있나요?"]]],
      ["You're welcome! Enjoy your trip!", "천만에요! 즐거운 여행 되세요!", [["Thanks, bye!", "고마워요, 안녕히 계세요!"]]],
    ],
  },
  airport: {
    icon: "✈️", title: "공항·입국", desc: "체크인과 입국 심사",
    prompt: "You are an immigration officer at a US airport. Ask simple questions: purpose of visit, length of stay, where they will stay. Be polite and calm.",
    demo: [
      ["Hello. May I see your passport, please?", "안녕하세요. 여권 좀 보여주시겠어요?", [["Here you are.", "여기 있습니다."], ["Sure.", "네."]]],
      ["What is the purpose of your visit?", "방문 목적이 무엇인가요?", [["I'm here for vacation.", "휴가로 왔어요."], ["For business.", "출장이에요."]]],
      ["How long will you stay?", "얼마나 머무르실 건가요?", [["For one week.", "일주일이요."], ["About ten days.", "열흘 정도요."]]],
      ["Where will you stay?", "어디에서 머무르시나요?", [["At a hotel in Manhattan.", "맨해튼에 있는 호텔이요."], ["At my friend's house.", "친구 집이요."]]],
      ["Okay. Enjoy your stay!", "좋습니다. 즐거운 시간 보내세요!", [["Thank you!", "감사합니다!"]]],
    ],
  },
  shopping: {
    icon: "🛍️", title: "쇼핑", desc: "옷 사이즈, 가격 묻기",
    prompt: "You are a clerk in a clothing store. Help the learner find clothes, sizes, colors, try things on and pay.",
    demo: [
      ["Hi! Are you looking for anything special?", "안녕하세요! 특별히 찾으시는 게 있나요?", [["I'm looking for a T-shirt.", "티셔츠를 찾고 있어요."], ["Just looking, thanks.", "그냥 둘러보는 중이에요."]]],
      ["What size do you wear?", "어떤 사이즈를 입으세요?", [["Medium, please.", "미디엄이요."], ["I'm not sure.", "잘 모르겠어요."]]],
      ["Here you go. Would you like to try it on?", "여기 있어요. 입어 보시겠어요?", [["Yes, please.", "네, 입어 볼게요."], ["How much is it?", "얼마예요?"]]],
      ["It's twenty dollars. It's on sale today!", "20달러예요. 오늘 할인 중이에요!", [["I'll take it.", "이걸로 살게요."], ["Do you have it in blue?", "파란색도 있나요?"]]],
      ["Great choice! Have a nice day.", "좋은 선택이에요! 좋은 하루 보내세요.", [["Thank you!", "감사합니다!"]]],
    ],
  },
  free: {
    icon: "💬", title: "자유 대화", desc: "아무 주제나 편하게",
    prompt: "Have a relaxed everyday conversation about whatever the learner wants: their day, food, weekend plans, hobbies.",
    demo: [
      ["Hi! How are you today?", "안녕하세요! 오늘 기분 어때요?", [["I'm good, thanks.", "좋아요, 고마워요."], ["I'm a little tired.", "조금 피곤해요."]]],
      ["What did you eat today?", "오늘 뭐 먹었어요?", [["I ate kimchi stew.", "김치찌개 먹었어요."], ["I had a sandwich.", "샌드위치 먹었어요."]]],
      ["Yum! What are your plans for the weekend?", "맛있겠다! 주말 계획이 뭐예요?", [["I will meet my friends.", "친구들을 만날 거예요."], ["I will stay home.", "집에 있을 거예요."]]],
      ["Sounds nice! Your English is getting better.", "좋네요! 영어 실력이 늘고 있어요.", [["Thank you!", "고마워요!"]]],
    ],
  },
};

// 체험 모드: API 키가 없을 때 쓰는 간단한 대본 + 자주 하는 실수 교정
const COMMON_MISTAKES = [
  [/\bi am (go|eat|like|live|work|want)\b/i, (m) => `I ${m[1].toLowerCase()}`, "'am'과 일반동사는 함께 쓰지 않아요."],
  [/\b(he|she|it) (don't)\b/i, (m) => `${m[1]} doesn't`, "he/she/it 뒤에는 doesn't를 써요."],
  [/\b(he|she) (like|want|live|work|go)\b/i, (m) => `${m[1]} ${m[2]}s`, "he/she 뒤의 동사에는 -s를 붙여요."],
  [/\bi (is|are)\b/i, () => "I am", "I 뒤에는 am을 써요."],
  [/\byesterday i (go|eat|meet|see)\b/i, (m) => `yesterday I ${{ go: "went", eat: "ate", meet: "met", see: "saw" }[m[1].toLowerCase()]}`, "어제 일은 과거형으로 말해요."],
];

export function demoReply(scenarioId, history = [], userText = "") {
  const sc = SCENARIOS[scenarioId] || SCENARIOS.free;
  const step = history.filter((t) => t.role === "ai").length;
  const [reply, reply_ko, sugg] = sc.demo[Math.min(step, sc.demo.length - 1)];
  let correction = null;
  for (const [re, fix, why] of COMMON_MISTAKES) {
    const m = userText.match(re);
    if (m) {
      correction = { original: userText, corrected: userText.replace(re, fix(m)), explanation_ko: why };
      break;
    }
  }
  const done = step >= sc.demo.length;
  return {
    reply: done ? "Great job! Let's try another situation." : reply,
    reply_ko: done ? "잘했어요! 다른 상황도 연습해 볼까요?" : reply_ko,
    correction,
    suggestions: done ? [] : sugg.map(([en, ko]) => ({ en, ko })),
    demo: true,
  };
}
