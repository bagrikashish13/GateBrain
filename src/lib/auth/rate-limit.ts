import "server-only";

import { readRuntimeJson, writeRuntimeJson } from "@/lib/repo/paths";

// Login throttle, sized so a 4-digit passcode survives the open internet.
// Every 5 wrong tries locks login, and each lockout doubles: 15 min, 30 min, 1 h ... 24 h.
// That leaves an attacker ~5 guesses a day. Global rather than per-IP: one user, and IP headers
// behind a tunnel can be spoofed. Kept in .runtime/ so a restart doesn't hand out fresh tries.
// A lockout only blocks new logins; existing cookies keep working.
const FILE = "login-throttle.json";
const FAILURES_PER_LOCK = 5;
const BASE_LOCK_MS = 15 * 60 * 1000;
const MAX_LOCK_MS = 24 * 60 * 60 * 1000;
// A week without wrong tries forgives past lockouts.
const FORGIVE_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

type Throttle = { failures: number; lockouts: number; lockedUntil: number; lastFailureAt: number };
const FRESH: Throttle = { failures: 0, lockouts: 0, lockedUntil: 0, lastFailureAt: 0 };

function read(now: number): Throttle {
  const t = readRuntimeJson<Throttle>(FILE, FRESH);
  return now - t.lastFailureAt > FORGIVE_AFTER_MS && now >= t.lockedUntil ? FRESH : t;
}

/** Milliseconds until another attempt is allowed, or 0 if allowed now. */
export function loginRetryAfter(now = Date.now()): number {
  return Math.max(0, read(now).lockedUntil - now);
}

export function recordLoginFailure(now = Date.now()): void {
  const t = { ...read(now), lastFailureAt: now };
  t.failures += 1;
  if (t.failures >= FAILURES_PER_LOCK) {
    t.lockedUntil = now + Math.min(BASE_LOCK_MS * 2 ** t.lockouts, MAX_LOCK_MS);
    t.lockouts += 1;
    t.failures = 0;
  }
  writeRuntimeJson(FILE, t);
}

export function clearLoginFailures(): void {
  writeRuntimeJson(FILE, FRESH);
}
