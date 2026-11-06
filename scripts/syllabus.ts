// The syllabus for C, Data Structures and Algorithms, for agents: `npm run syllabus -- <command>`
// (AGENTS.md rule 12, brain/syllabus/README.md). It says exactly what to teach or test next, refuses to
// let items be skipped, and checks tests against their blueprint. The student never runs it.
process.env.TZ ||= "Asia/Kolkata";

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { dayKey } from "../src/lib/time";
import { parseTest } from "../src/lib/tests/format";
import { loadSyllabus } from "../src/lib/syllabus/load";
import {
  auditTest,
  checkDone,
  daysBehind,
  drill,
  isUnitStep,
  itemHistory,
  KIND_NAME,
  nextStep,
  planTest,
  retestId,
  scoreOf,
  validate,
  type Item,
  type Next,
  type Pyq,
  type State,
} from "../src/lib/syllabus/syllabus";

const repo = process.env.REPO_PATH || join(import.meta.dirname, "..");
const brain = join(repo, "brain");
const today = dayKey(new Date());

const HELP = `npm run syllabus -- <command>

  next                  the exact next step (the default)
  done <item> [item…]   mark items taught, after the student answered their check correctly
  unit <unit>           one whole unit with what is done, like D07
  status                every unit and test, and pace against the target dates
  test <test-id>        what a test must contain, before you write it
  check-test <test-id>  check a written test against its blueprint
  weak                  syllabus items missed in tests
  pyq <id> [id…]        a real PYQ: link, text and answer key
  check                 validate the whole syllabus (same as npm run check:syllabus)`;

const { state, errors } = loadSyllabus(brain);
const fail = (msg: string): never => {
  console.error(msg);
  process.exit(1);
};
const words = (day: string) => new Date(`${day}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const pct = (x: number) => `${Math.round(x * 100)}%`;
const marksText = (p: Pyq) => [p.marks ? `${p.marks}m` : null, p.type === "DESC" ? "descriptive" : p.type].filter(Boolean).join(" ");

function pace(by: string): string {
  const late = daysBehind(today, by);
  return late ? `target ${words(by)}, ${late} day${late > 1 ? "s" : ""} behind` : `target ${words(by)}, on time`;
}

function printItem(item: Item, s: State): void {
  console.log(`${item.id} [${KIND_NAME[item.kind]}] ${item.text}`);
  if (!item.pyqs.length) return;
  const { must, extra } = drill(item, s.pyqs);
  console.log(`  Solve with the student, one at a time, newest first:`);
  for (const p of must) console.log(`    ${p.id.padEnd(12)} ${marksText(p).padEnd(10)} ${p.url ?? "(no link: search the id)"}`);
  if (extra.length) console.log(`  Older, for extra practice only if the student wants: ${extra.map((p) => p.id).join(", ")}`);
}

function printPlan(id: string): void {
  const plan = planTest(state, id);
  if (!plan) return fail(`${id} is not a test in brain/syllabus/sequence.json.`);
  const b = plan.blueprint;
  const fresh = b.questions - b.earlierMax;
  console.log(`Test ${id} · ${b.label}. File: brain/tests/${id}.md`);
  console.log(`${b.questions} questions (${b.ones} of 1 mark, ${b.twos} of 2 marks), ${b.minutes} minutes. MCQ ${b.mcq.join("–")}, MSQ ${b.msq.join("–")}, NAT ${b.nat.join("–")}. Pass: ${pct(b.pass)}.`);
  console.log(`At least ${fresh} questions from ${plan.covers.join(", ")}; at most ${b.earlierMax} from earlier units, chosen from what is weak.`);
  if (plan.carry.length) console.log(`\nStill weak from earlier tests, test these again first:\n${plan.carry.map((i) => `  ${i.id} ${i.text}`).join("\n")}`);
  console.log(`\nPatterns in priority order (not yet tested first, newest PYQ first). Cover as many as the questions allow:`);
  for (const i of plan.targets.slice(0, Math.max(fresh * 2, 12))) console.log(`  ${i.id} ${i.text}`);
  console.log(`
Rules for every question (brain/syllabus/README.md, AGENTS.md 2.2.1):
- Original, modelled on the listed PYQs: same concept and difficulty, new setup. Read the PYQs first (npm run syllabus -- pyq <id>).
- Metadata: add "syllabus: <item id>" with the other lines. subject and topic come from the item's unit "notes:" line.
- Solve it yourself independently. Run C code with a compiler and check tree, heap, hash and graph answers with a small script when you can.
- Then: npm run check:tests -- ${id}  and  npm run syllabus -- check-test ${id}. Fix every error, commit, push.`);
}

function printNext(n: Next): void {
  switch (n.kind) {
    case "teach": {
      const done = n.unit.items.length - n.pending.length;
      console.log(`NEXT: teach ${n.item.id}. Unit ${n.unit.id} · ${n.unit.title}, item ${done + 1} of ${n.unit.items.length} (${pace(n.by)}).`);
      if (n.item.subtopic) console.log(`Subtopic: ${n.item.subtopic}`);
      console.log();
      printItem(n.item, state);
      const after = n.pending.slice(1, 4);
      if (after.length) console.log(`\nThen, in this order:\n${after.map((i) => `  ${i.id} [${KIND_NAME[i.kind]}] ${i.text}`).join("\n")}`);
      console.log(`
How: one small step per reply, ending in one question (AGENTS.md rule 8). Teach only what this item says.
When the student has answered correctly, run: npm run syllabus -- done ${n.item.id}`);
      return;
    }
    case "notes":
      console.log(`NEXT: write the notes for ${n.unit.id} · ${n.unit.title} in brain/notes/${n.unit.notes}/ (shape: AGENTS.md 2.1), from what the student actually found hard. Commit and push. No test or new unit before that.`);
      return;
    case "write-test":
      console.log(`NEXT: write the test below. No new teaching until the student has taken it and it is analysed.\n`);
      printPlan(n.id);
      return;
    case "take-test":
      console.log(`NEXT: the student takes "${n.title}" in the app's Tests tab (test ${n.id}). No new teaching until then. If the result isn't here yet: git pull --rebase.`);
      return;
    case "analyse-test":
      console.log(`NEXT: analyse test ${n.id}, attempt ${n.attempt}, score ${pct(n.score)}: triaged, AGENTS.md 2.9 and 2.4. Then add ## Analysis to the result file. No new teaching until then.`);
      return;
    case "reteach": {
      console.log(`NEXT: test ${n.id} scored ${pct(n.score)}, the pass mark is ${pct(n.pass)}. Re-teach these items, in small steps, with fresh questions:`);
      for (const id of n.missed) {
        const item = state.catalog.items.get(id);
        if (item) console.log(`  ${item.id} ${item.text}`);
      }
      console.log(`Then write the retest:\n`);
      printPlan(n.retest);
      return;
    }
    case "finished":
      console.log("Everything is taught and tested. Use npm run syllabus -- weak to keep the weak items in the daily mock.");
  }
}

function markDone(ids: string[]): void {
  if (!ids.length) return fail("Which items? npm run syllabus -- done P07.3");
  const refuse = checkDone(state, ids);
  if (refuse) return fail(refuse);
  const done = { ...state.progress.done };
  for (const id of ids) done[id] ||= today;
  const sorted = Object.fromEntries(Object.entries(done).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })));
  const lines = Object.entries(sorted).map(([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)}`);
  writeFileSync(join(brain, "syllabus", "progress.json"), `{\n  "done": {\n${lines.join(",\n")}\n  }\n}\n`);
  console.log(`Marked ${ids.join(", ")}.\n`);
  printNext(nextStep({ ...state, progress: { done } }));
}

function showUnit(id: string | undefined): void {
  const unit = id ? state.catalog.units.get(id.toUpperCase()) : undefined;
  if (!unit) return fail(`Which unit? ${[...state.catalog.units.keys()].join(" ")}`);
  console.log(`${unit.id} · ${unit.title} · ${unit.hours}h · notes in brain/notes/${unit.notes}/`);
  let sub: string | null = null;
  for (const item of unit.items) {
    if (item.subtopic !== sub && item.subtopic) console.log(`\n${item.subtopic}`);
    sub = item.subtopic;
    const mark = state.progress.done[item.id] ? (state.progress.done[item.id] === "prior" ? "~" : "x") : " ";
    console.log(`[${mark}] ${item.id} ${item.kind} ${item.text}${item.pyqs.length ? `  (${item.pyqs.join(", ")})` : ""}`);
  }
}

function status(): void {
  const items = [...state.catalog.items.values()];
  const done = items.filter((i) => state.progress.done[i.id]);
  const prior = done.filter((i) => state.progress.done[i.id] === "prior");
  console.log(`${done.length} of ${items.length} items taught${prior.length ? ` (${prior.length} from before the syllabus, proved only by the first test)` : ""}. Today ${words(today)}.\n`);
  for (const step of state.sequence.steps) {
    if (isUnitStep(step)) {
      const unit = state.catalog.units.get(step.unit);
      if (!unit) continue;
      const left = unit.items.filter((i) => !state.progress.done[i.id]).length;
      console.log(`${left ? (left === unit.items.length ? "  " : "→ ") : "x "}${unit.id} ${unit.title.padEnd(58)} ${left ? `${left} left`.padEnd(8) : "done    "} by ${words(step.by)}`);
      continue;
    }
    for (const id of [step.test, retestId(step.test)]) {
      const a = state.tests.get(id);
      if (!a && id !== step.test) continue;
      const score = a?.first ? `${pct(scoreOf(a.first))}${a.first.analysis === null ? ", not analysed" : ""}` : a?.test ? "written, not taken" : "not written";
      console.log(`  ◆ ${id.padEnd(16)} ${step.kind.padEnd(10)} ${score.padEnd(24)} by ${words(step.by)}`);
    }
  }
  const history = itemHistory(state);
  const patterns = items.filter((i) => i.kind === "Q");
  console.log(`\nPYQ patterns tested so far: ${patterns.filter((i) => history.has(i.id)).length} of ${patterns.length}.`);
  const next = nextStep(state);
  console.log();
  printNext(next);
}

function weak(): void {
  const rows = [...itemHistory(state).entries()].filter(([, h]) => h.at(-1) !== "correct");
  if (!rows.length) return void console.log("No item is weak right now.");
  for (const [id, h] of rows) console.log(`${id}  ${h.join(" → ")}  ${state.catalog.items.get(id)?.text ?? ""}`);
}

function checkTest(id: string | undefined): void {
  if (!id) return fail("Which test?");
  const file = join(brain, "tests", `${id}.md`);
  if (!existsSync(file)) return fail(`No brain/tests/${id}.md yet.`);
  const parsed = parseTest(id, readFileSync(file, "utf8"));
  if (!parsed.ok) return fail(parsed.errors.join("\n"));
  const { errors: bad, warnings } = auditTest(state, id, parsed.test);
  for (const w of warnings) console.log(`  warning: ${w}`);
  for (const e of bad) console.log(`  error: ${e}`);
  console.log(bad.length ? `✗ ${id} does not match its blueprint.` : `✓ ${id} matches its blueprint.`);
  process.exit(bad.length ? 1 : 0);
}

function checkAll(): void {
  const all = [...errors, ...validate(state.catalog, state.pyqs, state.sequence, state.progress)];
  for (const e of all) console.log(`  error: ${e}`);
  const items = [...state.catalog.items.values()];
  const by = (k: string) => items.filter((i) => i.kind === k).length;
  const tests = state.sequence.steps.filter((s) => !isUnitStep(s)).length;
  console.log(`${all.length ? "✗" : "✓"} ${state.catalog.units.size} units, ${items.length} items (${by("T")} concepts, ${by("Q")} PYQ patterns, ${by("N")} never asked yet, ${by("L")} legacy), ${tests} tests, ${state.pyqs.size} PYQs all covered.`);
  process.exit(all.length ? 1 : 0);
}

// ---- Real PYQ text: fetched once per device from GATE Overflow's public PDFs into .runtime/ (git-ignored).
// The repo is public, so it only stores ids and links, never the text.

const BOOKS = {
  old: "https://github.com/GATEOverflow/GO-PDFs/releases/download/gatecse-2022-vol1%2C2/Volume-2.pdf", // math survives as text, 1987–2021
  new: "https://github.com/GATEOverflow/GO-PDFs/releases/download/gatecse-2027/filter1_volume2.pdf", // everything up to 2026, math is missing from the text
};
const PDFTOTEXT = ["pdftotext", "C:\\Program Files\\Git\\mingw64\\bin\\pdftotext.exe", "/mingw64/bin/pdftotext", "/usr/bin/pdftotext"];

async function bookText(which: keyof typeof BOOKS): Promise<string | null> {
  const dir = join(repo, ".runtime", "pyq-cache");
  const txt = join(dir, `${which}.txt`);
  if (existsSync(txt) && statSync(txt).size > 0) return readFileSync(txt, "utf8");
  mkdirSync(dir, { recursive: true });
  const pdf = join(dir, `${which}.pdf`);
  if (!existsSync(pdf)) {
    console.error(`Downloading GATE Overflow's book (once per device): ${BOOKS[which]}`);
    const res = await fetch(BOOKS[which]);
    if (!res.ok) return null;
    writeFileSync(pdf, Buffer.from(await res.arrayBuffer()));
  }
  for (const tool of PDFTOTEXT) {
    try {
      execFileSync(tool, ["-layout", pdf, txt], { stdio: "ignore" });
      return readFileSync(txt, "utf8");
    } catch {
      // try the next location
    }
  }
  return null;
}

function headingPattern(p: Pyq): RegExp {
  const paper = p.paper === "CS" ? "GATE (?:CSE?|CS)" : p.paper === "IT" ? "GATE IT" : "GATE (?:DA|DS&AI)";
  const set = p.set ? `\\s*\\|?\\s*Set\\s*${p.set}` : "";
  const q = p.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^\\s*(\\d+\\.\\d+\\.\\d+)\\s+.*${paper}\\s+${p.year}${set}\\s*\\|\\s*Question:\\s*${q}(?![0-9A-Za-z.])`);
}

function findInBook(book: string, p: Pyq): { text: string; answer: string | null } | null {
  const lines = book.split(/\r?\n/);
  const pattern = headingPattern(p);
  const at = lines.findIndex((l) => pattern.test(l));
  if (at < 0) return null;
  const section = pattern.exec(lines[at])![1];
  const body: string[] = [];
  for (let i = at + 1; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t === "Answer" || t.startsWith("Answer key") || t.startsWith("Answers:") || /^\d+\.\d+\.\d+\s+.*(GATE|Question:)/.test(t)) break;
    const noise = !t || t.includes("Copyright GATE Overflow") || /^\d+\s+.*\(\d+\)\s*$/.test(t) || /^gate[a-z0-9-]*(\s+[a-z0-9.+#-]+)+$/.test(t);
    if (!noise) body.push(lines[i].trimEnd());
  }
  let answer: string | null = null;
  const keys = lines.findIndex((l, i) => i > at && l.trim() === "Answer Keys");
  if (keys > 0) {
    const key = new RegExp(`(?:^|\\s)${section.replace(/\./g, "\\.")}\\s+(\\S+)`);
    for (const l of lines.slice(keys, keys + 200)) {
      const m = key.exec(l);
      if (m) {
        answer = m[1];
        break;
      }
    }
  }
  return { text: body.join("\n").trim(), answer };
}

async function showPyq(ids: string[]): Promise<void> {
  if (!ids.length) return fail("Which PYQ? npm run syllabus -- pyq 2014s1-37");
  for (const id of ids) {
    const p = state.pyqs.get(id);
    if (!p) {
      console.log(`Unknown PYQ ${id}.`);
      continue;
    }
    const where = [...state.catalog.items.values()].filter((i) => i.pyqs.includes(id)).map((i) => i.id);
    console.log(`\n=== ${p.title} [${marksText(p)}] · syllabus ${where.join(", ")}\nLink: ${p.url ?? "none, search the title"}`);
    let found: { text: string; answer: string | null } | null = null;
    const order: (keyof typeof BOOKS)[] = p.year <= 2021 ? ["old", "new"] : ["new"];
    let answer: string | null = null;
    for (const which of order) {
      const book = await bookText(which);
      const hit = book ? findInBook(book, p) : null;
      if (hit && !found) found = hit;
      if (hit?.answer && hit.answer !== "N/A") answer ??= hit.answer;
    }
    if (found) {
      console.log(found.text);
      console.log(`Answer key: ${answer ?? "not in the book"}`);
      if (p.year > 2021) console.log(`Note: symbols and numbers may be missing from this text. Do not guess them: open the link above or ask the student to read them out.`);
    } else {
      console.log(`Text not available on this device (needs pdftotext). Open the link above; never write a PYQ from memory.`);
    }
  }
}

const [command = "next", ...args] = process.argv.slice(2);
switch (command) {
  case "next":
    printNext(nextStep(state));
    break;
  case "done":
    markDone(args);
    break;
  case "unit":
    showUnit(args[0]);
    break;
  case "status":
    status();
    break;
  case "test":
    printPlan(args[0] ?? fail("Which test?"));
    break;
  case "check-test":
    checkTest(args[0]);
    break;
  case "weak":
    weak();
    break;
  case "pyq":
    void showPyq(args);
    break;
  case "check":
    checkAll();
    break;
  default:
    fail(HELP);
}
