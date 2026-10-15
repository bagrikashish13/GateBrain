import { describe, expect, it } from "vitest";
import { addTask, deleteTask, editTask, flipTask, markMoved, parseDay, parseTaskText, taskText } from "./tasks";

const FENCE = "```";
const DAY = `# Thu 15 Oct 2026

- [ ] PYQ · Deadlock 2010–2024 — 1h #os
- [x] Revise · Normal forms — 30m #dbms
- [>] Learn · LR parsing — 2h #compiler-design → 2026-10-16
- [ ] Plain task

${FENCE}
- [ ] not a task, inside a fence
${FENCE}
`;

describe("parseDay", () => {
  it("reads kind, task, duration, subject and moves", () => {
    const t = parseDay(DAY);
    expect(t).toHaveLength(4);
    expect(t[0]).toMatchObject({ kind: "PYQ", task: "Deadlock 2010–2024", duration: "1h", minutes: 60, subject: "os", done: false });
    expect(t[1]).toMatchObject({ kind: "Revise", done: true, subject: "dbms" });
    expect(t[2]).toMatchObject({ kind: "Learn", moved: "2026-10-16", text: "Learn · LR parsing — 2h #compiler-design" });
    expect(t[3]).toMatchObject({ kind: null, task: "Plain task", duration: null, subject: null });
  });

  it("builds the same text back", () => {
    const parts = parseTaskText("Practice · Banker's algorithm — 45m #os");
    expect(taskText(parts)).toBe("Practice · Banker's algorithm — 45m #os");
  });
});

describe("edits", () => {
  it("ticks one line", () => {
    const r = flipTask(DAY, "Plain task", true);
    expect(r.ok && r.raw).toContain("- [x] Plain task");
  });

  it("adds after the last task, never inside a fence; a new day gets a heading", () => {
    const r = addTask(DAY, "2026-10-15", "New one");
    expect(r.ok && r.raw.split("\n")[6]).toBe("- [ ] New one");
    const fresh = addTask(null, "2026-10-17", "First");
    expect(fresh.ok && fresh.raw).toBe("# Sat 17 Oct 2026\n\n- [ ] First\n");
    expect(addTask(DAY, "2026-10-15", "Plain task")).toEqual({ ok: false, reason: "already-there" });
  });

  it("edits, deletes and marks moved", () => {
    const e = editTask(DAY, "Plain task", "Plainer task");
    expect(e.ok && e.raw).toContain("- [ ] Plainer task");
    const d = deleteTask(DAY, "Plain task");
    expect(d.ok && d.raw).not.toContain("Plain task");
    const m = markMoved(DAY, "Plain task", "2026-10-20");
    expect(m.ok && m.raw).toContain("- [>] Plain task → 2026-10-20");
    expect(flipTask(DAY, "nope", true)).toEqual({ ok: false, reason: "not-found" });
  });
});
