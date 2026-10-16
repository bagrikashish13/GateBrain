import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { marksTop, parseRoadmap, phaseDays, position, rangeLabel, type Phase } from "./format";
import { cut, leg, lengthOf, link, links, pathOf, walkLeg, walked } from "./path";

const phase = (start: string, end: string, title = "Block"): Record<string, unknown> => ({ title, start, end, focus: [{ text: "x", top: true }, { text: "" }] });

describe("parseRoadmap", () => {
  it("reads phases and fills defaults", () => {
    const r = parseRoadmap({ done: ["os", 3], phases: [phase("2026-10-16", "2026-10-22", "Compiler Design")] });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.roadmap.done).toEqual(["os"]);
    expect(r.roadmap.phases[0]).toMatchObject({ title: "Compiler Design", short: "Comp", subject: null, marks: null, focus: [{ text: "x", top: true }], skip: [] });
  });

  it("rejects bad dates, reversed and overlapping blocks", () => {
    expect(parseRoadmap({ phases: [] })).toMatchObject({ ok: false });
    expect(parseRoadmap({ phases: [phase("2026-10-16", "oct")] })).toMatchObject({ ok: false });
    expect(parseRoadmap({ phases: [phase("2026-10-22", "2026-10-16")] })).toMatchObject({ ok: false, error: "phase 1: ends before it starts" });
    expect(parseRoadmap({ phases: [phase("2026-10-16", "2026-10-22"), phase("2026-10-22", "2026-10-30")] })).toMatchObject({ ok: false, error: "phase 2: overlaps the block before it" });
  });

  it("parses the real brain/roadmap.json", () => {
    const r = parseRoadmap(JSON.parse(readFileSync("brain/roadmap.json", "utf8")));
    expect(r).toMatchObject({ ok: true });
  });
});

describe("position", () => {
  const phases = [phase("2026-10-16", "2026-10-22"), phase("2026-10-23", "2026-11-02")].map((p) => p as unknown as Phase);

  it("finds the current block and how far through it today is", () => {
    const p = position(phases, "2026-10-16");
    expect(p).toMatchObject({ current: 0, status: ["now", "next"], daysLeftInBlock: 7, elapsed: 0, total: 18 });
    expect(p.through).toBeCloseTo(0.5 / 7);
    expect(position(phases, "2026-10-23")).toMatchObject({ current: 1, status: ["done", "now"], daysLeftInBlock: 11, elapsed: 7 });
  });

  it("handles before and after", () => {
    expect(position(phases, "2026-10-01")).toMatchObject({ current: null, through: 0, status: ["next", "next"], elapsed: 0 });
    expect(position(phases, "2026-12-01")).toMatchObject({ current: null, through: 1, status: ["done", "done"], elapsed: 18 });
  });

  it("counts days inclusively", () => {
    expect(phaseDays({ start: "2026-12-20", end: "2027-01-02" })).toBe(14);
  });
});

describe("labels", () => {
  it("formats ranges", () => {
    expect(rangeLabel("2026-10-16", "2026-10-22")).toBe("16–22 Oct");
    expect(rangeLabel("2026-10-23", "2026-11-02")).toBe("23 Oct – 2 Nov");
    expect(rangeLabel("2027-01-31", "2027-01-31")).toBe("31 Jan");
  });
  it("takes the top of a marks range", () => {
    expect(marksTop("13–16")).toBe(16);
    expect(marksTop("15")).toBe(15);
    expect(marksTop("none")).toBe(0);
  });
});

describe("path", () => {
  const a = { x: 40, y: 0 };
  const b = { x: 300, y: 100 };

  it("leaves straight down and enters straight from above", () => {
    const [p0, c1, c2, p3] = link(a, b);
    expect(p0).toEqual(a);
    expect(c1.x).toBe(a.x);
    expect(c2.x).toBe(b.x);
    expect(p3).toEqual(b);
    expect(pathOf(links([a, b]))).toBe("M40 0 C40 55 300 45 300 100");
  });

  it("cuts a curve: the ends match, the midpoint of a symmetric link is the centre", () => {
    const whole = link(a, b);
    expect(cut(whole, 1)[3]).toEqual(b);
    expect(cut(whole, 0)[3]).toEqual(a);
    expect(cut(whole, 0.5)[3]).toEqual({ x: 170, y: 50 });
  });

  it("measures length: a straight drop is its height", () => {
    expect(lengthOf(link({ x: 0, y: 0 }, { x: 0, y: 80 }))).toBeCloseTo(80, 5);
  });

  it("walks a leg through its waypoint by length", () => {
    const l = leg({ x: 40, y: 0 }, { x: 40, y: 400 }, { x: 40, y: 200 });
    expect(l).toHaveLength(2);
    expect(walkLeg(l, 0.5)).toHaveLength(1);
    expect(walkLeg(l, 0.5)[0][3].y).toBeCloseTo(200, 5);
    expect(walkLeg(l, 0.25)[0][3].y).toBeLessThan(200);
    expect(walkLeg(l, 1)).toHaveLength(2);
  });

  it("walks whole legs then part of the next", () => {
    const legs = links([a, b, { x: 40, y: 200 }]).map((c) => [c]);
    expect(walked(legs, 0, 0)).toHaveLength(0);
    expect(walked(legs, 1, 0)).toHaveLength(1);
    expect(walked(legs, 1, 0.5)).toHaveLength(2);
    expect(walked(legs, 2, 0.5)).toHaveLength(2);
  });
});
