import { addDayKey } from "@/lib/time";
import { orderCoverage, orderErrors } from "./order";
import { daysBehind, drill, isUnitStep, nextStep, retestId, scoreOf, subjectOf, type ItemKind, type Next, type State } from "./syllabus";

// What the Syllabus tab shows (pure, serialisable): everything to study in teaching order, what is ticked,
// what comes next, and the proof that nothing is missing or out of order.

export type ItemState = "done" | "next" | "todo";
export type TreeItem = { id: string; kind: ItemKind; text: string; subtopic: string | null; state: ItemState; seen: boolean; doneOn: string | null; pyqs: number };
export type TreeUnit = {
  type: "unit";
  id: string;
  title: string;
  hours: number;
  by: string;
  late: number;
  total: number;
  done: number;
  state: "done" | "now" | "todo";
  notesDue: boolean;
  items: TreeItem[];
};
export type TestState = "later" | "write" | "take" | "analyse" | "passed" | "below";
export type TreeTest = {
  type: "test";
  id: string;
  label: string;
  questions: number;
  minutes: number;
  pass: number;
  by: string;
  state: TestState;
  score: number | null;
  retestScore: number | null;
  written: boolean;
  covers: string[];
};
export type TreePart = { title: string; subject: string | null; total: number; done: number; hours: number; hoursLeft: number; steps: (TreeUnit | TreeTest)[] };
export type NextView =
  | { kind: "teach"; item: TreeItem; unit: string; unitTitle: string; position: number; of: number; late: number }
  | { kind: "notes"; unit: string; unitTitle: string }
  | { kind: "test"; state: "write" | "take" | "analyse" | "reteach"; id: string; label: string; score: number | null }
  | { kind: "finished" };
export type SyllabusTree = {
  parts: TreePart[];
  total: number;
  done: number;
  hoursLeft: number;
  pyqs: { indexed: number; covered: number; toSolve: number; solved: number };
  tests: { total: number; taken: number };
  today: number;
  week: number;
  streak: number;
  order: { concepts: number; checks: number; errors: number };
  next: NextView;
};

const FINAL_PART = "Full-length tests";

/** Consecutive days with at least one tick, ending today (or yesterday, if nothing yet today). */
export function streakOf(days: Iterable<string>, today: string): number {
  const set = new Set(days);
  let day = set.has(today) ? today : addDayKey(today, -1);
  let n = 0;
  while (set.has(day)) {
    n++;
    day = addDayKey(day, -1);
  }
  return n;
}

export function buildTree(s: State, today: string): SyllabusTree {
  const next = nextStep(s);
  const done = s.progress.done;
  const seen = new Set(s.progress.seen ?? []);
  const parts = new Map<string, TreePart>();
  const partFor = (title: string, subject: string | null) => {
    let p = parts.get(title);
    if (!p) parts.set(title, (p = { title, subject, total: 0, done: 0, hours: 0, hoursLeft: 0, steps: [] }));
    return p;
  };

  let lastPart: TreePart | null = null;
  let taken = 0;
  let testCount = 0;
  for (const step of s.sequence.steps) {
    if (isUnitStep(step)) {
      const unit = s.catalog.units.get(step.unit);
      if (!unit) continue;
      const items: TreeItem[] = unit.items.map((i) => ({
        id: i.id,
        kind: i.kind,
        text: i.text,
        subtopic: i.subtopic,
        state: done[i.id] ? "done" : next.kind === "teach" && next.item.id === i.id ? "next" : "todo",
        seen: seen.has(i.id) && !done[i.id],
        doneOn: done[i.id] ?? null,
        pyqs: i.pyqs.length,
      }));
      const doneCount = items.filter((i) => i.state === "done").length;
      const part = partFor(unit.part, subjectOf(unit));
      const left = unit.hours * (1 - doneCount / Math.max(1, items.length));
      part.total += items.length;
      part.done += doneCount;
      part.hours += unit.hours;
      part.hoursLeft += left;
      const active = (next.kind === "teach" || next.kind === "notes") && next.unit.id === unit.id;
      part.steps.push({
        type: "unit",
        id: unit.id,
        title: unit.title,
        hours: unit.hours,
        by: step.by,
        late: doneCount < items.length ? daysBehind(today, step.by) : 0,
        total: items.length,
        done: doneCount,
        state: doneCount === items.length ? "done" : active || doneCount > 0 ? "now" : "todo",
        notesDue: next.kind === "notes" && next.unit.id === unit.id,
        items,
      });
      lastPart = part;
      continue;
    }
    const blueprint = s.sequence.blueprints[step.kind];
    const a = s.tests.get(step.test);
    const re = s.tests.get(retestId(step.test));
    const score = a?.first ? scoreOf(a.first) : null;
    const isNext = (next.kind === "write-test" || next.kind === "take-test" || next.kind === "analyse-test") && (next.id === step.test || next.step.test === step.test);
    const state: TestState = score !== null ? (a!.first!.analysis === null ? "analyse" : score >= (blueprint?.pass ?? 0) ? "passed" : "below") : a?.test ? "take" : isNext ? "write" : "later";
    testCount++;
    if (score !== null) taken++;
    const target = step.kind === "grand" || !lastPart ? partFor(FINAL_PART, null) : lastPart;
    target.steps.push({
      type: "test",
      id: step.test,
      label: blueprint?.label ?? step.kind,
      questions: blueprint?.questions ?? 0,
      minutes: blueprint?.minutes ?? 0,
      pass: blueprint?.pass ?? 0,
      by: step.by,
      state,
      score,
      retestScore: re?.first ? scoreOf(re.first) : null,
      written: !!a?.test,
      covers: step.covers,
    });
  }

  const list = [...parts.values()];
  const units = list.flatMap((p) => p.steps).filter((x): x is TreeUnit => x.type === "unit");
  const allItems = units.flatMap((u) => u.items);

  // Must-solve PYQs, each counted once however many patterns cite it.
  const toSolve = new Set<string>();
  const solved = new Set<string>();
  for (const item of s.catalog.items.values()) {
    for (const p of drill(item, s.pyqs).must) {
      toSolve.add(p.id);
      if (done[item.id]) solved.add(p.id);
    }
  }
  const covered = new Set([...s.catalog.items.values()].flatMap((i) => i.pyqs).filter((id) => s.pyqs.has(id)));
  const days = Object.values(done);
  const weekStart = addDayKey(today, -6);
  const concepts = s.concepts ?? [];
  const coverage = orderCoverage(s.catalog, s.pyqs, s.sequence, concepts);

  return {
    parts: list,
    total: allItems.length,
    done: allItems.filter((i) => i.state === "done").length,
    hoursLeft: Math.ceil(list.reduce((n, p) => n + p.hoursLeft, 0)),
    pyqs: { indexed: s.pyqs.size, covered: covered.size, toSolve: toSolve.size, solved: solved.size },
    tests: { total: testCount, taken },
    today: days.filter((d) => d === today).length,
    week: days.filter((d) => d >= weekStart && d <= today).length,
    streak: streakOf(days, today),
    order: { concepts: coverage.concepts, checks: coverage.links, errors: orderErrors(s.catalog, s.pyqs, s.sequence, concepts).filter((e) => e.includes("later")).length },
    next: nextView(next, units, s, today),
  };
}

function nextView(next: Next, units: TreeUnit[], s: State, today: string): NextView {
  switch (next.kind) {
    case "teach": {
      const unit = units.find((u) => u.id === next.unit.id)!;
      const item = unit.items.find((i) => i.id === next.item.id)!;
      return { kind: "teach", item, unit: unit.id, unitTitle: unit.title, position: unit.done + 1, of: unit.total, late: daysBehind(today, next.by) };
    }
    case "notes":
      return { kind: "notes", unit: next.unit.id, unitTitle: next.unit.title };
    case "write-test":
      return { kind: "test", state: "write", id: next.id, label: s.sequence.blueprints[next.step.kind]?.label ?? next.step.kind, score: null };
    case "take-test":
      return { kind: "test", state: "take", id: next.id, label: next.title, score: null };
    case "analyse-test":
      return { kind: "test", state: "analyse", id: next.id, label: s.sequence.blueprints[next.step.kind]?.label ?? next.step.kind, score: next.score };
    case "reteach":
      return { kind: "test", state: "reteach", id: next.id, label: s.sequence.blueprints[next.step.kind]?.label ?? next.step.kind, score: next.score };
    case "finished":
      return { kind: "finished" };
  }
}
