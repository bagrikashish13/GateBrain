import { slugOf } from "@/lib/brain/names";
import type { Test } from "@/lib/tests/format";
import type { Result } from "@/lib/tests/result";

// The C + Data Structures + Algorithms syllabus in brain/syllabus/ (pure: no fs). The Markdown files say
// what to teach and in which order, sequence.json where the tests fall, progress.json what is done, and
// the result files what happened in the tests. Everything an agent should do next is computed from those,
// so that it never depends on an agent remembering (AGENTS.md rule 12, brain/syllabus/README.md).

export type ItemKind = "T" | "Q" | "N" | "L";
export const KIND_NAME: Record<ItemKind, string> = { T: "concept", Q: "PYQ pattern", N: "never asked yet", L: "legacy" };

export type Item = { id: string; unit: string; kind: ItemKind; text: string; pyqs: string[]; subtopic: string | null };
export type Unit = { id: string; title: string; notes: string; hours: number; items: Item[] };
export type Pyq = {
  id: string;
  title: string;
  paper: "CS" | "IT" | "DA";
  year: number;
  set: number | null;
  q: string;
  marks: number | null;
  type: "MCQ" | "MSQ" | "NAT" | "DESC";
  level: string | null;
  scope: "core" | "cross";
  tags: string[];
  url: string | null;
};
export type Blueprint = {
  label: string;
  questions: number;
  ones: number; // 1-mark questions
  twos: number; // 2-mark questions
  minutes: number;
  mcq: [number, number]; // allowed count, inclusive
  msq: [number, number];
  nat: [number, number];
  pass: number; // fraction of the marks
  earlierMax: number; // questions allowed from units before this test's own
};
export type UnitStep = { unit: string; by: string };
export type TestStep = { test: string; kind: string; covers: string[]; by: string };
export type Step = UnitStep | TestStep;
export type Sequence = { blueprints: Record<string, Blueprint>; steps: Step[] };
export type Progress = { done: Record<string, string> };
export type Catalog = { units: Map<string, Unit>; items: Map<string, Item> };

export const isUnitStep = (s: Step): s is UnitStep => "unit" in s;
export const retestId = (test: string) => `${test}-r2`;
export const subjectOf = (u: Unit) => u.notes.split("/")[0];
export const topicOf = (u: Unit) => slugOf(u.notes.split("/")[1] ?? "");

const UNIT_HEAD = /^##\s+([PDA]\d\d)\s+·\s+(.+?)\s*$/;
const ITEM = /^-\s+([PDA]\d\d\.\d+)\s+([TQNL])\s+(.+?)\s*$/;
const SUB_HEAD = /^###\s+(.+?)\s*$/;
const PYQ_SPLIT = " PYQ: ";

/** One syllabus file → its units. Problems go to `errors`. */
export function parseSyllabus(file: string, raw: string, errors: string[]): Unit[] {
  const units: Unit[] = [];
  let sub: string | null = null;
  for (const [i, line] of raw.replace(/\r\n/g, "\n").split("\n").entries()) {
    const where = `${file}:${i + 1}`;
    const head = UNIT_HEAD.exec(line);
    if (head) {
      units.push({ id: head[1], title: head[2], notes: "", hours: 0, items: [] });
      sub = null;
      continue;
    }
    const unit = units.at(-1);
    if (!unit) continue;
    const notes = /^notes:\s*(\S+)\s*$/.exec(line);
    if (notes) {
      unit.notes = notes[1];
      continue;
    }
    const hours = /^hours:\s*([\d.]+)\s*$/.exec(line);
    if (hours) {
      unit.hours = Number(hours[1]);
      continue;
    }
    const subHead = SUB_HEAD.exec(line);
    if (subHead) {
      sub = subHead[1];
      continue;
    }
    if (!line.startsWith("- ")) continue;
    const m = ITEM.exec(line);
    if (!m) {
      errors.push(`${where}: an item must look like "- ${unit.id}.1 T text".`);
      continue;
    }
    const [text, list] = m[3].split(PYQ_SPLIT);
    const item: Item = {
      id: m[1],
      unit: unit.id,
      kind: m[2] as ItemKind,
      text: text.trim(),
      pyqs: list ? list.split(",").map((s) => s.trim()).filter(Boolean) : [],
      subtopic: sub,
    };
    if (!item.id.startsWith(`${unit.id}.`)) errors.push(`${where}: ${item.id} is inside unit ${unit.id}.`);
    if (item.id !== `${unit.id}.${unit.items.length + 1}`) errors.push(`${where}: ${item.id} should be numbered ${unit.id}.${unit.items.length + 1}.`);
    unit.items.push(item);
  }
  return units;
}

export function buildCatalog(units: Unit[]): Catalog {
  return { units: new Map(units.map((u) => [u.id, u])), items: new Map(units.flatMap((u) => u.items.map((i) => [i.id, i]))) };
}

/** Everything that must hold for the syllabus to be trustworthy: `npm run check:syllabus`. Empty = fine. */
export function validate(catalog: Catalog, pyqs: Map<string, Pyq>, sequence: Sequence, progress: Progress): string[] {
  const out: string[] = [];
  const cited = new Set<string>();
  for (const unit of catalog.units.values()) {
    if (!/^(programming-ds|algorithms)\/\d+-[a-z0-9-]+$/.test(unit.notes)) out.push(`${unit.id}: "notes:" must be a section folder like programming-ds/10-arrays.`);
    if (!(unit.hours > 0)) out.push(`${unit.id}: needs "hours:".`);
    if (!unit.items.length) out.push(`${unit.id}: has no items.`);
    for (const item of unit.items) {
      for (const id of item.pyqs) {
        cited.add(id);
        if (!pyqs.has(id)) out.push(`${item.id}: unknown PYQ "${id}".`);
      }
      if (item.kind === "Q" && !item.pyqs.length) out.push(`${item.id}: a PYQ pattern must cite at least one PYQ.`);
      if ((item.kind === "T" || item.kind === "N") && item.pyqs.length) out.push(`${item.id}: only Q and L items cite PYQs.`);
    }
  }
  for (const id of pyqs.keys()) if (!cited.has(id)) out.push(`PYQ ${id} is in the index but no syllabus item covers it.`);

  const seen = new Set<string>();
  const placed = new Set<string>();
  let lastBy = "";
  for (const step of sequence.steps) {
    if (step.by < lastBy) out.push(`${isUnitStep(step) ? step.unit : step.test}: its target date ${step.by} is before the previous step's ${lastBy}.`);
    lastBy = step.by;
    if (isUnitStep(step)) {
      if (!catalog.units.has(step.unit)) out.push(`sequence: unknown unit ${step.unit}.`);
      if (placed.has(step.unit)) out.push(`sequence: ${step.unit} appears twice.`);
      placed.add(step.unit);
      continue;
    }
    if (seen.has(step.test)) out.push(`sequence: test ${step.test} appears twice.`);
    seen.add(step.test);
    if (!sequence.blueprints[step.kind]) out.push(`${step.test}: unknown kind "${step.kind}".`);
    for (const u of step.covers) if (!placed.has(u)) out.push(`${step.test}: covers ${u}, which is not taught before it.`);
    if (!step.covers.length) out.push(`${step.test}: covers nothing.`);
  }
  for (const id of catalog.units.keys()) if (!placed.has(id)) out.push(`sequence: unit ${id} is never scheduled.`);
  const tested = new Set(sequence.steps.flatMap((s) => (isUnitStep(s) ? [] : s.covers)));
  for (const id of catalog.units.keys()) if (!tested.has(id)) out.push(`sequence: unit ${id} is covered by no test.`);

  for (const [name, b] of Object.entries(sequence.blueprints)) {
    if (b.ones + b.twos !== b.questions) out.push(`blueprint ${name}: ones + twos must equal questions.`);
    for (const k of ["mcq", "msq", "nat"] as const) if (b[k][0] > b[k][1]) out.push(`blueprint ${name}: ${k} range is backwards.`);
    if (b.mcq[0] + b.msq[0] + b.nat[0] > b.questions || b.mcq[1] + b.msq[1] + b.nat[1] < b.questions) out.push(`blueprint ${name}: the type ranges cannot add up to ${b.questions}.`);
  }
  for (const id of Object.keys(progress.done)) if (!catalog.items.has(id)) out.push(`progress: unknown item ${id}.`);
  return out;
}

// ---- What a learner solves for a pattern

/** Must-solve PYQs first: everything since 2014, plus an older one when there are few. Newest first. */
export function drill(item: Item, pyqs: Map<string, Pyq>): { must: Pyq[]; extra: Pyq[] } {
  const all = item.pyqs.map((id) => pyqs.get(id)).filter((p): p is Pyq => !!p);
  if (item.kind === "L") return { must: all.slice(0, 1), extra: all.slice(1) };
  const modern = all.filter((p) => p.year >= 2014);
  const older = all.filter((p) => p.year < 2014);
  const fromOlder = Math.max(0, 2 - modern.length);
  return { must: [...modern, ...older.slice(0, fromOlder)], extra: older.slice(fromOlder) };
}

const newestYear = (item: Item, pyqs: Map<string, Pyq>) => Math.max(0, ...item.pyqs.map((id) => pyqs.get(id)?.year ?? 0));

// ---- State of the tests

export type Attempted = { test: Test | null; first: Result | null };
export type State = {
  catalog: Catalog;
  pyqs: Map<string, Pyq>;
  sequence: Sequence;
  progress: Progress;
  tests: Map<string, Attempted>; // includes retests
  hasNotes: (folder: string) => boolean;
};

const attempted = (s: State, id: string): Attempted => s.tests.get(id) ?? { test: null, first: null };
export const scoreOf = (r: Result) => (r.summary.max > 0 ? r.summary.score / r.summary.max : 0);

/** Syllabus items behind the questions of a test that were not answered correctly. */
export function missedItems(a: Attempted): string[] {
  if (!a.test || !a.first) return [];
  const byN = new Map(a.first.questions.map((q) => [q.n, q.outcome]));
  return [...new Set(a.test.questions.filter((q) => byN.get(q.n) !== "correct").flatMap((q) => q.syllabus ?? []))];
}

/** How each item has gone in the tests so far, oldest attempt first. */
export function itemHistory(s: State): Map<string, ("correct" | "wrong" | "unattempted")[]> {
  const out = new Map<string, ("correct" | "wrong" | "unattempted")[]>();
  const order = s.sequence.steps.flatMap((st) => (isUnitStep(st) ? [] : [st.test, retestId(st.test)]));
  for (const id of order) {
    const a = attempted(s, id);
    if (!a.test || !a.first) continue;
    const byN = new Map(a.first.questions.map((q) => [q.n, q.outcome]));
    for (const q of a.test.questions) {
      for (const item of q.syllabus ?? []) out.set(item, [...(out.get(item) ?? []), byN.get(q.n) ?? "unattempted"]);
    }
  }
  return out;
}

// ---- The next step: the heart of it

export type Next =
  | { kind: "teach"; unit: Unit; item: Item; pending: Item[]; by: string }
  | { kind: "notes"; unit: Unit; by: string }
  | { kind: "write-test"; step: TestStep; id: string; retest: boolean }
  | { kind: "take-test"; step: TestStep; id: string; title: string }
  | { kind: "analyse-test"; step: TestStep; id: string; attempt: string; score: number }
  | { kind: "reteach"; step: TestStep; id: string; missed: string[]; retest: string; score: number; pass: number }
  | { kind: "finished" };

export function nextStep(s: State): Next {
  for (const step of s.sequence.steps) {
    if (isUnitStep(step)) {
      const unit = s.catalog.units.get(step.unit);
      if (!unit) continue;
      const pending = unit.items.filter((i) => !s.progress.done[i.id]);
      if (pending.length) return { kind: "teach", unit, item: pending[0], pending, by: step.by };
      if (!s.hasNotes(unit.notes)) return { kind: "notes", unit, by: step.by };
      continue;
    }
    const held = testGate(s, step, step.test, false);
    if (held) return held;
    const first = attempted(s, step.test).first!;
    const pass = s.sequence.blueprints[step.kind]?.pass ?? 0;
    if (scoreOf(first) >= pass) continue;
    const re = retestId(step.test);
    if (!attempted(s, re).test) return { kind: "reteach", step, id: step.test, missed: missedItems(attempted(s, step.test)), retest: re, score: scoreOf(first), pass };
    const heldRe = testGate(s, step, re, true);
    if (heldRe) return heldRe;
    // One retest only: whatever is still weak is carried into the following tests (planTest), so the plan can't stall.
  }
  return { kind: "finished" };
}

function testGate(s: State, step: TestStep, id: string, retest: boolean): Next | null {
  const a = attempted(s, id);
  if (!a.test) return { kind: "write-test", step, id, retest };
  if (!a.first) return { kind: "take-test", step, id, title: a.test.title };
  if (a.first.analysis === null) return { kind: "analyse-test", step, id, attempt: a.first.attempt, score: scoreOf(a.first) };
  return null;
}

/** May these items be marked taught right now? Returns the reason if not. */
export function checkDone(s: State, ids: string[]): string | null {
  const done = { ...s.progress.done };
  for (const id of ids) {
    if (!s.catalog.items.has(id)) return `Unknown item ${id}.`;
    if (done[id]) continue;
    const next = nextStep({ ...s, progress: { done } });
    if (next.kind !== "teach") return `Not yet. First: ${describeHold(next)}.`;
    if (next.item.id !== id) return `Out of order: the next item is ${next.item.id}. Teach that first; items are never skipped.`;
    done[id] = "x";
  }
  return null;
}

export function describeHold(n: Next): string {
  switch (n.kind) {
    case "teach":
      return `teaching ${n.item.id}`;
    case "notes":
      return `the notes for ${n.unit.id}`;
    case "write-test":
      return `writing test ${n.id}`;
    case "take-test":
      return `the student taking test ${n.id}`;
    case "analyse-test":
      return `analysing test ${n.id}`;
    case "reteach":
      return `re-teaching what test ${n.id} exposed`;
    case "finished":
      return "nothing";
  }
}

// ---- Writing and checking a test

export type TestPlan = {
  blueprint: Blueprint;
  covers: string[];
  earlier: string[];
  carry: Item[]; // items whose last test question was missed
  targets: Item[]; // items of this test's units, most important first
};

/** What a test must contain, computed from the syllabus and from every earlier result. */
export function planTest(s: State, id: string): TestPlan | null {
  const base = id.endsWith("-r2") ? id.slice(0, -3) : id;
  const index = s.sequence.steps.findIndex((st) => !isUnitStep(st) && st.test === base);
  if (index < 0) return null;
  const step = s.sequence.steps[index] as TestStep;
  const blueprint = s.sequence.blueprints[id === base ? step.kind : "unit"];
  if (!blueprint) return null;
  const before = s.sequence.steps.slice(0, index).flatMap((st) => (isUnitStep(st) ? [st.unit] : []));
  const history = itemHistory(s);
  const carry = [...history.entries()].filter(([, h]) => h.at(-1) !== "correct").map(([item]) => s.catalog.items.get(item)).filter((i): i is Item => !!i && i.kind !== "L");
  const carried = new Set(carry.map((i) => i.id));
  const targets = step.covers
    .flatMap((u) => s.catalog.units.get(u)?.items ?? [])
    .filter((i) => (i.kind === "Q" || i.kind === "N") && !carried.has(i.id))
    .sort((a, b) => Number(history.has(a.id)) - Number(history.has(b.id)) || Number(a.kind === "N") - Number(b.kind === "N") || newestYear(b, s.pyqs) - newestYear(a, s.pyqs) || b.pyqs.length - a.pyqs.length);
  return { blueprint, covers: step.covers, earlier: before.filter((u) => !step.covers.includes(u)), carry, targets };
}

/** Does a written test match its blueprint? Errors must be fixed before the student sees it. */
export function auditTest(s: State, id: string, test: Test): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const plan = planTest(s, id);
  if (!plan) return { errors: [`${id} is not a test in brain/syllabus/sequence.json.`], warnings };
  const b = plan.blueprint;
  const q = test.questions;
  if (q.length !== b.questions) errors.push(`${q.length} questions, the blueprint says ${b.questions}.`);
  const count = (f: (x: Test["questions"][number]) => boolean) => q.filter(f).length;
  if (count((x) => x.marks === 1) !== b.ones) errors.push(`${count((x) => x.marks === 1)} one-mark questions, the blueprint says ${b.ones}.`);
  if (count((x) => x.marks === 2) !== b.twos) errors.push(`${count((x) => x.marks === 2)} two-mark questions, the blueprint says ${b.twos}.`);
  if (test.duration !== b.minutes) errors.push(`duration ${test.duration}, the blueprint says ${b.minutes} minutes.`);
  for (const [type, range] of [["MCQ", b.mcq], ["MSQ", b.msq], ["NAT", b.nat]] as const) {
    const n = count((x) => x.type === type);
    if (n < range[0] || n > range[1]) errors.push(`${n} ${type}, the blueprint allows ${range[0]}–${range[1]}.`);
  }
  const covers = new Set(plan.covers);
  const earlier = new Set(plan.earlier);
  const used = new Set<string>();
  let fromEarlier = 0;
  for (const x of q) {
    const ids = x.syllabus ?? [];
    if (!ids.length) errors.push(`Q${x.n}: add a "syllabus:" line naming the item it tests, like "syllabus: D07.5".`);
    if (!x.solution) errors.push(`Q${x.n}: needs a ### Solution.`);
    let onlyEarlier = ids.length > 0;
    for (const itemId of ids) {
      const item = s.catalog.items.get(itemId);
      if (!item) {
        errors.push(`Q${x.n}: unknown syllabus item ${itemId}.`);
        continue;
      }
      used.add(itemId);
      if (item.kind === "L") errors.push(`Q${x.n}: ${itemId} is legacy and never goes in a test.`);
      if (!covers.has(item.unit) && !earlier.has(item.unit)) errors.push(`Q${x.n}: ${itemId} is taught after this test.`);
      if (covers.has(item.unit)) onlyEarlier = false;
      const unit = s.catalog.units.get(item.unit)!;
      if (x.subject !== subjectOf(unit)) errors.push(`Q${x.n}: subject should be ${subjectOf(unit)} for ${itemId}.`);
      if (x.topic !== topicOf(unit)) errors.push(`Q${x.n}: topic should be ${topicOf(unit)} for ${itemId}.`);
    }
    if (onlyEarlier) fromEarlier++;
  }
  if (fromEarlier > b.earlierMax) errors.push(`${fromEarlier} questions are from earlier units, at most ${b.earlierMax} allowed.`);
  if (id.endsWith("-r2")) {
    // A retest is about what the first attempt exposed, not about every unit.
    const missed = new Set(missedItems(attempted(s, id.slice(0, -3))));
    const onMissed = q.filter((x) => (x.syllabus ?? []).some((i) => missed.has(i))).length;
    if (missed.size && onMissed < Math.ceil(b.questions / 2)) errors.push(`Only ${onMissed} questions test what the first attempt missed; at least ${Math.ceil(b.questions / 2)} must.`);
  } else {
    const uncoveredUnits = plan.covers.filter((u) => ![...used].some((i) => i.startsWith(`${u}.`)));
    if (uncoveredUnits.length) errors.push(`No question from ${uncoveredUnits.join(", ")}.`);
  }
  const skippedCarry = plan.carry.filter((i) => !used.has(i.id)).slice(0, 3);
  if (skippedCarry.length) warnings.push(`Still weak and not tested here: ${skippedCarry.map((i) => i.id).join(", ")}.`);
  const top = plan.targets.slice(0, Math.max(0, b.questions - b.earlierMax)).filter((i) => i.kind === "Q" && !used.has(i.id));
  if (top.length) warnings.push(`High-priority patterns left out: ${top.map((i) => i.id).join(", ")}.`);
  return { errors, warnings };
}

// ---- Pace

/** Whole days today is past a step's target (0 when on time). */
export function daysBehind(today: string, by: string): number {
  return Math.max(0, Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${by}T00:00:00Z`)) / 86_400_000));
}

/** One line for the start of a session (scripts/check-log.ts). */
export function oneLine(n: Next): string {
  switch (n.kind) {
    case "teach":
      return `next is ${n.item.id} (${n.unit.id} · ${n.unit.title})`;
    case "notes":
      return `write the notes for ${n.unit.id} · ${n.unit.title}`;
    case "write-test":
      return `write test ${n.id}, no new teaching until it is done`;
    case "take-test":
      return `the student takes test ${n.id} in the app, no new teaching until then`;
    case "analyse-test":
      return `analyse test ${n.id}, no new teaching until then`;
    case "reteach":
      return `re-teach what ${n.id} exposed, then write ${n.retest}`;
    case "finished":
      return "all taught and tested";
  }
}
