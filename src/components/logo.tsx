import { cn } from "cn";

export const APP_NAME = "GateBrain";

// The lobes of the left half, each a chamfered block against the midline (x = 22).
const LOBES =
  "M22 3 H15 L12 6 V9 L14 11 H22 Z M22 8.5 H9 L6 11.5 V15.5 L8.5 18 H22 Z M22 16 H6 L3 19 V23 L6 26 H22 Z M22 24 H6.5 L4 26.5 V30 L7 33 H22 Z M22 31 H9 L6.5 33.5 V37 L9.5 40 H22 Z M22 38 H13 L11 40 V42 L14 45 H22 Z";
const FOLDS = "M11 10.2 H16 V6.5 M5.5 17 H12 V21.5 M3.5 25 H9.5 V29.5 M5.5 32 H14 V36 M9.5 39 H16 M22 14 H18.5 M22 27.5 H16.5 V24";

/** The mark, same as secondBrain's: your brain (grey lobes, white folds) and the note that keeps it (mint). */
export function Logo({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden className={cn("flex-none", className)}>
      <path d={LOBES} fill="var(--line-2)" stroke="var(--fg)" strokeWidth={2.2} strokeLinejoin="miter" />
      <path d={LOBES} fill="var(--line-2)" />
      <path d={FOLDS} fill="none" stroke="var(--fg)" strokeWidth={1.6} strokeLinecap="square" />
      <path d="M26 4 H38 L45 11 V44 H26 Z" fill="var(--mint)" />
      <path d="M38 4 V11 H45" fill="none" stroke="var(--void)" strokeWidth={1.6} />
      <path d="M30 17 H41 M30 23 H38 M30 29 H41 M30 35 H36" stroke="var(--void)" strokeWidth={2.2} />
    </svg>
  );
}

/** "Gate" in white, "Brain" in mint. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-bold tracking-[-0.02em]", className)}>
      Gate<span className="text-mint">Brain</span>
    </span>
  );
}
