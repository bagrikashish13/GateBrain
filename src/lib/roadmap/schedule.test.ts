import { describe, expect, it } from "vitest";
import { getAllRoadmapTasks, getRoadmapDays, getRoadmapTasksForDay } from "./schedule";

describe("roadmap schedule", () => {
  it("extracts scheduled days from roadmap", () => {
    const days = getRoadmapDays();
    expect(days.has("2026-10-21")).toBe(true);
    const day = days.get("2026-10-21");
    expect(day).toMatchObject({
      date: "2026-10-21",
      lectures: 2,
      summary: "Ch-01 Lec 06 & 07 (LL)",
    });
    expect(day?.tasks).toHaveLength(2);
  });

  it("extracts tasks for 2026-10-21", () => {
    const tasks = getRoadmapTasksForDay("2026-10-21");
    expect(tasks).toHaveLength(2);
    expect(tasks[0]).toMatchObject({
      kind: "Learn",
      subject: "compiler-design",
      done: false,
    });
    expect(tasks[0].task).toContain("Ch-01 Lec 06: LL");
    expect(tasks[1].task).toContain("Ch-01 Lec 07: LL");
  });

  it("returns all roadmap tasks across all days", () => {
    const all = getAllRoadmapTasks();
    expect(all.has("2026-10-21")).toBe(true);
    expect(all.has("2026-10-22")).toBe(true);
    expect(all.has("2026-10-23")).toBe(true);
    expect(all.has("2026-10-24")).toBe(true);
    expect(all.has("2026-10-25")).toBe(true);
  });
});
