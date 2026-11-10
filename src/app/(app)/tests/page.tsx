import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight, Play, TriangleAlert } from "lucide-react";
import { cn } from "cn";
import { Fold } from "@/components/fold";
import { SubjectMarker } from "@/components/subject-marker";
import { requireSession } from "@/lib/auth/session";
import { subjectMap, subjectOf } from "@/lib/brain/subjects";
import { dayMonth, dayTime, marks } from "@/lib/format";
import { syllabusTestIds } from "@/lib/syllabus/store";
import { allInProgress, listResults, listTests } from "@/lib/tests/store";
import { SyncButton } from "../sync-button";

export const metadata: Metadata = { title: "Tests · GateBrain" };

export default function TestsPage() {
  return (
    <main className="mx-auto grid w-full max-w-[430px] grid-cols-1 content-start gap-6 overflow-x-clip px-4 pt-5 pb-8 md:max-w-[720px] lg:max-w-[1120px] lg:px-8 lg:pt-8">
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

type Paper = ReturnType<typeof listTests>[number];

// The papers, by kind. A paper not taken yet is pulled out on top instead, so the list stays short.
const KINDS: { label: string; match: (id: string, syllabus: Set<string>) => boolean }[] = [
  { label: "Syllabus tests", match: (id, syllabus) => syllabus.has(id) },
  { label: "Full-length mocks", match: (id) => /^full-length/.test(id) },
  { label: "Daily mocks", match: (id) => /^daily-/.test(id) },
  { label: "General Aptitude", match: (id) => /^ga-/.test(id) },
  { label: "Subject mocks", match: () => true },
];
const RECENT = 5;

async function Tests() {
  await requireSession();
  const tests = listTests();
  const results = listResults();
  const running = new Map(allInProgress().map((p) => [p.test, p]));
  const subjects = subjectMap();
  const taken = new Set(results.map((r) => r.test));
  const syllabus = syllabusTestIds();
  const trend = [...results].reverse().slice(-12);

  const toTake = tests.filter((t) => running.has(t.id) || !taken.has(t.id));
  const done = tests.filter((t) => !toTake.includes(t));
  const groups = KINDS.map((k) => ({ label: k.label, papers: [] as Paper[] }));
  for (const t of done) groups[KINDS.findIndex((k) => k.match(t.id, syllabus))].papers.push(t);

  const paper = ({ id, parsed }: Paper) => {
    if (!parsed.ok) {
      return (
        <li key={id} className="border-b border-line last:border-b-0">
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
      <li key={id} className="border-b border-line last:border-b-0">
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
            <span className="flex flex-wrap items-center gap-2">
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
  };

  const attempt = (r: (typeof results)[number]) => {
    const s = r.summary;
    const p = s.max ? s.score / s.max : 0;
    return (
      <li key={`${r.test}/${r.attempt}`} className="border-b border-line last:border-b-0">
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
          {r.analysis ? <span className="size-1.5 flex-none rotate-45 bg-mint" title="Analysed" /> : <span className="size-1.5 flex-none rotate-45 bg-alert" title="Not analysed yet" />}
        </Link>
      </li>
    );
  };

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

      {trend.length > 0 && (
        <section aria-label="Scores" className="grid gap-2">
          <h2 className="label">Score, last {trend.length}</h2>
          {/* One column per attempt: the % on top, the bar in a full-height track (so 0% reads as empty,
              not missing), the day under it. A phone shows the last 8. */}
          <div className="flex items-end gap-1.5">
            {trend.map((r, i) => {
              const raw = r.summary.max ? r.summary.score / r.summary.max : 0;
              return (
                <Link
                  key={`${r.test}/${r.attempt}`}
                  href={`/tests/${r.test}/${r.attempt}`}
                  title={`${r.title}: ${marks(r.summary.score)}/${r.summary.max}`}
                  className={cn("group grid max-w-12 min-w-0 flex-1 justify-items-center gap-1", i < trend.length - 8 && "hidden md:grid")}
                >
                  <span className={cn("num text-[11.5px] leading-none font-semibold", raw < 0.4 ? "text-alert" : "text-fg")}>{Math.round(raw * 100)}%</span>
                  <span className="flex h-16 w-full items-end bg-raised">
                    <i className="block w-full bg-line-2 transition-colors group-hover:bg-fg" style={{ height: `${Math.max(0, raw) * 100}%` }} />
                  </span>
                  <span className="text-[10.5px] leading-none whitespace-nowrap text-faint">{dayMonth(new Date(r.submitted))}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <section aria-label="Papers" className="grid min-w-0 gap-2">
          <h2 className="label">Papers</h2>
          {tests.length ? (
            <div className="grid border-t border-line">
              {toTake.length > 0 && (
                <Fold
                  open
                  title={<span className="text-[15px] font-semibold">To take</span>}
                  meta={<span className="num flex-none text-[13px] font-semibold text-act">{toTake.length}</span>}
                >
                  <ul className="grid border-t border-line pl-[17px]">{toTake.map(paper)}</ul>
                </Fold>
              )}
              {groups
                .filter((g) => g.papers.length)
                .map((g) => (
                  <Fold key={g.label} title={<span className="text-[15px] font-semibold">{g.label}</span>} meta={<span className="num flex-none text-[13px] text-muted-foreground">{g.papers.length}</span>}>
                    <ul className="grid border-t border-line pl-[17px]">{g.papers.map(paper)}</ul>
                  </Fold>
                ))}
            </div>
          ) : (
            <p className="text-[13px] text-faint">No tests yet.</p>
          )}
        </section>

        <section aria-label="Attempts" className="grid min-w-0 gap-2">
          <h2 className="label">Attempts</h2>
          {results.length ? (
            <div className="grid">
              <ul className="grid border-t border-line">{results.slice(0, RECENT).map(attempt)}</ul>
              {results.length > RECENT && (
                <Fold
                  className="border-t border-line"
                  title={<span className="text-[14px] font-medium text-muted-foreground">Older attempts</span>}
                  meta={<span className="num flex-none text-[13px] text-faint">{results.length - RECENT}</span>}
                >
                  <ul className="grid border-t border-line">{results.slice(RECENT).map(attempt)}</ul>
                </Fold>
              )}
            </div>
          ) : (
            <p className="text-[13px] text-faint">No attempts yet.</p>
          )}
        </section>
      </div>
    </>
  );
}
