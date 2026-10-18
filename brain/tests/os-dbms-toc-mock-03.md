---
title: OS + DBMS + TOC · Mock 03
duration: 45
created: 2026-10-18
description: Mixed, non-serial GATE-level mock covering Operating Systems, Databases, and Theory of Computation.
---

## Q1
type: MCQ
marks: 1
subject: dbms
topic: relational-algebra-calculus
answer: A

Consider a relational database schema for a manufacturing enterprise:
- $\text{Suppliers}(\underline{\text{sid}}, \text{sname}, \text{city})$
- $\text{Parts}(\underline{\text{pid}}, \text{pname}, \text{color})$
- $\text{Catalog}(\underline{\text{sid}, \text{pid}}, \text{cost})$

Which of the following Tuple Relational Calculus (TRC) queries correctly retrieves the names of all suppliers who supply EVERY red part?

(A) $\{ t \mid \exists s \in \text{Suppliers} \, (t[\text{sname}] = s[\text{sname}] \land \forall p \in \text{Parts} \, (p[\text{color}] = \text{'Red'} \implies \exists c \in \text{Catalog} \, (c[\text{sid}] = s[\text{sid}] \land c[\text{pid}] = p[\text{pid}]))) \}$
(B) $\{ t \mid \exists s \in \text{Suppliers} \, (t[\text{sname}] = s[\text{sname}] \land \forall p \in \text{Parts} \, (p[\text{color}] = \text{'Red'} \land \exists c \in \text{Catalog} \, (c[\text{sid}] = s[\text{sid}] \land c[\text{pid}] = p[\text{pid}]))) \}$
(C) $\{ t \mid \exists s \in \text{Suppliers} \, (t[\text{sname}] = s[\text{sname}] \land \exists p \in \text{Parts} \, (p[\text{color}] = \text{'Red'} \land \exists c \in \text{Catalog} \, (c[\text{sid}] = s[\text{sid}] \land c[\text{pid}] = p[\text{pid}]))) \}$
(D) $\{ t \mid \exists s \in \text{Suppliers} \, (t[\text{sname}] = s[\text{sname}] \land \forall c \in \text{Catalog} \, (\exists p \in \text{Parts} \, (c[\text{pid}] = p[\text{pid}] \land p[\text{color}] = \text{'Red'}) \implies c[\text{sid}] = s[\text{sid}])) \}$

### Solution
Let us analyze the logical requirements for the query "Find names of suppliers who supply every red part":

1. **Universal condition over parts:**
   For a candidate supplier $s$, we must examine every part $p \in \text{Parts}$.
   The condition that must hold is:
   $$\text{"If } p \text{ is red, then } s \text{ supplies } p\text{"}$$
   In formal logic, this conditional statement is represented by implication:
   $$p[\text{color}] = \text{'Red'} \implies \exists c \in \text{Catalog} \, (c[\text{sid}] = s[\text{sid}] \land c[\text{pid}] = p[\text{pid}])$$

2. **Evaluating Option (A):**
   - If a part $p$ is red ($p[\text{color}] = \text{'Red'}$ is true), the implication evaluates to true if and only if there exists a tuple $c \in \text{Catalog}$ showing that supplier $s$ supplies part $p$.
   - If a part $p$ is NOT red ($p[\text{color}] = \text{'Red'}$ is false), the antecedent is false, making the implication **vacuously true** regardless of whether supplier $s$ supplies $p$.
   - Thus, the universal quantifier $\forall p \in \text{Parts}$ evaluates to true if and only if supplier $s$ supplies all parts that are red.
   - Hence, Option (A) is correct.

3. **Why the other options are wrong:**
   - **Option (B):** Replaces implication with conjunction ($\land$).
     The condition requires that for EVERY part $p$ in the entire `Parts` relation, $p$ must be red AND supplied by $s$. If the database contains even a single green or blue part, the condition $p[\text{color}] = \text{'Red'}$ evaluates to false for that part, causing the entire $\forall p$ expression to evaluate to false. Thus, Option (B) would return an empty result if any non-red part exists.
   - **Option (C):** Uses existential quantification $\exists p$ instead of $\forall p$. This query retrieves suppliers who supply *at least one* red part, rather than *every* red part.
   - **Option (D):** Quantifies over `Catalog` instead of `Parts`, and states that if any catalog entry is for a red part, it must be supplied by $s$. This would find suppliers who are the *sole* supplier of all cataloged red parts.

Hence, (A) is the correct option.

## Q2
type: MCQ
marks: 1
subject: os
topic: cpu-scheduling
answer: A

Consider four processes $P_1, P_2, P_3$, and $P_4$ with arrival times and CPU burst times given below:

| Process | Arrival Time (ms) | Burst Time (ms) |
| :--- | :--- | :--- |
| $P_1$ | 0 | 3 |
| $P_2$ | 1 | 6 |
| $P_3$ | 3 | 4 |
| $P_4$ | 5 | 2 |

The CPU scheduler uses the non-preemptive Highest Response Ratio Next (HRRN) scheduling algorithm, where the response ratio $RR$ of a process is defined as:

$$RR = \frac{W + S}{S} = 1 + \frac{W}{S}$$

where $W$ is the waiting time accumulated by the process so far, and $S$ is its CPU burst time. Ties in response ratio are broken in favor of the process with the smaller process ID.

The average turnaround time (in ms) of the four processes is:

(A) $7.25\text{ ms}$
(B) $8.00\text{ ms}$
(C) $6.75\text{ ms}$
(D) $7.50\text{ ms}$

### Solution
Let us trace the execution of the processes under the non-preemptive Highest Response Ratio Next (HRRN) policy:

- **At time $t = 0\text{ ms}$:**
  - Only process $P_1$ has arrived in the ready queue.
  - $P_1$ is scheduled and runs non-preemptively from $t = 0$ to $t = 3\text{ ms}$.
  - $P_1$ completes at $t = 3\text{ ms}$.

- **At time $t = 3\text{ ms}$:**
  - The processes present in the ready queue are $P_2$ (arrived at $t = 1$) and $P_3$ (arrived at $t = 3$). ($P_4$ arrives at $t = 5$).
  - Calculate response ratios at $t = 3\text{ ms}$:
    - For $P_2$: Waiting time $W = 3 - 1 = 2\text{ ms}$, burst $S = 6\text{ ms}$.
      $$RR(P_2) = \frac{2 + 6}{6} = \frac{8}{6} \approx 1.333$$
    - For $P_3$: Waiting time $W = 3 - 3 = 0\text{ ms}$, burst $S = 4\text{ ms}$.
      $$RR(P_3) = \frac{0 + 4}{4} = \frac{4}{4} = 1.000$$
  - Since $RR(P_2) > RR(P_3)$, process $P_2$ is selected.
  - $P_2$ executes non-preemptively from $t = 3$ to $t = 3 + 6 = 9\text{ ms}$.
  - $P_2$ completes at $t = 9\text{ ms}$.

- **At time $t = 9\text{ ms}$:**
  - Both remaining processes $P_3$ and $P_4$ are now in the ready queue.
  - Calculate response ratios at $t = 9\text{ ms}$:
    - For $P_3$: Waiting time $W = 9 - 3 = 6\text{ ms}$, burst $S = 4\text{ ms}$.
      $$RR(P_3) = \frac{6 + 4}{4} = \frac{10}{4} = 2.50$$
    - For $P_4$: Waiting time $W = 9 - 5 = 4\text{ ms}$, burst $S = 2\text{ ms}$.
      $$RR(P_4) = \frac{4 + 2}{2} = \frac{6}{2} = 3.00$$
  - Since $RR(P_4) > RR(P_3)$ ($3.00 > 2.50$), process $P_4$ is selected.
  - $P_4$ executes non-preemptively from $t = 9$ to $t = 9 + 2 = 11\text{ ms}$.
  - $P_4$ completes at $t = 11\text{ ms}$.

- **At time $t = 11\text{ ms}$:**
  - Only $P_3$ remains.
  - $P_3$ executes from $t = 11$ to $t = 11 + 4 = 15\text{ ms}$.
  - $P_3$ completes at $t = 15\text{ ms}$.

**Turnaround Time Calculation ($\text{TAT} = \text{Completion Time} - \text{Arrival Time}$):**
- $P_1: \text{TAT} = 3 - 0 = 3\text{ ms}$
- $P_2: \text{TAT} = 9 - 1 = 8\text{ ms}$
- $P_3: \text{TAT} = 15 - 3 = 12\text{ ms}$
- $P_4: \text{TAT} = 11 - 5 = 6\text{ ms}$

$$\text{Sum of Turnaround Times} = 3 + 8 + 12 + 6 = 29\text{ ms}$$
$$\text{Average Turnaround Time} = \frac{29}{4} = 7.25\text{ ms}$$

*(Common GATE Trap: Scheduling $P_3$ before $P_4$ at $t = 9$ based on arrival order or mistaken response ratio gives an average TAT of $7.75\text{ ms}$. Also, confusing waiting time with turnaround time: sum of waiting times is $0 + 2 + 8 + 4 = 14\text{ ms}$, giving average waiting time $3.5\text{ ms}$).*

Hence, (A) is the correct option.

## Q3
type: MCQ
marks: 1
subject: toc
topic: regular-languages
answer: B

Consider the following four languages defined over the specified alphabets:

- $L_1 = \{ 0^n 1^m 0^{n+m} \mid n \ge 0, \; m \ge 0 \}$ over $\Sigma = \{0, 1\}$
- $L_2 = \{ w \in \{a, b\}^* \mid \text{the number of occurrences of } ab \text{ in } w \text{ is equal to the number of occurrences of } ba \text{ in } w \}$ over $\Sigma = \{a, b\}$
- $L_3 = \{ a^n b^m \mid \gcd(n, m) = 1, \; n \ge 1, \; m \ge 1 \}$ over $\Sigma = \{a, b\}$
- $L_4 = \{ a^n b^m \mid n \ne m, \; n \ge 0, \; m \ge 0 \}$ over $\Sigma = \{a, b\}$

Which of the above languages is REGULAR?

(A) $L_1$
(B) $L_2$
(C) $L_3$
(D) $L_4$

### Solution
Let us analyze each language individually:

1. **Language $L_1 = \{ 0^n 1^m 0^{n+m} \}$:**
   - To decide membership in $L_1$, an automaton must count the number of $0$'s before the $1$'s, count the $1$'s, and verify that the trailing block of $0$'s has length equal to the sum $n + m$.
   - Because $n$ and $m$ are unbounded, this requires unbounded memory. By the Pumping Lemma for regular languages, $L_1$ is NOT regular (it is a deterministic context-free language).

2. **Language $L_2 = \{ w \in \{a, b\}^* \mid |w|_{ab} = |w|_{ba} \}$:**
   - Consider any string $w \in \{a, b\}^*$. Every transition from an $a$ to a $b$ increments the count of substring $ab$, and every transition from a $b$ to an $a$ increments the count of substring $ba$.
   - In any traversal of the string:
     - If the string starts with $a$ and ends with $a$, the number of $a \to b$ transitions must exactly equal the number of $b \to a$ transitions: $|w|_{ab} = |w|_{ba}$.
     - If the string starts with $b$ and ends with $b$, the number of $b \to a$ transitions must exactly equal the number of $a \to b$ transitions: $|w|_{ab} = |w|_{ba}$.
     - If the string starts with $a$ and ends with $b$, $|w|_{ab} = |w|_{ba} + 1$.
     - If the string starts with $b$ and ends with $a$, $|w|_{ba} = |w|_{ab} + 1$.
   - Therefore, $|w|_{ab} = |w|_{ba}$ holds if and only if the string starts and ends with the SAME symbol, or has length $|w| \le 1$!
   - This can be expressed by the regular expression:
     $$r = \epsilon + a + b + a(a + b)^*a + b(a + b)^*b$$
   - A finite automaton with 5 states can recognize this condition by remembering the first symbol read and checking if the final symbol matches.
   - Therefore, $L_2$ is **REGULAR**.

3. **Language $L_3 = \{ a^n b^m \mid \gcd(n, m) = 1 \}$:**
   - Testing coprimality requires unbounded division / Euclidean algorithm steps. A finite automaton with finite states cannot verify whether $\gcd(n, m) = 1$ for arbitrarily large $n$ and $m$. By the Pumping Lemma, $L_3$ is NOT regular.

4. **Language $L_4 = \{ a^n b^m \mid n \ne m \}$:**
   - $L_4$ is the complement of $\{a^n b^n\}$ relative to $a^* b^*$. If $L_4$ were regular, its intersection with $a^* b^*$ complemented would imply that $\{a^n b^n\}$ is regular, which is a contradiction. Hence, $L_4$ is NOT regular.

Hence, (B) is the regular language.

## Q4
type: NAT
marks: 1
subject: dbms
topic: functional-dependencies-normal-forms
answer: 4

Consider a relation schema $R(A, B, C, D, E, F)$ with the following set of functional dependencies:

$$F = \{ AB \to C, \quad C \to D, \quad D \to E, \quad E \to B, \quad F \to A \}$$

The total number of candidate keys of relation $R$ is ______.

### Solution
Let us determine all candidate keys of $R(A, B, C, D, E, F)$:

1. **Identify essential attributes:**
   - Inspect the right-hand sides of all functional dependencies in $F$:
     - $A$ appears on the RHS of $F \to A$.
     - $B$ appears on the RHS of $E \to B$.
     - $C$ appears on the RHS of $AB \to C$.
     - $D$ appears on the RHS of $C \to D$.
     - $E$ appears on the RHS of $D \to E$.
     - $F$ does NOT appear on the right-hand side of any functional dependency.
   - Because $F$ cannot be derived from any other attribute, attribute $F$ **must be present in every candidate key** of $R$.

2. **Compute the closure of $F$ alone:**
   $$(F)^+ = \{F, A\} \quad (\text{using } F \to A)$$
   Since $(F)^+ \ne R$, $F$ alone is not a candidate key.

3. **Examine combinations of $F$ with other attributes:**
   Notice the dependency cycle among $\{B, C, D, E\}$:
   $$B \xrightarrow{+A} C \to D \to E \to B$$
   Since $F$ supplies attribute $A$, adding any single attribute from the set $\{B, C, D, E\}$ to $F$ allows the cycle to be traversed completely:

   - **Check $(FB)^+$:**
     $$(FB)^+ = \{F, B\} \xrightarrow{F \to A} \{F, B, A\} \xrightarrow{AB \to C} \{F, B, A, C\} \xrightarrow{C \to D} \{F, B, A, C, D\} \xrightarrow{D \to E} \{A, B, C, D, E, F\} = R$$
     Since no proper subset of $FB$ derives $R$, $FB$ is a candidate key.

   - **Check $(FC)^+$:**
     $$(FC)^+ = \{F, C\} \xrightarrow{F \to A} \{F, C, A\} \xrightarrow{C \to D} \{F, C, A, D\} \xrightarrow{D \to E} \{F, C, A, D, E\} \xrightarrow{E \to B} \{A, B, C, D, E, F\} = R$$
     $FC$ is a candidate key.

   - **Check $(FD)^+$:**
     $$(FD)^+ = \{F, D\} \xrightarrow{F \to A} \{F, D, A\} \xrightarrow{D \to E} \{F, D, A, E\} \xrightarrow{E \to B} \{F, D, A, E, B\} \xrightarrow{AB \to C} \{A, B, C, D, E, F\} = R$$
     $FD$ is a candidate key.

   - **Check $(FE)^+$:**
     $$(FE)^+ = \{F, E\} \xrightarrow{F \to A} \{F, E, A\} \xrightarrow{E \to B} \{F, E, A, B\} \xrightarrow{AB \to C} \{F, E, A, B, C\} \xrightarrow{C \to D} \{A, B, C, D, E, F\} = R$$
     $FE$ is a candidate key.

4. **Check remaining 2-attribute set $(FA)$:**
   $$(FA)^+ = \{F, A\} \ne R$$
   Thus, $FA$ is not a superkey.

5. **Check for higher-order candidate keys:**
   Any 3-attribute set containing $F$ that includes any of $B, C, D,$ or $E$ is a proper superset of one of $\{FB, FC, FD, FE\}$, and therefore cannot be minimal. Any set not containing $F$ cannot derive $F$, so it cannot be a superkey.

Therefore, the candidate keys are precisely:
$$\{FB, \; FC, \; FD, \; FE\}$$

Total number of candidate keys $= 4$.

## Q5
type: NAT
marks: 1
subject: os
topic: concurrency-synchronization
answer: 10

In an operating system, a counting semaphore $S$ is implemented using standard Dijkstra semantics, where a negative semaphore value indicates that processes are waiting in the semaphore queue:
- A `wait(S)` operation decrements the semaphore value by 1; if the resulting value is negative, the calling process is blocked.
- A `signal(S)` operation increments the semaphore value by 1; if the value remains less than or equal to 0, one blocked process is awakened.

The semaphore $S$ is initialized to 8. A set of concurrent processes perform a total of 23 `wait` operations and $k$ `signal` operations on $S$. If exactly 5 processes are currently blocked in the waiting queue of $S$, the value of $k$ is ______.

### Solution
Let us trace the counting semaphore value according to the standard definition:

1. **Semaphore definition:**
   Let the initial value of the semaphore be $S_0 = 8$.
   - Each completed or attempted `wait(S)` operation decrements the semaphore counter by 1.
   - Each `signal(S)` operation increments the semaphore counter by 1.

2. **Semaphore value in terms of blocked processes:**
   Under standard counting semaphore semantics:
   - When the semaphore value is non-negative ($S \ge 0$), it represents the number of available resource units, and 0 processes are blocked.
   - When the semaphore value is negative ($S < 0$), its absolute value $|S|$ represents the exact number of processes currently blocked in the waiting queue.
   Since exactly 5 processes are currently blocked, the current value of semaphore $S$ must be:
   $$S = -5$$

3. **Setting up the equation:**
   $$\text{Current Value} = S_0 - (\text{Number of wait operations}) + (\text{Number of signal operations})$$
   $$-5 = 8 - 23 + k$$
   $$-5 = -15 + k$$
   $$k = -5 + 15 = 10$$

4. **Verification:**
   - Initial value $= 8$.
   - The first 8 `wait` operations reduce $S$ to 0 (0 processes blocked).
   - The next 15 `wait` operations decrement $S$ from 0 down to $-15$ (15 processes blocked).
   - Then, 10 `signal` operations increment $S$ from $-15$ up to $-5$, awakening 10 of the blocked processes.
   - Exactly $15 - 10 = 5$ processes remain blocked in the queue, and $S = -5$.

Hence, the value of $k$ is 10.

## Q6
type: MCQ
marks: 1
subject: toc
topic: regular-expressions-finite-automata
answer: A

Consider the following Deterministic Finite Automaton (DFA) $M = (Q, \Sigma, \delta, q_0, F)$ over the alphabet $\Sigma = \{a, b\}$:
- State set: $Q = \{q_0, q_1, q_2, q_3\}$
- Start state: $q_0$
- Accepting state set: $F = \{q_2\}$

The transition function $\delta$ is defined as follows:
- $\delta(q_0, a) = q_1, \quad \delta(q_0, b) = q_0$
- $\delta(q_1, a) = q_1, \quad \delta(q_1, b) = q_2$
- $\delta(q_2, a) = q_3, \quad \delta(q_2, b) = q_2$
- $\delta(q_3, a) = q_3, \quad \delta(q_3, b) = q_3$

Which of the following regular expressions represents the language accepted by this automaton?

(A) $b^* a^+ b^+$
(B) $b^* (a + b)^* b$
(C) $(b^* a b^*)^*$
(D) $b^* a^* b^+$

### Solution
Let us trace the state transitions of the automaton from the start state $q_0$ to the single accepting state $q_2$:

1. **From state $q_0$:**
   - On input $b$, the automaton loops on $q_0$ ($\delta(q_0, b) = q_0$). This corresponds to zero or more leading $b$'s: $b^*$.
   - On input $a$, the automaton moves to state $q_1$ ($\delta(q_0, a) = q_1$). At least one $a$ is strictly required to leave $q_0$.

2. **From state $q_1$:**
   - On input $a$, the automaton loops on $q_1$ ($\delta(q_1, a) = q_1$).
   - Together with the initial transition from $q_0$, this represents one or more consecutive $a$'s: $a^+$.
   - On input $b$, the automaton transitions to state $q_2$ ($\delta(q_1, b) = q_2$).

3. **From state $q_2$ (the accepting state):**
   - On input $b$, the automaton loops on $q_2$ ($\delta(q_2, b) = q_2$).
   - Since $q_2$ is entered via a $b$ from $q_1$, and any subsequent $b$ remains in $q_2$, this corresponds to one or more consecutive trailing $b$'s: $b^+$.
   - On input $a$, the automaton transitions to state $q_3$ ($\delta(q_2, a) = q_3$).

4. **From state $q_3$ (trap/dead state):**
   - $\delta(q_3, a) = q_3$ and $\delta(q_3, b) = q_3$.
   - State $q_3$ is non-accepting and has no outgoing transitions to any other state.
   - Therefore, if any symbol $a$ appears after the automaton has entered $q_2$, the string is permanently rejected.

5. **Language synthesis:**
   A string is accepted if and only if:
   - It begins with zero or more $b$'s ($b^*$).
   - Followed by one or more $a$'s ($a^+$).
   - Followed by one or more $b$'s ($b^+$).
   - And no further symbols follow.

Thus, the language accepted by the DFA is $L = L(b^* a^+ b^+)$.

**Evaluating incorrect options:**
- Option (B) generates strings like $b a b a b$, which enter the dead state $q_3$ upon reading the second $a$ and are rejected by the DFA.
- Option (C) generates strings with multiple interleaved segments of $a$'s and $b$'s, as well as the empty string $\epsilon$, neither of which is accepted.
- Option (D) includes strings in $b^*$ followed by $b^+$ (with zero $a$'s), but strings composed purely of $b$'s remain in $q_0$ and are never accepted.

Hence, (A) is the correct option.

## Q7
type: MCQ
marks: 2
subject: os
topic: deadlock
answer: A

Consider a system consisting of five processes $\{P_0, P_1, P_2, P_3, P_4\}$ and three resource types $\{A, B, C\}$. The total system resources are $(10, 5, 7)$ for $(A, B, C)$, respectively.

At the current time, the resource allocation state is given by:

$$\text{Allocation} = \begin{pmatrix} & A & B & C \\ P_0 & 0 & 1 & 0 \\ P_1 & 2 & 0 & 0 \\ P_2 & 3 & 0 & 2 \\ P_3 & 2 & 1 & 1 \\ P_4 & 0 & 0 & 2 \end{pmatrix}, \quad \text{Max} = \begin{pmatrix} & A & B & C \\ P_0 & 7 & 5 & 3 \\ P_1 & 3 & 2 & 2 \\ P_2 & 9 & 0 & 2 \\ P_3 & 2 & 2 & 2 \\ P_4 & 4 & 3 & 3 \end{pmatrix}$$

Consider two independent resource requests that might arrive in this state:
- $R_1$: Process $P_1$ requests $(1, 0, 2)$
- $R_2$: Process $P_4$ requests $(3, 3, 0)$

Which of the following statements is TRUE regarding whether these requests can be granted immediately by the operating system using the Banker's Algorithm?

(A) Only $R_1$ can be granted immediately
(B) Only $R_2$ can be granted immediately
(C) Both $R_1$ and $R_2$ can be granted immediately
(D) Neither $R_1$ nor $R_2$ can be granted immediately

### Solution
Let us first evaluate the Available resource vector and the Need matrix in the initial state:

1. **Total Allocated Resources:**
   - $A: 0 + 2 + 3 + 2 + 0 = 7$
   - $B: 1 + 0 + 0 + 1 + 0 = 2$
   - $C: 0 + 0 + 2 + 1 + 2 = 5$
   - $\text{Total Allocated} = (7, 2, 5)$

2. **Current Available Vector:**
   $$\text{Available} = \text{Total} - \text{Allocated} = (10 - 7, \; 5 - 2, \; 7 - 5) = (3, 3, 2)$$

3. **Need Matrix ($\text{Need} = \text{Max} - \text{Allocation}$):**
   - $P_0: (7-0, 5-1, 3-0) = (7, 4, 3)$
   - $P_1: (3-2, 2-0, 2-0) = (1, 2, 2)$
   - $P_2: (9-3, 0-0, 2-2) = (6, 0, 0)$
   - $P_3: (2-2, 2-1, 2-1) = (0, 1, 1)$
   - $P_4: (4-0, 3-0, 3-2) = (4, 3, 1)$

---

### Evaluating Request $R_1$: $P_1$ requests $(1, 0, 2)$
1. **Check Condition 1 ($\text{Request}_1 \le \text{Need}_1$):**
   $(1, 0, 2) \le (1, 2, 2) \implies$ TRUE.
2. **Check Condition 2 ($\text{Request}_1 \le \text{Available}$):**
   $(1, 0, 2) \le (3, 3, 2) \implies$ TRUE ($1 \le 3, 0 \le 3, 2 \le 2$).
3. **Pretend to allocate resources to $P_1$:**
   $$\text{Available}' = (3, 3, 2) - (1, 0, 2) = (2, 3, 0)$$
   $$\text{Allocation}_1' = (2, 0, 0) + (1, 0, 2) = (3, 0, 2)$$
   $$\text{Need}_1' = (1, 2, 2) - (1, 0, 2) = (0, 2, 0)$$
4. **Safety Check on the tentative state with $\text{Available}' = (2, 3, 0)$:**
   - For $P_1$: $\text{Need}_1' = (0, 2, 0) \le (2, 3, 0)$.
     $P_1$ can complete! Upon completion, it releases $\text{Allocation}_1' = (3, 0, 2)$:
     $$\text{Available}'' = (2, 3, 0) + (3, 0, 2) = (5, 3, 2)$$
   - For $P_3$: $\text{Need}_3 = (0, 1, 1) \le (5, 3, 2)$.
     $P_3$ can complete! Upon completion, it releases $\text{Allocation}_3 = (2, 1, 1)$:
     $$\text{Available}''' = (5, 3, 2) + (2, 1, 1) = (7, 4, 3)$$
   - For $P_0$: $\text{Need}_0 = (7, 4, 3) \le (7, 4, 3)$.
     $P_0$ can complete! Upon completion, it releases $(0, 1, 0) \implies \text{Available} = (7, 5, 3)$.
   - For $P_2$: $\text{Need}_2 = (6, 0, 0) \le (7, 5, 3)$.
     $P_2$ can complete!
   - For $P_4$: $\text{Need}_4 = (4, 3, 1) \le (10, 5, 5)$.
     $P_4$ can complete!
   Since a valid safe sequence $\langle P_1, P_3, P_0, P_2, P_4 \rangle$ exists, the state is SAFE.
   Therefore, **$R_1$ can be granted immediately**.

---

### Evaluating Request $R_2$: $P_4$ requests $(3, 3, 0)$
1. **Check Condition 1 ($\text{Request}_4 \le \text{Need}_4$):**
   $(3, 3, 0) \le (4, 3, 1) \implies$ TRUE.
2. **Check Condition 2 ($\text{Request}_4 \le \text{Available}$):**
   $(3, 3, 0) \le (3, 3, 2) \implies$ TRUE ($3 \le 3, 3 \le 3, 0 \le 2$).
3. **Pretend to allocate resources to $P_4$:**
   $$\text{Available}' = (3, 3, 2) - (3, 3, 0) = (0, 0, 2)$$
   $$\text{Allocation}_4' = (0, 0, 2) + (3, 3, 0) = (3, 3, 2)$$
   $$\text{Need}_4' = (4, 3, 1) - (3, 3, 0) = (1, 0, 1)$$
4. **Safety Check on the tentative state with $\text{Available}' = (0, 0, 2)$:**
   Compare the Needs of all processes with $(0, 0, 2)$:
   - $P_0: (7, 4, 3) \not\le (0, 0, 2)$ ($7 > 0$)
   - $P_1: (1, 2, 2) \not\le (0, 0, 2)$ ($1 > 0$)
   - $P_2: (6, 0, 0) \not\le (0, 0, 2)$ ($6 > 0$)
   - $P_3: (0, 1, 1) \not\le (0, 0, 2)$ ($1 > 0$ for resource $B$)
   - $P_4: \text{Need}_4' = (1, 0, 1) \not\le (0, 0, 2)$ ($1 > 0$ for resource $A$)
   No process can satisfy its remaining need. The system enters an UNSAFE state.
   Therefore, **$R_2$ CANNOT be granted immediately**; $P_4$ must wait.

Hence, (A) is the correct option.

## Q8
type: MSQ
marks: 2
subject: dbms
topic: transactions-concurrency-control
answer: A, B, D

Which of the following statements regarding concurrency control protocols and transaction management is/are TRUE?

(A) The Thomas Write Rule relaxes the basic timestamp-ordering protocol by ignoring obsolete write operations, which allows schedules that are view serializable but not necessarily conflict serializable.
(B) In the Wound-Wait deadlock prevention scheme, if an older transaction requests a data item currently locked by a younger transaction, the younger transaction is preempted and rolled back (wounded).
(C) In both the Wait-Die and Wound-Wait deadlock prevention schemes, starvation of an aborted transaction is prevented by assigning it a new, updated timestamp corresponding to its restart time.
(D) Every schedule allowed by the Basic Timestamp-Ordering protocol is guaranteed to be conflict serializable and free from deadlocks.

### Solution
Let us evaluate each statement individually:

- **Statement (A) is TRUE:**
  Under the Basic Timestamp-Ordering (TO) protocol, if transaction $T$ issues a write operation $w(Q)$ but its timestamp is older than the largest write timestamp on $Q$ ($TS(T) < W\text{-timestamp}(Q)$), the write arrives too late and $T$ is aborted.
  The Thomas Write Rule observes that $T$'s write would have been overwritten by the later write anyway without being read in between. Thus, Thomas Write Rule simply **ignores** (skips) $T$'s obsolete write and lets $T$ continue. The resulting schedule preserves view equivalence to the serial order of timestamps, producing schedules that are **view serializable but not conflict serializable**.

- **Statement (B) is TRUE:**
  The Wound-Wait scheme is a preemptive deadlock prevention strategy based on timestamps:
  - If $TS(T_{\text{old}}) < TS(T_{\text{young}})$ (older requests item held by younger): $T_{\text{old}}$ "wounds" $T_{\text{young}}$, causing $T_{\text{young}}$ to be preempted and rolled back.
  - If $TS(T_{\text{young}}) > TS(T_{\text{old}})$ (younger requests item held by older): $T_{\text{young}}$ is allowed to wait.
  Therefore, statement (B) is correct.

- **Statement (C) is FALSE:**
  In both Wait-Die and Wound-Wait schemes, when an aborted transaction restarts, it is strictly assigned its **ORIGINAL timestamp**, NOT a new one!
  If an aborted transaction were given a fresh, current timestamp, it would become younger on every abort and could theoretically be aborted repeatedly, leading to starvation. By retaining its original (old) timestamp, the transaction becomes progressively older relative to newly arriving transactions, guaranteeing that it will eventually become the oldest transaction in the system and complete without further aborts.

- **Statement (D) is TRUE:**
  In the Basic Timestamp-Ordering protocol:
  - Every conflict between operations is resolved in the strict order of transaction timestamps. Any conflicting operation that violates this timestamp order causes the issuing transaction to abort and roll back.
  - As a result, the serialization graph can only contain edges directed from smaller timestamps to larger timestamps ($T_i \to T_j$ with $TS(T_i) < TS(T_j)$). Such a graph is strictly acyclic, guaranteeing **conflict serializability**.
  - Furthermore, transactions never wait for locks (they either proceed immediately or abort); hence, **deadlock cannot occur**.

Hence, statements A, B, and D are TRUE.

## Q9
type: MSQ
marks: 2
subject: toc
topic: context-free-languages
answer: A, B, C

Let $L_1$ and $L_2$ be arbitrary Context-Free Languages (CFLs), and let $R$ be an arbitrary Regular language over an alphabet $\Sigma$. Which of the following statements is/are ALWAYS TRUE?

(A) The language $\text{Pref}(L_1) = \{ u \in \Sigma^* \mid \exists v \in \Sigma^* \text{ such that } uv \in L_1 \}$ (the set of all prefixes of strings in $L_1$) is always a context-free language.
(B) The right quotient $L_1 / R = \{ u \in \Sigma^* \mid \exists v \in R \text{ such that } uv \in L_1 \}$ is always a context-free language.
(C) The reversed language $L_1^R = \{ w^R \mid w \in L_1 \}$ is always a context-free language.
(D) The intersection $L_1 \cap L_2$ is always a context-free language.

### Solution
Let us analyze the closure properties of Context-Free Languages:

- **Statement (A) is TRUE (Closure under Prefix):**
  The class of context-free languages is closed under prefix.
  *Proof sketch:* Given a pushdown automaton $M$ that accepts $L_1$ by final state, we can construct a PDA $M'$ for $\text{Pref}(L_1)$. While reading input prefix $u$, $M'$ behaves exactly like $M$. At any point, $M'$ can non-deterministically guess that it has reached the end of $u$, enter a new set of states, and simulate $M$ on $\epsilon$-transitions (or accept if the remaining stack configuration can be driven to an accepting state of $M$ by some string $v$). Alternatively, this follows from closure of CFLs under regular operations and GSM mappings.

- **Statement (B) is TRUE (Closure under Quotient with a Regular Language):**
  The class of CFLs is closed under right quotient (and left quotient) with a regular language.
  *Proof sketch:* Let $M_{PDA} = (Q_1, \Sigma, \Gamma, \delta_1, q_0, Z_0, F_1)$ accept $L_1$ and $M_{DFA} = (Q_2, \Sigma, \delta_2, s_0, F_2)$ accept $R$. We can construct a PDA that reads $u$ while tracking states in $Q_1$. Upon completing $u$, it nondeterministically guesses a state $s \in Q_2$ from which string $v \in R$ could lead to an accepting state in $F_2$, and verifies on $\epsilon$-transitions that the suffix $v$ takes the PDA to $F_1$ while taking the DFA from $s$ to $F_2$. Thus, $L_1 / R$ is context-free.

- **Statement (C) is TRUE (Closure under Reversal):**
  The class of context-free languages is closed under reversal.
  *Proof sketch:* Let $G = (V, \Sigma, R, S)$ be a context-free grammar in which $L(G) = L_1$. We construct grammar $G^R = (V, \Sigma, R', S)$ where every production rule $A \to \alpha$ in $R$ is replaced by $A \to \alpha^R$ in $R'$ (the right-hand side of each production is reversed). Clearly, $G^R$ is a context-free grammar, and it derives precisely $w^R$ for each $w$ derivable in $G$. Thus, $L_1^R$ is a CFL.

- **Statement (D) is FALSE (Non-closure under Intersection):**
  The class of context-free languages is NOT closed under intersection.
  *Standard Counterexample:*
  Consider the two CFLs:
  $$L_1 = \{ a^n b^n c^m \mid n \ge 1, \; m \ge 1 \} \quad \text{and} \quad L_2 = \{ a^m b^n c^n \mid m \ge 1, \; n \ge 1 \}$$
  Both $L_1$ and $L_2$ are deterministic context-free languages.
  However, their intersection is:
  $$L_1 \cap L_2 = \{ a^n b^n c^n \mid n \ge 1 \}$$
  which is well known (via the Pumping Lemma for CFLs) to NOT be a context-free language.

Hence, statements A, B, and C are ALWAYS TRUE.

## Q10
type: MCQ
marks: 2
subject: dbms
topic: sql
answer: A

Consider the following relational schema and instances for an academic course registration system:

**Courses:**

| cid | dept | credits |
| :--- | :--- | :--- |
| C1 | CS | 4 |
| C2 | CS | 3 |
| C3 | EE | 4 |
| C4 | CS | 3 |

**Enrolled:**

| sid | cid | grade |
| :--- | :--- | :--- |
| S1 | C1 | 9 |
| S1 | C2 | 8 |
| S1 | C4 | 10 |
| S2 | C1 | 7 |
| S2 | C3 | 8 |
| S3 | C1 | 9 |
| S3 | C2 | 7 |
| S4 | C1 | 6 |
| S4 | C2 | 8 |
| S4 | C3 | 7 |
| S4 | C4 | 9 |

Consider the following SQL query executed on this database:

```sql
SELECT DISTINCT E1.sid
FROM Enrolled E1
WHERE NOT EXISTS (
    SELECT C.cid
    FROM Courses C
    WHERE C.dept = 'CS'
      AND NOT EXISTS (
          SELECT E2.cid
          FROM Enrolled E2
          WHERE E2.sid = E1.sid
            AND E2.cid = C.cid
      )
);
```

Which of the following sets of student IDs represents the exact output of this query?

(A) `{'S1', 'S4'}`
(B) `{'S1', 'S2', 'S4'}`
(C) `{'S4'}`
(D) `{'S1', 'S3', 'S4'}`

### Solution
Let us trace the operational semantics of the nested SQL query:

1. **Understanding the query structure (Relational Division via double `NOT EXISTS`):**
   - The query expresses:
     $$\text{"Find all distinct } E_1.\text{sid such that there does NOT exist a course } C \text{ with } \text{dept} = \text{'CS'}$$
     $$\text{for which there does NOT exist an enrollment of that student in } C\text{"}$$
   - In plain English:
     $$\text{"Find all students who are enrolled in ALL courses offered by the 'CS' department."}$$

2. **Determine the target set of 'CS' courses:**
   From the `Courses` table, filter for `dept = 'CS'`:
   - `C1` (`dept = 'CS'`)
   - `C2` (`dept = 'CS'`)
   - `C4` (`dept = 'CS'`)
   The required set of courses is $\{ \text{C1}, \text{C2}, \text{C4} \}$. (Note that `C3` belongs to 'EE' and is ignored).

3. **Evaluate the condition for each student in `Enrolled`:**
   - **Student `S1`:**
     - Enrolled courses for `S1`: $\{ \text{C1}, \text{C2}, \text{C4} \}$.
     - Is `S1` missing any course from $\{ \text{C1}, \text{C2}, \text{C4} \}$?
       - For `C = C1`: `S1` is enrolled $\implies$ inner `NOT EXISTS` is FALSE.
       - For `C = C2`: `S1` is enrolled $\implies$ inner `NOT EXISTS` is FALSE.
       - For `C = C4`: `S1` is enrolled $\implies$ inner `NOT EXISTS` is FALSE.
     - The middle `SELECT` finds no surviving rows (empty set).
     - The outer `NOT EXISTS (empty set)` evaluates to **TRUE**.
     - $\implies \text{'S1'}$ is included in the result.

   - **Student `S2`:**
     - Enrolled courses for `S2`: $\{ \text{C1}, \text{C3} \}$.
     - Missing CS courses: `C2` and `C4`.
     - For `C = C2`: `S2` is not enrolled in `C2`, so inner `NOT EXISTS` is TRUE.
     - `C2` is returned by the middle query, making the middle result set non-empty.
     - The outer `NOT EXISTS (non-empty set)` evaluates to **FALSE**.
     - $\implies \text{'S2'}$ is excluded.

   - **Student `S3`:**
     - Enrolled courses for `S3`: $\{ \text{C1}, \text{C2} \}$.
     - Missing CS course: `C4`.
     - For `C = C4`: inner `NOT EXISTS` is TRUE, middle query returns `C4`.
     - Outer `NOT EXISTS` evaluates to **FALSE**.
     - $\implies \text{'S3'}$ is excluded.

   - **Student `S4`:**
     - Enrolled courses for `S4`: $\{ \text{C1}, \text{C2}, \text{C3}, \text{C4} \}$.
     - `S4` is enrolled in all three CS courses (`C1, C2, C4`) as well as `C3`.
     - None of the CS courses are missing for `S4`.
     - Middle query returns empty set.
     - Outer `NOT EXISTS` evaluates to **TRUE**.
     - $\implies \text{'S4'}$ is included in the result.

4. **Result Set:**
   The output consists of `{'S1', 'S4'}`.

Hence, (A) is the correct option.

## Q11
type: MSQ
marks: 2
subject: os
topic: virtual-memory
answer: A, B, C

Which of the following statements regarding virtual memory management and page replacement algorithms is/are TRUE?

(A) The Least Recently Used (LRU) and Optimal (OPT) page replacement algorithms belong to the class of stack algorithms and therefore can never suffer from Belady's anomaly.
(B) In the Clock (Second Chance) page replacement algorithm, if all resident frames have their reference bits set to 1 when a page fault occurs, the algorithm will clear the reference bits of all frames to 0 and select the frame where the clock hand was initially pointing.
(C) Thrashing occurs when the sum of the working-set sizes of all active processes exceeds the total number of available physical page frames.
(D) In a virtual memory system implementing local page replacement, a process undergoing thrashing can directly degrade the performance of other unrelated processes by stealing their page frames.

### Solution
Let us evaluate each statement:

- **Statement (A) is TRUE:**
  A page replacement algorithm is classified as a *stack algorithm* if the set of pages resident in memory with $n$ frames at any time $t$ is always a strict subset of the pages that would be resident in memory with $n + 1$ frames:
  $$M(t, n) \subseteq M(t, n+1)$$
  Both LRU (which tracks recency of reference) and Optimal (which tracks future references) satisfy this inclusion property. Because every page hit in an $n$-frame system is guaranteed to also be a hit in an $(n+1)$-frame system, stack algorithms can **never suffer from Belady's anomaly**.

- **Statement (B) is TRUE:**
  In the Clock (Second Chance) algorithm:
  - The clock hand inspects candidate pages in circular order.
  - If a page has reference bit $= 0$, it is selected immediately as the victim page.
  - If a page has reference bit $= 1$, the reference bit is reset to $0$, the page is given a second chance, and the hand advances to the next frame.
  - If ALL resident frames currently have their reference bit set to $1$, the clock hand completes a full $360^\circ$ revolution, setting every frame's reference bit to $0$. Upon returning to the frame where it started, it finds that frame with reference bit $= 0$ and selects it for replacement. (In this situation, the algorithm degenerates to standard FIFO).

- **Statement (C) is TRUE:**
  According to Peter Denning's Working Set Model:
  - Let $WSS_i$ denote the working-set size (the number of distinct pages referenced in the most recent time window $\Delta$) of process $P_i$.
  - The total system demand for frames is $D = \sum WSS_i$.
  - If $D > \text{Total Available Physical Frames}$, processes cannot hold their working sets in memory simultaneously. Processes constantly page fault, waiting on disk I/O, CPU utilization plummets, and the system spends more time paging than executing useful work. This condition is the precise definition of **thrashing**.

- **Statement (D) is FALSE:**
  In **local page replacement**, each process is allocated a fixed or dynamically adjusted quota of frames, and when a page fault occurs, the victim page must be chosen exclusively from among that process's own allocated frames. Thus, if a process begins to thrash, it cannot steal frames from other processes; the thrashing is strictly contained within that process and does not spread to others. It is **global page replacement** that allows processes to steal frames from one another, enabling one thrashing process to induce thrashing across the entire system.

Hence, statements A, B, and C are TRUE.

## Q12
type: NAT
marks: 2
subject: toc
topic: turing-machines-undecidability
answer: 4

Consider the following seven decision problems:

- $P_1$: Given a Turing machine $M$ and an input string $w$, does $M$ halt on $w$?
- $P_2$: Given a Context-Free Grammar $G$, is $L(G) = \emptyset$?
- $P_3$: Given a Context-Free Grammar $G$, is $L(G) = \Sigma^*$?
- $P_4$: Given two Deterministic Finite Automata $D_1$ and $D_2$, is $L(D_1) = L(D_2)$?
- $P_5$: Given a Context-Free Grammar $G$, is $G$ ambiguous?
- $P_6$: Given a Pushdown Automaton $M$ and a Deterministic Finite Automaton $D$, is $L(M) \cap L(D) = \emptyset$?
- $P_7$: Given the encoding $\langle M \rangle$ of an arbitrary Turing machine $M$, does $M$ contain at least 10 states?

The total number of DECIDABLE problems among $\{P_1, P_2, P_3, P_4, P_5, P_6, P_7\}$ is ______.

### Solution
Let us systematically evaluate the decidability of each decision problem:

1. **Problem $P_1$ (Halting Problem of Turing Machine):**
   - Determining whether an arbitrary Turing machine $M$ halts on an input string $w$ is the canonical Halting Problem, which is well-known to be **UNDECIDABLE** (recursively enumerable, but not recursive).

2. **Problem $P_2$ (Emptiness of CFG):**
   - Testing whether $L(G) = \emptyset$ for a Context-Free Grammar $G$ is equivalent to checking if the start symbol $S$ is generating (i.e., can derive a terminal string).
   - This can be solved in polynomial time by finding all generating non-terminals via bottom-up marking.
   - Therefore, $P_2$ is **DECIDABLE**.

3. **Problem $P_3$ (Universality / Totality of CFG):**
   - Determining whether $L(G) = \Sigma^*$ for an arbitrary CFG $G$ is **UNDECIDABLE** (co-RE complete).
   - It is proven undecidable by reduction from the Turing Machine valid computation history problem.

4. **Problem $P_4$ (Equivalence of DFAs):**
   - For regular languages recognized by DFAs $D_1$ and $D_2$:
     $$L(D_1) = L(D_2) \iff (L(D_1) \cap \overline{L(D_2)}) \cup (\overline{L(D_1)} \cap L(D_2)) = \emptyset$$
   - Since regular languages are closed under complement, intersection, and union, the symmetric difference can be represented by a DFA with $|Q_1| \times |Q_2|$ states. Testing DFA emptiness requires only a BFS/DFS graph search in $O(|V| + |E|)$ time.
   - Therefore, $P_4$ is **DECIDABLE**.

5. **Problem $P_5$ (Ambiguity of CFG):**
   - Determining whether an arbitrary Context-Free Grammar $G$ is ambiguous is **UNDECIDABLE**.
   - It is proven undecidable by reduction from the Post Correspondence Problem (PCP).

6. **Problem $P_6$ (Emptiness of Intersection of PDA and DFA):**
   - Since $M$ is a PDA (representing a Context-Free Language) and $D$ is a DFA (representing a Regular language), their intersection $L(M) \cap L(D)$ is guaranteed to be a Context-Free Language (by closure of CFL under intersection with regular languages).
   - The product machine of a PDA and a DFA is itself a PDA.
   - Because the emptiness problem for CFLs (PDAs) is decidable (as in $P_2$), testing whether $L(M) \cap L(D) = \emptyset$ is **DECIDABLE**.

7. **Problem $P_7$ (Turing Machine State Count $\ge 10$):**
   - Rice's Theorem applies strictly to semantic properties (properties of the language $L(M)$ recognized by the machine).
   - The number of states in $M$ is a **syntactic property** of the encoding $\langle M \rangle$. An algorithm can simply parse the state set $Q$ from the description $\langle M \rangle$ and count the states in $O(n)$ time.
   - Therefore, $P_7$ is **DECIDABLE**.

**Summary of Decidable Problems:**
- Decidable: $\{ P_2, P_4, P_6, P_7 \}$ (Total = 4 problems).
- Undecidable: $\{ P_1, P_3, P_5 \}$ (Total = 3 problems).

Hence, the answer is 4.

## Q13
type: NAT
marks: 2
subject: os
topic: memory-management
answer: 19

Consider a computing system with a 48-bit virtual address space and a page size of $4\text{ KB}$ ($4096\text{ bytes}$). The system implements a multi-level hierarchical paging scheme where:
- Each page table at every level must occupy EXACTLY one physical frame ($4\text{ KB}$).
- Each Page Table Entry (PTE) at every level is 4 bytes.

A process allocates a single contiguous virtual memory region of size $64\text{ MB}$ starting at a virtual address that is an exact multiple of $64\text{ MB}$.

The MINIMUM total number of page table pages (frames) required to map this process across all levels of the page table hierarchy is ______.

### Solution
Let us analyze the structure of the multi-level page table hierarchy:

1. **Virtual Address breakdown:**
   - Virtual Address space $= 48\text{ bits}$.
   - Page size $= 4\text{ KB} = 2^{12}\text{ bytes} \implies$ Offset $= 12\text{ bits}$.
   - Total bits for Virtual Page Number (VPN) $= 48 - 12 = 36\text{ bits}$.

2. **Capacity of each Page Table page:**
   - Size of one page table page $= 4\text{ KB} = 2^{12}\text{ bytes}$.
   - Size of each PTE $= 4\text{ bytes} = 2^2\text{ bytes}$.
   - Number of PTEs per page table:
     $$\text{PTEs per page} = \frac{2^{12}\text{ bytes}}{2^2\text{ bytes}} = 2^{10} = 1024\text{ entries}$$
   - Therefore, each indexing level can decode up to $\log_2(1024) = 10\text{ bits}$ of the virtual address.

3. **Number of levels in the hierarchy:**
   - Total VPN bits $= 36\text{ bits}$.
   - Since each intermediate level handles 10 bits:
     - Level 4 (Leaf page table): 10 bits
     - Level 3: 10 bits
     - Level 2: 10 bits
     - Level 1 (Root page table): $36 - (3 \times 10) = 6\text{ bits}$ (handles $2^6 = 64$ entries $\le 1024$).
   - A 4-level paging hierarchy is required.

4. **Page Table pages required for the 64 MB process:**
   - Size of process $= 64\text{ MB} = 2^{26}\text{ bytes}$.
   - Number of data pages required:
     $$\text{Pages} = \frac{64\text{ MB}}{4\text{ KB}} = \frac{2^{26}}{2^{12}} = 2^{14} = 16384\text{ pages}$$

   Now trace the page table frames required at each level:
   - **Level 4 (Leaf page tables):**
     - Each Level 4 page table holds $1024 = 2^{10}$ entries, covering $1024 \times 4\text{ KB} = 4\text{ MB}$ of virtual memory.
     - To map $16384$ contiguous pages:
       $$\text{Level-4 page tables} = \frac{16384}{1024} = 16\text{ pages}$$
   - **Level 3 (Points to Level-4 page tables):**
     - There are 16 Level-4 page tables to be referenced.
     - One Level-3 page table can hold up to 1024 pointers (covering $1024 \times 4\text{ MB} = 4\text{ GB}$).
     - Because the process memory is contiguous and aligned to a $64\text{ MB}$ boundary, all 16 entries fall into the same Level-3 table.
     - Level-3 page tables required $= 1\text{ page}$.
   - **Level 2 (Points to Level-3 page tables):**
     - There is 1 Level-3 page table to reference.
     - Level-2 page tables required $= 1\text{ page}$.
   - **Level 1 (Root page table):**
     - The top-level root page table always exists.
     - Level-1 page tables required $= 1\text{ page}$.

5. **Total Page Table pages:**
   $$\text{Total} = \text{Level 1} + \text{Level 2} + \text{Level 3} + \text{Level 4} = 1 + 1 + 1 + 16 = 19\text{ pages}$$

Hence, the answer is 19.

## Q14
type: NAT
marks: 2
subject: dbms
topic: file-organization-indexing
answer: 75

A B+ tree index is constructed on a disk where the block size is $1024\text{ bytes}$. The index parameters are as follows:
- Search key size $= 14\text{ bytes}$
- Block pointer (child pointer) size $= 6\text{ bytes}$

Let $p$ be the maximum order of an internal node in this B+ tree (i.e., the maximum number of child block pointers an internal node can hold).

Let $K_{\max}$ be the maximum number of search keys that an internal node can store, and let $K_{\min}$ be the minimum number of search keys that a non-root internal node must store to satisfy B+ tree occupancy constraints.

The value of $K_{\max} + K_{\min}$ is ______.

### Solution
Let us determine the node capacity and occupancy bounds of internal nodes in the B+ tree:

1. **Maximum order $p$ of an internal node:**
   In an internal node of order $p$, there are:
   - At most $p$ block pointers.
   - At most $p - 1$ search key values.
   The total space occupied must not exceed the disk block size ($1024\text{ bytes}$):
   $$p \times (\text{block pointer size}) + (p - 1) \times (\text{search key size}) \le \text{Block size}$$
   $$p \times 6 + (p - 1) \times 14 \le 1024$$
   $$6p + 14p - 14 \le 1024$$
   $$20p \le 1038$$
   $$p \le \frac{1038}{20} = 51.9$$
   Since the order $p$ must be a whole integer:
   $$p = 51$$
   *(Verification: $51 \times 6 + 50 \times 14 = 306 + 700 = 1006\text{ bytes} \le 1024\text{ bytes}$; if $p = 52$, space $= 52 \times 6 + 51 \times 14 = 1026 > 1024$).*

2. **Maximum number of keys in an internal node ($K_{\max}$):**
   $$K_{\max} = p - 1 = 51 - 1 = 50$$

3. **Minimum number of keys in a non-root internal node ($K_{\min}$):**
   By standard B+ tree structural rules:
   - A non-root internal node must contain at least $\lceil p / 2 \rceil$ block pointers.
   $$\text{Minimum pointers} = \lceil 51 / 2 \rceil = \lceil 25.5 \rceil = 26\text{ pointers}$$
   - The number of keys in an internal node is always equal to $(\text{number of pointers}) - 1$.
   $$K_{\min} = 26 - 1 = 25$$

4. **Calculate $K_{\max} + K_{\min}$:**
   $$K_{\max} + K_{\min} = 50 + 25 = 75$$

Hence, the answer is 75.

## Q15
type: MCQ
marks: 2
subject: toc
topic: context-free-grammars-pda
answer: A

Consider the following context-free grammar $G$ with start symbol $S$ over the alphabet $\Sigma = \{a, b\}$:

$$S \to aSb \mid bSa \mid SS \mid \epsilon$$

and the following four statements regarding $G$:

- $S_1$: The grammar $G$ generates the language $L = \{ w \in \{a, b\}^* \mid |w|_a = |w|_b \}$.
- $S_2$: The grammar $G$ is ambiguous.
- $S_3$: The language $L(G)$ is inherently ambiguous.
- $S_4$: The language $L(G)$ can be accepted by a Deterministic Pushdown Automaton (DPDA) when an endmarker symbol is appended to the input strings.

Which of the above statements are TRUE?

(A) $S_1, S_2$, and $S_4$ only
(B) $S_1$ and $S_2$ only
(C) $S_1, S_2$, and $S_3$ only
(D) $S_2, S_3$, and $S_4$ only

### Solution
Let us evaluate each statement individually:

1. **Statement $S_1$ is TRUE:**
   - Every production rule in $G$ adds an equal number of $a$'s and $b$'s:
     - $S \to aSb$ introduces one $a$ and one $b$.
     - $S \to bSa$ introduces one $b$ and one $a$.
     - $S \to SS$ concatenates two strings each with equal numbers of $a$'s and $b$'s.
     - $S \to \epsilon$ yields the empty string with $|w|_a = |w|_b = 0$.
   - Thus, every derived string has $|w|_a = |w|_b$.
   - Conversely, any string with $|w|_a = |w|_b$ can be decomposed into minimal balanced components. Thus, $L(G) = \{ w \in \{a, b\}^* \mid |w|_a = |w|_b \}$.

2. **Statement $S_2$ is TRUE:**
   - A grammar is ambiguous if there exists at least one string in its language that has two or more distinct leftmost derivations (or distinct parse trees).
   - Consider the empty string $\epsilon$:
     - Derivation 1: $S \implies \epsilon$
     - Derivation 2: $S \implies SS \implies \epsilon S \implies \epsilon \epsilon = \epsilon$
   - Or consider the string $w = abab$:
     - Derivation 1: $S \implies SS \implies aSb S \implies ab S \implies ab aSb \implies abab$
     - Derivation 2: $S \implies aSb \implies a SS b \implies a (bSa) S b \dots$
   - Since multiple parse trees exist for strings in $L(G)$, the grammar $G$ is ambiguous.

3. **Statement $S_3$ is FALSE:**
   - A language is *inherently ambiguous* if **every** grammar generating it is ambiguous.
   - The language $L = \{ w \in \{a, b\}^* \mid |w|_a = |w|_b \}$ has well-known unambiguous context-free grammars, such as:
     $$S \to a B \mid b A \mid \epsilon$$
     $$A \to a S \mid b A A$$
     $$B \to b S \mid a B B$$
   - In this grammar, every string with $|w|_a = |w|_b$ has a unique leftmost derivation.
   - Therefore, $L(G)$ is NOT inherently ambiguous.

4. **Statement $S_4$ is TRUE:**
   - Consider the marked language $L\$ = \{ w\$ \mid w \in \{a, b\}^*, \; |w|_a = |w|_b \}$.
   - A DPDA can be constructed that maintains the running count difference $(|w|_a - |w|_b)$ on the stack:
     - Push $A$ onto the stack when reading excess $a$'s; pop $A$ when reading $b$.
     - Push $B$ onto the stack when reading excess $b$'s; pop $B$ when reading $a$.
     - When the endmarker $\$$ is read, the DPDA transitions to an accepting state if and only if the top-of-stack symbol is the initial stack bottom marker $Z_0$.
   - Every transition is completely deterministic. Thus, $L\$$ is a Deterministic Context-Free Language (DCFL).

Therefore, statements $S_1, S_2,$ and $S_4$ are TRUE.

Hence, (A) is the correct option.
