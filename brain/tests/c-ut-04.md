---
title: C Programming · Unit Test 04 (Recursion & Parameter Passing)
duration: 30
created: 2026-11-14
description: Unit test on Recursion (P09) and Parameter Passing & Scoping (P10).
---

## Q1
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.3
answer: B
difficulty: easy

Consider the following recursive C function:

```c
#include <stdio.h>

void mystery(char *s) {
    if (*s == '\0') return;
    mystery(s + 1);
    if (*s >= 'a' && *s <= 'z') {
        putchar(*s - 32);
    }
}
```

What will be printed when `mystery("gAtE")` is called?

(A) `GATE`
(B) `TG`
(C) `GT`
(D) `ETAG`

### Solution
The recursive call `mystery(s + 1)` appears **before** the printing check `putchar(*s - 32)`.
This means all characters are processed during the **unwinding phase** (in reverse order from end to start):
1. For `'E'`: Not lowercase, nothing printed.
2. For `'t'`: Lowercase, converts to uppercase `'T'` and prints `'T'`.
3. For `'A'`: Not lowercase, nothing printed.
4. For `'g'`: Lowercase, converts to uppercase `'G'` and prints `'G'`.

Total output is `TG`. Hence, (B) is the correct answer.

## Q2
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P10.6
answer: A
difficulty: easy

Consider the following program:

```c
#include <stdio.h>

int a = 5, b = 10;

void print_sum() {
    printf("%d", a + b);
}

void helper() {
    int a = 20;
    print_sum();
}

int main() {
    int b = 30;
    helper();
    return 0;
}
```

What will be printed by the program under **Static Scoping** and under **Dynamic Scoping** respectively?

(A) `15` and `50` respectively
(B) `15` and `15` respectively
(C) `50` and `50` respectively
(D) `25` and `50` respectively

### Solution
- **Static Scoping:** Look at where `print_sum()` was defined in the source code. It is at file scope, where global `a = 5` and global `b = 10`. It does not see the local variables of `helper` or `main`. Thus, $a + b = 5 + 10 = 15$.
- **Dynamic Scoping:** Look at the runtime call stack: `main (b = 30) -> helper (a = 20) -> print_sum()`. The most recent active declaration of `a` is in `helper` ($a = 20$), and the most recent active declaration of `b` is in `main` ($b = 30$). Thus, $a + b = 20 + 30 = 50$.

Hence, (A) is correct.

## Q3
type: NAT
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.10
answer: 11
difficulty: medium

Consider the following C program:

```c
#include <stdio.h>

int count = 0;

int calc(int n) {
    count++;
    if (n <= 2) return 1;
    return calc(n - 1) + calc(n - 3);
}

int main() {
    calc(6);
    return 0;
}
```

The final value of the global variable `count` after the execution of `calc(6)` is ________.

### Solution
Every time `calc` is entered, `count` increments by 1.
Let $C(n)$ be the total invocations of `calc` for input $n$:
- For base cases ($n \le 2$): $C(n) = 1$. Thus, $C(2) = 1, C(1) = 1, C(0) = 1, C(-1) = 1$.
- For $n \ge 3$: $C(n) = 1 + C(n - 1) + C(n - 3)$.

Building bottom-up:
- $C(3) = 1 + C(2) + C(0) = 1 + 1 + 1 = 3$
- $C(4) = 1 + C(3) + C(1) = 1 + 3 + 1 = 5$
- $C(5) = 1 + C(4) + C(2) = 1 + 5 + 1 = 7$
- $C(6) = 1 + C(5) + C(3) = 1 + 7 + 3 = 11$.

Thus, `count` is 11.

## Q4
type: MSQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.19
answer: A, C, D
difficulty: medium

Which of the following statements is/are **CORRECT** regarding runtime storage organization and recursion in C?

(A) The peak stack depth of a recursive function depends on the maximum depth of nested active calls at any instant, not on the total number of calls made across its lifetime.
(B) In a block-structured language with lexical scoping, the access link of an activation record always points to the activation record of the immediate caller.
(C) In a tail-recursive function where the recursive call is the last operation, a compiler can optimize execution by reusing the current stack frame, keeping auxiliary stack space bounded by a constant.
(D) Two activation records of the same recursive function that coexist simultaneously on the call stack have distinct memory locations for their local automatic variables.

### Solution
- (A) is TRUE: As functions return, their activation records are popped and memory is reclaimed. Peak stack usage equals the maximum depth of simultaneously active frames.
- (B) is FALSE: That describes the **control link (dynamic link)**. The **access link (static link)** points to the activation record of the static enclosing parent procedure where the function was declared in the source code.
- (C) is TRUE: Tail-call optimization (TCO) overwrites the current stack frame's parameters rather than pushing a new frame, turning recursion into an iterative loop requiring constant stack space.
- (D) is TRUE: Every invocation creates its own private activation frame on the stack holding its own distinct local automatic variables.

Hence, (A), (C), and (D) are correct.

## Q5
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P10.4
answer: C
difficulty: easy

Consider the following program:

```c
#include <stdio.h>

void swap_add(int x, int y) {
    x = x + 5;
    y = y + 10;
}

int main() {
    int p = 20;
    swap_add(p, p);
    printf("%d", p);
    return 0;
}
```

Assume `swap_add` is executed using **Call by Value-Result** (copy-in at call, copy-out at return in **left-to-right** parameter order). What is the value printed for `p`?

(A) 20
(B) 25
(C) 30
(D) 35

### Solution
Under Call by Value-Result (copy-restore):
1. **Copy-in:**
   - Parameter `x` gets copy of `p` $\implies x = 20$.
   - Parameter `y` gets copy of `p` $\implies y = 20$.
2. **Inside function body:**
   - `x = x + 5 = 25`.
   - `y = y + 10 = 30`.
   *(Local copies are independent during execution).*
3. **Copy-out (left-to-right at return):**
   - First, `x` (25) is copied back to `p` $\implies p = 25$.
   - Next, `y` (30) is copied back to `p` $\implies p = 30$.

Final printed value is 30. Hence, (C) is correct.

## Q6
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.5
answer: 64
difficulty: hard
pyq: 2015s2-11

Consider the following recursive C function:

```c
int solve(int n) {
    int ans = 1, j;
    if (n <= 1) return 1;
    for (j = 1; j < n; j++) {
        ans += 2 * solve(j) + solve(n - j);
    }
    return ans;
}
```

The return value of `solve(4)` is ________.

### Solution
We evaluate `solve(n)` bottom-up:
- Base case: `solve(1) = 1`.
- For $n = 2$:
  - Loop runs for $j = 1$:
    `ans = 1 + 2 * solve(1) + solve(1) = 1 + 2(1) + 1 = 4`.
  - So `solve(2) = 4`.
- For $n = 3$:
  - Loop runs for $j = 1, 2$:
    - $j = 1$: `2 * solve(1) + solve(2) = 2(1) + 4 = 6`
    - $j = 2$: `2 * solve(2) + solve(1) = 2(4) + 1 = 9`
    - `ans = 1 + 6 + 9 = 16`.
  - So `solve(3) = 16`.
- For $n = 4$:
  - Loop runs for $j = 1, 2, 3$:
    - $j = 1$: `2 * solve(1) + solve(3) = 2(1) + 16 = 18`
    - $j = 2$: `2 * solve(2) + solve(2) = 2(4) + 4 = 12`
    - $j = 3$: `2 * solve(3) + solve(1) = 2(16) + 1 = 33`
    - `ans = 1 + 18 + 12 + 33 = 64`.
  - So `solve(4) = 64`.

*(Notice the invariant $solve(n) = 4^{n-1}$: $1, 4, 16, 64$).*

## Q7
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.8
answer: A
difficulty: hard
pyq: 2020-46

Consider the following C program:

```c
#include <stdio.h>

int fun(int n) {
    static int s = 1;
    if (n <= 1) return s;
    s = s + n;
    int res = fun(n - 1);
    return res + s;
}

int main() {
    int r1 = fun(4);
    int r2 = fun(2);
    printf("%d", r1 + r2);
    return 0;
}
```

The output of the program upon execution is:

(A) 64
(B) 46
(C) 52
(D) 40

### Solution
`s` is a static variable in permanent memory initialized once to 1.
Trace of `fun(4)`:
- `n = 4`: $s = 1 + 4 = 5$. Calls `fun(3)`.
- `n = 3`: $s = 5 + 3 = 8$. Calls `fun(2)`.
- `n = 2`: $s = 8 + 2 = 10$. Calls `fun(1)`.
- `n = 1`: base case hits $\implies$ returns $s = 10$.
Unwinding for `fun(4)`:
- In `n = 2`: `res = 10`. Returns $10 + s = 10 + 10 = 20$.
- In `n = 3`: `res = 20`. Returns $20 + s = 20 + 10 = 30$.
- In `n = 4`: `res = 30`. Returns $30 + s = 30 + 10 = 40$.
So $r1 = 40$. At this point, $s = 10$.

Trace of `fun(2)`:
`s` starts at 10 (retains value from previous call).
- `n = 2`: $s = 10 + 2 = 12$. Calls `fun(1)`.
- `n = 1`: base case hits $\implies$ returns $s = 12$.
Unwinding for `fun(2)`:
- In `n = 2`: `res = 12`. Returns $12 + s = 12 + 12 = 24$.
So $r2 = 24$.

Final output: $r1 + r2 = 40 + 24 = 64$.
Hence, (A) is correct.

## Q8
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.12
answer: B
difficulty: medium

Consider the mutually recursive functions `f` and `g` below:

```c
#include <stdio.h>

int g(int n);

int f(int n) {
    if (n <= 1) return 1;
    return n + g(n - 1);
}

int g(int n) {
    if (n <= 1) return 2;
    return 2 * f(n - 2);
}

int main() {
    printf("%d", f(5));
    return 0;
}
```

The output printed by `main()` is:

(A) 11
(B) 13
(C) 15
(D) 17

### Solution
Tracing using a two-column scratchpad:
1. `f(5) = 5 + g(4)`
2. `g(4) = 2 * f(2)`
3. `f(2) = 2 + g(1)`
4. `g(1)` hits base case $n \le 1 \implies$ returns 2.

Unwinding:
- `g(1) = 2`
- `f(2) = 2 + 2 = 4`
- `g(4) = 2 * 4 = 8`
- `f(5) = 5 + 8 = 13`.

Output is 13. Hence, (B) is correct.

## Q9
type: MSQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.14
answer: A, C, D
difficulty: medium

Consider the following recursive C functions:

```c
int f1(int n) {
    if (n <= 0) return 0;
    return f1(n--);
}

int f2(int n) {
    if (n == 0) return 0;
    return f2(n - 3);
}

int f3(int n) {
    if (n <= 1) return 1;
    if (n % 2 == 0) return f3(n / 2);
    return f3(n - 1);
}

int f4(int n) {
    while (n > 0) {
        return f4(n - 1);
    }
    return 0;
}
```

Which of the following statements is/are **CORRECT**?

(A) The call `f1(4)` leads to abnormal termination due to runtime stack overflow.
(B) The call `f2(n)` terminates for every positive integer $n \ge 1$.
(C) The call `f3(n)` terminates for every positive integer $n \ge 1$.
(D) The call `f4(5)` terminates normally and returns 0.

### Solution
- (A) is TRUE: Postfix `n--` passes the old value (4) to each recursive call. The argument never decreases, frames pile up indefinitely without returning, triggering stack overflow (abnormal termination).
- (B) is FALSE: If $n = 5$, the calls are $f2(5) \to f2(2) \to f2(-1) \to f2(-4) \dots$, skipping $n == 0$. It terminates only if $n$ is a multiple of 3.
- (C) is TRUE: For any positive integer $n \ge 1$: if $n$ is even, it strictly divides by 2; if $n$ is odd, subtracting 1 makes it even, which then divides by 2. It strictly descends and hits the base case $n \le 1$.
- (D) is TRUE: `f4(5)` recursively calls `f4(4) \to \dots \to f4(0)`. At $n = 0$, the `while` loop condition `0 > 0` is false, and it returns 0. The 0 is then returned cleanly up the stack.

Hence, (A), (C), and (D) are correct.

## Q10
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.18
answer: 62
difficulty: medium

Consider the following recursive function:

```c
int fun(int n) {
    int arr[4];
    if (n <= 1) return 1;
    return fun(n - 2) + n;
}
```

The function is executed on a machine with a maximum call stack space of **1024 bytes**.
Assume:
- Each activation record of `fun` on the stack requires:
  - 16 bytes for the local array `arr` (4 integers $\times$ 4 bytes each)
  - 4 bytes for the parameter `n`
  - 4 bytes for the return address
  - 8 bytes for saved registers and frame pointer
- Stack memory is allocated only for active frames and reclaimed immediately when a frame returns.

What is the **largest even positive integer $n$** with which `fun(n)` can be called without causing a stack overflow?

### Solution
1. **Size of one activation record:**
   $$\text{Frame size} = 16 + 4 + 4 + 8 = 32 \text{ bytes}.$$

2. **Maximum active frames permitted:**
   $$\text{Max frames} = \frac{1024}{32} = 32 \text{ frames}.$$

3. **Stack depth for even $n$:**
   Calls progress by step $-2$: $n, n - 2, n - 4, \dots, 2, 0$.
   At $n = 0$, `n <= 1` hits the base case.
   The total number of frames active simultaneously on the stack at the base case is:
   $$\text{Frames} = \frac{n - 0}{2} + 1 = \frac{n}{2} + 1.$$

4. **Finding maximum even $n$:**
   $$\frac{n}{2} + 1 \le 32 \implies \frac{n}{2} \le 31 \implies n \le 62.$$

Thus, for $n = 62$, exactly 32 frames ($32 \times 32 = 1024$ bytes) are active, fitting within the limit. For $n = 64$, it would require 33 frames (1056 bytes), causing stack overflow.
The largest even integer $n$ is 62.
