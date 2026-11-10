// Tracks run side by side, each in its own strict order with its own tests: the main block (C, DS,
// Algorithms, then Digital Logic, COA, Networks), the 2nd slot (Compiler Design, then Maths), and one
// untimed track for each subject finished before this syllabus existed (OS, DBMS, TOC). Those are
// practised whenever the student likes, so their steps have no dates and stay out of the day's plan.
// A step without a track is on the main one. Pure, and shared by syllabus.ts and order.ts.

export type Track = "main" | "second" | "os" | "dbms" | "toc";
export const TRACKS: Track[] = ["main", "second", "os", "dbms", "toc"];
export const TRACK_NAME: Record<Track, string> = { main: "Main block", second: "2nd slot", os: "OS", dbms: "DBMS", toc: "TOC" };
/** The untimed tracks: no target dates, never in the day's plan, shown together as "Anytime". */
export const ANYTIME: Track[] = ["os", "dbms", "toc"];
export const ANYTIME_NAME = "Anytime";
export const isAnytime = (t: Track): boolean => ANYTIME.includes(t);
export const trackOf = (s: { track?: Track }): Track => s.track ?? "main";
