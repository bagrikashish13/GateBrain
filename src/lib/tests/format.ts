import matter from "gray-matter";
import { slugOf } from "@/lib/brain/names";

// A mock test is one Markdown file, brain/tests/<id>.md, written by Claude Code / Antigravity
// (AGENTS.md has the full format). Pure: no fs, so it's easy to test and the checker script can use it.
//
//   ---
//   title: OS + DBMS · Mock 1
//   duration: 60            minutes
//   ---
//   ## Q1
//   type: MCQ               MCQ | MSQ | NAT
//   marks: 1                1 or 2
//   subject: os             a key from brain/subjects.json
//   topic: deadlock         the notes section it belongs to (folder name without its number)
//   answer: B               MCQ: B · MSQ: A, C · NAT: 42 or 2.40 to 2.60
//
//   Question text (Markdown, math, code, images).
//
//   (A) option
//   (B) option
//   (C) option
//   (D) option
//
//   ### Solution
//   Why B.

export type QType = "MCQ" | "MSQ" | "NAT";
export const OPTION_KEYS = ["A", "B", "C", "D"] as const;
export type Answer = { kind: "MCQ"; key: string } | { kind: "MSQ"; keys: string[] } | { kind: "NAT"; min: number; max: number };
export type Option = { key: string; text: string };
export type Question = {
  n: number; // 1-based position in the test
  type: QType;
  marks: number;
  negative: number; // marks lost for a wrong answer (GATE: MCQ 1/3 or 2/3, MSQ and NAT none)
  subject: string;
  topic: string | null; // slug, matches a notes section folder ("deadlock")
  section: string; // "General Aptitude" or "Technical": the paper's section tabs
  text: string;
  options: Option[];
  answer: Answer;
  solution: string | null;
};
export type Test = {
  id: string;
  title: string;
  duration: number; // minutes
  created: string | null;
  description: string | null;
  questions: Question[];
  totalMarks: number;
};
export type ParseResult = { ok: true; test: Test; warnings: string[] } | { ok: false; errors: string[]; title: string | null };

export const TEST_ID = /^[a-z0-9][a-z0-9_-]*$/i;
const Q_HEADING = /^##\s+Q(?:uestion)?\s*\.?\s*(\d+)\s*$/i;
const SOLUTION = /^###\s+(?:Solution|Explanation)\s*$/i;
const OPTION = /^\(([A-D])\)\s?(.*)$/;
const META = /^([a-z_]+)\s*:\s*(.*?)\s*$/i;
const FENCE = /^\s*(```|~~~)/;
const META_KEYS = new Set(["type", "marks", "negative", "subject", "topic", "answer", "section"]);
const NUMBER = /^-?\d+(?:\.\d+)?$/;

/** GATE's default negative marking: a third of the marks for an MCQ, nothing for MSQ and NAT. */
export function defaultNegative(type: QType, marks: number): number {
  return type === "MCQ" ? marks / 3 : 0;
}

/** "2.40 to 2.60", "2.4..2.6", "42" → a closed range. */
export function parseNatAnswer(raw: string): { min: number; max: number } | null {
  const parts = raw.split(/\s*(?:\bto\b|\.\.|–|—)\s*/i).map((s) => s.trim());
  if (parts.length > 2 || !parts.every((p) => NUMBER.test(p))) return null;
  const [a, b = a] = parts.map(Number);
  return a <= b ? { min: a, max: b } : null;
}

export function parseTest(id: string, raw: string): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let data: Record<string, unknown>;
  let body: string;
  try {
    const m = matter(raw.replace(/\r\n/g, "\n"));
    data = m.data;
    body = m.content;
  } catch (err) {
    return { ok: false, errors: [`Frontmatter: ${(err as Error).message.split("\n")[0]}`], title: null };
  }

  const title = typeof data.title === "string" && data.title.trim() ? data.title.trim() : null;
  if (!TEST_ID.test(id)) errors.push(`File name "${id}" must be letters, digits, - or _.`);
  if (!title) errors.push("Frontmatter: add a title.");
  const duration = Number(data.duration);
  if (!Number.isFinite(duration) || duration <= 0) errors.push("Frontmatter: duration must be the time limit in minutes, like `duration: 60`.");
  const created = data.created instanceof Date ? data.created.toISOString().slice(0, 10) : typeof data.created === "string" ? data.created : null;

  const blocks = splitQuestions(body);
  if (!blocks.length) errors.push("No questions: each one starts with a `## Q1` heading.");

  const questions: Question[] = [];
  blocks.forEach((block, i) => {
    const where = `Q${block.label}`;
    const q = parseQuestion(i + 1, block.lines, (msg) => errors.push(`${where}: ${msg}`), (msg) => warnings.push(`${where}: ${msg}`));
    if (q) questions.push(q);
  });
  blocks.forEach((b, i) => {
    if (Number(b.label) !== i + 1) warnings.push(`Q${b.label} is question ${i + 1} in order; numbers are shown by position.`);
  });

  if (errors.length) return { ok: false, errors, title };
  return {
    ok: true,
    warnings,
    test: {
      id,
      title: title!,
      duration,
      created,
      description: typeof data.description === "string" ? data.description : null,
      questions,
      totalMarks: questions.reduce((s, q) => s + q.marks, 0),
    },
  };
}

/** Split the body at `## Q<n>` headings (never inside a code fence). Text before Q1 is ignored. */
function splitQuestions(body: string): { label: string; lines: string[] }[] {
  const out: { label: string; lines: string[] }[] = [];
  let fence = false;
  for (const line of body.split("\n")) {
    if (FENCE.test(line)) fence = !fence;
    const h = fence ? null : Q_HEADING.exec(line);
    if (h) out.push({ label: h[1], lines: [] });
    else out.at(-1)?.lines.push(line);
  }
  return out;
}

function parseQuestion(n: number, lines: string[], error: (m: string) => void, warn: (m: string) => void): Question | null {
  let i = 0;
  while (i < lines.length && !lines[i].trim()) i++;
  const meta: Record<string, string> = {};
  for (; i < lines.length; i++) {
    const m = META.exec(lines[i]);
    if (!m || !META_KEYS.has(m[1].toLowerCase())) break;
    meta[m[1].toLowerCase()] = m[2];
  }

  // The rest: question text, options from the first "(A)" line, the solution after "### Solution".
  const rest = lines.slice(i);
  let fence = false;
  let solutionAt = -1;
  let firstOption = -1;
  rest.forEach((line, j) => {
    if (FENCE.test(line)) fence = !fence;
    if (fence || solutionAt >= 0) return;
    if (SOLUTION.test(line)) solutionAt = j;
    else if (firstOption < 0 && OPTION.test(line)) firstOption = j;
  });
  const end = solutionAt >= 0 ? solutionAt : rest.length;
  const textEnd = firstOption >= 0 ? firstOption : end;
  const text = rest.slice(0, textEnd).join("\n").trim();
  const solution = solutionAt >= 0 ? rest.slice(solutionAt + 1).join("\n").trim() || null : null;

  const options: Option[] = [];
  if (firstOption >= 0) {
    for (const line of rest.slice(firstOption, end)) {
      const m = OPTION.exec(line);
      if (m) options.push({ key: m[1], text: m[2] });
      else if (options.length) options.at(-1)!.text += "\n" + line;
    }
    for (const o of options) o.text = o.text.trim();
  }

  const type = (meta.type ?? "").toUpperCase() as QType;
  if (!["MCQ", "MSQ", "NAT"].includes(type)) error("type must be MCQ, MSQ or NAT.");
  const marks = Number(meta.marks);
  if (!Number.isFinite(marks) || marks <= 0) error("marks must be a positive number (GATE uses 1 or 2).");
  const subject = (meta.subject ?? "").trim().toLowerCase();
  if (!subject) error("add a subject (a key from brain/subjects.json, like os).");
  if (!text) error("the question text is empty.");

  let negative = defaultNegative(type, marks);
  if (meta.negative !== undefined) {
    const v = Number(meta.negative);
    if (!Number.isFinite(v) || v < 0) error("negative must be a number ≥ 0.");
    else negative = v;
  }

  const keys = options.map((o) => o.key);
  if (type === "MCQ" || type === "MSQ") {
    if (options.length < 2) error("needs options, one per line: (A) … (B) … (C) … (D) …");
    else if (keys.some((k, j) => k !== OPTION_KEYS[j])) error("options must run (A), (B), (C), (D) in order.");
    else if (options.length !== 4) warn("GATE questions have four options.");
    if (options.some((o) => !o.text)) error("an option is empty.");
  }
  if (type === "NAT" && options.length) warn("NAT questions have no options; the (A)… lines are shown as text.");

  let answer: Answer | null = null;
  const rawAnswer = (meta.answer ?? "").trim();
  if (!rawAnswer) error("add the answer.");
  else if (type === "MCQ") {
    const k = rawAnswer.toUpperCase().replace(/[()\s]/g, "");
    if (k.length !== 1 || !keys.includes(k)) error(`answer must be one of ${keys.join(", ") || "the options"}.`);
    else answer = { kind: "MCQ", key: k };
  } else if (type === "MSQ") {
    const ks = [...new Set(rawAnswer.toUpperCase().match(/[A-D]/g) ?? [])].sort();
    if (!ks.length || ks.some((k) => !keys.includes(k)) || /[^A-D,\s()]/i.test(rawAnswer)) error("answer must be option letters, like A, C.");
    else answer = { kind: "MSQ", keys: ks };
  } else if (type === "NAT") {
    const range = parseNatAnswer(rawAnswer);
    if (!range) error("answer must be a number (42) or a range (2.40 to 2.60).");
    else answer = { kind: "NAT", ...range };
  }

  const section = meta.section?.trim() || (subject === "general-aptitude" ? "General Aptitude" : "Technical");
  if (!answer || !text || !Number.isFinite(marks) || marks <= 0 || !subject) return null;
  return {
    n,
    type,
    marks,
    negative,
    subject,
    topic: meta.topic?.trim() ? slugOf(meta.topic) : null,
    section,
    text,
    options: type === "NAT" ? [] : options,
    answer,
    solution,
  };
}

/** The answer key as one short string: "B", "A, C", "42", "2.4 to 2.6". */
export function answerText(a: Answer): string {
  if (a.kind === "MCQ") return a.key;
  if (a.kind === "MSQ") return a.keys.join(", ");
  return a.min === a.max ? String(a.min) : `${a.min} to ${a.max}`;
}

/** Sections in paper order: General Aptitude first, as in GATE. */
export function sectionsOf(test: Test): string[] {
  const all = [...new Set(test.questions.map((q) => q.section))];
  return all.sort((a, b) => (a === "General Aptitude" ? -1 : b === "General Aptitude" ? 1 : 0));
}
