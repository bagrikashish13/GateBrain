"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Calculator as CalcIcon, ChevronLeft, ChevronRight, LayoutGrid, LoaderCircle, UserRound, X } from "lucide-react";
import { cn } from "cn";
import { paletteStatus, type PaletteStatus, type QState } from "@/lib/tests/grade";
import { saveExamAction, submitExamAction } from "./actions";
import { Calculator } from "./calculator";

export type ExamQuestion = {
  n: number;
  type: "MCQ" | "MSQ" | "NAT";
  marks: number;
  negative: number;
  section: string;
  subject: string;
  body: React.ReactNode;
  options: { key: string; body: React.ReactNode }[];
};

type Props = {
  id: string;
  title: string;
  questions: ExamQuestion[];
  sections: string[];
  initial: { current: number; states: QState[] };
  deadline: number;
  serverNow: number;
};

const LEGEND: { status: PaletteStatus; label: string }[] = [
  { status: "answered", label: "Answered" },
  { status: "not-answered", label: "Not Answered" },
  { status: "not-visited", label: "Not Visited" },
  { status: "marked", label: "Marked for Review" },
  { status: "answered-marked", label: "Answered & Marked for Review (will be considered for evaluation)" },
];

const NAT_OK = /^-?(?:\d+\.?\d*|\.\d+)$/;
/** 1/3 → "1/3", 2/3 → "2/3", 0.5 → "0.5" */
const fraction = (neg: number) => {
  if (!neg) return "0";
  const thirds = Math.round(neg * 3);
  return Math.abs(neg * 3 - thirds) < 1e-9 && thirds % 3 !== 0 ? `${thirds}/3` : String(Math.round(neg * 100) / 100);
};

/**
 * The exam, as the GATE screen works:
 * - an answer only counts once saved: Save & Next, or Mark for Review & Next. Picking an option and
 *   jumping away through the palette drops it, as in the real exam.
 * - Clear Response removes the saved answer.
 * - NAT answers go in through the on-screen keypad.
 * - the clock is the server's; at zero the paper submits itself.
 * Progress (answers, marks, time per question) is saved to this device every few seconds.
 */
export function ExamScreen({ id, title, questions, sections, initial, deadline, serverNow }: Props) {
  const router = useRouter();
  const [states, setStates] = useState<QState[]>(initial.states);
  const [current, setCurrent] = useState(initial.current);
  const [draft, setDraft] = useState<string | null>(initial.states[initial.current]?.response ?? null);
  const [palette, setPalette] = useState(false);
  const [calc, setCalc] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState<"submit" | "auto" | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Time per question lives in a ref (ticks every second without re-rendering the paper).
  const times = useRef(initial.states.map((s) => s.timeMs));
  const live = useRef({ states, current });
  useEffect(() => {
    live.current = { states, current };
  }, [states, current]);
  const snapshot = useCallback(() => ({ current: live.current.current, states: live.current.states.map((s, i) => ({ ...s, timeMs: times.current[i] })) }), []);

  // Clock skew between this device and the server, so the countdown is the server's.
  const [skew] = useState(() => serverNow - Date.now());

  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === "visible") times.current[live.current.current] += 1000;
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Save: soon after every change, every 15 s for the clock, and when the tab is hidden.
  const done = useRef(false);
  const save = useCallback(() => {
    if (done.current) return;
    void saveExamAction(id, snapshot()).catch(() => undefined);
  }, [id, snapshot]);
  useEffect(() => {
    const t = setTimeout(save, 700);
    return () => clearTimeout(t);
  }, [states, current, save]);
  useEffect(() => {
    const t = setInterval(save, 15_000);
    const onHide = () => document.visibilityState === "hidden" && save();
    document.addEventListener("visibilitychange", onHide);
    return () => (clearInterval(t), document.removeEventListener("visibilitychange", onHide));
  }, [save]);

  const submit = useCallback(
    async (auto: boolean) => {
      if (done.current) return;
      done.current = true;
      setBusy(auto ? "auto" : "submit");
      setError(null);
      const r = await submitExamAction(id, snapshot(), auto).catch(() => ({ ok: false as const, error: "Couldn't reach the app. Try Submit again." }));
      if (r.ok) {
        router.replace(r.url);
        return;
      }
      done.current = false;
      setBusy(null);
      setError(r.error);
    },
    [id, router, snapshot],
  );

  const q = questions[current];
  const section = q.section;
  const inSection = useMemo(() => questions.map((x, i) => ({ x, i })).filter(({ x }) => x.section === section), [questions, section]);

  /** Apply a change to the question on screen, then go to `to` (it becomes visited). */
  const act = (patch: ((s: QState) => QState) | null, to: number | null) => {
    const next = states.slice();
    if (patch) next[current] = patch(next[current]);
    if (to !== null && to !== current) next[to] = { ...next[to], visited: true, visits: next[to].visits + 1 };
    setStates(next);
    if (to !== null) {
      setCurrent(to);
      setDraft(next[to].response);
      setPalette(false);
      document.getElementById("exam-question")?.scrollTo({ top: 0 });
    } else setDraft(next[current].response);
  };
  const nextIndex = (current + 1) % questions.length;
  const saved = (d: string | null) => {
    const r = d?.trim() ?? "";
    if (!r) return null;
    if (q.type === "NAT") return NAT_OK.test(r) ? r : null;
    return r;
  };

  const counts = (list: { i: number }[]) => {
    const c: Record<PaletteStatus, number> = { "not-visited": 0, "not-answered": 0, answered: 0, marked: 0, "answered-marked": 0 };
    for (const { i } of list) c[paletteStatus(states[i])] += 1;
    return c;
  };
  const all = useMemo(() => questions.map((_, i) => ({ i })), [questions]);

  return (
    <div className="exam fixed inset-0 z-50 flex flex-col overflow-hidden text-[14px]">
      {/* Top bar */}
      <header className="flex h-12 flex-none items-center gap-3 bg-[var(--ex-head)] px-3 text-white sm:px-4">
        <span className="flex-none border border-white/60 px-1.5 py-0.5 text-[12px] font-bold tracking-wide">GATE</span>
        <span className="min-w-0 flex-1 truncate text-[14.5px] font-semibold">{title}</span>
        <button type="button" onClick={() => setCalc((c) => !c)} aria-pressed={calc} className="flex h-8 flex-none items-center gap-1.5 border border-white/40 px-2.5 text-[13px] hover:bg-white/10">
          <CalcIcon className="size-4" aria-hidden />
          <span className="hidden sm:inline">Calculator</span>
        </button>
      </header>

      {/* Sections + time */}
      <div className="flex h-11 flex-none items-center gap-2 border-b border-[var(--ex-line)] bg-[var(--ex-bar)] pl-2 sm:pl-3">
        <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {sections.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => s !== section && act(null, questions.findIndex((x) => x.section === s))}
              className={cn("h-8 flex-none px-3 text-[13px] font-semibold", s === section ? "bg-[var(--ex-blue)] text-white" : "border border-[var(--ex-line)] bg-white text-[var(--ex-blue)] hover:bg-[#eef4fc]")}
            >
              {s}
            </button>
          ))}
        </div>
        <Countdown deadline={deadline} skew={skew} onEnd={() => void submit(true)} />
        <button type="button" onClick={() => setPalette(true)} className="mr-2 flex h-8 flex-none items-center gap-1.5 border border-[var(--ex-line)] bg-white px-2 text-[13px] font-semibold lg:hidden" aria-label="Question palette">
          <LayoutGrid className="size-4" aria-hidden />
          {current + 1}/{questions.length}
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* The question */}
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-none flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-[var(--ex-line)] px-3 py-2 text-[13px] sm:px-4">
            <span>
              Question Type: <b>{q.type}</b>
            </span>
            <span className="text-[var(--ex-muted)]">
              Marks for correct answer: <b className="text-[var(--ex-answered)]">{q.marks}</b> | Negative Marks: <b className="text-[var(--ex-not-answered)]">{fraction(q.negative)}</b>
            </span>
          </div>
          <div id="exam-question" className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4">
            <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-[var(--ex-line)] pb-2">
              <h1 className="text-[16px] font-bold">Question No. {q.n}</h1>
              <span className="text-[12px] text-[var(--ex-muted)]">{q.subject}</span>
            </div>
            <div className="max-w-[860px]">{q.body}</div>
            <div className="mt-5 max-w-[860px]">
              {q.type === "NAT" ? (
                <NatInput value={draft ?? ""} onChange={(v) => setDraft(v || null)} />
              ) : (
                <Options q={q} draft={draft} onChange={setDraft} />
              )}
            </div>
          </div>
          <footer className="flex flex-none flex-wrap items-center gap-2 border-t border-[var(--ex-line)] bg-[var(--ex-bar)] px-2 py-2 sm:px-3">
            <ExamButton onClick={() => act((s) => ({ ...s, response: saved(draft), marked: true }), nextIndex)}>
              <span className="sm:hidden">Mark & Next</span>
              <span className="hidden sm:inline">Mark for Review & Next</span>
            </ExamButton>
            <ExamButton onClick={() => act((s) => ({ ...s, response: null }), null)}>
              <span className="sm:hidden">Clear</span>
              <span className="hidden sm:inline">Clear Response</span>
            </ExamButton>
            <button
              type="button"
              onClick={() => act((s) => ({ ...s, response: saved(draft), marked: false }), nextIndex)}
              className="ml-auto h-9 bg-[var(--ex-blue)] px-4 text-[13.5px] font-semibold text-white hover:bg-[#245a9c]"
            >
              Save & Next
            </button>
          </footer>
        </main>

        {/* Palette: a column on wide screens, a drawer on phones */}
        <aside className="hidden w-[300px] flex-none border-l border-[var(--ex-line)] bg-[var(--ex-panel)] lg:flex lg:flex-col">
          <Palette states={states} current={current} list={inSection} counts={counts(inSection)} section={section} onPick={(i) => act(null, i)} onSubmit={() => setConfirm(true)} />
        </aside>
        {palette && (
          <div className="fixed inset-0 z-10 flex justify-end bg-black/40 lg:hidden" onClick={() => setPalette(false)}>
            <aside className="flex h-full w-[min(320px,88vw)] flex-col bg-[var(--ex-panel)]" onClick={(e) => e.stopPropagation()}>
              <div className="flex h-11 items-center justify-between border-b border-[var(--ex-line)] px-3">
                <span className="text-[14px] font-semibold">Question Palette</span>
                <button type="button" onClick={() => setPalette(false)} aria-label="Close" className="grid size-9 place-items-center">
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              <Palette states={states} current={current} list={inSection} counts={counts(inSection)} section={section} onPick={(i) => act(null, i)} onSubmit={() => (setPalette(false), setConfirm(true))} />
            </aside>
          </div>
        )}
      </div>

      {calc && <Calculator onClose={() => setCalc(false)} />}

      {confirm && (
        <SubmitDialog
          sections={sections.map((s) => {
            const list = all.filter(({ i }) => questions[i].section === s);
            return { name: s, total: list.length, ...counts(list) };
          })}
          busy={busy === "submit"}
          error={error}
          onCancel={() => (setConfirm(false), setError(null))}
          onSubmit={() => void submit(false)}
        />
      )}

      {busy === "auto" && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-white/90 p-6 text-center">
          <div className="grid justify-items-center gap-3">
            {error ? (
              <>
                <p className="text-[15px] font-semibold text-[var(--ex-not-answered)]">{error}</p>
                <button type="button" onClick={() => void submit(true)} className="h-9 bg-[var(--ex-blue)] px-4 font-semibold text-white">
                  Submit
                </button>
              </>
            ) : (
              <>
                <LoaderCircle className="size-6 animate-spin text-[var(--ex-blue)]" aria-hidden />
                <p className="text-[15px] font-semibold">Time is up. Submitting your answers…</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ExamButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="h-9 border border-[#aab4c3] bg-white px-3 text-[13.5px] font-semibold text-[var(--ex-ink)] hover:bg-[#eef2f7]">
      {children}
    </button>
  );
}

function Options({ q, draft, onChange }: { q: ExamQuestion; draft: string | null; onChange: (v: string | null) => void }) {
  const picked = new Set((draft ?? "").split(",").filter(Boolean));
  const multi = q.type === "MSQ";
  return (
    <div role={multi ? "group" : "radiogroup"} aria-label="Options" className="grid gap-2.5">
      {q.options.map((o) => {
        const on = picked.has(o.key);
        return (
          <label key={o.key} className={cn("flex cursor-pointer items-start gap-3 border px-3 py-2.5", on ? "border-[var(--ex-blue)] bg-[#eef4fc]" : "border-transparent hover:bg-[#f5f7fa]")}>
            <input
              type={multi ? "checkbox" : "radio"}
              name={`q${q.n}`}
              checked={on}
              onChange={() => {
                if (!multi) return onChange(o.key);
                const next = new Set(picked);
                if (next.has(o.key)) next.delete(o.key);
                else next.add(o.key);
                onChange(next.size ? [...next].sort().join(",") : null);
              }}
              className="mt-1 size-[17px] flex-none accent-[var(--ex-blue)]"
            />
            <span className="w-5 flex-none pt-px font-bold">{o.key}.</span>
            <span className="min-w-0 flex-1">{o.body}</span>
          </label>
        );
      })}
    </div>
  );
}

/** NAT answer box with GATE's on-screen keypad (the physical keyboard works too). */
function NatInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [caret, setCaret] = useState(value.length);
  const box = useRef<HTMLInputElement>(null);
  const at = Math.min(caret, value.length);
  useEffect(() => {
    box.current?.setSelectionRange(at, at);
  }, [at, value]);

  const put = (ch: string) => {
    if (value.length >= 15) return;
    const next = value.slice(0, at) + ch + value.slice(at);
    if (!/^-?\d*\.?\d*$/.test(next)) return;
    onChange(next);
    setCaret(at + 1);
  };
  const back = () => {
    if (at === 0) return;
    onChange(value.slice(0, at - 1) + value.slice(at));
    setCaret(at - 1);
  };
  const key = "h-10 border border-[#aab4c3] bg-white text-[15px] font-semibold hover:bg-[#eef2f7] active:bg-[#dfe6ef]";

  return (
    <div className="grid w-[248px] gap-2">
      <input
        ref={box}
        value={value}
        inputMode="none"
        aria-label="Your answer"
        onChange={() => undefined}
        onSelect={(e) => setCaret(e.currentTarget.selectionStart ?? value.length)}
        onKeyDown={(e) => {
          if (/^[0-9.-]$/.test(e.key)) put(e.key);
          else if (e.key === "Backspace") back();
          else if (e.key === "ArrowLeft") setCaret(Math.max(0, at - 1));
          else if (e.key === "ArrowRight") setCaret(Math.min(value.length, at + 1));
          else if (e.key === "Tab") return;
          e.preventDefault();
        }}
        className="h-11 border-2 border-[#8d99ab] bg-white px-2 text-[18px] font-semibold tabular-nums outline-none focus:border-[var(--ex-blue)]"
      />
      <button type="button" onClick={back} className={key}>
        Backspace
      </button>
      <div className="grid grid-cols-3 gap-1.5">
        {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "-"].map((k) => (
          <button key={k} type="button" onClick={() => put(k)} className={key}>
            {k}
          </button>
        ))}
        <button type="button" onClick={() => setCaret(Math.max(0, at - 1))} aria-label="Cursor left" className={cn(key, "grid place-items-center")}>
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <button type="button" onClick={() => setCaret(Math.min(value.length, at + 1))} aria-label="Cursor right" className={cn(key, "grid place-items-center")}>
          <ChevronRight className="size-4" aria-hidden />
        </button>
        <button type="button" onClick={() => (onChange(""), setCaret(0))} className={cn(key, "text-[13px]")}>
          Clear All
        </button>
      </div>
    </div>
  );
}

function Palette(props: {
  states: QState[];
  current: number;
  list: { x: ExamQuestion; i: number }[];
  counts: Record<PaletteStatus, number>;
  section: string;
  onPick: (i: number) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-none items-center gap-3 border-b border-[var(--ex-line)] px-3 py-2.5">
        <span className="grid size-11 place-items-center border border-[var(--ex-line)] bg-white text-[#8d99ab]">
          <UserRound className="size-7" aria-hidden />
        </span>
        <span className="text-[14px] font-semibold">Candidate</span>
      </div>
      <ul className="grid flex-none grid-cols-2 gap-x-2 gap-y-2 border-b border-[var(--ex-line)] px-3 py-3 text-[12px] leading-tight">
        {LEGEND.map((l) => (
          <li key={l.status} className={cn("flex items-center gap-2", l.status === "answered-marked" && "col-span-2")}>
            <span className={cn("pal flex-none", `pal-${l.status}`)}>{props.counts[l.status]}</span>
            {l.label}
          </li>
        ))}
      </ul>
      <div className="flex-none bg-[var(--ex-head)] px-3 py-1.5 text-[13px] font-semibold text-white">{props.section}</div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <p className="mb-2.5 text-[13px] font-semibold">Choose a Question</p>
        <div className="grid grid-cols-5 gap-x-1.5 gap-y-3">
          {props.list.map(({ x, i }) => {
            const s = paletteStatus(props.states[i]);
            return (
              <button
                key={i}
                type="button"
                onClick={() => props.onPick(i)}
                aria-label={`Question ${x.n}: ${LEGEND.find((l) => l.status === s)!.label}`}
                aria-current={i === props.current ? "true" : undefined}
                className={cn("pal", `pal-${s}`, i === props.current && "pal-current")}
              >
                {x.n}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex-none border-t border-[var(--ex-line)] p-3">
        <button type="button" onClick={props.onSubmit} className="h-10 w-full bg-[var(--ex-blue)] text-[14px] font-semibold text-white hover:bg-[#245a9c]">
          Submit
        </button>
      </div>
    </div>
  );
}

function SubmitDialog(props: {
  sections: ({ name: string; total: number } & Record<PaletteStatus, number>)[];
  busy: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const th = "border border-[var(--ex-line)] bg-[#eef2f7] px-2 py-1.5 text-left text-[12px] font-semibold";
  const td = "border border-[var(--ex-line)] px-2 py-1.5 text-center tabular-nums";
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/45 p-3" role="dialog" aria-modal="true" aria-labelledby="submit-title">
      <div className="grid max-h-full w-full max-w-[720px] gap-4 overflow-y-auto bg-white p-4 sm:p-5">
        <h2 id="submit-title" className="text-[16px] font-bold">
          Exam Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className={th}>Section</th>
                <th className={th}>No. of Questions</th>
                <th className={th}>Answered</th>
                <th className={th}>Not Answered</th>
                <th className={th}>Marked for Review</th>
                <th className={th}>Answered & Marked for Review</th>
                <th className={th}>Not Visited</th>
              </tr>
            </thead>
            <tbody>
              {props.sections.map((s) => (
                <tr key={s.name}>
                  <td className={cn(td, "text-left font-semibold")}>{s.name}</td>
                  <td className={td}>{s.total}</td>
                  <td className={td}>{s.answered}</td>
                  <td className={td}>{s["not-answered"]}</td>
                  <td className={td}>{s.marked}</td>
                  <td className={td}>{s["answered-marked"]}</td>
                  <td className={td}>{s["not-visited"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[14px] font-semibold">Are you sure you want to submit for final marking? No changes will be allowed after submission.</p>
        {props.error && <p className="text-[13px] font-semibold text-[var(--ex-not-answered)]">{props.error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={props.onCancel} disabled={props.busy} className="h-9 border border-[#aab4c3] bg-white px-5 font-semibold hover:bg-[#eef2f7]">
            No
          </button>
          <button type="button" onClick={props.onSubmit} disabled={props.busy} className="flex h-9 items-center gap-2 bg-[var(--ex-blue)] px-5 font-semibold text-white hover:bg-[#245a9c] disabled:opacity-70">
            {props.busy && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

function Countdown({ deadline, skew, onEnd }: { deadline: number; skew: number; onEnd: () => void }) {
  const [now, setNow] = useState<number | null>(null);
  const fired = useRef(false);
  const end = useRef(onEnd);
  useEffect(() => {
    end.current = onEnd;
  });
  useEffect(() => {
    const tick = () => {
      const t = Date.now() + skew;
      setNow(t);
      if (t >= deadline && !fired.current) {
        fired.current = true;
        end.current();
      }
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [deadline, skew]);
  const left = now === null ? 0 : Math.max(0, Math.floor((deadline - now) / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span role="timer" className={cn("flex-none text-[13.5px] whitespace-nowrap", now === null && "invisible")}>
      <span className="hidden sm:inline">Time Left : </span>
      <b className="tabular-nums">
        {pad(Math.floor(left / 3600))}:{pad(Math.floor((left % 3600) / 60))}:{pad(left % 60)}
      </b>
    </span>
  );
}
