---
title: "General Aptitude · Day 03 Cyclicity, Remainders & Roots Mock"
duration: 25
created: 2026-11-03
description: "Day 3 GA Mock: Root Set R3 (Size & Number), Unit Digits & Cyclicity, Remainder Theorems, Exponent Comparisons, and Surds Simplification."
---

## Q1
type: MCQ
marks: 1
subject: general-aptitude
topic: verbal
answer: A

The newly appointed CEO was widely praised for her ________ attitude; rather than taking revenge on the whistleblowers who had criticized the previous management, she promoted them to lead key audit committees.

(A) magnanimous
(B) megalomaniacal
(C) monotonous
(D) duplicitous

### Solution
- The context describes an executive who showed generosity, nobility of spirit, and forgiveness rather than pettiness or vengeance.
- The root `magn-` (great/large) $+$ `animus` (mind/spirit) yields **magnanimous** (generous in forgiving an insult or injury; high-minded and noble).
- Why the other options are wrong:
  - (B) *megalomaniacal* (`mega-` large $+$ `mania` madness) describes an obsessive delusion of grand self-importance or omnipotent power.
  - (C) *monotonous* (`mono-` single $+$ `tonos` tone) means tediously unvarying or lacking diversity.
  - (D) *duplicitous* (`du-` two) means deceitful or double-dealing.

## Q2
type: MCQ
marks: 1
subject: general-aptitude
topic: verbal
answer: B

While many localized diseases remain endemic to specific geographic regions, the rapid transmission of the virus across multiple continents prompted global health organizations to classify it as a ________.

(A) panoply
(B) pandemic
(C) microcosm
(D) panorama

### Solution
- The context describes a disease that has spread globally across all populations and continents.
- The root `pan-` (all/whole) $+$ `demos` (people) forms **pandemic** (an epidemic occurring worldwide or over an extensive area crossing international boundaries).
- Why the other options are wrong:
  - (A) *panoply* (`pan-` all $+$ `hopla` arms/armor) refers to an extensive, impressive array or complete suit of armor.
  - (C) *microcosm* (`micro-` small $+$ `kosmos` world) means a miniature representation of a larger system.
  - (D) *panorama* (`pan-` all $+$ `horama` sight/view) means an unobstructed, comprehensive visual view of an entire region.

## Q3
type: MSQ
marks: 2
subject: general-aptitude
topic: verbal
answer: A, B, C

Which of the following statements correctly uses the highlighted word derived from roots of size, scope, or number?

(A) An engineer with recognized expertise across compiler theory, operating systems, distributed algorithms, and hardware architecture is genuinely a **polymath**.
(B) A software system where the entire application—including UI, business logic, and database access—is bundled and deployed as a single indivisible binary is structured as a **monolithic** architecture.
(C) When a character in a drama delivers an extended theatrical speech expressing their private thoughts aloud to the audience, it is defined as a **monologue**.
(D) A negotiator who openly discloses all financial ledgers without withholding any facts is conducting negotiations with complete **duplicity**.

### Solution
- (A) `poly-` (many) $+$ `mathema` (learning/knowledge). A *polymath* is a person whose expertise spans multiple diverse fields. This statement is correct.
- (B) `mono-` (one) $+$ `lithos` (stone). A *monolith* is a single massive, uniform, indivisible block. In software engineering, a monolithic architecture bundles all tiers into one deployment unit. This statement is correct.
- (C) `mono-` (one) $+$ `logos` (speech/word). A *monologue* is an extended speech delivered by a single speaker. This statement is correct.
- (D) `du-` (two) $\to$ *duplicity* means double-dealing, bad faith, or intentional deceit (acting with two faces). Completely honest and transparent disclosure is the exact antithesis of duplicity. Hence (D) is incorrect.

## Q4
type: MCQ
marks: 1
subject: general-aptitude
topic: quantitative
answer: B

What is the unit digit of the product:

$$P = 3^{65} \times 6^{59} \times 7^{71}$$

(A) 2
(B) 4
(C) 6
(D) 8

### Solution
- Isolate the unit digit behavior of each base:
  1. Base $3$ has cyclicity of $4$ ($3, 9, 7, 1$):
     - $65 \div 4 = 16$ with remainder $1$.
     - Unit digit of $3^{65} = 3^1 = 3$.
  2. Base $6$ has constant cyclicity ($6^k$ always ends in $6$):
     - Unit digit of $6^{59} = 6$.
  3. Base $7$ has cyclicity of $4$ ($7, 9, 3, 1$):
     - $71 \div 4 = 17$ with remainder $3$.
     - Unit digit of $7^{71} = 7^3 = 343 \to 3$.
- Multiply the unit digits:
  $$\text{Unit Digit} = (3 \times 6 \times 3) \pmod{10} = 54 \pmod{10} = 4$$
- Therefore, (B) is the correct option.

## Q5
type: NAT
marks: 1
subject: general-aptitude
topic: quantitative
answer: 3

Consider the expression $E = (852)^{81} - (417)^{74}$. What is the unit digit of $E$?

### Solution
- Since $852 > 417$ and $81 > 74$, $(852)^{81} > (417)^{74}$, so $E$ is positive.
- Find the unit digit of each term:
  1. For $(852)^{81}$:
     - Last digit is $2$.
     - Cyclicity of $2$ is $4$ ($2, 4, 8, 6$).
     - $81 \pmod 4 = 1 \implies 2^1 = 2$.
     - Term $(852)^{81}$ ends in $2$.
  2. For $(417)^{74}$:
     - Last digit is $7$.
     - Cyclicity of $7$ is $4$ ($7, 9, 3, 1$).
     - $74 \pmod 4 = 2 \implies 7^2 = 49 \to 9$.
     - Term $(417)^{74}$ ends in $9$.
- Subtract the unit digits with borrowing:
  - We have $(\dots 2) - (\dots 9)$.
  - Since $2 < 9$, borrow $1$ from the tens position:
    $$\text{Unit digit} = 12 - 9 = 3$$
- The unit digit of $E$ is $3$.

## Q6
type: MCQ
marks: 1
subject: general-aptitude
topic: quantitative
answer: D

What is the remainder when $3^{102}$ is divided by $10$?

(A) 1
(B) 3
(C) 7
(D) 9

### Solution
- **Method 1 (Remainder using $\pm 1$ bridge):**
  - Notice that $3^2 = 9 \equiv -1 \pmod{10}$.
  - Rewrite $3^{102}$:
    $$3^{102} = (3^2)^{51} \equiv (-1)^{51} \pmod{10}$$
  - Since $51$ is odd:
    $$(-1)^{51} = -1 \equiv 10 - 1 = 9 \pmod{10}$$
- **Method 2 (Unit digit property):**
  - The remainder when any integer is divided by $10$ is simply its unit digit.
  - Exponent $102 \pmod 4 = 2 \implies 3^2 = 9$.
- Hence, the remainder is $9$. Option (D) is correct.

## Q7
type: NAT
marks: 2
subject: general-aptitude
topic: quantitative
answer: 2

What is the remainder when the integer $S = 2^{60} + 3^{60}$ is divided by $7$?

### Solution
- By modular arithmetic, $(A + B) \pmod 7 = [(A \pmod 7) + (B \pmod 7)] \pmod 7$.
- **Term 1 ($2^{60} \pmod 7$):**
  - Notice $2^3 = 8 \equiv 1 \pmod 7$.
  - $2^{60} = (2^3)^{20} \equiv (1)^{20} = 1 \pmod 7$.
- **Term 2 ($3^{60} \pmod 7$):**
  - Check small powers of $3 \pmod 7$:
    - $3^1 = 3$
    - $3^2 = 9 \equiv 2 \pmod 7$
    - $3^3 = 27 \equiv 6 \equiv -1 \pmod 7$.
  - Express $3^{60}$ in terms of $3^3$:
    $$3^{60} = (3^3)^{20} \equiv (-1)^{20} = 1 \pmod 7$$
- **Summing the remainders:**
  $$S \equiv 1 + 1 = 2 \pmod 7$$
- The remainder is $2$.

## Q8
type: MCQ
marks: 2
subject: general-aptitude
topic: quantitative
answer: A

Consider the four numbers:

$$P = 2^{72}, \quad Q = 3^{48}, \quad R = 5^{24}, \quad S = 11^{12}$$

Which of the following represents their correct ascending order?

(A) $S < R < P < Q$
(B) $S < P < R < Q$
(C) $R < S < Q < P$
(D) $P < S < R < Q$

### Solution
- To compare giant powers, make their exponents equal using the Highest Common Factor (HCF) of the powers.
- The powers are $72, 48, 24, 12$.
  - Difference between $24$ and $12$ is $12$.
  - Since $12$ divides $72, 48, 24,$ and $12$, $\text{HCF} = 12$.
- Express each number with outer exponent $12$:
  - $P = 2^{72} = (2^6)^{12} = 64^{12}$
  - $Q = 3^{48} = (3^4)^{12} = 81^{12}$
  - $R = 5^{24} = (5^2)^{12} = 25^{12}$
  - $S = 11^{12} = (11^1)^{12} = 11^{12}$
- Comparing the bases:
  $$11 < 25 < 64 < 81$$
  $$\implies 11^{12} < 25^{12} < 64^{12} < 81^{12}$$
  $$\implies S < R < P < Q$$
- Thus, option (A) is correct.

## Q9
type: MCQ
marks: 2
subject: general-aptitude
topic: quantitative
answer: A

Which of the following numbers is the **greatest**?

(A) $\sqrt{3}$
(B) $\sqrt[3]{4}$
(C) $\sqrt[4]{6}$
(D) $\sqrt[6]{12}$

### Solution
- Express each radical as a fractional exponent:
  - (A) $\sqrt{3} = 3^{1/2}$
  - (B) $\sqrt[3]{4} = 4^{1/3}$
  - (C) $\sqrt[4]{6} = 6^{1/4}$
  - (D) $\sqrt[6]{12} = 12^{1/6}$
- Find the LCM of the denominators of the exponents:
  $$\text{LCM}(2, 3, 4, 6) = 12$$
- Raise each number to the $12^{\text{th}}$ power to clear fractional powers:
  - (A) $(3^{1/2})^{12} = 3^6 = 729$
  - (B) $(4^{1/3})^{12} = 4^4 = 256$
  - (C) $(6^{1/4})^{12} = 6^3 = 216$
  - (D) $(12^{1/6})^{12} = 12^2 = 144$
- Comparing the resulting integers:
  $$729 > 256 > 216 > 144$$
- Therefore, $\sqrt{3}$ is the greatest. Option (A) is correct.

## Q10
type: NAT
marks: 2
subject: general-aptitude
topic: quantitative
answer: 8

Evaluate the following sum:

$$S = \frac{1}{\sqrt{1} + \sqrt{2}} + \frac{1}{\sqrt{2} + \sqrt{3}} + \frac{1}{\sqrt{3} + \sqrt{4}} + \dots + \frac{1}{\sqrt{80} + \sqrt{81}}$$

The value of $S$ is ________.

### Solution
- Rationalize the general term by multiplying numerator and denominator by the conjugate $(\sqrt{k+1} - \sqrt{k})$:
  $$\frac{1}{\sqrt{k+1} + \sqrt{k}} \times \frac{\sqrt{k+1} - \sqrt{k}}{\sqrt{k+1} - \sqrt{k}} = \frac{\sqrt{k+1} - \sqrt{k}}{(k+1) - k} = \sqrt{k+1} - \sqrt{k}$$
- Expand the sum using this identity:
  $$S = (\sqrt{2} - \sqrt{1}) + (\sqrt{3} - \sqrt{2}) + (\sqrt{4} - \sqrt{3}) + \dots + (\sqrt{81} - \sqrt{80})$$
- Notice the telescoping cancellation: each positive root cancels with the negative root of the succeeding term.
- Only the first negative root and the final positive root remain:
  $$S = -\sqrt{1} + \sqrt{81} = -1 + 9 = 8$$
- The value of $S$ is $8$.
