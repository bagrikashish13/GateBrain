---
title: OS + DBMS + TOC · Mock 05
duration: 45
created: 2026-10-23
description: Mixed GATE-level sectional mock covering Operating Systems, Databases, and Theory of Computation.
---

## Q1
type: MCQ
marks: 1
subject: os
topic: cpu-scheduling
answer: A

Consider four processes $P_1, P_2, P_3,$ and $P_4$ arriving in the ready queue with the following arrival times and CPU burst times:

| Process | Arrival Time (ms) | Burst Time (ms) |
| :--- | :--- | :--- |
| $P_1$ | 0 | 7 |
| $P_2$ | 2 | 4 |
| $P_3$ | 4 | 1 |
| $P_4$ | 5 | 4 |

The CPU scheduler executes processes using the preemptive Shortest Remaining Time First (SRTF) scheduling algorithm. In the case of a tie in remaining burst time, priority is given to the process with the earlier arrival time. Context switch overhead is negligible (0 ms).

The average waiting time of the four processes is:

(A) 3.0 ms
(B) 3.5 ms
(C) 4.0 ms
(D) 4.5 ms

### Solution
Let us trace the execution of the processes under preemptive Shortest Remaining Time First (SRTF):

1. **At time $t = 0\text{ ms}$:**
   - Only process $P_1$ has arrived.
   - $P_1$ begins execution with remaining burst of $7\text{ ms}$.

2. **At time $t = 2\text{ ms}$:**
   - $P_1$ has executed for $2\text{ ms}$, so its remaining burst is $7 - 2 = 5\text{ ms}$.
   - Process $P_2$ arrives with burst time $4\text{ ms}$.
   - Compare remaining times: $\text{Remaining}(P_2) = 4 < \text{Remaining}(P_1) = 5$.
   - $P_1$ is preempted and placed back in the ready queue. $P_2$ is scheduled and starts executing.

3. **At time $t = 4\text{ ms}$:**
   - $P_2$ has executed for $2\text{ ms}$, so its remaining burst is $4 - 2 = 2\text{ ms}$.
   - Process $P_3$ arrives with burst time $1\text{ ms}$.
   - Compare remaining times: $\text{Remaining}(P_3) = 1 < \text{Remaining}(P_2) = 2 < \text{Remaining}(P_1) = 5$.
   - $P_2$ is preempted. $P_3$ is scheduled and executes from $t = 4$ to $t = 5\text{ ms}$.

4. **At time $t = 5\text{ ms}$:**
   - $P_3$ finishes execution ($\text{Completion Time}(P_3) = 5\text{ ms}$).
   - Process $P_4$ arrives with burst time $4\text{ ms}$.
   - The ready queue contains:
     - $P_2$ with remaining burst $2\text{ ms}$
     - $P_4$ with remaining burst $4\text{ ms}$
     - $P_1$ with remaining burst $5\text{ ms}$
   - The process with the shortest remaining time is $P_2$ ($2\text{ ms}$).
   - $P_2$ resumes execution and runs from $t = 5$ to $t = 7\text{ ms}$.
   - $P_2$ finishes execution ($\text{Completion Time}(P_2) = 7\text{ ms}$).

5. **At time $t = 7\text{ ms}$:**
   - The ready queue contains $P_4$ ($4\text{ ms}$) and $P_1$ ($5\text{ ms}$).
   - Shortest remaining time is $P_4$ ($4\text{ ms}$).
   - $P_4$ executes from $t = 7$ to $t = 11\text{ ms}$.
   - $P_4$ finishes execution ($\text{Completion Time}(P_4) = 11\text{ ms}$).

6. **At time $t = 11\text{ ms}$:**
   - Only $P_1$ remains with remaining burst $5\text{ ms}$.
   - $P_1$ resumes and executes from $t = 11$ to $t = 16\text{ ms}$.
   - $P_1$ finishes execution ($\text{Completion Time}(P_1) = 16\text{ ms}$).

---

**Summary Table:**

| Process | Arrival Time | Burst Time | Completion Time | Turnaround Time ($\text{CT} - \text{AT}$) | Waiting Time ($\text{TAT} - \text{BT}$) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $P_1$ | 0 | 7 | 16 | $16 - 0 = 16$ | $16 - 7 = 9$ |
| $P_2$ | 2 | 4 | 7 | $7 - 2 = 5$ | $5 - 4 = 1$ |
| $P_3$ | 4 | 1 | 5 | $5 - 4 = 1$ | $1 - 1 = 0$ |
| $P_4$ | 5 | 4 | 11 | $11 - 5 = 6$ | $6 - 4 = 2$ |

$$\text{Total Waiting Time} = 9 + 1 + 0 + 2 = 12\text{ ms}$$
$$\text{Average Waiting Time} = \frac{12}{4} = 3.0\text{ ms}$$

Hence, (A) is the correct option.

## Q2
type: MCQ
marks: 1
subject: dbms
topic: functional-dependencies-normal-forms
answer: A

Consider a relation schema $R(A, B, C, D, E)$ with the following set of functional dependencies:

$$F = \{ AB \to C, \quad C \to D, \quad D \to B, \quad D \to E \}$$

What is the highest normal form satisfied by relation $R$?

(A) 1NF
(B) 2NF
(C) 3NF
(D) BCNF

### Solution
Let us determine the candidate keys, prime attributes, and normal form of $R(A, B, C, D, E)$:

1. **Find Candidate Keys of $R$:**
   - Inspect the right-hand sides of all functional dependencies:
     - $C$ appears on the RHS of $AB \to C$
     - $D$ appears on the RHS of $C \to D$
     - $B$ appears on the RHS of $D \to B$
     - $E$ appears on the RHS of $D \to E$
     - Attribute $A$ does **not** appear on the right-hand side of any functional dependency.
   - Therefore, attribute $A$ must be an essential part of every candidate key of $R$.
   - Compute closures starting with $A$:
     - $(AB)^+ = \{A, B\} \xrightarrow{AB \to C} \{A, B, C\} \xrightarrow{C \to D} \{A, B, C, D\} \xrightarrow{D \to E} \{A, B, C, D, E\} = R$.
       Thus, **$AB$ is a candidate key**.
     - Since $D \to B$, replacing $B$ with $D$ gives:
       $(AD)^+ = \{A, D\} \xrightarrow{D \to B} \{A, B, D\} \xrightarrow{AB \to C} \{A, B, C, D\} \xrightarrow{D \to E} R$.
       Thus, **$AD$ is a candidate key**.
     - Since $C \to D$, replacing $D$ with $C$ gives:
       $(AC)^+ = \{A, C\} \xrightarrow{C \to D} \{A, C, D\} \dots = R$.
       Thus, **$AC$ is a candidate key**.
   - No other attribute or subset can form a candidate key.
   - Candidate keys of $R$: $\{ AB, \; AC, \; AD \}$.

2. **Identify Prime and Non-Prime Attributes:**
   - **Prime attributes** (attributes that belong to at least one candidate key): $\{ A, B, C, D \}$.
   - **Non-prime attributes** (attributes that do not belong to any candidate key): $\{ E \}$.

3. **Check for Second Normal Form (2NF):**
   - A relation schema is in 2NF if it is in 1NF and **no non-prime attribute is partially dependent on any candidate key**.
   - That is, for every non-prime attribute $Y$ and candidate key $K$, no proper subset $X \subset K$ can functionally determine $Y$ ($X \to Y$).
   - Examine the candidate key $AD$:
     - The proper subsets of candidate key $AD$ are $\{A\}$ and $\{D\}$.
     - Consider the functional dependency $D \to E \in F$:
       - The left-hand side is $D$, which is a **proper subset** of candidate key $AD$.
       - The right-hand side is $E$, which is a **non-prime attribute**.
     - Therefore, $D \to E$ constitutes a **partial dependency** of non-prime attribute $E$ on candidate key $AD$.
   - Because of this partial dependency, relation $R$ violates 2NF!

*(GATE Trap: Many students mistakenly think that because $D$ is a prime attribute, the dependency $D \to E$ does not violate 2NF. However, the definition of 2NF strictly prohibits any non-prime attribute from being determined by a proper subset of ANY candidate key. Since $D \subset AD$, $D \to E$ directly violates 2NF).*

Therefore, the highest normal form satisfied by relation $R$ is 1NF.

Hence, (A) is the correct option.

## Q3
type: MCQ
marks: 1
subject: toc
topic: regular-expressions-finite-automata
answer: A

Consider the Non-deterministic Finite Automaton (NFA) $N = (Q, \Sigma, \delta, p, F)$ over the alphabet $\Sigma = \{0, 1\}$ defined as:
- State set: $Q = \{p, q, r\}$
- Start state: $p$
- Accepting state set: $F = \{r\}$
- Transition function $\delta$:
  - $\delta(p, 0) = \{p, q\}, \quad \delta(p, 1) = \{p\}$
  - $\delta(q, 0) = \emptyset, \quad \delta(q, 1) = \{r\}$
  - $\delta(r, 0) = \emptyset, \quad \delta(r, 1) = \emptyset$

When converted to an equivalent minimal complete Deterministic Finite Automaton (DFA), what is the total number of states in the minimal DFA?

(A) 3
(B) 4
(C) 5
(D) 8

### Solution
Let us determine the language accepted by NFA $N$ and construct the equivalent minimal DFA using the standard powerset (subset) construction:

1. **Language Analysis:**
   - From start state $p$, the automaton can loop on any sequence of $0$'s and $1$'s ($\delta(p, 0) \ni p, \; \delta(p, 1) \ni p$).
   - Upon reading a symbol $0$, the automaton can non-deterministically transition to state $q$.
   - From state $q$, reading a symbol $1$ transitions to the accepting state $r$.
   - State $r$ has no outgoing transitions.
   - Therefore, a string is accepted if and only if it terminates with the suffix $01$.
   - The language accepted is:
     $$L(N) = (0 + 1)^* 01$$

2. **Subset Construction:**
   - **Initial state:** $S_0 = \{p\}$.
     - On input 0: $\delta(p, 0) = \{p, q\}$. Let $S_1 = \{p, q\}$.
     - On input 1: $\delta(p, 1) = \{p\} = S_0$.
   - **State $S_1 = \{p, q\}$:**
     - On input 0: $\delta(p, 0) \cup \delta(q, 0) = \{p, q\} \cup \emptyset = \{p, q\} = S_1$.
     - On input 1: $\delta(p, 1) \cup \delta(q, 1) = \{p\} \cup \{r\} = \{p, r\}$. Let $S_2 = \{p, r\}$.
   - **State $S_2 = \{p, r\}$ (Accepting state, since $r \in F$):**
     - On input 0: $\delta(p, 0) \cup \delta(r, 0) = \{p, q\} \cup \emptyset = \{p, q\} = S_1$.
     - On input 1: $\delta(p, 1) \cup \delta(r, 1) = \{p\} \cup \emptyset = \{p\} = S_0$.

   No additional subset states are reachable. The reachable DFA states are $\{S_0, S_1, S_2\}$.

3. **Verifying Minimality (Pairwise Distinguishability):**
   - $S_2$ is an accepting state ($r \in S_2$), while $S_0$ and $S_1$ are non-accepting states. Hence, $S_2$ is distinguished from $\{S_0, S_1\}$ by the empty suffix $\epsilon$.
   - Distinguishing $S_0$ and $S_1$:
     - On input 1: from $S_0 \xrightarrow{1} S_0$ (non-accepting), while from $S_1 \xrightarrow{1} S_2$ (accepting).
     - Thus, input suffix $1$ distinguishes $S_0$ from $S_1$.

All 3 reachable states are pairwise distinguishable. Thus, the minimal complete DFA contains exactly 3 states.

Hence, (A) is the correct option.

## Q4
type: NAT
marks: 1
subject: os
topic: memory-management
answer: 512

A computer system uses the binary buddy system for dynamic memory management. Initially, the memory consists of a single contiguous free block of size $1024\text{ KB}$ spanning physical addresses $0\text{ KB}$ to $1023\text{ KB}$.

The following memory requests arrive sequentially:
1. Process $P_1$ requests $110\text{ KB}$
2. Process $P_2$ requests $230\text{ KB}$
3. Process $P_3$ requests $70\text{ KB}$
4. Process $P_4$ requests $55\text{ KB}$

Whenever a block is split into two buddies, the buddy with the lower physical address is selected first for allocation.

The starting physical address (in KB) of the block allocated to Process $P_4$ is ______.

### Solution
In a binary buddy system, a request of size $S$ is allocated the smallest block of size $2^k$ such that $2^k \ge S$.

Let us trace the allocations step by step:

1. **Initial state:**
   One free block $[0, 1024)$ of size $1024\text{ KB}$.

2. **Process $P_1$ requests $110\text{ KB}$:**
   - Smallest power of 2 greater than or equal to $110\text{ KB}$ is $2^7 = 128\text{ KB}$.
   - Split $[0, 1024)$ into buddies $[0, 512)$ and $[512, 1024)$.
   - Split $[0, 512)$ into buddies $[0, 256)$ and $[256, 512)$.
   - Split $[0, 256)$ into buddies $[0, 128)$ and $[128, 256)$.
   - Allocate the lower buddy $[0, 128)$ to $P_1$.
   - Free blocks list:
     - Size $128\text{ KB}$: $[128, 256)$
     - Size $256\text{ KB}$: $[256, 512)$
     - Size $512\text{ KB}$: $[512, 1024)$

3. **Process $P_2$ requests $230\text{ KB}$:**
   - Smallest power of 2 greater than or equal to $230\text{ KB}$ is $2^8 = 256\text{ KB}$.
   - A free block of size $256\text{ KB}$ is directly available: $[256, 512)$.
   - Allocate $[256, 512)$ to $P_2$.
   - Free blocks list:
     - Size $128\text{ KB}$: $[128, 256)$
     - Size $512\text{ KB}$: $[512, 1024)$

4. **Process $P_3$ requests $70\text{ KB}$:**
   - Smallest power of 2 greater than or equal to $70\text{ KB}$ is $2^7 = 128\text{ KB}$.
   - A free block of size $128\text{ KB}$ is directly available: $[128, 256)$.
   - Allocate $[128, 256)$ to $P_3$.
   - Free blocks list:
     - Size $512\text{ KB}$: $[512, 1024)$

5. **Process $P_4$ requests $55\text{ KB}$:**
   - Smallest power of 2 greater than or equal to $55\text{ KB}$ is $2^6 = 64\text{ KB}$.
   - The smallest available free block is $[512, 1024)$ of size $512\text{ KB}$.
   - Split $[512, 1024)$ into $[512, 768)$ and $[768, 1024)$ (size $256\text{ KB}$).
   - Split $[512, 768)$ into $[512, 640)$ and $[640, 768)$ (size $128\text{ KB}$).
   - Split $[512, 640)$ into $[512, 576)$ and $[576, 640)$ (size $64\text{ KB}$).
   - Allocate the lower buddy $[512, 576)$ to $P_4$.

The allocated block for $P_4$ is $[512, 576)$ of size $64\text{ KB}$.
Its starting physical address is 512 KB.

Hence, the answer is 512.

## Q5
type: MCQ
marks: 1
subject: dbms
topic: transactions-concurrency-control
answer: A

Consider the following concurrent schedule $S$ involving four transactions $T_1, T_2, T_3,$ and $T_4$:

$$S: r_1(A); \quad w_1(B); \quad r_2(B); \quad w_2(C); \quad r_3(B); \quad w_3(D); \quad r_4(C); \quad r_4(D)$$

Which of the following statements is TRUE regarding schedule $S$?

(A) $S$ is conflict serializable with exactly 2 conflict equivalent serial schedules: $T_1 \to T_2 \to T_3 \to T_4$ and $T_1 \to T_3 \to T_2 \to T_4$
(B) $S$ is conflict serializable with a unique equivalent serial schedule: $T_1 \to T_2 \to T_3 \to T_4$
(C) $S$ is conflict serializable with exactly 4 conflict equivalent serial schedules
(D) $S$ is not conflict serializable

### Solution
Let us construct the precedence (serialization) graph for schedule $S$:
A directed edge $T_i \to T_j$ exists if an operation of $T_i$ precedes a conflicting operation of $T_j$ on the same data item (where at least one operation is a write).

Let us check conflicts on each data item in chronological order:
1. **On data item $A$:**
   - Only operation $r_1(A)$ occurs. No conflicts.

2. **On data item $B$:**
   - $w_1(B)$ occurs at step 2.
   - $r_2(B)$ occurs at step 3. Since $w_1(B)$ precedes $r_2(B)$, we have edge: **$T_1 \to T_2$**.
   - $r_3(B)$ occurs at step 5. Since $w_1(B)$ precedes $r_3(B)$, we have edge: **$T_1 \to T_3$**.
   - Between $r_2(B)$ and $r_3(B)$: both are read operations, so no conflict between $T_2$ and $T_3$.

3. **On data item $C$:**
   - $w_2(C)$ occurs at step 4.
   - $r_4(C)$ occurs at step 7. Since $w_2(C)$ precedes $r_4(C)$, we have edge: **$T_2 \to T_4$**.

4. **On data item $D$:**
   - $w_3(D)$ occurs at step 6.
   - $r_4(D)$ occurs at step 8. Since $w_3(D)$ precedes $r_4(D)$, we have edge: **$T_3 \to T_4$**.

5. **Precedence Graph Structure:**
   - Directed edges: $\{ T_1 \to T_2, \; T_1 \to T_3, \; T_2 \to T_4, \; T_3 \to T_4 \}$.
   - The graph contains no cycles (it is a DAG). Hence, schedule $S$ is **conflict serializable**.

6. **Topological Sorts (Equivalent Serial Orders):**
   - $T_1$ has in-degree 0; it must appear first.
   - $T_4$ has out-degree 0; it must appear last.
   - $T_2$ and $T_3$ are independent of each other (no directed edge between them).
   - Thus, there are exactly 2 valid topological orderings:
     1. $T_1 \to T_2 \to T_3 \to T_4$
     2. $T_1 \to T_3 \to T_2 \to T_4$

Hence, (A) is the correct option.

## Q6
type: NAT
marks: 1
subject: toc
topic: context-free-grammars-pda
answer: 4

Consider the Context-Free Grammar $G = (\{S\}, \{a, b\}, R, S)$ with production rules:

$$S \to a S b \mid b S a \mid \epsilon$$

The total number of distinct strings of length 4 belonging to the language $L(G)$ is ______.

### Solution
Let us determine the strings of length 4 that can be generated by grammar $G$:

1. **Length of derivations:**
   - The base rule $S \to \epsilon$ produces 0 terminals.
   - Each recursive rule ($S \to aSb$ or $S \to bSa$) adds exactly 2 terminal symbols (one at the front, one at the back).
   - Therefore, to derive a string of length 4 requires applying recursive production rules exactly 2 times, followed by $S \to \epsilon$:
     $$S \implies \text{Rule 1} \implies \text{Rule 2} \implies \epsilon$$

2. **Enumerating all 2-step derivations:**
   - **Case 1:** First rule $S \to aSb$:
     - Then $S \to aSb \implies a(aSb)b \xrightarrow{S \to \epsilon} \mathbf{aabb}$
     - Then $S \to bSa \implies a(bSa)b \xrightarrow{S \to \epsilon} \mathbf{abab}$
   - **Case 2:** First rule $S \to bSa$:
     - Then $S \to aSb \implies b(aSb)a \xrightarrow{S \to \epsilon} \mathbf{baba}$
     - Then $S \to bSa \implies b(bSa)a \xrightarrow{S \to \epsilon} \mathbf{bbaa}$

3. **Why $abba$ and $baab$ cannot be generated:**
   - There are $\binom{4}{2} = 6$ total strings of length 4 with two $a$'s and two $b$'s: $\{ aabb, abab, abba, baab, baba, bbaa \}$.
   - Notice that every rule in $G$ forces the outer symbols to be opposite:
     - $S \to aSb$ produces strings that start with $a$ and end with $b$.
     - $S \to bSa$ produces strings that start with $b$ and end with $a$.
   - A string like $abba$ starts with $a$ and ends with $a$, while $baab$ starts with $b$ and ends with $b$. Neither can ever be generated by $G$.

Thus, exactly 4 distinct strings of length 4 belong to $L(G)$: $\{ aabb, abab, baba, bbaa \}$.

Hence, the answer is 4.

## Q7
type: MCQ
marks: 2
subject: os
topic: concurrency-synchronization
answer: A

Consider the classical Bounded Buffer (Producer-Consumer) synchronization problem using counting and binary semaphores:
- Buffer capacity $= N$ slots
- `mutex` is a binary semaphore initialized to 1
- `empty` is a counting semaphore initialized to $N$
- `full` is a counting semaphore initialized to 0

Suppose a programmer implements the Producer and Consumer processes with the semaphore wait operations ordered as follows:

```c
// Producer process:
while (true) {
    /* produce an item */
    wait(mutex);
    wait(empty);
    /* add item to buffer */
    signal(mutex);
    signal(full);
}

// Consumer process:
while (true) {
    wait(full);
    wait(mutex);
    /* remove item from buffer */
    signal(mutex);
    signal(empty);
    /* consume the item */
}
```

Which of the following statements is TRUE regarding this implementation?

(A) If the buffer becomes completely full ($N$ items), a deadlock can occur because the Producer acquires `mutex` and blocks on `wait(empty)`, preventing the Consumer from entering its critical section to free a buffer slot.
(B) Mutual exclusion inside the critical section is violated, allowing the Producer and Consumer to access the buffer simultaneously.
(C) The implementation works correctly without any possibility of deadlock under all possible execution interleavings.
(D) If the buffer becomes completely empty (0 items), a deadlock can occur because the Consumer acquires `mutex` and blocks on `wait(full)`.

### Solution
Let us trace the behavior of the semaphores under this implementation:

1. **Trace when the buffer is full ($empty = 0, full = N$):**
   - Suppose all $N$ slots of the buffer are currently occupied.
   - The Producer process attempts to produce another item:
     1. Producer executes `wait(mutex)`. Since `mutex = 1`, it decrements `mutex` to 0 and acquires the mutual exclusion lock.
     2. Producer then executes `wait(empty)`. Since `empty = 0`, the Producer is **blocked** waiting for an empty slot. Crucially, the Producer is blocked **while still holding the `mutex` lock**.
   - Now, the Consumer process attempts to consume an item:
     1. Consumer executes `wait(full)`. Since `full = N > 0`, it decrements `full` to $N - 1$ and proceeds.
     2. Consumer executes `wait(mutex)`. Because `mutex` is currently 0 (held by the blocked Producer), the Consumer is **blocked** waiting for `mutex`.
   - **Deadlock condition:**
     - The Producer is waiting for the Consumer to signal `empty` (which happens only after removing an item inside the critical section).
     - The Consumer is waiting for the Producer to signal `mutex`.
     - Neither process can make progress. A circular wait has formed, causing a **system deadlock**.
   - Thus, statement (A) is **TRUE**.

2. **Why statement (D) is FALSE:**
   - In the Consumer code, the order of wait operations is:
     `wait(full); wait(mutex);`
   - If the buffer is empty ($full = 0$), the Consumer calls `wait(full)` and blocks **before** acquiring `mutex`.
   - Because the Consumer does not hold `mutex`, the Producer can still acquire `mutex`, insert an item, and signal `full`, awakening the Consumer. No deadlock occurs when the buffer is empty.

3. **Why statement (B) is FALSE:**
   - In both processes, the buffer access is enclosed within `wait(mutex)` and `signal(mutex)`. Mutual exclusion is never violated.

Therefore, statement (A) is the correct statement.

Hence, (A) is the correct option.

## Q8
type: NAT
marks: 2
subject: os
topic: virtual-memory
answer: 7

Consider a demand-paged virtual memory system with 4 physical page frames, all initially empty. A process generates the following sequence of page references:

$$1, \quad 2, \quad 3, \quad 4, \quad 2, \quad 1, \quad 5, \quad 6, \quad 2, \quad 1, \quad 2, \quad 3$$

The operating system manages page replacement using the Least Recently Used (LRU) algorithm.

The total number of page faults that occur during the execution of this page reference sequence is ______.

### Solution
Let us trace the state of the 4 physical page frames under the LRU page replacement algorithm:
We maintain the set of resident pages ordered from **Most Recently Used (MRU)** to **Least Recently Used (LRU)**.

1. **Ref 1:** Page 1 is referenced.
   - Frame state: `[1]`
   - Outcome: **Page Fault 1**
   - Recency order: `(MRU) 1 (LRU)`

2. **Ref 2:** Page 2 is referenced.
   - Frame state: `[1, 2]`
   - Outcome: **Page Fault 2**
   - Recency order: `(MRU) 2, 1 (LRU)`

3. **Ref 3:** Page 3 is referenced.
   - Frame state: `[1, 2, 3]`
   - Outcome: **Page Fault 3**
   - Recency order: `(MRU) 3, 2, 1 (LRU)`

4. **Ref 4:** Page 4 is referenced.
   - Frame state: `[1, 2, 3, 4]` (All 4 frames are now occupied)
   - Outcome: **Page Fault 4**
   - Recency order: `(MRU) 4, 3, 2, 1 (LRU)`

5. **Ref 2:** Page 2 is referenced.
   - Page 2 is already resident in memory.
   - Outcome: **HIT**
   - Recency order updated: `(MRU) 2, 4, 3, 1 (LRU)`

6. **Ref 1:** Page 1 is referenced.
   - Page 1 is already resident in memory.
   - Outcome: **HIT**
   - Recency order updated: `(MRU) 1, 2, 4, 3 (LRU)`

7. **Ref 5:** Page 5 is referenced.
   - Page 5 is not in memory.
   - Outcome: **Page Fault 5**
   - Victim selection: The LRU page is 3 (at the tail of the recency list).
   - Page 3 is evicted and replaced by 5.
   - Frame state: `[1, 2, 5, 4]`
   - Recency order: `(MRU) 5, 1, 2, 4 (LRU)`

8. **Ref 6:** Page 6 is referenced.
   - Page 6 is not in memory.
   - Outcome: **Page Fault 6**
   - Victim selection: The LRU page is 4 (at the tail of the recency list).
   - Page 4 is evicted and replaced by 6.
   - Frame state: `[1, 2, 5, 6]`
   - Recency order: `(MRU) 6, 5, 1, 2 (LRU)`

9. **Ref 2:** Page 2 is referenced.
   - Page 2 is already resident in memory.
   - Outcome: **HIT**
   - Recency order updated: `(MRU) 2, 6, 5, 1 (LRU)`

10. **Ref 1:** Page 1 is referenced.
    - Page 1 is already resident in memory.
    - Outcome: **HIT**
    - Recency order updated: `(MRU) 1, 2, 6, 5 (LRU)`

11. **Ref 2:** Page 2 is referenced.
    - Page 2 is already resident in memory.
    - Outcome: **HIT**
    - Recency order updated: `(MRU) 2, 1, 6, 5 (LRU)`

12. **Ref 3:** Page 3 is referenced.
    - Page 3 is not in memory.
    - Outcome: **Page Fault 7**
    - Victim selection: The LRU page is 5 (at the tail of the recency list).
    - Page 5 is evicted and replaced by 3.
    - Frame state: `[1, 2, 3, 6]`
    - Recency order: `(MRU) 3, 2, 1, 6 (LRU)`

---

**Summary:**
- Total Page References: 12
- Hits: 5 (at references 5, 6, 9, 10, 11)
- Page Faults: 7 (at references 1, 2, 3, 4, 7, 8, 12)

Hence, the answer is 7.

## Q9
type: MSQ
marks: 2
subject: os
topic: file-systems-io
answer: A, B, C

Consider the implementation of file linking (hard links and symbolic/soft links) in a UNIX-like operating system with an inode-based file system architecture. Which of the following statements is/are TRUE?

(A) Creating a hard link to an existing file increments the reference count (`i_nlink`) stored in the file's inode, whereas creating a symbolic link creates a distinct new inode with its own link count initialized to 1.
(B) A hard link cannot be created across different file systems (mount points), whereas a symbolic link can reference files residing on different file systems.
(C) When a file's original directory entry is removed using the `rm` command, all existing symbolic links pointing to that file become dangling links, but any existing hard links continue to provide access to the file's data blocks.
(D) Standard non-privileged users are permitted to create hard links to directories in order to create cyclic directory structures.

### Solution
Let us evaluate each statement based on UNIX file system design principles:

- **Statement (A) is TRUE:**
  - A **hard link** is simply a directory entry that maps a new filename to an already existing inode number. The inode itself records the total number of directory entries referencing it in the `i_nlink` counter. When a new hard link is created via `link()`, `i_nlink` is incremented by 1.
  - A **symbolic link** is an entirely separate file with file type `S_IFLNK`. It is assigned a brand-new inode, its own `i_nlink` is initialized to 1, and its data block contains the pathname string of the target file. It does not alter the target file's inode link count.

- **Statement (B) is TRUE:**
  - Inode numbers are unique only within a specific file system / partition. Because a hard link directly references an inode number, the operating system kernel cannot resolve hard links across different disk partitions or mount points (attempting to do so triggers the `EXDEV: Invalid cross-device link` error).
  - A symbolic link stores a textual path string (such as `/mnt/disk2/file.txt`), which is parsed by standard pathname resolution across arbitrary mount points.

- **Statement (C) is TRUE:**
  - The `rm` command invokes the `unlink()` system call, which deletes the specified directory entry and decrements `i_nlink` by 1. The underlying inode and data blocks are reclaimed only when `i_nlink` drops to 0 and all open file descriptors are closed.
  - Therefore, if other hard links exist, `i_nlink \ge 1`, and those hard links continue to access the underlying inode and data blocks without interruption.
  - Conversely, a symbolic link merely stores the target path; once the target directory entry is removed, resolving the symbolic link fails with `ENOENT` (File not found), making it a dangling link.

- **Statement (D) is FALSE:**
  - Standard UNIX and POSIX specifications forbid users (and modern kernels strictly forbid even the root superuser) from creating hard links to directories. Allowing hard links to directories would transform the directory hierarchy from a Directed Acyclic Graph (DAG) into a general directed graph with cycles, which would cause infinite loops in directory traversal tools (`find`, `du`) and break file system integrity checks (`fsck`).

Therefore, statements A, B, and C are TRUE.

## Q10
type: NAT
marks: 2
subject: dbms
topic: sql
answer: 25000

Consider the relational table `Employees` populated with the following 8 rows:

| emp_id | dept_name | salary |
| :--- | :--- | :--- |
| 101 | HR | 4000 |
| 102 | HR | 6000 |
| 103 | HR | 8000 |
| 104 | IT | 5000 |
| 105 | IT | 5000 |
| 106 | IT | 11000 |
| 107 | Sales | 7000 |
| 108 | Sales | 7000 |

Consider the following SQL query executed on table `Employees`:

```sql
SELECT SUM(salary)
FROM Employees E1
WHERE salary >= (
    SELECT AVG(salary)
    FROM Employees E2
    WHERE E2.dept_name = E1.dept_name
) AND dept_name IN ('HR', 'IT');
```

The numeric value returned by this query is ______.

### Solution
Let us trace the query execution following standard SQL correlated subquery semantics:

1. **Evaluate the `dept_name IN ('HR', 'IT')` filter:**
   Employees belonging to the `'Sales'` department (emp_id 107 and 108) are immediately excluded by the outer query condition.

2. **Compute department average salaries via the correlated subquery:**
   - **For `dept_name = 'HR'`:**
     The employees in HR have salaries $\{4000, 6000, 8000\}$.
     $$\text{AVG}(\text{salary})_{\text{HR}} = \frac{4000 + 6000 + 8000}{3} = \frac{18000}{3} = 6000$$

   - **For `dept_name = 'IT'`:**
     The employees in IT have salaries $\{5000, 5000, 11000\}$.
     $$\text{AVG}(\text{salary})_{\text{IT}} = \frac{5000 + 5000 + 11000}{3} = \frac{21000}{3} = 7000$$

3. **Evaluate the condition `salary >= AVG(salary)` for each candidate employee:**
   - **HR department (Threshold $\ge 6000$):**
     - Employee 101: `salary = 4000`. $4000 \ge 6000$ is FALSE $\implies$ Discarded.
     - Employee 102: `salary = 6000`. $6000 \ge 6000$ is TRUE (since condition uses `>=`) $\implies$ **Kept**.
     - Employee 103: `salary = 8000`. $8000 \ge 6000$ is TRUE $\implies$ **Kept**.
   - **IT department (Threshold $\ge 7000$):**
     - Employee 104: `salary = 5000`. $5000 \ge 7000$ is FALSE $\implies$ Discarded.
     - Employee 105: `salary = 5000`. $5000 \ge 7000$ is FALSE $\implies$ Discarded.
     - Employee 106: `salary = 11000`. $11000 \ge 7000$ is TRUE $\implies$ **Kept**.

4. **Compute `SUM(salary)` over all surviving employees:**
   The surviving employees are $\{102, 103, 106\}$.
   $$\text{SUM}(\text{salary}) = \text{salary}(102) + \text{salary}(103) + \text{salary}(106)$$
   $$\text{SUM}(\text{salary}) = 6000 + 8000 + 11000 = 25000$$

Hence, the answer is 25000.

## Q11
type: MCQ
marks: 2
subject: dbms
topic: file-organization-indexing
answer: A

A B+ tree index is constructed on a disk where the block size is $2048\text{ bytes}$. The index parameters are as follows:
- Search key size $= 16\text{ bytes}$
- Record pointer (pointer to the actual data record on disk) size $= 8\text{ bytes}$
- Block pointer (pointer to a sibling leaf node) size $= 8\text{ bytes}$

Each leaf node stores pairs of `(search key, record pointer)` along with one block pointer to the next leaf node in the sequential chain.

What is the MAXIMUM number of search key values that can be stored in a single leaf node of this B+ tree, and the MINIMUM number of search key values a non-root leaf node must store to satisfy standard B+ tree occupancy constraints?

(A) Maximum: 85, Minimum: 43
(B) Maximum: 85, Minimum: 42
(C) Maximum: 84, Minimum: 42
(D) Maximum: 86, Minimum: 43

### Solution
Let us determine the maximum and minimum key capacities of a leaf node in the B+ tree:

1. **Maximum search keys in a leaf node ($m_{\max}$):**
   In a B+ tree leaf node:
   - Each entry consists of one search key and one record pointer.
     $$\text{Size of one data entry} = 16\text{ bytes} + 8\text{ bytes} = 24\text{ bytes}$$
   - For $m$ search key entries, the space consumed is $24m\text{ bytes}$.
   - Additionally, each leaf node contains exactly one block pointer ($8\text{ bytes}$) pointing to the next sibling leaf node.
   - The total space occupied must not exceed the block size ($2048\text{ bytes}$):
     $$m \times (\text{key size} + \text{record pointer size}) + \text{block pointer size} \le \text{Block size}$$
     $$m \times 24 + 8 \le 2048$$
     $$24m \le 2040$$
     $$m \le \frac{2040}{24} = 85$$
   - Since $85 \times 24 + 8 = 2040 + 8 = 2048\text{ bytes}$, which fits exactly into the disk block:
     $$m_{\max} = 85$$

2. **Minimum search keys in a non-root leaf node ($m_{\min}$):**
   By the standard definition of B+ trees (Elmasri & Navathe / Silberschatz):
   - Every non-root leaf node must be at least half full.
   - The minimum number of key entries in a non-root leaf node is given by:
     $$m_{\min} = \left\lceil \frac{m_{\max}}{2} \right\rceil$$
     $$m_{\min} = \left\lceil \frac{85}{2} \right\rceil = \lceil 42.5 \rceil = 43$$

Therefore:
- Maximum search keys $= 85$
- Minimum search keys $= 43$

Hence, (A) is the correct option.

## Q12
type: MSQ
marks: 2
subject: dbms
topic: relational-algebra-calculus
answer: A, B, C

Let $R(A, B)$ and $S(B, C)$ be two relation schemas, and let $c, c_1,$ and $c_2$ denote selection conditions. Which of the following relational algebra equivalences is/are ALWAYS TRUE for arbitrary relational instances of $R$ and $S$?

(A) $\sigma_{c_1 \land c_2}(R) = \sigma_{c_1}(\sigma_{c_2}(R))$
(B) If selection condition $c$ involves only attributes present in relation $R$, then $\sigma_c(R \bowtie S) = (\sigma_c(R)) \bowtie S$
(C) $\sigma_c(R \setminus T) = \sigma_c(R) \setminus \sigma_c(T)$, where $R$ and $T$ are union-compatible relations
(D) For any selection condition $c$, $\Pi_A(\sigma_c(R)) = \sigma_c(\Pi_A(R))$

### Solution
Let us evaluate each relational algebra equivalence:

- **Statement (A) is TRUE (Cascade of Selections):**
  A tuple $t \in \sigma_{c_1 \land c_2}(R)$ if and only if $t \in R$ and both $c_1(t)$ and $c_2(t)$ evaluate to true.
  In $\sigma_{c_1}(\sigma_{c_2}(R))$, the inner selection retains only tuples satisfying $c_2$, and the outer selection filters for $c_1$. Since boolean AND is associative and commutative, this identity holds unconditionally for all relations.

- **Statement (B) is TRUE (Pushing Selection through Natural Join):**
  A tuple $(a, b, c) \in \sigma_c(R \bowtie S)$ if and only if $(a, b) \in R$, $(b, c) \in S$, and condition $c$ evaluates to true on $(a, b, c)$.
  Because condition $c$ references only attributes belonging to $R$, evaluating $c$ depends strictly on attribute values in $R$.
  Therefore, filtering $R$ first via $\sigma_c(R)$ and then joining with $S$ yields the exact same set of tuples:
  $$\sigma_c(R \bowtie S) = (\sigma_c(R)) \bowtie S$$
  This is a foundational equivalence used by database query optimizers to reduce intermediate join sizes.

- **Statement (C) is TRUE (Distribution of Selection over Set Difference):**
  Let $t$ be a tuple in the schema of $R$ and $T$:
  $$t \in \sigma_c(R \setminus T) \iff t \in (R \setminus T) \land c(t) \iff t \in R \land t \notin T \land c(t)$$
  Now examine the right-hand side $\sigma_c(R) \setminus \sigma_c(T)$:
  $$t \in (\sigma_c(R) \setminus \sigma_c(T)) \iff t \in \sigma_c(R) \land t \notin \sigma_c(T) \iff (t \in R \land c(t)) \land \neg(t \in T \land c(t))$$
  Since $c(t)$ is true, $\neg(t \in T \land c(t)) \iff \neg(t \in T) \iff t \notin T$.
  Both sides express the exact same logical condition: $(t \in R) \land (t \notin T) \land c(t)$.
  Thus, selection distributes unconditionally over set difference.

- **Statement (D) is FALSE:**
  Consider the case where condition $c$ references attribute $B$ (e.g., $c \equiv B > 10$).
  On the right-hand side, the projection $\Pi_A(R)$ removes attribute $B$ from the relation schema. Evaluating $\sigma_{B > 10}(\Pi_A(R))$ is syntactically invalid because attribute $B$ no longer exists in the relation.
  Even if $c$ references only attribute $A$, projection and selection cannot be arbitrarily commuted in general relational expressions.

Therefore, statements A, B, and C are ALWAYS TRUE.

## Q13
type: MCQ
marks: 2
subject: toc
topic: regular-languages
answer: B

Consider the language $L$ over the alphabet $\Sigma = \{0, 1\}$ defined as:

$$L = \{ w \in \{0, 1\}^* \mid |w|_0 \text{ is a multiple of } 3 \text{ and } |w|_1 \text{ is an even number} \}$$

What is the MINIMUM number of states in a complete Deterministic Finite Automaton (DFA) that accepts language $L$?

(A) 5
(B) 6
(C) 8
(D) 12

### Solution
Let us determine the minimal DFA state count for language $L$:

1. **State representation:**
   To decide whether a string $w$ belongs to $L$, an automaton must independently maintain:
   - The count of $0$'s modulo 3: $|w|_0 \pmod 3 \in \{0, 1, 2\}$ (3 equivalence classes).
   - The count of $1$'s modulo 2: $|w|_1 \pmod 2 \in \{0, 1\}$ (2 equivalence classes).
   Each state in the product automaton corresponds to a pair $(i, j)$ where $i \in \{0, 1, 2\}$ and $j \in \{0, 1\}$.
   The total number of states is:
   $$|Q| = 3 \times 2 = 6\text{ states}$$

2. **DFA definition:**
   - State set: $Q = \{ (i, j) \mid i \in \{0, 1, 2\}, \; j \in \{0, 1\} \}$.
   - Start state: $(0, 0)$ (for $\epsilon$, $|w|_0 = 0 \equiv 0 \pmod 3$ and $|w|_1 = 0 \equiv 0 \pmod 2$).
   - Accepting state: $F = \{ (0, 0) \}$.
   - Transitions:
     - On input $0$: $\delta((i, j), 0) = ((i + 1) \bmod 3, \; j)$.
     - On input $1$: $\delta((i, j), 1) = (i, \; (j + 1) \bmod 2)$.

3. **Verifying pairwise distinguishability of all 6 states:**
   Consider any two distinct states $s_1 = (i_1, j_1)$ and $s_2 = (i_2, j_2)$:
   - **Case 1: $j_1 \ne j_2$ (different parity of 1's):**
     Let $x = 0^{(3 - i_1) \bmod 3}$.
     - From $s_1$: reading $x$ leads to state $(0, j_1)$.
     - From $s_2$: reading $x$ leads to state $((i_2 + 3 - i_1) \bmod 3, j_2)$.
     Now append $1$ if $j_1 = 1$, or $\epsilon$ if $j_1 = 0$. Exactly one of the two branches reaches the accepting state $(0, 0)$, while the other does not.
   - **Case 2: $j_1 = j_2$, but $i_1 \ne i_2$ (different remainder of 0's):**
     Let $k = (3 - i_1) \bmod 3$.
     Consider string $z = 0^k 1^{(2 - j_1) \bmod 2}$:
     - From $s_1 = (i_1, j_1)$:
       $\delta(s_1, z) = ((i_1 + k) \bmod 3, (j_1 + 2 - j_1) \bmod 2) = (0, 0) \in F$ (accepted).
     - From $s_2 = (i_2, j_1)$:
       $\delta(s_2, z) = ((i_2 + k) \bmod 3, 0) \ne (0, 0)$ because $i_2 \ne i_1 \implies (i_2 + k) \not\equiv 0 \pmod 3$. Thus, $\delta(s_2, z) \notin F$ (rejected).
     - Therefore, string $z$ distinguishes $s_1$ and $s_2$.

Since all 6 states are pairwise distinguishable under the Myhill-Nerode relation, the minimal complete DFA contains exactly 6 states.

Hence, (B) is the correct option.

## Q14
type: MSQ
marks: 2
subject: toc
topic: context-free-languages
answer: A, D

Let $L$ be an arbitrary Context-Free Language (CFL), and let $R$ be an arbitrary Regular language over an alphabet $\Sigma$. Which of the following statements is/are ALWAYS TRUE?

(A) The set difference $L \setminus R$ is always a context-free language.
(B) The set difference $R \setminus L$ is always a context-free language.
(C) The intersection of two Deterministic Context-Free Languages (DCFLs) is always a context-free language.
(D) The problem of determining whether $L = \Sigma^*$ for an arbitrary context-free language $L$ is undecidable.

### Solution
Let us evaluate each statement individually:

- **Statement (A) is TRUE:**
  By set theory:
  $$L \setminus R = L \cap \overline{R}$$
  - Since $R$ is a regular language, its complement $\overline{R}$ is also a regular language (regular languages are closed under complementation).
  - The intersection of a context-free language with a regular language is always a context-free language:
    $$\text{CFL} \cap \text{Regular} = \text{CFL}$$
  - *Proof:* Given a Pushdown Automaton $M_1$ for $L$ and a DFA $M_2$ for $\overline{R}$, we can construct a product machine $M$ that simulates the transitions of $M_1$ on the stack while simultaneously tracking the finite state transitions of $M_2$. The product machine is a valid Pushdown Automaton that accepts $L \cap \overline{R}$.
  - Therefore, $L \setminus R$ is always a context-free language.

- **Statement (B) is FALSE:**
  $$R \setminus L = R \cap \overline{L}$$
  Because Context-Free Languages are **NOT closed under complementation**, the complement $\overline{L}$ is not necessarily a CFL, and $R \cap \overline{L}$ is not necessarily a CFL.
  *Counterexample:*
  - Choose alphabet $\Sigma = \{a, b, c\}$.
  - Let $R = \Sigma^* = (a + b + c)^*$ (which is regular).
  - Let $L = \overline{\{ a^n b^n c^n \mid n \ge 1 \}}$.
    It is a classic result that the complement of $\{ a^n b^n c^n \}$ is a context-free language (it can be generated by a CFG as the union of strings not of the form $a^* b^* c^*$ and strings where the count of $a$'s differs from $b$'s or $b$'s differs from $c$'s).
  - Then:
    $$R \setminus L = \Sigma^* \setminus \overline{\{ a^n b^n c^n \}} = \{ a^n b^n c^n \mid n \ge 1 \}$$
  - The resulting language $\{ a^n b^n c^n \}$ is well known to NOT be a context-free language.
  - Thus, $R \setminus L$ is not always context-free.

- **Statement (C) is FALSE:**
  The intersection of two DCFLs is not necessarily context-free.
  *Standard Counterexample:*
  - $L_1 = \{ a^n b^n c^m \mid n \ge 1, \; m \ge 1 \}$ (accepted by a DPDA, hence a DCFL).
  - $L_2 = \{ a^m b^n c^n \mid m \ge 1, \; n \ge 1 \}$ (accepted by a DPDA, hence a DCFL).
  - Their intersection is:
    $$L_1 \cap L_2 = \{ a^n b^n c^n \mid n \ge 1 \}$$
  - The language $\{ a^n b^n c^n \}$ is not even a context-free language.

- **Statement (D) is TRUE:**
  The universality (totality) problem for Context-Free Grammars asks: "Given a CFG $G$, is $L(G) = \Sigma^*$?"
  This problem is **undecidable** (in fact, co-RE complete). It is proven undecidable by reduction from the valid computation history problem of Turing machines.

Therefore, statements A and D are ALWAYS TRUE.

## Q15
type: NAT
marks: 2
subject: toc
topic: turing-machines-undecidability
answer: 2

Consider the following five decision problems regarding Turing machines (where $\langle M \rangle$ denotes the standard binary string encoding of Turing machine $M$):

- $P_1$: Given $\langle M \rangle$, does $M$ accept at least one string (i.e., is $L(M) \ne \emptyset$)?
- $P_2$: Given $\langle M \rangle$, does $M$ accept the input string $101$?
- $P_3$: Given $\langle M \rangle$, is $L(M) = \emptyset$?
- $P_4$: Given $\langle M \rangle$, does $M$ have at most 10 states?
- $P_5$: Given $\langle M \rangle$, is $L(M)$ a recursive (decidable) language?

The total number of problems among $\{P_1, P_2, P_3, P_4, P_5\}$ that are Recursively Enumerable (Turing-recognizable) but NOT Recursive (decidable) is ______.

### Solution
Let us systematically evaluate each decision problem using computability theory and Rice's Theorem:

1. **Problem $P_1$ ($L_{\text{non-empty}} = \{ \langle M \rangle \mid L(M) \ne \emptyset \}$):**
   - **Turing-recognizable (RE):** A Universal Turing Machine can simulate $M$ on all possible input strings $\{\epsilon, 0, 1, 00, 01, \dots\}$ in parallel using dove-tailing. If $M$ accepts any string, the simulation halts and accepts. Hence, $P_1$ is Recursively Enumerable.
   - **Undecidable (Not Recursive):** Being non-empty is a non-trivial semantic property of $L(M)$. By Rice's Theorem, $P_1$ is undecidable.
   - Therefore, $P_1$ is **RE but NOT Recursive**.

2. **Problem $P_2$ ($A_{TM}$ on string $101$: $\{ \langle M \rangle \mid 101 \in L(M) \}$):**
   - **Turing-recognizable (RE):** A Universal Turing Machine can simulate $M$ on input $101$. If $M$ halts and accepts, the simulator halts and accepts. Hence, $P_2$ is Recursively Enumerable.
   - **Undecidable (Not Recursive):** By the Halting problem reduction, deciding whether an arbitrary Turing machine accepts a fixed non-empty string is undecidable.
   - Therefore, $P_2$ is **RE but NOT Recursive**.

3. **Problem $P_3$ ($L_{\text{empty}} = \{ \langle M \rangle \mid L(M) = \emptyset \}$):**
   - $P_3$ is the exact complement of $P_1$ ($L_{\text{empty}} = \overline{L_{\text{non-empty}}}$).
   - Because $P_1$ is RE-complete and undecidable, its complement $L_{\text{empty}}$ is **co-RE, but NOT RE**.
   - Therefore, $P_3$ is not Recursively Enumerable.

4. **Problem $P_4$ (State count $\le 10$):**
   - The number of states in $M$ is a **syntactic property** of the description $\langle M \rangle$.
   - A decider Turing machine can simply parse the state set $Q$ from $\langle M \rangle$, count the number of states, and accept if $|Q| \le 10$ and reject otherwise. The decider always halts in finite time.
   - Therefore, $P_4$ is **Recursive (decidable)**.

5. **Problem $P_5$ ($L(M)$ is recursive):**
   - By Rice's Theorem, testing whether $L(M)$ satisfies any non-trivial semantic property is undecidable.
   - Furthermore, by the Rice-Shapiro theorem (or arithmetical hierarchy), the property of being recursive is non-monotone and resides at level $\Sigma_3$ of the arithmetical hierarchy.
   - Therefore, $P_5$ is **neither RE nor co-RE**.

---

**Summary Classification:**
- **RE but NOT Recursive:** $\{ P_1, P_2 \}$ (Total = 2)
- **Recursive (Decidable):** $\{ P_4 \}$
- **co-RE, not RE:** $\{ P_3 \}$
- **Neither RE nor co-RE:** $\{ P_5 \}$

The total number of problems that are Recursively Enumerable but NOT Recursive is 2.

Hence, the answer is 2.
