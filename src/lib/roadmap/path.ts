// Geometry for the roadmap's winding line (pure). Points are node centres, top to bottom; each pair
// is joined by a cubic that leaves one node straight down and enters the next straight from above,
// so the line swings side to side between them.

export type Pt = { x: number; y: number };
export type Cubic = [Pt, Pt, Pt, Pt];

/** The curve from `a` down to `b`. */
export function link(a: Pt, b: Pt): Cubic {
  const k = (b.y - a.y) * 0.55;
  return [a, { x: a.x, y: a.y + k }, { x: b.x, y: b.y - k }, b];
}

export const links = (pts: Pt[]): Cubic[] => pts.slice(1).map((b, i) => link(pts[i], b));

const f = (n: number) => Math.round(n * 10) / 10;

/** SVG path data for a run of joined cubics. */
export function pathOf(curves: Cubic[]): string {
  if (!curves.length) return "";
  const [a] = curves[0];
  return `M${f(a.x)} ${f(a.y)}` + curves.map(([, c1, c2, b]) => ` C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(b.x)} ${f(b.y)}`).join("");
}

const lerp = (a: Pt, b: Pt, t: number): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

/** The first part of a cubic, up to `t` (de Casteljau). Its last point is the point at `t`. */
export function cut([p0, p1, p2, p3]: Cubic, t: number): Cubic {
  const u = Math.min(1, Math.max(0, t));
  const a = lerp(p0, p1, u);
  const b = lerp(p1, p2, u);
  const c = lerp(p2, p3, u);
  const d = lerp(a, b, u);
  const e = lerp(b, c, u);
  return [p0, a, d, lerp(d, e, u)];
}

/** A leg from one node to the next: one swing, or straight down to `via` first (past an open block) and swing from there. */
export const leg = (a: Pt, b: Pt, via: Pt | null = null): Cubic[] => (via ? [link(a, via), link(via, b)] : [link(a, b)]);

/** Approximate length of a cubic (sampled). */
export function lengthOf(c: Cubic, steps = 24): number {
  let len = 0;
  let prev = c[0];
  for (let i = 1; i <= steps; i++) {
    const p = cut(c, i / steps)[3];
    len += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
  }
  return len;
}

/** The first `t` (0–1, by length) of a leg. */
export function walkLeg(curves: Cubic[], t: number): Cubic[] {
  const lens = curves.map((c) => lengthOf(c));
  let rest = Math.min(1, Math.max(0, t)) * lens.reduce((a, b) => a + b, 0);
  const out: Cubic[] = [];
  for (const [i, c] of curves.entries()) {
    if (rest <= 0) break;
    if (rest >= lens[i]) out.push(c);
    else out.push(cut(c, rest / lens[i]));
    rest -= lens[i];
  }
  return out;
}

/** The curves walked so far: all of the first `whole` legs, then `t` of the next one. */
export function walked(legs: Cubic[][], whole: number, t: number): Cubic[] {
  const done = legs.slice(0, Math.max(0, whole)).flat();
  return whole < legs.length && t > 0 ? [...done, ...walkLeg(legs[whole], t)] : done;
}
