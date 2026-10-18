"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "cn";

const SEGMENTS_UP_TO = 16; // more items than this → one continuous bar

/**
 * Mint progress (SPEC §6.1): one block per item, each filling with a spring and a white flash as
 * it's done; when the last one fills, a light sweeps the bar. Used on Today's Tasks and Revision.
 */
export function Progress({ done, total, label, className }: { done: number; total: number; label: string; className?: string }) {
  const still = useReducedMotion() ?? false;
  const all = total > 0 && done >= total;
  const [sweeps, setSweeps] = useState(0);
  const was = useRef(all);
  useEffect(() => {
    if (all && !was.current) setSweeps((n) => n + 1);
    was.current = all;
  }, [all]);

  if (total <= 0) return null;
  const blocks = total <= SEGMENTS_UP_TO ? Array.from({ length: total }, (_, i) => i < done) : null;

  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} className={cn("relative flex h-[5px] gap-[3px] overflow-hidden", className)}>
      {blocks ? (
        blocks.map((on, i) => <Block key={i} on={on} still={still} />)
      ) : (
        <span className="relative flex-1 bg-raised-2">
          <motion.i
            className="absolute inset-y-0 left-0 bg-mint"
            initial={false}
            animate={{ width: `${(done / total) * 100}%` }}
            transition={still ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}
          />
        </span>
      )}
      <AnimatePresence>
        {sweeps > 0 && !still && (
          <motion.i
            key={sweeps}
            aria-hidden
            className="absolute inset-y-0 left-0 w-[30%] bg-[linear-gradient(90deg,transparent,#fff,transparent)]"
            initial={{ x: "-100%", opacity: 0.9 }}
            animate={{ x: "340%", opacity: 0.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onAnimationComplete={() => setSweeps(0)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Block({ on, still }: { on: boolean; still: boolean }) {
  return (
    <span className="relative flex-1 overflow-hidden bg-raised-2">
      <motion.i
        className="absolute inset-0 origin-left bg-mint"
        initial={false}
        animate={{ scaleX: on ? 1 : 0 }}
        transition={still ? { duration: 0 } : { scaleX: { type: "spring", stiffness: 420, damping: 26 } }}
      />
      {on && !still && (
        <motion.i
          className="absolute inset-0 bg-white"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        />
      )}
    </span>
  );
}

/** A count that rolls up or down when it changes. */
export function RollingCount({ value, className }: { value: number; className?: string }) {
  const still = useReducedMotion() ?? false;
  return (
    <span className={cn("relative inline-grid overflow-hidden align-bottom", className)}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={still ? false : { y: "-80%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={still ? undefined : { y: "80%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** "All done", fading in once everything in a card is done. */
export function AllDone({ show }: { show: boolean }) {
  const still = useReducedMotion() ?? false;
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.span
          className="text-[12.5px] font-semibold text-mint"
          initial={still ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={still ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          All done
        </motion.span>
      )}
    </AnimatePresence>
  );
}
