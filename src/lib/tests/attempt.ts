import type { Question, Test } from "./format";
import { msqKeys, type QState } from "./grade";

// What the exam screen sends back is checked before it's saved or graded (pure).

const NAT = /^-?(?:\d+\.?\d*|\.\d+)$/;

/** A response as stored: "B", "A,C", "2.5", or null when it isn't a valid answer for the question. */
export function cleanResponse(q: Pick<Question, "type" | "options">, raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const r = raw.trim();
  if (!r || r.length > 20) return null;
  const keys = q.options.map((o) => o.key);
  if (q.type === "MCQ") return /^[A-D]$/.test(r) && keys.includes(r) ? r : null;
  if (q.type === "MSQ") {
    const ks = msqKeys(r).filter((k) => keys.includes(k));
    return ks.length ? ks.join(",") : null;
  }
  return NAT.test(r) ? r : null;
}

export function cleanStates(test: Test, raw: unknown): QState[] | null {
  if (!Array.isArray(raw) || raw.length !== test.questions.length) return null;
  const cap = test.duration * 60_000 * 2;
  return test.questions.map((q, i) => {
    const s = (raw[i] ?? {}) as Partial<QState>;
    const timeMs = Number(s.timeMs);
    const visits = Number(s.visits);
    return {
      response: cleanResponse(q, s.response),
      visited: s.visited === true,
      marked: s.marked === true,
      timeMs: Number.isFinite(timeMs) ? Math.min(cap, Math.max(0, Math.round(timeMs))) : 0,
      visits: Number.isInteger(visits) ? Math.min(10_000, Math.max(0, visits)) : 0,
    };
  });
}
