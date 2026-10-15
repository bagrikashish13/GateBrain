---
trigger: always_on
---

# GateBrain workspace rules

Read and follow `AGENTS.md` at the repo root (@/AGENTS.md) for everything in this repo: notes, mock tests,
analysing results, the plan, and the app.

The rules that matter most, in case you only read this file:

- **Mock tests are always real GATE CS level**, calibrated on actual PYQs. If you are not sure what GATE asks
  on a topic or how hard, search the internet for PYQs first (gateoverflow.in, official GATE papers) and
  read several before writing. Concept-application questions, multi-step numericals, plausible distractors;
  never trivia or definition recall. Default mix ~30% easy / 50% medium / 20% hard, ~25–35% NAT.
- **Harder only when he asks** ("tougher", "harder"): then ~10/40/50, still strictly GATE style and syllabus.
- **Never repeat a question** from any earlier mock, not even with a few words or numbers changed. Read
  every file in `brain/tests/` first. Write original questions modelled on PYQs (verbatim PYQs only if he
  asks for a PYQ paper).
- Verify every answer by solving it independently; full working in `### Solution`.
- Format: AGENTS.md section 2.2. Then run `npm run check:tests -- <test-id>` and fix every error,
  including "repeats" (rewrite) and "is close to" (rewrite unless truly different).
- After any change in `brain/`: commit and push (`git pull --rebase` first). Never commit `.env`.
