import "katex/dist/katex.min.css";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Check, ChevronDown, Crosshair, Flag, Minus, NotebookPen, X } from "lucide-react";
import { cn } from "cn";
import { BackLink } from "@/components/back-link";
import { MarkdownView } from "@/components/markdown";
import { SubjectMarker } from "@/components/subject-marker";
import { requireSession } from "@/lib/auth/session";
import { folderHref, prettyName } from "@/lib/brain/names";
import { sectionFolder } from "@/lib/brain/notes";
import { subjectMap, subjectOf } from "@/lib/brain/subjects";
import { dayTime, marks, pct } from "@/lib/format";
import { msqKeys, type Outcome, type Tally } from "@/lib/tests/grade";
import { duration } from "@/lib/tests/result";
import { getResult, getTest } from "@/lib/tests/store";

export const metadata: Metadata = { title: "Result · GateBrain" };

export default function ResultPage({ params }: PageProps<"/tests/[id]/[attempt]">) {
  return (
    <main className="mx-auto grid w-full max-w-[680px] grid-cols-1 content-start gap-6 px-4 pt-3 pb-10">
      <Suspense fallback={<p className="pt-8 text-[13px] text-faint">Marking…</p>}>
        <ResultView params={params} />
      </Suspense>
    </main>
  );
}

const OUTCOME: Record<Outcome, { label: string; className: string; icon: typeof Check }> = {
  correct: { label: "Correct", className: "text-mint", icon: Check },
  wrong: { label: "Wrong", className: "text-alert", icon: X },
  unattempted: { label: "Skipped", className: "text-faint", icon: Minus },
};

async function ResultView({ params }: { params: Promise<{ id: string; attempt: string }> }) {
  const { id, attempt } = await params;
  await requireSession();
  const r = getResult(id, attempt);
  if (!r) notFound();
  const test = getTest(id);
  const subjects = subjectMap();
  const s = r.summary;
  const p = s.max ? s.score / s.max : 0;
  const maxTime = Math.max(1, ...r.questions.map((q) => q.timeSec));
  const avg = (o: Outcome) => {
    const qs = r.questions.filter((q) => q.outcome === o);
    return qs.length ? duration(qs.reduce((a, q) => a + q.timeSec, 0) / qs.length) : "—";
  };
  const topics = [...s.byTopic].sort((a, b) => a.correct / a.questions - b.correct / b.questions || b.wrong - a.wrong);

  return (
    <>
      <div className="grid gap-1">
        <BackLink fallback="/tests" label="Tests" />
        <h1 className="display text-[28px] break-words">{r.title}</h1>
        <p className="text-[12.5px] text-faint">
          {dayTime(new Date(r.submitted))}
          {r.autoSubmitted && " · time ran out"}
        </p>
      </div>

      <section aria-label="Score" className="cut grid gap-4 p-4 [--cut:14px]">
        <div className="flex items-end justify-between gap-3">
          <span className="num text-[44px] leading-[0.9] font-bold">
            {marks(s.score)}
            <span className="text-[20px] text-faint"> / {s.max}</span>
          </span>
          <span className={cn("num text-[22px] font-semibold", p < 0.4 ? "text-alert" : "text-fg")}>{Math.round(p * 100)}%</span>
        </div>
        <Bar t={s} />
        <dl className="grid grid-cols-3 gap-y-3 border-t border-line pt-3">
          {[
            { label: "correct", value: String(s.correct), className: "text-mint" },
            { label: "wrong", value: String(s.wrong), className: s.wrong ? "text-alert" : "" },
            { label: "skipped", value: String(s.unattempted) },
            { label: "accuracy", value: pct(s.accuracy) },
            { label: "lost to negatives", value: s.negative ? `−${marks(s.negative)}` : "0", className: s.negative ? "text-alert" : "" },
            { label: `time of ${r.durationMin}m`, value: duration(r.timeUsedSec) },
          ].map((c) => (
            <div key={c.label} className="grid gap-0.5">
              <dt className="row-start-2 text-[11px] text-faint">{c.label}</dt>
              <dd className={cn("num row-start-1 text-[18px] leading-tight font-semibold", c.className)}>{c.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {r.analysis && (
        <section aria-label="Analysis" className="grid gap-2">
          <h2 className="label flex items-center gap-1.5">
            <NotebookPen className="size-[13px] stroke-[1.75] text-mint" aria-hidden />
            Analysis
          </h2>
          <div className="border-l-2 border-mint pl-3.5">
            <MarkdownView source={r.analysis} base={`results/${id}/${attempt}.md`} />
          </div>
        </section>
      )}

      <section aria-label="By subject" className="grid gap-2">
        <h2 className="label">By subject</h2>
        <ul className="grid border-t border-line">
          {s.bySubject.map((t) => {
            const sub = subjectOf(t.subject, subjects);
            return (
              <li key={t.subject} className="grid gap-2 border-b border-line py-2.5">
                <span className="flex items-center gap-2.5">
                  <SubjectMarker colour={sub.colour} />
                  <span className="min-w-0 flex-1 truncate text-[14px]">{sub.name}</span>
                  <span className="text-[12px] text-faint">{duration(t.timeSec)}</span>
                  <span className="num w-20 text-right text-[14px] font-semibold">
                    {marks(t.score)}
                    <span className="text-[12px] text-faint">/{t.max}</span>
                  </span>
                </span>
                <Bar t={t} className="ml-[17px]" />
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-label="By topic" className="grid gap-2">
        <h2 className="label">By topic, weakest first</h2>
        <ul className="grid border-t border-line">
          {topics.map((t) => {
            const sub = subjectOf(t.subject, subjects);
            const folder = t.topic ? sectionFolder(t.subject, t.topic) : null;
            const strength = t.correct / t.questions;
            return (
              <li key={`${t.subject}/${t.topic}`} className="flex min-h-12 items-center gap-2.5 border-b border-line py-2">
                <SubjectMarker colour={sub.colour} />
                <span className="grid min-w-0 flex-1 gap-0.5">
                  <span className="truncate text-[14px]">{t.topic ? prettyName(t.topic) : "No topic"}</span>
                  <span className="text-[12px] text-faint">
                    {sub.short} · {t.correct}✓ {t.wrong}✗ {t.unattempted} skipped
                  </span>
                </span>
                {folder && (
                  <Link href={folderHref(`${t.subject}/${folder}`)} aria-label="Notes" className="grid size-9 flex-none place-items-center text-faint hover:text-fg">
                    <NotebookPen className="size-4 stroke-[1.6]" aria-hidden />
                  </Link>
                )}
                <span className={cn("num w-11 text-right text-[14px] font-semibold", strength < 0.6 ? "text-alert" : "text-fg")}>{pct(strength)}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-label="Time per question" className="grid gap-2">
        <h2 className="label">Time per question</h2>
        <div className="flex h-24 items-end gap-[2px] border-b border-line-2">
          {r.questions.map((q) => (
            <a key={q.n} href={`#q${q.n}`} title={`Q${q.n}: ${duration(q.timeSec)} (${OUTCOME[q.outcome].label.toLowerCase()})`} className="flex h-full min-w-[3px] flex-1 items-end">
              <i className={cn("block w-full", q.outcome === "correct" ? "bg-mint" : q.outcome === "wrong" ? "bg-alert" : "bg-line-2")} style={{ height: `${Math.max(2, (q.timeSec / maxTime) * 100)}%` }} />
            </a>
          ))}
        </div>
        <p className="text-[12px] text-faint">
          Average: correct {avg("correct")} · wrong {avg("wrong")} · skipped {avg("unattempted")}
        </p>
      </section>

      <section aria-label="Questions" className="grid gap-2">
        <h2 className="label">Questions</h2>
        <ul className="grid border-t border-line">
          {r.questions.map((rq, i) => {
            const q = test?.questions[i];
            const o = OUTCOME[rq.outcome];
            const picked = new Set(rq.response ? (rq.type === "MSQ" ? msqKeys(rq.response) : [rq.response.toUpperCase()]) : []);
            const right = new Set(rq.type === "NAT" ? [] : rq.answer.split(/[,\s]+/).filter(Boolean));
            return (
              <li key={rq.n} id={`q${rq.n}`} className="scroll-mt-4 border-b border-line">
                <details className="group">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2.5 py-2 [&::-webkit-details-marker]:hidden">
                    <o.icon className={cn("size-4 flex-none stroke-[2.25]", o.className)} aria-label={o.label} />
                    <span className="num w-8 flex-none text-[13px] font-semibold">Q{rq.n}</span>
                    <span className="grid min-w-0 flex-1 gap-0.5">
                      <span className="flex items-center gap-1.5 truncate text-[13px]">
                        <SubjectMarker colour={subjectOf(rq.subject, subjects).colour} />
                        {subjectOf(rq.subject, subjects).short}
                        {rq.topic && <span className="truncate text-muted-foreground">· {prettyName(rq.topic)}</span>}
                        {rq.marked && <Flag className="size-3 flex-none stroke-[2] text-faint" aria-label="Marked for review" />}
                      </span>
                      <span className="text-[12px] text-faint">
                        {rq.type} · yours {rq.response ?? "—"} · answer {rq.answer} · {duration(rq.timeSec)}
                      </span>
                    </span>
                    <span className={cn("num w-12 flex-none text-right text-[13.5px] font-semibold", rq.awarded > 0 ? "text-mint" : rq.awarded < 0 ? "text-alert" : "text-faint")}>
                      {rq.awarded > 0 ? "+" : ""}
                      {marks(rq.awarded)}
                    </span>
                    <ChevronDown className="size-4 flex-none stroke-[1.75] text-faint transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  <div className="grid gap-3 pb-4 pl-[26px]">
                    {q ? (
                      <>
                        <MarkdownView source={q.text} base={`tests/${id}.md`} />
                        {q.options.length > 0 && (
                          <ul className="grid gap-1.5">
                            {q.options.map((opt) => (
                              <li
                                key={opt.key}
                                className={cn(
                                  "flex items-start gap-2.5 border px-2.5 py-2",
                                  right.has(opt.key) ? "border-mint/70" : picked.has(opt.key) ? "border-alert/60" : "border-line",
                                )}
                              >
                                <span className={cn("w-4 flex-none font-semibold", right.has(opt.key) ? "text-mint" : picked.has(opt.key) ? "text-alert" : "text-faint")}>{opt.key}</span>
                                <MarkdownView source={opt.text} base={`tests/${id}.md`} className="min-w-0 flex-1 [&>p]:inline" />
                              </li>
                            ))}
                          </ul>
                        )}
                        {q.solution && (
                          <div className="grid gap-1.5 border-t border-line pt-3">
                            <span className="label">Solution</span>
                            <MarkdownView source={q.solution} base={`tests/${id}.md`} />
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-[13px] text-faint">The test file isn&apos;t there any more.</p>
                    )}
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="flex items-start gap-1.5 text-[12px] text-faint">
        <Crosshair className="mt-px size-3.5 flex-none stroke-[1.75]" aria-hidden />
        brain/results/{id}/{attempt}.md
      </p>
    </>
  );
}

/** Correct (mint) · wrong (rose) · skipped (grey), as one bar. */
function Bar({ t, className }: { t: Tally; className?: string }) {
  if (!t.questions) return null;
  const w = (n: number) => `${(n / t.questions) * 100}%`;
  return (
    <div className={cn("flex h-[5px] gap-[2px]", className)} role="img" aria-label={`${t.correct} correct, ${t.wrong} wrong, ${t.unattempted} skipped`}>
      {t.correct > 0 && <i className="bg-mint" style={{ width: w(t.correct) }} />}
      {t.wrong > 0 && <i className="bg-alert" style={{ width: w(t.wrong) }} />}
      {t.unattempted > 0 && <i className="bg-line-2" style={{ width: w(t.unattempted) }} />}
    </div>
  );
}
