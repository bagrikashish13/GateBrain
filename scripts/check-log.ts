// Checks the session log at the start of every agent session: `npm run check:log` (AGENTS.md 2.8).
// Prints what to read first, then anything to compact or shorten. Exit code 1 until that's fixed.
// Claude Code / Antigravity run this; he never does.
process.env.TZ ||= "Asia/Kolkata";

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { checkLog, startupFiles } from "../src/lib/log";
import { dayKey } from "../src/lib/time";

const root = join(process.env.REPO_PATH || join(import.meta.dirname, ".."), "brain", "log");
const files = new Map<string, string>();
const walk = (rel: string) => {
  const dir = join(root, rel);
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const path = rel ? `${rel}/${name}` : name;
    if (statSync(join(root, path)).isDirectory()) walk(path);
    else files.set(path, readFileSync(join(root, path), "utf8").replace(/\r\n/g, "\n"));
  }
};
walk("");

const today = dayKey(new Date());
const start = startupFiles(files.keys(), today);
const count = (t: string) => t.replace(/\s+$/, "").split("\n").length;
console.log(`Today ${today}. Read first (brain/log/): ${start.length ? start.map((f) => `${f} (${count(files.get(f)!)})`).join(", ") : "nothing yet"}`);

const problems = checkLog(files, today);
for (const p of problems) console.log(`  fix: ${p}`);
if (!problems.length) console.log("  ok");
process.exit(problems.length ? 1 : 0);
