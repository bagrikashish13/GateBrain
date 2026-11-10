import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "cn";

/**
 * A section that folds open and shut, the same everywhere: native details and summary, so it works
 * before the page is interactive, needs no state, and stays accessible. Title on the left, a short meta
 * (a count, a score) on the right, the chevron turning when open.
 */
export function Fold({
  title,
  meta,
  open,
  className,
  summaryClassName,
  bodyClassName,
  children,
}: {
  title: ReactNode;
  meta?: ReactNode;
  open?: boolean;
  className?: string;
  summaryClassName?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <details open={open} className={cn("group/fold border-b border-line", className)}>
      <summary
        className={cn(
          "flex min-h-12 cursor-pointer list-none items-center gap-2.5 py-2 transition-colors select-none hover:bg-raised/60 [&::-webkit-details-marker]:hidden",
          summaryClassName,
        )}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2.5">{title}</span>
        {meta}
        <ChevronRight className="size-4 flex-none stroke-[1.75] text-faint transition-transform group-open/fold:rotate-90" aria-hidden />
      </summary>
      <div className={bodyClassName}>{children}</div>
    </details>
  );
}
