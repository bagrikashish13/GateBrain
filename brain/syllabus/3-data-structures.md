# Part 3 · Data Structures

Official GATE 2027 wording (Section 4): "Arrays, stacks, queues, linked lists, trees, binary search trees, binary heaps, graphs." Hashing is officially listed under Algorithms. It is taught here because it needs lists and arrays and GATE Overflow files its PYQs with both.

How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic to teach, in this order. Nothing here uses an idea before the line that teaches it: `npm run check:syllabus` proves it.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers or other languages). `Teaches:` names the concepts a line introduces (`concepts.json`).
PYQ ids are newest first. See `README.md` for the rules and `npm run syllabus` for the next step.

## D01 · Arrays and address calculation
notes: programming-ds/10-arrays
hours: 3

### What a data structure is
- D01.1 T ADT: a type defined by its operations, not its implementation. Teaches: adt
- D01.2 Q Definition of an ADT. PYQ: 2005-2

### Address formulas
- D01.3 T 1D: `base + (i-L)*size`, for any lower bound, including a negative one.
- D01.4 T 2D row-major: `base + ((i-L1)*cols + (j-L2))*size`.
- D01.5 T 2D column-major: swap the roles of rows and columns.
- D01.6 T n dimensions: in row-major the last index changes fastest. C arrays are always row-major.
- D01.7 Q Address of an element. PYQ: 2002-2.8, 1998-2.14
- D01.8 Q Row-major vs column-major access and running time. PYQ: 2004-39

### Compact matrix storage
- D01.9 T Lower triangular in row-major, 1-based (i,j): 0-based position `i(i-1)/2 + (j-1)`. Derive it by counting the rows above.
- D01.10 T Column-major, upper triangular and symmetric variants.
- D01.11 Q Index of an element in compact storage. PYQ: 1994-1.11
- D01.12 N Tridiagonal and banded matrices: count of elements (`3n-2`), index formula. Sparse matrix triples.

### Arrays as direct-address tables
- D01.13 T Counting arrays for bounded keys.
- D01.14 T A constant-time set using arrays: the `p[]`/`q[]` lazy-initialisation trick.
- D01.15 Q Choose the array size, or complete a constant-time set. PYQ: 2005-5, 2000-15, 1992-09

### Array algorithms
- D01.16 T Two pointers on a sorted array.
- D01.17 T Sliding window on positive values.
- D01.18 T Double sums over a formula-defined matrix.
- D01.19 Q Linear-time pair sum, shortest subarray with a given sum, sum over a formula-defined matrix. PYQ: 2000-1.2, 1997-17, 1994-25
- D01.20 Q Young tableau and rows-and-columns-sorted matrices: delete, insert, and how many comparisons. PYQ: 2015s2-31, 1996-14

## D02 · Linked lists
notes: programming-ds/13-linked-lists
hours: 4

### Kinds of list
- D02.1 T A singly linked list: nodes holding a value and `next`, a head pointer, and NULL at the end. Draw boxes and arrows. Teaches: list
- D02.2 T Doubly linked and circular lists; tail pointers.

### Operations and their cost
- D02.3 T The cost table: insert or delete at head or tail, with or without a tail pointer.
- D02.4 T Given a node pointer vs given a value. Search is O(n).
- D02.5 T Why binary search is pointless on a list: there is no random access.
- D02.6 Q Time of an operation or of a sequence of operations. PYQ: 2023-3, 2020-16, 2016s2-15, IT2004-13, 2004-40, 2002-1.5, 1997-1.4, 1987-1.xv
- D02.7 Q Which inputs allow binary search in logarithmic time. PYQ: DA2025-17
- D02.8 T Without the previous node: insert before or delete a node by copying data from its successor.
- D02.9 Q Constant-time insert or delete given only a pointer. PYQ: 1999-11b, 1993-13
- D02.10 T Reversal, iterative: 3 pointers, O(n) time, O(1) space.
- D02.11 T Reversal, recursive: O(n) stack.
- D02.12 Q Complexity of reversal. PYQ: 2022-5

### Reading list code
- D02.13 T Reading `p->next->next`: draw before and after each assignment.
- D02.14 T Common bugs: losing the head, dereferencing NULL, the wrong loop end.
- D02.15 Q Trace code that rearranges, deletes or joins nodes. PYQ: 2025s1-52, 2017s1-08, 2008-62, IT2005-54, 1998-19a, 1997-18, 1987-6a
- D02.16 Q Complete or identify list functions, including recursive ones. PYQ: 2026s1-29, 2010-36, 2003-90

### Fair game
- D02.17 N Slow and fast pointers: detect a cycle, find the cycle start, find the middle.
- D02.18 N Merging two sorted lists.

## D03 · Stacks
notes: programming-ds/11-stacks
hours: 3.5

### The structure
- D03.1 T LIFO: push, pop and top are O(1); overflow and underflow. Draw the LIFO state column. Teaches: stack
- D03.2 T Array implementation and list implementation.
- D03.3 Q Trace a sequence of operations or a stack-based program. PYQ: DA2025-54, 2015s2-38, 1991-03.vii
- D03.4 T Two stacks in one array grow from opposite ends: full when `top1 + 1 == top2`.
- D03.5 Q Stack-full condition. PYQ: 2004-3

### Stack permutations
- D03.6 T Which output orders are possible: for input 1..n the output cannot contain `k … i … j` with `i < j < k`.
- D03.7 T There are Catalan-many valid orders: `C(2n,n)/(n+1)`. Teaches: catalan
- D03.8 Q Which output order is impossible, including with two stacks. PYQ: 2024s2-38, IT2004-52, 1994-1.14

### Expressions
- D03.9 T Infix to postfix with an operator stack: precedence and associativity, right-associative `^`.
- D03.10 T Prefix versions of the same method.
- D03.11 Q Convert an expression; what is needed to do it. PYQ: 2004-38, 1998-19b, 1997-1.7, 1995-2.21, 1989-4.ii
- D03.12 T Evaluate postfix with an operand stack: the second pop is the left operand. One stack suffices.
- D03.13 Q Evaluate postfix or give the stack state at a moment; a C evaluator. PYQ: 2015s3-12, 2007-38, IT2007-32, 2002-2.19
- D03.14 T Balanced parentheses with a stack. Recursion is an implicit stack.

### Augmented stacks
- D03.15 T Min-stack: store with each record a pointer to the minimum below it, so MIN is O(1) and push and pop stay O(1).
- D03.16 Q A function defined on stacks; average lifetime of an element. PYQ: IT2005-13, 2003-64

## D04 · Queues
notes: programming-ds/12-queues
hours: 3

### Array implementation
- D04.1 T FIFO: enqueue at the rear, dequeue at the front. Teaches: queue
- D04.2 T Why a linear array wastes space, and circular indices with `mod n`.
- D04.3 T One slot left empty: full is `(rear+1) mod n == front`, empty is `front == rear`.
- D04.4 Q Full and empty conditions; cost of array queues. PYQ: 2016s1-10, 2012-35, 1996-1.12

### Linked implementation
- D04.5 T Enqueue at the tail, dequeue at the head: both O(1). Reverse them and one becomes O(n).
- D04.6 T A circular list needs only a pointer to the rear.
- D04.7 Q Which end costs what, with one or two pointers. PYQ: 2018-3, 2017s2-13, 2004-36

### Variants
- D04.8 T Deque, and input-restricted and output-restricted deques. Teaches: deque
- D04.9 Q Trace a deque. PYQ: DA2024-22
- D04.10 T Priority queue as an ADT: insert, and remove the largest. Costs for an unsorted array, a sorted array and a list. A better structure comes later. Teaches: pq
- D04.11 T Using a priority queue to simulate a stack or a queue through the choice of keys.
- D04.12 Q Keys needed for a stack on a priority queue. PYQ: 1997-4.7

### Built from each other
- D04.13 T Queue from two stacks: exact push and pop counts, best and worst case.
- D04.14 T Stack from two queues: exact counts.
- D04.15 Q Count operations; how many stacks are needed. PYQ: 2006-49, 2001-2.16, 1994-26
- D04.16 Q A stack with a REVERSE operation, and using it as a queue. PYQ: 2014s2-41, 2000-13
- D04.17 Q Rearrange using only allowed operations and count the minimum; recursive queue routines. PYQ: 2022-52, IT2007-30
- D04.18 Q Stack and queue used together: trace or classify. PYQ: 2026s2-40, 2023-49, 2021s1-21, 2016s1-41
- D04.19 Q Pick the right structure for parentheses. PYQ: 2004-5
- D04.20 T Amortised cost by the aggregate method: an element is dequeued at most once. Teaches: amortised
- D04.21 Q Worst-case cost of a sequence with a multi-dequeue. PYQ: 2013-44

## D05 · Binary trees: structure and counting
notes: programming-ds/14-binary-trees
hours: 4

### Words and definitions
- D05.1 T A binary tree: root, left and right child, leaf, subtree, height, depth. Teaches: tree
- D05.2 T "Full", "complete", "perfect", "height" and "depth" change between books and even between GATE papers. Read the definition given in the question, every time.
- D05.3 Q Height when the term is defined in the question. PYQ: 2026s1-23

### Counting nodes
- D05.4 T With n0 leaves and n2 two-child nodes: `n0 = n2 + 1`, for any binary tree. Edges = n-1. Derive it by counting edges two ways.
- D05.5 Q Leaves vs two-child nodes; statements relating height and node counts. PYQ: 2025s2-3, DA2024-42, 2015s3-25, 2015s2-10, 2010-10, IT2006-9, 1995-1.17, 1993-16, 1987-2g
- D05.6 Q Counts when "degree" means neighbours; degree sum of a tree. PYQ: 2017s1-20, IT2008-77, IT2008-76
- D05.7 T Every internal node has k children: `L = (k-1)I + 1`.
- D05.8 Q Leaves of a k-ary tree, 2-3 trees. PYQ: 2007-43, 2005-36, 2002-2.9, 1998-2.11, 1994-5, 1992-02.vii

### Height bounds
- D05.9 T Height h (in edges): max nodes `2^(h+1)-1`, min nodes `h+1`.
- D05.10 T Min height for n nodes: `ceil(log2(n+1))-1`.
- D05.11 Q Bounds, including trees balanced by size or weight. PYQ: 2015s1-25, 2007-12, IT2005-50, 2002-2.12, 1997-16

### Array storage
- D05.12 T 1-based: children 2i and 2i+1, parent floor(i/2).
- D05.13 T 0-based: children 2i+1 and 2i+2, parent floor((i-1)/2), level floor(log2(i+1)).
- D05.14 T A skewed tree needs `2^n - 1` slots.
- D05.15 Q Parent, level and worst-case array size. PYQ: IT2006-73, IT2006-71, 2006-13

### Counting shapes
- D05.16 T Unlabelled binary trees on n nodes: Catalan. Labelled: Catalan × n!.
- D05.17 Q How many trees exist. PYQ: 2007-13

### Paths and other representations
- D05.18 T Internal and external path length: `E = I + 2n`.
- D05.19 T Weighted path length; distance between two leaves.
- D05.20 Q Path length and expected distance. PYQ: 2019-46, 1991-01.viii, 1990-3.iv
- D05.21 Q Nested-parenthesis notation for trees. PYQ: 2000-1.14

## D06 · Tree traversals and tree code
notes: programming-ds/14-binary-trees
hours: 4

### Traversals
- D06.1 T Preorder, inorder, postorder by recursion. Teaches: traversal
- D06.2 T Level order with a queue.
- D06.3 T Costs: O(n) time, O(h) stack.
- D06.4 Q Give a traversal or compare them. PYQ: 2026s2-2, 2014s3-12, 2000-2.16, 1996-1.15, 1991-1.ix
- D06.5 Q Procedure calls and returns as walks of the activation tree. PYQ: 2021s1-4
- D06.6 T Trees having one given traversal: there are Catalan-many.
- D06.7 Q Draw the trees for a given traversal. PYQ: 2002-6, 1995-6

### Rebuilding a tree
- D06.8 T Inorder + preorder, or + postorder, or + level order give a unique tree. Method: the root splits the inorder.
- D06.9 T Preorder + postorder works only for trees where every node has 0 or 2 children.
- D06.10 Q Rebuild and report postorder, height or a child. PYQ: DA2026-15, 2018-20, IT2004-54, 2007-39, 1998-20, 1994-8, 1987-7b
- D06.11 Q Which pairs identify a tree uniquely; which sequence is which traversal. PYQ: DA2024-18, IT2008-46, 2004-35, 1998-1.24, 1987-2c

### Expression trees
- D06.12 T Expression tree from postfix; traversals give prefix, infix, postfix.
- D06.13 T A custom order such as "new-order".
- D06.14 Q Traverse an expression tree; choose leaf values to maximise a result. PYQ: 2016s2-36, 2014s2-39

### Recursive tree functions
- D06.15 T Reading a recursive function on a tree: base case, then what it returns for a leaf, a one-child node, a two-child node. Each node visited once means O(n).
- D06.16 Q What a tree function computes or prints; complete the height function. PYQ: 2023-37, 2014s3-41, 2012-47, 2007-46, 2004-43
- D06.17 Q Time to count subtrees of a given size. PYQ: 2014s1-12
- D06.18 N Threaded binary trees: what the threads point to. Iterative inorder with a stack.

## D07 · Binary search trees
notes: programming-ds/15-binary-search-trees
hours: 4

### Operations
- D07.1 T The invariant: smaller keys left, larger keys right, so inorder gives sorted order. Teaches: bst
- D07.2 T Search, insert, min and max. Use the range-narrowing bracket [L, R].
- D07.3 T Successor and predecessor.
- D07.4 T Delete: no child, one child, two children (replace with inorder successor or predecessor).
- D07.5 Q Build from an insertion order; report height, lowest level, path length, subtree sizes, or delete a key. PYQ: 2025s2-25, 2015s3-13, 2004-4, 2003-19, 2001-14, 1996-2.14

### Traversal conversions
- D07.6 T Preorder alone fixes a BST: sorting it gives inorder, then postorder follows.
- D07.7 T All of this is possible in O(n).
- D07.8 Q Preorder or postorder to the other, or to inorder. PYQ: 2026s1-52, 2020-5, 2017s2-36, 2013-43, 2008-46, IT2005-55, 2005-33, 1997-4.5
- D07.9 Q Which sequences are valid inorders or which traversal they are. PYQ: 2015s1-10, IT2008-72

### Search paths
- D07.10 T A valid search sequence stays inside a shrinking range.
- D07.11 T Counting orders: keys below the target must appear in increasing order and keys above in decreasing order, so the count is a binomial coefficient.
- D07.12 Q Is this a valid search path; how many orders are possible. PYQ: IT2008-71, IT2007-29, IT2006-45, 1996-4

### Counting
- D07.13 T BSTs on n keys: Catalan, with `T(n) = sum T(k-1) T(n-k)`.
- D07.14 T One unlabelled shape has exactly one valid filling. Insertion orders giving a chosen shape or height.
- D07.15 Q Number of BSTs and number of insertion orders; which key was inserted first or third. PYQ: 2026s1-30, 2016s2-40, 2011-29, IT2008-73, IT2005-12, 2005-35, 2003-6

### Complexity and properties
- D07.16 T Costs are Θ(h), so O(n) worst and Θ(log n) if balanced.
- D07.17 T Range reporting takes Θ(log n + k).
- D07.18 Q Worst-case cost, min and max height, range queries. PYQ: 2020-41, 2017s1-6, 2015s1-23, 2014s3-39, 2013-7, 2012-5
- D07.19 Q Statement questions: what the key set determines, cheap operations, inorder successors, cost per node. PYQ: 2026s2-39, 2024s2-29, 2021s1-10, 2004-85

## D08 · AVL and other balanced trees
notes: programming-ds/16-avl-trees
hours: 2

- D08.1 T Balance factor in {-1, 0, 1}. Marking balance factors on a given tree. Teaches: avl
- D08.2 T LL and RR rotations on insertion.
- D08.3 T LR and RL rotations on insertion.
- D08.4 T Deletion may rebalance at every level on the path.
- D08.5 Q Mark factors, insert and rebalance, count the nodes that become unbalanced. PYQ: 1996-1.14, 1988-7iii, 1988-7ii, 1988-7i
- D08.6 T Minimum nodes: `N(h) = N(h-1) + N(h-2) + 1` with N(0)=1, N(1)=2, so 1, 2, 4, 7, 12, 20, 33… Height is Θ(log n).
- D08.7 Q Smallest AVL tree of a height; largest height for n nodes. PYQ: 2009-37, 1998-21
- D08.8 T All operations are Θ(log n) worst case, so m inserts cost m log(n+m).
- D08.9 Q Cost of many inserts; compare with a plain BST. PYQ: 2020-6, IT2008-12
- D08.10 L Merging height-balanced trees with data at the leaves: not repeated since. PYQ: 1990-13a

## D09 · Binary heaps and priority queues
notes: programming-ds/17-heaps
hours: 4.5

### Structure
- D09.1 T A heap is a complete binary tree stored level by level: every parent is at least its children (max-heap) or at most (min-heap). Teaches: heap
- D09.2 T 1-based: parent floor(i/2), children 2i and 2i+1, leaves from floor(n/2)+1 to n. Height floor(log2 n). Draw the array-to-tree level map.
- D09.3 Q Parent index, height, which indices are leaves. PYQ: 2026s1-13, 2025s1-25, 2001-1.15
- D09.4 T Test whether an array is a heap: check each parent against its children.
- D09.5 Q Which array or tree is a heap. PYQ: 2023-2, 2011-23, 2009-59, IT2006-44

### Insert and delete
- D09.6 T Insert at the end and sift up: O(log n), and the swap count is at most the height.
- D09.7 T Binary search on the insertion path cuts comparisons, not swaps.
- D09.8 Q Heap after a sequence of inserts. PYQ: 2015s1-32, 2014s2-12, 2005-34, 2004-37
- D09.9 Q Comparisons with binary search on the insertion path. PYQ: 2007-47
- D09.10 T Delete the root: move the last element up and sift down, with up to 2 comparisons per level.
- D09.11 T Delete at an arbitrary index: sift up or down, O(log n).
- D09.12 Q Heap after deletes; time to delete at index i; priority queue operation costs. PYQ: 2023-36, 2016s1-37, 2009-60

### Heaps as priority queues
- D09.13 T A heap gives insert and delete-max in O(log n), against the array and list costs from the queues unit.
- D09.14 Q Best structure for a mix of operations. PYQ: 2015s1-40
- D09.15 Q Which designs give O(1) MIN on a stack, compared with keeping a heap. PYQ: 2025s2-35

### Building
- D09.16 T Bottom-up build-heap is Θ(n): most nodes are near the bottom.
- D09.17 T n inserts one by one are Θ(n log n). Do not mix the two.
- D09.18 Q Build trace and minimum interchanges to reach a heap. PYQ: 2024s1-31, 2015s3-19, IT2004-53, 1996-2.11
- D09.19 Q Cost when only part of the tree breaks the rule, or when many elements are added at once. PYQ: 2015s2-17, 2008-47, IT2006-72

### Searching a heap
- D09.20 T The max of a min-heap is in the leaves: `ceil(n/2)` candidates, `ceil(n/2)-1` comparisons, Θ(n).
- D09.21 T The k-th smallest for a constant k takes constant time. Finding a given value is O(n).
- D09.22 Q Find the opposite extreme, or the k-th element. PYQ: 2021s2-2, 2020-47, 2006-10, 2003-23
- D09.23 Q Statement questions connecting heaps and BSTs; a BST stored as a heap array. PYQ: 2025s1-16, 2022-18, 2019-40, 2003-63
- D09.24 Q Cost of merging or melding structures. PYQ: 2025s2-28

### Counting and positions
- D09.25 T Where a value can sit: a key with rank r has at most r-1 ancestors, so its depth is at most r-1 and at most the height.
- D09.26 T Counting heaps by recursion: `C(n-1, left size) × H(left) × H(right)`.
- D09.27 Q Maximum depth or possible positions of a value; number of distinct heaps. PYQ: 2024s1-33, 2018-46, 2016s2-34

### Variants
- D09.28 T d-ary heap in an array: children `d*i+1 … d*i+d` (0-based), parent floor((i-1)/d), height log_d n, delete costs d comparisons per level.
- D09.29 Q 3-ary heap checks and operations. PYQ: 2006-77, 2006-76
- D09.30 Q Older trace-and-delete on a heap drawn as a tree. PYQ: 1999-12, 1991-14.c, 1991-14.b, 1991-14.a

## D10 · Hashing
notes: programming-ds/18-hashing
hours: 3.5

### Ideas
- D10.1 T Hash table vs direct address. A hash function maps a key to a slot. Teaches: hash
- D10.2 T Hash functions: division, multiplication, universal.
- D10.3 T Load factor `α = n/m`, which can exceed 1 with chaining.
- D10.4 Q Basic properties; load factor; which hash function spreads keys best; which beats an adversary. PYQ: 2023-10, 2015s3-17, 2015s2-33, IT2006-20, 1996-1.13

### Chaining
- D10.5 T Each slot holds a list: insert O(1), search O(1+α) expected, Θ(n) worst case when all keys collide.
- D10.6 Q Chain lengths after inserting keys; which keys collide; worst case. PYQ: 2026s2-20, 2014s1-40, 2004-7, 1990-13b

### Open addressing
- D10.7 T Linear probing `(h(k)+i) mod m`: primary clustering.
- D10.8 T Quadratic probing: secondary clustering.
- D10.9 T Double hashing: `(h1(k) + i*h2(k)) mod m`.
- D10.10 T Deletes need tombstones.
- D10.11 Q Final table, position of a key, or empty slots under linear probing. PYQ: 2026s1-14, DA2025-8, IT2008-48, 2009-36, 2007-40, IT2005-16, 1996-15
- D10.12 Q Maximum comparisons for an absent key. PYQ: 1989-1.vii
- D10.13 T Reverse reasoning: a key sitting away from its home slot was inserted after every key in between. Count the valid insertion orders from that.
- D10.14 Q Possible insertion orders and how many of them produce a table. PYQ: 2010-53, 2010-52
- D10.15 Q Double hashing probes. PYQ: 2025s1-55, 2020-23

### Probability
- D10.16 T Simple uniform hashing: each key lands in any slot with probability 1/m, so expected keys per slot is `n/m`.
- D10.17 T Open addressing expected probes: unsuccessful at most `1/(1-α)`, successful at most `(1/α) ln(1/(1-α))`.
- D10.18 Q Probability of a collision or of empty slots; expected probes. PYQ: DA2024-11, 2022-6, 2014s3-40, IT2007-28, 1997-12

### Dynamic hashing and comparisons
- D10.19 Q Dynamic and extendible schemes defined inside the question. PYQ: 2021s1-47
- D10.20 Q Match the construction cost of a heap, a hash table and an AVL tree. PYQ: 1990-2.viii

## D11 · Graphs: representation and vocabulary
notes: programming-ds/19-graphs
hours: 2

### Vocabulary
- D11.1 T Vertices and edges; directed and undirected, weighted, simple, connected. Teaches: graph
- D11.2 T A DAG has no directed cycle. Sparse and dense graphs.
- D11.3 T Degree sum is 2E. A tree has V-1 edges.
- D11.4 T A spanning tree connects all vertices using V-1 edges. Teaches: spanning
- D11.5 T A shortest path has the minimum total weight among all paths between two vertices. This is the definition; the algorithms come later. Teaches: shortest

### Representation
- D11.6 T Adjacency matrix: Θ(V²) space, O(1) edge test, Θ(V) to list neighbours.
- D11.7 T Adjacency list: Θ(V+E) space, degree-time edge test, degree-time neighbours.
- D11.8 Q Costs on a given representation, such as twin pointers in adjacency lists. PYQ: 2016s2-41
- D11.9 Q Find a universal sink from an adjacency matrix in O(n): one comparison removes one candidate. PYQ: IT2005-84b, IT2005-84a
- D11.10 L Pure graph theory filed here in old papers (full treatment is in Discrete Maths): independent sets, edge-disjoint spanning trees. PYQ: 2008-42, IT2008-4
