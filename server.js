// AI English Tutor - 작은 Node 서버
// - public/ 폴더의 웹앱(PWA)을 제공합니다.
// - /api/chat 으로 AI 대화 상대(Claude)를 호출합니다.
// - ANTHROPIC_API_KEY 가 없으면 "체험 모드"(미리 준비된 대답)로 동작합니다.

import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scenarioFor, demoReply, FINISH_FEEDBACK } from "./public/scenarios.js";
import { LEVEL_INFO } from "./public/levels.js";
import { verifyIdToken } from "./firebase-auth.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(here, "public");
const PORT = Number(process.env.PORT) || 3000;
const MODEL = process.env.TUTOR_MODEL || "claude-opus-5-5";

// 구글 로그인(Firebase). firebase.config.json 에 웹 앱 설정이 있으면 켜지고
// (FIREBASE_API_KEY / FIREBASE_PROJECT_ID / FIREBASE_APP_ID 환경 변수로 바꿀 수 있어요),
// 그때부터 AI 대화는 로그인한 사람만 쓸 수 있어요. 이 값들은 브라우저에 공개되는 값이라 비밀이 아니에요.
const fileConfig = await fs.readFile(path.join(here, "firebase.config.json"), "utf8").then(JSON.parse).catch(() => ({}));
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || fileConfig.projectId || "";
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || fileConfig.apiKey || "";
const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID || fileConfig.appId || "";
const FIREBASE_CONFIG = FIREBASE_PROJECT_ID && FIREBASE_API_KEY
  ? {
      apiKey: FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || fileConfig.authDomain || `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: FIREBASE_PROJECT_ID,
      ...(FIREBASE_APP_ID ? { appId: FIREBASE_APP_ID } : {}),
    }
  : null;
// 비워 두면 로그인한 누구나, 이메일을 쉼표로 적으면 그 사람들만 AI를 쓸 수 있어요.
const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

// 로그인이 켜져 있으면 요청의 토큰을 확인해요. 통과하면 null, 아니면 [상태 코드, 메시지].
async function checkLogin(req) {
  if (!FIREBASE_CONFIG || !client) return null;
  const token = /^Bearer (.+)$/.exec(req.headers.authorization || "")?.[1];
  const user = await verifyIdToken(token, FIREBASE_PROJECT_ID).catch((err) => {
    console.error("token check failed", err);
    return null;
  });
  if (!user) return [401, "로그인이 필요해요."];
  if (ALLOWED_EMAILS.length && !(user.emailVerified && ALLOWED_EMAILS.includes(user.email.toLowerCase()))) {
    return [403, "AI 대화가 허락되지 않은 계정이에요."];
  }
  return null;
}

let client = null;
if (process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN) {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  client = new Anthropic();
}

// 수준마다 AI 말투와 대답 길이, 추천 대답, 교정 기준이 달라요.
const LEVELS = {
  beginner: {
    who: "a complete beginner (CEFR pre-A1 to A1) who knows only a few English words.",
    rules: `- reply: ONE very short sentence (max 6 words) using only the most common words, present tense. Then ask a yes/no question or an either/or question ("Hot or iced?") so the learner can answer with one or two words.
- A one- or two-word answer is a success: praise it, and sometimes model the full short sentence once ("Iced? Great. 'Iced, please.'").
- Never ask open "why" or "tell me about" questions.
- correction: only when a mistake makes the meaning unclear. explanation_ko must be very simple and kind.
- suggestions: 3 answers of 1 to 4 words each (for example "Yes, please." / "Coffee, please.").`,
  },
  elementary: {
    who: "an elementary learner (CEFR A2) who can make short simple sentences.",
    rules: `- reply: one or two short sentences (max 12 words each) with everyday words. Simple past and future are fine.
- Ask simple what/where/when/who questions that the learner can answer with one full sentence.
- If the learner answers with only one word, model the full sentence ("A latte? 'I'd like a latte, please.'").
- correction: grammar mistakes such as verb forms, tense, articles and prepositions.
- suggestions: 2-3 complete simple sentences of 4 to 9 words.`,
  },
  intermediate: {
    who: "an intermediate learner (CEFR B1) who can hold a simple conversation and wants to sound more natural.",
    rules: `- reply: two or three natural sentences at normal native speed, with common phrasal verbs and idioms where they fit.
- Ask open questions (why, how, what do you think, tell me about) and follow up on details the learner mentioned, so they speak in longer turns.
- If the learner answers in only a few words, react and then ask for a reason, an example or more detail.
- correction: real mistakes, and also sentences that are correct but unnatural; give the more natural phrasing a native speaker would use.
- suggestions: 2-3 answers of 10 to 20 words that use connectors like because, so, but, actually.`,
  },
};

const REPLY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["reply", "reply_ko", "correction", "suggestions", "done", "feedback_ko"],
  properties: {
    reply: { type: "string", description: "Your next line in the role-play, in English." },
    reply_ko: { type: "string", description: "Natural Korean translation of reply." },
    correction: {
      anyOf: [
        { type: "null" },
        {
          type: "object",
          additionalProperties: false,
          required: ["original", "corrected", "explanation_ko"],
          properties: {
            original: { type: "string" },
            corrected: { type: "string" },
            explanation_ko: { type: "string", description: "One short, kind sentence in Korean explaining the fix." },
          },
        },
      ],
    },
    suggestions: {
      type: "array",
      description: "Things the learner could say next, sized for their level.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["en", "ko"],
        properties: { en: { type: "string" }, ko: { type: "string" } },
      },
    },
    done: { type: "boolean", description: "true only when this reply is your closing line and the conversation ends now." },
    feedback_ko: { type: "string", description: "When done is true: 1-2 short, warm Korean sentences on what the learner did well and one English expression to try next time. Otherwise an empty string." },
  },
};

// turn: 이번이 학습자의 몇 번째 말인지 (0이면 써니가 먼저 인사하는 차례)
function systemPrompt(scenario, level, turn) {
  const lv = LEVELS[level] || LEVELS.beginner;
  const { chatTurns, chatMin } = LEVEL_INFO[level] || LEVEL_INFO.beginner;
  return `You are "Sunny", a warm, patient English conversation tutor for Korean speakers.
The learner is ${lv.who}

Role-play scenario: ${scenario.prompt}
The learner's mission for this level (in Korean): ${scenario.goal}
Steer the role-play so the learner can complete the mission.

How to respond at this level:
${lv.rules}

Always:
- Stay in the role-play.
- The learner's text comes from speech recognition, so ignore missing punctuation, capitalization and obvious mis-hearings.
- If the learner wrote Korean or mixed Korean, gently show them how to say it in English inside your reply.
- correction: null when there is nothing to fix. Never correct punctuation or capitalization. When you do correct, give their sentence, the corrected version, and a one-line kind explanation in Korean.
- suggestions: each with a natural Korean meaning in "ko".
- Be encouraging. Never use emojis in "reply" (it is read aloud).

Conversation length (the learner sees a counter, so the conversation must really end):
- The learner speaks at most ${chatTurns} times. ${turn === 0 ? "This is your opening line: greet them and start the role-play. done must be false." : `The learner has now spoken ${turn} of ${chatTurns} times.`}
${turn === 0 ? "" : turn >= chatTurns
    ? "- This is the LAST reply. Close the conversation now: a short, warm goodbye that fits the role-play, with no question. Set done to true, suggestions to [], and write feedback_ko."
    : `- If the mission is clearly complete and the learner has spoken at least ${chatMin} times, close the conversation now (short warm goodbye, no question, done true, suggestions [], feedback_ko). Otherwise keep going: done false, feedback_ko "".${turn === chatTurns - 1 ? " The learner can speak only once more, so ask your final question now and steer toward finishing the mission." : ""}`}`;
}

async function aiReply({ scenarioId, level, history, userText }) {
  level = LEVELS[level] ? level : "beginner";
  const scenario = scenarioFor(scenarioId, level);
  if (!client) return demoReply(scenarioId, history, userText, level);
  const maxTurns = LEVEL_INFO[level].chatTurns;
  const turn = Math.min(history.filter((t) => t.role === "me").length + (userText ? 1 : 0), maxTurns);

  const messages = [];
  // 대화는 user 차례로 시작해야 하므로, 시작 신호를 먼저 넣습니다.
  messages.push({ role: "user", content: "(The learner opened the lesson. Greet them and start the role-play.)" });
  for (const turn of history.slice(-20)) {
    const role = turn.role === "ai" ? "assistant" : "user";
    const last = messages[messages.length - 1];
    if (last.role === role) last.content += "\n" + turn.text;
    else messages.push({ role, content: String(turn.text).slice(0, 1000) });
  }
  if (userText) {
    const last = messages[messages.length - 1];
    if (last.role === "user") last.content += "\n" + userText;
    else messages.push({ role: "user", content: String(userText).slice(0, 1000) });
  }

  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 2000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    // 실시간 대화라 빠른 응답이 중요하므로 effort 를 낮게 둡니다.
    output_config: { effort: "low", format: { type: "json_schema", schema: REPLY_SCHEMA } },
    system: systemPrompt(scenario, level, turn) + "\nLatency-sensitive; begin your visible answer immediately.",
    messages,
  });

  if (response.stop_reason === "refusal") {
    return { reply: "Let's talk about something else. What do you like to do on weekends?", reply_ko: "다른 이야기를 해 볼까요? 주말에 뭐 하는 걸 좋아하세요?", correction: null, suggestions: [], done: false, feedback_ko: "", maxTurns };
  }
  const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  const result = JSON.parse(text);
  // 첫인사에서는 끝나지 않고, 정해진 횟수가 되면 AI가 깜빡해도 여기서 끝내요.
  result.done = turn > 0 && (result.done === true || turn >= maxTurns);
  if (result.done) {
    result.suggestions = [];
    result.feedback_ko ||= FINISH_FEEDBACK[level];
  } else result.feedback_ko = "";
  return { ...result, maxTurns };
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  let data = "";
  for await (const chunk of req) {
    data += chunk;
    if (data.length > 100_000) throw new Error("body too large");
  }
  return data ? JSON.parse(data) : {};
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  try {
    if (url.pathname === "/api/status") {
      return sendJson(res, 200, { aiEnabled: Boolean(client), model: client ? MODEL : null, firebase: FIREBASE_CONFIG, loginRequired: Boolean(FIREBASE_CONFIG && client) });
    }
    if (url.pathname === "/api/chat" && req.method === "POST") {
      const denied = await checkLogin(req);
      if (denied) return sendJson(res, denied[0], { error: denied[1] });
      const body = await readBody(req);
      const result = await aiReply({
        scenarioId: body.scenario,
        level: body.level,
        history: Array.isArray(body.history) ? body.history : [],
        userText: typeof body.userText === "string" ? body.userText.trim() : "",
      });
      return sendJson(res, 200, result);
    }

    // 정적 파일
    let filePath = path.normalize(path.join(PUBLIC_DIR, decodeURIComponent(url.pathname)));
    if (!filePath.startsWith(PUBLIC_DIR)) return sendJson(res, 403, { error: "forbidden" });
    if (url.pathname.endsWith("/")) filePath = path.join(filePath, "index.html");
    const data = await fs.readFile(filePath).catch(() => null);
    if (!data) {
      res.writeHead(404);
      return res.end("Not found");
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "서버 오류가 났어요. 잠시 후 다시 시도해 주세요." });
  }
});

server.listen(PORT, () => {
  console.log(`AI English Tutor: http://localhost:${PORT}`);
  console.log(client ? `AI 모드 (${MODEL})` : "체험 모드: ANTHROPIC_API_KEY 를 설정하면 실제 AI와 대화할 수 있어요.");
  console.log(FIREBASE_CONFIG ? `구글 로그인 켜짐 (${FIREBASE_PROJECT_ID})${ALLOWED_EMAILS.length ? `, 허용 계정 ${ALLOWED_EMAILS.length}개` : ""}` : "구글 로그인 꺼짐");
});
