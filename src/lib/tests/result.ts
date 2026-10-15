import matter from "gray-matter";
import { answerText, type Test } from "./format";
import { round2, summarize, type Graded, type Outcome, type Summary } from "./grade";

// A submitted attempt: brain/results/<test-id>/<YYYY-MM-DD-HHMM>.md, written by the app and pushed.
// The frontmatter is the data (the app reads it back); the body is the same story as tables, for him
// and for Claude Code / Antigravity to analyse. An agent may add a "## Analysis" section at the end;
// the app shows it on the result page. Pure: no fs.

export type ResultQuestion = Graded & { answer: string };
export type Result = {
  test: string;
  title: string;
  attempt: string; // the file name without .md: "2026-10-15-1430"
  started: string; // ISO
  submitted: string; // ISO
  durationMin: number;
  timeUsedSec: number;
  autoSubmitted: boolean;
  questions: ResultQuestion[];
  summary: Summary;
  analysis: string | null; // the "## Analysis" section, if an agent wrote one
};

const q = (s: string | null) => (s === null ? "null" : JSON.stringify(s)); // a YAML double-quoted scalar

/** "56m 52s", "1h 02m", "45s" */
export function duration(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m) return `${m}m ${String(s % 60).padStart(2, "0")}s`;
  return `${s}s`;
}

const pctText = (x: number | null) => (x === null ? "—" : `${Math.round(x * 100)}%`);
const OUTCOME: Record<Outcome, string> = { correct: "correct", wrong: "wrong", unattempted: "skipped" };

export function buildResult(input: {
  test: Test;
  attempt: string;
  started: Date;
  submitted: Date;
  autoSubmitted: boolean;
  graded: Graded[];
  subjectName: (key: string) => string;
}): string {
  const { test, graded } = input;
  const s = summarize(graded);
  const used = Math.min(test.duration * 60, Math.round((input.submitted.getTime() - input.started.getTime()) / 1000));
  const rows: ResultQuestion[] = graded.map((g, i) => ({ ...g, answer: answerText(test.questions[i].answer) }));

  const fm = [
    "---",
    `test: ${q(test.id)}`,
    `title: ${q(test.title)}`,
    `attempt: ${q(input.attempt)}`,
    `started: ${q(input.started.toISOString())}`,
    `submitted: ${q(input.submitted.toISOString())}`,
    `duration_min: ${test.duration}`,
    `time_used_sec: ${used}`,
    `auto_submitted: ${input.autoSubmitted}`,
    `score: ${s.score}`,
    `max: ${s.max}`,
    `correct: ${s.correct}`,
    `wrong: ${s.wrong}`,
    `unattempted: ${s.unattempted}`,
    `negative: ${s.negative}`,
    `accuracy: ${s.accuracy === null ? "null" : round2(s.accuracy)}`,
    "questions:",
    ...rows.map(
      (r) =>
        `  - { n: ${r.n}, subject: ${q(r.subject)}, topic: ${q(r.topic)}, type: ${r.type}, marks: ${r.marks}, answer: ${q(r.answer)}, response: ${q(r.response)}, outcome: ${r.outcome}, awarded: ${round2(r.awarded)}, time_sec: ${r.timeSec}, visits: ${r.visits}, marked: ${r.marked} }`,
    ),
    "---",
  ];

  const name = input.subjectName;
  const topicName = (t: string | null) => (t ? t.replace(/-/g, " ") : "—");
  const body: string[] = [
    `# Result: ${test.title}`,
    "",
    `**${s.score} / ${s.max}** · ${s.correct} correct · ${s.wrong} wrong · ${s.unattempted} skipped · accuracy ${pctText(s.accuracy)} · −${s.negative} lost to negative marking · time ${duration(used)} of ${test.duration}m${input.autoSubmitted ? " (time ran out)" : ""}`,
    "",
    `Questions and solutions: \`brain/tests/${test.id}.md\`.`,
    "",
    "## By subject",
    "",
    "| Subject | Qs | Correct | Wrong | Skipped | Marks | Accuracy | Time |",
    "|---|---|---|---|---|---|---|---|",
    ...s.bySubject.map(
      (t) => `| ${name(t.subject)} | ${t.questions} | ${t.correct} | ${t.wrong} | ${t.unattempted} | ${t.score} / ${t.max} | ${pctText(t.attempted ? t.correct / t.attempted : null)} | ${duration(t.timeSec)} |`,
    ),
    "",
    "## By topic (weakest first)",
    "",
    "| Subject | Topic | Qs | Correct | Wrong | Skipped | Marks | Time |",
    "|---|---|---|---|---|---|---|---|",
    ...[...s.byTopic]
      .sort((a, b) => a.correct / a.questions - b.correct / b.questions || b.wrong - a.wrong)
      .map((t) => `| ${name(t.subject)} | ${topicName(t.topic)} | ${t.questions} | ${t.correct} | ${t.wrong} | ${t.unattempted} | ${t.score} / ${t.max} | ${duration(t.timeSec)} |`),
    "",
    "## Questions",
    "",
    "| Q | Subject · topic | Type | Marks | Your answer | Correct answer | Result | Awarded | Time | Visits |",
    "|---|---|---|---|---|---|---|---|---|---|",
    ...rows.map(
      (r) =>
        `| ${r.n}${r.marked ? " ⚑" : ""} | ${name(r.subject)} · ${topicName(r.topic)} | ${r.type} | ${r.marks} | ${r.response ?? "—"} | ${r.answer} | ${OUTCOME[r.outcome]} | ${round2(r.awarded)} | ${duration(r.timeSec)} | ${r.visits} |`,
    ),
    "",
    "## Time",
    "",
    ...timeLines(rows),
    "",
  ];
  return [...fm, "", ...body].join("\n");
}

function timeLines(rows: ResultQuestion[]): string[] {
  const avg = (rs: ResultQuestion[]) => (rs.length ? duration(rs.reduce((a, r) => a + r.timeSec, 0) / rs.length) : "—");
  const by = (o: Outcome) => rows.filter((r) => r.outcome === o);
  const slow = [...rows].sort((a, b) => b.timeSec - a.timeSec).slice(0, 5);
  return [
    `- Average time: correct ${avg(by("correct"))} · wrong ${avg(by("wrong"))} · skipped ${avg(by("unattempted"))}`,
    `- Slowest: ${slow.map((r) => `Q${r.n} ${duration(r.timeSec)} (${OUTCOME[r.outcome]})`).join(", ")}`,
  ];
}

/**
 * Marks are stored to 2 decimals (−0.33 for −1/3). Read back, they snap to the third they stand for,
 * so totals add up exactly: 2 − 4×(1/3) − 2/3 is 0, not the 0.01 the rounded parts would give.
 */
export function exactMarks(stored: number): number {
  const thirds = Math.round(stored * 3) / 3;
  return Math.abs(thirds - stored) < 0.006 ? thirds : stored;
}

/** Read a result file back. Null if it isn't one. */
export function parseResult(file: string, raw: string): Result | null {
  let data: Record<string, unknown>;
  let content: string;
  try {
    const m = matter(raw.replace(/\r\n/g, "\n"));
    data = m.data;
    content = m.content;
  } catch {
    return null;
  }
  if (typeof data.test !== "string" || !Array.isArray(data.questions)) return null;
  const questions: ResultQuestion[] = (data.questions as Record<string, unknown>[]).map((r) => ({
    n: Number(r.n),
    subject: String(r.subject ?? ""),
    topic: typeof r.topic === "string" && r.topic ? r.topic : null,
    type: (String(r.type ?? "MCQ").toUpperCase() as ResultQuestion["type"]) ?? "MCQ",
    marks: Number(r.marks) || 0,
    answer: String(r.answer ?? ""),
    response: r.response === null || r.response === undefined || r.response === "" ? null : String(r.response),
    outcome: (["correct", "wrong", "unattempted"].includes(String(r.outcome)) ? r.outcome : "unattempted") as Outcome,
    awarded: exactMarks(Number(r.awarded) || 0),
    timeSec: Number(r.time_sec) || 0,
    visits: Number(r.visits) || 0,
    marked: r.marked === true,
  }));
  const analysis = /^## Analysis\b.*$/m.exec(content);
  return {
    test: data.test,
    title: typeof data.title === "string" ? data.title : data.test,
    attempt: file,
    started: String(data.started ?? ""),
    submitted: String(data.submitted ?? ""),
    durationMin: Number(data.duration_min) || 0,
    timeUsedSec: Number(data.time_used_sec) || 0,
    autoSubmitted: data.auto_submitted === true,
    questions,
    summary: summarize(questions),
    analysis: analysis ? content.slice(analysis.index + analysis[0].length).trim() || null : null,
  };
}
