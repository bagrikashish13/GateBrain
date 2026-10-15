// Session token: "v1.<issuedAtMs>.<hmac>", signed with SESSION_SECRET.
// Signed with Web Crypto; the secret comes from ./secret (SESSION_SECRET or a per-device file).

export { getSessionSecret } from "./secret";

export const SESSION_COOKIE = "gatebrain_session";

// Browsers cap cookie lifetime at 400 days.
export const SESSION_MAX_AGE_S = 400 * 24 * 60 * 60;
// Re-issue the cookie once it's a week old, so a phone in daily use never gets logged out.
const REFRESH_AFTER_MS = 7 * 24 * 60 * 60 * 1000;
const CLOCK_SKEW_MS = 60 * 1000;

export type Session = { issuedAt: number };

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
  };
}

export async function createSessionToken(secret: string, now = Date.now()): Promise<string> {
  const payload = `v1.${now}`;
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(sig))}`;
}

export async function verifySessionToken(
  token: string,
  secret: string,
  now = Date.now(),
): Promise<Session | null> {
  const [version, issued, sig, ...rest] = token.split(".");
  if (version !== "v1" || !issued || !sig || rest.length > 0) return null;
  if (!/^\d+$/.test(issued)) return null;

  const issuedAt = Number(issued);
  if (issuedAt > now + CLOCK_SKEW_MS) return null;
  if (now - issuedAt > SESSION_MAX_AGE_S * 1000) return null;

  const sigBytes = fromBase64Url(sig);
  if (!sigBytes) return null;
  // subtle.verify compares in constant time.
  const ok = await crypto.subtle.verify(
    "HMAC",
    await hmacKey(secret),
    sigBytes,
    encode(`${version}.${issued}`),
  );
  return ok ? { issuedAt } : null;
}

export function shouldRefresh(session: Session, now = Date.now()): boolean {
  return now - session.issuedAt > REFRESH_AFTER_MS;
}

function encode(s: string): Uint8Array<ArrayBuffer> {
  return new TextEncoder().encode(s) as Uint8Array<ArrayBuffer>;
}

function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[A-Za-z0-9_-]+$/.test(s)) return null;
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
