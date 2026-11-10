# General Aptitude Master Roadmap · 15/15 Target

**Target:** 13–15 / 15 marks in GATE 2027 General Aptitude (under 18 minutes).
**Commitment:** Exactly 1 hour per day (zero disruption to technical subjects).
**Structure:**
- **Phase 1 (28 Oct – 9 Dec · 34 study days; Block 2 shifted to 10 Nov after the C sprint):** every topic of the official syllabus, each with its real GATE CS PYQs (untimed accuracy + concept notes).
- **Phase 2 (10 Dec – 31 Dec · 22 days):** a timed 10-question GA set every 2 days + error log + speed drills.
- **Phase 3 (1 Jan – 31 Jan · 31 days):** exam mode (GA inside the full-length mocks; 1-markers under 1 min, 2-markers under 2 min).

---

## What GATE actually asks (CS papers 2014–2026, upgraded 10 Nov 2026)

Official GATE 2027 GA syllabus (IIT Madras): verbal (grammar, vocabulary in context, reading, narrative sequencing); quantitative (data interpretation incl. 2D/3D plots and maps; ratios, percentages, powers, exponents, logarithms, permutations and combinations, series; mensuration and geometry; elementary statistics and probability); analytical (deduction and induction, analogy, numerical relations and reasoning); spatial (translation, rotation, scaling, mirroring, assembling and grouping, paper folding, cutting, patterns in 2D and 3D).

| Section | Marks a paper since 2014 | Since 2021 | Topics that carry it |
|---|---|---|---|
| Quantitative | 7.1 | 6.5 | probability 1.1, data interpretation 1.2, geometry and mensuration 1.1, numbers and logs 1.0, functions and graphs 0.5, ratio 0.4, profit 0.4 |
| Analytical | 2.3 | 3.1 | logical reasoning 1.3, statements and conclusions, puzzles, codes, directions |
| Verbal | 4.5 | 2.9 | most appropriate word 0.8, word pairs, passage inference, sentence ordering; pure grammar about 0.3 |
| Spatial | 1.0 | 2.4 | paper folding 0.7, 2D patterns 0.5, rotation, 3D views and cuts |

The audit that reshaped Days 5–34 (the dates and the 1h slot did not change):
- Probability and counting (Days 13–17 of the old plan) had dropped out of the plan files. Back in, early.
- Simple and compound interest, mixtures, time and work, and speed and distance had five days but almost no GATE CS question since 2014, and they aren't in the official wording. Compound growth now sits in percentages and mixtures in averages; work and speed get one short day near the end.
- Spatial (2.4 marks since 2021) and logical reasoning (1.3) moved earlier, so a slip can't squeeze them out.
- Added what the syllabus names but the plan lacked: graphs of functions, contour plots and maps, sets and Venn diagrams, 2D and 3D patterns, assembling pieces.
- The verbal stream starts on Day 5 (it began on Day 15) and follows what GATE asks: blanks, word pairs, inference, ordering, with grammar inside them.
- Every day lists its real PYQs: all 268 GA questions of the CS papers 2010–2026 have a place.

---

## How to run a day (for the agent)

| Block | Duration | What happens |
|---|---|---|
| **Core micro-topic** | 35 min | The idea and shortcut in small steps (10m), then she solves the day's PYQs herself, newest first (25m). Older ones (in brackets) only if time is left |
| **Verbal stream** | 15 min | The day's verbal point in two lines, then its PYQs |
| **Speed and number sense** | 10 min | The drill named for the day; vocabulary root sets (R1–R14, notes in `general-aptitude/01-verbal`) on demand |

- **PYQs:** `npm run syllabus -- pyq <id>` prints any PYQ listed here, with its answer key. `2026s2-ga6` is GATE CSE 2026 Set 2, GA question 6; before 2014 GA was questions 56–65 of the paper, so `2010-62`. Texts from 2022 onward may lose symbols: open the GATE Overflow link or ask her to read them out. Never write a PYQ from memory.
- **Order:** nothing is used before it is taught: percentages, ratio and averages come before data interpretation; counting before probability; sets and Venn diagrams before syllogisms; geometry before mensuration; averages before statistics.
- **The daily GA mock** (`ga-daily-<date>`, AGENTS.md 2.9) uses only days already done and never re-skins a PYQ listed here (`check:tests` compares).
- **Notes:** a slip or a trap goes into `brain/notes/general-aptitude/` (section `01-verbal` or `02-quantitative`), short, in her words.

---

## Phase 1 · Day by day (28 Oct – 9 Dec)

### Block 1 · Foundations and number sense (28 Oct – 5 Nov · 4 days, done)

| Day & Date | Core micro-topic | Verbal | Speed drill |
|---|---|---|---|
| **Day 1 · Wed 28 Oct** | Divisibility rules, prime factorisation, factor count and sum, HCF and LCM | Root set R1 | Tables 11–20, squares 1–25 |
| **Day 2 · Thu 29 Oct** | Fraction ↔ percentage table, multiplier method, base-n systems | Root set R2 | Fraction ↔ % recall |
| **Day 3 · Tue 3 Nov** | Remainders, unit digits, cyclicity, powers and surds | Root set R3 | Unit-digit cycles |
| **Day 4 · Thu 5 Nov** | Logarithms (laws, change of base, digit counting); linear and quadratic equations | — | Calculator memory keys |

Their PYQs come back on Days 27–29 (numbers, logs, equations), once more topics are in.

### Block 2 · The arithmetic GATE asks (10 – 13 Nov)

**Day 5 · Tue 10 Nov · Percentages**
- Core: successive change and net multipliers, percent vs percentage points, growth over several years (compound growth is repeated percentage change), fractions of a whole.
- PYQs: 2024s1-ga4, 2018-ga6, 2014s3-ga8, 2014s1-ga8
- Verbal V1 · Tenses and conditionals: 2017s1-ga1, 2014s3-ga2, 2014s2-ga2 (2013-59)
- Speed: multiplier conversions (1.2 × 0.9 …)

**Day 6 · Wed 11 Nov · Profit, loss and cost**
- Core: cost price, selling price, marked price and discount; profit percentages on cost; cost functions (fixed + variable cost, break-even); sharing a cost.
- PYQs: 2024s2-ga7, 2021s1-ga7, 2019-ga4 (2012-56, 2011-63)
- Verbal V2 · Articles, determiners and comparatives: 2025s1-ga1, 2021s2-ga1, 2016s2-ga1, 2015s1-ga1
- Speed: profit and discount multipliers

**Day 7 · Thu 12 Nov · Ratio, proportion and variation**
- Core: ratios and their scaling, adding to a ratio, direct, inverse and joint variation, exponential decrease, mixed percent-and-ratio statements.
- PYQs: 2024s1-ga2, 2021s2-ga8, 2021s1-ga1, 2018-ga8, 2016s1-ga10
- Verbal V3 · Fill in the blank I (grammar decides): 2023-ga1, 2019-ga1, 2018-ga1, 2014s2-ga1
- Speed: cross-multiplication

**Day 8 · Fri 13 Nov · Averages and weighted averages**
- Core: averages and the deviation method, correcting a wrong average, the average of an arithmetic list, weighted averages, mixtures as weighted averages (alligation, repeated replacement).
- PYQs: 2025s1-ga3, 2014s2-ga4 (2011-65)
- Verbal V4 · Word pairs I (analogies): 2025s2-ga2, 2023-ga2, 2021s2-ga5, 2021s1-ga5
- Speed: deviation method

### Block 3 · Counting and probability (14 – 17 Nov)

**Day 9 · Sat 14 Nov · Counting I**
- Core: the multiplication rule, permutations and combinations, repetition allowed or not, choosing with restrictions, counting rectangles in a grid, assigning distinct items.
- PYQs: 2025s1-ga10, 2024s2-ga2, 2017s1-ga9, 2016s2-ga9 (2010-65)
- Verbal V5 · Reading I (what a passage states vs implies): 2025s1-ga6, 2022-ga6, 2017s1-ga6
- Speed: factorials to 8! and small nCr

**Day 10 · Sun 15 Nov · Counting II: sets and Venn diagrams**
- Core: two and three sets, inclusion–exclusion, "only", "neither" and "exactly two", the largest and smallest possible overlap.
- PYQs: 2024s2-ga3, 2019-ga9, 2019-ga7, 2016s2-ga6 (2010-59)
- Verbal V6 · Synonyms, antonyms, odd one out: 2026s2-ga1, 2026s1-ga1, 2017s2-ga1, 2016s2-ga3, 2014s3-ga3 (2013-56, 2012-58, 2011-56, 2011-60, 2010-57)
- Speed: set up a three-set Venn in 20 seconds

**Day 11 · Mon 16 Nov · Probability I**
- Core: equally likely outcomes, two dice and non-standard dice, balls and socks drawn without replacement, the complement ("at least one"), digits that avoid a set.
- PYQs: 2026s1-ga10, 2026s2-ga10, 2025s1-ga8, 2022-ga8, 2017s2-ga5, 2017s1-ga5, 2015s1-ga3
- Verbal V7 · Fill in the blank II (vocabulary decides): 2025s2-ga1, 2025s1-ga2, 2022-ga1, 2019-ga2, 2014s1-ga2
- Speed: complement shortcuts

**Day 12 · Tue 17 Nov · Probability II**
- Core: independent events, repeated trials (exactly k successes), conditional probability, two-stage choices and Bayes' rule.
- PYQs: 2026s2-ga3, 2021s1-ga8, 2018-ga10, 2015s1-ga10 (2012-63)
- Verbal V8 · Agreement, pronouns and error spotting: 2021s1-ga3, 2016s1-ga1, 2015s2-ga10, 2014s3-ga1 (2013-60, 2012-59)
- Speed: binomial terms on the calculator

### Block 4 · Spatial aptitude (18 – 21 Nov)

**Day 13 · Wed 18 Nov · Spatial I: transformations**
- Core: rotation by 90° and 180°, mirror lines and symmetry, translation and scaling, letters and words under rotation or reflection.
- PYQs: 2024s1-ga10, 2023-ga10, 2022-ga5
- Verbal V9 · Word pairs II and order of intensity: 2024s1-ga1, 2024s2-ga1, 2020-ga3, 2019-ga5, 2015s3-ga4, 2015s1-ga5 (2013-57, 2010-60)
- Speed: mental rotation of letters

**Day 14 · Thu 19 Nov · Spatial II: paper folding and cutting**
- Core: folding along lines of symmetry, holes and cuts unfolded, layers after n folds, a net folded into a cube.
- PYQs: 2025s1-ga9, 2025s2-ga4, 2024s1-ga9, 2021s2-ga2, 2021s1-ga4
- Verbal V10 · Reading II (inference and hidden assumptions): 2021s1-ga10, 2021s2-ga6, 2020-ga4, 2020-ga6
- Speed: fold-and-punch mapping

**Day 15 · Fri 20 Nov · Spatial III: 2D patterns and assembling**
- Core: tiling with given pieces, cutting a shape into parts, convex polygons, dividing a plot into equal shapes, the missing tile in a panel, the piece that completes a jigsaw.
- PYQs: 2026s1-ga2, 2026s2-ga2, 2026s2-ga7, 2022-ga10, 2021s2-ga7, 2021s1-ga2
- Verbal V11 · Idioms and phrase meaning: 2016s2-ga2, 2015s1-ga2, 2015s1-ga7, 2014s1-ga1, 2014s1-ga3
- Speed: count the tiles

**Day 16 · Sat 21 Nov · Spatial IV: 3D**
- Core: front and top views of a structure, cutting a cube into equal pieces, the surface of a solid seen from outside, blocks removed from a cube, painted cubes.
- PYQs: 2026s1-ga7, 2024s2-ga9, 2023-ga5, 2016s1-ga5
- Verbal V12 · Fill in the blank III (collocation and context): 2018-ga2, 2017s1-ga2, 2016s1-ga3, 2015s3-ga3
- Speed: painted-cube formulas (8, 12(n−2), 6(n−2)², (n−2)³)

### Block 5 · Analytical reasoning (22 – 25 Nov)

**Day 17 · Sun 22 Nov · Logical reasoning I: statements and conclusions**
- Core: "based only on the statement", if–then and its contrapositive, syllogisms drawn as Venn diagrams, which conclusions follow.
- PYQs: 2026s1-ga5, 2026s2-ga5, 2025s2-ga6, 2022-ga4, 2021s1-ga9, 2016s2-ga8
- Verbal V13 · Reading III (main idea, what can be inferred): 2016s2-ga7, 2015s3-ga9, 2014s2-ga6, 2014s1-ga6
- Speed: contrapositive flash check

**Day 18 · Mon 23 Nov · Logical reasoning II: puzzles**
- Core: ordering from comparisons, rankings, truth and lies, boxes with wrong labels, choosing members under conditions, reasoning about counting statements.
- PYQs: 2026s1-ga9, 2026s1-ga6, 2021s2-ga10, 2017s2-ga7, 2016s1-ga8, 2015s3-ga7 (2010-61)
- Verbal V14 · Word meaning and usage: 2020-ga2, 2016s1-ga2, 2015s2-ga2, 2015s2-ga4, 2014s2-ga3
- Speed: elimination grids

**Day 19 · Tue 24 Nov · Arrangements, relations and directions**
- Core: linear and circular seating, square tables, buildings in a row, requests and allocations, family relations, directions on a map.
- PYQs: 2025s1-ga5, 2025s1-ga4, 2019-ga10, 2017s2-ga3, 2017s1-ga7, 2017s1-ga3, 2015s2-ga7 (2010-62)
- Verbal V15 · Verb forms and sentence completion: 2020-ga1, 2017s2-ga2, 2015s3-ga2, 2015s2-ga1
- Speed: left and right around a circle

**Day 20 · Wed 25 Nov · Codes, analogies and number patterns**
- Core: letter shifts and codes, word codes, analogies, number sequences and letter series, the odd one out, grids and arrays with a rule.
- PYQs: 2026s2-ga6, 2026s2-ga9, 2025s2-ga7, 2024s2-ga10, 2024s2-ga5, 2020-ga7, 2016s1-ga4, 2016s2-ga4, 2015s3-ga1
- Verbal V16 · Reading IV (what must be true): 2019-ga8, 2017s2-ga6, 2016s1-ga7, 2015s3-ga6
- Speed: alphabet positions (A = 1 … Z = 26, and backwards)

### Block 6 · Data interpretation (26 – 28 Nov)

**Day 21 · Thu 26 Nov · DI I: tables**
- Core: growth rates, shares and ratios from a table, averages across rows, estimating instead of dividing.
- PYQs: 2025s2-ga8, 2016s1-ga6, 2015s1-ga6, 2014s3-ga5, 2014s1-ga9 (2011-62)
- Verbal V17 · Sentence ordering and narrative sequencing: 2024s2-ga6, 2023-ga8
- Speed: percentage change without a full division

**Day 22 · Fri 27 Nov · DI II: bar and line graphs**
- Core: single and twin bars, profit from revenue and cost, ratios plotted over years.
- PYQs: 2021s2-ga9, 2020-ga10, 2015s3-ga10, 2014s3-ga9, 2014s2-ga9
- Verbal V18 · Fill in the blank IV (texts with several blanks): 2024s1-ga6 (2012-57, 2012-60, 2011-58, 2011-59, 2010-56, 2010-58)
- Speed: reading ratios off a plot

**Day 23 · Sat 28 Nov · DI III: pie charts, maps and contour plots**
- Core: degrees ↔ percent, comparing two pies, maps and river or road networks, cheapest routes, contour lines (height, pressure) and what they say.
- PYQs: 2026s2-ga8, 2025s2-ga10, 2024s1-ga8, 2024s2-ga8, 2020-ga5, 2017s1-ga10, 2017s2-ga10, 2015s1-ga9
- Verbal V19 · Reading V (passages with numbers and claims): 2023-ga6, 2023-ga4, 2022-ga7
- Speed: 36° = 10%

### Block 7 · Geometry and mensuration (29 Nov – 1 Dec)

**Day 24 · Sun 29 Nov · Geometry I: lines and triangles**
- Core: angles and parallel lines, triangle angle sums, angle bisectors, similar triangles and Pythagoras, triangles counted in a figure, areas between parallel lines.
- PYQs: 2025s1-ga7, 2022-ga9, 2018-ga9, 2015s2-ga8
- Verbal V20 · Statement sufficiency and courses of action: 2015s1-ga4, 2015s2-ga5, 2015s1-ga8
- Speed: Pythagorean triples

**Day 25 · Mon 30 Nov · Geometry II: quadrilaterals and circles**
- Core: squares and rectangles inside each other, circles on a square's diagonal, annular rings, shaded areas.
- PYQs: 2025s2-ga9, 2020-ga8, 2018-ga3
- Verbal V21 · Reading VI (long passages, for speed): 2014s2-ga7, 2014s3-ga7, 2014s3-ga6 (2013-63, 2011-61, 2010-63)
- Speed: area scaling (square of the ratio)

**Day 26 · Tue 1 Dec · Mensuration in 3D**
- Core: cubes and cuboids (diagonals and angles), cylinders rolled from sheets, volumes, a point inside a tetrahedron.
- PYQs: 2024s1-ga7, 2021s2-ga3, 2021s1-ga6, 2014s1-ga10
- Verbal V22 · Verbal reasoning with people and claims: 2019-ga6, 2014s1-ga7 (2012-61)
- Speed: volume scaling (cube of the ratio)

### Block 8 · Numbers, functions and series (2 – 6 Dec)

**Day 27 · Wed 2 Dec · Numbers I: powers, logs and bases**
- Core: laws of exponents and logs applied, perfect powers, digit counts, numbers in other bases (Days 1–4 put to work).
- PYQs: 2024s1-ga5, 2024s2-ga4, 2018-ga7, 2017s2-ga8, 2017s1-ga4, 2014s3-ga10, 2014s1-ga4 (2011-57)
- Verbal: mixed set (below)
- Speed: powers of 2 to 2^16; log 2, log 3, log 5

**Day 28 · Thu 3 Dec · Numbers II: divisibility and integer problems**
- Core: LCM with remainders, primes, divisibility of a digit pattern, integer word problems (tournaments, credits, marks), functions defined on numbers.
- PYQs: 2026s1-ga3, 2026s1-ga4, 2026s1-ga8, 2025s2-ga5, 2025s2-ga3, 2018-ga4, 2017s2-ga4 (2013-62)
- Verbal: mixed set
- Speed: divisibility tests

**Day 29 · Fri 4 Dec · Functions I: equations and expressions**
- Core: quadratics (sum and product of roots, sign of the roots), absolute value, max and min of expressions, polynomials and the factor theorem.
- PYQs: 2022-ga3, 2021s2-ga4, 2017s1-ga8, 2016s2-ga5, 2016s1-ga9, 2015s2-ga9, 2014s2-ga8, 2014s1-ga5
- Verbal: mixed set
- Speed: sum and product of roots

**Day 30 · Sat 5 Dec · Functions II: graphs and plots**
- Core: a line through two points, |x|-shaped graphs, shifts and reflections, reading a function off a plot, roots from a sketch, perpendicular lines and the region they cut off, a maximum from a shape.
- PYQs: 2023-ga7, 2023-ga9, 2022-ga2, 2020-ga9, 2017s2-ga9, 2016s2-ga10, 2015s3-ga8, 2015s3-ga5 (2012-62)
- Verbal: mixed set
- Speed: slope from two points

**Day 31 · Sun 6 Dec · Statistics and series**
- Core: mean, median, mode, range and standard deviation, and what shifting or scaling every entry does; arithmetic and geometric progressions, telescoping sums, missing terms.
- PYQs: 2024s1-ga3, 2023-ga3, 2018-ga5, 2015s2-ga6, 2014s2-ga5, 2014s3-ga4 (2013-58, 2013-61, 2012-64, 2012-65)
- Verbal: mixed set
- Speed: Σn, Σn², Σn³

### Block 9 · Light topics and the bridge to Phase 2 (7 – 9 Dec)

**Day 32 · Mon 7 Dec · Rates, clocks and calendars (light: rare in GATE CS)**
- Core: time and work, speed and relative speed, average speed over parts of a journey, the angle between clock hands.
- PYQs: 2019-ga3, 2014s2-ga10 (2013-64, 2013-65, 2011-64, 2010-64)
- Verbal: mixed set
- Speed: km/h ↔ m/s; clock angle |30H − 5.5M|

**Day 33 · Tue 8 Dec · Weakest topics**
- Core: the three weakest topics from the GA mocks so far: re-solve the PYQs she missed, then two fresh questions each.
- Verbal: the verbal PYQs she missed.
- Speed: virtual-calculator speed run

**Day 34 · Wed 9 Dec · First timed set**
- A full 10-question GA set in 20 minutes (agent-written, GATE mix: 5 one-mark, 5 two-mark, including spatial and logic), then its analysis. Phase 2 starts tomorrow.

**Verbal on Days 27–33 (mixed sets):** four fresh questions a day written by the agent in the GATE patterns above (most appropriate word, word pairs, inference, ordering), weighted to whatever she missed, plus any verbal PYQ not yet done.

---

## Phase 2 · December (timed sets, speed and weak drills)

**Goal:** turn knowledge into 13–15/15 at exam speed.
**Routine:** one 10-question timed GA set every 2 days.

- **The sets (15):** the CS papers' GA questions (2010–2026) are all solved in Phase 1, so they would be repeats. Use unseen ones instead:
  - 12 GA sections from other GATE papers, 2021–2026 (EC, EE, ME, CE, IN, DA): the GA syllabus is the same for every paper.
  - 3 agent-written tough sets on her weakest topics.
- **Between set days (weak-area days):**
  - 30 mins: targeted drill on the lowest-scoring topic in the error log.
  - 15 mins: verbal misses and vocabulary.
  - 15 mins: virtual-calculator speed run.
- **Timer ladder:**
  - 10 – 20 Dec: 25 minutes.
  - 21 – 31 Dec: 22 minutes.

---

## Phase 3 · January (exam mode and full-length integration)

**Goal:** solve GA first inside the 3-hour exam, in under 18 minutes, with 100% accuracy.

- **Speed standards:**
  - 1-mark questions: under 1 minute.
  - 2-mark questions: under 2 minutes.
  - Full section: under 18 minutes.
- **Full mock days:** GA is solved as section 1 inside every 3-hour full mock.
- **Non-mock days:** 15-minute speed sets (10 questions, rapid fire) + a one-page formula review.
- **Last week (25–31 Jan):** no new questions. Only the formula sheet, the verbal error log and the root word deck.
