import "server-only";

import { readFileSync } from "node:fs";
import { brainPath } from "@/lib/repo/paths";
import { dayKey } from "@/lib/time";
import { loadSyllabus } from "./load";
import { buildTree, type SyllabusTree } from "./tree";

/** Ids of the tests the syllabus places between its units (the Tests tab groups them). */
export function syllabusTestIds(): Set<string> {
  try {
    const sequence = JSON.parse(readFileSync(brainPath("syllabus/sequence.json"), "utf8")) as { steps: { test?: string }[] };
    return new Set(sequence.steps.flatMap((s) => (s.test ? [s.test, `${s.test}-r2`] : [])));
  } catch {
    return new Set();
  }
}

/** The Syllabus tab's data, read fresh from brain/ on each request. A broken file gives the reason instead. */
export function getSyllabusTree(now: Date): { ok: true; tree: SyllabusTree } | { ok: false; error: string } {
  try {
    const { state } = loadSyllabus(brainPath());
    return { ok: true, tree: buildTree(state, dayKey(now)) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "could not read brain/syllabus" };
  }
}
