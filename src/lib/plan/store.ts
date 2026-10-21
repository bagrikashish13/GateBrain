import "server-only";

import { readdirSync } from "node:fs";
import { commitFiles } from "@/lib/repo/git";
import { brainPath, readBrainText } from "@/lib/repo/paths";
import { isDay } from "@/lib/time";
import { addTask, deleteTask, editTask, flipTask, heading, markMoved, parseDay, type EditResult, type Task } from "./tasks";
import { getAllRoadmapTasks } from "@/lib/roadmap/schedule";

// brain/plan/<day>.md on disk; every change is one commit (pushed right after).

const file = (day: string) => `plan/${day}.md`;

/** Every planned day with its tasks (including scheduled roadmap tasks). */
export function planDays(): Map<string, Task[]> {
  const out = new Map<string, Task[]>();
  let names: string[] = [];
  try {
    names = readdirSync(brainPath("plan"));
  } catch {
    // continue
  }
  for (const n of names.sort()) {
    const day = n.replace(/\.md$/, "");
    if (!n.endsWith(".md") || !isDay(day)) continue;
    out.set(day, parseDay(readBrainText(file(day)) ?? ""));
  }
  const roadmapTasks = getAllRoadmapTasks();
  for (const [day, tasks] of roadmapTasks) {
    const existing = out.get(day);
    if (!existing) {
      out.set(day, [...tasks]);
    } else {
      const existingTexts = new Set(existing.map((t) => t.text));
      for (const t of tasks) {
        if (!existingTexts.has(t.text)) {
          existing.push(t);
        }
      }
    }
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

export const tick = (day: string, text: string, done: boolean) =>
  write(
    day,
    (raw) => {
      const base = raw ?? heading(day) + "\n";
      const flipped = flipTask(base, text, done);
      if (flipped.ok) return flipped;
      const lines = base.trimEnd().split("\n");
      lines.push(`- [${done ? "x" : " "}] ${text}`);
      return { ok: true, raw: lines.join("\n") + "\n" };
    },
    `plan: ${done ? "done" : "undo"} ${day}`,
  );

export const add = (day: string, text: string) => write(day, (raw) => addTask(raw, day, text), `plan: add task ${day}`);

export const edit = (day: string, text: string, next: string) =>
  write(
    day,
    (raw) => {
      const base = raw ?? heading(day) + "\n";
      const edited = editTask(base, text, next);
      if (edited.ok) return edited;
      return addTask(base, day, next);
    },
    `plan: edit task ${day}`,
  );

export const remove = (day: string, text: string) =>
  write(
    day,
    (raw) => {
      if (raw === null) return { ok: true, raw: heading(day) + "\n" };
      const deleted = deleteTask(raw, text);
      if (deleted.ok) return deleted;
      return { ok: true, raw };
    },
    `plan: delete task ${day}`,
  );

/** Move an undone task: a marker stays on the old day, the task joins the new one. One commit. */
export async function move(from: string, text: string, to: string): Promise<WriteResult> {
  const rawFrom = readBrainText(file(from)) ?? heading(from) + "\n";
  let a = markMoved(rawFrom, text, to);
  if (!a.ok) {
    const lines = rawFrom.trimEnd().split("\n");
    lines.push(`- [>] ${text} → ${to}`);
    a = { ok: true, raw: lines.join("\n") + "\n" };
  }
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
