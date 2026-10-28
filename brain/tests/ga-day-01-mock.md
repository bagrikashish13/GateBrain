---
title: "General Aptitude · Day 01 Foundations Mock"
duration: 25
created: 2026-10-28
description: "Foundations of GA: Root Set R1, Divisibility Rules, Factor Counting, and HCF/LCM."
---

## Q1
type: MCQ
marks: 1
subject: general-aptitude
topic: verbal
answer: A

The psychologist observed that while the patient had previously experienced severe episodes of ________, marked by prolonged sadness and emotional despair, the recent counseling sessions had fostered a distinct state of calm and ________.

(A) dysphoria, euphoria
(B) euphoria, dysphoria
(C) dysentery, cacophony
(D) dystrophy, eulogy

### Solution
- The first blank describes "prolonged sadness and emotional despair" $\to$ negative emotional state. The root `dys-` means bad, painful, or abnormal; `dysphoria` means a state of unease or generalized dissatisfaction.
- The second blank is contrasted with the first ("while the patient had previously... recent sessions had fostered...") and paired with "calm" $\to$ positive state. The root `eu-` means pleasant, good, or well; `euphoria` means a state of intense happiness and well-being.
- Why the other options are wrong:
  - (B) reverses the timeline of emotional states.
  - (C) *dysentery* refers to an intestinal infection; *cacophony* means harsh, jarring noise.
  - (D) *dystrophy* is the wasting away of muscle or tissue; *eulogy* is a formal speech of praise.

## Q2
type: MCQ
marks: 1
subject: general-aptitude
topic: verbal
answer: A

Which of the following sentences employs the term **euphemism** correctly?

(A) Describing an employee as "taking an early retirement opportunity" instead of "dismissed" is a common corporate euphemism.
(B) Calling the "electric eel" an eel is a well-known euphemism, although it is actually a knife-fish.
(C) Accidentally uttering "a lack of moisture" instead of "a lack of posture" is a typical verbal euphemism.
(D) The shrill, deafening screech of train brakes was termed a pleasant euphemism by the commuter.

### Solution
- A **euphemism** (`eu-` = pleasant/good $+$ `pheme` = speech) is an inoffensive, polite, or mild expression substituted for one considered offensive, harsh, or blunt.
- In (A), "early retirement opportunity" is a gentle phrasing substituted for the blunt word "dismissed". Thus, (A) is completely correct.
- Why the other options are wrong:
  - (B) describes a **misnomer** (`mis-` = wrong $+$ `nomen` = name), which is a factually inaccurate name or label.
  - (C) describes a **malapropism** or slip of the tongue (confusing similar-sounding words).
  - (D) describes an acoustic contradiction (*cacophony* vs *euphony*), not a euphemism.

## Q3
type: MSQ
marks: 2
subject: general-aptitude
topic: verbal
answer: A, B, C

Which of the following pairs of words represent **ANTONYMS** based on their Greek and Latin root definitions?

(A) Cacophony – Euphony
(B) Benevolent – Malevolent
(C) Eulogy – Dyslogy
(D) Malicious – Malignant

### Solution
- (A) `caco-` (harsh, unpleasant) $+$ `phon` (sound) vs. `eu-` (sweet, pleasant) $+$ `phon` (sound). These are direct antonyms (harsh discordant noise vs. harmonious pleasant sound).
- (B) `bene-` (good) $+$ `vol` (wish/will) vs. `male-` (bad/evil) $+$ `vol` (wish/will). These are direct antonyms (kind-hearted/wishing well vs. ill-intentioned/wishing harm).
- (C) `eu-` (good/praise) $+$ `log` (speech) vs. `dys-` (bad/unfavorable) $+$ `log` (speech). A *eulogy* is high praise; a *dyslogy* (or dyslogia) is an unfavorable critique or speech expressing disapproval. These are direct antonyms.
- (D) `malicious` (intending harm) and `malignant` (harmful/destructive in effect) are both negative polarity words derived from the root `mal-` (bad/evil). They are near-synonyms, not antonyms.

## Q4
type: MCQ
marks: 1
subject: general-aptitude
topic: quantitative
answer: C

Consider the 5-digit number:

$$34,8X4$$

Which of the following single-digit values of $X$ will make this number divisible by $4$, but **NOT** divisible by $8$?

(A) 1
(B) 2
(C) 4
(D) 6

### Solution
- **Rule of 4:** A number is divisible by 4 if its last two digits form a number divisible by 4.
  - The last two digits are $X4$.
  - For $X = 1$: $14 \div 4 = 3.5$ (NOT divisible by 4 $\to$ excluded).
  - For $X = 2$: $24 \div 4 = 6$ (divisible by 4).
  - For $X = 4$: $44 \div 4 = 11$ (divisible by 4).
  - For $X = 6$: $64 \div 4 = 16$ (divisible by 4).
- **Rule of 8:** A number is divisible by 8 if its last three digits form a number divisible by 8.
  - The last three digits are $8X4$.
  - For $X = 2$: $824 \div 8 = 103$ (divisible by 8 $\to$ fails the "NOT divisible by 8" condition).
  - For $X = 4$: $844 \div 8 = 105.5$ (NOT divisible by 8 $\to$ satisfies both conditions!).
  - For $X = 6$: $864 \div 8 = 108$ (divisible by 8 $\to$ fails the "NOT divisible by 8" condition).
- Therefore, $X = 4$ is the only value among the options that is divisible by 4 but NOT divisible by 8. Option (C) is correct.

## Q5
type: NAT
marks: 2
subject: general-aptitude
topic: quantitative
answer: 9

The 6-digit number $6X291Y$ is completely divisible by $72$, where $X$ and $Y$ are single-digit integers. What is the value of $(X + Y)$?

### Solution
- Since $72 = 8 \times 9$, and $\gcd(8, 9) = 1$, the number must be simultaneously divisible by both $8$ and $9$.
- **Step 1: Apply Rule of 8 (Last 3 digits $91Y$):**
  - Testing digits $0 \le Y \le 9$:
    - $910 / 8 = 113.75$
    - $912 / 8 = 114$ (Exact integer!)
    - Next multiple of 8 with tens digit 1 does not exist ($912 + 8 = 920$).
  - Therefore, $Y = 2$ is uniquely determined.
- **Step 2: Apply Rule of 9 on $6X2912$ (Sum of all digits):**
  - $\text{Sum} = 6 + X + 2 + 9 + 1 + 2 = 20 + X$.
  - For $20 + X$ to be divisible by 9, where $0 \le X \le 9$:
    - $20 + X = 27 \implies X = 7$.
- **Final calculation:**
  - $X + Y = 7 + 2 = 9$.

## Q6
type: NAT
marks: 1
subject: general-aptitude
topic: quantitative
answer: 18

What is the total number of positive factors (divisors) of the integer $180$?

### Solution
- Express $180$ in its canonical prime factorized form:
  $$180 = 18 \times 10 = (2 \times 3^2) \times (2 \times 5) = 2^2 \times 3^2 \times 5^1$$
- For any integer $N = p_1^a \cdot p_2^b \cdot p_3^c$, the total number of divisors is given by:
  $$\text{Total Factors} = (a + 1)(b + 1)(c + 1)$$
- Applying the formula:
  $$\text{Total Factors} = (2 + 1)(2 + 1)(1 + 1) = 3 \times 3 \times 2 = 18$$

## Q7
type: MCQ
marks: 2
subject: general-aptitude
topic: quantitative
answer: B

What is the number of **odd** positive divisors of the integer $360$?

(A) 4
(B) 6
(C) 12
(D) 18

### Solution
- Prime factorize $360$:
  $$360 = 36 \times 10 = (2^2 \times 3^2) \times (2 \times 5) = 2^3 \times 3^2 \times 5^1$$
- An odd divisor cannot contain any factor of $2$. Therefore, we set the power of $2$ strictly to $2^0$ (which gives only $1$ choice).
- The odd divisors are formed entirely from the prime factors $3$ and $5$:
  $$\text{Number of Odd Factors} = (2 + 1) \times (1 + 1) = 3 \times 2 = 6$$
- (Verification: The odd divisors of $360$ are $1, 3, 5, 9, 15, 45$ — exactly 6 divisors).
- Why the other options are wrong:
  - (A) 4 ignores the composite odd divisors like $9$ and $45$.
  - (C) 12 is half of the total factors (total factors $= 4 \times 3 \times 2 = 24$).
  - (D) 18 is the number of *even* divisors ($24 - 6 = 18$).

## Q8
type: MCQ
marks: 1
subject: general-aptitude
topic: quantitative
answer: C

Two positive integers are in the ratio $3 : 4$. If their Highest Common Factor (HCF) is $7$, what is their Least Common Multiple (LCM)?

(A) 28
(B) 42
(C) 84
(D) 168

### Solution
- Let the two numbers be $A$ and $B$.
- When two numbers are in the ratio $a : b$ where $\gcd(a, b) = 1$, the numbers are given by $A = a \cdot H$ and $B = b \cdot H$, where $H = \text{HCF}$.
  - $A = 3 \times 7 = 21$
  - $B = 4 \times 7 = 28$
- Using the fundamental identity:
  $$\text{Product of Numbers} = \text{HCF} \times \text{LCM}$$
  $$21 \times 28 = 7 \times \text{LCM}$$
  $$\text{LCM} = \frac{21 \times 28}{7} = 3 \times 28 = 84$$
- Alternatively: $\text{LCM} = a \times b \times H = 3 \times 4 \times 7 = 84$.
- Therefore, (C) is the correct answer.

## Q9
type: NAT
marks: 2
subject: general-aptitude
topic: quantitative
answer: 216

Three athletes $P$, $Q$, and $R$ start running simultaneously from the same starting point on a circular track in the same direction. They take $24$ seconds, $36$ seconds, and $54$ seconds respectively to complete one full lap. After how many seconds will all three athletes cross the starting point together for the first time?

### Solution
- For the three athletes to cross the starting line together, the elapsed time must be a common multiple of their individual lap times.
- The *first* time they cross the starting line together is given by:
  $$\text{Time} = \text{LCM}(24, 36, 54)$$
- Prime factorization:
  - $24 = 2^3 \times 3^1$
  - $36 = 2^2 \times 3^2$
  - $54 = 2^1 \times 3^3$
- Taking the highest power of each prime factor:
  $$\text{LCM} = 2^3 \times 3^3 = 8 \times 27 = 216\text{ seconds}$$
- (Check: $216/24 = 9\text{ laps}$, $216/36 = 6\text{ laps}$, $216/54 = 4\text{ laps}$. Since all lap counts are integers, all three are at the starting point simultaneously at $t = 216\text{ s}$).

## Q10
type: MCQ
marks: 2
subject: general-aptitude
topic: quantitative
answer: A

What is the remainder when the 100-digit number

$$N = \underbrace{7777\dots77}_{100\text{ digits}}$$

is divided by $11$?

(A) 0
(B) 3
(C) 7
(D) 10

### Solution
- **Method 1 (Alternating sum rule for 11):**
  - A number is divisible by 11 if the difference between the sum of its digits in odd positions and the sum of its digits in even positions is a multiple of 11.
  - Since $N$ has 100 digits, there are exactly 50 digits in odd positions and 50 digits in even positions.
  - $\text{Sum of odd positions} = 50 \times 7 = 350$.
  - $\text{Sum of even positions} = 50 \times 7 = 350$.
  - $\text{Difference} = 350 - 350 = 0$.
  - Since the difference is $0$, the number $N$ is completely divisible by $11$, leaving a remainder of **$0$**.
- **Method 2 (Block grouping):**
  - Notice that $77 = 11 \times 7$, which is a multiple of 11.
  - Any pair $77 \times 10^{2k}$ is divisible by 11.
  - Since 100 is even, $N$ can be partitioned into 50 disjoint two-digit blocks:
    $$N = 77 \times (10^{98} + 10^{96} + \dots + 10^2 + 1)$$
  - Since $11$ divides $77$, $11$ divides $N$ completely. Remainder $= 0$.
- Why (C) is wrong:
  - 7 is the common distractor chosen by students who guess that the remainder is simply the unit digit.
