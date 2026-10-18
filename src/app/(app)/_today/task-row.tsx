"use client";

import { Fragment, useRef, useState } from "react";
import { Check, CornerDownRight, LoaderCircle } from "lucide-react";
import { cn } from "cn";
import type { Task } from "@/lib/plan/tasks";
import { celebrate } from "@/lib/ui/celebrate";
import { love } from "@/lib/ui/love";

/** "Tue 13 Oct" for a YYYY-MM-DD day. */
export const dayLabel = (date: string) =>
  new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

/**
 * A task as a row: a subject-coloured rail on the left, the kind above the text, the time on the right.
 * Ticking it plays the love note; `last` (it's the day's last open task) plays the finale.
 */
export function TaskRow(props: {
  task: Task;
  done: boolean;
  pending: boolean;
  last: boolean;
  colour: string | null;
  subject: string | null;
  onToggle: () => void;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const { task, done, pending, colour } = props;
  const box = useRef<HTMLSpanElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const [fresh, setFresh] = useState(false); // ticked here, now: the check draws itself
  const tick = () => {
    if (!done && box.current) {
      setFresh(true);
      celebrate(box.current, row.current, ["var(--mint)", "var(--mint)", colour ?? "var(--fg)", "var(--fg)"]);
      love(box.current, { finale: props.last });
    }
    props.onToggle();
  };
  const head = [task.kind, props.subject].filter(Boolean);
  return (
    <li className="border-b border-line">
      <div ref={row} className="relative flex items-start gap-3 py-2.5 pr-1 pl-3">
        <span aria-hidden className={cn("absolute top-2.5 bottom-2.5 left-0 w-[3px] transition-opacity", (done || task.moved) && "opacity-40")} style={{ background: colour ?? "var(--line-2)" }} />
        {task.moved ? (
          <span className="-m-2 grid size-10 flex-none place-items-center" aria-hidden>
            <span className="grid size-[22px] place-items-center border border-line-2 text-faint">
              <CornerDownRight className="size-3.5 stroke-[2]" />
            </span>
          </span>
        ) : (
          <button
            type="button"
            role="checkbox"
            aria-checked={done}
            aria-busy={pending}
            aria-label={`${done ? "Untick" : "Tick"}: ${task.task}`}
            disabled={pending}
            onClick={tick}
            className="-m-2 grid size-10 flex-none place-items-center"
          >
            <span ref={box} className={cn("grid size-[22px] place-items-center border transition-colors", done ? "border-mint bg-mint text-act-ink" : "border-line-2 bg-raised")}>
              {pending ? (
                <LoaderCircle className={cn("size-3.5 animate-spin stroke-[2.5]", done ? "text-act-ink" : "text-fg")} aria-hidden />
              ) : done ? (
                <Check className={cn("size-3.5 stroke-[3]", fresh && "draw-check")} aria-hidden />
              ) : null}
            </span>
          </button>
        )}
        <div className="grid min-w-0 flex-1 gap-1 pt-0.5">
          {(head.length > 0 || task.moved) && (
            <span className="flex min-w-0 items-center gap-2 text-[11.5px] leading-none text-faint">
              <span className="truncate">
                {head.map((p, n) => (
                  <Fragment key={n}>
                    {n > 0 && <span className="px-1 text-line-2">›</span>}
                    {p}
                  </Fragment>
                ))}
              </span>
              {task.moved && <span className="flex-none">moved to {dayLabel(task.moved)}</span>}
            </span>
          )}
          <span className={cn("text-[14px] leading-snug transition-colors duration-300", done || task.moved ? "text-faint" : "text-fg")}>
            <span className="strike" data-on={done}>
              {task.task}
            </span>
          </span>
        </div>
        <span className="num flex-none pt-px text-[11.5px] text-faint">{task.duration}</span>
        {props.action}
      </div>
      {props.children}
    </li>
  );
}
