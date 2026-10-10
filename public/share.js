// 친구에게 앱을 알려 주는 공유 기능.
// 휴대폰에서는 기기 공유 창(카카오톡, 문자 등)을 열고, 그게 안 되는 곳에서는 복사하기와 QR 코드를 보여 줘요.

// 앱 첫 화면 주소 (뒤에 붙은 ?, # 는 빼요)
export const appUrl = () => new URL("./", location.href).href;

const canNativeShare = () => typeof navigator.share === "function";
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// 글을 복사해요. 복사했으면 true, 직접 복사하도록 창을 띄웠으면 false.
export async function copyText(text, promptMessage = "이 글을 복사해 주세요") {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {}
  // 예전 방식 (클립보드를 막는 일부 앱 안 브라우저)
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
  document.body.append(ta);
  ta.select();
  ta.setSelectionRange(0, text.length);
  let ok = false;
  try { ok = document.execCommand("copy"); } catch {}
  ta.remove();
  if (!ok) prompt(promptMessage, text);
  return ok;
}

// 기기 공유 창은 버튼을 누른 바로 그 순간에 열어야 해요 (await 다음에 부르면 브라우저가 막아요).
function nativeShare(data) {
  try {
    if (navigator.canShare && !navigator.canShare(data)) return Promise.reject(new Error("cannot share"));
    return navigator.share(data);
  } catch (err) {
    return Promise.reject(err);
  }
}

let closeOpenSheet = null;

// data: { title, text, url }
// direct: 기기 공유 창을 바로 열어요. 아니면 먼저 공유 창(복사하기, QR 코드)을 보여 줘요.
export function share(data, { direct = false, heading = "공유하기", qr = false, toast = () => {} } = {}) {
  if (direct && canNativeShare()) {
    nativeShare(data).catch((err) => {
      if (err?.name !== "AbortError") openSheet(data, { heading, qr, toast }); // 취소가 아니면 다른 방법을 보여 줘요
    });
    return;
  }
  openSheet(data, { heading, qr, toast });
}

function openSheet(data, { heading, qr, toast }) {
  closeOpenSheet?.();
  const opener = document.activeElement;
  const message = [data.text, data.url].filter(Boolean).join("\n");
  const native = canNativeShare();
  const wrap = document.createElement("div");
  wrap.className = "sheet-wrap";
  wrap.innerHTML = `
    <div class="sheet-backdrop" data-close></div>
    <section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
      <h3 id="sheetTitle">${esc(heading)}</h3>
      <div class="share-preview">
        ${data.text ? `<p class="share-text">${esc(data.text)}</p>` : ""}
        <p class="share-url">${esc(data.url)}</p>
      </div>
      <div class="sheet-actions">
        ${native ? `<button class="btn" data-native>📤 카카오톡 등으로 보내기</button>` : ""}
        <button class="btn ${native ? "ghost" : ""}" data-copy>📋 복사하기</button>
      </div>
      ${native ? "" : `<p class="small muted sheet-hint">복사한 다음 카카오톡이나 문자 창에 붙여 넣어 보내 주세요.</p>`}
      ${qr ? `<div class="share-qr" hidden>
        <div class="qr-box"></div>
        <p class="small muted">옆에 있는 친구는 휴대폰 카메라로 QR 코드를 찍으면 바로 열려요.</p>
      </div>` : ""}
      <button class="btn plain sheet-close" data-close>닫기</button>
    </section>`;
  document.body.append(wrap);
  document.documentElement.classList.add("sheet-open");

  function close() {
    if (closeOpenSheet !== close) return;
    closeOpenSheet = null;
    document.removeEventListener("keydown", onKey);
    wrap.remove();
    document.documentElement.classList.remove("sheet-open");
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  }
  function onKey(e) {
    if (e.key === "Escape") close();
  }
  closeOpenSheet = close;
  document.addEventListener("keydown", onKey);
  wrap.querySelectorAll("[data-close]").forEach((el) => (el.onclick = close));
  wrap.querySelector("[data-copy]").onclick = async () => {
    if (await copyText(message)) toast("복사했어요! 카카오톡 대화방에 붙여 넣어 보내 보세요");
  };
  wrap.querySelector("[data-native]")?.addEventListener("click", () => {
    nativeShare(data).then(close, (err) => {
      if (err?.name !== "AbortError") toast("공유 창을 열지 못했어요. 복사하기를 눌러 주세요");
    });
  });
  wrap.querySelector(".sheet .btn").focus({ preventScroll: true });

  if (qr) {
    // QR 코드 만드는 코드는 공유 창을 열 때만 불러와요.
    import("./vendor/qrcode.mjs")
      .then(({ default: qrcode }) => {
        const code = qrcode(0, "M");
        code.addData(data.url);
        code.make();
        const box = wrap.querySelector(".share-qr");
        box.querySelector(".qr-box").innerHTML = code.createSvgTag({ cellSize: 4, margin: 4, scalable: true, title: "앱 주소 QR 코드" });
        box.hidden = false;
      })
      .catch((err) => console.error("QR 코드를 만들지 못했어요", err));
  }
}
