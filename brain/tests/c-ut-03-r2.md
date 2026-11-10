---
title: Programming in C · Unit Retest 03
duration: 30
created: 2026-11-10
description: Retest covering P07 (Multi-dimensional arrays, arrays of pointers, declarations) and P08 (Strings), with weak reviews from P06.
---

## Q1
type: MCQ
marks: 1
subject: programming-ds
topic: arrays-and-pointers
syllabus: P07.15
answer: B

Consider the following two declarations in a C program:

```c
int *f(int);
int (*g)(int);
```

Which of the following statements is **TRUE**?

(A) Both `f` and `g` declare pointers to functions.
(B) `f` is a function returning a pointer to `int`, whereas `g` is a pointer to a function returning an `int`.
(C) `f` is a pointer to a function returning an `int`, whereas `g` is a function returning a pointer to `int`.
(D) Both `f` and `g` declare functions returning `int *`.

### Solution
1. In `int *f(int);`:
   - The function call operator `()` binds tighter to `f` than the dereference operator `*`.
   - Thus, `f` is a function taking an `int` parameter.
   - The prefix `*` applies to the return type: it returns `int *` (a pointer to `int`).
2. In `int (*g)(int);`:
   - Parentheses around `*g` force the `*` to bind to `g` first: `g` is a pointer variable.
   - The following `(int)` indicates that it points to a function accepting an `int`.
   - The return type is `int`.
   - Thus, `g` is a pointer to a function taking an `int` and returning `int`.

Correct option is (B).

## Q2
type: MCQ
marks: 1
subject: programming-ds
topic: strings
syllabus: P08.13
answer: A

Consider a C program executed from the terminal as:

```bash
./eval test 2026 ok
```

Inside `main`:

```c
#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("%d %s %c\n", argc, argv[1], argv[3][1]);
    return 0;
}
```

What will be printed by the program?

(A) `4 test k`
(B) `4 eval o`
(C) `3 test o`
(D) `5 eval k`

### Solution
1. In C command-line arguments:
   - `argc` counts the total tokens passed, including the executable name:
     `argv[0] = "./eval"`, `argv[1] = "test"`, `argv[2] = "2026"`, `argv[3] = "ok"`.
   - Thus, `argc = 4`.
2. `argv[1]` is the string `"test"`.
3. `argv[3]` is the string `"ok"`.
   - Its character indices are `[0]='o'`, `[1]='k'`.
   - Thus, `argv[3][1]` is `'k'`.
4. Output: `4 test k`.

Correct option is (A).

## Q3
type: MSQ
marks: 1
subject: programming-ds
topic: arrays-and-pointers
syllabus: P07.8
answer: A, C, D

Consider a 2D integer array `int M[4][4]` stored in row-major order, where each element is initialized as `M[i][j] = 2 * i + j`.

Consider the following loops:

```c
// Loop 1
for (int i = 0; i < 4; i++)
    ans1[i] = M[1][i];

// Loop 2
for (int i = 0; i < 4; i++)
    ans2[i] = M[i][1];

// Loop 3
for (int i = 0; i < 4; i++)
    ans3[i] = *(*(M + 1) + i);
```

Which of the following statements is/are **TRUE**?

(A) The elements of `M` accessed in Loop 1 are contiguous in main memory.
(B) The elements of `M` accessed in Loop 2 are contiguous in main memory.
(C) Loop 1 and Loop 3 access the exact same memory locations in the exact same order.
(D) `ans1[2]` evaluates to `4`.

### Solution
1. **Statement (A):** In row-major order, elements within the same row are placed side-by-side in contiguous memory. Loop 1 accesses row 1 (`M[1][0], M[1][1], M[1][2], M[1][3]`). These are contiguous in memory. (A is TRUE).
2. **Statement (B):** Loop 2 accesses column 1 (`M[0][1], M[1][1], M[2][1], M[3][1]`). Each subsequent element belongs to the next row, jumping 4 integers (16 bytes) in memory. They are not contiguous. (B is FALSE).
3. **Statement (C):** By pointer-indexing equivalence, `*(*(M + 1) + i) \equiv M[1][i]`. Both loops traverse row 1 in increasing column order. (C is TRUE).
4. **Statement (D):** `ans1[2] = M[1][2] = 2 * (1) + 2 = 4`. (D is TRUE).

Correct options are A, C, D.

## Q4
type: NAT
marks: 1
subject: programming-ds
topic: arrays-and-pointers
syllabus: P07.7
answer: 52

An array `int Arr[8][12]` is stored in row-major order with 0-based indexing starting at byte base address 1000. Each `int` occupies 4 bytes of memory.

An optimizing compiler translates the element access `Arr[i][j]` into the address calculation:

$$\text{Address} = 1000 + i \times K_1 + j \times K_2$$

where $K_1$ and $K_2$ are integer constants.

The value of $K_1 + K_2$ is _______.

### Solution
1. In row-major layout for a 2D array `Arr[R][C]`, the byte address of `Arr[i][j]` is:
   $$\text{Address} = \text{Base} + \Big(i \times C + j\Big) \times \text{element\_size}$$
2. Here:
   - Row width $C = 12$ elements.
   - Element size $= 4$ bytes.
   - Expanding:
     $$\text{Address} = \text{Base} + i \times (12 \times 4) + j \times 4 = \text{Base} + i \times 48 + j \times 4$$
3. Thus:
   - $K_1 = 48$
   - $K_2 = 4$
4. Sum:
   $$K_1 + K_2 = 48 + 4 = 52$$

The answer is 52.

## Q5
type: MCQ
marks: 1
subject: programming-ds
topic: strings
syllabus: P08.10
answer: B

Consider the following flawed C function:

```c
void replace_chars(char *s, char *from, char *to) {
    for (int i = 0; s[i] != '\0'; i++) {
        for (int j = 0; from[j] != '\0'; j++) {
            if (s[i] == from[j]) {
                s[i] = to[j];
            }
        }
    }
}
```

Suppose `from = "xyz"` and `to = "yzx"`.

If the string `s` is initially `"x"`, what will `s` contain after calling `replace_chars(s, from, to)`?

(A) `"y"`
(B) `"x"`
(C) `"z"`
(D) `""`

### Solution
1. `s = "x"`, `from = "xyz"`, `to = "yzx"`.
2. Outer loop: `i = 0`, `s[0] = 'x'`.
3. Inner loop starts iterating over `j`:
   - `j = 0`: `from[0] == 'x'`. `s[0] == from[0]` matches!
     `s[0]` is assigned `to[0] = 'y'`.
   - Because there is no `break;`, the inner loop continues to `j = 1`!
   - `j = 1`: `from[1] == 'y'`. The newly written `s[0]` is now `'y'`, so `s[0] == from[1]` matches again!
     `s[0]` is assigned `to[1] = 'z'`.
   - `j = 2`: `from[2] == 'z'`. Now `s[0]` is `'z'`, which matches `from[2]`!
     `s[0]` is assigned `to[2] = 'x'`.
4. The inner loop terminates with `s[0] = 'x'`.
5. The lack of `break` causes a cascading 3-step cycle (`x -> y -> z -> x`), leaving `s` unchanged as `"x"`.

Correct option is (B).

## Q6
type: NAT
marks: 2
subject: programming-ds
topic: arrays-and-pointers
syllabus: P07.6
answer: 39

Consider the following C program:

```c
#include <stdio.h>

int main(void) {
    int grid[3][4] = {
        {1,  3,  5,  7},
        {9,  11, 13, 15},
        {17, 19, 21, 23}
    };
    int (*p)[4] = grid;

    int u = *(*(p + 1) + 1);
    int v = *(p[2] - 2);
    int w = *(*p + 7);

    printf("%d\n", u + v + w);
    return 0;
}
```

The output of the program is _______.

### Solution
1. `grid` is a $3 \times 4$ integer array laid out contiguously row by row:
   - Row 0: `1, 3, 5, 7`
   - Row 1: `9, 11, 13, 15`
   - Row 2: `17, 19, 21, 23`
2. `p` points to Row 0 (`grid[0]`).
3. **Evaluating `u = *(*(p + 1) + 1)`:**
   - `p + 1` points to Row 1 (`grid[1]`).
   - `*(p + 1)` decays to `&grid[1][0]`.
   - `*(p + 1) + 1` points to `&grid[1][1]`.
   - Dereferencing gives `grid[1][1] = 11`. Thus, `u = 11`.
4. **Evaluating `v = *(p[2] - 2)`:**
   - `p[2]` represents Row 2 and decays to `&grid[2][0]` (value 17).
   - `p[2] - 2` steps 2 integers backward in contiguous row-major memory:
     One step back is `grid[1][3] = 15`.
     Two steps back is `grid[1][2] = 13`.
   - Dereferencing yields `13`. Thus, `v = 13`.
5. **Evaluating `w = *(*p + 7)`:**
   - `*p` decays to `&grid[0][0]`.
   - `*p + 7` steps 7 integers forward linearly along contiguous memory:
     Indices $0 \dots 3$ are Row 0 (`1, 3, 5, 7`).
     Indices $4 \dots 7$ are Row 1 (`9, 11, 13, 15`).
     Element at index 7 is `grid[1][3] = 15`.
   - Dereferencing yields `15`. Thus, `w = 15`.
6. **Total sum:**
   $$u + v + w = 11 + 13 + 15 = 39$$

The output of the program is 39.

## Q7
type: MCQ
marks: 2
subject: programming-ds
topic: arrays-and-pointers
syllabus: P06.19
answer: A

Consider the following C program:

```c
#include <stdio.h>

int main(void) {
    int list[] = {12, 24, 36, 48, 60, 72};
    int *ptrs[] = {list + 3, list + 1, list + 5, list, list + 4};
    int **dptr = ptrs + 2;

    dptr--;
    printf("%ld %d %d\n", dptr - ptrs, **dptr, *(*dptr + 2));
    return 0;
}
```

What is printed by the program?

(A) `1 24 48`
(B) `2 72 60`
(C) `1 24 36`
(D) `0 48 72`

### Solution
1. `list` contains: `list[0]=12, list[1]=24, list[2]=36, list[3]=48, list[4]=60, list[5]=72`.
2. `ptrs` contains 5 pointers to `int`:
   - `ptrs[0] = list + 3` (points to 48)
   - `ptrs[1] = list + 1` (points to 24)
   - `ptrs[2] = list + 5` (points to 72)
   - `ptrs[3] = list`     (points to 12)
   - `ptrs[4] = list + 4` (points to 60)
3. `dptr = ptrs + 2` initially points to `ptrs[2]`.
4. `dptr--;` moves `dptr` back to point to `ptrs[1]`.
5. **Evaluating the `printf` expressions:**
   - `dptr - ptrs`: Pointer subtraction `&ptrs[1] - &ptrs[0] = 1`.
   - `**dptr`: `*dptr` is `ptrs[1]` (`list + 1`). Dereferencing again gives `*(list + 1) = list[1] = 24`.
   - `*(*dptr + 2)`: `*dptr` is `list + 1`. Adding 2 gives pointer `list + 3`. Dereferencing yields `*(list + 3) = list[3] = 48`.
6. Output is `1 24 48`.

Correct option is (A).

## Q8
type: NAT
marks: 2
subject: programming-ds
topic: strings
syllabus: P08.10
answer: 4

Consider the following C program:

```c
#include <stdio.h>
#include <string.h>

int find_diff(char *a, char *b) {
    if (strlen(a) - strlen(b) > 0) {
        return (int)strlen(a);
    }
    return (int)strlen(b);
}

int main(void) {
    char s1[] = "GATE";
    char s2[] = "COMPUTER_SCIENCE";
    printf("%d\n", find_diff(s1, s2));
    return 0;
}
```

The output of the program is _______.

### Solution
1. `s1` is `"GATE"` (length 4), and `s2` is `"COMPUTER_SCIENCE"` (length 16).
2. Inside `find_diff(s1, s2)`:
   - `strlen()` returns an unsigned integer type (`size_t`).
   - The expression `strlen(a) - strlen(b)` computes $4 - 16 = -12$ using unsigned arithmetic.
   - In unsigned representation, $-12$ wraps around to a very large positive number (`SIZE_MAX - 11`).
   - Therefore, the condition `(strlen(a) - strlen(b) > 0)` evaluates to **TRUE**!
3. Because the condition is true, the function executes the `if` body:
   - It returns `(int)strlen(a)`, which is `4`.
4. The program outputs `4`.

The output of the program is 4.

## Q9
type: MCQ
marks: 2
subject: programming-ds
topic: strings
syllabus: P08.11
answer: B

Consider the following C program:

```c
#include <stdio.h>

void funcA(char *x, char *y) {
    char *t = x;
    x = y;
    y = t;
}

void funcB(char **x, char **y) {
    char *t = *x;
    *x = *y;
    *y = t;
}

int main(void) {
    char *s1 = "Gold";
    char *s2 = "Silver";
    char *s3 = "Bronze";

    funcA(s1, s2);
    funcB(&s2, &s3);

    printf("%s %s %s\n", s1, s2, s3);
    return 0;
}
```

What is printed by the program?

(A) `Silver Gold Bronze`
(B) `Gold Bronze Silver`
(C) `Gold Silver Bronze`
(D) `Bronze Silver Gold`

### Solution
1. **Initial state in `main`:**
   `s1 = "Gold"`, `s2 = "Silver"`, `s3 = "Bronze"`.
2. **Executing `funcA(s1, s2)`:**
   `s1` and `s2` are passed by value. The parameters `x` and `y` are swapped only within `funcA`'s local activation record. Variables `s1, s2, s3` in `main` remain completely unchanged.
3. **Executing `funcB(&s2, &s3)`:**
   The memory addresses of pointer variables `s2` and `s3` are passed to `char **x` and `char **y`.
   `funcB` dereferences `x` and `y` to swap pointers `s2` and `s3` directly in `main`'s stack frame:
   - `s2` now points to `"Bronze"`.
   - `s3` now points to `"Silver"`.
   - `s1` still points to `"Gold"`.
4. **Final output:**
   `printf("%s %s %s\n", s1, s2, s3);` prints `Gold Bronze Silver`.

Correct option is (B).

## Q10
type: MSQ
marks: 2
subject: programming-ds
topic: arrays-and-pointers
syllabus: P06.19
answer: A, B, D

Consider the following C code segment:

```c
int v[] = {4, 8, 12, 16, 20};
int *p = v;
```

Which of the following statements is/are **TRUE**?

(A) The expression `*(p + 2)` evaluates to `12`.
(B) The expression `*(p++)` evaluates to `4`, and immediately afterwards `*p` evaluates to `8`.
(C) If pointer `q = v + 3`, the expression `q - p` evaluates to `12` bytes.
(D) The statement `*(v + 1) += 2;` is valid and modifies `v[1]` to `10`.

### Solution
1. **Statement (A):** `p + 2` points to `&v[2]`. Dereferencing yields `v[2] = 12`. (A is TRUE).
2. **Statement (B):** In `*(p++)`:
   - Postfix `p++` yields the current pointer address `&v[0]` before advancing.
   - Dereferencing `*(&v[0])` gives `4`.
   - As a side-effect, `p` advances to `&v[1]`.
   - Immediately afterwards, `*p` evaluates to `v[1] = 8`. (B is TRUE).
3. **Statement (C):** In C, subtracting two pointers of the same type `q - p` calculates the number of elements between them, NOT the number of bytes:
   $$(v + 3) - v = 3 \text{ elements}$$
   Thus, `q - p` evaluates to 3, not 12. (C is FALSE).
4. **Statement (D):** `*(v + 1)` is identical to `v[1]`, which is a modifiable lvalue integer element. Writing `*(v + 1) += 2;` increases `v[1]` from 8 to 10. (D is TRUE).

Correct options are A, B, D.
