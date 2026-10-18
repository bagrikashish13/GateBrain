---
title: General Aptitude · Mock 02
duration: 25
created: 2026-10-18
description: GATE CS General Aptitude mock covering Quantitative, Verbal, Analytical, and Spatial Aptitude.
---

## Q1
type: MCQ
marks: 1
subject: general-aptitude
answer: A

Choose the pair of words that best fills the blanks to make the sentence grammatically correct and meaningful:

"The executive board was reluctant to ______ to the consultant's aggressive restructuring proposal, as they believed the resulting uncertainty was not ______ to employee morale."

(A) assent, conducive
(B) ascent, conductive
(C) assent, conductive
(D) accent, conducive

### Solution
Let us analyze the definitions and contextual usage of each word pair:

1. **First Blank (assent vs. ascent vs. accent):**
   - **Assent** (verb/noun): to express formal agreement, approval, or concurrence (typically followed by the preposition *to*: *"assent to a proposal"*). This fits the context of board approval.
   - **Ascent** (noun): an upward movement, climb, or rising trajectory.
   - **Accent** (noun/verb): a distinct pronunciation pattern or emphasis.

2. **Second Blank (conducive vs. conductive):**
   - **Conducive** (adjective): making a certain situation or outcome likely or possible, tending to promote or assist (regularly paired with *to*: *"conducive to morale"*).
   - **Conductive** (adjective): possessing the property of transmitting heat, electricity, or sound (a physical property, not used for abstract human states like morale).

Combining both correct words yields **assent, conducive**.

Evaluating the options:
- (A) **assent, conducive** is correct.
- (B) **ascent** refers to climbing, and **conductive** refers to electrical/thermal transmission.
- (C) **conductive** is the wrong word for the second blank.
- (D) **accent** refers to speech pronunciation or emphasis.

Hence, (A) is the correct option.

## Q2
type: NAT
marks: 1
subject: general-aptitude
answer: 10

In an engineering firm, the cost of manufacturing an embedded sensor comprises three components: raw materials, labor, and overheads, which are initially in the ratio $3 : 2 : 1$.

In a given financial year:
- The cost of raw materials increased by $20\%$.
- The cost of labor increased by $15\%$.
- The cost of overheads decreased by $30\%$.

The net percentage increase in the total manufacturing cost of the sensor is ______%.

### Solution
Let the initial costs of raw materials ($M$), labor ($L$), and overheads ($O$) be represented using a common multiplier $x$:
$$M = 3x, \quad L = 2x, \quad O = 1x$$

The total initial manufacturing cost $C_{\text{initial}}$ is:
$$C_{\text{initial}} = 3x + 2x + 1x = 6x$$

Without loss of generality, let $x = 100$:
- Initial raw materials cost: $M_0 = 300$
- Initial labor cost: $L_0 = 200$
- Initial overheads cost: $O_0 = 100$
- Total initial cost: $C_{\text{initial}} = 300 + 200 + 100 = 600$

Now compute the updated costs after the respective percentage changes:
1. **Raw Materials (+20%):**
   $$M_{\text{new}} = 300 \times \left(1 + \frac{20}{100}\right) = 300 \times 1.20 = 360 \quad (\text{Increase } = +60)$$

2. **Labor (+15%):**
   $$L_{\text{new}} = 200 \times \left(1 + \frac{15}{100}\right) = 200 \times 1.15 = 230 \quad (\text{Increase } = +30)$$

3. **Overheads (-30%):**
   $$O_{\text{new}} = 100 \times \left(1 - \frac{30}{100}\right) = 100 \times 0.70 = 70 \quad (\text{Decrease } = -30)$$

The new total manufacturing cost $C_{\text{new}}$ is:
$$C_{\text{new}} = 360 + 230 + 70 = 660$$

The net absolute change in cost is:
$$\Delta C = 660 - 600 = +60$$

The net percentage increase is:
$$\text{Percentage Increase} = \left(\frac{\Delta C}{C_{\text{initial}}}\right) \times 100\% = \left(\frac{60}{600}\right) \times 100\% = 10\%$$

Hence, the answer is 10.

## Q3
type: MCQ
marks: 1
subject: general-aptitude
answer: A

A transparent square sheet is defined on the Cartesian plane with vertices at $(0, 0)$, $(4, 0)$, $(4, 4)$, and $(0, 4)$. Two distinct markings are printed on the sheet:
- A solid circle at $(1, 3)$
- An open triangle at $(2, 1)$

The sheet is folded along the diagonal line $y = x$ such that the lower-right triangular half of the sheet (where $x > y$) is folded over onto the upper-left triangular half (where $x \le y$).

What are the coordinates of the centers of the two markings as seen on the resulting folded sheet?

(A) Solid circle at $(1, 3)$ and open triangle at $(1, 2)$
(B) Solid circle at $(3, 1)$ and open triangle at $(2, 1)$
(C) Solid circle at $(1, 3)$ and open triangle at $(2, 3)$
(D) Solid circle at $(3, 1)$ and open triangle at $(1, 2)$

### Solution
Let us analyze the position of each marking relative to the fold line $y = x$:

1. **Solid circle at $(1, 3)$:**
   - For this point, $x = 1$ and $y = 3$.
   - Since $x \le y$ ($1 \le 3$), this point lies in the upper-left triangular half of the sheet.
   - The upper-left half remains stationary during the fold.
   - Therefore, the solid circle does not move and remains at **$(1, 3)$**.

2. **Open triangle at $(2, 1)$:**
   - For this point, $x = 2$ and $y = 1$.
   - Since $x > y$ ($2 > 1$), this point lies in the lower-right triangular half that is folded over.
   - Folding across the line $y = x$ performs a geometric reflection across $y = x$.
   - The algebraic transformation for reflection across the line $y = x$ maps $(x, y) \to (y, x)$.
   - Applying this transformation to $(2, 1)$ gives:
     $$(2, 1) \xrightarrow{\text{reflect across } y = x} (1, 2)$$
   - The reflected position $(1, 2)$ satisfies $x \le y$ ($1 \le 2$), which lies squarely on the upper-left half.

Thus, on the folded sheet, the solid circle is at $(1, 3)$ and the open triangle is at $(1, 2)$.

Evaluating the options:
- (A) Correct.
- (B) Incorrectly reflects the solid circle while leaving the open triangle unmoved.
- (C) Provides an incorrect reflection coordinate $(2, 3)$ for the triangle.
- (D) Incorrectly reflects both markings across the diagonal.

Hence, (A) is the correct option.

## Q4
type: MCQ
marks: 1
subject: general-aptitude
answer: A

Five students—$P, Q, R, S,$ and $T$—obtained distinct total scores in an examination:
1. $P$ scored higher than $Q$ but lower than $T$.
2. $R$ scored higher than $S$.
3. $S$ did not obtain the lowest score.
4. $T$ did not obtain the highest score.

Who obtained the LOWEST score among the five students?

(A) $Q$
(B) $P$
(C) $S$
(D) Cannot be determined uniquely

### Solution
Let us analyze the relative rankings of all five students using strict order inequalities:

1. **From Condition 1:**
   $$T > P > Q$$
   - Since $P > Q$, student $P$ cannot have the lowest score.
   - Since $T > P$, student $T$ cannot have the lowest score.

2. **From Condition 2:**
   $$R > S$$
   - Since $R > S$, student $R$ cannot have the lowest score.

3. **From Condition 3:**
   - Student $S$ did not obtain the lowest score.

4. **Elimination of candidates for the lowest score:**
   - $T$ cannot be the lowest (since $T > P > Q$).
   - $P$ cannot be the lowest (since $P > Q$).
   - $R$ cannot be the lowest (since $R > S$).
   - $S$ cannot be the lowest (by explicit Condition 3).

Among the 5 students $\{P, Q, R, S, T\}$, four students ($P, R, S, T$) are definitively ruled out from having the lowest score.

Therefore, student **$Q$** must uniquely have obtained the lowest score.

*(Verification: A complete valid ranking satisfying all conditions is $R > T > P > S > Q$, where $R$ is highest, $T$ is not highest, $T > P > Q$, $R > S$, and $Q$ is lowest).*

Hence, (A) is the correct option.

## Q5
type: MCQ
marks: 1
subject: general-aptitude
answer: A

What is the remainder when $3^{2026}$ is divided by $100$?

(A) 29
(B) 49
(C) 81
(D) 89

### Solution
Finding the remainder when $3^{2026}$ is divided by $100$ is equivalent to computing $3^{2026} \pmod{100}$ (or determining the last two digits of $3^{2026}$).

Let us determine the order of $3$ modulo $100$:
- We examine successive small powers of $3$:
  $$3^1 = 3$$
  $$3^2 = 9$$
  $$3^4 = 81 \equiv -19 \pmod{100}$$
  $$3^5 = 243 \equiv 43 \pmod{100}$$
  $$3^8 = (-19)^2 = 361 \equiv 61 \pmod{100}$$
  $$3^{10} = 3^8 \times 3^2 \equiv 61 \times 9 = 549 \equiv 49 \pmod{100}$$

- Now compute $3^{20} \pmod{100}$:
  $$3^{20} = (3^{10})^2 \equiv 49^2 = (50 - 1)^2 = 2500 - 100 + 1 \equiv 1 \pmod{100}$$

Thus, $3^{20} \equiv 1 \pmod{100}$. (This also follows from Carmichael's totient theorem: $\lambda(100) = \text{lcm}(\phi(4), \phi(25)) = \text{lcm}(2, 20) = 20$).

Now decompose the exponent $2026$ in terms of multiples of $20$:
$$2026 = 20 \times 101 + 6$$

Applying modulo $100$:
$$3^{2026} = \left(3^{20}\right)^{101} \times 3^6 \equiv (1)^{101} \times 3^6 \pmod{100}$$

Now evaluate $3^6$:
$$3^6 = (3^3)^2 = 27^2 = 729 \equiv 29 \pmod{100}$$

Therefore, the remainder when $3^{2026}$ is divided by $100$ is **29**.

Evaluating the options:
- (A) 29 is correct.
- (B) 49 corresponds to $3^{10} \pmod{100}$.
- (C) 81 corresponds to $3^4 \pmod{100}$.
- (D) 89 is incorrect.

Hence, (A) is the correct option.

## Q6
type: MCQ
marks: 2
subject: general-aptitude
answer: B

Read the passage below and answer the question that follows:

"Modern algorithmic trading relies extensively on machine learning models trained on vast historical market datasets. During tranquil periods, these autonomous agents successfully identify and capture fractional price discrepancies. However, financial stability regulators have raised grave concerns regarding algorithmic monoculture: because most institutional trading firms employ similar objective functions and train on overlapping public market datasets, their proprietary models frequently converge on identical risk-off hedging strategies during sudden macroeconomic shocks. When an unexpected perturbation occurs, thousands of independently deployed algorithms simultaneously trigger sell orders for the exact same asset classes, rapidly depleting market liquidity and precipitating severe flash crashes that no individual institution's risk model had anticipated."

Which one of the following statements is the most valid INFERENCE from the passage?

(A) Automated trading algorithms are inherently unprofitable during stable macroeconomic periods.
(B) Independent development and ownership of trading algorithms does not preclude systemic, coordinated market failures when models share similar objectives and training data.
(C) Regulatory authorities can eliminate flash crashes entirely by prohibiting the use of machine learning in institutional finance.
(D) Severe market crashes occur primarily because human traders intervene and override automated risk models during sudden shocks.

### Solution
Let us evaluate each statement against the arguments presented in the passage:

- **(B) is the most valid inference:**
  The passage explains that even though models are "proprietary" and "independently deployed" by different institutional firms, their shared objective functions and overlapping training data cause them to converge on identical behavior during shocks ("algorithmic monoculture"). This simultaneous behavior drains liquidity and causes flash crashes. Thus, independent ownership and development do not prevent systemic and coordinated vulnerabilities.

- **(A) contradicts the passage:**
  The text explicitly notes: *"During tranquil periods, these autonomous agents successfully identify and capture fractional price discrepancies"*, proving they are profitable in stable conditions.

- **(C) is an extreme and unsupported assertion:**
  The passage describes regulators' concerns regarding algorithmic monoculture, but it nowhere claims that prohibiting machine learning would "eliminate flash crashes entirely".

- **(D) contradicts the passage:**
  The passage explicitly attributes the liquidity depletion and crashes to the automated algorithms themselves acting simultaneously (*"thousands of independently deployed algorithms simultaneously trigger sell orders"*), rather than human intervention.

Hence, (B) is the correct option.

## Q7
type: NAT
marks: 2
subject: general-aptitude
answer: 11

An empty water reservoir is equipped with two inlet pipes, $A$ and $B$, and one bottom drainage pipe, $C$.
- Pipe $A$ alone can fill the empty reservoir in $12\text{ hours}$.
- Pipe $B$ alone can fill the empty reservoir in $15\text{ hours}$.
- Drainage pipe $C$ alone can empty the completely full reservoir in $20\text{ hours}$.

The reservoir is filled from empty according to the following staged protocol:
1. Pipes $A$ and $B$ are opened simultaneously for the first $2\text{ hours}$, while Pipe $C$ remains closed.
2. At the end of $2\text{ hours}$, Pipe $B$ is closed, and drainage pipe $C$ is opened (with Pipe $A$ remaining open). They operate together for the next $3\text{ hours}$.
3. At the end of these $3\text{ hours}$, Pipe $B$ is reopened, so that all three pipes ($A, B,$ and $C$) operate together until the reservoir is completely full.

The total time taken to fill the reservoir completely from the initial start is ______ hours.

### Solution
Let the total capacity of the reservoir be given by the least common multiple of the individual times:
$$\text{Capacity} = \text{LCM}(12, 15, 20) = 60\text{ units}$$

Now compute the hourly rates of each pipe:
- Rate of inlet Pipe $A$:
  $$R_A = +\frac{60}{12} = +5\text{ units/hour}$$
- Rate of inlet Pipe $B$:
  $$R_B = +\frac{60}{15} = +4\text{ units/hour}$$
- Rate of drainage Pipe $C$:
  $$R_C = -\frac{60}{20} = -3\text{ units/hour}$$

Now trace the water volume stage by stage:

1. **Stage 1 (Hours 0 to 2, Duration = 2 hours):**
   - Pipes active: $A$ and $B$.
   - Combined rate:
     $$R_{\text{Stage 1}} = R_A + R_B = 5 + 4 = 9\text{ units/hour}$$
   - Volume filled in Stage 1:
     $$V_1 = 2\text{ hours} \times 9\text{ units/hour} = 18\text{ units}$$

2. **Stage 2 (Hours 2 to 5, Duration = 3 hours):**
   - Pipes active: $A$ and $C$ (Pipe $B$ is closed).
   - Combined rate:
     $$R_{\text{Stage 2}} = R_A + R_C = 5 - 3 = +2\text{ units/hour}$$
   - Volume filled in Stage 2:
     $$V_2 = 3\text{ hours} \times 2\text{ units/hour} = 6\text{ units}$$
   - Cumulative volume filled after Stage 2:
     $$V_{\text{cumulative}} = V_1 + V_2 = 18 + 6 = 24\text{ units}$$
   - Remaining volume needed to reach full capacity ($60\text{ units}$):
     $$V_{\text{remaining}} = 60 - 24 = 36\text{ units}$$

3. **Stage 3 (From Hour 5 until full):**
   - Pipes active: $A, B,$ and $C$.
   - Combined rate:
     $$R_{\text{Stage 3}} = R_A + R_B + R_C = 5 + 4 - 3 = 6\text{ units/hour}$$
   - Time required to fill the remaining $36\text{ units}$:
     $$t_3 = \frac{V_{\text{remaining}}}{R_{\text{Stage 3}}} = \frac{36\text{ units}}{6\text{ units/hour}} = 6\text{ hours}$$

4. **Total Time:**
   $$t_{\text{total}} = t_1 + t_2 + t_3 = 2 + 3 + 6 = 11\text{ hours}$$

Hence, the answer is 11.

## Q8
type: MSQ
marks: 2
subject: general-aptitude
answer: A, B, C

Five software engineers—$P, Q, R, S,$ and $T$—are assigned to five different sprint tasks numbered 1, 2, 3, 4, and 5 (one unique task per engineer). The tasks are executed sequentially in numerical order from 1 to 5.

The assignments satisfy the following conditions:
1. $R$ completes their task immediately before $T$ completes theirs (i.e., $Task(T) = Task(R) + 1$).
2. $Q$ completes their task at an odd-numbered position.
3. $P$ completes their task earlier than $S$ (i.e., $Task(P) < Task(S)$).
4. $T$ is assigned neither Task 4 nor Task 5.
5. $P$ is not assigned Task 1.

Which of the following statements is/are necessarily TRUE?

(A) Task 1 is completed by either $Q$ or $R$
(B) $P$ completes their task after $T$
(C) $S$ is assigned either Task 4 or Task 5
(D) $Q$ is assigned Task 3

### Solution
Let us systematically deduce all possible valid assignments of tasks $1, 2, 3, 4, 5$:

1. **Placing the Block $(R, T)$:**
   - Condition 1 specifies that $R$ and $T$ occupy adjacent consecutive tasks: $Task(T) = Task(R) + 1$.
   - Condition 4 states $Task(T) \ne 4$ and $Task(T) \ne 5$.
   - Also, $Task(T)$ cannot be $1$ because $Task(R) = Task(T) - 1 \ge 1$.
   - Therefore, the only possible positions for $Task(T)$ are $2$ and $3$.

   This leaves two primary cases for the block $(R, T)$:
   - **Case I:** $Task(R) = 1, Task(T) = 2$
   - **Case II:** $Task(R) = 2, Task(T) = 3$

2. **Analyzing Case I ($Task(R) = 1, Task(T) = 2$):**
   - The remaining tasks to assign to $\{P, Q, S\}$ are $\{3, 4, 5\}$.
   - Condition 2 requires $Q$ to be at an odd-numbered position: $Task(Q) \in \{3, 5\}$.
     - **Subcase I-A ($Task(Q) = 3$):**
       Remaining tasks for $P$ and $S$ are $\{4, 5\}$.
       Condition 3 ($Task(P) < Task(S)$) forces $Task(P) = 4$ and $Task(S) = 5$.
       Condition 5 ($Task(P) \ne 1$) is satisfied ($P=4$).
       $$\text{Assignment 1: } R=1, \, T=2, \, Q=3, \, P=4, \, S=5$$
     - **Subcase I-B ($Task(Q) = 5$):**
       Remaining tasks for $P$ and $S$ are $\{3, 4\}$.
       Condition 3 ($Task(P) < Task(S)$) forces $Task(P) = 3$ and $Task(S) = 4$.
       Condition 5 ($Task(P) \ne 1$) is satisfied ($P=3$).
       $$\text{Assignment 2: } R=1, \, T=2, \, P=3, \, S=4, \, Q=5$$

3. **Analyzing Case II ($Task(R) = 2, Task(T) = 3$):**
   - The remaining tasks to assign to $\{P, Q, S\}$ are $\{1, 4, 5\}$.
   - Condition 5 states $Task(P) \ne 1$, so $Task(P) \in \{4, 5\}$.
   - Condition 3 requires $Task(P) < Task(S)$. Since the maximum task number is $5$, $Task(P)$ cannot be $5$.
     Thus, $Task(P) = 4$, which forces $Task(S) = 5$.
   - The only remaining task for $Q$ is task $1$.
   - Condition 2 ($Q$ is at an odd position) is satisfied because $1$ is odd.
     $$\text{Assignment 3: } Q=1, \, R=2, \, T=3, \, P=4, \, S=5$$

There are exactly three valid assignments across all conditions:
- **Assignment 1:** $(1: R, \; 2: T, \; 3: Q, \; 4: P, \; 5: S)$
- **Assignment 2:** $(1: R, \; 2: T, \; 3: P, \; 4: S, \; 5: Q)$
- **Assignment 3:** $(1: Q, \; 2: R, \; 3: T, \; 4: P, \; 5: S)$

Now let us test each candidate statement across all three assignments:

- **(A) Task 1 is completed by either $Q$ or $R$:**
  - In Assignment 1: Task 1 is $R$.
  - In Assignment 2: Task 1 is $R$.
  - In Assignment 3: Task 1 is $Q$.
  In every valid scenario, Task 1 is indeed completed by either $Q$ or $R$. (**TRUE**)

- **(B) $P$ completes their task after $T$ ($Task(P) > Task(T)$):**
  - In Assignment 1: $Task(P) = 4 > Task(T) = 2$.
  - In Assignment 2: $Task(P) = 3 > Task(T) = 2$.
  - In Assignment 3: $Task(P) = 4 > Task(T) = 3$.
  In all cases, $P$ completes their task strictly after $T$. (**TRUE**)

- **(C) $S$ is assigned either Task 4 or Task 5:**
  - In Assignment 1: $Task(S) = 5$.
  - In Assignment 2: $Task(S) = 4$.
  - In Assignment 3: $Task(S) = 5$.
  $Task(S)$ is always either $4$ or $5$. (**TRUE**)

- **(D) $Q$ is assigned Task 3:**
  - In Assignment 2, $Q$ is assigned Task 5, and in Assignment 3, $Q$ is assigned Task 1.
  Therefore, this is not necessarily true. (**FALSE**)

Hence, statements A, B, and C are necessarily TRUE.

## Q9
type: NAT
marks: 2
subject: general-aptitude
answer: 270

A technical review board consisting of $4$ members is to be formed from a department of $12$ professionals:
- $5$ software engineers
- $4$ data scientists
- $3$ product managers

The review board must include at least one professional from each of the three roles.

The total number of distinct ways to form this review board is ______.

### Solution
We need to select a committee of $4$ members from three categories:
- Software Engineers ($E$): $5$ available
- Data Scientists ($D$): $4$ available
- Product Managers ($M$): $3$ available

The condition requires that the selected board contains at least one member from each role ($E \ge 1, D \ge 1, M \ge 1$).

Since the total board size is $4$, the only possible distribution of members across the three roles is $2 + 1 + 1$:
exactly one role contributes $2$ members, and the other two roles contribute $1$ member each.

We evaluate the three mutually exclusive cases:

1. **Case 1: 2 Software Engineers, 1 Data Scientist, 1 Product Manager:**
   $$\text{Ways}_1 = \binom{5}{2} \times \binom{4}{1} \times \binom{3}{1} = 10 \times 4 \times 3 = 120$$

2. **Case 2: 1 Software Engineer, 2 Data Scientists, 1 Product Manager:**
   $$\text{Ways}_2 = \binom{5}{1} \times \binom{4}{2} \times \binom{3}{1} = 5 \times 6 \times 3 = 90$$

3. **Case 3: 1 Software Engineer, 1 Data Scientist, 2 Product Managers:**
   $$\text{Ways}_3 = \binom{5}{1} \times \binom{4}{1} \times \binom{3}{2} = 5 \times 4 \times 3 = 60$$

Summing the ways across all three cases:
$$\text{Total Ways} = 120 + 90 + 60 = 270$$

---
#### Alternative Verification (Principle of Inclusion-Exclusion):
- Total unconstrained ways to choose $4$ members from $12$:
  $$\binom{12}{4} = \frac{12 \times 11 \times 10 \times 9}{4 \times 3 \times 2 \times 1} = 495$$

- Subtract committees missing at least one role:
  - Missing Engineers (chosen only from $4 + 3 = 7$ others): $\binom{7}{4} = 35$
  - Missing Data Scientists (chosen only from $5 + 3 = 8$ others): $\binom{8}{4} = 70$
  - Missing Product Managers (chosen only from $5 + 4 = 9$ others): $\binom{9}{4} = 126$

- Add back pairwise intersections (committees missing two roles):
  - Missing $E$ and $D$ (chosen only from $3$ PMs): $\binom{3}{4} = 0$
  - Missing $E$ and $M$ (chosen only from $4$ DS): $\binom{4}{4} = 1$
  - Missing $D$ and $M$ (chosen only from $5$ Engineers): $\binom{5}{4} = 5$

By inclusion-exclusion:
$$\text{Total Valid Committees} = 495 - (35 + 70 + 126) + (0 + 1 + 5) = 495 - 231 + 6 = 270$$

Both methods yield exactly 270.

Hence, the answer is 270.

## Q10
type: MCQ
marks: 2
subject: general-aptitude
answer: A

A solid 3D structure is built on a horizontal $3 \times 3$ grid using identical $1 \times 1 \times 1$ unit cubes. The grid rows are numbered 1 to 3 from front to back, and the columns are numbered 1 to 3 from left to right.

The structure has the following orthographic projections:
- **Front View:** The maximum heights of unit cubes observed in columns 1, 2, and 3 (from left to right) are $3, 2,$ and $1$, respectively.
- **Right-Side View:** The maximum heights of unit cubes observed in rows 1, 2, and 3 (from front to back) are $2, 3,$ and $1$, respectively.

What are the MINIMUM and MAXIMUM possible total numbers of unit cubes used to construct this solid structure?

(A) Minimum = 6, Maximum = 14
(B) Minimum = 6, Maximum = 16
(C) Minimum = 7, Maximum = 14
(D) Minimum = 8, Maximum = 15

### Solution
Let $h(r, c)$ denote the height (number of cubes) in the grid cell at row $r \in \{1, 2, 3\}$ and column $c \in \{1, 2, 3\}$, where $h(r, c) \ge 0$ is an integer.

From the orthographic views:
- **Front View Constraints (Column Maxima):**
  $$\max_{r} h(r, 1) = 3, \quad \max_{r} h(r, 2) = 2, \quad \max_{r} h(r, 3) = 1$$
- **Right-Side View Constraints (Row Maxima):**
  $$\max_{c} h(1, c) = 2, \quad \max_{c} h(2, c) = 3, \quad \max_{c} h(3, c) = 1$$

---
### 1. Determining the MAXIMUM Number of Cubes:
To maximize the number of cubes, each cell $(r, c)$ can take the maximum height that does not violate either its row maximum or its column maximum:
$$h(r, c) \le \min\Big(\text{RowMax}(r), \, \text{ColMax}(c)\Big)$$

Let us calculate this upper bound for all 9 cells:
- **Row 1 ($\text{RowMax} = 2$):**
  - $h(1, 1) \le \min(2, 3) = 2$
  - $h(1, 2) \le \min(2, 2) = 2$
  - $h(1, 3) \le \min(2, 1) = 1$
  Row 1 sum $= 2 + 2 + 1 = 5$.
- **Row 2 ($\text{RowMax} = 3$):**
  - $h(2, 1) \le \min(3, 3) = 3$
  - $h(2, 2) \le \min(3, 2) = 2$
  - $h(2, 3) \le \min(3, 1) = 1$
  Row 2 sum $= 3 + 2 + 1 = 6$.
- **Row 3 ($\text{RowMax} = 1$):**
  - $h(3, 1) \le \min(1, 3) = 1$
  - $h(3, 2) \le \min(1, 2) = 1$
  - $h(3, 3) \le \min(1, 1) = 1$
  Row 3 sum $= 1 + 1 + 1 = 3$.

Let us verify if this upper-bound configuration satisfies all given row and column maxima:
$$\text{Matrix } H_{\max} = \begin{pmatrix} 2 & 2 & 1 \\ 3 & 2 & 1 \\ 1 & 1 & 1 \end{pmatrix}$$
- Row maxima: $\max(2, 2, 1) = 2$, $\max(3, 2, 1) = 3$, $\max(1, 1, 1) = 1$ (all satisfied).
- Column maxima: $\max(2, 3, 1) = 3$, $\max(2, 2, 1) = 2$, $\max(1, 1, 1) = 1$ (all satisfied).

Total maximum cubes:
$$\text{Maximum} = 5 + 6 + 3 = 14$$

---
### 2. Determining the MINIMUM Number of Cubes:
To satisfy the column maxima:
- Column 1 requires at least one cell with height 3 (contributes $\ge 3$ cubes).
- Column 2 requires at least one cell with height 2 (contributes $\ge 2$ cubes).
- Column 3 requires at least one cell with height 1 (contributes $\ge 1$ cube).

Because columns are mutually disjoint sets of cells, the total number of cubes must be at least:
$$\text{Total Cubes} \ge 3 + 2 + 1 = 6$$

Can a configuration with exactly 6 cubes simultaneously satisfy all row maxima?
To minimize cubes, we place the column peaks at cells where the required column height matches the required row height:
- Place height $3$ at $(r=2, c=1)$: satisfies $\text{ColMax}(1) = 3$ AND $\text{RowMax}(2) = 3$.
- Place height $2$ at $(r=1, c=2)$: satisfies $\text{ColMax}(2) = 2$ AND $\text{RowMax}(1) = 2$.
- Place height $1$ at $(r=3, c=3)$: satisfies $\text{ColMax}(3) = 1$ AND $\text{RowMax}(3) = 1$.
- Set all other 6 cells to height 0:

$$\text{Matrix } H_{\min} = \begin{pmatrix} 0 & 2 & 0 \\ 3 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix}$$

Checking $H_{\min}$:
- Row maxima: Row 1 is 2; Row 2 is 3; Row 3 is 1 (all satisfied).
- Column maxima: Col 1 is 3; Col 2 is 2; Col 3 is 1 (all satisfied).
- Total cubes in $H_{\min} = 3 + 2 + 1 = 6$.

Thus, the minimum number of cubes required is **6**.

Therefore, **Minimum = 6, Maximum = 14**.

Hence, (A) is the correct option.
