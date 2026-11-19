# Part 14 · General Aptitude

Official GATE 2027 wording (General Aptitude, common to every paper): "Quantitative aptitude: data interpretation (data graphs: bar graphs, pie charts and other graphs representing data; 2- and 3-dimensional plots, maps and tables); numerical computation and estimation (ratios, percentages, powers, exponents and logarithms, permutations and combinations, and series); mensuration and geometry; elementary statistics and probability. Analytical aptitude: logic (deduction and induction), analogy, numerical relations and reasoning. Spatial aptitude: transformation of shapes (translation, rotation, scaling, mirroring, assembling and grouping); paper folding, cutting and patterns in 2 and 3 dimensions." Verbal aptitude is Part 15, on its own Anytime track.

2nd block, every day for 30 days (20 Nov to 19 Dec 2026), side by side with Compiler Design and DBMS (AGENTS.md 2.9). Built from zero on 19 Nov 2026: the student is assumed to know nothing, and the earlier GA sprint and its mocks do not count.
**Every PYQ of every GATE paper is here, not just CS:** GA is one syllabus for all branches, so the CE, EC, ME, EE, CH, IN, BT and DA papers' GA questions are real evidence of what gets asked (about 1500 of them from 2010 to 2026, with the same set often printed in several branches). A pattern's must-solve PYQs are its CS ones since 2014 topped up from the other branches, newest first, to four (`drill`); the rest are extra practice. Ids: `2024s1-ga3` is CS, `CE2025s1-ga10` civil, `EC`, `ME`, `EE`, `CH` chemical, `IN`, `BT`, `DA`.
Weight: GA is 15 marks of every paper (5 one-mark, 5 two-mark). In the CS papers since 2014 quantitative is about 7 of them (data interpretation, geometry and mensuration, probability and counting, numbers and algebra), verbal 3–4, analytical about 3, and spatial (new since 2021) 2–3. Rising since 2021: rule-based grid puzzles, "necessarily true" logic, spatial transformations and folding; falling: letter series, odd one out, pure next-term number series.
Order: numbers first (everything is computed with them), then ratio and percentages (the language of most word problems), commercial arithmetic, speed and work, then powers, logarithms and algebra, functions and series, counting before probability, geometry before mensuration and coordinates, data interpretation once percentages, ratios and averages are solid; then logic, arrangements and relations, codes and puzzles; spatial last (it uses symmetry, rotation and solids).
How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic to teach, in this order. Nothing here uses an idea before the line that teaches it: `npm run check:syllabus` proves it.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy. `Teaches:` names the concepts a line introduces (`concepts.json`). PYQ ids are newest first.

## GA01 · Numbers
notes: general-aptitude/02-quantitative
hours: 2

### Kinds of numbers
- GA01.1 T Natural numbers, integers, rationals (p/q) and irrationals (√2, π); even and odd; a prime has exactly two divisors (1 is not prime, 2 is the only even prime).
- GA01.2 T Fractions: equivalent fractions, adding with a common denominator, comparing by cross-multiplying; fraction ↔ decimal.

### Divisibility and remainders
- GA01.3 T Divisibility tests: 2, 4, 8 (last one, two, three digits), 3 and 9 (digit sum), 5, 10, 11 (alternating digit sum), 6 (2 and 3).
- GA01.4 T Factors and prime factorisation; HCF (common primes, lowest powers) and LCM (all primes, highest powers); HCF × LCM = product of two numbers.
- GA01.5 T Remainders: a = qb + r with 0 ≤ r < b; remainders add and multiply (the remainder of a product is the product of remainders, reduced). Teaches: ga-remainder
- GA01.6 Q Divisibility: a missing digit, which number divides exactly, how many in a range are not divisible. PYQ: EE2021-ga4, EC2018-ga3
- GA01.7 Q LCM and remainders: the smallest number leaving the same remainder, events that coincide again. PYQ: EE2022-ga3, ME2021s2-ga3, 2018-ga4
- GA01.8 Q Primes and parity: greatest prime factor, the multiplier making a perfect square or cube, statements true for all primes, odd or even expressions. PYQ: 2025s2-ga5, EC2024-ga5, ME2018s1-ga7, 2017s1-ga4, EE2017s1-ga4, ME2017s2-ga3
- GA01.9 T Powers: aⁿ multiplies n copies of a; know squares to 20² and cubes to 10³. The last digit of a power cycles with period at most 4 (2: 2, 4, 8, 6; 3: 3, 9, 7, 1; 7: 7, 9, 3, 1); only last digits matter in a product. Teaches: ga-exponent
- GA01.10 Q The unit digit of a power or a long product. PYQ: EE2023-ga9, CE2020s1-ga9, CE2017s1-ga8, CH2017-63, EE2016s2-ga10

### Digits and place value
- GA01.11 T Place value: a two-digit number is 10a + b, its reverse 10b + a, their difference 9(a − b); three digits 100a + 10b + c.
- GA01.12 Q Digit puzzles: a number from conditions on its digits, or what reversing does. PYQ: DA2026-ga2, DA2026-ga9, ME2018s1-ga5, CE2016s2-ga5
- GA01.13 T Number bases: in base b the digits are worth powers of b (243 in base 8 is 2·64 + 4·8 + 3); convert by repeated division.
- GA01.14 Q Convert between bases, or solve an equation written in an unknown base. PYQ: EE2024-ga3, 2014s3-ga10, EE2014s3-ga10
- GA01.15 Q Operators defined by a formula: evaluate a composite expression, find the identity. PYQ: CE2021s1-ga4, CE2021s2-ga4, IN2021-ga4, CH2016-ga9, ME2016s2-ga9, CH2015-4, EC2015s1-ga4

## GA02 · Ratio, proportion and percentages
notes: general-aptitude/02-quantitative
hours: 2

### Ratio and proportion
- GA02.1 T A ratio a : b splits a total into a + b parts; so the total must be a multiple of a + b, and each share is its parts times one part. Teaches: ga-ratio
- GA02.2 Q Parts, totals and shares: which total is possible, a share from a difference, a ratio of sums. PYQ: EC2022-ga2, 2021s1-ga1, BT2021-ga1, CH2021-ga1, CE2020s2-ga8
- GA02.3 Q Fractions in word problems: a part claimed, a total from its parts, fractions made equal by a shift. PYQ: CE2024s1-ga3, CE2022s2-ga3, 2018-ga6
- GA02.4 T Combining ratios: make the common term equal (a : b = 2 : 3 and b : c = 4 : 5 give 8 : 12 : 15); quantity ratio × price ratio = value ratio.
- GA02.5 Q Ratios after a change (added, removed, transferred) and value from quantity and price ratios. PYQ: CE2024s2-ga5, BT2023-ga7, CH2023-ga7, 2021s2-ga8, ME2021s1-ga8, 2018-ga8
- GA02.6 Q Algebraic ratios: from a/b = c/d or "x is p more than y", find another ratio. PYQ: EE2024-ga5, ME2024-ga4, BT2022-ga3, CE2022s1-ga3, CE2022s2-ga2
- GA02.7 T Direct proportion (y = kx), inverse (y = k/x), and proportion to a power (y = kx²): compare two cases by dividing, the constant cancels.
- GA02.8 Q Variation: one quantity proportional to a power of another; which proportionality statements follow from a relation. PYQ: 2024s1-ga2, ME2020s2-ga9, CE2018s1-ga7, CE2018s2-ga6

### Percentages
- GA02.9 T A percentage is a fraction of 100: x% of y = xy/100; "A is what percent of B" = A/B × 100. Teaches: ga-percent
- GA02.10 T Base shift: if A is 25% more than B, B is 20% less than A (the base changes): r/(100 + r) × 100.
- GA02.11 Q Percentages of parts and of combined groups (nested percentages, weighted groups, tables and budgets, vote swings). PYQ: 2024s1-ga4, EE2019-ga7, EE2018-ga9, EC2017s1-ga3, CE2016s2-ga4, EC2016s1-ga4, ME2016s1-ga4, CE2014s1-ga9, CH2014-ga9, EC2012-64, EE2012-65, EC2011-57
- GA02.12 T Percentage change = change / original × 100; successive changes multiply: +a% then −b% is a factor (1 + a/100)(1 − b/100), never a − b.
- GA02.13 T A product changes by the product of its factors' changes: area with both sides +10% grows 21%; a quotient divides the factors.
- GA02.14 Q Successive changes and the change in a product or quotient (a quantity growing as the square of a size, exchange rates, errors). PYQ: CE2024s2-ga3, ME2020s2-ga5, CE2019s2-ga7, ME2019s2-ga6, 2014s1-ga8, 2014s3-ga8, EE2014s1-ga8, EE2014s3-ga8

## GA03 · Commercial arithmetic, averages and mixtures
notes: general-aptitude/02-quantitative
hours: 2

### Profit, loss and discount
- GA03.1 T Cost price, selling price, profit or loss % on cost; marked price and discount % on the marked price; SP = MP(1 − d) = CP(1 + p). Teaches: ga-profit
- GA03.2 Q Profit and loss puzzles: two items at the same price, a rupee more turns a loss into a gain, taxes and fees, a rising cost. PYQ: 2026s2-ga4, CE2025s2-ga3, CE2025s2-ga9, 2024s2-ga7, EE2024-ga4, IN2024-ga3, EE2022-ga8, ME2019s1-ga7, CE2018s1-ga6, CE2013-64
- GA03.3 Q Discount and profit read from a table of marked and selling prices. PYQ: 2021s1-ga7, BT2021-ga7, CH2021-ga7
- GA03.4 T Partnership: profit shared in the ratio of investment × time; equal sharing among n changes when some drop out.
- GA03.5 Q Partnership shares and cost sharing among friends. PYQ: BT2022-ga7, CE2022s1-ga7, CE2022s2-ga7, 2019-ga4, CH2019-ga4
- GA03.6 T Cost = fixed cost + variable cost per unit × units; cost per unit = total cost / units.
- GA03.7 Q Cost per unit at a production level. PYQ: CE2014s1-ga5, CH2014-ga5

### Averages
- GA03.8 T Average = sum / count, so sum = average × count; changing one value by d changes the average by d/n; a weighted average weights each group's mean by its size. Teaches: ga-average
- GA03.9 Q Averages: a wrong entry corrected, a new value added, overlapping groups, weighted tables, averages of multiples. PYQ: ME2026-ga7, 2025s1-ga3, ME2022s1-ga2, ME2022s2-ga7, EE2015s1-ga10, EE2014s2-ga4, EE2014s3-ga5, EC2013-58, EE2013-57

### Mixtures, ages and interest
- GA03.10 T Mixtures: the mean of the mixture lies between the parts (alligation); repeated replacement of a fraction f keeps (1 − f)^n of the original.
- GA03.11 Q Mixing alloys or liquids; repeated removal and replacement. PYQ: EC2018-ga7, 2011-65
- GA03.12 Q Ages related at two moments, or by a chain of more and less. PYQ: EC2024-ga3, CE2018s1-ga3
- GA03.13 T Simple interest PRT/100; compound interest P(1 + r/100)^n; growth at r% a year multiplies by (1 + r/100) each year; present value divides. Teaches: ga-interest
- GA03.14 Q Compound interest, growth and present value; comparing investments; years to double. PYQ: DA2024-ga8, CE2024s2-37, CH2021-14, EC2021-ga1, EC2018-ga6, CH2017-53, CE2014s2-ga5

## GA04 · Speed, distance and work
notes: general-aptitude/02-quantitative
hours: 2

### Speed and distance
- GA04.1 T Distance = speed × time; km/h × 5/18 = m/s; at a fixed distance time is inversely proportional to speed. Teaches: ga-speed
- GA04.2 T Relative speed: same direction subtract, opposite directions add; time to meet or open a gap = gap / relative speed.
- GA04.3 Q Relative speed: two movers apart or meeting, chases with head starts and leaps, who can be where. PYQ: EE2022-ga2, CH2020-ga8, 2019-ga3, CH2019-ga3, EC2016s1-ga5, ME2016s1-ga5, EC2015s2-ga8, ME2015s1-ga8
- GA04.4 T Average speed = total distance / total time; for equal distances at u and v it is 2uv/(u + v), never (u + v)/2.
- GA04.5 Q Average speed over equal distances or equal times; a journey split between two speeds. PYQ: ME2022s1-ga3, CH2018-ga6, CE2017s2-ga9, 2013-64, EC2013-61, EE2013-64, ME2013-62
- GA04.6 T Trains: passing a pole covers the train's length, a platform or another train the sum of lengths; boats: downstream b + s, upstream b − s.
- GA04.7 Q Trains crossing poles, platforms and people; boats in a stream. PYQ: ME2018s1-ga8, EC2016s3-ga5, EC2014s1-ga8, EC2014s3-ga8, ME2014s1-ga8, ME2014s3-ga8
- GA04.8 T On a speed–time graph the distance is the area under the line.
- GA04.9 Q Distance from a speed–time graph or a speed formula. PYQ: EC2016s3-ga6, CH2013-61, EC2011-62

### Work and pipes
- GA04.10 T Work rate: someone who finishes in n days does 1/n a day; rates add when people work together; workers × days (× hours) is the work. Teaches: ga-work
- GA04.11 Q Combined work, the chain rule (workers, days, output), and teams of two kinds. PYQ: ME2020s2-ga8, EC2019-ga3, EE2019-ga4, ME2018s1-ga3, EC2017s2-ga8, ME2017s2-ga7, EC2016s1-ga10, EC2016s2-ga5, ME2016s1-ga10, ME2016s3-ga5, 2010-64, EC2010-63
- GA04.12 Q Work word problems: wages and hours, a growing backlog, reading speeds, scheduling jobs on two machines, mixed motion and work. PYQ: ME2018s2-ga8, CE2017s1-ga9, CH2017-64, EC2017s1-ga8, CE2016s2-ga10, 2013-65, ME2013-64, 2011-64
- GA04.13 T Pipes: a filling pipe adds its rate, a drain subtracts; phases are added up one after another.
- GA04.14 Q Pipes and cisterns with drains and phases. PYQ: CH2022-ga3, IN2022-ga3, CE2019s2-ga9, ME2019s2-ga7, EC2014s2-ga10, ME2014s2-ga10

## GA05 · Powers, logarithms and algebra
notes: general-aptitude/02-quantitative
hours: 3.5

### Powers and roots
- GA05.1 T Exponent laws: aᵐaⁿ = aᵐ⁺ⁿ, (aᵐ)ⁿ = aᵐⁿ, a⁰ = 1, a⁻ⁿ = 1/aⁿ, a^(1/n) = ⁿ√a; compare powers by making the bases or the exponents equal.
- GA05.2 Q Exponent laws: how xⁿyᵐ changes when x and y change, simplifying, equal-ratio scales. PYQ: DA2025-ga9, EC2025-ga3, EC2016s2-ga4, ME2016s3-ga4, EC2014s4-ga4, ME2014s4-ga4
- GA05.3 Q Nested radicals and numerical expressions with roots. PYQ: EE2025-ga5, CE2017s2-ga4, 2014s2-ga5, EE2014s2-ga5
- GA05.4 Q How many digits a power has. PYQ: 2017s2-ga8, EE2017s2-ga8
- GA05.5 T Exponential decay and growth: a quantity multiplied by the same factor in each equal step; two data points fix the factor.
- GA05.6 Q Exponential decay from two data points. PYQ: 2016s1-ga10, CE2016s1-ga10

### Logarithms
- GA05.7 T log_b x = y means bʸ = x; log(xy) = log x + log y, log(x/y) = log x − log y, log xⁿ = n log x, change of base log_b x = log x / log b; log_b b = 1, log 1 = 0. Teaches: ga-log
- GA05.8 Q Evaluate a logarithmic expression. PYQ: ME2018s2-ga5, EC2015s3-ga9, ME2015s2-ga9
- GA05.9 Q Solve logarithmic equations: a variable, a product, a relation between variables. PYQ: DA2026-ga4, CE2026s2-ga2, EC2026-ga4, ME2026-ga2, 2024s1-ga5, 2024s2-ga4, EC2024-ga4, CE2023s2-ga9, 2018-ga7, CE2018s2-ga5, CE2018s2-ga9, CH2015-5, EC2015s1-ga5
- GA05.10 Q Compare or bound logarithms. PYQ: CE2023s1-ga9, ME2018s1-ga6, 2011-57

### Equations
- GA05.11 T Linear equations: write the unknowns, one equation per fact, solve two equations in two unknowns by elimination.
- GA05.12 Q Linear word problems: counts and values, two numbers from their sum and product. PYQ: BT2024-ga4, IN2024-ga5, CE2020s1-ga5, ME2019s1-ga4, ME2019s2-ga4, 2017s2-ga4, EE2017s2-ga4, CE2013-56, EC2012-62, EE2012-63, EC2011-63
- GA05.13 T Quadratics: ax² + bx + c = 0 has roots (−b ± √(b² − 4ac))/2a; sum −b/a, product c/a; equal roots when b² = 4ac; roots of opposite sign when c/a < 0. Teaches: ga-quadratic
- GA05.14 Q Roots and coefficients of a quadratic. PYQ: 2022-ga3, 2021s2-ga4, EC2020-ga9, EE2018-ga3, 2016s2-ga5, 2014s1-ga5, EE2014s1-ga5, EC2013-64, EE2013-63
- GA05.15 T Polynomials: the factor theorem (p(a) = 0 means x − a is a factor), the remainder theorem (p(x) ÷ (x − a) leaves p(a)); identities (a ± b)², a² − b², (a + b)³, a³ ± b³.
- GA05.16 Q Factors, remainders and coefficients of polynomials. PYQ: BT2023-ga9, CH2023-ga9, CH2018-ga9, 2016s1-ga9, CE2016s1-ga9
- GA05.17 Q Algebraic manipulation: from a relation between variables, find another expression. PYQ: CE2026s1-ga10, EE2026-ga10, BT2024-ga2, BT2024-ga5, EC2021-ga2, ME2021s1-ga4, ME2021s2-ga4, CE2018s2-ga3, EE2018-ga4, EC2016s1-ga9, ME2016s1-ga9, EC2015s2-ga9, ME2015s1-ga9, EC2012-56, EC2010-62

### Absolute values and inequalities
- GA05.18 T |x| is the distance from 0; |x − a| = b gives x = a ± b; split at the points where the inside changes sign. min(x, y) = (x + y − |x − y|)/2. Teaches: ga-abs
- GA05.19 Q Equations with absolute values. PYQ: EE2016s2-ga5, 2014s1-ga4, 2014s2-ga8, EE2014s1-ga4, EE2014s2-ga8, CE2013-62, CH2013-64, EE2012-57
- GA05.20 Q Identities and extremes of absolute-value expressions. PYQ: EE2025-1, 2017s1-ga8, EE2017s1-ga8, EE2015s2-ga5
- GA05.21 T Inequalities: multiplying by a negative flips the sign; ranges add (3 < x < 5 and 8 < y < 11 give 11 < x + y < 16) but subtract crosswise.
- GA05.22 Q Pairs of inequalities, bounds on sums and differences, word problems with constraints. PYQ: 2026s1-ga4, EC2025-ga10, ME2023-ga7, CH2022-ga8, EC2022-ga7, IN2022-ga8, ME2022s2-ga2, EC2015s3-ga5, ME2015s2-ga5, EC2014s3-ga5, ME2014s3-ga5, CE2013-61, CH2013-56
- GA05.23 T The maximum or minimum of ax² + bx + c is at x = −b/2a.
- GA05.24 Q The best production level or the highest point of a quadratic. PYQ: CE2026s1-ga3, EE2026-ga3, 2017s2-ga9, EE2017s2-ga9, 2012-56, 2012-62, CE2012-57, CE2012-61, CH2012-58, CH2012-62, ME2012-57, 2011-63

## GA06 · Functions, graphs and series
notes: general-aptitude/02-quantitative
hours: 2.5

### Functions and their graphs
- GA06.1 T A function gives one output per input; evaluate piecewise rules case by case; f(g(x)) applies g first. Teaches: ga-function
- GA06.2 Q Evaluate functions: piecewise, composite, linear from two values. PYQ: 2025s2-ga3, ME2022s2-ga8, CE2021s1-ga9, IN2021-ga9, CE2020s2-ga5, EE2018-ga5, 2015s2-ga9, 2015s3-ga5, CE2015s1-ga5, EE2015s2-ga8
- GA06.3 Q Which statements about a function's properties hold. PYQ: 2023-ga7, 2023-ga9, EC2020-ga5
- GA06.4 T Floor ⌊x⌋ (greatest integer ≤ x) and ceiling ⌈x⌉; ⌊−x⌋ = −⌈x⌉.
- GA06.5 Q Floor and ceiling statements and graphs. PYQ: ME2025-ga4, ME2020s1-ga5
- GA06.6 T The coordinate plane; the graph of a line, |x|, x², and a max or min of two functions; shift and flip a graph. Teaches: ga-coordinate
- GA06.7 Q Match a graph with its equation. PYQ: 2026s1-ga8, EE2025-ga3, EC2023-ga7, EE2023-ga7, IN2023-ga9, CE2018s1-ga8, ME2018s1-ga9, 2015s3-ga8, CE2015s1-ga9

### Series
- GA06.8 T Arithmetic progression: nth term a + (n − 1)d, sum n/2 (first + last); the first n odd numbers sum to n². Teaches: ga-series
- GA06.9 Q Sums of odd numbers and of simple arithmetic progressions. PYQ: CE2024s1-ga2, CE2024s2-ga4, CH2024-ga2, IN2024-ga4, CH2020-ga5, 2014s2-ga4, EC2014s2-ga8, EC2014s4-ga5, ME2014s2-ga8, ME2014s4-ga5
- GA06.10 Q General progressions: insert terms, sums, the largest sum. PYQ: EC2026-ga8, BT2023-22, CE2020s1-ga8, ME2020s1-ga8, CE2018s1-ga9, 2015s2-ga6, 2013-58, EC2013-62, EE2013-65, ME2013-60, EC2011-65
- GA06.11 T Geometric progression: ratio r; sum a(rⁿ − 1)/(r − 1); infinite sum a/(1 − r) when |r| < 1. Telescoping sums cancel neighbours.
- GA06.12 Q Infinite geometric sums and telescoping sums. PYQ: DA2024-ga4, EC2018-ga4, 2013-61, ME2013-63
- GA06.13 T Recurrences: each term from earlier ones (Fibonacci: add the last two); ways to climb n steps by 1s and 2s follow Fibonacci.
- GA06.14 Q Recurrences and the wrong term of a Fibonacci-like list. PYQ: ME2024-ga3, 2023-ga3, IN2023-ga7, CE2019s1-ga4
- GA06.15 T Number series: look at differences, ratios, alternate terms, squares and cubes, or a recurrence.
- GA06.16 Q The next or missing term, or the odd one out, of a number series. PYQ: 2024s2-ga5, CE2024s1-ga4, CH2024-ga4, 2020-ga7, EE2020-ga7, EE2019-ga3, 2018-ga5, CH2015-8, EC2015s1-ga8, EE2015s2-ga9, 2014s3-ga4, EC2014s1-ga5, EC2014s2-ga5, EC2014s3-ga4, ME2014s1-ga5, ME2014s2-ga5, ME2014s3-ga4, 2012-65

## GA07 · Counting
notes: general-aptitude/02-quantitative
hours: 2

### Arrangements
- GA07.1 T The multiplication principle (independent choices multiply) and the addition principle (separate cases add); n! orders n distinct things. Teaches: ga-counting
- GA07.2 Q Orders of n things, strings with required character types, numbers formed from digits under a condition. PYQ: 2024s2-ga2, DA2024-ga3, EC2023-ga3, IN2023-39, IN2023-ga3, EE2020-ga8, EE2019-ga6, EE2018-ga6, CE2015s2-ga8, 2010-65, EC2010-64
- GA07.3 Q The sum of all numbers formed from given digits. PYQ: EC2014s4-ga10, ME2014s4-ga10
- GA07.4 T Restrictions: fill the restricted places first; "together" means glue them into one block (× their inner orders); "not together" = total − together.
- GA07.5 Q Rows with fixed or banned places, adjacency, assignments with forbidden pairs. PYQ: CE2021s1-ga5, CE2021s2-ga5, IN2021-ga5, ME2021s1-ga10, ME2021s2-ga1, EC2019-ga4, 2017s1-ga9, EC2017s2-ga9, EE2017s1-ga9, ME2017s2-ga8
- GA07.6 T Circular arrangements: (n − 1)! when only relative positions matter.
- GA07.7 Q Round-table arrangements with groups kept together, and other constrained seatings or shadings. PYQ: CE2024s1-ga7, CE2023s2-ga3, CE2023s2-ga7

### Selections
- GA07.8 T nCr = n!/(r!(n − r)!) chooses r of n when order does not matter; nCr = nC(n − r); round-robin games = nC2.
- GA07.9 Q Committees, teams and matches; knock-out games and other counting arguments. PYQ: 2026s1-ga3, CH2024-ga7, CH2020-ga9, EE2020-ga5, CE2018s2-ga4, EC2017s1-ga9, ME2015s3-ga5
- GA07.10 T With repetition and order not mattering: choose r from n kinds in (n + r − 1)Cr ways (stars and bars).
- GA07.11 Q Selections with repetition; pairs of subsets with a containment condition. PYQ: 2025s1-ga10, ME2024-ga7, ME2023-ga9
- GA07.12 Q Rectangles and parallelograms from two families of parallel lines. PYQ: CH2018-ga7, 2016s2-ga9, EE2016s1-ga9
- GA07.13 T Pigeonhole: n + 1 objects in n boxes put two in one box; the worst case decides "how many to be sure".
- GA07.14 Q The fewest picks that guarantee a match. PYQ: CE2023s2-ga4

## GA08 · Sets, probability and statistics
notes: general-aptitude/02-quantitative
hours: 3

### Sets and Venn diagrams
- GA08.1 T Venn diagrams: |A ∪ B| = |A| + |B| − |A ∩ B|; for three sets add the triple overlap back; fill the regions from the inside out. Teaches: ga-venn
- GA08.2 Q Two sets: only one, neither, union, a percentage. PYQ: 2024s2-ga3, EC2023-ga4, CE2021s1-ga3, IN2021-ga3, CE2020s2-ga9, 2016s2-ga6, EC2016s2-ga6, EE2016s1-ga6, 2010-59, EC2010-60
- GA08.3 Q Three sets: all three, at least two, none; ranges from overlapping figures; membership counts. PYQ: CE2022s2-ga4, 2019-ga7, 2019-ga9, CE2019s1-ga7, CH2019-ga7, CH2019-ga9, CH2018-ga8, ME2018s2-ga6, EC2017s2-ga5, ME2016s3-ga6, CE2015s2-ga10

### Probability
- GA08.4 T Probability = favourable / total for equally likely outcomes; list the sample space (two dice give 36). P(not A) = 1 − P(A). Teaches: ga-probability
- GA08.5 Q Dice, spinners and number sets: sums, products, multiples, primes, avoided digits. PYQ: 2026s1-ga10, 2026s2-ga10, ME2024-ga5, CH2022-ga7, EE2022-ga7, IN2022-ga7, 2017s1-ga5, CE2017s2-ga5, EE2017s1-ga5, 2015s1-ga3, EE2015s1-ga5, 2013-62, ME2013-61
- GA08.6 T Independent events multiply; "at least one" = 1 − P(none); P(A ∪ B) = P(A) + P(B) − P(A ∩ B).
- GA08.7 Q Independent events: both, exactly one, neither; at least one, at least two, bounds. PYQ: ME2025-ga10, EE2023-ga3, 2021s1-ga8, BT2021-ga8, CE2021s2-ga3, CH2021-ga8, 2015s1-ga10, EC2015s2-ga5, EE2015s1-ga9, ME2015s1-ga5
- GA08.8 Q Is it independent; what past results say about the next trial; is the die fair. PYQ: ME2018s2-ga10, ME2015s3-ga10, EC2014s2-ga4, ME2014s2-ga4
- GA08.9 T Conditional probability P(A | B) = P(A ∩ B)/P(B); draws without replacement change the next probabilities.
- GA08.10 Q Simple conditional probability, and draws with and without replacement. PYQ: 2022-ga8, ME2021s2-ga7, ME2017s2-ga4, EC2016s1-ga6, ME2016s1-ga6, CE2015s2-ga5
- GA08.11 T Selections: the probability of a composition = (ways to pick it) / (ways to pick any) with nCr; exactly k successes in n independent trials = nCk pᵏ(1 − p)ⁿ⁻ᵏ.
- GA08.12 Q Same colour or composition from a mix; exactly k successes in n trials. PYQ: 2026s2-ga3, 2025s1-ga8, ME2025-ga5, DA2024-ga7, 2018-ga10, EE2018-ga8, 2017s2-ga5, EE2017s2-ga5, EE2016s2-ga9, EC2014s3-ga10, ME2014s3-ga10
- GA08.13 T Bayes: P(source | outcome) = P(source)·P(outcome | source) / total probability of the outcome; draw the two-level tree.
- GA08.14 Q Which source produced an observed outcome (suppliers, coins, tests). PYQ: EC2018-ga9, CE2014s2-ga10, EC2014s1-ga10, ME2014s1-ga10, CH2013-62, 2012-63, CE2012-65, CH2012-61, ME2012-64

### Statistics
- GA08.15 T Mean, median (middle value of the sorted list, average of the two middles if even) and mode (most frequent); from a frequency table count up to the middle. Teaches: ga-statistics
- GA08.16 Q Median from data or a frequency table; an unknown pinned by mean, median and mode; how they relate. PYQ: DA2026-ga7, EE2025-ga8, 2024s1-ga3, CE2023s1-ga7, IN2023-ga4, CE2017s1-ga5, CH2017-60, ME2017s1-ga4
- GA08.17 T Standard deviation measures spread: adding a constant moves the mean but not the SD; multiplying by k multiplies both (SD by |k|); smaller SD relative to the mean is more consistent.
- GA08.18 Q Effect of shifting or scaling data on the mean and SD; the most consistent player. PYQ: EC2014s1-ga4, ME2014s1-ga4, 2012-64, CE2012-64, CH2012-65, ME2012-65

## GA09 · Geometry
notes: general-aptitude/02-quantitative
hours: 2.5

### Angles and triangles
- GA09.1 T Angles: on a line 180°, around a point 360°, vertically opposite equal; parallel lines make equal alternate and corresponding angles; a triangle's angles sum to 180°, an n-gon's to (n − 2)·180°. Teaches: ga-geometry
- GA09.2 Q Angle chasing in stars, polygons and triangles with equal sides. PYQ: CE2021s1-ga8, EE2021-ga3, IN2021-ga8, CE2014s1-ga8, CH2014-ga8
- GA09.3 T Pythagoras a² + b² = c² (triples 3-4-5, 5-12-13); area of a triangle ½ × base × height; the shortest distance to a line is the perpendicular.
- GA09.4 Q Right triangles, rhombus diagonals, squares on sides; minimum distance. PYQ: CE2025s2-ga10, EE2024-ga7, BT2023-ga3, CE2022s1-ga5
- GA09.5 T Similar triangles: equal angles give proportional sides, and areas in the square of that ratio; a line parallel to a side cuts the other two proportionally; the angle bisector divides the opposite side in the ratio of the other two sides.
- GA09.6 Q Lengths and areas from similar triangles (shadows, ladders, parallel lines); angle bisectors. PYQ: 2025s1-ga7, 2025s2-ga9, IN2025-ga9, CH2023-ga3, EC2022-ga3, CE2019s1-ga3, 2018-ga9, CE2018s1-ga4, EC2018-ga5, 2015s2-ga8, EE2015s2-ga7, ME2015s3-ga8
- GA09.7 T Equilateral triangle of side a: height (√3/2)a, area (√3/4)a²; a regular hexagon is six equilateral triangles; joining midpoints of a square gives half its area.
- GA09.8 Q Equilateral triangles, regular hexagons and nested shapes. PYQ: ME2022s1-ga7, ME2022s2-ga10, CE2021s2-ga10, EC2021-ga10, EE2021-ga7, ME2021s2-ga8, CH2018-ga4, CH2016-ga5, ME2016s2-ga5

### Quadrilaterals and circles
- GA09.9 T Rectangle area lw, perimeter 2(l + w); square side s, diagonal s√2; for a fixed perimeter the circle encloses the most area, then the square, then the equilateral triangle.
- GA09.10 Q Rectangle and square word problems; equal-area or equal-perimeter comparisons; a rectangle with one side changed. PYQ: DA2025-ga5, ME2022s1-ga8, CE2019s1-ga9, CE2019s2-ga3, ME2018s1-ga4, ME2018s2-ga4, EC2016s2-ga10, ME2016s3-ga10
- GA09.11 T Circle: circumference 2πr, area πr²; sector θ/360 of them; the angle in a semicircle is 90°; a square inscribed in a circle has the diameter as diagonal.
- GA09.12 Q Shaded areas of arcs, semicircles and sectors. PYQ: DA2026-ga10, EC2026-ga9, EE2025-ga10, CE2023s1-ga3, CE2023s1-ga10, EE2023-ga10, CE2021s2-ga9, EC2020-ga8
- GA09.13 Q Circles with inscribed triangles or squares: an area or a ratio of lengths. PYQ: CE2026s1-ga7, EE2026-ga7, CE2022s2-19, ME2021s1-ga3, EE2020-ga9, 2018-ga3
- GA09.14 T Heights and distances: tan θ = opposite/adjacent; tan 30° = 1/√3, tan 45° = 1, tan 60° = √3.
- GA09.15 Q Heights and distances with a given angle. PYQ: CE2024s1-ga10, CH2024-ga10, EE2024-ga10

### Probability from lengths and areas
- GA09.16 T Expected value = Σ value × probability; continuous probability is length or area of the favourable region over the whole.
- GA09.17 Q Expected values and probabilities from lengths and areas. PYQ: EC2025-ga7, EE2021-ga8, CE2014s2-ga4, EC2012-65, EE2012-61

## GA10 · Solids and coordinate geometry
notes: general-aptitude/02-quantitative
hours: 2

### Solids
- GA10.1 T Cube a³ and 6a²; cuboid lbh; cylinder πr²h, curved surface 2πrh; cone ⅓πr²h; sphere (4/3)πr³ and 4πr². Teaches: ga-solids
- GA10.2 Q Surface area and volume of cubes, spheres, pyramids; comparing solids; the smallest enclosing box. PYQ: CH2022-ga2, IN2022-ga2, 2021s2-ga3, BT2021-ga6, CE2019s2-ga4, CH2018-ga5, CE2017s1-ga4, CH2017-59, 2016s1-ga5, CE2016s2-ga9, 2014s1-ga10
- GA10.3 Q A sheet rolled into a cylinder vs cut into a cube: ratio of volumes. PYQ: 2024s1-ga7, BT2024-ga7, 2021s1-ga6, CH2021-ga6
- GA10.4 Q Identical circles packed in a ring, a box or a bundle: occupied space, wrap length. PYQ: CE2024s2-ga7, EC2024-ga7, IN2024-ga7, 2020-ga8
- GA10.5 T Rolling a sector into a cone: the arc becomes the base circumference and the radius the slant height.
- GA10.6 Q Cones from sectors; solids of revolution. PYQ: EC2021-ga8, ME2017s1-ga3, EC2015s3-ga8, ME2015s2-ga8
- GA10.7 T A big cube of n × n × n unit cubes: n³ cubes, 6n² visible faces when all six sides show; unit cubes with 3, 2, 1, 0 painted faces: 8, 12(n − 2), 6(n − 2)², (n − 2)³.
- GA10.8 Q Painted and hidden faces of a cube built from unit cubes. PYQ: CH2015-9, EC2015s1-ga9
- GA10.9 Q Speeds of points on a spinning sphere at different latitudes. PYQ: CE2023s2-ga10

### Lines and regions
- GA10.10 T A line y = mx + c: slope m, intercept c; parallel lines have equal slopes, perpendicular ones slopes with product −1; the distance between two points √(Δx² + Δy²).
- GA10.11 Q Lines from equations or graphs: parallel, perpendicular, intercepts, values on a fitted line. PYQ: BT2025-ga9, CE2025s1-ga9, CE2022s2-ga8, 2020-ga9, EC2016s3-ga10, EE2016s1-ga10
- GA10.12 Q The area of a region bounded by lines or given by its vertices; points with integer coordinates. PYQ: 2022-ga2, CE2022s1-ga2, EC2022-ga8, ME2022s2-ga3, ME2017s1-ga8, EC2016s3-ga9, ME2015s3-ga9
- GA10.13 L The slope of a curve at a point (uses differentiation). PYQ: CE2014s1-ga4, CH2014-ga4, ME2012-63
- GA10.14 Q Pick the sketch of a described function. PYQ: DA2025-ga7, EC2025-ga5, ME2020s1-ga9, CH2018-ga3, 2016s2-ga10, CH2016-ga10, ME2016s2-ga10
- GA10.15 T A contour map joins points at equal height (or pressure): closer lines mean steeper, water flows across them downhill.
- GA10.16 Q Read a contour map: what floods, a path's profile, the steepest direction. PYQ: IN2023-ga5, 2017s1-ga10, 2017s2-ga10, EC2017s1-ga10, EC2017s2-ga10, EE2017s1-ga10, EE2017s2-ga10

## GA11 · Data interpretation
notes: general-aptitude/02-quantitative
hours: 2

### Bars, pies and lines
- GA11.1 T Read the scale and the units first (lakh, crore, thousands); answer from the chart, never from general knowledge; estimate before computing to eliminate options. Teaches: ga-chart
- GA11.2 Q Bar charts: which statement is true or incorrect; averages, ratios and rates across bars. PYQ: DA2025-ga10, CE2024s1-ga8, EC2024-ga8, EE2024-ga8, ME2024-ga8, EC2021-ga9, EC2020-ga10, ME2020s1-ga10, CE2017s1-ga10, CH2017-65, EE2016s2-ga6
- GA11.3 Q Bar charts with several steps: revenue, expenditure and profit; growth year on year; first-time vs repeat counts. PYQ: 2021s2-ga9, EE2021-ga9, 2020-ga10, CH2020-ga10, EE2020-ga10, EC2019-ga7, 2015s3-ga10, CE2015s1-ga8, EC2014s1-ga9, ME2014s1-ga9
- GA11.4 Q Mean, median and mode from a frequency chart. PYQ: BT2022-ga8, CE2022s1-ga8, EC2022-21
- GA11.5 T Pie charts: a sector's share = angle/360; two pies need the totals before comparing parts.
- GA11.6 Q One pie chart: angle to value, share changes, derived quantities. PYQ: CE2025s2-ga5, 2024s2-ga8, DA2024-ga5, CE2020s1-ga10, ME2019s1-ga9, EC2017s1-ga4, EC2014s3-ga9, EC2014s4-ga9, ME2014s3-ga9, ME2014s4-ga9
- GA11.7 Q Two pies, or a pie and a table, combined. PYQ: 2024s1-ga8, ME2023-ga3, ME2021s1-ga9, CE2020s2-ga10, ME2020s2-ga10, 2015s1-ga9, EE2015s1-ga8, CE2014s2-ga8, EC2014s2-ga9, ME2014s2-ga9
- GA11.8 Q Line graphs: which trend statements hold; ratios and totals read from the lines. PYQ: CE2024s2-ga8, IN2024-ga8, CE2018s2-ga8, CH2018-ga10, CE2017s2-ga10, ME2017s1-ga10, ME2017s2-ga10, CE2016s2-ga6, 2014s2-ga9, 2014s3-ga9, CE2014s1-ga10, CH2014-ga10, EE2014s2-ga9, EE2014s3-ga9

### Tables, maps and figures
- GA11.9 Q Tables: weighted averages and shares, growth rates, two-way tables. PYQ: 2025s2-ga8, EC2025-ga9, ME2019s2-ga9, CE2018s1-ga5, 2016s1-ga6, CE2016s1-ga6, 2015s1-ga6, CE2015s2-ga9, EC2015s2-ga4, ME2015s1-ga4, 2014s1-ga9, 2014s3-ga5, EC2014s4-ga8, EE2014s1-ga9, ME2014s4-ga8, CE2013-63
- GA11.10 Q Bubble charts and pixel figures: count or compare from the picture. PYQ: DA2025-ga3, 2011-62
- GA11.11 Q Maps and networks: a tour through every city once, bridges joining every zone. PYQ: 2026s2-ga8, 2025s2-ga10

## GA12 · Logic
notes: general-aptitude/03-analytical
hours: 2.5

### Conditionals and negation
- GA12.1 T "If A then B" is equivalent to "if not B then not A" (the contrapositive); it does NOT give "if B then A" or "if not A then not B". "A only if B" means if A then B. Teaches: ga-conditional
- GA12.2 Q One conditional sentence: which statement is (or is not) necessarily true. PYQ: 2026s1-ga5, 2026s2-ga5, DA2026-ga5, CH2016-ga4, ME2016s2-ga4
- GA12.3 Q Rules for who qualifies; which cards must be checked to test a rule. PYQ: EE2023-ga6, CE2017s2-ga3, EC2017s2-ga3, EC2014s1-ga7, ME2014s1-ga7
- GA12.4 T Negation: not (all are P) = some are not P; not (some are P) = none is P; not (A and B) = not A or not B.
- GA12.5 Q From a quantified statement being true or false, what follows. PYQ: CE2026s2-ga4, EC2026-ga5, ME2026-ga4, BT2023-ga6, CH2023-ga6, 2022-ga4, CE2021s1-ga6, IN2021-ga6

### Syllogisms
- GA12.6 T All, some, no as Venn diagrams: a conclusion follows only if it holds in EVERY diagram the premises allow; "some" means at least one, possibly all. Teaches: ga-syllogism
- GA12.7 Q Two premises: which conclusions follow. PYQ: CE2024s2-ga2, IN2024-ga2, EE2022-ga4, CE2021s2-ga8, ME2021s2-ga6, ME2018s1-ga10, CE2017s1-ga3, CH2017-58, EC2017s1-ga5, EC2015s2-ga7, ME2015s1-ga7, ME2015s3-ga7, EC2014s1-ga2, ME2014s1-ga2, CH2013-65
- GA12.8 T "Either I or II": the two conclusions must be complementary (one some, one no, same subject and predicate) and neither may follow alone.
- GA12.9 Q Either-or conclusions; three-premise chains. PYQ: CE2022s2-ga9, CH2022-ga9, IN2022-ga9, ME2022s1-ga9, 2021s1-ga9, BT2021-ga9, CH2021-ga9, EC2021-ga6
- GA12.10 Q A paragraph of facts: which statement must be true or can be inferred. PYQ: CE2023s1-ga6, CE2023s2-ga6, EC2023-ga6, IN2023-ga6, 2016s2-ga8, CE2016s2-ga8, EE2016s1-ga8, EE2016s2-ga4, EC2014s3-ga7, ME2014s3-ga7

### Truth, sufficiency and numbers
- GA12.11 T Truth-teller puzzles: assume one case, follow the consequences, reject contradictions; count the true statements under each assumption.
- GA12.12 Q Truth-tellers, liars and "exactly one is true". PYQ: CE2023s1-ga4, EC2022-ga9, 2019-ga6, ME2019s1-ga6, ME2017s1-ga5, ME2017s2-ga9
- GA12.13 T Data sufficiency: test each statement alone, then together; "sufficient" means one answer, not a nice answer.
- GA12.14 Q Which statements are enough to answer. PYQ: 2015s1-ga4, 2015s2-ga5, CE2015s2-ga7, EE2015s1-ga4, EE2015s2-ga4, CE2014s2-ga6
- GA12.15 Q Statements about numbers or scores: which implication is necessary; what a passage of percentages lets you infer. PYQ: CE2026s2-ga5, EC2026-ga2, ME2026-ga5, IN2025-ga5, 2023-ga4, EE2023-ga4, 2022-ga7, EE2020-ga6, CH2016-ga6, ME2016s2-ga6, EC2014s2-ga7, ME2014s2-ga7

## GA13 · Order, arrangements, relations and directions
notes: general-aptitude/03-analytical
hours: 1.5

### Directions
- GA13.1 T Directions: north up, east right; turning right from north faces east; the final distance comes from the net east and net north (Pythagoras). Teaches: ga-direction
- GA13.2 Q Final distance and direction after a walk; facing from shadows and doors; tracing a path. PYQ: 2025s1-ga5, ME2025-ga3, CE2022s2-ga10, CE2021s2-ga6, ME2021s1-ga2, ME2021s2-ga5, EC2017s2-ga4, ME2016s3-ga9, 2015s2-ga7, CE2015s2-ga4, EE2015s2-ga10, CE2014s2-ga9

### Ordering and arrangements
- GA13.3 T Put comparisons on one line (taller to the right); combine the chains; a position is fixed only if every arrangement agrees. Teaches: ga-arrangement
- GA13.4 Q Rank from comparisons: the oldest, the tallest, a position, what must be true. PYQ: ME2022s1-ga4, 2021s2-ga10, EE2019-ga10, CE2017s2-ga7, 2016s1-ga8, CE2016s1-ga8, EC2016s1-ga8, EC2016s3-ga8, ME2016s1-ga8, ME2015s3-ga4, CE2013-65, 2010-62, EC2010-65
- GA13.5 Q People or houses in a row under constraints. PYQ: EE2021-ga10, CE2020s1-ga7, EC2019-ga6, 2017s2-ga3, EE2017s2-ga3
- GA13.6 T Circular seating: fix one person, then place the rest; "to the left of" depends on facing the centre; opposite seats in an even circle.
- GA13.7 Q Circular and square tables: who sits where. PYQ: CH2022-ga4, IN2022-ga4, CH2020-ga7, 2017s1-ga3, 2017s1-ga7, CE2017s2-ga8, EC2017s1-ga7, EE2017s1-ga3, EE2017s1-ga7
- GA13.8 Q Grids and allotments: seats in a grid, portfolios, floors and rooms under conditions; floor plans with requests. PYQ: CE2026s2-ga9, ME2026-ga9, EC2024-ga2, EE2024-ga2, CE2020s2-ga4, 2019-ga10, CE2019s2-ga6, CH2019-ga10, EC2019-ga10, CE2017s1-ga7, CH2017-62, 2015s3-ga7, CE2015s1-ga10, CE2014s1-ga7, CH2014-ga7

### Family relations
- GA13.9 T Family trees: draw generations as rows, mark gender; "only son of my grandfather" is my father or uncle by elimination.
- GA13.10 Q Blood relations from a chain; family statements that must be true or false. PYQ: 2025s1-ga4, BT2022-ga4, CE2022s1-ga4, CE2019s1-ga10, ME2019s1-ga10, EC2017s2-ga7, EC2016s3-ga3

## GA14 · Codes, clocks and puzzles
notes: general-aptitude/03-analytical
hours: 3

### Codes, letter series and analogies
- GA14.1 T Letter positions A = 1 … Z = 26 (and reversed Z = 1); EJOTY marks 5, 10, 15, 20, 25. Teaches: ga-letters
- GA14.2 Q Letter-shift codes: encode or decode a word. PYQ: 2025s2-ga7, EE2025-ga7, IN2025-ga7, ME2025-ga7, CE2020s1-ga4, ME2020s1-ga7, ME2019s2-ga3, EE2018-ga7, 2015s3-ga1, CE2015s1-ga4
- GA14.3 Q Codes of meaningful words: match the common parts. PYQ: 2016s1-ga4, CE2016s1-ga4, EC2014s4-ga7, ME2014s4-ga7
- GA14.4 Q Letter series: the next or missing group. PYQ: ME2018s2-ga3, CH2016-ga8, ME2016s2-ga8, EC2015s3-ga4, ME2015s2-ga4, EC2014s3-ga6, EC2014s4-ga6, ME2014s3-ga6, ME2014s4-ga6, CE2012-63, CH2012-64, ME2012-61
- GA14.5 Q Odd one out among letters, numbers or words. PYQ: ME2024-ga2, 2016s2-ga4, EC2016s3-ga4, EE2016s1-ga4, EE2016s2-ga3, CE2014s1-ga6, CH2014-ga6, EC2014s1-ga6, EC2014s2-ga6, EE2014s3-ga4, ME2014s1-ga6, ME2014s2-ga6
- GA14.6 T Analogy A : B :: C : D: name the exact relation (habitat, cause, part of, degree) and apply the same one.
- GA14.7 Q Word analogies; numbers in figures following a hidden relation. PYQ: 2026s2-ga6, CE2026s1-ga8, EE2026-ga8, CE2025s2-ga4, EE2025-ga4, IN2025-ga2

### Clocks and calendars
- GA14.8 T The minute hand turns 6° a minute, the hour hand 0.5°; the angle at h:m is |30h − 5.5m|; the hands meet every 12/11 hours (22 times a day). Teaches: ga-clock
- GA14.9 Q Angles between the hands; times the hands meet or cross; a clock that gains or loses. PYQ: BT2025-ga7, CE2025s1-ga7, CH2025-ga7, CE2024s1-ga5, CH2024-ga5, ME2023-ga4, ME2022s1-ga10, EC2020-ga7, EC2019-ga9, ME2019s1-ga3, CE2018s2-ga7, 2014s2-ga10, EE2014s2-ga10
- GA14.10 T Calendars: an ordinary year shifts the weekday by 1, a leap year by 2; leap years divide by 4 (centuries by 400); a month has at most five of a weekday.
- GA14.11 Q Weekdays from dates; repeating calendars; 53 of a weekday in a year. PYQ: ME2022s2-ga4, CE2020s2-ga7, EC2013-65, EE2013-61

### Puzzles
- GA14.12 Q Digits and unknowns in figures: missing digits, unique integers, house numbers. PYQ: EC2026-ga6, CE2025s2-ga8, CE2018s1-ga10, CE2018s2-ga10, ME2018s2-ga9, ME2017s1-ga7, 2010-61
- GA14.13 T Worst-case puzzles: each weighing or test splits the possibilities; plan for the unluckiest outcome.
- GA14.14 Q Weighings and tests in the worst case; the fewest cuts of a wire frame. PYQ: BT2025-ga4, CE2025s1-ga4, CH2025-ga4, EC2023-ga9, 2017s2-ga7, EE2017s2-ga7, EC2012-63, EE2012-64
- GA14.15 Q The fewest moves, doors, bridges or time on a figure or timetable; routes and distances on a map. PYQ: CE2026s2-ga8, IN2025-ga10, BT2022-ga9, CE2022s1-ga9, CH2022-ga5, IN2022-ga5, ME2022s2-ga9, 2020-ga5, EE2019-ga9, ME2018s2-ga7, EC2016s2-ga9
- GA14.16 T Rule simulations: apply the rule to every cell at once, step by step, in a table; scenario puzzles: tabulate every case the clues allow.
- GA14.17 Q Grids and states under local rules (bulbs, neighbour counts, Sudoku-like fills). PYQ: 2026s2-ga9, CE2026s1-ga9, EE2026-ga9, EC2025-ga8, 2024s2-ga10, CH2024-ga9, ME2023-ga5
- GA14.18 Q Story puzzles with conditions: who won, who played whom. PYQ: 2026s1-ga9, DA2026-ga8, EC2026-ga7, EE2022-ga9, EE2018-ga10, ME2017s2-ga5

## GA15 · Spatial aptitude
notes: general-aptitude/04-spatial
hours: 3.5

### Symmetry, reflection and rotation
- GA15.1 T A line of symmetry splits a figure into two mirror halves; rotational symmetry of order n means it looks the same after 360°/n; a mirror swaps left and right across the mirror line. Teaches: ga-symmetry
- GA15.2 Q The fewest squares to add for symmetry; which object has rotational symmetry of order n; convexity and other shape facts. PYQ: DA2025-ga4, DA2025-ga8, BT2025-ga10, CE2025s1-ga10, CH2025-ga10, ME2025-ga9, 2024s1-ga10, BT2024-ga10, BT2023-ga5, CE2023s1-ga5, CH2023-ga5, 2022-ga9, 2021s1-ga2, BT2021-ga2, CH2021-ga2, EC2021-ga3
- GA15.3 Q Mirror and water images, including the time on a clock seen in a mirror. PYQ: EC2024-ga9, CE2022s2-ga5, CE2021s1-ga2, CE2021s2-ga2, IN2021-ga2, EC2016s2-ga8, ME2016s3-ga8
- GA15.4 T Rotation by θ about a point (clockwise or not), reflection, translation and scaling; two reflections in crossing lines make a rotation; order matters.
- GA15.5 Q Sequences of rotations and reflections; rotated or mirrored letters; scaling a circle; rotating a cube about its diagonal; meshing gears. PYQ: CE2026s1-ga5, EC2026-ga10, EE2026-ga5, CE2025s2-ga7, ME2025-ga8, CE2024s2-ga10, EE2024-ga9, IN2024-ga10, 2023-ga10, CE2023s2-ga5, 2022-ga5, EC2022-ga10, EE2022-ga5

### Folding and cutting
- GA15.6 T A fold is a reflection in the fold line: a hole punched through k layers becomes 2ᵏ holes, mirrored across every fold when unfolded. Teaches: ga-folding
- GA15.7 Q Fold, punch or cut, then unfold; a transparent sheet folded over. PYQ: 2025s1-ga9, 2021s1-ga4, 2021s2-ga2, BT2021-ga4, CH2021-ga4, EE2021-ga2
- GA15.8 Q Size, perimeter and creases after folding k times. PYQ: 2024s1-ga9, BT2024-ga9, EC2024-ga10, EC2023-ga10, CE2021s1-ga7, IN2021-ga7, ME2021s2-ga9

### Cubes and solids
- GA15.9 T Cube nets: in a net, faces separated by one face in a straight line are opposite; a cube view shows three faces meeting at a corner, never two opposite faces.
- GA15.10 Q Fold a net into a cube; dice views and opposite faces; folds needed for a 3D object. PYQ: 2025s2-ga4, IN2025-ga4, DA2024-ga9, ME2024-ga9, BT2022-ga10, CE2022s1-ga10
- GA15.11 Q The fewest cuts to divide a cube; the cross-section of a cut solid. PYQ: 2024s2-ga9, DA2024-ga10
- GA15.12 T Views: front, top and side projections; a shadow in a parallel beam is a projection, so a cylinder can cast a circle or a rectangle but never a triangle.
- GA15.13 Q Views of a 3D assembly; which shadow is impossible. PYQ: 2026s1-ga7, CE2024s2-ga9, IN2024-ga9, IN2023-ga10, ME2023-ga10, ME2022s1-ga5
- GA15.14 Q Regular solids, surfaces seen from outside, models of packed spheres. PYQ: CE2025s1-ga8, CH2025-ga8, EE2025-ga9, ME2024-ga10, 2023-ga5, EE2014s1-ga10

### Assembling and patterns
- GA15.15 T Assembling: compare total area first, then corners and edges; check whether flipping is allowed.
- GA15.16 Q Which figure the pieces make; the piece that completes a figure. PYQ: 2026s2-ga2, 2026s2-ga7, DA2026-ga3, CE2026s1-ga2, EC2026-ga3, EE2026-ga2, CH2022-ga10, IN2022-ga10, ME2022s2-ga5, 2021s2-ga7, ME2021s1-ga7
- GA15.17 Q Figure sequences: the next figure. PYQ: CE2026s2-ga3, ME2026-ga3, BT2025-ga5, CE2025s1-ga5, CH2025-ga5, EC2025-ga4, ME2020s2-ga7
- GA15.18 Q Tiles: which tile made a pattern, which shapes tile the plane. PYQ: 2026s1-ga2, CE2026s2-ga10, ME2026-ga10, BT2023-ga10, CH2023-ga10
- GA15.19 Q Counting squares and rectangles in a figure; crosses counted in a grid. PYQ: CE2024s1-ga9, EC2023-ga5, EE2023-ga5, EC2022-ga4
- GA15.20 Q Layout puzzles: a guard's view, an ant's path, dividing land into similar plots, colouring a map. PYQ: DA2024-ga2, 2022-ga10, EC2022-ga5, EE2022-ga10
