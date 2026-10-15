import type { Question } from "./format";

// Catches a new mock question that repeats one from an earlier mock (pure). A question's text and options
// are reduced to words and numbers, cut into overlapping 3-word pieces, and compared by how many pieces
// two questions share. Changing a word or two doesn't hide a copy; a genuinely different question on
// the same concept shares little.

export const SAME = 0.8; // this close: a repeat (the checker fails)
export const CLOSE = 0.55; // this close: worth a second look (the checker warns)

/** Words and numbers only: markdown, LaTeX commands and punctuation dropped, lowercase. */
export function words(md: string): string[] {
  return md
    .toLowerCase()
    .replace(/```[a-z]*\n?/g, " ")
    .replace(/\\[a-z]+/g, " ")
    .replace(/[^a-z0-9.]+/g, " ")
    .replace(/(^|\s)\.+|\.+(\s|$)/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function shingles(ws: string[]): Set<string> {
  if (ws.length < 3) return new Set([ws.join(" ")]);
  const out = new Set<string>();
  for (let i = 0; i + 3 <= ws.length; i++) out.add(ws.slice(i, i + 3).join(" "));
  return out;
}

export const fingerprint = (q: Pick<Question, "text" | "options">) => shingles(words([q.text, ...q.options.map((o) => o.text)].join("\n")));

/** Shared pieces over the smaller question's pieces: 1 = one contains the other. */
export function similarity(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const s of a) if (b.has(s)) shared++;
  return shared / Math.min(a.size, b.size);
}

export type Match = { test: string; n: number; other: string; otherN: number; score: number };

/**
 * Every pair of questions that look alike: each question of `tests` against every earlier question
 * (other tests, and earlier questions of the same test). Sorted, closest first.
 */
export function findRepeats(tests: { id: string; questions: Pick<Question, "n" | "text" | "options">[] }[], min = CLOSE): Match[] {
  const all = tests.flatMap((t) => t.questions.map((q) => ({ test: t.id, n: q.n, fp: fingerprint(q) })));
  const out: Match[] = [];
  for (let i = 0; i < all.length; i++) {
    for (let j = 0; j < i; j++) {
      const score = similarity(all[i].fp, all[j].fp);
      if (score >= min) out.push({ test: all[i].test, n: all[i].n, other: all[j].test, otherN: all[j].n, score });
    }
  }
  return out.sort((a, b) => b.score - a.score);
}
