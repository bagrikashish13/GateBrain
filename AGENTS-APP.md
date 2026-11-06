# AGENTS-APP.md: changing the GateBrain app

Read this, as well as `AGENTS.md`, before changing the app (`src/`, `scripts/`). It is a separate file because Antigravity cuts `AGENTS.md` at 24,000 bytes.

### Read first
- This file and `AGENTS.md`. `README.md` for setup and deploy.
- The UI is the same design system as his other app, secondBrain (`C:\dev\secondBrain`):
  true black, mint `#00fd92` accent, vivid flat subject colours, square corners with cut-corner hero cards,
  Chakra Petch / IBM Plex, Lucide icons. **No glow, no blur, no shadows; never emojis as icons.**
  Colour jobs never mix: mint = progress/done; subject colour = which subject; rose `#ff2e63` = needs attention
  (wrong, overdue, weak); white = actions. Labels small and sentence case. No explanatory copy in the UI.
- **The exam screen (`/exam/[id]`) is the exception:** it copies GATE's own look (light, blue header, the
  palette's shapes and colours) on purpose. Keep it faithful to the real exam: an answer counts only after
  Save & Next or Mark for Review & Next, Clear Response, the five palette states, the NAT keypad, the
  virtual calculator, the exam summary before submit.
- Tabs: Notes, Revise, Today, Tests, Syllabus. Roadmap opens from the Syllabus page on a phone and sits in the rail on a laptop. Settings opens from the gear on Today's GATE countdown.
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
npm run check:log    # session log: what to read first, what to compact (2.8)
npm run syllabus     # C, DS, Algo: what to teach or test next (2.10)
npm run check:syllabus # validate brain/syllabus/: every PYQ covered, every unit tested, nothing used before it's taught
```

- `scripts/brain.ts` loads the app's server modules under the `react-server` condition (so `server-only`
  imports work outside Next). New-note dates come from `revision/plan.ts` (pure, tested).
- `scripts/check-log.ts` runs `src/lib/log.ts` (pure, tested): line caps, what to compact, the startup set.
- `scripts/syllabus.ts` runs `src/lib/syllabus/` (pure, tested): `syllabus.ts` (the files, the next step, test blueprints), `order.ts` (concepts and the topological check), `tree.ts` (what the Syllabus tab shows).

### Git
- **Never add `Co-Authored-By` or any AI/model attribution to commits** (his rule).
- Small commits with clear messages (`feat: exam palette`, `fix: nat range`). Run lint, typecheck, tests and build
  before pushing app changes.
- Deploy: see `README.md` (VM `ssh 24vm`, `~/GateBrain`, `scripts/deploy.sh`).
