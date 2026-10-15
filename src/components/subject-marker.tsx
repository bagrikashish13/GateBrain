import { cn } from "cn";

/** Colour job 2: the small diamond that says which subject. Unknown is neutral. Flat, never glowing. */
export function SubjectMarker({ colour, className }: { colour: string | null | undefined; className?: string }) {
  return <span aria-hidden className={cn("inline-block size-[7px] flex-none rotate-45 bg-current", className)} style={{ color: colour ?? "var(--fg-faint)" }} />;
}
