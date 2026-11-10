# Formats in brain/

The exact file formats, moved out of AGENTS.md so that file stays under the 24,000 bytes Antigravity reads. Read the section you need before writing a test, a plan file or the roadmap.

## Settings and subjects (AGENTS.md 2.0)

- `settings.json`: `{ "examDate": "YYYY-MM-DD" | null, "newPerDay": 1–50, "theme": "mint" | "pink",
  "revisionStart": "YYYY-MM-DD" | null }`. `revisionStart`: notes added before that day count as added on it
  (a fresh start; set 2026-10-22, his ask).

Subject keys (`brain/subjects.json`): `os`, `dbms`, `toc`, `compiler-design`, `algorithms`, `programming-ds`,
`coa`, `computer-networks`, `digital-logic`, `discrete-maths`, `engineering-maths`, `general-aptitude`.

## Notes (AGENTS.md 2.1)

Shape (the app styles these):

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

## Mock tests (AGENTS.md 2.2)

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
difficulty: medium

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
difficulty: hard
pyq: GATE 2021 Set 1 Q38

...

## Q3
type: NAT
marks: 2
subject: os
topic: cpu-scheduling
answer: 2.60 to 2.70
difficulty: easy

...
```

Rules:
- `## Q<n>` starts each question; numbering is by position in the file.
- Metadata lines right under the heading: `type` (MCQ | MSQ | NAT), `marks` (1 or 2), `subject` (a key from
  `subjects.json`), `topic`, `answer`. Optional: `negative` (override), `section`, `syllabus` (the item it tests, like
  `syllabus: D07.5`, required in the tests of `brain/syllabus/`).
- **`topic` must be the notes section folder name without its number**: `deadlock` for `os/03-deadlock`,
  `cpu-scheduling` for `os/04-cpu-scheduling`. That's how weak topics link to notes. The checker warns if it
  doesn't match. General Aptitude questions need no topic.
- Options are lines starting `(A)` … `(D)` (an option may run over several lines). NAT has no options.
- Answers: MCQ one letter; MSQ letters like `A, C`; NAT a number (`42`) or a range (`2.60 to 2.70`, inclusive).
- Negative marking is automatic, as in GATE: MCQ loses 1/3 (1-mark) or 2/3 (2-mark); MSQ and NAT never lose marks.
- Sections: General Aptitude questions (`subject: general-aptitude`) go in their own tab, as in GATE.
- Always write a `### Solution`; the result page shows it.
- `created:` is today's date (the repeat check uses it to know which test is newer).
- **`difficulty: easy | medium | hard` on every question** (every test created from 10 Nov 2026). Judge it
  against real PYQs of the topic, not by feel: easy = one concept, one step; medium = a concept applied in two
  or three steps; hard = the hardest PYQs of the topic (two concepts, a longer trace or computation, close
  distractors). The checker enforces GATE's mix: at least about 20% hard and at most about 40% easy (10
  questions: ≥ 2 hard, ≤ 4 easy; 5 questions: ≥ 1 hard, ≤ 2 easy). Only when he asks for a harder paper, put
  `level: tougher` in the frontmatter: then at least about 40% hard and at most about 20% easy.
- **Every hard question names the real PYQ it is calibrated on: `pyq: 2019-23`.** Read that PYQ first
  (`npm run syllabus -- pyq <id>`) and write a new question as hard as it, never a copy of it. In subjects with
  a syllabus in `brain/syllabus/` the id must be in its `pyq-index.jsonl`; in other subjects any GATE reference
  with its year (`GATE 2021 Set 1 Q38`).
- **No repeats, no re-skins.** The checker compares every question with every earlier test and with every
  real PYQ in GATE Overflow's books (fetched once per device). It sees through renamed variables, swapped
  strings and changed numbers. 80% alike or more is an error; 55% is a note to look at.
- **A retest (`<id>-r2`) uses new setups for the same concepts**: a different program, structure or scenario,
  and a different thing asked. Never the first test's questions with new names, strings or numbers: a retest
  question 60% alike or more to one in the test it retests is an error.
- A test that has already been taken can't be fixed, so its problems are listed as notes, not errors.
- Then `npm run check:tests -- <test-id>`, commit, push. It appears in the app's Tests tab after the next sync.

## Results, written by the app (AGENTS.md 2.3)

`brain/results/<test-id>/<YYYY-MM-DD-HHMM>.md`. Frontmatter has the score and one line per question: subject,
topic, type, marks, correct answer, his response, outcome (`correct` | `wrong` | `unattempted`), marks awarded,
seconds spent, visits, whether it was marked for review. The body has the same as tables: by subject, by topic
(weakest first), per question, and time. Question text and solutions are in `brain/tests/<test-id>.md`.

## Plan files (AGENTS.md 2.5)

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

## Roadmap (AGENTS.md 2.6)

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
