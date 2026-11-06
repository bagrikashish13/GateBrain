import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Progress } from "@/components/progress";
import type { TodayData } from "./types";

/** Today only: how far through the syllabus, and the very next thing in it. */
export function SyllabusCard({ syllabus }: { syllabus: NonNullable<TodayData["syllabus"]> }) {
  return (
    <Link href="/syllabus" aria-label="Syllabus" className="grid gap-2 border-y border-line py-3">
      <span className="flex items-baseline gap-2.5">
        <span className="font-display text-[15px] leading-none font-bold">Syllabus</span>
        <span className="num text-[13px] text-muted-foreground">
          <span className="font-semibold text-fg">{syllabus.done}</span>/{syllabus.total}
        </span>
        {syllabus.today > 0 && <span className="text-[12.5px] font-semibold text-mint">+{syllabus.today} today</span>}
        <ChevronRight className="ml-auto size-4 flex-none self-center stroke-[1.75] text-faint" aria-hidden />
      </span>
      <Progress done={syllabus.done} total={syllabus.total} label={`${syllabus.done} of ${syllabus.total} syllabus topics ticked`} />
      {syllabus.next && <span className="truncate text-[12.5px] text-muted-foreground">Next: {syllabus.next}</span>}
    </Link>
  );
}
