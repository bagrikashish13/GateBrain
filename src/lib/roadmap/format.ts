// The study roadmap: brain/roadmap.json (pure: no fs). Written by Claude Code / Antigravity; the
// format (AGENTS.md §2.6) is the contract. Blocks run in order, each a date range; the app shows where
// today falls on it.

import { daysBetween, isDay } from "@/lib/time";

export type Focus = { text: string; top: boolean };

export type Phase = {
  title: string;
  short: string;
  subject: string | null; // a key from subjects.json; null for revision blocks
  start: string; // YYYY-MM-DD, inclusive
  end: string; // inclusive
  marks: string | null; // "4–8"
  focus: Focus[];
  skip: string[];
  days: string[];
  note: string | null;
};

export type Roadmap = {
  done: string[];
  daily: { time: string; title: string }[];
  phases: Phase[];
  weightage: { subject: string; label: string | null; marks: string }[];
  cut: string[];
  keep: string | null;
};

export type Parsed = { ok: true; roadmap: Roadmap } | { ok: false; error: string };

const str = (v: unknown): v is string => typeof v === "string" && v.trim() !== "";
const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter(str) : []);
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

export function parseRoadmap(raw: unknown): Parsed {
  const r = obj(raw);
  if (!Array.isArray(r.phases) || r.phases.length === 0) return { ok: false, error: "no phases" };

  const phases: Phase[] = [];
  for (const [i, p] of r.phases.map(obj).entries()) {
    const at = `phase ${i + 1}`;
    if (!str(p.title)) return { ok: false, error: `${at}: no title` };
    if (!isDay(p.start) || !isDay(p.end)) return { ok: false, error: `${at}: start and end must be YYYY-MM-DD` };
    if (p.end < p.start) return { ok: false, error: `${at}: ends before it starts` };
    const prev = phases.at(-1);
    if (prev && p.start <= prev.end) return { ok: false, error: `${at}: overlaps the block before it` };
    phases.push({
      title: p.title.trim(),
      short: str(p.short) ? p.short.trim() : p.title.trim().slice(0, 4),
      subject: str(p.subject) ? p.subject : null,
      start: p.start,
      end: p.end,
      marks: str(p.marks) ? p.marks : null,
      focus: (Array.isArray(p.focus) ? p.focus : []).map(obj).filter((f) => str(f.text)).map((f) => ({ text: f.text as string, top: f.top === true })),
      skip: strings(p.skip),
      days: strings(p.days),
      note: str(p.note) ? p.note : null,
    });
  }

  return {
    ok: true,
    roadmap: {
      done: strings(r.done),
      daily: (Array.isArray(r.daily) ? r.daily : []).map(obj).filter((d) => str(d.title)).map((d) => ({ time: str(d.time) ? d.time : "", title: d.title as string })),
      phases,
      weightage: (Array.isArray(r.weightage) ? r.weightage : [])
        .map(obj)
        .filter((w) => str(w.subject) && str(w.marks))
        .map((w) => ({ subject: w.subject as string, label: str(w.label) ? w.label : null, marks: w.marks as string })),
      cut: strings(r.cut),
      keep: str(r.keep) ? r.keep : null,
    },
  };
}

/** Length of a block in days (both ends count). */
export const phaseDays = (p: Pick<Phase, "start" | "end">) => daysBetween(p.start, p.end) + 1;

export type Status = "done" | "now" | "next";

export type Position = {
  status: Status[]; // one per phase
  current: number | null; // index of the block today is in
  /** How far along the current block today is, 0–1 (the middle of today). 0 before the start, 1 after the end. */
  through: number;
  daysLeftInBlock: number | null; // today included
  elapsed: number; // days of the roadmap behind today
  total: number; // days from the first start to the last end
};

/** Where `today` falls on the roadmap. Days between two blocks count as the start of the next one. */
export function position(phases: Phase[], today: string): Position {
  const first = phases[0].start;
  const last = phases[phases.length - 1].end;
  const total = daysBetween(first, last) + 1;
  const elapsed = Math.min(total, Math.max(0, daysBetween(first, today)));
  const status: Status[] = phases.map((p) => (today > p.end ? "done" : today >= p.start ? "now" : "next"));
  const i = status.indexOf("now");
  if (i < 0) return { status, current: null, through: today > last ? 1 : 0, daysLeftInBlock: null, elapsed, total };
  const p = phases[i];
  return {
    status,
    current: i,
    through: (daysBetween(p.start, today) + 0.5) / phaseDays(p),
    daysLeftInBlock: daysBetween(today, p.end) + 1,
    elapsed,
    total,
  };
}

/** The top of a marks range ("13–16" → 16, "15" → 15), for sizing bars. */
export function marksTop(marks: string): number {
  const n = marks.match(/\d+(?:\.\d+)?/g);
  return n ? Math.max(...n.map(Number)) : 0;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "16–22 Oct", "23 Oct – 2 Nov", "20 Dec – 2 Jan". */
export function rangeLabel(start: string, end: string): string {
  const [, sm, sd] = start.split("-").map(Number);
  const [, em, ed] = end.split("-").map(Number);
  if (start === end) return `${sd} ${MONTHS[sm - 1]}`;
  return sm === em ? `${sd}–${ed} ${MONTHS[em - 1]}` : `${sd} ${MONTHS[sm - 1]} – ${ed} ${MONTHS[em - 1]}`;
}
