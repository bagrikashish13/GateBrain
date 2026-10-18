// The love note on a task tick, in three beats over click-through layers:
//   1 beam   a mint band and a bright line shoot left to right across the ticked row.
//   2 blast  the line detonates: a shockwave, a pink flash, paper confetti bursting up off the row.
//   3 love   big 3D emojis pop up around the edges, bob, and burst; the page dims and a note lands
//            letter by letter in 3D block letters, waves, the big line beats like a heart, then
//            every letter blows away. The note changes each tick, never the same one twice running.
// Ticking the day's last task is the finale: always "I love youuu Kashish", a bigger blast, a
// confetti shower from the top, more emojis, a longer hold.
// Emojis: Microsoft Fluent Emoji 3D (MIT), public/love/. A deliberate exception to the flat style.
// With reduced motion, only the words fade in and out.

import { buzz, calm, layer } from "./celebrate";

const FACES = ["kiss", "heart-eyes", "hearts", "beam", "star-struck", "kissing"]; // 😘 😍 🥰 😁 🤩 😚
const HEARTS = ["red-heart", "sparkling-heart", "heart-arrow"]; // ❤️ 💖 💘
// Each note is a small line over a big one. The first is the finale's.
const NOTES = [
  ["I love youuu", "Kashish"],
  ["That's my", "girl"],
  ["You're fucking", "awesome"],
  ["That's crazyy", "Kashuuu"],
  ["You're the", "bomb"],
];
const LINES = [
  { size: "clamp(32px,12vw,80px)", colours: ["#ffb3dc", "#ff4fa3"] },
  { size: "clamp(56px,21vw,140px)", colours: ["#ff3d9a", "#ff7a59", "#ffd23f"] },
];
const PINK = "#ff4fa3";
const CONFETTI = [PINK, "#ffd23f", "#ff7a59", "#00fd92", "#f3f5fa", "#a66bff", "#4fc3ff"];
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
const BEAM = 400; // ms for the beam to cross
const BLAST = 360; // ms from the tick to the blast (just before the beam leaves the screen)

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

let lastNote = -1;
/** The next note: random, never the one just shown. The finale is always the first. */
function nextNote(finale: boolean): string[] {
  let i = 0;
  if (!finale) do i = Math.floor(Math.random() * NOTES.length); while (i === lastNote);
  lastNote = i;
  return NOTES[i];
}

/** The colour `t` (0–1) of the way along `stops` (at least two hex colours). */
function ramp(stops: string[], t: number): string {
  const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const f = Math.min(Math.max(t, 0), 1) * (stops.length - 1);
  const i = Math.min(Math.floor(f), stops.length - 2);
  const [a, b] = [rgb(stops[i]), rgb(stops[i + 1])];
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * (f - i))).join(",")})`;
}

function el(parent: HTMLElement, tag: string, css: string) {
  const e = document.createElement(tag);
  e.style.cssText = css;
  parent.appendChild(e);
  return e;
}

/** Beat 1: a mint band sweeps the row band (top, height) and a bright line shoots along its middle. */
function beam(l: HTMLElement, top: number, height: number) {
  const W = innerWidth;
  const timing = { duration: BEAM, easing: "cubic-bezier(.55,0,.9,.55)", fill: "both" } as const; // speeding up
  const clip = el(l, "div", `position:absolute;left:0;top:${top}px;width:${W}px;height:${height}px;overflow:hidden`);
  el(
    clip,
    "i",
    "position:absolute;top:0;bottom:0;left:0;width:50%;" +
      "background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--mint) 18%,transparent) 55%,color-mix(in srgb,var(--mint) 60%,transparent) 96%,transparent)",
  ).animate([{ transform: "translateX(-100%)" }, { transform: "translateX(200%)" }], timing);
  el(l, "i", `position:absolute;left:0;top:${top + height / 2 - 1.5}px;width:${W * 0.4}px;height:3px;background:linear-gradient(90deg,transparent,var(--mint) 65%,#fff)`).animate(
    [{ transform: "translateX(-100%)" }, { transform: "translateX(250%)" }],
    timing,
  );
}

/** Beat 2: the line along the row (at y) bursts into a shockwave and the screen flashes pink. */
function detonate(l: HTMLElement, y: number) {
  // Hidden until the blast (opacity 0 underneath, fill forwards only), so it doesn't sit on the row while the beam runs.
  el(l, "div", `position:absolute;left:0;right:0;top:${y - 1.5}px;height:3px;opacity:0;background:linear-gradient(90deg,var(--mint),${PINK} 50%,#ffd23f)`).animate(
    [
      { transform: "scaleY(1)", opacity: 1 },
      { transform: "scaleY(26)", opacity: 0 },
    ],
    { duration: 420, delay: BLAST, easing: "cubic-bezier(.1,.7,.3,1)", fill: "forwards" },
  );
  el(l, "div", `position:absolute;inset:0;background:${PINK}`).animate([{ opacity: 0 }, { opacity: 0.24, offset: 0.25 }, { opacity: 0 }], {
    duration: 450,
    delay: BLAST,
    easing: "ease-out",
    fill: "both",
  });
}

/** One piece of paper confetti thrown from (x, y) at (vx, vy) px/s: drag, gravity, flutter, flipping as it falls. */
function confetto(l: HTMLElement, x: number, y: number, vx: number, vy: number, delay: number) {
  const [w, h] = Math.random() < 0.6 ? [rand(5, 8), rand(10, 15)] : [rand(6, 9), rand(6, 9)];
  const p = el(l, "i", `position:absolute;left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px;opacity:0;background:${pick(CONFETTI)};will-change:transform,opacity`);
  const T = rand(2.3, 3.4); // seconds
  const [g, drag] = [1100, 1.7]; // falls at about g/drag = 650 px/s
  const [sway, freq, phase] = [rand(30, 90), rand(4, 8), rand(0, Math.PI * 2)];
  const [flip, turn] = [(Math.random() < 0.5 ? -1 : 1) * rand(400, 1100), rand(-360, 360)]; // deg/s
  const [steps, sub] = [30, 4];
  const dt = T / (steps * sub);
  let [px, py] = [0, 0];
  const frames: Keyframe[] = [];
  for (let k = 0; k <= steps; k++) {
    const [t, f] = [(k / steps) * T, k / steps];
    frames.push({
      transform: `translate(${px + Math.sin(phase + t * freq) * sway * Math.min(1, t)}px,${py}px) rotateZ(${turn * t}deg) rotateX(${flip * t}deg)`,
      opacity: f < 0.8 ? 1 : (1 - f) / 0.2,
    });
    for (let s = 0; s < sub; s++) {
      vx -= vx * drag * dt;
      vy += (g - vy * drag) * dt;
      px += vx * dt;
      py += vy * dt;
    }
  }
  p.animate(frames, { duration: T * 1000, delay, fill: "forwards" }); // invisible until thrown
}

/** Confetti bursting up off the whole row line at y, leaning outwards. */
function blast(l: HTMLElement, y: number, count: number) {
  const W = innerWidth;
  const spread = Math.min(1, Math.max(0.5, W / 1000)); // less sideways on a phone
  for (let n = 0; n < count; n++) {
    const x = rand(0.04, 0.96) * W;
    const a = ((-90 + rand(-55, 55) + ((x - W / 2) / W) * 50) * Math.PI) / 180;
    const v = rand(900, 2100);
    confetto(l, x, y, Math.cos(a) * v * spread, Math.sin(a) * v, BLAST + rand(0, 60));
  }
}

/** The finale's confetti shower, falling from above the screen. */
function shower(l: HTMLElement, count: number) {
  for (let n = 0; n < count; n++) confetto(l, rand(0, innerWidth), -20, rand(-80, 80), rand(100, 450), BLAST + 300 + rand(0, 1600));
}

/** Beat 3: big emojis popping up around the edges, bobbing in 3D, then bursting. */
function pops(l: HTMLElement, count: number, start: number, life: number) {
  const [W, H] = [innerWidth, innerHeight];
  const faces = shuffle(FACES);
  const tf = (y: number, ry: number, r: number, s: number) => `perspective(500px) translateY(${y}px) rotateY(${ry}deg) rotate(${r}deg) scale(${s})`;
  shuffle(SPOTS)
    .slice(0, count)
    .forEach(([fx, fy], n) => {
      const size = Math.min(W * 0.26, 128) * rand(0.85, 1.1);
      const [x, y] = [(fx + rand(-0.04, 0.04)) * W, (fy + rand(-0.03, 0.03)) * H];
      const e = el(l, "img", `position:absolute;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;will-change:transform,opacity`) as HTMLImageElement;
      e.src = src(faces[n] ?? pick(HEARTS));
      e.alt = "";
      e.draggable = false;
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
        { duration: life, delay: start + n * 90, fill: "both" },
      );
    });
}

// One note at a time: a new tick replaces the words still on screen.
let note: { el: HTMLElement; timer: number } | null = null;

/** The note's two lines, landing from `start` ms, held `hold` ms, then blown away. */
function words(text: string[], start: number, hold: number) {
  if (note) {
    const old = note;
    clearTimeout(old.timer);
    old.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "forwards" }).onfinish = () => old.el.remove();
  }
  const quiet = calm();
  if (quiet) start = 0;
  const l = layer(61);
  const dim = el(l, "div", "position:absolute;inset:0;background:radial-gradient(ellipse 85% 55% at 50% 42%,rgba(0,0,0,.84),rgba(0,0,0,.5) 65%,rgba(0,0,0,.2))");
  dim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: start, fill: "both" });

  const box = el(
    l,
    "div",
    "position:absolute;left:0;right:0;top:42%;transform:translateY(-50%);display:grid;justify-items:center;gap:.04em;padding:0 16px;" +
      "font-family:var(--font-chakra),Bahnschrift,system-ui,sans-serif;font-weight:700;line-height:1.05;text-align:center;perspective:800px",
  );
  if (quiet) box.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, fill: "both" });

  const letters: HTMLElement[] = [];
  let k = 0;
  LINES.forEach((line, li) => {
    const row = el(box, "div", `font-size:${line.size};white-space:nowrap`);
    const chars = [...text[li]];
    chars.forEach((ch, i) => {
      const outer = el(row, "span", "display:inline-block;will-change:transform,opacity");
      const c = ramp(line.colours, i / Math.max(1, chars.length - 1));
      const side = `color-mix(in srgb,${c} 40%,#000)`;
      const depth = Array.from({ length: 6 }, (_, j) => `${(j + 1) * 0.014}em ${(j + 1) * 0.014}em 0 ${side}`).join(",");
      const inner = el(outer, "span", `display:inline-block;color:${c};text-shadow:${depth}`);
      inner.textContent = ch === " " ? " " : ch;
      letters.push(outer);
      if (quiet) return;
      const at = start + k++ * 40;
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
    // The big line beats like a heart: lub-dub, rest.
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
        { duration: 1000, delay: start + k * 40 + 450, iterations: Infinity },
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
    letters.forEach((e, n) =>
      e.animate(
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
  note = { el: l, timer: window.setTimeout(out, start + hold) };
}

/**
 * The whole show, from the ticked `box` along its `row`. `finale` (the day's last task) goes bigger
 * and longer.
 */
export function love(box: Element, row: Element | null, { finale = false }: { finale?: boolean } = {}) {
  if (typeof window === "undefined") return;
  const start = BLAST + 80; // the words and emojis come in on the blast
  const hold = finale ? 3500 : 2200;
  words(nextNote(finale), start, hold);
  if (calm()) return;
  const r = (row ?? box).getBoundingClientRect();
  const y = r.top + r.height / 2;
  const back = layer(60);
  const front = layer(62);
  beam(back, r.top, r.height);
  detonate(back, y);
  pops(back, finale ? 7 : 5, start + 40, hold + 400);
  blast(front, y, finale ? 170 : 110);
  if (finale) shower(front, 90);
  window.setTimeout(() => (back.remove(), front.remove()), finale ? 6000 : 4000);
  window.setTimeout(() => buzz(30), BLAST);
  // A heartbeat on the phone as the big line lands.
  window.setTimeout(() => buzz(finale ? [18, 120, 30, 260, 18, 120, 30] : [18, 120, 30]), start + 650);
}
