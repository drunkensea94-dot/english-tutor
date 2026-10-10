// 카카오톡·인스타그램 같은 앱 안 브라우저에서는 앱 설치와 마이크가 잘 안 돼요.
// 그래서 크롬(안드로이드)이나 사파리·기본 브라우저(아이폰)로 다시 열어 줘요.
(function () {
  var ua = navigator.userAgent;
  var isAndroid = /Android/i.test(ua);
  var isKakao = /KAKAOTALK/i.test(ua);
  var isLine = /Line\//i.test(ua);
  var inApp = isKakao || isLine || /NAVER\(inapp|Instagram|FBAN|FBAV|FB_IAB|Snapchat|DaumApps|everytimeApp|BAND\//i.test(ua);

  // 바로 다른 브라우저로 열 수 있는 방법이 있으면 true
  function canOpenExternal() {
    return isKakao || isLine || (inApp && isAndroid);
  }

  function openExternal() {
    var url = location.href;
    if (isKakao) {
      // 카카오톡이 제공하는 "외부 브라우저로 열기" 주소
      location.href = "kakaotalk://web/openExternal?url=" + encodeURIComponent(url);
    } else if (isLine) {
      location.href = url + (url.indexOf("?") < 0 ? "?" : "&") + "openExternalBrowser=1";
    } else if (isAndroid) {
      // 안드로이드: 크롬으로 열기
      location.href = "intent://" + url.replace(/^https?:\/\//, "") + "#Intent;scheme=https;package=com.android.chrome;end";
    }
  }

  window.inAppBrowser = { inApp: inApp, isKakao: isKakao, canOpenExternal: canOpenExternal, openExternal: openExternal };

  // 카카오톡·라인에서 열리면 한 번 자동으로 바깥 브라우저로 넘겨요 (되돌아와도 반복하지 않게)
  if (canOpenExternal() && (isKakao || isLine)) {
    var tried = false;
    try { tried = sessionStorage.getItem("tutor:openedExternal") === "1"; sessionStorage.setItem("tutor:openedExternal", "1"); } catch (e) {}
    // 화면을 먼저 보여 준 다음 넘겨요. 넘어가지 못해도 안내 카드가 남아 있어요.
    if (!tried) window.addEventListener("load", function () { setTimeout(openExternal, 400); });
  }
})();
