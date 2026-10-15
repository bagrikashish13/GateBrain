"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { cn } from "cn";

export type DrumItem = { key: string; label: string; slipped?: boolean }; // slipped: a past day with undone tasks

// A vertical drum (SPEC §6.1): values on a cylinder that turns about its horizontal axis. The one
// in front sits in the date window; its neighbours tilt away above and below. Drag, flick, wheel
// or arrow keys spin it; a spring always brings it to rest on a value, never between two.
export const FACE_H = 34; // px, one value's face
const STEP = 32; // degrees between values
const RADIUS = FACE_H / 2 / Math.tan(((STEP / 2) * Math.PI) / 180);
const PX_PER_STEP = 30; // finger travel for one value
const FLING = 0.08; // seconds of momentum a flick adds
const MAX_FLING = 4; // values
const SPRING = { type: "spring", stiffness: 320, damping: 34 } as const;
export const DRUM_H = 112;
// Haptics, as strong as the web allows (his request): the Vibration API has no strength setting,
// only length, so a longer pulse is a harder one. A click per value, a heavier one when it lands.
// Android only; iOS has no web vibration.
const TICK_MS = 35;
const REST_MS = 70;
const buzz = (ms: number) => {
  try {
    navigator.vibrate?.(ms);
  } catch {
    // no vibration here
  }
};

export function Drum(props: { items: DrumItem[]; index: number; onChange: (i: number) => void; width: number; label: string; className?: string }) {
  const { items, index, width, label } = props;
  const pos = useMotionValue(index);
  const still = useReducedMotion() ?? false;
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; from: number; last: number; t: number; v: number; moved: boolean } | null>(null);
  const latest = useRef({ index, onChange: props.onChange, max: items.length - 1 });
  useLayoutEffect(() => {
    latest.current = { index, onChange: props.onChange, max: items.length - 1 };
  });

  // Set from outside (another drum, "back to today"): roll there.
  useEffect(() => {
    if (drag.current) return;
    const c = still ? (pos.set(index), null) : animate(pos, index, SPRING);
    return () => c?.stop();
  }, [index, pos, still]);

  // A click each time a new value passes the window (spaced out a little, or a fast spin is one long buzz).
  const passed = useRef(Math.round(index));
  const lastClick = useRef(0);
  useMotionValueEvent(pos, "change", (p) => {
    const at = Math.round(p);
    if (at === passed.current) return;
    passed.current = at;
    const now = performance.now();
    if (now - lastClick.current < TICK_MS + 15) return;
    lastClick.current = now;
    buzz(TICK_MS);
  });

  const settle = (target: number, velocity = 0) => {
    const { max, index: at, onChange } = latest.current;
    const t = Math.min(max, Math.max(0, Math.round(target)));
    if (still) {
      pos.set(t);
      if (t !== at) buzz(REST_MS);
    } else {
      animate(pos, t, { ...SPRING, velocity, onComplete: () => t !== at && buzz(REST_MS) });
    }
    if (t !== at) onChange(t);
  };

  // Wheel: one notch per value. Native listener, so it spins the drum instead of the page.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let acc = 0;
    let quiet: ReturnType<typeof setTimeout>;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      acc += e.deltaY;
      clearTimeout(quiet);
      quiet = setTimeout(() => (acc = 0), 200);
      if (Math.abs(acc) >= 40) {
        settle(latest.current.index + Math.sign(acc));
        acc = 0;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      clearTimeout(quiet);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- settle reads `latest`, never stale
  }, []);

  return (
    <div
      ref={box}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={items.length - 1}
      aria-valuenow={index}
      aria-valuetext={items[index]?.label}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp") settle(index - 1);
        else if (e.key === "ArrowDown") settle(index + 1);
        else return;
        e.preventDefault();
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        pos.stop();
        drag.current = { y: e.clientY, from: pos.get(), last: e.clientY, t: e.timeStamp, v: 0, moved: false };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const dy = e.clientY - d.y;
        if (Math.abs(dy) > 4) d.moved = true;
        let p = d.from - dy / PX_PER_STEP;
        const max = items.length - 1;
        if (p < 0) p /= 3; // a little give past the ends
        if (p > max) p = max + (p - max) / 3;
        pos.set(p);
        const dt = Math.max(1, e.timeStamp - d.t);
        d.v = (-(e.clientY - d.last) / PX_PER_STEP / dt) * 1000; // values per second
        d.last = e.clientY;
        d.t = e.timeStamp;
      }}
      onPointerUp={(e) => {
        const d = drag.current;
        drag.current = null;
        if (!d) return;
        if (!d.moved) {
          // A tap above or below the window steps once.
          const r = e.currentTarget.getBoundingClientRect();
          const y = (e.clientY - r.top) / r.height;
          settle(y < 0.36 ? index - 1 : y > 0.64 ? index + 1 : index);
          return;
        }
        settle(pos.get() + Math.max(-MAX_FLING, Math.min(MAX_FLING, d.v * FLING)), d.v);
      }}
      onPointerCancel={() => {
        drag.current = null;
        settle(pos.get());
      }}
      className={cn("relative flex-none cursor-grab touch-none overflow-hidden outline-none select-none focus-visible:bg-raised/40 active:cursor-grabbing", props.className)}
      style={{ width, height: DRUM_H, perspective: 210 }}
    >
      {/* The cylinder, pushed back by its radius so the front face sits flat in the window. */}
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: `translateZ(${-RADIUS}px)` }}>
        {items.map((it, i) => (
          <Face key={it.key} item={it} i={i} pos={pos} />
        ))}
      </div>
    </div>
  );
}

const RIDGES = "repeating-linear-gradient(180deg, rgba(255,255,255,.2) 0 1px, transparent 1px 4px), #0d0f14";

function Face({ item, i, pos }: { item: DrumItem; i: number; pos: MotionValue<number> }) {
  const transform = useTransform(pos, (p) => `rotateX(${-(i - p) * STEP}deg) translateZ(${RADIUS}px)`);
  // Lit from the front: a face darkens as it turns away; past ~80° it's gone.
  const opacity = useTransform(pos, (p) => {
    const a = Math.abs(i - p) * STEP;
    return a >= 80 ? 0 : 0.18 + 0.82 * Math.cos((a * Math.PI) / 180);
  });
  return (
    <motion.div
      className="absolute inset-x-0 top-1/2 flex items-center justify-center border-y border-black/70 bg-raised"
      style={{ height: FACE_H, marginTop: -FACE_H / 2, transform, opacity, backfaceVisibility: "hidden" }}
    >
      {/* Grip ridges on both rims: they roll with the drum, so a spin reads as a spin. */}
      <i aria-hidden className="absolute inset-y-0 left-0 w-[5px] border-r border-line-2" style={{ background: RIDGES }} />
      <i aria-hidden className="absolute inset-y-0 right-0 w-[5px] border-l border-line-2" style={{ background: RIDGES }} />
      <span className="num relative text-[20px] leading-none font-bold tracking-wide">
        {item.label}
        {item.slipped && <i aria-hidden className="absolute -top-0.5 -right-2 size-[5px] rotate-45 bg-alert" />}
      </span>
    </motion.div>
  );
}
