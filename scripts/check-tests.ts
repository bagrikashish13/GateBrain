// Checks mock tests before he takes them: `npm run check:tests` (all) or `npm run check:tests -- mock-01`.
// Claude Code / Antigravity run this after writing a test (AGENTS.md). Exit code 1 if any test is broken.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { slugOf } from "../src/lib/brain/names";
import { answerText, parseTest } from "../src/lib/tests/format";

const root = join(process.env.REPO_PATH || join(import.meta.dirname, ".."), "brain");
const subjects = new Set<string>(JSON.parse(readFileSync(join(root, "subjects.json"), "utf8")).subjects.map((s: { key: string }) => s.key));
const sections = (subject: string) => {
  const dir = join(root, "notes", subject);
  return existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => slugOf(e.name)) : [];
};

const only = process.argv.slice(2).map((a) => a.replace(/\.md$/, "").replace(/^.*[\/]/, ""));
const dir = join(root, "tests");
const files = readdirSync(dir).filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md" && (!only.length || only.includes(f.slice(0, -3))));
if (!files.length) {
  console.log(only.length ? `No test named ${only.join(", ")} in brain/tests/.` : "No tests in brain/tests/ yet.");
  process.exit(only.length ? 1 : 0);
}

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
  const notes: string[] = [...r.warnings];
  for (const q of r.test.questions) {
    if (!subjects.has(q.subject)) notes.push(`Q${q.n}: subject "${q.subject}" isn't in brain/subjects.json.`);
    else if (!q.topic) notes.push(`Q${q.n}: no topic; the analysis groups it under "no topic".`);
    else if (sections(q.subject).length && !sections(q.subject).includes(q.topic)) {
      notes.push(`Q${q.n}: topic "${q.topic}" isn't a notes section of ${q.subject} (${sections(q.subject).join(", ")}).`);
    }
    if (!q.solution) notes.push(`Q${q.n}: no ### Solution.`);
  }
  const t = r.test;
  const by = (k: string) => t.questions.filter((q) => q.type === k).length;
  console.log(`✓ ${f}: "${t.title}", ${t.questions.length} questions (MCQ ${by("MCQ")}, MSQ ${by("MSQ")}, NAT ${by("NAT")}), ${t.totalMarks} marks, ${t.duration} min`);
  console.log(`    answers: ${t.questions.map((q) => `${q.n}:${answerText(q.answer)}`).join("  ")}`);
  for (const n of notes) console.log(`    note: ${n}`);
}
process.exit(broken ? 1 : 0);
