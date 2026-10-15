import { describe, expect, it } from "vitest";
import { parseTest } from "./format";
import { SAMPLE } from "./fixture";
import { gradeAll } from "./grade";
import { buildResult, duration, parseResult } from "./result";
import { topicStats, weakTopics } from "./topics";

const test = (() => {
  const r = parseTest("sample", SAMPLE);
  if (!r.ok) throw new Error();
  return r.test;
})();

const make = (responses: (string | null)[], at = "2026-10-15T09:00:00.000Z") => {
  const graded = gradeAll(
    test,
    responses.map((response, i) => ({ response, visited: true, marked: i === 3, timeMs: (i + 1) * 30_000, visits: 1 })),
  );
  const started = new Date(at);
  return buildResult({ test, attempt: "2026-10-15-1430", started, submitted: new Date(started.getTime() + 20 * 60_000), autoSubmitted: false, graded, subjectName: (k) => k.toUpperCase() });
};

describe("result files", () => {
  it("round-trips through Markdown", () => {
    const md = make(["A", "A,C", "4.55", null]);
    const r = parseResult("2026-10-15-1430", md);
    expect(r).not.toBeNull();
    expect(r!.test).toBe("sample");
    expect(r!.timeUsedSec).toBe(1200);
    expect(r!.questions.map((q) => q.outcome)).toEqual(["wrong", "correct", "correct", "unattempted"]);
    expect(r!.questions[1]).toMatchObject({ response: "A,C", answer: "A, C", marked: false, timeSec: 60 });
    expect(r!.questions[3].marked).toBe(true);
    expect(r!.summary.score).toBeCloseTo(3.67, 2);
    expect(r!.analysis).toBeNull();
    expect(md).toContain("## By topic (weakest first)");
    expect(md).toContain("| 1 | OS · deadlock | MCQ | 1 | A | B | wrong | -0.33 | 30s | 1 |");
  });

  it("picks up an agent's ## Analysis section", () => {
    const md = make(["B", null, null, null]) + "\n## Analysis\nRevise **deadlock** prevention.\n";
    expect(parseResult("x", md)!.analysis).toBe("Revise **deadlock** prevention.");
  });

  it("pools topics across attempts and flags the weak ones", () => {
    const a = parseResult("a", make(["A", "A", null, "C"], "2026-10-14T09:00:00.000Z"))!;
    const b = parseResult("b", make(["A", "A,C", "4.5", "C"], "2026-10-15T09:00:00.000Z"))!;
    const stats = topicStats([a, b]);
    expect(stats.find((t) => t.topic === "deadlock")).toMatchObject({ questions: 2, correct: 0, wrong: 2 });
    expect(weakTopics(stats).map((t) => t.topic)).toEqual(["deadlock", "functional-dependencies-normal-forms", "cpu-scheduling"]);
  });

  it("formats durations", () => {
    expect(duration(45)).toBe("45s");
    expect(duration(3412)).toBe("56m 52s");
    expect(duration(3725)).toBe("1h 02m");
  });
});
