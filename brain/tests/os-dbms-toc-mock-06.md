---
title: "OS + DBMS + TOC · Mock 06"
duration: 45
created: 2026-11-03
description: "15-Question GATE-calibrated mock across Operating Systems, DBMS, and Theory of Computation."
---

## Q1
type: MCQ
marks: 1
subject: os
topic: cpu-scheduling
answer: A

Consider three processes $P_1, P_2, P_3$ arriving at times $0, 2, 4$ ms with CPU burst times $7, 4, 1$ ms respectively. The CPU scheduler uses Preemptive Shortest Remaining Time First (SRTF). All context switch overheads are zero. What is the average waiting time (in ms) of the processes?

(A) 2.0
(B) 3.33
(C) 4.0
(D) 6.0

### Solution
- **Execution timeline (Gantt chart):**
  - $t = 0$: Only $P_1$ has arrived (remaining burst = $7$). $P_1$ runs from $t = 0$ to $2$. Remaining burst of $P_1 = 5$.
  - $t = 2$: $P_2$ arrives with burst $4$. Since remaining burst of $P_2$ ($4$) < remaining burst of $P_1$ ($5$), $P_2$ preempts $P_1$. $P_2$ runs from $t = 2$ to $4$. Remaining burst of $P_2 = 2$.
  - $t = 4$: $P_3$ arrives with burst $1$. Remaining bursts: $P_1 = 5, P_2 = 2, P_3 = 1$. Since $1 < 2$, $P_3$ preempts $P_2$. $P_3$ runs from $t = 4$ to $5$ and completes at $t = 5$.
  - $t = 5$: $P_2$ resumes with remaining burst $2$. Runs from $t = 5$ to $7$ and completes at $t = 7$.
  - $t = 7$: $P_1$ resumes with remaining burst $5$. Runs from $t = 7$ to $12$ and completes at $t = 12$.
- **Completion Times ($CT$):**
  - $CT(P_1) = 12$
  - $CT(P_2) = 7$
  - $CT(P_3) = 5$
- **Turnaround Times ($TAT = CT - AT$):**
  - $TAT(P_1) = 12 - 0 = 12$
  - $TAT(P_2) = 7 - 2 = 5$
  - $TAT(P_3) = 5 - 4 = 1$
- **Waiting Times ($WT = TAT - BT$):**
  - $WT(P_1) = 12 - 7 = 5$
  - $WT(P_2) = 5 - 4 = 1$
  - $WT(P_3) = 1 - 1 = 0$
- **Average Waiting Time:**
  $$\text{Average } WT = \frac{5 + 1 + 0}{3} = \frac{6}{3} = 2.0 \text{ ms}$$
- (D) is the average turnaround time ($18/3 = 6.0$), a common GATE distractor. Hence, (A) is correct.

## Q2
type: MCQ
marks: 1
subject: dbms
topic: functional-dependencies-normal-forms
answer: C

Consider a relational schema $R(P, Q, R, S, T)$ with the following set of functional dependencies:

$$F = \{ PQ \to R, \; R \to S, \; S \to T, \; T \to P \}$$

What is the highest normal form satisfied by relation $R$?

(A) 1NF but not 2NF
(B) 2NF but not 3NF
(C) 3NF but not BCNF
(D) BCNF

### Solution
- **Step 1: Identify Candidate Keys**
  - Check right-hand sides of dependencies: $P, R, S, T$ all appear on the RHS.
  - $Q$ does not appear on the RHS of any functional dependency in $F$. Therefore, $Q$ must be part of every candidate key.
  - Compute closures:
    - $(PQ)^+ = \{P, Q, R, S, T\} = R \implies PQ$ is a candidate key.
    - Because $T \to P$, $(TQ)^+ = \{T, Q, P, R, S\} = R \implies TQ$ is a candidate key.
    - Because $S \to T$, $(SQ)^+ = \{S, Q, T, P, R\} = R \implies SQ$ is a candidate key.
    - Because $R \to S$, $(RQ)^+ = \{R, Q, S, T, P\} = R \implies RQ$ is a candidate key.
  - Candidate keys are: $\{PQ, RQ, SQ, TQ\}$.
- **Step 2: Classify Attributes**
  - Prime attributes (attributes appearing in at least one candidate key): $\{P, Q, R, S, T\}$.
  - Non-prime attributes: None ($\emptyset$). All attributes are prime.
- **Step 3: Test Normal Forms**
  - **2NF:** A relation is in 2NF if no non-prime attribute is partially dependent on any candidate key. Since there are no non-prime attributes, 2NF is trivially satisfied.
  - **3NF:** For every non-trivial FD $X \to Y$, either $X$ is a superkey OR $Y$ is a prime attribute. Since every attribute in $R$ is prime, the RHS $Y$ of every FD in $F$ is a prime attribute. Thus, 3NF is fully satisfied.
  - **BCNF:** For every non-trivial FD $X \to Y$, $X$ must be a superkey.
    - In $R \to S$: $(R)^+ = \{R, S, T, P\} \ne R$ (missing attribute $Q$).
    - Since $R$ is not a superkey, $R \to S$ violates BCNF. (Similarly, $S \to T$ and $T \to P$ violate BCNF).
- Therefore, the highest normal form satisfied by relation $R$ is 3NF. Option (C) is correct.

## Q3
type: MCQ
marks: 1
subject: toc
topic: regular-expressions-finite-automata
answer: B

Let $\Sigma = \{0, 1\}$. Consider the regular language:

$$L = \{ w \in \{0, 1\}^* \mid w \text{ ends with } 01 \text{ or } 10 \}$$

What is the minimum number of states in a Deterministic Finite Automaton (DFA) that accepts $L$?

(A) 4
(B) 5
(C) 6
(D) 7

### Solution
- Using Myhill-Nerode equivalence classes (distinguishable right contexts):
  1. $[\epsilon]$: Start state (string has length 0).
  2. $[0]$: String ends with $0$, but did not just see $10$ (e.g. `0`, `00`). Next bit $1$ leads to an accepting state.
  3. $[1]$: String ends with $1$, but did not just see $01$ (e.g. `1`, `11`). Next bit $0$ leads to an accepting state.
  4. $[01]$: Accepting state (string ends in $01$).
  5. $[10]$: Accepting state (string ends in $10$).
- Checking distinguishability of the accepting states $[01]$ and $[10]$:
  - On input $0$: $[01]$ transitions to $[10]$ (accepting), while $[10]$ transitions to $[0]$ (non-accepting).
  - Because one reaches an accepting state and the other reaches a non-accepting state on input $0$, $[01]$ and $[10]$ are distinguishable and cannot be merged.
- Checking $[\epsilon], [0], [1]$:
  - From $[\epsilon]$, input $1$ reaches $[1]$ (non-accepting).
  - From $[0]$, input $1$ reaches $[01]$ (accepting).
  - Thus $[\epsilon]$ and $[0]$ are distinguishable.
  - Similarly, $[0]$ and $[1]$ are distinguishable because input $1$ on $[0]$ accepts while input $1$ on $[1]$ stays in $[1]$ (non-accepting).
- All 5 equivalence classes are mutually pairwise distinguishable. Therefore, the minimal DFA requires exactly 5 states. Option (B) is correct.

## Q4
type: MCQ
marks: 1
subject: os
topic: deadlock
answer: B

A computer system has 5 concurrent processes sharing a single pool of identical resource units. Each process requires at most 3 units of the resource to finish its execution. What is the minimum number of resource units that the system must possess to guarantee that deadlock will never occur?

(A) 10
(B) 11
(C) 15
(D) 16

### Solution
- Let $n = 5$ be the number of processes, and $Max_i = 3$ be the maximum demand of each process $i$.
- Deadlock is guaranteed to be avoided if and only if the total number of resource units $R$ satisfies:
  $$R \ge \sum_{i=1}^n (Max_i - 1) + 1$$
- In the worst-case scenario where deadlock could occur, each process is allocated 1 unit less than its maximum requirement:
  $$\text{Allocated per process} = 3 - 1 = 2 \text{ units}$$
  $$\text{Total allocated in worst case} = 5 \times 2 = 10 \text{ units}$$
- With 10 units, all 5 processes can be simultaneously waiting for 1 additional unit (deadlock).
- If the system has at least $10 + 1 = 11$ units, at least one process is guaranteed to receive its remaining unit, complete, and release all 3 of its allocated units, allowing all remaining processes to finish.
- Therefore, the minimum number of units required is 11. Option (B) is correct.

## Q5
type: MCQ
marks: 1
subject: dbms
topic: transactions-concurrency-control
answer: B

Consider the following schedule $S$ of two concurrent transactions $T_1$ and $T_2$:

$$S: r_1(A); \; w_1(A); \; r_2(A); \; w_2(B); \; c_2; \; c_1$$

Which of the following statements is correct regarding schedule $S$?

(A) $S$ is conflict serializable and recoverable.
(B) $S$ is conflict serializable but non-recoverable.
(C) $S$ is not conflict serializable and non-recoverable.
(D) $S$ is cascadeless and strict.

### Solution
- **Conflict Serializability:**
  - Conflicting operations between $T_1$ and $T_2$:
    - $w_1(A)$ and $r_2(A)$ conflict on data item $A$. Since $w_1(A)$ occurs before $r_2(A)$, this adds a directed edge $T_1 \to T_2$ in the precedence (serializability) graph.
    - There are no other conflicts between $T_1$ and $T_2$ ($T_1$ does not access item $B$).
  - The precedence graph has only the edge $T_1 \to T_2$, which contains no cycle.
  - Hence, schedule $S$ is **conflict serializable** (equivalent to serial order $T_1 \to T_2$).
- **Recoverability:**
  - $T_2$ reads item $A$ after $T_1$ wrote to $A$ ($r_2(A)$ reads uncommitted data from $w_1(A)$).
  - In a recoverable schedule, if transaction $T_j$ reads data written by $T_i$, then the commit of $T_i$ must precede the commit of $T_j$ ($c_i < c_j$).
  - Here, $T_2$ commits ($c_2$) **before** $T_1$ commits ($c_1$).
  - If $T_1$ subsequently aborts after $c_2$, $T_2$ cannot be rolled back because $T_2$ has already committed.
  - Hence, schedule $S$ is **non-recoverable**.
- Therefore, $S$ is conflict serializable but non-recoverable. Option (B) is correct.

## Q6
type: NAT
marks: 2
subject: toc
topic: context-free-grammars-pda
answer: 15

Consider the following context-free grammar $G$ with start symbol $S$:

$$S \to AB$$
$$A \to aA \mid a$$
$$B \to bB \mid \epsilon$$

What is the total number of distinct strings of length less than or equal to 5 (i.e., $|w| \le 5$) that can be generated by grammar $G$?

### Solution
- Analyze the languages generated by non-terminals $A$ and $B$:
  - $A \to aA \mid a$ generates all non-empty strings of $a$'s:
    $$L(A) = a^+ = \{a^i \mid i \ge 1\}$$
  - $B \to bB \mid \epsilon$ generates all strings of $b$'s (including the empty string $\epsilon$):
    $$L(B) = b^* = \{b^j \mid j \ge 0\}$$
- Since $S \to AB$, the language generated by $G$ is:
  $$L(G) = \{ a^i b^j \mid i \ge 1, \; j \ge 0 \}$$
- We must count all strings $w = a^i b^j \in L(G)$ such that $|w| = i + j \le 5$, with $i \ge 1$ and $j \ge 0$:
  - **Length 1 ($i+j=1$):** $i=1, j=0 \implies \{a\}$ (1 string)
  - **Length 2 ($i+j=2$):** $(i, j) \in \{(2, 0), (1, 1)\} \implies \{aa, ab\}$ (2 strings)
  - **Length 3 ($i+j=3$):** $(i, j) \in \{(3, 0), (2, 1), (1, 2)\} \implies \{aaa, aab, abb\}$ (3 strings)
  - **Length 4 ($i+j=4$):** $(i, j) \in \{(4, 0), (3, 1), (2, 2), (1, 3)\} \implies \{aaaa, aaab, aabb, abbb\}$ (4 strings)
  - **Length 5 ($i+j=5$):** $(i, j) \in \{(5, 0), (4, 1), (3, 2), (2, 3), (1, 4)\} \implies \{aaaaa, aaaab, aaabb, aabbb, abbbb\}$ (5 strings)
- Total number of distinct strings:
  $$\text{Total} = 1 + 2 + 3 + 4 + 5 = 15$$
- The answer is 15.

## Q7
type: NAT
marks: 2
subject: os
topic: memory-management
answer: 512

Consider a buddy memory allocation system with a total memory pool of $1024 \text{ KB}$ (initially a single contiguous block from byte address $0$ to $1024 \text{ KB}$). 

Memory requests arrive and are allocated in the following order:
1. Request $R_1$ for $110 \text{ KB}$
2. Request $R_2$ for $230 \text{ KB}$
3. Request $R_3$ for $60 \text{ KB}$
4. Request $R_4$ for $120 \text{ KB}$

Each request is allocated the smallest power-of-2 block size that can accommodate it. When a block is split into two buddies, the block with the lower starting address is chosen first. No deallocations occur.

After all four requests are allocated, what is the starting address (in KB) of the block allocated to request $R_4$?

### Solution
- Determine the power-of-2 block sizes required for each request:
  - $R_1$: $110 \text{ KB} \implies 128 \text{ KB}$
  - $R_2$: $230 \text{ KB} \implies 256 \text{ KB}$
  - $R_3$: $60 \text{ KB} \implies 64 \text{ KB}$
  - $R_4$: $120 \text{ KB} \implies 128 \text{ KB}$
- Trace the allocations step-by-step:
  - **Initial pool:** One block $[0, 1024)$ of size $1024 \text{ KB}$.
  - **Step 1: Allocate $R_1$ ($128 \text{ KB}$):**
    - Split $[0, 1024) \to [0, 512)$ and $[512, 1024)$
    - Split $[0, 512) \to [0, 256)$ and $[256, 512)$
    - Split $[0, 256) \to [0, 128)$ and $[128, 256)$
    - Allocate $[0, 128)$ to $R_1$.
    - Free list: $[128, 256)$ (size 128), $[256, 512)$ (size 256), $[512, 1024)$ (size 512).
  - **Step 2: Allocate $R_2$ ($256 \text{ KB}$):**
    - A free block of exact size $256 \text{ KB}$ exists at $[256, 512)$.
    - Allocate $[256, 512)$ to $R_2$.
    - Free list: $[128, 256)$ (size 128), $[512, 1024)$ (size 512).
  - **Step 3: Allocate $R_3$ ($64 \text{ KB}$):**
    - Smallest free block capable of holding $64 \text{ KB}$ is $[128, 256)$ of size $128 \text{ KB}$.
    - Split $[128, 256) \to [128, 192)$ and $[192, 256)$ (each size 64).
    - Allocate the lower buddy $[128, 192)$ to $R_3$.
    - Free list: $[192, 256)$ (size 64), $[512, 1024)$ (size 512).
  - **Step 4: Allocate $R_4$ ($128 \text{ KB}$):**
    - Free blocks available are size $64 \text{ KB}$ ($[192, 256)$) and size $512 \text{ KB}$ ($[512, 1024)$).
    - The $64 \text{ KB}$ block cannot accommodate $128 \text{ KB}$.
    - Hence, split the $512 \text{ KB}$ block:
      - Split $[512, 1024) \to [512, 768)$ and $[768, 1024)$ (each size 256).
      - Split $[512, 768) \to [512, 640)$ and $[640, 768)$ (each size 128).
    - Allocate lower buddy $[512, 640)$ to $R_4$.
- The starting address of the block allocated to $R_4$ is $512$.

## Q8
type: MCQ
marks: 2
subject: dbms
topic: sql
answer: A

Consider the following relational table `Student(roll_no, dept_name, cgpa)` containing 10 tuples:
- 4 students in `'CSE'` with CGPAs: $9.0, 8.5, 8.0, 7.5$
- 3 students in `'ECE'` with CGPAs: $8.5, 8.0, 7.5$
- 3 students in `'ME'` with CGPAs: $7.0, 6.5, 6.0$

Consider the following SQL query:

```sql
SELECT dept_name, COUNT(*)
FROM Student
WHERE cgpa >= 7.5
GROUP BY dept_name
HAVING AVG(cgpa) > 8.0;
```

What is the output returned by the query?

(A) Exactly 1 row: `('CSE', 4)`
(B) Exactly 1 row: `('CSE', 3)`
(C) Exactly 2 rows: `('CSE', 4)` and `('ECE', 3)`
(D) Exactly 2 rows: `('CSE', 3)` and `('ECE', 3)`

### Solution
- Evaluate the SQL query clauses in conceptual execution order:
  1. **`FROM Student`**: Table contains all 10 tuples.
  2. **`WHERE cgpa >= 7.5`**: Filters individual rows before grouping:
     - `'CSE'`: All 4 students have $\text{cgpa} \ge 7.5$ ($9.0, 8.5, 8.0, 7.5$). (4 rows pass)
     - `'ECE'`: All 3 students have $\text{cgpa} \ge 7.5$ ($8.5, 8.0, 7.5$). (3 rows pass)
     - `'ME'`: All CGPAs are $\le 7.0$, so 0 rows pass the WHERE clause.
  3. **`GROUP BY dept_name`**:
     - Group `'CSE'`: Contains 4 rows.
       - $\text{COUNT}(*) = 4$
       - $\text{AVG}(\text{cgpa}) = \frac{9.0 + 8.5 + 8.0 + 7.5}{4} = \frac{33.0}{4} = 8.25$
     - Group `'ECE'`: Contains 3 rows.
       - $\text{COUNT}(*) = 3$
       - $\text{AVG}(\text{cgpa}) = \frac{8.5 + 8.0 + 7.5}{3} = \frac{24.0}{3} = 8.0$
  4. **`HAVING AVG(cgpa) > 8.0`**:
     - Condition is strictly greater than $8.0$:
     - For `'CSE'`: $8.25 > 8.0$ is **TRUE**.
     - For `'ECE'`: $8.0 > 8.0$ is **FALSE** (it equals 8.0, not strictly greater).
- Only the `'CSE'` group satisfies the `HAVING` clause.
- Output contains exactly 1 row: `('CSE', 4)`. Option (A) is correct.

## Q9
type: MSQ
marks: 2
subject: toc
topic: regular-languages
answer: A, D

Let $\Sigma = \{0, 1\}$. Which of the following languages is/are **REGULAR**?

(A) $L_1 = \{ 0^n 1^m \mid n, m \ge 0 \text{ and } (n + m) \text{ is even} \}$
(B) $L_2 = \{ w w^R \mid w \in \{0, 1\}^* \}$
(C) $L_3 = \{ 0^p \mid p \text{ is a prime number} \}$
(D) $L_4 = \{ w \in \{0, 1\}^* \mid \text{the number of } 0\text{s in } w \text{ is a multiple of } 5 \}$

### Solution
- **(A) $L_1$:**
  - $(n + m)$ is even if either both $n$ and $m$ are even, or both $n$ and $m$ are odd.
  - We can construct a regular expression for $L_1$:
    $$R = (00)^*(11)^* + 0(00)^*1(11)^*$$
  - Since $L_1$ can be generated by a regular expression, it is **Regular**. (A is correct).
- **(B) $L_2$:**
  - $L_2$ consists of all even-length palindromes.
  - Recognizing strings of the form $w w^R$ requires unbounded memory (a stack) to match symbols in reverse order. By the Pumping Lemma for regular languages, $L_2$ is not regular (it is a non-deterministic CFL). (B is incorrect).
- **(C) $L_3$:**
  - The sequence of prime numbers does not form an arithmetic progression; the gap between consecutive primes grows arbitrarily. By the Pumping Lemma, $L_3$ is not regular. (C is incorrect).
- **(D) $L_4$:**
  - To check if the number of $0$s is divisible by 5, a DFA only needs 5 states corresponding to the remainders $\{0, 1, 2, 3, 4\} \pmod 5$.
  - State 0 is the start and accepting state. $1$s produce self-loops; $0$s transition cyclically $0 \to 1 \to 2 \to 3 \to 4 \to 0$.
  - Because it can be recognized by a 5-state DFA, $L_4$ is **Regular**. (D is correct).
- Hence, the correct options are (A) and (D).

## Q10
type: NAT
marks: 2
subject: os
topic: virtual-memory
answer: 160

Consider a demand-paged virtual memory system with a 2-level hierarchical page table:
- Virtual address: 32 bits
- Page size: $4 \text{ KB}$ ($2^{12}$ bytes)
- Page table entry (PTE) size at both levels: 4 bytes
- Inner (second-level) page table occupies exactly one page frame
- Memory access time (RAM): $100 \text{ ns}$
- TLB lookup time: $20 \text{ ns}$
- TLB hit ratio: $0.80$ (80%)

When a TLB miss occurs, the TLB is looked up first, followed by traversing the page tables in memory. Assume there are no page faults.

What is the Effective Memory Access Time (EMAT), in nanoseconds?

### Solution
- **Virtual address translation breakdown:**
  - Page offset = $\log_2(4 \text{ KB}) = 12$ bits.
  - Virtual page number = $32 - 12 = 20$ bits.
  - Since the page size is $4 \text{ KB}$ and each PTE is 4 bytes, one frame holds $\frac{4096}{4} = 1024 = 2^{10}$ entries.
  - Inner page table index = 10 bits; Outer page table index = $20 - 10 = 10$ bits.
  - Number of page table levels to traverse on a TLB miss = 2 levels.
- **Timing analysis:**
  - **Case 1: TLB Hit (probability $h = 0.80$):**
    - Lookup TLB ($20 \text{ ns}$) $+$ Access physical RAM for data ($100 \text{ ns}$).
    - Time on hit:
      $$T_{\text{hit}} = 20 + 100 = 120 \text{ ns}$$
  - **Case 2: TLB Miss (probability $1 - h = 0.20$):**
    - Lookup TLB ($20 \text{ ns}$) $+$ Access Level-1 page table in RAM ($100 \text{ ns}$) $+$ Access Level-2 page table in RAM ($100 \text{ ns}$) $+$ Access physical RAM for data ($100 \text{ ns}$).
    - Time on miss:
      $$T_{\text{miss}} = 20 + 100 + 100 + 100 = 320 \text{ ns}$$
- **Calculate EMAT:**
  $$\text{EMAT} = h \times T_{\text{hit}} + (1 - h) \times T_{\text{miss}}$$
  $$\text{EMAT} = 0.80 \times 120 + 0.20 \times 320 = 96 + 64 = 160 \text{ ns}$$
- The Effective Memory Access Time is 160 ns.

## Q11
type: MCQ
marks: 2
subject: dbms
topic: relational-algebra-calculus
answer: D

Consider two relational schemas $R(A, B)$ and $S(B, C)$ where attributes $A, B, C$ are non-null integer domains. Which of the following Relational Algebra expressions is **NOT equivalent** to the other three?

(A) $\Pi_A (R \bowtie S)$
(B) $\Pi_A (R \ltimes S)$
(C) $\Pi_A (R) - \Pi_A \left(R - (R \bowtie \Pi_B(S))\right)$
(D) $\Pi_A (R) \bowtie \Pi_B (S)$

### Solution
- Analyze the semantic meaning of each expression:
  - **(A) $\Pi_A (R \bowtie S)$:** Projects attribute $A$ from the natural join of $R$ and $S$. This produces the set of all $A$-values in $R$ that have at least one matching $B$-value in $S$. The result relation has schema $(A)$.
  - **(B) $\Pi_A (R \ltimes S)$:** The semijoin $R \ltimes S$ is defined as $\Pi_{\text{attrs}(R)} (R \bowtie S) = \Pi_{A, B}(R \bowtie S)$. Projecting on $A$ gives $\Pi_A (R \bowtie S)$. Thus, (B) is strictly equivalent to (A).
  - **(C) $\Pi_A (R) - \Pi_A \left(R - (R \bowtie \Pi_B(S))\right)$:**
    - $(R \bowtie \Pi_B(S))$ selects tuples of $R$ that match some $B$ in $S$.
    - $R - (R \bowtie \Pi_B(S))$ gives tuples of $R$ that do **not** match any $B$ in $S$.
    - Projecting on $A$ gives $A$-values with no match in $S$.
    - Subtracting these from all $A$-values in $\Pi_A(R)$ leaves exactly the $A$-values that have at least one matching $B$ in $S$. Thus, (C) is equivalent to (A).
  - **(D) $\Pi_A (R) \bowtie \Pi_B (S)$:**
    - The schema of $\Pi_A (R)$ is $(A)$ and the schema of $\Pi_B (S)$ is $(B)$.
    - Because the two relations have **disjoint attribute sets** (no common attribute name), the natural join $\bowtie$ degrades into a **Cartesian product** $\Pi_A(R) \times \Pi_B(S)$.
    - Its result schema is $(A, B)$, containing every combination of $A \in R$ with every $B \in S$, regardless of whether they were ever associated in $R$ or $S$.
- Therefore, (D) is fundamentally non-equivalent to (A), (B), and (C). Option (D) is correct.

## Q12
type: MSQ
marks: 2
subject: toc
topic: context-free-languages
answer: A, B, D

Which of the following statements is/are **TRUE** regarding Context-Free Languages (CFL) and Deterministic Context-Free Languages (DCFL)?

(A) The intersection of a Context-Free Language and a Regular Language is always a Context-Free Language.
(B) The complement of every Deterministic Context-Free Language is a Deterministic Context-Free Language.
(C) The intersection of any two Context-Free Languages is always a Context-Free Language.
(D) Every regular language is a Deterministic Context-Free Language.

### Solution
- **(A) True:** CFLs are closed under intersection with regular languages. If $L$ is accepted by a Pushdown Automaton (PDA) and $R$ is accepted by a DFA, we can construct a product automaton where the finite control tracks the states of both machines while using the single stack of the PDA.
- **(B) True:** DCFLs are closed under complementation. A DPDA can be complemented by converting it into a valid DPDA that halts on all inputs (handling $\epsilon$-loops and deadlocks) and swapping accepting and non-accepting states. (Note: Non-deterministic CFLs are NOT closed under complementation).
- **(C) False:** CFLs are **not** closed under intersection. For example:
  $$L_1 = \{a^n b^n c^m \mid n, m \ge 1\} \text{ (CFL)}$$
  $$L_2 = \{a^m b^n c^n \mid n, m \ge 1\} \text{ (CFL)}$$
  $$L_1 \cap L_2 = \{a^n b^n c^n \mid n \ge 1\} \text{ (Not a CFL, requires two stacks)}$$
- **(D) True:** Every regular language is accepted by a DFA. A DFA is simply a DPDA that never pushes or pops from its stack. Therefore, $\text{Regular} \subset \text{DCFL} \subset \text{CFL}$.
- Hence, statements (A), (B), and (D) are TRUE.

## Q13
type: NAT
marks: 2
subject: os
topic: file-systems-io
answer: 1044

Consider a Unix-like file system with an inode structure containing:
- 10 direct block pointers
- 1 single indirect block pointer
- 1 double indirect block pointer
- 1 triple indirect block pointer

The disk block size is $2 \text{ KB}$ ($2048$ bytes), and each disk block address pointer requires $4$ bytes.

What is the maximum file size, in Kilobytes (KB), that can be addressed using **ONLY** the direct and single indirect block pointers?

### Solution
- **Determine pointer capacity:**
  - Disk block size $= 2048$ bytes.
  - Pointer size $= 4$ bytes.
  - Number of block address pointers that fit inside one disk block:
    $$N = \frac{2048}{4} = 512 \text{ pointers}$$
- **Calculate addressable capacity:**
  1. **Direct pointers:**
     - 10 direct pointers point directly to 10 data blocks.
     - Capacity $= 10 \times 2 \text{ KB} = 20 \text{ KB}$.
  2. **Single indirect pointer:**
     - 1 single indirect pointer points to 1 disk block that contains 512 block pointers.
     - Each of these 512 pointers addresses one $2 \text{ KB}$ data block.
     - Capacity $= 512 \times 2 \text{ KB} = 1024 \text{ KB}$.
- **Total capacity using ONLY direct and single indirect pointers:**
  $$\text{Total} = 20 \text{ KB} + 1024 \text{ KB} = 1044 \text{ KB}$$
- The answer is 1044.

## Q14
type: NAT
marks: 2
subject: dbms
topic: file-organization-indexing
answer: 57

Consider a $\text{B}^+$ tree index constructed on a search key field of a database table:
- Disk block size: $1024$ bytes
- Search key size: $12$ bytes
- Data record pointer size: $8$ bytes
- Block pointer (child node pointer) size: $6$ bytes

The order $p$ of an internal node in this $\text{B}^+$ tree is defined as the maximum number of child block pointers that the internal node can hold.

What is the maximum value of $p$ for an internal node?

### Solution
- **Structure of an internal node in a $\text{B}^+$ tree:**
  - An internal node of order $p$ holds up to $p$ child block pointers and $(p - 1)$ search key values.
  - Internal nodes in a $\text{B}^+$ tree do **not** store record pointers (record pointers are stored exclusively in the leaf nodes).
- **Formulate the block size constraint:**
  $$\text{Size of } p \text{ block pointers} + \text{Size of } (p - 1) \text{ search keys} \le \text{Block Size}$$
  $$p \times 6 + (p - 1) \times 12 \le 1024$$
  $$6p + 12p - 12 \le 1024$$
  $$18p - 12 \le 1024$$
  $$18p \le 1036$$
  $$p \le \frac{1036}{18} \approx 57.55$$
- Since $p$ must be an integer:
  $$p = 57$$
- **Verification:**
  - For $p = 57$:
    $$57 \times 6 + 56 \times 12 = 342 + 672 = 1014 \text{ bytes} \le 1024 \text{ bytes}$$
  - For $p = 58$:
    $$58 \times 6 + 57 \times 12 = 348 + 684 = 1032 \text{ bytes} > 1024 \text{ bytes (exceeds block)}$$
- Therefore, the order $p$ of the internal node is 57.

## Q15
type: MCQ
marks: 2
subject: toc
topic: turing-machines-undecidability
answer: B

Consider the following two languages over the alphabet $\Sigma = \{0, 1\}$:
- $L_1 = \{ \langle M \rangle \mid M \text{ is a Turing machine that halts on a blank tape} \}$
- $L_2 = \{ \langle M \rangle \mid M \text{ is a Turing machine and } L(M) \text{ is finite} \}$

Which of the following statements is correct?

(A) Both $L_1$ and $L_2$ are recursively enumerable (RE).
(B) $L_1$ is recursively enumerable (RE) but not recursive; $L_2$ is not recursively enumerable (not RE).
(C) $L_1$ is recursive; $L_2$ is recursively enumerable (RE).
(D) Neither $L_1$ nor $L_2$ is recursively enumerable (not RE).

### Solution
- **Analysis of $L_1$ (Blank Tape Halting Problem):**
  - We can construct a Universal Turing machine $U$ that simulates $M$ on an empty input string (blank tape).
  - If $M$ halts on blank tape, $U$ halts and accepts $\langle M \rangle$.
  - If $M$ runs indefinitely, $U$ also runs indefinitely.
  - Because a Turing machine exists that accepts every string in $L_1$ (semi-decidable), $L_1$ is **Recursively Enumerable (RE)**.
  - By reduction from the Halting Problem ($H_{\text{TM}}$), $L_1$ is undecidable.
  - Hence, $L_1$ is **RE but not recursive**.
- **Analysis of $L_2$ (Finiteness Problem for Turing Machines):**
  - Finiteness is a semantic property of the language of a Turing machine.
  - By Rice's Theorem (Part 2), for an undecidable property to be RE, the property must be non-trivial and monotone (if $L \in P$ and $L \subseteq L'$, then $L' \in P$).
  - The property "being finite" is **not monotone**: $\emptyset$ is finite, but supersets of $\emptyset$ (such as $\Sigma^*$) are infinite.
  - Therefore, testing whether $L(M)$ is finite cannot even be semi-decided.
  - By standard reduction from $\overline{H_{\text{TM}}}$, $L_2$ is strictly **not Recursively Enumerable (not RE)**.
- Therefore, $L_1$ is RE but not recursive, and $L_2$ is not RE. Option (B) is correct.
