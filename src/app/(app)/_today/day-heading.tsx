"use client";

import { motion, useReducedMotion } from "motion/react";
import { LocateFixed } from "lucide-react";
import { cn } from "cn";
import { DRUM_H } from "./drum";
import type { When } from "./date-picker";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY = 86_400_000;
const MAX_PX = 44;
// A little under the full half row (his request, 2026-10-13: "just a bit smaller").
const FILL = 0.88;
// Width ÷ font size of each weekday in Chakra Petch 700 at -0.02em, plus the slant's overhang and a
// little room (measured in the browser). The weekday fills FILL of its half of the row.
const WIDTH: Record<string, number> = {
  Sunday: 3.65,
  Monday: 3.82,
  Tuesday: 4.03,
  Wednesday: 5.53,
  Thursday: 4.5,
  Friday: 3.06,
  Saturday: 4.38,
};

/**
 * The left half of the top row (SPEC §6.1): where the day sits from today ("Today" with a mint marker, "3 days ago",
 * "in 2 days", "· 2 left" in rose on a slipped past day) with a back-to-today button beside it,
 * then the weekday, big and slanted, centred on the date window so the two read as one line.
 */
export function DayHeading({ date, today, when, open, onToday }: { date: string; today: string; when: When; open: number; onToday: () => void }) {
  const still = useReducedMotion() ?? false;
  const weekday = WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];
  const days = Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / DAY);
  const rel = days === 0 ? "Today" : days === -1 ? "Yesterday" : days === 1 ? "Tomorrow" : days < 0 ? `${-days} days ago` : `in ${days} days`;

  return (
    <div className="grid min-w-0 flex-1 [container-type:inline-size]" style={{ height: DRUM_H, gridTemplateRows: "minmax(0, 1fr) auto minmax(0, 1fr)" }}>
      <div className="flex items-center gap-1 self-end pb-2">
        {when === "today" ? (
          <>
            <i aria-hidden className="ring-out relative mr-1.5 size-[7px] rotate-45 bg-mint text-mint" />
            <span className="text-[13px] leading-none font-semibold text-act">Today</span>
          </>
        ) : (
          <>
            <span className={cn("text-[13px] leading-none", when === "past" ? "text-faint" : "text-muted-foreground")}>
              {rel}
              {when === "past" && open > 0 && <span className="text-alert"> · {open} left</span>}
            </span>
            <motion.button
              type="button"
              onClick={onToday}
              aria-label="Back to today"
              title="Back to today"
              initial={still ? false : { scale: 0.4, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              whileTap={{ scale: 0.86 }}
              transition={{ type: "spring", stiffness: 520, damping: 26 }}
              // A 26px plate inside a 40px hit area.
              className="-my-[7px] grid size-10 flex-none place-items-center"
            >
              <span className="cut-solid grid size-[26px] place-items-center bg-act text-act-ink [--cut:6px]">
                <LocateFixed className="size-[15px] stroke-[2.25]" aria-hidden />
              </span>
            </motion.button>
          </>
        )}
      </div>

      {/* Centred on the drum window (row 2 of three, the outer two equal): Chakra Petch's caps sit in
          the middle of its line box, so they line up with the date's digits. */}
      <span
        className={cn(
          "block origin-bottom-left -skew-x-[8deg] bg-clip-text pr-[0.04em] font-display leading-none font-bold tracking-[-0.02em] whitespace-nowrap text-transparent",
          when === "past"
            ? "bg-[linear-gradient(180deg,#a3a9b6_0%,#6b7180_60%,#3e4350_100%)]"
            : "bg-[linear-gradient(180deg,#ffffff_0%,#e3e6ec_45%,#9aa1b0_100%)]",
          when === "future" && "opacity-90",
        )}
        style={{
          fontSize: `min(${MAX_PX}px, calc(${FILL * 100}cqw / ${WIDTH[weekday]}))`,
        }}
      >
        {weekday}
      </span>
    </div>
  );
}
