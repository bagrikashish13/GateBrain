"use client";

import { DRUM_H, Drum, FACE_H, type DrumItem } from "./drum";

export type When = "past" | "today" | "future";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const daysIn = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate(); // m: 1–12

/**
 * DD · MMM · YY as three drums (SPEC §6.1), one quiet window across them (the same for every day:
 * the line above the weekday already says whether it's today). Past days with undone tasks carry
 * a rose diamond on the day drum.
 */
export function DatePicker(props: { date: string; years: number[]; slipped: Set<string>; onChange: (date: string) => void }) {
  const { date, years, slipped } = props;
  const [y, m, d] = date.split("-").map(Number);
  const iso = (yy: number, mm: number, dd: number) => `${yy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;

  // Changing the month or year keeps the day, or the month's last day if it's shorter.
  const set = (yy: number, mm: number, dd: number) => props.onChange(iso(yy, mm, Math.min(dd, daysIn(yy, mm))));

  const dayItems: DrumItem[] = Array.from({ length: daysIn(y, m) }, (_, i) => {
    const key = iso(y, m, i + 1);
    return { key: String(i + 1), label: String(i + 1).padStart(2, "0"), slipped: slipped.has(key) };
  });
  const monthItems: DrumItem[] = MONTHS.map((label) => ({ key: label, label }));
  const yearItems: DrumItem[] = years.map((yy) => ({ key: String(yy), label: String(yy % 100).padStart(2, "0") }));

  return (
    <div
      role="group"
      aria-label={`Date: ${new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`))}`}
      // mr: a little air between the date and the phone's edge.
      className="relative mr-2 flex flex-none items-stretch"
      style={{ height: DRUM_H }}
    >
      <Drum label="Day" items={dayItems} index={d - 1} width={46} onChange={(i) => set(y, m, i + 1)} />
      <Seam />
      <Drum label="Month" items={monthItems} index={m - 1} width={58} onChange={(i) => set(y, i + 1, d)} />
      <Seam />
      <Drum label="Year" items={yearItems} index={Math.max(0, years.indexOf(y))} width={44} onChange={(i) => set(years[i], m, d)} />

      {/* The drums curve away into the dark above and below. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(180deg, #000 2%, rgba(0,0,0,.72) 22%, rgba(0,0,0,.12) 38%, transparent 44%, transparent 56%, rgba(0,0,0,.12) 62%, rgba(0,0,0,.72) 78%, #000 98%)" }}
      />
      <Window />
    </div>
  );
}

function Seam() {
  return <i aria-hidden className="relative z-[1] w-px flex-none self-center bg-line-2" style={{ height: FACE_H + 18 }} />;
}

/** The window across the three drums: two hairlines and a small notch at each end. */
function Window() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-1/2 border-y border-fg/25"
      style={{ height: FACE_H + 4, marginTop: -(FACE_H + 4) / 2 }}
    >
      <i className="absolute top-1/2 left-0 h-3 w-[2px] -translate-y-1/2 bg-fg/50" />
      <i className="absolute top-1/2 right-0 h-3 w-[2px] -translate-y-1/2 bg-fg/50" />
    </div>
  );
}
