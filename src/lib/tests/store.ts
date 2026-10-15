import "server-only";

import { existsSync, readdirSync, rmSync } from "node:fs";
import { dirname } from "node:path";
import { commitFiles } from "@/lib/repo/git";
import { brainPath, readBrainText, readRuntimeJson, runtimePath, writeRuntimeJson } from "@/lib/repo/paths";
import { subjectMap, subjectOf } from "@/lib/brain/subjects";
import { parseTest, TEST_ID, type ParseResult, type Test } from "./format";
import { gradeAll, type QState } from "./grade";
import { buildResult, parseResult, type Result } from "./result";

// Tests live in brain/tests/<id>.md (written by Claude Code / Antigravity), results in
// brain/results/<id>/<attempt>.md (written by the app, committed and pushed). A test in progress is
// per-device scratch in .runtime/attempts/<id>.json: only a submitted attempt goes to GitHub.

export type TestEntry = { id: string; parsed: ParseResult };

const ATTEMPT = /^\d{4}-\d{2}-\d{2}-\d{4}(?:-\d+)?$/;

function list(dir: string): string[] {
  try {
    return readdirSync(brainPath(dir));
  } catch {
    return [];
  }
}

export function listTests(): TestEntry[] {
  return list("tests")
    .filter((f) => f.endsWith(".md") && !f.startsWith(".") && f.toLowerCase() !== "readme.md")
    .map((f) => f.slice(0, -3))
    .filter((id) => TEST_ID.test(id))
    .map((id) => ({ id, parsed: parseTest(id, readBrainText(`tests/${id}.md`) ?? "") }))
    .sort((a, b) => b.id.localeCompare(a.id, undefined, { numeric: true }));
}

export function getTest(id: string): Test | null {
  if (!TEST_ID.test(id)) return null;
  const raw = readBrainText(`tests/${id}.md`);
  if (raw === null) return null;
  const r = parseTest(id, raw);
  return r.ok ? r.test : null;
}

/** Every submitted attempt, newest first. */
export function listResults(): Result[] {
  const out: Result[] = [];
  for (const test of list("results")) {
    if (!TEST_ID.test(test)) continue;
    for (const f of list(`results/${test}`)) {
      if (!f.endsWith(".md") || !ATTEMPT.test(f.slice(0, -3))) continue;
      const raw = readBrainText(`results/${test}/${f}`);
      const r = raw && parseResult(f.slice(0, -3), raw);
      if (r) out.push(r);
    }
  }
  return out.sort((a, b) => b.submitted.localeCompare(a.submitted));
}

export function getResult(test: string, attempt: string): Result | null {
  if (!TEST_ID.test(test) || !ATTEMPT.test(attempt)) return null;
  const raw = readBrainText(`results/${test}/${attempt}.md`);
  return raw ? parseResult(attempt, raw) : null;
}

// --- A test in progress (this device only) ---

export type InProgress = {
  test: string;
  startedAt: number; // epoch ms
  deadline: number; // epoch ms: startedAt + duration
  current: number; // index of the question on screen
  states: QState[];
};

const progressFile = (id: string) => `attempts/${id}.json`;

export function getInProgress(id: string): InProgress | null {
  if (!TEST_ID.test(id)) return null;
  const p = readRuntimeJson<InProgress | null>(progressFile(id), null);
  return p && p.test === id && Array.isArray(p.states) ? p : null;
}

export function allInProgress(): InProgress[] {
  try {
    return readdirSync(dirname(runtimePath("attempts", "-")))
      .filter((f) => f.endsWith(".json"))
      .map((f) => getInProgress(f.slice(0, -5)))
      .filter((p): p is InProgress => !!p);
  } catch {
    return [];
  }
}

export function startAttempt(test: Test, now = Date.now()): InProgress {
  const existing = getInProgress(test.id);
  if (existing) return existing;
  const p: InProgress = {
    test: test.id,
    startedAt: now,
    deadline: now + test.duration * 60_000,
    current: 0,
    states: test.questions.map((_, i) => ({ response: null, visited: i === 0, marked: false, timeMs: 0, visits: i === 0 ? 1 : 0 })),
  };
  writeRuntimeJson(progressFile(test.id), p);
  return p;
}

export function saveProgress(p: InProgress): void {
  writeRuntimeJson(progressFile(p.test), p);
}

export function discardAttempt(id: string): void {
  if (!TEST_ID.test(id)) return;
  const f = runtimePath(progressFile(id));
  if (existsSync(f)) rmSync(f);
}

/** "2026-10-15-1430" in the app's time zone; a second attempt in the same minute gets "-2". */
function attemptName(test: string, at: Date): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(at)
      .map((p) => [p.type, p.value]),
  );
  const base = `${parts.year}-${parts.month}-${parts.day}-${parts.hour}${parts.minute}`;
  let name = base;
  for (let n = 2; existsSync(brainPath(`results/${test}/${name}.md`)); n++) name = `${base}-${n}`;
  return name;
}

/** Grade the attempt, commit its result file (pushed right after), and clear the scratch copy. */
export async function submitAttempt(test: Test, p: InProgress, autoSubmitted: boolean, now = new Date()): Promise<string> {
  const submitted = new Date(Math.min(now.getTime(), p.deadline));
  const attempt = attemptName(test.id, submitted);
  const subjects = subjectMap();
  const md = buildResult({
    test,
    attempt,
    started: new Date(p.startedAt),
    submitted,
    autoSubmitted,
    graded: gradeAll(test, p.states),
    subjectName: (k) => subjectOf(k, subjects).name,
  });
  await commitFiles([{ path: `brain/results/${test.id}/${attempt}.md`, content: md }], `result: ${test.id} (${attempt})`);
  discardAttempt(test.id);
  return attempt;
}
