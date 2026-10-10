// 수준별 화면 문구와 기본 설정. 수준을 바꾸면 말하기 문장, 대화 대본, AI 말투가 함께 바뀌어요.
export const LEVEL_INFO = {
  beginner: {
    name: "왕초보",
    hero: "한두 단어부터 천천히 시작해요",
    heroSub: "짧은 말을 듣고 따라 하다 보면 입이 먼저 기억해요.",
    desc: "한두 단어 표현을 한글 발음과 함께 연습해요. 대화에서는 써니가 천천히, '네/아니요'나 둘 중 하나를 고르는 질문으로 물어봐요.",
    speakIntro: "한두 단어짜리 짧은 말이에요. 한글 발음을 보고 🔊 듣고 🎤 따라 해요.",
    chatIntro: "써니가 쉬운 질문을 해요. 한 단어로만 대답해도 괜찮아요.",
    placeholder: "한 단어로 대답해도 괜찮아요",
    noteIcon: "🗣️",
    noteLabel: "발음",
    rate: 0.7,
    showKo: true,
    pass: 70,
    chatTurns: 5, // AI 대화에서 학습자가 말하는 최대 횟수
    chatMin: 3, // 미션을 끝내면 이만큼 말한 뒤부터 일찍 끝날 수 있어요
  },
  elementary: {
    name: "초급",
    hero: "짧은 문장으로 하고 싶은 말을 해요",
    heroSub: "일상에서 바로 쓰는 문장을 통째로 익혀요.",
    desc: "주문, 여행, 일상에서 바로 쓰는 짧은 문장을 연습해요. 대화에서는 '무엇·어디·언제' 질문에 한 문장으로 대답해요.",
    speakIntro: "일상에서 자주 쓰는 짧은 문장이에요. 📌 패턴을 기억하면 다른 말에도 쓸 수 있어요.",
    chatIntro: "써니가 짧은 문장으로 물어봐요. 완전한 문장으로 대답해 보세요.",
    placeholder: "짧은 문장으로 말해 보세요",
    noteIcon: "📌",
    noteLabel: "패턴",
    rate: 0.9,
    showKo: true,
    pass: 80,
    chatTurns: 6,
    chatMin: 4,
  },
  intermediate: {
    name: "중급",
    hero: "이유와 경험을 덧붙여 길게 말해요",
    heroSub: "원어민이 자주 쓰는 표현으로 자연스럽게 이어 말해요.",
    desc: "경험, 의견, 정중한 부탁처럼 긴 문장과 자연스러운 표현을 연습해요. 대화에서는 써니가 '왜요?', '어땠어요?' 하고 더 물어봐서 길게 말하게 도와줘요.",
    speakIntro: "원어민이 자주 쓰는 긴 문장과 표현이에요. 💡 팁으로 쓰임새를 익혀요.",
    chatIntro: "써니가 이유와 경험을 물어봐요. 두세 문장으로 길게 대답해 보세요.",
    placeholder: "이유나 예를 덧붙여 길게 말해 보세요",
    noteIcon: "💡",
    noteLabel: "표현 팁",
    rate: 1,
    showKo: false,
    pass: 80,
    chatTurns: 8,
    chatMin: 5,
  },
};

export const levelOf = (level) => (LEVEL_INFO[level] ? level : "beginner");
