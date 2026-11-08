---
title: Programming in C · Unit Test 02
duration: 30
created: 2026-11-08
description: Unit test covering Units P05 and P06 (Functions, Scope, Storage, 1D Arrays, Pointers).
---

## Q1
type: MCQ
marks: 1
subject: programming-ds
topic: arrays-and-pointers
syllabus: P06.9
answer: B

Consider the following C program:

```c
#include <stdio.h>

void display(int *p, char c);

int main(void) {
    int x = 25;
    char ch = 'A';
    int *ptr = &x;
    // ____________;
    return 0;
}
```

Which one of the following expressions, when placed in the blank above, will **NOT** result in a compilation error or type-checking warning?

(A) `display(&x, *ch);`
(B) `display(ptr, ch);`
(C) `x = display(ptr, ch);`
(D) `display(*ptr, ch);`

### Solution
1. **Function prototype:** `void display(int *p, char c);`
   - First parameter: pointer to `int` (`int *`).
   - Second parameter: character (`char`).
   - Return type: `void` (returns no value).
2. **Analysis of options:**
   - In (A): `*ch` attempts to dereference `ch`, which is a plain `char` (not a pointer). Dereferencing a non-pointer causes a compilation error (`invalid type argument of unary '*'`).
   - In (B): `ptr` has type `int *` (matching parameter 1), and `ch` has type `char` (matching parameter 2). It is called as a standalone statement and matches the `void` return type. This compiles cleanly without error or warning.
   - In (C): `display` has return type `void`. Attempting to assign `display(ptr, ch)` to an integer variable `x` causes a compilation error (`void value not ignored as it ought to be`).
   - In (D): `*ptr` dereferences `ptr`, yielding an `int`. But parameter 1 expects `int *` (a pointer). Passing an integer to a pointer parameter without a cast causes a type-checking error or diagnostic warning.

Hence, (B) is the correct option.

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
float calculate(float x);

int main(void) {
    float a = 4.5f, b;
    b = calculate(a);
    printf("%.1f", b);
    return 0;
}

float calculate(float x) {
    return x * 2.0f;
}
```

If `Line 1` (the function prototype) is removed, which one of the following statements correctly describes what happens when the program is compiled?

(A) It compiles and runs without any errors or warnings.
(B) A compilation error occurs because the implicit return type (`int`) assumed at the call site conflicts with the function definition returning `float`.
(C) The compiler automatically deduces the return type of `calculate` by looking ahead to its definition, compiling cleanly.
(D) It causes an infinite loop at run time.

### Solution
1. **Function Prototypes and Implicit Declarations:**
   - When a function call is encountered before any declaration or prototype of that function, the C standard (C89/C90) assumes an implicit function declaration with an implicit return type of `int`.
   - In C99 and later revisions, implicit function declarations are invalid and produce diagnostic errors/warnings.
2. **Type Conflict upon Definition:**
   - When the compiler later reaches the definition `float calculate(float x)`, it observes that `calculate` actually returns `float`.
   - This directly conflicts with the previously assumed return type of `int`.
   - Standard C mandates that conflicting declarations/definitions for the same identifier produce a compilation error (`conflicting types for 'calculate'`).
3. Hence, removing Line 1 causes a compilation error due to the type mismatch between the assumed return type (`int`) and the defined return type (`float`).

Hence, (B) is the correct option.

## Q3
type: MSQ
marks: 1
subject: programming-ds
topic: arrays-and-pointers
syllabus: P06.16
answer: A, B, C

Consider the following declarations in standard C on a 64-bit architecture:

```c
int a[5] = {10, 20, 30, 40, 50};
int *p = a;
```

Which of the following statements is/are **TRUE**?

(A) `sizeof(a)` evaluates to the total size in bytes of the entire array, whereas `sizeof(p)` evaluates to the size of a pointer.
(B) The expressions `a + 1` and `&a + 1` evaluate to different memory addresses.
(C) The expressions `*(a + 3)` and `3[a]` access the exact same array element.
(D) In the expression `&a`, the identifier `a` decays to a pointer of type `int *`.

### Solution
- **Statement (A) is TRUE:**
  - An array name does NOT decay when used as the operand of `sizeof`. Thus `sizeof(a)` evaluates to $5 \times \text{sizeof}(int) = 20$ bytes.
  - In contrast, `p` is a pointer variable, so `sizeof(p)` evaluates to the pointer size (8 bytes on 64-bit).
- **Statement (B) is TRUE:**
  - `a + 1` advances by 1 element ($1 \times \text{sizeof}(int) = 4$ bytes), pointing to `a[1]`.
  - `&a` has type `int (*)[5]` (pointer to array of 5 ints). Therefore, `&a + 1` advances by the size of the entire 5-element array ($5 \times 4 = 20$ bytes), jumping past the array.
  - Thus, `a + 1` and `&a + 1` evaluate to different memory addresses.
- **Statement (C) is TRUE:**
  - In C, array subscripting is defined as `E1[E2] \equiv *(E1 + E2)`. Because addition is commutative, `*(a + 3) \equiv *(3 + a) \equiv 3[a] \equiv a[3]`.
- **Statement (D) is FALSE:**
  - In `&a`, the array name `a` does NOT decay into `int *`. Its type is `int (*)[5]` (pointer to an array of 5 integers).

Hence, (A), (B), and (C) are the correct options.

## Q4
type: NAT
marks: 1
subject: programming-ds
topic: arrays-and-pointers
syllabus: P06.12
answer: -6

Consider the following C program:

```c
#include <stdio.h>

void swap_ptrs(int *p, int *q) {
    int *t = p;
    p = q;
    q = t;
}

void swap_vals(int *p, int *q) {
    int t = *p;
    *p = *q;
    *q = t;
}

int main(void) {
    int x = 12, y = 25, z = 7;
    swap_ptrs(&x, &y);
    swap_vals(&y, &z);
    printf("%d", (x + y) - z);
    return 0;
}
```

What is the integer output displayed on execution?

### Solution
1. **Initial state in `main`:**
   - `x = 12, y = 25, z = 7`.
2. **Execution of `swap_ptrs(&x, &y)`:**
   - `swap_ptrs` receives copies of the addresses of `x` and `y`.
   - The function swaps its local pointer parameters `p` and `q`.
   - Because C passes parameters strictly by value, swapping `p` and `q` has zero effect on the caller's variables `x` and `y`.
   - After return: `x = 12, y = 25`.
3. **Execution of `swap_vals(&y, &z)`:**
   - `swap_vals` receives pointers to `y` and `z`.
   - It dereferences `*p` and `*q` using temporary variable `t`.
   - This performs a genuine swap on the memory contents of `y` and `z`.
   - After return: `y = 7, z = 25`.
4. **Final calculation:**
   - `(x + y) - z = (12 + 7) - 25 = 19 - 25 = -6`.

Hence, the output is -6.

## Q5
type: NAT
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P05.2
answer: 9

Consider the following C program:

```c
#include <stdio.h>

int calc(int n) {
    int r = 0;
    while (n > 0) {
        r += (n % 4);
        n /= 4;
    }
    return r;
}

int main(void) {
    printf("%d", calc(183));
    return 0;
}
```

What is the integer output displayed on execution?

### Solution
1. The function `calc(n)` extracts the base-4 (quaternary) digits of `n` using `n % 4` and sums them into `r`, dividing `n` by 4 on each iteration until `n == 0`.
2. Trace for `n = 183`:
   - Iteration 1: $183 \% 4 = 3$, $r = 0 + 3 = 3$, $n = 183 / 4 = 45$.
   - Iteration 2: $45 \% 4 = 1$, $r = 3 + 1 = 4$, $n = 45 / 4 = 11$.
   - Iteration 3: $11 \% 4 = 3$, $r = 4 + 3 = 7$, $n = 11 / 4 = 2$.
   - Iteration 4: $2 \% 4 = 2$, $r = 7 + 2 = 9$, $n = 2 / 4 = 0$.
3. Condition `n > 0` becomes false, loop terminates.
4. `calc(183)` returns `9`.

Hence, the output is 9.

## Q6
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P05.11
answer: B

Consider the following C program:

```c
#include <stdio.h>

int x = 20;

void evaluate(int a) {
    int x = 5;
    if (a > 0) {
        int x = a * 2;
        x += 3;
    }
    printf("%d, ", x);
}

int main(void) {
    int a = 4;
    evaluate(a);
    {
        int x = a + 1;
        printf("%d, ", x);
    }
    printf("%d", x);
    return 0;
}
```

What is the output displayed on execution?

(A) 11, 5, 20
(B) 5, 5, 20
(C) 5, 5, 5
(D) 11, 5, 5

### Solution
1. **Tracing `evaluate(4)`:**
   - Function-level local variable `x = 5`.
   - `if (a > 0)` block declares an inner local `int x = a * 2 = 8;`.
   - Inside the `if` block, `x += 3` modifies this inner `x` to 11.
   - At the close of the `if` block, that inner `x` is destroyed.
   - `printf("%d, ", x)` accesses the function-level `x`, which is still `5`.
   - Output so far: `5, `
2. **Inside `main`:**
   - Nested block `{ int x = a + 1; ... }`:
     - Declares a block-local `x = 4 + 1 = 5`.
     - `printf("%d, ", x)` prints `5, `.
     - Block ends; that block-local `x` is destroyed.
   - Outside the block:
     - `printf("%d", x)` refers to the global variable `x = 20`.
     - Prints `20`.
3. Complete output: `5, 5, 20`.

Hence, (B) is the correct option.

## Q7
type: MCQ
marks: 2
subject: programming-ds
topic: arrays-and-pointers
syllabus: P06.4
answer: B

Consider the following C program:

```c
#include <stdio.h>

int main(void) {
    int i, k;
    int arr[6] = {2, 4, 6, 8, 10, 12};

    for (i = 0; i < 4; i++) {
        arr[i] += 2;
        i++;
    }
    i--;

    for (k = 5; k > 2; k--) {
        int i = k / 2;
        arr[i] -= 1;
    }

    printf("%d, %d", i, arr[i]);
    return 0;
}
```

What is the output displayed on execution?

(A) 2, 6
(B) 3, 8
(C) 2, 8
(D) 3, 6

### Solution
1. **Initial array:** `arr = {2, 4, 6, 8, 10, 12}`.
2. **First loop:**
   - `i = 0`: `arr[0] += 2` $\rightarrow arr[0] = 4$. Body `i++` makes `i = 1`. Header `i++` makes `i = 2`.
   - `i = 2`: `arr[2] += 2` $\rightarrow arr[2] = 8$. Body `i++` makes `i = 3`. Header `i++` makes `i = 4`.
   - `i = 4`: condition `i < 4` is false. Loop exits with `i = 4`.
   - Next statement: `i--;` makes outer `i = 3`.
3. **Second loop:**
   - In each iteration, `int i = k / 2;` declares a local variable `i` that shadows the outer `i`.
   - Iteration $k = 5$: inner `i = 5 / 2 = 2`. `arr[2] -= 1` $\rightarrow arr[2] = 7$.
   - Iteration $k = 4$: inner `i = 4 / 2 = 2`. `arr[2] -= 1` $\rightarrow arr[2] = 6$.
   - Iteration $k = 3$: inner `i = 3 / 2 = 1`. `arr[1] -= 1` $\rightarrow arr[1] = 4 - 1 = 3$.
   - Condition $k > 2$ fails at $k = 2$.
   - Throughout this loop, outer `i` remains completely untouched: `outer i == 3`.
4. **Final `printf("%d, %d", i, arr[i])`:**
   - `i` is the outer variable: `3`.
   - `arr[i]` is `arr[3]`. Notice `arr[3]` was never modified during either loop, so it retains its initial value `8`.
   - Prints: `3, 8`.

Hence, (B) is the correct option.

## Q8
type: MSQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P05.14
answer: A, B, C

Consider the following statements regarding storage classes and memory segments in standard C:

(A) A local variable declared with the `static` storage class specifier inside a function retains its value between successive calls and is allocated in the data/BSS segment, not on the call stack.
(B) An uninitialized global variable is placed in the BSS segment and is automatically initialized to zero by the runtime before program startup.
(C) An activation record (stack frame) allocated for a function call stores its local automatic variables, function parameters, and the return address.
(D) Returning the address of a local automatic variable from a function is guaranteed to be safe because the variable's storage duration persists until `main` terminates.

### Solution
- **Statement (A) is TRUE:**
  - Variables declared `static` inside a function have static storage duration. They are allocated once at compile/load time in the data segment (if initialized) or BSS segment (if uninitialized) and retain their values across function invocations.
- **Statement (B) is TRUE:**
  - In C, all variables with static storage duration (globals and statics) that are not explicitly initialized are placed in the BSS segment and guaranteed by the standard to be initialized to zero.
- **Statement (C) is TRUE:**
  - An activation record created on the call stack contains the actual arguments/parameters, local automatic variables, saved registers, and the return address.
- **Statement (D) is FALSE:**
  - Local automatic variables have automatic storage duration; their lifetime terminates as soon as their enclosing function returns and its activation record is popped off the stack. Returning a pointer to such a variable produces a dangling pointer, and dereferencing it causes undefined behavior.

Hence, (A), (B), and (C) are the correct options.

## Q9
type: NAT
marks: 2
subject: programming-ds
topic: arrays-and-pointers
syllabus: P06.13
answer: 45

Consider the following C program:

```c
#include <stdio.h>

void modify(int **pp, int *q, int offset) {
    *pp = q + offset;
    **pp += 10;
}

int main(void) {
    int arr[] = {10, 20, 30, 40, 50};
    int *ptr = arr;

    modify(&ptr, arr, 2);
    *ptr += 5;

    printf("%d", arr[2]);
    return 0;
}
```

What is the integer output displayed on execution?

### Solution
1. **Initial state:**
   - `arr = {10, 20, 30, 40, 50}`.
   - `ptr = arr` (points to `arr[0]`).
2. **Call `modify(&ptr, arr, 2)`:**
   - `pp` is `&ptr` (holds the address of the pointer `ptr`).
   - `q` is `arr` (points to `arr[0]`).
   - `offset` is `2`.
   - `*pp = q + offset;`:
     - `*pp` dereferences `pp` to access `ptr` in `main`.
     - Assigns `arr + 2` to `ptr`. Thus, `ptr` in `main` now points directly to `arr[2]`!
   - `**pp += 10;`:
     - Dereferences `ptr` to access `arr[2]`.
     - `arr[2] = 30 + 10 = 40`.
3. **Back in `main`:**
   - `*ptr += 5;`:
     - Since `ptr` points to `arr[2]`, this adds 5 to `arr[2]`.
     - `arr[2] = 40 + 5 = 45`.
4. `printf("%d", arr[2])` prints `45`.

Hence, the output is 45.

## Q10
type: NAT
marks: 2
subject: programming-ds
topic: arrays-and-pointers
syllabus: P06.19
answer: 42

Consider the following C program:

```c
#include <stdio.h>

int main(void) {
    int arr[] = {4, 8, 12, 16, 20};
    int *p = arr;
    int a, b, c;

    a = *p++;
    b = *++p;
    (*p)++;
    c = *p;

    printf("%d", a + b + c + arr[2]);
    return 0;
}
```

What is the integer output displayed on execution?

### Solution
1. **Initial state:**
   - `arr = {4, 8, 12, 16, 20}`.
   - `p = arr` (points to `arr[0]`, where value is 4).
2. **`a = *p++;`:**
   - Postfix `++` has higher precedence than unary `*`.
   - Postfix `++` evaluates to the old pointer (`&arr[0]`), then advances `p` to `&arr[1]`.
   - `*` dereferences the old pointer, so `a = arr[0] = 4`.
   - Pointer state: `p` points to `arr[1]`.
3. **`b = *++p;`:**
   - Prefix `++` advances `p` from `&arr[1]` to `&arr[2]`, evaluating to the new pointer.
   - `*` dereferences the new pointer, so `b = arr[2] = 12`.
   - Pointer state: `p` points to `arr[2]`.
4. **`(*p)++;`:**
   - Parentheses force `*p` first, accessing `arr[2]` (value 12).
   - Postfix `++` increments that value in memory: `arr[2]` becomes `13`.
   - Pointer state: `p` still points to `arr[2]`.
5. **`c = *p;`:**
   - Reads the current value at `arr[2]`: `c = 13`.
6. **Final calculation:**
   - `a + b + c + arr[2] = 4 + 12 + 13 + 13 = 42`.

Hence, the output is 42.
