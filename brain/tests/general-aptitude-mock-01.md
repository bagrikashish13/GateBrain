---
title: General Aptitude · Mock 01 (Non-Quantitative)
duration: 25
created: 2026-10-17
description: GATE General Aptitude mock focusing exclusively on Verbal, Analytical, and Spatial Aptitude.
---

## Q1
type: MCQ
marks: 1
subject: general-aptitude
answer: B

Choose the grammatically correct pair of verbs to complete the sentence:

"Neither the lead architect nor the senior software engineers ______ convinced that the proposed distributed architecture ______ capable of handling the peak transaction volume without data inconsistency."

(A) was, was
(B) were, was
(C) were, were
(D) was, were

### Solution
Let us analyze the grammatical rules governing both blanks:

1. **First Blank (Subject-Verb Agreement with Correlative Conjunctions):**
   - The sentence uses the correlative conjunction *"Neither ... nor ..."* to join two subjects: *"the lead architect"* (singular) and *"the senior software engineers"* (plural).
   - Under the rule of proximity, when two subjects of different grammatical numbers are connected by *"neither ... nor ..."*, the verb agrees in number with the closer subject.
   - The closer subject is *"the senior software engineers"*, which is plural.
   - Therefore, the plural verb **were** is required.

2. **Second Blank (Subject-Verb Agreement in Dependent Clause):**
   - The subject of the noun clause *"that the proposed distributed architecture ... capable"* is *"the proposed distributed architecture"*, which is a singular abstract noun.
   - Therefore, the singular verb **was** is required.

Combining both rules yields: **were, was**.

Hence, (B) is the correct option.

## Q2
type: MCQ
marks: 1
subject: general-aptitude
answer: B

Choose the correct pair of words that best fits the blanks in the sentence below:

"The CEO made a subtle ______ to the upcoming corporate restructuring during her address, though she was careful not to create any ______ about immediate layoffs."

(A) illusion, allusion
(B) allusion, illusion
(C) elusion, illusion
(D) allusion, delusion

### Solution
Let us distinguish the meanings of the words in context:

- **Allusion:** An indirect or passing reference to something without mentioning it explicitly.
  - In the first blank, the CEO makes a subtle, indirect reference to corporate restructuring: *"made a subtle allusion"*.
- **Illusion:** A false perception, deceptive impression, or erroneous belief.
  - In the second blank, the CEO was careful not to create a false impression or false belief about layoffs: *"not to create any illusion"*.
- **Elusion:** The act of evading or escaping (not applicable here).
- **Delusion:** A persistent false belief held despite strong contrary evidence, typically associated with mental illness or irrationality (less appropriate in a standard corporate communication context than "illusion").

Therefore, the correct pair of words is **allusion, illusion**.

Hence, (B) is the correct option.

## Q3
type: MCQ
marks: 1
subject: general-aptitude
answer: A

Read the three statements and the three conclusions given below:

**Statements:**
1. Some algorithms are efficient.
2. All efficient programs are scalable.
3. No scalable system is vulnerable.

**Conclusions:**
- I. Some algorithms are scalable.
- II. No efficient program is vulnerable.
- III. No algorithm is vulnerable.

Which of the conclusions logically follow(s) from the given statements?

(A) Only conclusions I and II follow
(B) Only conclusions I and III follow
(C) Only conclusions II and III follow
(D) All conclusions I, II, and III follow

### Solution
Let us represent the categories as sets:
- $A$: set of algorithms
- $E$: set of efficient programs
- $S$: set of scalable systems
- $V$: set of vulnerable systems

Given premises:
1. $A \cap E \ne \emptyset$ (There exists at least one entity $x \in A \cap E$).
2. $E \subseteq S$ (Every entity in $E$ is also in $S$).
3. $S \cap V = \emptyset$ (Sets $S$ and $V$ are completely disjoint).

Evaluating each conclusion:
- **Conclusion I: Some algorithms are scalable ($A \cap S \ne \emptyset$).**
  - By premise 1, there exists an $x \in A \cap E$.
  - By premise 2, since $x \in E$, it follows that $x \in S$.
  - Therefore, $x \in A \cap S$, which means some algorithms are scalable.
  - Conclusion I **definitely follows**.

- **Conclusion II: No efficient program is vulnerable ($E \cap V = \emptyset$).**
  - By premise 2, $E \subseteq S$.
  - By premise 3, $S \cap V = \emptyset$.
  - Since $E$ is a subset of $S$, no element in $E$ can belong to $V$.
  - Conclusion II **definitely follows**.

- **Conclusion III: No algorithm is vulnerable ($A \cap V = \emptyset$).**
  - While we know that algorithms that are scalable ($A \cap S$) cannot be vulnerable, the premise provides no information regarding algorithms that are *not* efficient ($A \setminus E$).
  - An inefficient algorithm could belong to $V$.
  - Conclusion III **does not necessarily follow**.

Therefore, only conclusions I and II follow.

Hence, (A) is the correct option.

## Q4
type: MCQ
marks: 1
subject: general-aptitude
answer: A

An asymmetric planar figure in the Cartesian $xy$-plane undergoes two successive transformations:
1. It is first reflected across the horizontal line $y = 0$ (the $x$-axis).
2. The resulting figure is then rotated by $90^\circ$ counter-clockwise about the origin $(0, 0)$.

This combination of two transformations is geometrically equivalent to which of the following single transformations of the original figure?

(A) Reflection across the line $y = x$
(B) Reflection across the line $y = -x$
(C) Clockwise rotation by $90^\circ$ about the origin
(D) Counter-clockwise rotation by $180^\circ$ about the origin

### Solution
Let $(x, y)$ be an arbitrary point on the original figure:

1. **Step 1: Reflection across the $x$-axis ($y = 0$):**
   The $x$-coordinate remains unchanged, and the $y$-coordinate is negated:
   $$(x, y) \xrightarrow{\text{Reflect } y = 0} (x', y') = (x, -y)$$

2. **Step 2: Rotation by $90^\circ$ counter-clockwise about $(0, 0)$:**
   A counter-clockwise rotation by $90^\circ$ maps any point $(u, v)$ to $(-v, u)$.
   Applying this transformation to $(u, v) = (x', y') = (x, -y)$:
   $$(x'', y'') = (-(-y), x) = (y, x)$$

3. **Composite Transformation:**
   The composite transformation maps:
   $$(x, y) \to (y, x)$$
   Swapping the $x$ and $y$ coordinates is the algebraic definition of a **reflection across the line $y = x$**.

Evaluating the other options:
- (B) Reflection across $y = -x$ maps $(x, y) \to (-y, -x)$.
- (C) Clockwise rotation by $90^\circ$ maps $(x, y) \to (y, -x)$.
- (D) Counter-clockwise rotation by $180^\circ$ maps $(x, y) \to (-x, -y)$.

Therefore, the composite transformation is equivalent to reflection across the line $y = x$.

Hence, (A) is the correct option.

## Q5
type: MCQ
marks: 1
subject: general-aptitude
answer: A

The following four sentences (P, Q, R, S) are parts of a coherent paragraph. Determine the most logical and coherent sequence:

- **P:** This degradation not only impairs agricultural productivity but also accelerates regional biodiversity loss.
- **Q:** Over the past few decades, intensive farming practices have stripped essential micronutrients from topsoil at an unprecedented rate.
- **R:** Consequently, restorative agricultural techniques such as regenerative grazing and crop rotation are gaining urgent global attention.
- **S:** Without active replenishment, these vital soil ecosystems become increasingly vulnerable to erosion and desertification.

Which of the following represents the correct sequence?

(A) Q - S - P - R
(B) Q - P - R - S
(C) S - P - Q - R
(D) P - Q - S - R

### Solution
Let us examine the logical flow and inter-sentence references:

1. **Sentence Q** is the only independent opening statement. It establishes the primary topic and the core problem: intensive farming stripping micronutrients from topsoil.
2. **Sentence S** directly follows Sentence Q by describing the immediate consequence of nutrient depletion: *"Without active replenishment, these vital soil ecosystems become increasingly vulnerable..."* (where *"these vital soil ecosystems"* refers back to the topsoil mentioned in Q).
3. **Sentence P** builds upon S: *"This degradation not only impairs agricultural productivity but also accelerates regional biodiversity loss."* (where *"This degradation"* refers to the erosion and desertification introduced in S).
4. **Sentence R** serves as the natural conclusion, signaled by the transition word *"Consequently"*, stating the remedy being adopted globally in response to the compounded crisis.

Thus, the sequence **Q - S - P - R** forms a logically seamless narrative: problem $\to$ immediate vulnerability $\to$ broad ecological impact $\to$ proposed solution.

Hence, (A) is the correct option.

## Q6
type: MCQ
marks: 2
subject: general-aptitude
answer: B

Read the passage below and answer the question that follows:

"A major critique of automated machine learning (AutoML) systems in clinical diagnostics is that they operate as 'black boxes', producing highly accurate classifications without human-interpretable rationales. Proponents argue that in life-critical medical emergencies, empirical diagnostic accuracy is paramount, and demanding interpretability risks rejecting models that could save lives. However, medical ethicists contend that without mechanistic interpretability, clinicians cannot determine whether a model has genuinely discovered a disease biomarker or merely exploited spurious correlations present in the training data (such as hospital-specific imaging artifacts). Therefore, high predictive accuracy on historical datasets cannot alone justify clinical deployment."

Which of the following statements is the most robust INFERENCE that can be drawn from the passage?

(A) Interpretable models are inherently less accurate than black-box models in clinical settings.
(B) High predictive performance on historical data does not guarantee that an AutoML model will perform reliably when deployed in real-world clinical environments with unseen artifacts.
(C) Proponents of AutoML prioritize hospital operational efficiency over patient survival in medical emergencies.
(D) Spurious correlations in medical imaging datasets can always be detected and eliminated by skilled clinicians.

### Solution
Let us evaluate each candidate inference:

- **(B) is the correct inference:**
  The passage explicitly points out that without interpretability, clinicians cannot distinguish between true biomarkers and spurious correlations (e.g., hospital-specific imaging artifacts) learned from historical training data. If a model relies on such artifacts, its high predictive performance on historical data will not generalize to new environments. This directly supports the author's concluding claim that historical accuracy alone does not justify clinical deployment.
- **(A) is an unwarranted generalization:**
  The passage states that proponents argue demanding interpretability *risks* rejecting accurate models, but nowhere does it assert that interpretable models are *inherently* less accurate.
- **(C) is a distortion:**
  Proponents argue that high accuracy in emergencies saves lives; the passage nowhere suggests that they prioritize operational efficiency over patient survival.
- **(D) contradicts the passage:**
  The passage states that without interpretability, clinicians *cannot* determine if spurious correlations were exploited, directly contradicting the claim that clinicians can "always" detect and eliminate them.

Hence, (B) is the correct option.

## Q7
type: MSQ
marks: 2
subject: general-aptitude
answer: A, B, C

Six engineers—$A, B, C, D, E,$ and $F$—are seated in a single row facing North, occupying positions 1 to 6 from left to right. The following conditions are given:
1. $C$ is seated at the extreme right end of the row.
2. $E$ is seated to the immediate left of $C$.
3. $B$ is seated immediately between $A$ and $D$.
4. $A$ is not seated at an extreme end of the row.

Which of the following statements is/are necessarily TRUE?

(A) $F$ is seated immediately between $A$ and $E$
(B) $D$ is seated at the extreme left end of the row
(C) Exactly two persons are seated between $B$ and $E$
(D) $F$ is seated to the immediate left of $B$

### Solution
Let the 6 positions from left to right be represented as $1, 2, 3, 4, 5, 6$.

1. **Positions of $C$ and $E$:**
   - From Condition 1: $C$ is at the extreme right end $\implies pos(C) = 6$.
   - From Condition 2: $E$ is immediately to the left of $C \implies pos(E) = 5$.
   - The remaining positions to fill are $\{1, 2, 3, 4\}$.

2. **Positions of $A, B,$ and $D$:**
   - From Condition 3: $B$ is seated immediately between $A$ and $D$. This requires $A, B, D$ to occupy three consecutive positions, with $B$ in the middle.
   - The only block of three consecutive available positions in $\{1, 2, 3, 4\}$ is $\{1, 2, 3\}$.
   - Therefore, $pos(B) = 2$, and $\{A, D\}$ must occupy positions 1 and 3.

3. **Resolving $A$ and $D$:**
   - From Condition 4: $A$ is not seated at an extreme end.
   - Position 1 is an extreme end, so $pos(A) \ne 1$.
   - Therefore, $pos(A) = 3$ and $pos(D) = 1$.

4. **Position of $F$:**
   - The only remaining unoccupied position is position 4.
   - Therefore, $pos(F) = 4$.

The unique arrangement from position 1 to 6 is:
$$\text{Pos 1: } D, \quad \text{Pos 2: } B, \quad \text{Pos 3: } A, \quad \text{Pos 4: } F, \quad \text{Pos 5: } E, \quad \text{Pos 6: } C$$

Now evaluate the options:
- **(A) $F$ is seated immediately between $A$ and $E$:**
  $pos(A) = 3$, $pos(F) = 4$, and $pos(E) = 5$. Thus, $F$ is indeed seated immediately between $A$ and $E$. (**TRUE**)
- **(B) $D$ is seated at the extreme left end of the row:**
  $pos(D) = 1$, which is the extreme left end. (**TRUE**)
- **(C) Exactly two persons are seated between $B$ and $E$:**
  $pos(B) = 2$ and $pos(E) = 5$. The persons between them are at positions 3 and 4 ($A$ and $F$), exactly two persons. (**TRUE**)
- **(D) $F$ is seated to the immediate left of $B$:**
  $pos(B) = 2$. To the immediate left of $B$ is $D$ (position 1), not $F$ (which is at position 4). (**FALSE**)

Hence, statements A, B, and C are TRUE.

## Q8
type: MCQ
marks: 2
subject: general-aptitude
answer: A

On a remote island, every resident is either a Truth-teller (who always tells the truth) or a Liar (who always lies). Three residents—$X, Y,$ and $Z$—make the following statements:

- $X$ says: "$Y$ is a liar."
- $Y$ says: "$X$ and $Z$ are of the same type."
- $Z$ says: "$Y$ is a truth-teller."

Which of the following correctly identifies the types of $X, Y,$ and $Z$?

(A) $X$ is a truth-teller, $Y$ is a liar, and $Z$ is a liar
(B) $X$ is a liar, $Y$ is a truth-teller, and $Z$ is a liar
(C) $X$ is a liar, $Y$ is a liar, and $Z$ is a truth-teller
(D) $X$ is a truth-teller, $Y$ is a truth-teller, and $Z$ is a liar

### Solution
Let $T$ denote a Truth-teller and $L$ denote a Liar.

Let us test the possible identities of resident $Z$:

- **Case 1: Assume $Z$ is a Truth-teller ($Z \in T$).**
  - Since $Z$ tells the truth, $Z$'s statement *"Y is a truth-teller"* must be TRUE.
  - Thus, $Y \in T$.
  - Since $Y$ is a truth-teller, $Y$'s statement *"$X$ and $Z$ are of the same type"* must be TRUE.
  - Because $Z \in T$, it follows that $X \in T$.
  - Now check $X$'s statement: $X$ says *"$Y$ is a liar"*.
  - But we established $Y \in T$, meaning $X$'s statement is FALSE.
  - A truth-teller cannot make a false statement. Contradiction!
  - Therefore, the assumption that $Z \in T$ is impossible.

- **Case 2: $Z$ is a Liar ($Z \in L$).**
  - Since $Z$ is a liar, $Z$'s statement *"Y is a truth-teller"* must be FALSE.
  - Therefore, $Y$ is a Liar ($Y \in L$).
  - Since $Y$ is a liar, $Y$'s statement *"$X$ and $Z$ are of the same type"* must be FALSE.
  - This means $X$ and $Z$ must be of **different** types.
  - Since $Z \in L$, $X$ must be a Truth-teller ($X \in T$).
  - Now verify $X$'s statement: $X$ says *"$Y$ is a liar"*.
  - Since $Y \in L$, $X$'s statement is indeed TRUE.
  - This perfectly matches $X \in T$.

The unique consistent assignment is:
- $X$ is a Truth-teller
- $Y$ is a Liar
- $Z$ is a Liar

Hence, (A) is the correct option.

## Q9
type: MCQ
marks: 2
subject: general-aptitude
answer: C

Consider the standard net of a cube shown below, consisting of six square faces labeled with integers $1$ to $6$:

```text
       [ 1 ]
   [ 2 ][ 3 ][ 4 ][ 5 ]
       [ 6 ]
```

When this net is folded along the lines to form a closed three-dimensional cube, three faces meet at each of the cube's 8 vertices.

What is the MAXIMUM possible sum of the numbers on the three faces that meet at a single vertex?

(A) 13
(B) 14
(C) 15
(D) 16

### Solution
Let us determine the pairs of opposite faces when the net is folded into a cube:

1. **Identifying Opposite Faces:**
   - In the continuous horizontal strip of four faces $[2][3][4][5]$, alternating faces become opposite:
     - Face $2$ is opposite to Face $4$.
     - Face $3$ is opposite to Face $5$.
   - The top and bottom flaps attached to Face $3$ fold to form the top and bottom of the cube:
     - Face $1$ is opposite to Face $6$.

2. **Vertex Geometry of a Cube:**
   - A cube has 8 vertices.
   - At every vertex, exactly three mutually adjacent faces meet.
   - Two faces that are **opposite** to each other can **never** meet at a vertex (opposite faces share neither an edge nor a vertex).
   - Therefore, the three faces meeting at any vertex must be chosen by selecting **exactly one face from each of the three opposite pairs**:
     $$\text{Pair 1: } \{1, 6\}, \quad \text{Pair 2: } \{2, 4\}, \quad \text{Pair 3: } \{3, 5\}$$
   - Since there are $2 \times 2 \times 2 = 8$ ways to pick one face from each pair, each of the 8 selections corresponds to exactly one vertex of the cube!

3. **Maximizing the Vertex Sum:**
   To obtain the maximum possible sum at a vertex, we select the maximum number from each opposite pair:
   - From Pair 1: $\max(1, 6) = 6$
   - From Pair 2: $\max(2, 4) = 4$
   - From Pair 3: $\max(3, 5) = 5$

   The three faces meeting at this vertex are $\{4, 5, 6\}$.
   $$\text{Maximum Sum} = 6 + 4 + 5 = 15$$

*(Verification: The faces 4, 5, and 6 indeed share a common corner vertex in the folded cube).*

Hence, (C) is the correct option.

## Q10
type: NAT
marks: 2
subject: general-aptitude
answer: 25

A surveillance drone starts from a base station located at the origin $O(0, 0)$ and executes the following navigation maneuvers:
1. Flies $40\text{ meters}$ due North.
2. Turns $90^\circ$ clockwise and flies $30\text{ meters}$ due East.
3. Turns $135^\circ$ clockwise and flies $50\sqrt{2}\text{ meters}$ in a straight line.
4. Finally, turns $135^\circ$ clockwise and flies $25\text{ meters}$ in a straight line.

The straight-line Euclidean distance from the base station $O(0, 0)$ to the drone's final position is ______ meters.

### Solution
Let us trace the drone's trajectory in the Cartesian $xy$-plane, where the positive $x$-axis represents East and the positive $y$-axis represents North:

- **Start:** $P_0 = (0, 0)$.

- **Leg 1:**
  - Moves $40\text{ m}$ North.
  - Displacement: $\vec{d}_1 = (0, 40)$.
  - Position: $P_1 = (0, 40)$.
  - Heading: North ($+y$, angle $90^\circ$).

- **Leg 2:**
  - Turns $90^\circ$ clockwise from North $\implies$ now heading East ($+x$, angle $0^\circ$).
  - Moves $30\text{ m}$ East.
  - Displacement: $\vec{d}_2 = (30, 0)$.
  - Position: $P_2 = (0 + 30, 40 + 0) = (30, 40)$.
  - Heading: East (angle $0^\circ$).

- **Leg 3:**
  - Turns $135^\circ$ clockwise from East:
    $$\text{New Heading} = 0^\circ - 135^\circ = -135^\circ \equiv 225^\circ \text{ (South-West)}$$
  - Distance: $50\sqrt{2}\text{ m}$.
  - Displacement vector:
    $$\Delta x_3 = 50\sqrt{2} \cos(-135^\circ) = 50\sqrt{2} \left(-\frac{1}{\sqrt{2}}\right) = -50\text{ m}$$
    $$\Delta y_3 = 50\sqrt{2} \sin(-135^\circ) = 50\sqrt{2} \left(-\frac{1}{\sqrt{2}}\right) = -50\text{ m}$$
  - Position:
    $$P_3 = (30 - 50, 40 - 50) = (-20, -10)$$
  - Heading: South-West (angle $225^\circ$).

- **Leg 4:**
  - Turns $135^\circ$ clockwise from South-West:
    $$\text{New Heading} = 225^\circ - 135^\circ \text{ (clockwise)} \implies 225^\circ - 135^\circ = 90^\circ \text{ (due North)}$$
  - Distance: $25\text{ m}$.
  - Displacement vector:
    $$\Delta x_4 = 0, \quad \Delta y_4 = 25\text{ m}$$
  - Position:
    $$P_4 = (-20 + 0, -10 + 25) = (-20, 15)$$

- **Straight-Line Distance from Base Station $O(0, 0)$:**
  $$d = \sqrt{(x_4 - 0)^2 + (y_4 - 0)^2} = \sqrt{(-20)^2 + (15)^2} = \sqrt{400 + 225} = \sqrt{625} = 25\text{ meters}$$

Hence, the answer is 25.
