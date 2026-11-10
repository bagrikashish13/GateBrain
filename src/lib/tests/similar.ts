import type { Question } from "./format";

// Catches a new mock question that repeats one from an earlier mock or a real PYQ (pure). Two views of
// each question are compared and the closer one counts:
//   words: text and options reduced to words and numbers, cut into overlapping 3-word pieces. Changing a
//          word or two doesn't hide a copy.
//   shape: the same with every number blanked, and code reduced to its skeleton (names, numbers and
//          strings blanked, keywords and operators kept). Renaming the variables, swapping the strings
//          or changing the numbers doesn't hide a copy either: "Red/Green/Blue" with step1/step2 is the
//          same question as "Gold/Silver/Bronze" with funcA/funcB.
// A genuinely different question on the same concept shares little in either view.

export const SAME = 0.8; // this close: a repeat (the checker fails)
export const CLOSE = 0.55; // this close: worth a second look (the checker warns)
export const RETEST_SAME = 0.6; // a retest this close to a question of the test it retests: a re-skin (fails)
const MIN_SHAPE = 12; // fewer shape pieces than this and the shape view can't tell a copy from boilerplate
const MIN_WORDS = 8; // a text this short (an image-only PYQ is just "A. B. C. D.") can't be compared at all

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

// C keywords and the library names questions use: kept in the skeleton, since they are the structure.
const KEEP = new Set(
  (
    "auto break case char const continue default do double else enum extern float for goto if int long register return short signed sizeof static struct switch " +
    "typedef union unsigned void volatile while bool true false null main printf scanf puts putchar getchar strlen strcpy strcat strcmp malloc calloc realloc free " +
    "include define stdio string stdlib size_t argc argv"
  ).split(" "),
);
const CODE_TOKEN = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[A-Za-z_]\w*|\d+(?:\.\d+)?|->|\+\+|--|<<=?|>>=?|[<>=!]=|&&|\|\||[-+*/%&|^]=|\S/g;

/** Code reduced to its skeleton: names → v, numbers → 0, strings → s, chars → c; keywords and operators stay. */
export function skeleton(code: string): string[] {
  return (code.match(CODE_TOKEN) ?? []).map((t) => {
    if (t.startsWith('"')) return "s";
    if (t.startsWith("'")) return "c";
    if (/^\d/.test(t)) return "0";
    if (/^[A-Za-z_]/.test(t)) return KEEP.has(t.toLowerCase()) ? t.toLowerCase() : "v";
    return t;
  });
}

/** Prose and code of a question as one stream of shape tokens (prose numbers blanked, code skeletonised). */
export function shapeTokens(md: string): string[] {
  const out: string[] = [];
  const parts = md.split(/(```[\s\S]*?```|`[^`\n]+`)/g);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith("`")) out.push(...skeleton(part.replace(/^```[a-z]*\n?|```$/g, "").replace(/^`|`$/g, "")));
    else out.push(...words(part).map((w) => (/^\d/.test(w) ? "#" : w)));
  }
  return out;
}

function shingles(ws: string[], k: number): Set<string> {
  if (ws.length < k) return new Set(ws.length ? [ws.join(" ")] : []);
  const out = new Set<string>();
  for (let i = 0; i + k <= ws.length; i++) out.add(ws.slice(i, i + k).join(" "));
  return out;
}

export type Fingerprint = { words: Set<string>; shape: Set<string> };
const joined = (q: Pick<Question, "text" | "options">) => [q.text, ...q.options.map((o) => o.text)].join("\n");

export const fingerprint = (q: Pick<Question, "text" | "options">): Fingerprint => {
  const md = joined(q);
  return { words: shingles(words(md), 3), shape: shingles(shapeTokens(md), 4) };
};

/** Shared pieces over the smaller set's pieces: 1 = one contains the other. */
export function overlap(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  const [small, big] = a.size <= b.size ? [a, b] : [b, a];
  for (const s of small) if (big.has(s)) shared++;
  return shared / small.size;
}

/**
 * How rare each piece is across a body of questions. Boilerplate (`#include`, `int main`, "what is the
 * output displayed by the program") is in most questions and so weighs almost nothing; a program's real
 * structure, or a scenario's own wording, weighs a lot.
 */
export type Weights = { words: Map<string, number>; shape: Map<string, number>; n: number };
export function buildWeights(prints: Fingerprint[]): Weights {
  const words = new Map<string, number>();
  const shape = new Map<string, number>();
  for (const p of prints) {
    for (const s of p.words) words.set(s, (words.get(s) ?? 0) + 1);
    for (const s of p.shape) shape.set(s, (shape.get(s) ?? 0) + 1);
  }
  return { words, shape, n: prints.length };
}

/** Like `overlap`, but each piece counts by its rarity in `df` (out of `n` questions). */
export function weightedOverlap(a: Set<string>, b: Set<string>, df: Map<string, number>, n: number): number {
  if (!a.size || !b.size) return 0;
  const weight = (s: string) => Math.log((n + 1) / ((df.get(s) ?? 0) + 1)) + 0.05;
  let sa = 0;
  let sb = 0;
  let shared = 0;
  for (const s of a) sa += weight(s);
  for (const s of b) {
    const x = weight(s);
    sb += x;
    if (a.has(s)) shared += x;
  }
  return shared / Math.min(sa, sb);
}

/** How alike two questions are, 0–1: the closer of the word view and the shape view. */
export function similarity(a: Fingerprint, b: Fingerprint, w?: Weights): number {
  const wordsOk = a.words.size >= MIN_WORDS && b.words.size >= MIN_WORDS;
  const byWords = !wordsOk ? 0 : w ? weightedOverlap(a.words, b.words, w.words, w.n) : overlap(a.words, b.words);
  if (a.shape.size < MIN_SHAPE || b.shape.size < MIN_SHAPE) return byWords;
  return Math.max(byWords, w ? weightedOverlap(a.shape, b.shape, w.shape, w.n) : overlap(a.shape, b.shape));
}

export type Match = { test: string; n: number; other: string; otherN: number; score: number };
type Q = Pick<Question, "n" | "text" | "options">;

/**
 * Every pair of questions that look alike: each question of `tests` against every earlier question
 * (other tests, and earlier questions of the same test). Sorted, closest first. `extra` only adds to the
 * rarity weights (PYQ texts, so that GATE's stock phrasing counts as boilerplate too).
 */
export function findRepeats(tests: { id: string; questions: Q[] }[], min = CLOSE, extra: Fingerprint[] = []): Match[] {
  const all = tests.flatMap((t) => t.questions.map((q) => ({ test: t.id, n: q.n, fp: fingerprint(q) })));
  const w = buildWeights([...all.map((x) => x.fp), ...extra]);
  const out: Match[] = [];
  for (let i = 0; i < all.length; i++) {
    for (let j = 0; j < i; j++) {
      const score = similarity(all[i].fp, all[j].fp, w);
      if (score >= min) out.push({ test: all[i].test, n: all[i].n, other: all[j].test, otherN: all[j].n, score });
    }
  }
  return out.sort((a, b) => b.score - a.score);
}

export type PyqText = { id: string; title: string; text: string };
export type PreparedPyq = { id: string; title: string; fp: Fingerprint };
export type PyqMatch = { n: number; pyq: string; title: string; score: number };

export const preparePyqs = (pyqs: PyqText[]): PreparedPyq[] => pyqs.map((p) => ({ id: p.id, title: p.title, fp: fingerprint({ text: p.text, options: [] }) }));

/** Each question of a test against real PYQ texts: a re-skinned PYQ is a repeat too. Closest first. */
export function findPyqRepeats(questions: Q[], pyqs: PreparedPyq[], w: Weights, min = CLOSE): PyqMatch[] {
  const out: PyqMatch[] = [];
  for (const q of questions) {
    const fp = fingerprint(q);
    let best: PyqMatch | null = null;
    for (const p of pyqs) {
      const score = similarity(fp, p.fp, w);
      if (score >= min && (!best || score > best.score)) best = { n: q.n, pyq: p.id, title: p.title, score };
    }
    if (best) out.push(best);
  }
  return out.sort((a, b) => b.score - a.score);
}
