import Link from "next/link";
import { ChevronRight, ClipboardCheck, Play } from "lucide-react";
import { marks } from "@/lib/format";
import type { TodayData } from "./types";

/** Today only: a test in progress to resume, the newest untaken test, the last score. Hidden when there's none. */
export function TestsCard({ tests }: { tests: TodayData["tests"] }) {
  const { running, next, last } = tests;
  if (!running.length && !next && !last) return null;
  return (
    <section aria-label="Tests" className="grid border-y border-line">
      {running.map((r) => (
        <Link key={r.id} href={`/exam/${r.id}`} className="flex min-h-13 items-center gap-3 border-b border-line py-2.5 last:border-b-0">
          <span className="cut-solid grid size-8 flex-none place-items-center bg-mint text-act-ink [--cut:6px]">
            <Play className="size-3.5 fill-current" aria-hidden />
          </span>
          <span className="grid min-w-0 flex-1 gap-0.5">
            <span className="truncate text-[14px] font-medium">{r.title}</span>
            <span className="text-[12px] text-mint">In progress · {r.minutesLeft} min left</span>
          </span>
          <ChevronRight className="size-4 flex-none stroke-[1.75] text-faint" aria-hidden />
        </Link>
      ))}
      {next && !running.some((r) => r.id === next.id) && (
        <Link href={`/tests/${next.id}`} className="flex min-h-13 items-center gap-3 border-b border-line py-2.5 last:border-b-0">
          <ClipboardCheck className="size-5 flex-none stroke-[1.6] text-fg" aria-hidden />
          <span className="grid min-w-0 flex-1 gap-0.5">
            <span className="truncate text-[14px] font-medium">{next.title}</span>
            <span className="text-[12px] text-faint">
              New test · {next.questions} Qs · {next.duration} min
            </span>
          </span>
          <ChevronRight className="size-4 flex-none stroke-[1.75] text-faint" aria-hidden />
        </Link>
      )}
      {last && (
        <Link href={`/tests/${last.id}/${last.attempt}`} className="flex min-h-12 items-center gap-3 py-2">
          <span className="min-w-0 flex-1 truncate text-[13px] text-muted-foreground">Last: {last.title}</span>
          <span className="num text-[15px] font-semibold">
            {marks(last.score)}
            <span className="text-[12px] text-faint">/{last.max}</span>
          </span>
          <ChevronRight className="size-4 flex-none stroke-[1.75] text-faint" aria-hidden />
        </Link>
      )}
    </section>
  );
}
