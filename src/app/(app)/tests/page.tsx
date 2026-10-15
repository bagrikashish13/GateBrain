import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight, Crosshair, Play, TriangleAlert } from "lucide-react";
import { cn } from "cn";
import { SubjectMarker } from "@/components/subject-marker";
import { requireSession } from "@/lib/auth/session";
import { prettyName } from "@/lib/brain/names";
import { subjectMap, subjectOf } from "@/lib/brain/subjects";
import { dayTime, marks, pct } from "@/lib/format";
import { allInProgress, listResults, listTests } from "@/lib/tests/store";
import { topicStats, weakTopics } from "@/lib/tests/topics";
import { SyncButton } from "../sync-button";

export const metadata: Metadata = { title: "Tests · GateBrain" };

export default function TestsPage() {
  return (
    <main className="mx-auto grid w-full max-w-[430px] grid-cols-1 content-start gap-6 px-4 pt-5 pb-8">
      <Suspense
        fallback={
          <>
            <h1 className="display">Tests</h1>
            <p className="text-[13px] text-faint">Loading tests…</p>
          </>
        }
      >
        <Tests />
      </Suspense>
    </main>
  );
}

async function Tests() {
  await requireSession();
  const tests = listTests();
  const results = listResults();
  const running = new Map(allInProgress().map((p) => [p.test, p]));
  const subjects = subjectMap();
  const taken = new Set(results.map((r) => r.test));
  const weak = weakTopics(topicStats(results)).slice(0, 6);
  const trend = [...results].reverse().slice(-12);

  return (
    <>
      <header className="flex items-start justify-between gap-3">
        <div className="grid gap-1.5">
          <h1 className="display">Tests</h1>
          <p className="text-[13px] text-muted-foreground">
            <span className="num font-semibold text-fg">{tests.length}</span> {tests.length === 1 ? "test" : "tests"},{" "}
            <span className="num font-semibold text-fg">{results.length}</span> {results.length === 1 ? "attempt" : "attempts"}
          </p>
        </div>
        <div className="-mt-1 -mr-2 flex items-center">
          <SyncButton />
        </div>
      </header>

      {trend.length > 1 && (
        <section aria-label="Scores" className="grid gap-2">
          <h2 className="label">Score %, last {trend.length}</h2>
          <div className="flex h-20 items-end gap-1 border-b border-line-2">
            {trend.map((r) => {
              const p = r.summary.max ? Math.max(0, r.summary.score / r.summary.max) : 0;
              return (
                <Link key={`${r.test}/${r.attempt}`} href={`/tests/${r.test}/${r.attempt}`} title={`${r.title}: ${Math.round(p * 100)}%`} className="group relative flex h-full flex-1 items-end">
                  <i className="block w-full bg-line-2 transition-colors group-hover:bg-fg" style={{ height: `${Math.max(3, p * 100)}%` }} />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section aria-label="Papers" className="grid gap-2">
        <h2 className="label">Papers</h2>
        {tests.length ? (
          <ul className="grid border-t border-line">
            {tests.map(({ id, parsed }) => {
              if (!parsed.ok) {
                return (
                  <li key={id} className="border-b border-line">
                    <Link href={`/tests/${id}`} className="flex min-h-14 items-center gap-2.5 py-2.5">
                      <TriangleAlert className="size-4 flex-none stroke-[1.75] text-alert" aria-hidden />
                      <span className="grid min-w-0 flex-1 gap-0.5">
                        <span className="truncate text-[14.5px]">{parsed.title ?? id}</span>
                        <span className="text-[12px] text-alert">
                          {parsed.errors.length} {parsed.errors.length === 1 ? "problem" : "problems"} in the file
                        </span>
                      </span>
                      <ChevronRight className="size-4 flex-none stroke-[1.75] text-faint" aria-hidden />
                    </Link>
                  </li>
                );
              }
              const t = parsed.test;
              const keys = [...new Set(t.questions.map((q) => q.subject))];
              const live = running.get(id);
              return (
                <li key={id} className="border-b border-line">
                  <Link href={`/tests/${id}`} className="grid gap-1.5 py-3 transition-colors hover:bg-raised/60">
                    <span className="flex items-center gap-2.5">
                      <span className="min-w-0 flex-1 text-[15px] leading-snug font-medium">{t.title}</span>
                      {live ? (
                        <span className="flex flex-none items-center gap-1 text-[12px] font-semibold text-mint">
                          <Play className="size-3 fill-current" aria-hidden />
                          In progress
                        </span>
                      ) : (
                        !taken.has(id) && <span className="flex-none text-[12px] font-semibold text-act">New</span>
                      )}
                      <ChevronRight className="size-4 flex-none stroke-[1.75] text-faint" aria-hidden />
                    </span>
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-faint">
                      <span>
                        <span className="num text-muted-foreground">{t.questions.length}</span> Qs · <span className="num text-muted-foreground">{t.totalMarks}</span> marks ·{" "}
                        <span className="num text-muted-foreground">{t.duration}</span> min
                      </span>
                      <span className="flex items-center gap-2">
                        {keys.map((k) => (
                          <span key={k} className="flex items-center gap-1">
                            <SubjectMarker colour={subjectOf(k, subjects).colour} />
                            {subjectOf(k, subjects).short}
                          </span>
                        ))}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-[13px] text-faint">No tests yet.</p>
        )}
      </section>

      {weak.length > 0 && (
        <section aria-label="Weak topics" className="grid gap-2">
          <h2 className="label flex items-center gap-1.5">
            <Crosshair className="size-[13px] stroke-[1.75] text-alert" aria-hidden />
            Weak topics
          </h2>
          <ul className="grid border-t border-line">
            {weak.map((t) => (
              <li key={`${t.subject}/${t.topic}`} className="flex min-h-11 items-center gap-2.5 border-b border-line">
                <SubjectMarker colour={subjectOf(t.subject, subjects).colour} />
                <span className="min-w-0 flex-1 truncate text-[14px]">{prettyName(t.topic ?? "")}</span>
                <span className="text-[12px] text-faint">
                  {t.correct}/{t.questions}
                </span>
                <span className="num w-11 text-right text-[14px] font-semibold text-alert">{pct(t.strength)}</span>
              </li>
            ))}
          </ul>
          <Link href="/revise" className="text-[12.5px] text-muted-foreground hover:text-fg">
            Revise them →
          </Link>
        </section>
      )}

      <section aria-label="Attempts" className="grid gap-2">
        <h2 className="label">Attempts</h2>
        {results.length ? (
          <ul className="grid border-t border-line">
            {results.map((r) => {
              const s = r.summary;
              const p = s.max ? s.score / s.max : 0;
              return (
                <li key={`${r.test}/${r.attempt}`} className="border-b border-line">
                  <Link href={`/tests/${r.test}/${r.attempt}`} className="flex min-h-14 items-center gap-3 py-2.5 transition-colors hover:bg-raised/60">
                    <span className="grid min-w-0 flex-1 gap-0.5">
                      <span className="truncate text-[14px]">{r.title}</span>
                      <span className="text-[12px] text-faint">
                        {dayTime(new Date(r.submitted))} · {s.correct}✓ {s.wrong}✗ {s.unattempted} skipped
                      </span>
                    </span>
                    <span className="grid flex-none justify-items-end">
                      <span className="num text-[16px] font-semibold">
                        {marks(s.score)}
                        <span className="text-[12px] text-faint">/{s.max}</span>
                      </span>
                      <span className={cn("num text-[12px]", p < 0.4 ? "text-alert" : "text-muted-foreground")}>{Math.round(p * 100)}%</span>
                    </span>
                    {r.analysis && <span className="size-1.5 flex-none rotate-45 bg-mint" title="Analysed" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-[13px] text-faint">No attempts yet.</p>
        )}
      </section>
    </>
  );
}
