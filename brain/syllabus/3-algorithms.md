# Part 3 · Algorithms

Official GATE 2027 wording (Section 5): "Searching, sorting, hashing. Asymptotic worst case time and space complexity. Algorithm design techniques: greedy, dynamic programming and divide-and-conquer. Graph traversals, minimum spanning trees, shortest paths."

How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic to teach, in this order.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers or now off the syllabus).
PYQ ids are newest first. Hashing is taught in Part 2 (D10). See `README.md` for the rules and `npm run syllabus` for the next step.

## A01 · Asymptotic notation
notes: algorithms/01-asymptotic-analysis
hours: 2.5

### Definitions
- A01.1 T O, Ω, Θ, o, ω with their constants, and the limit test `f/g → 0, c, ∞`. Worst, average and best case are different from O, Ω, Θ.
- A01.2 T Properties: transitive, `f+g = Θ(max)`, product rule, reflexive. What does not hold: `2^(2n)` is not `O(2^n)`; `2^(n+1)` is. Oscillating functions such as `n^(1+sin n)` are incomparable.
- A01.3 Q True-or-false claims about two functions. PYQ: 2023-19, 2022-1, 2015s3-42, 2012-18, IT2004-55, 2003-20, 2001-1.16, 1996-1.11, 1994-1.23
- A01.4 Q Which notations fit a given sum or value. PYQ: 2015s3-4, 1993-8.7

### Ordering functions
- A01.5 T The ladder: `1 < log log n < log n < (log n)^k < n^ε < n < n log n < n^k < a^n < n! < n^n`.
- A01.6 T Compare by taking logs of both sides. Base change, `a^(log b) = b^(log a)`, Stirling `log n! = Θ(n log n)`. Harmonic sum is `Θ(log n)`, arithmetic and geometric sums.
- A01.7 Q Arrange functions in increasing order. PYQ: 2026s2-14, 2021s1-3, 2017s1-04, 2011-37, IT2008-10, 2008-39, 2000-2.17

## A02 · Complexity of code
notes: algorithms/01-asymptotic-analysis
hours: 3

### Counting from code
- A02.1 T Count operations line by line. Independent and dependent nested loops; `i*=2` is log n; `j+=i` inside `i=1..n` is `n log n` (harmonic); `i = i*i` is log log n; a halving outer loop with `n` inner gives a geometric sum.
- A02.2 Q Exact count or tight bound from loops. PYQ: 2023-44, 2017s2-38, 2014s1-42, 2007-15, 2006-15, 1999-11a
- A02.3 T Time vs count of a specific operation; early exit; best vs worst; a total-cost argument when an inner loop's work adds up across the outer loop.
- A02.4 Q A loop with early exit, or a call whose cost depends on a counter. PYQ: 2007-51, 2004-82
- A02.5 T Input size in bits vs magnitude: for a number n, binary search over values costs polylog in n.
- A02.6 Q Complexity of arithmetic on numbers, Euclid's gcd in Θ(log n) calls; compare two recursive programs. PYQ: 2008-75, 2008-74, 2007-44, 2003-66
- A02.7 T Scale from a running time: if T(64)=30s for `n log n`, solve for the n that takes 6 minutes. Crossover between two packages.
- A02.8 Q Crossover and scaling. PYQ: 2015s3-27, 2010-12
- A02.9 T Space complexity: auxiliary memory plus recursion depth.

### What is the best possible
- A02.10 T What the best possible algorithm can do: a sorted input lets you answer from the ends; "exists an element satisfying X" may need only a constant or linear look.
- A02.11 Q Best complexity for a stated problem; best structure for a mix of operations; comparisons or exchanges needed. PYQ: 2026s2-28, 2024s1-7, 2015s1-40, IT2007-81, 2000-1.15, 1999-1.13

## A03 · Recurrences
notes: algorithms/02-recurrences
hours: 4

### Master theorem
- A03.1 T `T(n) = aT(n/b) + f(n)`: compare f with `n^(log_b a)`, with all three cases and the regularity condition. Extended form with `log^k n`, including negative k.
- A03.2 Q Solve by master theorem; statements about the cases themselves. PYQ: 2026s1-7, 2025s1-10, 2024s2-5, 2024s1-32, 2021s2-39, 2014s2-13, IT2005-51, 2009-35, 1997-4.6, 1996-2.12

### Change of variable
- A03.3 T `T(n) = aT(√n) + f(n)`: set `n = 2^m` and rename `S(m) = T(2^m)`, then use master. `T(n) = T(n^(1/a)) + 1` gives `log_a log_b n`.
- A03.4 Q Square-root style recurrences, in closed form or from code. PYQ: 2020-2, 2017s2-30, IT2008-44, 2007-45, 2006-51, 2002-2.11, 2002-1.3

### Unequal splits
- A03.5 T `T(n) = T(αn) + T(βn) + cn`: if `α+β < 1` it is Θ(n); if `α+β = 1` it is Θ(n log n); recursion tree argument.
- A03.6 Q Unequal splits; which recurrences give a stated complexity. PYQ: 2026s2-15, 2021s1-30

### Subtract and conquer
- A03.7 T `T(n) = T(n-1) + f(n)` sums f; `T(n) = 2T(n-1) + c` is exponential; back-substitution to an exact closed form.
- A03.8 Q Exact closed form or claims about it. PYQ: 2005-37, 2004-84, 2004-83, 2003-35, 1999-2.21, 1998-6a, 1993-15, 1992-07b, 1992-07a, 1990-17a, 1989-13b, 1988-13iv, 1987-10a

### Recurrences from algorithms and code
- A03.9 T Read the recurrence off a recursive function: one term per call, plus the work done outside the calls. Hanoi is `2T(n-1)+1`. Binary search, merge sort and quick sort are added in their own units.
- A03.10 Q Write the recurrence for Towers of Hanoi. PYQ: 2012-16
- A03.11 Q Derive a recurrence from a flowchart or a program, then solve it. PYQ: 2016s2-39, 1997-15
- A03.12 T Counting with recurrences: bit strings with or without consecutive 0s or 1s. Same method, split on the last symbol. Linked to Discrete Maths.
- A03.13 Q Set up and evaluate a counting recurrence. PYQ: 2015s1-49, 2008-79, 2008-78

## A04 · Searching
notes: algorithms/03-searching
hours: 2.5

- A04.1 T Linear search: average `(n+1)/2` comparisons on success; random probing with replacement has expected n.
- A04.2 Q Average or expected comparisons. PYQ: 2002-2.10, 1996-2.13
- A04.3 T Binary search, iterative and recursive: requires random access and sorted data. Worst-case comparisons `floor(log2 n)+1` on a success; count carefully whether each step makes 1 or 2 key comparisons.
- A04.4 Q Exact number of comparisons or operations; its recurrence; which inputs allow it. PYQ: DA2026-21, DA2025-17, DA2024-30, 2021s2-8, 1994-1.7
- A04.5 T Bugs in binary search: `i=k` instead of `i=k+1`, wrong stopping condition, infinite loop on two remaining elements.
- A04.6 Q Find the failure of a buggy binary search. PYQ: 2008-85, 2008-84, 1996-18
- A04.7 T Variants: first or last occurrence, boundary between 0s and 1s, whether an element occurs more than n/2 times in a sorted array, peak and bitonic arrays.
- A04.8 Q Variants and their exact or asymptotic costs. PYQ: 2025s2-31, 2017s1-48, 2008-40

## A05 · Divide and conquer
notes: algorithms/04-divide-and-conquer
hours: 3

- A05.1 T The pattern: divide, conquer, combine. Write its recurrence.
- A05.2 T Max and min by pairs: `ceil(3n/2) - 2` comparisons. Second largest needs `n + ceil(log2 n) - 2`. "Some element that is not the largest" takes 1 comparison, "neither max nor min" takes O(1).
- A05.3 Q Exact comparison counts for selection-type problems. PYQ: 2025s2-10, 2021s1-2, 2015s2-22, 2014s1-39, 2007-50
- A05.4 T Power by squaring: `Θ(log n)` multiplications, same for modular exponentiation.
- A05.5 Q Multiplications needed for a power. PYQ: IT2007-17, 1999-1.16
- A05.6 T Maximum subarray: D&C `n log n` and Kadane O(n).
- A05.7 Q Maximum subarray sum by hand. PYQ: 2019-25
- A05.8 T Selection: quickselect, median of medians gives O(n). So sorting is not needed to find a median.
- A05.9 Q Linear-time median and what it implies. PYQ: 2019-37
- A05.10 N Strassen (7 multiplications, `n^2.81`), counting inversions with merge sort, closest pair, integer multiplication: recurrence and final complexity only.

## A06 · Elementary sorts
notes: algorithms/05-sorting
hours: 2.5

- A06.1 T Bubble sort: largest moves to the end each pass; swap count equals the number of inversions; early-stop flag gives O(n) best case.
- A06.2 T Selection sort: always `n(n-1)/2` comparisons and at most `n-1` swaps. Not stable as usually written.
- A06.3 T Insertion sort: running time is `Θ(n + inversions)`, best O(n). Binary search reduces comparisons to `n log n` but shifts keep it Θ(n²).
- A06.4 T Inversions: expected `n(n-1)/4` in a random permutation; max `n(n-1)/2`.
- A06.5 Q Count swaps, comparisons or passes on a given array. PYQ: 2025s1-23, DA2026-39, DA2025-19, DA2024-35, 2021s1-9, 2000-17, 1995-12
- A06.6 Q Number of swaps in the worst case; which sort needs the fewest. PYQ: 2013-6, 2009-11, 2006-14
- A06.7 Q Effect of inversions or binary search on insertion sort. PYQ: 2003-62, 2003-61, 2003-22
- A06.8 Q Minimum replacements to make an array sorted. PYQ: 2024s2-25

## A07 · Merge sort
notes: algorithms/05-sorting
hours: 2

- A07.1 T Merge two sorted lists: at most `m+n-1` comparisons. Top-down and bottom-up (passes); `n-1` merges; Θ(n log n) always; O(n) space; stable.
- A07.2 Q Array after a pass; number or type of merges; cost on a list. PYQ: 2026s2-22, 1999-1.14, 1995-1.16
- A07.3 T When comparing keys isn't O(1): sorting n strings of length n costs n × n log n.
- A07.4 Q Merge sort on strings. PYQ: 2012-39
- A07.5 T k-way merge with a heap: `O(n log k)`. Merged-array position facts: where `c[2i]` falls among `a[i]`, `b[i]`.
- A07.6 Q k sorted lists; merged position statements. PYQ: IT2005-59, 2005-39

## A08 · Quick sort
notes: algorithms/05-sorting
hours: 2.5

- A08.1 T Partition with first, last or middle pivot: trace Lomuto and the two-pointer version until you trust both. Count swaps and comparisons only under the stated scheme.
- A08.2 Q Trace partition; complete code using `partition`; count swaps and comparisons. PYQ: DA2024-20, 2015s2-45, 2014s1-14, 1996-2.15, 1989-9, 1987-1.xviii
- A08.3 T Worst case: sorted or reverse input with an end pivot, `T(n) = T(n-1) + cn`. Choosing the middle index or a random pivot still leaves Θ(n²) worst case. Best and expected: Θ(n log n).
- A08.4 Q Worst-case bound and worst input. PYQ: 2014s3-14, 2001-1.14, 1992-03.iv, 1988-1iii
- A08.5 T Any constant fraction split gives Θ(n log n): pivot at `n/4` or `n/5` from an O(n) algorithm, or the true median.
- A08.6 Q Complexity with a guaranteed split. PYQ: 2009-39, 2008-43, 2006-52
- A08.7 T Random pivot: probability of landing at either extreme is `2/n`; expected recurrence is a sum over all ranks.
- A08.8 Q Probability about the pivot. PYQ: 2019-20
- A08.9 Q Quick sort's recurrence, and matching recursive algorithms to recurrences. PYQ: DA2026-5, 2015s1-2, IT2004-57

## A09 · Heap sort, non-comparison sorts, lower bounds
notes: algorithms/05-sorting
hours: 2

- A09.1 T Heap sort: build then n deletes; Θ(n log n); in-place; not stable. Connected question: how many elements fit in Θ(log n) time.
- A09.2 Q Heap sort cost in terms of a budget. PYQ: 2013-30
- A09.3 T Decision tree: any comparison sort needs `ceil(log2 n!)` comparisons, `Ω(n log n)`.
- A09.4 Q Lower bound; exact minimum for small n. PYQ: 2004-29, 1991-01.vii, 1990-3.v
- A09.5 T Counting sort `O(n+k)`, stable; radix sort `d` stable passes; the base can be chosen as n, so keys up to `n^c` sort in O(n).
- A09.6 Q Radix or counting sort on a stated range. PYQ: IT2008-43, 1992-02.ix, 1991-13
- A09.7 N Bucket sort: when it is linear on average.
- A09.8 T The master table for every sort: best, average and worst time, extra space, stable, in-place, adaptive. Write it from memory.
- A09.9 Q Read off the table; match sorts and searches to complexities. PYQ: 2017s2-03, 2016s2-13, 2016s1-13, 2007-14, 1999-1.12, 1998-1.22

## A10 · Graph traversals: BFS, DFS, topological sort, components
notes: algorithms/06-graph-traversal
hours: 5

### BFS
- A10.1 T Queue, levels, BFS tree. Θ(V+E) with lists, Θ(V²) with a matrix. Unweighted shortest paths from the source. In an undirected graph, a non-tree edge joins levels differing by at most 1.
- A10.2 Q Valid BFS order; number of orderings. PYQ: 2023-46, 2017s2-15, 2008-19
- A10.3 Q Facts about BFS trees, distances and the double-BFS diameter trick. PYQ: 2025s2-49, 2025s1-33, 2016s2-11, 2015s1-45, 2014s2-14, 2007-41, 2001-2.14

### DFS
- A10.4 T Stack or recursion. Discovery and finish times; parenthesis theorem. Directed edges: tree, back, forward, cross. In an undirected graph, only tree and back edges exist.
- A10.5 Q Valid DFS order. PYQ: IT2008-47, 2003-21
- A10.6 Q Classify edges; which timings can occur for an edge. PYQ: 2026s1-40, DA2024-4, 2024s1-35, 2018-30, IT2007-24, IT2006-47, 1989-4.vii
- A10.7 Q Facts about DFS trees, leaves and vertices; recursion depth. PYQ: 2014s3-13, 2006-48, 2000-2.19
- A10.8 T Forest edges: `n - c`, so components = `n - edges`. Traversal order on a defined graph.
- A10.9 Q Components from edges; tight bound on a representation. PYQ: 2024s1-50, 2014s1-11, 2008-7, IT2005-14
- A10.10 Q Which data structure a traversal uses; BFS vs DFS comparisons; traversal in a reversed graph. PYQ: DA2026-30, 2025s2-19, DA2025-55, DA2024-34, 2021s2-46, 2000-1.13
- A10.11 T Articulation points: a non-root u is one if a child's subtree has no back edge above u; the root is one if it has 2 or more children. Bridges.
- A10.12 Q Articulation points from a DFS tree. PYQ: 2021s1-41

### DAGs and topological sort
- A10.13 T A topological order exists exactly for DAGs. Kahn's algorithm and reverse finish time. Count the orders by reasoning about which vertices are free.
- A10.14 Q Valid orders or number of orders. PYQ: DA2024-41, 2016s1-11, 2014s1-13, 2007-5
- A10.15 T Shortest paths on a DAG in Θ(V+E) by relaxing in topological order, also for negative weights. Longest or product scores work the same way.
- A10.16 Q DAG shortest-path cost; DP on a DAG. PYQ: 2026s2-27, 2021s2-55

### Components
- A10.17 T Strongly connected components: Kosaraju in Θ(V+E); same SCCs in the reversed graph.
- A10.18 Q Find SCCs; count components of a graph defined by a rule. PYQ: 2018-43, 2014s1-3, IT2006-46, 1997-6.2

## A11 · Greedy
notes: algorithms/07-greedy
hours: 2.5

- A11.1 T Greedy-choice property and optimal substructure. A counterexample kills a greedy claim.
- A11.2 T Activity selection (earliest finish). Interval partitioning: rooms = maximum overlap.
- A11.3 Q Rooms or activities from a timeline. PYQ: 2003-69
- A11.4 T Job sequencing with deadlines: sort by profit, take the latest free slot.
- A11.5 Q Which tasks are done and the total profit. PYQ: 2005-84b, 2005-84a
- A11.6 T Fractional knapsack by value/weight ratio is optimal. For 0/1 the same greedy can fail, so compute the gap.
- A11.7 Q Gap between greedy and optimal on a knapsack. PYQ: 2018-48
- A11.8 T Optimal merge pattern: always merge the two shortest. Record moves = `sum(a+b)`; comparisons = `sum(a+b-1)`.
- A11.9 Q Minimum moves or comparisons in merging. PYQ: 2014s2-38, 1999-2.20
- A11.10 T Huffman: merge the two smallest frequencies; prefix-free; average length = `sum(freq × depth)`; tie-breaking rules given in the question.
- A11.11 Q Build codes, decode a string, average or total length. PYQ: 2021s2-26, 2017s2-50, 2007-77, 2007-76, IT2006-48, 1989-13a
- A11.12 L Greedy partition with a bound to prove; greedy independent set in a tree. PYQ: 1994-24, 1990-12b

## A12 · Minimum spanning trees
notes: algorithms/08-minimum-spanning-trees
hours: 4

### Properties
- A12.1 T Cut property: the lightest edge across a cut is in some MST (every MST if unique). Cycle property: the unique heaviest edge of a cycle is in no MST.
- A12.2 T Distinct weights give a unique MST, which always contains the smallest and second smallest edges; the third smallest can be left out (when it closes a triangle). With repeated weights, every MST contains some minimum-weight edge, but no particular one is guaranteed.
- A12.3 Q True-or-false statements on MST edges. PYQ: 2026s1-39, 2022-39, 2021s2-1, 2017s1-26, 2016s1-40, 2007-49, IT2005-52, 2005-82a, 2000-2.18
- A12.4 T Adding a constant to every weight keeps every MST; squaring weights above 1 keeps the MST, and its new weight is below the old weight squared. The path inside an MST is not a shortest path, but it is a minimum-bottleneck path.
- A12.5 Q Effect of changing weights; MST vs shortest paths. PYQ: 2025s2-27, 2025s1-8, 2016s1-14, 2015s3-40, 2012-29

### Kruskal and Prim
- A12.6 T Kruskal: sort edges, union-find, skip cycle edges. O(E log V). With edges sorted, near-linear.
- A12.7 T Prim: grow from a vertex using the lightest edge out. O(E log V) with a heap, O(V²) with a matrix. Negative weights are fine for both.
- A12.8 Q Which edge sequence is impossible under Kruskal or under Prim. PYQ: IT2008-45, 2009-38, 2006-47, IT2004-56
- A12.9 Q Complexity of MST algorithms and of updating an MST. PYQ: 2020-31, 1992-01.ix, 1991-03.vi

### Computing and counting
- A12.10 Q MST weight on a given graph or matrix, with a constraint such as a required leaf. PYQ: 2010-50, 2003-68, 2001-15
- A12.11 T Count MSTs: group equal-weight edges and count the valid choices per weight.
- A12.12 Q Number of distinct MSTs. PYQ: 2024s2-49, 2021s1-17, 2018-47, 2014s2-52, 1995-22
- A12.13 T Bounds from the cycle property: largest x such that an edge is in every MST; smallest total weight; maximum possible MST weight for a given multiset of weights.
- A12.14 Q Find the bound. PYQ: 2025s1-54, 2016s1-39, 2015s1-43
- A12.15 Q MST of a graph defined by a formula; path length inside it. PYQ: 2020-49, 2011-55, 2011-54, 2006-11, 2005-6, 1997-9, 1996-16
- A12.16 Q Rooted spanning arborescences counted directly. PYQ: 2022-48
- A12.17 Q Minimum-congestion path between two vertices. PYQ: 2005-82b

## A13 · Shortest paths: Dijkstra
notes: algorithms/09-shortest-paths
hours: 3

- A13.1 T Relaxation and the triangle inequality: `d(v) ≤ d(u) + w(u,v)`.
- A13.2 T Dijkstra: extract the minimum, finalise, relax. Order in which vertices are finalised. Θ((V+E) log V) with a binary heap, Θ(V²) with an array.
- A13.3 Q Order of finalisation; which path it reports among ties. PYQ: 2012-40, 2004-44, 1996-17
- A13.4 Q Complexity and data structure choices; unweighted graphs use a queue. PYQ: 2006-12, 2005-38
- A13.5 T Negative edges: Dijkstra can give wrong answers. Which vertices stay correct in a given graph.
- A13.6 Q Which distances are correct with a negative edge. PYQ: 2008-45
- A13.7 T Weight transformations: adding a constant can change shortest paths; `w'(u,v) = w(u,v) + f(u) - f(v)` never does.
- A13.8 Q Reasoning from distances and transformations; 0/1 weights; inferring edges. PYQ: 2020-40, DA2025-48, 2016s1-38, IT2007-3, 2003-67

## A14 · Dynamic programming
notes: algorithms/10-dynamic-programming
hours: 4.5

### Method
- A14.1 T Overlapping subproblems and optimal substructure. State, recurrence, base case, fill order, answer cell. Top-down memo vs bottom-up. DP vs greedy vs D&C.
- A14.2 T Fill order must compute dependencies first: check it for a given recurrence, and how the table's dependencies determine time and space.
- A14.3 Q Is a given fill order correct; which table entries are needed. PYQ: 2026s2-29

### Sequence problems
- A14.4 T LCS: `L[i][j]` recurrence, O(mn). Backtracking, and counting distinct LCSs.
- A14.5 Q Complete the LCS recurrence, fill order, length and count. PYQ: 2014s2-37, 2009-54, 2009-53
- A14.6 T LIS-style: length starting at each index; weighted subsequences where the weight halves with position.
- A14.7 Q Monotone sequences and subsequence weights. PYQ: 2011-25, 2010-34

### Knapsack family
- A14.8 T 0/1 knapsack and subset sum: `X[i][j] = X[i-1][j] or X[i-1][j-a_i]`, O(nW) pseudo-polynomial. Which cell holds the answer.
- A14.9 Q Complete the subset-sum DP; which entry gives the answer. PYQ: 2008-81, 2008-80
- A14.10 T Rod cutting: `R(n) = max(p(i) + R(n-i))`.
- A14.11 Q Compute R and judge statements. PYQ: 2021s1-40

### Interval DP
- A14.12 T Matrix chain: `m[i][j] = min(m[i][k] + m[k+1][j] + p(i-1)p(k)p(j))`, Θ(n³) time, Θ(n²) space, filled by increasing length. Number of parenthesisations is Catalan.
- A14.13 Q Minimum multiplications; explicitly computed pairs. PYQ: 2018-31, 2016s2-38, 2011-38

### Path-style DP
- A14.14 T Shortest route with shortcuts on a number line; recurrences from a rule in the question.
- A14.15 Q Evaluate a recurrence defined by the problem. PYQ: 2014s3-37
- A14.16 N Fair game: coin change, edit distance, optimal BST, multistage graph, Fibonacci-style tilings. State and recurrence only.

## A15 · Dynamic programming on graphs
notes: algorithms/09-shortest-paths
hours: 2.5

- A15.1 T Bellman-Ford: V-1 rounds, relax all edges, Θ(VE). It is DP on path length: `d(v,k) = min(d(v,k-1), min d(u,k-1) + w(u,v))`. Finds negative cycles reachable from the source only.
- A15.2 Q Properties, cost on a complete graph, cheapest path using at most k edges. PYQ: 2026s1-31, 2013-19, 2010-51, 2009-13
- A15.3 T Floyd-Warshall: `D[i][j] = min(D[i][j], D[i][k] + D[k][j])`, k in the outer loop, Θ(V³), DP. Warshall for transitive closure uses OR and AND.
- A15.4 Q Paradigm; complete the template; trace reachability in a matrix. PYQ: 2016s2-14, 2003-70, 2002-12
- A15.5 Q Match graph algorithms to their complexities. PYQ: IT2005-15, 1989-2.iii

## A16 · Design reasoning and off-syllabus awareness
notes: algorithms/11-algorithm-design
hours: 2

- A16.1 T Reading an unfamiliar problem: define what must be tracked; try a one-pass scan from either end; try "sort first", "hash it", "two pointers", "sliding window"; state the cost before writing anything.
- A16.2 Q Which paradigm each named algorithm uses. PYQ: 2017s1-05, 2015s2-36, 2015s1-6, 1998-1.21, 1997-1.5, 1995-1.5, 1994-1.19, 1990-2.vii
- A16.3 Q Linear scans: leaders, and the longest subarray with at most two distinct values. PYQ: 2024s2-32, 2006-17
- A16.4 Q Reduce to a known trick: prefix sums and hashing for equal-sum spans; weights as powers of 2. PYQ: 2014s1-37, 2006-54
- A16.5 L Descriptive designs from early papers. PYQ: 1992-8
- A16.6 L Backtracking, branch and bound: recognise the names only.
- A16.7 L P, NP, NP-complete, NP-hard were removed from the syllabus: know the definitions in one line, nothing more. PYQ: 2013-18, 2012-4, 2009-14, 2006-31, 2005-58
