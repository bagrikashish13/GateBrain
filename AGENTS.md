# AGENTS.md: GateBrain

GateBrain is a personal GATE (CS) prep system in one repo: a web app (`src/`) and the data it runs on (`brain/`).
He writes notes and mock tests with Claude Code or Antigravity; the app shows the notes, schedules revision,
plans the day and runs mock tests in a GATE-style exam screen. Results land back in the repo, so an agent can
analyse them, teach the weak points and update the notes. Single user.

**If you are an agent working on his GATE prep (notes, tests, analysis, plan), read Parts 1–2.
If you are changing the app, read Part 3 too.**

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

## Part 2: The brain (data formats)

```
brain/
  subjects.json                 subject keys, names, colours (all GATE CS subjects)
  notes/<subject>/<NN-section>/<note>.md   his short notes
  tests/<test-id>.md            mock tests (you write these)
  results/<test-id>/<YYYY-MM-DD-HHMM>.md   one per submitted attempt (the app writes these)
  plan/<YYYY-MM-DD>.md          the day's tasks
  roadmap.json                  the study roadmap to the exam (Roadmap tab)
  settings.json                 exam date, new notes a day, theme, revision start (Settings in the app)
  _state/revision/...           revision memory per note (written when he marks a note in the app)
```

### 2.0 Reading the revision plan

`npm run brain -- <command>` is a read-only helper for you (he never runs it). It uses the app's own code, so
it always matches the Revise tab:

```
npm run brain -- revise today                notes due today, in revision order (weak topics first)
npm run brain -- revise topic os/deadlock    every note in one topic not yet revised today, weakest first
npm run brain -- revise show <note>          its rating history and the day it next comes up
npm run brain -- weak                        topic strength over the last 10 mock attempts
```

- `<note>` is the path under `brain/notes/`: `os/03-deadlock/bankers-algorithm` (`.md` optional).
- `_state/revision/<note path>.json` is `{ note, card, log }`: `card.due` is the next revision (ISO),
  `log` every rating with its time. Read it if useful; don't write it.
- `settings.json`: `{ "examDate": "YYYY-MM-DD" | null, "newPerDay": 1–50, "theme": "mint" | "pink",
  "revisionStart": "YYYY-MM-DD" | null }`. `revisionStart`: notes added before that day count as added on it
  (a fresh start; set 2026-10-22, his ask).

Subject keys (`brain/subjects.json`): `os`, `dbms`, `toc`, `compiler-design`, `algorithms`, `programming-ds`,
`coa`, `computer-networks`, `digital-logic`, `discrete-maths`, `engineering-maths`, `general-aptitude`.

### 2.1 Notes

- One topic per file: `brain/notes/<subject>/<NN-section>/<kebab-case-name>.md`, e.g.
  `brain/notes/os/03-deadlock/bankers-algorithm.md`. Sections are the GATE syllabus, numbered in syllabus order.
  A new section folder for a studied subject is fine; keep the `NN-` numbering.
- Short notes for revision, not textbook chapters. Phone-first: short paragraphs, bullets, tables.
- Shape (the app styles these):

```markdown
# Banker's algorithm

## TL;DR
Two or three lines: the thing to remember. (Rendered as a highlighted card.)

## Core idea
- **Lead term:** explanation. (A bold opener becomes a lead line.)

## Where I got confused → what made it click
- **Confusion:** the click.

## GATE traps
- What PYQs test, common wrong options, formulas.

## Example
Worked example, ideally a PYQ (cite the year: GATE 2019).
```

- Math: `$...$` and `$$...$$` (KaTeX). Code: fenced blocks. Diagrams: ```` ```mermaid ```` blocks.
  Links between notes: `[[bankers-algorithm]]` (by file name). Images: put them next to the note and link relatively.
- A new note enters revision by itself: it first comes up the day after it's committed (at most `newPerDay`
  new notes a day, the rest on the following days), then on its FSRS schedule. The Revise tab and the note's
  page show the day.

### 2.2 Mock tests

One file per test: `brain/tests/<test-id>.md`. `test-id` is lowercase letters, digits, `-` (e.g.
`os-dbms-mock-03`, `full-length-01`). Tests can mix any subjects and topics.

```markdown
---
title: OS + DBMS · Mock 03
duration: 60
created: 2026-10-20
description: Optional one line.
---

## Q1
type: MCQ
marks: 1
subject: os
topic: deadlock
answer: B

Question text in Markdown. Math $O(n \log n)$, tables, code blocks, images all work.

(A) First option
(B) Second option
(C) Third option
(D) Fourth option

### Solution
Why B is right and why the others are wrong.

## Q2
type: MSQ
marks: 2
subject: dbms
topic: functional-dependencies-normal-forms
answer: A, C

...

## Q3
type: NAT
marks: 2
subject: os
topic: cpu-scheduling
answer: 2.60 to 2.70

...
```

Rules:
- `## Q<n>` starts each question; numbering is by position in the file.
- Metadata lines right under the heading: `type` (MCQ | MSQ | NAT), `marks` (1 or 2), `subject` (a key from
  `subjects.json`), `topic`, `answer`. Optional: `negative` (override), `section`.
- **`topic` must be the notes section folder name without its number**: `deadlock` for `os/03-deadlock`,
  `cpu-scheduling` for `os/04-cpu-scheduling`. That's how weak topics link to notes. The checker warns if it
  doesn't match. General Aptitude questions need no topic.
- Options are lines starting `(A)` … `(D)` (an option may run over several lines). NAT has no options.
- Answers: MCQ one letter; MSQ letters like `A, C`; NAT a number (`42`) or a range (`2.60 to 2.70`, inclusive).
- Negative marking is automatic, as in GATE: MCQ loses 1/3 (1-mark) or 2/3 (2-mark); MSQ and NAT never lose marks.
- Sections: General Aptitude questions (`subject: general-aptitude`) go in their own tab, as in GATE.
- Always write a `### Solution`; the result page shows it.
- `created:` is today's date (the repeat check uses it to know which test is newer).
- Then `npm run check:tests -- <test-id>`, commit, push. It appears in the app's Tests tab after the next sync.

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

`brain/results/<test-id>/<YYYY-MM-DD-HHMM>.md`. Frontmatter has the score and one line per question: subject,
topic, type, marks, correct answer, his response, outcome (`correct` | `wrong` | `unattempted`), marks awarded,
seconds spent, visits, whether it was marked for review. The body has the same as tables: by subject, by topic
(weakest first), per question, and time. Question text and solutions are in `brain/tests/<test-id>.md`.

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

`brain/plan/YYYY-MM-DD.md`, one file per day:

```markdown
# Thu 15 Oct 2026

- [ ] PYQ · Deadlock 2010–2024 — 1h #os
- [ ] Revise · Normal forms — 30m #dbms
- [x] Learn · LR parsing — 2h #compiler-design
- [>] Practice · Paging problems — 45m #os → 2026-10-16
```

`- [ ]` open, `- [x]` done, `- [>] … → YYYY-MM-DD` moved to that day. The kind before ` · ` is one of
Learn, Revise, PYQ, Practice, Mock, Analyse (optional). ` — <duration>` (15m, 30m, 45m, 1h, 1.5h, 2h, 3h) and
` #<subject-key>` at the end are optional. Two tasks in one day can't have the same text. He also adds and
ticks tasks in the app.

### 2.6 Roadmap

`brain/roadmap.json` is the study plan to the exam, shown on the Roadmap tab as a zig-zag of blocks with
today marked on it. Update it when he asks to change the plan (a block running late, a subject added).

```json
{
  "done": ["os", "dbms", "toc"],
  "daily": [{ "time": "30–40m", "title": "General Aptitude mock" }],
  "phases": [
    {
      "title": "Compiler Design, second half", "short": "CD", "subject": "compiler-design",
      "start": "2026-10-16", "end": "2026-10-22", "marks": "4–8",
      "focus": [{ "text": "LR family: SLR vs LALR vs CLR", "top": true }, { "text": "SDT" }],
      "skip": ["Runtime environments in depth"],
      "days": ["16–17 · LL(1)"],
      "note": "Optional one line."
    }
  ],
  "weightage": [{ "subject": "programming-ds", "marks": "11–15" }, { "subject": "discrete-maths", "label": "Maths", "marks": "13–16" }],
  "cut": ["What to drop first if behind", "..."],
  "keep": "What never to drop"
}
```

- `phases` in order; `start`/`end` inclusive `YYYY-MM-DD`; blocks must not overlap. `subject` is a key from
  `subjects.json`, or `null` for revision blocks. `short` is the node label (≤ 6 characters).
- `focus` is highest weight first; `top: true` marks the topics PYQs hit most. `done` lists subjects finished
  before the first block. Everything except `phases` is optional.
- `npm test` parses the real file; keep it passing.

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

---

## Part 3: The app

### Read first
- This file. `README.md` for setup and deploy.
- The UI is the same design system as his other app, secondBrain (`C:\dev\secondBrain`):
  true black, mint `#00fd92` accent, vivid flat subject colours, square corners with cut-corner hero cards,
  Chakra Petch / IBM Plex, Lucide icons. **No glow, no blur, no shadows; never emojis as icons.**
  Colour jobs never mix: mint = progress/done; subject colour = which subject; rose `#ff2e63` = needs attention
  (wrong, overdue, weak); white = actions. Labels small and sentence case. No explanatory copy in the UI.
- **The exam screen (`/exam/[id]`) is the exception:** it copies GATE's own look (light, blue header, the
  palette's shapes and colours) on purpose. Keep it faithful to the real exam: an answer counts only after
  Save & Next or Mark for Review & Next, Clear Response, the five palette states, the NAT keypad, the
  virtual calculator, the exam summary before submit.
- Tabs: Notes, Revise, Today, Tests, Roadmap. Settings opens from the gear on Today's GATE countdown.
- Mobile-first (360–430px), desktop secondary (the exam is laptop-first but works on a phone).

### How it works
- Next.js 16 (App Router, Cache Components, Server Actions), React 19, Tailwind 4. **This is not the Next.js in
  your training data:** read `node_modules/next/dist/docs/` before using an API you're unsure of.
- No database. Pages read `brain/` straight from disk on each request. Every write goes through
  `src/lib/repo/git.ts`: write files, `git commit` (local, instant), then push in the background (rebasing on
  GitHub's commits if needed). A background loop pulls and pushes every 3 minutes on the server.
  Auth for pushing: `GITHUB_TOKEN` from `.env`, else the machine's own git credentials.
- `.runtime/` (git-ignored): login throttle, session secret, a test in progress. Only a *submitted* test is
  committed.
- Answers and solutions never reach the browser during a test; grading happens on the server.
- Pure logic lives in `src/lib/**` with unit tests: test format (`tests/format.ts`), GATE grading
  (`tests/grade.ts`), result files (`tests/result.ts`), weak topics (`tests/topics.ts`), the plan
  (`plan/tasks.ts`), FSRS revision (`revision/schedule.ts`), the calculator (`calc.ts`).

### Commands
```
npm run dev          # http://localhost:3000
npm test             # vitest
npm run lint         # eslint, zero warnings
npm run typecheck
npm run build
npm run check:tests  # validate brain/tests/*.md
npm run brain        # read-only revision plan for agents (2.0)
```

- `scripts/brain.ts` loads the app's server modules under the `react-server` condition (so `server-only`
  imports work outside Next). New-note dates come from `revision/plan.ts` (pure, tested).

### Git
- **Never add `Co-Authored-By` or any AI/model attribution to commits** (his rule).
- Small commits with clear messages (`feat: exam palette`, `fix: nat range`). Run lint, typecheck, tests and build
  before pushing app changes.
- Deploy: see `README.md` (VM `ssh 24vm`, `~/GateBrain`, `scripts/deploy.sh`).

### Talking to him
- Front-load the answer, short paragraphs, bullets. One clear next step beats a wall of options.
- Be honest when something is a bad idea.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
