import "katex/dist/katex.min.css";

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Crosshair, X } from "lucide-react";
import { MarkdownView } from "@/components/markdown";
import { SubjectMarker } from "@/components/subject-marker";
import { buttonVariants } from "@/components/ui/button";
import { requireSession } from "@/lib/auth/session";
import { prettyName, slugOf } from "@/lib/brain/names";
import { allNotes, readNote, titleOf } from "@/lib/brain/notes";
import { subjectOf } from "@/lib/brain/subjects";
import { relativeDay } from "@/lib/format";
import { RATINGS } from "@/lib/revision/ratings";
import { maxGap, preview } from "@/lib/revision/schedule";
import { todayRevision, topicRevision, type RevisionItem } from "@/lib/revision/store";
import { daysToExam } from "@/lib/settings";
import { RateNote } from "../rate-note";

export const metadata: Metadata = { title: "Revising · GateBrain" };

export default function SessionPage({ searchParams }: PageProps<"/revise/session">) {
  return (
    <main className="mx-auto grid w-full max-w-[680px] grid-cols-1 content-start gap-4 px-4 pt-3 pb-10">
      <Suspense fallback={<p className="pt-8 text-[13px] text-faint">Opening the next note…</p>}>
        <Session searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

/**
 * One note at a time: read it, then say how well it came back. Without ?topic= it works through
 * today's due list; with ?topic=os/deadlock, every note of that topic (a weak one from the mocks).
 */
async function Session({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireSession();
  const now = new Date();
  const topicParam = (await searchParams).topic;
  const topic = typeof topicParam === "string" && /^[a-z0-9-]+\/[a-z0-9-]+$/.test(topicParam) ? topicParam : null;

  let queue: RevisionItem[];
  let done: number;
  if (topic) {
    const [subject, slug] = topic.split("/");
    queue = await topicRevision(subject, slug, now);
    const all = allNotes().filter((n) => n.subject === subject && n.section && slugOf(n.section) === slug).length;
    done = all - queue.length;
  } else {
    const rev = await todayRevision(now);
    queue = rev.due;
    done = rev.done.length;
  }

  const item = queue[0];
  if (!item) return <Done topic={topic} reviewed={done} />;

  const note = readNote(item.note.id.split("/"))!;
  const subject = subjectOf(item.note.subject);
  const title = titleOf(note.content, item.note.id.split("/").at(-1)!);
  const slugs = new Map(allNotes().map((n) => [slugOf(n.id.split("/").at(-1)!), n.id]));
  const when = preview(item.state, now, maxGap(daysToExam()));
  const total = done + queue.length;

  return (
    <>
      <div className="flex items-center justify-between">
        <Link href="/revise" aria-label="Leave revision" className="-ml-2.5 grid size-11 place-items-center text-faint hover:text-fg">
          <X className="size-5 stroke-[1.75]" aria-hidden />
        </Link>
        <span className="text-[12.5px] text-faint">
          {topic && <span className="mr-2 text-alert">{prettyName(topic.split("/")[1])}</span>}
          Note <span className="num font-semibold text-fg">{done + 1}</span> of {total}
        </span>
      </div>
      <div className="flex gap-1" aria-hidden>
        {Array.from({ length: Math.min(total, 40) }, (_, i) => (
          <i key={i} className={`h-[3px] flex-1 ${i < done ? "bg-mint" : i === done ? "bg-act" : "bg-line-2"}`} />
        ))}
      </div>

      <article className="grid grid-cols-1 gap-5">
        <header className="grid gap-2">
          <div className="label flex items-center gap-2">
            <SubjectMarker colour={subject.colour} />
            {subject.short}
            {item.note.section && <span className="text-faint">· {prettyName(item.note.section)}</span>}
            {item.weak && (
              <span className="ml-auto flex items-center gap-1 text-alert">
                <Crosshair className="size-[13px] stroke-[1.75]" aria-hidden />
                weak in mocks
              </span>
            )}
          </div>
          <h1 className="display text-[28px] break-words">{title}</h1>
        </header>
        <MarkdownView source={note.content.replace(/^---\n[\s\S]*?\n---\n?/, "").replace(/^\s*#\s+.+\n/, "")} base={`notes/${note.id}`} variant="note" colour={subject.colour} slugs={slugs} />
      </article>

      <section aria-label="How did it go?" className="sticky bottom-[calc(64px+env(safe-area-inset-bottom))] -mx-4 grid gap-2 border-t border-line bg-void px-4 py-3">
        <RateNote key={item.note.id} noteId={item.note.id} choices={RATINGS.map((r) => ({ rating: r, when: relativeDay(when[r], now) }))} />
      </section>
    </>
  );
}

function Done({ topic, reviewed }: { topic: string | null; reviewed: number }) {
  return (
    <div className="grid gap-4 pt-8">
      <h1 className="display">{reviewed ? "All done" : "Nothing due right now"}</h1>
      {reviewed > 0 && (
        <p className="text-[15px] text-muted-foreground">
          {topic ? `Every ${prettyName(topic.split("/")[1]).toLowerCase()} note revised today.` : `You revised ${reviewed} ${reviewed === 1 ? "note" : "notes"} today.`}
        </p>
      )}
      <Link href="/revise" className={buttonVariants({ variant: "outline", className: "w-full" })}>
        Back to Revise
      </Link>
    </div>
  );
}
