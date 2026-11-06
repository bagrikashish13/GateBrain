# Part 4 · Algorithms

Official GATE 2027 wording (Section 5): "Searching, sorting, hashing. Asymptotic worst case time and space complexity. Algorithm design techniques: greedy, dynamic programming and divide-and-conquer. Graph traversals, minimum spanning trees, shortest paths." Searching and complexity are Part 2, hashing is in Part 3.

How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic to teach, in this order. Nothing here uses an idea before the line that teaches it: `npm run check:syllabus` proves it.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers or other languages). `Teaches:` names the concepts a line introduces (`concepts.json`).
PYQ ids are newest first. See `README.md` for the rules and `npm run syllabus` for the next step.

## A01 · Elementary sorts
notes: algorithms/05-sorting
hours: 2.5

### Words
- A01.1 T Stable keeps equal keys in their original order. In-place uses O(1) extra space.
- A01.2 T An inversion is a pair out of order: at most `n(n-1)/2`, and `n(n-1)/4` expected in a random permutation. Teaches: inversions

### The three sorts
- A01.3 T Bubble sort: the largest moves to the end each pass. Teaches: bubble
- A01.4 T Bubble sort's swap count equals the number of inversions. An early-stop flag gives O(n) best case.
- A01.5 T Selection sort: always `n(n-1)/2` comparisons and at most `n-1` swaps. Not stable as usually written. Teaches: selsort
- A01.6 T Insertion sort: running time is `Θ(n + inversions)`, best O(n). Teaches: inssort
- A01.7 T Binary search reduces insertion sort's comparisons to `n log n`, but shifts keep it Θ(n²).

### PYQs
- A01.8 Q Count swaps, comparisons or passes on a given array. PYQ: 2025s1-23, DA2026-39, DA2025-19, DA2024-35, 2000-17, 1995-12
- A01.9 Q Number of swaps in the worst case. PYQ: 2013-6, 2009-11
- A01.10 Q Effect of inversions or binary search on insertion sort. PYQ: 2003-62, 2003-61, 2003-22
- A01.11 Q Minimum replacements to make an array sorted. PYQ: 2024s2-25

## A02 · Divide and conquer: the pattern
notes: algorithms/04-divide-and-conquer
hours: 2

- A02.1 T The pattern: divide, conquer, combine. Write its recurrence. Teaches: dnc
- A02.2 T Max and min by pairs: `ceil(3n/2) - 2` comparisons.
- A02.3 T Second largest needs `n + ceil(log2 n) - 2`.
- A02.4 T "Some element that is not the largest" takes 1 comparison, "neither max nor min" takes O(1).
- A02.5 Q Exact comparison counts for selection-type problems. PYQ: 2025s2-10, 2021s1-2, 2015s2-22, 2014s1-39, 2007-50
- A02.6 T Power by squaring: `Θ(log n)` multiplications, same for modular exponentiation.
- A02.7 Q Multiplications needed for a power. PYQ: IT2007-17, 1999-1.16
- A02.8 T Maximum subarray: divide and conquer in `n log n`, Kadane in O(n).
- A02.9 Q Maximum subarray sum by hand. PYQ: 2019-25

## A03 · Merge sort
notes: algorithms/05-sorting
hours: 2

- A03.1 T Merge two sorted lists: at most `m+n-1` comparisons.
- A03.2 T Top-down merge sort: Θ(n log n) always, O(n) space, stable. Teaches: mergesort
- A03.3 T Bottom-up merge sort: passes, and `n-1` merges in total.
- A03.4 Q Array after a pass; number or type of merges; cost on a list. PYQ: 2026s2-22, 1999-1.14, 1995-1.16
- A03.5 Q Scale from a running time. PYQ: 2015s3-27
- A03.6 T When comparing keys isn't O(1): sorting n strings of length n costs n × n log n.
- A03.7 Q Merge sort on strings. PYQ: 2012-39
- A03.8 T k-way merge with a heap: `O(n log k)`.
- A03.9 T Merged-array position facts: where `c[2i]` falls among `a[i]`, `b[i]`.
- A03.10 Q k sorted lists; merged position statements. PYQ: IT2005-59, 2005-39

## A04 · Quick sort
notes: algorithms/05-sorting
hours: 2.5

### Partition
- A04.1 T Partition with the last element as pivot (Lomuto): trace it until you trust it. Teaches: quicksort
- A04.2 T The two-pointer partition, and first or middle pivots. Count swaps and comparisons only under the stated scheme.
- A04.3 Q Trace partition; complete code using `partition`; count swaps and comparisons. PYQ: DA2024-20, 2015s2-45, 2014s1-14, 1996-2.15, 1989-9, 1987-1.xviii

### Cost
- A04.4 T Worst case: sorted or reverse input with an end pivot, `T(n) = T(n-1) + cn`.
- A04.5 T Choosing the middle index or a random pivot still leaves Θ(n²) worst case. Best and expected: Θ(n log n).
- A04.6 Q Worst-case bound and worst input. PYQ: 2014s3-14, 2001-1.14, 1992-03.iv
- A04.7 T Any constant fraction split gives Θ(n log n): pivot at `n/4` or `n/5` from an O(n) algorithm, or the true median.
- A04.8 Q Complexity with a guaranteed split. PYQ: 2009-39, 2008-43, 2006-52
- A04.9 T Random pivot: probability of landing at either extreme is `2/n`. The expected recurrence is a sum over all ranks.
- A04.10 Q Probability about the pivot. PYQ: 2019-20
- A04.11 Q Quick sort's recurrence, and matching recursive algorithms to recurrences. PYQ: DA2026-5, 2015s1-2, IT2004-57
- A04.12 Q Mixed statements on hashing, recursion, quick sort and list search. PYQ: 1995-2.22

## A05 · Selection and more divide and conquer
notes: algorithms/04-divide-and-conquer
hours: 1.5

- A05.1 T Quickselect: partition, then recurse on one side. Θ(n) expected. Teaches: median
- A05.2 T Median of medians gives O(n) worst case, so finding a median does not need sorting.
- A05.3 Q Linear-time median and what it implies. PYQ: 2019-37
- A05.4 N Strassen: 7 multiplications, `n^2.81`. Recurrence and final complexity only.
- A05.5 N Counting inversions with merge sort, closest pair, integer multiplication. Recurrence and final complexity only.

## A06 · Heap sort, non-comparison sorts, lower bounds
notes: algorithms/05-sorting
hours: 2.5

### Heap sort
- A06.1 T Heap sort: build, then n deletes. Θ(n log n), in-place, not stable. Teaches: heapsort
- A06.2 Q Heap sort cost in terms of a budget. PYQ: 2013-30

### Lower bound
- A06.3 T Decision tree: any comparison sort needs `ceil(log2 n!)` comparisons, so `Ω(n log n)`. Teaches: sortbound
- A06.4 Q Lower bound; exact minimum for small n; drawing the decision tree. PYQ: 2004-29, 1999-8, 1991-01.vii, 1990-3.v

### Without comparing
- A06.5 T Counting sort: `O(n+k)`, stable. Teaches: radix
- A06.6 T Radix sort: `d` stable passes. The base can be chosen as n, so keys up to `n^c` sort in O(n).
- A06.7 Q Radix or counting sort on a stated range. PYQ: IT2008-43, 1992-02.ix, 1991-13
- A06.8 N Bucket sort: when it is linear on average.

### All sorts together
- A06.9 T The master table for every sort: best, average and worst time, extra space, stable, in-place, adaptive. Write it from memory.
- A06.10 Q Read off the table; match sorts and searches to complexities. PYQ: 2017s2-03, 2016s2-13, 2016s1-13, 2007-14, 1999-1.12, 1998-1.22, 1988-1iii
- A06.11 Q Which sort does the least on a given input. PYQ: 2021s1-9, 2006-14
- A06.12 Q Which problem a linked list does not suit. PYQ: 1994-1.17

## A07 · Graph traversals: BFS, DFS, topological sort, components
notes: algorithms/06-graph-traversal
hours: 5

### BFS
- A07.1 T BFS with a queue: levels and the BFS tree. Teaches: bfs
- A07.2 T Θ(V+E) with lists, Θ(V²) with a matrix. It gives unweighted shortest paths from the source.
- A07.3 T In an undirected graph, a non-tree edge joins levels differing by at most 1.
- A07.4 Q Valid BFS order; number of orderings. PYQ: 2023-46, 2017s2-15, 2008-19
- A07.5 Q Facts about BFS trees, distances and the double-BFS diameter trick. PYQ: 2025s2-49, 2025s1-33, 2016s2-11, 2015s1-45, 2014s2-14, 2001-2.14

### DFS
- A07.6 T DFS with a stack or recursion. Discovery and finish times; the parenthesis theorem. Teaches: dfs
- A07.7 T Directed edges: tree, back, forward, cross. In an undirected graph, only tree and back edges exist.
- A07.8 Q Valid DFS order. PYQ: IT2008-47, 2003-21
- A07.9 Q Classify edges; which timings can occur for an edge. PYQ: 2026s1-40, DA2024-4, 2024s1-35, 2018-30, IT2007-24, IT2006-47, 1989-4.vii
- A07.10 Q Facts about DFS trees, leaves and vertices; recursion depth. PYQ: 2014s3-13, 2006-48, 2000-2.19
- A07.11 Q BFS and DFS on a tree. PYQ: 2021s2-16, 2004-6

### Components
- A07.12 T Forest edges: `n - c`, so components = `n - edges`.
- A07.13 T Traversal order on a graph defined by a rule.
- A07.14 Q Components from edges; tight bound on a representation. PYQ: 2024s1-50, 2014s1-11, 2008-7, IT2005-14
- A07.15 T Articulation points: a non-root u is one if a child's subtree has no back edge above u; the root is one if it has 2 or more children. Teaches: articulation
- A07.16 T Bridges: an edge whose removal disconnects the graph.
- A07.17 Q Articulation points from a DFS tree; cut vertices and bridges. PYQ: 2021s1-41, 2004-81

### DAGs and topological sort
- A07.18 T A topological order exists exactly for DAGs. Teaches: toposort
- A07.19 T Kahn's algorithm, and reverse finish time.
- A07.20 T Count the orders by reasoning about which vertices are free.
- A07.21 Q Valid orders or number of orders. PYQ: DA2024-41, 2016s1-11, 2014s1-13, 2007-5

### Strong components
- A07.22 T Strongly connected components: Kosaraju in Θ(V+E), and the same SCCs in the reversed graph. Teaches: scc
- A07.23 Q Find SCCs; count components of a graph defined by a rule. PYQ: 2018-43, 2014s1-3, IT2006-46, 1997-6.2

### All traversals together
- A07.24 Q Which data structure a traversal uses; BFS vs DFS comparisons; traversal in a reversed graph. PYQ: DA2026-30, 2025s2-19, DA2025-55, DA2024-34, 2021s2-46, 2000-1.13

## A08 · Greedy
notes: algorithms/07-greedy
hours: 2.5

- A08.1 T Greedy-choice property and optimal substructure. A counterexample kills a greedy claim. Teaches: greedy
- A08.2 T Activity selection: earliest finish first.
- A08.3 T Interval partitioning: rooms = maximum overlap.
- A08.4 Q Rooms or activities from a timeline. PYQ: 2003-69
- A08.5 T Job sequencing with deadlines: sort by profit, take the latest free slot.
- A08.6 Q Which tasks are done and the total profit. PYQ: 2005-84b, 2005-84a
- A08.7 T Fractional knapsack by value/weight ratio is optimal.
- A08.8 T For 0/1 knapsack the same greedy can fail, so compute the gap.
- A08.9 Q Gap between greedy and optimal on a knapsack. PYQ: 2018-48
- A08.10 T Optimal merge pattern: always merge the two shortest.
- A08.11 T Record moves = `sum(a+b)`. Comparisons = `sum(a+b-1)`.
- A08.12 Q Minimum moves or comparisons in merging. PYQ: 2014s2-38, 1999-2.20
- A08.13 T Huffman: merge the two smallest frequencies. The code is prefix-free. Teaches: huffman
- A08.14 T Average length = `sum(freq × depth)`. Tie-breaking rules are given in the question.
- A08.15 Q Build codes, decode a string, average or total length. PYQ: 2021s2-26, 2017s2-50, 2007-77, 2007-76, IT2006-48, 1989-13a
- A08.16 L Greedy partition with a bound to prove; greedy independent set in a tree. PYQ: 1994-24, 1990-12b

## A09 · Minimum spanning trees
notes: algorithms/08-minimum-spanning-trees
hours: 4.5

### Properties
- A09.1 T A minimum spanning tree has the smallest total weight among spanning trees. Teaches: mst
- A09.2 T Cut property: the lightest edge across a cut is in some MST (every MST if unique).
- A09.3 T Cycle property: the unique heaviest edge of a cycle is in no MST.
- A09.4 T Distinct weights give a unique MST, which always contains the smallest and second smallest edges. The third smallest can be left out, when it closes a triangle.
- A09.5 T With repeated weights, every MST contains some minimum-weight edge, but no particular one is guaranteed.
- A09.6 Q True-or-false statements on MST edges. PYQ: 2026s1-39, 2022-39, 2021s2-1, 2017s1-26, 2016s1-40, 2007-49, IT2005-52, 2005-82a, 2000-2.18
- A09.7 T Adding a constant to every weight keeps every MST. Squaring weights above 1 keeps the MST, and its new weight is below the old weight squared.
- A09.8 T The path inside an MST is not a shortest path, but it is a minimum-bottleneck path.
- A09.9 Q Effect of changing weights; MST vs shortest paths. PYQ: 2025s2-27, 2025s1-8, 2016s1-14, 2015s3-40, 2012-29

### Kruskal and Prim
- A09.10 T Union-find: find and union over disjoint sets, with union by rank and path compression making each near constant. Teaches: unionfind
- A09.11 T Kruskal: sort the edges, use union-find, skip cycle edges. O(E log V). With edges sorted, near-linear. Teaches: kruskal
- A09.12 T Prim: grow from a vertex using the lightest edge out. O(E log V) with a heap, O(V²) with a matrix. Teaches: prim
- A09.13 T Negative weights are fine for both.
- A09.14 Q Which edge sequence is impossible under Kruskal or under Prim. PYQ: IT2008-45, 2009-38, 2006-47, IT2004-56
- A09.15 Q Complexity of MST algorithms and of updating an MST. PYQ: 2020-31, 1992-01.ix, 1991-03.vi

### Computing and counting
- A09.16 Q MST weight on a given graph or matrix, with a constraint such as a required leaf. PYQ: 2010-50, 2003-68, 2001-15
- A09.17 T Count MSTs: group equal-weight edges and count the valid choices per weight.
- A09.18 Q Number of distinct MSTs. PYQ: 2024s2-49, 2021s1-17, 2018-47, 2014s2-52, 1995-22
- A09.19 T Bounds from the cycle property: largest x such that an edge is in every MST; smallest total weight; maximum possible MST weight for a given multiset of weights.
- A09.20 Q Find the bound. PYQ: 2025s1-54, 2016s1-39, 2015s1-43
- A09.21 Q MST of a graph defined by a formula; path length inside it. PYQ: 2020-49, 2011-55, 2011-54, 2006-11, 2005-6, 1997-9, 1996-16
- A09.22 Q Rooted spanning arborescences counted directly. PYQ: 2022-48
- A09.23 Q Minimum-congestion path between two vertices. PYQ: 2005-82b

## A10 · Shortest paths: Dijkstra and DAGs
notes: algorithms/09-shortest-paths
hours: 3.5

### Dijkstra
- A10.1 T Relaxation and the triangle inequality: `d(v) ≤ d(u) + w(u,v)`. Teaches: relax
- A10.2 T Dijkstra: extract the minimum, finalise, relax. The order in which vertices are finalised. Teaches: dijkstra
- A10.3 T Θ((V+E) log V) with a binary heap, Θ(V²) with an array.
- A10.4 Q Order of finalisation; which path it reports among ties. PYQ: 2012-40, 2004-44, 1996-17
- A10.5 Q Complexity and data structure choices; unweighted graphs use a queue. PYQ: 2006-12, 2005-38
- A10.6 T Negative edges: Dijkstra can give wrong answers. Which vertices stay correct in a given graph.
- A10.7 Q Which distances are correct with a negative edge. PYQ: 2008-45
- A10.8 T Weight transformations: adding a constant can change shortest paths, `w'(u,v) = w(u,v) + f(u) - f(v)` never does.
- A10.9 Q Reasoning from distances and transformations; 0/1 weights; inferring edges. PYQ: 2020-40, DA2025-48, 2016s1-38, IT2007-3, 2003-67

### Shortest paths on a DAG
- A10.10 T Relax in topological order: Θ(V+E), also for negative weights. Longest or product scores work the same way.
- A10.11 Q DAG shortest-path cost; a score over paths in a DAG. PYQ: 2026s2-27, 2021s2-55

## A11 · Dynamic programming
notes: algorithms/10-dynamic-programming
hours: 4.5

### Method
- A11.1 T Overlapping subproblems and optimal substructure. Teaches: dp
- A11.2 T State, recurrence, base case, fill order, answer cell.
- A11.3 T Top-down memo vs bottom-up. DP vs greedy vs divide and conquer.
- A11.4 T Fill order must compute dependencies first: check it for a given recurrence, and how the table's dependencies determine time and space.
- A11.5 Q Is a given fill order correct; which table entries are needed. PYQ: 2026s2-29

### Sequence problems
- A11.6 T LCS: the `L[i][j]` recurrence, O(mn).
- A11.7 T Backtracking through the LCS table, and counting distinct LCSs.
- A11.8 Q Complete the LCS recurrence, fill order, length and count. PYQ: 2014s2-37, 2009-54, 2009-53
- A11.9 T LIS-style: length starting at each index.
- A11.10 T Weighted subsequences where the weight halves with position.
- A11.11 Q Monotone sequences and subsequence weights. PYQ: 2011-25, 2010-34

### Knapsack family
- A11.12 T 0/1 knapsack and subset sum: `X[i][j] = X[i-1][j] or X[i-1][j-a_i]`, O(nW), which is pseudo-polynomial. Which cell holds the answer.
- A11.13 Q Complete the subset-sum DP; which entry gives the answer. PYQ: 2008-81, 2008-80
- A11.14 T Rod cutting: `R(n) = max(p(i) + R(n-i))`.
- A11.15 Q Compute R and judge statements. PYQ: 2021s1-40

### Interval DP
- A11.16 T Matrix chain: `m[i][j] = min(m[i][k] + m[k+1][j] + p(i-1)p(k)p(j))`, Θ(n³) time, Θ(n²) space, filled by increasing length.
- A11.17 T The number of parenthesisations is Catalan.
- A11.18 Q Minimum multiplications; explicitly computed pairs. PYQ: 2018-31, 2016s2-38, 2011-38

### Path-style DP
- A11.19 T Shortest route with shortcuts on a number line; recurrences from a rule in the question.
- A11.20 Q Evaluate a recurrence defined by the problem. PYQ: 2014s3-37
- A11.21 N Fair game: coin change, edit distance, optimal BST, multistage graph, Fibonacci-style tilings. State and recurrence only.

## A12 · Dynamic programming on graphs
notes: algorithms/09-shortest-paths
hours: 2.5

- A12.1 T Bellman-Ford: V-1 rounds, relax all edges, Θ(VE). Teaches: bellman
- A12.2 T It is DP on path length: `d(v,k) = min(d(v,k-1), min d(u,k-1) + w(u,v))`.
- A12.3 T It finds negative cycles reachable from the source only.
- A12.4 Q Properties, cost on a complete graph, cheapest path using at most k edges. PYQ: 2026s1-31, 2013-19, 2010-51, 2009-13
- A12.5 T Floyd-Warshall: `D[i][j] = min(D[i][j], D[i][k] + D[k][j])`, k in the outer loop, Θ(V³), DP. Teaches: floyd
- A12.6 T Warshall for transitive closure uses OR and AND.
- A12.7 Q Paradigm; complete the template; trace reachability in a matrix. PYQ: 2016s2-14, 2003-70, 2002-12
- A12.8 Q Match graph algorithms to their complexities and to the problem. PYQ: 2007-41, IT2005-15, 1989-2.iii

## A13 · Design reasoning and off-syllabus awareness
notes: algorithms/11-algorithm-design
hours: 2.5

- A13.1 T Reading an unfamiliar problem: define what must be tracked, try a one-pass scan from either end, try "sort first", "hash it", "two pointers", "sliding window", and state the cost before writing anything.
- A13.2 Q Which paradigm each named algorithm uses. PYQ: 2017s1-05, 2015s2-36, 2015s1-6, 1998-1.21, 1997-1.5, 1995-1.5, 1994-1.19, 1990-2.vii
- A13.3 Q Match structures and algorithms to the job they suit; statements across topics. PYQ: DA2024-6, 1994-1.22, 1989-3.ixa
- A13.4 Q Best complexity for a stated geometric problem, using a sort. PYQ: IT2007-81
- A13.5 Q Linear scans: leaders, and the longest subarray with at most two distinct values. PYQ: 2024s2-32, 2006-17
- A13.6 Q Reduce to a known trick: prefix sums and hashing for equal-sum spans; weights as powers of 2. PYQ: 2014s1-37, 2006-54
- A13.7 L Descriptive designs from early papers, including a game-tree sketch. PYQ: 1992-8, 1988-6i
- A13.8 L Backtracking, branch and bound: recognise the names only.
- A13.9 L P, NP, NP-complete, NP-hard were removed from the syllabus: know the definitions in one line, nothing more. PYQ: 2013-18, 2012-4, 2009-14, 2006-31, 2005-58
