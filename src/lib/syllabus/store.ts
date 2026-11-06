import "server-only";

import { brainPath } from "@/lib/repo/paths";
import { dayKey } from "@/lib/time";
import { loadSyllabus } from "./load";
import { buildTree, type SyllabusTree } from "./tree";

/** The Syllabus tab's data, read fresh from brain/ on each request. A broken file gives the reason instead. */
export function getSyllabusTree(now: Date): { ok: true; tree: SyllabusTree } | { ok: false; error: string } {
  try {
    const { state } = loadSyllabus(brainPath());
    return { ok: true, tree: buildTree(state, dayKey(now)) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "could not read brain/syllabus" };
  }
}
