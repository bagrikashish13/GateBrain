import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronRight, Play, RotateCcw, TriangleAlert } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { SubjectMarker } from "@/components/subject-marker";
import { Button } from "@/components/ui/button";
import { requireSession } from "@/lib/auth/session";
import { prettyName } from "@/lib/brain/names";
import { subjectMap, subjectOf } from "@/lib/brain/subjects";
import { dayTime, marks } from "@/lib/format";
import { parseTest, sectionsOf, TEST_ID } from "@/lib/tests/format";
import { getInProgress, listResults } from "@/lib/tests/store";
import { readBrainText } from "@/lib/repo/paths";
import { discardTestAction, startTestAction } from "../actions";

export const metadata: Metadata = { title: "Test · GateBrain" };

export default function TestPage({ params }: PageProps<"/tests/[id]">) {
  return (
    <main className="mx-auto grid w-full max-w-[430px] grid-cols-1 content-start gap-5 px-4 pt-3 pb-8 md:max-w-[680px] lg:px-8 lg:pt-6">
      <Suspense fallback={<p className="pt-8 text-[13px] text-faint">Opening…</p>}>
        <TestView params={params} />
      </Suspense>
    </main>
  );
}

async function TestView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireSession();
  const raw = TEST_ID.test(id) ? readBrainText(`tests/${id}.md`) : null;
  if (raw === null) notFound();
  const parsed = parseTest(id, raw);

  if (!parsed.ok) {
    return (
      <>
        <BackLink fallback="/tests" label="Tests" />
        <h1 className="display text-[28px] break-words">{parsed.title ?? id}</h1>
        <section className="grid gap-2 border-y border-alert/40 py-3">
          <h2 className="flex items-center gap-1.5 text-[13px] font-semibold text-alert">
            <TriangleAlert className="size-4 stroke-[1.75]" aria-hidden />
            brain/tests/{id}.md can&apos;t be used yet
          </h2>
          <ul className="grid gap-1.5 text-[13px] text-muted-foreground">
            {parsed.errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </section>
      </>
    );
  }

  const t = parsed.test;
  const subjects = subjectMap();
  const live = getInProgress(id);
  const attempts = listResults().filter((r) => r.test === id);
  const bySubject = [...new Set(t.questions.map((q) => q.subject))].map((k) => ({ k, n: t.questions.filter((q) => q.subject === k).length }));
  const types = (["MCQ", "MSQ", "NAT"] as const).map((ty) => ({ ty, qs: t.questions.filter((q) => q.type === ty) })).filter((x) => x.qs.length);
  const leftMin = live ? Math.max(0, Math.ceil((live.deadline - new Date().getTime()) / 60_000)) : null;

  return (
    <>
      <BackLink fallback="/tests" label="Tests" />
      <header className="grid gap-3">
        <h1 className="display text-[30px] break-words">{t.title}</h1>
        {t.description && <p className="text-[14px] text-muted-foreground">{t.description}</p>}
        <dl className="grid grid-cols-3 border-y border-line">
          {[
            { label: "questions", value: t.questions.length },
            { label: "marks", value: t.totalMarks },
            { label: "minutes", value: t.duration },
          ].map((c, i) => (
            <div key={c.label} className={`grid gap-0.5 py-2.5 ${i ? "border-l border-line pl-3" : ""}`}>
              <dt className="row-start-2 text-[11px] text-faint">{c.label}</dt>
              <dd className="num row-start-1 text-[20px] leading-tight font-semibold">{c.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="grid gap-2" aria-label="What's in it">
        <h2 className="label">Subjects</h2>
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13.5px]">
          {bySubject.map(({ k, n }) => (
            <li key={k} className="flex items-center gap-1.5">
              <SubjectMarker colour={subjectOf(k, subjects).colour} />
              {subjectOf(k, subjects).name}
              <span className="num text-faint">{n}</span>
            </li>
          ))}
        </ul>
        {sectionsOf(t).length > 1 && <p className="text-[12.5px] text-faint">Sections: {sectionsOf(t).join(" · ")}</p>}
      </section>

      <section className="grid gap-2" aria-label="Marking">
        <h2 className="label">Marking</h2>
        <ul className="grid border-t border-line text-[13px]">
          {types.map(({ ty, qs }) => {
            const ms = [...new Set(qs.map((q) => q.marks))].sort();
            return (
              <li key={ty} className="flex items-center gap-3 border-b border-line py-2">
                <span className="w-10 font-semibold">{ty}</span>
                <span className="num text-faint">{qs.length}</span>
                <span className="ml-auto text-muted-foreground">
                  {ms
                    .map((m) => {
                      const neg = qs.find((q) => q.marks === m)!.negative;
                      return `${m} mark${m === 1 ? "" : "s"}${neg ? `, −${marks(neg)} if wrong` : ""}`;
                    })
                    .join(" · ")}
                </span>
              </li>
            );
          })}
        </ul>
        {parsed.warnings.length > 0 && <p className="text-[12px] text-faint">{parsed.warnings.length} note(s) on the file: run npm run check:tests</p>}
      </section>

      <div className="grid gap-2">
        <form action={startTestAction}>
          <input type="hidden" name="id" value={id} />
          <Button type="submit" className="w-full">
            <Play aria-hidden className="fill-current" />
            {live ? `Resume · ${leftMin} min left` : attempts.length ? "Take it again" : "Start test"}
          </Button>
        </form>
        {live && (
          <form action={discardTestAction}>
            <input type="hidden" name="id" value={id} />
            <Button type="submit" variant="ghost" size="sm" className="w-full">
              <RotateCcw aria-hidden />
              Discard this attempt
            </Button>
          </form>
        )}
      </div>

      {attempts.length > 0 && (
        <section className="grid gap-2" aria-label="Your attempts">
          <h2 className="label">Your attempts</h2>
          <ul className="grid border-t border-line">
            {attempts.map((r) => (
              <li key={r.attempt} className="border-b border-line">
                <Link href={`/tests/${id}/${r.attempt}`} className="flex min-h-12 items-center gap-3 py-2 transition-colors hover:bg-raised/60">
                  <span className="min-w-0 flex-1 text-[13.5px]">{dayTime(new Date(r.submitted))}</span>
                  <span className="num text-[15px] font-semibold">
                    {marks(r.summary.score)}
                    <span className="text-[12px] text-faint">/{r.summary.max}</span>
                  </span>
                  <ChevronRight className="size-4 flex-none stroke-[1.75] text-faint" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-[12px] text-faint">
        Topics: {[...new Set(t.questions.map((q) => q.topic).filter(Boolean))].map((x) => prettyName(x!)).join(", ") || "—"}
      </p>
    </>
  );
}
