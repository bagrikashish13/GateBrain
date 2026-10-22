// Small display helpers.

const day = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
const between = (from: Date, to: Date) => Math.round((day(to) - day(from)) / 86_400_000);

/** "today", "tomorrow", "in 9 days", "in 3 mo". For due dates and rating buttons. */
export function relativeDay(d: Date, now = new Date()): string {
  const n = between(now, d);
  if (n <= 0) return "today";
  if (n === 1) return "tomorrow";
  if (n < 60) return `in ${n} days`;
  return `in ${Math.round(n / 30)} mo`;
}

/** A coming "YYYY-MM-DD": "today", "tomorrow", else "Sat 24 Oct" (or "24 Oct" without the weekday). */
export function comingDay(day: string, now = new Date(), weekday = true): string {
  const [y, m, dd] = day.split("-").map(Number);
  const d = new Date(y, m - 1, dd);
  const n = between(now, d);
  if (n <= 0) return "today";
  if (n === 1) return "tomorrow";
  return new Intl.DateTimeFormat("en-GB", { weekday: weekday ? "short" : undefined, day: "numeric", month: "short" }).format(d);
}

/** Short "how long ago": "today", "1d ago", "3mo ago". */
export function agoShort(d: Date, now = new Date()): string {
  const n = between(d, now);
  if (n <= 0) return "today";
  if (n < 60) return `${n}d ago`;
  return `${Math.round(n / 30)}mo ago`;
}

/** "7 Oct", or "7 Oct 2025" outside the current year. */
export function dayMonth(d: Date, now = new Date()): string {
  const year = d.getFullYear() === now.getFullYear() ? undefined : "numeric";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year }).format(d);
}

/** "Thu 15 Oct, 14:30" */
export function dayTime(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(d);
}

export function pct(r: number | null): string {
  return r === null ? "—" : `${Math.round(r * 100)}%`;
}

/** 42.67 → "42.67", 42 → "42", -0.33 → "−0.33" */
export function marks(x: number): string {
  const s = String(Math.round(x * 100) / 100);
  return s.startsWith("-") ? `−${s.slice(1)}` : s;
}
