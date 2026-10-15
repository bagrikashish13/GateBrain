import { describe, expect, it } from "vitest";
import { parseTest, type Test } from "./format";
import { SAMPLE } from "./fixture";
import { grade, gradeAll, paletteStatus, summarize, type QState } from "./grade";

const test = (() => {
  const r = parseTest("sample", SAMPLE);
  if (!r.ok) throw new Error();
  return r.test;
})() as Test;
const [mcq, msq, nat, mcq2] = test.questions;
const st = (response: string | null, extra: Partial<QState> = {}): QState => ({ response, visited: true, marked: false, timeMs: 10_000, visits: 1, ...extra });

describe("grade", () => {
  it("MCQ: full marks, or minus a third", () => {
    expect(grade(mcq, "B")).toEqual({ outcome: "correct", awarded: 1 });
    expect(grade(mcq, "A").outcome).toBe("wrong");
    expect(grade(mcq, "A").awarded).toBeCloseTo(-1 / 3);
    expect(grade(mcq2, "A").awarded).toBeCloseTo(-2 / 3);
    expect(grade(mcq, null)).toEqual({ outcome: "unattempted", awarded: 0 });
  });

  it("MSQ: only the exact set scores, never negative", () => {
    expect(grade(msq, "C,A")).toEqual({ outcome: "correct", awarded: 2 });
    expect(grade(msq, "A")).toEqual({ outcome: "wrong", awarded: 0 });
    expect(grade(msq, "A,B,C")).toEqual({ outcome: "wrong", awarded: 0 });
  });

  it("NAT: inside the range, never negative", () => {
    expect(grade(nat, "4.5")).toEqual({ outcome: "correct", awarded: 2 });
    expect(grade(nat, "4.60")).toEqual({ outcome: "correct", awarded: 2 });
    expect(grade(nat, "4.61")).toEqual({ outcome: "wrong", awarded: 0 });
    expect(grade(nat, "-")).toEqual({ outcome: "wrong", awarded: 0 });
  });
});

describe("summarize", () => {
  it("adds up score, negatives and groups", () => {
    const rows = gradeAll(test, [st("A"), st("A,C"), st(null), st("C", { marked: true })]);
    const s = summarize(rows);
    expect(s.score).toBeCloseTo(-1 / 3 + 2 + 2, 2);
    expect(s.max).toBe(7);
    expect([s.correct, s.wrong, s.unattempted]).toEqual([2, 1, 1]);
    expect(s.negative).toBeCloseTo(0.33, 2);
    expect(s.accuracy).toBeCloseTo(2 / 3);
    expect(s.bySubject.find((b) => b.subject === "os")).toMatchObject({ questions: 2, wrong: 1, unattempted: 1 });
    expect(s.byTopic.find((b) => b.topic === "deadlock")).toMatchObject({ wrong: 1 });
    expect(s.timeSec).toBe(40);
  });
});

describe("paletteStatus", () => {
  it("names each state as GATE's legend does", () => {
    expect(paletteStatus({ ...st(null), visited: false })).toBe("not-visited");
    expect(paletteStatus(st(null))).toBe("not-answered");
    expect(paletteStatus(st("A"))).toBe("answered");
    expect(paletteStatus(st(null, { marked: true }))).toBe("marked");
    expect(paletteStatus(st("A", { marked: true }))).toBe("answered-marked");
  });
});
