import Link from "next/link";
import { Crosshair, Play } from "lucide-react";
import { cn } from "cn";
import { AllDone, Progress, RollingCount } from "@/components/progress";
import { SubjectMarker } from "@/components/subject-marker";
import { buttonVariants } from "@/components/ui/button";
import { noteHref } from "@/lib/brain/names";
import { RATING_LABEL } from "@/lib/revision/ratings";
import type { DayRev, SubjectChip, TodayData } from "./types";

/**
 * The selected day's revision. Past: what he revised and how it went. Today: done + due, with Start.
 * Later: what's due then, a forecast that moves as he revises.
 */
export function RevisionCard({ date, today, revision, subjects }: { date: string; today: string; revision: TodayData["revision"]; subjects: SubjectChip[] }) {
  const colour = (k: string) => subjects.find((s) => s.key === k)?.colour ?? null;
  const isToday = date === today;
  const doneList: DayRev[] = isToday ? revision.done : date < today ? (revision.history[date] ?? []) : [];
  const dueList = isToday ? revision.due : date > today ? (revision.upcoming[date] ?? []) : [];
  const total = isToday ? revision.due.length + revision.done.length : 0;

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

      {dueList.length + doneList.length > 0 ? (
        <ul className="grid border-t border-line">
          {dueList.slice(0, 8).map((r) => (
            <li key={r.id} className="border-b border-line">
              <Link href={noteHref(r.id)} className="flex items-center gap-2.5 py-2.5 transition-colors hover:bg-raised/60">
                <SubjectMarker colour={colour(r.subject)} />
                <span className="min-w-0 flex-1 text-[14px] leading-snug">{r.title}</span>
                {"weak" in r && r.weak && <Crosshair className="size-[14px] flex-none stroke-[1.75] text-alert" aria-label="Weak topic" />}
                {"overdue" in r && (r.fresh ? <span className="flex-none text-[12px] text-faint">new</span> : r.overdue > 0 && <span className="flex-none text-[12px] text-alert">{r.overdue}d late</span>)}
              </Link>
            </li>
          ))}
          {dueList.length > 8 && <li className="border-b border-line py-2 text-[12.5px] text-faint">+{dueList.length - 8} more</li>}
          {doneList.map((r, n) => (
            <li key={`${r.id}:${n}`} className="border-b border-line">
              <Link href={noteHref(r.id)} className="flex items-center gap-2.5 py-2.5 transition-colors hover:bg-raised/60">
                <SubjectMarker colour={colour(r.subject)} className="opacity-50" />
                <span className="min-w-0 flex-1 text-[14px] leading-snug text-muted-foreground">{r.title}</span>
                {r.rating && <span className={cn("flex-none text-[12px]", r.rating === "forgot" ? "text-alert" : r.rating === "fuzzy" ? "text-faint" : "text-mint")}>{RATING_LABEL[r.rating]}</span>}
              </Link>
            </li>
          ))}
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
