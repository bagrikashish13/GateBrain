// The love note on a task tick. Three click-through layers over the page:
//   back   a pink flash, then big 3D emojis pop up around the edges, bob, and burst.
//   note   the page dims and "I love youuu / Kashish" lands letter by letter in 3D block letters,
//          waves, the name beats like a heart, then every letter blows away.
//   front  rings ripple out of the ticked box and a fountain of emojis shoots out of it.
// Ticking the day's last task is the finale: more of everything, a rain of emojis, a longer hold.
// Emojis: Microsoft Fluent Emoji 3D (MIT), public/love/. A deliberate exception to the flat style.
// With reduced motion, only the words fade in and out.

import { buzz, calm, layer } from "./celebrate";

const FACES = ["kiss", "heart-eyes", "hearts", "beam", "star-struck", "kissing"]; // 😘 😍 🥰 😁 🤩 😚
const HEARTS = ["red-heart", "sparkling-heart", "heart-arrow"]; // ❤️ 💖 💘
const LINES = [
  { text: "I love youuu", size: "clamp(32px,12vw,80px)", colours: ["#ffb3dc", "#ff4fa3"] },
  { text: "Kashish", size: "clamp(56px,21vw,140px)", colours: ["#ff3d9a", "#ff7a59", "#ffd23f"] },
];
const PINK = "#ff4fa3";
// Where the big emojis pop, as fractions of the screen: around the edges, clear of the words.
const SPOTS = [
  [0.17, 0.15],
  [0.83, 0.13],
  [0.5, 0.08],
  [0.2, 0.8],
  [0.8, 0.83],
  [0.5, 0.91],
  [0.08, 0.66],
  [0.92, 0.62],
];

const src = (name: string) => `/love/${name}.webp`;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
const shuffle = <T>(xs: T[]) => [...xs].sort(() => Math.random() - 0.5);

let preloaded = false;
/** Fetch the emojis ahead of the first tick, so they're there the moment it lands. */
export function preloadLove() {
  if (preloaded || typeof window === "undefined") return;
  preloaded = true;
  for (const n of [...FACES, ...HEARTS]) new Image().src = src(n);
}

/** The colour `t` (0–1) of the way along `stops` (at least two hex colours). */
function ramp(stops: string[], t: number): string {
  const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const f = Math.min(Math.max(t, 0), 1) * (stops.length - 1);
  const i = Math.min(Math.floor(f), stops.length - 2);
  const [a, b] = [rgb(stops[i]), rgb(stops[i + 1])];
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * (f - i))).join(",")})`;
}

function emoji(parent: HTMLElement, x: number, y: number, size: number, name = Math.random() < 0.7 ? pick(FACES) : pick(HEARTS)) {
  const e = document.createElement("img");
  e.src = src(name);
  e.alt = "";
  e.draggable = false;
  e.style.cssText = `position:absolute;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;will-change:transform,opacity`;
  parent.appendChild(e);
  return e;
}

function flash(l: HTMLElement) {
  const f = document.createElement("div");
  f.style.cssText = `position:absolute;inset:0;background:${PINK}`;
  l.appendChild(f);
  f.animate([{ opacity: 0 }, { opacity: 0.26, offset: 0.25 }, { opacity: 0 }], { duration: 450, easing: "ease-out", fill: "both" });
}

/** Shockwave rings out of (x, y). */
function rings(l: HTMLElement, x: number, y: number) {
  [PINK, "#ffd23f", "#ff7a59"].forEach((c, n) => {
    const r = document.createElement("div");
    r.style.cssText = `position:absolute;left:${x - 30}px;top:${y - 30}px;width:60px;height:60px;border:2px solid ${c};border-radius:50%`;
    l.appendChild(r);
    r.animate([{ transform: "scale(.2)", opacity: 1 }, { transform: "scale(9)", opacity: 0 }], {
      duration: 900,
      delay: n * 120,
      easing: "cubic-bezier(.1,.7,.3,1)",
      fill: "both",
    });
  });
}

/** Emojis shot out of (x, y): up and towards the middle of the screen, spinning, then falling away. */
function fountain(l: HTMLElement, x: number, y: number, count: number) {
  const g = 1600; // px/s²
  const spread = Math.min(1, Math.max(0.45, innerWidth / 1000)); // less sideways speed on a phone
  const aim = -90 + Math.min(40, Math.max(-40, ((innerWidth / 2 - x) / innerWidth) * 90)); // lean towards the middle
  for (let n = 0; n < count; n++) {
    const e = emoji(l, x, y, rand(34, 70));
    const a = ((aim + rand(-50, 50)) * Math.PI) / 180;
    const v = rand(700, 1200);
    const s = rand(1.5, 2.2); // seconds in flight
    const flip = (Math.random() < 0.5 ? -1 : 1) * (Math.random() < 0.5 ? rand(25, 60) : rand(300, 720));
    const turn = rand(-160, 160);
    const frames: Keyframe[] = [];
    for (let k = 0; k <= 20; k++) {
      const p = k / 20;
      const t = p * s;
      const scale = p < 0.1 ? (p / 0.1) * 1.3 : p < 0.22 ? 1.3 - ((p - 0.1) / 0.12) * 0.3 : 1 - Math.max(0, p - 0.7) * 1.2;
      frames.push({
        transform: `translate(${Math.cos(a) * v * spread * t}px,${Math.sin(a) * v * t + (g * t * t) / 2}px) perspective(500px) rotateZ(${turn * p}deg) rotateY(${flip * p}deg) scale(${scale})`,
        opacity: p < 0.78 ? 1 : (1 - p) / 0.22,
      });
    }
    e.animate(frames, { duration: s * 1000, delay: n * 22, fill: "both" });
  }
}

/** Big emojis popping up around the edges, bobbing in 3D, then bursting. */
function pops(l: HTMLElement, count: number, life: number) {
  const [W, H] = [innerWidth, innerHeight];
  const faces = shuffle(FACES);
  const tf = (y: number, ry: number, r: number, s: number) => `perspective(500px) translateY(${y}px) rotateY(${ry}deg) rotate(${r}deg) scale(${s})`;
  shuffle(SPOTS)
    .slice(0, count)
    .forEach(([fx, fy], n) => {
      const size = Math.min(W * 0.26, 128) * rand(0.85, 1.1);
      const e = emoji(l, (fx + rand(-0.04, 0.04)) * W, (fy + rand(-0.03, 0.03)) * H, size, faces[n] ?? pick(HEARTS));
      const r = rand(-35, 35);
      const frames: Keyframe[] = [
        { offset: 0, transform: tf(0, 0, r, 0), opacity: 1 },
        { offset: 0.12, transform: tf(0, 0, -r * 0.4, 1.35) },
        { offset: 0.2, transform: tf(0, 0, 0, 0.88) },
        { offset: 0.28, transform: tf(0, 0, 0, 1.06) },
        { offset: 0.36, transform: tf(0, 0, 0, 1) },
        { offset: 0.55, transform: tf(-14, 28, 4, 1) },
        { offset: 0.74, transform: tf(6, -24, -3, 1) },
        { offset: 0.88, transform: tf(0, 0, 0, 1.08), opacity: 1 },
        { offset: 1, transform: tf(-10, 0, 0, 1.7), opacity: 0 },
      ];
      e.animate(
        frames.map((f) => ({ ...f, easing: "ease-in-out" })),
        { duration: life, delay: 100 + n * 90, fill: "both" },
      );
    });
}

/** Emojis raining down the whole screen, swaying and spinning. */
function rain(l: HTMLElement, count: number) {
  const [W, H] = [innerWidth, innerHeight];
  for (let n = 0; n < count; n++) {
    const size = rand(34, 78);
    const e = emoji(l, rand(0, W), -size, size);
    const [sway, turns, phase] = [rand(20, 70), rand(-300, 300), rand(0, Math.PI * 2)];
    const frames: Keyframe[] = [];
    for (let k = 0; k <= 12; k++) {
      const p = k / 12;
      frames.push({
        transform: `translate(${Math.sin(phase + p * 5) * sway}px,${p * (H + size * 2)}px) perspective(500px) rotateZ(${turns * p}deg) rotateY(${Math.sin(p * 7) * 45}deg)`,
      });
    }
    e.animate(frames, { duration: rand(1900, 3000), delay: rand(0, 1800), easing: "ease-in", fill: "both" });
  }
}

// One note at a time: a new tick replaces the words still on screen.
let note: { el: HTMLElement; timer: number } | null = null;

/** "I love youuu / Kashish" for `hold` ms, then blown away. */
function words(hold: number) {
  if (note) {
    const old = note;
    clearTimeout(old.timer);
    old.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "forwards" }).onfinish = () => old.el.remove();
  }
  const quiet = calm();
  const l = layer(61);
  const dim = document.createElement("div");
  dim.style.cssText = "position:absolute;inset:0;background:radial-gradient(ellipse 85% 55% at 50% 42%,rgba(0,0,0,.84),rgba(0,0,0,.5) 65%,rgba(0,0,0,.2))";
  l.appendChild(dim);
  dim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: "both" });

  const box = document.createElement("div");
  box.style.cssText =
    "position:absolute;left:0;right:0;top:42%;transform:translateY(-50%);display:grid;justify-items:center;gap:.04em;padding:0 16px;" +
    "font-family:var(--font-chakra),Bahnschrift,system-ui,sans-serif;font-weight:700;line-height:1.05;text-align:center;perspective:800px";
  l.appendChild(box);
  if (quiet) box.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, fill: "both" });

  const letters: HTMLElement[] = [];
  let k = 0;
  LINES.forEach((line, li) => {
    const row = document.createElement("div");
    row.style.cssText = `font-size:${line.size};white-space:nowrap`;
    box.appendChild(row);
    const chars = [...line.text];
    chars.forEach((ch, i) => {
      const outer = document.createElement("span");
      outer.style.cssText = "display:inline-block;will-change:transform,opacity";
      const inner = document.createElement("span");
      const c = ramp(line.colours, i / (chars.length - 1));
      const side = `color-mix(in srgb,${c} 40%,#000)`;
      const depth = Array.from({ length: 6 }, (_, j) => `${(j + 1) * 0.014}em ${(j + 1) * 0.014}em 0 ${side}`).join(",");
      inner.style.cssText = `display:inline-block;color:${c};text-shadow:${depth}`;
      inner.textContent = ch === " " ? " " : ch;
      outer.appendChild(inner);
      row.appendChild(outer);
      letters.push(outer);
      if (quiet) return;
      const at = 160 + k++ * 40;
      outer.animate(
        [
          { transform: "translateY(.9em) rotateX(-100deg) scale(.2)", opacity: 0 },
          { transform: "translateY(-.2em) rotateX(18deg) scale(1.2)", opacity: 1, offset: 0.55 },
          { transform: "translateY(.05em) rotateX(-6deg) scale(.95)", opacity: 1, offset: 0.78 },
          { transform: "translateY(0) rotateX(0deg) scale(1)", opacity: 1 },
        ],
        { duration: 720, delay: at, easing: "ease-out", fill: "both" },
      );
      inner.animate(
        [
          { transform: "translateY(0) rotate(0deg)" },
          { transform: "translateY(-.12em) rotate(-4deg)" },
          { transform: "translateY(0) rotate(0deg)" },
          { transform: "translateY(.04em) rotate(3deg)" },
          { transform: "translateY(0) rotate(0deg)" },
        ],
        { duration: 1100, delay: at + 700, iterations: Infinity, easing: "ease-in-out" },
      );
    });
    // The name beats like a heart: lub-dub, rest.
    if (li === LINES.length - 1 && !quiet)
      row.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.12)", offset: 0.14 },
          { transform: "scale(1)", offset: 0.28 },
          { transform: "scale(1.07)", offset: 0.42 },
          { transform: "scale(1)", offset: 0.6 },
          { transform: "scale(1)" },
        ],
        { duration: 1000, delay: 160 + k * 40 + 450, iterations: Infinity },
      );
  });
  // Never wider than the screen: a line that doesn't fit shrinks until it does.
  const room = innerWidth - 32;
  for (const row of box.children as HTMLCollectionOf<HTMLElement>) {
    const w = row.offsetWidth;
    if (w > room) row.style.fontSize = `${(parseFloat(getComputedStyle(row).fontSize) * room) / w}px`;
  }

  const done = () => {
    l.remove();
    if (note?.el === l) note = null;
  };
  const out = () => {
    if (quiet) {
      l.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" }).onfinish = done;
      return;
    }
    letters.forEach((el, n) =>
      el.animate(
        [
          { transform: "translate(0,0) rotate(0deg) scale(1)", opacity: 1 },
          { transform: `translate(${rand(-1.6, 1.6)}em,${rand(-2.6, -1)}em) rotate(${rand(-200, 200)}deg) scale(${rand(0.2, 0.6)})`, opacity: 0 },
        ],
        { duration: 650, delay: n * 22, easing: "cubic-bezier(.5,0,.8,.3)", fill: "forwards" },
      ),
    );
    dim.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, delay: 250, fill: "forwards" });
    if (note?.el === l) note.timer = window.setTimeout(done, 700 + letters.length * 22);
  };
  note = { el: l, timer: window.setTimeout(out, hold) };
}

/** The whole show, from the ticked box. `finale` (the day's last task) goes bigger and longer. */
export function love(from: Element, { finale = false }: { finale?: boolean } = {}) {
  if (typeof window === "undefined") return;
  const hold = finale ? 3600 : 2300;
  words(hold);
  if (calm()) return;
  const r = from.getBoundingClientRect();
  const [x, y] = [r.left + r.width / 2, r.top + r.height / 2];
  const back = layer(60);
  const front = layer(62);
  flash(back);
  pops(back, finale ? 8 : 5, hold + 400);
  rings(front, x, y);
  fountain(front, x, y, finale ? 30 : 16);
  if (finale) rain(front, 34);
  window.setTimeout(() => (back.remove(), front.remove()), finale ? 5000 : 3300);
  // A heartbeat on the phone as the name lands.
  window.setTimeout(() => buzz(finale ? [18, 120, 30, 260, 18, 120, 30] : [18, 120, 30]), 650);
}
