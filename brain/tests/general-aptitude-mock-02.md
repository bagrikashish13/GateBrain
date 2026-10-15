---
title: General Aptitude · Mock 02
duration: 15
created: 2026-10-15
description: 5 GATE-level General Aptitude questions (MCQ, MSQ, NAT) covering Verbal, Quantitative, Analytical, and Spatial Aptitude.
---

## Q1
type: MCQ
marks: 1
subject: general-aptitude
topic: verbal-ability
answer: A

Complete the sentence by selecting the grammatically correct pair of verbs:

"The team of researchers, along with the project supervisor, ______ submitted the final report, but neither the methods used nor the conclusion ______ by the external review committee."

(A) has, was accepted
(B) have, were accepted
(C) has, were accepted
(D) have, was accepted

### Solution
1. **First Blank ("has" vs "have"):**
   The grammatical subject of the first clause is "The team" (a singular collective noun).
   The phrase "along with the project supervisor" is a parenthetical prepositional phrase and does not alter the grammatical number of the subject.
   Therefore, the singular verb **has** must be used.

2. **Second Blank ("was accepted" vs "were accepted"):**
   In correlative constructions like "neither... nor...", the verb agrees with the subject closest to it (the rule of proximity).
   Here, the connected subjects are "the methods used" (plural) and "the conclusion" (singular).
   Since "the conclusion" is adjacent to the verb, the singular verb **was accepted** must be used.

Combining both rules gives "has, was accepted" (Option A).
- (B) incorrectly uses plural "have" for "the team" and plural "were accepted" violating the proximity rule.
- (C) incorrectly uses plural "were accepted" for the singular noun "conclusion".
- (D) incorrectly uses plural "have" for the subject "the team".

## Q2
type: MCQ
marks: 1
subject: general-aptitude
topic: spatial-aptitude
answer: A

An asymmetric planar figure in the Cartesian $xy$-plane is first reflected across the line $y = x$, and the resulting image is then rotated by $90^\circ$ clockwise about the origin $(0, 0)$.

This combination of two transformations is geometrically equivalent to which of the following single transformations of the original figure?

(A) Reflection across the $x$-axis
(B) Reflection across the $y$-axis
(C) Rotation of $180^\circ$ about the origin
(D) Reflection across the line $y = -x$

### Solution
Let $(x, y)$ denote the coordinates of an arbitrary point on the original planar figure:

1. **Reflection across the line $y = x$:**
   Swapping the coordinates maps $(x, y)$ to:
   $$(x', y') = (y, x)$$

2. **Clockwise rotation by $90^\circ$ about $(0, 0)$:**
   A clockwise rotation by $90^\circ$ maps any point $(u, v)$ to $(v, -u)$.
   Applying this to $(u, v) = (x', y') = (y, x)$:
   $$(x'', y'') = (x, -y)$$

3. **Comparison with the original point $(x, y)$:**
   The composite transformation maps:
   $$(x, y) \to (x, -y)$$
   A transformation that keeps the $x$-coordinate unchanged and negates the $y$-coordinate is precisely a **reflection across the $x$-axis** ($y = 0$).

Evaluating other options:
- (B) Reflection across the $y$-axis maps $(x, y) \to (-x, y)$.
- (C) Rotation of $180^\circ$ maps $(x, y) \to (-x, -y)$.
- (D) Reflection across the line $y = -x$ maps $(x, y) \to (-y, -x)$.

Therefore, Option A is the correct answer.

## Q3
type: NAT
marks: 2
subject: general-aptitude
topic: quantitative-aptitude
answer: 12

Three workers $A$, $B$, and $C$ can complete a piece of work individually in $20\text{ days}$, $30\text{ days}$, and $60\text{ days}$, respectively. All three begin working together on the project. However, worker $B$ leaves $3\text{ days}$ before the completion of the work, and worker $A$ leaves $2\text{ days}$ before the completion of the work. Worker $C$ works continuously until the entire work is completed.

The total time taken (in days) to complete the entire work is ______.

### Solution
Let the total work be the least common multiple ($\text{LCM}$) of the individual times:
$$\text{Total Work} = \text{LCM}(20, 30, 60) = 60\text{ units}$$

The daily work rates (efficiency) of each worker:
- Rate of $A = \frac{60}{20} = 3\text{ units/day}$
- Rate of $B = \frac{60}{30} = 2\text{ units/day}$
- Rate of $C = \frac{60}{60} = 1\text{ unit/day}$

Let $T$ be the total number of days taken to complete the entire work:
- Worker $C$ works for the entire duration: $T$ days.
- Worker $B$ leaves 3 days before completion: $(T - 3)$ days.
- Worker $A$ leaves 2 days before completion: $(T - 2)$ days.

The sum of work done by all three workers equals the total work:
$$3(T - 2) + 2(T - 3) + 1(T) = 60$$

Expanding and simplifying:
$$3T - 6 + 2T - 6 + T = 60$$
$$6T - 12 = 60$$
$$6T = 72 \implies T = 12\text{ days}$$

**Alternative verification by timeline:**
- First 9 days: All three ($A, B, C$) work together $\implies 9 \times (3 + 2 + 1) = 9 \times 6 = 54\text{ units}$.
- Day 10 (3rd day before end): $B$ has left, so only $A$ and $C$ work $\implies 1 \times (3 + 1) = 4\text{ units}$.
- Days 11 and 12 (last 2 days): $A$ also leaves, so only $C$ works $\implies 2 \times 1 = 2\text{ units}$.
- Total work done $= 54 + 4 + 2 = 60\text{ units}$.

## Q4
type: MSQ
marks: 2
subject: general-aptitude
topic: analytical-aptitude
answer: A, B, C

Five persons $P, Q, R, S,$ and $T$ are standing in a single row facing North, occupying positions 1 to 5 from left to right. The following conditions are given:
1. $P$ is standing somewhere to the left of $Q$.
2. Exactly two persons are standing between $R$ and $S$.
3. $T$ is not standing at either of the extreme ends.
4. $S$ is standing to the immediate right of $P$.
5. $Q$ is standing at one of the extreme ends.

Which of the following statements is/are necessarily TRUE?

(A) $R$ is standing at the extreme left end
(B) $P$ is standing in the middle of the row
(C) $T$ is standing to the immediate left of $P$
(D) Exactly two persons are standing between $P$ and $Q$

### Solution
Let the 5 positions from left to right be $1, 2, 3, 4, 5$.

1. **Position of $Q$:**
   From Condition 5, $Q$ must be at position 1 or 5.
   From Condition 1, $P$ is to the left of $Q$ ($pos(P) < pos(Q)$).
   Since $pos(P) \ge 1$, $Q$ cannot be at position 1.
   Therefore, $Q$ must be at position 5:
   $$pos(Q) = 5$$

2. **Positions of $P$ and $S$:**
   From Condition 4, $S$ is immediately to the right of $P$:
   $$pos(S) = pos(P) + 1$$
   Thus, $(P, S)$ occupy adjacent positions $(1, 2)$, $(2, 3)$, or $(3, 4)$. (They cannot occupy $(4, 5)$ since $Q$ is at 5).

3. **Positions of $R$ and $S$:**
   From Condition 2, exactly two persons are between $R$ and $S$:
   $$|pos(R) - pos(S)| = 3$$
   With $pos(S) \in \{2, 3, 4\}$:
   - If $pos(S) = 2 \implies pos(R) = 2 + 3 = 5$, but position 5 is occupied by $Q$. (Not possible)
   - If $pos(S) = 3 \implies pos(R)$ would need to be $0$ or $6$, which are outside the row. (Not possible)
   - If $pos(S) = 4 \implies pos(R) = 4 - 3 = 1$. (Valid!)

4. **Deducing the full arrangement:**
   - With $pos(S) = 4$, Condition 4 gives $pos(P) = 3$.
   - $pos(R) = 1$.
   - The only remaining position is 2, so $pos(T) = 2$.
   - Checking Condition 3: $T$ is at position 2, which is not an extreme end (satisfies the condition).

The unique arrangement from left to right (positions 1 to 5) is:
$$\text{Position 1: } R, \quad \text{Position 2: } T, \quad \text{Position 3: } P, \quad \text{Position 4: } S, \quad \text{Position 5: } Q$$

Evaluating the options:
- (A) $R$ is standing at position 1 (extreme left end). $\implies$ **TRUE**.
- (B) $P$ is standing at position 3 (the middle of the 5 positions). $\implies$ **TRUE**.
- (C) $T$ is at position 2, which is immediately to the left of $P$ at position 3. $\implies$ **TRUE**.
- (D) Between $P$ (position 3) and $Q$ (position 5), only $S$ (position 4) is standing, which is exactly ONE person, not two. $\implies$ **FALSE**.

Hence, the correct options are A, B, and C.

## Q5
type: NAT
marks: 2
subject: general-aptitude
topic: quantitative-aptitude
answer: 220

Four-digit positive integers are to be formed using the digits from the set $\{0, 1, 2, 3, 4, 5, 6\}$ such that each integer is divisible by $5$ and no digit is repeated.

The total number of such four-digit integers that can be formed is ______.

### Solution
Let the 4-digit number be represented as $d_1 d_2 d_3 d_4$, where $d_1, d_2, d_3, d_4 \in \{0, 1, 2, 3, 4, 5, 6\}$ are distinct, and $d_1 \neq 0$.

For a number to be divisible by 5, its units digit ($d_4$) must be either $0$ or $5$.

We analyze the two disjoint cases based on the choice of $d_4$:

**Case 1: Units digit $d_4 = 0$**
- $d_4$ is fixed as $0$ (1 choice).
- Digits available for $d_1, d_2, d_3$ are $\{1, 2, 3, 4, 5, 6\}$ (6 non-zero digits).
- The thousands digit $d_1$ can be any of the 6 digits: 6 choices.
- The hundreds digit $d_2$ can be any of the remaining 5 digits: 5 choices.
- The tens digit $d_3$ can be any of the remaining 4 digits: 4 choices.
- Total numbers for Case 1:
  $$N_1 = 6 \times 5 \times 4 \times 1 = 120$$

**Case 2: Units digit $d_4 = 5$**
- $d_4$ is fixed as $5$ (1 choice).
- Digits available are $\{0, 1, 2, 3, 4, 6\}$ (6 digits, which includes $0$).
- The thousands digit $d_1$ cannot be $0$, so $d_1 \in \{1, 2, 3, 4, 6\}$: 5 choices.
- For the hundreds digit $d_2$, $0$ is now allowed, along with any remaining non-zero digits. With 2 digits already chosen ($d_4$ and $d_1$), $7 - 2 = 5$ digits remain available: 5 choices.
- For the tens digit $d_3$, $7 - 3 = 4$ digits remain available: 4 choices.
- Total numbers for Case 2:
  $$N_2 = 5 \times 5 \times 4 \times 1 = 100$$

**Total valid four-digit integers:**
$$\text{Total} = N_1 + N_2 = 120 + 100 = 220$$
