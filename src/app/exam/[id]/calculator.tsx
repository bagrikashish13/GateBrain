"use client";

import { useEffect, useRef, useState } from "react";
import { GripHorizontal, X } from "lucide-react";
import { cn } from "cn";
import { evaluate, show, type Angle } from "@/lib/calc";

type Key = { label: string; insert?: string; run?: "eq" | "clear" | "back" | "angle" | "mc" | "mr" | "ms" | "mplus" | "mminus" | "inv"; tone?: "num" | "op" | "eq" | "danger" };

// GATE's virtual scientific calculator, near enough: functions, powers, roots, factorial, memory,
// degrees/radians. Type on the keyboard too (digits, + − × ÷ ^ ( ) . Enter Backspace Esc).
const KEYS: Key[][] = [
  [{ label: "MC", run: "mc" }, { label: "MR", run: "mr" }, { label: "MS", run: "ms" }, { label: "M+", run: "mplus" }, { label: "M−", run: "mminus" }],
  [{ label: "sin", insert: "sin(" }, { label: "cos", insert: "cos(" }, { label: "tan", insert: "tan(" }, { label: "log", insert: "log(" }, { label: "ln", insert: "ln(" }],
  [{ label: "sin⁻¹", insert: "asin(" }, { label: "cos⁻¹", insert: "acos(" }, { label: "tan⁻¹", insert: "atan(" }, { label: "√x", insert: "√(" }, { label: "∛x", insert: "∛(" }],
  [{ label: "x²", insert: "^2" }, { label: "x³", insert: "^3" }, { label: "xʸ", insert: "^" }, { label: "n!", insert: "!" }, { label: "1/x", run: "inv" }],
  [{ label: "eˣ", insert: "exp(" }, { label: "mod", insert: " mod " }, { label: "(", insert: "(" }, { label: ")", insert: ")" }, { label: "C", run: "clear", tone: "danger" }],
  [{ label: "7", insert: "7", tone: "num" }, { label: "8", insert: "8", tone: "num" }, { label: "9", insert: "9", tone: "num" }, { label: "÷", insert: "÷", tone: "op" }, { label: "⌫", run: "back", tone: "danger" }],
  [{ label: "4", insert: "4", tone: "num" }, { label: "5", insert: "5", tone: "num" }, { label: "6", insert: "6", tone: "num" }, { label: "×", insert: "×", tone: "op" }, { label: "π", insert: "π" }],
  [{ label: "1", insert: "1", tone: "num" }, { label: "2", insert: "2", tone: "num" }, { label: "3", insert: "3", tone: "num" }, { label: "−", insert: "−", tone: "op" }, { label: "e", insert: "e" }],
  [{ label: "0", insert: "0", tone: "num" }, { label: ".", insert: ".", tone: "num" }, { label: "Deg", run: "angle" }, { label: "+", insert: "+", tone: "op" }, { label: "=", run: "eq", tone: "eq" }],
];
const OPS = new Set(["+", "−", "×", "÷", "^", "!", " mod "]);

export function Calculator({ onClose }: { onClose: () => void }) {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<string>("0");
  const [fresh, setFresh] = useState(false); // just pressed "=": a digit starts over, an operator continues
  const [angle, setAngle] = useState<Angle>("deg");
  const [memory, setMemory] = useState<number | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  const current = () => {
    try {
      return evaluate(expr || result, angle);
    } catch {
      return null;
    }
  };

  const press = (k: Key) => {
    if (k.insert !== undefined) {
      const ins = k.insert;
      if (fresh) {
        setFresh(false);
        setExpr(OPS.has(ins) ? (result === "Math error" ? "" : result) + ins : ins);
      } else setExpr((e) => e + ins);
      return;
    }
    switch (k.run) {
      case "eq": {
        if (!expr) return;
        try {
          setResult(show(evaluate(expr, angle)));
        } catch {
          setResult("Math error");
        }
        setFresh(true);
        return;
      }
      case "clear":
        setExpr("");
        setResult("0");
        setFresh(false);
        return;
      case "back":
        setFresh(false);
        setExpr((e) => (e.endsWith(" mod ") ? e.slice(0, -5) : /(asin|acos|atan|sin|cos|tan|log|exp|ln)\($/.test(e) ? e.replace(/(asin|acos|atan|sin|cos|tan|log|exp|ln)\($/, "") : e.slice(0, -1)));
        return;
      case "angle":
        setAngle((a) => (a === "deg" ? "rad" : "deg"));
        return;
      case "inv":
        setExpr((e) => `1/(${fresh ? result : e})`);
        setFresh(false);
        return;
      case "mc":
        setMemory(null);
        return;
      case "mr":
        if (memory !== null) setExpr((e) => (fresh ? show(memory) : e + show(memory)));
        setFresh(false);
        return;
      case "ms":
      case "mplus":
      case "mminus": {
        const v = current();
        if (v === null || !Number.isFinite(v)) return;
        setMemory((m) => (k.run === "ms" ? v : (m ?? 0) + (k.run === "mplus" ? v : -v)));
        return;
      }
    }
  };

  // Keyboard, while the calculator is open.
  const pressRef = useRef(press);
  useEffect(() => {
    pressRef.current = press;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" && !panel.current?.contains(target)) return;
      const map: Record<string, Key> = { "*": { label: "×", insert: "×" }, "/": { label: "÷", insert: "÷" }, "-": { label: "−", insert: "−" } };
      let k: Key | null = null;
      if (/^[0-9.+()^!]$/.test(e.key)) k = { label: e.key, insert: e.key };
      else if (map[e.key]) k = map[e.key];
      else if (e.key === "Enter" || e.key === "=") k = { label: "=", run: "eq" };
      else if (e.key === "Backspace") k = { label: "⌫", run: "back" };
      else if (e.key === "Escape") k = { label: "C", run: "clear" };
      if (!k) return;
      e.preventDefault();
      pressRef.current(k);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={panel}
      role="dialog"
      aria-label="Scientific calculator"
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-[var(--ex-head)] bg-[#f4f6f9] shadow-none sm:inset-x-auto sm:bottom-auto sm:w-[340px] sm:border-2"
      style={pos ? { left: pos.x, top: pos.y } : { right: 16, top: 104 }}
    >
      <div
        className="flex h-9 cursor-move touch-none items-center justify-between bg-[var(--ex-head)] pr-1 pl-3 text-[13px] font-semibold text-white select-none"
        onPointerDown={(e) => {
          // Not on the close button (capturing the pointer would swallow its click), not on phones.
          if (window.innerWidth < 640 || (e.target as HTMLElement).closest("button")) return;
          const r = panel.current!.getBoundingClientRect();
          drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const w = panel.current!.offsetWidth;
          setPos({ x: Math.min(window.innerWidth - w, Math.max(0, e.clientX - drag.current.dx)), y: Math.min(window.innerHeight - 60, Math.max(0, e.clientY - drag.current.dy)) });
        }}
        onPointerUp={() => (drag.current = null)}
      >
        <span className="flex items-center gap-2">
          <GripHorizontal className="hidden size-4 opacity-70 sm:block" aria-hidden />
          Scientific Calculator
        </span>
        <button type="button" onClick={onClose} aria-label="Close calculator" className="grid size-8 place-items-center hover:bg-white/10">
          <X className="size-4" aria-hidden />
        </button>
      </div>
      <div className="grid gap-2 p-2.5">
        <div className="grid gap-0.5 border border-[#aab4c3] bg-white px-2 py-1.5 text-right">
          <div className="flex min-h-5 items-center justify-between gap-2 text-[12.5px] text-[var(--ex-muted)]">
            <span className="flex gap-1.5">
              <span className="font-semibold">{angle === "deg" ? "DEG" : "RAD"}</span>
              {memory !== null && <span className="font-semibold">M</span>}
            </span>
            <span className="min-w-0 truncate" dir="rtl">
              <bdi>{expr || " "}</bdi>
            </span>
          </div>
          <output className="truncate text-[22px] leading-tight font-bold tabular-nums">{result}</output>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {KEYS.flat().map((k) => (
            <button
              key={k.label}
              type="button"
              onClick={() => press(k)}
              className={cn(
                "h-9 border text-[13.5px] font-semibold active:translate-y-px",
                k.tone === "num" && "border-[#aab4c3] bg-white text-[var(--ex-ink)] hover:bg-[#eef2f7]",
                k.tone === "op" && "border-[#9fb6d6] bg-[#e3ecf8] text-[var(--ex-head-2)] hover:bg-[#d6e3f4]",
                k.tone === "eq" && "border-[var(--ex-blue)] bg-[var(--ex-blue)] text-white hover:bg-[#245a9c]",
                k.tone === "danger" && "border-[#e2b0a6] bg-[#fbeeeb] text-[var(--ex-not-answered)] hover:bg-[#f7e0db]",
                !k.tone && "border-[#c3cad5] bg-[#eceff3] text-[var(--ex-ink)] hover:bg-[#e2e6ec]",
              )}
            >
              {k.run === "angle" ? (angle === "deg" ? "Deg" : "Rad") : k.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
