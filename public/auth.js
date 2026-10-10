// 구글 로그인(Firebase)과 학습 기록 동기화.
// 서버에 Firebase 설정이 없으면 아무것도 하지 않고, 앱은 로그인 없이 그대로 동작합니다.

const SDK = "https://www.gstatic.com/firebasejs/10.12.2";

let fb = null; // { auth, db, mod: {...} }
let currentUser = null;
const listeners = new Set();

export const authState = {
  enabled: false, // 서버에 Firebase 설정이 있는지
  required: false, // AI 대화에 로그인이 필요한지
  get user() { return currentUser; },
};

export function onAuthChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export async function initAuth(config) {
  if (!config?.firebase) return;
  authState.enabled = true;
  authState.required = Boolean(config.loginRequired);
  try {
    const [app, auth, store] = await Promise.all([
      import(`${SDK}/firebase-app.js`),
      import(`${SDK}/firebase-auth.js`),
      import(`${SDK}/firebase-firestore.js`),
    ]);
    const fbApp = app.initializeApp(config.firebase);
    fb = { auth: auth.getAuth(fbApp), db: store.getFirestore(fbApp), authMod: auth, storeMod: store };
    fb.auth.languageCode = "ko";
    auth.getRedirectResult(fb.auth).catch(() => {});
    auth.onAuthStateChanged(fb.auth, (user) => {
      currentUser = user;
      listeners.forEach((fn) => fn(user));
    });
  } catch (err) {
    console.error("Firebase를 불러오지 못했어요", err);
    authState.enabled = false;
  }
}

export async function signIn() {
  if (!fb) throw new Error("not-configured");
  const { GoogleAuthProvider, signInWithPopup, signInWithRedirect } = fb.authMod;
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    await signInWithPopup(fb.auth, provider);
  } catch (err) {
    // 홈 화면 앱 등 팝업이 막히는 환경에서는 페이지 이동 방식으로 다시 시도
    if (["auth/popup-blocked", "auth/operation-not-supported-in-this-environment", "auth/cancelled-popup-request"].includes(err.code)) {
      await signInWithRedirect(fb.auth, provider);
    } else if (err.code !== "auth/popup-closed-by-user") {
      throw err;
    }
  }
}

export async function signOutUser() {
  if (fb) await fb.authMod.signOut(fb.auth);
}

export async function getIdToken() {
  return currentUser ? currentUser.getIdToken() : null;
}

// ----- 학습 기록 동기화 (Firestore: users/{uid}) -----
export async function loadRemoteStats() {
  if (!fb || !currentUser) return null;
  const { doc, getDoc } = fb.storeMod;
  const snap = await getDoc(doc(fb.db, "users", currentUser.uid));
  return snap.exists() ? snap.data().stats || null : null;
}

let saveTimer = null;
export function saveRemoteStats(stats) {
  if (!fb || !currentUser) return;
  clearTimeout(saveTimer);
  const uid = currentUser.uid;
  saveTimer = setTimeout(() => {
    const { doc, setDoc, serverTimestamp } = fb.storeMod;
    setDoc(doc(fb.db, "users", uid), { stats, updatedAt: serverTimestamp() }, { merge: true })
      .catch((err) => console.error("기록 저장 실패", err));
  }, 1500);
}
