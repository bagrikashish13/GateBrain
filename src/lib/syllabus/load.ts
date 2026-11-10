import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parseTest } from "@/lib/tests/format";
import { parseResult } from "@/lib/tests/result";
import type { Concept } from "./order";
import { buildCatalog, isUnitStep, parseSyllabus, retestId, type Attempted, type Progress, type Pyq, type Sequence, type State, type Unit } from "./syllabus";

// Reads brain/syllabus/ and the test results from disk, for scripts/ and for the app's Syllabus tab.

/** The part files, in part order: 1-programming-in-c.md, 2-…, 10-…. */
export function syllabusFiles(brain: string): string[] {
  return readdirSync(join(brain, "syllabus"))
    .filter((f) => /^\d+-[a-z0-9-]+\.md$/.test(f))
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
}

export function readPyqs(brain: string): Map<string, Pyq> {
  const lines = readFileSync(join(brain, "syllabus", "pyq-index.jsonl"), "utf8").split("\n").filter((l) => l.trim());
  const list = lines.map((l) => JSON.parse(l) as Pyq);
  return new Map(list.map((p) => [p.id, p]));
}

function attemptedTest(brain: string, id: string): Attempted | null {
  const file = join(brain, "tests", `${id}.md`);
  if (!existsSync(file)) return null;
  const parsed = parseTest(id, readFileSync(file, "utf8"));
  const dir = join(brain, "results", id);
  const attempts = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md")).sort() : [];
  // The first attempt is the honest one: a retake of the same paper proves little.
  const first = attempts.length ? parseResult(attempts[0].slice(0, -3), readFileSync(join(dir, attempts[0]), "utf8")) : null;
  return { test: parsed.ok ? parsed.test : null, first };
}

export function loadSyllabus(brain: string): { state: State; errors: string[] } {
  const errors: string[] = [];
  const units: Unit[] = [];
  for (const f of syllabusFiles(brain)) units.push(...parseSyllabus(f, readFileSync(join(brain, "syllabus", f), "utf8"), errors));
  const sequence = JSON.parse(readFileSync(join(brain, "syllabus", "sequence.json"), "utf8")) as Sequence;
  const progress = JSON.parse(readFileSync(join(brain, "syllabus", "progress.json"), "utf8")) as Progress;
  const concepts = JSON.parse(readFileSync(join(brain, "syllabus", "concepts.json"), "utf8")) as Concept[];
  const tests = new Map<string, Attempted>();
  for (const step of sequence.steps) {
    if (isUnitStep(step)) continue;
    for (const id of [step.test, retestId(step.test)]) {
      const a = attemptedTest(brain, id);
      if (a) tests.set(id, a);
    }
  }
  const hasNotes = (folder: string) => {
    const dir = join(brain, "notes", ...folder.split("/"));
    return existsSync(dir) && statSync(dir).isDirectory() && readdirSync(dir).some((f) => f.endsWith(".md"));
  };
  return { state: { catalog: buildCatalog(units), pyqs: readPyqs(brain), sequence, progress, tests, hasNotes, concepts }, errors };
}
