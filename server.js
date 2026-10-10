// AI English Tutor - 작은 Node 서버
// - public/ 폴더의 웹앱(PWA)을 제공합니다.
// - /api/chat 으로 AI 대화 상대(Claude)를 호출합니다.
// - ANTHROPIC_API_KEY 가 없으면 "체험 모드"(미리 준비된 대답)로 동작합니다.

import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCENARIOS, demoReply } from "./public/scenarios.js";
import { verifyIdToken } from "./firebase-auth.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(here, "public");
const PORT = Number(process.env.PORT) || 3000;
const MODEL = process.env.TUTOR_MODEL || "claude-opus-5-5";

// 구글 로그인(Firebase). FIREBASE_PROJECT_ID 와 FIREBASE_API_KEY 를 넣으면 켜지고,
// 그때부터 AI 대화는 로그인한 사람만 쓸 수 있어요.
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "";
const FIREBASE_CONFIG = FIREBASE_PROJECT_ID && process.env.FIREBASE_API_KEY
  ? {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: FIREBASE_PROJECT_ID,
      ...(process.env.FIREBASE_APP_ID ? { appId: process.env.FIREBASE_APP_ID } : {}),
    }
  : null;
// 비워 두면 로그인한 누구나, 이메일을 쉼표로 적으면 그 사람들만 AI를 쓸 수 있어요.
const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

// 로그인이 켜져 있으면 요청의 토큰을 확인해요. 통과하면 null, 아니면 [상태 코드, 메시지].
async function checkLogin(req) {
  if (!FIREBASE_CONFIG) return null;
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

const LEVELS = {
  beginner: "a complete beginner (CEFR A1). Use very short sentences (max 8 words), only the 500 most common words, present tense when possible.",
  elementary: "an elementary learner (CEFR A2). Use short, simple sentences (max 12 words) and everyday vocabulary.",
  intermediate: "an intermediate learner (CEFR B1). Use natural but clear sentences and common idioms only when helpful.",
};

const REPLY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["reply", "reply_ko", "correction", "suggestions"],
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
      description: "2-3 easy things the learner could say next.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["en", "ko"],
        properties: { en: { type: "string" }, ko: { type: "string" } },
      },
    },
  },
};

function systemPrompt(scenario, level) {
  return `You are "Sunny", a warm, patient English conversation tutor for Korean speakers.
The learner is ${LEVELS[level] || LEVELS.beginner}

Role-play scenario: ${scenario.prompt}

How to respond:
- Stay in the role-play. Reply with ONE or TWO short sentences, then usually ask one easy question so the learner keeps talking.
- The learner's text comes from speech recognition, so ignore missing punctuation, capitalization and obvious mis-hearings.
- If the learner wrote Korean or mixed Korean, gently show them how to say it in English inside your reply.
- correction: only when the learner's English has a real grammar or word-choice mistake. Give their sentence, a corrected natural version, and a one-line kind explanation in Korean. Otherwise null. Never correct punctuation or capitalization.
- suggestions: 2-3 short example answers the learner could say next, matching their level, each with Korean meaning.
- Be encouraging. Never use emojis in "reply" (it is read aloud).`;
}

async function aiReply({ scenarioId, level, history, userText }) {
  const scenario = SCENARIOS[scenarioId] || SCENARIOS.free;
  if (!client) return demoReply(scenarioId, history, userText);

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
    system: systemPrompt(scenario, level) + "\nLatency-sensitive; begin your visible answer immediately.",
    messages,
  });

  if (response.stop_reason === "refusal") {
    return { reply: "Let's talk about something else. What do you like to do on weekends?", reply_ko: "다른 이야기를 해 볼까요? 주말에 뭐 하는 걸 좋아하세요?", correction: null, suggestions: [] };
  }
  const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  return JSON.parse(text);
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
      return sendJson(res, 200, { aiEnabled: Boolean(client), model: client ? MODEL : null, firebase: FIREBASE_CONFIG, loginRequired: Boolean(FIREBASE_CONFIG) });
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
