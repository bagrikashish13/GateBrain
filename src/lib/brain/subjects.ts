import "server-only";

import { readBrainText } from "@/lib/repo/paths";

// brain/subjects.json: every GATE CS subject the app knows (name, short name, colour). Read at
// runtime, so adding a subject is a content change, no redeploy. A subject only shows in Notes once
// it has a folder in brain/notes/.

export type Subject = { key: string; name: string; short: string; colour: string };

export function subjects(): Subject[] {
  const raw = readBrainText("subjects.json");
  if (!raw) return [];
  try {
    const list = (JSON.parse(raw) as { subjects?: Subject[] }).subjects ?? [];
    return list.filter((s) => s && typeof s.key === "string" && typeof s.name === "string");
  } catch {
    return [];
  }
}

export function subjectMap(): Map<string, Subject> {
  return new Map(subjects().map((s) => [s.key, s]));
}

/** A subject by key; unknown keys get a neutral stand-in so nothing breaks. */
export function subjectOf(key: string, map = subjectMap()): Subject {
  return map.get(key) ?? { key, name: key.replace(/[-_]+/g, " "), short: key.toUpperCase(), colour: "#5d6576" };
}
