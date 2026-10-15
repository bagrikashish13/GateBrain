import { createEmptyCard, fsrs, generatorParameters, Rating, State, type Card, type FSRS, type Grade } from "ts-fsrs";
import { RATINGS, type Rating4 } from "./ratings";

export { RATINGS, RATING_LABEL, type Rating4 } from "./ratings";

// Spaced revision of his short notes with FSRS (pure). One card per note. No same-day learning steps:
// a note comes back at the earliest the next day. The gap is capped (GATE prep: nothing goes unseen for
// months) and never runs past the exam.

const GRADE: Record<Rating4, Grade> = { forgot: Rating.Again, fuzzy: Rating.Hard, gotit: Rating.Good, easy: Rating.Easy };

/** The card as stored in brain/_state/revision/<note>.json (dates as ISO strings). */
export type StoredCard = {
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: number;
  last_review: string | null;
};
export type RevisionLog = { at: string; rating: Rating4 };
export type RevisionState = { note: string; card: StoredCard; log: RevisionLog[] };

export const TARGET_RETENTION = 0.9;
export const MAX_GAP_DAYS = 45;

const cache = new Map<number, FSRS>();
function scheduler(maxGap: number): FSRS {
  let f = cache.get(maxGap);
  if (!f) {
    f = fsrs(generatorParameters({ request_retention: TARGET_RETENTION, maximum_interval: maxGap, enable_short_term: false, enable_fuzz: false }));
    cache.set(maxGap, f);
  }
  return f;
}

/** Longest allowed gap: MAX_GAP_DAYS, or fewer when the exam is closer than that. */
export function maxGap(daysToExam: number | null): number {
  return Math.max(1, Math.min(MAX_GAP_DAYS, daysToExam ?? MAX_GAP_DAYS));
}

function toCard(c: StoredCard): Card {
  return {
    due: new Date(c.due),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    learning_steps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state as State,
    last_review: c.last_review ? new Date(c.last_review) : undefined,
  };
}

function fromCard(c: Card): StoredCard {
  return {
    due: c.due.toISOString(),
    stability: Math.round(c.stability * 1e4) / 1e4,
    difficulty: Math.round(c.difficulty * 1e4) / 1e4,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    learning_steps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
    last_review: c.last_review ? c.last_review.toISOString() : null,
  };
}

export function review(prev: RevisionState | null, note: string, rating: Rating4, at: Date, gap = MAX_GAP_DAYS): RevisionState {
  const card = prev ? toCard(prev.card) : createEmptyCard(at);
  const next = capped(scheduler(gap).next(card, at, GRADE[rating]).card, at, gap);
  return { note, card: fromCard(next), log: [...(prev?.log ?? []), { at: at.toISOString(), rating }] };
}

/** FSRS can step past maximum_interval (the Easy bonus); hold the gap to `gap` days. */
function capped(c: Card, at: Date, gap: number): Card {
  const limit = new Date(at.getTime() + gap * 86_400_000);
  return c.due > limit ? { ...c, due: limit, scheduled_days: gap } : c;
}

/** When each rating would bring the note back. */
export function preview(prev: RevisionState | null, at: Date, gap = MAX_GAP_DAYS): Record<Rating4, Date> {
  const card = prev ? toCard(prev.card) : createEmptyCard(at);
  const f = scheduler(gap);
  const out = {} as Record<Rating4, Date>;
  for (const r of RATINGS) out[r] = capped(f.next(card, at, GRADE[r]).card, at, gap).due;
  return out;
}

/** Chance he still remembers it now (0–1); null before the first revision. */
export function recallOf(s: RevisionState | null, at: Date): number | null {
  if (!s || !s.card.last_review) return null;
  return scheduler(MAX_GAP_DAYS).get_retrievability(toCard(s.card), at, false);
}

export function isRevisionState(v: unknown): v is RevisionState {
  const s = v as RevisionState;
  return !!s && typeof s.note === "string" && !!s.card && typeof s.card.due === "string" && Array.isArray(s.log);
}
