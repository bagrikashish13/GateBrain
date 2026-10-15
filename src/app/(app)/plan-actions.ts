"use server";

import { refresh } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { subjectMap } from "@/lib/brain/subjects";
import * as plan from "@/lib/plan/store";
import { DURATIONS, KINDS, taskText, type Kind } from "@/lib/plan/tasks";
import { isDay } from "@/lib/time";

// The plan's writes: tick, add, edit, delete, move a task. Each is one commit (pushed right after).

export type PlanResult = { ok: true } | { ok: false; error: string };
export type TaskFields = { kind: Kind | null; task: string; duration: string | null; subject: string | null };

const MESSAGES: Record<string, string> = {
  "not-found": "This task changed. Sync and try again.",
  ambiguous: "That day has this task twice. Fix the file and try again.",
  "already-there": "That day already has this task.",
  "no-day": "That day isn't planned.",
};
const isText = (t: unknown): t is string => typeof t === "string" && !!t.trim() && t.length <= 300;

async function run(write: () => Promise<plan.WriteResult>): Promise<PlanResult> {
  await requireSession();
  try {
    const r = await write();
    if (!r.ok) return { ok: false, error: MESSAGES[r.reason] ?? "Couldn't save." };
  } catch (err) {
    console.error("plan write failed", err);
    return { ok: false, error: "Couldn't save. Try again." };
  }
  refresh();
  return { ok: true };
}

function textOf(f: TaskFields): string | null {
  if (!f || !isText(f.task) || f.task.length > 200) return null;
  if (f.kind !== null && !KINDS.includes(f.kind)) return null;
  if (f.duration !== null && !(DURATIONS as readonly string[]).includes(f.duration)) return null;
  if (f.subject !== null && !subjectMap().has(f.subject)) return null;
  return taskText(f);
}

export async function tickTask(day: string, text: string, done: boolean): Promise<PlanResult> {
  if (!isDay(day) || !isText(text) || typeof done !== "boolean") return { ok: false, error: MESSAGES["not-found"] };
  return run(() => plan.tick(day, text, done));
}

export async function addTaskAction(day: string, fields: TaskFields): Promise<PlanResult> {
  const text = textOf(fields);
  if (!isDay(day) || !text) return { ok: false, error: "Write what the task is." };
  return run(() => plan.add(day, text));
}

export async function editTaskAction(day: string, text: string, fields: TaskFields): Promise<PlanResult> {
  const next = textOf(fields);
  if (!isDay(day) || !isText(text) || !next) return { ok: false, error: "Write what the task is." };
  return run(() => plan.edit(day, text, next));
}

export async function deleteTaskAction(day: string, text: string): Promise<PlanResult> {
  if (!isDay(day) || !isText(text)) return { ok: false, error: MESSAGES["not-found"] };
  return run(() => plan.remove(day, text));
}

export async function moveTaskAction(from: string, text: string, to: string): Promise<PlanResult> {
  if (!isDay(from) || !isDay(to) || from === to || !isText(text)) return { ok: false, error: MESSAGES["not-found"] };
  return run(() => plan.move(from, text, to));
}
