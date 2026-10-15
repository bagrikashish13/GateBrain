---
title: General Aptitude · Mock 01
duration: 25
created: 2026-10-15
description: 10 GATE-level General Aptitude questions (MCQ, MSQ, NAT) covering Verbal, Quantitative, Analytical, and Spatial Aptitude.
---

## Q1
type: MCQ
marks: 1
subject: general-aptitude
topic: verbal-ability
answer: B

Complete the sentence with the grammatically correct option:

"He did not know that the information was confidential; had he known, he ______ it to the press."

(A) will not disclose
(B) would not have disclosed
(C) did not disclose
(D) had not disclosed

### Solution
The sentence uses an inverted conditional for an unreal situation in the past (third conditional).
The conditional clause "had he known" is equivalent to "if he had known".
The standard structure of the third conditional is:
- If-clause: `If + past perfect` (or inverted: `Had + subject + past participle`)
- Main clause: `subject + would/could/might + have + past participle`

Therefore, "would not have disclosed" (B) is the grammatically correct choice.
- (A) "will not disclose" uses future tense, which cannot follow an unreal past condition.
- (C) "did not disclose" is simple past, failing to convey the hypothetical/unreal mood.
- (D) "had not disclosed" incorrectly duplicates the past perfect auxiliary in the main clause.

## Q2
type: MCQ
marks: 1
subject: general-aptitude
topic: analytical-aptitude
answer: B

Given the following statements:
1. All engineers are problem solvers.
2. Some problem solvers are researchers.
3. No researcher is an artist.

Which of the following conclusions logically follows from the given statements?

(A) Some engineers are definitely researchers.
(B) Some problem solvers are not artists.
(C) No engineer is an artist.
(D) All researchers are problem solvers.

### Solution
Let $E$, $P$, $R$, and $A$ represent the sets of engineers, problem solvers, researchers, and artists, respectively:
- Statement 1: $E \subseteq P$
- Statement 2: $P \cap R \neq \emptyset$ (There exists at least one element $x$ such that $x \in P$ and $x \in R$)
- Statement 3: $R \cap A = \emptyset$ (No element of $R$ is in $A$)

Evaluating the conclusions:
- (B) From Statement 2, there are problem solvers who are researchers ($x \in P \cap R$). From Statement 3, no researcher can be an artist ($x \notin A$). Thus, those problem solvers who are researchers cannot be artists. Therefore, "Some problem solvers are not artists" is logically valid.
- (A) $E$ and $R$ are both subsets/intersecting with $P$, but $E$ and $R$ may be completely disjoint.
- (C) $E$ may or may not overlap with $A$; nothing prohibits an engineer who is not a researcher from being an artist.
- (D) Statement 2 asserts that "Some problem solvers are researchers", which does not imply the converse that all researchers are problem solvers.

## Q3
type: MCQ
marks: 1
subject: general-aptitude
topic: spatial-aptitude
answer: C

A flat cardboard sheet is folded along the grid lines to form a closed cube without any overlaps. The net of the cube is shown below:

```
      +---+
      | 1 |
  +---+---+---+---+
  | 2 | 3 | 4 | 5 |
  +---+---+---+---+
          | 6 |
          +---+
```

Which of the following pairs of numbered faces will be OPPOSITE to each other in the folded cube?

(A) 1 and 4
(B) 2 and 5
(C) 3 and 5
(D) 3 and 6

### Solution
In a continuous four-square strip of a cube net, alternating faces fold to become opposite faces because folding each consecutive edge introduces a $90^\circ$ turn:
- Face 2 and Face 4 are separated by Face 3 $\implies$ Face 2 is opposite Face 4.
- Face 3 and Face 5 are separated by Face 4 $\implies$ Face 3 is opposite Face 5.

The remaining two tabs (Face 1 on top of Face 3, and Face 6 below Face 4) fold up and down respectively to become the top and bottom faces $\implies$ Face 1 is opposite Face 6.

Therefore, the only correct opposite pair among the options is 3 and 5 (Option C).

## Q4
type: MCQ
marks: 1
subject: general-aptitude
topic: quantitative-aptitude
answer: C

A train running at a uniform speed of $72\text{ km/h}$ crosses an electric pole in $12\text{ seconds}$. How long (in seconds) will this train take to completely cross a stationary platform of length $360\text{ meters}$?

(A) 18
(B) 24
(C) 30
(D) 36

### Solution
Convert the speed from $\text{km/h}$ to $\text{m/s}$:
$$\text{Speed} = 72 \times \frac{5}{18} = 20\text{ m/s}$$

When the train crosses a pole (negligible width), distance covered equals the length of the train ($L_T$):
$$L_T = \text{Speed} \times \text{Time} = 20\text{ m/s} \times 12\text{ s} = 240\text{ m}$$

When crossing a platform of length $L_P = 360\text{ m}$, the total distance to be covered is:
$$D = L_T + L_P = 240 + 360 = 600\text{ m}$$

Time required to cross the platform:
$$t = \frac{D}{\text{Speed}} = \frac{600\text{ m}}{20\text{ m/s}} = 30\text{ seconds}$$

## Q5
type: NAT
marks: 1
subject: general-aptitude
topic: quantitative-aptitude
answer: 38

The sum of the digits of a two-digit positive integer is 11. If the digits are reversed, the resulting number is 45 greater than the original number. The original number is ______.

### Solution
Let the two-digit number be represented as $10x + y$, where $x$ is the tens digit and $y$ is the units digit ($1 \le x \le 9$ and $0 \le y \le 9$).

Given:
1. $x + y = 11$
2. The reversed number is $10y + x$, and $(10y + x) - (10x + y) = 45$:
   $$9(y - x) = 45 \implies y - x = 5$$

Adding the two equations:
$$(x + y) + (y - x) = 11 + 5 \implies 2y = 16 \implies y = 8$$

Substituting $y = 8$ into $x + y = 11$:
$$x = 11 - 8 = 3$$

Hence, the original number is $10(3) + 8 = 38$.
(Check: $83 - 38 = 45$ and $3 + 8 = 11$).

## Q6
type: MCQ
marks: 2
subject: general-aptitude
topic: verbal-ability
answer: C

Read the passage below and answer the question that follows:

"Technological disruptions have historically created more jobs than they destroyed. However, the transitions have never been painless; workers displaced by mechanization often lacked the specialized skills required for newly created sectors, resulting in prolonged periods of wage stagnation and regional unemployment. Therefore, celebrating long-term macroeconomic gains without actively implementing retraining and safety-net programs ignores the substantial human cost of economic evolution."

Which of the following statements can be most reasonably inferred from the passage?

(A) Technological progress invariably leads to a net reduction in overall employment in the long run.
(B) Historical transitions were painful primarily because displaced workers refused to relocate to areas with new opportunities.
(C) Positive long-term employment outcomes do not negate the necessity of transitional support for affected workers.
(D) Retraining programs have historically proven ineffective at reducing wage stagnation during technological disruptions.

### Solution
- (C) is directly supported by the passage. The author states that while technology creates more jobs in the aggregate, the transition causes wage stagnation and unemployment, so celebrating macro gains without retraining and safety nets ignores human costs. Hence, positive long-term outcomes do not eliminate the need for short-term support.
- (A) directly contradicts the passage ("created more jobs than they destroyed").
- (B) introduces an unsupported distortion: the passage mentions workers "lacked the specialized skills", not that they refused to relocate.
- (D) is contrary to the author's stance, which advocates for retraining and safety-net programs rather than calling them ineffective.

## Q7
type: MCQ
marks: 2
subject: general-aptitude
topic: quantitative-aptitude
answer: B

A box contains 5 red balls, 4 green balls, and 3 blue balls. If three balls are drawn at random one after another without replacement, what is the probability that all three drawn balls are of different colours?

(A) $\frac{1}{22}$
(B) $\frac{3}{11}$
(C) $\frac{3}{22}$
(D) $\frac{6}{11}$

### Solution
Total number of balls $= 5 + 4 + 3 = 12$.

The total number of ways to choose 3 balls out of 12 without replacement is:
$$\binom{12}{3} = \frac{12 \times 11 \times 10}{3 \times 2 \times 1} = 220$$

The number of favorable outcomes where all three balls are of different colours (1 red, 1 green, 1 blue) is:
$$\binom{5}{1} \times \binom{4}{1} \times \binom{3}{1} = 5 \times 4 \times 3 = 60$$

Therefore, the required probability is:
$$P = \frac{60}{220} = \frac{6}{22} = \frac{3}{11}$$

Alternatively, using ordered draws:
There are $3! = 6$ possible orderings of RGB.
Probability of a specific sequence (e.g., Red then Green then Blue) is:
$$P(R_1 \cap G_2 \cap B_3) = \frac{5}{12} \times \frac{4}{11} \times \frac{3}{10} = \frac{60}{1320} = \frac{1}{22}$$
Multiplying by $3! = 6$ orderings:
$$6 \times \frac{1}{22} = \frac{3}{11}$$

## Q8
type: MSQ
marks: 2
subject: general-aptitude
topic: analytical-aptitude
answer: A, B, C

Consider four distinct positive integers $a, b, c,$ and $d$ such that $a < b < c < d$. The arithmetic mean of the four integers is $20$, and their median is $18$. Which of the following statements is/are TRUE?

(A) The maximum possible value of $b$ is 17
(B) The minimum possible value of $d$ is 28
(C) The value of $(a + d)$ is 44
(D) The value of $d$ can be 25

### Solution
Given that $a < b < c < d$ are positive integers:
1. Mean is 20:
   $$\frac{a + b + c + d}{4} = 20 \implies a + b + c + d = 80$$
2. For an even number of sorted observations, the median is the average of the two middle elements:
   $$\frac{b + c}{2} = 18 \implies b + c = 36$$
3. Therefore:
   $$(a + d) = (a + b + c + d) - (b + c) = 80 - 36 = 44$$
   This proves **(C)** is TRUE.

Now evaluate the constraints on individual values:
- Since $b$ and $c$ are integers with $b < c$ and $b + c = 36$:
  If $b = 18$, then $c = 18$, violating $b < c$. Thus, $b \le 17$ and $c \ge 19$.
  If $b = 17$, $c = 19$, we can pick $a = 16$ and $d = 44 - 16 = 28$.
  All conditions $16 < 17 < 19 < 28$ are satisfied.
  Thus, the maximum possible value of $b$ is 17. This proves **(A)** is TRUE.

- To minimize $d$, we must maximize $a$ because $d = 44 - a$.
  Since $a < b$ and $b \le 17$, the maximum possible integer value of $a$ is $16$.
  When $a = 16$, $d = 44 - 16 = 28$.
  Because $c \ge 19$, $d = 28$ satisfies $c < d$ ($19 < 28$).
  Thus, the minimum possible value of $d$ is 28. This proves **(B)** is TRUE.

- Since the minimum possible value of $d$ is 28, $d$ cannot be 25. Thus **(D)** is FALSE.

Hence, the correct options are A, B, and C.

## Q9
type: NAT
marks: 2
subject: general-aptitude
topic: quantitative-aptitude
answer: 40

A motorist travels from Town A to Town B at a constant speed of $60\text{ km/h}$. On the return journey from Town B to Town A along the exact same route, the motorist travels at a constant speed of $v\text{ km/h}$. If the average speed for the entire round trip is $48\text{ km/h}$, the value of $v$ (in $\text{km/h}$) is ______.

### Solution
Let the distance between Town A and Town B be $D\text{ km}$.

Time taken for the forward journey:
$$t_1 = \frac{D}{60}$$

Time taken for the return journey:
$$t_2 = \frac{D}{v}$$

Total distance covered $= 2D$.
Total time taken $= t_1 + t_2 = \frac{D}{60} + \frac{D}{v} = D\left(\frac{1}{60} + \frac{1}{v}\right) = D\left(\frac{v + 60}{60v}\right)$

The average speed is the total distance divided by the total time:
$$\text{Average Speed} = \frac{2D}{D\left(\frac{v + 60}{60v}\right)} = \frac{2 \times 60v}{v + 60} = \frac{120v}{v + 60}$$

Given that the average speed is $48\text{ km/h}$:
$$48 = \frac{120v}{v + 60}$$

Dividing both sides by 24:
$$2 = \frac{5v}{v + 60}$$

$$2(v + 60) = 5v \implies 2v + 120 = 5v \implies 3v = 120 \implies v = 40\text{ km/h}$$

*(Common GATE Trap: Taking the simple arithmetic average $\frac{60 + v}{2} = 48 \implies v = 36$, which is incorrect because average speed over equal distances is the harmonic mean of speeds, not arithmetic mean.)*

## Q10
type: NAT
marks: 2
subject: general-aptitude
topic: quantitative-aptitude
answer: 150

Five distinct balls are to be distributed among three distinct boxes such that no box remains empty. The total number of ways to distribute the balls is ______.

### Solution
This is the problem of finding the number of surjective (onto) mappings from a set of 5 distinct elements to a set of 3 distinct targets.

**Method 1: Principle of Inclusion-Exclusion (PIE)**
Total unrestricted ways to put 5 distinct balls into 3 distinct boxes $= 3^5 = 243$.

Using PIE:
- Number of distributions where at least 1 specified box is empty: $\binom{3}{1} \times 2^5 = 3 \times 32 = 96$
- Number of distributions where at least 2 specified boxes are empty: $\binom{3}{2} \times 1^5 = 3 \times 1 = 3$
- Number of distributions where all 3 boxes are empty: $\binom{3}{3} \times 0^5 = 0$

By Inclusion-Exclusion:
$$\text{Number of valid ways} = 3^5 - \binom{3}{1} 2^5 + \binom{3}{2} 1^5 = 243 - 96 + 3 = 150$$

**Method 2: Grouping / Partitions**
Since no box is empty, the 5 balls can be partitioned into 3 non-empty groups in two ways:
1. **Group sizes (3, 1, 1):**
   - Number of ways to choose which box gets 3 balls: $\binom{3}{1} = 3$
   - Number of ways to choose 3 balls for that box: $\binom{5}{3} = 10$
   - The remaining 2 balls are placed into the 2 remaining boxes: $2! = 2$
   - Total for this case $= 3 \times 10 \times 2 = 60$

2. **Group sizes (2, 2, 1):**
   - Number of ways to choose which box gets 1 ball: $\binom{3}{1} = 3$
   - Number of ways to choose 1 ball for that box: $\binom{5}{1} = 5$
   - Number of ways to choose 2 balls from the remaining 4 for the second box: $\binom{4}{2} = 6$
   - The last 2 balls go into the last box: $\binom{2}{2} = 1$
   - Total for this case $= 3 \times 5 \times 6 = 90$

$$\text{Total ways} = 60 + 90 = 150$$
