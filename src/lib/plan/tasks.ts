// The daily plan: brain/plan/YYYY-MM-DD.md, one file per day (pure: no fs). Written by him in the app
// or by Claude Code / Antigravity; the format (AGENTS.md) is the contract:
//
//   # Thu 15 Oct 2026
//   - [ ] PYQ · Deadlock 2010–2024 — 1h #os
//   - [x] Revise · Normal forms — 30m #dbms
//   - [>] Learn · LR parsing — 2h #compiler-design → 2026-10-16      moved to that day
//
// "<Kind> · " is optional (Learn, Revise, PYQ, Practice, Mock, Analyse), so is " — <duration>" and the
// " #<subject>" tag that colours the task. A task's identity is its text (the part after the box).

export const KINDS = ["Learn", "Revise", "PYQ", "Practice", "Mock", "Analyse"] as const;
export type Kind = (typeof KINDS)[number];
export const DURATIONS = ["15m", "30m", "45m", "1h", "1.5h", "2h", "3h"] as const;

export type Task = {
  text: string; // the line after "- [ ] " without a move's " → date"
  done: boolean;
  moved: string | null; // [>]: the day it moved to
  kind: Kind | null;
  task: string;
  duration: string | null;
  minutes: number;
  subject: string | null;
};

const ITEM = /^- \[( |x|X|>)\] (.*?)\s*$/;
const MOVED = /^(.*\S) → (\d{4}-\d{2}-\d{2})$/;
const DURATION = /^(\d+(?:\.\d+)?)(h|m)$/;
const FENCE = /^\s*(```|~~~)/;

export function minutesOf(d: string | null): number {
  const m = d ? DURATION.exec(d) : null;
  return m ? Math.round(Number(m[1]) * (m[2] === "h" ? 60 : 1)) : 0;
}

export function parseTaskText(text: string): Omit<Task, "text" | "done" | "moved"> {
  let rest = text.trim();
  let subject: string | null = null;
  const tag = /\s+#([a-z0-9][a-z0-9-]*)$/.exec(rest);
  if (tag) {
    subject = tag[1];
    rest = rest.slice(0, tag.index).trim();
  }
  let duration: string | null = null;
  const dash = rest.lastIndexOf(" — ");
  if (dash >= 0 && DURATION.test(rest.slice(dash + 3).trim())) {
    duration = rest.slice(dash + 3).trim();
    rest = rest.slice(0, dash).trim();
  }
  let kind: Kind | null = null;
  const dot = rest.indexOf(" · ");
  if (dot > 0) {
    const head = rest.slice(0, dot).trim().toLowerCase();
    const k = KINDS.find((x) => x.toLowerCase() === head);
    if (k) {
      kind = k;
      rest = rest.slice(dot + 3).trim();
    }
  }
  return { kind, task: rest, duration, minutes: minutesOf(duration), subject };
}

/** Build a task's text from its parts. */
export function taskText(p: { kind: Kind | null; task: string; duration: string | null; subject: string | null }): string {
  const task = p.task.replace(/\s+/g, " ").replace(/ → \d{4}-\d{2}-\d{2}$/, "").trim();
  return [p.kind ? `${p.kind} · ${task}` : task, p.duration ? ` — ${p.duration}` : "", p.subject ? ` #${p.subject}` : ""].join("");
}

/** Every task line of a day file, outside code fences. */
export function parseDay(raw: string): Task[] {
  const out: Task[] = [];
  let fence = false;
  for (const line of raw.replace(/\r\n/g, "\n").split("\n")) {
    if (FENCE.test(line)) fence = !fence;
    const m = fence ? null : ITEM.exec(line);
    if (!m) continue;
    const box = m[1];
    let text = m[2];
    let moved: string | null = null;
    if (box === ">") {
      const mv = MOVED.exec(text);
      if (mv) [text, moved] = [mv[1], mv[2]];
    }
    if (!text) continue;
    out.push({ text, done: box === "x" || box === "X", moved, ...parseTaskText(text) });
  }
  return out;
}

export type EditResult = { ok: true; raw: string } | { ok: false; reason: "not-found" | "ambiguous" | "already-there" };

/** Line indexes of the task with this exact text (outside fences). */
function find(lines: string[], text: string): number[] {
  const hits: number[] = [];
  let fence = false;
  lines.forEach((line, i) => {
    if (FENCE.test(line)) fence = !fence;
    const m = fence ? null : ITEM.exec(line);
    if (!m) return;
    const t = m[1] === ">" ? (MOVED.exec(m[2])?.[1] ?? m[2]) : m[2];
    if (t === text) hits.push(i);
  });
  return hits;
}

function one(raw: string, text: string): { lines: string[]; at: number } | { error: "not-found" | "ambiguous" } {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const hits = find(lines, text);
  if (!hits.length) return { error: "not-found" };
  if (hits.length > 1) return { error: "ambiguous" };
  return { lines, at: hits[0] };
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "# Thu 15 Oct 2026" for a new day file. */
export function heading(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  return `# ${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function flipTask(raw: string, text: string, done: boolean): EditResult {
  const hit = one(raw, text);
  if ("error" in hit) return { ok: false, reason: hit.error };
  hit.lines[hit.at] = `- [${done ? "x" : " "}] ${text}`;
  return { ok: true, raw: hit.lines.join("\n") };
}

/** Add a task at the end of the day's list (a new file gets its heading). */
export function addTask(raw: string | null, day: string, text: string): EditResult {
  const base = raw?.replace(/\r\n/g, "\n").trimEnd() || heading(day);
  if (find(base.split("\n"), text).length) return { ok: false, reason: "already-there" };
  const lines = base.split("\n");
  let fence = false;
  let last = -1;
  lines.forEach((l, i) => {
    if (FENCE.test(l)) fence = !fence;
    if (!fence && ITEM.test(l)) last = i;
  });
  const at = last >= 0 ? last + 1 : lines.length;
  if (last < 0 && lines.at(-1)?.trim()) lines.push("");
  lines.splice(last >= 0 ? at : lines.length, 0, `- [ ] ${text}`);
  return { ok: true, raw: lines.join("\n") + "\n" };
}

export function editTask(raw: string, text: string, next: string): EditResult {
  if (next !== text && find(raw.split("\n"), next).length) return { ok: false, reason: "already-there" };
  const hit = one(raw, text);
  if ("error" in hit) return { ok: false, reason: hit.error };
  const box = ITEM.exec(hit.lines[hit.at])![1];
  hit.lines[hit.at] = `- [${box === ">" ? " " : box}] ${next}`;
  return { ok: true, raw: hit.lines.join("\n") };
}

export function deleteTask(raw: string, text: string): EditResult {
  const hit = one(raw, text);
  if ("error" in hit) return { ok: false, reason: hit.error };
  hit.lines.splice(hit.at, 1);
  return { ok: true, raw: hit.lines.join("\n") };
}

/** Leave a "moved" marker on the old day: "- [>] <text> → <to>". */
export function markMoved(raw: string, text: string, to: string): EditResult {
  const hit = one(raw, text);
  if ("error" in hit) return { ok: false, reason: hit.error };
  hit.lines[hit.at] = `- [>] ${text} → ${to}`;
  return { ok: true, raw: hit.lines.join("\n") };
}
