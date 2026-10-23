import { Suspense } from "react";
import { requireSession } from "@/lib/auth/session";
import { notesTree } from "@/lib/brain/notes";
import { subjects as allSubjects } from "@/lib/brain/subjects";
import { planDays } from "@/lib/plan/store";
import { todayRevision } from "@/lib/revision/store";
import { daysToExam, getSettings } from "@/lib/settings";
import { allInProgress, getTest, listResults, listTests } from "@/lib/tests/store";
import { addDays, dayKey } from "@/lib/time";
import { DayView } from "./_today/day-view";
import type { TodayData } from "./_today/types";

export default function TodayPage() {
  return (
    <main className="mx-auto grid w-full max-w-[430px] grid-cols-1 content-start gap-4 overflow-x-clip px-4 pt-4 pb-8 md:max-w-[720px] lg:max-w-[1120px] lg:px-8 lg:pt-8">
      <Suspense fallback={<p className="pt-6 text-[13px] text-faint">Loading your day…</p>}>
        <Today />
      </Suspense>
    </main>
  );
}

async function Today() {
  await requireSession();
  const now = new Date();
  const today = dayKey(now);
  const plans = Object.fromEntries(planDays());
  const rev = await todayRevision(now);
  const settings = getSettings();

  // Subjects he has notes folders for come first in the task form.
  const studied = new Set(notesTree().map((f) => f.name));
  const subjects = allSubjects()
    .map((s) => ({ key: s.key, short: s.short, colour: s.colour, studied: studied.has(s.key) }))
    .sort((a, b) => Number(b.studied) - Number(a.studied));

  // The date drums cover whole years: from 90 days back (or the first plan) to 180 days ahead (or
  // the last plan, or the exam).
  const planned = Object.keys(plans);
  const years = [
    addDays(now, -90).getFullYear(),
    addDays(now, 180).getFullYear(),
    ...planned.map((d) => Number(d.slice(0, 4))),
    ...(settings.examDate ? [Number(settings.examDate.slice(0, 4))] : []),
  ];
  const yearList = Array.from({ length: Math.max(...years) - Math.min(...years) + 1 }, (_, i) => Math.min(...years) + i);

  const results = listResults();
  const taken = new Set(results.map((r) => r.test));
  const fresh = listTests().find((t) => t.parsed.ok && !taken.has(t.id));
  const last = results[0];

  const data: TodayData = {
    today,
    years: yearList,
    plans,
    revision: {
      due: rev.due.map((i) => ({ id: i.note.id, title: i.note.title, subject: i.note.subject, overdue: i.overdue, weak: i.weak, fresh: !i.state })),
      done: rev.done.map((d) => ({ id: d.note.id, title: d.note.title, subject: d.note.subject, rating: d.rating })),
      later: rev.later,
      notes: rev.notes,
      history: rev.history,
      upcoming: rev.upcoming,
    },
    subjects,
    examDays: daysToExam(settings, now),
    examDate: settings.examDate,
    tests: {
      running: allInProgress().map((p) => ({ id: p.test, title: getTest(p.test)?.title ?? p.test, minutesLeft: Math.max(0, Math.ceil((p.deadline - now.getTime()) / 60_000)) })),
      next: fresh?.parsed.ok ? { id: fresh.id, title: fresh.parsed.test.title, questions: fresh.parsed.test.questions.length, duration: fresh.parsed.test.duration } : null,
      last: last ? { id: last.test, attempt: last.attempt, title: last.title, score: last.summary.score, max: last.summary.max } : null,
    },
  };

  return <DayView data={data} />;
}
