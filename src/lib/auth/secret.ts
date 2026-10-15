import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The key that signs the session cookie. SESSION_SECRET in .env if set; otherwise one made on first
// run and kept in .runtime/ on this device (each device then has its own logins, which is fine).
let cached: string | null = null;

export function getSessionSecret(): string {
  const env = process.env.SESSION_SECRET;
  if (env && env.length >= 32) return env;
  if (cached) return cached;
  const dir = join(/*turbopackIgnore: true*/ process.env.REPO_PATH || process.cwd(), ".runtime");
  const file = join(/*turbopackIgnore: true*/ dir, "session-secret");
  if (existsSync(file)) cached = readFileSync(file, "utf8").trim();
  if (!cached || cached.length < 32) {
    cached = randomBytes(32).toString("base64url");
    mkdirSync(dir, { recursive: true });
    writeFileSync(file, cached, { mode: 0o600 });
  }
  return cached;
}
