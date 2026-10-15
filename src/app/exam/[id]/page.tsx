import "katex/dist/katex.min.css";

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { MarkdownView } from "@/components/markdown";
import { requireSession } from "@/lib/auth/session";
import { subjectOf } from "@/lib/brain/subjects";
import { sectionsOf } from "@/lib/tests/format";
import { getInProgress, getTest, submitAttempt } from "@/lib/tests/store";
import { ExamScreen, type ExamQuestion } from "./exam-screen";

export const metadata: Metadata = { title: "Exam · GateBrain" };

export default function ExamPage({ params }: PageProps<"/exam/[id]">) {
  return (
    <Suspense fallback={<div className="fixed inset-0 grid place-items-center bg-white text-[14px] text-[#5b6475]">Loading the paper…</div>}>
      <Exam params={params} />
    </Suspense>
  );
}

/**
 * The test, GATE's way (full screen, no tab bar). Answers and solutions never reach the browser:
 * only the questions, rendered here. Opening it after the time ran out submits what was saved.
 */
async function Exam({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireSession();
  await connection();
  const test = getTest(id);
  if (!test) notFound();
  const p = getInProgress(id);
  if (!p) redirect(`/tests/${id}`);
  const now = new Date().getTime();
  if (now > p.deadline + 5_000) {
    const attempt = await submitAttempt(test, p, true);
    redirect(`/tests/${id}/${attempt}`);
  }

  const base = `tests/${id}.md`;
  const questions: ExamQuestion[] = test.questions.map((q) => ({
    n: q.n,
    type: q.type,
    marks: q.marks,
    negative: q.negative,
    section: q.section,
    subject: subjectOf(q.subject).short,
    body: <MarkdownView source={q.text} base={base} variant="exam" />,
    options: q.options.map((o) => ({ key: o.key, body: <MarkdownView source={o.text} base={base} variant="exam" className="[&>p]:inline" /> })),
  }));

  return (
    <ExamScreen
      id={test.id}
      title={test.title}
      questions={questions}
      sections={sectionsOf(test)}
      initial={{ current: p.current, states: p.states }}
      deadline={p.deadline}
      serverNow={now}
    />
  );
}
