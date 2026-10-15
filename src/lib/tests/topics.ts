import type { Result } from "./result";

// Topic strength across mock tests (pure). Each topic's questions from the most recent attempts are
// pooled; a topic is weak when it has enough questions and too few of them came out right. Skipped
// questions count against it: in GATE a skip is marks left on the table.

export type TopicStat = {
  subject: string;
  topic: string | null;
  questions: number;
  correct: number;
  wrong: number;
  unattempted: number;
  strength: number; // correct / questions, 0–1
  last: string; // ISO of the latest attempt that had it
};

export const RECENT_ATTEMPTS = 10;
const MIN_QUESTIONS = 2;
const WEAK_BELOW = 0.6;

export function topicStats(results: Result[], recent = RECENT_ATTEMPTS): TopicStat[] {
  const map = new Map<string, TopicStat>();
  const latest = [...results].sort((a, b) => b.submitted.localeCompare(a.submitted)).slice(0, recent);
  for (const r of latest) {
    for (const q of r.questions) {
      const key = `${q.subject}/${q.topic ?? ""}`;
      const t = map.get(key) ?? { subject: q.subject, topic: q.topic, questions: 0, correct: 0, wrong: 0, unattempted: 0, strength: 0, last: r.submitted };
      t.questions += 1;
      t[q.outcome] += 1;
      if (r.submitted > t.last) t.last = r.submitted;
      map.set(key, t);
    }
  }
  return [...map.values()].map((t) => ({ ...t, strength: t.correct / t.questions })).sort((a, b) => a.strength - b.strength || b.questions - a.questions);
}

export function weakTopics(stats: TopicStat[]): TopicStat[] {
  return stats.filter((t) => t.topic && t.questions >= MIN_QUESTIONS && t.strength < WEAK_BELOW);
}
