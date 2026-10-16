import "server-only";

import { readBrainText } from "@/lib/repo/paths";
import { parseRoadmap, type Parsed } from "./format";

/** brain/roadmap.json, parsed. Missing → null; broken → the reason, so the page can say so. */
export function getRoadmap(): Parsed | null {
  const raw = readBrainText("roadmap.json");
  if (raw === null) return null;
  try {
    return parseRoadmap(JSON.parse(raw));
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "not valid JSON" };
  }
}
