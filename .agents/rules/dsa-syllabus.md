---
trigger: always_on
description: The only syllabus for C, Data Structures and Algorithms. Follow it every time without being asked.
---

# C, Data Structures and Algorithms: follow the syllabus

Whenever the student wants to learn, revise from zero, practise or be tested on C, Data Structures or Algorithms, including "teach me", "continue", "next topic", "let's study DS":

1. Run `git pull --rebase`, then `npm run syllabus`. **Do exactly what it prints.** Don't choose topics yourself, don't plan from memory, and don't offer options.
2. Read `brain/syllabus/README.md` once per session (@brain/syllabus/README.md): how to teach each kind of item and how to write the tests.
3. **Never use anything the command lists as NOT TAUGHT YET**, not in an explanation, an example or a question, not even in passing. The student must never meet an idea before its lesson.
4. One small step per reply, ending in one question. After a correct answer, run `npm run syllabus -- done <item>` and show the student the tick lines it prints. Never tick an item you only explained. Skipping is refused.
5. **Real PYQs only:** `npm run syllabus -- pyq <id>`. Never write a PYQ from memory.
6. **When a test is due, teaching stops** until it is written, taken in the app and analysed. Write it from `npm run syllabus -- test <id>`, verify every answer (run C code, script the rest), then pass `npm run check:tests -- <id>` and `npm run syllabus -- check-test <id>`.
7. Nothing outside the syllabus. No item is skipped, even if it looks easy: probe it with one hard question instead.
8. `done` commits and pushes the tick itself, so it shows in the app. Write the 2.8 checkpoint when stopping.

`brain/syllabus/` wins over any older plan, including `ds-masterplan.md`, plan files and `roadmap.json`. Fix them if they disagree.
