import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { ChevronRight, Crosshair, Play } from "lucide-react";
import { cn } from "cn";
import { AllDone, Progress, RollingCount } from "@/components/progress";
import { SubjectMarker } from "@/components/subject-marker";
import { buttonVariants } from "@/components/ui/button";
import { requireSession } from "@/lib/auth/session";
import { folderHref, noteHref, prettyName, slugOf } from "@/lib/brain/names";
import { allNotes, sectionFolder, type NoteRef } from "@/lib/brain/notes";
import { subjectMap, subjectOf } from "@/lib/brain/subjects";
import { agoShort, comingDay, pct } from "@/lib/format";
import { RATING_LABEL, type Rating4 } from "@/lib/revision/ratings";
import { todayRevision, type RevisionItem } from "@/lib/revision/store";
import { listResults } from "@/lib/tests/store";
import { topicStats, weakTopics } from "@/lib/tests/topics";
import { dayKey, parseDay } from "@/lib/time";

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
  const today = dayKey(now);
  const rev = await todayRevision(now);
  const subjects = subjectMap();
  const total = rev.due.length + rev.done.length;
  const notes = allNotes();
  const weak = weakTopics(topicStats(listResults()));
  const maxForecast = Math.max(1, ...rev.forecast.map((f) => f.count));
  const order = [...subjects.keys()];

  // Today, then everything after today, each split by subject (in subjects.json order).
  const todayGroups = bySubject(
    [...rev.due.map((i): Row => ({ kind: "due", item: i })), ...rev.done.map((d): Row => ({ kind: "done", note: d.note, rating: d.rating }))],
    (r) => (r.kind === "due" ? r.item.note.subject : r.note.subject),
    order,
  );
  const coming = rev.all.filter((i) => i.nextDay > today).sort((a, b) => a.nextDay.localeCompare(b.nextDay) || a.note.title.localeCompare(b.note.title));
  const comingGroups = bySubject(coming, (i) => i.note.subject, order);
  const tomorrow = rev.forecast[0]?.count ?? 0;

  return (
    <>
      <header className="grid gap-1.5">
        <h1 className="display">Revise</h1>
        <p className="text-[13px] text-muted-foreground">
          <span className="num font-semibold text-fg">{rev.notes}</span> notes · <span className="num font-semibold text-fg">{rev.due.length}</span> due today ·{" "}
          <span className="num font-semibold text-fg">{tomorrow}</span> tomorrow
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
          <div className="grid border-t border-line">
            {todayGroups.map((g) => {
              const s = subjectOf(g.subject, subjects);
              const left = g.rows.filter((r) => r.kind === "due").length;
              return (
                <SubjectGroup key={g.subject} name={s.name} colour={s.colour} open count={`${g.rows.length - left}/${g.rows.length}`} done={left === 0}>
                  {g.rows.map((r) =>
                    r.kind === "due" ? (
                      <NoteRow
                        key={r.item.note.id}
                        id={r.item.note.id}
                        title={r.item.note.title}
                        topic={r.item.note.section}
                        weak={r.item.weak}
                        right={r.item.last ? `Last ${agoShort(new Date(r.item.last), now)}${r.item.overdue ? ` · ${r.item.overdue}d overdue` : ""}` : "New"}
                        tone={r.item.overdue > 0 ? "alert" : "faint"}
                      />
                    ) : (
                      <NoteRow
                        key={r.note.id}
                        id={r.note.id}
                        title={r.note.title}
                        topic={r.note.section}
                        faded
                        right={RATING_LABEL[r.rating]}
                        tone={r.rating === "forgot" ? "alert" : r.rating === "fuzzy" ? "faint" : "mint"}
                      />
                    ),
                  )}
                </SubjectGroup>
              );
            })}
          </div>
        )}
        {rev.later > 0 && <p className="-mt-1 text-[12px] text-faint">+{rev.later} new held for the next days</p>}
      </section>

      <section aria-label="Coming up" className="grid gap-2">
        <h2 className="label">Coming up</h2>
        {comingGroups.length ? (
          <div className="grid border-t border-line">
            {comingGroups.map((g) => {
              const s = subjectOf(g.subject, subjects);
              return (
                <SubjectGroup key={g.subject} name={s.name} colour={s.colour} count={`${g.rows.length}`} hint={`next ${comingDay(g.rows[0].nextDay, now)}`}>
                  {g.rows.map((i) => (
                    <NoteRow key={i.note.id} id={i.note.id} title={i.note.title} topic={i.note.section} weak={i.weak} right={`${i.state ? "" : "New · "}${comingDay(i.nextDay, now)}`} />
                  ))}
                </SubjectGroup>
              );
            })}
          </div>
        ) : (
          <p className="text-[13px] text-faint">Nothing scheduled yet.</p>
        )}
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

type Row = { kind: "due"; item: RevisionItem } | { kind: "done"; note: NoteRef; rating: Rating4 };

/** Rows split by subject, subjects in subjects.json order (unknown ones last), rows kept in order. */
function bySubject<T>(rows: T[], key: (r: T) => string, order: string[]): { subject: string; rows: T[] }[] {
  const groups = new Map<string, T[]>();
  for (const r of rows) groups.set(key(r), [...(groups.get(key(r)) ?? []), r]);
  const rank = (k: string) => (order.includes(k) ? order.indexOf(k) : order.length);
  return [...groups].sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b)).map(([subject, rows]) => ({ subject, rows }));
}

/** One subject, open or folded (native details, so it works before the page is interactive). */
function SubjectGroup({ name, colour, count, hint, done, open, children }: { name: string; colour: string; count: string; hint?: string; done?: boolean; open?: boolean; children: ReactNode }) {
  return (
    <details open={open} className="group border-b border-line">
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2.5 py-2 transition-colors select-none hover:bg-raised/60 [&::-webkit-details-marker]:hidden">
        <SubjectMarker colour={colour} />
        <span className="min-w-0 flex-1 truncate text-[15px] font-semibold">{name}</span>
        {hint && <span className="flex-none text-[12px] text-faint">{hint}</span>}
        <span className={cn("num flex-none text-[13px] font-semibold", done ? "text-mint" : "text-muted-foreground")}>{count}</span>
        <ChevronRight className="size-4 flex-none stroke-[1.75] text-faint transition-transform group-open:rotate-90" aria-hidden />
      </summary>
      <ul className="grid border-t border-line pl-[17px]">{children}</ul>
    </details>
  );
}

function NoteRow({ id, title, topic, right, weak, faded, tone = "faint" }: { id: string; title: string; topic: string | null; right: string; weak?: boolean; faded?: boolean; tone?: "alert" | "faint" | "mint" }) {
  return (
    <li className="border-b border-line last:border-b-0">
      <Link href={noteHref(id)} className="grid gap-1 py-2.5 transition-colors hover:bg-raised/60">
        <span className="flex items-center gap-2">
          <span className={cn("min-w-0 flex-1 text-[14px] leading-snug", faded && "text-muted-foreground")}>{title}</span>
          {weak && <Crosshair className="size-[14px] flex-none stroke-[1.75] text-alert" aria-label="Weak topic" />}
        </span>
        <span className="flex justify-between gap-2 text-[12px] text-faint">
          <span className="truncate">{topic ? prettyName(topic) : ""}</span>
          <span className={cn("flex-none", tone === "alert" ? "text-alert" : tone === "mint" ? "text-mint" : "text-faint")}>{right}</span>
        </span>
      </Link>
    </li>
  );
}
