import { LESSONS, BONUS, ALL_LESSONS } from "./lessons.js";
import { SCENARIOS, scenarioFor, demoReply, FINISH_FEEDBACK } from "./scenarios.js";
import { LEVEL_INFO, levelOf } from "./levels.js";
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

const settings = Object.assign({ level: "beginner", autoSpeak: true, showKo: true, rate: 0.7 }, store.get("settings", {}));
settings.level = levelOf(settings.level);
const saveSettings = () => store.set("settings", settings);
const level = () => LEVEL_INFO[settings.level];
// 수준을 바꾸면 말하기 속도와 해석 보이기도 그 수준에 맞게 바꿔요. (나중에 직접 바꿀 수 있어요)
function setLevel(next) {
  settings.level = levelOf(next);
  settings.rate = level().rate;
  settings.showKo = level().showKo;
  settings.v = 2;
  saveSettings();
}
// 수준별 기본값이 생기기 전에 저장된 설정은 한 번만 맞춰 줘요.
if (settings.v !== 2) setLevel(settings.level);

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
// 음성 인식은 숫자를 "20", "7"처럼 적어 주므로 영어 단어로 바꿔서 비교해요.
const ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function numberWords(w) {
  if (!/^\d+$/.test(w)) return null;
  const n = Number(w);
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
  return w.split("").map((d) => ONES[d]).join(" "); // "123"처럼 붙어서 적힌 숫자 세기
}
function normWords(text) {
  return text.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9' ]+/g, " ").split(/\s+/).filter(Boolean)
    .flatMap((w) => (CONTRACTIONS[w] || numberWords(w) || w).split(" "));
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
function levelPicker() {
  return `<div class="levels">${Object.entries(LEVEL_INFO).map(([k, v]) => `<button class="chip ${settings.level === k ? "on" : ""}" data-level="${k}">${v.name}</button>`).join("")}</div>`;
}
function bindLevelPicker(rerender) {
  $view.querySelectorAll("[data-level]").forEach((b) => (b.onclick = () => {
    if (b.dataset.level === settings.level) return;
    setLevel(b.dataset.level);
    rerender();
    toast(`${level().name} 수준으로 바꿨어요`);
  }));
}

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
const inApp = window.inAppBrowser || { inApp: false, canOpenExternal: () => false, openExternal() {} };
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
  if (inApp.inApp) {
    return inApp.canOpenExternal()
      ? "지금은 앱 안에서 열려 있어서 설치가 안 돼요. 위의 <b>크롬·사파리로 열기</b>를 누른 뒤, 새로 열린 화면에서 다시 설치를 눌러 주세요."
      : "지금은 앱 안에서 열려 있어서 설치가 안 돼요. 오른쪽 위(또는 아래) <b>⋯ 메뉴</b>에서 <b>Safari로 열기</b> 또는 <b>다른 브라우저로 열기</b>를 누르거나, <b>링크 복사</b> 후 사파리·크롬에 붙여 넣어 주세요.";
  }
  if (isIOS) return "① 사파리 아래쪽 <b>공유 버튼</b>(네모에 화살표 ⬆️)을 눌러요<br>② 목록을 내려서 <b>홈 화면에 추가</b>를 눌러요<br>③ 오른쪽 위 <b>추가</b>를 누르면 끝!";
  return "① 크롬 오른쪽 위 <b>메뉴(⋮)</b>를 눌러요<br>② <b>앱 설치</b> 또는 <b>홈 화면에 추가</b>를 눌러요<br>③ <b>설치</b>를 누르면 끝!";
}
function inAppCard() {
  if (!inApp.inApp) return "";
  return `<section class="card inapp">
    <h3>📢 크롬·사파리에서 열어 주세요</h3>
    <p class="small muted">카카오톡 같은 앱 안에서는 앱 설치와 마이크가 잘 안 돼요.</p>
    <div class="row">
      ${inApp.canOpenExternal() ? `<button class="btn" data-open-external>🌐 크롬·사파리로 열기</button>` : ""}
      <button class="btn ghost" data-copy-link>🔗 링크 복사</button>
    </div>
  </section>`;
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
  $view.querySelectorAll("[data-open-external]").forEach((b) => (b.onclick = () => inApp.openExternal()));
  $view.querySelectorAll("[data-copy-link]").forEach((b) => (b.onclick = async () => {
    const url = location.origin + location.pathname;
    try { await navigator.clipboard.writeText(url); toast("링크를 복사했어요. 사파리·크롬 주소창에 붙여 넣어 주세요"); }
    catch { prompt("이 주소를 복사해서 사파리·크롬에 붙여 넣어 주세요", url); }
  }));
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
        <span class="level-tag">${level().name}</span>
        <h2>${level().hero}</h2>
        <p>${level().heroSub}</p>
      </section>
      ${inAppCard()}
      ${installCard()}
      ${authState.user ? "" : accountCard()}
      <div class="stats-row">
        <div class="card stat"><b>${st.streak}</b><span class="small muted">연속 학습일</span></div>
        <div class="card stat"><b>${st.today.sentences}</b><span class="small muted">오늘 말한 문장</span></div>
        <div class="card stat"><b>${st.today.turns}</b><span class="small muted">오늘 대화 수</span></div>
      </div>
      <button class="card big-choice" data-go="speak">
        <span class="emoji">🎤</span>
        <span><h3>말하기 연습</h3><p class="small muted">${(() => {
          const cur = stageRows(settings.level).find((r) => r.current);
          return cur ? `${level().name} ${cur.stage}단계 · ${cur.lesson.icon} ${cur.lesson.title} 할 차례예요` : `${level().name} 10단계까지 모두 통과했어요! 🎉`;
        })()}</p></span>
      </button>
      <button class="card big-choice" data-go="chat">
        <span class="emoji">💬</span>
        <span><h3>AI와 대화 연습</h3><p class="small muted">${(() => {
          const cur = chatStageRows(settings.level).find((r) => r.current);
          return cur ? `${level().name} ${cur.stage}단계 · ${cur.sc.icon} ${cur.sc.title} 대화할 차례예요` : `${level().name} 대화 10단계를 모두 끝냈어요! 🎉`;
        })()}</p></span>
      </button>
      ${authState.user ? accountCard() : ""}
      <section class="card stack">
        <h3>내 수준</h3>
        ${levelPicker()}
        <p class="small muted" style="margin:0">${level().desc}</p>
      </section>
      ${!canListen ? `<div class="notice">이 브라우저는 음성 인식을 지원하지 않아요. 휴대폰은 <b>크롬(안드로이드)</b>이나 <b>사파리(아이폰)</b>, 컴퓨터는 <b>크롬·엣지</b>를 써 주세요. 대화는 글자로 입력해도 돼요.</div>` : ""}
      ${!serverOnline ? `<div class="notice">서버에 연결되지 않아 체험 모드로 동작해요.</div>` : ""}
    </div>`);
  $view.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => go(b.dataset.go)));
  bindAccountCard();
  bindInstallCard();
  bindLevelPicker(homeView);
}

// ---------- 말하기 단계 ----------
const CLEAR = 4; // 한 단계 6문장 중 4문장을 통과하면 다음 단계가 열려요
function passedCount(lesson, st, pass) {
  return lesson.items.filter((_, i) => (st.best[`${lesson.id}:${i}`] || 0) >= pass).length;
}
// 수준 안의 1~10단계 상태. 음성 인식이 안 되는 브라우저에서는 통과할 수 없으니 모두 열어 둬요.
function stageRows(levelKey, st = getStats()) {
  const pass = LEVEL_INFO[levelKey].pass;
  let open = true;
  let currentFound = false;
  return LESSONS[levelKey].map((lesson, i) => {
    const passed = passedCount(lesson, st, pass);
    const row = { lesson, stage: i + 1, passed, cleared: passed >= CLEAR, locked: canListen && !open, current: false };
    if (!row.cleared && !row.locked && !currentFound) row.current = currentFound = true;
    open = open && row.cleared;
    return row;
  });
}

// ---------- 말하기 연습 ----------
function speakListView() {
  setTab("speak");
  setHeader("말하기 연습");
  const st = getStats();
  const lv = level();
  render(`
    <div class="stack">
      ${levelPicker()}
      <p class="muted" style="margin:0">${lv.speakIntro}</p>
      <p class="small muted" style="margin:0">문장마다 <b>${lv.pass}점</b> 이상이면 통과, 한 단계에서 <b>${CLEAR}문장</b>을 통과하면 다음 단계가 열려요.${canListen ? "" : " 이 브라우저는 음성 인식이 안 돼서 모든 단계를 열어 뒀어요."}</p>
      <div class="stages">
        ${stageRows(settings.level, st).map((r) => `
          <button class="card stage${r.cleared ? " cleared" : ""}${r.locked ? " locked" : ""}${r.current ? " current" : ""}" data-lesson="${r.lesson.id}" data-stage="${r.stage}" ${r.locked ? 'data-locked="1"' : ""}>
            <span class="stage-no">${r.cleared ? "✓" : r.locked ? "🔒" : r.stage}</span>
            <span class="stage-body">
              <span class="small muted">${r.stage}단계${r.cleared ? " · 통과" : ""}</span>
              <h3>${r.lesson.icon} ${r.lesson.title}</h3>
              <span class="progress"><i style="width:${(r.passed / r.lesson.items.length) * 100}%"></i></span>
              <span class="small muted">${r.passed} / ${r.lesson.items.length} 문장 통과</span>
            </span>
            ${r.current ? `<span class="stage-go">시작 ›</span>` : ""}
          </button>`).join("")}
      </div>
      <button class="card stage bonus" data-lesson="${BONUS[settings.level].id}">
        <span class="stage-no">⭐</span>
        <span class="stage-body">
          <span class="small muted">보너스 · 언제든 연습할 수 있어요</span>
          <h3>${BONUS[settings.level].icon} ${BONUS[settings.level].title}</h3>
          <span class="small muted">${passedCount(BONUS[settings.level], st, lv.pass)} / ${BONUS[settings.level].items.length} 문장 통과</span>
        </span>
      </button>
    </div>`);
  bindLevelPicker(speakListView);
  $view.querySelectorAll("[data-lesson]").forEach((b) => (b.onclick = () => {
    if (b.dataset.locked) return toast(`${b.dataset.stage - 1}단계에서 ${CLEAR}문장을 통과하면 열려요`);
    practiceView(b.dataset.lesson, 0);
  }));
}

function finishLesson(lesson, wasCleared) {
  if (lesson.bonus) return toast("발음 연습을 끝까지 했어요! 👏");
  const rows = stageRows(lesson.level);
  const last = lesson.stage === rows.length;
  if (!rows[lesson.stage - 1].cleared) {
    return toast(`${CLEAR}문장 이상 통과하면 ${last ? "마지막 단계도 통과예요" : `${lesson.stage + 1}단계가 열려요`}. 한 번 더 해 봐요!`);
  }
  if (wasCleared) return toast(`${lesson.stage}단계 복습 완료! 👏`);
  toast(last ? `🏆 ${LEVEL_INFO[lesson.level].name} 10단계까지 모두 통과했어요!` : `🎉 ${lesson.stage}단계 통과! ${lesson.stage + 1}단계가 열렸어요`);
}

// wasCleared: 이 단계를 시작할 때 이미 통과한 상태였는지 (끝났을 때 "통과!"와 "복습 완료"를 구별해요)
function practiceView(lessonId, index, wasCleared) {
  const lesson = ALL_LESSONS.find((l) => l.id === lessonId);
  const lv = LEVEL_INFO[lesson.level];
  const [en, ko, note] = lesson.items[index];
  const key = `${lesson.id}:${index}`;
  wasCleared ??= !lesson.bonus && stageRows(lesson.level)[lesson.stage - 1].cleared;
  setTab("speak");
  setHeader(lesson.bonus ? `${lesson.icon} ${lesson.title}` : `${lesson.stage}단계 · ${lesson.title}`, speakListView);
  render(`
    <div class="stack">
      <div class="progress"><i style="width:${((index + 1) / lesson.items.length) * 100}%"></i></div>
      <p class="small muted" style="margin:0;text-align:center">${index + 1} / ${lesson.items.length}</p>
      <section class="card sentence-card">
        <div class="sentence-en" id="target">${en.split(/\s+/).map((w) => `<button class="word" data-say="${esc(w.replace(/[^A-Za-z']/g, ""))}">${esc(w)}</button>`).join(" ")}</div>
        <div class="sentence-ko">${esc(ko)}</div>
        ${note ? `<div class="note"><b>${lv.noteIcon} ${lv.noteLabel}</b> ${esc(note)}</div>` : ""}
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
  $view.querySelectorAll("[data-say]").forEach((b) => (b.onclick = () => speak(b.dataset.say, 0.6)));
  document.getElementById("listen").onclick = () => speak(en);
  document.getElementById("slow").onclick = () => speak(en, 0.6);
  document.getElementById("prev").onclick = () => practiceView(lessonId, index - 1, wasCleared);
  document.getElementById("next").onclick = () => {
    if (index < lesson.items.length - 1) practiceView(lessonId, index + 1, wasCleared);
    else { finishLesson(lesson, wasCleared); speakListView(); }
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
    const pass = score >= lv.pass;
    const cls = pass ? "good" : score >= 50 ? "mid" : "low";
    const msg = score >= 90 ? "완벽해요! 원어민 같아요 🎉" : pass ? "아주 잘했어요! 통과예요 👏" : score >= 50 ? "좋아요! 빨간 단어를 눌러 한 번 더 들어 보세요." : "괜찮아요. 🐢 천천히 듣고 다시 해 봐요.";
    const missed = words.filter((w) => !w.ok).map((w) => w.text.replace(/[^A-Za-z']/g, "")).filter(Boolean);
    $result.hidden = false;
    $result.innerHTML = `
      <div class="score ${cls}">${score}점</div>
      <p style="margin:4px 0">${msg}</p>
      <div class="words">${words.map((w) => `<span class="w ${w.ok ? "ok" : "miss"}">${esc(w.text)}</span>`).join(" ")}</div>
      <p class="heard">AI가 들은 말: “${esc(heard)}”</p>
      ${missed.length ? `<div class="row" style="justify-content:center">${missed.slice(0, 4).map((m) => `<button class="mini" data-word="${esc(m)}">🔊 ${esc(m)}</button>`).join("")}</div>` : ""}`;
    $result.querySelectorAll("[data-word]").forEach((b) => (b.onclick = () => speak(b.dataset.word, 0.6)));
    if (pass) speak(score >= 90 ? "Perfect!" : "Great job!");
  }
}

// ---------- 대화 연습 ----------
// ---------- 대화 단계 ----------
const chatKey = (levelKey, id) => `chat:${levelKey}:${id}`;
// 수준 안의 대화 1~10단계 상태. 대화를 끝까지 하면 그 단계를 통과하고 다음 단계가 열려요.
function chatStageRows(levelKey, st = getStats()) {
  let open = true;
  let currentFound = false;
  return Object.keys(SCENARIOS).map((id, i) => {
    const cleared = (st.best[chatKey(levelKey, id)] || 0) > 0;
    const row = { id, sc: scenarioFor(id, levelKey), stage: i + 1, cleared, locked: !open, current: false };
    if (!cleared && !row.locked && !currentFound) row.current = currentFound = true;
    open = open && cleared;
    return row;
  });
}

function chatListView() {
  setTab("chat");
  setHeader("AI와 대화 연습");
  render(`
    <div class="stack">
      ${levelPicker()}
      <p class="muted" style="margin:0">AI 튜터 <b>써니</b>가 상대 역할을 해요. ${level().chatIntro}</p>
      <p class="small muted" style="margin:0">대화마다 대답할 횟수가 정해져 있어요. 끝까지 대화하면 다음 단계가 열려요.</p>
      <div class="stages">
        ${chatStageRows(settings.level).map((r) => `
          <button class="card stage${r.cleared ? " cleared" : ""}${r.locked ? " locked" : ""}${r.current ? " current" : ""}" data-scenario="${r.id}" data-stage="${r.stage}" ${r.locked ? 'data-locked="1"' : ""}>
            <span class="stage-no">${r.cleared ? "✓" : r.locked ? "🔒" : r.stage}</span>
            <span class="stage-body">
              <span class="small muted">${r.stage}단계${r.cleared ? " · 완료" : ""}</span>
              <h3>${r.sc.icon} ${r.sc.title}</h3>
              <span class="small muted">${esc(r.sc.desc)}</span>
            </span>
            ${r.current ? `<span class="stage-go">시작 ›</span>` : ""}
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
  bindLevelPicker(chatListView);
  $view.querySelectorAll("[data-scenario]").forEach((b) => (b.onclick = () => {
    if (b.dataset.locked) return toast(`${b.dataset.stage - 1}단계 대화를 끝까지 하면 열려요`);
    chatView(b.dataset.scenario);
  }));
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
  return demoReply(scenario, history, userText, settings.level); // 서버가 안 되면 체험 대본으로
}

function chatView(scenarioId) {
  const levelKey = settings.level;
  const sc = scenarioFor(scenarioId, levelKey);
  const rows = chatStageRows(levelKey);
  const row = rows.find((r) => r.id === scenarioId);
  const history = [];
  const fixes = []; // 대화 중에 고쳐 준 문장 (끝나면 다시 들어 볼 수 있게)
  let busy = false;
  let ended = false;
  let myTurns = 0;
  // 대답할 수 있는 횟수. 서버가 대답할 때마다 알려 주고, 그 전에는 짐작해서 보여 줘요.
  let maxTurns = aiEnabled ? LEVEL_INFO[levelKey].chatTurns : sc.demo.length - 1;
  let mode = null; // 첫 대답이 AI였는지 체험 대본이었는지
  let typingEl = null;
  setTab("chat");
  setHeader(`${row.stage}단계 · ${sc.title}`, chatListView);
  render(`
    <section class="card mission"><span class="level-tag">${level().name}</span> <b>🎯 미션</b> ${esc(sc.goal)}</section>
    <div class="chat" id="chat"></div>
    <div class="composer">
      <div class="composer-inner">
        <div class="composer-top">
          <span class="turn-count" id="turnCount"></span>
          <span class="turn-bar progress"><i id="turnBar"></i></span>
          <button class="mini" id="endBtn" type="button">대화 끝내기</button>
        </div>
        <div class="suggest" id="suggest"></div>
        <div class="interim" id="interim">${canListen ? "🎤 를 누르고 영어로 말해 보세요" : "영어로 입력해 보세요"}</div>
        <form class="input-row" id="form">
          <input id="text" autocomplete="off" autocapitalize="off" enterkeyhint="send" placeholder="${level().placeholder}">
          <button type="submit" class="send" aria-label="보내기">➤</button>
          ${canListen ? `<button type="button" class="mic" id="mic" aria-label="말하기">🎤</button>` : ""}
        </form>
      </div>
    </div>`);

  // 다른 화면으로 가면 이 대화는 끝난 것으로 쳐요. 늦게 온 대답이 새 화면을 건드리지 않게요.
  cleanup = () => { ended = true; };

  const $chat = document.getElementById("chat");
  const $composer = $view.querySelector(".composer");
  const $count = document.getElementById("turnCount");
  const $bar = document.getElementById("turnBar");
  const $endBtn = document.getElementById("endBtn");
  const $suggest = document.getElementById("suggest");
  const $interim = document.getElementById("interim");
  const $input = document.getElementById("text");
  const $mic = document.getElementById("mic");
  const scrollDown = () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  function updateTurns() {
    $count.textContent = `내 대답 ${myTurns} / ${maxTurns}${myTurns === maxTurns - 1 ? " · 다음이 마지막" : ""}`;
    $bar.style.width = `${Math.min(100, (myTurns / maxTurns) * 100)}%`;
  }
  updateTurns();

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

  // 대화 끝: 입력창을 닫고 결과 카드를 보여 줘요. completed 면 이 단계를 통과해요.
  function finish(completed, feedback = "") {
    if (ended) return;
    ended = true;
    stopListening();
    typingEl?.remove();
    $composer.remove();
    $chat.classList.add("ended");
    if (completed) recordPractice("chat", { key: chatKey(levelKey, scenarioId), value: 100 });
    if (completed && !feedback) feedback = FINISH_FEEDBACK[levelKey];
    const next = rows[row.stage]; // 다음 단계 (없으면 마지막 단계)
    const note = completed
      ? (!next ? `${LEVEL_INFO[levelKey].name} 대화 10단계를 모두 끝냈어요! 🏆` : row.cleared ? "" : `${next.stage}단계가 열렸어요!`)
      : (row.cleared ? "" : next ? "끝까지 대화하면 다음 단계가 열려요." : "끝까지 대화하면 이 단계를 통과해요.");
    const el = document.createElement("section");
    el.className = "card chat-end";
    el.innerHTML = `
      <div class="end-emoji">${completed ? "🎉" : "👋"}</div>
      <h3>${completed ? `${row.stage}단계 대화 완료!` : "대화를 끝냈어요"}</h3>
      ${note ? `<p class="small muted">${note}</p>` : ""}
      <div class="end-stats">
        <div><b>${myTurns}</b><span class="small muted">내가 대답한 횟수</span></div>
        <div><b>${fixes.length}</b><span class="small muted">고친 문장</span></div>
      </div>
      ${feedback ? `<p class="end-feedback">💬 ${esc(feedback)}</p>` : ""}
      ${fixes.length ? `<div class="end-fixes"><b class="small">다시 말해 볼 문장</b>${fixes.map((f, i) => `<button class="mini" data-fix="${i}">🔊 ${esc(f.corrected)}</button>`).join("")}</div>` : ""}
      <div class="end-actions">
        ${completed && next ? `<button class="btn" data-next>${next.stage}단계로 →</button>` : ""}
        <button class="btn ghost" data-retry>다시 하기</button>
        <button class="btn plain" data-list>단계 목록</button>
      </div>`;
    el.querySelectorAll("[data-fix]").forEach((b) => (b.onclick = () => speak(fixes[b.dataset.fix].corrected)));
    el.querySelector("[data-next]")?.addEventListener("click", () => chatView(next.id));
    el.querySelector("[data-retry]").onclick = () => chatView(scenarioId);
    el.querySelector("[data-list]").onclick = () => chatListView();
    $chat.append(el);
    scrollDown();
  }
  $endBtn.onclick = () => finish(false);

  async function turn(userText) {
    if (busy || ended) return;
    busy = true;
    let meEl = null;
    if (userText) meEl = addMe(userText);
    showSuggestions([]);
    $endBtn.disabled = true; // 대답을 기다리는 동안에는 끝내지 않아요 (마지막 대답이 사라지지 않게)
    typingEl = showTyping();
    const data = await askTutor(scenarioId, history.slice(), userText);
    if (ended) return; // 기다리는 동안 다른 화면으로 갔어요
    typingEl.remove();
    $endBtn.disabled = false;
    if (userText) {
      history.push({ role: "me", text: userText });
      recordPractice("turn");
      myTurns++;
    }
    // AI와 대화하다가 잠깐 오류로 체험 대본이 대답했다면, 대본의 횟수나 끝 신호는 따르지 않아요.
    const fallback = mode === "ai" && data.demo;
    mode ??= data.demo ? "demo" : "ai";
    if (data.maxTurns && !fallback) maxTurns = data.maxTurns;
    history.push({ role: "ai", text: data.reply });
    if (meEl && data.correction) {
      addFix(meEl, data.correction);
      fixes.push(data.correction);
    }
    addAi(data);
    updateTurns();
    busy = false;
    // 서버가 끝났다고 알려 주거나, 정해진 횟수를 다 채우면 대화가 끝나요.
    if ((data.done && !fallback) || (userText && myTurns >= maxTurns)) finish(true, data.feedback_ko);
    else showSuggestions(data.suggestions);
    if (settings.autoSpeak) await speak(data.reply);
  }

  document.getElementById("form").onsubmit = (e) => {
    e.preventDefault();
    const t = $input.value.trim();
    if (!t || busy || ended) return; // 기다리는 중에는 쓴 글을 지우지 않고 그대로 둬요
    $input.value = "";
    turn(t);
  };

  if ($mic) {
    let listening = false;
    $mic.onclick = async () => {
      if (listening) return stopListening();
      if (busy || ended) return;
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
  const byLevel = Object.keys(LESSONS).map((k) => {
    const rows = stageRows(k, st);
    const chats = chatStageRows(k, st);
    return {
      name: LEVEL_INFO[k].name, total: rows.length, cleared: rows.filter((r) => r.cleared).length, sentences: rows.reduce((n, r) => n + r.passed, 0),
      chatTotal: chats.length, chatCleared: chats.filter((r) => r.cleared).length,
    };
  });
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
        <h3>단계 진행</h3>
        ${byLevel.map((b) => `
          <div class="level-progress">
            <b class="small">${b.name}</b>
            <span class="small muted">🎤 말하기 ${b.cleared} / ${b.total} 단계 · 문장 ${b.sentences}개 통과</span>
            <div class="progress"><i style="width:${(b.cleared / b.total) * 100}%"></i></div>
            <span class="small muted">💬 대화 ${b.chatCleared} / ${b.chatTotal} 단계</span>
            <div class="progress"><i style="width:${(b.chatCleared / b.chatTotal) * 100}%"></i></div>
          </div>`).join("")}
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
