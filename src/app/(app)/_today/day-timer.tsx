"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "cn";

const HOUR = 3_600_000;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Under the weekday, today only (SPEC §6.1): how long until the day ends, as rolling
 * hours / minutes / seconds, over 24 mint hour blocks that empty toward midnight. The block for
 * the current hour drains second by second with marching stripes and a blinking edge; on open the
 * blocks fill in one by one. At midnight the page reloads into the new day.
 */
export function DayTimer() {
  const still = useReducedMotion() ?? false;
  const router = useRouter();
  const [now, setNow] = useState<number | null>(null); // device time; null until mounted
  const [intro, setIntro] = useState(true);
  const day = useRef<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const t = new Date();
      const key = t.toDateString();
      if (day.current && day.current !== key) router.refresh();
      day.current = key;
      setNow(t.getTime());
    };
    tick();
    const id = setInterval(tick, 1000);
    const done = setTimeout(() => setIntro(false), 1300);
    return () => (clearInterval(id), clearTimeout(done));
  }, [router]);

  const end = now === null ? 0 : new Date(new Date(now).getFullYear(), new Date(now).getMonth(), new Date(now).getDate() + 1).getTime();
  const left = now === null ? 0 : Math.max(0, end - now);
  const s = Math.floor(left / 1000);
  const digits = now === null ? "------" : pad(Math.floor(s / 3600)) + pad(Math.floor((s % 3600) / 60)) + pad(s % 60);
  const hoursLeft = left / HOUR; // 0–24; the bar is filled from the left
  const full = Math.floor(hoursLeft);

  return (
    <div className="grid gap-2.5" aria-hidden={now === null}>
      <div className="flex items-baseline gap-2.5">
        <span
          role="timer"
          aria-label={now === null ? undefined : `${Math.floor(s / 3600)} hours ${Math.floor((s % 3600) / 60)} minutes left today`}
          className={cn("flex items-baseline font-display text-[24px] leading-none font-bold tabular-nums", now === null && "invisible")}
        >
          {[0, 2, 4].map((at, n) => (
            <span key={at} className="flex items-baseline">
              <Digit d={digits[at]} still={still} />
              <Digit d={digits[at + 1]} still={still} />
              <span className="mr-2 ml-0.5 text-[12px] font-medium text-faint last:mr-0">{"hms"[n]}</span>
            </span>
          ))}
        </span>
        <span className="ml-auto text-[12px] text-muted-foreground">left today</span>
      </div>
      <div className="grid h-2 grid-cols-24 gap-[2px]">
        {Array.from({ length: 24 }, (_, i) => {
          const w = now === null ? 0 : i < full ? 100 : i === full ? (hoursLeft - full) * 100 : 0;
          return (
            <span key={i} className="relative overflow-hidden bg-raised-2">
              <motion.i
                className={cn("absolute inset-y-0 left-0 bg-mint", i === full && "timer-live")}
                initial={still ? false : { width: "0%" }}
                animate={{ width: `${w}%` }}
                transition={still ? { duration: 0 } : intro ? { duration: 0.5, delay: i * 0.028, ease: [0.2, 0.9, 0.3, 1] } : { duration: 1, ease: "linear" }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** One digit that rolls up when it changes. */
function Digit({ d, still }: { d: string; still: boolean }) {
  return (
    <span className="relative inline-grid h-[1em] w-[0.62em] overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={d}
          className="text-center"
          initial={still ? false : { y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={still ? undefined : { y: "-100%", opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.5, 0, 0.2, 1] }}
        >
          {d}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
