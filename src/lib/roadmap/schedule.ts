import "server-only";

import { getRoadmap } from "./store";
import { parseTaskText, type Task } from "@/lib/plan/tasks";
import type { PhaseDay } from "./format";

/** Map of YYYY-MM-DD to PhaseDay from brain/roadmap.json */
export function getRoadmapDays(): Map<string, PhaseDay> {
  const out = new Map<string, PhaseDay>();
  const parsed = getRoadmap();
  if (!parsed || !parsed.ok) return out;
  for (const phase of parsed.roadmap.phases) {
    for (const day of phase.days) {
      if (day.date) {
        out.set(day.date, day);
      }
    }
  }
  return out;
}

/** Get tasks scheduled in the roadmap for a specific day. */
export function getRoadmapTasksForDay(day: string): Task[] {
  const days = getRoadmapDays();
  const phaseDay = days.get(day);
  if (!phaseDay || !phaseDay.tasks) return [];
  return phaseDay.tasks.map((text) => ({
    text,
    done: false,
    moved: null,
    ...parseTaskText(text),
  }));
}

/** Get all roadmap scheduled tasks mapped by YYYY-MM-DD. */
export function getAllRoadmapTasks(): Map<string, Task[]> {
  const out = new Map<string, Task[]>();
  const days = getRoadmapDays();
  for (const [date, phaseDay] of days) {
    if (phaseDay.tasks && phaseDay.tasks.length > 0) {
      const tasks = phaseDay.tasks.map((text) => ({
        text,
        done: false,
        moved: null,
        ...parseTaskText(text),
      }));
      out.set(date, tasks);
    }
  }
  return out;
}
