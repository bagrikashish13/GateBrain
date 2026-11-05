---
title: "OS + DBMS + TOC · Mock 07"
duration: 45
created: 2026-11-05
description: "15-Question GATE-calibrated mock across Operating Systems, DBMS, and Theory of Computation."
---

## Q1
type: MCQ
marks: 1
subject: os
topic: deadlock
answer: A

Consider the following three statements regarding deadlock handling in operating systems:

- $S_1$: In a system where every resource type has only a single instance, the presence of a cycle in the Resource Allocation Graph (RAG) is both a necessary and sufficient condition for deadlock.
- $S_2$: In the Banker's algorithm for deadlock avoidance, if the system enters an unsafe state, it is guaranteed that the system will inevitably transition into a deadlock state.
- $S_3$: Deadlock prevention by imposing a total ordering on all resource types and requiring processes to request resources in strictly increasing order eliminates the "Circular Wait" condition.

Which of the statements is/are **TRUE**?

(A) $S_1$ and $S_3$ only
(B) $S_1$ and $S_2$ only
(C) $S_2$ and $S_3$ only
(D) $S_1, S_2$, and $S_3$

### Solution
- **Statement $S_1$ is TRUE:**
  - In a Resource Allocation Graph where every resource class has strictly 1 instance, a cycle implies that each process in the cycle is holding 1 resource and waiting for another resource held by the next process in the cycle.
  - Since no other instances exist, none of these processes can make progress.
  - Therefore, for single-instance resource systems: $\text{Cycle in RAG} \iff \text{Deadlock}$. (In multi-instance systems, a cycle is necessary but not sufficient; a knot is sufficient).
- **Statement $S_2$ is FALSE:**
  - An **unsafe state** is NOT synonymous with a deadlocked state.
  - An unsafe state simply means that the operating system cannot guarantee that deadlock will be avoided if every process requests its maximum declared resource demand at the same time.
  - If processes do not claim their maximum claims simultaneously, or if a process finishes early and releases resources, the system can return to a safe state without ever encountering a deadlock. Deadlocked states are a proper subset of unsafe states ($\text{Deadlocked} \subset \text{Unsafe}$).
- **Statement $S_3$ is TRUE:**
  - Havender's hierarchical ordering assigns a global unique integer $F(R)$ to each resource type $R$.
  - By requiring that any process requesting resource $R_j$ after holding $R_i$ must have $F(R_j) > F(R_i)$, it is impossible to form a circular chain $P_0 \to P_1 \to \dots \to P_n \to P_0$ because that would require $F(R_0) < F(R_1) < \dots < F(R_n) < F(R_0)$, which is a contradiction.
  - Hence, the **Circular Wait** condition is eliminated.
- Therefore, only $S_1$ and $S_3$ are TRUE. Option (A) is correct.

## Q2
type: MCQ
marks: 1
subject: dbms
topic: er-model
answer: A

Consider an Entity-Relationship (ER) diagram with two strong entity sets $E_1$ and $E_2$:
- $E_1$ has attributes $\{A_1, A_2\}$ with primary key $A_1$.
- $E_2$ has attributes $\{B_1, B_2\}$ with primary key $B_1$.
- A binary relationship $R$ exists between $E_1$ and $E_2$ with a descriptive attribute $R_1$.
- The cardinality ratio of $R$ from $E_1$ to $E_2$ is **many-to-one** ($N:1$), meaning each entity in $E_1$ is associated with at most one entity in $E_2$, while each entity in $E_2$ can be associated with multiple entities in $E_1$.
- $E_1$ has **total participation** in $R$, whereas $E_2$ has **partial participation** in $R$.

To represent this ER diagram in the relational model with the minimum number of tables and with **no `NULL` values** in any foreign key column, which of the following designs should be used?

(A) 2 tables: $E_1(A_1, A_2, B_1, R_1)$ with primary key $A_1$, and $E_2(B_1, B_2)$ with primary key $B_1$.
(B) 2 tables: $E_1(A_1, A_2)$ with primary key $A_1$, and $E_2(B_1, B_2, A_1, R_1)$ with primary key $B_1$.
(C) 3 tables: $E_1(A_1, A_2)$ with primary key $A_1$, $E_2(B_1, B_2)$ with primary key $B_1$, and $R(A_1, B_1, R_1)$ with primary key $A_1$.
(D) 1 table: $(A_1, A_2, B_1, B_2, R_1)$ with primary key $A_1$.

### Solution
- **Analyze relationship constraints:**
  - $R$ is many-to-one ($N:1$) from $E_1$ to $E_2$.
  - Each entity in $E_1$ is associated with at most one entity in $E_2$.
  - $E_1$ has **total participation** in $R$. This means every tuple in $E_1$ MUST participate in $R$, and therefore every entity in $E_1$ is associated with *exactly one* entity in $E_2$.
- **Table reduction:**
  - Since every $E_1$ entity maps to exactly one $E_2$ entity, we can collapse the relationship $R$ into the table for $E_1$ by including the primary key of $E_2$ ($B_1$) as a foreign key along with the descriptive attribute $R_1$.
  - This results in table: $E_1(A_1, A_2, B_1, R_1)$ with primary key $A_1$.
  - Because $E_1$'s participation is total, $B_1$ and $R_1$ will **never be `NULL`** for any row in $E_1$.
  - Entity set $E_2$ forms its own table: $E_2(B_1, B_2)$ with primary key $B_1$.
- **Why other options are incorrect:**
  - Option (B) attempts to place $A_1$ inside $E_2$. Because $E_2$ can be associated with multiple entities in $E_1$, $B_1$ would not be unique in $E_2$, or $A_1$ would violate 1NF/functional dependencies.
  - Option (C) uses 3 tables, which is correct relationally but is not minimal (it introduces an unnecessary extra table for $R$).
  - Option (D) collapses everything into 1 table, which introduces massive redundancy for $E_2$ attributes ($B_1, B_2$) across multiple $E_1$ entities, violating 2NF/3NF.
- Hence, the minimum number of tables is 2: $E_1(A_1, A_2, B_1, R_1)$ and $E_2(B_1, B_2)$. Option (A) is correct.

## Q3
type: MCQ
marks: 1
subject: toc
topic: regular-expressions-finite-automata
answer: A

Which of the following regular expressions represents the language of all binary strings over $\Sigma = \{0, 1\}$ that do **NOT** contain the substring $11$?

(A) $(0 + 10)^*(1 + \epsilon)$
(B) $(0 + 01)^*(1 + \epsilon)$
(C) $(10 + 0)^*$
(D) $(0^* 1 0^*)^*$

### Solution
- **Characterization of strings without substring $11$:**
  - In any binary string that does not contain $11$, every occurrence of the symbol $1$ must be immediately followed by a $0$, unless that $1$ appears as the very last symbol of the string.
  - Thus, the string can be decomposed into blocks of $0$ and $10$, followed by an optional trailing $1$.
  - This matches the regular expression:
    $$(0 + 10)^*(1 + \epsilon)$$
  - Let us verify that it accepts all valid strings:
    - $\epsilon$: $(0+10)^0 \cdot \epsilon = \epsilon$ (Valid)
    - `0`: $(0) \cdot \epsilon = 0$ (Valid)
    - `1`: $(0+10)^0 \cdot 1 = 1$ (Valid)
    - `10`: $(10) \cdot \epsilon = 10$ (Valid)
    - `01`: $(0) \cdot 1 = 01$ (Valid)
    - `101`: $(10) \cdot 1 = 101$ (Valid)
    - `10010`: $(10)(0)(10) \cdot \epsilon = 10010$ (Valid)
  - It can never generate $11$ because inside $(0 + 10)^*$, every $1$ is followed by a $0$, and the only other $1$ is at the very end preceded by $0$ (or start of string).
- **Why other options are incorrect:**
  - **(B) $(0 + 01)^*(1 + \epsilon)$:** Cannot generate the string `10`, which does not contain $11$. In $(0 + 01)^*$, every $1$ must be immediately preceded by $0$, so no string can start with $10$.
  - **(C) $(10 + 0)^*:** Cannot generate any string ending in $1$ (such as `1`, `01`, `101`), all of which are valid strings without $11$.
  - **(D) $(0^* 1 0^*)^*:** Generates any binary string with any number of $1$s, including $11$ (e.g. taking $0^* 1 0^*$ with 0 zeros twice yields $11$).
- Hence, Option (A) is correct.

## Q4
type: MCQ
marks: 1
subject: os
topic: cpu-scheduling
answer: A

Consider the following four statements regarding CPU scheduling algorithms:

- $S_1$: In Round Robin (RR) scheduling, as the time quantum $q \to \infty$, the scheduling behavior becomes equivalent to First-Come-First-Served (FCFS).
- $S_2$: For a set of stationary processes arriving at time $t = 0$, the non-preemptive Shortest Job First (SJF) algorithm is optimal in the sense of minimizing average waiting time.
- $S_3$: In priority scheduling, aging is an effective technique used to eliminate the possibility of starvation of low-priority processes.
- $S_4$: The convoy effect in First-Come-First-Served (FCFS) occurs when short CPU-bound processes are blocked waiting behind a long I/O-bound process.

Which of the statements is/are **TRUE**?

(A) $S_1, S_2$, and $S_3$ only
(B) $S_1$ and $S_3$ only
(C) $S_2, S_3$, and $S_4$ only
(D) $S_1, S_2, S_3$, and $S_4$

### Solution
- **Statement $S_1$ is TRUE:**
  - In Round Robin scheduling, if the time quantum $q$ is larger than the burst time of any process in the system ($q \to \infty$), no process will be preempted before finishing its CPU burst.
  - Each process executes to completion in the order it arrived in the ready queue, which is exactly the behavior of FCFS.
- **Statement $S_2$ is TRUE:**
  - Non-preemptive SJF gives the minimum average waiting time for a set of processes that are simultaneously available at $t = 0$.
  - Scheduling shorter jobs first decreases the waiting times of all subsequent jobs by a greater amount than scheduling longer jobs first would increase them.
- **Statement $S_3$ is TRUE:**
  - Starvation (indefinite blocking) in priority scheduling occurs when a stream of high-priority processes keeps arriving, preventing low-priority processes from ever getting the CPU.
  - **Aging** gradually increases the priority of processes as they wait in the ready queue over time, ensuring that even the lowest-priority process will eventually achieve the highest priority and execute.
- **Statement $S_4$ is FALSE (Classic GATE Trap):**
  - The convoy effect in FCFS occurs when a single **long CPU-bound process** holds the CPU while multiple **short I/O-bound processes** wait in the ready queue.
  - The I/O devices sit idle while the CPU-bound process runs. When it finishes and goes to I/O, the short I/O-bound processes quickly execute their small CPU bursts and rush back to the I/O queue, leaving the CPU idle.
  - Statement $S_4$ erroneously states that short CPU-bound processes wait behind a long I/O-bound process (an I/O-bound process relinquishes the CPU quickly and would not block the CPU queue).
- Therefore, only $S_1, S_2$, and $S_3$ are TRUE. Option (A) is correct.

## Q5
type: MCQ
marks: 1
subject: dbms
topic: transactions-concurrency-control
answer: A

Consider the following statements regarding variants of the Two-Phase Locking (2PL) protocol:

- $S_1$: Basic Two-Phase Locking (2PL) guarantees conflict serializability and ensures freedom from deadlocks.
- $S_2$: Conservative Two-Phase Locking (Static 2PL) prevents deadlocks by requiring a transaction to obtain all its required locks prior to beginning execution.
- $S_3$: Strict Two-Phase Locking prevents cascading aborts by holding all exclusive (write) locks until the transaction completes (commits or aborts).

Which of the above statements is/are **TRUE**?

(A) $S_2$ and $S_3$ only
(B) $S_1$ and $S_3$ only
(C) $S_1$ and $S_2$ only
(D) $S_1, S_2$, and $S_3$

### Solution
- **Statement $S_1$ is FALSE:**
  - Basic 2PL ensures that transactions follow a growing phase (only acquiring locks) followed by a shrinking phase (only releasing locks).
  - While Basic 2PL guarantees **conflict serializability**, it **DOES NOT** guarantee freedom from deadlocks. Two transactions can easily enter a cyclic wait while attempting to acquire locks (e.g., $T_1$ holds lock on $A$ and requests lock on $B$; $T_2$ holds lock on $B$ and requests lock on $A$).
  - Basic 2PL can also suffer from cascading aborts.
- **Statement $S_2$ is TRUE:**
  - Conservative (Static) 2PL requires each transaction to lock all the data items it will ever access before it begins executing. If any required lock cannot be granted, the transaction locks none of them and waits.
  - This eliminates the "Hold and Wait" condition for deadlock, thereby **guaranteeing freedom from deadlocks**.
- **Statement $S_3$ is TRUE:**
  - In Strict 2PL, a transaction may release shared (read) locks in its shrinking phase, but it must retain all **exclusive ($X$) locks** until it finishes (either commits or aborts).
  - Because no other transaction can read or write any data item modified by $T$ until $T$ commits, no transaction can read uncommitted ("dirty") data.
  - Therefore, dirty reads are impossible, and **cascading aborts are prevented** (the schedule is guaranteed to be cascadeless and strict).
- Hence, $S_2$ and $S_3$ only are TRUE. Option (A) is correct.

## Q6
type: MCQ
marks: 1
subject: toc
topic: turing-machines-undecidability
answer: A

Consider the following three statements regarding the Post Correspondence Problem (PCP):

- $S_1$: The Post Correspondence Problem over an alphabet $\Sigma$ with $|\Sigma| \ge 2$ is undecidable.
- $S_2$: The Post Correspondence Problem over a unary alphabet (i.e., $|\Sigma| = 1$) is decidable.
- $S_3$: The Modified Post Correspondence Problem (MPCP) is decidable.

Which of the statements is/are **TRUE**?

(A) $S_1$ and $S_2$ only
(B) $S_1$ and $S_3$ only
(C) $S_2$ and $S_3$ only
(D) $S_1, S_2$, and $S_3$

### Solution
- **Statement $S_1$ is TRUE:**
  - Emil Post proved in 1946 that the Post Correspondence Problem is undecidable for any alphabet containing 2 or more symbols ($|\Sigma| \ge 2$). It is commonly used as the source problem to prove undecidability of ambiguity and intersection emptiness in CFGs.
- **Statement $S_2$ is TRUE:**
  - Over a unary alphabet $\Sigma = \{a\}$, any string is uniquely characterized by its length: $w = a^k \implies |w| = k$.
  - Given pairs $(w_i, x_i)$, let $u_i = |w_i|$ and $v_i = |x_i|$. A match sequence of indices $i_1, i_2, \dots, i_m$ requires:
    $$\sum_{k=1}^m u_{i_k} = \sum_{k=1}^m v_{i_k} \iff \sum_{k=1}^m (u_{i_k} - v_{i_k}) = 0$$
  - This is solvable if and only if either:
    1. There exists some index $i$ such that $u_i = v_i$ (a single-pair trivial match), OR
    2. There exists at least one pair with $u_i > v_i$ and at least one pair with $u_j < v_j$ (positive and negative differences allow balancing to 0).
  - Because this condition can be checked algorithmically in $O(n)$ time, PCP over a unary alphabet is **decidable**.
- **Statement $S_3$ is FALSE:**
  - The Modified Post Correspondence Problem (MPCP) requires that the matching sequence of indices must begin with the first pair $(w_1, x_1)$.
  - MPCP is **undecidable**. In fact, Turing machine acceptance is reduced directly to MPCP, which is then reduced to PCP to prove that PCP is undecidable.
- Therefore, $S_1$ and $S_2$ only are TRUE. Option (A) is correct.

## Q7
type: NAT
marks: 2
subject: os
topic: memory-management
answer: 320

Consider a computer system with the following virtual memory specifications:
- Virtual address space: 32 bits
- Physical memory (RAM) size: $512\text{ MB}$ ($2^{29}\text{ bytes}$)
- Page size: $8\text{ KB}$ ($2^{13}\text{ bytes}$)
- The system employs an **Inverted Page Table** to map virtual addresses to physical frame numbers.
- Each Inverted Page Table Entry (IPTE) contains:
  - Process ID (PID)
  - Virtual Page Number (VPN)
  - Protection, valid, and status bits: 4 bits
- The operating system supports a maximum of $1024$ concurrent processes.
- Each entry in the inverted page table is allocated the minimum whole number of bytes (i.e. byte-aligned).

What is the total size of the Inverted Page Table in Kilobytes (KB)?

### Solution
- **Step 1: Determine the number of entries in the Inverted Page Table:**
  - Unlike a hierarchical page table where entries correspond to virtual pages, an Inverted Page Table has **exactly one entry per physical frame**.
  - Frame count:
    $$\text{Number of physical frames} = \frac{\text{Physical Memory Size}}{\text{Page Size}} = \frac{512\text{ MB}}{8\text{ KB}} = \frac{2^{29}}{2^{13}} = 2^{16} = 65,536\text{ frames}$$
  - Therefore, the Inverted Page Table has exactly $2^{16} = 65,536$ entries.
- **Step 2: Calculate the size of each Inverted Page Table Entry (IPTE):**
  - **Process ID (PID) field:**
    - Maximum concurrent processes $= 1024 = 2^{10}$.
    - Bits required for PID $= \lceil \log_2(1024) \rceil = 10\text{ bits}$.
  - **Virtual Page Number (VPN) field:**
    - Virtual address size $= 32\text{ bits}$.
    - Page offset bits $= \log_2(8\text{ KB}) = \log_2(2^{13}) = 13\text{ bits}$.
    - Virtual Page Number (VPN) bits $= 32 - 13 = 19\text{ bits}$.
  - **Status and protection bits:**
    - Given as $4\text{ bits}$.
  - **Total bits per entry:**
    $$\text{Bits per entry} = 10\text{ (PID)} + 19\text{ (VPN)} + 4\text{ (Status)} = 33\text{ bits}$$
  - **Byte-alignment:**
    $$\text{Bytes per entry} = \left\lceil \frac{33}{8} \right\rceil = 5\text{ bytes}$$
- **Step 3: Calculate total Inverted Page Table size:**
  $$\text{Total Table Size} = 2^{16}\text{ entries} \times 5\text{ bytes/entry} = 65,536 \times 5 = 327,680\text{ bytes}$$
  $$\text{Table Size in KB} = \frac{327,680}{1024} = \frac{2^{16} \times 5}{2^{10}} = 2^6 \times 5 = 64 \times 5 = 320\text{ KB}$$
- *(Note: If stored without byte padding, $\frac{65536 \times 33}{8 \times 1024} = 264\text{ KB}$. With standard whole-byte allocation, it is 320 KB).*
- The answer is 320.

## Q8
type: MCQ
marks: 2
subject: dbms
topic: relational-algebra-calculus
answer: A

Consider two relations $R(A, B)$ and $S(B, C)$ populated with the following instances:

**Relation $R$:**
| $A$ | $B$ |
| :---: | :---: |
| $a_1$ | 1 |
| $a_1$ | 2 |
| $a_2$ | 2 |
| $a_2$ | 3 |
| $a_3$ | 4 |

**Relation $S$:**
| $B$ | $C$ |
| :---: | :---: |
| 2 | $c_1$ |
| 3 | $c_2$ |

Consider the following two database queries:

- **Query $Q_1$ (Relational Algebra):**
  $$Q_1 = \Pi_A (R) - \Pi_A (R \bowtie S)$$

- **Query $Q_2$ (Tuple Relational Calculus):**
  $$Q_2 = \{ t \mid \exists r \in R \; (t[A] = r[A] \land \forall s \in S \; (r[B] \ne s[B])) \}$$

Which of the following statements is **CORRECT** regarding the outputs produced by $Q_1$ and $Q_2$?

(A) $Q_1$ produces $\{a_3\}$, whereas $Q_2$ produces $\{a_1, a_3\}$.
(B) Both $Q_1$ and $Q_2$ are equivalent and both produce $\{a_3\}$.
(C) Both $Q_1$ and $Q_2$ are equivalent and both produce $\{a_1, a_3\}$.
(D) $Q_1$ produces $\{a_1, a_3\}$, whereas $Q_2$ produces $\{a_3\}$.

### Solution
- **Evaluate Query $Q_1$:**
  - $\Pi_A(R) = \{a_1, a_2, a_3\}$.
  - The natural join $R \bowtie S$ matches tuples on attribute $B$:
    - $B = 2$: Matches $(a_1, 2)$ from $R$ with $(2, c_1)$ from $S$.
    - $B = 2$: Matches $(a_2, 2)$ from $R$ with $(2, c_1)$ from $S$.
    - $B = 3$: Matches $(a_2, 3)$ from $R$ with $(3, c_2)$ from $S$.
  - Projecting on $A$:
    $$\Pi_A(R \bowtie S) = \{a_1, a_2\}$$
  - Taking the set difference:
    $$Q_1 = \{a_1, a_2, a_3\} - \{a_1, a_2\} = \{a_3\}$$
- **Evaluate Query $Q_2$:**
  - The condition in $Q_2$ states: An $A$-value is selected if there exists **at least one** tuple $r \in R$ with that $A$-value such that $r[B]$ does not match any $B$-value in $S$.
  - Test each candidate $A$-value:
    1. **For $A = a_1$:**
       - Tuples in $R$ with $A = a_1$ are $(a_1, 1)$ and $(a_1, 2)$.
       - Take tuple $r = (a_1, 1)$: Here $r[B] = 1$.
       - The set of $B$-values in $S$ is $\{2, 3\}$.
       - Does $1 \ne 2$ and $1 \ne 3$? **Yes!**
       - Since there exists a tuple $(a_1, 1) \in R$ whose $B$-value is not in $S$, the condition $\forall s \in S (r[B] \ne s[B])$ evaluates to TRUE.
       - Hence, **$a_1$ IS included in $Q_2$**.
    2. **For $A = a_2$:**
       - Tuples in $R$ with $A = a_2$ are $(a_2, 2)$ and $(a_2, 3)$.
       - For $(a_2, 2)$, $B = 2 \in S$ (violates condition).
       - For $(a_2, 3)$, $B = 3 \in S$ (violates condition).
       - Neither tuple satisfies the condition. Hence, $a_2$ is NOT included in $Q_2$.
    3. **For $A = a_3$:**
       - Tuple in $R$ is $(a_3, 4)$. Here $B = 4 \notin S$.
       - Hence, **$a_3$ IS included in $Q_2$**.
  - Therefore:
    $$Q_2 = \{a_1, a_3\}$$
- **Comparison:**
  - $Q_1$ produces $\{a_3\}$, whereas $Q_2$ produces $\{a_1, a_3\}$.
  - *(GATE Note: $Q_1$ requires that NO tuple of $A$ has a match in $S$. $Q_2$ only requires that AT LEAST ONE tuple of $A$ has no match in $S$. This classic quantifier scoping distinction is tested frequently in GATE CSE).*
- Option (A) is correct.

## Q9
type: NAT
marks: 2
subject: toc
topic: context-free-grammars-pda
answer: 31

Consider a context-free grammar $G$ with start symbol $S$ where every production rule is of one of the following two forms:
- $A \to BCD$ (where $A, B, C, D$ are non-terminal symbols)
- $A \to a$ (where $A$ is a non-terminal symbol and $a$ is a terminal symbol)

Suppose a non-empty string $w$ of length $|w| = 21$ is derived from the start symbol $S$ using grammar $G$.

What is the total number of derivation steps (production rule applications) used in the derivation of $w$?

### Solution
- **Analyze the effect of each production type on sentential forms:**
  1. **Rule $A \to BCD$:**
     - Replaces $1$ non-terminal with $3$ non-terminals.
     - Net increase in the number of non-terminals $= 3 - 1 = +2$.
  2. **Rule $A \to a$:**
     - Replaces $1$ non-terminal with $1$ terminal symbol.
     - Net change in the number of non-terminals $= -1$.
     - Net increase in the number of terminal symbols $= +1$.
- **Set up the derivation count:**
  - Let $k$ be the number of applications of production rules of the form $A \to BCD$.
  - Let $m$ be the number of applications of production rules of the form $A \to a$.
  - The derivation begins with the start symbol $S$ (which is $1$ non-terminal).
  - After applying $k$ rules of the form $A \to BCD$, the number of non-terminals in the sentential form is:
    $$\text{Number of non-terminals} = 1 + 2k$$
  - To produce a purely terminal string $w$, every non-terminal in the sentential form must eventually be replaced by a terminal symbol using a rule of the form $A \to a$.
  - Since each $A \to a$ rule produces exactly one terminal symbol and consumes one non-terminal, to produce a terminal string of length $|w| = 21$:
    $$m = 21$$
    $$\text{Number of non-terminals consumed} = 1 + 2k = 21$$
- **Solve for $k$:**
  $$1 + 2k = 21 \implies 2k = 20 \implies k = 10$$
- **Calculate total derivation steps:**
  $$\text{Total derivation steps} = k + m = 10 + 21 = 31$$
- The answer is 31.

## Q10
type: NAT
marks: 2
subject: os
topic: virtual-memory
answer: 7

Consider a demand-paged computer system with $3$ physical page frames allocated to a process. Initially, all $3$ page frames are empty.

The process references pages in the following sequence:

$$1, \; 3, \; 0, \; 3, \; 5, \; 6, \; 3, \; 1, \; 6, \; 1, \; 2, \; 0, \; 6, \; 3$$

Assume the system uses the **Optimal Page Replacement** algorithm (which replaces the page that will not be used for the longest period of time in the future).

What is the total number of page faults that occur during the execution of this reference string?

### Solution
- Let us trace the execution step-by-step with 3 frames under the Optimal Page Replacement policy:

| Step | Page Ref | Frame Content | Outcome | Page Replaced & Reason |
| :---: | :---: | :---: | :---: | :--- |
| 1 | **1** | $[1, -, -]$ | **Fault (1)** | Empty frame allocated |
| 2 | **3** | $[1, 3, -]$ | **Fault (2)** | Empty frame allocated |
| 3 | **0** | $[1, 3, 0]$ | **Fault (3)** | Empty frame allocated |
| 4 | **3** | $[1, 3, 0]$ | **Hit** | Page 3 already in frame |
| 5 | **5** | $[1, 3, 5]$ | **Fault (4)** | Future uses: 3 at step 7, 1 at step 8, 0 at step 12. Page 0 is used farthest in the future; **replace 0 with 5**. |
| 6 | **6** | $[1, 3, 6]$ | **Fault (5)** | Future uses: 3 at step 7, 1 at step 8, 5 is never referenced again. **Replace 5 with 6**. |
| 7 | **3** | $[1, 3, 6]$ | **Hit** | Page 3 already in frame |
| 8 | **1** | $[1, 3, 6]$ | **Hit** | Page 1 already in frame |
| 9 | **6** | $[1, 3, 6]$ | **Hit** | Page 6 already in frame |
| 10 | **1** | $[1, 3, 6]$ | **Hit** | Page 1 already in frame |
| 11 | **2** | $[2, 3, 6]$ | **Fault (6)** | Future uses: 6 at step 13, 3 at step 14, 1 is never referenced again. **Replace 1 with 2**. |
| 12 | **0** | $[0, 3, 6]$ | **Fault (7)** | Future uses: 6 at step 13, 3 at step 14, 2 is never referenced again. **Replace 2 with 0**. |
| 13 | **6** | $[0, 3, 6]$ | **Hit** | Page 6 already in frame |
| 14 | **3** | $[0, 3, 6]$ | **Hit** | Page 3 already in frame |

- **Summary:**
  - Total page references = 14
  - Page hits = 7 (at steps 4, 7, 8, 9, 10, 13, 14)
  - Page faults = 7 (at steps 1, 2, 3, 5, 6, 11, 12)
- Therefore, the total number of page faults is 7.

## Q11
type: NAT
marks: 2
subject: dbms
topic: file-organization-indexing
answer: 7

Consider an unspanned ordered data file containing $N = 30,000$ records stored on a disk with block size $B = 1024\text{ bytes}$:
- Each data record is $100\text{ bytes}$ in size.
- A **primary index** (sparse index) is constructed on the primary key field of the file.
- The search key size is $9\text{ bytes}$.
- Each block pointer in the index file occupies $7\text{ bytes}$.
- No records or index entries span across block boundaries.

What is the total number of block accesses required in the worst case to search for a record using **binary search** on the primary index file?

### Solution
- **Step 1: Compute the number of data blocks ($b$):**
  - Data record size $R = 100\text{ bytes}$.
  - Disk block size $B = 1024\text{ bytes}$.
  - Data blocking factor ($Bfr$):
    $$Bfr = \left\lfloor \frac{B}{R} \right\rfloor = \left\lfloor \frac{1024}{100} \right\rfloor = 10\text{ records per block}$$
  - Number of data blocks ($b$):
    $$b = \left\lceil \frac{N}{Bfr} \right\rceil = \left\lceil \frac{30,000}{10} \right\rceil = 3,000\text{ blocks}$$
- **Step 2: Compute the number of index blocks ($b_i$):**
  - A primary index is a **sparse index** that contains **one entry for each block of the data file** (referencing the anchor record of that block).
  - Therefore, the number of index entries ($r_i$) is:
    $$r_i = b = 3,000\text{ entries}$$
  - Size of each index entry $= \text{Key size} + \text{Block pointer size} = 9\text{ bytes} + 7\text{ bytes} = 16\text{ bytes}$.
  - Index blocking factor ($Bfr_i$):
    $$Bfr_i = \left\lfloor \frac{B}{16} \right\rfloor = \left\lfloor \frac{1024}{16} \right\rfloor = 64\text{ entries per block}$$
  - Number of blocks required for the primary index file ($b_i$):
    $$b_i = \left\lceil \frac{r_i}{Bfr_i} \right\rceil = \left\lceil \frac{3,000}{64} \right\rceil = \lceil 46.875 \rceil = 47\text{ blocks}$$
- **Step 3: Calculate worst-case block accesses using binary search:**
  - Binary search over $b_i = 47$ index blocks takes:
    $$\text{Index accesses} = \lceil \log_2(b_i) \rceil = \lceil \log_2(47) \rceil = 6\text{ block accesses} \quad (\text{since } 2^5 = 32 < 47 \le 64 = 2^6)$$
  - Once the appropriate index entry is found, $1$ additional block access is required to retrieve the actual data block from the disk.
  - Total block accesses:
    $$\text{Total accesses} = 6 + 1 = 7\text{ block accesses}$$
- The answer is 7.

## Q12
type: MSQ
marks: 2
subject: toc
topic: context-free-languages
answer: B, C, D

Which of the following languages is/are **Context-Free**?

(A) $L_1 = \{ a^n b^m a^n b^m \mid n \ge 1, \; m \ge 1 \}$
(B) $L_2 = \{ a^n b^m a^m b^n \mid n \ge 1, \; m \ge 1 \}$
(C) $L_3 = \{ a^n b^n c^m d^m \mid n \ge 1, \; m \ge 1 \}$
(D) $L_4 = \{ a^i b^j c^k \mid i, j, k \ge 1 \text{ and } (i \ne j \text{ or } j \ne k) \}$

### Solution
- **(A) $L_1 = \{ a^n b^m a^n b^m \mid n \ge 1, m \ge 1 \}$ is NOT a CFL:**
  - The first block of $a$'s must be matched with the second block of $a$'s, while simultaneously the first block of $b$'s must be matched with the second block of $b$'s.
  - This requires maintaining two independent FIFO queues or two stacks (cross-serial dependencies). A single LIFO stack cannot verify both equalities.
  - Formally, by the Pumping Lemma for Context-Free Languages, $L_1$ is not context-free (it is a Context-Sensitive Language).
- **(B) $L_2 = \{ a^n b^m a^m b^n \mid n \ge 1, m \ge 1 \}$ is a CFL (and DCFL):**
  - This language has nested (LIFO) dependencies:
    - Push $n$ $a$'s onto the stack.
    - Push $m$ $b$'s onto the stack.
    - Read $a^m$ and pop $b$'s off the stack. If counts match, the stack now exposes the $a^n$ symbols.
    - Read $b^n$ and pop $a$'s off the stack.
  - The stack empties precisely when the string finishes. A Deterministic PDA (DPDA) can easily accept $L_2$. Hence, $L_2$ is a CFL. (B is correct).
- **(C) $L_3 = \{ a^n b^n c^m d^m \mid n \ge 1, m \ge 1 \}$ is a CFL (and DCFL):**
  - $L_3$ is the concatenation of two independent CFLs:
    $$L_A = \{ a^n b^n \mid n \ge 1 \} \quad \text{and} \quad L_B = \{ c^m d^m \mid m \ge 1 \}$$
  - A PDA can push $a$'s and pop with $b$'s until the stack is empty, and then push $c$'s and pop with $d$'s until the stack is empty.
  - Since CFLs are closed under concatenation (and $L_A, L_B$ are deterministic with disjoint alphabets), $L_3$ is a CFL. (C is correct).
- **(D) $L_4 = \{ a^i b^j c^k \mid i, j, k \ge 1 \text{ and } (i \ne j \text{ or } j \ne k) \}$ is a CFL:**
  - Express $L_4$ as the union of two languages:
    $$L_4 = L_{ij} \cup L_{jk}$$
    where $L_{ij} = \{ a^i b^j c^k \mid i \ne j, \; k \ge 1 \}$ and $L_{jk} = \{ a^i b^j c^k \mid j \ne k, \; i \ge 1 \}$.
  - $L_{ij}$ is a CFL because a PDA can check whether $i > j$ or $i < j$ using its stack while ignoring $c^k$.
  - Similarly, $L_{jk}$ is a CFL because a PDA can ignore $a^i$ and check whether $j \ne k$.
  - Since Context-Free Languages are **closed under union**, $L_4 = L_{ij} \cup L_{jk}$ is a Context-Free Language. (D is correct).
- Therefore, the correct options are (B), (C), and (D).

## Q13
type: NAT
marks: 2
subject: os
topic: file-systems-io
answer: 6

Consider a UNIX-style file system where each file inode has:
- 12 direct disk block pointers
- 1 single indirect disk block pointer
- 1 double indirect disk block pointer
- 1 triple indirect disk block pointer

The disk block size is $4\text{ KB}$ ($4096\text{ bytes}$), and each disk block address pointer requires $4\text{ bytes}$.

A process has already opened a large file whose inode is currently in main memory. No data blocks or index blocks of the file are initially in memory. The process issues a read system call to read a contiguous chunk of $10\text{ KB}$ ($10,240\text{ bytes}$) starting from byte offset $4,240,000$.

What is the total number of disk block accesses (including all index blocks and data blocks) required to service this read operation?

### Solution
- **Step 1: Compute pointer capacity per index block:**
  $$\text{Pointers per index block} = \frac{\text{Block Size}}{\text{Pointer Size}} = \frac{4096\text{ bytes}}{4\text{ bytes}} = 1024\text{ pointers}$$
- **Step 2: Determine byte address ranges for the inode structures:**
  1. **Direct pointers (12 blocks):**
     - Capacity $= 12 \times 4096\text{ bytes} = 49,152\text{ bytes}$.
     - Byte range: $[0, 49152)$.
  2. **Single indirect pointer (1 index block pointing to 1024 data blocks):**
     - Capacity $= 1024 \times 4096\text{ bytes} = 4,194,304\text{ bytes}$.
     - Byte range: $[49152, 49152 + 4194304) = [49152, 4243456)$.
  3. **Double indirect pointer:**
     - Byte range starts at offset $4,243,456$.
     - 1 first-level index block points to 1024 second-level index blocks, each pointing to 1024 data blocks.
- **Step 3: Analyze the requested read operation:**
  - Starting offset $= 4,240,000$.
  - Number of bytes to read $= 10,240\text{ bytes}$.
  - Ending byte offset $= 4,240,000 + 10,240 - 1 = 4,250,239$.
  - Notice that the boundary between single indirect and double indirect is byte $4,243,456$:
    $$4,240,000 < 4,243,456 \le 4,250,239$$
  - Thus, the requested data spans across **both the single indirect and the double indirect regions**!
- **Step 4: Count disk accesses for the single indirect region:**
  - Byte range in single indirect: $[4,240,000, 4,243,456)$.
  - Offset within single indirect $= 4,240,000 - 49,152 = 4,190,848$.
  - Block index $= \lfloor 4,190,848 / 4096 \rfloor = 1023$ (the 1024th and final data block of single indirect).
  - To read this data block requires:
    1. $1$ disk access to read the single indirect index block.
    2. $1$ disk access to read data block 1023.
  - Subtotal for single indirect $= 1 + 1 = 2\text{ disk accesses}$.
- **Step 5: Count disk accesses for the double indirect region:**
  - Byte range in double indirect: $[4,243,456, 4,250,239]$.
  - Offset within double indirect $= 4,250,239 - 4,243,456 = 6,783\text{ bytes}$.
  - Since each data block holds $4096\text{ bytes}$:
    - First data block (block index 0): covers bytes $[0, 4096)$ of double indirect.
    - Second data block (block index 1): covers bytes $[4096, 8192)$ of double indirect.
  - Because $6,783 < 8192$, exactly $2$ data blocks of double indirect are accessed (data block 0 and data block 1).
  - Both data blocks 0 and 1 are referenced from the **very first second-level index block** (which holds pointers for blocks 0 to 1023).
  - To read these data blocks requires:
    1. $1$ disk access to read the first-level double indirect index block.
    2. $1$ disk access to read the first second-level double indirect index block.
    3. $2$ disk accesses to read the two data blocks (data block 0 and data block 1).
  - Subtotal for double indirect $= 1 + 1 + 2 = 4\text{ disk accesses}$.
- **Step 6: Total disk block accesses:**
  $$\text{Total accesses} = 2\text{ (single indirect)} + 4\text{ (double indirect)} = 6\text{ disk accesses}$$
- The answer is 6.

## Q14
type: MCQ
marks: 2
subject: dbms
topic: sql
answer: A

Consider a relational table `Sales(rep_id, region, amount)` containing the following 6 tuples:

| `rep_id` | `region` | `amount` |
| :---: | :---: | :---: |
| 101 | `'North'` | 500 |
| 102 | `'North'` | 700 |
| 103 | `'North'` | 700 |
| 104 | `'North'` | 900 |
| 105 | `'South'` | 400 |
| 106 | `'South'` | 600 |

Consider the following SQL query:

```sql
SELECT S1.rep_id
FROM Sales S1
WHERE (
    SELECT COUNT(DISTINCT S2.amount)
    FROM Sales S2
    WHERE S2.region = S1.region
      AND S2.amount > S1.amount
) = 1;
```

What is the output produced by executing this SQL query?

(A) Exactly 3 rows with `rep_id` values: 102, 103, and 105
(B) Exactly 2 rows with `rep_id` values: 102 and 105
(C) Exactly 2 rows with `rep_id` values: 104 and 106
(D) Exactly 1 row with `rep_id` value: 104

### Solution
- **Understand the semantics of the query:**
  - For each candidate row `S1` in `Sales`, the correlated subquery counts the number of distinct `amount` values in `Sales S2` that have the same `region` and have `amount` strictly greater than `S1.amount`.
  - The condition `= 1` means: there is **exactly one distinct amount** in that region strictly higher than `S1.amount`.
  - In other words, the query selects all sales reps who achieved the **second highest distinct amount** in their respective regions!
- **Evaluate candidate rows in region `'North'`:**
  - Distinct amounts in `'North'` are $\{500, 700, 900\}$.
  - **Row `104` (`amount = 900`):**
    - Amounts in North $> 900$: none.
    - `COUNT(DISTINCT S2.amount) = 0`. Since $0 \ne 1$, `104` is NOT selected.
  - **Row `102` (`amount = 700`):**
    - Amounts in North $> 700$: $\{900\}$.
    - `COUNT(DISTINCT S2.amount) = 1`. Since $1 = 1$, **`102` IS selected**.
  - **Row `103` (`amount = 700`):**
    - Amounts in North $> 700$: $\{900\}$.
    - `COUNT(DISTINCT S2.amount) = 1`. Since $1 = 1$, **`103` IS selected**.
  - **Row `101` (`amount = 500`):**
    - Amounts in North $> 500$: $\{700, 900\}$.
    - `COUNT(DISTINCT S2.amount) = 2$. Since $2 \ne 1$, `101` is NOT selected.
- **Evaluate candidate rows in region `'South'`:**
  - Distinct amounts in `'South'` are $\{400, 600\}$.
  - **Row `106` (`amount = 600`):**
    - Amounts in South $> 600$: none.
    - `COUNT(DISTINCT S2.amount) = 0$. Since $0 \ne 1$, `106` is NOT selected.
  - **Row `105` (`amount = 400`):**
    - Amounts in South $> 400$: $\{600\}$.
    - `COUNT(DISTINCT S2.amount) = 1$. Since $1 = 1$, **`105` IS selected**.
- **Combine selected rows:**
  - Rows satisfying the WHERE clause: `102`, `103`, and `105`.
  - Total rows returned: exactly 3 rows.
- *(GATE Distractor Note: Notice that both 102 and 103 are returned because SQL evaluates each candidate row of the outer query independently. Many students incorrectly select (B) assuming duplicate values are collapsed by the outer query).*
- Option (A) is correct.

## Q15
type: MSQ
marks: 2
subject: toc
topic: regular-languages
answer: A, B, C

Let $L$ be an arbitrary **Regular Language** over an alphabet $\Sigma$, and let $A$ be an arbitrary language over $\Sigma$ (where $A$ may be non-context-free, undecidable, or non-recursively enumerable).

Which of the following languages is/are **guaranteed to be REGULAR**?

(A) $\text{Pref}(L) = \{ u \in \Sigma^* \mid \exists v \in \Sigma^* \text{ such that } uv \in L \}$
(B) $L / A = \{ u \in \Sigma^* \mid \exists v \in A \text{ such that } uv \in L \}$
(C) $\text{Half}(L) = \{ u \in \Sigma^* \mid \exists v \in \Sigma^* \text{ such that } |u| = |v| \text{ and } uv \in L \}$
(D) $A \cap L$

### Solution
- **(A) $\text{Pref}(L)$ is guaranteed to be REGULAR:**
  - Let $M = (Q, \Sigma, \delta, q_0, F)$ be a DFA accepting $L$.
  - A string $u$ is a prefix of some string in $L$ if and only if processing $u$ from the start state $q_0$ leads to a state $q = \delta^*(q_0, u)$ from which at least one final state in $F$ is reachable.
  - We can construct a new DFA $M' = (Q, \Sigma, \delta, q_0, F')$ where:
    $$F' = \{ q \in Q \mid \exists w \in \Sigma^* \text{ such that } \delta^*(q, w) \in F \}$$
  - $M'$ has the exact same finite states and transition function as $M$. Since $M'$ accepts $\text{Pref}(L)$, $\text{Pref}(L)$ is **Regular**. (A is correct).
- **(B) $L / A$ (Right Quotient with arbitrary language $A$) is guaranteed to be REGULAR:**
  - This is a fundamental theorem of automata theory: The quotient of a regular language with ANY arbitrary language (even non-RE) is regular.
  - Let $M = (Q, \Sigma, \delta, q_0, F)$ be a DFA accepting $L$.
  - Define a new set of accepting states $F_{L/A} \subseteq Q$ as:
    $$F_{L/A} = \{ q \in Q \mid \exists v \in A \text{ such that } \delta^*(q, v) \in F \}$$
  - The automaton $M_{L/A} = (Q, \Sigma, \delta, q_0, F_{L/A})$ has the identical state set $Q$ and transitions $\delta$ as $M$.
  - String $u$ is accepted by $M_{L/A}$ if and only if $\delta^*(q_0, u) \in F_{L/A}$, which means there exists some $v \in A$ such that $\delta^*(q_0, uv) \in F$ (i.e. $uv \in L$).
  - Because $M_{L/A}$ is a valid DFA with a finite number of states, $L / A$ is **Regular**. (B is correct).
- **(C) $\text{Half}(L)$ is guaranteed to be REGULAR:**
  - Let $M = (Q, \Sigma, \delta, q_0, F)$ be a DFA accepting $L$ with $k = |Q|$ states.
  - We can construct an NFA $N$ that runs two simulations simultaneously:
    - Non-deterministically guess the intermediate state $q_m \in Q$ that the DFA $M$ will be in after reading the first half $u$.
    - While reading symbol $a$ of $u$, advance the first simulation forward from $q_0$: $q_1 = \delta(q_0, a)$.
    - Simultaneously, non-deterministically trace the second half $v$ backwards from some final state in $F$ by guessing all transitions that lead into $q_m$ in $|u|$ steps.
  - The states of this NFA are triples in $Q \times 2^Q \times Q$, which is finite.
  - Therefore, $\text{Half}(L)$ is accepted by a finite automaton and is strictly **Regular**. (C is correct).
- **(D) $A \cap L$ is NOT guaranteed to be REGULAR:**
  - Counterexample: Let $\Sigma = \{a, b\}$.
  - Choose $L = \Sigma^* = (a + b)^*$, which is a regular language.
  - Choose $A = \{ a^n b^n \mid n \ge 0 \}$, which is a non-regular context-free language.
  - Then $A \cap L = A \cap \Sigma^* = A = \{ a^n b^n \mid n \ge 0 \}$, which is NOT regular.
  - Therefore, $A \cap L$ is not guaranteed to be regular. (D is incorrect).
- Hence, statements (A), (B), and (C) are guaranteed to be regular.
