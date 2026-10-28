# Divisibility Rules, Factors & HCF/LCM

## TL;DR
Divisibility rules eliminate long division by isolating key digits. Total factors of $p_1^a p_2^b$ is $(a+1)(b+1)$. For two numbers, $A \times B = \text{HCF} \times \text{LCM}$. Repeating cycles trigger LCM.

## Core idea
- **Last-digits family:**
  - Divisible by $2$: last digit even ($0, 2, 4, 6, 8$).
  - Divisible by $4$: last 2 digits divide by $4$.
  - Divisible by $8$: last 3 digits divide by $8$.
  - Divisible by $5$: ends in $0$ or $5$.
  - Divisible by $25$: ends in $00, 25, 50, 75$.
- **Digit-sum family:**
  - Divisible by $3$: sum of all digits is a multiple of $3$.
  - Divisible by $9$: sum of all digits is a multiple of $9$.
- **Alternating jump rule for 11:**
  - $(\text{Sum of odd positions}) - (\text{Sum of even positions}) = 0 \text{ or multiple of } 11$.
- **Composite numbers combo:**
  - Divisible by $6$: passes rule of $2$ AND $3$.
  - Divisible by $12$: passes rule of $4$ AND $3$.
  - Divisible by $72$: passes rule of $8$ (last 3 digits) AND $9$ (digit sum).
- **Total number of factors formula:**
  - Prime factorize $N = p_1^a \times p_2^b \times p_3^c$.
  - $\text{Total factors} = (a + 1)(b + 1)(c + 1)$.
- **HCF & LCM essentials:**
  - Product rule: $A \times B = \text{HCF}(A, B) \times \text{LCM}(A, B)$.
  - Word problem trigger: when cyclic events (bells, traffic lights, runners) coincide again in the future, take **$\text{LCM}$**.

## Where I got confused → what made it click
- **Stalling on long numbers:** Never divide the whole number! For 8, look only at the last 3 digits. For 72, isolate the last 3 digits first to pin down the last variable, then use the sum of digits for the remaining variable.
- **Factor count multiplication slip:** Don't multiply powers directly; remember to add $1$ to each power first: for $36 = 2^2 \times 3^2$, it is $(2+1)(2+1) = 3 \times 3 = 9$ factors, not 12.

## GATE traps
- **Single-digit constraint:** Missing digits in divisibility problems must be integers between $0$ and $9$.
- **Bells / Traffic lights / Laps:** If the question asks when events meet next, the answer must be larger than individual intervals $\to$ use $\text{LCM}$, not $\text{HCF}$.
- **Mental squaring shortcut:** For any number ending in 5, $n5^2 = [n(n+1)]25$ (e.g. $45^2 \to 4 \times 5 = 20 \implies 2025$).

## Example
> **Question (GATE):** If the 6-digit number $42X31Y$ is divisible by $72$, find $X$ and $Y$.  
> **Solution:**  
> 1. Rule of 8 on $31Y$: $312 \div 8 = 39 \implies Y = 2$.  
> 2. Rule of 9 on $42X312$: $4 + 2 + X + 3 + 1 + 2 = 12 + X$. Smallest digit making $12 + X$ a multiple of 9 is $X = 6$.  
> Answer: $X = 6, Y = 2$.
