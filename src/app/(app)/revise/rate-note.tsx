"use client";

import { useState, useTransition } from "react";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { cn } from "cn";
import { RATING_LABEL, type Rating4 } from "@/lib/revision/ratings";
import { burst, buzz, celebrate } from "@/lib/ui/celebrate";
import { rateAction } from "./actions";

type Choice = { rating: Rating4; when: string };

/** Forgot / Fuzzy / Got it / Easy, each with when the note comes back. Got it and Easy cheer. */
export function RateNote({ noteId, choices }: { noteId: string; choices: Choice[] }) {
  const [pending, start] = useTransition();
  const [picked, setPicked] = useState<Rating4 | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rate = (c: Choice, el: HTMLElement) => {
    if (c.rating === "gotit" || c.rating === "easy") celebrate(el, null);
    else {
      if (c.rating === "fuzzy") burst(el, ["var(--fg-muted)", "var(--fg-faint)"], 6);
      buzz();
    }
    setPicked(c.rating);
    setError(null);
    start(async () => {
      const r = await rateAction(noteId, c.rating).catch(() => ({ ok: false as const, error: "Couldn't reach the app. Try again." }));
      if (!r.ok) {
        setError(r.error);
        setPicked(null);
      }
    });
  };

  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-4 gap-2" role="group" aria-label="How well did you remember it?">
        {choices.map((c) => (
          <button
            key={c.rating}
            type="button"
            disabled={pending}
            aria-pressed={picked === c.rating}
            onClick={(e) => rate(c, e.currentTarget)}
            className={cn(
              "grid min-h-14 content-center gap-0.5 border px-1 py-2 text-[14px] font-medium transition-[background-color,border-color] disabled:cursor-not-allowed",
              picked === c.rating
                ? c.rating === "gotit" || c.rating === "easy"
                  ? "border-mint bg-mint text-act-ink"
                  : "border-act bg-act text-act-ink"
                : "border-line-2 text-fg hover:border-muted-foreground hover:bg-raised",
            )}
          >
            <span className="flex items-center justify-center gap-1">
              {pending && picked === c.rating && <LoaderCircle className="size-3.5 animate-spin stroke-[2.5]" aria-hidden />}
              {RATING_LABEL[c.rating]}
            </span>
            <small className={cn("text-[11.5px] font-normal", picked === c.rating ? "text-black/60" : "text-faint")}>{c.when}</small>
          </button>
        ))}
      </div>
      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-[12.5px] text-alert">
          <TriangleAlert className="size-[14px] flex-none stroke-[1.75]" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
