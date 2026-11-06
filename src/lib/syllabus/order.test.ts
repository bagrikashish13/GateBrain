import { describe, expect, it } from "vitest";
import { parseTest } from "@/lib/tests/format";
import { loadSyllabus } from "./load";
import { conceptsIn, compileConcepts, orderCoverage, orderErrors, teachingOrder, usesOf, type Concept } from "./order";
import { auditTest, buildCatalog, parseSyllabus, type Blueprint, type Pyq, type Sequence, type State } from "./syllabus";

const CONCEPTS: Concept[] = [
  { id: "cast", name: "casts", code: ["\\(float\\)"], words: ["\\bcasts?\\b"] },
  { id: "loop", name: "loops", code: ["\\bwhile\\s*\\("], words: ["\\bloops?\\b"] },
];

const md = (first: string, second: string) => `# Part 1 · Basics

## P01 · One
notes: programming-ds/00-one
hours: 1

- P01.1 ${first}

## P02 · Two
notes: programming-ds/01-two
hours: 1

- P02.1 ${second}
- P02.2 T Everything else. Teaches: loop
`;

const pyq = (id: string, uses: string[]): Pyq => ({ id, title: id, paper: "CS", year: 2020, set: null, q: "1", marks: 1, type: "MCQ", level: null, scope: "core", tags: [], url: null, uses });
const SEQUENCE: Sequence = { blueprints: {}, steps: [{ unit: "P01", by: "2026-11-01" }, { unit: "P02", by: "2026-11-02" }] };

function check(first: string, second: string, pyqs: Pyq[] = []) {
  const units = parseSyllabus("x.md", md(first, second), []);
  return orderErrors(buildCatalog(units), new Map(pyqs.map((p) => [p.id, p])), SEQUENCE, CONCEPTS);
}

describe("conceptsIn", () => {
  it("finds code case-sensitively and words in any case", () => {
    const compiled = compileConcepts(CONCEPTS);
    expect(conceptsIn("x = (float)a; while (x) y();", compiled)).toEqual(["cast", "loop"]);
    expect(conceptsIn("Explicit CASTS", compiled)).toEqual(["cast"]);
    expect(conceptsIn("(FLOAT)a", compiled)).toEqual([]);
  });
});

describe("orderErrors", () => {
  it("passes when everything is taught before it is used", () => {
    expect(check("T Casts: (float)a. Teaches: cast", "T Use a cast again.")).toEqual([]);
  });

  it("catches an item that mentions an idea taught later", () => {
    const out = check("T Count with a loop. Teaches: cast", "T Nothing.");
    expect(out.join("\n")).toContain("P01.1 mentions loops, which is taught later, at P02.2");
  });

  it("catches a PYQ that needs an idea taught later, the casting problem", () => {
    const out = check("Q Evaluate this. PYQ: 2020-1", "T Casts. Teaches: cast", [pyq("2020-1", ["cast"])]);
    expect(out.join("\n")).toContain("P01.1 cites PYQ 2020-1, which needs casts, taught later, at P02.1");
  });

  it("allows an item to use what it teaches itself", () => {
    expect(check("T A cast: (float)a. Teaches: cast", "T x.")).toEqual([]);
  });

  it("catches a concept taught twice, never taught, or unknown", () => {
    expect(check("T A. Teaches: cast", "T B. Teaches: cast").join("\n")).toContain("taught twice: P01.1, P02.1");
    expect(check("T A.", "T B.").join("\n")).toContain("Concept cast is never taught");
    expect(check("T A. Teaches: cast, nope", "T B.").join("\n")).toContain('"Teaches: nope" is not in concepts.json');
  });
});

describe("usesOf and coverage", () => {
  it("combines the item's text with what its PYQs need", () => {
    const units = parseSyllabus("x.md", md("Q With a loop. PYQ: 2020-1", "T Casts. Teaches: cast"), []);
    const pyqs = new Map([["2020-1", pyq("2020-1", ["cast"])]]);
    const catalog = buildCatalog(units);
    expect(usesOf(catalog.items.get("P01.1")!, pyqs, compileConcepts(CONCEPTS)).sort()).toEqual(["cast", "loop"]);
    expect(orderCoverage(catalog, pyqs, SEQUENCE, CONCEPTS).links).toBeGreaterThan(1);
    expect(teachingOrder(catalog, SEQUENCE).teacher.get("loop")?.id).toBe("P02.2");
  });
});

describe("auditTest and concepts", () => {
  const UNIT: Blueprint = { label: "Unit", questions: 1, ones: 1, twos: 0, minutes: 3, mcq: [1, 1], msq: [0, 0], nat: [0, 0], pass: 0.7, earlierMax: 0 };
  const seq: Sequence = {
    blueprints: { unit: UNIT },
    steps: [{ unit: "P01", by: "2026-11-01" }, { test: "t1", kind: "unit", covers: ["P01"], by: "2026-11-01" }, { unit: "P02", by: "2026-11-02" }],
  };
  const units = parseSyllabus("x.md", md("Q Cast. PYQ: 2020-1", "T Casts. Teaches: cast"), []);
  const state: State = { catalog: buildCatalog(units), pyqs: new Map([["2020-1", pyq("2020-1", [])]]), sequence: seq, progress: { done: {} }, tests: new Map(), hasNotes: () => true, concepts: CONCEPTS };
  const paper = (body: string) => {
    const r = parseTest("t1", `---\ntitle: T\nduration: 3\n---\n\n## Q1\ntype: MCQ\nmarks: 1\nsubject: programming-ds\ntopic: one\nanswer: A\nsyllabus: P01.1\n\n${body}\n\n(A) a\n(B) b\n(C) c\n(D) d\n\n### Solution\nBecause.\n`);
    if (!r.ok) throw new Error(r.errors.join("\n"));
    return r.test;
  };

  it("rejects a question that uses something taught after the test", () => {
    expect(auditTest(state, "t1", paper("What is (float)5/2?")).errors.join("\n")).toContain("Q1 uses casts, taught at P02.1, which comes after this test");
  });

  it("accepts a question that uses only what has been taught", () => {
    expect(auditTest(state, "t1", paper("What is 5/2?")).errors).toEqual([]);
  });
});

describe("the real brain/syllabus", () => {
  const { state } = loadSyllabus("brain");
  const concepts = state.concepts ?? [];

  it("is topological: nothing is used before it is taught", () => {
    expect(orderErrors(state.catalog, state.pyqs, state.sequence, concepts)).toEqual([]);
  });

  it("really checks something: every PYQ has its uses, and most name a concept", () => {
    const all = [...state.pyqs.values()];
    expect(all.every((p) => Array.isArray(p.uses))).toBe(true);
    expect(all.filter((p) => p.uses?.length).length).toBeGreaterThan(all.length * 0.8);
    expect(concepts.length).toBeGreaterThan(80);
  });

  it("teaches the two things that started all this before anything uses them", () => {
    const { teacher, position } = teachingOrder(state.catalog, state.sequence);
    const firstLoop = position.get(teacher.get("while")!.id)!;
    expect(position.get(teacher.get("cast")!.id)!).toBeLessThan(firstLoop);
    expect(position.get(teacher.get("precedence")!.id)!).toBeLessThan(position.get(teacher.get("cast")!.id)!);
    const pointer = position.get(teacher.get("pointer")!.id)!;
    expect(pointer).toBeLessThan(position.get(teacher.get("recursion")!.id)!);
    expect(position.get(teacher.get("bigo")!.id)!).toBeLessThan(position.get(teacher.get("list")!.id)!);
    expect(position.get(teacher.get("list")!.id)!).toBeLessThan(position.get(teacher.get("stack")!.id)!);
    expect(position.get(teacher.get("unionfind")!.id)!).toBeLessThan(position.get(teacher.get("kruskal")!.id)!);
  });
});
