"use client";

import { useEffect, useState, useTransition } from "react";
import { EllipsisVertical, LoaderCircle, Pencil, Plus, Redo2, Trash, TriangleAlert, X } from "lucide-react";
import { cn } from "cn";
import { AllDone, Progress, RollingCount } from "@/components/progress";
import { addDayKey } from "@/lib/time";
import { preloadLove } from "@/lib/ui/love";
import type { Task } from "@/lib/plan/tasks";
import { addTaskAction, deleteTaskAction, editTaskAction, moveTaskAction, tickTask, type PlanResult } from "../plan-actions";
import { TaskForm } from "./task-form";
import { dayLabel, TaskRow } from "./task-row";
import type { SubjectChip } from "./types";

type Open = { text: string; mode: "menu" | "move" | "edit" | "delete" } | null;
type Tick = { base: boolean; to: boolean; pending: boolean };

/**
 * The selected day's tasks (brain/plan/<day>.md). Tick any day; ⋮ on a task: Move (an undone task, to
 * today or one of the next days), Edit, Delete. Add on any day. Every change is one commit.
 */
export function TasksCard({ date, today, tasks, subjects }: { date: string; today: string; tasks: Task[]; subjects: SubjectChip[] }) {
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState<Open>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ticks, setTicks] = useState<Record<string, Tick>>({});
  const [, start] = useTransition();
  useEffect(preloadLove, []);

  const sub =(k: string | null) => (k ? subjects.find((s) => s.key === k) : undefined);
  const live = tasks.filter((t) => !t.moved);
  // A tick the server hasn't confirmed yet wins over the props; once the props change, they win.
  const doneOf = (t: Task) => {
    const k = ticks[`${date}\n${t.text}`];
    return k && k.base === t.done ? k.to : t.done;
  };
  const pendingOf = (t: Task) => {
    const k = ticks[`${date}\n${t.text}`];
    return !!k && k.base === t.done && k.pending;
  };
  const done = live.filter(doneOf).length;
  const from = date > today ? date : today;
  const targets = Array.from({ length: 7 }, (_, n) => addDayKey(from, n)).filter((d) => d !== date);

  const toggle = (t: Task) => {
    if (t.moved || pendingOf(t)) return;
    const key = `${date}\n${t.text}`;
    const to = !doneOf(t);
    setError(null);
    setTicks((s) => ({ ...s, [key]: { base: t.done, to, pending: true } }));
    start(async () => {
      const r = await tickTask(date, t.text, to).catch(() => ({ ok: false as const, error: "Couldn't reach the app. Try again." }));
      setTicks((s) => {
        const next = { ...s };
        if (r.ok) next[key] = { base: t.done, to, pending: false };
        else delete next[key];
        return next;
      });
      if (!r.ok) setError(r.error);
    });
  };

  const save = (key: string, write: () => Promise<PlanResult>, after?: () => void) => {
    setError(null);
    setBusy(key);
    start(async () => {
      const r = await write().catch(() => ({ ok: false as const, error: "Couldn't reach the app. Try again." }));
      setBusy(null);
      if (!r.ok) return setError(r.error);
      setOpen(null);
      after?.();
    });
  };
  const toggleOpen = (text: string, mode: NonNullable<Open>["mode"]) => setOpen(open?.text === text && open.mode === mode ? null : { text, mode });

  return (
    <section aria-label="Tasks" className="cut grid gap-3 p-4 pr-3 [--cut:14px]">
      <header className="flex items-center gap-2.5">
        <h2 className="font-display text-[19px] leading-none font-bold">Tasks</h2>
        {live.length > 0 && (
          <span className="num text-[13px] text-muted-foreground">
            <RollingCount value={done} className="font-semibold text-fg" />/{live.length}
          </span>
        )}
        <span className="ml-auto">
          <AllDone show={live.length > 0 && done === live.length} />
        </span>
        <button
          type="button"
          onClick={() => (setAdding((a) => !a), setOpen(null), setError(null))}
          aria-expanded={adding}
          className="-my-1 flex h-8 items-center gap-1 border border-line-2 px-2.5 text-[12.5px] font-medium transition-colors hover:border-muted-foreground"
        >
          <Plus className="size-3.5 stroke-[2]" aria-hidden />
          Add
        </button>
      </header>
      <Progress done={done} total={live.length} label={`${done} of ${live.length} tasks done`} className="-mt-0.5 mr-1" />

      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-[12.5px] text-alert">
          <TriangleAlert className="size-[14px] flex-none stroke-[1.75]" aria-hidden />
          {error}
        </p>
      )}

      <ul className="grid border-t border-line">
        {adding && (
          <li>
            <TaskForm subjects={subjects} busy={busy === "add"} submit="Add" onCancel={() => setAdding(false)} onSave={(f) => save("add", () => addTaskAction(date, f), () => setAdding(false))} />
          </li>
        )}
        {tasks.map((t) => {
          const isDone = doneOf(t);
          const canMove = !t.moved && !isDone;
          const mode = open?.text === t.text ? open.mode : null;
          const s = sub(t.subject);
          return (
            <TaskRow
              key={t.text}
              task={t}
              done={isDone}
              pending={pendingOf(t)}
              last={!t.moved && !isDone && done === live.length - 1}
              colour={s?.colour ?? null}
              subject={s?.short ?? t.subject}
              onToggle={() => toggle(t)}
              action={
                !t.moved && (
                  <button
                    type="button"
                    onClick={() => toggleOpen(t.text, "menu")}
                    aria-label="Task options"
                    aria-expanded={mode !== null}
                    className={cn("-my-2 -mr-1.5 grid size-10 flex-none place-items-center transition-colors hover:text-fg", mode ? "text-fg" : "text-faint")}
                  >
                    <EllipsisVertical className="size-4 stroke-[1.75]" aria-hidden />
                  </button>
                )
              }
            >
              {mode === "menu" && (
                <div className="flex gap-1.5 pb-3 pl-[34px]">
                  {canMove && <MenuButton icon={Redo2} label="Move" onClick={() => toggleOpen(t.text, "move")} />}
                  <MenuButton icon={Pencil} label="Edit" onClick={() => toggleOpen(t.text, "edit")} />
                  <MenuButton icon={Trash} label="Delete" alert onClick={() => toggleOpen(t.text, "delete")} />
                </div>
              )}
              {mode === "move" && (
                <div className="grid gap-2 pb-3 pl-[34px]">
                  <Sub title="Move to" onClose={() => setOpen(null)} />
                  <div className="flex flex-wrap gap-1.5">
                    {targets.map((d) => (
                      <button
                        key={d}
                        type="button"
                        disabled={busy !== null}
                        onClick={() => save(`move:${d}`, () => moveTaskAction(date, t.text, d))}
                        className="flex h-9 items-center gap-1.5 border border-line-2 px-2.5 text-[12.5px] transition-colors hover:border-act disabled:opacity-60"
                      >
                        {busy === `move:${d}` && <LoaderCircle className="size-3.5 animate-spin stroke-[2]" aria-hidden />}
                        <span className={d === today ? "font-semibold text-act" : undefined}>{d === today ? "Today" : dayLabel(d).slice(0, -4)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {mode === "edit" && (
                <div className="pl-[34px]">
                  <TaskForm
                    initial={{ kind: t.kind, task: t.task, duration: t.duration, subject: t.subject }}
                    subjects={subjects}
                    busy={busy === "edit"}
                    submit="Save"
                    onCancel={() => setOpen(null)}
                    onSave={(f) => save("edit", () => editTaskAction(date, t.text, f))}
                  />
                </div>
              )}
              {mode === "delete" && (
                <div className="flex items-center justify-between gap-3 pb-3 pl-[34px]">
                  <span className="text-[12.5px] text-muted-foreground">Delete this task?</span>
                  <span className="flex gap-1.5">
                    <button type="button" onClick={() => setOpen(null)} className="h-8 px-2.5 text-[12.5px] text-muted-foreground hover:text-fg">
                      Keep
                    </button>
                    <button
                      type="button"
                      disabled={busy !== null}
                      onClick={() => save("delete", () => deleteTaskAction(date, t.text))}
                      className="flex h-8 items-center gap-1.5 border border-alert/60 px-2.5 text-[12.5px] font-medium text-alert transition-colors hover:border-alert disabled:opacity-60"
                    >
                      {busy === "delete" && <LoaderCircle className="size-3.5 animate-spin stroke-[2]" aria-hidden />}
                      Delete
                    </button>
                  </span>
                </div>
              )}
            </TaskRow>
          );
        })}
      </ul>
      {tasks.length === 0 && !adding && <p className="-mt-1 text-[13px] text-faint">{date < today ? "No tasks that day." : "No tasks yet."}</p>}
    </section>
  );
}

function MenuButton({ icon: Icon, label, onClick, alert }: { icon: typeof Redo2; label: string; onClick: () => void; alert?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-8 items-center gap-1.5 border px-2.5 text-[12.5px] font-medium transition-colors",
        alert ? "border-alert/50 text-alert hover:border-alert" : "border-line-2 text-muted-foreground hover:border-muted-foreground hover:text-fg",
      )}
    >
      <Icon className="size-3.5 stroke-[1.75]" aria-hidden />
      {label}
    </button>
  );
}

function Sub({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <span className="flex items-center justify-between text-[12px] text-faint">
      {title}
      <button type="button" onClick={onClose} aria-label="Cancel" className="-my-2 -mr-1 grid size-8 place-items-center hover:text-fg">
        <X className="size-3.5 stroke-[1.75]" aria-hidden />
      </button>
    </span>
  );
}
