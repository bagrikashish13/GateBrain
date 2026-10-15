// The tick animation (SPEC §6.1): when a task or a revision is done, diamond shards burst from the
// box, a mint band sweeps across the row, and the phone buzzes once. Drawn on a fixed layer over the
// page (Web Animations API), so it survives the row re-rendering under it. Flat colour, no glow.
// Nothing happens with reduced motion.

const calm = () => typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A CSS colour token's value, e.g. token("--mint") → "#00fd92". */
export function token(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function layer(): HTMLDivElement {
  const l = document.createElement("div");
  l.setAttribute("aria-hidden", "true");
  l.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden";
  document.body.appendChild(l);
  return l;
}

/** Diamond shards flying out from the middle of `from`. */
export function burst(from: Element, colours?: string[], count = 10) {
  if (calm()) return;
  const mint = token("--mint", "#00fd92");
  const cols = colours?.length ? colours : [mint, mint, token("--fg", "#f3f5fa")];
  const r = from.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const l = layer();
  let left = count;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("i");
    const size = 4 + Math.random() * 4;
    s.style.cssText = `position:absolute;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;background:${cols[i % cols.length]}`;
    l.appendChild(s);
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.6;
    const d = 18 + Math.random() * 26;
    s.animate(
      [
        { transform: "translate(0,0) rotate(45deg) scale(1.3)", opacity: 1 },
        { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) rotate(${135 + Math.random() * 200}deg) scale(0)`, opacity: 0 },
      ],
      { duration: 520 + Math.random() * 220, easing: "cubic-bezier(.1,.8,.3,1)" },
    ).onfinish = () => {
      s.remove();
      if (--left === 0) l.remove();
    };
  }
}

/** A mint band sweeping left to right across `row`. */
export function sweep(row: Element, colour?: string) {
  if (calm()) return;
  const c = colour ?? token("--mint", "#00fd92");
  const r = row.getBoundingClientRect();
  const l = layer();
  const clip = document.createElement("div");
  clip.style.cssText = `position:absolute;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;overflow:hidden`;
  const band = document.createElement("i");
  band.style.cssText = `position:absolute;top:0;bottom:0;left:0;width:45%;background:linear-gradient(90deg,transparent,color-mix(in srgb,${c} 16%,transparent) 60%,color-mix(in srgb,${c} 50%,transparent) 98%,transparent)`;
  clip.appendChild(band);
  l.appendChild(clip);
  band.animate([{ transform: "translateX(-100%)" }, { transform: "translateX(240%)" }], { duration: 560, easing: "cubic-bezier(.4,0,.2,1)" }).onfinish = () =>
    l.remove();
}

/** A quick press-and-pop on the box that was ticked. */
export function stamp(el: Element) {
  if (calm()) return;
  el.animate([{ transform: "scale(1)" }, { transform: "scale(.7)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }], {
    duration: 380,
    easing: "ease-out",
  });
}

/** One short buzz (Android; the Vibration API has no strength, only length). */
export function buzz(ms = 14) {
  try {
    navigator.vibrate?.(ms);
  } catch {}
}

/** Everything at once: the box pops, shards burst from it, a band sweeps the row, a buzz. */
export function celebrate(box: Element, row: Element | null, colours?: string[]) {
  stamp(box);
  burst(box, colours);
  if (row) sweep(row);
  buzz();
}
