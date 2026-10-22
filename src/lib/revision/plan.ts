import { addDayKey } from "@/lib/time";

// When each new note (never revised) first comes up (pure). A new note can come up from the day after
// it was added; at most `perDay` new notes a day, in priority order, so a big batch spreads over the
// following days. Today's allowance is what's left after the new notes already revised today.

export function planNew(fresh: { id: string; from: string }[], today: string, perDay: number, roomToday: number): Map<string, string> {
  const out = new Map<string, string>();
  const left = [...fresh];
  let day = today;
  let room = Math.max(0, roomToday);
  const cap = Math.max(1, perDay);
  while (left.length) {
    // Nothing can come up yet: jump to the first day something can.
    const first = left.reduce((m, n) => (n.from < m ? n.from : m), left[0].from);
    if (first > day) {
      day = first;
      room = cap;
    }
    for (let i = 0; i < left.length && room > 0; ) {
      if (left[i].from <= day) {
        out.set(left[i].id, day);
        left.splice(i, 1);
        room--;
      } else i++;
    }
    day = addDayKey(day, 1);
    room = cap;
  }
  return out;
}
