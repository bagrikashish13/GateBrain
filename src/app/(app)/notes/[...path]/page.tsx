import "katex/dist/katex.min.css";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import { MarkdownView } from "@/components/markdown";
import { SubjectMarker } from "@/components/subject-marker";
import { requireSession } from "@/lib/auth/session";
import { folderHref, prettyName, slugOf } from "@/lib/brain/names";
import { allNotes, readNote, titleOf } from "@/lib/brain/notes";
import { subjectOf } from "@/lib/brain/subjects";
import { agoShort, comingDay, pct, relativeDay } from "@/lib/format";
import { nextRevisionDay, readState } from "@/lib/revision/store";
import { maxGap, preview, recallOf } from "@/lib/revision/schedule";
import { daysToExam } from "@/lib/settings";
import { dayKey } from "@/lib/time";
import { RateNote } from "../../revise/rate-note";

export const metadata: Metadata = { title: "Note · GateBrain" };

export default function ReaderPage({ params }: PageProps<"/notes/[...path]">) {
  return (
    <main className="mx-auto grid w-full max-w-[680px] grid-cols-1 content-start gap-4 px-4 pt-3 pb-10 lg:px-8 lg:pt-6">
      <Suspense fallback={<p className="pt-8 text-[13px] text-faint">Opening…</p>}>
        <Reader params={params} />
      </Suspense>
    </main>
  );
}

async function Reader({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  await requireSession();
  const note = readNote(path.map((p) => decodeURIComponent(p)));
  if (!note) notFound();

  const now = new Date();
  const parts = note.id.split("/");
  const subject = subjectOf(parts[0]);
  const title = titleOf(note.content, parts.at(-1)!);
  const state = readState(note.id);
  const recall = recallOf(state, now);
  const slugs = new Map(allNotes().map((n) => [slugOf(n.id.split("/").at(-1)!), n.id]));
  const revisedToday = !!state?.log.some((l) => dayKey(new Date(l.at)) === dayKey(now));
  const due = state ? new Date(state.card.due) : null;
  const overdue = !!due && dayKey(due) < dayKey(now) && !revisedToday;
  const when = preview(state, now, maxGap(daysToExam()));
  // A new note's first revision is planned (the new-notes-a-day cap), so ask the plan, not the card.
  const next = overdue ? null : await nextRevisionDay(note.id, now);

  const cells = [
    { label: "memory", value: pct(recall), alert: recall !== null && recall < 0.75 },
    { label: "next", value: overdue ? "overdue" : next ? comingDay(next, now, false) : "—", alert: overdue },
    { label: "last", value: state?.log.length ? agoShort(new Date(state.log.at(-1)!.at), now) : "—" },
    { label: "revised", value: `${state?.log.length ?? 0}×` },
  ];

  return (
    <>
      <nav aria-label="Folder" className="-mx-1 flex min-h-11 flex-wrap items-center gap-x-0.5 text-[13px] text-muted-foreground">
        <Link href="/notes" className="px-1 py-2 font-medium hover:text-fg">
          Notes
        </Link>
        {parts.slice(0, -1).map((p, i) => (
          <span key={i} className="flex items-center gap-0.5">
            <ChevronRight className="size-3.5 stroke-[1.75] text-faint" aria-hidden />
            <Link href={folderHref(parts.slice(0, i + 1).join("/"))} className="px-1 py-2 hover:text-fg">
              {i === 0 ? subject.short : prettyName(p)}
            </Link>
          </span>
        ))}
      </nav>

      <article className="grid grid-cols-1 gap-6">
        <header className="grid gap-3">
          <div className="label flex items-center gap-2">
            <SubjectMarker colour={subject.colour} />
            {subject.name}
            {parts.length > 2 && <span className="text-faint">· {prettyName(parts[1])}</span>}
          </div>
          <h1 className="display text-[30px] break-words">{title}</h1>
          <dl className="grid grid-cols-4 border-y border-line">
            {cells.map((c, i) => (
              <div key={c.label} className={`grid content-center gap-0.5 py-2.5 ${i ? "border-l border-line pl-2.5" : "pr-2"}`}>
                <dt className="row-start-2 text-[11px] leading-tight text-faint">{c.label}</dt>
                <dd className={`num row-start-1 truncate text-[16px] leading-tight font-semibold ${c.alert ? "text-alert" : "text-fg"}`}>{c.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <MarkdownView source={withoutTitle(note.content, title)} base={`notes/${note.id}`} variant="note" colour={subject.colour} slugs={slugs} />

        <section aria-label="Revise" className="grid gap-2 border-t border-line pt-4">
          <h2 className="label">{revisedToday ? "Revised today" : "Revised it just now?"}</h2>
          {!revisedToday && (
            <RateNote
              noteId={note.id}
              choices={(["forgot", "fuzzy", "gotit", "easy"] as const).map((r) => ({ rating: r, when: relativeDay(when[r], now) }))}
            />
          )}
        </section>
      </article>
    </>
  );
}

/** The header shows the title, so drop frontmatter and a leading "# Title" that repeats it. */
function withoutTitle(content: string, title: string): string {
  const body = content.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const m = /^\s*#\s+(.+)\n/.exec(body);
  const norm = (s: string) => s.replace(/^[^\p{L}\p{N}]+/u, "").trim().toLowerCase();
  return m && norm(m[1]) === norm(title) ? body.slice(m[0].length) : body;
}
