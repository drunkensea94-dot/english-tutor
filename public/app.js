import { LESSONS } from "./lessons.js";
import { SCENARIOS, demoReply } from "./scenarios.js";
import { authState, initAuth, onAuthChange, signIn, signOutUser, getIdToken, loadRemoteStats, saveRemoteStats } from "./auth.js";

// ---------- 저장소 (이 기기에만 저장) ----------
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem("tutor:" + key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("tutor:" + key, JSON.stringify(value)); } catch {}
  },
};

const settings = Object.assign({ level: "beginner", autoSpeak: true, showKo: true, rate: 0.9 }, store.get("settings", {}));
const saveSettings = () => store.set("settings", settings);

const todayKey = () => new Date().toLocaleDateString("sv-SE");
function recordPractice(kind, score) {
  const s = store.get("stats", { days: {}, sentences: 0, turns: 0, best: {} });
  const d = (s.days[todayKey()] ||= { sentences: 0, turns: 0 });
  if (kind === "sentence") { s.sentences++; d.sentences++; }
  if (kind === "turn") { s.turns++; d.turns++; }
  if (score != null && score.key) s.best[score.key] = Math.max(s.best[score.key] || 0, score.value);
  store.set("stats", s);
  saveRemoteStats(s);
}
// 두 기기의 기록을 합칠 때는 항목마다 큰 값을 남겨요.
function mergeStats(a, b) {
  const out = { days: {}, sentences: Math.max(a.sentences || 0, b.sentences || 0), turns: Math.max(a.turns || 0, b.turns || 0), best: { ...a.best } };
  for (const [k, v] of Object.entries(b.best || {})) out.best[k] = Math.max(out.best[k] || 0, v);
  for (const k of new Set([...Object.keys(a.days || {}), ...Object.keys(b.days || {})])) {
    const x = a.days?.[k] || {}, y = b.days?.[k] || {};
    out.days[k] = { sentences: Math.max(x.sentences || 0, y.sentences || 0), turns: Math.max(x.turns || 0, y.turns || 0) };
  }
  return out;
}
function getStats() {
  const s = store.get("stats", { days: {}, sentences: 0, turns: 0, best: {} });
  let streak = 0;
  const d = new Date();
  if (!s.days[todayKey()]) d.setDate(d.getDate() - 1); // 오늘 아직 안 했으면 어제부터 셈
  while (s.days[d.toLocaleDateString("sv-SE")]) { streak++; d.setDate(d.getDate() - 1); }
  return { ...s, streak, today: s.days[todayKey()] || { sentences: 0, turns: 0 } };
}

// ---------- 음성 출력 (TTS) ----------
let voice = null;
function pickVoice() {
  const voices = speechSynthesis.getVoices().filter((v) => /^en[-_]US/i.test(v.lang));
  const prefer = ["Google US English", "Samantha", "Microsoft Aria", "Microsoft Jenny", "Ava", "Allison"];
  voice = prefer.map((n) => voices.find((v) => v.name.includes(n))).find(Boolean) || voices[0] || null;
}
if ("speechSynthesis" in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}
function speak(text, rate = settings.rate) {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window) || !text) return resolve();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    if (voice) u.voice = voice;
    u.rate = rate;
    u.onend = u.onerror = () => resolve();
    speechSynthesis.speak(u);
  });
}

// ---------- 음성 인식 (STT) ----------
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const canListen = Boolean(Recognition);
let activeRec = null;

function listen({ onInterim } = {}) {
  return new Promise((resolve, reject) => {
    if (!canListen) return reject(new Error("unsupported"));
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    const rec = new Recognition();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.maxAlternatives = 3;
    rec.continuous = false;
    let finals = [];
    let lastInterim = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finals = Array.from(r).map((a) => a.transcript.trim());
        else interim += r[0].transcript;
      }
      lastInterim = interim || lastInterim;
      onInterim?.(finals[0] || interim);
    };
    rec.onerror = (e) => {
      activeRec = null;
      if (e.error === "no-speech" || e.error === "aborted") resolve([]);
      else reject(new Error(e.error));
    };
    rec.onend = () => {
      activeRec = null;
      resolve(finals.length ? finals : lastInterim ? [lastInterim.trim()] : []);
    };
    activeRec = rec;
    rec.start();
  });
}
function stopListening() { activeRec?.stop(); }

function micErrorMessage(err) {
  if (err.message === "not-allowed" || err.message === "service-not-allowed") return "마이크 권한을 허용해 주세요. (주소창 왼쪽 자물쇠 아이콘)";
  if (err.message === "network") return "음성 인식에 인터넷 연결이 필요해요.";
  return "음성 인식이 잘 안 됐어요. 다시 눌러 주세요.";
}

// ---------- 발음 채점 ----------
const CONTRACTIONS = {
  "i'm": "i am", "you're": "you are", "it's": "it is", "that's": "that is", "i'd": "i would", "i'll": "i will",
  "don't": "do not", "can't": "can not", "cannot": "can not", "what's": "what is", "let's": "let us", "he's": "he is", "she's": "she is",
  "we're": "we are", "they're": "they are", "isn't": "is not", "doesn't": "does not", "i've": "i have", "there's": "there is",
};
const NUMBERS = { 1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten", 20: "twenty" };
function normWords(text) {
  return text.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9' ]+/g, " ").split(/\s+/).filter(Boolean)
    .flatMap((w) => (CONTRACTIONS[w] || NUMBERS[w] || w).split(" "));
}
// 목표 문장의 각 단어가 들렸는지 LCS로 맞춰 봅니다.
function scoreSpeech(target, heard) {
  const displayWords = target.split(/\s+/);
  const t = displayWords.map((w) => normWords(w));
  const tFlat = t.flat();
  const h = normWords(heard);
  const dp = Array.from({ length: tFlat.length + 1 }, () => new Array(h.length + 1).fill(0));
  for (let i = tFlat.length - 1; i >= 0; i--)
    for (let j = h.length - 1; j >= 0; j--)
      dp[i][j] = tFlat[i] === h[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const matched = new Array(tFlat.length).fill(false);
  for (let i = 0, j = 0; i < tFlat.length && j < h.length;) {
    if (tFlat[i] === h[j]) { matched[i] = true; i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  let k = 0;
  const words = displayWords.map((w, idx) => {
    const parts = t[idx];
    const ok = parts.length === 0 || parts.every(() => matched[k++]);
    return { text: w, ok };
  });
  const score = tFlat.length ? Math.round((matched.filter(Boolean).length / tFlat.length) * 100) : 0;
  return { score, words };
}
function bestScore(target, alternatives) {
  return alternatives.map((alt) => ({ ...scoreSpeech(target, alt), heard: alt }))
    .sort((a, b) => b.score - a.score)[0] || { score: 0, words: target.split(/\s+/).map((text) => ({ text, ok: false })), heard: "" };
}

// ---------- 화면 도우미 ----------
const $view = document.getElementById("view");
const $title = document.getElementById("title");
const $back = document.getElementById("backBtn");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 2600);
}
let backAction = null;
$back.onclick = () => backAction?.();
function setHeader(title, onBack) {
  $title.textContent = title;
  backAction = onBack || null;
  $back.hidden = !onBack;
}
function setTab(tab) {
  document.querySelectorAll(".tabbar button").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
}
let cleanup = null;
function render(html) {
  cleanup?.();
  cleanup = null;
  stopListening();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  $view.innerHTML = html;
  window.scrollTo(0, 0);
}
const LEVEL_NAMES = { beginner: "왕초보", elementary: "초급", intermediate: "중급" };

// ---------- 서버 상태 ----------
let aiEnabled = false;
let serverOnline = true;
async function checkStatus() {
  try {
    const r = await fetch("api/status");
    const s = await r.json();
    aiEnabled = s.aiEnabled;
    await initAuth(s);
  } catch {
    serverOnline = false;
  }
  updateBadge();
}
function updateBadge() {
  const badge = document.getElementById("modeBadge");
  if (aiEnabled && authState.required && !authState.user) {
    badge.textContent = "로그인 필요";
    badge.classList.remove("ai");
    badge.title = "로그인하면 AI와 대화할 수 있어요";
    return;
  }
  badge.textContent = aiEnabled ? "AI 연결됨" : "체험 모드";
  badge.classList.toggle("ai", aiEnabled);
  badge.title = aiEnabled ? "실제 AI와 대화해요" : "준비된 대본으로 대화해요. 서버에 API 키를 넣으면 AI와 대화할 수 있어요.";
}

// ---------- 앱 설치 (홈 화면 바로가기) ----------
let installPrompt = null;
const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const inAppBrowser = /KAKAOTALK|NAVER|Instagram|FBAN|FBAV|Line\//i.test(navigator.userAgent);
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); // 브라우저 기본 알림 대신 우리 버튼으로 설치
  installPrompt = e;
  if (document.querySelector('.tabbar [data-tab="home"]').classList.contains("active")) homeView();
});
window.addEventListener("appinstalled", () => {
  installPrompt = null;
  toast("앱이 설치됐어요! 홈 화면에서 써니 영어를 찾아보세요 🎉");
  if (document.querySelector('.tabbar [data-tab="home"]').classList.contains("active")) homeView();
});
function installGuide() {
  if (inAppBrowser) return "지금은 카카오톡 같은 앱 안에서 열려 있어서 설치가 안 돼요. 오른쪽 위 메뉴에서 <b>다른 브라우저로 열기</b>(크롬·사파리)를 누른 뒤 다시 시도해 주세요.";
  if (isIOS) return "① 사파리 아래쪽 <b>공유 버튼</b>(네모에 화살표 ⬆️)을 눌러요<br>② 목록을 내려서 <b>홈 화면에 추가</b>를 눌러요<br>③ 오른쪽 위 <b>추가</b>를 누르면 끝!";
  return "① 크롬 오른쪽 위 <b>메뉴(⋮)</b>를 눌러요<br>② <b>앱 설치</b> 또는 <b>홈 화면에 추가</b>를 눌러요<br>③ <b>설치</b>를 누르면 끝!";
}
function installCard(force = false) {
  if (isStandalone()) return "";
  if (!force && store.get("installDismissed", false)) return "";
  return `<section class="card install">
    <img src="icons/icon-192.png" alt="" class="install-icon">
    <div class="install-text">
      <h3>앱으로 설치하기</h3>
      <p class="small muted">홈 화면에 아이콘이 생겨서 앱처럼 바로 열 수 있어요.</p>
      <p class="small install-guide" hidden>${installGuide()}</p>
    </div>
    <div class="install-actions">
      <button class="btn" data-install>📲 설치</button>
      ${force ? "" : `<button class="mini" data-install-close>나중에</button>`}
    </div>
  </section>`;
}
function bindInstallCard() {
  $view.querySelectorAll("[data-install]").forEach((b) => (b.onclick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      installPrompt = null;
      if (outcome !== "accepted") toast("다음에 설치하고 싶으면 언제든 눌러 주세요");
    } else {
      // 아이폰, 카카오톡 등 버튼으로 바로 설치할 수 없는 곳은 방법을 보여 줘요
      b.closest(".install").querySelector(".install-guide").hidden = false;
    }
  }));
  $view.querySelectorAll("[data-install-close]").forEach((b) => (b.onclick = () => {
    store.set("installDismissed", true);
    b.closest(".install").remove();
  }));
}

// ---------- 로그인 ----------
function accountCard() {
  if (!authState.enabled) return "";
  const u = authState.user;
  if (!u) {
    return `<section class="card account">
      <div><h3>구글 계정으로 로그인</h3>
      <p class="small muted">${authState.required ? "로그인하면 AI와 대화할 수 있고, " : ""}휴대폰과 컴퓨터에서 학습 기록을 이어서 볼 수 있어요.</p></div>
      <button class="btn google" id="loginBtn"><span class="g">G</span> 구글로 로그인</button>
    </section>`;
  }
  return `<section class="card account in">
    ${u.photoURL ? `<img class="avatar" src="${esc(u.photoURL)}" alt="" referrerpolicy="no-referrer">` : `<span class="avatar">🙂</span>`}
    <div class="who"><b>${esc(u.displayName || "학습자")}</b><span class="small muted">${esc(u.email || "")} · 기록 동기화 중</span></div>
    <button class="mini" id="logoutBtn">로그아웃</button>
  </section>`;
}
function bindAccountCard() {
  const login = document.getElementById("loginBtn");
  if (login) login.onclick = async () => {
    login.disabled = true;
    try { await signIn(); } catch (err) { console.error(err); toast("로그인하지 못했어요. 다시 시도해 주세요."); }
    login.disabled = false;
  };
  const logout = document.getElementById("logoutBtn");
  if (logout) logout.onclick = async () => { await signOutUser(); toast("로그아웃했어요"); };
}
onAuthChange(async (user) => {
  updateBadge();
  if (user) {
    try {
      const remote = await loadRemoteStats();
      const merged = remote ? mergeStats(store.get("stats", { days: {}, sentences: 0, turns: 0, best: {} }), remote) : store.get("stats", null);
      if (merged) { store.set("stats", merged); saveRemoteStats(merged); }
    } catch (err) {
      console.error("기록 불러오기 실패", err);
    }
  }
  const active = document.querySelector(".tabbar button.active")?.dataset.tab;
  if (active === "home") homeView();
  if (active === "stats") statsView();
});

// ---------- 홈 ----------
function homeView() {
  setTab("home");
  setHeader("써니 영어 튜터");
  const st = getStats();
  render(`
    <div class="stack">
      <section class="card hero">
        <h2>Hello! 오늘도 한마디 해 볼까요?</h2>
        <p>듣고, 따라 말하고, AI 친구와 대화하면서 자신감을 키워요.</p>
      </section>
      ${installCard()}
      ${authState.user ? "" : accountCard()}
      <div class="stats-row">
        <div class="card stat"><b>${st.streak}</b><span class="small muted">연속 학습일</span></div>
        <div class="card stat"><b>${st.today.sentences}</b><span class="small muted">오늘 말한 문장</span></div>
        <div class="card stat"><b>${st.today.turns}</b><span class="small muted">오늘 대화 수</span></div>
      </div>
      <button class="card big-choice" data-go="speak">
        <span class="emoji">🎤</span>
        <span><h3>말하기 연습</h3><p class="small muted">원어민 발음 듣고 따라 말하면 점수를 알려 줘요</p></span>
      </button>
      <button class="card big-choice" data-go="chat">
        <span class="emoji">💬</span>
        <span><h3>AI와 대화 연습</h3><p class="small muted">카페, 여행, 자기소개 상황에서 실제처럼 대화해요</p></span>
      </button>
      ${authState.user ? accountCard() : ""}
      <section class="card stack">
        <h3>내 수준</h3>
        <div class="levels">
          ${Object.entries(LEVEL_NAMES).map(([k, v]) => `<button class="chip ${settings.level === k ? "on" : ""}" data-level="${k}">${v}</button>`).join("")}
        </div>
        <p class="small muted" style="margin:0">AI가 이 수준에 맞춰 쉬운 단어와 짧은 문장으로 말해요.</p>
      </section>
      ${!canListen ? `<div class="notice">이 브라우저는 음성 인식을 지원하지 않아요. 휴대폰은 <b>크롬(안드로이드)</b>이나 <b>사파리(아이폰)</b>, 컴퓨터는 <b>크롬·엣지</b>를 써 주세요. 대화는 글자로 입력해도 돼요.</div>` : ""}
      ${!serverOnline ? `<div class="notice">서버에 연결되지 않아 체험 모드로 동작해요.</div>` : ""}
    </div>`);
  $view.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => go(b.dataset.go)));
  bindAccountCard();
  bindInstallCard();
  $view.querySelectorAll("[data-level]").forEach((b) => (b.onclick = () => {
    settings.level = b.dataset.level;
    saveSettings();
    homeView();
  }));
}

// ---------- 말하기 연습 ----------
function speakListView() {
  setTab("speak");
  setHeader("말하기 연습");
  const st = getStats();
  render(`
    <div class="stack">
      <p class="muted" style="margin:0">주제를 고르세요. 🔊로 듣고 🎤로 따라 말해요.</p>
      <div class="grid">
        ${LESSONS.map((l) => {
          const done = l.items.filter((_, i) => (st.best[`${l.id}:${i}`] || 0) >= 80).length;
          return `<button class="card tile" data-lesson="${l.id}">
            <span class="emoji">${l.icon}</span>
            <span class="tag">${l.level}</span>
            <h3>${l.title}</h3>
            <span class="small muted">${done} / ${l.items.length} 통과</span>
          </button>`;
        }).join("")}
      </div>
    </div>`);
  $view.querySelectorAll("[data-lesson]").forEach((b) => (b.onclick = () => practiceView(b.dataset.lesson, 0)));
}

function practiceView(lessonId, index) {
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const [en, ko] = lesson.items[index];
  const key = `${lesson.id}:${index}`;
  setTab("speak");
  setHeader(`${lesson.icon} ${lesson.title}`, speakListView);
  render(`
    <div class="stack">
      <div class="progress"><i style="width:${((index + 1) / lesson.items.length) * 100}%"></i></div>
      <p class="small muted" style="margin:0;text-align:center">${index + 1} / ${lesson.items.length}</p>
      <section class="card sentence-card">
        <div class="sentence-en" id="target">${esc(en)}</div>
        <div class="sentence-ko">${esc(ko)}</div>
      </section>
      <div class="row">
        <button class="btn ghost" id="listen">🔊 듣기</button>
        <button class="btn ghost" id="slow">🐢 천천히</button>
      </div>
      <div>
        <button class="mic" id="mic" aria-label="따라 말하기" ${canListen ? "" : "disabled"}>🎤</button>
        <div class="mic-label" id="micLabel">${canListen ? "버튼을 누르고 문장을 따라 말해 보세요" : "이 브라우저는 음성 인식을 지원하지 않아요"}</div>
      </div>
      <section class="card result" id="result" hidden></section>
      <div class="row">
        <button class="btn plain" id="prev" ${index === 0 ? "disabled" : ""}>← 이전</button>
        <button class="btn plain" id="next">${index === lesson.items.length - 1 ? "완료 🎉" : "다음 →"}</button>
      </div>
    </div>`);

  const $mic = document.getElementById("mic");
  const $label = document.getElementById("micLabel");
  const $result = document.getElementById("result");
  document.getElementById("listen").onclick = () => speak(en);
  document.getElementById("slow").onclick = () => speak(en, 0.6);
  document.getElementById("prev").onclick = () => practiceView(lessonId, index - 1);
  document.getElementById("next").onclick = () => {
    if (index < lesson.items.length - 1) practiceView(lessonId, index + 1);
    else { toast("주제를 끝까지 연습했어요! 👏"); speakListView(); }
  };

  let listening = false;
  $mic.onclick = async () => {
    if (listening) return stopListening();
    listening = true;
    $mic.classList.add("listening");
    $mic.textContent = "■";
    $label.textContent = "듣고 있어요… 말을 마치면 자동으로 멈춰요";
    try {
      const alts = await listen({ onInterim: (t) => ($label.textContent = `“${t}”`) });
      if (!alts.length) {
        $label.textContent = "소리가 들리지 않았어요. 다시 눌러 주세요.";
      } else {
        const r = bestScore(en, alts);
        showResult(r);
        recordPractice("sentence", { key, value: r.score });
        $label.textContent = "다시 하려면 마이크를 눌러요";
      }
    } catch (err) {
      $label.textContent = micErrorMessage(err);
    } finally {
      listening = false;
      $mic.classList.remove("listening");
      $mic.textContent = "🎤";
    }
  };

  function showResult({ score, words, heard }) {
    const cls = score >= 80 ? "good" : score >= 50 ? "mid" : "low";
    const msg = score >= 90 ? "완벽해요! 원어민 같아요 🎉" : score >= 80 ? "아주 잘했어요! 👏" : score >= 50 ? "좋아요! 빨간 단어를 한 번 더 들어 보세요." : "괜찮아요. 🐢 천천히 듣고 다시 해 봐요.";
    const missed = words.filter((w) => !w.ok).map((w) => w.text.replace(/[^A-Za-z']/g, "")).filter(Boolean);
    $result.hidden = false;
    $result.innerHTML = `
      <div class="score ${cls}">${score}점</div>
      <p style="margin:4px 0">${msg}</p>
      <div class="words">${words.map((w) => `<span class="w ${w.ok ? "ok" : "miss"}">${esc(w.text)}</span>`).join(" ")}</div>
      <p class="heard">AI가 들은 말: “${esc(heard)}”</p>
      ${missed.length ? `<div class="row" style="justify-content:center">${missed.slice(0, 4).map((m) => `<button class="mini" data-word="${esc(m)}">🔊 ${esc(m)}</button>`).join("")}</div>` : ""}`;
    $result.querySelectorAll("[data-word]").forEach((b) => (b.onclick = () => speak(b.dataset.word, 0.6)));
    if (score >= 80) speak(score >= 90 ? "Perfect!" : "Great job!");
  }
}

// ---------- 대화 연습 ----------
function chatListView() {
  setTab("chat");
  setHeader("AI와 대화 연습");
  render(`
    <div class="stack">
      <p class="muted" style="margin:0">연습할 상황을 고르세요. AI 튜터 <b>써니</b>가 상대 역할을 해요.</p>
      <div class="grid">
        ${Object.entries(SCENARIOS).map(([id, s]) => `
          <button class="card tile" data-scenario="${id}">
            <span class="emoji">${s.icon}</span>
            <h3>${s.title}</h3>
            <span class="small muted">${s.desc}</span>
          </button>`).join("")}
      </div>
      <section class="card">
        <label class="switch"><span>AI 말 자동으로 읽어 주기</span><input type="checkbox" id="autoSpeak" ${settings.autoSpeak ? "checked" : ""}></label>
        <label class="switch"><span>한국어 해석 보이기</span><input type="checkbox" id="showKo" ${settings.showKo ? "checked" : ""}></label>
        <label class="switch"><span>말하기 속도</span>
          <select id="rate" class="chip">
            <option value="0.7" ${settings.rate == 0.7 ? "selected" : ""}>느리게</option>
            <option value="0.9" ${settings.rate == 0.9 ? "selected" : ""}>보통</option>
            <option value="1" ${settings.rate == 1 ? "selected" : ""}>빠르게</option>
          </select>
        </label>
      </section>
    </div>`);
  $view.querySelectorAll("[data-scenario]").forEach((b) => (b.onclick = () => chatView(b.dataset.scenario)));
  document.getElementById("autoSpeak").onchange = (e) => { settings.autoSpeak = e.target.checked; saveSettings(); };
  document.getElementById("showKo").onchange = (e) => { settings.showKo = e.target.checked; saveSettings(); };
  document.getElementById("rate").onchange = (e) => { settings.rate = Number(e.target.value); saveSettings(); };
}

async function askTutor(scenario, history, userText) {
  if (serverOnline) {
    try {
      const headers = { "Content-Type": "application/json" };
      const token = await getIdToken().catch(() => null);
      if (token) headers.Authorization = `Bearer ${token}`;
      const r = await fetch("api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({ scenario, level: settings.level, history, userText }),
      });
      if (r.ok) return await r.json();
      if (r.status === 401) toast("홈에서 로그인하면 AI와 대화할 수 있어요. 지금은 연습용 대본으로 대답해요");
      else if (r.status === 403) toast("AI 대화가 허락되지 않은 계정이에요. 연습용 대본으로 대답해요");
      else toast("AI 연결에 문제가 있어 연습용 대본으로 대답해요");
    } catch {
      toast("인터넷 연결을 확인해 주세요. 연습용 대본으로 대답해요");
    }
  }
  return demoReply(scenario, history, userText); // 서버가 안 되면 체험 대본으로
}

function chatView(scenarioId) {
  const sc = SCENARIOS[scenarioId];
  const history = [];
  let busy = false;
  setTab("chat");
  setHeader(`${sc.icon} ${sc.title}`, chatListView);
  render(`
    <div class="chat" id="chat"></div>
    <div class="composer">
      <div class="composer-inner">
        <div class="suggest" id="suggest"></div>
        <div class="interim" id="interim">${canListen ? "🎤 를 누르고 영어로 말해 보세요" : "영어로 입력해 보세요"}</div>
        <form class="input-row" id="form">
          <input id="text" autocomplete="off" autocapitalize="off" enterkeyhint="send" placeholder="영어로 입력해도 돼요">
          <button type="submit" class="send" aria-label="보내기">➤</button>
          ${canListen ? `<button type="button" class="mic" id="mic" aria-label="말하기">🎤</button>` : ""}
        </form>
      </div>
    </div>`);

  const $chat = document.getElementById("chat");
  const $suggest = document.getElementById("suggest");
  const $interim = document.getElementById("interim");
  const $input = document.getElementById("text");
  const $mic = document.getElementById("mic");
  const scrollDown = () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

  function addMe(text) {
    const el = document.createElement("div");
    el.className = "msg me";
    el.innerHTML = `<div class="bubble">${esc(text)}</div>`;
    $chat.append(el);
    scrollDown();
    return el;
  }
  function addAi(data) {
    const el = document.createElement("div");
    el.className = "msg ai";
    el.innerHTML = `
      <div class="bubble">${esc(data.reply)}<span class="ko" ${settings.showKo ? "" : "hidden"}>${esc(data.reply_ko || "")}</span></div>
      <div class="msg-tools">
        <button class="mini" data-act="again">🔊 다시 듣기</button>
        <button class="mini" data-act="slow">🐢 천천히</button>
        <button class="mini" data-act="ko">${settings.showKo ? "해석 숨기기" : "해석 보기"}</button>
      </div>`;
    el.querySelector('[data-act="again"]').onclick = () => speak(data.reply);
    el.querySelector('[data-act="slow"]').onclick = () => speak(data.reply, 0.6);
    el.querySelector('[data-act="ko"]').onclick = (e) => {
      const ko = el.querySelector(".ko");
      ko.hidden = !ko.hidden;
      e.target.textContent = ko.hidden ? "해석 보기" : "해석 숨기기";
    };
    $chat.append(el);
    scrollDown();
  }
  function addFix(meEl, c) {
    if (!c) return;
    const el = document.createElement("div");
    el.className = "fix";
    el.innerHTML = `✏️ <span class="from">${esc(c.original)}</span><br>👉 <span class="to">${esc(c.corrected)}</span><br><span class="small">${esc(c.explanation_ko)}</span>
      <div style="margin-top:6px"><button class="mini">🔊 바른 문장 듣기</button></div>`;
    el.querySelector("button").onclick = () => speak(c.corrected);
    meEl.append(el);
  }
  function showSuggestions(list = []) {
    $suggest.innerHTML = list.map((s, i) => `<button class="chip" data-i="${i}">${esc(s.en)}<small>${esc(s.ko)}</small></button>`).join("");
    $suggest.querySelectorAll("[data-i]").forEach((b) => (b.onclick = () => {
      const s = list[b.dataset.i];
      speak(s.en);
      $input.value = s.en;
      $interim.textContent = canListen ? "들어 보고 🎤 로 직접 말하거나 ➤ 를 눌러 보내요" : "➤ 를 눌러 보내요";
    }));
  }
  function showTyping() {
    const el = document.createElement("div");
    el.className = "msg ai";
    el.innerHTML = `<div class="bubble typing"><i></i><i></i><i></i></div>`;
    $chat.append(el);
    scrollDown();
    return el;
  }

  async function turn(userText) {
    if (busy) return;
    busy = true;
    let meEl = null;
    if (userText) meEl = addMe(userText);
    showSuggestions([]);
    const typing = showTyping();
    const data = await askTutor(scenarioId, history.slice(), userText);
    typing.remove();
    if (userText) {
      history.push({ role: "me", text: userText });
      recordPractice("turn");
    }
    history.push({ role: "ai", text: data.reply });
    if (meEl) addFix(meEl, data.correction);
    addAi(data);
    showSuggestions(data.suggestions);
    busy = false;
    if (settings.autoSpeak) await speak(data.reply);
  }

  document.getElementById("form").onsubmit = (e) => {
    e.preventDefault();
    const t = $input.value.trim();
    if (!t) return;
    $input.value = "";
    turn(t);
  };

  if ($mic) {
    let listening = false;
    $mic.onclick = async () => {
      if (listening) return stopListening();
      if (busy) return;
      listening = true;
      $mic.classList.add("listening");
      $mic.textContent = "■";
      $interim.textContent = "듣고 있어요…";
      try {
        const alts = await listen({ onInterim: (t) => ($interim.textContent = `“${t}”`) });
        if (alts[0]) {
          $interim.textContent = "🎤 를 누르고 영어로 말해 보세요";
          turn(alts[0]);
        } else {
          $interim.textContent = "소리가 들리지 않았어요. 다시 눌러 주세요.";
        }
      } catch (err) {
        $interim.textContent = micErrorMessage(err);
      } finally {
        listening = false;
        $mic.classList.remove("listening");
        $mic.textContent = "🎤";
      }
    };
  }

  turn(""); // 튜터가 먼저 말을 걸어요
}

// ---------- 기록 ----------
function statsView() {
  setTab("stats");
  setHeader("나의 기록");
  const st = getStats();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = d.toLocaleDateString("sv-SE");
    const v = st.days[k] || { sentences: 0, turns: 0 };
    days.push({ label: "일월화수목금토"[d.getDay()], total: v.sentences + v.turns });
  }
  const max = Math.max(5, ...days.map((d) => d.total));
  const passed = Object.values(st.best).filter((v) => v >= 80).length;
  const totalItems = LESSONS.reduce((n, l) => n + l.items.length, 0);
  render(`
    <div class="stack">
      <div class="stats-row">
        <div class="card stat"><b>${st.streak}</b><span class="small muted">연속 학습일</span></div>
        <div class="card stat"><b>${st.sentences}</b><span class="small muted">말한 문장</span></div>
        <div class="card stat"><b>${st.turns}</b><span class="small muted">대화 수</span></div>
      </div>
      <section class="card">
        <h3>최근 7일</h3>
        <div style="display:flex;align-items:flex-end;gap:8px;height:140px;margin-top:12px">
          ${days.map((d) => `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;justify-content:flex-end">
              <span class="small muted">${d.total || ""}</span>
              <div style="width:100%;max-width:34px;height:${Math.max(4, (d.total / max) * 100)}px;background:${d.total ? "var(--accent)" : "var(--line)"};border-radius:8px"></div>
              <span class="small muted">${d.label}</span>
            </div>`).join("")}
        </div>
      </section>
      <section class="card stack">
        <h3>말하기 문장 통과 (80점 이상)</h3>
        <div class="progress"><i style="width:${(passed / totalItems) * 100}%"></i></div>
        <span class="small muted">${passed} / ${totalItems} 문장</span>
      </section>
      ${installCard(true)}
      ${authState.user ? `<p class="small muted" style="text-align:center">구글 계정에 기록이 저장돼요. 다른 기기에서 로그인해도 이어서 볼 수 있어요.</p>` : `${accountCard()}<p class="small muted" style="text-align:center">기록은 이 기기에만 저장돼요.</p>`}
    </div>`);
  bindAccountCard();
  bindInstallCard();
}

// ---------- 라우팅 ----------
function go(tab) {
  ({ home: homeView, speak: speakListView, chat: chatListView, stats: statsView })[tab]();
}
document.querySelectorAll(".tabbar button").forEach((b) => (b.onclick = () => go(b.dataset.tab)));

homeView();
checkStatus().then(() => {
  if (document.querySelector('.tabbar [data-tab="home"]').classList.contains("active")) homeView();
});

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
