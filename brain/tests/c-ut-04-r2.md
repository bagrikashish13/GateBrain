---
test: c-ut-04-r2
title: "C Programming · Unit Test 04 Retest (Recursion & Parameter Passing)"
duration: 30
marks: 15
pass: 70%
---

# C Programming · Unit Test 04 Retest (Recursion & Parameter Passing)

## Q1
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.5
answer: A
difficulty: easy

Consider the following recursive C function:

```c
#include <stdio.h>

int f(int *arr, int n) {
    if (n <= 0) return 0;
    if (*arr % 2 == 0) return *arr + f(arr + 1, n - 1);
    return f(arr + 1, n - 1) - *arr;
}

int main() {
    int arr[] = {4, 3, 6, 1};
    printf("%d", f(arr, 4));
    return 0;
}
```

What is the output printed upon execution?

(A) `6`
(B) `8`
(C) `14`
(D) `2`

### Solution
Tracing the recursion step-by-step:
1. `f(arr, 4)`: `*arr = 4` (even) $\implies$ returns $4 + f(arr + 1, 3)$.
2. `f(arr + 1, 3)`: `*arr = 3` (odd) $\implies$ returns $f(arr + 2, 2) - 3$.
3. `f(arr + 2, 2)`: `*arr = 6` (even) $\implies$ returns $6 + f(arr + 3, 1)$.
4. `f(arr + 3, 1)`: `*arr = 1` (odd) $\implies$ returns $f(arr + 4, 0) - 1$.
5. `f(arr + 4, 0)`: $n = 0 \le 0 \implies$ returns 0.

Unwinding:
- `f(arr + 3, 1) = 0 - 1 = -1`
- `f(arr + 2, 2) = 6 + (-1) = 5`
- `f(arr + 1, 3) = 5 - 3 = 2`
- `f(arr, 4) = 4 + 2 = 6`

The output is 6.
Hence, (A) is correct.

## Q2
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P10.6
answer: A
difficulty: easy

Consider the following program written in a C-like language:

```c
#include <stdio.h>

int x = 10, y = 20;

void print_val() {
    printf("%d ", x + y);
}

void test() {
    int x = 100;
    print_val();
}

int main() {
    int y = 200;
    test();
    return 0;
}
```

What will be printed by the program under **Static Scoping** and under **Dynamic Scoping** respectively?

(A) `30` and `300`
(B) `300` and `30`
(C) `30` and `30`
(D) `300` and `300`

### Solution
- **Static Scoping (Lexical):** Free variables are resolved based on where `print_val` is defined in the source code. At global scope, $x = 10$ and $y = 20$. Local definitions inside `test` and `main` are not visible in `print_val`. Thus, $x + y = 10 + 20 = 30$.
- **Dynamic Scoping:** Free variables are resolved based on the runtime call stack: `main (y=200) -> test (x=100) -> print_val()`. The most recent active declaration of $x$ is in `test` ($x = 100$), and the most recent active declaration of $y$ is in `main` ($y = 200$). Thus, $x + y = 100 + 200 = 300$.

Hence, (A) is correct.

## Q3
type: NAT
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.19
answer: 5
difficulty: medium

Consider the following recursive C function:

```c
int f(int n) {
    if (n <= 0) return 0;
    return f(n - 2) + f(n - 3);
}
```

What is the **maximum number of activation records** of `f` coexisting simultaneously on the runtime call stack during the execution of `f(8)`?

### Solution
Stack depth at any moment equals the length of the currently active chain of recursive calls from `f(8)` down to the base case.
The deepest chain occurs along the branch that decrements by the smallest step ($n - 2$):
- Call 1: `f(8)`
- Call 2: `f(6)`
- Call 3: `f(4)`
- Call 4: `f(2)`
- Call 5: `f(0)` (hits base case `n <= 0` and returns).

While `f(0)` is executing, all 5 frames (`f(8), f(6), f(4), f(2), f(0)`) are simultaneously present on the runtime stack. Once `f(0)` returns, its frame is popped before subsequent branches are explored. Any branch involving $n - 3$ has fewer calls (e.g., $8 \to 5 \to 2 \to 0$ has 4 frames).
Thus, the maximum number of activation records coexisting simultaneously is 5.

## Q4
type: MSQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.19
answer: A, C, D
difficulty: medium

Which of the following statements is/are **CORRECT** regarding runtime storage organization and activation records?

(A) In a language supporting recursion, activation records cannot be allocated purely statically because multiple instances of the same function can coexist simultaneously.
(B) In a block-structured language with lexical scoping, the access link (static link) always points to the activation record of the dynamic caller.
(C) The maximum number of activation records simultaneously present on the runtime stack during execution defines the peak stack depth.
(D) Tail-call elimination allows a compiler to reuse the current stack frame for the tail recursive call, avoiding the allocation of an additional frame.

### Solution
- (A) is TRUE: Static allocation reserves a single fixed memory location per function (as in early Fortran). With recursion, multiple activations of the same function must exist simultaneously, requiring a dynamic call stack.
- (B) is FALSE: That describes the **control link (dynamic link)**. The **access link (static link)** points to the activation record of the enclosing static parent procedure where the function is lexically defined.
- (C) is TRUE: When calls return, frames are popped and memory is reclaimed. Peak stack depth depends on the maximum active nested frames at any single instant, not on total lifetime calls.
- (D) is TRUE: Tail-call optimization (TCO) overwrites the current stack frame's arguments and jumps to the function start instead of pushing a new frame.

Hence, (A), (C), and (D) are correct.

## Q5
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.8
answer: A
difficulty: easy

Consider the following recursive C function:

```c
#include <stdio.h>

int f(int n) {
    static int x = 0;
    if (n <= 0) return 0;
    x += n;
    f(n - 1);
    return x;
}

int main() {
    printf("%d", f(4));
    return 0;
}
```

What is the output printed by the program?

(A) `10`
(B) `0`
(C) `4`
(D) `14`

### Solution
- `x` is a `static` variable allocated once in permanent global storage (Static Store), not on the stack.
- Winding phase:
  - `n = 4`: $x = 0 + 4 = 4 \implies$ calls `f(3)`
  - `n = 3`: $x = 4 + 3 = 7 \implies$ calls `f(2)`
  - `n = 2`: $x = 7 + 2 = 9 \implies$ calls `f(1)`
  - `n = 1`: $x = 9 + 1 = 10 \implies$ calls `f(0)`
  - `n = 0`: base case `n <= 0` triggers $\implies$ returns 0.
- Unwinding phase:
  Each returning frame resumes after `f(n - 1)` and executes `return x;`. Because `x` holds its final accumulated value 10 in static storage, every returning frame returns 10.
- `main` prints the return value of `f(4)`, which is 10.

Hence, (A) is correct.

## Q6
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.5
answer: 45
difficulty: hard
pyq: 2015s2-11

Consider the following recursive C function:

```c
int calc(int n) {
    int sum = 1, k;
    if (n <= 1) return 2;
    for (k = 1; k < n; k++) {
        sum += calc(k) + calc(n - k);
    }
    return sum;
}
```

The value returned by the function call `calc(4)` is ________.

### Solution
Evaluate `calc(n)` bottom-up:
- Base case: `calc(1) = 2`.
- For $n = 2$:
  `sum` initializes to 1.
  Loop runs for $k = 1$:
  `sum += calc(1) + calc(1) = 1 + 2 + 2 = 5`.
  Thus, `calc(2) = 5`.
- For $n = 3$:
  `sum` initializes to 1.
  Loop runs for $k = 1, 2$:
  - $k = 1$: `calc(1) + calc(2) = 2 + 5 = 7`
  - $k = 2$: `calc(2) + calc(1) = 5 + 2 = 7`
  `sum = 1 + 7 + 7 = 15`.
  Thus, `calc(3) = 15`.
- For $n = 4$:
  `sum` initializes to 1.
  Loop runs for $k = 1, 2, 3$:
  - $k = 1$: `calc(1) + calc(3) = 2 + 15 = 17`
  - $k = 2$: `calc(2) + calc(2) = 5 + 5 = 10`
  - $k = 3$: `calc(3) + calc(1) = 15 + 2 = 17`
  `sum = 1 + 17 + 10 + 17 = 45`.
  Thus, `calc(4) = 45`.

Answer is 45.

## Q7
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.18
answer: 92
difficulty: hard
pyq: 1994-21

Consider the following recursive C function:

```c
int solve(int n) {
    int buffer[6];
    if (n <= 0) return 0;
    return solve(n - 4) + n;
}
```

The program is run on a system that allocates a maximum call stack space of **960 bytes**.
Assume:
- Each activation record of `solve` on the stack requires:
  - 24 bytes for the local array `buffer` (6 integers $\times$ 4 bytes each)
  - 4 bytes for the parameter `n`
  - 4 bytes for the return address
  - 8 bytes for saved frame pointer and registers
- Stack memory is allocated for active frames and reclaimed immediately when a frame returns.

What is the **largest positive integer $n$ (where $n$ is a multiple of 4)** for which `solve(n)` can be called without causing a stack overflow?

### Solution
1. **Frame size:**
   $$\text{Frame size} = 24 + 4 + 4 + 8 = 40 \text{ bytes}.$$

2. **Maximum simultaneously active frames:**
   $$\text{Max frames} = \frac{960}{40} = 24 \text{ frames}.$$

3. **Active stack depth for multiples of 4:**
   Calls progress by step $-4$: $n, n - 4, n - 8, \dots, 4, 0$.
   At $n = 0$, `n <= 0` hits the base case.
   The total number of frames active simultaneously at the base case is:
   $$\text{Frames} = \frac{n - 0}{4} + 1 = \frac{n}{4} + 1.$$

4. **Solving for maximum $n$:**
   $$\frac{n}{4} + 1 \le 24 \implies \frac{n}{4} \le 23 \implies n \le 92.$$

For $n = 92$, exactly 24 frames ($24 \times 40 = 960$ bytes) are active, fitting within the limit. For $n = 96$, 25 frames (1000 bytes) would be required, causing stack overflow.
The largest positive multiple of 4 is 92.

## Q8
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.12
answer: A
difficulty: medium

Consider the mutually recursive functions `ping` and `pong` below:

```c
#include <stdio.h>

int pong(int x);

int ping(int x) {
    if (x <= 0) return 0;
    return x + pong(x / 2);
}

int pong(int x) {
    if (x <= 1) return 1;
    return 2 * ping(x - 1);
}

int main() {
    printf("%d", ping(12));
    return 0;
}
```

What is the output printed by the program?

(A) `30`
(B) `26`
(C) `34`
(D) `22`

### Solution
Tracing execution step-by-step:
- `ping(12) = 12 + pong(6)`
- `pong(6) = 2 * ping(5)`
- `ping(5) = 5 + pong(2)`
- `pong(2) = 2 * ping(1)`
- `ping(1) = 1 + pong(0)`
- `pong(0)`: condition `x <= 1` holds $\implies$ returns 1.

Unwinding:
- `ping(1) = 1 + 1 = 2`
- `pong(2) = 2 * 2 = 4`
- `ping(5) = 5 + 4 = 9`
- `pong(6) = 2 * 9 = 18`
- `ping(12) = 12 + 18 = 30`

The program prints 30.
Hence, (A) is correct.

## Q9
type: MSQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.14
answer: A, B, D
difficulty: medium

Consider the following recursive C functions:

```c
int f1(int n) {
    if (n <= 0) return 1;
    return f1(--n);
}

int f2(int n) {
    if (n == 1) return 1;
    return f2(n / 2);
}

int f3(int n) {
    if (n == 0) return 0;
    return f3(n - 2);
}

int f4(int n) {
    if (n <= 1) return 1;
    if (n % 2 == 0) return f4(n - 1);
    return f4(n - 2);
}
```

Which of the following statements is/are **CORRECT**?

(A) The call `f1(5)` terminates normally and returns 1.
(B) The call `f2(n)` terminates normally for every positive integer $n \ge 1$.
(C) The call `f3(n)` terminates normally for every positive integer $n \ge 1$.
(D) The call `f4(n)` terminates normally for every positive integer $n \ge 1$.

### Solution
- (A) is TRUE: Pre-decrement `--n` passes decremented value ($4, 3, 2, 1, 0$). At $n = 0$, base case `n <= 0` hits and returns 1 normally.
- (B) is TRUE: Integer division by 2 strictly decreases any integer $n > 1$ and eventually reaches $\lfloor 2 / 2 \rfloor = 1$ or $\lfloor 3 / 2 \rfloor = 1$, reaching base case $n == 1$.
- (C) is FALSE: If $n$ is odd (e.g. $n = 5$), calls progress: $5 \to 3 \to 1 \to -1 \to -3 \dots$, skipping $n == 0$ entirely and causing an infinite recursion (stack overflow).
- (D) is TRUE: For any integer $n > 1$: if even, it subtracts 1 (becomes odd); if odd, it subtracts 2 (remains odd). In all cases, $n$ strictly decreases until it reaches $\le 1$, hitting base case `n <= 1`.

Hence, (A), (B), and (D) are correct.

## Q10
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P10.4
answer: A
difficulty: medium

Consider the following program written in a C-like language with global variable `a`:

```c
#include <stdio.h>

int a = 5;

void modify(int x, int y) {
    x = x + 10;
    a = a * 2;
    y = y + a;
}

int main() {
    modify(a, a);
    printf("%d", a);
    return 0;
}
```

What will be printed for `a` if the language uses **Call by Reference** and **Call by Value-Result** (copy-out evaluated in left-to-right parameter order) respectively?

(A) `60` and `15`
(B) `15` and `60`
(C) `60` and `60`
(D) `30` and `15`

### Solution
- **Call by Reference:**
  Parameters `x` and `y` are aliases for the caller variable `a`.
  1. `x = x + 10`: updates `a = 5 + 10 = 15`.
  2. `a = a * 2`: updates `a = 15 * 2 = 30`.
  3. `y = y + a`: since `y` is an alias for `a` (which is now 30), this executes `a = 30 + 30 = 60`.
  Final value printed for `a` is 60.

- **Call by Value-Result:**
  1. Copy-in: $x = a = 5$, $y = a = 5$.
  2. Function body execution (locals $x, y$ are distinct from global $a$ during execution):
     - `x = x + 10 = 5 + 10 = 15`.
     - `a = a * 2 = 5 * 2 = 10` (modifies global `a`).
     - `y = y + a = 5 + 10 = 15`.
  3. Copy-out (left-to-right):
     - First, $x$ is copied back to $a \implies a = 15$.
     - Next, $y$ is copied back to $a \implies a = 15$.
  Final value printed for `a` is 15.

The outputs are 60 and 15 respectively.
Hence, (A) is correct.
