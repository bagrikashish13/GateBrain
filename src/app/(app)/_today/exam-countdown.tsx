/** Days left to GATE, under the day timer. */
export function ExamCountdown({ days, date }: { days: number; date: string }) {
  const when = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
  return (
    <div className="flex items-baseline gap-2 border-y border-line py-2">
      <span className="text-[13px] font-semibold">GATE</span>
      <span className="text-[12px] text-faint">{when}</span>
      <span className="ml-auto flex items-baseline gap-1.5">
        <span className="num text-[22px] leading-none font-bold">{days}</span>
        <span className="text-[12px] text-muted-foreground">{days === 1 ? "day left" : days === 0 ? "today" : "days left"}</span>
      </span>
    </div>
  );
}
