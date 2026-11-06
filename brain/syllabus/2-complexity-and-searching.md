# Part 2 · Complexity and searching

Official GATE 2027 wording (Section 5): "Searching... Asymptotic worst case time and space complexity." It comes before Data Structures because every data structure's cost is stated in these terms, and lists, heaps and trees are compared against binary search.

How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic to teach, in this order. Nothing here uses an idea before the line that teaches it: `npm run check:syllabus` proves it.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers or other languages). `Teaches:` names the concepts a line introduces (`concepts.json`).
PYQ ids are newest first. See `README.md` for the rules and `npm run syllabus` for the next step.

## X01 · Asymptotic notation
notes: algorithms/01-asymptotic-analysis
hours: 2.5

### Definitions
- X01.1 T Growth rate: constants and small terms stop mattering as n grows. `f = O(g)` means f ≤ c·g for all n ≥ n0: an upper bound. Teaches: bigo
- X01.2 T Ω is the same with ≥: a lower bound. Θ means both.
- X01.3 T o and ω are strict: `f = o(g)` means f/g → 0. The limit test: `f/g → 0, c, ∞`.
- X01.4 T Worst, average and best case are different from O, Ω, Θ: any notation can describe any case.
- X01.5 T Properties: transitive, reflexive, `f+g = Θ(max(f,g))`, product rule.
- X01.6 T What does not hold: `2^(2n)` is not `O(2^n)`, though `2^(n+1)` is. Oscillating functions such as `n^(1+sin n)` are incomparable.
- X01.7 Q True-or-false claims about two functions. PYQ: 2023-19, 2022-1, 2015s3-42, 2012-18, IT2004-55, 2003-20, 2001-1.16, 1996-1.11, 1994-1.23
- X01.8 Q Which notations fit a given sum or value. PYQ: 2015s3-4, 1993-8.7

### Ordering functions
- X01.9 T The ladder: `1 < log log n < log n < (log n)^k < n^ε < n < n log n < n^k < a^n < n! < n^n`.
- X01.10 T Compare by taking logs of both sides. The base of a log does not change Θ. `a^(log b) = b^(log a)`.
- X01.11 T `log n! = Θ(n log n)` (Stirling). Sums: harmonic is `Θ(log n)`, arithmetic `Θ(n²)`, geometric is dominated by its largest term.
- X01.12 Q Arrange functions in increasing order. PYQ: 2026s2-14, 2021s1-3, 2017s1-04, 2011-37, IT2008-10, 2008-39, 2000-2.17

## X02 · Complexity of code
notes: algorithms/01-asymptotic-analysis
hours: 3

### Counting from loops
- X02.1 T Count operations line by line. Independent nested loops multiply. Dependent ones sum: `j` from 1 to `i` gives `n(n+1)/2`.
- X02.2 T Step sizes: `i*=2` is log n, `i=i*i` is log log n, and `j+=i` inside `i=1..n` is `n log n` by the harmonic sum.
- X02.3 T A halving outer loop with an inner loop of `i` steps is a geometric sum: Θ(n).
- X02.4 Q Exact count or tight bound from loops. PYQ: 2023-44, 2017s2-38, 2014s1-42, 2007-15, 2006-15, 1999-11a
- X02.5 Q Asymptotic size of a returned value. PYQ: 2015s1-31, 2013-31

### Refinements
- X02.6 T Time vs the count of one specific operation; early exit; best vs worst.
- X02.7 T A total-cost argument when an inner loop's work adds up across the outer loop.
- X02.8 Q A loop with early exit, or a call whose cost depends on a counter. PYQ: 2007-51, 2004-82
- X02.9 T Input size in bits vs magnitude: for a number n, searching over values costs polylog in n.
- X02.10 Q Complexity of arithmetic on numbers. PYQ: 2003-66
- X02.11 T Scale from a running time: given the cost formula and one timing, solve for the n that takes a new time. Crossover between two packages.
- X02.12 Q Crossover and scaling. PYQ: 2010-12

### Space
- X02.13 T Space complexity: auxiliary memory plus recursion depth.
- X02.14 Q Space used by recursive code, and memoised Fibonacci. PYQ: 2005-81b, 2005-81a, 2000-16

### What is the best possible
- X02.15 T What the best possible algorithm can do: a sorted input lets you answer from the ends, and "does an element exist satisfying X" may need only a constant or linear look.
- X02.16 Q Best complexity for a stated problem; comparisons or exchanges needed. PYQ: 2026s2-28, 2024s1-7, 2000-1.15, 1999-1.13

## X03 · Recurrences
notes: algorithms/02-recurrences
hours: 4

### Subtract and conquer
- X03.1 T A recurrence gives T(n) in terms of smaller inputs, plus a base case. Teaches: recurrence
- X03.2 T `T(n) = T(n-1) + f(n)` sums f. Back-substitute to an exact closed form.
- X03.3 T `T(n) = 2T(n-1) + c` is exponential.
- X03.4 Q Exact closed form or claims about it. PYQ: 2005-37, 2004-84, 2004-83, 2003-35, 1999-2.21, 1998-6a, 1993-15, 1992-07b, 1992-07a, 1990-17a, 1989-13b, 1988-13iv, 1987-10a

### Reading a recurrence from code
- X03.5 T Read it off a recursive function: one term per call, plus the work done outside the calls. Hanoi is `2T(n-1)+1`.
- X03.6 Q Write the recurrence for Towers of Hanoi. PYQ: 2012-16
- X03.7 Q Derive a recurrence from a flowchart or a program, then solve it. PYQ: 2016s2-39, 1997-15
- X03.8 Q Euclid's gcd in Θ(log n) calls; compare two recursive programs. PYQ: 2008-75, 2008-74, 2007-44

### Master theorem
- X03.9 T `T(n) = aT(n/b) + f(n)`: compare f with `n^(log_b a)`. Three cases.
- X03.10 T Case 3's regularity condition, and the extended form with `log^k n`, including negative k.
- X03.11 Q Solve by master theorem; statements about the cases themselves. PYQ: 2026s1-7, 2025s1-10, 2024s2-5, 2024s1-32, 2021s2-39, 2014s2-13, IT2005-51, 2009-35, 1997-4.6, 1996-2.12

### Change of variable
- X03.12 T `T(n) = aT(√n) + f(n)`: set `n = 2^m` and rename `S(m) = T(2^m)`, then use master.
- X03.13 T `T(n) = T(n^(1/a)) + 1` gives `log_a log_b n`.
- X03.14 Q Square-root style recurrences, in closed form or from code. PYQ: 2020-2, 2017s2-30, IT2008-44, 2007-45, 2006-51, 2002-2.11, 2002-1.3

### Unequal splits
- X03.15 T `T(n) = T(αn) + T(βn) + cn`: if `α+β < 1` it is Θ(n), if `α+β = 1` it is Θ(n log n). The recursion tree argument.
- X03.16 Q Unequal splits; which recurrences give a stated complexity. PYQ: 2026s2-15, 2021s1-30

### Counting
- X03.17 T Counting with recurrences: bit strings with or without consecutive 0s or 1s, by splitting on the last symbol.
- X03.18 Q Set up and evaluate a counting recurrence. PYQ: 2015s1-49, 2008-79, 2008-78

## X04 · Searching
notes: algorithms/03-searching
hours: 2.5

### Linear search
- X04.1 T Linear search: `(n+1)/2` comparisons on average for a success, n in the worst case. Teaches: linsearch
- X04.2 T Random probing with replacement has expected n probes.
- X04.3 Q Average or expected comparisons. PYQ: 2002-2.10, 1996-2.13

### Binary search
- X04.4 T Binary search, iterative and recursive: it needs sorted data and random access. Teaches: binsearch
- X04.5 T Worst-case comparisons are `floor(log2 n)+1` on a success, with `T(n) = T(n/2) + 1`. Count carefully whether each step makes 1 or 2 key comparisons.
- X04.6 Q Exact number of comparisons or operations; its recurrence. PYQ: DA2026-21, DA2024-30, 2021s2-8, 1994-1.7
- X04.7 T Bugs: `i=k` instead of `i=k+1`, the wrong stopping condition, an infinite loop on two remaining elements.
- X04.8 Q Find the failure of a buggy search. PYQ: 2014s3-42, 2008-85, 2008-84, 1996-18

### Variants
- X04.9 T First or last occurrence; the boundary between 0s and 1s.
- X04.10 T Whether an element occurs more than n/2 times in a sorted array; peak and bitonic arrays.
- X04.11 Q Variants and their exact or asymptotic costs. PYQ: 2025s2-31, 2017s1-48, 2008-40
