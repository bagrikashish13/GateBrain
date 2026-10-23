---
title: General Aptitude · Mock 04
duration: 25
created: 2026-10-23
description: GATE CS General Aptitude mock covering Verbal, Quantitative (Template 1 Time & Work), Analytical, and Spatial Aptitude.
---

## Q1
type: MCQ
marks: 1
subject: general-aptitude
answer: B

Choose the grammatically correct phrase to complete the sentence:

"The updated database query engine is designed not only to reduce cache misses ______."

(A) but also improving query execution throughput
(B) but also to improve query execution throughput
(C) and also it improves query execution throughput
(D) but to improve query execution throughput as well

### Solution
Let us analyze the grammatical principle governing correlative conjunctions:

1. **Parallelism with Correlative Conjunctions ("Not only ... but also ..."):**
   - Correlative conjunctions must connect grammatically parallel elements (elements sharing the identical grammatical form).
   - In the given sentence:
     *"...is designed not only [to reduce cache misses]..."*
   - The element immediately following *"not only"* is a full infinitive phrase: **to reduce + noun phrase**.
   - Therefore, the element governed by *"but also"* must maintain exact parallel structure with an infinitive phrase: **to improve + noun phrase**.

2. **Evaluating the Options:**
   - (A) Pairs an infinitive (*"to reduce"*) with a gerund (*"improving"*), violating parallelism.
   - (B) **but also to improve query execution throughput** perfectly mirrors the infinitive structure (*to reduce ... to improve*).
   - (C) Replaces *"but also"* with *"and also it improves"*, which breaks the correlative pair and introduces an unneeded subject clause.
   - (D) Omits *"also"* in favor of a redundant *"as well"*, which is non-standard and unparallel.

Hence, (B) is the correct option.

## Q2
type: MCQ
marks: 1
subject: general-aptitude
answer: A

Choose the correct pair of words that best fits the blanks in the sentence below:

"The distributed computing cluster partitions data into ______ chunks across nodes, while the operations team maintained a ______ silence regarding the root cause of the network outage."

(A) discrete, discreet
(B) discreet, discrete
(C) discrete, discrete
(D) discreet, discreet

### Solution
Let us distinguish the homophones in context:

1. **Discrete (spelled with separate 'e's):**
   - Adjective meaning individually separate, distinct, or unconnected.
   - Fits the technical context of data partitioning: *"discrete chunks across nodes"*.

2. **Discreet (spelled with 'ee' together):**
   - Adjective meaning careful, prudent, circumspect, or intentionally keeping silent to avoid embarrassment or disclosure.
   - Fits the context of maintaining prudent silence: *"a discreet silence regarding the root cause"*.

Therefore, the correct sequence is **discrete, discreet**.

Evaluating the options:
- (A) **discrete, discreet** is correct.
- (B) Swaps the two definitions.
- (C) Uses *discrete* for both blanks.
- (D) Uses *discreet* for both blanks.

Hence, (A) is the correct option.

## Q3
type: NAT
marks: 1
subject: general-aptitude
answer: 10

Two automated worker bots, $P$ and $Q$, working independently, can complete a batch code verification task in $15\text{ minutes}$ and $30\text{ minutes}$, respectively.

If both bots work together simultaneously at their respective constant processing speeds, the total time required to complete the verification task is ______ minutes.

### Solution
Let us apply the LCM unit (chairs) model:

1. **Define Total Work as $\text{LCM}(\text{times})$:**
   $$\text{Total Work} = \text{LCM}(15, 30) = 30\text{ units}$$

2. **Compute Individual Processing Rates:**
   - Rate of Bot $P$:
     $$R_P = \frac{30\text{ units}}{15\text{ min}} = 2\text{ units/min}$$
   - Rate of Bot $Q$:
     $$R_Q = \frac{30\text{ units}}{30\text{ min}} = 1\text{ unit/min}$$

3. **Combined Processing Rate:**
   $$R_{\text{combined}} = R_P + R_Q = 2 + 1 = 3\text{ units/min}$$

4. **Time Taken Together:**
   $$T = \frac{\text{Total Work}}{R_{\text{combined}}} = \frac{30\text{ units}}{3\text{ units/min}} = 10\text{ minutes}$$

Hence, the answer is 10.

## Q4
type: MCQ
marks: 1
subject: general-aptitude
answer: A

A transparent square acrylic sheet has its vertices at $(0, 0), (2, 0), (2, 2),$ and $(0, 2)$ in the Cartesian plane. A small dark dot is printed at the coordinate $(0.5, 1.5)$.

The sheet undergoes two successive planar transformations:
1. It is first reflected across the vertical line $x = 1$.
2. The resulting sheet is then rotated clockwise by $180^\circ$ about its geometric center $(1, 1)$.

What is the coordinate of the dark dot after both transformations?

(A) $(0.5, 0.5)$
(B) $(1.5, 0.5)$
(C) $(0.5, 1.5)$
(D) $(1.5, 1.5)$

### Solution
Let us trace the coordinates of the dot $(x_0, y_0) = (0.5, 1.5)$ through each geometric transformation:

1. **Transformation 1: Reflection across the vertical line $x = 1$:**
   - In a reflection across the line $x = c$, the $y$-coordinate remains unchanged ($y' = y$), while the $x$-coordinate transforms according to:
     $$x' - c = -(x - c) \implies x' = 2c - x$$
   - For $c = 1$ and $x = 0.5$:
     $$x' = 2(1) - 0.5 = 1.5, \quad y' = 1.5$$
   - Thus, after the first reflection, the dot is at $(1.5, 1.5)$.

2. **Transformation 2: Rotation by $180^\circ$ about the center $(1, 1)$:**
   - A rotation by $180^\circ$ (clockwise or counter-clockwise) about an arbitrary center $(x_c, y_c)$ maps any point $(x', y')$ to:
     $$x'' = 2x_c - x', \quad y'' = 2y_c - y'$$
   - Substituting $(x_c, y_c) = (1, 1)$ and $(x', y') = (1.5, 1.5)$:
     $$x'' = 2(1) - 1.5 = 0.5$$
     $$y'' = 2(1) - 1.5 = 0.5$$

Therefore, the final coordinate of the dot is **$(0.5, 0.5)$**.

Hence, (A) is the correct option.

## Q5
type: MCQ
marks: 1
subject: general-aptitude
answer: A

Read the three statements and the three conclusions given below:

**Statements:**
1. All compilers are program translators.
2. Some program translators are bytecode interpreters.
3. No bytecode interpreter is a hardware component.

**Conclusions:**
- I. Some compilers are bytecode interpreters.
- II. Some program translators are not hardware components.
- III. No compiler is a hardware component.

Which of the conclusions logically follow(s) from the given statements?

(A) Only conclusion II follows
(B) Only conclusions I and II follow
(C) Only conclusions II and III follow
(D) None of the conclusions follow

### Solution
Let us represent the categories using set theory:
- $C$: set of compilers
- $T$: set of program translators
- $I$: set of bytecode interpreters
- $H$: set of hardware components

Given premises:
1. $C \subseteq T$ (All compilers are translators).
2. $T \cap I \ne \emptyset$ (There exists at least one element in both $T$ and $I$).
3. $I \cap H = \emptyset$ (Interpreters and hardware components are completely disjoint).

Let us evaluate each conclusion:

- **Conclusion I: Some compilers are bytecode interpreters ($C \cap I \ne \emptyset$).**
  - While both $C$ and $I$ are subsets of $T$, the premises do not enforce any overlap between $C$ and $I$.
  - It is completely possible that $C \cap I = \emptyset$.
  - Conclusion I **does not necessarily follow**.

- **Conclusion II: Some program translators are not hardware components ($T \setminus H \ne \emptyset$).**
  - By premise 2, there exists an element $x \in T \cap I$.
  - By premise 3, since $x \in I$, it follows that $x \notin H$.
  - Since $x \in T$ and $x \notin H$, it follows that $x \in T \setminus H$.
  - Thus, there definitely exist program translators that are not hardware components.
  - Conclusion II **definitely follows**.

- **Conclusion III: No compiler is a hardware component ($C \cap H = \emptyset$).**
  - The premise states that $I$ and $H$ are disjoint, but it specifies no relationship between $T \setminus I$ and $H$.
  - Since $C$ could lie within $T \setminus I$, elements of $C$ could potentially overlap with $H$.
  - Conclusion III **does not necessarily follow**.

Therefore, only conclusion II follows.

Hence, (A) is the correct option.

## Q6
type: MCQ
marks: 2
subject: general-aptitude
answer: C

Read the passage below and answer the question that follows:

"In mission-critical software systems, empirical testing—regardless of test suite coverage—can only reveal the presence of bugs, never prove their complete absence. Formal mathematical verification techniques (such as model checking and interactive theorem proving) attempt to eliminate this vulnerability by rigorously verifying that every reachable state of a software model adheres to formal safety specifications. However, full formal verification faces severe scalability constraints: the exponential explosion of reachable states renders exhaustive verification computationally intractable for complex multi-threaded software. Consequently, software safety standards increasingly recommend bounded model checking combined with targeted fuzz testing. While proponents emphasize that bounded verification provides rigorous mathematical proofs within a finite execution depth, safety auditors point out that catastrophic concurrency deadlocks and race conditions frequently occur only after millions of operational cycles, far beyond the tractable verification bound."

Which one of the following statements is the most valid INFERENCE from the passage?

(A) Bounded model checking guarantees the total elimination of race conditions in multi-threaded software across all operating horizons.
(B) Empirical software testing provides stronger mathematical guarantees of correctness than formal model checking.
(C) Verifying that software satisfies safety specifications within a finite execution depth does not ensure that the software is immune to critical failures during extended execution.
(D) The state-space explosion problem in multi-threaded software has been completely resolved by integrating fuzz testing with model checking.

### Solution
Let us evaluate each candidate inference against the passage:

- **(C) is the most valid inference:**
  The passage explicitly notes that bounded verification provides mathematical guarantees only *"within a finite execution depth"*, while safety auditors caution that catastrophic concurrency deadlocks and race conditions *"frequently occur only after millions of operational cycles, far beyond the tractable verification bound."* This directly implies that proving safety within a finite depth does not guarantee immunity from critical failures during longer, real-world execution runs.

- **(A) contradicts the passage:**
  The passage explicitly warns that race conditions and deadlocks can occur beyond the finite verification bound.

- **(B) contradicts the passage:**
  The passage opens by stating that empirical testing *"can only reveal the presence of bugs, never prove their complete absence"*, contrasting it with the mathematical proofs of formal verification.

- **(D) is an unsupported exaggeration:**
  The passage notes that bounded model checking and fuzz testing are combined as a practical compromise, not that they have *"completely resolved"* the fundamental state-space explosion problem.

Hence, (C) is the correct option.

## Q7
type: NAT
marks: 2
subject: general-aptitude
answer: 10

Three software engineers, $A, B,$ and $C$, working independently at their respective constant speeds, can complete a microservice refactoring project in $18\text{ days}$, $24\text{ days}$, and $36\text{ days}$, respectively.

All three engineers start working together on the project on Day 1. However:
- Engineer $A$ leaves the project $3\text{ days}$ before the entire project is completed.
- Engineer $B$ leaves the project $2\text{ days}$ before the entire project is completed.
- Engineer $C$ works continuously from the beginning until the project is completely finished.

The total number of days taken to complete the entire project from the start is ______ days.

### Solution
Let us model the project using the LCM chairs / units model:

1. **Determine Total Work:**
   $$\text{Total Work} = \text{LCM}(18, 24, 36) = 72\text{ units}$$

2. **Calculate Daily Rates (Efficiency):**
   - Rate of $A$:
     $$R_A = \frac{72}{18} = 4\text{ units/day}$$
   - Rate of $B$:
     $$R_B = \frac{72}{24} = 3\text{ units/day}$$
   - Rate of $C$:
     $$R_C = \frac{72}{36} = 2\text{ units/day}$$

3. **Formulate Total Work over the Entire Duration:**
   Let the total time taken to complete the project be $T$ days.
   - Engineer $C$ worked for all $T$ days.
   - Engineer $A$ worked for $T - 3$ days.
   - Engineer $B$ worked for $T - 2$ days.

   The sum of work completed by all three engineers equals the total project work:
   $$R_A(T - 3) + R_B(T - 2) + R_C(T) = 72$$
   $$4(T - 3) + 3(T - 2) + 2(T) = 72$$
   $$4T - 12 + 3T - 6 + 2T = 72$$
   $$9T - 18 = 72$$
   $$9T = 90 \implies T = 10\text{ days}$$

4. **Verification by Stages:**
   - **Days 1 to 7 (First 7 days):** All three ($A, B, C$) work together.
     $$\text{Work} = 7 \times (4 + 3 + 2) = 7 \times 9 = 63\text{ units}$$
   - **Day 8 (1 day):** $A$ has left; $B$ and $C$ work together.
     $$\text{Work} = 1 \times (3 + 2) = 5\text{ units}$$
     $$\text{Cumulative Work} = 63 + 5 = 68\text{ units}$$
   - **Days 9 to 10 (Last 2 days):** Both $A$ and $B$ have left; only $C$ works.
     $$\text{Work} = 2 \times 2 = 4\text{ units}$$
     $$\text{Total Cumulative Work} = 68 + 4 = 72\text{ units}$$
   - Matches the total work of $72\text{ units}$ exactly.

Hence, the answer is 10.

## Q8
type: MSQ
marks: 2
subject: general-aptitude
answer: A, B, C

Six server racks—$R_1, R_2, R_3, R_4, R_5,$ and $R_6$—are installed in a single linear row at positions 1 to 6 from left to right.

The installation satisfies the following conditions:
1. Rack $R_3$ is located at position 6 (extreme right).
2. Rack $R_1$ is located at an odd-numbered position.
3. Rack $R_4$ is located immediately to the right of Rack $R_2$ (i.e., $pos(R_4) = pos(R_2) + 1$).
4. Exactly two racks are located between Rack $R_5$ and Rack $R_6$.
5. Rack $R_5$ is located to the left of Rack $R_6$ (i.e., $pos(R_5) < pos(R_6)$).

Which of the following statements is/are necessarily TRUE?

(A) Rack $R_2$ is placed immediately between Rack $R_5$ and Rack $R_4$
(B) Rack $R_4$ is placed immediately to the left of Rack $R_6$
(C) The position number of Rack $R_6$ is strictly greater than that of Rack $R_2$
(D) Rack $R_1$ is installed at position 3

### Solution
Let us systematically determine all valid rack arrangements across positions 1 to 6:

1. **Initial Constraints:**
   - From Condition 1: $pos(R_3) = 6$.
   - Available positions for the remaining five racks $\{R_1, R_2, R_4, R_5, R_6\}$ are $\{1, 2, 3, 4, 5\}$.

2. **Analyzing the Gap between $R_5$ and $R_6$:**
   - Conditions 4 and 5 require exactly two racks between $R_5$ and $R_6$, with $R_5$ to the left of $R_6$:
     $$pos(R_6) - pos(R_5) = 3$$
   - Since position 6 is occupied by $R_3$, the maximum available position is 5.
   - Thus, there are only two possible assignments for the pair $(pos(R_5), pos(R_6))$:
     - **Case I:** $pos(R_5) = 2$ and $pos(R_6) = 5$.
     - **Case II:** $pos(R_5) = 1$ and $pos(R_6) = 4$.

3. **Evaluating Case I ($pos(R_5) = 2, pos(R_6) = 5$):**
   - The remaining positions to fill are $\{1, 3, 4\}$.
   - Condition 3 requires $R_2$ and $R_4$ to be adjacent consecutive positions: $pos(R_4) = pos(R_2) + 1$.
   - In $\{1, 3, 4\}$, the only adjacent consecutive positions are $3$ and $4$:
     $$pos(R_2) = 3, \quad pos(R_4) = 4$$
   - The remaining position 1 must be occupied by $R_1$:
     $$pos(R_1) = 1$$
   - Condition 2 ($R_1$ at an odd position) is satisfied ($1$ is odd).
   - **Valid Arrangement 1:**
     $$\text{Pos 1: } R_1, \quad \text{Pos 2: } R_5, \quad \text{Pos 3: } R_2, \quad \text{Pos 4: } R_4, \quad \text{Pos 5: } R_6, \quad \text{Pos 6: } R_3$$

4. **Evaluating Case II ($pos(R_5) = 1, pos(R_6) = 4$):**
   - The remaining positions to fill are $\{2, 3, 5\}$.
   - Condition 3 requires $pos(R_4) = pos(R_2) + 1$.
   - In $\{2, 3, 5\}$, the only adjacent consecutive positions are $2$ and $3$:
     $$pos(R_2) = 2, \quad pos(R_4) = 3$$
   - The remaining position 5 must be occupied by $R_1$:
     $$pos(R_1) = 5$$
   - Condition 2 ($R_1$ at an odd position) is satisfied ($5$ is odd).
   - **Valid Arrangement 2:**
     $$\text{Pos 1: } R_5, \quad \text{Pos 2: } R_2, \quad \text{Pos 3: } R_4, \quad \text{Pos 4: } R_6, \quad \text{Pos 5: } R_1, \quad \text{Pos 6: } R_3$$

5. **Testing the Statements Across Both Valid Arrangements:**
   - **(A) Rack $R_2$ is placed immediately between Rack $R_5$ and Rack $R_4$:**
     - In Arrangement 1: $pos(R_5) = 2, pos(R_2) = 3, pos(R_4) = 4 \implies R_2$ is immediately between $R_5$ and $R_4$.
     - In Arrangement 2: $pos(R_5) = 1, pos(R_2) = 2, pos(R_4) = 3 \implies R_2$ is immediately between $R_5$ and $R_4$.
     - Statement A is **necessarily TRUE**.
   - **(B) Rack $R_4$ is placed immediately to the left of Rack $R_6$ ($pos(R_6) = pos(R_4) + 1$):**
     - In Arrangement 1: $pos(R_4) = 4, pos(R_6) = 5$.
     - In Arrangement 2: $pos(R_4) = 3, pos(R_6) = 4$.
     - In both arrangements, $R_4$ is immediately to the left of $R_6$.
     - Statement B is **necessarily TRUE**.
   - **(C) The position number of Rack $R_6$ is strictly greater than that of Rack $R_2$:**
     - In Arrangement 1: $pos(R_6) = 5 > pos(R_2) = 3$.
     - In Arrangement 2: $pos(R_6) = 4 > pos(R_2) = 2$.
     - Statement C is **necessarily TRUE**.
   - **(D) Rack $R_1$ is installed at position 3:**
     - In Arrangement 1, $R_1$ is at position 1. In Arrangement 2, $R_1$ is at position 5. $R_1$ is never at position 3.
     - Statement D is **FALSE**.

Hence, statements A, B, and C are necessarily TRUE.

## Q9
type: NAT
marks: 2
subject: general-aptitude
answer: 10.40 to 10.60

A chemical processing reservoir is equipped with two inlet pipes, $X$ and $Y$, and one bottom drainage pipe, $Z$.
- Pipe $X$ alone can fill the empty reservoir in $10\text{ hours}$.
- Pipe $Y$ alone can fill the empty reservoir in $15\text{ hours}$.
- Drainage pipe $Z$ alone can empty the completely full reservoir in $20\text{ hours}$.

The reservoir is filled from empty according to the following schedule:
1. At 6:00 AM, Pipes $X$ and $Y$ are opened simultaneously, while drainage pipe $Z$ remains closed.
2. At 8:00 AM, drainage pipe $Z$ is accidentally opened and operates together with Pipes $X$ and $Y$ for the next $2\text{ hours}$.
3. At 10:00 AM, an operator detects the drainage, shuts off pipe $Z$, and simultaneously shuts off pipe $X$, leaving **only Pipe $Y$** open to fill the remaining volume of the reservoir.

The total time taken to fill the reservoir completely from the initial 6:00 AM start is ______ hours.

### Solution
Let us model the reservoir using the LCM unit (capacity) method:

1. **Calculate Total Capacity:**
   $$\text{Capacity} = \text{LCM}(10, 15, 20) = 60\text{ units}$$

2. **Calculate Hourly Rates:**
   - Inlet Pipe $X$:
     $$R_X = +\frac{60}{10} = +6\text{ units/hour}$$
   - Inlet Pipe $Y$:
     $$R_Y = +\frac{60}{15} = +4\text{ units/hour}$$
   - Drainage Pipe $Z$:
     $$R_Z = -\frac{60}{20} = -3\text{ units/hour}$$

3. **Trace Volume Stage by Stage:**
   - **Stage 1 (6:00 AM to 8:00 AM, Duration = 2 hours):**
     - Active: $X$ and $Y$.
     - Combined rate: $R_1 = R_X + R_Y = 6 + 4 = 10\text{ units/hour}$.
     - Volume filled:
       $$V_1 = 2\text{ hours} \times 10\text{ units/hour} = 20\text{ units}$$

   - **Stage 2 (8:00 AM to 10:00 AM, Duration = 2 hours):**
     - Active: $X, Y,$ and $Z$.
     - Combined rate: $R_2 = R_X + R_Y + R_Z = 6 + 4 - 3 = 7\text{ units/hour}$.
     - Volume filled:
       $$V_2 = 2\text{ hours} \times 7\text{ units/hour} = 14\text{ units}$$
     - Cumulative volume filled by 10:00 AM:
       $$V_{\text{cumulative}} = V_1 + V_2 = 20 + 14 = 34\text{ units}$$

   - **Stage 3 (From 10:00 AM until reservoir is full):**
     - Remaining volume needed:
       $$V_{\text{remaining}} = 60 - 34 = 26\text{ units}$$
     - Active: Only Pipe $Y$ operates.
     - Rate: $R_Y = 4\text{ units/hour}$.
     - Time required for Stage 3:
       $$t_3 = \frac{V_{\text{remaining}}}{R_Y} = \frac{26\text{ units}}{4\text{ units/hour}} = 6.5\text{ hours}$$

4. **Compute Total Elapsed Time:**
   $$t_{\text{total}} = t_1 + t_2 + t_3 = 2\text{ hours} + 2\text{ hours} + 6.5\text{ hours} = 10.5\text{ hours}$$

Hence, the answer is 10.5 (accepted range: 10.40 to 10.60).

## Q10
type: MCQ
marks: 2
subject: general-aptitude
answer: A

A solid wooden cube of edge length $6\text{ cm}$ has each of its 8 corner vertices truncated (sliced off) by a flat planar cut that passes through the exact midpoints of the three edges meeting at that vertex.

What are the total number of faces ($F$) and the total number of edges ($E$) of the resulting truncated polyhedron?

(A) $F = 14, \; E = 24$
(B) $F = 14, \; E = 36$
(C) $F = 12, \; E = 24$
(D) $F = 16, \; E = 32$

### Solution
Let us analyze the geometric transformation of the cube under midpoint corner truncations:

1. **Initial Properties of the Cube:**
   - Vertices $V_0 = 8$
   - Edges $E_0 = 12$
   - Faces $F_0 = 6$ (all squares)

2. **Effect of Corner Truncation at Each Vertex:**
   - At each of the 8 corner vertices, cutting through the midpoints of the 3 incident edges removes a small triangular pyramid.
   - This cut creates **one new triangular face** at each vertex.
   - Since there are 8 vertices, this introduces $8$ new triangular faces.
   - Each of the 6 original square faces has all 4 of its corners trimmed away at the edge midpoints. Trimming the 4 corners of a square produces an **equilateral octagon**.
   - Thus, the original 6 square faces become 6 octagonal faces.
   - Total number of faces $F$:
     $$F = 6\text{ (octagons)} + 8\text{ (triangles)} = 14\text{ faces}$$

3. **Counting the Polyhedron's Vertices ($V$):**
   - The slicing planes pass through the midpoints of the cube's original edges.
   - For any original edge of the cube, the truncation from one vertex meets the truncation from the opposite vertex precisely at the midpoint of that edge.
   - Thus, each of the 12 original edges contributes exactly **one vertex** to the new polyhedron (at its midpoint).
   - Therefore, the resulting polyhedron has:
     $$V = 12\text{ vertices}$$
   *(This polyhedron is known as a cuboctahedron).*

4. **Calculating Total Edges ($E$) via Euler's Polyhedral Formula:**
   For any convex polyhedron:
   $$V - E + F = 2$$
   Substituting $V = 12$ and $F = 14$:
   $$12 - E + 14 = 2$$
   $$26 - E = 2 \implies E = 24\text{ edges}$$

5. **Double Verification by Face-Edge Incidence:**
   - 6 octagonal faces contribute $6 \times 8 = 48$ boundary segments.
   - 8 triangular faces contribute $8 \times 3 = 24$ boundary segments.
   - In any closed polyhedron, every edge is shared by exactly two adjacent faces:
     $$E = \frac{(6 \times 8) + (8 \times 3)}{2} = \frac{48 + 24}{2} = \frac{72}{2} = 24\text{ edges}$$

Both methods confirm: **$F = 14$ and $E = 24$**.

Hence, (A) is the correct option.
