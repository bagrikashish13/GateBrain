import Link from "next/link";
import { Settings } from "lucide-react";

/** Days left to GATE, under the day timer, with the way into Settings at its end (Roadmap has the tab). */
export function ExamCountdown({ days, date }: { days: number | null; date: string | null }) {
  const when = date ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)) : null;
  return (
    <div className="flex items-center gap-2 border-y border-line py-1">
      <span className="text-[13px] font-semibold">GATE</span>
      {when && <span className="text-[12px] text-faint">{when}</span>}
      {days !== null ? (
        <span className="ml-auto flex items-baseline gap-1.5">
          <span className="num text-[22px] leading-none font-bold">{days}</span>
          <span className="text-[12px] text-muted-foreground">{days === 1 ? "day left" : days === 0 ? "today" : "days left"}</span>
        </span>
      ) : (
        <Link href="/settings" className="ml-auto text-[12px] font-medium text-fg">
          Set exam date
        </Link>
      )}
      <Link
        href="/settings"
        aria-label="Settings"
        title="Settings"
        className="-mr-2.5 ml-1 grid size-10 flex-none place-items-center border-l border-line text-faint transition-colors hover:text-fg"
      >
        <Settings className="size-[17px] stroke-[1.75]" aria-hidden />
      </Link>
    </div>
  );
}
