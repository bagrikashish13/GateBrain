# Syllabus: C, Data Structures, Algorithms

**This is the only syllabus for these three subjects. Teach from it, in its order, every time, without being asked.** The student should never have to remind you, and you should never plan these subjects from memory.

## Start here, every time

```
git pull --rebase
npm run syllabus
```

Do exactly what it prints. It knows what has been taught, what comes next, and when a test is due. Everything below explains why, and how to do each step well.

| Command | What it does |
|---|---|
| `npm run syllabus` | The exact next step |
| `npm run syllabus -- done <item>` | Mark an item, only after the student answered its check correctly. Skipping is refused |
| `npm run syllabus -- unit D07` | One whole unit |
| `npm run syllabus -- status` | Every unit and test, and pace against the target dates |
| `npm run syllabus -- test <id>` | What a test must contain, before you write it |
| `npm run syllabus -- check-test <id>` | Check a written test against its blueprint |
| `npm run syllabus -- weak` | Items missed in tests |
| `npm run syllabus -- pyq <id>` | A real PYQ: link, text and answer key. A NAT key like `7:7` is a range |
| `npm run check:syllabus` | Validate everything after editing these files |

"Teach me DS", "continue", "what's next in algo", "let's study": all mean run the command and carry on from the next item. Don't offer options.

## What it covers, and how we know

- **Official scope:** GATE 2027 CS syllabus from IIT Madras ([PDF](https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf)), Sections 4 and 5, quoted at the top of each part.
- **Every PYQ:** 770 questions from 1987 to 2026: GATE CS 674, GATE IT 2004–2008 74, GATE DA and the DS&AI sample paper 22. Source: GATE Overflow's public books (2022, 2026 and 2027 editions, merged by paper, year, set and question). 33 of the 770 are filed under Compiler Design or TOC (parameter passing, scoping, activation records, expression evaluation, P vs NP) but test the same skills.
- **The proof is mechanical:** `pyq-index.jsonl` lists every PYQ, and `npm run check:syllabus` fails if any PYQ is not assigned to a syllabus item, or if a unit has no test. `npm test` runs the same check. The repo is public, so it stores ids and links only, never question text.

| Part | File | Units | Hours |
|---|---|---|---|
| Programming in C | `1-programming-in-c.md` | P01–P09 | 27 |
| Data Structures (with hashing) | `2-data-structures.md` | D01–D11 | 36.5 |
| Algorithms | `3-algorithms.md` | A01–A16 | 47.5 |

Each unit is a topic, each `###` a subtopic, each line one minor topic. The kinds:

- **T, concept:** teach it, check it.
- **Q, PYQ pattern:** a type of question GATE has really asked. Show the method, then the student solves the PYQs.
- **N, never asked yet:** inside the official wording but with no PYQ so far. Short, one question of your own. This is the guard against a surprise.
- **L, legacy:** only asked in old papers or under the old syllabus. One or two lines and one PYQ. Never in a test.

**Real weight, computed from the last 10 CS papers (2021–2026):** about 17 of 100 marks per paper (range 14–21): C 4.4, Data Structures 5.4, Algorithms 7.4. Question types 49% MCQ, 19% MSQ, 33% NAT. Marks 46% one-mark, 54% two-mark. These numbers set the test blueprints.

**Honest limit:** nothing can guarantee every unseen question. What this guarantees is that no question type GATE has ever asked in these subjects, and nothing in the official wording, gets skipped, and that each is tested.

## How to teach an item

Small steps always (AGENTS.md rule 8): one idea per reply, ending in one question, then wait.

- **T:** 3–5 lines in plain words, using the template below if one applies, then one check question. If the answer is wrong, re-explain differently. Teach only what the item says.
- **Q:** show the method on a small example, then the student solves the listed PYQs one at a time, newest first, before seeing any method applied to them. Get the text with `npm run syllabus -- pyq <id>`. All PYQs since 2014 are required; older ones are extra unless the command lists them.
- **N:** the idea in a few lines, one question of your own in GATE style.
- **L:** say what it is in a line or two, and do the one PYQ listed. Tell the student it is old style.

Rules that keep this honest:

- **Never write a PYQ from memory.** Use `pyq`. If its text has holes (2022 onwards lose symbols), open the link or ask the student to read it out. Cite real ids only.
- **Mark `done` only after a correct answer**, on the check or on the last PYQ of the pattern, without a hint. Explaining something is not teaching it.
- **"I already know this":** ask one hard check. Right means `done`, wrong means teach it. Fast is fine; skipping is not.
- **Doubts are welcome any time.** Answer them, then return to the next item. They don't move the pointer. If the student insists on another topic today, do it, say once what comes next in the order, and when you get back to those items probe them quickly.
- **Scope:** nothing outside these files. No red-black trees, B-trees (those are in DBMS), segment trees, tries, KMP, flow, or anything else not listed. If you think something is missing, tell the student and add it with its evidence, don't just teach it.
- **Items marked `prior`** were taught in the C sprint before this syllabus existed. Their PYQ patterns are still pending, and `pds-check-c` proves the concepts.
- **Feelings first:** `brain/cs.md` overrides the schedule. On a hard day, shrink as AGENTS.md 2.9 says.

**Finishing a unit:** write its notes in the folder on the unit's `notes:` line (shape in AGENTS.md 2.1), from what the student actually found hard, not a summary of the item list. The command refuses to continue without them. They enter revision by themselves.

**Stopping for the day:** write the 2.8 checkpoint with the next item id, commit `progress.json` with it, and push.

## Tests

A test comes after about every 4–9 hours of new teaching, and **no new teaching happens until the test is taken and analysed.** The command enforces this. All tests appear in the app's Tests tab and use its exam screen.

| Kind | When | Questions | 1m / 2m | Minutes | MCQ / MSQ / NAT | Pass |
|---|---|---|---|---|---|---|
| Diagnostic | Once, over the C already taught | 15 | 7 / 8 | 40 | 6–9 / 2–4 / 4–6 | 60% |
| Unit test | After 1–2 units | 10 | 5 / 5 | 30 | 4–6 / 1–3 / 2–4 | 70% |
| Stage test | After 3–5 units, covers them all | 20 | 10 / 10 | 60 | 8–12 / 3–5 / 5–8 | 65% |
| Subject sectional | End of Parts 1+2, end of Part 3 | 30 | 14 / 16 | 90 | 13–17 / 4–7 / 8–11 | 65% |
| Grand test | Twice, over all three parts | 40 | 19 / 21 | 120 | 18–22 / 6–9 / 11–15 | 65% |

The order is in `sequence.json`, 21 tests in all. Minutes follow the real paper's 1.8 minutes per mark.

**A syllabus test due today replaces the daily technical mock (AGENTS.md 2.9).** Never both on one day. Stage tests and longer take their extra time from that day's block. Its analysis is the same day, triaged as 2.9 says.

### Writing a test

1. `npm run syllabus -- test <id>`: the blueprint, plus the patterns to cover in priority order. Weak items from earlier tests come first.
2. Read the PYQs of those patterns with `pyq`.
3. Write it following AGENTS.md 2.2.1: real GATE level, mix about 30% easy, 50% medium, 20% hard, no repeats, full solutions. Every question also gets `syllabus: <item id>`, and `subject` and `topic` from that item's unit. Format: `brain/FORMATS.md`.
4. Verify every answer. **Run C code with a compiler, and check tree, heap, hash and graph answers with a small script.** Wrong answer keys are the worst bug here.
5. `npm run check:tests -- <id>` and `npm run syllabus -- check-test <id>`. Fix every error. Commit and push.

### What makes it feel like the real paper

From reading the 2021–2026 questions:

- **Code is everywhere:** recursion and pointer traces as NAT; missing expressions in list or tree code; "what does this compute".
- **MSQs judge statements:** properties of MSTs, DFS timings, BST facts, heap facts. Each option must be decidable, and wrong options come from real misconceptions.
- **1-mark:** one concept, one step: a complexity, a heap position, a traversal, a count.
- **2-mark:** two or more steps or two concepts: build then traverse, recurrence from code, count the valid orders.
- **New setups for old ideas:** double BFS for diameter, bitonic search, min-stack designs, sliding window with missing expressions, DP fill order, Bellman-Ford as a recurrence, memory layout. Test ideas in unfamiliar clothes, not textbook wording.
- **Definitions are stated in the question:** give the height convention, the array's starting index, the pivot rule and the partition scheme whenever the answer depends on them.

Not GATE: pure recall, trivia, puzzles, anything needing a particular book's convention. Include at least 3 of the styles above in every test.

### Results

- **Pass:** carry on. The first attempt is the one that counts.
- **Below the pass mark:** the command lists the items missed. Re-teach only those, then write one retest (`<id>-r2`, a fresh 10-question test on those items).
- **After the retest, carry on whatever the score.** Anything still weak stays on the list and goes first in the next test, so nothing is lost and the plan cannot stall. Tell the student honestly where they stand.

## Tracing templates

Draw these every time they apply. Don't rely on the student remembering them.

- **Pointers and arrays:** Address-Arrow Scaling Model.
- **Recursion and statics:** Activation Stack + Static Store.
- **Loops:** Variable State Table. (These three are drawn out in `brain/c-masterplan.md`.)
- **Arrays and matrices:** row and column coordinate map.
- **Stacks and queues:** a LIFO or FIFO state column, one row per operation.
- **Lists:** boxes and arrows, redrawn after each assignment.
- **Trees:** inorder split bracket; for BSTs the range-narrowing bracket [L, R].
- **Heaps:** array-to-tree level map.
- **Graphs:** discovery and finish times beside each vertex; a distance table per Dijkstra step.
- **DP:** the table itself, with the arrows showing which cells each one needs.

## Changing the syllabus

The syllabus may grow. GATE 2027's own questions, or a real gap, are good reasons. Add the item with its PYQ evidence, keep the numbering sequential, and run `npm run check:syllabus`. Don't remove an item because it is hard. New PYQs go in `pyq-index.jsonl` and into an item.
