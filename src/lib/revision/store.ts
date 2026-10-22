import "server-only";

import { readdirSync } from "node:fs";
import { allNotes, type NoteRef } from "@/lib/brain/notes";
import { slugOf } from "@/lib/brain/names";
import { commitFiles, noteAddedDays } from "@/lib/repo/git";
import { brainPath, readBrainText } from "@/lib/repo/paths";
import { daysToExam, getSettings } from "@/lib/settings";
import { listResults } from "@/lib/tests/store";
import { topicStats, weakTopics } from "@/lib/tests/topics";
import { addDayKey, dayKey, daysBetween } from "@/lib/time";
import { planNew } from "./plan";
import { isRevisionState, maxGap, recallOf, review, type Rating4, type RevisionState } from "./schedule";

// Revision state: brain/_state/revision/<note path>.json, one per note, written by the app (committed
// and pushed). Every note is tracked from the day it was added: its first revision is the next day.
// New notes come in at most `newPerDay` a day; due notes are never capped. Notes added before
// settings.revisionStart count as added that day. Notes in topics his mocks show as weak go first.

export type RevisionItem = {
  note: NoteRef;
  state: RevisionState | null;
  dueDay: string; // YYYY-MM-DD: FSRS due day, or the first day a new note can come up
  nextDay: string; // the day it actually comes up (new notes under the daily cap; overdue = today)
  overdue: number; // days past due (0 = due today)
  recall: number | null;
  weak: boolean;
  last: string | null; // ISO of the last revision
};
export type TodayRevision = {
  due: RevisionItem[]; // to revise today, in order
  done: { note: NoteRef; rating: Rating4 }[]; // revised today
  later: number; // new notes held back by the daily cap
  tracked: number; // notes he has revised at least once
  notes: number; // all notes
  forecast: { day: string; count: number }[]; // the next 7 days
  history: Record<string, DayNote[]>; // day → notes revised that day (with how it went)
  upcoming: Record<string, DayNote[]>; // later day → notes due then, as things stand
  all: RevisionItem[]; // every note, with the day it next comes up
};
export type DayNote = { id: string; title: string; subject: string; rating: Rating4 | null };

const statePath = (noteId: string) => `_state/revision/${noteId.replace(/\.md$/i, "")}.json`;

export function readState(noteId: string): RevisionState | null {
  try {
    const v: unknown = JSON.parse(readBrainText(statePath(noteId)) ?? "null");
    return isRevisionState(v) ? v : null;
  } catch {
    return null;
  }
}

function allStates(): Map<string, RevisionState> {
  const out = new Map<string, RevisionState>();
  const walk = (rel: string) => {
    let entries;
    try {
      entries = readdirSync(brainPath(rel), { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.name.startsWith(".")) continue;
      if (e.isDirectory()) walk(`${rel}/${e.name}`);
      else if (e.name.endsWith(".json")) {
        try {
          const v: unknown = JSON.parse(readBrainText(`${rel}/${e.name}`) ?? "null");
          if (isRevisionState(v)) out.set(v.note, v);
        } catch {
          // a broken state file: treat the note as new
        }
      }
    }
  };
  walk("_state/revision");
  return out;
}

/** Topics his recent mocks show as weak, as "subject/topic" keys. */
export function weakKeys(): Set<string> {
  return new Set(weakTopics(topicStats(listResults())).map((t) => `${t.subject}/${t.topic}`));
}
const noteKey = (n: NoteRef) => (n.section ? `${n.subject}/${slugOf(n.section)}` : null);

export async function todayRevision(now = new Date()): Promise<TodayRevision> {
  const today = dayKey(now);
  const notes = allNotes();
  const states = allStates();
  const added = await noteAddedDays();
  const weak = weakKeys();
  const settings = getSettings();

  const items: RevisionItem[] = notes.map((note) => {
    const state = states.get(note.id) ?? null;
    let addedDay = added.get(`brain/notes/${note.id}`) ?? today;
    if (settings.revisionStart && addedDay < settings.revisionStart) addedDay = settings.revisionStart;
    const dueDay = state ? dayKey(new Date(state.card.due)) : addDayKey(addedDay, 1);
    const k = noteKey(note);
    return {
      note,
      state,
      dueDay,
      nextDay: dueDay,
      overdue: Math.max(0, daysBetween(dueDay, today)),
      recall: recallOf(state, now),
      weak: !!k && weak.has(k),
      last: state?.log.at(-1)?.at ?? null,
    };
  });

  const done = items
    .filter((i) => i.state?.log.some((l) => dayKey(new Date(l.at)) === today))
    .map((i) => ({ note: i.note, rating: [...i.state!.log].reverse().find((l) => dayKey(new Date(l.at)) === today)!.rating }));
  const doneIds = new Set(done.map((d) => d.note.id));
  const newDoneToday = items.filter((i) => i.state && dayKey(new Date(i.state.log[0].at)) === today).length;

  const order = (a: RevisionItem, b: RevisionItem) =>
    Number(b.weak) - Number(a.weak) || b.overdue - a.overdue || (a.recall ?? 1) - (b.recall ?? 1) || a.note.id.localeCompare(b.note.id, undefined, { numeric: true });

  // Revised notes come back on their FSRS day (overdue ones today). New notes are planned day by day
  // under the new-notes-a-day cap, so every future day shows what will really come up then.
  const fresh = items.filter((i) => !i.state).sort(order);
  const plan = planNew(
    fresh.map((i) => ({ id: i.note.id, from: i.dueDay })),
    today,
    settings.newPerDay,
    settings.newPerDay - newDoneToday,
  );
  for (const i of items) {
    if (i.state) i.nextDay = i.dueDay < today && !doneIds.has(i.note.id) ? today : i.dueDay;
    else i.nextDay = plan.get(i.note.id) ?? i.dueDay;
  }

  const reviews = items.filter((i) => i.state && !doneIds.has(i.note.id) && i.dueDay <= today).sort(order);
  const freshToday = fresh.filter((i) => i.nextDay === today);
  const later = fresh.filter((i) => i.dueDay <= today && i.nextDay > today).length;

  const forecast = Array.from({ length: 7 }, (_, n) => {
    const day = addDayKey(today, n + 1);
    return { day, count: items.filter((i) => i.nextDay === day).length };
  });

  const history: Record<string, DayNote[]> = {};
  for (const i of items) {
    for (const l of i.state?.log ?? []) {
      const d = dayKey(new Date(l.at));
      (history[d] ??= []).push({ id: i.note.id, title: i.note.title, subject: i.note.subject, rating: l.rating });
    }
  }
  const upcoming: Record<string, DayNote[]> = {};
  for (const i of [...items].sort(order)) {
    if (i.nextDay > today) (upcoming[i.nextDay] ??= []).push({ id: i.note.id, title: i.note.title, subject: i.note.subject, rating: null });
  }

  return {
    history,
    upcoming,
    due: [...reviews, ...freshToday],
    done,
    later,
    tracked: items.filter((i) => i.state).length,
    notes: notes.length,
    forecast,
    all: items,
  };
}

/** The day a note next comes up for revision (YYYY-MM-DD), as the Revise tab plans it. */
export async function nextRevisionDay(noteId: string, now = new Date()): Promise<string | null> {
  return (await todayRevision(now)).all.find((i) => i.note.id === noteId)?.nextDay ?? null;
}

/** Every note in one topic (subject + section slug), weakest memory first, for a focused session. */
export async function topicRevision(subject: string, topic: string, now = new Date()): Promise<RevisionItem[]> {
  const today = dayKey(now);
  const notes = allNotes().filter((n) => n.subject === subject && n.section && slugOf(n.section) === topic);
  return notes
    .map((note) => {
      const state = readState(note.id);
      const dueDay = state ? dayKey(new Date(state.card.due)) : today;
      return { note, state, dueDay, nextDay: dueDay, overdue: Math.max(0, daysBetween(dueDay, today)), recall: recallOf(state, now), weak: true, last: state?.log.at(-1)?.at ?? null };
    })
    .filter((i) => !i.state?.log.some((l) => dayKey(new Date(l.at)) === today))
    .sort((a, b) => (a.recall ?? 0) - (b.recall ?? 0));
}

/** Rate one note: the next FSRS step, committed as its state file (pushed right after). */
export async function rateNote(noteId: string, rating: Rating4, now = new Date()): Promise<RevisionState> {
  const next = review(readState(noteId), noteId, rating, now, maxGap(daysToExam()));
  await commitFiles([{ path: `brain/${statePath(noteId)}`, content: JSON.stringify(next, null, 2) }], `revise: ${noteId.replace(/\.md$/i, "")} (${rating})`);
  return next;
}
