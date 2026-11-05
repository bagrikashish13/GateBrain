# Data Structures Master Plan (GATE CSE)

**Target:** 100% accuracy on all GATE Data Structures questions with $\le 1$ minute solve time per question.  
**Mode:** Chat-only interactive micro-lessons. Zero long paragraphs; bite-sized 3–5 line explanations with interactive checks.  
**Timeline:** 8-Day Master Sprint.

---

## 1. Operating Rules for Agents in Any Chat

1. **Step-by-Step Micro-Chunks (Never all at once):**
   - Teach in tiny, bite-sized pieces (3–5 lines max).
   - End each step with an interactive check or question for her.
   - Advance to the next concept only after she confirms it has clicked.
2. **Never Skip Basics or Assume Prior Mastery:**
   - Build intuition from absolute zero with visual diagrams and clear rules.
3. **MANDATORY REAL-TIME TRACING TEMPLATES:**
   - Whenever a topic involves **Arrays/Matrices**, draw the *Row/Col-Major Coordinate Map*.
   - Whenever a topic involves **Stacks/Queues**, draw the *LIFO/FIFO Visual State Stack/Buffer*.
   - Whenever a topic involves **Trees/BST**, draw the *Inorder Split Bracket* and *Range Narrowing Bracket $[L, R]$*.
   - Whenever a topic involves **Heaps**, draw the *Array-to-Tree Level Map*.

---

## 2. The 8-Day Schedule

| Day | Focus Area | Core Concepts Covered |
| :--- | :--- | :--- |
| **Day 1** | **Arrays & Matrix Mapping** | 1D/2D/3D Row & Col Major address calculation with arbitrary bounds $[L_i \dots U_i]$; Lower/Upper Triangular & Tridiagonal 1D mapping formulas. |
| **Day 2** | **Stacks & Queues** | Stack push/pop, Infix $\leftrightarrow$ Postfix $\leftrightarrow$ Prefix, Catalan stack permutations; Circular Queue index arithmetic (`front`, `rear`, boundary conditions), Deque, Queue via 2 Stacks. |
| **Day 3** | **Linked Lists** | Singly, Doubly, Circular Linked Lists; pointer operations (reversal, merge); Floyd's cycle detection (tortoise-hare); C pointer code snippet tracing. |
| **Day 4** | **Binary Trees** | Properties ($L = I_2 + 1$, height vs node bounds); Inorder, Preorder, Postorder traversals; Unique tree reconstruction from traversal pairs. |
| **Day 5** | **Binary Search Trees (BST)** | BST properties, Inorder sorted property; Search, Insert, Delete (predecessor/successor); Range-narrowing $[L, R]$ search sequence check. |
| **Day 6** | **AVL Trees** | Balance Factor ($BF \in \{-1, 0, 1\}$); LL, RR, LR, RL rotations; Min nodes for height $h$: $N(h) = N(h-1) + N(h-2) + 1$. |
| **Day 7** | **Heaps (Priority Queues)** | Min/Max Heap array representation ($2i, 2i+1, \lfloor i/2 \rfloor$); $O(n)$ bottom-up `Build-Heap`; Insert, Extract-Max, finding min in max-heap. |
| **Day 8** | **Hashing & Speed Drills** | Separate Chaining vs Open Addressing (Linear, Quadratic, Double Hashing); Primary & Secondary clustering; Probe count calculations; Mixed GATE PYQ speed drill. |

---

## 3. Exhaustive Chapter Checklist

### Ch-01: Arrays & Matrix Mapping
- [ ] 1.1 1D array address calculation with base address & element size
- [ ] 1.2 2D array Row-Major Order (RMO) & Column-Major Order (CMO) with arbitrary bounds
- [ ] 1.3 3D and n-D array address calculation mechanics
- [ ] 1.4 Lower Triangular Matrix: 1D mapping formula (RMO vs CMO)
- [ ] 1.5 Upper Triangular Matrix & Symmetric Matrix 1D mapping
- [ ] 1.6 Tridiagonal & Banded matrices mapping

### Ch-02: Stacks
- [ ] 2.1 Stack ADT, array & linked list implementations, overflow/underflow
- [ ] 2.2 Infix to Postfix conversion using stack (precedence, associativity rules)
- [ ] 2.3 Postfix & Prefix expression evaluation
- [ ] 2.4 Stack permutations & Catalan number formula $C_n = \frac{1}{n+1}\binom{2n}{n}$
- [ ] 2.5 Min-Stack implementation in $O(1)$ space/time

### Ch-03: Queues
- [ ] 3.1 Linear Queue limitations & circular array representation
- [ ] 3.2 Circular Queue pointer math (`(rear + 1) % N == front`), full vs empty condition
- [ ] 3.3 Double-Ended Queue (Deque): input-restricted & output-restricted
- [ ] 3.4 Queue using two stacks (amortized cost analysis)
- [ ] 3.5 Priority Queue basics

### Ch-04: Linked Lists
- [ ] 4.1 Singly Linked List: insertion, deletion, edge cases, time complexities
- [ ] 4.2 Doubly Linked List & Circular Linked List mechanics
- [ ] 4.3 In-place list reversal (iterative 3-pointer & recursive)
- [ ] 4.4 Floyd's Cycle Detection: proof of meeting point & cycle start node
- [ ] 4.5 Tracing GATE C pointer code snippets on linked structures

### Ch-05: Binary Trees
- [ ] 5.1 Tree terminology: Strictly binary, Complete, Perfect, Full binary trees
- [ ] 5.2 Mathematical properties: $L = I_2 + 1$ proof & applications
- [ ] 5.3 Height bounds: Min and Max nodes for height $h$
- [ ] 5.4 Traversals: Inorder, Preorder, Postorder, Level-order
- [ ] 5.5 Unique tree reconstruction: why Preorder + Inorder works, Preorder + Postorder limits

### Ch-06: Binary Search Trees (BST)
- [ ] 6.1 BST ordering invariant & Inorder sorted property
- [ ] 6.2 Insertion & Search mechanics
- [ ] 6.3 Deletion: 0 child, 1 child, 2 children (inorder predecessor/successor replacement)
- [ ] 6.4 Valid search sequence identification via range narrowing $[L, R]$
- [ ] 6.5 Number of distinct BSTs with $n$ keys ($C_n$)

### Ch-07: AVL Trees
- [ ] 7.1 Balance Factor definition & height-balance invariant
- [ ] 7.2 Single rotations: LL and RR rotations
- [ ] 7.3 Double rotations: LR and RL rotations
- [ ] 7.4 Minimum nodes for height $h$: Fibonacci-style recurrence $N(h) = N(h-1) + N(h-2) + 1$
- [ ] 7.5 Maximum height of AVL tree with $n$ nodes

### Ch-08: Heaps & Priority Queues
- [ ] 8.1 Complete Binary Tree array mapping: parent, left child, right child indices
- [ ] 8.2 Min-Heap & Max-Heap properties
- [ ] 8.3 Insertion ($O(\log n)$) & Extract-Max/Min ($O(\log n)$)
- [ ] 8.4 Bottom-up `Build-Heap`: proof of $O(n)$ time complexity
- [ ] 8.5 Heap sort iterations & finding $k$-th extreme element

### Ch-09: Hashing
- [ ] 9.1 Hash functions (Division, Multiplication) & Load factor $\alpha = n/m$
- [ ] 9.2 Separate Chaining: collision resolution & search times
- [ ] 9.3 Open Addressing: Linear Probing & Primary Clustering
- [ ] 9.4 Quadratic Probing & Secondary Clustering
- [ ] 9.5 Double Hashing mechanics (eliminating clustering)
- [ ] 9.6 Successful vs Unsuccessful search probe calculations under uniform hashing
