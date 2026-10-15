"use client";

import { useFormStatus } from "react-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "cn";

/** Native select that saves as soon as it changes (inside a <form action={serverAction}>). */
export function AutoSubmitSelect({ className, ...props }: React.ComponentProps<"select">) {
  const { pending } = useFormStatus();
  return (
    <span className={cn("relative inline-flex", className)}>
      <select
        {...props}
        disabled={pending || props.disabled}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="h-10 min-w-[92px] cursor-pointer appearance-none border border-line-2 bg-raised py-0 pr-8 pl-3 font-display text-[14px] font-medium text-fg outline-none transition-colors hover:border-muted-foreground focus-visible:border-act disabled:opacity-60"
      />
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-[15px] -translate-y-1/2 stroke-[1.75] text-faint" aria-hidden />
    </span>
  );
}

/** Square switch. `on` = mint track (the app's accent), black thumb. */
export function SwitchLook({ on, className }: { on: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative block h-5 w-9 flex-none border transition-colors",
        on ? "border-mint bg-mint" : "border-line-2 bg-raised",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] left-[3px] size-3 transition-transform duration-200",
          on ? "translate-x-4 bg-act-ink" : "bg-muted-foreground",
        )}
      />
    </span>
  );
}

/** A switch that submits its form. */
export function ToggleSubmit({ on, label }: { on: boolean; label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" role="switch" aria-checked={on} aria-label={label} disabled={pending} className="p-2 -m-2 disabled:opacity-60">
      <SwitchLook on={on} />
    </button>
  );
}
