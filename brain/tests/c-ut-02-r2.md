---
title: Programming in C · Unit Retest 02
duration: 30
created: 2026-11-08
description: Retest covering Units P05 and P06 (Functions, Storage Classes, 1D Arrays, Pointers).
---

## Q1
type: MCQ
marks: 1
subject: programming-ds
topic: arrays-and-pointers
syllabus: P06.9
answer: D

Consider the following C program:

```c
#include <stdio.h>

void transform(int *arr, int len);

int main(void) {
    int data[4] = {1, 2, 3, 4};
    int val = 10;
    int *ptr = data;
    // ____________;
    return 0;
}
```

Which one of the following expressions, when placed in the blank above, will **NOT** result in a compilation error or type-checking warning?

(A) `transform(&data, 4);`
(B) `transform(data[0], 4);`
(C) `val = transform(ptr, 4);`
(D) `transform(ptr + 1, 3);`

### Solution
1. **Function prototype:** `void transform(int *arr, int len);`
   - Parameter 1: pointer to `int` (`int *`).
   - Parameter 2: `int`.
   - Return type: `void`.
2. **Analysis of options:**
   - (A): `&data` has type `int (*)[4]` (pointer to an array of 4 integers), which is incompatible with `int *` without an explicit cast.
   - (B): `data[0]` is an `int`, not `int *`. Passing a scalar integer to a pointer parameter produces a type error/warning.
   - (C): `transform` has return type `void`. Attempting to assign its return value to `val` causes a compilation error (`void value not ignored as it ought to be`).
   - (D): `ptr + 1` performs pointer arithmetic and yields a valid pointer of type `int *` (pointing to `data[1]`), and `3` is an `int`. This matches the prototype exactly and compiles cleanly.

Hence, (D) is the correct option.

## Q2
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P05.5
answer: B

Consider the following C program:

```c
#include <stdio.h>

/* Line 1 */
double compute_root(double val);

int main(void) {
    double x = 16.0;
    double res = compute_root(x);
    printf("%.1f", res);
    return 0;
}

double compute_root(double val) {
    return val / 2.0;
}
```

If `Line 1` (the function prototype) is removed from the program, which one of the following statements correctly describes the result during compilation?

(A) The program compiles cleanly without errors or warnings because C compilers automatically look ahead to locate definitions in the same file.
(B) A compilation error occurs because the implicit return type (`int`) assumed at the call site conflicts with the function definition returning `double`.
(C) The compiler automatically modifies the return type of `compute_root` to `int` and compiles cleanly.
(D) The compiler executes the function during compilation and inlines the constant result.

### Solution
1. **Implicit declarations in C:**
   - C compiles translation units in a single pass from top to bottom.
   - When a call `compute_root(x)` is encountered before any prototype or declaration exists, the compiler assumes an implicit declaration with an implicit return type of `int`.
2. **Type conflict upon definition:**
   - When the compiler subsequently encounters the definition `double compute_root(double val)`, it observes that the actual return type is `double`.
   - This directly conflicts with the previously assumed return type of `int`.
   - Standard C mandates that conflicting declarations/definitions for the same function produce a compilation error (`conflicting types for 'compute_root'`).

Hence, (B) is the correct option.

## Q3
type: MSQ
marks: 1
subject: programming-ds
topic: arrays-and-pointers
syllabus: P06.16
answer: A, B, C, D

Consider the following declarations in standard C on a 64-bit architecture where `sizeof(int) == 4` and pointers occupy 8 bytes:

```c
int arr[6] = {5, 10, 15, 20, 25, 30};
int *p = arr;
```

Which of the following statements is/are **TRUE**?

(A) `sizeof(arr)` evaluates to 24 bytes, while `sizeof(p)` evaluates to 8 bytes.
(B) The expression `p + 2` evaluates to a memory address that is 8 bytes greater than `p`.
(C) The expression `&arr + 1` evaluates to a memory address that is 24 bytes greater than `arr`.
(D) The expressions `*(arr + 4)` and `4[arr]` yield the exact same value.

### Solution
- **Statement (A) is TRUE:**
  - `sizeof` is an explicit exception to array decay. `sizeof(arr)` yields the size of the whole array: $6 \times 4 = 24$ bytes.
  - `p` is a pointer variable, so `sizeof(p)` yields the size of a pointer on 64-bit systems, which is 8 bytes.
- **Statement (B) is TRUE:**
  - Pointer arithmetic scales by `sizeof(*p)`: adding 2 to `p` advances by $2 \times \text{sizeof}(int) = 2 \times 4 = 8$ bytes in memory.
- **Statement (C) is TRUE:**
  - `&arr` has type `int (*)[6]` (pointer to an array of 6 integers). Adding 1 to `&arr` jumps past the entire array, advancing by $6 \times 4 = 24$ bytes.
- **Statement (D) is TRUE:**
  - By the definition of the subscript operator in C, `arr[i] \equiv *(arr + i) \equiv *(i + arr) \equiv i[arr]`. Thus `*(arr + 4)` and `4[arr]` both access `arr[4]` (value 25).

Hence, (A), (B), (C), and (D) are all correct.

## Q4
type: NAT
marks: 1
subject: programming-ds
topic: arrays-and-pointers
syllabus: P06.12
answer: 14

Consider the following C program:

```c
#include <stdio.h>

void f1(int a, int b) {
    int t = a; a = b; b = t;
}

void f2(int *p, int *q) {
    int t = *p; *p = *q; *q = t;
}

void f3(int *p, int *q) {
    int *t = p; p = q; q = t;
}

int main(void) {
    int u = 8, v = 14, w = 20;
    f1(u, v);
    f2(&v, &w);
    f3(&u, &w);
    printf("%d", (u + v) - w);
    return 0;
}
```

What is the integer output displayed on execution?

### Solution
1. **Initial state in `main`:**
   - `u = 8, v = 14, w = 20`.
2. **`f1(u, v);`:**
   - Pure call-by-value. Only local variables `a` and `b` inside `f1` are swapped.
   - Variables `u` and `v` in `main` are untouched: `u = 8, v = 14`.
3. **`f2(&v, &w);`:**
   - Receives pointers to `v` and `w` and performs a dereference swap (`*p` and `*q`).
   - This genuinely swaps the contents of `v` and `w`: `v` becomes 20, `w` becomes 14.
4. **`f3(&u, &w);`:**
   - Receives pointers to `u` and `w`, but only swaps the local pointer parameters `p` and `q`.
   - Variables `u` and `w` in `main` remain untouched: `u = 8, w = 14`.
5. **Final calculation:**
   - `(u + v) - w = (8 + 20) - 14 = 28 - 14 = 14`.

Hence, the output is 14.

## Q5
type: NAT
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P05.2
answer: 5

Consider the following C program:

```c
#include <stdio.h>

int process(int n) {
    int total = 0;
    while (n > 0) {
        total += (n % 3);
        n /= 3;
    }
    return total;
}

int main(void) {
    printf("%d", process(59));
    return 0;
}
```

What is the integer output displayed on execution?

### Solution
1. The function `process(n)` extracts the base-3 (ternary) digits of `n` using `n % 3` and accumulates them into `total`, dividing `n` by 3 in each step until `n == 0`.
2. Trace for `n = 59`:
   - Iteration 1: $59 \% 3 = 2$, `total = 0 + 2 = 2`, `n = 59 / 3 = 19`.
   - Iteration 2: $19 \% 3 = 1$, `total = 2 + 1 = 3`, `n = 19 / 3 = 6`.
   - Iteration 3: $6 \% 3 = 0$, `total = 3 + 0 = 3`, `n = 6 / 3 = 2`.
   - Iteration 4: $2 \% 3 = 2$, `total = 3 + 2 = 5`, `n = 2 / 3 = 0`.
3. Loop terminates as `n > 0` is false.
4. `process(59)` returns `5`.

Hence, the output is 5.

## Q6
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P05.7
answer: B

Consider the following C program:

```c
#include <stdio.h>

int mix(int a, int b) {
    return 3 * a - b;
}

int main(void) {
    int p = 3, q = 4;
    p = mix(q, p);
    q = mix(p, q);
    printf("%d, %d", p, q);
    return 0;
}
```

What is the output displayed on execution?

(A) 5, 11
(B) 9, 23
(C) 9, 13
(D) 12, 32

### Solution
1. **Initial state:** `p = 3, q = 4`.
2. **First call: `p = mix(q, p);`**
   - Arguments passed: `a = q = 4`, `b = p = 3`.
   - `mix(4, 3) = 3 * 4 - 3 = 12 - 3 = 9`.
   - `p` is assigned `9`. State: `p = 9, q = 4`.
3. **Second call: `q = mix(p, q);`**
   - Arguments passed: `a = p = 9`, `b = q = 4`.
   - `mix(9, 4) = 3 * 9 - 4 = 27 - 4 = 23`.
   - `q` is assigned `23`. State: `p = 9, q = 23`.
4. `printf("%d, %d", p, q)` prints `9, 23`.

Hence, (B) is the correct option.

## Q7
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P05.15
answer: C

Consider the following C program:

```c
#include <stdio.h>

int count_bits(int v) {
    static int accumulated = 0;
    while (v) {
        accumulated += (v & 1);
        v >>= 1;
    }
    return accumulated;
}

int main(void) {
    int sum = 0;
    int k;
    for (k = 4; k >= 2; k--) {
        sum += count_bits(k);
    }
    printf("%d", sum);
    return 0;
}
```

What is the output displayed on execution?

(A) 4
(B) 6
(C) 8
(D) 10

### Solution
1. **Behavior of `count_bits(v)`:**
   - The variable `accumulated` is `static`: it is initialized to 0 once and preserves its accumulated value across calls.
   - The `while(v)` loop counts the number of set bits (1s) in the binary representation of `v` and adds them to `accumulated`.
2. **Tracing iterations of the loop in `main`:**
   - Iteration $k = 4$ ($4 = 100_2$, 1 set bit):
     - `accumulated` increases by 1: `accumulated = 0 + 1 = 1`.
     - Returns 1. `sum = 0 + 1 = 1`.
   - Iteration $k = 3$ ($3 = 011_2$, 2 set bits):
     - `accumulated` increases by 2: `accumulated = 1 + 2 = 3`.
     - Returns 3. `sum = 1 + 3 = 4`.
   - Iteration $k = 2$ ($2 = 010_2$, 1 set bit):
     - `accumulated` increases by 1: `accumulated = 3 + 1 = 4`.
     - Returns 4. `sum = 4 + 4 = 8`.
3. Loop finishes. `printf("%d", sum)` prints `8`.

Hence, (C) is the correct option.

## Q8
type: MSQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P05.11
answer: A, B, C

Consider the following C program structure:

```c
int val = 100;

void test(void) {
    int val = 20;
    {
        int val = 5;
        // Point X
    }
    // Point Y
}
```

Which of the following statements is/are **TRUE** regarding variable scope and shadowing?

(A) At Point X, the identifier `val` refers to the inner block-scope variable with value 5.
(B) At Point Y, the inner block-scope variable has been destroyed, and `val` refers to the function-scope variable with value 20.
(C) Throughout the execution of function `test`, the global variable `val` is shadowed and cannot be referenced directly by its simple identifier `val`.
(D) If the declaration `int val = 5;` at Point X is omitted, an assignment `val = 50;` at Point X would directly modify the global variable `val`.

### Solution
- **Statement (A) is TRUE:**
  - In C, an inner block declaration shadows any outer declaration with the same name. At Point X, `val` refers to the innermost local variable with value 5.
- **Statement (B) is TRUE:**
  - Automatic variables defined inside a block are destroyed when execution leaves that block. At Point Y, the inner `val` no longer exists, so `val` refers to the function-level local variable (`val = 20`).
- **Statement (C) is TRUE:**
  - The function-level declaration `int val = 20;` shadows the file-scope global variable `val` everywhere inside `test()`. In standard C, there is no scope resolution operator (like `::` in C++) to access the shadowed global variable directly by name.
- **Statement (D) is FALSE:**
  - If the inner declaration is omitted, `val = 50;` would modify the enclosing function-scope local variable `val = 20;`, NOT the global variable `val`, because the function-scope `val` still shadows the global variable.

Hence, (A), (B), and (C) are the correct options.

## Q9
type: NAT
marks: 2
subject: programming-ds
topic: arrays-and-pointers
syllabus: P06.13
answer: 60

Consider the following C program:

```c
#include <stdio.h>

void step(int **pp, int *base, int jump) {
    *pp = base + jump;
    **pp += 15;
}

int main(void) {
    int arr[] = {5, 15, 25, 35, 45};
    int *ptr = arr;

    step(&ptr, arr, 3);
    *ptr += 10;

    printf("%d", arr[3]);
    return 0;
}
```

What is the integer output displayed on execution?

### Solution
1. **Initial state:**
   - `arr = {5, 15, 25, 35, 45}`.
   - `ptr = arr` (points to `arr[0]`).
2. **Call `step(&ptr, arr, 3)`:**
   - `pp` is `&ptr` (address of pointer variable `ptr`).
   - `base` is `arr`, `jump` is `3`.
   - `*pp = base + jump;`:
     - Dereferencing `pp` accesses `ptr` in `main`.
     - Assigns `arr + 3` to `ptr`. Thus, `ptr` in `main` now points to `arr[3]`.
   - `**pp += 15;`:
     - Dereferences `ptr` to access `arr[3]`.
     - `arr[3]` becomes $35 + 15 = 50$.
3. **Back in `main`:**
   - `*ptr += 10;`:
     - Since `ptr` points to `arr[3]`, this adds 10 to `arr[3]`.
     - `arr[3]` becomes $50 + 10 = 60$.
4. `printf("%d", arr[3])` prints `60`.

Hence, the output is 60.

## Q10
type: NAT
marks: 2
subject: programming-ds
topic: arrays-and-pointers
syllabus: P06.19
answer: 38

Consider the following C program:

```c
#include <stdio.h>

int main(void) {
    int arr[] = {3, 7, 11, 15, 19};
    int *p = arr;
    int x, y, z;

    x = *p++;
    y = *++p;
    (*p)++;
    z = *p;

    printf("%d", x + y + z + arr[2]);
    return 0;
}
```

What is the integer output displayed on execution?

### Solution
1. **Initial state:**
   - `arr = {3, 7, 11, 15, 19}`.
   - `p = arr` (points to `arr[0]`, where value is 3).
2. **`x = *p++;`:**
   - Postfix `++` evaluates to the old pointer (`&arr[0]`), then advances `p` to `&arr[1]`.
   - `*` dereferences that old pointer: `x = arr[0] = 3`.
   - `p` now points to `arr[1]`.
3. **`y = *++p;`:**
   - Prefix `++` advances `p` first from `&arr[1]` to `&arr[2]`.
   - `*` dereferences the new pointer: `y = arr[2] = 11`.
   - `p` points to `arr[2]`.
4. **`(*p)++;`:**
   - `*p` accesses `arr[2]` (value 11).
   - Postfix `++` increments that value in memory: `arr[2]` becomes `12`.
   - `p` still points to `arr[2]`.
5. **`z = *p;`:**
   - Reads the updated value at `arr[2]`: `z = 12`.
6. **Final calculation:**
   - `x + y + z + arr[2] = 3 + 11 + 12 + 12 = 38`.

Hence, the output is 38.
