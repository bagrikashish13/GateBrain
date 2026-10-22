import { describe, expect, it } from "vitest";
import { CAPS, checkLog, isoWeek, startupFiles } from "./log";

const files = (o: Record<string, string>) => new Map(Object.entries(o));
const lines = (n: number) => Array.from({ length: n }, (_, i) => `line ${i}`).join("\n");

describe("session log", () => {
  it("knows ISO weeks, across year ends too", () => {
    expect(isoWeek("2026-10-22")).toBe("2026-W43");
    expect(isoWeek("2026-10-19")).toBe("2026-W43");
    expect(isoWeek("2026-10-18")).toBe("2026-W42");
    expect(isoWeek("2026-01-01")).toBe("2026-W01");
    expect(isoWeek("2025-12-29")).toBe("2026-W01");
    expect(isoWeek("2027-01-03")).toBe("2026-W53");
    expect(isoWeek("2027-01-04")).toBe("2027-W01");
  });

  it("is fine with today, yesterday, this week and a current summary", () => {
    const f = files({ "now.md": "x", "days/2026-10-22.md": "x", "days/2026-10-21.md": "x", "weeks/2026-W43.md": "x", "weeks/2026-W42.md": "x", "summary.md": "Through: 2026-W42\n" });
    expect(checkLog(f, "2026-10-22")).toEqual([]);
  });

  it("asks to fold old days into their week, and finished weeks into the summary", () => {
    const f = files({ "days/2026-10-19.md": "x", "weeks/2026-W42.md": "x", "summary.md": "Through: 2026-W41\n" });
    const p = checkLog(f, "2026-10-22");
    expect(p[0]).toContain("Merge it into weeks/2026-W43.md");
    expect(p[1]).toContain('"Through: 2026-W42"');
  });

  it("holds every file to its line cap", () => {
    const f = files({ "now.md": lines(CAPS.now + 1), "summary.md": `Through: none\n${lines(CAPS.summary)}`, "days/2026-10-22.md": lines(CAPS.day) });
    const p = checkLog(f, "2026-10-22");
    expect(p).toHaveLength(2);
    expect(p[0]).toContain("now.md: 16 lines, cap 15");
    expect(p[1]).toContain("summary.md: 61 lines, cap 60");
  });

  it("rejects stray files and a summary without its Through line", () => {
    const p = checkLog(files({ "notes.md": "x", "summary.md": "no marker" }), "2026-10-22");
    expect(p.some((x) => x.startsWith("summary.md: needs"))).toBe(true);
    expect(p.some((x) => x.startsWith("notes.md: not a log file"))).toBe(true);
  });

  it("starts a session from a fixed set of files", () => {
    const all = ["now.md", "days/2026-10-20.md", "days/2026-10-21.md", "days/2026-10-22.md", "weeks/2026-W42.md", "weeks/2026-W43.md", "summary.md"];
    expect(startupFiles(all, "2026-10-22")).toEqual(["now.md", "days/2026-10-21.md", "days/2026-10-22.md", "weeks/2026-W43.md", "summary.md"]);
  });
});
