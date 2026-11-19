// Tracks run side by side, each in its own strict order with its own tests:
// - the main block (C, Complexity, DS, Algorithms, then Digital Logic, COA, Networks);
// - the 2nd block: Aptitude (quant, analytical, spatial), Compiler Design and DBMS, all three every day;
// - Anytime: OS, TOC and Verbal Aptitude, practised whenever the student likes (no dates, never in the plan);
// - Last: Maths, the lowest priority, taken up only once the 2nd block is done (no dates; it may be dropped).
// A step without a track is on the main one. Pure, and shared by syllabus.ts and order.ts.

export type Track = "main" | "ga" | "cd" | "dbms" | "maths" | "os" | "toc" | "verbal";
export const TRACKS: Track[] = ["main", "ga", "cd", "dbms", "maths", "os", "toc", "verbal"];
export const TRACK_NAME: Record<Track, string> = {
  main: "Main block",
  ga: "Aptitude",
  cd: "Compiler Design",
  dbms: "DBMS",
  maths: "Maths",
  os: "OS",
  toc: "TOC",
  verbal: "Verbal",
};
/** The 2nd block: dated tracks done every day side by side, after the main block's hours. */
export const SECOND_BLOCK: Track[] = ["ga", "cd", "dbms"];
export const SECOND_BLOCK_NAME = "2nd block";
/** The untimed tracks: no target dates, never in the day's plan, shown together as "Anytime". */
export const ANYTIME: Track[] = ["os", "toc", "verbal"];
export const ANYTIME_NAME = "Anytime";
/** Lowest priority: no dates, never in the day's plan, started only when the 2nd block is finished. */
export const LATER: Track[] = ["maths"];
export const LATER_NAME = "Last, if time allows";
export const isAnytime = (t: Track): boolean => ANYTIME.includes(t);
export const isLater = (t: Track): boolean => LATER.includes(t);
/** No target dates: Anytime and Last. */
export const isUndated = (t: Track): boolean => isAnytime(t) || isLater(t);
export const trackOf = (s: { track?: Track }): Track => s.track ?? "main";
