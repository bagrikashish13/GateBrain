import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Crosshair, Play } from "lucide-react";
import { cn } from "cn";
import { AllDone, Progress, RollingCount } from "@/components/progress";
import { SubjectMarker } from "@/components/subject-marker";
import { buttonVariants } from "@/components/ui/button";
import { requireSession } from "@/lib/auth/session";
import { folderHref, noteHref, prettyName, slugOf } from "@/lib/brain/names";
import { allNotes, sectionFolder } from "@/lib/brain/notes";
import { subjectMap, subjectOf } from "@/lib/brain/subjects";
import { agoShort, pct } from "@/lib/format";
import { RATING_LABEL } from "@/lib/revision/ratings";
import { todayRevision } from "@/lib/revision/store";
import { listResults } from "@/lib/tests/store";
import { topicStats, weakTopics } from "@/lib/tests/topics";
import { parseDay } from "@/lib/time";

export const metadata: Metadata = { title: "Revise · GateBrain" };

export default function RevisePage() {
  return (
    <main className="mx-auto grid w-full max-w-[430px] grid-cols-1 content-start gap-5 px-4 pt-5 pb-8">
      <Suspense
        fallback={
          <>
            <h1 className="display">Revise</h1>
            <p className="text-[13px] text-faint">Working out what&apos;s due…</p>
          </>
        }
      >
        <Revise />
      </Suspense>
    </main>
  );
}

async function Revise() {
  await requireSession();
  const now = new Date();
  const rev = await todayRevision(now);
  const subjects = subjectMap();
  const total = rev.due.length + rev.done.length;
  const notes = allNotes();
  const weak = weakTopics(topicStats(listResults()));
  const maxForecast = Math.max(1, ...rev.forecast.map((f) => f.count));

  return (
    <>
      <header className="grid gap-1.5">
        <h1 className="display">Revise</h1>
        <p className="text-[13px] text-muted-foreground">
          <span className="num font-semibold text-fg">{rev.tracked}</span> of <span className="num font-semibold text-fg">{rev.notes}</span> notes revised at least once
        </p>
      </header>

      <section aria-label="Today" className="cut grid gap-3 p-4 [--cut:14px]">
        <header className="flex items-center gap-2.5">
          <h2 className="font-display text-[19px] leading-none font-bold">Today</h2>
          {total > 0 && (
            <span className="num text-[13px] text-muted-foreground">
              <RollingCount value={rev.done.length} className="font-semibold text-fg" />/{total}
            </span>
          )}
          <span className="ml-auto">
            <AllDone show={total > 0 && rev.due.length === 0} />
          </span>
          {rev.due.length > 0 && (
            <Link href="/revise/session" className={buttonVariants({ size: "sm", className: "-my-1" })}>
              <Play aria-hidden className="fill-current" />
              Start
            </Link>
          )}
        </header>
        <Progress done={rev.done.length} total={total} label={`${rev.done.length} of ${total} revised today`} className="-mt-0.5" />
        {total === 0 ? (
          <p className="text-[13px] text-faint">{rev.notes ? "Nothing due today." : "No notes yet."}</p>
        ) : (
          <ul className="grid border-t border-line">
            {rev.due.map((i) => (
              <li key={i.note.id} className="border-b border-line">
                <Link href={noteHref(i.note.id)} className="grid gap-1 py-2.5 transition-colors hover:bg-raised/60">
                  <span className="flex items-center gap-2.5">
                    <SubjectMarker colour={subjectOf(i.note.subject, subjects).colour} />
                    <span className="min-w-0 flex-1 text-[14px] leading-snug">{i.note.title}</span>
                    {i.weak && <Crosshair className="size-[14px] flex-none stroke-[1.75] text-alert" aria-label="Weak topic" />}
                  </span>
                  <span className={cn("flex justify-between gap-2 pl-[17px] text-[12px]", i.overdue > 0 ? "text-alert" : "text-faint")}>
                    <span className="truncate">{i.note.section ? prettyName(i.note.section) : subjectOf(i.note.subject, subjects).short}</span>
                    <span className="flex-none">{i.last ? `Last ${agoShort(new Date(i.last), now)}${i.overdue ? ` · ${i.overdue}d overdue` : ""}` : "New"}</span>
                  </span>
                </Link>
              </li>
            ))}
            {rev.done.map((d) => (
              <li key={d.note.id} className="border-b border-line">
                <Link href={noteHref(d.note.id)} className="flex items-center gap-2.5 py-2.5 text-faint transition-colors hover:bg-raised/60">
                  <SubjectMarker colour={subjectOf(d.note.subject, subjects).colour} className="opacity-50" />
                  <span className="min-w-0 flex-1 text-[14px] leading-snug">{d.note.title}</span>
                  <span className={cn("flex-none text-[12px]", d.rating === "forgot" ? "text-alert" : d.rating === "fuzzy" ? "text-faint" : "text-mint")}>{RATING_LABEL[d.rating]}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {rev.later > 0 && <p className="-mt-1 text-[12px] text-faint">+{rev.later} new held for the next days</p>}
      </section>

      <section aria-label="Weak topics" className="grid gap-2">
        <h2 className="label flex items-center gap-1.5">
          <Crosshair className="size-[13px] stroke-[1.75] text-alert" aria-hidden />
          Weak topics from mocks
        </h2>
        {weak.length ? (
          <ul className="grid border-t border-line">
            {weak.map((t) => {
              const s = subjectOf(t.subject, subjects);
              const folder = t.topic ? sectionFolder(t.subject, t.topic) : null;
              const count = notes.filter((n) => n.subject === t.subject && n.section && slugOf(n.section) === t.topic).length;
              return (
                <li key={`${t.subject}/${t.topic}`} className="flex min-h-12 items-center gap-2.5 border-b border-line py-2">
                  <SubjectMarker colour={s.colour} />
                  <span className="grid min-w-0 flex-1 gap-0.5">
                    <span className="truncate text-[14px]">{prettyName(t.topic ?? "")}</span>
                    <span className="text-[12px] text-faint">
                      {s.short} · {t.correct}/{t.questions} right
                    </span>
                  </span>
                  <span className="num w-11 text-right text-[14px] font-semibold text-alert">{pct(t.strength)}</span>
                  {count > 0 ? (
                    <Link href={`/revise/session?topic=${encodeURIComponent(`${t.subject}/${t.topic}`)}`} className="flex h-8 flex-none items-center gap-1.5 border border-line-2 px-2.5 text-[12.5px] font-medium transition-colors hover:border-act">
                      <Play className="size-3 fill-current stroke-[1.75]" aria-hidden />
                      {count}
                    </Link>
                  ) : (
                    <Link href={folderHref(folder ? `${t.subject}/${folder}` : t.subject)} className="flex h-8 flex-none items-center px-2.5 text-[12.5px] text-faint hover:text-fg">
                      No notes
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-[13px] text-faint">None right now.</p>
        )}
      </section>

      <section aria-label="Next 7 days" className="grid gap-2">
        <h2 className="label">Next 7 days</h2>
        <div className="grid grid-cols-7 gap-1.5">
          {rev.forecast.map((f) => (
            <div key={f.day} className="grid gap-1 text-center">
              <div className="relative h-14 bg-raised">
                <i className="absolute inset-x-0 bottom-0 bg-line-2" style={{ height: `${(f.count / maxForecast) * 100}%` }} />
                <span className="num absolute inset-x-0 top-1 text-[12px] font-semibold">{f.count || ""}</span>
              </div>
              <span className="text-[11px] text-faint">{new Intl.DateTimeFormat("en-GB", { weekday: "narrow" }).format(parseDay(f.day))}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
