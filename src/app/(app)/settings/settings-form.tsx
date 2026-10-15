"use client";

import { useActionState } from "react";
import { Check, LoaderCircle, TriangleAlert } from "lucide-react";
import { saveSettingsAction, type SettingsState } from "./actions";

export function SettingsForm({ examDate, newPerDay }: { examDate: string | null; newPerDay: number }) {
  const [state, action, pending] = useActionState<SettingsState, FormData>(saveSettingsAction, {});
  const field = "h-11 border border-line-2 bg-raised px-3 font-display text-[15px] text-fg outline-none [color-scheme:dark] focus:border-act";
  return (
    <form action={action} className="grid gap-3">
      <label className="flex items-center justify-between gap-3 border-b border-line pb-3">
        <span className="text-[14px]">GATE exam date</span>
        <input type="date" name="examDate" defaultValue={examDate ?? ""} className={field} />
      </label>
      <label className="flex items-center justify-between gap-3 border-b border-line pb-3">
        <span className="text-[14px]">New notes a day</span>
        <input type="number" name="newPerDay" min={1} max={50} defaultValue={newPerDay} className={`${field} w-20 text-center`} />
      </label>
      <div className="flex items-center justify-end gap-3">
        {state.error && (
          <span role="alert" className="flex items-center gap-1.5 text-[12.5px] text-alert">
            <TriangleAlert className="size-[14px] stroke-[1.75]" aria-hidden />
            {state.error}
          </span>
        )}
        {state.ok && !pending && (
          <span role="status" className="flex items-center gap-1 text-[12.5px] text-mint">
            <Check className="size-[14px] stroke-[2.5]" aria-hidden />
            Saved
          </span>
        )}
        <button type="submit" disabled={pending} className="cut-solid flex h-9 items-center gap-1.5 bg-act px-4 text-[13px] font-semibold text-act-ink disabled:opacity-60 [--cut:7px]">
          {pending && <LoaderCircle className="size-3.5 animate-spin stroke-[2.5]" aria-hidden />}
          Save
        </button>
      </div>
    </form>
  );
}
