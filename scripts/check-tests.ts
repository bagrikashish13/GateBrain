// Checks mock tests before he takes them: `npm run check:tests` (all) or `npm run check:tests -- mock-01`.
// Claude Code / Antigravity run this after writing a test (AGENTS.md rule 7). Exit code 1 if a test that
// hasn't been taken yet is broken, repeats or re-skins a question (from another test or a real PYQ), or
// misses the quality rules (difficulty tags, GATE's mix, a real PYQ behind every hard question).
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { slugOf } from "../src/lib/brain/names";
import { answerText, parseTest, type Test } from "../src/lib/tests/format";
import { qualityErrors, RULES_FROM } from "../src/lib/tests/quality";
import { buildWeights, CLOSE, findPyqRepeats, findRepeats, fingerprint, preparePyqs, RETEST_SAME, SAME } from "../src/lib/tests/similar";
import { allPyqTexts } from "./pyq-books";

const repo = process.env.REPO_PATH || join(import.meta.dirname, "..");
const root = join(repo, "brain");
const subjects = new Set<string>(JSON.parse(readFileSync(join(root, "subjects.json"), "utf8")).subjects.map((s: { key: string }) => s.key));
const sections = (subject: string) => {
  const dir = join(root, "notes", subject);
  return existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => slugOf(e.name)) : [];
};
const taken = (id: string) => {
  const dir = join(root, "results", id);
  return existsSync(dir) && readdirSync(dir).some((f) => f.endsWith(".md"));
};

// The syllabus's PYQ index: real ids for `pyq:`, and which subjects it covers.
function syllabusIndex(): { known: Set<string>; indexed: Set<string> } {
  const dir = join(root, "syllabus");
  const known = new Set<string>();
  const indexed = new Set<string>();
  if (!existsSync(dir)) return { known, indexed };
  const index = join(dir, "pyq-index.jsonl");
  if (existsSync(index)) for (const line of readFileSync(index, "utf8").split("\n")) if (line.trim()) known.add(JSON.parse(line).id);
  for (const f of readdirSync(dir).filter((f) => /^\d+-.+\.md$/.test(f))) {
    for (const m of readFileSync(join(dir, f), "utf8").matchAll(/^notes:\s*([a-z0-9-]+)\//gm)) indexed.add(m[1]);
  }
  return { known, indexed };
}

async function main() {
  const only = process.argv.slice(2).map((a) => a.replace(/\.md$/, "").replace(/^.*[\\/]/, ""));
  const dir = join(root, "tests");
  const all = readdirSync(dir).filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md");
  const files = all.filter((f) => !only.length || only.includes(f.slice(0, -3)));
  if (!files.length) {
    console.log(only.length ? `No test named ${only.join(", ")} in brain/tests/.` : "No tests in brain/tests/ yet.");
    process.exit(only.length ? 1 : 0);
  }

  // Real PYQ texts, fetched once per device. Without them the PYQ comparison is skipped, with a warning.
  const { texts, missing } = await allPyqTexts(repo);
  const pyqs = preparePyqs([...texts.values()].map((e) => ({ id: e.id, title: e.title, text: e.text })));
  if (missing.length) console.log(`note: couldn't get GATE Overflow's book${missing.length > 1 ? "s" : ""} ${missing.join(", ")} on this device, so questions weren't compared with those PYQs.`);

  // The repeat check compares against every test, not just the ones asked about. Oldest first, so a
  // repeat is reported on the newer test.
  const parsed: Test[] = [];
  for (const f of all) {
    const r = parseTest(f.slice(0, -3), readFileSync(join(dir, f), "utf8"));
    if (r.ok) parsed.push(r.test);
  }
  parsed.sort((a, b) => (a.created ?? "").localeCompare(b.created ?? "") || a.id.localeCompare(b.id, undefined, { numeric: true }));
  const repeats = findRepeats(parsed, CLOSE, pyqs.map((p) => p.fp));
  const weights = buildWeights([...parsed.flatMap((t) => t.questions.map(fingerprint)), ...pyqs.map((p) => p.fp)]);
  const { known, indexed } = syllabusIndex();

  let broken = 0;
  for (const f of files) {
    const id = f.slice(0, -3);
    const r = parseTest(id, readFileSync(join(dir, f), "utf8"));
    if (!r.ok) {
      broken++;
      console.log(`✗ ${f}`);
      for (const e of r.errors) console.log(`    error: ${e}`);
      continue;
    }
    const t = r.test;
    const done = taken(id); // a test already taken can't be fixed: its problems are reported as history
    const errors: string[] = [];
    const notes: string[] = [...r.warnings];
    const fail = (msg: string) => (done ? notes.push(`(taken) ${msg}`) : errors.push(msg));
    for (const q of t.questions) {
      if (!subjects.has(q.subject)) notes.push(`Q${q.n}: subject "${q.subject}" isn't in brain/subjects.json.`);
      else if (!q.topic) {
        if (q.subject !== "general-aptitude") notes.push(`Q${q.n}: no topic; the analysis groups it under "no topic".`);
      } else if (sections(q.subject).length && !sections(q.subject).includes(q.topic)) {
        notes.push(`Q${q.n}: topic "${q.topic}" isn't a notes section of ${q.subject} (${sections(q.subject).join(", ")}).`);
      }
      if (!q.solution) notes.push(`Q${q.n}: no ### Solution.`);
    }

    const base = id.endsWith("-r2") ? id.slice(0, -3) : null;
    for (const m of repeats.filter((m) => m.test === id)) {
      const mine = `Q${m.n}`;
      const theirs = m.other === id ? `Q${m.otherN}` : `${m.other} Q${m.otherN}`;
      const pct = Math.round(m.score * 100);
      if (m.score >= SAME) fail(`${mine} repeats ${theirs} (${pct}% the same). Write a new question.`);
      else if (base && m.other === base && m.score >= RETEST_SAME) fail(`${mine} re-skins ${theirs}, from the test it retests (${pct}% the same). A retest needs a new setup, not new names.`);
      else notes.push(`${mine} is close to ${theirs} (${pct}% the same). Make sure it's genuinely different.`);
    }
    for (const m of findPyqRepeats(t.questions, pyqs, weights, CLOSE)) {
      const pct = Math.round(m.score * 100);
      if (m.score >= SAME) fail(`Q${m.n} re-skins the real PYQ ${m.pyq} (${m.title}, ${pct}% the same). Model on PYQs, never copy them.`);
      else notes.push(`Q${m.n} is close to the real PYQ ${m.pyq} (${m.title}, ${pct}% the same). Make sure it asks something different.`);
    }
    const newRules = !t.created || t.created >= RULES_FROM;
    if (newRules) for (const e of qualityErrors(t, known, indexed)) fail(e);

    const by = (k: string) => t.questions.filter((q) => q.type === k).length;
    const level = (k: string) => t.questions.filter((q) => q.difficulty === k).length;
    const mix = newRules ? `, easy ${level("easy")} · medium ${level("medium")} · hard ${level("hard")}` : "";
    if (errors.length) broken++;
    console.log(`${errors.length ? "✗" : "✓"} ${f}: "${t.title}", ${t.questions.length} questions (MCQ ${by("MCQ")}, MSQ ${by("MSQ")}, NAT ${by("NAT")}${mix}), ${t.totalMarks} marks, ${t.duration} min${done ? " · taken" : ""}`);
    console.log(`    answers: ${t.questions.map((q) => `${q.n}:${answerText(q.answer)}`).join("  ")}`);
    for (const e of errors) console.log(`    error: ${e}`);
    for (const n of notes) console.log(`    note: ${n}`);
  }
  process.exit(broken ? 1 : 0);
}

void main();
