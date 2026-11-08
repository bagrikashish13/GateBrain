---
title: Programming in C · Unit Test 01
duration: 30
created: 2026-11-08
description: Unit test covering Units P01 to P04 (Types, Conversions, Operators, Control Flow).
---

## Q1
type: MCQ
marks: 1
subject: programming-ds
topic: types-and-operators
syllabus: P01.12
answer: B

Consider the following C program:

```c
#include <stdio.h>
int main() {
    int a = 024;
    int count = printf("%x", a);
    printf("%d", count);
    return 0;
}
```

What is the output displayed on the standard output?

(A) 242
(B) 142
(C) 201
(D) 141

### Solution
1. **Octal constant:** An integer constant beginning with `0` is an octal constant. Thus, `024` in octal is $2 \times 8^1 + 4 \times 8^0 = 16 + 4 = 20$ in decimal.
2. **`printf("%x", a)`:** The `%x` specifier prints an unsigned integer in hexadecimal format (lowercase). Decimal 20 in hexadecimal is $14_{16}$ ($1 \times 16 + 4$).
   - This statement prints `14`.
   - `printf` returns the number of characters successfully printed. Since `"14"` has 2 characters, `count` receives the value `2`.
3. **`printf("%d", count)`:** Prints the value of `count`, which is `2`.
4. Therefore, the complete output is `142`.

- Option (A) `242` is incorrect because it treats `024` as decimal `24` or fails to convert to hex.
- Option (C) `201` is incorrect because it prints decimal `20` instead of hex `14`.
- Option (D) `141` is incorrect because it assumes `printf` returned 1.

Hence, (B) is the correct option.

## Q2
type: MCQ
marks: 1
subject: programming-ds
topic: types-and-operators
syllabus: P03.14
answer: C

Consider the following C program:

```c
#include <stdio.h>
int main() {
    int a = 3, b = 2, c = 1;
    int res = a > b ? b > c ? a + b : b - c : a < c ? a * c : b * c;
    printf("%d", res);
    return 0;
}
```

What is the output displayed by the program?

(A) 1
(B) 3
(C) 5
(D) 2

### Solution
In C, the conditional operator (`?:`) has Right-to-Left associativity and lower precedence than relational (`>`, `<`) and arithmetic (`+`, `-`, `*`) operators.

The unparenthesized expression:
`a > b ? b > c ? a + b : b - c : a < c ? a * c : b * c`
is parsed using right-to-left associativity as:
`a > b ? (b > c ? (a + b) : (b - c)) : (a < c ? (a * c) : (b * c))`

Given $a = 3, b = 2, c = 1$:
1. The outer condition `a > b` evaluates to $3 > 2$, which is **TRUE** (1).
2. Because the condition is true, only the true branch `(b > c ? (a + b) : (b - c))` is evaluated; the entire false branch is skipped.
3. In the inner conditional expression: `b > c` evaluates to $2 > 1$, which is **TRUE** (1).
4. Since `b > c` is true, it evaluates `a + b` $= 3 + 2 = 5$.
5. The value $5$ is assigned to `res`, and `printf("%d", res)` prints `5`.

- (A) 1 would be obtained from `b - c` if `b > c` were false.
- (B) 3 would be obtained from `a * c` if `a > b` were false and `a < c` true.
- (D) 2 would be obtained from `b * c` if `a > b` were false and `a < c` false.

Hence, (C) is the correct option.

## Q3
type: MCQ
marks: 1
subject: programming-ds
topic: control-flow
syllabus: P04.7
answer: B

Consider the following C program segment:

```c
#include <stdio.h>
int main() {
    int val = 4;
    switch (val) {
        case 1:
            printf("A");
            break;
        default:
            printf("D");
        case 2:
            printf("B");
            break;
        case 3:
            printf("C");
    }
    return 0;
}
```

What will be the output printed by the program?

(A) D
(B) DB
(C) DBC
(D) Compilation error due to misplaced default

### Solution
1. In C, `default:` can appear anywhere inside a `switch` statement (at the beginning, middle, or end). It does not need to be at the bottom, so there is no compilation error (rejecting D).
2. The switch expression evaluates to `val = 4`.
3. It checks for a matching case:
   - `case 1:` does not match.
   - `case 2:` does not match.
   - `case 3:` does not match.
4. Since no case label matches `4`, execution jumps directly to `default:`.
5. Under `default:`, `printf("D")` executes and prints `D`.
6. There is **no `break;`** statement under `default:`. Therefore, execution **falls through** into `case 2:`.
7. Under `case 2:`, `printf("B")` executes and prints `B`.
8. `case 2:` ends with a `break;` statement, which terminates the `switch`.
9. The resulting output is `DB`.

- (A) `D` is wrong because it forgets that missing `break` causes fall-through into `case 2`.
- (C) `DBC` is wrong because `case 2` has a `break;` which stops further fall-through.
- (D) is wrong because C permits `default` in any position.

Hence, (B) is the correct option.

## Q4
type: NAT
marks: 1
subject: programming-ds
topic: types-and-operators
syllabus: P03.4
answer: 17

Consider the following C program:

```c
#include <stdio.h>
int main() {
    int a = 4, b = 7;
    int c = ++a + b--;
    int d = a++ + --b;
    int res = (c - d) * a + b;
    printf("%d", res);
    return 0;
}
```

The output of the program is _______.

### Solution
Let us trace each statement across sequence points:

1. `int a = 4, b = 7;`
   - Initial state: $a = 4, b = 7$.

2. `int c = ++a + b--;`
   - `++a` is pre-increment: $a$ is incremented to $5$, and the value used in the addition is $5$.
   - `b--` is post-decrement: the value used in the addition is $7$, and $b$ is subsequently decremented to $6$.
   - $c = 5 + 7 = 12$.
   - State after this statement: $a = 5, b = 6, c = 12$.

3. `int d = a++ + --b;`
   - `a++` is post-increment: the value used in the addition is $5$, and $a$ is subsequently incremented to $6$.
   - `--b` is pre-decrement: $b$ is decremented from $6$ to $5$, and the value used in the addition is $5$.
   - $d = 5 + 5 = 10$.
   - State after this statement: $a = 6, b = 5, c = 12, d = 10$.

4. `int res = (c - d) * a + b;`
   - `(c - d) = (12 - 10) = 2`.
   - Multiplication has higher precedence than addition: `2 * a = 2 * 6 = 12`.
   - Addition: `12 + b = 12 + 5 = 17`.
   - $res = 17$.

The printed output is `17`.

## Q5
type: MSQ
marks: 1
subject: programming-ds
topic: types-and-operators
syllabus: P02.11
answer: A, B, C

Suppose $n$ is an `unsigned int` variable representing a large positive integer in a C implementation where `unsigned int` is 32-bit (range $0$ to $2^{32}-1$). We wish to compute the sum of the first $n$ positive integers:
$$S = \frac{n(n + 1)}{2}$$

Which of the following statements is/are TRUE?

(A) Evaluating `n * (n + 1) / 2` can cause integer overflow in the intermediate product `n * (n + 1)` even when the mathematical result $S$ fits comfortably within a 32-bit `unsigned int`.
(B) If $n$ is known to be even, the expression `(n / 2) * (n + 1)` computes $S$ correctly without integer division truncation and reduces the magnitude of intermediate values.
(C) If $n$ is known to be odd, the expression `n * ((n + 1) / 2)` computes $S$ correctly without integer division truncation.
(D) The expression `n / 2 * (n + 1)` correctly computes $S$ for all positive values of $n$.

### Solution
- **Statement (A) is TRUE:** For 32-bit `unsigned int`, the maximum representable value is $2^{32} - 1 \approx 4.29 \times 10^9$. If $n = 70,000$, then $n(n+1) \approx 4.90 \times 10^9$, which exceeds $2^{32} - 1$ and overflows. However, the final answer $S = 4.90 \times 10^9 / 2 = 2.45 \times 10^9$, which is well within the 32-bit limit. Because C evaluates left-to-right (`n * (n + 1)` before `/ 2`), overflow occurs during intermediate computation.
- **Statement (B) is TRUE:** If $n$ is even, $n$ is divisible by 2 with remainder 0, so integer division `n / 2` is exact with no fractional part discarded. Multiplying $(n/2)$ by $(n+1)$ gives the exact value of $S$, while keeping the intermediate factor at half the size of $n$, effectively avoiding intermediate overflow.
- **Statement (C) is TRUE:** If $n$ is odd, $n + 1$ is even and thus divisible by 2 with remainder 0. Therefore, `(n + 1) / 2` does not truncate, and multiplying by $n$ computes $S$ exactly.
- **Statement (D) is FALSE:** Due to left-to-right associativity of `/` and `*`, `n / 2 * (n + 1)` evaluates as `(n / 2) * (n + 1)`. If $n$ is odd (e.g., $n = 3$), integer division `3 / 2` truncates to `1`. Then $1 \times (3 + 1) = 4$, whereas the true sum is $\frac{3 \times 4}{2} = 6$. Thus, it fails for odd $n$.

Therefore, statements (A), (B), and (C) are correct.

## Q6
type: NAT
marks: 2
subject: programming-ds
topic: control-flow
syllabus: P04.17
answer: 6

Consider the following C program:

```c
#include <stdio.h>
int main() {
    float x = 4.0, y = 1.0;
    int count = 0;
    while (x / y > 0.0625) {
        y = y * 2.0;
        count++;
    }
    printf("%d", count);
    return 0;
}
```

The output of the program is _______.

### Solution
Let us trace the loop condition and variable state.
Note that $0.0625 = \frac{625}{10000} = \frac{1}{16}$.
The condition is `(x / y > 0.0625)`, which means:
$$\frac{4.0}{y} > \frac{1}{16} \iff y < 64.0$$

At the start: $x = 4.0, y = 1.0, count = 0$.

Trace of iterations:
- **Iteration 1:**
  - Check: $x / y = 4.0 / 1.0 = 4.0 > 0.0625$ (True).
  - Body: $y = 1.0 \times 2.0 = 2.0$, $count = 1$.
- **Iteration 2:**
  - Check: $x / y = 4.0 / 2.0 = 2.0 > 0.0625$ (True).
  - Body: $y = 2.0 \times 2.0 = 4.0$, $count = 2$.
- **Iteration 3:**
  - Check: $x / y = 4.0 / 4.0 = 1.0 > 0.0625$ (True).
  - Body: $y = 4.0 \times 2.0 = 8.0$, $count = 3$.
- **Iteration 4:**
  - Check: $x / y = 4.0 / 8.0 = 0.5 > 0.0625$ (True).
  - Body: $y = 8.0 \times 2.0 = 16.0$, $count = 4$.
- **Iteration 5:**
  - Check: $x / y = 4.0 / 16.0 = 0.25 > 0.0625$ (True).
  - Body: $y = 16.0 \times 2.0 = 32.0$, $count = 5$.
- **Iteration 6:**
  - Check: $x / y = 4.0 / 32.0 = 0.125 > 0.0625$ (True).
  - Body: $y = 32.0 \times 2.0 = 64.0$, $count = 6$.
- **Termination Check:**
  - Check: $x / y = 4.0 / 64.0 = 0.0625$.
  - Condition: `0.0625 > 0.0625` is **FALSE** (strict inequality `>`).
  - The loop terminates.

The final value printed is `6`.

## Q7
type: MCQ
marks: 2
subject: programming-ds
topic: types-and-operators
syllabus: P03.12
answer: A

Consider the following C program:

```c
#include <stdio.h>
int main() {
    char p = 'M';
    char q = 'k';
    char r = (p & q);
    char s = (p ^ q) + 10;
    char t = (p | q) - 50;
    printf("%c %c %c", r, s, t);
    return 0;
}
```

The ASCII encoding for relevant characters is given in the table below:

| Character | ASCII (Decimal) | ASCII (Binary) |
|:---:|:---:|:---:|
| `'0'` | 48 | `0011 0000` |
| `'='` | 61 | `0011 1101` |
| `'?'` | 63 | `0011 1111` |
| `'I'` | 73 | `0100 1001` |
| `'K'` | 75 | `0100 1011` |
| `'M'` | 77 | `0100 1101` |
| `'k'` | 107 | `0110 1011` |

What does the program print?

(A) I 0 =
(B) K 1 =
(C) I 1 ?
(D) K 0 ?

### Solution
1. **Values in binary:**
   - $p = \text{'M'} = 77_{10} = \text{0100 1101}_2$
   - $q = \text{'k'} = 107_{10} = \text{0110 1011}_2$

2. **Bitwise AND (`r = p & q`):**
   ```text
     0100 1101  ('M' = 77)
   & 0110 1011  ('k' = 107)
   -----------
     0100 1001  = 64 + 8 + 1 = 73
   ```
   ASCII value 73 corresponds to character `'I'`.
   Thus, $r = \text{'I'}$.

3. **Bitwise XOR (`s = (p ^ q) + 10`):**
   ```text
     0100 1101  ('M' = 77)
   ^ 0110 1011  ('k' = 107)
   -----------
     0010 0110  = 32 + 4 + 2 = 38
   ```
   Now add 10: $38 + 10 = 48$.
   ASCII value 48 corresponds to character `'0'`.
   Thus, $s = \text{'0'}$.

4. **Bitwise OR (`t = (p | q) - 50`):**
   ```text
     0100 1101  ('M' = 77)
   | 0110 1011  ('k' = 107)
   -----------
     0110 1111  = 64 + 32 + 8 + 4 + 2 + 1 = 111
   ```
   Now subtract 50: $111 - 50 = 61$.
   ASCII value 61 corresponds to character `'='`.
   Thus, $t = \text{'='}$.

5. The format string `"%c %c %c"` outputs `I 0 =`.

Hence, (A) is the correct option.

## Q8
type: MCQ
marks: 2
subject: programming-ds
topic: control-flow
syllabus: P04.18
answer: A

Consider the following C program:

```c
#include <stdio.h>
int main() {
    int i = 0, j, sum = 0;
    for (j = -2; j <= 2; j++) {
        if ((j < 0) || (++i > 2)) {
            sum += j;
        }
    }
    printf("%d %d", sum, i);
    return 0;
}
```

What is the output displayed by the program?

(A) -1 3
(B) 0 5
(C) -3 2
(D) -1 5

### Solution
In C, the logical OR operator (`||`) exhibits short-circuit evaluation: if the left operand evaluates to non-zero (true), the right operand is **not evaluated**.

Let us trace the loop across all values of $j \in \{-2, -1, 0, 1, 2\}$:

1. **$j = -2$:**
   - Left operand `(j < 0)` is $-2 < 0$, which is **TRUE** (1).
   - Short-circuit: `(++i > 2)` is **not evaluated**.
   - $i$ remains $0$.
   - `if` body executes: `sum += -2` $\implies sum = 0 + (-2) = -2$.

2. **$j = -1$:**
   - Left operand `(j < 0)` is $-1 < 0$, which is **TRUE** (1).
   - Short-circuit: `(++i > 2)` is **not evaluated**.
   - $i$ remains $0$.
   - `if` body executes: `sum += -1` $\implies sum = -2 + (-1) = -3$.

3. **$j = 0$:**
   - Left operand `(j < 0)` is $0 < 0$, which is **FALSE** (0).
   - No short-circuit: the right operand `(++i > 2)` **must be evaluated**.
   - `++i` pre-increments $i$ from $0$ to $1$.
   - The condition is $1 > 2$, which is **FALSE** (0).
   - Entire condition evaluates to false; body is skipped.
   - Current values: $sum = -3, i = 1$.

4. **$j = 1$:**
   - Left operand `(j < 0)` is $1 < 0$, which is **FALSE** (0).
   - Right operand `(++i > 2)` is evaluated.
   - `++i` pre-increments $i$ from $1$ to $2$.
   - The condition is $2 > 2$, which is **FALSE** (0).
   - Entire condition evaluates to false; body is skipped.
   - Current values: $sum = -3, i = 2$.

5. **$j = 2$:**
   - Left operand `(j < 0)` is $2 < 0$, which is **FALSE** (0).
   - Right operand `(++i > 2)` is evaluated.
   - `++i` pre-increments $i$ from $2$ to $3$.
   - The condition is $3 > 2$, which is **TRUE** (1).
   - `if` body executes: `sum += 2` $\implies sum = -3 + 2 = -1$.
   - Current values: $sum = -1, i = 3$.

Loop terminates as $j$ increments to $3$ ($3 \le 2$ is false).
`printf("%d %d", sum, i)` prints `-1 3`.

Hence, (A) is the correct option.

## Q9
type: NAT
marks: 2
subject: programming-ds
topic: control-flow
syllabus: P04.16
answer: 6

Consider the following C program:

```c
#include <stdio.h>
int main() {
    int i;
    for (i = 1; i <= 4; i++) {
        switch (i % 3) {
            case 0:
                printf("*");
            case 1:
                printf("*");
                break;
            case 2:
                printf("*");
            default:
                printf("*");
        }
    }
    return 0;
}
```

The total number of times the character `*` is printed when the above program is executed is _______.

### Solution
Let us trace the `for` loop for $i = 1, 2, 3, 4$:

1. **$i = 1$ ($i \% 3 = 1$):**
   - Jumps directly to `case 1:`.
   - Executes `printf("*")` (1st star).
   - Hits `break;`, which terminates the switch.
   - Stars printed in this iteration = **1**.

2. **$i = 2$ ($i \% 3 = 2$):**
   - Jumps directly to `case 2:`.
   - Executes `printf("*")` (2nd star).
   - There is no `break;`, so it **falls through** into `default:`.
   - Under `default:`, executes `printf("*")` (3rd star).
   - Reaches end of switch.
   - Stars printed in this iteration = **2**.

3. **$i = 3$ ($i \% 3 = 0$):**
   - Jumps directly to `case 0:`.
   - Executes `printf("*")` (4th star).
   - There is no `break;`, so it **falls through** into `case 1:`.
   - Under `case 1:`, executes `printf("*")` (5th star).
   - Hits `break;`, which terminates the switch.
   - Stars printed in this iteration = **2**.

4. **$i = 4$ ($i \% 3 = 1$):**
   - Jumps directly to `case 1:`.
   - Executes `printf("*")` (6th star).
   - Hits `break;`, which terminates the switch.
   - Stars printed in this iteration = **1**.

Total number of times `*` is printed across all iterations:
$$1 + 2 + 2 + 1 = 6$$

The answer is `6`.

## Q10
type: MSQ
marks: 2
subject: programming-ds
topic: control-flow
syllabus: P04.15
answer: A, B, C

Consider the following C code snippets:

Snippet 1:
```c
int i = 0;
while (i < 10) {
    if (i == 5)
        continue;
    i++;
}
```

Snippet 2:
```c
unsigned int n = 5;
while (n >= 0) {
    n--;
}
```

Snippet 3:
```c
int a = 12, b = 18;
while (a != b) {
    if (a > b) a = a - b;
    else b = b - a;
}
```

Snippet 4:
```c
int sum = 0, k;
for (k = 0; k < 5; k++);
sum += k;
```

Which of the following statements is/are TRUE?

(A) Snippet 1 enters an infinite loop because `continue` in a `while` loop jumps directly to the condition test, skipping the increment `i++`.
(B) Snippet 2 enters an infinite loop because an `unsigned int` is always non-negative ($\ge 0$).
(C) Upon termination of Snippet 3, variable `a` holds the value 6.
(D) Upon termination of Snippet 4, variable `sum` holds the value 10.

### Solution
- **Statement (A) is TRUE:** In a `while` loop, executing `continue` immediately jumps to evaluate the loop condition `while (i < 10)`, completely skipping any statements remaining in the loop body. When $i$ reaches 5, `if (i == 5) continue;` is triggered every time. Because `i++` is skipped, $i$ remains 5 indefinitely, creating an infinite loop. (Note: in a `for` loop, `continue` jumps to the update expression, but `while` has no update expression).
- **Statement (B) is TRUE:** An `unsigned int` represents values $\ge 0$. The condition `n >= 0` can never become false. When $n = 0$, the condition holds, and `n--` underflows / wraps around to `UINT_MAX` (e.g. $4,294,967,295$), continuing the loop indefinitely.
- **Statement (C) is TRUE:** Snippet 3 implements Euclid's subtraction-based algorithm for computing the Greatest Common Divisor (GCD) of two positive integers:
  - Initially: $a = 12, b = 18$ ($a \ne b$, $a < b \implies b = 18 - 12 = 6$)
  - Next: $a = 12, b = 6$ ($a \ne b$, $a > b \implies a = 12 - 6 = 6$)
  - Next: $a = 6, b = 6$ ($a == b \implies$ loop terminates)
  - At termination, $a = \gcd(12, 18) = 6$.
- **Statement (D) is FALSE:** Notice the semicolon `;` at the end of the `for` statement: `for (k = 0; k < 5; k++);`. This semicolon constitutes an empty loop body. The loop runs 5 times doing nothing except incrementing $k$. When the loop exits, $k = 5$. Then `sum += k;` executes **once** outside the loop: $sum = 0 + 5 = 5$. Thus, `sum` holds 5, not 10.

Therefore, statements (A), (B), and (C) are correct.
