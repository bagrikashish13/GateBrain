"use server";

import { requireSession } from "@/lib/auth/session";
import { cleanStates } from "@/lib/tests/attempt";
import { getInProgress, getTest, saveProgress, submitAttempt } from "@/lib/tests/store";
import type { QState } from "@/lib/tests/grade";

type Snapshot = { current: number; states: QState[] };

function load(id: string, snap: Snapshot) {
  const test = getTest(id);
  const p = test && getInProgress(id);
  if (!test || !p) return null;
  const states = cleanStates(test, snap?.states);
  if (!states) return null;
  const current = Number.isInteger(snap.current) && snap.current >= 0 && snap.current < test.questions.length ? snap.current : p.current;
  return { test, p: { ...p, states, current } };
}

/** Saved every few seconds while he works, so a closed tab or a dead phone resumes where it was. */
export async function saveExamAction(id: string, snap: Snapshot): Promise<{ ok: boolean }> {
  await requireSession();
  const l = load(id, snap);
  if (!l) return { ok: false };
  saveProgress(l.p);
  return { ok: true };
}

/** Submit for final marking: grade, commit the result file (pushed right after), open the result. */
export async function submitExamAction(id: string, snap: Snapshot, auto: boolean): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  await requireSession();
  const l = load(id, snap);
  if (!l) return { ok: false, error: "This test isn't in progress any more." };
  try {
    const attempt = await submitAttempt(l.test, l.p, auto === true);
    return { ok: true, url: `/tests/${id}/${attempt}` };
  } catch (err) {
    console.error("submit failed", err);
    saveProgress(l.p);
    return { ok: false, error: "Couldn't save the result. Your answers are kept; try Submit again." };
  }
}
