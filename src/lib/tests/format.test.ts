import { describe, expect, it } from "vitest";
import { answerText, parseNatAnswer, parseTest, sectionsOf } from "./format";
import { SAMPLE } from "./fixture";

describe("parseTest", () => {
  it("reads the frontmatter and every question", () => {
    const r = parseTest("sample", SAMPLE);
    if (!r.ok) throw new Error(r.errors.join("\n"));
    const t = r.test;
    expect(t.title).toBe("OS + DBMS · Sample");
    expect(t.duration).toBe(30);
    expect(t.created).toBe("2026-10-15");
    expect(t.questions.map((q) => q.type)).toEqual(["MCQ", "MSQ", "NAT", "MCQ"]);
    expect(t.totalMarks).toBe(7);
  });

  it("splits question text, options and solution", () => {
    const r = parseTest("sample", SAMPLE);
    if (!r.ok) throw new Error();
    const [q1, , q3] = r.test.questions;
    expect(q1.text).toBe("Which is **not** a necessary condition for deadlock?");
    expect(q1.options.map((o) => o.key)).toEqual(["A", "B", "C", "D"]);
    expect(q1.options[1].text).toBe("Preemption");
    expect(q1.solution).toBe("Deadlock needs *no* preemption.");
    expect(q1.topic).toBe("deadlock");
    // A code fence keeps its "## Q9" and "(A)" lines as text.
    expect(q3.text).toContain("## Q9 inside a code block");
    expect(q3.options).toEqual([]);
  });

  it("uses GATE's default negative marks and sections", () => {
    const r = parseTest("sample", SAMPLE);
    if (!r.ok) throw new Error();
    const [q1, q2, q3, q4] = r.test.questions;
    expect(q1.negative).toBeCloseTo(1 / 3);
    expect(q4.negative).toBeCloseTo(2 / 3);
    expect(q2.negative).toBe(0);
    expect(q3.negative).toBe(0);
    expect(q4.section).toBe("General Aptitude");
    expect(sectionsOf(r.test)).toEqual(["General Aptitude", "Technical"]);
  });

  it("parses answers of every type", () => {
    const r = parseTest("sample", SAMPLE);
    if (!r.ok) throw new Error();
    expect(r.test.questions.map((q) => answerText(q.answer))).toEqual(["B", "A, C", "4.5 to 4.6", "C"]);
  });

  it("reports what's wrong, per question", () => {
    const bad = "---\ntitle: Bad\n---\n## Q1\ntype: MCQ\nmarks: 1\nsubject: os\nanswer: E\n\nQ?\n\n(A) x\n(B) y\n\n## Q2\ntype: NAT\nmarks: 1\nanswer: abc\n\nQ?";
    const r = parseTest("bad", bad);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors).toContain("Frontmatter: duration must be the time limit in minutes, like `duration: 60`.");
    expect(r.errors.some((e) => e.startsWith("Q1: answer must be one of A, B"))).toBe(true);
    expect(r.errors.some((e) => e.startsWith("Q2: add a subject"))).toBe(true);
    expect(r.errors.some((e) => e.startsWith("Q2: answer must be a number"))).toBe(true);
  });

  it("rejects file names that aren't ids", () => {
    expect(parseTest("bad name", SAMPLE).ok).toBe(false);
  });
});

describe("parseNatAnswer", () => {
  it("takes a number or a range", () => {
    expect(parseNatAnswer("42")).toEqual({ min: 42, max: 42 });
    expect(parseNatAnswer("-1.5")).toEqual({ min: -1.5, max: -1.5 });
    expect(parseNatAnswer("2.40 to 2.60")).toEqual({ min: 2.4, max: 2.6 });
    expect(parseNatAnswer("2.4..2.6")).toEqual({ min: 2.4, max: 2.6 });
    expect(parseNatAnswer("3 to 2")).toBeNull();
    expect(parseNatAnswer("about 3")).toBeNull();
  });
});
