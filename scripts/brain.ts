// Read-only views of the revision plan for agents: `npm run brain -- <command>`. Claude Code /
// Antigravity run this to know what's due (AGENTS.md 2.7); he never runs it. It uses the app's own
// code, so the list is exactly the Revise tab's. Nothing is written: he rates notes in the app.
// Runs under the react-server condition so the app's server modules load outside Next.
process.env.TZ ||= "Asia/Kolkata";

import { readNote } from "../src/lib/brain/notes";
import { RATING_LABEL } from "../src/lib/revision/ratings";
import { readState, todayRevision, topicRevision, type RevisionItem } from "../src/lib/revision/store";
import { listResults } from "../src/lib/tests/store";
import { topicStats, weakTopics } from "../src/lib/tests/topics";
import { dayKey } from "../src/lib/time";

const HELP = `npm run brain -- <command>

  revise today                      notes due today, in the order to revise them
  revise topic <subject>/<topic>    every note in one topic, weakest memory first
  revise show <note>                a note's revision history and next day
  weak                              topic strength from the last 10 mock attempts, weakest first

<note> is the path under brain/notes/, e.g. os/03-deadlock/bankers-algorithm(.md).`;

const fail = (msg: string): never => {
  console.error(msg);
  process.exit(1);
};

const pct = (x: number | null) => (x === null ? "new" : `${Math.round(x * 100)}%`);
const short = (id: string) => id.replace(/\.md$/, "");

function noteId(arg: string | undefined): string {
  if (!arg) fail("Which note? e.g. os/03-deadlock/bankers-algorithm");
  const id = arg!.replace(/\\/g, "/").replace(/^(\.\/)?(brain\/)?notes\//, "").replace(/(\.md)?$/i, ".md");
  if (!readNote(id.split("/"))) fail(`No note brain/notes/${id}.`);
  return id;
}

function itemLine(i: RevisionItem): string {
  const flags = [i.weak ? "weak topic" : null, i.overdue ? `${i.overdue}d overdue` : null, i.state ? `recall ${pct(i.recall)}, revised ${i.state.log.length}x` : "new"].filter(Boolean).join(", ");
  return `- ${short(i.note.id)}  "${i.note.title}"  (${flags})`;
}

async function revise(args: string[]): Promise<void> {
  const [sub, a] = args;
  if (sub === "today") {
    const t = await todayRevision();
    console.log(`Due today: ${t.due.length} · done today: ${t.done.length} · new notes held back: ${t.later} · ${t.notes} notes`);
    for (const i of t.due) console.log(itemLine(i));
    if (t.done.length) console.log(`Done today: ${t.done.map((d) => `${short(d.note.id)} (${RATING_LABEL[d.rating]})`).join(", ")}`);
    console.log(`Next 7 days: ${t.forecast.map((f) => `${f.day.slice(5)} ${f.count}`).join(" · ")}`);
    return;
  }
  if (sub === "topic") {
    const [subject, topic] = (a ?? "").split("/");
    if (!subject || !topic) fail("Use: revise topic <subject>/<topic>, e.g. os/deadlock");
    const items = await topicRevision(subject, topic);
    if (!items.length) console.log(`No notes left to revise today in ${subject}/${topic}.`);
    for (const i of items) console.log(itemLine(i));
    return;
  }
  if (sub === "show") {
    const id = noteId(a);
    const s = readState(id);
    const next = (await todayRevision()).all.find((i) => i.note.id === id)?.nextDay;
    console.log(`${s ? `${s.card.reps} revisions, ${s.card.lapses} forgotten` : "Never revised (new note)"} · next ${next ?? "—"}`);
    for (const l of s?.log ?? []) {
      const d = new Date(l.at);
      console.log(`- ${dayKey(d)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} ${RATING_LABEL[l.rating]}`);
    }
    return;
  }
  fail(HELP);
}

function weak(): void {
  const results = listResults();
  const stats = topicStats(results);
  const weakSet = new Set(weakTopics(stats).map((t) => `${t.subject}/${t.topic}`));
  console.log(`From the last ${Math.min(10, results.length)} of ${results.length} attempts. Weak = 2+ questions and under 60% right (skips count as misses).`);
  for (const t of stats) {
    const key = `${t.subject}/${t.topic ?? "—"}`;
    console.log(`${weakSet.has(key) ? "WEAK " : "     "}${key}  ${t.correct}/${t.questions} right (${pct(t.strength)}), ${t.wrong} wrong, ${t.unattempted} skipped`);
  }
}

async function main(): Promise<void> {
  const [cmd, ...args] = process.argv.slice(2);
  if (cmd === "revise") return revise(args);
  if (cmd === "weak") return weak();
  console.log(HELP);
  if (cmd && cmd !== "help") process.exit(1);
}

main().catch((err: Error) => fail(err.message));
