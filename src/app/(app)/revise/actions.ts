"use server";

import { refresh } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { readNote } from "@/lib/brain/notes";
import { rateNote } from "@/lib/revision/store";
import { RATINGS, type Rating4 } from "@/lib/revision/schedule";

export type RateResult = { ok: true } | { ok: false; error: string };

/** Rate one note after revising it: its next FSRS step, committed and pushed. */
export async function rateAction(noteId: string, rating: Rating4): Promise<RateResult> {
  await requireSession();
  if (typeof noteId !== "string" || !RATINGS.includes(rating) || !readNote(noteId.split("/"))) return { ok: false, error: "That note isn't there any more. Sync and try again." };
  try {
    await rateNote(noteId, rating);
  } catch {
    return { ok: false, error: "Couldn't save. Try again." };
  }
  refresh();
  return { ok: true };
}
