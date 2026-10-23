"use client";

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown, Flag, Hourglass, RotateCcw } from "lucide-react";
import { cn } from "cn";
import { Progress } from "@/components/progress";
import { SubjectMarker } from "@/components/subject-marker";
import { marksTop, phaseDays, position, rangeLabel, type Phase, type Position, type Roadmap, type Status } from "@/lib/roadmap/format";
import { leg, pathOf, walked, type Pt } from "@/lib/roadmap/path";
import { daysBetween } from "@/lib/time";

type Subjects = Record<string, { short: string; colour: string }>;
type Props = { roadmap: Roadmap; today: string; examDate: string | null; examDays: number | null; subjects: Subjects };

const EASE = [0.2, 0.7, 0.2, 1] as const;

/**
 * The roadmap (brain/roadmap.json): where today sits, the daily routine, then every block as a node
 * on a line that zig-zags down the page, walked in mint up to today. Tap a block for its topics.
 */
export function RoadmapView({ roadmap, today, examDate, examDays, subjects }: Props) {
  const pos = useMemo(() => position(roadmap.phases, today), [roadmap.phases, today]);
  const now = pos.current === null ? null : roadmap.phases[pos.current];
  const { phases } = roadmap;

  return (
    <>
      <header className="grid gap-4">
        <div className="flex items-end justify-between gap-3">
          <h1 className="display">Roadmap</h1>
          {examDays !== null && (
            <div className="grid justify-items-end gap-1">
              <span className="num text-[30px] leading-none font-bold">{examDays}</span>
              <span className="label">days to GATE</span>
            </div>
          )}
        </div>
        {now && (
          <div className="grid gap-1">
            <p className="flex min-w-0 items-center gap-2.5 text-[13.5px]">
              <i aria-hidden className="ring-out relative ml-0.5 size-[7px] flex-none rotate-45 bg-mint text-mint" />
              <span className="truncate font-semibold">{now.title}</span>
              <span className="flex-none text-muted-foreground">
                {pos.daysLeftInBlock} {pos.daysLeftInBlock === 1 ? "day" : "days"} left
              </span>
            </p>
            {(() => {
              const todayDay = now.days.find((d) => d.date === today);
              if (todayDay) {
                return (
                  <p className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
                    <span className="font-semibold text-mint">Today</span>
                    <span>·</span>
                    <span className="truncate text-fg">
                      {todayDay.lectures ? `${todayDay.lectures} lectures: ` : ""}
                      {todayDay.summary ?? todayDay.label}
                    </span>
                  </p>
                );
              }
              const nextDay = now.days.find((d) => d.date && d.date > today);
              if (nextDay) {
                const isTomorrow = daysBetween(today, nextDay.date!) === 1;
                return (
                  <p className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
                    <span className="font-semibold text-mint">{isTomorrow ? "Tomorrow" : rangeLabel(nextDay.date!, nextDay.date!)}</span>
                    <span>·</span>
                    <span className="truncate text-fg">
                      {nextDay.lectures ? `${nextDay.lectures} lectures: ` : ""}
                      {nextDay.summary ?? nextDay.label}
                    </span>
                  </p>
                );
              }
              return null;
            })()}
          </div>
        )}
        <div className="grid gap-1.5">
          <Progress done={pos.elapsed} total={pos.total} label="Roadmap" />
          <div className="label num flex justify-between">
            <span>{rangeLabel(phases[0].start, phases[0].start)}</span>
            <span>
              Day {Math.min(pos.total, pos.elapsed + 1)} of {pos.total}
            </span>
            <span>{rangeLabel(phases.at(-1)!.end, phases.at(-1)!.end)}</span>
          </div>
        </div>
      </header>

      {/* Phone: one column. Laptop: the map on the left, the routine, marks and cut list beside it.
          The side column dissolves on a phone, so `order` keeps the stack. */}
      <div className="grid gap-7 lg:grid-cols-[minmax(0,640px)_minmax(0,1fr)] lg:items-start lg:gap-x-12">
        <div className="contents lg:sticky lg:top-8 lg:col-start-2 lg:row-start-1 lg:grid lg:gap-7">
          {roadmap.daily.length > 0 && (
            <section aria-label="Every day" className="order-1 grid gap-2">
              <h2 className="label">Every day</h2>
              <ul className="grid grid-cols-2 gap-px border border-line bg-line">
                {roadmap.daily.map((d) => (
                  <li key={d.title} className="grid content-start gap-1 bg-void p-3">
                    <span className="font-mono text-[11px] text-faint">{d.time}</span>
                    <span className="text-[13px] leading-snug font-medium">{d.title}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {roadmap.weightage.length > 0 && <Weightage roadmap={roadmap} pos={pos} subjects={subjects} />}

          {roadmap.cut.length > 0 && (
            <section aria-label="If behind" className="order-4 grid gap-2">
              <h2 className="label">If behind, cut in this order</h2>
              <ol className="grid gap-2.5 border-t border-line pt-3">
                {roadmap.cut.map((c, i) => (
                  <li key={c} className="flex gap-3 text-[13.5px] leading-snug text-muted-foreground">
                    <span className="num w-3 flex-none text-faint">{i + 1}</span>
                    {c}
                  </li>
                ))}
              </ol>
              {roadmap.keep && (
                <p className="mt-1 flex gap-3 border-t border-line pt-3 text-[13px] leading-snug">
                  <span className="flex-none font-semibold text-alert">Never cut</span>
                  <span className="text-muted-foreground">{roadmap.keep}</span>
                </p>
              )}
            </section>
          )}
        </div>
        <div className="order-2 min-w-0 lg:col-start-1 lg:row-start-1">
          <ZigZag roadmap={roadmap} pos={pos} today={today} examDate={examDate} examDays={examDays} subjects={subjects} />
        </div>
      </div>
    </>
  );
}

/* ---------- The zig-zag map ---------- */

type Row = { kind: "start" } | { kind: "phase"; i: number } | { kind: "end" };

function ZigZag({ roadmap, pos, today, examDate, examDays, subjects }: Omit<Props, "roadmap"> & { roadmap: Roadmap; pos: Position }) {
  const still = useReducedMotion() ?? false;
  const { phases } = roadmap;
  const rows: Row[] = useMemo(() => [{ kind: "start" }, ...phases.map((_, i) => ({ kind: "phase" as const, i })), { kind: "end" }], [phases]);

  const box = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLElement | null)[]>([]);
  const panels = useRef<(HTMLElement | null)[]>([]);
  const [pts, setPts] = useState<{ node: Pt; via: Pt | null }[] | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [open, setOpen] = useState<Set<number>>(() => new Set(pos.current === null ? [] : [pos.current]));

  // Node centres, and under an open block the point where the line clears its panel (it drops
  // straight down beside the panel first). Re-measured whenever the map changes size: a block opening
  // or closing (every frame of it), rotation.
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const b = el.getBoundingClientRect();
      const next = rows.map((_, r) => {
        const n = nodes.current[r]?.getBoundingClientRect();
        const node = n ? { x: n.left + n.width / 2 - b.left, y: n.top + n.height / 2 - b.top } : { x: 0, y: 0 };
        const p = panels.current[r]?.getBoundingClientRect();
        return { node, via: p && p.height > 1 ? { x: node.x, y: p.bottom - b.top } : null };
      });
      setPts(next);
      setSize({ w: b.width, h: b.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [rows]);

  // Leg k joins row k to row k+1. Block i runs from row i+1 to row i+2, so today sits on leg
  // current+1, `through` of the way along.
  const legs = pts ? pts.slice(1).map((p, k) => leg(pts[k].node, p.node, pts[k].via)) : [];
  const allDone = pos.status.every((s) => s === "done");
  const whole = pos.current !== null ? pos.current + 1 : allDone ? legs.length : 0;
  const trail = walked(legs, whole, pos.current !== null ? pos.through : 0);
  const you = pos.current !== null && trail.length ? trail[trail.length - 1][3] : null;

  const toggle = (i: number) =>
    setOpen((s) => {
      const n = new Set(s);
      if (!n.delete(i)) n.add(i);
      return n;
    });

  const doneShorts = roadmap.done.map((k) => subjects[k]?.short ?? k);

  return (
    <section aria-label="Blocks" className="relative" ref={box}>
      {pts && (
        <svg aria-hidden className="pointer-events-none absolute top-0 left-0 z-0" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
          <motion.path
            d={pathOf(legs.flat())}
            fill="none"
            stroke="var(--line-2)"
            strokeWidth={2}
            strokeDasharray="4 6"
            initial={still ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          {trail.length > 0 && (
            <motion.path
              d={pathOf(trail)}
              fill="none"
              stroke="var(--mint)"
              strokeWidth={3}
              initial={still ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.3, delay: 0.25, ease: EASE }}
            />
          )}
        </svg>
      )}
      {you && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: you.x, top: you.y }}
          initial={still ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 18, delay: still ? 0 : 1.45 }}
        >
          <i className="ring-out relative block size-[11px] rotate-45 border-2 border-void bg-mint text-mint" />
        </motion.span>
      )}

      <ol className="relative z-10 grid gap-11">
        {rows.map((row, r) => {
          const side = r % 2 ? "right" : "left";
          const ref = (el: HTMLElement | null) => {
            nodes.current[r] = el;
          };
          if (row.kind === "start") {
            return (
              <li key="start">
                <Line side={side} still={still}>
                  <Tile nodeRef={ref} status="done" still={still}>
                    <span className="flex gap-1">
                      {roadmap.done.map((k) => (
                        <SubjectMarker key={k} colour={subjects[k]?.colour} />
                      ))}
                    </span>
                    <span className="font-display text-[14px] leading-none font-bold">Done</span>
                  </Tile>
                  <Info side={side} still={still}>
                    <span className="font-mono text-[11.5px] text-faint">Before {rangeLabel(phases[0].start, phases[0].start)}</span>
                    <span className="font-display text-[17px] leading-tight font-semibold text-muted-foreground">{doneShorts.join(" · ") || "Start"}</span>
                    <span className="text-[12.5px] text-mint">Studied</span>
                  </Info>
                </Line>
              </li>
            );
          }
          if (row.kind === "end") {
            return (
              <li key="end">
                <Line side={side} still={still}>
                  <Tile nodeRef={ref} status={allDone ? "now" : "next"} edge="var(--fg)" still={still}>
                    <Flag className="size-5 stroke-[1.75]" aria-hidden />
                    <span className="font-display text-[14px] leading-none font-bold">GATE</span>
                  </Tile>
                  <Info side={side} still={still}>
                    {examDate && <span className="font-mono text-[11.5px] text-faint">{rangeLabel(examDate, examDate)}</span>}
                    <span className="font-display text-[17px] leading-tight font-semibold">The exam</span>
                    {examDays !== null && <span className="text-[12.5px] text-muted-foreground">{examDays === 0 ? "Today" : `${examDays} ${examDays === 1 ? "day" : "days"} left`}</span>}
                  </Info>
                </Line>
              </li>
            );
          }
          const p = phases[row.i];
          const isNow = pos.status[row.i] === "now";
          const todayInPhase = isNow ? p.days.find((d) => d.date === today) : null;
          const nextInPhase = isNow && !todayInPhase ? p.days.find((d) => d.date && d.date > today) : null;
          return (
            <li key={`${p.start}-${p.title}`} className="grid gap-3">
              <Line side={side} still={still}>
                <Tile nodeRef={ref} status={pos.status[row.i]} still={still}>
                  <PhaseMark phase={p} last={row.i === phases.length - 1} subjects={subjects} />
                  <span className={cn("font-display text-[14px] leading-none font-bold", pos.status[row.i] === "next" && "text-muted-foreground")}>{p.short}</span>
                  <span className="font-mono text-[10.5px] leading-none text-faint">{phaseDays(p)}d</span>
                </Tile>
                <Info side={side} still={still} onClick={() => toggle(row.i)} expanded={open.has(row.i)}>
                  <span className="font-mono text-[11.5px] text-faint">
                    {rangeLabel(p.start, p.end)} · {phaseDays(p)} days
                  </span>
                  <span className={cn("font-display text-[17px] leading-tight font-semibold text-balance", pos.status[row.i] === "done" && "text-muted-foreground")}>{p.title}</span>
                  <span className="flex items-center gap-2 text-[12.5px]">
                    <StatusText status={pos.status[row.i]} phase={p} today={today} pos={pos} />
                    {p.marks && <span className="text-muted-foreground">· {p.marks} marks</span>}
                    <ChevronDown className={cn("size-4 stroke-[1.75] text-faint transition-transform duration-300", open.has(row.i) && "rotate-180")} aria-hidden />
                  </span>
                  {todayInPhase && (
                    <span className="text-[12px] font-medium text-mint">
                      Today: {todayInPhase.lectures ? `${todayInPhase.lectures} lecs · ` : ""}{todayInPhase.summary ?? todayInPhase.label}
                    </span>
                  )}
                  {nextInPhase && (
                    <span className="text-[12px] font-medium text-mint">
                      {daysBetween(today, nextInPhase.date!) === 1 ? "Tomorrow" : rangeLabel(nextInPhase.date!, nextInPhase.date!)}: {nextInPhase.lectures ? `${nextInPhase.lectures} lecs · ` : ""}{nextInPhase.summary ?? nextInPhase.label}
                    </span>
                  )}
                </Info>
              </Line>
              <AnimatePresence initial={false}>
                {open.has(row.i) && (
                  <Details
                    key="d"
                    phase={p}
                    today={today}
                    side={side}
                    still={still}
                    panelRef={(el) => {
                      panels.current[r] = el;
                    }}
                  />
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Line({ side, still, children }: { side: "left" | "right"; still: boolean; children: ReactNode }) {
  return (
    <motion.div
      className={cn("flex items-center gap-4", side === "right" && "flex-row-reverse")}
      initial={still ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
    >
      {children}
    </motion.div>
  );
}

function Tile({ nodeRef, status, edge, still, children }: { nodeRef: (el: HTMLElement | null) => void; status: Status; edge?: string; still: boolean; children: ReactNode }) {
  const style = {
    "--cut": "12px",
    "--cut-edge": edge ?? (status === "next" ? "var(--line-2)" : "var(--mint)"),
    "--cut-fill": status === "now" ? "var(--raised-2)" : "var(--raised)",
  } as CSSProperties;
  return (
    <motion.div
      ref={nodeRef}
      className="relative size-16 flex-none"
      variants={{ hidden: { scale: 0.3, opacity: 0, rotate: -35 }, shown: { scale: 1, opacity: 1, rotate: 0 } }}
      transition={{ type: "spring", stiffness: 360, damping: 20 }}
    >
      {status === "now" && !still && (
        <motion.span
          aria-hidden
          className="absolute inset-0 border-[1.5px] border-mint"
          animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: [0.2, 0.7, 0.3, 1] }}
        />
      )}
      <div className="cut grid size-full content-center justify-items-center gap-1.5" style={style}>
        {children}
      </div>
      {status === "done" && (
        <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center bg-mint text-act-ink">
          <Check className="size-3.5 stroke-[3]" aria-hidden />
        </span>
      )}
    </motion.div>
  );
}

function Info({ side, still, onClick, expanded, children }: { side: "left" | "right"; still: boolean; onClick?: () => void; expanded?: boolean; children: ReactNode }) {
  const cls = cn("grid min-w-0 flex-1 gap-1 py-1", side === "right" ? "justify-items-end text-right" : "justify-items-start text-left");
  const variants = { hidden: { opacity: 0, x: side === "left" ? 24 : -24 }, shown: { opacity: 1, x: 0 } };
  const transition = { duration: still ? 0 : 0.45, ease: EASE, delay: still ? 0 : 0.08 };
  return onClick ? (
    <motion.button type="button" onClick={onClick} aria-expanded={expanded} className={cls} variants={variants} transition={transition}>
      {children}
    </motion.button>
  ) : (
    <motion.div className={cls} variants={variants} transition={transition}>
      {children}
    </motion.div>
  );
}

function PhaseMark({ phase, last, subjects }: { phase: Phase; last: boolean; subjects: Subjects }) {
  if (phase.subject) return <SubjectMarker colour={subjects[phase.subject]?.colour} />;
  const Icon = last ? Hourglass : RotateCcw;
  return <Icon className="size-3.5 stroke-[2] text-muted-foreground" aria-hidden />;
}

function StatusText({ status, phase, today, pos }: { status: Status; phase: Phase; today: string; pos: Position }) {
  if (status === "done") return <span className="text-mint">Done</span>;
  if (status === "now")
    return (
      <span className="font-semibold text-mint">
        {pos.daysLeftInBlock} {pos.daysLeftInBlock === 1 ? "day" : "days"} left
      </span>
    );
  const n = daysBetween(today, phase.start);
  return <span className="text-faint">in {n === 1 ? "1 day" : `${n} days`}</span>;
}

function Details({ phase, today, side, still, panelRef }: { phase: Phase; today: string; side: "left" | "right"; still: boolean; panelRef: (el: HTMLElement | null) => void }) {
  const item = (i: number) => ({
    initial: still ? false : { opacity: 0, x: -8 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.25, delay: still ? 0 : 0.08 + i * 0.04 },
  });
  return (
    <motion.div
      ref={panelRef}
      className={cn("overflow-hidden", side === "left" ? "ml-16" : "mr-16")}
      initial={still ? false : { height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={still ? undefined : { height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="cut grid gap-4 px-4 pt-4 pb-[18px]" style={{ "--cut": "12px", "--cut-fill": "var(--panel)" } as CSSProperties}>
        {phase.days.length > 0 && (
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h3 className="label">Day by day</h3>
              <span className="font-mono text-[11px] text-faint">
                {(() => {
                  const total = phase.days.filter((d) => typeof d.lectures === "number").reduce((s, d) => s + (d.lectures ?? 0), 0);
                  return total > 0 ? `${total} lectures scheduled` : "";
                })()}
              </span>
            </div>
            <ul className="grid gap-1.5 border border-line bg-void p-2.5">
              {phase.days.map((d, i) => {
                const isToday = d.date === today;
                const isPast = d.date ? d.date < today : false;
                const isTomorrow = d.date ? daysBetween(today, d.date) === 1 : false;
                return (
                  <li
                    key={d.label + i}
                    className={cn(
                      "flex items-start justify-between gap-2 border-b border-line/50 pb-2 pt-1 last:border-none last:pb-0",
                      isToday ? "font-medium text-mint" : isPast ? "text-faint opacity-60" : "text-fg",
                    )}
                  >
                    <div className="grid min-w-0 gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className={cn("font-mono text-[11.5px] font-semibold", isToday ? "text-mint" : isPast ? "text-faint" : "text-fg")}>
                          {d.date ? rangeLabel(d.date, d.date) : d.label.split("·")[0].trim()}
                        </span>
                        {isToday && (
                          <span className="border border-mint/40 bg-mint/15 px-1 py-px font-sans text-[9.5px] font-semibold uppercase tracking-wider text-mint">
                            Today
                          </span>
                        )}
                        {isTomorrow && (
                          <span className="border border-line-2 bg-raised px-1 py-px font-sans text-[9.5px] font-medium uppercase tracking-wider text-muted-foreground">
                            Tomorrow
                          </span>
                        )}
                        {isPast && (
                          <span className="font-mono text-[10px] text-faint">
                            done
                          </span>
                        )}
                      </div>
                      <span className={cn("text-[12.5px] leading-snug", isPast ? "text-faint" : isToday ? "font-medium text-fg" : "text-muted-foreground")}>
                        {d.summary ?? (d.date ? d.label.replace(/^.*?·\s*/, "") : d.label)}
                      </span>
                    </div>
                    {typeof d.lectures === "number" && (
                      <span
                        className={cn(
                          "flex-none border px-1.5 py-0.5 font-mono text-[11px]",
                          isToday ? "border-mint font-semibold text-mint" : "border-line text-faint",
                        )}
                      >
                        {d.lectures} lec{d.lectures === 1 ? "" : "s"}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {phase.focus.length > 0 && (
          <div className={cn("grid gap-2.5", phase.days.length > 0 && "border-t border-line pt-3.5")}>
            <h3 className="label">Do first</h3>
            <ul className="grid gap-2.5">
              {phase.focus.map((f, i) => (
                <motion.li key={f.text} className="flex gap-2.5 text-[13.5px] leading-snug" {...item(i)}>
                  <span aria-hidden className={cn("mt-[0.5em] size-[5px] flex-none", f.top ? "bg-fg" : "bg-faint")} />
                  <span className={f.top ? "text-fg" : "text-muted-foreground"}>
                    {f.text}
                    {f.top && <span className="ml-2 border border-line-2 px-1 py-px align-[1px] font-mono text-[10px] text-muted-foreground">top</span>}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
        {phase.skip.length > 0 && (
          <div className="grid gap-2 border-t border-line pt-3.5">
            <h3 className="label">Skim or skip</h3>
            <ul className="grid gap-1.5">
              {phase.skip.map((s, i) => (
                <motion.li key={s} className="flex gap-2.5 text-[13px] leading-snug text-faint" {...item(phase.focus.length + i)}>
                  <span aria-hidden className="mt-[0.62em] h-px w-[7px] flex-none bg-faint" />
                  {s}
                </motion.li>
              ))}
            </ul>
          </div>
        )}
        {phase.note && <p className="border-t border-line pt-3.5 text-[13px] leading-snug text-muted-foreground">{phase.note}</p>}
      </div>
    </motion.div>
  );
}

/* ---------- Marks per paper ---------- */

function Weightage({ roadmap, pos, subjects }: { roadmap: Roadmap; pos: Position; subjects: Subjects }) {
  const still = useReducedMotion() ?? false;
  const covered = new Set([...roadmap.done, ...roadmap.phases.filter((_, i) => pos.status[i] === "done").map((p) => p.subject)]);
  const max = Math.max(...roadmap.weightage.map((w) => marksTop(w.marks)), 1);
  return (
    <section aria-label="Marks per paper" className="order-3 grid gap-2">
      <h2 className="label">Marks per paper</h2>
      <ul className="grid border-t border-line">
        {roadmap.weightage.map((w, i) => {
          const done = covered.has(w.subject);
          return (
            <li key={w.subject} className="grid min-h-10 grid-cols-[70px_1fr_44px] items-center gap-3 border-b border-line text-[13px]">
              <span className="flex min-w-0 items-center gap-2">
                <SubjectMarker colour={subjects[w.subject]?.colour} />
                <span className={cn("truncate", done ? "text-fg" : "text-muted-foreground")}>{w.label ?? subjects[w.subject]?.short ?? w.subject}</span>
              </span>
              <span className="relative h-[5px] bg-raised-2">
                <motion.i
                  className={cn("absolute inset-y-0 left-0", done ? "bg-mint" : "bg-faint")}
                  initial={still ? false : { width: "0%" }}
                  whileInView={{ width: `${(marksTop(w.marks) / max) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: still ? 0 : i * 0.04, ease: EASE }}
                  style={still ? { width: `${(marksTop(w.marks) / max) * 100}%` } : undefined}
                />
              </span>
              <span className="num text-right text-[13px] font-semibold">{w.marks}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
