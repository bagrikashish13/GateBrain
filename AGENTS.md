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
3. **Don't touch what the app owns:** `brain/_state/` (revision memory), `brain/settings.json`, and the
   frontmatter and tables of `brain/results/**`. The one thing you may add to a result file is an `## Analysis`
   section at the end (see 2.4).
4. If you **rename or move a note**, move its revision file too:
   `brain/_state/revision/<same path, .json instead of .md>`.
5. Only create a subject's notes folder once he has started studying it. Studied so far: OS, DBMS, TOC;
   Compiler Design ongoing.
6. Run `npm run check:tests` after writing or editing a mock test. Fix every error before committing.

## Part 2: The brain (data formats)

```
brain/
  subjects.json                 subject keys, names, colours (all GATE CS subjects)
  notes/<subject>/<NN-section>/<note>.md   his short notes
  tests/<test-id>.md            mock tests (you write these)
  results/<test-id>/<YYYY-MM-DD-HHMM>.md   one per submitted attempt (the app writes these)
  plan/<YYYY-MM-DD>.md          the day's tasks
  settings.json                 exam date, new notes a day (the app writes this)
  _state/revision/...           revision memory per note (the app writes this)
```

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
- A new note is due for revision the day after it's committed. Every note is revised on a spaced schedule.

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
- Make them GATE-like: GATE-level difficulty and wording, the real MCQ/MSQ/NAT mix, plausible distractors, and
  ~2.5–3 minutes per question for `duration` (the real paper is 65 questions in 180 minutes). PYQs are welcome;
  cite the year in the solution.
- Then `npm run check:tests -- <test-id>`, commit, push. It appears in the app's Tests tab after the next sync.

### 2.3 Results (written by the app)

`brain/results/<test-id>/<YYYY-MM-DD-HHMM>.md`. Frontmatter has the score and one line per question: subject,
topic, type, marks, correct answer, his response, outcome (`correct` | `wrong` | `unattempted`), marks awarded,
seconds spent, visits, whether it was marked for review. The body has the same as tables: by subject, by topic
(weakest first), per question, and time. Question text and solutions are in `brain/tests/<test-id>.md`.

### 2.4 Analysing a result (when he asks)

1. Read the result file(s) and the test file. Look across recent attempts too (`brain/results/**`), not just one.
2. Find the weak points: wrong answers (especially negative-marked MCQs), skipped questions, topics under ~60%,
   and time sinks (questions that took much longer than average, or slow and still wrong).
3. **Teach** each weak point in the chat: the concept, why his answer was wrong, the GATE trap behind it.
4. **Update the notes**: add what he missed to the right note (or create one) in the topic's section, usually
   under `## GATE traps` or `## Where I got confused → what made it click`. Keep them short.
5. Append an `## Analysis` section at the end of the result file (the app shows it on the result page):
   2–6 bullets: what went wrong, what to revise, which notes were updated (as `[[note-name]]`).
6. If he wants, add follow-up tasks to the plan (2.5).
7. Commit and push (one commit is fine: `analysis: <test-id> <attempt>`).

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

---

## Part 3: The app

### Read first
- This file. `README.md` for setup and deploy.
- The UI is the same design system as his other app, secondBrain (`C:\dev\afterglow`):
  true black, mint `#00fd92` accent, vivid flat subject colours, square corners with cut-corner hero cards,
  Chakra Petch / IBM Plex, Lucide icons. **No glow, no blur, no shadows; never emojis as icons.**
  Colour jobs never mix: mint = progress/done; subject colour = which subject; rose `#ff2e63` = needs attention
  (wrong, overdue, weak); white = actions. Labels small and sentence case. No explanatory copy in the UI.
- **The exam screen (`/exam/[id]`) is the exception:** it copies GATE's own look (light, blue header, the
  palette's shapes and colours) on purpose. Keep it faithful to the real exam: an answer counts only after
  Save & Next or Mark for Review & Next, Clear Response, the five palette states, the NAT keypad, the
  virtual calculator, the exam summary before submit.
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
```

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
