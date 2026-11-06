"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown, Route } from "lucide-react";
import { cn } from "cn";
import { Progress } from "@/components/progress";
import { SubjectMarker } from "@/components/subject-marker";
import type { NextView, SyllabusTree, TreeItem, TreePart, TreeTest, TreeUnit } from "@/lib/syllabus/tree";
import { syncAction } from "../actions";

const EASE = [0.2, 0.7, 0.2, 1] as const;
const SEEN_KEY = "gatebrain.syllabus.ticks";
const PULSE_MS = 60_000;

/** Backticks in a syllabus line are code. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 ? (
          <code key={i} className="font-mono text-[0.9em] text-fg">
            {part}
          </code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

const shortDay = (day: string) => new Date(`${day}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const pct = (x: number) => `${Math.round(x * 100)}%`;
const unitsOf = (part: TreePart) => part.steps.filter((s): s is TreeUnit => s.type === "unit");

/**
 * Everything to study, in teaching order. The wall at the top is the whole syllabus at once, one square
 * per topic and one diamond per test, filling in mint. New ticks since the last visit pop in, in order.
 * Ticks are earned with the agent (npm run syllabus -- done), so nothing here can be ticked by hand.
 */
export function SyllabusView({ tree, colours }: { tree: SyllabusTree; colours: Record<string, string> }) {
  const still = useReducedMotion() ?? false;
  const ticks = useMemo(() => tree.parts.flatMap(unitsOf).flatMap((u) => u.items).filter((i) => i.state === "done").map((i) => i.id), [tree]);
  const [fresh, setFresh] = useState<string[]>([]);
  const [countFrom, setCountFrom] = useState(tree.done);
  const [open, setOpen] = useState<Set<string>>(() => new Set(tree.next.kind === "teach" || tree.next.kind === "notes" ? [tree.next.unit] : []));

  // What is new since the last time this device looked. The first visit celebrates nothing.
  useEffect(() => {
    let before: string[] | null = null;
    try {
      const raw = localStorage.getItem(SEEN_KEY);
      before = raw ? (JSON.parse(raw) as string[]) : null;
      localStorage.setItem(SEEN_KEY, JSON.stringify(ticks));
    } catch {
      return;
    }
    if (!before) return;
    const known = new Set(before);
    const added = ticks.filter((id) => !known.has(id));
    if (!added.length) return;
    requestAnimationFrame(() => {
      setCountFrom(ticks.length - added.length);
      setFresh(added);
    });
  }, [ticks]);

  // Ticks arrive through GitHub: look for them while the tab is open and in front.
  useEffect(() => {
    const look = () => {
      if (document.visibilityState === "visible") void syncAction().catch(() => undefined);
    };
    const timer = setInterval(look, PULSE_MS);
    document.addEventListener("visibilitychange", look);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", look);
    };
  }, []);

  const freshSet = useMemo(() => new Set(fresh), [fresh]);
  const finishedNow = useMemo(() => tree.parts.flatMap(unitsOf).filter((u) => u.state === "done" && u.items.some((i) => freshSet.has(i.id))), [tree, freshSet]);

  const openUnit = useCallback((id: string) => {
    setOpen((s) => new Set(s).add(id));
    requestAnimationFrame(() => document.getElementById(`unit-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, []);
  const toggle = useCallback((id: string) => {
    setOpen((s) => {
      const n = new Set(s);
      if (!n.delete(id)) n.add(id);
      return n;
    });
  }, []);

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)] lg:items-start lg:gap-x-12">
      <div className="grid gap-5 lg:sticky lg:top-8">
        <header className="relative flex items-end justify-between gap-3">
          <div className="grid gap-2.5">
            <h1 className="display">Syllabus</h1>
            <Link href="/roadmap" className="flex w-fit items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-fg">
              <Route className="size-3.5 stroke-[1.75]" aria-hidden />
              Roadmap
            </Link>
          </div>
          <div className="relative grid justify-items-end gap-1">
            <span className="num text-[44px] leading-none font-bold">
              <CountUp from={countFrom} to={tree.done} still={still} />
              <span className="text-[20px] font-medium text-faint">/{tree.total}</span>
            </span>
            <span className="label">{pct(tree.done / Math.max(1, tree.total))} of everything</span>
            {finishedNow.length > 0 && !still && <Burst />}
          </div>
        </header>

        <Wall tree={tree} colours={colours} fresh={fresh} still={still} onPick={openUnit} />

        <AnimatePresence initial={false}>
          {fresh.length > 0 && (
            <motion.p
              key="fresh"
              className="cut flex flex-wrap items-center gap-x-2 gap-y-0.5 px-3.5 py-2.5 text-[13.5px] [--cut:10px]"
              style={{ "--cut-edge": "var(--mint)" } as CSSProperties}
              initial={still ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE, delay: still ? 0 : 0.3 }}
            >
              <Check className="size-4 flex-none stroke-[3] text-mint" aria-hidden />
              <span className="font-semibold">
                {fresh.length} new {fresh.length === 1 ? "tick" : "ticks"}
              </span>
              {finishedNow.map((u) => (
                <span key={u.id} className="font-semibold text-mint">
                  {u.id} complete
                </span>
              ))}
            </motion.p>
          )}
        </AnimatePresence>

        <NextCard next={tree.next} onOpen={openUnit} />
        <Stats tree={tree} />
        <Proof tree={tree} />
      </div>

      <div className="grid min-w-0 gap-8">
        {tree.parts.map((part) => (
          <PartList key={part.title} part={part} colours={colours} open={open} toggle={toggle} fresh={freshSet} still={still} />
        ))}
      </div>
    </div>
  );
}

/* ---------- The count ---------- */

function CountUp({ from, to, still }: { from: number; to: number; still: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (still || from === to || !ref.current) return;
    const node = ref.current;
    const run = animate(from, to, {
      duration: Math.min(1.6, 0.5 + (to - from) * 0.08),
      ease: EASE,
      onUpdate: (v) => {
        node.textContent = String(Math.round(v));
      },
    });
    return () => run.stop();
  }, [from, to, still]);
  return <span ref={ref}>{to}</span>;
}

/** Flat squares flying off the count when a whole unit has just been finished. */
function Burst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const angle = (i / 22) * Math.PI * 2 + (i % 3) * 0.2;
        const reach = 46 + ((i * 37) % 54);
        return { x: Math.cos(angle) * reach, y: Math.sin(angle) * reach * 0.8, size: 4 + (i % 3) * 2, white: i % 4 === 0, delay: (i % 5) * 0.02 };
      }),
    [],
  );
  return (
    <span aria-hidden className="pointer-events-none absolute top-4 right-8">
      {pieces.map((p, i) => (
        <motion.i
          key={i}
          className={cn("absolute block", p.white ? "bg-white" : "bg-mint")}
          style={{ width: p.size, height: p.size }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: 200, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.5 + p.delay, ease: EASE }}
        />
      ))}
    </span>
  );
}

/* ---------- The wall ---------- */

function Wall({ tree, colours, fresh, still, onPick }: { tree: SyllabusTree; colours: Record<string, string>; fresh: string[]; still: boolean; onPick: (unit: string) => void }) {
  const order = useMemo(() => new Map(fresh.map((id, i) => [id, i])), [fresh]);
  return (
    <section aria-label={`${tree.done} of ${tree.total} topics ticked`} className="grid gap-3.5">
      {tree.parts.map((part) => (
        <div key={part.title} className="grid gap-1.5">
          <div className="flex items-center gap-2 text-[12.5px]">
            <SubjectMarker colour={part.subject ? colours[part.subject] : null} />
            <span className="min-w-0 truncate font-medium text-muted-foreground">{part.title}</span>
            {part.total > 0 && (
              <span className={cn("num ml-auto flex-none", part.done === part.total ? "font-semibold text-mint" : "text-faint")}>
                {part.done}/{part.total}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-[2px]">
            {part.steps.map((step) =>
              step.type === "unit" ? (
                <button
                  key={step.id}
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  onClick={() => onPick(step.id)}
                  title={`${step.id} · ${step.title}`}
                  className="contents"
                >
                  {step.items.map((item, i) => (
                    <Cell key={item.id} item={item} last={i === step.items.length - 1} freshAt={order.get(item.id)} still={still} />
                  ))}
                </button>
              ) : (
                <TestMark key={step.id} test={step} />
              ),
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

function Cell({ item, last, freshAt, still }: { item: TreeItem; last: boolean; freshAt: number | undefined; still: boolean }) {
  const base = cn("relative block size-[9px] flex-none cursor-pointer", last && "mr-[5px]");
  if (item.state === "next") return <span className={cn(base, "ring-out bg-act text-mint")} />;
  if (item.state === "done" && freshAt !== undefined && !still) {
    return (
      <span className={cn(base, "bg-raised-2")}>
        <motion.i
          className="absolute inset-0 block bg-mint"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 18, delay: 0.25 + freshAt * 0.05 }}
        />
        <motion.i className="absolute inset-0 block bg-white" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.5, delay: 0.25 + freshAt * 0.05 }} />
      </span>
    );
  }
  return <span className={cn(base, item.state === "done" ? "bg-mint" : item.seen ? "bg-mint-dim" : "bg-raised-2")} />;
}

function TestMark({ test }: { test: TreeTest }) {
  const colour = test.state === "passed" ? "bg-mint" : test.state === "below" ? "bg-alert" : test.state === "later" ? "border border-line-2" : "bg-act";
  return <span title={`${test.id} · ${test.label}`} className={cn("mx-[2px] mr-[6px] block size-[8px] flex-none translate-y-[0.5px] rotate-45", colour)} />;
}

/* ---------- What to do now ---------- */

function NextCard({ next, onOpen }: { next: NextView; onOpen: (unit: string) => void }) {
  const style = { "--cut": "14px", "--cut-edge": "var(--line-2)", "--cut-fill": "var(--raised)" } as CSSProperties;
  if (next.kind === "finished") {
    return (
      <div className="cut grid gap-1 p-4" style={{ ...style, "--cut-edge": "var(--mint)" } as CSSProperties}>
        <span className="font-display text-[19px] font-bold text-mint">All taught, all tested</span>
      </div>
    );
  }
  if (next.kind === "teach") {
    return (
      <button type="button" onClick={() => onOpen(next.unit)} className="cut grid w-full gap-2 p-4 text-left" style={style}>
        <span className="flex items-baseline justify-between gap-3 text-[12px] text-faint">
          <span className="min-w-0 truncate">
            Next · {next.unit} {next.unitTitle}
          </span>
          <span className="num flex-none">
            {next.position}/{next.of}
          </span>
        </span>
        <span className="text-[15px] leading-snug font-medium">
          <Rich text={next.item.text} />
        </span>
        {next.late > 0 && <span className="text-[12.5px] text-alert">{next.late === 1 ? "1 day" : `${next.late} days`} behind</span>}
      </button>
    );
  }
  if (next.kind === "notes") {
    return (
      <div className="cut grid gap-1.5 p-4" style={style}>
        <span className="text-[12px] text-faint">Next</span>
        <span className="text-[15px] leading-snug font-medium">
          Write the notes for {next.unit} {next.unitTitle}
        </span>
      </div>
    );
  }
  const line = {
    write: `${next.label} comes next`,
    take: `Take ${next.label}`,
    analyse: `Analyse ${next.label}`,
    reteach: `Go over what ${next.label} exposed`,
  }[next.state];
  const body = (
    <>
      <span className="text-[12px] text-faint">Next · {next.id}</span>
      <span className="text-[15px] leading-snug font-medium">{line}</span>
      {next.score !== null && <span className="num text-[13px] text-muted-foreground">Scored {pct(next.score)}</span>}
    </>
  );
  const edge = { ...style, "--cut-edge": "var(--fg)" } as CSSProperties;
  return next.state === "take" ? (
    <Link href={`/tests/${next.id}`} className="cut grid gap-1.5 p-4" style={edge}>
      {body}
    </Link>
  ) : (
    <div className="cut grid gap-1.5 p-4" style={edge}>
      {body}
    </div>
  );
}

function Stats({ tree }: { tree: SyllabusTree }) {
  const cells: { label: string; value: ReactNode; on?: boolean }[] = [
    { label: tree.streak > 1 ? `Today · ${tree.streak} days in a row` : "Ticked today", value: tree.today, on: tree.today > 0 },
    { label: "Hours left", value: tree.hoursLeft },
    {
      label: "PYQs solved",
      value: (
        <>
          {tree.pyqs.solved}
          <span className="text-[13px] font-medium text-faint">/{tree.pyqs.toSolve}</span>
        </>
      ),
    },
    {
      label: "Tests taken",
      value: (
        <>
          {tree.tests.taken}
          <span className="text-[13px] font-medium text-faint">/{tree.tests.total}</span>
        </>
      ),
    },
  ];
  return (
    <ul className="grid grid-cols-2 gap-px border border-line bg-line">
      {cells.map((c) => (
        <li key={c.label} className="grid content-start gap-1 bg-void p-3">
          <span className={cn("num text-[22px] leading-none font-bold", c.on && "text-mint")}>{c.value}</span>
          <span className="label">{c.label}</span>
        </li>
      ))}
    </ul>
  );
}

function Proof({ tree }: { tree: SyllabusTree }) {
  const row = (ok: boolean, text: string, detail: string) => (
    <li className="flex items-baseline gap-2 text-[12.5px]">
      <Check className={cn("size-3 flex-none translate-y-[1px] stroke-[3]", ok ? "text-mint" : "text-alert")} aria-hidden />
      <span className={cn("min-w-0", ok ? "text-muted-foreground" : "text-alert")}>{text}</span>
      <span className="num ml-auto flex-none text-faint">{detail}</span>
    </li>
  );
  const orderOk = tree.order.errors === 0;
  return (
    <ul className="grid gap-1.5">
      {row(tree.pyqs.covered === tree.pyqs.indexed, "Every PYQ since 1987 has a place", `${tree.pyqs.covered}/${tree.pyqs.indexed}`)}
      {row(orderOk, orderOk ? "Nothing is used before it is taught" : `${tree.order.errors} uses come before their lesson`, `${tree.order.checks.toLocaleString("en-IN")} checks`)}
    </ul>
  );
}

/* ---------- The full list ---------- */

function PartList({ part, colours, open, toggle, fresh, still }: { part: TreePart; colours: Record<string, string>; open: Set<string>; toggle: (id: string) => void; fresh: Set<string>; still: boolean }) {
  return (
    <section aria-label={part.title} className="grid gap-2.5">
      <h2 className="flex items-center gap-2.5 font-display text-[19px] leading-tight font-bold">
        <SubjectMarker colour={part.subject ? colours[part.subject] : null} className="size-[9px]" />
        <span className="min-w-0">{part.title}</span>
        {part.total > 0 && part.done === part.total && <Check className="size-5 flex-none stroke-[3] text-mint" aria-hidden />}
      </h2>
      {part.total > 0 && <Progress done={part.done} total={part.total} label={`${part.title}: ${part.done} of ${part.total}`} />}
      <ol className="grid border-t border-line">
        {part.steps.map((step) =>
          step.type === "unit" ? (
            <UnitRow key={step.id} unit={step} open={open.has(step.id)} toggle={toggle} fresh={fresh} still={still} />
          ) : (
            <TestRow key={step.id} test={step} />
          ),
        )}
      </ol>
    </section>
  );
}

function UnitRow({ unit, open, toggle, fresh, still }: { unit: TreeUnit; open: boolean; toggle: (id: string) => void; fresh: Set<string>; still: boolean }) {
  const isDone = unit.state === "done";
  return (
    <li id={`unit-${unit.id}`} className="scroll-mt-4 border-b border-line">
      <button type="button" onClick={() => toggle(unit.id)} aria-expanded={open} className="flex min-h-13 w-full items-center gap-3 py-2.5 text-left">
        <UnitMark unit={unit} />
        <span className="grid min-w-0 flex-1 gap-1">
          <span className={cn("text-[14px] leading-snug font-medium", isDone && "text-muted-foreground")}>
            <span className="num mr-1.5 text-faint">{unit.id}</span>
            {unit.title}
          </span>
          {unit.state === "now" && <Progress done={unit.done} total={unit.total} label={`${unit.id}: ${unit.done} of ${unit.total}`} />}
        </span>
        <span className={cn("num flex-none text-[13px]", isDone ? "font-semibold text-mint" : "text-faint")}>
          {unit.done}/{unit.total}
        </span>
        <ChevronDown className={cn("size-4 flex-none stroke-[1.75] text-faint transition-transform duration-300", open && "rotate-180")} aria-hidden />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden"
            initial={still ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={still ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <UnitBody unit={unit} fresh={fresh} still={still} />
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function UnitMark({ unit }: { unit: TreeUnit }) {
  if (unit.state === "done") {
    return (
      <span className="grid size-5 flex-none place-items-center bg-mint text-act-ink">
        <Check className="size-3.5 stroke-[3]" aria-hidden />
      </span>
    );
  }
  if (unit.state === "now") return <span aria-hidden className="ml-[6px] mr-[6px] size-2 flex-none rotate-45 bg-act" />;
  return <span aria-hidden className="size-5 flex-none border border-line-2" />;
}

function UnitBody({ unit, fresh, still }: { unit: TreeUnit; fresh: Set<string>; still: boolean }) {
  const groups: { sub: string | null; items: TreeItem[] }[] = [];
  for (const item of unit.items) {
    const last = groups.at(-1);
    if (last && last.sub === item.subtopic) last.items.push(item);
    else groups.push({ sub: item.subtopic, items: [item] });
  }
  return (
    <div className="grid gap-4 pt-1 pb-4">
      <p className="label num flex flex-wrap gap-x-3">
        <span>{unit.hours}h</span>
        <span>By {shortDay(unit.by)}</span>
        {unit.late > 0 && <span className="text-alert">{unit.late === 1 ? "1 day" : `${unit.late} days`} behind</span>}
        {unit.notesDue && <span className="text-fg">Notes to write</span>}
      </p>
      {groups.map((g, i) => (
        <div key={`${g.sub}-${i}`} className="grid gap-1.5">
          {g.sub && (
            <h3 className="flex items-center justify-between gap-2 text-[12.5px] font-semibold text-muted-foreground">
              <span className="min-w-0">{g.sub}</span>
              <span className={cn("num flex-none font-normal", g.items.every((x) => x.state === "done") ? "text-mint" : "text-faint")}>
                {g.items.filter((x) => x.state === "done").length}/{g.items.length}
              </span>
            </h3>
          )}
          <ul className="grid">
            {g.items.map((item) => (
              <ItemRow key={item.id} item={item} isFresh={fresh.has(item.id)} still={still} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const KIND_TAG: Partial<Record<TreeItem["kind"], string>> = { N: "Never asked yet", L: "Old papers" };

function ItemRow({ item, isFresh, still }: { item: TreeItem; isFresh: boolean; still: boolean }) {
  const isNext = item.state === "next";
  const isDone = item.state === "done";
  return (
    <li className={cn("flex gap-2.5 py-1.5", isNext && "-mx-2 bg-raised px-2")}>
      <TickBox item={item} isFresh={isFresh} still={still} />
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className={cn("text-[13.5px] leading-snug", isDone ? "text-muted-foreground" : isNext ? "font-medium text-fg" : "text-[color:var(--fg-body)]")}>
          <Rich text={item.text} />
        </span>
        <span className="flex flex-wrap items-center gap-x-2 text-[11.5px] text-faint">
          <span className="num">{item.id}</span>
          {item.pyqs > 0 && <span>{item.pyqs === 1 ? "1 PYQ" : `${item.pyqs} PYQs`}</span>}
          {KIND_TAG[item.kind] && <span>{KIND_TAG[item.kind]}</span>}
          {item.seen && <span className="text-mint">One question to tick</span>}
          {isNext && <span className="font-semibold text-fg">Next</span>}
          {item.doneOn && <span>{shortDay(item.doneOn)}</span>}
        </span>
      </span>
    </li>
  );
}

function TickBox({ item, isFresh, still }: { item: TreeItem; isFresh: boolean; still: boolean }) {
  const box = "mt-[1px] grid size-[18px] flex-none place-items-center";
  if (item.state === "done") {
    return (
      <motion.span
        className={cn(box, "bg-mint text-act-ink")}
        initial={isFresh && !still ? { scale: 0.2 } : false}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 480, damping: 15, delay: 0.3 }}
      >
        <Check className="size-3 stroke-[3.5]" aria-hidden />
      </motion.span>
    );
  }
  if (item.state === "next") return <span aria-hidden className={cn(box, "ring-out relative border-2 border-act text-mint")} />;
  if (item.seen) return <span aria-hidden className={cn(box, "border border-dashed border-mint")} />;
  return <span aria-hidden className={cn(box, "border border-line-2")} />;
}

function TestRow({ test }: { test: TreeTest }) {
  const below = test.state === "below";
  const status = {
    later: `By ${shortDay(test.by)}`,
    write: "Due now",
    take: "Ready to take",
    analyse: "Analyse it",
    passed: "Passed",
    below: `Below ${pct(test.pass)}`,
  }[test.state];
  const live = test.state === "write" || test.state === "take" || test.state === "analyse";
  const body = (
    <>
      <span
        aria-hidden
        className={cn(
          "ml-[5px] mr-[5px] block size-2.5 flex-none rotate-45",
          test.state === "passed" ? "bg-mint" : below ? "bg-alert" : test.state === "later" ? "border border-line-2" : "bg-act",
        )}
      />
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className={cn("text-[13.5px] leading-snug font-semibold", test.state === "later" && "font-medium text-muted-foreground")}>{test.label}</span>
        <span className="flex flex-wrap gap-x-2 text-[11.5px] text-faint">
          <span>
            {test.questions} questions, {test.minutes} min
          </span>
          <span className={cn(live && "font-semibold text-fg", below && "text-alert", test.state === "passed" && "text-mint")}>{status}</span>
        </span>
      </span>
      {test.score !== null && (
        <span className={cn("num flex-none text-[15px] font-semibold", below ? "text-alert" : "text-mint")}>
          {pct(test.score)}
          {test.retestScore !== null && <span className="ml-1.5 text-[12px] font-medium text-muted-foreground">then {pct(test.retestScore)}</span>}
        </span>
      )}
    </>
  );
  return (
    <li className="border-b border-line">
      {test.written ? (
        <Link href={`/tests/${test.id}`} className="flex min-h-12 items-center gap-3 py-2">
          {body}
        </Link>
      ) : (
        <div className="flex min-h-12 items-center gap-3 py-2">{body}</div>
      )}
    </li>
  );
}
