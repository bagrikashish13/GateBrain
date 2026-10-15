import type { Question, Test } from "./format";

// Grading, the GATE way. Pure, so it's tested and the same on every device.
// - MCQ: full marks if right, minus the negative marks if wrong.
// - MSQ: full marks only when exactly the right options are picked; no negative, no partial.
// - NAT: full marks if the number falls inside the answer's range; no negative.
// Only a saved response counts (Save & Next, or Mark for Review & Next); "answered and marked for
// review" is evaluated, "marked" with no answer is not.

export type Outcome = "correct" | "wrong" | "unattempted";

/** One question's state in an attempt. `response`: "B" (MCQ), "A,C" (MSQ), "2.5" (NAT), or null. */
export type QState = { response: string | null; visited: boolean; marked: boolean; timeMs: number; visits: number };

export type Graded = {
  n: number;
  subject: string;
  topic: string | null;
  type: Question["type"];
  marks: number;
  response: string | null;
  outcome: Outcome;
  awarded: number;
  timeSec: number;
  visits: number;
  marked: boolean;
};

export type Tally = { questions: number; attempted: number; correct: number; wrong: number; unattempted: number; score: number; max: number; timeSec: number };
export type Summary = Tally & {
  negative: number; // marks lost to wrong MCQs (a positive number)
  accuracy: number | null; // correct / attempted
  bySubject: (Tally & { subject: string })[];
  byTopic: (Tally & { subject: string; topic: string | null })[];
};

const EPS = 1e-9;
export const round2 = (x: number) => Math.round(x * 100) / 100;

/** "A,C" → ["A","C"]; tolerant of spaces and order. */
export const msqKeys = (r: string) => [...new Set(r.toUpperCase().match(/[A-D]/g) ?? [])].sort();

export function grade(q: Question, response: string | null): { outcome: Outcome; awarded: number } {
  const r = response?.trim() ?? "";
  if (!r) return { outcome: "unattempted", awarded: 0 };
  let right = false;
  if (q.answer.kind === "MCQ") right = r.toUpperCase() === q.answer.key;
  else if (q.answer.kind === "MSQ") right = msqKeys(r).join(",") === q.answer.keys.join(",");
  else {
    const v = Number(r);
    right = r !== "-" && r !== "." && Number.isFinite(v) && v >= q.answer.min - EPS && v <= q.answer.max + EPS;
  }
  if (right) return { outcome: "correct", awarded: q.marks };
  return { outcome: "wrong", awarded: q.type === "MCQ" ? -q.negative : 0 };
}

export function gradeAll(test: Test, states: QState[]): Graded[] {
  return test.questions.map((q, i) => {
    const s = states[i] ?? { response: null, visited: false, marked: false, timeMs: 0, visits: 0 };
    const { outcome, awarded } = grade(q, s.response);
    return {
      n: q.n,
      subject: q.subject,
      topic: q.topic,
      type: q.type,
      marks: q.marks,
      response: s.response?.trim() || null,
      outcome,
      awarded,
      timeSec: Math.round(s.timeMs / 1000),
      visits: s.visits,
      marked: s.marked,
    };
  });
}

function tally(rows: Graded[]): Tally {
  const t: Tally = { questions: rows.length, attempted: 0, correct: 0, wrong: 0, unattempted: 0, score: 0, max: 0, timeSec: 0 };
  for (const r of rows) {
    t[r.outcome] += 1;
    if (r.outcome !== "unattempted") t.attempted += 1;
    t.score += r.awarded;
    t.max += r.marks;
    t.timeSec += r.timeSec;
  }
  t.score = round2(t.score);
  return t;
}

function groupBy<K extends string>(rows: Graded[], key: (r: Graded) => K): Map<K, Graded[]> {
  const m = new Map<K, Graded[]>();
  for (const r of rows) m.set(key(r), [...(m.get(key(r)) ?? []), r]);
  return m;
}

export function summarize(rows: Graded[]): Summary {
  const all = tally(rows);
  const negative = round2(-rows.filter((r) => r.awarded < 0).reduce((s, r) => s + r.awarded, 0));
  const bySubject = [...groupBy(rows, (r) => r.subject)].map(([subject, rs]) => ({ subject, ...tally(rs) }));
  const byTopic = [...groupBy(rows, (r) => `${r.subject}\n${r.topic ?? ""}`)].map(([k, rs]) => {
    const [subject, topic] = k.split("\n");
    return { subject, topic: topic || null, ...tally(rs) };
  });
  return { ...all, negative, accuracy: all.attempted ? all.correct / all.attempted : null, bySubject, byTopic };
}

/** Palette status of a question, as GATE's legend names them. */
export type PaletteStatus = "not-visited" | "not-answered" | "answered" | "marked" | "answered-marked";
export function paletteStatus(s: QState): PaletteStatus {
  const answered = !!s.response?.trim();
  if (s.marked) return answered ? "answered-marked" : "marked";
  if (answered) return "answered";
  return s.visited ? "not-answered" : "not-visited";
}
