import { describe, expect, it } from "vitest";
import { parseTest } from "@/lib/tests/format";
import type { Result } from "@/lib/tests/result";
import { loadSyllabus } from "./load";
import { buildCatalog, parseSyllabus, type Attempted, type Blueprint, type Pyq, type Sequence, type State } from "./syllabus";
import { buildTree, streakOf, type TreeTest, type TreeUnit } from "./tree";

const MD = `# Part 1 · Programming in C

## P01 · One
notes: programming-ds/00-one
hours: 2

### Basics
- P01.1 T First thing.
- P01.2 Q A pattern. PYQ: 2020-1

## P02 · Two
notes: programming-ds/01-two
hours: 2

- P02.1 T Second thing.
- P02.2 T Third thing.
`;

const pyq = (id: string): Pyq => ({ id, title: id, paper: "CS", year: 2020, set: null, q: "1", marks: 1, type: "MCQ", level: null, scope: "core", tags: [], url: null, uses: [] });
const UNIT: Blueprint = { label: "Unit test", questions: 1, ones: 1, twos: 0, minutes: 3, mcq: [1, 1], msq: [0, 0], nat: [0, 0], pass: 0.7, earlierMax: 0 };
const SEQ: Sequence = {
  blueprints: { unit: UNIT, grand: { ...UNIT, label: "Grand test" } },
  steps: [
    { unit: "P01", by: "2026-11-01" },
    { test: "t1", kind: "unit", covers: ["P01"], by: "2026-11-02" },
    { unit: "P02", by: "2026-11-03" },
    { test: "g1", kind: "grand", covers: ["P01", "P02"], by: "2026-11-04" },
  ],
};
const units = parseSyllabus("x.md", MD, []);

function state(over: Partial<State> = {}): State {
  return { catalog: buildCatalog(units), pyqs: new Map([["2020-1", pyq("2020-1")]]), sequence: SEQ, progress: { done: {} }, tests: new Map(), hasNotes: () => true, ...over };
}

const paper = () => {
  const r = parseTest("t1", `---\ntitle: T\nduration: 3\n---\n\n## Q1\ntype: MCQ\nmarks: 1\nsubject: programming-ds\ntopic: one\nanswer: A\nsyllabus: P01.2\n\nQ?\n\n(A) a\n(B) b\n(C) c\n(D) d\n\n### Solution\nBecause.\n`);
  if (!r.ok) throw new Error(r.errors.join("\n"));
  return r.test;
};
const result = (score: number, analysed = true) => ({ attempt: "2026-11-02-1000", questions: [], summary: { score, max: 10 }, analysis: analysed ? "Done." : null }) as unknown as Result;
const attempted = (first: Result | null): Attempted => ({ test: paper(), first });

const firstUnit = (s: State, today = "2026-11-01") => buildTree(s, today).parts[0].steps[0] as TreeUnit;
const testNamed = (s: State, id: string) => buildTree(s, "2026-11-02").parts.flatMap((p) => p.steps).find((x): x is TreeTest => x.type === "test" && x.id === id)!;

describe("streakOf", () => {
  it("counts back from today, or from yesterday if nothing yet today", () => {
    expect(streakOf(["2026-11-04", "2026-11-05", "2026-11-06"], "2026-11-06")).toBe(3);
    expect(streakOf(["2026-11-04", "2026-11-05"], "2026-11-06")).toBe(2);
    expect(streakOf(["2026-11-03", "2026-11-05", "2026-11-06"], "2026-11-06")).toBe(2);
    expect(streakOf(["2026-11-01"], "2026-11-06")).toBe(0);
    expect(streakOf([], "2026-11-06")).toBe(0);
  });
});

describe("buildTree", () => {
  it("starts at zero with the first item next", () => {
    const t = buildTree(state(), "2026-11-01");
    expect(t.done).toBe(0);
    expect(t.total).toBe(4);
    expect(t.parts.map((p) => p.title)).toEqual(["Programming in C", "Full-length tests"]);
    expect(t.next.kind === "teach" && t.next.item.id).toBe("P01.1");
    expect(firstUnit(state()).items[0].state).toBe("next");
    expect(firstUnit(state()).state).toBe("now");
    expect(t.hoursLeft).toBe(4);
  });

  it("ticks items, finishes units and counts down the hours", () => {
    const s = state({ progress: { done: { "P01.1": "2026-11-01", "P01.2": "2026-11-01" } }, tests: new Map([["t1", attempted(result(9))]]) });
    const t = buildTree(s, "2026-11-01");
    expect(firstUnit(s).state).toBe("done");
    expect(firstUnit(s).items[0]).toMatchObject({ state: "done", doneOn: "2026-11-01" });
    expect(t.done).toBe(2);
    expect(t.today).toBe(2);
    expect(t.hoursLeft).toBe(2);
    expect(t.next.kind === "teach" && t.next.item.id).toBe("P02.1");
  });

  it("keeps seen items unticked and flags them", () => {
    const s = state({ progress: { done: {}, seen: ["P01.1"] } });
    const item = firstUnit(s).items[0];
    expect(item.state).toBe("next");
    expect(item.seen).toBe(true);
    expect(buildTree(s, "2026-11-01").done).toBe(0);
  });

  it("counts each must-solve PYQ once, and tests as taken", () => {
    const s = state({ progress: { done: { "P01.1": "d", "P01.2": "d" } }, tests: new Map([["t1", attempted(result(9))]]) });
    const t = buildTree(s, "2026-11-01");
    expect(t.pyqs).toEqual({ indexed: 1, covered: 1, toSolve: 1, solved: 1 });
    expect(t.tests).toEqual({ total: 2, taken: 1 });
  });

  it("shows where each test stands", () => {
    const done = { progress: { done: { "P01.1": "d", "P01.2": "d" } } };
    expect(testNamed(state(), "t1").state).toBe("later");
    expect(testNamed(state(done), "t1").state).toBe("write");
    expect(testNamed(state({ ...done, tests: new Map([["t1", attempted(null)]]) }), "t1").state).toBe("take");
    expect(testNamed(state({ ...done, tests: new Map([["t1", attempted(result(9, false))]]) }), "t1").state).toBe("analyse");
    expect(testNamed(state({ ...done, tests: new Map([["t1", attempted(result(9))]]) }), "t1")).toMatchObject({ state: "passed", score: 0.9 });
    expect(testNamed(state({ ...done, tests: new Map([["t1", attempted(result(2))]]) }), "t1")).toMatchObject({ state: "below", score: 0.2 });
  });

  it("says when a unit is behind its date", () => {
    expect(firstUnit(state(), "2026-11-04").late).toBe(3);
    expect(firstUnit(state({ progress: { done: { "P01.1": "d", "P01.2": "d" } } }), "2026-11-04").late).toBe(0);
  });
});

describe("the real brain/syllabus", () => {
  it("builds a tree with no gaps", () => {
    const { state: real } = loadSyllabus("brain");
    const t = buildTree(real, "2026-11-06");
    expect(t.total).toBe(real.catalog.items.size);
    expect(t.pyqs.covered).toBe(t.pyqs.indexed);
    expect(t.order.errors).toBe(0);
    expect(t.order.checks).toBeGreaterThan(1000);
    expect(t.tests.total).toBeGreaterThan(20);
  });
});
