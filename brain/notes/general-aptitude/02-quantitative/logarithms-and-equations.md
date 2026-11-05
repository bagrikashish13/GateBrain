# Logarithms & Equations

## TL;DR
Power on argument goes to numerator, power on base to denominator: $\log_{b^m}(x^k) = \frac{k}{m} \log_b(x)$. Exponents swap bases: $a^{\log_b(c)} = c^{\log_b(a)}$. Digits in $N$ equal $\lfloor \log_{10}(N) \rfloor + 1$. For quadratics, use Vieta ($\alpha + \beta = -b/a, \alpha\beta = c/a$); for 2-variable lines, no solution means parallel lines ($\frac{a_1}{a_2} = \frac{b_1}{b_2} \neq \frac{c_1}{c_2}$).

## Core idea
- **Logarithm Domain Rules:**
  - In $\log_b(x)$, strictly $x > 0$, $b > 0$, and $b \neq 1$.
- **Power of Base and Argument:**
  - $\log_{b^m}(x^k) = \dfrac{k}{m} \log_b(x)$.
  - Example: $\log_9(x) = \log_{3^2}(x) = \frac{1}{2} \log_3(x)$, $\log_{27}(x) = \frac{1}{3} \log_3(x)$.
- **Base Change & Telescoping Chains:**
  - Reciprocal: $\log_b(a) = \dfrac{1}{\log_a(b)}$.
  - Chain cancellation: $\log_a(b) \cdot \log_b(c) \cdots \log_y(z) = \log_a(z)$.
- **Exponent-Base Swap Shortcut:**
  - $a^{\log_b(c)} = c^{\log_b(a)}$.
  - In particular, $b^{\log_b(x)} = x^{\log_b(b)} = x$.
- **Digit Counting ($N = a^b$):**
  - Number of decimal digits in $N$ is $\lfloor \log_{10}(N) \rfloor + 1$.
  - Compute $\log_{10}(a^b) = b \cdot \log_{10}(a) = \text{integer} + \text{fraction}$. Digits = $\text{integer} + 1$.
- **Vieta's Relations (Quadratics):**
  - For $ax^2 + bx + c = 0$ with roots $\alpha, \beta$:
    - $\alpha + \beta = -\dfrac{b}{a}$
    - $\alpha \cdot \beta = \dfrac{c}{a}$
  - Sum of squares identity: $\alpha^2 + \beta^2 = (\alpha + \beta)^2 - 2\alpha\beta$.
  - Sum of reciprocals: $\dfrac{1}{\alpha} + \dfrac{1}{\beta} = \dfrac{\alpha + \beta}{\alpha\beta}$.
- **Consistency of Linear Systems:**
  - Given $a_1 x + b_1 y = c_1$ and $a_2 x + b_2 y = c_2$:
    - **Unique solution:** $\dfrac{a_1}{a_2} \neq \dfrac{b_1}{b_2}$ (intersecting lines).
    - **No solution:** $\dfrac{a_1}{a_2} = \dfrac{b_1}{b_2} \neq \dfrac{c_1}{c_2}$ (parallel lines).
    - **Infinitely many:** $\dfrac{a_1}{a_2} = \dfrac{b_1}{b_2} = \dfrac{c_1}{c_2}$ (coincident lines).

## Where I got confused → what made it click
- **Base powers divide, argument powers multiply:** Don't put base powers on top. $\log_{3^2}(x)$ introduces a factor of $\frac{1}{2}$, NOT $2$.
- **Digit counting off-by-one:** The number of digits is not just the rounded value; it is the floor (integer part before the decimal) **plus 1** ($10^2 = 100 \implies \log_{10}(100) = 2 \implies 2 + 1 = 3$ digits).
- **Fast multiplication for logs:** $20 \times 0.7781 = 2 \times 7.781 = 15.562$. Integer part is $15$, so digits = $15 + 1 = 16$.
- **Vieta eliminates root calculation:** Never use the quadratic formula when questions ask for $\alpha^2 + \beta^2$ or $\frac{1}{\alpha} + \frac{1}{\beta}$. Rewrite them into $(\alpha + \beta)$ and $(\alpha\beta)$ and plug in coefficients directly.

## GATE traps
- **The base cannot be 1:** In domain or equation questions, check that the base is never equal to 1 (since $1^y$ cannot equal any other number).
- **No solution requires checking the constant ratio:** For parallel lines, ensure $\frac{a_1}{a_2} = \frac{b_1}{b_2} \neq \frac{c_1}{c_2}$. If the constant ratio also matches, it collapses to infinitely many solutions!
- **Log addition vs argument addition:** $\log(x + y) \neq \log(x) + \log(y)$. Log of a sum cannot be split; only the log of a product splits into a sum: $\log(xy) = \log x + \log y$.

## Example
> **Question (GATE):** If $\log_3(x) + \log_9(x) + \log_{27}(x) = 11$, find $x$.  
> **Solution:**  
> $\log_3(x) + \frac{1}{2}\log_3(x) + \frac{1}{3}\log_3(x) = 11$  
> $\left(1 + \frac{1}{2} + \frac{1}{3}\right)\log_3(x) = \frac{11}{6}\log_3(x) = 11 \implies \log_3(x) = 6 \implies x = 3^6 = 729$.
