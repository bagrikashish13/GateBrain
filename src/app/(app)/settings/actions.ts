"use server";

import { refresh } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { getSettings, saveSettings } from "@/lib/settings";
import { isDay } from "@/lib/time";

export type SettingsState = { ok?: boolean; error?: string };

/** Exam date and new notes a day, saved to brain/settings.json (committed and pushed). */
export async function saveSettingsAction(_prev: SettingsState, form: FormData): Promise<SettingsState> {
  await requireSession();
  const exam = String(form.get("examDate") ?? "").trim();
  const perDay = Number(form.get("newPerDay"));
  if (exam && !isDay(exam)) return { error: "Pick a date." };
  if (!Number.isInteger(perDay) || perDay < 1 || perDay > 50) return { error: "New notes a day: 1 to 50." };
  const next = { ...getSettings(), examDate: exam || null, newPerDay: perDay };
  try {
    await saveSettings(next);
  } catch {
    return { error: "Couldn't save. Try again." };
  }
  refresh();
  return { ok: true };
}
