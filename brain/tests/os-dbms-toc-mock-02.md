---
title: OS + DBMS + TOC · Mock 02
duration: 45
created: 2026-10-17
description: GATE-level sectional mock covering Operating Systems, Databases, and Theory of Computation.
---

## Q1
type: MCQ
marks: 1
subject: os
topic: processes-threads
answer: A

Consider the following C program executing on a UNIX-like operating system:

```c
#include <stdio.h>
#include <unistd.h>

int main() {
    pid_t p1, p2;
    p1 = fork();
    if (p1 == 0) {
        fork();
        printf("A\n");
    } else {
        p2 = fork();
        if (p2 == 0) {
            fork();
            printf("B\n");
        }
    }
    return 0;
}
```

Assuming that all `fork()` system calls execute successfully, what is the total number of processes created (including the initial parent process), and how many times are `"A"` and `"B"` printed in total?

(A) 5 processes; "A" is printed 2 times, "B" is printed 2 times
(B) 6 processes; "A" is printed 3 times, "B" is printed 2 times
(C) 5 processes; "A" is printed 3 times, "B" is printed 1 time
(D) 4 processes; "A" is printed 2 times, "B" is printed 2 times

### Solution
Let us trace the process tree starting with the initial process $P_0$:

1. **First `fork()`:**
   - $P_0$ executes `p1 = fork()`.
   - A new child process $C_1$ is created.
   - For $C_1$, `p1 == 0`.
   - For $P_0$, `p1 > 0` (the PID of $C_1$).

2. **Branch 1: Inside child $C_1$ (`p1 == 0`):**
   - $C_1$ enters the `if (p1 == 0)` block.
   - $C_1$ executes `fork()`, creating a child process $C_{11}$.
   - Both $C_1$ and $C_{11}$ proceed to execute `printf("A\n")`.
   - Neither executes the `else` block.
   - Therefore, `"A"` is printed exactly **2 times**.

3. **Branch 2: Inside parent $P_0$ (`p1 != 0`):**
   - $P_0$ enters the `else` block.
   - $P_0$ executes `p2 = fork()`, creating a child process $C_2$.
   - For $P_0$, `p2 > 0` (the PID of $C_2$). $P_0$ does not enter `if (p2 == 0)` and exits.
   - For child $C_2$, `p2 == 0`. $C_2$ enters the `if (p2 == 0)` block.
   - $C_2$ executes `fork()`, creating a child process $C_{21}$.
   - Both $C_2$ and $C_{21}$ proceed to execute `printf("B\n")`.
   - Therefore, `"B"` is printed exactly **2 times**.

4. **Total Processes:**
   - The processes are:
     1. $P_0$ (initial parent)
     2. $C_1$ (created by $P_0$)
     3. $C_{11}$ (created by $C_1$)
     4. $C_2$ (created by $P_0$)
     5. $C_{21}$ (created by $C_2$)
   - Total number of processes in the system $= 5$.

Hence, (A) is the correct option.

## Q2
type: NAT
marks: 1
subject: os
topic: cpu-scheduling
answer: 15

Consider three processes $P_1, P_2$, and $P_3$ that arrive at time $t = 0\text{ ms}$ with CPU burst times of $6\text{ ms}$, $4\text{ ms}$, and $8\text{ ms}$, respectively. The processes are scheduled using the Round Robin (RR) scheduling algorithm with a time quantum of $q = 3\text{ ms}$.

The ready queue is initially ordered as $P_1, P_2, P_3$. When a process is preempted by the timer, it is placed at the tail of the ready queue. Each context switch incurs an overhead of $1\text{ ms}$. No context switch overhead is incurred at time $t = 0\text{ ms}$ before the first process begins execution.

The turnaround time of process $P_1$ is ______ ms.

### Solution
Let us trace the Round Robin execution on a Gantt chart:

- **Initial state ($t = 0\text{ ms}$):**
  - Ready queue: $[P_1(6), P_2(4), P_3(8)]$.
  - Context switch overhead at $t = 0$ is $0\text{ ms}$.

- **$t = 0$ to $3\text{ ms}$:**
  - $P_1$ executes for 1 quantum ($3\text{ ms}$).
  - Remaining burst of $P_1 = 6 - 3 = 3\text{ ms}$.
  - Context switch: $t = 3$ to $4\text{ ms}$ ($1\text{ ms}$).
  - Ready queue becomes: $[P_2(4), P_3(8), P_1(3)]$.

- **$t = 4$ to $7\text{ ms}$:**
  - $P_2$ executes for 1 quantum ($3\text{ ms}$).
  - Remaining burst of $P_2 = 4 - 3 = 1\text{ ms}$.
  - Context switch: $t = 7$ to $8\text{ ms}$ ($1\text{ ms}$).
  - Ready queue becomes: $[P_3(8), P_1(3), P_2(1)]$.

- **$t = 8$ to $11\text{ ms}$:**
  - $P_3$ executes for 1 quantum ($3\text{ ms}$).
  - Remaining burst of $P_3 = 8 - 3 = 5\text{ ms}$.
  - Context switch: $t = 11$ to $12\text{ ms}$ ($1\text{ ms}$).
  - Ready queue becomes: $[P_1(3), P_2(1), P_3(5)]$.

- **$t = 12$ to $15\text{ ms}$:**
  - $P_1$ executes for its remaining burst of $3\text{ ms}$.
  - Remaining burst of $P_1 = 3 - 3 = 0\text{ ms}$.
  - $P_1$ finishes execution at time $t = 15\text{ ms}$.

**Turnaround Time ($\text{TAT}$):**
$$\text{TAT}(P_1) = \text{Completion Time} - \text{Arrival Time} = 15 - 0 = 15\text{ ms}$$

Hence, the answer is 15.

## Q3
type: MCQ
marks: 2
subject: os
topic: concurrency-synchronization
answer: B

Consider the following proposed software solution to the critical section problem for two concurrent processes $P_0$ and $P_1$. The shared variables are:

```c
boolean flag[2] = {false, false};
int turn = 0;
```

The code executed by process $P_i$ ($i \in \{0, 1\}$, with $j = 1 - i$) is:

```c
while (true) {
    flag[i] = true;
    while (turn != i) {
        while (flag[j]) {
            // busy wait
        }
        turn = i;
    }
    
    /* Critical Section */
    
    flag[i] = false;
    
    /* Remainder Section */
}
```

Which of the following statements is TRUE regarding this algorithm?

(A) It satisfies Mutual Exclusion, but violates Progress.
(B) It satisfies Progress, but violates Mutual Exclusion.
(C) It satisfies both Mutual Exclusion and Progress.
(D) It violates both Mutual Exclusion and Progress.

### Solution
Let us test the fundamental requirements: Mutual Exclusion and Progress.

1. **Test for Mutual Exclusion:**
   Mutual Exclusion requires that at most one process can execute in its critical section at any given time.
   Consider the following execution interleaving:
   - Initial state: `flag[0] = false`, `flag[1] = false`, `turn = 0`.
   - Step 1: $P_1$ wants to enter its critical section. It sets `flag[1] = true`.
   - Step 2: $P_1$ evaluates the outer loop condition: `turn != 1` ($0 \ne 1$), which is `true`.
   - Step 3: $P_1$ enters the outer loop and checks the inner loop: `while (flag[0])`. Since `flag[0] == false`, $P_1$ does not busy wait and exits the inner loop.
   - Step 4: Before $P_1$ can execute `turn = 1`, a context switch occurs, and CPU is allocated to $P_0$.
   - Step 5: $P_0$ sets `flag[0] = true`.
   - Step 6: $P_0$ evaluates `while (turn != 0)`. Since `turn == 0`, $0 \ne 0$ is `false`.
   - Step 7: $P_0$ bypasses the loop and **enters the Critical Section**.
   - Step 8: Context switch back to $P_1$.
   - Step 9: $P_1$ resumes from where it was preempted and executes `turn = 1`.
   - Step 10: $P_1$ reaches the end of the outer while loop and re-evaluates `while (turn != 1)`. Since `turn == 1`, $1 \ne 1$ is `false`.
   - Step 11: $P_1$ exits the loop and **enters the Critical Section**.

   Both $P_0$ and $P_1$ are now simultaneously inside their Critical Sections!
   Therefore, **Mutual Exclusion is VIOLATED**.

2. **Test for Progress:**
   Progress requires that if no process is in its critical section and some processes wish to enter, only those processes not in their remainder section can participate in deciding who enters next, and this selection cannot be postponed indefinitely (no deadlock).
   - If only one process wants to enter (say $P_1$ while $P_0$ is in its remainder section with `flag[0] = false`):
     - $P_1$ sets `flag[1] = true`.
     - If `turn == 1`, it enters directly.
     - If `turn == 0`, $P_1$ sees `flag[0] == false`, sets `turn = 1`, and enters. It is never blocked by $P_0$.
   - If both processes want to enter at the same time:
     - If `turn == 0`, $P_0$ directly enters without waiting.
     - If `turn == 1`, $P_1$ directly enters without waiting.
     - Deadlock cannot occur because neither process waits indefinitely if the other does not enter.
   Therefore, **Progress is satisfied**.

Hence, the algorithm satisfies Progress, but violates Mutual Exclusion (Option B).

## Q4
type: NAT
marks: 2
subject: os
topic: virtual-memory
answer: 80

Consider a virtual memory system implementing a two-level hierarchical page table and a Translation Lookaside Buffer (TLB). The system has the following timing parameters:
- TLB lookup time $= 20\text{ ns}$
- Main memory access time $= 100\text{ ns}$

The TLB is accessed first for every virtual address translation:
- On a TLB hit, the physical frame number is obtained directly from the TLB, and the operand in main memory is accessed.
- On a TLB miss, each of the two levels of the page table in main memory must be accessed sequentially to obtain the physical frame number, the TLB is updated, and then the target operand in main memory is accessed.

Assume that all pages are resident in main memory (the page fault rate is 0). If the Effective Memory Access Time (EMAT) must not exceed $160\text{ ns}$, the MINIMUM required TLB hit ratio (expressed as an integer percentage) is ______ %.

### Solution
Let $h$ denote the TLB hit ratio ($0 \le h \le 1$).

1. **Memory access time on a TLB hit ($T_{\text{hit}}$):**
   $$T_{\text{hit}} = \text{TLB lookup time} + \text{Memory access time} = 20\text{ ns} + 100\text{ ns} = 120\text{ ns}$$

2. **Memory access time on a TLB miss ($T_{\text{miss}}$):**
   On a TLB miss, the translation requires:
   - 1 TLB lookup ($20\text{ ns}$)
   - 1 memory access to the level-1 page table ($100\text{ ns}$)
   - 1 memory access to the level-2 page table ($100\text{ ns}$)
   - 1 memory access to the actual data word ($100\text{ ns}$)
   $$T_{\text{miss}} = 20 + 100 + 100 + 100 = 320\text{ ns}$$

3. **Effective Memory Access Time (EMAT):**
   $$\text{EMAT} = h \cdot T_{\text{hit}} + (1 - h) \cdot T_{\text{miss}}$$
   $$\text{EMAT} = 120h + 320(1 - h) = 320 - 200h$$

4. **Constraint:**
   $$\text{EMAT} \le 160\text{ ns}$$
   $$320 - 200h \le 160$$
   $$200h \ge 160$$
   $$h \ge \frac{160}{200} = 0.80$$

Expressed as a percentage:
$$h \ge 80\%$$

Hence, the minimum required TLB hit ratio is 80%.

## Q5
type: MSQ
marks: 2
subject: os
topic: file-systems-io
answer: A, B, C

Consider a UNIX-style file system where each inode contains:
- 12 direct block pointers
- 1 single indirect block pointer
- 1 double indirect block pointer
- 1 triple indirect block pointer

The file system parameters are:
- Disk block size $= 4\text{ KB} = 4096\text{ bytes}$
- Disk block address pointer size $= 4\text{ bytes}$ (32-bit addresses)

Assume that the inode of an open file is already loaded into main memory, but none of its index blocks or data blocks are cached in memory. Which of the following statements is/are TRUE?

(A) The maximum file size supported by this inode structure exceeds $4\text{ TB}$.
(B) To read a byte at byte offset $30\text{ KB}$ from the start of the file, exactly 1 disk block access is required.
(C) To read a byte at byte offset $20\text{ MB}$ from the start of the file, exactly 3 disk block accesses are required.
(D) The total number of data blocks that can be addressed by the single indirect pointer is 512.

### Solution
Let us analyze the capacities and access patterns:

1. **Pointers per disk block:**
   $$\text{Pointers per block} = \frac{\text{Block size}}{\text{Pointer size}} = \frac{4096\text{ bytes}}{4\text{ bytes}} = 1024 = 2^{10}\text{ pointers}$$

2. **Block capacities:**
   - **Direct pointers (12):** $12\text{ data blocks} = 12 \times 4\text{ KB} = 48\text{ KB}$.
   - **Single indirect pointer (1):** $1024\text{ data blocks} = 1024 \times 4\text{ KB} = 4\text{ MB}$.
   - **Double indirect pointer (1):** $1024 \times 1024 = 2^{20}\text{ data blocks} = 2^{20} \times 4\text{ KB} = 4\text{ GB}$.
   - **Triple indirect pointer (1):** $1024^3 = 2^{30}\text{ data blocks} = 2^{30} \times 4\text{ KB} = 4\text{ TB}$.

3. **Evaluating Statement (A):**
   $$\text{Maximum file size} = 48\text{ KB} + 4\text{ MB} + 4\text{ GB} + 4\text{ TB} > 4\text{ TB}$$
   Because $4\text{ TB} + 4\text{ GB} + 4\text{ MB} + 48\text{ KB} > 4\text{ TB}$, **(A) is TRUE**.

4. **Evaluating Statement (B):**
   - Byte offset $= 30\text{ KB} = 30 \times 1024 = 30720\text{ bytes}$.
   - Logical block index $= \lfloor 30\text{ KB} / 4\text{ KB} \rfloor = 7$.
   - Since $7 < 12$, block index 7 is addressed directly by one of the 12 direct pointers stored in the inode.
   - Because the inode is already in memory, the system directly fetches the data block from disk.
   - Disk accesses required $= 1$. Thus, **(B) is TRUE**.

5. **Evaluating Statement (C):**
   - Byte offset $= 20\text{ MB} = 20 \times 1024\text{ KB} = 20480\text{ KB}$.
   - Logical block index $= \lfloor 20480\text{ KB} / 4\text{ KB} \rfloor = 5120$.
   - Direct blocks cover blocks $0$ to $11$.
   - Single indirect covers blocks $12$ to $12 + 1024 - 1 = 1035$.
   - Double indirect covers blocks $1036$ to $1036 + 1024^2 - 1 = 1049611$.
   - Since $1036 \le 5120 \le 1049611$, the target block lies within the double indirect region.
   - To read this block (with inode in memory):
     1. Read the 1st-level index block from disk (1st access).
     2. Read the 2nd-level index block from disk (2nd access).
     3. Read the actual data block from disk (3rd access).
   - Total disk accesses $= 3$. Thus, **(C) is TRUE**.

6. **Evaluating Statement (D):**
   - The single indirect pointer references an index block containing $4096 / 4 = 1024$ pointers to data blocks, not 512.
   - Thus, **(D) is FALSE**.

Hence, statements A, B, and C are TRUE.

## Q6
type: MCQ
marks: 1
subject: dbms
topic: er-model
answer: C

Consider an Entity-Relationship (ER) diagram with three strong entity sets $E_1, E_2$, and $E_3$, each possessing a single-attribute primary key. The diagram specifies the following relationships:
- A binary many-to-one (M:1) relationship $R_{12}$ from $E_1$ to $E_2$, where $E_1$ has **total participation** in $R_{12}$, and $E_2$ has partial participation.
- A binary many-to-many (M:N) relationship $R_{23}$ between $E_2$ and $E_3$, where both $E_2$ and $E_3$ have partial participation.

Assuming no other relationships or attributes exist, what is the MINIMUM number of relational tables required to represent this ER diagram while preserving all primary key and foreign key constraints without redundancy?

(A) 2
(B) 3
(C) 4
(D) 5

### Solution
Let us determine the relational tables required for each component:

1. **Entity set $E_1$ and Relationship $R_{12}$:**
   - $R_{12}$ is a many-to-one relationship from $E_1$ to $E_2$.
   - Every entity in $E_1$ participates totally in $R_{12}$, meaning each tuple in $E_1$ is associated with exactly one entity in $E_2$.
   - Therefore, the relationship $R_{12}$ can be merged into the table for $E_1$ by including the primary key of $E_2$ as a foreign key attribute with a `NOT NULL` constraint.
   - Table schema: $T_1(\underline{pk_1}, \dots, pk_2)$.
   - This requires **1 table**.

2. **Entity set $E_2$:**
   - $E_2$ is a strong entity set with partial participation in $R_{12}$ and $R_{23}$.
   - Its attributes cannot be subsumed into $E_1$ or $E_3$ without duplicating data.
   - Table schema: $T_2(\underline{pk_2}, \dots)$.
   - This requires **1 table**.

3. **Entity set $E_3$:**
   - $E_3$ is an independent strong entity set.
   - Table schema: $T_3(\underline{pk_3}, \dots)$.
   - This requires **1 table**.

4. **Relationship $R_{23}$:**
   - $R_{23}$ is a many-to-many (M:N) relationship between $E_2$ and $E_3$.
   - An M:N relationship cannot be merged into either $E_2$ or $E_3$ because doing so would violate 1NF (multi-valued attribute) or introduce redundancy.
   - Thus, $R_{23}$ requires its own separate cross-reference table whose primary key is the composite key $(pk_2, pk_3)$.
   - Table schema: $T_4(\underline{pk_2, pk_3})$.
   - This requires **1 table**.

Total minimum number of tables $= 1 (E_1 \text{ merged with } R_{12}) + 1 (E_2) + 1 (E_3) + 1 (R_{23}) = 4$ tables.

Hence, (C) is the correct option.

## Q7
type: MCQ
marks: 1
subject: dbms
topic: functional-dependencies-normal-forms
answer: A

Consider a relation schema $R(A, B, C, D)$ with the following set of functional dependencies:

$$F = \{ A \to B, \quad B \to C, \quad A \to C, \quad AB \to D \}$$

Which of the following is a canonical cover (minimal cover) of $F$?

(A) $\{ A \to B, \quad B \to C, \quad A \to D \}$
(B) $\{ A \to B, \quad B \to C, \quad A \to C, \quad A \to D \}$
(C) $\{ A \to BD, \quad AB \to C \}$
(D) $\{ A \to C, \quad B \to C, \quad A \to D \}$

### Solution
A canonical cover $F_c$ must satisfy three conditions:
1. Every dependency in $F_c$ has a single attribute on its right-hand side (or combined by union rule).
2. No dependency in $F_c$ contains an extraneous attribute on its left-hand side.
3. No dependency in $F_c$ is redundant.

Let us find $F_c$ systematically:

- **Step 1: Check for extraneous attributes on the left-hand side:**
  - Look at $AB \to D$:
    - To check if $B$ is extraneous, compute the attribute closure of $A$ under $F$:
      $$(A)^+ = \{A\}$$
      Using $A \to B \implies \{A, B\}$
      Using $AB \to D \implies \{A, B, D\}$
      Using $B \to C \implies \{A, B, C, D\}$
    - Since $D \in (A)^+$, attribute $A$ alone functionally determines $D$ without needing $B$.
    - Thus, $B$ is an extraneous attribute in $AB \to D$.
    - Replace $AB \to D$ with $A \to D$.
  - The updated set is:
    $$F' = \{ A \to B, \quad B \to C, \quad A \to C, \quad A \to D \}$$

- **Step 2: Check for redundant dependencies:**
  - Test $A \to C$:
    - Remove $A \to C$ from $F'$ and compute the closure of $A$ under $F' \setminus \{A \to C\} = \{A \to B, B \to C, A \to D\}$:
      $$(A)^+ = \{A\}$$
      Using $A \to B \implies \{A, B\}$
      Using $B \to C \implies \{A, B, C\}$
      Using $A \to D \implies \{A, B, C, D\}$
    - Since $C \in (A)^+$, $A \to C$ is logically implied by $A \to B$ and $B \to C$ via transitivity.
    - Thus, $A \to C$ is redundant and must be eliminated.
  - The updated set is:
    $$F'' = \{ A \to B, \quad B \to C, \quad A \to D \}$$

- **Step 3: Verify remaining dependencies:**
  - Test $A \to B$: In $\{B \to C, A \to D\}$, $(A)^+ = \{A, D\}$, which does not contain $B$. Not redundant.
  - Test $B \to C$: In $\{A \to B, A \to D\}$, $(B)^+ = \{B\}$, which does not contain $C$. Not redundant.
  - Test $A \to D$: In $\{A \to B, B \to C\}$, $(A)^+ = \{A, B, C\}$, which does not contain $D$. Not redundant.

Therefore, the canonical cover is $\{ A \to B, \; B \to C, \; A \to D \}$.

Hence, (A) is the correct option.

## Q8
type: MCQ
marks: 2
subject: dbms
topic: transactions-concurrency-control
answer: B

Consider the following statements regarding concurrency control protocols in database systems:

- $S_1$: Every schedule allowed under the Basic Two-Phase Locking (2PL) protocol is guaranteed to be conflict serializable and deadlock-free.
- $S_2$: In the Strict Two-Phase Locking (Strict 2PL) protocol, all exclusive (write) locks acquired by a transaction must be held until the transaction terminates (commits or aborts), which guarantees that every generated schedule is recoverable and cascadeless.
- $S_3$: In the Rigorous Two-Phase Locking (Rigorous 2PL) protocol, all locks (both shared and exclusive) must be held until the transaction terminates, ensuring that the serializability order of transactions matches their commit order.
- $S_4$: In the Conservative (Static) Two-Phase Locking protocol, each transaction must acquire all its required locks prior to beginning execution, which completely prevents deadlocks.

Which of the above statements are TRUE?

(A) $S_1, S_2$, and $S_3$ only
(B) $S_2, S_3$, and $S_4$ only
(C) $S_1$ and $S_4$ only
(D) $S_2$ and $S_4$ only

### Solution
Let us evaluate each statement:

1. **Statement $S_1$ is FALSE:**
   Basic 2PL ensures conflict serializability by preventing lock acquisition after any lock is released (growing phase followed by shrinking phase). However, basic 2PL does NOT prevent deadlocks. For instance, if $T_1$ holds a lock on $X$ and requests $Y$, while $T_2$ holds a lock on $Y$ and requests $X$, a deadlock occurs under 2PL.

2. **Statement $S_2$ is TRUE:**
   Strict 2PL mandates that all exclusive (X) locks held by a transaction are retained until commit/abort. This guarantees that no other transaction can read or overwrite uncommitted data written by $T$. Hence, dirty reads are impossible, ensuring that the schedule is both recoverable and cascadeless (avoids cascading aborts).

3. **Statement $S_3$ is TRUE:**
   Rigorous 2PL requires that all locks (both shared S-locks and exclusive X-locks) are retained until the transaction commits or aborts. Because no data item read or written by $T$ can be accessed by any other transaction until $T$ commits, transactions are serialized in the exact chronological order in which they commit.

4. **Statement $S_4$ is TRUE:**
   Conservative 2PL (also known as Static 2PL) requires a transaction to declare and lock all its required data items in advance before starting execution. If any requested lock is unavailable, the transaction releases all locks it has obtained so far and waits. This eliminates the "Hold and Wait" condition, completely preventing deadlocks.

Therefore, statements $S_2, S_3,$ and $S_4$ are TRUE.

Hence, (B) is the correct option.

## Q9
type: MSQ
marks: 2
subject: dbms
topic: relational-algebra-calculus
answer: A, B, C

Let $R(A, B)$ and $S(B, C)$ be two relations. Which of the following relational algebra expressions is/are ALWAYS EQUIVALENT to the expression:

$$\Pi_A (R \bowtie S)$$

where $\bowtie$ denotes the natural join?

(A) $\Pi_A \left( R \bowtie \Pi_B(S) \right)$
(B) $\Pi_A \left( \sigma_{R.B = S.B} (R \times S) \right)$
(C) $\Pi_A \left( R \ltimes S \right)$, where $\ltimes$ denotes the semi-join operator
(D) $\Pi_A(R) \setminus \Pi_A \left( R \setminus (R \bowtie \Pi_B(S)) \right)$

### Solution
The expression $\Pi_A(R \bowtie S)$ projects the attribute $A$ from all tuples in $R$ that have at least one matching tuple in $S$ on the common attribute $B$.

Let us analyze each candidate expression:

- **Option (A) is TRUE:**
  In the natural join $R \bowtie S$, the attribute $C$ from relation $S$ is not involved in the join condition ($R.B = S.B$) and is discarded by the outer projection $\Pi_A$. Projecting $S$ onto $B$ first preserves all distinct values of $B$ present in $S$. Thus:
  $$\Pi_A(R \bowtie S) = \Pi_A(R \bowtie \Pi_B(S))$$
  This is a standard relational algebra heuristic (pushing projections).

- **Option (B) is TRUE:**
  By definition, the natural join of relations $R(A, B)$ and $S(B, C)$ on their common attribute $B$ is:
  $$R \bowtie S = \Pi_{A, B, C} \left( \sigma_{R.B = S.B} (R \times S) \right)$$
  Applying projection $\Pi_A$ yields:
  $$\Pi_A(R \bowtie S) = \Pi_A \left( \sigma_{R.B = S.B} (R \times S) \right)$$

- **Option (C) is TRUE:**
  The semi-join $R \ltimes S$ is defined as the projection of the natural join onto the schema of $R$:
  $$R \ltimes S = \Pi_{A, B}(R \bowtie S)$$
  Projecting further onto $A$:
  $$\Pi_A(R \ltimes S) = \Pi_A(\Pi_{A, B}(R \bowtie S)) = \Pi_A(R \bowtie S)$$

- **Option (D) is FALSE:**
  Consider the counterexample:
  - Let $R = \{(a_1, b_1), (a_1, b_2)\}$ and $S = \{(b_1, c_1)\}$.
  - The natural join is $R \bowtie S = \{(a_1, b_1, c_1)\}$.
  - The target expression produces:
    $$\Pi_A(R \bowtie S) = \{a_1\}$$
  - Now evaluate Option (D):
    - $R \bowtie \Pi_B(S) = \{(a_1, b_1)\}$
    - $R \setminus (R \bowtie \Pi_B(S)) = \{(a_1, b_2)\}$
    - $\Pi_A \left( R \setminus (R \bowtie \Pi_B(S)) \right) = \{a_1\}$
    - $\Pi_A(R) = \{a_1\}$
    - Finally: $\Pi_A(R) \setminus \{a_1\} = \{a_1\} \setminus \{a_1\} = \emptyset \ne \{a_1\}$
  Hence, Option (D) does not hold in general.

Therefore, expressions A, B, and C are always equivalent.

## Q10
type: NAT
marks: 2
subject: dbms
topic: sql
answer: 3

Consider the following relational instance of the `Enrollment` table:

| student_id | course_id | marks |
| :--- | :--- | :--- |
| 1 | CS101 | 85 |
| 1 | CS102 | 70 |
| 2 | CS101 | 90 |
| 2 | CS102 | 30 |
| 2 | CS103 | 60 |
| 3 | CS101 | 50 |
| 3 | CS102 | 65 |
| 3 | CS103 | 75 |
| 4 | CS101 | 80 |
| 4 | CS102 | 80 |
| 5 | CS101 | 95 |

Consider the following SQL query executed on this instance:

```sql
SELECT student_id
FROM Enrollment
WHERE marks >= 60
GROUP BY student_id
HAVING COUNT(*) >= 2 AND AVG(marks) > 70;
```

The total number of rows returned by this query is ______.

### Solution
Let us trace the query execution following standard SQL operational semantics:

1. **`WHERE marks >= 60` Clause:**
   The `WHERE` filter evaluates first on individual rows before any grouping:
   - For `student_id = 1`:
     - `(1, CS101, 85)`: $85 \ge 60 \implies$ Kept
     - `(1, CS102, 70)`: $70 \ge 60 \implies$ Kept
   - For `student_id = 2`:
     - `(2, CS101, 90)`: $90 \ge 60 \implies$ Kept
     - `(2, CS102, 30)`: $30 \ge 60$ is FALSE $\implies$ **Discarded**
     - `(2, CS103, 60)`: $60 \ge 60 \implies$ Kept
   - For `student_id = 3`:
     - `(3, CS101, 50)`: $50 \ge 60$ is FALSE $\implies$ **Discarded**
     - `(3, CS102, 65)`: $65 \ge 60 \implies$ Kept
     - `(3, CS103, 75)`: $75 \ge 60 \implies$ Kept
   - For `student_id = 4`:
     - `(4, CS101, 80)`: $80 \ge 60 \implies$ Kept
     - `(4, CS102, 80)`: $80 \ge 60 \implies$ Kept
   - For `student_id = 5`:
     - `(5, CS101, 95)`: $95 \ge 60 \implies$ Kept

2. **`GROUP BY student_id` on surviving rows:**
   Now evaluate the `HAVING COUNT(*) >= 2 AND AVG(marks) > 70` conditions for each group:

   - **Group `student_id = 1`:**
     - Surviving marks: $\{85, 70\}$
     - `COUNT(*)` $= 2 \ge 2$ (TRUE)
     - `AVG(marks)` $= \frac{85 + 70}{2} = 77.5 > 70$ (TRUE)
     - Group 1 **passes** the `HAVING` clause.

   - **Group `student_id = 2`:**
     - Surviving marks: $\{90, 60\}$
     - `COUNT(*)` $= 2 \ge 2$ (TRUE)
     - `AVG(marks)` $= \frac{90 + 60}{2} = 75.0 > 70$ (TRUE)
     - Group 2 **passes** the `HAVING` clause.
     - *(GATE Trap: If 30 had not been filtered out by WHERE, the average would have been 60, failing the condition).*

   - **Group `student_id = 3`:**
     - Surviving marks: $\{65, 75\}$
     - `COUNT(*)` $= 2 \ge 2$ (TRUE)
     - `AVG(marks)` $= \frac{65 + 75}{2} = 70.0$
     - Check: $70.0 > 70$ is **FALSE** (the condition requires strict inequality `> 70`).
     - Group 3 is **rejected**.

   - **Group `student_id = 4`:**
     - Surviving marks: $\{80, 80\}$
     - `COUNT(*)` $= 2 \ge 2$ (TRUE)
     - `AVG(marks)` $= \frac{80 + 80}{2} = 80.0 > 70$ (TRUE)
     - Group 4 **passes** the `HAVING` clause.

   - **Group `student_id = 5`:**
     - Surviving marks: $\{95\}$
     - `COUNT(*)` $= 1 \ge 2$ is **FALSE**.
     - Group 5 is **rejected**.

3. **Final Result Set:**
   The output rows contain `student_id`: $\{1, 2, 4\}$.
   Total number of rows returned $= 3$.

Hence, the answer is 3.

## Q11
type: MCQ
marks: 1
subject: toc
topic: regular-expressions-finite-automata
answer: A

Consider the following four regular expressions over the alphabet $\Sigma = \{a, b\}$:

$$R_1 = (a + b)^*$$
$$R_2 = (a^* b^*)^*$$
$$R_3 = (a^* b)^* a^*$$
$$R_4 = (a + b)^* a (a + b)^*$$

Which of the following statements is TRUE?

(A) $L(R_1) = L(R_2) = L(R_3) \ne L(R_4)$
(B) $L(R_1) = L(R_2) \ne L(R_3) = L(R_4)$
(C) All four regular expressions generate the same language
(D) $L(R_2) \subset L(R_1)$ and $L(R_3) \subset L(R_1)$

### Solution
Let us determine the language generated by each regular expression:

1. **$R_1 = (a + b)^* = \Sigma^*$:**
   Generates all possible finite-length strings of $a$'s and $b$'s, including the empty string $\epsilon$.

2. **$R_2 = (a^* b^*)^* = \Sigma^*$:**
   Notice that $a \in L(a^* b^*)$ (with $a^1 b^0$) and $b \in L(a^* b^*)$ (with $a^0 b^1$). Since $\{a, b\} \subseteq L(a^* b^*)$, the Kleene star $(a^* b^*)^*$ generates all concatenations of $a$ and $b$. Therefore, $L(R_2) = \Sigma^*$.

3. **$R_3 = (a^* b)^* a^* = \Sigma^*$:**
   Any string $w \in \{a, b\}^*$ contains a finite number of $b$'s. Each $b$ in $w$ is preceded by zero or more $a$'s ($a^* b$), and the string ends with zero or more trailing $a$'s ($a^*$). This is the standard canonical decomposition of $\Sigma^*$ by the occurrences of $b$. Thus, $L(R_3) = \Sigma^*$.

4. **$R_4 = (a + b)^* a (a + b)^*$:**
   $R_4$ generates the set of all strings that contain **at least one occurrence of $a$**.
   In particular, strings consisting purely of $b$'s (such as $\epsilon, b, bb, bbb, \dots$) cannot be generated by $R_4$ because there is no way to eliminate the required symbol $a$.
   Therefore, $L(R_4) = \Sigma^* \setminus \{b\}^* \ne \Sigma^*$.

Thus, $L(R_1) = L(R_2) = L(R_3) \ne L(R_4)$.

Hence, (A) is the correct option.

## Q12
type: NAT
marks: 1
subject: toc
topic: context-free-grammars-pda
answer: 35

Let $G$ be a context-free grammar in Chomsky Normal Form (CNF). Suppose a non-empty string $w \in L(G)$ of length $|w| = 18$ is derived using grammar $G$.

The exact number of derivation steps (production rule applications) in any derivation of $w$ in $G$ is ______.

### Solution
In Chomsky Normal Form (CNF), every production rule is of one of two forms:
1. $A \to BC$ (where $A, B, C$ are non-terminals)
2. $A \to a$ (where $A$ is a non-terminal and $a$ is a terminal)

Let $n = |w|$ be the length of the derived terminal string $w$:
- A derivation begins with the start symbol $S$ (1 non-terminal).
- Applying a rule of the form $A \to BC$ replaces 1 non-terminal with 2 non-terminals, increasing the number of non-terminals in the sentential form by 1.
  To reach a sentential form containing $n$ non-terminals from 1 start non-terminal requires:
  $$\text{Number of } (A \to BC) \text{ steps} = n - 1$$
- Applying a rule of the form $A \to a$ replaces 1 non-terminal with 1 terminal, leaving the number of remaining non-terminals reduced by 1.
  To convert all $n$ non-terminals into terminals requires:
  $$\text{Number of } (A \to a) \text{ steps} = n$$

Therefore, the total number of derivation steps in any derivation of $w$ is:
$$\text{Total Steps} = (n - 1) + n = 2n - 1$$

For $|w| = 18$:
$$\text{Total Steps} = 2(18) - 1 = 36 - 1 = 35$$

Hence, the answer is 35.

## Q13
type: NAT
marks: 2
subject: toc
topic: regular-expressions-finite-automata
answer: 8

The minimum number of states in a complete Deterministic Finite Automaton (DFA) that accepts the language

$$L = \{ w \in \{0, 1\}^* \mid \text{the third symbol from the right end of } w \text{ is } 1 \}$$

is ______.

### Solution
Let us characterize the state requirements of language $L$ using the Myhill-Nerode equivalence relation:

1. **State representation:**
   Whether a string $w$ is accepted after appending a suffix $z$ depends strictly on the last 3 symbols read:
   - If $|w| \ge 3$, writing $w$ as $\dots b_2 b_1 b_0$ (where $b_0$ is the rightmost symbol, $b_1$ is the second from the right, and $b_2$ is the third from the right), the string $w$ is accepted if and only if $b_2 = 1$.
   - Any string $w$ carries the state information of its 3-bit suffix $(b_2 b_1 b_0) \in \{0, 1\}^3$.
   - There are $2^3 = 8$ distinct 3-bit suffixes:
     $$\{000, 001, 010, 011, 100, 101, 110, 111\}$$

2. **Strings of length $< 3$:**
   Before 3 symbols have been read, prefixes $\epsilon, 0, 00$ behave identically to $000$ because appending any distinguishing suffix $z$ produces the same outcome as appending $z$ to $000$ (with implicit leading zeros).
   Similarly, $1$ behaves like $001$, $01$ behaves like $001$, and $10$ behaves like $010$.
   Hence, no extra states are required for strings of length $< 3$.

3. **Distinguishability of the 8 states:**
   Consider any two distinct suffixes $u = u_2 u_1 u_0$ and $v = v_2 v_1 v_0$:
   - If $u_2 \ne v_2$, the distinguishing suffix is $\epsilon$: one string is in $L$ (since its 3rd bit from right is 1) and the other is not.
   - If $u_1 \ne v_1$, the distinguishing suffix is $0$: appending $0$ shifts $u_1$ and $v_1$ into the 3rd position from the right. One yields an accepted string and the other a rejected string.
   - If $u_0 \ne v_0$, the distinguishing suffix is $00$: appending $00$ shifts $u_0$ and $v_0$ into the 3rd position from the right. One yields an accepted string and the other a rejected string.

Since all $2^3 = 8$ equivalence classes are pairwise distinguishable, the minimal complete DFA must contain exactly $2^3 = 8$ states.

*(General GATE Result: For alphabet $\Sigma = \{0, 1\}$, a DFA recognizing strings whose $k$-th symbol from the right is 1 requires exactly $2^k$ states, whereas an NFA requires only $k + 1$ states).*

Hence, the answer is 8.

## Q14
type: MSQ
marks: 2
subject: toc
topic: context-free-languages
answer: A, C, D

Consider the following four languages over the alphabet $\Sigma = \{a, b, c, d\}$:

- $L_1 = \{ a^n b^m c^k \mid n = m + k, \text{ where } n, m, k \ge 0 \}$
- $L_2 = \{ a^n b^n c^m d^m \mid n \ge 1, \; m \ge 1 \}$
- $L_3 = \{ w w^R \mid w \in \{a, b\}^* \}$, where $w^R$ denotes the reversal of $w$
- $L_4 = \{ a^n b^m c^k \mid n = m \text{ or } m = k, \text{ where } n, m, k \ge 0 \}$

Which of the following statements is/are TRUE?

(A) $L_1$ is a Deterministic Context-Free Language (DCFL).
(B) $L_2$ is NOT a context-free language.
(C) $L_3$ is a Context-Free Language (CFL), but NOT a Deterministic Context-Free Language (DCFL).
(D) $L_4$ is an inherently ambiguous context-free language.

### Solution
Let us evaluate each language individually:

1. **Language $L_1 = \{ a^n b^m c^k \mid n = m + k \}$:**
   - A Deterministic Pushdown Automaton (DPDA) can recognize $L_1$ as follows:
     - Push every $a$ onto the stack.
     - For each $b$ read, pop one $a$ from the stack.
     - For each $c$ read, pop one $a$ from the stack.
     - Accept if the stack contains only the start symbol $Z_0$ when the input is exhausted.
   - Because all transitions are uniquely determined by the input symbol and stack top without guessing, $L_1$ is accepted by a DPDA.
   - Hence, $L_1$ is a **DCFL**. Statement (A) is **TRUE**.

2. **Language $L_2 = \{ a^n b^n c^m d^m \mid n \ge 1, \; m \ge 1 \}$:**
   - $L_2$ is the concatenation of two context-free languages:
     $$A = \{ a^n b^n \mid n \ge 1 \} \quad \text{and} \quad B = \{ c^m d^m \mid m \ge 1 \}$$
   - Since the class of Context-Free Languages is closed under concatenation, $L_2 = A \cdot B$ is a Context-Free Language.
   - *(A PDA simply matches $a$'s against $b$'s on the stack, reaches bottom marker $Z_0$, and then matches $c$'s against $d$'s).*
   - Statement (B) claims that $L_2$ is NOT a CFL, which is **FALSE**.

3. **Language $L_3 = \{ w w^R \mid w \in \{a, b\}^* \}$:**
   - $L_3$ is the language of even-length palindromes.
   - It is generated by the CFG: $S \to aSa \mid bSb \mid \epsilon$, so it is a CFL.
   - However, without a center-marker symbol (such as in $w c w^R$), a PDA must non-deterministically guess when the first half $w$ ends and the reversed half $w^R$ begins. No DPDA can recognize $L_3$.
   - Hence, $L_3$ is a CFL but **NOT a DCFL**. Statement (C) is **TRUE**.

4. **Language $L_4 = \{ a^n b^m c^k \mid n = m \text{ or } m = k \}$:**
   - $L_4$ is the union of two CFLs: $L_{ab} = \{ a^n b^n c^k \}$ and $L_{bc} = \{ a^n b^k c^k \}$.
   - For strings in the intersection $L_{ab} \cap L_{bc} = \{ a^n b^n c^n \}$, any CFG for $L_4$ must be able to generate them either via the $n = m$ derivation path or via the $m = k$ derivation path.
   - It is a classically proven theorem that every CFG generating $L_4$ is ambiguous.
   - Thus, $L_4$ is **inherently ambiguous**. Statement (D) is **TRUE**.

Therefore, statements A, C, and D are TRUE.

## Q15
type: MCQ
marks: 2
subject: toc
topic: turing-machines-undecidability
answer: D

Let $L_1$ be a recursive (decidable) language, and let $L_2$ be a recursively enumerable (Turing-recognizable) language that is NOT recursive.

Which of the following statements is ALWAYS TRUE?

(A) The complement $\overline{L_2}$ is recursively enumerable.
(B) The set difference $L_2 \setminus L_1$ is guaranteed to be recursive.
(C) The intersection $L_1 \cap L_2$ is guaranteed to be recursive.
(D) The union $L_1 \cup L_2$ is recursively enumerable, but not necessarily recursive.

### Solution
Let us analyze each statement based on the closure properties of Recursive (REC) and Recursively Enumerable (RE) languages:

1. **Option (A) is FALSE:**
   - By Post's Theorem, a language $L$ is recursive if and only if both $L$ and its complement $\overline{L}$ are recursively enumerable.
   - Since $L_2$ is given to be RE but NOT recursive, its complement $\overline{L_2}$ CANNOT be recursively enumerable.

2. **Option (B) is FALSE:**
   - Set difference is defined as $L_2 \setminus L_1 = L_2 \cap \overline{L_1}$.
   - Since $L_1$ is recursive, its complement $\overline{L_1}$ is recursive.
   - However, the intersection of an RE language with a recursive language is RE, but not necessarily recursive.
   - Counterexample: Choose $L_1 = \emptyset$ (which is recursive). Then $L_2 \setminus \emptyset = L_2$, which is NOT recursive.

3. **Option (C) is FALSE:**
   - Counterexample: Choose $L_1 = \Sigma^*$ (which is recursive).
   - Then $L_1 \cap L_2 = \Sigma^* \cap L_2 = L_2$, which is NOT recursive.

4. **Option (D) is ALWAYS TRUE:**
   - Because $L_1$ is recursive, it is also recursively enumerable ($L_1 \in \text{RE}$).
   - The class of recursively enumerable languages is closed under union. Therefore, $L_1 \cup L_2$ is always recursively enumerable.
   - Is $L_1 \cup L_2$ necessarily recursive?
     - If $L_1 = \emptyset$, then $L_1 \cup L_2 = L_2$, which is NOT recursive.
     - If $L_1 = \Sigma^*$, then $L_1 \cup L_2 = \Sigma^*$, which is recursive.
   - Hence, $L_1 \cup L_2$ is recursively enumerable, but not necessarily recursive.

Therefore, (D) is the correct option.
