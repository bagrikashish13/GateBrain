import type { Test } from "./format";

// The quality rules every new mock must pass (AGENTS.md 2.2.1, pure). They exist because instructions
// alone weren't enough: a retest once passed with renamed copies and no hard question.
//   - Every question says how hard it is: `difficulty: easy | medium | hard`.
//   - The mix is GATE's: at least ~20% hard and at most ~40% easy (a "tougher" paper: ~40% hard, ~20% easy).
//   - Every hard question names the real PYQ it is calibrated on: `pyq: 2019-23`. In the subjects of
//     brain/syllabus/ the id must exist in its PYQ index; elsewhere any GATE reference with its year.

/** Tests created before this day were written under the old rules: their difficulty isn't checked. */
export const RULES_FROM = "2026-11-10";

export type Mix = { hardMin: number; easyMax: number };

export function mixFor(questions: number, level: Test["level"]): Mix {
  if (level === "tougher") return { hardMin: Math.max(1, Math.round(questions * 0.4)), easyMax: Math.round(questions * 0.2) };
  return { hardMin: questions >= 4 ? Math.max(1, Math.round(questions * 0.2)) : 0, easyMax: Math.max(1, Math.round(questions * 0.4)) };
}

const GATE_REF = /(19[89]\d|20[0-4]\d)/;

/**
 * Problems with a test's difficulty tags and PYQ references. `indexed` says which subjects have a PYQ
 * index (and `known` its ids); questions in other subjects may cite any GATE reference with a year.
 */
export function qualityErrors(test: Test, known: Set<string>, indexed: Set<string>): string[] {
  const out: string[] = [];
  const qs = test.questions;
  const missing = qs.filter((q) => !q.difficulty).map((q) => `Q${q.n}`);
  if (missing.length) out.push(`${missing.join(", ")}: add "difficulty: easy | medium | hard".`);
  const hard = qs.filter((q) => q.difficulty === "hard");
  const easy = qs.filter((q) => q.difficulty === "easy");
  const mix = mixFor(qs.length, test.level);
  if (!missing.length) {
    if (hard.length < mix.hardMin) out.push(`${hard.length} hard question${hard.length === 1 ? "" : "s"}; a ${test.level === "tougher" ? "tougher" : "GATE-level"} test of ${qs.length} needs at least ${mix.hardMin}.`);
    if (easy.length > mix.easyMax) out.push(`${easy.length} easy questions; a ${test.level === "tougher" ? "tougher" : "GATE-level"} test of ${qs.length} allows at most ${mix.easyMax}.`);
  }
  for (const q of hard) {
    if (!q.pyq?.length) {
      out.push(`Q${q.n}: a hard question names the real PYQ it is modelled on, like "pyq: 2019-23" (read it first: npm run syllabus -- pyq <id>).`);
      continue;
    }
    for (const ref of q.pyq) {
      if (indexed.has(q.subject)) {
        if (!known.has(ref)) out.push(`Q${q.n}: pyq ${ref} isn't in brain/syllabus/pyq-index.jsonl; use a real id, like 2019-23 or 2016s1-25.`);
      } else if (!GATE_REF.test(ref)) {
        out.push(`Q${q.n}: pyq "${ref}" must name a real GATE question with its year, like 2019-23.`);
      }
    }
  }
  return out;
}
