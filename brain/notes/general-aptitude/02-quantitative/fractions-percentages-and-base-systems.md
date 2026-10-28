# Fractions, Percentages & Base-n Systems

## TL;DR
Avoid long division by converting fractions into 4 percentage families. Apply the multiplier method ($1 \pm \frac{r}{100}$) for rapid 1-step percentage calculations. In base $b$, the value is $\sum d_i b^i$, and all digits must satisfy $0 \le d_i < b$ ($b > \max d_i$).

## Core idea
- **The 4 Fraction $\leftrightarrow$ Percentage Families:**
  - **Halvers (Powers of 2):**
    - $\frac{1}{2} = 50\%$
    - $\frac{1}{4} = 25\%$
    - $\frac{1}{8} = 12.5\%$ ($\frac{3}{8} = 37.5\%$, $\frac{5}{8} = 62.5\%$, $\frac{7}{8} = 87.5\%$)
    - $\frac{1}{16} = 6.25\%$
  - **Thirds & Sixths:**
    - $\frac{1}{3} = 33.33\%$ ($\frac{2}{3} = 66.66\%$)
    - $\frac{1}{6} = 16.66\%$ ($\frac{5}{6} = 100\% - 16.66\% = 83.33\%$)
    - $\frac{1}{12} = 8.33\%$
  - **Fifths & Tenths:**
    - $\frac{1}{5} = 20\%$, $\frac{2}{5} = 40\%$, $\frac{3}{5} = 60\%$, $\frac{4}{5} = 80\%$
    - $\frac{1}{10} = 10\%$, $\frac{1}{20} = 5\%$
  - **The Twins (9s and 11s flip):**
    - $\frac{1}{9} = 11.11\%$ (multiples follow table of 11: $\frac{2}{9} = 22.22\%$, $\frac{4}{9} = 44.44\%$)
    - $\frac{1}{11} = 9.09\%$ (multiples follow table of 9: $\frac{2}{11} = 18.18\%$, $\frac{3}{11} = 27.27\%$, $\frac{4}{11} = 36.36\%$)
  - **The 7 Family (Double-Double Rule):**
    - $\frac{1}{7} = 14.28\%$ ($7 \times 2 = 14$; double 14 $\to 28$)
    - $\frac{2}{7} = 28.56\%$ ($28.57\%$)
    - $\frac{1}{14} = 7.14\%$
- **The Multiplier Method:**
  - An increase of $r\% \implies \text{multiply by } (1 + \frac{r}{100})$.
    - $+25\% \implies \times 1.25$ or $\times \frac{5}{4}$.
    - $+12.5\% \implies \times \frac{9}{8}$.
  - A decrease of $r\% \implies \text{multiply by } (1 - \frac{r}{100})$.
    - $-20\% \implies \times 0.80$ or $\times \frac{4}{5}$.
    - $-33.33\% \implies \times \frac{2}{3}$.
- **Base-$n$ Positional Weighting:**
  - Any number $(d_k \dots d_1 d_0)_b = d_k b^k + \dots + d_1 b^1 + d_0 b^0$.
  - To solve base equations, convert all terms to base 10 and solve the polynomial for $b$.

## Where I got confused → what made it click
- **Using decimals instead of fractions:** In GATE, numbers are engineered to cancel with denominators. An increase of $12.5\%$ on $640$ is just $640 \times \frac{9}{8} = 80 \times 9 = 720$. No virtual calculator needed.
- **The Complement Trick:** When the numerator is 1 less than the denominator ($\frac{3}{4}, \frac{4}{5}, \frac{5}{6}$), subtract 1 slice from $100\%$ ($100\% - 16.66\% = 83.33\%$).
- **Base Validity Constraint:** Every digit in base $b$ must be strictly less than $b$. If an algebraic quadratic yields $b=5$ and $b=8$, but a term contains the digit $6$ (e.g. $(26)_b$), $b=5$ is impossible and must be discarded.

## GATE traps
- **Squaring both sides in base equations:** When solving $\sqrt{(41)_b} = (5)_b$, square both sides first: $(41)_b = (5)_b^2$. In base 10: $4b + 1 = 25 \implies 4b = 24 \implies b = 6$. Always verify $b > \max(\text{digits}) \implies 6 > 5$ (valid).
- **Base cannot be negative or fractional:** Reject extraneous negative or non-integer roots.

## Example
> **Question (GATE):** Given the base equation $(23)_b + (44)_b = (111)_b$, what is the base $b$?  
> **Solution:**  
> 1. Expand in base 10: $(2b + 3) + (4b + 4) = 1 \cdot b^2 + 1 \cdot b + 1$  
> 2. Simplify: $6b + 7 = b^2 + b + 1 \implies b^2 - 5b - 6 = 0$  
> 3. Factor: $(b - 6)(b + 1) = 0 \implies b = 6$ (discarding $b = -1$).  
> 4. Check digits: $\{2, 3, 4, 1\} < 6$. Valid. $b = 6$.