// Two tracks run side by side, each in its own strict order: the main block (C, DS, Algorithms, then
// Digital Logic, COA, Networks) and the 2nd slot (Compiler Design, then Maths). A step without a track is
// on the main one. Pure, and shared by syllabus.ts and order.ts.

export type Track = "main" | "second";
export const TRACKS: Track[] = ["main", "second"];
export const TRACK_NAME: Record<Track, string> = { main: "Main block", second: "2nd slot" };
export const trackOf = (s: { track?: Track }): Track => s.track ?? "main";
