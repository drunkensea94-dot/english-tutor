// Firebase 로그인 토큰(ID 토큰)을 서버에서 확인합니다.
// 별도 라이브러리 없이 구글 공개 인증서로 서명을 검사해요.
import crypto from "node:crypto";

const CERTS_URL = process.env.FIREBASE_CERTS_URL || "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
let certCache = { certs: null, expires: 0 };

async function defaultFetchCerts() {
  if (certCache.certs && Date.now() < certCache.expires) return certCache.certs;
  const res = await fetch(CERTS_URL);
  if (!res.ok) throw new Error(`cert fetch failed: ${res.status}`);
  const maxAge = Number(/max-age=(\d+)/.exec(res.headers.get("cache-control") || "")?.[1] || 3600);
  certCache = { certs: await res.json(), expires: Date.now() + maxAge * 1000 };
  return certCache.certs;
}

const b64url = (s) => Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");

// 올바른 토큰이면 { uid, email, emailVerified, name } 을, 아니면 null 을 돌려줘요.
export async function verifyIdToken(token, projectId, fetchCerts = defaultFetchCerts) {
  if (!token || !projectId) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  let header, payload;
  try {
    header = JSON.parse(b64url(parts[0]).toString("utf8"));
    payload = JSON.parse(b64url(parts[1]).toString("utf8"));
  } catch {
    return null;
  }
  if (header.alg !== "RS256" || !header.kid) return null;
  const certs = await fetchCerts();
  const cert = certs[header.kid];
  if (!cert) return null;
  const ok = crypto.verify("RSA-SHA256", Buffer.from(`${parts[0]}.${parts[1]}`), crypto.createPublicKey(cert), b64url(parts[2]));
  if (!ok) return null;
  const now = Math.floor(Date.now() / 1000);
  if (payload.aud !== projectId) return null;
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) return null;
  if (typeof payload.sub !== "string" || !payload.sub) return null;
  if (!(payload.exp > now) || payload.iat > now + 300) return null;
  return { uid: payload.sub, email: payload.email || "", emailVerified: Boolean(payload.email_verified), name: payload.name || "" };
}
