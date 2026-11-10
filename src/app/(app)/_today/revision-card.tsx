"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Crosshair, Play } from "lucide-react";
import { cn } from "cn";
import { AllDone, Progress, RollingCount } from "@/components/progress";
import { SubjectMarker } from "@/components/subject-marker";
import { buttonVariants } from "@/components/ui/button";
import { noteHref } from "@/lib/brain/names";
import { RATING_LABEL } from "@/lib/revision/ratings";
import type { DayRev, DueRev, SubjectChip, TodayData } from "./types";

const SHOWN = 3;

/**
 * The selected day's revision. Past: what he revised and how it went. Today: done + due, with Start.
 * Later: what's due then, a forecast that moves as he revises. The first few rows show; the rest fold.
 */
export function RevisionCard({ date, today, revision, subjects }: { date: string; today: string; revision: TodayData["revision"]; subjects: SubjectChip[] }) {
  const [all, setAll] = useState(false);
  const colour = (k: string) => subjects.find((s) => s.key === k)?.colour ?? null;
  const isToday = date === today;
  const doneList: DayRev[] = isToday ? revision.done : date < today ? (revision.history[date] ?? []) : [];
  const dueList: (DueRev | DayRev)[] = isToday ? revision.due : date > today ? (revision.upcoming[date] ?? []) : [];
  const total = isToday ? revision.due.length + revision.done.length : 0;
  const rows = [...dueList.map((r) => ({ due: true as const, r })), ...doneList.map((r) => ({ due: false as const, r }))];
  const shown = all ? rows : rows.slice(0, SHOWN);

  return (
    <section aria-label="Revision" className="cut grid gap-3 p-4 [--cut:14px]">
      <header className="flex items-center gap-2.5">
        <h2 className="font-display text-[19px] leading-none font-bold">Revision</h2>
        {isToday && total > 0 && (
          <span className="num text-[13px] text-muted-foreground">
            <RollingCount value={revision.done.length} className="font-semibold text-fg" />/{total}
          </span>
        )}
        {isToday && (
          <span className="ml-auto">
            <AllDone show={total > 0 && revision.due.length === 0} />
          </span>
        )}
        {isToday && revision.due.length > 0 && (
          <Link href="/revise/session" className={buttonVariants({ size: "sm", className: "-my-1" })}>
            <Play aria-hidden className="fill-current" />
            Start
          </Link>
        )}
      </header>
      {isToday && <Progress done={revision.done.length} total={total} label={`${revision.done.length} of ${total} revised today`} className="-mt-0.5" />}

      {rows.length > 0 ? (
        <ul className="grid border-t border-line">
          {shown.map(({ due, r }, n) =>
            due ? (
              <li key={`due:${r.id}`} className="border-b border-line">
                <Link href={noteHref(r.id)} className="flex items-center gap-2.5 py-2.5 transition-colors hover:bg-raised/60">
                  <SubjectMarker colour={colour(r.subject)} />
                  <span className="min-w-0 flex-1 text-[14px] leading-snug">{r.title}</span>
                  {"weak" in r && r.weak && <Crosshair className="size-[14px] flex-none stroke-[1.75] text-alert" aria-label="Weak topic" />}
                  {"fresh" in r && r.fresh && <span className="flex-none text-[12px] text-faint">new</span>}
                </Link>
              </li>
            ) : (
              <li key={`done:${r.id}:${n}`} className="border-b border-line">
                <Link href={noteHref(r.id)} className="flex items-center gap-2.5 py-2.5 transition-colors hover:bg-raised/60">
                  <SubjectMarker colour={colour(r.subject)} className="opacity-50" />
                  <span className="min-w-0 flex-1 text-[14px] leading-snug text-muted-foreground">{r.title}</span>
                  {"rating" in r && r.rating && (
                    <span className={cn("flex-none text-[12px]", r.rating === "forgot" ? "text-alert" : r.rating === "fuzzy" ? "text-faint" : "text-mint")}>{RATING_LABEL[r.rating]}</span>
                  )}
                </Link>
              </li>
            ),
          )}
          {rows.length > SHOWN && (
            <li>
              <button
                type="button"
                onClick={() => setAll((x) => !x)}
                aria-expanded={all}
                className="flex min-h-11 w-full items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-fg"
              >
                {all ? "Show fewer" : `Show all ${rows.length}`}
                <ChevronDown className={cn("size-4 stroke-[1.75] text-faint transition-transform", all && "rotate-180")} aria-hidden />
              </button>
            </li>
          )}
        </ul>
      ) : (
        <p className="text-[13px] text-faint">
          {revision.notes === 0 && isToday ? "No notes yet." : date < today ? "Nothing revised that day." : isToday ? "Nothing to revise today." : "Nothing due that day."}
        </p>
      )}
      {isToday && revision.later > 0 && <p className="-mt-1 text-[12px] text-faint">+{revision.later} new held for the next days</p>}
    </section>
  );
}
