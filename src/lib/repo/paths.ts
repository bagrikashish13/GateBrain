import "server-only";

import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { dirname, join, sep } from "node:path";

// Where everything lives. The app and its data are one repo: the app reads brain/ and writes its
// state there (committed and pushed, so every device sees it). .runtime/ is per-device scratch that
// never leaves the machine (login throttle, session secret, a test in progress).

/** The repo checkout. In dev that's the project folder; in Docker the clone mounted at /repo. */
export function repoRoot(): string {
  return process.env.REPO_PATH || process.cwd();
}

/** Absolute path inside brain/ for a brain-relative posix path ("notes/os/03-deadlock"). */
export function brainPath(rel = ""): string {
  // turbopackIgnore: the brain is data, read at runtime; don't trace it into the build.
  return join(/*turbopackIgnore: true*/ repoRoot(), "brain", ...rel.split("/").filter(Boolean));
}

/** Absolute path inside .runtime/ (created on first use). */
export function runtimePath(...parts: string[]): string {
  const p = join(/*turbopackIgnore: true*/ repoRoot(), ".runtime", ...parts);
  mkdirSync(dirname(p), { recursive: true });
  return p;
}

/** Brain-relative path segments that are safe to join: no "..", no separators, no dot files. */
export function safeSegments(segments: string[]): boolean {
  return segments.length > 0 && segments.every((s) => !!s && !s.startsWith(".") && !/[\\/\0]/.test(s));
}

/** Read a brain file, refusing anything that resolves outside brain/ (symlinks included). */
export function readBrainText(rel: string): string | null {
  const segments = rel.split("/");
  if (!safeSegments(segments)) return null;
  const abs = brainPath(rel);
  if (!existsSync(abs)) return null;
  const real = realpathSync(abs);
  if (!real.startsWith(realpathSync(brainPath()) + sep)) return null;
  return readFileSync(real, "utf8").replace(/\r\n/g, "\n");
}

/** Small JSON files in .runtime/. A missing or broken file reads as `fallback`. */
export function readRuntimeJson<T>(name: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(runtimePath(name), "utf8")) as T;
  } catch {
    return fallback;
  }
}

export function writeRuntimeJson(name: string, value: unknown): void {
  writeFileSync(runtimePath(name), JSON.stringify(value, null, 2));
}
