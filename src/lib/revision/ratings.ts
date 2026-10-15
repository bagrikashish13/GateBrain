// The four self-ratings after revising a note (safe on the client; no scheduler here).
export type Rating4 = "forgot" | "fuzzy" | "gotit" | "easy";
export const RATINGS: Rating4[] = ["forgot", "fuzzy", "gotit", "easy"];
export const RATING_LABEL: Record<Rating4, string> = { forgot: "Forgot", fuzzy: "Fuzzy", gotit: "Got it", easy: "Easy" };
