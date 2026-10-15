"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "cn";
import { SubjectMarker } from "@/components/subject-marker";
import { DURATIONS, KINDS } from "@/lib/plan/tasks";
import type { TaskFields } from "../plan-actions";
import type { SubjectChip } from "./types";

/** Add or edit a task: what kind, what, which subject, how long. */
export function TaskForm(props: { initial?: TaskFields; subjects: SubjectChip[]; busy: boolean; submit: string; onSave: (f: TaskFields) => void; onCancel: () => void }) {
  const [f, setF] = useState<TaskFields>(props.initial ?? { kind: null, task: "", duration: "1h", subject: null });
  const chip = (on: boolean) =>
    cn("h-8 flex-none border px-2.5 text-[12.5px] transition-colors", on ? "border-act bg-act font-semibold text-act-ink" : "border-line-2 text-muted-foreground hover:border-muted-foreground");
  const row = "-mx-1 flex gap-1.5 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

  return (
    <form
      className="grid gap-3 border-b border-line py-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (f.task.trim()) props.onSave({ ...f, task: f.task.trim() });
      }}
    >
      <div role="radiogroup" aria-label="Kind" className={row}>
        {KINDS.map((k) => (
          <button key={k} type="button" role="radio" aria-checked={f.kind === k} onClick={() => setF({ ...f, kind: f.kind === k ? null : k })} className={chip(f.kind === k)}>
            {k}
          </button>
        ))}
      </div>
      <input
        autoFocus
        value={f.task}
        onChange={(e) => setF({ ...f, task: e.target.value })}
        maxLength={200}
        placeholder="What do you want to do?"
        aria-label="Task"
        className="h-11 border border-line-2 bg-raised px-3 text-base outline-none placeholder:text-faint focus:border-muted-foreground md:text-[14px]"
      />
      <div role="radiogroup" aria-label="Subject" className={row}>
        {props.subjects.map((s) => (
          <button key={s.key} type="button" role="radio" aria-checked={f.subject === s.key} onClick={() => setF({ ...f, subject: f.subject === s.key ? null : s.key })} className={cn(chip(f.subject === s.key), "flex items-center gap-1.5")}>
            <SubjectMarker colour={s.colour} />
            {s.short}
          </button>
        ))}
      </div>
      <div role="radiogroup" aria-label="Time" className={row}>
        {DURATIONS.map((d) => (
          <button key={d} type="button" role="radio" aria-checked={f.duration === d} onClick={() => setF({ ...f, duration: f.duration === d ? null : d })} className={cn(chip(f.duration === d), "num")}>
            {d}
          </button>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={props.onCancel} className="h-9 px-3 text-[13px] text-muted-foreground hover:text-fg">
          Cancel
        </button>
        <button
          type="submit"
          disabled={props.busy || !f.task.trim()}
          className="cut-solid flex h-9 items-center gap-1.5 bg-act px-4 text-[13px] font-semibold text-act-ink transition-opacity disabled:opacity-50 [--cut:7px]"
        >
          {props.busy && <LoaderCircle className="size-3.5 animate-spin stroke-[2.5]" aria-hidden />}
          {props.submit}
        </button>
      </div>
    </form>
  );
}
