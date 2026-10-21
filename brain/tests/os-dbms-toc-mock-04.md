---
title: OS + DBMS + TOC · Mock 04
duration: 45
created: 2026-10-21
description: Sectional GATE-level mock covering Operating Systems, Databases, and Theory of Computation.
---

## Q1
type: MCQ
marks: 1
subject: os
topic: processes-threads
answer: A

Consider the following statements regarding User-Level Threads (ULTs) and Kernel-Level Threads (KLTs):

- $S_1$: In the Many-to-One multithreading model, if one user-level thread executes a blocking system call, the operating system blocks the entire process (including all other threads belonging to that process).
- $S_2$: In the One-to-One multithreading model, multiple threads of the same process can execute concurrently in true parallel fashion across multiple physical CPU cores.
- $S_3$: Switching the CPU execution context between two user-level threads belonging to the same process requires a trap to kernel mode and an OS-level context switch.
- $S_4$: In the Many-to-Many multithreading model, the kernel scheduler allocates CPU time to kernel threads without needing to be aware of the individual user-level threads mapped onto them.

Which of the above statements are TRUE?

(A) $S_1, S_2$, and $S_4$ only
(B) $S_1$ and $S_2$ only
(C) $S_2, S_3$, and $S_4$ only
(D) $S_1, S_2, S_3$, and $S_4$

### Solution
Let us analyze each statement based on multithreading models and thread management:

1. **Statement $S_1$ is TRUE:**
   In the Many-to-One model, all user-level threads of a process are mapped to a single kernel thread. Because the operating system kernel is unaware of the individual user threads and manages only the single underlying kernel thread, any blocking system call (such as a synchronous I/O request) issued by any user thread causes the kernel to block the entire process.

2. **Statement $S_2$ is TRUE:**
   In the One-to-One model, each user-level thread is mapped to a distinct kernel-level thread. The kernel scheduler can dispatch these distinct kernel threads to run simultaneously on separate physical processor cores of a multi-core/multiprocessor architecture, achieving true hardware-level parallelism.

3. **Statement $S_3$ is FALSE:**
   User-level threads are managed entirely by a user-space thread runtime library without kernel intervention. Context switching between user-level threads simply involves saving and restoring user registers, program counter, and stack pointer in user space. It does NOT require invoking a trap instruction, switching to kernel mode, or incurring OS kernel context switch overhead.

4. **Statement $S_4$ is TRUE:**
   In the Many-to-Many model (and two-level models), user threads are scheduled onto available kernel threads (Lightweight Processes / LWPs) by the user-level thread library (Process Contention Scope, PCS). The kernel scheduler is responsible only for scheduling the kernel threads onto physical processors (System Contention Scope, SCS), without needing awareness of the internal user-level thread mappings.

Therefore, statements $S_1, S_2,$ and $S_4$ are TRUE.

Hence, (A) is the correct option.

## Q2
type: MCQ
marks: 1
subject: dbms
topic: er-model
answer: B

Consider an Entity-Relationship (ER) diagram representing an organization:
- `Department` is a strong entity set with primary key `dept_id` and attribute `dept_name`.
- `Employee` is a weak entity set with discriminator (partial key) `emp_no` and attribute `emp_name`.
- `Employs` is the identifying relationship from `Department` to `Employee` (a 1:N relationship where each department employs multiple employees, each employee belongs to exactly one department, and `Employee` has total participation).
- `Employee` has a multi-valued attribute `skills`.

Assuming no other entity sets or relationships exist, what is the MINIMUM number of relational tables required to represent this ER diagram in a relational database, and what are their primary keys?

(A) 2 tables: `Department(dept_id, dept_name)` and `Employee(dept_id, emp_no, emp_name, skills)`
(B) 3 tables: `Department(dept_id, dept_name)`, `Employee(dept_id, emp_no, emp_name)`, and `Emp_Skills(dept_id, emp_no, skill)`
(C) 4 tables: `Department(dept_id, dept_name)`, `Employee(emp_no, emp_name)`, `Employs(dept_id, emp_no)`, and `Emp_Skills(emp_no, skill)`
(D) 3 tables: `Department(dept_id, dept_name)`, `Employee(emp_no, emp_name, dept_id)`, and `Emp_Skills(emp_no, skill)`

### Solution
Let us determine the relational tables required to represent the ER diagram:

1. **Strong entity set `Department`:**
   - Requires its own table with primary key `dept_id`.
   - Schema: `Department(`$\underline{\text{dept\_id}}$, $\text{dept\_name}$$)$.
   - Table count: 1.

2. **Weak entity set `Employee` and identifying relationship `Employs`:**
   - The identifying relationship `Employs` is a 1:N relationship with total participation of the weak entity set `Employee`.
   - A weak entity set is always merged with its identifying relationship.
   - The primary key of a weak entity set is formed by combining the primary key of its identifying strong entity (`dept_id`) and its own partial key/discriminator (`emp_no`).
   - Schema: `Employee(`$\underline{\text{dept\_id}, \text{emp\_no}}$, $\text{emp\_name}$$)$.
   - Table count: 1.

3. **Multi-valued attribute `skills`:**
   - To satisfy First Normal Form (1NF), a multi-valued attribute cannot be placed in the main entity table as a set or repeated attribute.
   - It requires a separate table whose primary key consists of the primary key of the parent entity set (`dept_id, emp_no`) plus the multi-valued attribute itself (`skill`).
   - Schema: `Emp_Skills(`$\underline{\text{dept\_id}, \text{emp\_no}, \text{skill}}$$)$.
   - Table count: 1.

Total minimum number of tables $= 1 + 1 + 1 = 3$ tables.

*(GATE Trap: Option D incorrectly assumes `emp_no` alone is unique across the entire database. In a weak entity set, discriminators like `emp_no` are only unique within a specific department; hence `dept_id` must be part of the primary key in both `Employee` and `Emp_Skills`).*

Hence, (B) is the correct option.

## Q3
type: MCQ
marks: 1
subject: toc
topic: regular-expressions-finite-automata
answer: C

Consider the language $L$ over the alphabet $\Sigma = \{a, b\}$ defined as:

$$L = \{ w \in \{a, b\}^* \mid w \text{ contains neither } aa \text{ nor } bb \text{ as a substring} \}$$

What is the MINIMUM number of states in a complete Deterministic Finite Automaton (DFA) that accepts language $L$?

(A) 3
(B) 4
(C) 5
(D) 6

### Solution
Let us analyze the structure of strings in $L$:
- A string in $L$ cannot contain consecutive $a$'s ($aa$) and cannot contain consecutive $b$'s ($bb$).
- Thus, the symbols in any valid string must alternate strictly: $\epsilon, a, b, ab, ba, aba, bab, abab, \dots$

Let us construct the minimal complete DFA $M = (Q, \Sigma, \delta, q_0, F)$:

1. **State characterization:**
   - State $q_0$ (Start state): The empty string $\epsilon$ has been read (or no symbol read yet). $\epsilon \in L$, so $q_0$ is an **accepting state**.
   - State $q_a$: The last symbol read was $a$, and no illegal substring has occurred. This state is an **accepting state** (e.g., $a, ba, aba \in L$).
   - State $q_b$: The last symbol read was $b$, and no illegal substring has occurred. This state is an **accepting state** (e.g., $b, ab, bab \in L$).
   - State $q_{\text{trap}}$ (Dead / Trap state): An illegal substring ($aa$ or $bb$) has occurred. This state is **non-accepting**.

2. **Transition function $\delta$:**
   - From $q_0$:
     - On input $a$: transition to $q_a$ ($\delta(q_0, a) = q_a$).
     - On input $b$: transition to $q_b$ ($\delta(q_0, b) = q_b$).
   - From $q_a$:
     - On input $b$: transition to $q_b$ ($\delta(q_a, b) = q_b$, valid alternation).
     - On input $a$: transition to $q_{\text{trap}}$ ($\delta(q_a, a) = q_{\text{trap}}$, substring $aa$ detected).
   - From $q_b$:
     - On input $a$: transition to $q_a$ ($\delta(q_b, a) = q_a$, valid alternation).
     - On input $b$: transition to $q_{\text{trap}}$ ($\delta(q_b, b) = q_{\text{trap}}$, substring $bb$ detected).
   - From $q_{\text{trap}}$:
     - On input $a$: loop on $q_{\text{trap}}$ ($\delta(q_{\text{trap}}, a) = q_{\text{trap}}$).
     - On input $b$: loop on $q_{\text{trap}}$ ($\delta(q_{\text{trap}}, b) = q_{\text{trap}}$).

3. **Verifying pairwise distinguishability of all 5 states:**
   - $q_{\text{trap}}$ is non-accepting, while $q_0, q_a, q_b$ are accepting. Hence, $q_{\text{trap}}$ is distinguished from the others by $\epsilon$.
   - Distinguishing $q_0$ and $q_a$: On input $a$, from $q_0 \to q_a$ (accepting), but from $q_a \to q_{\text{trap}}$ (rejecting). Thus, string $a$ distinguishes $q_0$ and $q_a$.
   - Distinguishing $q_0$ and $q_b$: On input $b$, from $q_0 \to q_b$ (accepting), but from $q_b \to q_{\text{trap}}$ (rejecting). Thus, string $b$ distinguishes $q_0$ and $q_b$.
   - Distinguishing $q_a$ and $q_b$: On input $a$, from $q_a \to q_{\text{trap}}$ (rejecting), while from $q_b \to q_a$ (accepting). Thus, string $a$ distinguishes $q_a$ and $q_b$.

Since all 5 states are pairwise distinguishable, the minimal complete DFA contains exactly 5 states.

Hence, (C) is the correct option.

## Q4
type: NAT
marks: 1
subject: os
topic: deadlock
answer: 18

Consider a system with 4 processes $P_1, P_2, P_3,$ and $P_4$ competing for identical, reusable instances of a single resource type $R$. The maximum resource demands of the processes are:
- $\text{Max}(P_1) = 3$
- $\text{Max}(P_2) = 5$
- $\text{Max}(P_3) = 6$
- $\text{Max}(P_4) = 7$

The MINIMUM number of instances of resource $R$ that the system must possess to guarantee that a deadlock can NEVER occur is ______.

### Solution
Let us determine the condition for deadlock freedom in a system with $N$ processes sharing identical units of a single resource type:

1. **Worst-case deadlock scenario:**
   A deadlock can occur if and only if every process has acquired one unit less than its maximum requirement and is blocked waiting for its final resource unit:
   $$\text{Allocated}(P_i) = \text{Max}(P_i) - 1$$

2. **Total resources allocated in this state:**
   $$\sum_{i=1}^4 (\text{Max}(P_i) - 1) = (3 - 1) + (5 - 1) + (6 - 1) + (7 - 1) = 2 + 4 + 5 + 6 = 17$$
   If the system has only 17 instances, all 17 could be allocated across the 4 processes such that each process is waiting for 1 additional unit, resulting in a circular wait and deadlock.

3. **Condition for deadlock freedom:**
   To guarantee that at least one process can always obtain its maximum requirement, terminate, and release all its held resources back to the pool, the total number of resource instances $M$ must satisfy:
   $$M \ge \sum_{i=1}^4 (\text{Max}(P_i) - 1) + 1$$
   $$M \ge 17 + 1 = 18$$

Therefore, the minimum number of instances required is 18.

Hence, the answer is 18.

## Q5
type: MCQ
marks: 1
subject: dbms
topic: transactions-concurrency-control
answer: A

Consider the following concurrent schedule $S$ involving three transactions $T_1, T_2,$ and $T_3$ executing operations on data items $A, B,$ and $C$:

$$S: r_2(A); \quad w_2(C); \quad w_1(B); \quad w_1(A); \quad r_3(B); \quad w_3(C); \quad r_3(A)$$

Which of the following statements is TRUE regarding schedule $S$?

(A) $S$ is conflict serializable with the equivalent serial schedule $T_2 \to T_1 \to T_3$
(B) $S$ is conflict serializable with the equivalent serial schedule $T_1 \to T_2 \to T_3$
(C) $S$ is conflict serializable with the equivalent serial schedule $T_3 \to T_2 \to T_1$
(D) $S$ is not conflict serializable

### Solution
Let us construct the precedence (serialization) graph for schedule $S$:
A directed edge $T_i \to T_j$ exists if an operation of $T_i$ precedes a conflicting operation of $T_j$ on the same data item (where at least one operation is a write).

Let us check conflicts on each data item in chronological order:

1. **Conflicts on data item $A$:**
   - $r_2(A)$ occurs at step 1; $w_1(A)$ occurs at step 4.
     Since $r_2(A)$ precedes $w_1(A)$, this creates edge: **$T_2 \to T_1$**.
   - $r_2(A)$ occurs at step 1; $r_3(A)$ occurs at step 7.
     Both are read operations; no conflict.
   - $w_1(A)$ occurs at step 4; $r_3(A)$ occurs at step 7.
     Since $w_1(A)$ precedes $r_3(A)$, this creates edge: **$T_1 \to T_3$**.

2. **Conflicts on data item $B$:**
   - $w_1(B)$ occurs at step 3; $r_3(B)$ occurs at step 5.
     Since $w_1(B)$ precedes $r_3(B)$, this creates edge: **$T_1 \to T_3$** (already recorded).

3. **Conflicts on data item $C$:**
   - $w_2(C)$ occurs at step 2; $w_3(C)$ occurs at step 6.
     Since $w_2(C)$ precedes $w_3(C)$, this creates edge: **$T_2 \to T_3$**.

4. **Analyze the Precedence Graph:**
   - Directed edges: $\{ T_2 \to T_1, \; T_1 \to T_3, \; T_2 \to T_3 \}$.
   - Graph structure:
     $$T_2 \longrightarrow T_1 \longrightarrow T_3$$
     with a forward edge from $T_2 \to T_3$.
   - The precedence graph contains **no cycles** (it is a Directed Acyclic Graph).
   - Therefore, schedule $S$ is **conflict serializable**.

5. **Topological Sort:**
   - In-degree of $T_2 = 0$.
   - In-degree of $T_1 = 1$ (from $T_2$).
   - In-degree of $T_3 = 2$ (from $T_1$ and $T_2$).
   - The unique topological ordering is:
     $$T_2 \to T_1 \to T_3$$

Hence, (A) is the correct option.

## Q6
type: NAT
marks: 1
subject: toc
topic: context-free-grammars-pda
answer: 2

Consider the context-free grammar $G$ with start symbol $S$ and terminal set $\Sigma = \{a, b\}$:

$$S \to aSb \mid aSbb \mid ab$$

The total number of distinct strings of length 8 in the language $L(G)$ is ______.

### Solution
Let us characterize the structure of strings generated by grammar $G$:

1. **Analyzing the production rules:**
   - Base rule $S \to ab$ produces 1 $a$ followed by 1 $b$ (string $a^1 b^1$).
   - Rule $S \to aSb$ adds one leading $a$ and one trailing $b$.
   - Rule $S \to aSbb$ adds one leading $a$ and two trailing $b$'s.
   - Every derivation maintains all $a$'s at the beginning and all $b$'s at the end.
   - Therefore, every string generated by $G$ is of the form $a^n b^m$, where $n \ge 1$ and $m \ge 1$.

2. **Determining the relationship between $n$ and $m$:**
   - Let $k$ be the total number of derivation steps: 1 base step ($S \to ab$) plus $(n - 1)$ recursive expansions.
   - Each recursive expansion adds exactly one $a$ and either one or two $b$'s.
   - If $S \to aSb$ is used $x$ times and $S \to aSbb$ is used $y$ times:
     $$n = 1 + x + y$$
     $$m = 1 + x + 2y$$
   - Since $x, y \ge 0$:
     $$m = n + y \ge n$$
     $$m = 2n - (1 + x) \le 2n$$
   - Hence, $L(G) = \{ a^n b^m \mid n \ge 1 \text{ and } n \le m \le 2n \}$.

3. **Strings of length 8:**
   The length of $w = a^n b^m$ is:
   $$|w| = n + m = 8$$
   Substitute $m = 8 - n$ into the inequality $n \le m \le 2n$:
   - From $m \ge n$:
     $$8 - n \ge n \implies 2n \le 8 \implies n \le 4$$
   - From $m \le 2n$:
     $$8 - n \le 2n \implies 3n \ge 8 \implies n \ge \left\lceil \frac{8}{3} \right\rceil = 3$$
   Therefore, $n$ can only be 3 or 4:
   - **Case 1: $n = 3$**
     $m = 8 - 3 = 5$.
     Check: $3 \le 5 \le 2(3) = 6$, which is satisfied ($x = 0, y = 2$).
     String: $a^3 b^5 = aaabbbbb$.
   - **Case 2: $n = 4$**
     $m = 8 - 4 = 4$.
     Check: $4 \le 4 \le 2(4) = 8$, which is satisfied ($x = 3, y = 0$).
     String: $a^4 b^4 = aaaabbbb$.

No other values of $n$ satisfy the constraints.
Thus, there are exactly 2 distinct strings of length 8 in $L(G)$.

Hence, the answer is 2.

## Q7
type: NAT
marks: 2
subject: os
topic: concurrency-synchronization
answer: 6

Two concurrent processes $P_1$ and $P_2$ share an integer variable $C$, which is initialized to 10.

Process $P_1$ executes:
```c
for (int i = 0; i < 3; i++) {
    C = C + 1;
}
```

Process $P_2$ executes:
```c
for (int j = 0; j < 4; j++) {
    C = C - 1;
}
```

Each statement `C = C + 1` in $P_1$ is compiled into three atomic machine instructions using private register $R_1$:
```
LOAD  R1, C
ADD   R1, #1
STORE C, R1
```

Each statement `C = C - 1` in $P_2$ is compiled into three atomic machine instructions using private register $R_2$:
```
LOAD  R2, C
SUB   R2, #1
STORE C, R2
```

Preemption can occur between any two machine instructions. The MINIMUM possible final value of $C$ after both processes have completed all their loop iterations is ______.

### Solution
Let us find the minimum possible final value of $C$:

1. **Initial parameters and operations:**
   - Initial value: $C = 10$.
   - $P_1$ performs 3 increments.
   - $P_2$ performs 4 decrements.
   - If executed without interference (serially):
     $$C_{\text{serial}} = 10 + 3 - 4 = 9$$

2. **Mechanism to minimize $C$:**
   To minimize the final value of $C$, we want:
   - All 3 increments of $P_1$ to be completely overwritten (lost updates).
   - $P_2$'s decrements to take full effect on the initial value $10$.

3. **Interleaving trace to achieve the minimum value:**
   - **Step 1:** Process $P_2$ begins its 1st iteration:
     - Executes `LOAD R2, C` $\implies R_2 = 10$.
     - Executes `SUB R2, #1` $\implies R_2 = 9$.
     - Context switch occurs **immediately before** `STORE C, R2`.
   - **Step 2:** Process $P_1$ runs to full completion:
     - Iteration 1: Reads 10, writes 11 ($C = 11$).
     - Iteration 2: Reads 11, writes 12 ($C = 12$).
     - Iteration 3: Reads 12, writes 13 ($C = 13$).
     - $P_1$ terminates.
   - **Step 3:** Context switch back to $P_2$:
     - $P_2$ resumes and executes `STORE C, R2` $\implies C = 9$.
     - *(Notice: All 3 increments executed by $P_1$ have been completely obliterated by this store!)*
   - **Step 4:** Process $P_2$ executes its remaining 3 iterations without interruption:
     - Iteration 2: Reads 9, writes 8 ($C = 8$).
     - Iteration 3: Reads 8, writes 7 ($C = 7$).
     - Iteration 4: Reads 7, writes 6 ($C = 6$).
     - $P_2$ terminates.

4. **Why $C$ cannot be smaller than 6:**
   - The initial value is 10.
   - $P_1$ only issues increment instructions (`ADD #1`); $P_1$ never decreases $C$.
   - $P_2$ issues exactly 4 decrement instructions (`SUB #1`) throughout its entire lifetime.
   - In any execution trace, $C$ can decrease by at most 1 in each of $P_2$'s 4 stores:
     $$\text{Min final value} \ge 10 - 4 = 6$$

Therefore, the minimum possible final value of $C$ is 6.

Hence, the answer is 6.

## Q8
type: NAT
marks: 2
subject: dbms
topic: sql
answer: 60

Consider the relational table `Scores` populated with the following 8 rows:

| player_id | team | points |
| :--- | :--- | :--- |
| 1 | Alpha | 20 |
| 2 | Alpha | 30 |
| 3 | Alpha | NULL |
| 4 | Beta | 15 |
| 5 | Beta | NULL |
| 6 | Beta | 25 |
| 7 | Gamma | NULL |
| 8 | Gamma | NULL |

Consider the following SQL query executed on table `Scores`:

```sql
SELECT SUM(COALESCE(points, 0)) + COUNT(points) * 10
FROM Scores
WHERE team = 'Beta' OR points IS NULL;
```

The numeric value returned by this query is ______.

### Solution
Let us trace the evaluation of the SQL query step by step using standard SQL semantics and three-valued logic (3VL):

1. **Evaluation of the `WHERE team = 'Beta' OR points IS NULL` filter:**
   We evaluate the predicate for each row of `Scores`:
   - Row 1: `(1, Alpha, 20)`: `'Alpha' = 'Beta'` (FALSE) OR `20 IS NULL` (FALSE) $\implies$ FALSE. **(Discarded)**
   - Row 2: `(2, Alpha, 30)`: FALSE OR FALSE $\implies$ FALSE. **(Discarded)**
   - Row 3: `(3, Alpha, NULL)`: FALSE OR `NULL IS NULL` (TRUE) $\implies$ **TRUE**. **(Kept)**
   - Row 4: `(4, Beta, 15)`: `'Beta' = 'Beta'` (TRUE) OR FALSE $\implies$ **TRUE**. **(Kept)**
   - Row 5: `(5, Beta, NULL)`: TRUE OR TRUE $\implies$ **TRUE**. **(Kept)**
   - Row 6: `(6, Beta, 25)`: TRUE OR FALSE $\implies$ **TRUE**. **(Kept)**
   - Row 7: `(7, Gamma, NULL)`: FALSE OR TRUE $\implies$ **TRUE**. **(Kept)**
   - Row 8: `(8, Gamma, NULL)`: FALSE OR TRUE $\implies$ **TRUE**. **(Kept)**

   The surviving rows are players: $\{3, 4, 5, 6, 7, 8\}$ (total 6 rows).

2. **Evaluate `COALESCE(points, 0)` on the surviving rows:**
   - Row 3: `COALESCE(NULL, 0) = 0`
   - Row 4: `COALESCE(15, 0) = 15`
   - Row 5: `COALESCE(NULL, 0) = 0`
   - Row 6: `COALESCE(25, 0) = 25`
   - Row 7: `COALESCE(NULL, 0) = 0`
   - Row 8: `COALESCE(NULL, 0) = 0`

   $$\text{SUM}(\text{COALESCE}(\text{points}, 0)) = 0 + 15 + 0 + 25 + 0 + 0 = 40$$

3. **Evaluate `COUNT(points)` on the surviving rows:**
   - In SQL, `COUNT(column_name)` counts **only non-NULL values** present in that column.
   - Among the 6 surviving rows, the `points` column contains:
     $$\{ \text{NULL}, \; 15, \; \text{NULL}, \; 25, \; \text{NULL}, \; \text{NULL} \}$$
   - Only 2 rows have non-NULL values (players 4 and 6).
   - Therefore, $\text{COUNT}(\text{points}) = 2$.
   - *(GATE Trap: Confusing `COUNT(points)` with `COUNT(*)`. `COUNT(*)` would return 6, but `COUNT(points)` ignores NULLs and returns 2).*

4. **Compute the final query expression:**
   $$\text{Result} = \text{SUM}(\text{COALESCE}(\text{points}, 0)) + \text{COUNT}(\text{points}) \times 10$$
   $$\text{Result} = 40 + 2 \times 10 = 40 + 20 = 60$$

Hence, the answer is 60.

## Q9
type: MSQ
marks: 2
subject: toc
topic: regular-languages
answer: A, B, D

Let $\Sigma$ be a finite alphabet. Which of the following statements regarding the class of Regular Languages is/are TRUE?

(A) If $L$ is a regular language over $\Sigma$, then the language $\text{Cycle}(L) = \{ yx \mid xy \in L \}$ is always regular.
(B) If $L$ is a regular language over $\Sigma$, then the language $\text{Half}(L) = \{ x \in \Sigma^* \mid \exists y \in \Sigma^* \text{ such that } |x| = |y| \text{ and } xy \in L \}$ is always regular.
(C) If $L_1$ is a regular language and $L_1 \cap L_2$ is a regular language, then $L_2$ must be a regular language.
(D) If $L$ is a regular language over $\Sigma$, then the language $\text{Min}(L) = \{ w \in L \mid \text{no proper prefix of } w \text{ belongs to } L \}$ is always regular.

### Solution
Let us evaluate each statement individually:

- **Statement (A) is TRUE (Closure under Cycle):**
   Let $M = (Q, \Sigma, \delta, q_0, F)$ be a DFA accepting $L$. For any pair of states $p, q \in Q$, let $L_{p, q}$ denote the regular language of all strings that transition $M$ from state $p$ to state $q$.
   A string $w = yx \in \text{Cycle}(L)$ if and only if there exists a state $q \in Q$ such that $x \in L_{q_0, q}$ and $y \in L_{q, f}$ for some $f \in F$.
   Therefore, we can express $\text{Cycle}(L)$ as:
   $$\text{Cycle}(L) = \bigcup_{q \in Q} \left( \left( \bigcup_{f \in F} L_{q, f} \right) \cdot L_{q_0, q} \right)$$
   Because $Q$ is finite, this is a finite union of concatenations of regular languages. Since regular languages are closed under concatenation and finite union, $\text{Cycle}(L)$ is always regular.

- **Statement (B) is TRUE (Closure under Half):**
   Given a DFA $M = (Q, \Sigma, \delta, q_0, F)$ with $n$ states accepting $L$, we can construct a machine that recognizes $\text{Half}(L)$.
   *Construction sketch:* We guess the intermediate state $q_{\text{mid}} \in Q$ reached after reading $x$. We simulate $M$ forward from $q_0$ on input $x$ while simultaneously simulating all possible paths of length $|x|$ from $q_{\text{mid}}$ to some final state in $F$. Because this requires tracking a pair of states $(p, S)$ where $p \in Q$ and $S \subseteq Q$, the total state space is finite ($|Q| \times 2^{|Q|}$). Since a finite automaton can recognize it, $\text{Half}(L)$ is always regular.

- **Statement (C) is FALSE:**
   Counterexample:
   Choose $L_1 = \emptyset$ (which is regular).
   Let $L_2 = \{ a^n b^n \mid n \ge 0 \}$ (which is a well-known non-regular context-free language).
   Then $L_1 \cap L_2 = \emptyset \cap \{ a^n b^n \} = \emptyset$, which is regular!
   However, $L_2$ is NOT regular.

- **Statement (D) is TRUE (Closure under Min / Minimal Prefix):**
   Given a DFA $M = (Q, \Sigma, \delta, q_0, F)$ for $L$, we can construct a DFA $M'$ for $\text{Min}(L)$ by modifying the transitions:
   - For every accepting state $f \in F$, redirect all its outgoing transitions ($\delta(f, a)$ for all $a \in \Sigma$) to a newly added non-accepting dead/trap state.
   - In $M'$, once any string reaches an accepting state, reading any additional symbols leads immediately to the dead state and causes rejection.
   - Thus, $M'$ accepts string $w$ if and only if $w \in L$ and no proper prefix of $w$ drove $M'$ into an accepting state.
   Since $M'$ is a valid DFA, $\text{Min}(L)$ is always regular.

Therefore, statements A, B, and D are TRUE.

## Q10
type: MCQ
marks: 2
subject: os
topic: memory-management
answer: A

Consider a 64-bit computer architecture with the following virtual memory specifications:
- Virtual address space $= 48\text{ bits}$
- Physical address space $= 36\text{ bits}$
- Page size $= 8\text{ KB} = 8192\text{ bytes}$
- The operating system implements an **Inverted Page Table** to map virtual pages to physical frames.
- Each entry in the inverted page table contains:
  - Process ID (PID): 16 bits
  - Virtual Page Number (VPN): $k$ bits
  - Control and protection bits (valid, dirty, reference, read/write/execute): 7 bits
  - Hash chain pointer to resolve collisions: $p$ bits (pointing to an entry within the inverted page table)

Assuming each inverted page table entry is rounded up to the nearest integer number of bytes, and the hash chain pointer must be wide enough to address every frame in the inverted page table:

The total size of the Inverted Page Table (in Megabytes, where $1\text{ MB} = 2^{20}\text{ bytes}$) is:

(A) $88\text{ MB}$
(B) $64\text{ MB}$
(C) $96\text{ MB}$
(D) $128\text{ MB}$

### Solution
Let us determine the dimensions of the inverted page table:

1. **Number of physical frames:**
   - Physical address size $= 36\text{ bits}$.
   - Page size $= 8\text{ KB} = 2^{13}\text{ bytes} \implies \text{Page offset} = 13\text{ bits}$.
   - Number of physical frames in memory:
     $$\text{Number of frames} = \frac{2^{36}}{2^{13}} = 2^{23}\text{ frames}$$
   - An Inverted Page Table contains **exactly one entry per physical frame**.
   - Therefore, the inverted page table contains exactly $2^{23}$ entries.

2. **Virtual Page Number (VPN) size ($k$):**
   - Virtual address size $= 48\text{ bits}$.
   - Since page offset is 13 bits:
     $$k = 48 - 13 = 35\text{ bits}$$

3. **Hash chain pointer size ($p$):**
   - The hash chain pointer references entries within the inverted page table.
   - Since there are $2^{23}$ entries:
     $$p = \log_2(2^{23}) = 23\text{ bits}$$

4. **Total size of each Inverted Page Table Entry:**
   $$\text{Entry bits} = \text{PID} + \text{VPN} + \text{Control bits} + \text{Hash pointer}$$
   $$\text{Entry bits} = 16 + 35 + 7 + 23 = 81\text{ bits}$$
   - Rounding up to the nearest integer number of bytes:
     $$\text{Entry size} = \left\lceil \frac{81}{8} \right\rceil = \lceil 10.125 \rceil = 11\text{ bytes}$$

5. **Total Inverted Page Table Size:**
   $$\text{Total Size} = 2^{23}\text{ entries} \times 11\text{ bytes/entry} = 8 \times 2^{20} \times 11\text{ bytes} = 88 \times 2^{20}\text{ bytes} = 88\text{ MB}$$

Hence, (A) is the correct option.

## Q11
type: MSQ
marks: 2
subject: dbms
topic: functional-dependencies-normal-forms
answer: A, B, D

Consider a relation schema $R(A, B, C, D, E)$ with the following set of functional dependencies:

$$F = \{ A \to B, \quad BC \to D, \quad D \to E, \quad E \to A \}$$

Which of the following statements is/are TRUE?

(A) The relation $R$ is in 3NF, but NOT in BCNF.
(B) The decomposition of $R$ into $R_1(A, B)$ and $R_2(A, C, D, E)$ is a lossless-join decomposition.
(C) The decomposition of $R$ into $R_1(A, B)$ and $R_2(A, C, D, E)$ is dependency-preserving.
(D) In the decomposition, relation $R_1$ is in BCNF, while relation $R_2$ is in 3NF but NOT in BCNF.

### Solution
Let us analyze relation schema $R$ and the proposed decomposition:

1. **Candidate Keys of $R$:**
   - Attribute $C$ does not appear on the right-hand side of any functional dependency in $F$; therefore, $C$ must be part of every candidate key.
   - Compute closures:
     - $(AC)^+ = \{A, C\} \xrightarrow{A \to B} \{A, B, C\} \xrightarrow{BC \to D} \{A, B, C, D\} \xrightarrow{D \to E} \{A, B, C, D, E\} = R$. So $AC$ is a candidate key.
     - From $E \to A$: $(EC)^+ = \{A, B, C, D, E\} = R$. So $EC$ is a candidate key.
     - From $D \to E$: $(DC)^+ = \{A, B, C, D, E\} = R$. So $DC$ is a candidate key.
     - From $BC \to D$: $(BC)^+ = \{A, B, C, D, E\} = R$. So $BC$ is a candidate key.
   - The candidate keys are: $\{ AC, \; BC, \; DC, \; EC \}$.
   - Prime attributes (attributes that belong to at least one candidate key): $\{ A, B, C, D, E \}$ — **all attributes are prime**.

2. **Normal Form of $R$:**
   - A relation is in 3NF if for every non-trivial functional dependency $X \to Y$, either $X$ is a superkey OR every attribute in $Y$ is prime.
   - Since every attribute in $R$ is prime, every dependency in $F$ trivially satisfies the second condition of 3NF. Thus, $R$ is in **3NF**.
   - For BCNF, every non-trivial dependency must have a superkey on the LHS. In $A \to B$, $A$ is not a superkey (its closure is $\{A, B\} \ne R$). Thus, $R$ is **NOT in BCNF**.
   - Therefore, Statement (A) is **TRUE**.

3. **Lossless-Join Analysis of $(R_1, R_2)$:**
   - $R_1 = (A, B)$ and $R_2 = (A, C, D, E)$.
   - Common attribute set: $R_1 \cap R_2 = \{A\}$.
   - Under $F$, $(A)^+ = \{A, B\} = R_1$.
   - Because $R_1 \cap R_2 \to R_1$ holds, the common attribute $A$ forms a superkey of relation $R_1$.
   - By the standard theorem for binary decompositions, the decomposition is **lossless-join**.
   - Therefore, Statement (B) is **TRUE**.

4. **Dependency Preservation Analysis:**
   - Check if $BC \to D$ is preserved in $\{R_1, R_2\}$:
     - The functional dependencies holding on $R_1(A, B)$ is $\{ A \to B \}$.
     - The functional dependencies holding on $R_2(A, C, D, E)$ are $\{ AC \to D, \; D \to E, \; E \to A \}$.
     - Let $F' = \{ A \to B, \; AC \to D, \; D \to E, \; E \to A \}$.
     - Compute the closure of $BC$ under $F'$:
       $$(BC)^+_{F'} = \{B, C\}$$
       (We cannot use $AC \to D$ because attribute $A$ is not in the set, and $A \to B$ cannot derive $A$).
     - Since $D \notin (BC)^+_{F'}$, the dependency $BC \to D$ cannot be derived from the dependencies holding on the decomposed relations.
     - Therefore, the decomposition is **NOT dependency-preserving**.
   - Statement (C) is **FALSE**.

5. **Normal Forms of $R_1$ and $R_2$:**
   - In $R_1(A, B)$: Candidate key is $A$. The only non-trivial dependency is $A \to B$, where $A$ is a superkey. Thus, $R_1$ is in **BCNF**.
   - In $R_2(A, C, D, E)$: Candidate keys are $AC, DC, EC$. All attributes $\{A, C, D, E\}$ are prime, so $R_2$ is in 3NF. Dependency $E \to A$ holds in $R_2$, but $E$ is not a superkey of $R_2$. Thus, $R_2$ is **NOT in BCNF**.
   - Therefore, Statement (D) is **TRUE**.

Hence, statements A, B, and D are TRUE.

## Q12
type: MCQ
marks: 2
subject: toc
topic: context-free-languages
answer: A

Consider the following statements regarding Deterministic Context-Free Languages (DCFL) and Context-Free Languages (CFL):

- $S_1$: The class of DCFLs is closed under complementation, but is NOT closed under union or intersection.
- $S_2$: Every DCFL can be generated by an unambiguous context-free grammar.
- $S_3$: The language equivalence problem ($L_1 = L_2$) is undecidable for arbitrary DCFLs $L_1$ and $L_2$.
- $S_4$: If $L$ is a DCFL and $R$ is a regular language, then both $L \cup R$ and $L \cap R$ are guaranteed to be DCFLs.

Which of the above statements are TRUE?

(A) $S_1, S_2$, and $S_4$ only
(B) $S_1$ and $S_3$ only
(C) $S_2, S_3$, and $S_4$ only
(D) $S_1, S_2, S_3$, and $S_4$

### Solution
Let us evaluate each statement individually:

1. **Statement $S_1$ is TRUE:**
   - DCFLs are accepted by Deterministic Pushdown Automata (DPDA). By making the DPDA halt on all inputs and flipping the accepting and non-accepting states (with appropriate handling of $\epsilon$-loops), a DPDA for $\overline{L}$ can always be constructed. Hence, DCFLs are **closed under complementation**.
   - DCFLs are NOT closed under union: $\{ a^n b^n c^m \mid n, m \ge 1 \}$ and $\{ a^n b^m c^m \mid n, m \ge 1 \}$ are DCFLs, but their union requires guessing whether $b$'s match $a$'s or $c$'s, which cannot be recognized deterministically.
   - DCFLs are NOT closed under intersection: $\{ a^n b^n c^m \} \cap \{ a^m b^n c^n \} = \{ a^n b^n c^n \}$, which is not even a CFL.

2. **Statement $S_2$ is TRUE:**
   - Every DPDA has exactly one deterministic computation path for every accepted string. Converting a DPDA into an equivalent context-free grammar produces an unambiguous grammar.
   - Any language that is inherently ambiguous can never be accepted by a DPDA.

3. **Statement $S_3$ is FALSE:**
   - For general Context-Free Languages, the equivalence problem ($L_1 = L_2$) is undecidable.
   - However, for Deterministic Context-Free Languages (DCFLs), the equivalence problem is **DECIDABLE** (proven by Géraud Sénizergues in 1997).

4. **Statement $S_4$ is TRUE:**
   - The product construction between a DPDA (recognizing $L$) and a DFA (recognizing $R$) tracks the state transitions of the DFA alongside the DPDA. Because DFA state transitions are completely deterministic and do not consume stack symbols, the product machine remains a completely deterministic pushdown automaton (DPDA).
   - Thus, $L \cap R$ is a DCFL.
   - Furthermore, by De Morgan's laws:
     $$L \cup R = \overline{\overline{L} \cap \overline{R}}$$
     Since $\overline{L}$ is a DCFL and $\overline{R}$ is regular, $\overline{L} \cap \overline{R}$ is a DCFL, and its complement is also a DCFL. Hence, $L \cup R$ is a DCFL.

Therefore, statements $S_1, S_2,$ and $S_4$ are TRUE.

Hence, (A) is the correct option.

## Q13
type: NAT
marks: 2
subject: os
topic: file-systems-io
answer: 38

A hard disk drive has 200 cylinders numbered from 0 to 199. The disk queue contains pending read/write requests for the following cylinders:

$$95, \quad 180, \quad 34, \quad 119, \quad 11, \quad 123, \quad 62, \quad 64$$

The read/write head is currently positioned at cylinder 50 and is moving in the direction of **increasing cylinder numbers** (towards cylinder 199).

Let $T_{\text{SCAN}}$ be the total head movement (in cylinders) under the **SCAN** (Elevator) scheduling algorithm.
Let $T_{\text{LOOK}}$ be the total head movement (in cylinders) under the **LOOK** scheduling algorithm.

The difference $(T_{\text{SCAN}} - T_{\text{LOOK}})$ is ______ cylinders.

### Solution
Let us trace the head movement for both SCAN and LOOK algorithms:
- Current head position: 50
- Direction of movement: Increasing (towards 199)
- Requested cylinders sorted in ascending order:
  $$\{ 11, \; 34, \; 62, \; 64, \; 95, \; 119, \; 123, \; 180 \}$$

---

1. **Tracing SCAN (Elevator algorithm):**
   - In SCAN, the head moves in the given direction servicing requests until it reaches the **boundary cylinder (199)**, regardless of whether there is a request at 199.
   - Then, it reverses direction and moves towards cylinder 0, servicing all remaining requests in the reverse direction until the last pending request is reached.
   - **Forward pass:**
     - Starts at 50, services $62, 64, 95, 119, 123, 180$, and moves all the way to boundary cylinder $199$.
     - Head movement $= 199 - 50 = 149$ cylinders.
   - **Reverse pass:**
     - From 199, moves downward servicing $34$ and $11$.
     - The lowest request is at cylinder 11 (the head does not need to proceed to 0 since no requests remain).
     - Head movement $= 199 - 11 = 188$ cylinders.
   - **Total SCAN head movement:**
     $$T_{\text{SCAN}} = (199 - 50) + (199 - 11) = 149 + 188 = 337\text{ cylinders}$$

---

2. **Tracing LOOK algorithm:**
   - In LOOK, the head moves in the given direction servicing requests only as far as the **furthest requested cylinder (180)**, without travelling to the disk boundary (199).
   - Upon servicing the request at 180, it immediately reverses direction and travels downward to service the lowest requested cylinder (11).
   - **Forward pass:**
     - From 50 to the highest requested cylinder 180.
     - Head movement $= 180 - 50 = 130$ cylinders.
   - **Reverse pass:**
     - From 180 down to the lowest requested cylinder 11.
     - Head movement $= 180 - 11 = 169$ cylinders.
   - **Total LOOK head movement:**
     $$T_{\text{LOOK}} = (180 - 50) + (180 - 11) = 130 + 169 = 299\text{ cylinders}$$

---

3. **Computing the difference $(T_{\text{SCAN}} - T_{\text{LOOK}})$:**
   $$T_{\text{SCAN}} - T_{\text{LOOK}} = 337 - 299 = 38\text{ cylinders}$$

*(Alternative Direct Insight: Notice that SCAN travels to cylinder 199 and back to 180, covering the distance $(199 - 180)$ twice, whereas LOOK reverses immediately at 180. Thus, the extra distance is simply $2 \times (199 - 180) = 2 \times 19 = 38$ cylinders).*

Hence, the answer is 38.

## Q14
type: MCQ
marks: 2
subject: dbms
topic: relational-algebra-calculus
answer: B

Let $R(A, B)$ and $S(B, C)$ be two relations, where attribute $A$ is NOT a candidate key of $R$.

Consider the following two relational algebra expressions:

$$E_1 = \Pi_A(R) \setminus \Pi_A(R \bowtie S)$$
$$E_2 = \Pi_A \left( R \setminus (R \bowtie \Pi_B(S)) \right)$$

Which of the following statements is ALWAYS TRUE?

(A) $E_1 = E_2$ for all relational instances of $R$ and $S$
(B) $E_1 \subseteq E_2$ for all relational instances of $R$ and $S$, but $E_2 \subseteq E_1$ does not necessarily hold
(C) $E_2 \subseteq E_1$ for all relational instances of $R$ and $S$, but $E_1 \subseteq E_2$ does not necessarily hold
(D) Neither $E_1 \subseteq E_2$ nor $E_2 \subseteq E_1$ necessarily holds

### Solution
Let us mathematically analyze the meanings of both expressions:

1. **Meaning of Expression $E_1$:**
   $$E_1 = \Pi_A(R) \setminus \Pi_A(R \bowtie S)$$
   - $\Pi_A(R)$ is the set of all distinct $A$-values present in $R$.
   - $\Pi_A(R \bowtie S)$ is the set of all $A$-values in $R$ that appear in at least one tuple that matches some tuple in $S$ on attribute $B$.
   - Therefore, an attribute value $a \in E_1$ if and only if $a$ appears in $R$, and **NO tuple** in $R$ with $A = a$ has a $B$-value present in $S$.

2. **Meaning of Expression $E_2$:**
   $$E_2 = \Pi_A \left( R \setminus (R \bowtie \Pi_B(S)) \right)$$
   - $R \bowtie \Pi_B(S)$ selects all tuples $(a, b) \in R$ where $b \in \Pi_B(S)$.
   - $R \setminus (R \bowtie \Pi_B(S))$ contains all tuples $(a, b) \in R$ where $b \notin \Pi_B(S)$.
   - Therefore, an attribute value $a \in E_2$ if and only if there is **AT LEAST ONE tuple** in $R$ with $A = a$ whose $B$-value is not in $S$.

3. **Proof that $E_1 \subseteq E_2$ always holds:**
   - Suppose $a \in E_1$.
   - Then $a \in \Pi_A(R)$, meaning there exists at least one tuple $(a, b) \in R$.
   - Since $a \notin \Pi_A(R \bowtie S)$, no tuple in $R$ with $A = a$ can have its $B$-value present in $S$.
   - In particular, for the tuple $(a, b)$, $b \notin \Pi_B(S)$.
   - Therefore, $(a, b) \in R \setminus (R \bowtie \Pi_B(S))$.
   - Projecting on $A$ yields $a \in E_2$.
   - Hence, $a \in E_1 \implies a \in E_2$ is unconditionally true for all relations.
   - Thus, $E_1 \subseteq E_2$ **ALWAYS holds**.

4. **Counterexample showing $E_2 \not\subseteq E_1$:**
   Consider the following instance:
   - $R = \{ (a_1, b_1), \; (a_1, b_2) \}$
   - $S = \{ (b_1, c_1) \}$
   Now evaluate both expressions:
   - $R \bowtie S = \{ (a_1, b_1, c_1) \} \implies \Pi_A(R \bowtie S) = \{ a_1 \}$.
   - $\Pi_A(R) = \{ a_1 \}$.
   - $E_1 = \{ a_1 \} \setminus \{ a_1 \} = \emptyset$.
   - For $E_2$:
     - $R \bowtie \Pi_B(S) = \{ (a_1, b_1) \}$.
     - $R \setminus (R \bowtie \Pi_B(S)) = \{ (a_1, b_2) \}$.
     - $E_2 = \Pi_A(\{ (a_1, b_2) \}) = \{ a_1 \}$.
   Here, $E_1 = \emptyset$ and $E_2 = \{ a_1 \}$.
   Notice that $E_1 \subseteq E_2$ ($\emptyset \subseteq \{a_1\}$), but $E_2 \not\subseteq E_1$ ($\{a_1\} \not\subseteq \emptyset$).

Therefore, $E_1 \subseteq E_2$ always holds, but $E_2 \subseteq E_1$ does not necessarily hold.

Hence, (B) is the correct option.

## Q15
type: MSQ
marks: 2
subject: toc
topic: turing-machines-undecidability
answer: A, B, D

Consider the following four languages representing decision problems regarding Turing machines (where $\langle M \rangle$ denotes the standard binary encoding of Turing machine $M$):

- $L_1 = \{ \langle M \rangle \mid M \text{ halts when started on the empty string } \epsilon \}$
- $L_2 = \{ \langle M \rangle \mid M \text{ halts in at most 100 steps when started on the empty string } \epsilon \}$
- $L_3 = \{ \langle M \rangle \mid L(M) \text{ is a finite language} \}$
- $L_4 = \{ \langle M \rangle \mid L(M) \text{ is a regular language} \}$

Which of the following statements is/are TRUE?

(A) $L_1$ is Recursively Enumerable (Turing-recognizable), but NOT Recursive (decidable).
(B) $L_2$ is Recursive (decidable).
(C) $L_3$ is Recursively Enumerable (Turing-recognizable).
(D) Neither $L_4$ nor its complement $\overline{L_4}$ is Recursively Enumerable.

### Solution
Let us analyze each language systematically using computability theory and Rice's Theorem:

- **Statement (A) is TRUE:**
   - $L_1$ is the language of Turing machines that halt on the blank/empty input.
   - By reduction from the Halting Problem (or by Rice's Theorem for halting), determining whether an arbitrary Turing machine halts on $\epsilon$ is **undecidable** (not recursive).
   - However, a Universal Turing Machine can simulate $M$ on $\epsilon$ step-by-step. If $M$ halts, the simulator halts and accepts.
   - Hence, $L_1$ is semi-decidable / **Recursively Enumerable (RE), but not Recursive**.

- **Statement (B) is TRUE:**
   - The condition in $L_2$ restricts the execution time to at most 100 steps.
   - A decider Turing machine can simulate $M$ on $\epsilon$ for at most 100 transitions.
   - If $M$ enters a halt state within 100 transitions, the decider accepts; otherwise, the decider stops and rejects.
   - Because the simulation is strictly bounded to 100 steps, the decider **always halts and gives an answer in finite time**.
   - Hence, $L_2$ is **Recursive (decidable)**.

- **Statement (C) is FALSE:**
   - Determining whether $L(M)$ is finite ($L_{\text{finite}}$) is undecidable by Rice's Theorem, as finiteness is a non-trivial semantic property of Turing machines.
   - Moreover, finiteness is a $\Sigma_2$-complete property in the arithmetical hierarchy: verifying that $L(M)$ is finite cannot be confirmed by seeing any finite number of accepted strings, since $M$ could always accept an infinite number of longer strings later.
   - Therefore, $L_3$ is **NOT Recursively Enumerable** (neither $L_3$ nor its complement is RE).

- **Statement (D) is TRUE:**
   - Testing whether $L(M)$ is regular ($L_{\text{regular}}$) is a non-trivial semantic property of the language of $M$. By Rice's Theorem, it is undecidable.
   - Furthermore, the property of being regular is non-monotone (e.g., $\emptyset$ is regular, $\{ a^n b^n \}$ is not regular, and $\Sigma^*$ is regular).
   - By the Extended Rice's Theorem (Rice-Shapiro theorem), a language property can be RE only if it is compact and monotone.
   - Because regularity violates the Rice-Shapiro conditions, neither $L_4$ nor its complement $\overline{L_4}$ is Recursively Enumerable.

Therefore, statements A, B, and D are TRUE.
