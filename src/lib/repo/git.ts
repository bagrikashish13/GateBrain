import "server-only";

import { execFile } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { repoRoot } from "./paths";

// Every change the app makes is a commit in this repo, pushed to GitHub right away, so any device
// that clones it sees the same state (AGENTS.md: device independence). Writes go through one queue,
// so two saves never race on the index. Pushing needs GITHUB_TOKEN (.env) or the machine's own git
// credentials. If a push fails (offline, GitHub down) the commit stays local and the next write or
// the background sync pushes it.

export type Change = { path: string; content: string | null }; // repo-relative "brain/…"; null deletes
export type SyncStatus = {
  lastPull: number | null;
  lastPush: number | null;
  ahead: number; // local commits GitHub doesn't have yet
  error: string | null;
  busy: boolean;
};

type State = { status: SyncStatus; queue: Promise<unknown>; identity: string[] | null; timer: ReturnType<typeof setInterval> | null };
const g = globalThis as typeof globalThis & { __gatebrainGit?: State };
const state: State = (g.__gatebrainGit ??= {
  status: { lastPull: null, lastPush: null, ahead: 0, error: null, busy: false },
  queue: Promise.resolve(),
  identity: null,
  timer: null,
});

/** Basic auth header for github.com from GITHUB_TOKEN; also stops git asking a credential helper. */
function authArgs(): string[] {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) return [];
  const basic = Buffer.from(`x-access-token:${token}`).toString("base64");
  return ["-c", "credential.helper=", "-c", `http.https://github.com/.extraheader=AUTHORIZATION: basic ${basic}`];
}

function exec(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(
      "git",
      ["-c", "safe.directory=*", ...args],
      { cwd: repoRoot(), env: { ...process.env, GIT_TERMINAL_PROMPT: "0" }, maxBuffer: 16 * 1024 * 1024, timeout: 90_000, windowsHide: true },
      (err, stdout, stderr) => {
        if (err) reject(new Error((stderr || err.message).trim().split("\n").slice(-3).join(" ")));
        else resolve(stdout.trim());
      },
    );
  });
}

/** The commit author: this machine's git identity, or "GateBrain app" where none is set (Docker). */
async function identity(): Promise<string[]> {
  if (state.identity) return state.identity;
  const name = await exec(["config", "user.name"]).catch(() => "");
  const email = await exec(["config", "user.email"]).catch(() => "");
  state.identity = [
    ...(name ? [] : ["-c", "user.name=GateBrain app"]),
    ...(email ? [] : ["-c", "user.email=gatebrain@localhost"]),
  ];
  return state.identity;
}

const git = async (args: string[]) => exec([...(await identity()), ...args]);
const remote = async (args: string[]) => exec([...(await identity()), ...authArgs(), ...args]);

/** Run one repo operation at a time. */
function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const next = state.queue.then(job, job);
  state.queue = next.catch(() => undefined);
  return next;
}

async function hasUpstream(): Promise<boolean> {
  return !!(await exec(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]).catch(() => ""));
}

async function countAhead(): Promise<number> {
  if (!(await hasUpstream())) return Number(await exec(["rev-list", "--count", "HEAD"]).catch(() => "0")) || 0;
  return Number(await exec(["rev-list", "--count", "@{u}..HEAD"]).catch(() => "0")) || 0;
}

/** Fetch and rebase local commits on top. A conflict is undone, never left half-way. */
async function pullNow(): Promise<boolean> {
  if (!(await hasUpstream())) return false;
  try {
    await remote(["pull", "--rebase", "--autostash", "--quiet"]);
    state.status.lastPull = Date.now();
    return true;
  } catch (err) {
    await exec(["rebase", "--abort"]).catch(() => undefined);
    state.status.error = `Pull failed: ${(err as Error).message}`;
    return false;
  }
}

async function pushNow(): Promise<boolean> {
  state.status.ahead = await countAhead();
  if (state.status.ahead === 0) return true;
  try {
    if (await hasUpstream()) await remote(["push", "--quiet"]);
    else await remote(["push", "--quiet", "-u", "origin", "HEAD"]);
  } catch {
    // Rejected (GitHub moved on): rebase on it and try once more.
    if (!(await pullNow())) return false;
    try {
      await remote(["push", "--quiet"]);
    } catch (err) {
      state.status.error = `Push failed: ${(err as Error).message}`;
      return false;
    }
  }
  state.status.ahead = 0;
  state.status.lastPush = Date.now();
  state.status.error = null;
  return true;
}

/**
 * Write (or delete) files under brain/ and commit them as one commit. Resolves as soon as the commit
 * exists locally, so the screen never waits on GitHub; the push runs right after in the same queue
 * (a rejected push rebases on GitHub's commits and tries again; a failed one is retried later).
 */
export async function commitFiles(changes: Change[], message: string): Promise<void> {
  for (const c of changes) {
    if (!c.path.startsWith("brain/") || c.path.split("/").some((s) => !s || s === "." || s === "..")) {
      throw new Error(`Refusing to write outside brain/: ${c.path}`);
    }
  }
  await enqueue(async () => {
    state.status.busy = true;
    try {
      const root = repoRoot();
      for (const c of changes) {
        const abs = join(/*turbopackIgnore: true*/ root, ...c.path.split("/"));
        if (c.content === null) rmSync(abs, { force: true });
        else {
          mkdirSync(dirname(abs), { recursive: true });
          writeFileSync(abs, c.content.endsWith("\n") ? c.content : c.content + "\n");
        }
      }
      const paths = changes.map((c) => c.path);
      await git(["add", "-A", "--", ...paths]);
      const staged = await git(["diff", "--cached", "--name-only", "--", ...paths]);
      if (staged) await git(["commit", "--quiet", "-m", message, "--", ...paths]);
    } finally {
      state.status.busy = false;
    }
  });
  void enqueue(() => pushNow()).catch(() => undefined);
}

/** Pull GitHub's changes (notes, tests, tasks written on another device) and push anything pending. */
export function syncNow(): Promise<{ ok: boolean; message: string }> {
  return enqueue(async () => {
    state.status.busy = true;
    try {
      state.status.error = null;
      const pulled = await pullNow();
      const pushed = await pushNow();
      if (!(await hasUpstream())) return { ok: false, message: "No GitHub remote yet" };
      return pulled && pushed ? { ok: true, message: "Up to date" } : { ok: false, message: "Sync failed" };
    } finally {
      state.status.busy = false;
    }
  });
}

export async function syncStatus(): Promise<SyncStatus> {
  state.status.ahead = await countAhead();
  return { ...state.status };
}

let added: { head: string; map: Map<string, string> } | null = null;

/**
 * The day each note was first committed ("brain/notes/os/03-deadlock/x.md" → "2026-10-15"), from git
 * history, so every device agrees when a note came in. Notes not committed yet are missing (= today).
 */
export async function noteAddedDays(): Promise<Map<string, string>> {
  const head = await exec(["rev-parse", "HEAD"]).catch(() => "");
  if (added && added.head === head) return added.map;
  const map = new Map<string, string>();
  if (head) {
    const out = await exec(["log", "--no-renames", "--diff-filter=A", "--format=%x00%cs", "--name-only", "--", "brain/notes"]).catch(() => "");
    // Newest first, so the last date seen for a file is when it was first added.
    for (const chunk of out.split("\0")) {
      const [day, ...files] = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
      if (day) for (const f of files) map.set(f, day);
    }
  }
  added = { head, map };
  return map;
}

/** Background sync (started once per server process). Every few minutes: pull, push what's pending. */
export function startBackgroundSync(minutes: number): void {
  if (state.timer || minutes <= 0) return;
  const tick = () => void syncNow().catch(() => undefined);
  tick();
  state.timer = setInterval(tick, minutes * 60_000);
}
