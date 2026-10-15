---
title: OS + DBMS + TOC · Mock 01
duration: 45
created: 2026-10-15
description: GATE-level sectional mock covering Operating Systems, Databases, and Theory of Computation.
---

## Q1
type: MCQ
marks: 1
subject: os
topic: cpu-scheduling
answer: B

Consider three processes $P_1, P_2$, and $P_3$ that arrive at time $t = 0\text{ ms}$ with CPU burst times of $5\text{ ms}$, $3\text{ ms}$, and $8\text{ ms}$, respectively. The CPU scheduler uses the preemptive Shortest Remaining Time First (SRTF) algorithm. A fourth process $P_4$ arrives at time $t = 2\text{ ms}$ with a CPU burst time of $2\text{ ms}$. If the scheduler breaks ties in remaining time using the process with the smaller arrival time (and then lower process index), what is the average waiting time (in $\text{ms}$) of the four processes?

(A) $3.5\text{ ms}$
(B) $4.0\text{ ms}$
(C) $4.25\text{ ms}$
(D) $4.5\text{ ms}$

### Solution
Let us trace the execution of the processes using preemptive Shortest Remaining Time First (SRTF):

- At time $t = 0\text{ ms}$:
  - Ready queue: $P_1$ (remaining $5\text{ ms}$), $P_2$ (remaining $3\text{ ms}$), $P_3$ (remaining $8\text{ ms}$).
  - Shortest remaining time is $P_2$ ($3\text{ ms}$).
  - $P_2$ is scheduled and runs from $t = 0$ to $t = 2\text{ ms}$.

- At time $t = 2\text{ ms}$:
  - $P_2$ has executed for $2\text{ ms}$, so its remaining time is $3 - 2 = 1\text{ ms}$.
  - $P_4$ arrives with burst time $2\text{ ms}$.
  - Comparing remaining times: $P_2$ ($1\text{ ms}$), $P_4$ ($2\text{ ms}$), $P_1$ ($5\text{ ms}$), $P_3$ ($8\text{ ms}$).
  - $P_2$ has strictly lower remaining time than $P_4$ ($1 < 2$), so $P_2$ is NOT preempted.
  - $P_2$ continues executing until completion at $t = 3\text{ ms}$.

- At time $t = 3\text{ ms}$:
  - Ready queue: $P_4$ ($2\text{ ms}$), $P_1$ ($5\text{ ms}$), $P_3$ ($8\text{ ms}$).
  - Shortest remaining time is $P_4$ ($2\text{ ms}$).
  - $P_4$ runs from $t = 3$ to $t = 5\text{ ms}$, completing at $t = 5\text{ ms}$.

- At time $t = 5\text{ ms}$:
  - Ready queue: $P_1$ ($5\text{ ms}$), $P_3$ ($8\text{ ms}$).
  - $P_1$ runs from $t = 5$ to $t = 10\text{ ms}$, completing at $t = 10\text{ ms}$.

- At time $t = 10\text{ ms}$:
  - $P_3$ runs from $t = 10$ to $t = 18\text{ ms}$, completing at $t = 18\text{ ms}$.

Completion Times ($C$):
- $P_1: C = 10\text{ ms}$
- $P_2: C = 3\text{ ms}$
- $P_3: C = 18\text{ ms}$
- $P_4: C = 5\text{ ms}$

Turnaround Times ($\text{TAT} = C - \text{Arrival}$):
- $P_1: 10 - 0 = 10\text{ ms}$
- $P_2: 3 - 0 = 3\text{ ms}$
- $P_3: 18 - 0 = 18\text{ ms}$
- $P_4: 5 - 2 = 3\text{ ms}$

Waiting Times ($\text{WT} = \text{TAT} - \text{Burst}$):
- $P_1: 10 - 5 = 5\text{ ms}$
- $P_2: 3 - 3 = 0\text{ ms}$
- $P_3: 18 - 8 = 10\text{ ms}$
- $P_4: 3 - 2 = 1\text{ ms}$

Sum of waiting times $= 5 + 0 + 10 + 1 = 16\text{ ms}$.
Average waiting time $= \frac{16}{4} = 4.0\text{ ms}$.

Common GATE Trap:
Preempting $P_2$ when $P_4$ arrives at $t = 2$ by comparing $P_4$'s burst ($2\text{ ms}$) with $P_2$'s original burst ($3\text{ ms}$) rather than $P_2$'s *remaining* burst ($1\text{ ms}$). Doing so yields $4.25\text{ ms}$ (Option C), which is incorrect.

## Q2
type: NAT
marks: 1
subject: os
topic: memory-management
answer: 24

Consider a system with a 36-bit virtual address space and a 32-bit physical address space. The system uses single-level (linear) paging with a page size of $8\text{ KB}$. Each Page Table Entry (PTE) contains the physical frame number along with 5 auxiliary bits (for valid/invalid, dirty, reference, and protection bits). Each PTE is stored using the minimum whole number of bytes required (byte-aligned). The total size of the single-level page table is ______ MB.

### Solution
1. **Virtual Address breakdown:**
   - Virtual Address (VA) size $= 36\text{ bits}$.
   - Page size $= 8\text{ KB} = 2^{13}\text{ bytes}$.
   - Number of page offset bits $= 13\text{ bits}$.
   - Number of bits for Virtual Page Number (VPN) $= 36 - 13 = 23\text{ bits}$.
   - Total number of entries in the linear page table $= 2^{23}$ entries.

2. **Physical Frame Number (PFN) bits:**
   - Physical Address (PA) size $= 32\text{ bits}$.
   - Frame offset bits $= 13\text{ bits}$.
   - Number of bits for PFN $= 32 - 13 = 19\text{ bits}$.

3. **Size of each Page Table Entry (PTE):**
   - Bits required per PTE $= \text{PFN bits} + \text{auxiliary bits} = 19 + 5 = 24\text{ bits}$.
   - Since each PTE is byte-aligned (rounded up to the minimum whole number of bytes):
     $$\text{PTE size} = \frac{24\text{ bits}}{8\text{ bits/byte}} = 3\text{ bytes}$$

4. **Total Page Table size:**
   $$\text{Page Table Size} = 2^{23}\text{ entries} \times 3\text{ bytes} = 3 \times 8 \times 2^{20}\text{ bytes} = 24\text{ MB}$$

Hence, the answer is 24.

## Q3
type: MCQ
marks: 2
subject: os
topic: concurrency-synchronization
answer: C

Three concurrent processes $P_1, P_2$, and $P_3$ share two binary semaphores $S_1$ and $S_2$, initialized to $S_1 = 1$ and $S_2 = 0$. The processes execute the following infinite loops:

```c
// Process P1:
while (true) {
    wait(S1);
    print("1");
    signal(S2);
    wait(S1);
    print("2");
    signal(S2);
}

// Process P2:
while (true) {
    wait(S2);
    print("3");
    signal(S1);
}

// Process P3:
while (true) {
    wait(S2);
    print("4");
    signal(S1);
}
```

Which of the following prefix output strings can NEVER be generated by any valid execution sequence of $P_1, P_2$, and $P_3$?

(A) `1 3 2 3 1 4`
(B) `1 4 2 3 1 3`
(C) `1 3 1 4 2 3`
(D) `1 4 2 4 1 4`

### Solution
Let us trace the synchronization constraints governed by semaphores $S_1$ and $S_2$:

1. Initial state: $S_1 = 1, S_2 = 0$.
   - Only $P_1$ can proceed past `wait(S1)`. Both $P_2$ and $P_3$ are blocked on `wait(S2)`.
   - $P_1$ prints `1`, increments $S_2$ to 1 via `signal(S2)`, and immediately invokes `wait(S1)`.
   - Because $S_1 = 0$, $P_1$ blocks at its second `wait(S1)`.

2. Next step ($S_1 = 0, S_2 = 1$):
   - Either $P_2$ or $P_3$ can consume $S_2$:
     - If $P_2$ proceeds, it prints `3` and performs `signal(S1)`.
     - If $P_3$ proceeds, it prints `4` and performs `signal(S1)`.
   - In either case, $S_2$ becomes 0 and $S_1$ becomes 1.

3. Next step ($S_1 = 1, S_2 = 0$):
   - $P_1$ unblocks from its second `wait(S1)` and prints `2`.
   - $P_1$ then calls `signal(S2)` (making $S_2 = 1$) and loops back to call `wait(S1)` (making $P_1$ block because $S_1 = 0$).

4. Next step ($S_1 = 0, S_2 = 1$):
   - Either $P_2$ or $P_3$ unblocks, prints `3` or `4`, and calls `signal(S1)`.
   - Only then does $P_1$ unblock to print `1`.

Key Invariant:
Within $P_1$, the output strictly alternates between `1` and `2`: every `1` printed by $P_1$ MUST be followed by `2` before another `1` can ever be printed!
Furthermore:
- Odd-indexed positions in the output must come from $P_1$ (`1`, then `2`, then `1`, then `2`, ...).
- Even-indexed positions in the output must come from either $P_2$ or $P_3$ (`3` or `4`).

Now analyze the given options:
- (A) `1 3 2 3 1 4`: Valid ($P_1 \to P_2 \to P_1 \to P_2 \to P_1 \to P_3$).
- (B) `1 4 2 3 1 3`: Valid ($P_1 \to P_3 \to P_1 \to P_2 \to P_1 \to P_2$).
- (C) `1 3 1 4 2 3`: INVALID! At position 3, the symbol `1` is printed, but $P_1$ has not yet printed `2` after its first `1`. $P_1$ is blocked at `wait(S1)` right before printing `2`. Therefore, `1` cannot appear again before `2`.
- (D) `1 4 2 4 1 4`: Valid ($P_1 \to P_3 \to P_1 \to P_3 \to P_1 \to P_3$).

Hence, (C) can never be generated.

## Q4
type: MSQ
marks: 2
subject: os
topic: virtual-memory
answer: A, B, D

Which of the following statements regarding virtual memory and address translation is/are TRUE?

(A) In an inverted page table, the number of page table entries is determined by the number of frames in physical memory rather than the number of pages in the virtual address space.
(B) In a hierarchical two-level paging system, if a Translation Lookaside Buffer (TLB) hit occurs, exactly one access to physical memory is required to access the target data or instruction word.
(C) A Translation Lookaside Buffer (TLB) miss always implies that the requested page is not present in physical memory (i.e., a page fault must occur).
(D) If the victim page selected for replacement during a page fault is dirty (modified), servicing the fault requires two disk I/O operations (one disk write and one disk read), whereas replacing a clean page requires only one disk read.

### Solution
- **(A) is TRUE:** In traditional forward-mapped paging, the page table contains an entry for every virtual page. In an inverted page table, there is exactly one entry per physical frame, indexed by frame number, storing the `(process_id, page_number)` currently occupying that frame. Thus, its size is proportional to physical memory size, independent of virtual address space size.
- **(B) is TRUE:** When a TLB hit occurs, the hardware directly retrieves the physical frame number from the TLB associative cache. No page table lookups in main memory are required. The only physical memory access performed is to access the actual operand/instruction at the computed physical address.
- **(C) is FALSE:** A TLB miss simply means that the translation is not cached in the TLB. The page table walk may find that the page is already resident in physical memory (valid bit $= 1$). A page fault occurs only if the page table entry indicates that the page is absent from physical memory (valid bit $= 0$).
- **(D) is TRUE:** If the victim page has its dirty (modified) bit set, its contents in memory differ from the copy on disk, so it must be written back to disk before the frame can be reused. Then the requested page is read from disk into the frame. Thus, two disk I/O operations are required. For a clean victim page, its contents already match the disk copy, so it can simply be overwritten, requiring only one disk read.

Hence, statements A, B, and D are TRUE.

## Q5
type: NAT
marks: 2
subject: os
topic: deadlock
answer: 10

Consider a system consisting of four processes $\{P_0, P_1, P_2, P_3\}$ and three resource types $\{R_1, R_2, R_3\}$. The total instances of resources in the system are $(10, 8, 9)$ for $(R_1, R_2, R_3)$, respectively.

The current allocation and maximum claim matrices are given below:

$$\text{Allocation} = \begin{pmatrix} & R_1 & R_2 & R_3 \\ P_0 & 2 & 1 & 2 \\ P_1 & 3 & 0 & 2 \\ P_2 & 1 & 2 & 1 \\ P_3 & 2 & 2 & 1 \end{pmatrix}, \quad \text{Max} = \begin{pmatrix} & R_1 & R_2 & R_3 \\ P_0 & 5 & 4 & 3 \\ P_1 & 4 & 2 & 3 \\ P_2 & 3 & 3 & 2 \\ P_3 & 6 & 4 & 3 \end{pmatrix}$$

The total number of distinct safe execution sequences that exist for the system in this state is ______.

### Solution
First, compute the Available resource vector and the Need matrix:

1. **Total Allocated Resources:**
   - $R_1: 2 + 3 + 1 + 2 = 8$
   - $R_2: 1 + 0 + 2 + 2 = 5$
   - $R_3: 2 + 2 + 1 + 1 = 6$
   - $\text{Total Allocated} = (8, 5, 6)$

2. **Available Vector:**
   $$\text{Available} = \text{Total} - \text{Allocated} = (10 - 8, 8 - 5, 9 - 6) = (2, 3, 3)$$

3. **Need Matrix ($\text{Need} = \text{Max} - \text{Allocation}$):**
   - $P_0: (5-2, 4-1, 3-2) = (3, 3, 1)$
   - $P_1: (4-3, 2-0, 3-2) = (1, 2, 1)$
   - $P_2: (3-1, 3-2, 2-1) = (2, 1, 1)$
   - $P_3: (6-2, 4-2, 3-1) = (4, 2, 2)$

Now, compare $\text{Need}$ with $\text{Available} = (2, 3, 3)$:
- $P_0: (3, 3, 1) \not\le (2, 3, 3)$ since $3 > 2$ on $R_1$. (Cannot run first)
- $P_1: (1, 2, 1) \le (2, 3, 3)$. (Can run first)
- $P_2: (2, 1, 1) \le (2, 3, 3)$. (Can run first)
- $P_3: (4, 2, 2) \not\le (2, 3, 3)$ since $4 > 2$ on $R_1$. (Cannot run first)

Thus, any safe sequence must start with either $P_1$ or $P_2$.

---

**Case 1: $P_1$ runs first.**
- $P_1$ finishes and releases its allocated resources $(3, 0, 2)$:
  $$\text{New Available} = (2, 3, 3) + (3, 0, 2) = (5, 3, 5)$$
- Remaining processes: $\{P_0, P_2, P_3\}$.
  - $P_0$ Need: $(3, 3, 1) \le (5, 3, 5)$ $\implies$ can run.
  - $P_2$ Need: $(2, 1, 1) \le (5, 3, 5)$ $\implies$ can run.
  - $P_3$ Need: $(4, 2, 2) \le (5, 3, 5)$ $\implies$ can run.
- Since all three remaining processes can be satisfied, once any one of them finishes, available resources strictly increase, allowing the remaining two to finish in any order.
- Thus, all $3! = 6$ permutations of $\{P_0, P_2, P_3\}$ are safe:
  1. $P_1 \to P_0 \to P_2 \to P_3$
  2. $P_1 \to P_0 \to P_3 \to P_2$
  3. $P_1 \to P_2 \to P_0 \to P_3$
  4. $P_1 \to P_2 \to P_3 \to P_0$
  5. $P_1 \to P_3 \to P_0 \to P_2$
  6. $P_1 \to P_3 \to P_2 \to P_0$
- **Total for Case 1 = 6 sequences.**

---

**Case 2: $P_2$ runs first.**
- $P_2$ finishes and releases its allocated resources $(1, 2, 1)$:
  $$\text{New Available} = (2, 3, 3) + (1, 2, 1) = (3, 5, 4)$$
- Remaining processes: $\{P_0, P_1, P_3\}$.
  - $P_0$ Need: $(3, 3, 1) \le (3, 5, 4)$ $\implies$ can run.
  - $P_1$ Need: $(1, 2, 1) \le (3, 5, 4)$ $\implies$ can run.
  - $P_3$ Need: $(4, 2, 2) \not\le (3, 5, 4)$ since $4 > 3$ on $R_1$. $\implies$ **$P_3$ CANNOT run second!**
- Subcase 2.1: $P_0$ runs second.
  - Releases $(2, 1, 2)$: New Available $= (3, 5, 4) + (2, 1, 2) = (5, 6, 6)$.
  - Both remaining processes $\{P_1, P_3\}$ can run in either order:
    7. $P_2 \to P_0 \to P_1 \to P_3$
    8. $P_2 \to P_0 \to P_3 \to P_1$
- Subcase 2.2: $P_1$ runs second.
  - Releases $(3, 0, 2)$: New Available $= (3, 5, 4) + (3, 0, 2) = (6, 5, 6)$.
  - Both remaining processes $\{P_0, P_3\}$ can run in either order:
    9. $P_2 \to P_1 \to P_0 \to P_3$
    10. $P_2 \to P_1 \to P_3 \to P_0$
- **Total for Case 2 = 4 sequences.**

Total distinct safe execution sequences $= 6 + 4 = 10$.

## Q6
type: MCQ
marks: 1
subject: dbms
topic: relational-algebra-calculus
answer: B

Let $R(A, B)$ and $S(B, C)$ be two relations. Attribute $B$ is the primary key of $S$, and $R.B$ is a foreign key referencing $S.B$. Attribute $R.B$ has a `NOT NULL` constraint. Suppose relation $R$ contains $m$ tuples and relation $S$ contains $n$ tuples, where $m > 0$ and $n > 0$.

Consider the natural join $R \bowtie S$ and the left outer join $R \leftouterjoin S$. Which of the following statements is ALWAYS TRUE?

(A) The number of tuples in $R \bowtie S$ is always $n$.
(B) The number of tuples in $R \bowtie S$ is always equal to the number of tuples in $R \leftouterjoin S$, and both are equal to $m$.
(C) The number of tuples in the right outer join $R \rightouterjoin S$ is always equal to $m$.
(D) The maximum possible number of tuples in $R \bowtie S$ is $m \times n$.

### Solution
Let us analyze the relational constraints:
1. $B$ is the primary key of $S$. Therefore, every value of $B$ in $S$ is strictly unique.
2. $R.B$ is a foreign key referencing $S.B$ with a `NOT NULL` constraint. Therefore, for every tuple $t \in R$, the value $t[B]$ is non-null and MUST exist in $S$.
3. Since $t[B]$ exists in $S$ and is unique in $S$, each tuple of $R$ matches with **exactly one** tuple of $S$.

Evaluating the operations:
- **Natural Join ($R \bowtie S$):** Every tuple in $R$ matches with exactly one tuple in $S$. Hence, the natural join produces exactly $m$ tuples.
- **Left Outer Join ($R \leftouterjoin S$):** All tuples from $R$ are preserved. Since every tuple in $R$ already finds a match in $S$, no dangling tuples padded with NULLs are introduced. Thus, the left outer join also contains exactly $m$ tuples.
- **Right Outer Join ($R \rightouterjoin S$):** All tuples of $S$ are preserved. If a tuple in $S$ is referenced by $k$ tuples in $R$, it produces $k$ tuples; if a tuple in $S$ is not referenced by any tuple in $R$, it produces 1 tuple with NULLs for $R$'s attributes. The total number of tuples in $R \rightouterjoin S$ is at least $n$, and is not necessarily equal to $m$.

Thus, (B) is always true.

## Q7
type: MCQ
marks: 1
subject: dbms
topic: functional-dependencies-normal-forms
answer: A

Consider the relation schema $R(A, B, C, D, E)$ with the following set of functional dependencies:

$$F = \{ AB \to C, \quad C \to D, \quad D \to B, \quad D \to E \}$$

The highest normal form satisfied by relation $R$ is:

(A) 1NF
(B) 2NF
(C) 3NF
(D) BCNF

### Solution
1. **Determine the candidate keys of $R$:**
   - Attribute $A$ does not appear on the right-hand side of any functional dependency. Therefore, $A$ must be part of every candidate key.
   - Compute closure of $AB$:
     $$(AB)^+ = \{A, B\}$$
     Using $AB \to C \implies \{A, B, C\}$
     Using $C \to D \implies \{A, B, C, D\}$
     Using $D \to E \implies \{A, B, C, D, E\}$
     Since $(AB)^+ = \{A, B, C, D, E\}$, $AB$ is a candidate key.
   - Since $D \to B$, check closure of $AD$:
     $$(AD)^+ = \{A, D\}$$
     Using $D \to B, D \to E \implies \{A, B, D, E\}$
     Using $AB \to C \implies \{A, B, C, D, E\}$
     Since $(AD)^+ = \{A, B, C, D, E\}$, $AD$ is a candidate key.
   - Since $C \to D$, check closure of $AC$:
     $$(AC)^+ = \{A, C\}$$
     Using $C \to D \implies \{A, C, D\}$
     Using $D \to B, D \to E \implies \{A, B, C, D, E\}$
     Since $(AC)^+ = \{A, B, C, D, E\}$, $AC$ is a candidate key.

   Candidate keys are: $\{AB, AC, AD\}$.

2. **Identify Prime and Non-Prime attributes:**
   - Prime attributes (part of at least one candidate key): $\{A, B, C, D\}$.
   - Non-prime attributes: $\{E\}$.

3. **Check for 2NF:**
   - A relation is in 2NF if no non-prime attribute is partially dependent on any candidate key.
   - Consider the functional dependency $D \to E$:
     - $E$ is a non-prime attribute.
     - $D$ is a proper subset of candidate key $AD$ ($D \subset AD$).
     - Therefore, $D \to E$ is a partial dependency!
   - Because $R$ contains a partial dependency of a non-prime attribute on a candidate key, $R$ violates 2NF.

Thus, the highest normal form satisfied by $R$ is 1NF.

## Q8
type: MSQ
marks: 2
subject: dbms
topic: transactions-concurrency-control
answer: A, B, C

Consider the following schedule $S$ involving three transactions $T_1, T_2$, and $T_3$, where $r_i(V)$ and $w_i(V)$ denote read and write operations by transaction $T_i$ on data item $V$, and $c_i$ denotes the commit of $T_i$:

$$S: r_1(X); \; r_2(Z); \; w_1(X); \; r_2(X); \; w_2(X); \; r_3(X); \; w_3(Y); \; c_1; \; c_2; \; c_3$$

Which of the following statements is/are TRUE regarding schedule $S$?

(A) Schedule $S$ is conflict serializable with the equivalent serial order $T_1 \to T_2 \to T_3$.
(B) Schedule $S$ is view serializable.
(C) Schedule $S$ is recoverable.
(D) Schedule $S$ is cascadeless (avoids cascading aborts).

### Solution
Let us systematically evaluate each property for schedule $S$:

1. **Conflict Serializability:**
   Find conflicting pairs of operations (operations by different transactions on the same item, where at least one is a write):
   - On item $X$:
     - $w_1(X)$ precedes $r_2(X) \implies T_1 \to T_2$
     - $w_1(X)$ precedes $w_2(X) \implies T_1 \to T_2$
     - $r_2(X)$ precedes $w_2(X)$ (same transaction $T_2$, no edge)
     - $w_2(X)$ precedes $r_3(X) \implies T_2 \to T_3$
   - On item $Z$: only $r_2(Z)$ (no conflicts).
   - On item $Y$: only $w_3(Y)$ (no conflicts).

   The precedence (serialization) graph has edges: $T_1 \to T_2$ and $T_2 \to T_3$.
   Since the precedence graph contains no cycles, schedule $S$ is **conflict serializable**, with equivalent serial order $T_1 \to T_2 \to T_3$.
   Hence, **(A) is TRUE**.

2. **View Serializability:**
   Every conflict serializable schedule is also view serializable.
   Hence, **(B) is TRUE**.

3. **Recoverability:**
   A schedule is recoverable if, whenever a transaction $T_j$ reads a data value written by $T_i$ ($i \ne j$), $T_i$ commits before $T_j$ commits ($c_i < c_j$):
   - $T_2$ reads $X$ written by $T_1$. In $S$, $c_1$ appears before $c_2$.
   - $T_3$ reads $X$ written by $T_2$. In $S$, $c_2$ appears before $c_3$.
   Every dirty read is committed by the writer before the reader commits.
   Therefore, schedule $S$ is **recoverable**.
   Hence, **(C) is TRUE**.

4. **Cascadelessness (Avoids Cascading Aborts):**
   A schedule is cascadeless if transactions only read values written by transactions that have already committed prior to the read.
   In schedule $S$:
   - $T_2$ reads $X$ ($r_2(X)$) while $T_1$ has not yet committed ($c_1$ occurs later).
   If $T_1$ aborts at any point before $c_1$, $T_2$ would have read dirty uncommitted data and must be aborted.
   Therefore, schedule $S$ is **NOT cascadeless**.
   Hence, **(D) is FALSE**.

Correct options are A, B, and C.

## Q9
type: NAT
marks: 2
subject: dbms
topic: file-organization-indexing
answer: 640

A B+ tree index is constructed to index records of a database table. The tree parameters are defined as follows:
- The maximum number of child pointers an internal node can hold is 15 (fan-out $p = 15$).
- The maximum number of data records a leaf node can hold is 10.
- The root node must have at least 2 child pointers.
- Every non-root internal node must contain at least $\lceil p / 2 \rceil$ child pointers.
- Every leaf node must contain at least $\lceil 10 / 2 \rceil$ data records.

Define the height of the B+ tree by its levels, where the root node is at Level 1, internal nodes are at Levels 2 and 3, and all leaf nodes reside at Level 4.

The MINIMUM number of data records that can be stored in this B+ tree is ______.

### Solution
To minimize the total number of data records stored in the tree while having leaf nodes at Level 4, every node from the root down to the leaves must hold the minimum allowable number of pointers and records:

1. **Level 1 (Root node):**
   - Minimum number of child pointers for the root $= 2$.
   - Therefore, there are 2 nodes at Level 2.

2. **Level 2 (Internal nodes):**
   - Each non-root internal node must contain at least $\lceil p / 2 \rceil$ child pointers.
   - Minimum child pointers $= \lceil 15 / 2 \rceil = 8$ pointers.
   - Number of nodes at Level 3 $= 2 \times 8 = 16$ nodes.

3. **Level 3 (Internal nodes):**
   - Each internal node at Level 3 must contain at least $\lceil p / 2 \rceil = 8$ child pointers to leaf nodes.
   - Number of leaf nodes at Level 4 $= 16 \times 8 = 128$ leaf nodes.

4. **Level 4 (Leaf nodes):**
   - Each leaf node must contain at least $\lceil 10 / 2 \rceil = 5$ data records.
   - Minimum total number of data records:
     $$\text{Total Records} = 128 \times 5 = 640$$

Hence, the minimum number of records is 640.

## Q10
type: MCQ
marks: 2
subject: dbms
topic: sql
answer: A

Consider the following relational instance of the `Employees` table:

| emp_id | dept_id | salary |
| :--- | :--- | :--- |
| 1 | 10 | 5000 |
| 2 | 10 | 6000 |
| 3 | 10 | 6000 |
| 4 | 20 | 7000 |
| 5 | 20 | 8000 |
| 6 | 30 | 4000 |
| 7 | NULL | 9000 |

Consider the following SQL query executed on this instance:

```sql
SELECT dept_id, COUNT(*)
FROM Employees E1
WHERE salary > (
    SELECT AVG(salary)
    FROM Employees E2
    WHERE E2.dept_id = E1.dept_id
)
GROUP BY dept_id;
```

Which of the following result sets is produced by the query?

(A)
| dept_id | COUNT(*) |
| :--- | :--- |
| 10 | 2 |
| 20 | 1 |

(B)
| dept_id | COUNT(*) |
| :--- | :--- |
| 10 | 2 |
| 20 | 1 |
| 30 | 1 |

(C)
| dept_id | COUNT(*) |
| :--- | :--- |
| 10 | 2 |
| 20 | 1 |
| NULL | 1 |

(D)
| dept_id | COUNT(*) |
| :--- | :--- |
| 10 | 3 |
| 20 | 2 |

### Solution
Let us trace the correlated subquery for each row in `Employees`:

1. **For `dept_id = 10`:**
   - Employees in department 10 have salaries: $5000, 6000, 6000$.
   - $\text{AVG(salary)} = \frac{5000 + 6000 + 6000}{3} = \frac{17000}{3} \approx 5666.67$.
   - Check condition `salary > 5666.67`:
     - `emp_id = 1`: $5000 > 5666.67$ is FALSE.
     - `emp_id = 2`: $6000 > 5666.67$ is TRUE.
     - `emp_id = 3`: $6000 > 5666.67$ is TRUE.
   - Rows passing the `WHERE` filter: `emp_id = 2` and `emp_id = 3`.

2. **For `dept_id = 20`:**
   - Employees in department 20 have salaries: $7000, 8000$.
   - $\text{AVG(salary)} = \frac{7000 + 8000}{2} = 7500$.
   - Check condition `salary > 7500`:
     - `emp_id = 4`: $7000 > 7500$ is FALSE.
     - `emp_id = 5`: $8000 > 7500$ is TRUE.
   - Row passing the `WHERE` filter: `emp_id = 5`.

3. **For `dept_id = 30`:**
   - Only `emp_id = 6` belongs to department 30, with salary $4000$.
   - $\text{AVG(salary)} = 4000$.
   - Check condition: $4000 > 4000$ evaluates to FALSE (strict inequality).
   - No rows from department 30 pass the `WHERE` clause.

4. **For `dept_id = NULL` (`emp_id = 7`):**
   - The subquery executes: `WHERE E2.dept_id = NULL`.
   - In SQL three-valued logic, `dept_id = NULL` evaluates to `UNKNOWN` for all rows.
   - Since no rows match, `AVG(salary)` returns `NULL`.
   - The outer condition `9000 > NULL` evaluates to `UNKNOWN`.
   - Rows evaluating to `UNKNOWN` are excluded by the `WHERE` filter.

Now apply `GROUP BY dept_id` on the surviving rows (`emp_id` 2, 3, 5):
- Group `dept_id = 10`: contains 2 rows $\implies (10, 2)$
- Group `dept_id = 20`: contains 1 row $\implies (20, 1)$

Hence, (A) is the correct result set.

## Q11
type: MCQ
marks: 1
subject: toc
topic: regular-languages
answer: B

Which of the following languages over the alphabet $\Sigma = \{a, b\}$ is REGULAR?

(A) $L_1 = \{ a^n b^m \mid n \ne m, \; n \ge 0, \; m \ge 0 \}$
(B) $L_2 = \{ w \in \{a, b\}^* \mid |w|_a \equiv 0 \pmod 3 \text{ and } |w|_b \equiv 0 \pmod 5 \}$, where $|w|_x$ denotes the number of occurrences of symbol $x$ in string $w$
(C) $L_3 = \{ w w^R \mid w \in \{a, b\}^* \}$, where $w^R$ is the reversal of $w$
(D) $L_4 = \{ a^{n^2} \mid n \ge 1 \}$

### Solution
- **(A) is NOT regular:** The language $L_1$ requires comparing the count of $a$'s with the count of $b$'s. Since memory in a finite automaton is bounded, it cannot track arbitrarily large counts. By the Pumping Lemma, $L_1$ is not regular (it is a non-deterministic CFL).
- **(B) is REGULAR:** The condition requires tracking the count of $a$'s modulo 3 and the count of $b$'s modulo 5. A DFA can be constructed using the product automaton of two state machines: one with 3 states tracking $|w|_a \pmod 3$, and another with 5 states tracking $|w|_b \pmod 5$. The resulting DFA has $3 \times 5 = 15$ states, with start state $(0, 0)$ and single accepting state $(0, 0)$. Because a finite automaton recognizes $L_2$, it is regular.
- **(C) is NOT regular:** $L_3$ is the language of even-length palindromes. Verifying that the second half of the string matches the reverse of the first half requires an unbounded Last-In-First-Out stack. Hence, $L_3$ is context-free but not regular.
- **(D) is NOT regular:** The sequence of lengths of strings in $L_4$ is $1^2, 2^2, 3^2, 4^2, \dots = 1, 4, 9, 16, \dots$. The difference between successive lengths $(n+1)^2 - n^2 = 2n + 1$ grows unbounded, violating the constant pumping length property of regular languages.

Hence, (B) is regular.

## Q12
type: MSQ
marks: 1
subject: toc
topic: turing-machines-undecidability
answer: B, D

Which of the following decision problems is/are DECIDABLE?

(A) Given the description of a Turing machine $M$, is $L(M) = \emptyset$?
(B) Given a Deterministic Finite Automaton (DFA) $D$ and a regular expression $R$, is $L(D) \subseteq L(R)$?
(C) Given a Context-Free Grammar (CFG) $G$ over alphabet $\Sigma$, is $L(G) = \Sigma^*$?
(D) Given two Deterministic Finite Automata $D_1$ and $D_2$, is $L(D_1) \cap L(D_2) = \emptyset$?

### Solution
- **(A) is UNDECIDABLE:** Testing whether the language of an arbitrary Turing machine is empty is undecidable. By Rice's theorem, emptiness is a non-trivial property of recursively enumerable languages. It is also well known to be undecidable (specifically, co-RE complete).
- **(B) is DECIDABLE:** Regular languages are closed under complementation and intersection. Note that:
  $$L(D) \subseteq L(R) \iff L(D) \cap \overline{L(R)} = \emptyset$$
  Since $R$ is a regular expression, we can convert it to a DFA, construct its complement DFA $\overline{L(R)}$, compute the product DFA representing $L(D) \cap \overline{L(R)}$, and test for emptiness via graph reachability (BFS/DFS from start state). Thus, the problem is decidable.
- **(C) is UNDECIDABLE:** The universality problem for context-free grammars (determining whether a CFG generates all possible strings $\Sigma^*$) is undecidable. This is proven by reduction from the Turing Machine valid computation history problem.
- **(D) is DECIDABLE:** Since $D_1$ and $D_2$ are DFAs, their intersection $L(D_1) \cap L(D_2)$ can be represented by a product DFA $D_{12}$ with $|Q_1| \times |Q_2|$ states. Testing whether $L(D_{12}) = \emptyset$ is equivalent to checking if any accepting state is reachable from the start state, which takes $O(|V| + |E|)$ time. Thus, the problem is decidable.

Hence, B and D are decidable.

## Q13
type: NAT
marks: 2
subject: toc
topic: regular-expressions-finite-automata
answer: 4

The minimum number of states in a complete Deterministic Finite Automaton (DFA) that accepts the language

$$L = \{ w \in \{a, b\}^* \mid w \text{ contains the substring } ab \text{ and } w \text{ does not contain the substring } ba \}$$

is ______.

### Solution
Let us characterize the strings belonging to language $L$:

1. $w$ must contain $ab$ as a contiguous substring.
2. $w$ must NOT contain $ba$ as a contiguous substring.
   - If a string contains symbol $b$, no symbol $a$ can appear anywhere after that $b$ (because transitioning from $b$ to $a$ would immediately create the forbidden substring $ba$).
   - Therefore, all $a$'s in $w$ must precede all $b$'s in $w$.
   - Combining with the requirement that $ab$ must appear, there must be at least one $a$ followed by at least one $b$.

Thus, $L = \{ a^n b^m \mid n \ge 1, \; m \ge 1 \} = a^+ b^+$.

Now construct the minimal complete DFA for $L = a^+ b^+$ over $\Sigma = \{a, b\}$:
- **State $q_0$ (Start state):**
  - Reads $a \to$ transitions to $q_1$ (first $a$ seen).
  - Reads $b \to$ transitions to $q_{\text{trap}}$ (string cannot start with $b$, because if $ab$ were to appear later, a $b$ would precede an $a$, violating the constraint).
- **State $q_1$ (Seen $a^+$, no $b$ yet):**
  - Reads $a \to$ stays in $q_1$ ($a$ continued).
  - Reads $b \to$ transitions to $q_2$ (seen $a^+ b$, string accepted!).
- **State $q_2$ (Accepting state, seen $a^+ b^+$):**
  - Reads $b \to$ stays in $q_2$ ($b$ continued).
  - Reads $a \to$ transitions to $q_{\text{trap}}$ (reading $a$ after $b$ creates substring $ba$).
- **State $q_{\text{trap}}$ (Dead / Trap state):**
  - Reads $a \to q_{\text{trap}}$.
  - Reads $b \to q_{\text{trap}}$.

Total states $= \{q_0, q_1, q_2, q_{\text{trap}}\} = 4$ states.

Verify that all 4 states are pairwise distinguishable:
- $q_2$ is the only accepting state, so it is distinguishable from $q_0, q_1, q_{\text{trap}}$.
- Distinguish $q_1$ and $q_0$: on input string $b$, $\delta(q_1, b) = q_2$ (accepts), whereas $\delta(q_0, b) = q_{\text{trap}}$ (rejects).
- Distinguish $q_0$ and $q_{\text{trap}}$: on input string $ab$, $\delta(q_0, ab) = q_2$ (accepts), whereas $\delta(q_{\text{trap}}, ab) = q_{\text{trap}}$ (rejects).
- Distinguish $q_1$ and $q_{\text{trap}}$: on input string $b$, $\delta(q_1, b) = q_2$ (accepts), whereas $\delta(q_{\text{trap}}, b) = q_{\text{trap}}$ (rejects).

All 4 states are pairwise non-equivalent. Thus, the minimal complete DFA requires exactly 4 states.

## Q14
type: MCQ
marks: 2
subject: toc
topic: context-free-grammars-pda
answer: B

Consider the context-free grammar $G$ over $\Sigma = \{a, b\}$:

$$S \to aSb \mid aSbb \mid \epsilon$$

and the following four statements:

- $S_1$: The grammar $G$ is ambiguous.
- $S_2$: The language $L(G) = \{ a^n b^m \mid n \le m \le 2n, \; n \ge 0 \}$ is inherently ambiguous.
- $S_3$: The language $L = \{ a^i b^j c^k \mid i = j \text{ or } j = k, \; i, j, k \ge 0 \}$ is inherently ambiguous.
- $S_4$: Every deterministic context-free language (DCFL) can be generated by an unambiguous context-free grammar.

Which of the above statements are TRUE?

(A) $S_1$ and $S_3$ only
(B) $S_1, S_3,$ and $S_4$ only
(C) $S_2$ and $S_4$ only
(D) $S_1, S_2,$ and $S_3$ only

### Solution
Let us analyze each statement individually:

1. **Statement $S_1$ is TRUE:**
   A grammar is ambiguous if there exists at least one string in its language that has two or more distinct leftmost derivations (or parse trees).
   Consider the string $w = a^2 b^3 = aabbb \in L(G)$:
   - **Derivation 1:**
     $$S \implies aSb \implies a(aSbb)b \implies aabbb$$
   - **Derivation 2:**
     $$S \implies aSbb \implies a(aSb)bb \implies aabbb$$
   Since $aabbb$ has two distinct leftmost derivations, grammar $G$ is ambiguous.

2. **Statement $S_2$ is FALSE:**
   A context-free language is inherently ambiguous if *every* context-free grammar that generates it is ambiguous.
   The language $L(G) = \{ a^n b^m \mid n \le m \le 2n \}$ is recognized by a Deterministic Pushdown Automaton (DPDA) with endmarker: on seeing $a$, push a counter onto the stack; on seeing $b$, decrement the counter at a rate of 1 or 2 per $a$. Because $L(G)$ can be recognized deterministically, it is a Deterministic Context-Free Language (DCFL).
   Since no DCFL is inherently ambiguous, $L(G)$ has an unambiguous grammar. Thus, $S_2$ is false.

3. **Statement $S_3$ is TRUE:**
   The language $L = \{ a^i b^j c^k \mid i = j \text{ or } j = k \}$ is the canonical example of an inherently ambiguous context-free language. Strings where $i = j = k$ can be generated either via the $i = j$ production sub-grammar or via the $j = k$ production sub-grammar, and any CFG generating this language necessarily has two distinct derivation trees for strings with $i = j = k$.

4. **Statement $S_4$ is TRUE:**
   Every Deterministic Context-Free Language (DCFL) is accepted by a DPDA. The canonical conversion of a DPDA to a grammar (or LR(k) grammar parsing) produces an unambiguous grammar. In fact, inherent ambiguity can only exist in non-deterministic context-free languages.

Therefore, statements $S_1, S_3,$ and $S_4$ are TRUE.

## Q15
type: MSQ
marks: 2
subject: toc
topic: context-free-languages
answer: A, C, D

Let $L_{CFL}$ be any context-free language, $L_{DCFL}$ be any deterministic context-free language, and $R$ be any regular language over an alphabet $\Sigma$. Which of the following statements is/are ALWAYS TRUE?

(A) $L_{CFL} \cap R$ is always a context-free language.
(B) If $L_1$ and $L_2$ are deterministic context-free languages, then $L_1 \cap L_2$ is always a deterministic context-free language.
(C) The complement of every deterministic context-free language, $\overline{L_{DCFL}}$, is guaranteed to be a deterministic context-free language.
(D) The set difference $L_{CFL} \setminus R$ is always a context-free language.

### Solution
- **(A) is TRUE:** Context-free languages are closed under intersection with regular languages. A pushdown automaton (PDA) for $L_{CFL}$ and a deterministic finite automaton (DFA) for $R$ can be simulated in parallel via the cross-product construction, where the PDA's stack operations are preserved and the states are pairs $(q_{PDA}, q_{DFA})$. The resulting machine is a PDA.
- **(B) is FALSE:** DCFLs are NOT closed under intersection.
  Counterexample:
  $$L_1 = \{ a^n b^n c^m \mid n, m \ge 1 \} \quad \text{and} \quad L_2 = \{ a^m b^n c^n \mid n, m \ge 1 \}$$
  Both $L_1$ and $L_2$ are DCFLs (a DPDA can easily compare $a$'s with $b$'s, or $b$'s with $c$'s).
  However, their intersection is:
  $$L_1 \cap L_2 = \{ a^n b^n c^n \mid n \ge 1 \}$$
  which is not even a context-free language, let alone deterministic.
- **(C) is TRUE:** Deterministic context-free languages are closed under complementation. Given a DPDA $M$ that halts on all inputs, we can construct a DPDA for $\overline{L(M)}$ by swapping the set of accepting and non-accepting states (with appropriate handling of $\epsilon$-transitions to avoid infinite loops without reading input).
- **(D) is TRUE:** By definition of set difference:
  $$L_{CFL} \setminus R = L_{CFL} \cap \overline{R}$$
  Since regular languages are closed under complementation, $\overline{R}$ is a regular language.
  Because CFLs are closed under intersection with regular languages (as established in statement A), $L_{CFL} \cap \overline{R}$ is guaranteed to be context-free.

Hence, statements A, C, and D are TRUE.
