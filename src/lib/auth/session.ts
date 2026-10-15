import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import {
  SESSION_COOKIE,
  createSessionToken,
  getSessionSecret,
  sessionCookieOptions,
  verifySessionToken,
  type Session,
} from "./token";

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  // Checking the token's age reads the clock, and so do the pages after this: request time only
  // (a cookie alone can still be prefetched at runtime under Cache Components).
  await connection();
  return token ? verifySessionToken(token, getSessionSecret()) : null;
}

/**
 * Data access gate. proxy.ts already guards every route, but Server Actions and
 * Route Handlers must check again close to the data (Next docs: never rely on proxy alone).
 * Reading the cookie also marks the caller as request-time under Cache Components.
 */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function startSession(): Promise<void> {
  const token = await createSessionToken(getSessionSecret());
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions());
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export function passcodeMatches(attempt: string): boolean {
  const passcode = process.env.PASSCODE;
  if (!passcode || passcode.length < 4) {
    throw new Error("PASSCODE must be set to at least 4 characters (see .env.example).");
  }
  // Hash both sides so the comparison is constant-time regardless of length.
  const a = createHash("sha256").update(attempt).digest();
  const b = createHash("sha256").update(passcode).digest();
  return timingSafeEqual(a, b);
}
