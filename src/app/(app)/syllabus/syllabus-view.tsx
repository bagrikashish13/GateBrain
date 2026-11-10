"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "motion/react";
import { Check, ChevronRight, Route } from "lucide-react";
import { cn } from "cn";
import { Fold } from "@/components/fold";
import { Progress } from "@/components/progress";
import { SubjectMarker } from "@/components/subject-marker";
import { GRAND_PART, type NextView, type SyllabusTree, type TrackView, type TreeItem, type TreePart, type TreeTest, type TreeUnit } from "@/lib/syllabus/tree";
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
const behind = (days: number) => (days === 1 ? "1 day behind" : `${days} days behind`);
const unitsOf = (part: TreePart) => part.steps.filter((s): s is TreeUnit => s.type === "unit");
const testsOf = (part: TreePart) => part.steps.filter((s): s is TreeTest => s.type === "test");
const partKey = (part: TreePart) => `${part.track}-${part.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

/** Where a track's next step sits: the part to open, the unit to open (if any), the row to scroll to. */
type Spot = { part: string; unit: string | null; row: string };

function spotOf(tree: SyllabusTree, track: TrackView): Spot | null {
  const part = tree.parts.find((p) => p.track === track.track && p.current);
  const next = track.next;
  if (!part) return null;
  if (next.kind === "teach" || next.kind === "notes") return { part: partKey(part), unit: next.unit, row: `unit-${next.unit}` };
  if (next.kind === "test") {
    const test = testsOf(part).find((t) => next.id === t.id || next.id === `${t.id}-r2`);
    return { part: partKey(part), unit: null, row: test ? `test-${test.id}` : `part-${partKey(part)}` };
  }
  return null;
}

/** What a track is on right now, in a few words (a subject row's "Now" line). */
function nowLine(next: NextView): string | null {
  switch (next.kind) {
    case "teach":
      return `${next.unit} ${next.unitTitle} · ${next.position}/${next.of}`;
    case "notes":
      return `Notes for ${next.unit} ${next.unitTitle}`;
    case "test":
      return { write: `${next.label} ${next.id} is next`, take: `Take ${next.id}`, analyse: `Analyse ${next.id}`, reteach: `Go over what ${next.id} exposed` }[next.state];
    case "finished":
      return null;
  }
}

const toggleIn = (set: Dispatch<SetStateAction<Set<string>>>, id: string) =>
  set((s) => {
    const n = new Set(s);
    if (!n.delete(id)) n.add(id);
    return n;
  });

/** The tracks shown together: each dated track on its own, the untimed ones (OS, DBMS, TOC) as one "Anytime" group. */
type Group = { key: string; name: string; anytime: boolean; tracks: TrackView[] };
function groupsOf(tree: SyllabusTree): Group[] {
  const dated = tree.tracks.filter((t) => !t.anytime).map((t) => ({ key: t.track, name: t.name, anytime: false, tracks: [t] }));
  const anytime = tree.tracks.filter((t) => t.anytime);
  return anytime.length ? [...dated, { key: "anytime", name: "Anytime", anytime: true, tracks: anytime }] : dated;
}

/**
 * Everything to study, in teaching order, on its tracks. On top, what comes next on each track; then every
 * subject as one folded row (what's in it opens on a tap). The map is the whole syllabus at once, one square
 * per topic and one diamond per test, filling in mint; new ticks since the last visit pop in, in order.
 * Ticks are earned with the agent (npm run syllabus -- done), so nothing here can be ticked by hand.
 */
export function SyllabusView({ tree, colours }: { tree: SyllabusTree; colours: Record<string, string> }) {
  const still = useReducedMotion() ?? false;
  const ticks = useMemo(() => tree.parts.flatMap(unitsOf).flatMap((u) => u.items).filter((i) => i.state === "done").map((i) => i.id), [tree]);
  const [fresh, setFresh] = useState<string[]>([]);
  const [countFrom, setCountFrom] = useState(tree.done);
  const [openParts, setOpenParts] = useState<Set<string>>(() => new Set());
  const [openUnits, setOpenUnits] = useState<Set<string>>(() => new Set());

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

  // Open the subject (and unit), then scroll to the row once the subject has finished unfolding: while it
  // grows from zero height there is nowhere to scroll to.
  const reveal = useCallback(
    (spot: Spot) => {
      const unfolding = !still && !openParts.has(spot.part);
      setOpenParts((s) => new Set(s).add(spot.part));
      if (spot.unit) setOpenUnits((s) => new Set(s).add(spot.unit!));
      window.setTimeout(() => document.getElementById(spot.row)?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" }), unfolding ? 320 : 0);
    },
    [still, openParts],
  );
  const pickUnit = useCallback(
    (unit: string) => {
      const part = tree.parts.find((p) => p.steps.some((s) => s.type === "unit" && s.id === unit));
      if (part) reveal({ part: partKey(part), unit, row: `unit-${unit}` });
    },
    [tree, reveal],
  );
  const togglePart = useCallback((id: string) => toggleIn(setOpenParts, id), []);
  const toggleUnit = useCallback((id: string) => toggleIn(setOpenUnits, id), []);
  const groups = useMemo(() => groupsOf(tree), [tree]);
  const trackOfPart = (p: TreePart) => tree.tracks.find((t) => t.track === p.track)!;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)] lg:items-start lg:gap-x-12">
      <div className="grid min-w-0 grid-cols-1 gap-4 lg:sticky lg:top-8">
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

        <div className="grid grid-cols-1 gap-2">
          {groups.map((g) =>
            g.anytime ? (
              <AnytimeCard key={g.key} tracks={g.tracks} tree={tree} colours={colours} onReveal={reveal} />
            ) : (
              <NextCard key={g.key} track={g.tracks[0]} spot={spotOf(tree, g.tracks[0])} onReveal={reveal} />
            ),
          )}
        </div>
        <Stats tree={tree} />
        <Fold
          open={fresh.length > 0}
          className="border-t"
          title={<span className="text-[15px] font-semibold">Map</span>}
          meta={
            <span className="num flex-none text-[12.5px] text-faint">
              {tree.total} topics · {tree.tests.total} tests
            </span>
          }
          bodyClassName="grid grid-cols-1 gap-5 pt-1 pb-4"
        >
          <Wall tree={tree} groups={groups} colours={colours} fresh={fresh} still={still} onPick={pickUnit} />
          <Proof tree={tree} />
        </Fold>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-7">
        {groups.map((g) => (
          <section key={g.key} aria-label={g.name} className="grid grid-cols-1 gap-2">
            <h2 className="flex items-baseline gap-2.5">
              <span className="font-display text-[19px] leading-none font-bold">{g.name}</span>
              <span className="num text-[13px] text-muted-foreground">
                <span className="font-semibold text-fg">{g.tracks.reduce((n, t) => n + t.done, 0)}</span>/{g.tracks.reduce((n, t) => n + t.total, 0)}
              </span>
              <span className="label num ml-auto">{g.anytime ? "No dates" : `${g.tracks[0].hoursLeft}h left`}</span>
            </h2>
            <ol className="grid grid-cols-1 border-t border-line">
              {tree.parts
                .filter((p) => g.tracks.some((t) => t.track === p.track))
                .map((p) => {
                  const t = trackOfPart(p);
                  return (
                    <PartRow
                      key={partKey(p)}
                      part={p}
                      colour={p.subject ? (colours[p.subject] ?? null) : null}
                      now={p.current ? nowLine(t.next) : null}
                      late={p.current && t.next.kind === "teach" ? t.next.late : 0}
                      open={openParts.has(partKey(p))}
                      onToggle={togglePart}
                      openUnits={openUnits}
                      onToggleUnit={toggleUnit}
                      fresh={freshSet}
                      still={still}
                    />
                  );
                })}
            </ol>
          </section>
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

/* ---------- What to do now, per track ---------- */

function NextCard({ track, spot, onReveal }: { track: TrackView; spot: Spot | null; onReveal: (spot: Spot) => void }) {
  const next = track.next;
  const style = { "--cut": "14px", "--cut-edge": "var(--line-2)", "--cut-fill": "var(--raised)" } as CSSProperties;
  const name = <span className="font-semibold text-muted-foreground">{track.name}</span>;
  if (next.kind === "finished") {
    return (
      <div className="cut grid grid-cols-1 gap-1 p-4" style={{ ...style, "--cut-edge": "var(--mint)" } as CSSProperties}>
        <span className="text-[12px] text-faint">{name}</span>
        <span className="font-display text-[17px] font-bold text-mint">All taught, all tested</span>
      </div>
    );
  }
  const open = () => spot && onReveal(spot);
  if (next.kind === "teach") {
    return (
      <button type="button" onClick={open} className="cut grid w-full grid-cols-1 gap-1.5 p-4 text-left" style={style}>
        <span className="flex items-baseline justify-between gap-3 text-[12px] text-faint">
          <span className="min-w-0 truncate">
            {name} · {next.unit} {next.unitTitle}
          </span>
          <span className="num flex-none">
            {next.position}/{next.of}
          </span>
        </span>
        <span className="line-clamp-3 text-[15px] leading-snug font-medium">
          <Rich text={next.item.text} />
        </span>
        {next.late > 0 && <span className="text-[12.5px] text-alert">{behind(next.late)}</span>}
      </button>
    );
  }
  if (next.kind === "notes") {
    return (
      <button type="button" onClick={open} className="cut grid w-full grid-cols-1 gap-1.5 p-4 text-left" style={style}>
        <span className="text-[12px] text-faint">{name}</span>
        <span className="text-[15px] leading-snug font-medium">
          Write the notes for {next.unit} {next.unitTitle}
        </span>
      </button>
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
      <span className="text-[12px] text-faint">
        {name} · {next.id}
      </span>
      <span className="text-[15px] leading-snug font-medium">{line}</span>
      {next.score !== null && <span className="num text-[13px] text-muted-foreground">Scored {pct(next.score)}</span>}
    </>
  );
  const edge = { ...style, "--cut-edge": "var(--fg)" } as CSSProperties;
  return next.state === "take" ? (
    <Link href={`/tests/${next.id}`} className="cut grid grid-cols-1 gap-1.5 p-4" style={edge}>
      {body}
    </Link>
  ) : (
    <button type="button" onClick={open} className="cut grid w-full grid-cols-1 gap-1.5 p-4 text-left" style={edge}>
      {body}
    </button>
  );
}

/** The untimed tracks in one card: one row each, the subject and where it stands; a tap opens it below. */
function AnytimeCard({ tracks, tree, colours, onReveal }: { tracks: TrackView[]; tree: SyllabusTree; colours: Record<string, string>; onReveal: (spot: Spot) => void }) {
  const style = { "--cut": "14px", "--cut-edge": "var(--line-2)", "--cut-fill": "var(--raised)" } as CSSProperties;
  return (
    <div className="cut grid grid-cols-1 px-4 pt-3 pb-1.5" style={style}>
      <span className="flex items-baseline justify-between gap-3 text-[12px] text-faint">
        <span className="font-semibold text-muted-foreground">Anytime</span>
        <span>No dates</span>
      </span>
      <ul className="grid grid-cols-1">
        {tracks.map((t) => {
          const part = tree.parts.find((p) => p.track === t.track && p.title !== GRAND_PART);
          const spot = spotOf(tree, t);
          return (
            <li key={t.track}>
              <button type="button" onClick={() => spot && onReveal(spot)} className="flex min-h-11 w-full items-center gap-2.5 text-left">
                <SubjectMarker colour={part?.subject ? (colours[part.subject] ?? null) : null} />
                <span className="w-11 flex-none text-[13.5px] font-semibold">{t.name}</span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-muted-foreground">{nowLine(t.next) ?? "All taught, all tested"}</span>
                <span className={cn("num flex-none text-[12.5px]", t.done === t.total ? "font-semibold text-mint" : "text-faint")}>
                  {t.done}/{t.total}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Stats({ tree }: { tree: SyllabusTree }) {
  const cells: { label: string; value: ReactNode; on?: boolean; sub?: string }[] = [
    { label: "Today", value: tree.today, on: tree.today > 0, sub: tree.streak > 1 ? `${tree.streak} days in a row` : undefined },
    { label: "Hours left", value: tree.hoursLeft },
    {
      label: "PYQs solved",
      value: (
        <>
          {tree.pyqs.solved}
          <span className="text-[12px] font-medium text-faint">/{tree.pyqs.toSolve}</span>
        </>
      ),
    },
    {
      label: "Tests taken",
      value: (
        <>
          {tree.tests.taken}
          <span className="text-[12px] font-medium text-faint">/{tree.tests.total}</span>
        </>
      ),
    },
  ];
  return (
    <ul className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
      {cells.map((c) => (
        <li key={c.label} className="grid min-w-0 content-start gap-1 bg-void p-3">
          <span className={cn("num text-[20px] leading-none font-bold whitespace-nowrap", c.on && "text-mint")}>{c.value}</span>
          <span className="label">{c.label}</span>
          {c.sub && <span className="text-[11px] leading-tight text-mint">{c.sub}</span>}
        </li>
      ))}
    </ul>
  );
}

/* ---------- The map ---------- */

function Wall({ tree, groups, colours, fresh, still, onPick }: { tree: SyllabusTree; groups: Group[]; colours: Record<string, string>; fresh: string[]; still: boolean; onPick: (unit: string) => void }) {
  const order = useMemo(() => new Map(fresh.map((id, i) => [id, i])), [fresh]);
  return (
    <section aria-label={`${tree.done} of ${tree.total} topics ticked`} className="grid grid-cols-1 gap-5">
      {groups.map((g) => (
        <div key={g.key} className="grid grid-cols-1 gap-3">
          <span className="label">{g.name}</span>
          {tree.parts
            .filter((p) => g.tracks.some((t) => t.track === p.track))
            .map((part) => (
              <div key={partKey(part)} className="grid grid-cols-1 gap-1.5">
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

/* ---------- The subjects ---------- */

function Unfold({ open, still, children }: { open: boolean; still: boolean; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          className="overflow-hidden"
          initial={still ? false : { height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={still ? undefined : { height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PartRow({
  part,
  colour,
  now,
  late,
  open,
  onToggle,
  openUnits,
  onToggleUnit,
  fresh,
  still,
}: {
  part: TreePart;
  colour: string | null;
  now: string | null;
  late: number;
  open: boolean;
  onToggle: (key: string) => void;
  openUnits: Set<string>;
  onToggleUnit: (id: string) => void;
  fresh: Set<string>;
  still: boolean;
}) {
  const key = partKey(part);
  const units = unitsOf(part);
  const tests = testsOf(part);
  const passed = tests.filter((t) => t.state === "passed").length;
  const finished = part.total > 0 ? part.done === part.total : tests.length > 0 && passed === tests.length;
  return (
    <li id={`part-${key}`} className="scroll-mt-4 border-b border-line">
      <button type="button" onClick={() => onToggle(key)} aria-expanded={open} className="flex min-h-14 w-full items-center gap-3 py-3 text-left transition-colors hover:bg-raised/60">
        {part.total > 0 ? (
          <SubjectMarker colour={colour} className="size-[9px]" />
        ) : (
          <span aria-hidden className="mx-px size-[7px] flex-none rotate-45 border border-line-2" />
        )}
        <span className="grid min-w-0 flex-1 grid-cols-1 gap-1.5">
          <span className="flex min-w-0 items-center gap-2">
            <span className={cn("min-w-0 truncate text-[15px] leading-snug font-semibold", finished && "text-muted-foreground")}>{part.title}</span>
            {finished && <Check className="size-4 flex-none stroke-[3] text-mint" aria-hidden />}
          </span>
          {part.total > 0 && !finished && <Progress done={part.done} total={part.total} label={`${part.title}: ${part.done} of ${part.total}`} />}
          {now && (
            <span className="flex min-w-0 gap-1.5 text-[12.5px]">
              <span className="flex-none font-semibold text-fg">Now</span>
              <span className="min-w-0 truncate text-muted-foreground">{now}</span>
              {late > 0 && <span className="flex-none text-alert">{behind(late)}</span>}
            </span>
          )}
        </span>
        <span className={cn("num flex-none text-[13px]", finished ? "font-semibold text-mint" : "text-faint")}>
          {part.total > 0 ? `${part.done}/${part.total}` : `${passed}/${tests.length}`}
        </span>
        <ChevronRight className={cn("size-4 flex-none stroke-[1.75] text-faint transition-transform duration-200", open && "rotate-90 text-fg")} aria-hidden />
      </button>
      <Unfold open={open} still={still}>
        <div className="grid grid-cols-1 gap-1.5 pb-3 pl-[21px]">
          <p className="label num flex flex-wrap gap-x-3">
            {units.length > 0 && <span>{units.length === 1 ? "1 unit" : `${units.length} units`}</span>}
            {tests.length > 0 && <span>{tests.length === 1 ? "1 test" : `${tests.length} tests`}</span>}
            {part.hours > 0 && (
              <span>
                {Math.ceil(part.hoursLeft * 2) / 2}h left of {part.hours}h
              </span>
            )}
          </p>
          <ol className="grid grid-cols-1 border-t border-line">
            {part.steps.map((step) =>
              step.type === "unit" ? (
                <UnitRow key={step.id} unit={step} open={openUnits.has(step.id)} onToggle={onToggleUnit} fresh={fresh} still={still} />
              ) : (
                <TestRow key={step.id} test={step} />
              ),
            )}
          </ol>
        </div>
      </Unfold>
    </li>
  );
}

function UnitRow({ unit, open, onToggle, fresh, still }: { unit: TreeUnit; open: boolean; onToggle: (id: string) => void; fresh: Set<string>; still: boolean }) {
  const isDone = unit.state === "done";
  return (
    <li id={`unit-${unit.id}`} className="scroll-mt-4 border-b border-line last:border-b-0">
      <button type="button" onClick={() => onToggle(unit.id)} aria-expanded={open} className="flex min-h-13 w-full items-center gap-3 py-2.5 text-left">
        <UnitMark unit={unit} />
        <span className="grid min-w-0 flex-1 grid-cols-1 gap-1">
          <span className={cn("text-[14px] leading-snug font-medium", isDone && "text-muted-foreground")}>
            <span className="num mr-1.5 text-faint">{unit.id}</span>
            {unit.title}
          </span>
          {unit.state === "now" && <Progress done={unit.done} total={unit.total} label={`${unit.id}: ${unit.done} of ${unit.total}`} />}
        </span>
        <span className={cn("num flex-none text-[13px]", isDone ? "font-semibold text-mint" : "text-faint")}>
          {unit.done}/{unit.total}
        </span>
        <ChevronRight className={cn("size-4 flex-none stroke-[1.75] text-faint transition-transform duration-200", open && "rotate-90 text-fg")} aria-hidden />
      </button>
      <Unfold open={open} still={still}>
        <UnitBody unit={unit} fresh={fresh} still={still} />
      </Unfold>
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
  if (unit.state === "now") return <span aria-hidden className="mx-1.5 size-2 flex-none rotate-45 bg-act" />;
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
    <div className="grid grid-cols-1 gap-4 pt-1 pb-4">
      <p className="label num flex flex-wrap gap-x-3">
        <span>{unit.hours}h</span>
        {unit.by && <span>By {shortDay(unit.by)}</span>}
        {unit.late > 0 && <span className="text-alert">{behind(unit.late)}</span>}
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
    later: test.by ? `By ${shortDay(test.by)}` : `After ${test.covers.at(-1)}`,
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
          "mx-[5px] block size-2.5 flex-none rotate-45",
          test.state === "passed" ? "bg-mint" : below ? "bg-alert" : test.state === "later" ? "border border-line-2" : "bg-act",
        )}
      />
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className={cn("text-[13.5px] leading-snug font-semibold", test.state === "later" && "font-medium text-muted-foreground")}>{test.label}</span>
        <span className="flex flex-wrap gap-x-2 text-[11.5px] text-faint">
          <span className="num">{test.id}</span>
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
    <li id={`test-${test.id}`} className="scroll-mt-4 border-b border-line last:border-b-0">
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
