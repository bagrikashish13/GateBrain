import { describe, expect, it } from "vitest";
import { parseTest, type Test } from "@/lib/tests/format";
import type { Result } from "@/lib/tests/result";
import { loadSyllabus } from "./load";
import { auditTest, buildCatalog, checkDone, daysBehind, drill, missedItems, nextStep, parseSyllabus, planTest, validate, type Attempted, type Blueprint, type Pyq, type Sequence, type State } from "./syllabus";

const MD = `# Part

## D01 · Arrays
notes: programming-ds/10-arrays
hours: 2

### Basics
- D01.1 T What an array is.
- D01.2 Q Address of an element. PYQ: 2020-1, 2002-2

## D02 · Stacks
notes: programming-ds/11-stacks
hours: 1

- D02.1 T Push and pop.
- D02.2 L Old stuff. PYQ: 1990-1, 1989-1
`;

const pyq = (id: string, year: number): Pyq => ({ id, title: id, paper: "CS", year, set: null, q: "1", marks: 1, type: "MCQ", level: null, scope: "core", tags: [], url: null });
const PYQS = new Map([pyq("2020-1", 2020), pyq("2002-2", 2002), pyq("1990-1", 1990), pyq("1989-1", 1989)].map((p) => [p.id, p]));
const UNIT: Blueprint = { label: "Unit test", questions: 2, ones: 1, twos: 1, minutes: 6, mcq: [1, 2], msq: [0, 1], nat: [0, 1], pass: 0.7, earlierMax: 0 };
const SEQUENCE: Sequence = {
  blueprints: { unit: UNIT },
  steps: [
    { unit: "D01", by: "2026-11-01" },
    { test: "t1", kind: "unit", covers: ["D01"], by: "2026-11-02" },
    { unit: "D02", by: "2026-11-03" },
    { test: "t2", kind: "unit", covers: ["D02"], by: "2026-11-04" },
  ],
};

const errors: string[] = [];
const units = parseSyllabus("x.md", MD, errors);
const catalog = buildCatalog(units);

function state(over: Partial<State> = {}): State {
  return { catalog, pyqs: PYQS, sequence: SEQUENCE, progress: { done: {} }, tests: new Map(), hasNotes: () => true, ...over };
}

const TEST = (syllabus = "D01.2", topic = "arrays") => `---
title: T1
duration: 6
---

## Q1
type: MCQ
marks: 1
subject: programming-ds
topic: ${topic}
answer: A
syllabus: ${syllabus}

Question one?

(A) a
(B) b
(C) c
(D) d

### Solution
Because.

## Q2
type: NAT
marks: 2
subject: programming-ds
topic: ${topic}
answer: 4
syllabus: ${syllabus}

Question two?

### Solution
Because.
`;

function parsed(raw: string): Test {
  const r = parseTest("t1", raw);
  if (!r.ok) throw new Error(r.errors.join("\n"));
  return r.test;
}

function result(score: number, outcomes: ("correct" | "wrong")[], analysed = true): Result {
  return {
    test: "t1",
    title: "T1",
    attempt: "2026-11-02-1000",
    started: "",
    submitted: "",
    durationMin: 6,
    timeUsedSec: 100,
    autoSubmitted: false,
    questions: outcomes.map((outcome, i) => ({ n: i + 1, subject: "programming-ds", topic: "arrays", type: "MCQ", marks: 1, answer: "A", response: "A", outcome, awarded: 1, timeSec: 10, visits: 1, marked: false })),
    summary: { score, max: 3 } as Result["summary"],
    analysis: analysed ? "Went fine." : null,
  };
}

const allD01 = { "D01.1": "d", "D01.2": "d" };

describe("parseSyllabus", () => {
  it("reads units, subtopics, kinds and PYQs", () => {
    expect(errors).toEqual([]);
    expect(units.map((u) => u.id)).toEqual(["D01", "D02"]);
    const [a, b] = units[0].items;
    expect(a).toMatchObject({ id: "D01.1", kind: "T", subtopic: "Basics", pyqs: [] });
    expect(b.pyqs).toEqual(["2020-1", "2002-2"]);
    expect(b.text).toBe("Address of an element.");
  });

  it("refuses a gap in the numbering", () => {
    const bad: string[] = [];
    parseSyllabus("x.md", "## D01 · A\n- D01.2 T Skipped one.\n", bad);
    expect(bad[0]).toContain("should be numbered D01.1");
  });
});

describe("validate", () => {
  it("passes a complete syllabus", () => {
    expect(validate(catalog, PYQS, SEQUENCE, { done: {} })).toEqual([]);
  });

  it("catches an uncovered PYQ, an unknown one and an unscheduled unit", () => {
    const pyqs = new Map(PYQS);
    pyqs.set("2021-9", pyq("2021-9", 2021));
    pyqs.delete("1989-1");
    const out = validate(catalog, pyqs, { ...SEQUENCE, steps: SEQUENCE.steps.slice(0, 2) }, { done: { "Z99.1": "x" } });
    expect(out.join("\n")).toContain("PYQ 2021-9 is in the index but no syllabus item covers it");
    expect(out.join("\n")).toContain('unknown PYQ "1989-1"');
    expect(out.join("\n")).toContain("unit D02 is never scheduled");
    expect(out.join("\n")).toContain("unknown item Z99.1");
  });

  it("catches a pattern with no PYQ", () => {
    const u = parseSyllabus("x.md", "## D01 · A\nnotes: programming-ds/10-arrays\nhours: 1\n- D01.1 Q No citation.\n", []);
    const out = validate(buildCatalog(u), new Map(), { blueprints: {}, steps: [{ unit: "D01", by: "2026-11-01" }] }, { done: {} });
    expect(out.join("\n")).toContain("must cite at least one PYQ");
  });
});

describe("drill", () => {
  it("takes everything since 2014 and tops up with older ones", () => {
    const d = drill(catalog.items.get("D01.2")!, PYQS);
    expect(d.must.map((p) => p.id)).toEqual(["2020-1", "2002-2"]);
    expect(d.extra).toEqual([]);
  });

  it("asks for one PYQ only on a legacy item", () => {
    const d = drill(catalog.items.get("D02.2")!, PYQS);
    expect(d.must.map((p) => p.id)).toEqual(["1990-1"]);
    expect(d.extra.map((p) => p.id)).toEqual(["1989-1"]);
  });
});

describe("nextStep", () => {
  it("teaches the first untaught item", () => {
    const n = nextStep(state());
    expect(n.kind === "teach" && n.item.id).toBe("D01.1");
  });

  it("wants notes before the test", () => {
    const n = nextStep(state({ progress: { done: allD01 }, hasNotes: () => false }));
    expect(n.kind).toBe("notes");
  });

  it("blocks teaching at every stage of a test", () => {
    const base = { progress: { done: allD01 } };
    expect(nextStep(state(base)).kind).toBe("write-test");
    const written: Attempted = { test: parsed(TEST()), first: null };
    expect(nextStep(state({ ...base, tests: new Map([["t1", written]]) })).kind).toBe("take-test");
    const taken: Attempted = { test: written.test, first: result(3, ["correct", "correct"], false) };
    expect(nextStep(state({ ...base, tests: new Map([["t1", taken]]) })).kind).toBe("analyse-test");
  });

  it("moves on after a pass", () => {
    const passed: Attempted = { test: parsed(TEST()), first: result(3, ["correct", "correct"]) };
    const n = nextStep(state({ progress: { done: allD01 }, tests: new Map([["t1", passed]]) }));
    expect(n.kind === "teach" && n.item.id).toBe("D02.1");
  });

  it("re-teaches the missed items after a fail, then allows exactly one retest", () => {
    const failed: Attempted = { test: parsed(TEST()), first: result(1, ["wrong", "correct"]) };
    const n = nextStep(state({ progress: { done: allD01 }, tests: new Map([["t1", failed]]) }));
    expect(n.kind).toBe("reteach");
    if (n.kind === "reteach") {
      expect(n.missed).toEqual(["D01.2"]);
      expect(n.retest).toBe("t1-r2");
    }
    const retest: Attempted = { test: parsed(TEST()), first: result(1, ["wrong", "correct"]) };
    const after = nextStep(state({ progress: { done: allD01 }, tests: new Map([["t1", failed], ["t1-r2", retest]]) }));
    expect(after.kind === "teach" && after.item.id).toBe("D02.1");
  });

  it("finishes", () => {
    const passed: Attempted = { test: parsed(TEST()), first: result(3, ["correct", "correct"]) };
    const n = nextStep(state({ progress: { done: { ...allD01, "D02.1": "d", "D02.2": "d" } }, tests: new Map([["t1", passed], ["t2", passed]]) }));
    expect(n.kind).toBe("finished");
  });
});

describe("checkDone", () => {
  it("refuses to skip an item", () => {
    expect(checkDone(state(), ["D01.2"])).toContain("the next item is D01.1");
  });

  it("allows several in order", () => {
    expect(checkDone(state(), ["D01.1", "D01.2"])).toBeNull();
  });

  it("refuses to go past a test that is due", () => {
    expect(checkDone(state({ progress: { done: allD01 } }), ["D02.1"])).toContain("First: writing test t1");
  });

  it("refuses an unknown item", () => {
    expect(checkDone(state(), ["Z99.9"])).toContain("Unknown item");
  });
});

describe("planTest and auditTest", () => {
  it("lists what the test must cover, with weak items first", () => {
    const failed: Attempted = { test: parsed(TEST()), first: result(1, ["correct", "wrong"]) };
    const plan = planTest(state({ progress: { done: allD01 }, tests: new Map([["t1", failed]]) }), "t2");
    expect(plan?.covers).toEqual(["D02"]);
    expect(plan?.earlier).toEqual(["D01"]);
    expect(plan?.carry.map((i) => i.id)).toEqual(["D01.2"]);
    expect(missedItems(failed)).toEqual(["D01.2"]);
  });

  it("passes a test that matches the blueprint", () => {
    expect(auditTest(state(), "t1", parsed(TEST())).errors).toEqual([]);
  });

  it("rejects the wrong shape", () => {
    const raw = TEST().replace("duration: 6", "duration: 60");
    expect(auditTest(state(), "t1", parsed(raw)).errors.join("\n")).toContain("the blueprint says 6 minutes");
    const short = TEST().slice(0, TEST().indexOf("## Q2"));
    expect(auditTest(state(), "t1", parsed(short)).errors.join("\n")).toContain("1 questions, the blueprint says 2");
  });

  it("rejects missing, later, legacy and unknown items and the wrong topic", () => {
    const check = (raw: string) => auditTest(state(), "t1", parsed(raw)).errors.join("\n");
    expect(check(TEST().replace(/syllabus: .*\n/g, ""))).toContain('add a "syllabus:" line');
    expect(check(TEST("D02.1", "stacks"))).toContain("is taught after this test");
    expect(check(TEST("D02.2", "stacks"))).toContain("legacy");
    expect(check(TEST("Z99.1"))).toContain("unknown syllabus item");
    expect(check(TEST("D01.2", "stacks"))).toContain("topic should be arrays");
  });

  it("asks a retest to target what the first attempt missed, not every unit", () => {
    const failed: Attempted = { test: parsed(TEST()), first: result(0, ["wrong", "wrong"]) };
    const seq: Sequence = { ...SEQUENCE, steps: [{ unit: "D01", by: "2026-11-01" }, { unit: "D02", by: "2026-11-02" }, { test: "t1", kind: "unit", covers: ["D01", "D02"], by: "2026-11-03" }] };
    const s = state({ sequence: seq, progress: { done: { ...allD01, "D02.1": "d", "D02.2": "d" } }, tests: new Map([["t1", failed]]) });
    expect(auditTest(s, "t1", parsed(TEST())).errors.join("\n")).toContain("No question from D02");
    expect(auditTest(s, "t1-r2", parsed(TEST())).errors).toEqual([]);
    expect(auditTest(s, "t1-r2", parsed(TEST("D01.1"))).errors.join("\n")).toContain("test what the first attempt missed");
  });

  it("rejects a test that is not in the sequence", () => {
    expect(auditTest(state(), "nope", parsed(TEST())).errors[0]).toContain("not a test");
  });
});

describe("daysBehind", () => {
  it("counts whole days past the target", () => {
    expect(daysBehind("2026-11-06", "2026-11-06")).toBe(0);
    expect(daysBehind("2026-11-01", "2026-11-06")).toBe(0);
    expect(daysBehind("2026-11-09", "2026-11-06")).toBe(3);
  });
});

describe("the real brain/syllabus", () => {
  const { state: real, errors: parseErrors } = loadSyllabus("brain");

  it("parses and validates: every PYQ is covered and every unit is scheduled and tested", () => {
    expect(parseErrors).toEqual([]);
    expect(validate(real.catalog, real.pyqs, real.sequence, real.progress)).toEqual([]);
  });

  it("has a next step", () => {
    expect(nextStep(real).kind).not.toBe("finished");
  });
});
