import "server-only";

import { commitFiles } from "@/lib/repo/git";
import { readBrainText } from "@/lib/repo/paths";
import { daysBetween, dayKey, isDay } from "@/lib/time";

// brain/settings.json: the few things he sets in the app, synced like everything else.
// revisionStart: notes added before this day count as added on it (a fresh start for revision).

export type Theme = "mint" | "pink";
export type Settings = { examDate: string | null; newPerDay: number; theme: Theme; revisionStart: string | null };
const DEFAULTS: Settings = { examDate: null, newPerDay: 6, theme: "mint", revisionStart: null };

export function getSettings(): Settings {
  try {
    const raw = JSON.parse(readBrainText("settings.json") ?? "{}") as Partial<Settings>;
    return {
      examDate: isDay(raw.examDate) ? raw.examDate : null,
      newPerDay: Number.isInteger(raw.newPerDay) && raw.newPerDay! > 0 && raw.newPerDay! <= 50 ? raw.newPerDay! : DEFAULTS.newPerDay,
      theme: raw.theme === "pink" ? "pink" : "mint",
      revisionStart: isDay(raw.revisionStart) ? raw.revisionStart : null,
    };
  } catch {
    return DEFAULTS;
  }
}

export async function saveSettings(next: Settings): Promise<void> {
  await commitFiles([{ path: "brain/settings.json", content: JSON.stringify(next, null, 2) }], "settings: update");
}

/** Days left to the exam (0 on the day), or null when no date is set or it has passed. */
export function daysToExam(s = getSettings(), now = new Date()): number | null {
  if (!s.examDate) return null;
  const n = daysBetween(dayKey(now), s.examDate);
  return n >= 0 ? n : null;
}
