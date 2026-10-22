import { addDayKey } from "./time";

// The session log in brain/log/ (pure; AGENTS.md 2.8). A new agent session reads a fixed, small set:
// now.md, today's and yesterday's day files, this week's file and summary.md. Every file has a line
// cap and older days fold into their week, finished weeks into the summary, so that set never grows.

export const CAPS = { now: 15, day: 40, week: 30, summary: 60 } as const;

const DAY_FILE = /^days\/(\d{4}-\d{2}-\d{2})\.md$/;
const WEEK_FILE = /^weeks\/(\d{4}-W\d{2})\.md$/;
const THROUGH = /^Through:\s*(\d{4}-W\d{2}|none)\s*$/m;

/** ISO week of a "YYYY-MM-DD": "2026-W43" (weeks run Monday to Sunday). */
export function isoWeek(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d);
  const dow = (new Date(t).getUTCDay() + 6) % 7; // Monday 0
  const thursday = new Date(t + (3 - dow) * 86_400_000);
  const year = thursday.getUTCFullYear();
  const jan4 = Date.UTC(year, 0, 4);
  const week1 = jan4 - ((new Date(jan4).getUTCDay() + 6) % 7) * 86_400_000;
  const week = Math.floor((t - dow * 86_400_000 - week1) / (7 * 86_400_000)) + 1;
  return `${year}-W${String(week).padStart(2, "0")}`;
}

const lineCount = (text: string) => text.replace(/\s+$/, "").split("\n").length;

/**
 * Problems with the log, given its files (path relative to brain/log/ → text) and today. Each one says
 * what to do. Empty = fine. Compaction problems come first: fix those before anything else.
 */
export function checkLog(files: Map<string, string>, today: string): string[] {
  const out: string[] = [];
  const yesterday = addDayKey(today, -1);
  const thisWeek = isoWeek(today);
  const summary = files.get("summary.md");
  const through = summary ? (THROUGH.exec(summary)?.[1] ?? null) : null;

  for (const path of [...files.keys()].sort()) {
    const day = DAY_FILE.exec(path)?.[1];
    if (day && day < yesterday) out.push(`${path}: older than yesterday. Merge it into weeks/${isoWeek(day)}.md, then delete it.`);
  }
  for (const path of [...files.keys()].sort()) {
    const week = WEEK_FILE.exec(path)?.[1];
    if (week && week < thisWeek && (!through || through === "none" || through < week)) {
      out.push(`${path}: a finished week not in summary.md yet. Rewrite summary.md to include it and set "Through: ${week}".`);
    }
  }
  if (summary && !through) out.push(`summary.md: needs a "Through: YYYY-Www" line (or "Through: none").`);

  for (const [path, text] of [...files].sort(([a], [b]) => a.localeCompare(b))) {
    const cap = path === "now.md" ? CAPS.now : path === "summary.md" ? CAPS.summary : DAY_FILE.test(path) ? CAPS.day : WEEK_FILE.test(path) ? CAPS.week : null;
    if (cap === null) {
      out.push(`${path}: not a log file. Only now.md, summary.md, days/YYYY-MM-DD.md and weeks/YYYY-Www.md belong in brain/log/.`);
      continue;
    }
    const n = lineCount(text);
    if (n > cap) out.push(`${path}: ${n} lines, cap ${cap}. Shorten it: keep what matters for picking up where he left off.`);
    const day = DAY_FILE.exec(path)?.[1];
    if (day && day > today) out.push(`${path}: dated in the future.`);
  }
  return out;
}

/** The files a new session reads first, in order (the ones that exist). */
export function startupFiles(files: Iterable<string>, today: string): string[] {
  const have = new Set(files);
  const want = ["now.md", `days/${addDayKey(today, -1)}.md`, `days/${today}.md`, `weeks/${isoWeek(today)}.md`, "summary.md"];
  return want.filter((f) => have.has(f));
}
