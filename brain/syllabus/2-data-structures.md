# Part 2 · Data Structures

Official GATE 2027 wording (Section 4): "Arrays, stacks, queues, linked lists, trees, binary search trees, binary heaps, graphs." Hashing is officially listed under Algorithms; it is taught here because it needs lists and arrays and GATE Overflow files its PYQs with both.

How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic to teach, in this order.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers).
PYQ ids are newest first. See `README.md` for the rules and `npm run syllabus` for the next step.

## D01 · Arrays and address calculation
notes: programming-ds/10-arrays
hours: 3

### What a data structure is
- D01.1 T ADT: a type defined by its operations, not its implementation.
- D01.2 Q Definition of an ADT; match a data structure to the job it suits. PYQ: DA2024-6, 2005-2

### Address formulas
- D01.3 T 1D: `base + (i-L)*size`. 2D row-major: `base + ((i-L1)*cols + (j-L2))*size`; column-major swaps the roles. Works with any lower bounds, including negative ones.
- D01.4 T n dimensions: in row-major the last index changes fastest. C arrays are always row-major.
- D01.5 Q Address of an element. PYQ: 2002-2.8, 1998-2.14
- D01.6 Q Row-major vs column-major access and running time. PYQ: 2004-39

### Compact matrix storage
- D01.7 T Lower triangular in row-major, 1-based (i,j): 0-based position `i(i-1)/2 + (j-1)`. Derive it by counting the rows above. Column-major, upper triangular and symmetric variants.
- D01.8 Q Index of an element in compact storage. PYQ: 1994-1.11
- D01.9 N Tridiagonal and banded matrices: count of elements (`3n-2`), index formula; sparse matrix triples.

### Arrays as direct-address tables
- D01.10 T Counting arrays for bounded keys; a constant-time set using arrays; the `p[]`/`q[]` lazy-initialisation trick.
- D01.11 Q Choose the array size, or complete a constant-time set. PYQ: 2005-5, 2000-15, 1992-09

### Array algorithms
- D01.12 T Two pointers on a sorted array, sliding window on positive values, double sums.
- D01.13 Q Linear-time pair sum, shortest subarray with a given sum, sum over a formula-defined matrix. PYQ: 2000-1.2, 1997-17, 1994-25
- D01.14 Q Young tableau and rows-and-columns-sorted matrices: delete, insert, and how many comparisons. PYQ: 2015s2-31, 1999-8, 1996-14

## D02 · Stacks
notes: programming-ds/11-stacks
hours: 3.5

### The structure
- D02.1 T LIFO; push, pop, top are O(1); array and linked implementations; overflow and underflow. Draw the LIFO state column.
- D02.2 Q Trace a sequence of operations or a stack-based program. PYQ: DA2025-54, 2015s2-38, 1991-03.vii
- D02.3 T Two stacks in one array grow from opposite ends: full when `top1 + 1 == top2`.
- D02.4 Q Stack-full condition. PYQ: 2004-3

### Stack permutations
- D02.5 T Which output orders are possible: for input 1..n the output cannot contain `k … i … j` with `i < j < k`. There are Catalan-many valid orders, `C(2n,n)/(n+1)`.
- D02.6 Q Which output order is impossible, including with two stacks. PYQ: 2024s2-38, IT2004-52, 1994-1.14

### Expressions
- D02.7 T Infix to postfix with an operator stack: precedence and associativity, right-associative `^`. Prefix versions.
- D02.8 Q Convert an expression; what is needed to do it. PYQ: 2004-38, 1998-19b, 1997-1.7, 1995-2.21, 1989-4.ii
- D02.9 T Evaluate postfix with an operand stack: the second pop is the left operand. One stack suffices.
- D02.10 Q Evaluate postfix or give the stack state at a moment; a C evaluator. PYQ: 2015s3-12, 2007-38, IT2007-32, 2002-2.19
- D02.11 T Balanced parentheses; recursion is an implicit stack.
- D02.12 Q Pick the right structure for parentheses. PYQ: 2004-5

### Augmented stacks
- D02.13 T Min-stack: store with each record a pointer to the minimum below it, so MIN is O(1) and push and pop stay O(1).
- D02.14 Q Which designs give O(1) MIN. PYQ: 2025s2-35
- D02.15 Q A stack with a REVERSE operation, and using it as a queue. PYQ: 2014s2-41, 2000-13
- D02.16 Q A function defined on stacks; average lifetime of an element. PYQ: IT2005-13, 2003-64

## D03 · Queues
notes: programming-ds/12-queues
hours: 3

### Array implementation
- D03.1 T FIFO; why a linear array wastes space; circular indices with `mod n`; one slot left empty: full is `(rear+1) mod n == front`, empty is `front == rear`.
- D03.2 Q Full and empty conditions; cost of array queues. PYQ: 2016s1-10, 2012-35, 1996-1.12

### Linked implementation
- D03.3 T Enqueue at the tail, dequeue at the head: both O(1). Reverse them and one becomes O(n). A circular list needs only a pointer to the rear.
- D03.4 Q Which end costs what, with one or two pointers. PYQ: 2018-3, 2017s2-13, 2004-36

### Variants
- D03.5 T Deque, and input-restricted and output-restricted deques.
- D03.6 Q Trace a deque. PYQ: DA2024-22
- D03.7 T Priority queue as an ADT: costs for unsorted array, sorted array, list, heap. Using it to simulate a stack or queue through the choice of keys.
- D03.8 Q Keys needed for a stack on a priority queue. PYQ: 1997-4.7

### Built from each other
- D03.9 T Queue from two stacks and stack from two queues: exact push and pop counts, best and worst case.
- D03.10 Q Count operations; how many stacks are needed. PYQ: 2006-49, 2001-2.16, 1994-26
- D03.11 Q Rearrange using only allowed operations and count the minimum; recursive queue routines. PYQ: 2022-52, IT2007-30
- D03.12 Q Stack and queue used together: trace or classify. PYQ: 2026s2-40, 2023-49, 2021s1-21, 2016s1-41
- D03.13 T Amortised cost by the aggregate method: an element is dequeued at most once.
- D03.14 Q Worst-case cost of a sequence with a multi-dequeue. PYQ: 2013-44

## D04 · Linked lists
notes: programming-ds/13-linked-lists
hours: 4

### Operations and their cost
- D04.1 T Singly, doubly and circular lists; head and tail pointers. Draw boxes and arrows.
- D04.2 T The cost table: insert or delete at head or tail, with or without a tail pointer, given a node pointer vs given a value; search; why binary search is pointless on a list.
- D04.3 Q Time of an operation or of a sequence of operations. PYQ: 2023-3, 2020-16, 2016s2-15, IT2004-13, 2004-40, 2002-1.5, 1997-1.4, 1995-2.22, 1994-1.17, 1987-1.xv
- D04.4 T Without the previous node: insert before or delete a node by copying data from its successor.
- D04.5 Q Constant-time insert or delete given only a pointer. PYQ: 1999-11b, 1993-13
- D04.6 T Reversal: iterative with 3 pointers (O(n) time, O(1) space) and recursive (O(n) stack).
- D04.7 Q Complexity of reversal. PYQ: 2022-5

### Reading list code
- D04.8 T Reading `p->next->next`: draw before and after each assignment. Common bugs: losing the head, dereferencing NULL, wrong loop end.
- D04.9 Q Trace code that rearranges, deletes or joins nodes. PYQ: 2025s1-52, 2017s1-08, 2008-62, IT2005-54, 1998-19a, 1997-18, 1987-6a
- D04.10 Q Complete or identify list functions, including recursive ones. PYQ: 2026s1-29, 2010-36, 2003-90

### Fair game
- D04.11 N Floyd's slow and fast pointers: detect a cycle, find the cycle start, find the middle. Merging two sorted lists.

## D05 · Binary trees: structure and counting
notes: programming-ds/14-binary-trees
hours: 4

### Words and definitions
- D05.1 T "Full", "complete", "perfect", "height" and "depth" change between books and even between GATE papers. Read the definition given in the question, every time.
- D05.2 Q Height when the term is defined in the question. PYQ: 2026s1-23

### Counting nodes
- D05.3 T With n0 leaves and n2 two-child nodes: `n0 = n2 + 1`, for any binary tree. Edges = n-1. Derive it from counting edges two ways.
- D05.4 Q Leaves vs two-child nodes; statements relating height and node counts. PYQ: 2025s2-3, DA2024-42, 2015s3-25, 2015s2-10, 2010-10, IT2006-9, 1999-12, 1995-1.17, 1993-16, 1987-2g
- D05.5 Q Counts when "degree" means neighbours; degree sum of a tree. PYQ: 2017s1-20, IT2008-77, IT2008-76
- D05.6 T Every internal node has k children: `L = (k-1)I + 1`.
- D05.7 Q Leaves of a k-ary tree, 2-3 trees. PYQ: 2007-43, 2005-36, 2002-2.9, 1998-2.11, 1994-5, 1992-02.vii

### Height bounds
- D05.8 T Height h (in edges): max nodes `2^(h+1)-1`, min nodes `h+1`. Min height for n nodes `ceil(log2(n+1))-1`.
- D05.9 Q Bounds, including trees balanced by size or weight. PYQ: 2015s1-25, 2007-12, IT2005-50, 2002-2.12, 1997-16

### Array storage
- D05.10 T 1-based: children 2i and 2i+1, parent floor(i/2). 0-based: children 2i+1 and 2i+2, parent floor((i-1)/2), level floor(log2(i+1)). A skewed tree needs `2^n - 1` slots.
- D05.11 Q Parent, level and worst-case array size. PYQ: IT2006-73, IT2006-71, 2006-13

### Counting shapes
- D05.12 T Unlabelled binary trees on n nodes: Catalan `C(2n,n)/(n+1)`. Labelled: Catalan × n!. Trees with one given traversal: Catalan.
- D05.13 Q How many trees exist; draw them for a given traversal. PYQ: 2007-13, 2002-6, 1995-6

### Paths and other representations
- D05.14 T Internal and external path length, `E = I + 2n`; weighted path length; distance between two leaves.
- D05.15 Q Path length and expected distance. PYQ: 2019-46, 1991-01.viii, 1990-3.iv
- D05.16 Q Nested-parenthesis notation for trees. PYQ: 2000-1.14

## D06 · Tree traversals and tree code
notes: programming-ds/14-binary-trees
hours: 4

### Traversals
- D06.1 T Preorder, inorder, postorder by recursion; level order with a queue. O(n) time, O(h) stack. Preorder is DFS, level order is BFS.
- D06.2 Q Give a traversal or compare them. PYQ: 2026s2-2, 2021s2-16, 2014s3-12, 2004-6, 2000-2.16, 1996-1.15, 1991-1.ix

### Rebuilding a tree
- D06.3 T Inorder + preorder or + postorder or + level order give a unique tree. Preorder + postorder only for trees where every node has 0 or 2 children. Method: the root splits the inorder.
- D06.4 Q Rebuild and report postorder, height or a child. PYQ: DA2026-15, 2018-20, IT2004-54, 2007-39, 1998-20, 1994-8, 1987-7b
- D06.5 Q Which pairs identify a tree uniquely; which sequence is which traversal. PYQ: DA2024-18, IT2008-46, 2004-35, 1998-1.24, 1994-1.22, 1989-3.ixa, 1987-2c

### Expression trees
- D06.6 T Expression tree from postfix; traversals give prefix, infix, postfix; a custom order such as "new-order".
- D06.7 Q Traverse an expression tree; choose leaf values to maximise a result. PYQ: 2016s2-36, 2014s2-39

### Recursive tree functions
- D06.8 T Reading a recursive function on a tree: base case, then what it returns for a leaf, a one-child node, a two-child node. Each node visited once means O(n).
- D06.9 Q What a tree function computes or prints; complete the height function. PYQ: 2023-37, 2014s3-41, 2012-47, 2007-46, 2004-43
- D06.10 Q Time to count subtrees of a given size. PYQ: 2014s1-12
- D06.11 N Threaded binary trees: what the threads point to; iterative inorder with a stack.

## D07 · Binary search trees
notes: programming-ds/15-binary-search-trees
hours: 4

### Operations
- D07.1 T The invariant; inorder gives sorted order. Search, insert, min, max, successor and predecessor. Use the range-narrowing bracket [L, R].
- D07.2 T Delete: no child, one child, two children (replace with inorder successor or predecessor).
- D07.3 Q Build from an insertion order; report height, lowest level, path length, subtree sizes, or delete a key. PYQ: 2025s2-25, 2015s3-13, 2004-4, 2003-19, 2001-14, 1996-2.14

### Traversal conversions
- D07.4 T Preorder alone fixes a BST: sorting it gives inorder. Then postorder follows, and all of this is possible in O(n).
- D07.5 Q Preorder or postorder to the other, or to inorder. PYQ: 2026s1-52, 2020-5, 2017s2-36, 2013-43, 2008-46, IT2005-55, 2005-33, 1997-4.5
- D07.6 Q Which sequences are valid inorders or which traversal they are. PYQ: 2015s1-10, IT2008-72

### Search paths
- D07.7 T A valid search sequence stays inside a shrinking range. Counting orders: keys below the target must appear in increasing order and keys above in decreasing order, so the count is a binomial coefficient.
- D07.8 Q Is this a valid search path; how many orders are possible. PYQ: IT2008-71, IT2007-29, IT2006-45, 1996-4

### Counting
- D07.9 T BSTs on n keys: Catalan, with `T(n) = sum T(k-1) T(n-k)`. One unlabelled shape has exactly one valid filling. Insertion orders giving a chosen shape or height.
- D07.10 Q Number of BSTs and number of insertion orders; which key was inserted first or third. PYQ: 2026s1-30, 2016s2-40, 2011-29, IT2008-73, IT2005-12, 2005-35, 2003-6

### Complexity and properties
- D07.11 T Costs: Θ(h), so O(n) worst and Θ(log n) if balanced. Range reporting takes Θ(log n + k).
- D07.12 Q Worst-case cost, min and max height, range queries. PYQ: 2020-41, 2017s1-6, 2015s1-23, 2014s3-39, 2013-7, 2012-5
- D07.13 Q Statement questions: what the key set determines, cheap operations, BST stored as a heap array, inorder successors, cost per node. PYQ: 2026s2-39, 2025s1-16, 2024s2-29, 2022-18, 2021s1-10, 2004-85, 2003-63

## D08 · AVL and other balanced trees
notes: programming-ds/16-avl-trees
hours: 2

- D08.1 T Balance factor in {-1, 0, 1}. Marking balance factors on a given tree.
- D08.2 T LL, RR, LR and RL rotations on insertion. Deletion may rebalance at every level on the path.
- D08.3 Q Mark factors, insert and rebalance, count the nodes that become unbalanced. PYQ: 1996-1.14, 1988-7iii, 1988-7ii, 1988-7i
- D08.4 T Minimum nodes: `N(h) = N(h-1) + N(h-2) + 1` with N(0)=1, N(1)=2, so 1, 2, 4, 7, 12, 20, 33… Height is Θ(log n).
- D08.5 Q Smallest AVL tree of a height; largest height for n nodes. PYQ: 2009-37, 1998-21
- D08.6 T All operations are Θ(log n) worst case, so m inserts cost m log(n+m).
- D08.7 Q Cost of many inserts; compare with a plain BST. PYQ: 2020-6, IT2008-12
- D08.8 L Merging height-balanced trees with data at the leaves: not repeated since. PYQ: 1990-13a

## D09 · Binary heaps and priority queues
notes: programming-ds/17-heaps
hours: 4

### Structure
- D09.1 T A heap is a complete binary tree stored level by level. 1-based: parent floor(i/2), children 2i and 2i+1, leaves from floor(n/2)+1 to n. Height floor(log2 n). Draw the array-to-tree level map.
- D09.2 Q Parent index, height, which indices are leaves. PYQ: 2026s1-13, 2025s1-25, 2001-1.15
- D09.3 T Test whether an array is a heap: check each parent against its children.
- D09.4 Q Which array or tree is a heap. PYQ: 2023-2, 2011-23, 2009-59, IT2006-44

### Insert and delete
- D09.5 T Insert at the end and sift up: O(log n), and the swap count is at most the height. Binary search on the path cuts comparisons, not swaps.
- D09.6 Q Heap after a sequence of inserts. PYQ: 2015s1-32, 2014s2-12, 2005-34, 2004-37
- D09.7 Q Comparisons with binary search on the insertion path. PYQ: 2007-47
- D09.8 T Delete the root: move the last element up and sift down, with up to 2 comparisons per level. Deleting an arbitrary index: sift up or down, O(log n).
- D09.9 Q Heap after deletes; time to delete at index i; priority queue operation costs. PYQ: 2023-36, 2016s1-37, 2009-60

### Building
- D09.10 T Bottom-up build-heap is Θ(n): most nodes are near the bottom. n inserts one by one are Θ(n log n). Do not mix the two.
- D09.11 Q Build trace and minimum interchanges to reach a heap. PYQ: 2024s1-31, 2015s3-19, IT2004-53, 1996-2.11
- D09.12 Q Cost when only part of the tree breaks the rule, or when many elements are added at once. PYQ: 2015s2-17, 2008-47, IT2006-72

### Searching a heap
- D09.13 T The max of a min-heap is in the leaves: `ceil(n/2)` candidates, `ceil(n/2)-1` comparisons, Θ(n). The k-th smallest for a constant k takes constant time. Finding a given value is O(n).
- D09.14 Q Find the opposite extreme, or the k-th element. PYQ: 2021s2-2, 2020-47, 2006-10, 2003-23
- D09.15 Q Statement questions connecting heaps and BSTs. PYQ: 2019-40
- D09.16 Q Cost of merging or melding structures. PYQ: 2025s2-28

### Counting and positions
- D09.17 T Where a value can sit: a key with rank r has at most r-1 ancestors, so its depth is at most r-1 and at most the height. Counting heaps by recursion: `C(n-1, left size) × H(left) × H(right)`.
- D09.18 Q Maximum depth or possible positions of a value; number of distinct heaps. PYQ: 2024s1-33, 2018-46, 2016s2-34

### Variants
- D09.19 T d-ary heap in an array: children `d*i+1 … d*i+d` (0-based), parent floor((i-1)/d), height log_d n, delete costs d comparisons per level.
- D09.20 Q 3-ary heap checks and operations. PYQ: 2006-77, 2006-76
- D09.21 Q Older trace-and-delete on a heap drawn as a tree. PYQ: 1991-14.c, 1991-14.b, 1991-14.a

## D10 · Hashing
notes: programming-ds/18-hashing
hours: 3.5

### Ideas
- D10.1 T Hash table vs direct address; hash functions: division, multiplication, universal. Load factor `α = n/m` (can exceed 1 with chaining).
- D10.2 Q Basic properties; load factor; which hash function spreads keys best; which beats an adversary. PYQ: 2023-10, 2015s3-17, 2015s2-33, IT2006-20, 1996-1.13

### Chaining
- D10.3 T Each slot holds a list: insert O(1), search O(1+α) expected, Θ(n) worst case when all keys collide.
- D10.4 Q Chain lengths after inserting keys; which keys collide; worst case. PYQ: 2026s2-20, 2014s1-40, 2004-7, 1990-13b

### Open addressing
- D10.5 T Linear probing `(h(k)+i) mod m`: primary clustering. Quadratic: secondary clustering. Double hashing: `(h1(k) + i*h2(k)) mod m`. Deletes need tombstones.
- D10.6 Q Final table, position of a key, or empty slots under linear probing. PYQ: 2026s1-14, DA2025-8, IT2008-48, 2009-36, 2007-40, IT2005-16, 1996-15
- D10.7 Q Maximum comparisons for an absent key. PYQ: 1989-1.vii
- D10.8 T Reverse reasoning: a key sitting away from its home slot was inserted after every key in between. Count the valid insertion orders from that.
- D10.9 Q Possible insertion orders and how many of them produce a table. PYQ: 2010-53, 2010-52
- D10.10 Q Double hashing probes. PYQ: 2025s1-55, 2020-23

### Probability
- D10.11 T Simple uniform hashing: each key lands in any slot with probability 1/m; expected keys per slot `n/m`. Open addressing expected probes: unsuccessful at most `1/(1-α)`, successful at most `(1/α) ln(1/(1-α))`.
- D10.12 Q Probability of a collision or of empty slots; expected probes. PYQ: DA2024-11, 2022-6, 2014s3-40, IT2007-28, 1997-12

### Dynamic hashing
- D10.13 Q Dynamic and extendible schemes defined inside the question. PYQ: 2021s1-47
- D10.14 Q Match the construction cost of a heap, a hash table and an AVL tree. PYQ: 1990-2.viii

## D11 · Graphs: representation and vocabulary
notes: programming-ds/19-graphs
hours: 1.5

- D11.1 T Directed and undirected, weighted, simple, connected, DAG, sparse and dense. Degree sum is 2E; a tree has V-1 edges.
- D11.2 T Adjacency matrix vs adjacency list: space, edge test, iterate neighbours, and the cost of matrix-based traversal being Θ(V²).
- D11.3 Q Costs on a given representation, such as twin pointers in adjacency lists. PYQ: 2016s2-41
- D11.4 Q Find a universal sink from an adjacency matrix in O(n): one comparison removes one candidate. PYQ: IT2005-84b, IT2005-84a
- D11.5 Q Graph property reasoning that uses only these definitions. PYQ: 2004-81
- D11.6 L Pure graph theory filed here in old papers (full treatment is in Discrete Maths): independent sets, edge-disjoint spanning trees. PYQ: 2008-42, IT2008-4
