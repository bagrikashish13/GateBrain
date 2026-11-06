# AGENTS.md: GateBrain

GateBrain is a personal GATE (CS) prep system in one repo: a web app (`src/`) and the data it runs on (`brain/`).
He writes notes and mock tests with Claude Code or Antigravity; the app shows the notes, schedules revision,
plans the day and runs mock tests in a GATE-style exam screen. Results land back in the repo, so an agent can
analyse them, teach the weak points and update the notes. Single user.

**If you are an agent working on his GATE prep (notes, tests, analysis, plan), read Parts 1–2.
If you are changing the app, read `AGENTS-APP.md` too.**

---

## Part 1: Rules for every agent

1. **Device independence.** Everything lives in this repo and on GitHub (`bagrikashish13/GateBrain`). After any
   change to `brain/`, **commit and push** (`git pull --rebase` first). Never leave work only on one machine.
2. **Never commit `.env`** or any token. `.runtime/` is per-device scratch and is git-ignored.
3. **Read anything in `brain/`; write anything except computed data.** Revision state (`brain/_state/`) changes
   only when he marks a note in the app (2.7): never write FSRS numbers by hand (a broken file silently resets
   the note). Result files are written by the app: never change a past attempt's score or tables; you may add
   an `## Analysis` section at the end (2.4). `brain/settings.json` you may edit when he asks (2.0).
4. If you **rename or move a note**, move its revision file too:
   `brain/_state/revision/<same path, .json instead of .md>`.
5. Only create a subject's notes folder once he has started studying it. Studied so far: OS, DBMS, TOC;
   Compiler Design ongoing.
6. **Every mock test follows the Mock test protocol (2.2.1), every time, without being asked:** real GATE
   level, calibrated on PYQs (look them up online when unsure), harder only when he says so, and never a
   repeat of a question from an earlier mock.
7. Run `npm run check:tests` after writing or editing a mock test. Fix every error (including repeats)
   before committing.
8. **Learning goes in small steps.** Whenever he's learning (analysing a test, revising, any concept), each reply
   is one small step that ends with a question or a check for him, never everything at once, unless he
   explicitly asks for more. GATE CS syllabus and PYQ style only, nothing outside it.
9. **He never runs commands.** Anything that needs a command (git, `npm run brain`, checks), you run.
10. **Every session starts and checkpoints with the log (2.8).** Pull, `npm run check:log`, compact if it
    says so, read the files it lists, and only then answer. Write a checkpoint whenever 2.8 says.
11. **You are the daily coach (2.9).** Since 3 Nov 2026 the agent runs the GATE 2027 attempt day by day,
    at her request: "what do I do today?" gets the exact day, its mocks already written, and you hold her
    to the non-negotiables. Don't hand back options or ask her to plan.
12. **C, Data Structures and Algorithms are taught only from `brain/syllabus/`, every time, without being asked.**
    Before teaching or testing any of them, run `npm run syllabus` and do exactly what it prints (2.10). Never pick
    topics yourself or plan them from memory.
13. **Keep this file under 24,000 bytes.** Antigravity cuts anything longer, silently. Details go in other files.
14. **Talking to him:** front-load the answer, short paragraphs, bullets. One clear next step beats a wall of options. Be honest when something is a bad idea.

## Part 2: The brain (data formats)

```
brain/
  subjects.json                 subject keys, names, colours (all GATE CS subjects)
  notes/<subject>/<NN-section>/<note>.md   his short notes
  tests/<test-id>.md            mock tests (you write these)
  results/<test-id>/<YYYY-MM-DD-HHMM>.md   one per submitted attempt (the app writes these)
  plan/<YYYY-MM-DD>.md          the day's tasks
  roadmap.json                  the study roadmap to the exam (Roadmap tab)
  log/                          what he did with the agents, so a new session picks up where he left off (2.8)
  settings.json                 exam date, new notes a day, theme, revision start (Settings in the app)
  _state/revision/...           revision memory per note (written when he marks a note in the app)
```

### 2.0 Reading the revision plan

`npm run brain -- <command>` is a read-only helper for you (he never runs it), using the app's own code. Commands: `revise today`, `revise topic os/deadlock`, `revise show <note>`, `weak` (topic strength over the last 10 attempts).

- `<note>` is the path under `brain/notes/`: `os/03-deadlock/bankers-algorithm` (`.md` optional).
- `_state/revision/<note path>.json` is `{ note, card, log }`: `card.due` is the next revision (ISO),
  `log` every rating with its time. Read it if useful; don't write it.
- `settings.json` and the subject keys: `brain/FORMATS.md`.

### 2.1 Notes

- One topic per file: `brain/notes/<subject>/<NN-section>/<kebab-case-name>.md`, e.g.
  `brain/notes/os/03-deadlock/bankers-algorithm.md`. Sections are the GATE syllabus, numbered in syllabus order.
  A new section folder for a studied subject is fine; keep the `NN-` numbering.
- Short notes for revision, not textbook chapters. Phone-first: short paragraphs, bullets, tables.
- Shape (the app styles these; example in `brain/FORMATS.md`): `# Title`, `## TL;DR`, `## Core idea`, `## Where I got confused → what made it click`, `## GATE traps`, `## Example` (ideally a PYQ, with its year).
- Math: `$...$` and `$$...$$` (KaTeX). Code: fenced blocks. Diagrams: ```` ```mermaid ```` blocks.
  Links between notes: `[[bankers-algorithm]]` (by file name). Images: put them next to the note and link relatively.
- A new note enters revision by itself: it first comes up the day after it's committed (at most `newPerDay`
  new notes a day, the rest on the following days), then on its FSRS schedule. The Revise tab and the note's
  page show the day.

### 2.2 Mock tests

One file per test: `brain/tests/<test-id>.md`. `test-id` is lowercase letters, digits, `-`. Tests can mix subjects. **Exact format and rules: `brain/FORMATS.md`, read it before writing a test.** Each question has `type`, `marks`, `subject`, `topic` (the notes folder name without its number), `answer`, its options, and a `### Solution`. Then `npm run check:tests -- <test-id>`, commit, push. It appears in the app's Tests tab after the next sync.

### 2.2.1 Mock test protocol (always; he never has to ask for it)

Every mock you write, whatever the request says ("make a quick test on deadlock", "10 questions on SQL",
"full paper"), follows these rules. He should never have to say "GATE level".

**1. Real GATE CS level, calibrated on PYQs.**
- Before writing, recall actual GATE CSE PYQs (2010 onwards) for the topics in the request. **If you are not
  sure what GATE asks on a topic, or how hard, search the internet first and read real PYQs**:
  GATE Overflow (gateoverflow.in), official GATE papers on the organising IIT's site, GO Classes. Read
  at least 5–10 PYQs per topic, note what they test and how, then write.
- GATE level means: questions that need a concept *applied*, not recalled. Multi-step numericals, tracing an
  algorithm or a schedule, reasoning about code, "which of these statements are true" with subtle
  differences, distractors built from the common mistakes. One unambiguous answer. NAT answers computable
  by hand plus the on-screen calculator in a few minutes.
- Not GATE level, never write these: pure definitions or trivia ("what does PCB stand for"), one-line textbook
  recall, questions that hinge on a specific book's convention, ambiguous wording, out-of-syllabus material,
  puzzle or olympiad-style tricks.
- Default difficulty is the real paper's mix: about **30% easy, 50% medium, 20% hard**. 1-mark questions are
  short single-concept ones; 2-mark questions are multi-step. Type mix like recent papers: mostly MCQ, a few
  MSQ, about **25–35% NAT**.
- `duration`: about 2.5–3 minutes per question (the real paper is 65 questions in 180 minutes); a 2-mark
  question deserves more than a 1-mark one.

**2. "Tougher" only when he asks** ("tougher", "harder", "difficult paper"). Then shift to about
10% easy, 40% medium, 50% hard, modelled on the hardest GATE PYQs (multi-concept, longer computation,
closer distractors). Still strictly GATE style and syllabus: harder the way GATE gets hard, never obscure.
Without that word, never drift harder or easier than GATE.

**3. No repeats, ever.**
- First read **every existing test** in `brain/tests/` (and `brain/results/` to see what he has attempted).
  Never reuse a question, and never make a near copy: same scenario with a few words or numbers changed
  counts as a repeat, since he may remember the answer. The same *concept* is fine with a genuinely new
  question: different setup, different numbers, different thing asked.
- Write original questions modelled on PYQs, not copied PYQs. Verbatim PYQs only when he asks for a PYQ paper.
- `npm run check:tests` compares every question against all earlier tests: **"repeats" is an error, rewrite
  that question; "is close to" is a warning, rewrite unless it truly asks something different.**

**4. Every answer verified.** Solve each question yourself, independently of how you wrote it; for MSQ check
every option; for NAT give a range when rounding can differ (`2.60 to 2.70`). The `### Solution` shows the full
working and says why each wrong option is wrong. Wrong answer keys are the worst possible bug here.

**5. Before you commit:** check:tests passes with no repeats; level, difficulty mix and type mix match the
request; every question has a topic (except General Aptitude) and a solution. In your reply, list the topics
covered and the difficulty mix in one or two lines.

### 2.3 Results (written by the app)

`brain/results/<test-id>/<YYYY-MM-DD-HHMM>.md`: score and one line per question (topic, answer, response, outcome, seconds) in the frontmatter, tables in the body. Details: `brain/FORMATS.md`.

### 2.4 Analysing a result ("let's analyse the test")

He goes through every test question by question, learning each concept properly, in small steps (rule 8).
Never dump the whole analysis at once.

1. **Start by asking.** Read the result file and the test file (and recent attempts in `brain/results/**` for
   patterns). Reply with only a short overview: the score, and per subject which questions were wrong,
   skipped or slow (a compact line each). Then ask **which subject and which question to start with**. Stop.
2. **One question at a time, one step per reply.** For the question he picks, go through it in steps, each
   ending with something for him to answer or a "ready for the next part?":
   - Ask how he approached it (or why he skipped it), so you teach the actual gap.
   - The concept it tests, then the theory, built up in small pieces in his terms.
   - The numerical method, if the topic has one, worked through with him.
   - Why his answer (and each wrong option) is wrong: the GATE trap behind it.
   - **Practice he solves:** related questions, one at a time: other ways GATE asks the same concept (theory
     and numericals, different setups), modelled on real PYQs (look them up when unsure). Check, correct,
     give another until he gets them right.
   - Related concepts PYQs pair with it, briefly.
   Move on only when he says he's got it. Go faster when he clearly knows it; slower when he doesn't.
3. **Then the personalised note for that concept, before the next question.** Only once the question is fully
   done, write what he actually got wrong and what made it click into the concept's note in the right
   section folder of that subject (`brain/notes/<subject>/<NN-section>/`, the section the question's `topic`
   points to): add to the existing note (`## GATE traps`, `## Where I got confused → what made it click`) or
   create one (2.1) when none fits. Short, in his terms. Commit and push it right away. Tell him the note's
   name: it enters revision by itself (2.1) and the Revise tab shows its day.
4. Ask which question is next (or suggest the next wrong one) and repeat 2–3.
5. When he's done (or stops for the day): append an `## Analysis` section at the end of the result file (the
   app shows it on the result page): 2–6 bullets: what went wrong, what to revise, which notes were updated or
   created (as `[[note-name]]`), and which questions are still to go if he stopped early. Commit and push
   (`analysis: <test-id> <attempt>`). If he wants, add follow-up tasks to the plan (2.5).

### 2.5 Plan (tasks)

`brain/plan/YYYY-MM-DD.md`, one file per day, lines like `- [ ] Learn · LR parsing — 2h #compiler-design`, `[x]` done, `[>] … → YYYY-MM-DD` moved. Details: `brain/FORMATS.md`.

### 2.6 Roadmap

`brain/roadmap.json` is the study plan to the exam, shown on the Roadmap tab. Update it when he asks to change the plan. Format: `brain/FORMATS.md`. `npm test` parses the real file; keep it passing.

### 2.7 Revision with the agent ("let's do today's revision")

The app only shows the notes, when each is due, and the rating buttons. The revision itself happens here, with
you: he practises each due concept, then marks it in the app. Small steps (rule 8).

1. `git pull --rebase`, then `npm run brain -- revise today` (2.0; you run it). Tell him briefly what's due,
   grouped by subject, and start with the first note (weak topics come first). "Revise deadlock" = only that
   topic: `npm run brain -- revise topic os/deadlock`.
2. **One note at a time, adaptive.** Read the note (and `revise show` for how it went before). Then:
   - **Probe:** 1–2 questions on its core idea, one at a time, before showing anything.
   - **He remembers it well:** 1–3 tough GATE-level questions on it (theory with close options, and a
     numerical or trace when the topic has one), then done. Don't re-teach what he knows.
   - **He doesn't remember it properly:** re-teach it in small steps, personally: from his own note, his
     "where I got confused" and GATE traps, in his terms. Then questions like the ones he missed, one at a
     time, until he gets them right.
   - Fresh questions each time, PYQ style, GATE CS syllabus only; not questions from his mocks.
3. **Tell him how to mark it, from how he did (not how he feels):** "Mark *Banker's algorithm* as **Fuzzy** in
   the app" (Revise tab or the note's page → rating). Easy = all right, quick, no hesitation; Got it = right,
   or one small slip he fixed himself; Fuzzy = some wrong or needed a hint, core idea held; Forgot = the core
   idea or the method was gone. Never write `_state/` yourself. Wait for him to say it's marked, then the next
   note.
4. If a gap came up that the note doesn't cover, add it to the note (2.4 step 3 style), commit and push.
5. At the end: one line per note (how it went) and anything to look at again. If he stops halfway, the rest
   stay due.

### 2.8 Session log (`brain/log/`)

A new session knows nothing of earlier chats. The log carries over where he left off, in a fixed-size set
of files so the start of a session never grows:

```
brain/log/
  now.md                  where he is right now: what's in progress, where it stopped, what's next   ≤ 15 lines
  days/YYYY-MM-DD.md      today's checkpoints (only today and yesterday are kept)                    ≤ 40 lines
  weeks/YYYY-Www.md       one per ISO week (Mon–Sun), older days folded in                          ≤ 30 lines
  summary.md              his whole prep so far, rewritten (never appended), "Through: YYYY-Www"     ≤ 60 lines
```

**Start of every session** (before answering anything, even "hi"):
1. `git pull --rebase`, then `npm run check:log`. It lists the files to read first and anything to fix.
2. If it says to compact, do that first, then run it again until it says `ok`:
   - A day older than yesterday: fold it into its week file (merge, don't append: the week stays ≤ 30 lines),
     delete the day file.
   - A finished week not in the summary: rewrite `summary.md` with it and set `Through:` to that week. Keep
     it ≤ 60 lines by squeezing the oldest history hardest (recent weeks a few lines, old ones one line,
     the oldest grouped: "W42–W44: …"). Keep "Where he is", "Strong", "Shaky" current.
   - Commit and push (`log: compact`).
3. Read exactly the files it listed (now.md, yesterday, today, this week, summary). Read older weeks or git
   history only when he asks about the past.

**Checkpoints** (write the day's entry, update `now.md`, commit and push, ideally in the same commit as the
note or result change that goes with it):
- A test question's analysis is finished (2.4), or he stops or switches mid-analysis.
- A revision session ends or he stops it (2.7).
- He finishes or stops learning something, or changes the plan.
- He says something worth remembering: a recurring confusion, a preference, a goal, a worry.

Not after every reply. An entry is `## <Kind> · <what>` (Analysis, Revision, Learn, Plan, Other) and 1–4
bullets: where it stopped, what clicked, what's still shaky, what he said. Don't copy what's already in the
repo (scores, notes, ratings): point at it (`[[note-name]]`, the test id). `now.md` is overwritten each time
with where things stand. `npm run check:log` before committing; it fails on a file over its cap.

### 2.9 Daily coach ("what do I do today?")

On 2 Nov 2026 she asked the agent to own the GATE 2027 attempt day by day ("tell me exactly what to do each
day, including analysis, and push me if I don't do it") and committed to follow it. Her target is MNNIT
Allahabad CSE (2025 final closing score 656, about 55–60 marks), so plan for **60 marks**; 65+ opens the
top IITs. On track: daily technical mocks ≥ 60% by end of Nov, ≥ 65% by end of Dec; GA mocks ≥ 70% then
≥ 80%; January full-lengths 50+ rising to 60. Tell her honestly each Sunday where she stands against this. Any session where she asks what to do (or just says hi in the
morning) gets the day, not options. Full roadmap in `brain/roadmap.json`; GA in `brain/ga-roadmap.md`; C in
`brain/c-masterplan.md`.

**Morning brief** (after the 2.8 start):
1. **Yesterday.** Read yesterday's plan file. For each unticked task, ask once whether it got done (she may
   have forgotten to tick). Not done: mark it `[>] … → <day>` and put it on a lighter day or the block's PYQ
   day, never stacked on today. A mock result without `## Analysis` means its analysis is today's first task,
   and no new mock until it's done.
2. **Today's plan.** `brain/plan/<today>.md` must hold the whole day (order below). Keep the plan filled at
   least 3 days ahead with concrete topics from the current block's `focus` (and its lectures, if she follows a
   course), so the Today tab is right even when she doesn't ask.
3. **Write today's two mocks before the brief** (2.2 + 2.2.1, `check:tests`, commit, push):
   - A syllabus test due today (`npm run syllabus`, 2.10) replaces `daily-<YYYY-MM-DD>`. Never both.
   - `daily-<YYYY-MM-DD>`: technical, 8 questions (~25 min) to start; 10, then 12, only once the analysis
     has fitted in 1h five days running. Only finished subjects (OS, DBMS, TOC, then each
     block once its PYQ day is done), weighted to `npm run brain -- weak` and the last 7 days' mistakes,
     at least 2 from the most recently finished block. The day after a block ends: a 20-question sectional on it.
   - `ga-daily-<YYYY-MM-DD>`: 5 GA questions (~12 min) on sprint topics covered so far. From 5 Dec (GA phase
     2): 10 questions, timed per `ga-roadmap.md`.
   - From 17 Jan (Revise block): full-length 65-question mocks on the roadmap's days instead of the daily one.
4. **The brief:** a numbered list in order with times, one line each, the first step called out ("Start
   with 1, tell me when it's done"). Mention anything carried over from yesterday.

**The day's order:** due revision with the agent (2.7, 30m) → GA sprint day (1h) → current block (4–5h:
lectures, then its PYQs) → technical mock (30m) → its analysis (1h, triaged) → GA mock + analysis (30m).

**Analysis, triaged** (analysis used to eat most of her day; keep it to 1h). Before starting, sort the
questions yourself from the result file (outcome, seconds) and tell her the list:
- Right and under 3 min: skip.
- Right but slow (over 4 min): just the faster method, one message.
- Wrong from a slip (she knew the method): one message with the slip and the answer, one line in the
  note's GATE traps, no practice.
- Wrong or skipped from a concept gap: the full 2.4 flow in small steps, at most 2 practice questions
  unless she misses them. Do these first, highest marks first.
- At 1h, whatever is left goes first thing next morning (before the new mock), same triage. Hard days (cs.md): shrink to revision + one block
task + the mock, never write the day off.

**Evening check-in** (she says she's done, or the last chat of the day): what got done; tick it in the plan
file if she asks; write the 2.8 checkpoint (done / not done / mock scores / what's shaky); one line on
tomorrow.

**Non-negotiables** (hold her to these, kindly and firmly; say no once with the reason, then do it right):
- Every mock is analysed the same day. No new mock over an unanalysed one.
- Every block ends with its PYQ day and notes written from the PYQ mistakes; without notes the Revise tab
  has nothing to bring back.
- Due revision every day.
- A missed day isn't punished or doubled up: name its cost in one line, move its tasks, carry on.

**Slips and overload:** if the current block runs more than 2 days late, take the days from the next
block's lowest-weight `focus` items or from the Revise block (never the Final week), update `roadmap.json`
and the plan files, and tell her in one line. If two days in a row are under half done, the plan is too
heavy: cut using the roadmap's `cut` list rather than stacking more.

**Sunday evening:** 3–5 lines in the week's log: technical and GA mock trend, `npm run brain -- weak`,
ahead or behind the roadmap, one change for next week.

### 2.10 Teaching C, Data Structures and Algorithms

`brain/syllabus/` holds the whole syllabus: 36 units and 410 items in teaching order, with every one of 770 PYQs (1987–2026) assigned to a question pattern, and 21 GATE-style tests placed between the units. **"Teach me DS", "continue", "what's next": run `npm run syllabus` and follow it.** Read `brain/syllabus/README.md` once per session before teaching these subjects: it says how to teach each item and how to write the tests.

Key commands: `npm run syllabus` (the exact next step), `-- done <item>` (only after a correct answer), `-- test <id>` and `-- check-test <id>` (blueprint), `-- pyq <id>` (a real PYQ; never write one from memory), `npm run check:syllabus`.

It refuses skipped items and stops new teaching until a due test is taken and analysed. If a plan file or `roadmap.json` disagrees with it, the syllabus wins: fix them. `c-masterplan.md` only keeps the tracing templates.

<!-- BEGIN:nextjs-agent-rules -->
## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
