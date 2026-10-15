import "server-only";

import { readdirSync } from "node:fs";
import { commitFiles } from "@/lib/repo/git";
import { brainPath, readBrainText } from "@/lib/repo/paths";
import { isDay } from "@/lib/time";
import { addTask, deleteTask, editTask, flipTask, markMoved, parseDay, type EditResult, type Task } from "./tasks";

// brain/plan/<day>.md on disk; every change is one commit (pushed right after).

const file = (day: string) => `plan/${day}.md`;

/** Every planned day with its tasks. */
export function planDays(): Map<string, Task[]> {
  const out = new Map<string, Task[]>();
  let names: string[] = [];
  try {
    names = readdirSync(brainPath("plan"));
  } catch {
    return out;
  }
  for (const n of names.sort()) {
    const day = n.replace(/\.md$/, "");
    if (!n.endsWith(".md") || !isDay(day)) continue;
    out.set(day, parseDay(readBrainText(file(day)) ?? ""));
  }
  return out;
}

export type WriteResult = { ok: true } | { ok: false; reason: Exclude<EditResult, { ok: true }>["reason"] | "no-day" };

async function write(day: string, change: (raw: string | null) => EditResult, message: string): Promise<WriteResult> {
  const r = change(readBrainText(file(day)));
  if (!r.ok) return r;
  await commitFiles([{ path: `brain/${file(day)}`, content: r.raw }], message);
  return { ok: true };
}

const need = (raw: string | null, f: (raw: string) => EditResult): EditResult => (raw === null ? { ok: false, reason: "not-found" } : f(raw));

export const tick = (day: string, text: string, done: boolean) =>
  write(day, (raw) => need(raw, (r) => flipTask(r, text, done)), `plan: ${done ? "done" : "undo"} ${day}`);

export const add = (day: string, text: string) => write(day, (raw) => addTask(raw, day, text), `plan: add task ${day}`);

export const edit = (day: string, text: string, next: string) => write(day, (raw) => need(raw, (r) => editTask(r, text, next)), `plan: edit task ${day}`);

export const remove = (day: string, text: string) => write(day, (raw) => need(raw, (r) => deleteTask(r, text)), `plan: delete task ${day}`);

/** Move an undone task: a marker stays on the old day, the task joins the new one. One commit. */
export async function move(from: string, text: string, to: string): Promise<WriteResult> {
  const a = need(readBrainText(file(from)), (r) => markMoved(r, text, to));
  if (!a.ok) return a;
  const b = addTask(readBrainText(file(to)), to, text);
  if (!b.ok) return b;
  await commitFiles(
    [
      { path: `brain/${file(from)}`, content: a.raw },
      { path: `brain/${file(to)}`, content: b.raw },
    ],
    `plan: move task ${from} → ${to}`,
  );
  return { ok: true };
}
