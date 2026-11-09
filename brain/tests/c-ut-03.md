---
title: Programming in C · Unit Test 03
duration: 30
created: 2026-11-09
description: Unit test covering P07 (Multi-dimensional arrays, arrays of pointers, declarations) and P08 (Strings), with weak reviews from P05 and P06.
---

## Q1
type: MCQ
marks: 1
subject: programming-ds
topic: arrays-and-pointers
syllabus: P07.15
answer: B

Consider the following declaration in a C program:

```c
int *(*foo[4])(int *);
```

According to the rules of C declarations (the Right-Left rule), what is `foo`?

(A) An array of 4 functions taking `int *` as argument and returning `int *`
(B) An array of 4 pointers to functions taking `int *` as argument and returning `int *`
(C) A pointer to an array of 4 functions taking `int *` as argument and returning `int *`
(D) A function taking an array of 4 `int *` and returning `int *`

### Solution
Applying the Right-Left rule:
1. Start at the identifier name: `foo` ("`foo` is...").
2. Look inside the brackets/parentheses first:
   - To the right: `[4]` ("...an array of 4...").
   - To the left: `*` ("...pointers to...").
3. Step outside the grouping parentheses:
   - To the right: `(int *)` ("...functions taking `int *` as argument and returning...").
   - To the left: `int *` ("...pointer to `int`").
4. Combining all components: `foo` is an **array of 4 pointers to functions taking `int *` and returning `int *`**.

Correct option is (B).

## Q2
type: MCQ
marks: 1
subject: programming-ds
topic: strings
syllabus: P08.3
answer: B

Consider the following C program:

```c
#include <stdio.h>

int main(void) {
    char s[10] = "GATEWAY";
    s[4] = '\0';
    printf("%s-%s\n", s, s + 5);
    return 0;
}
```

What will be printed by the program?

(A) `GATE-WAY`
(B) `GATE-AY`
(C) `GATEWAY-`
(D) `GATE-`

### Solution
1. `s` is initialized as a character array with `"GATEWAY"`. Its memory layout is:
   - `s[0]='G', s[1]='A', s[2]='T', s[3]='E', s[4]='W', s[5]='A', s[6]='Y', s[7]='\0'`
2. The assignment `s[4] = '\0';` overwrites `'W'` with the null terminator:
   - `s[0]='G', s[1]='A', s[2]='T', s[3]='E', s[4]='\0', s[5]='A', s[6]='Y', s[7]='\0'`
3. In `printf("%s-%s\n", s, s + 5);`:
   - The first `%s` starts at `s[0]` and prints up to `s[4] = '\0'`, producing `"GATE"`.
   - The literal character `'-'` is printed.
   - The second `%s` starts at `s + 5` (`&s[5]`), printing characters `'A'`, `'Y'` until it hits the null terminator at `s[7] = '\0'`, producing `"AY"`.
4. The output is `GATE-AY`.

Correct option is (B).

## Q3
type: MSQ
marks: 1
subject: programming-ds
topic: strings
syllabus: P08.13
answer: A, B, D

Consider a C program executed from the terminal as:

```bash
./runner one two three
```

where `main` is defined as:

```c
int main(int argc, char *argv[])
```

Which of the following statements is/are **TRUE**?

(A) `argc` evaluates to `4`.
(B) `argv[0]` points to the string `"./runner"`.
(C) `argv[3][1]` evaluates to the character `'r'`.
(D) `*argv[2]` evaluates to the character `'t'`.

### Solution
1. **Statement (A):** In C, `argc` counts the total number of command-line arguments, including the program name itself. The tokens are `./runner` (1), `one` (2), `two` (3), `three` (4). Thus, `argc == 4`. (A is TRUE).
2. **Statement (B):** By convention and C standard, `argv[0]` holds the string representing the program name or invocation path (`"./runner"`). (B is TRUE).
3. **Statement (C):** `argv[3]` points to the string `"three"`. The character indices of `"three"` are:
   `[0]='t'`, `[1]='h'`, `[2]='r'`, `[3]='e'`, `[4]='e'`.
   Thus, `argv[3][1]` is `'h'`, not `'r'`. (C is FALSE).
4. **Statement (D):** `argv[2]` points to `"two"`. Dereferencing `*argv[2]` gives `argv[2][0]`, which is `'t'`. (D is TRUE).

Correct options are A, B, D.

## Q4
type: NAT
marks: 1
subject: programming-ds
topic: arrays-and-pointers
syllabus: P07.7
answer: 43

A 3-dimensional array `A` of characters (where `sizeof(char) = 1` byte) is declared in C as:

```c
char A[12][M][N];
```

The array is stored in row-major order with 0-based indexing.

An optimizing compiler translates the element reference `A[i][j][k]` into the memory offset expression:

$$\text{Offset} = i \times 280 + j \times 35 + k$$

What is the integer value of $M + N$?

### Solution
1. In row-major order for a 3D array $A[D_1][D_2][D_3]$, the element offset from the base address is given by:
   $$\text{Offset}(i, j, k) = \Big(i \times (D_2 \times D_3) + j \times D_3 + k\Big) \times \text{element\_size}$$
2. Given that elements are `char` (`sizeof(char) = 1` byte), the formula simplifies to:
   $$\text{Offset} = i \times (M \times N) + j \times N + k$$
3. Comparing coefficients with the compiler expression $i \times 280 + j \times 35 + k$:
   - $N = 35$
   - $M \times N = 280 \implies M \times 35 = 280 \implies M = \frac{280}{35} = 8$
4. Calculating $M + N$:
   $$M + N = 8 + 35 = 43$$

The answer is 43.

## Q5
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P05.2
answer: C

Consider the following C function:

```c
int compute(int x) {
    int s = 0;
    while (x > 0) {
        s += (x % 10);
        x /= 4;
    }
    return s;
}
```

What value is returned by the function call `compute(53)`?

(A) 5
(B) 7
(C) 9
(D) 11

### Solution
We trace `compute(53)` step by step:

* **Initial state:** `x = 53`, `s = 0`.
* **Iteration 1:**
  - `x = 53 > 0` (True).
  - `s += (53 % 10)` $\implies s += 3 \implies s = 3$.
  - `x /= 4` $\implies x = \lfloor 53 / 4 \rfloor = 13$.
* **Iteration 2:**
  - `x = 13 > 0` (True).
  - `s += (13 % 10)` $\implies s += 3 \implies s = 3 + 3 = 6$.
  - `x /= 4` $\implies x = \lfloor 13 / 4 \rfloor = 3$.
* **Iteration 3:**
  - `x = 3 > 0` (True).
  - `s += (3 % 10)` $\implies s += 3 \implies s = 6 + 3 = 9$.
  - `x /= 4` $\implies x = \lfloor 3 / 4 \rfloor = 0$.
* **Loop termination:** `x = 0`, loop terminates.
* The function returns `s = 9`.

Correct option is (C).

## Q6
type: NAT
marks: 2
subject: programming-ds
topic: arrays-and-pointers
syllabus: P07.6
answer: 100

Consider the following C program:

```c
#include <stdio.h>

int main(void) {
    int mat[3][3] = {
        {5,  10, 15},
        {20, 25, 30},
        {35, 40, 45}
    };
    int (*p)[3] = mat;

    int a = *(*(p + 2) + 1);
    int b = *(*p + 5);
    int c = *(p[1] + 2);

    printf("%d\n", a + b + c);
    return 0;
}
```

The output of the program is _______.

### Solution
1. `mat` is a $3 \times 3$ integer array stored contiguously in row-major order:
   - Row 0: `mat[0][0]=5,  mat[0][1]=10, mat[0][2]=15`
   - Row 1: `mat[1][0]=20, mat[1][1]=25, mat[1][2]=30`
   - Row 2: `mat[2][0]=35, mat[2][1]=40, mat[2][2]=45`
2. `p` is declared as `int (*p)[3] = mat;`, pointing to Row 0 (`mat[0]`).
3. **Evaluating `a = *(*(p + 2) + 1)`:**
   - `p + 2` points to Row 2 (`mat[2]`).
   - `*(p + 2)` decays to `&mat[2][0]`.
   - `*(p + 2) + 1` points to `&mat[2][1]`.
   - Dereferencing gives `mat[2][1] = 40`.
   - So `a = 40`.
4. **Evaluating `b = *(*p + 5)`:**
   - `*p` decays to `&mat[0][0]`.
   - Adding 5 moves 5 integers linearly along the contiguous row-major block:
     Index 0: 5, Index 1: 10, Index 2: 15, Index 3: 20, Index 4: 25, Index 5: 30 (`mat[1][2]`).
   - Dereferencing gives `30`.
   - So `b = 30`.
5. **Evaluating `c = *(p[1] + 2)`:**
   - `p[1]` is equivalent to `*(p + 1)`, which represents Row 1 and decays to `&mat[1][0]`.
   - `p[1] + 2` points to `&mat[1][2]`.
   - Dereferencing gives `mat[1][2] = 30`.
   - So `c = 30`.
6. **Total sum:**
   $$a + b + c = 40 + 30 + 30 = 100$$

The output of the program is 100.

## Q7
type: MCQ
marks: 2
subject: programming-ds
topic: arrays-and-pointers
syllabus: P07.11
answer: A

Consider the following C program:

```c
#include <stdio.h>

int main(void) {
    static int val[] = {100, 200, 300, 400, 500};
    static int *ptrs[] = {val + 4, val, val + 2, val + 1, val + 3};
    int **ptr = ptrs + 1;

    ptr++;
    printf("%ld, %d, %d\n", ptr - ptrs, **ptr, *(*ptr + 1));
    return 0;
}
```

What is printed by the program?

(A) `2, 300, 400`
(B) `1, 100, 200`
(C) `2, 300, 200`
(D) `3, 200, 300`

### Solution
1. `val` is an array of 5 integers:
   `val[0]=100, val[1]=200, val[2]=300, val[3]=400, val[4]=500`.
2. `ptrs` is an array of 5 pointers to `int`:
   - `ptrs[0] = val + 4` (points to `val[4] = 500`)
   - `ptrs[1] = val`     (points to `val[0] = 100`)
   - `ptrs[2] = val + 2` (points to `val[2] = 300`)
   - `ptrs[3] = val + 1` (points to `val[1] = 200`)
   - `ptrs[4] = val + 3` (points to `val[3] = 400`)
3. `ptr` is initialized as `int **ptr = ptrs + 1;`, pointing to `ptrs[1]`.
4. `ptr++;` advances `ptr` to point to `ptrs[2]`.
5. **Evaluating the expressions:**
   - `ptr - ptrs`: Distance between pointer `&ptrs[2]` and `&ptrs[0]` is 2 elements.
   - `**ptr`: `*ptr` is `ptrs[2]` (which holds `val + 2`). `**ptr` is `*(val + 2) = val[2] = 300`.
   - `*(*ptr + 1)`: `*ptr` is pointer `val + 2`. Adding 1 gives pointer `val + 3`. Dereferencing yields `*(val + 3) = val[3] = 400`.
6. Output: `2, 300, 400`.

Correct option is (A).

## Q8
type: NAT
marks: 2
subject: programming-ds
topic: strings
syllabus: P08.10
answer: 11

Consider the following C program:

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char s[] = "ENGINEERING2027";
    char *p = s;
    int offset = 7[p] - 1[p];
    printf("%d\n", (int)strlen(p + offset));
    return 0;
}
```

The output of the program is _______.

### Solution
1. `s` is initialized with the string `"ENGINEERING2027"`.
   Let us list its character indices:
   ```text
   Index: 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
   Char:  E  N  G  I  N  E  E  R  I  N  G  2  0  2  7  \0
   ```
   Total length of `s` is 15 characters.
2. In C, commutative indexing specifies that `7[p] \equiv p[7]` and `1[p] \equiv p[1]`.
   - `7[p] = p[7] = 'R'`
   - `1[p] = p[1] = 'N'`
3. In character arithmetic, the difference `'R' - 'N'` evaluates to the difference in their ASCII codes:
   - Alphabetically, R is the 18th letter and N is the 14th letter:
     $$18 - 14 = 4$$
   - Thus, `offset = 4`.
4. `p + offset` points to `s + 4`, which starts at index 4 (character `'N'`).
   The substring starting from index 4 is `"NEERING2027"`.
   Counting characters from index 4 to index 14 gives:
   $$15 - 4 = 11 \text{ characters}$$
5. `strlen(p + offset)` returns `11`.

The output of the program is 11.

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

void step1(char *s1, char *s2) {
    char *tmp = s1;
    s1 = s2;
    s2 = tmp;
}

void step2(char **s1, char **s2) {
    char *tmp = *s1;
    *s1 = *s2;
    *s2 = tmp;
}

int main(void) {
    char *w1 = "Red";
    char *w2 = "Green";
    char *w3 = "Blue";

    step1(w1, w2);
    step2(&w1, &w3);

    printf("%s %s %s\n", w1, w2, w3);
    return 0;
}
```

What is printed by the program?

(A) `Green Red Blue`
(B) `Blue Green Red`
(C) `Red Green Blue`
(D) `Blue Red Green`

### Solution
1. **Initial state in `main`:**
   - `w1` points to `"Red"`
   - `w2` points to `"Green"`
   - `w3` points to `"Blue"`
2. **Executing `step1(w1, w2)`:**
   - `w1` and `w2` are passed by value. The copies `s1` and `s2` are swapped only within `step1`'s local stack frame.
   - Pointers `w1`, `w2`, and `w3` in `main` remain completely unchanged:
     `w1 = "Red"`, `w2 = "Green"`, `w3 = "Blue"`.
3. **Executing `step2(&w1, &w3)`:**
   - The addresses of pointer variables `w1` and `w3` in `main` are passed to `char **s1` and `char **s2`.
   - `step2` dereferences the double pointers to swap the pointers `w1` and `w3` directly in `main`'s stack frame:
     - `w1` now points to `"Blue"`.
     - `w3` now points to `"Red"`.
     - `w2` remains pointing to `"Green"`.
4. **Final output:**
   - `printf("%s %s %s\n", w1, w2, w3);` prints: `Blue Green Red`.

Correct option is (B).

## Q10
type: MSQ
marks: 2
subject: programming-ds
topic: arrays-and-pointers
syllabus: P06.19
answer: A, B, C

Consider the following C code segment:

```c
int data[] = {10, 20, 30, 40, 50};
int *ptr = data;
```

Which of the following statements is/are **TRUE**?

(A) The expression `*(ptr + 3)` evaluates to `40`.
(B) The expression `(ptr + 4) - ptr` evaluates to `4`.
(C) The expression `*(ptr++)` evaluates to `10`, and afterwards `*ptr` evaluates to `20`.
(D) The statement `*(data + 2) = 35;` causes a compilation error because `data` is an array name.

### Solution
1. **Statement (A):** `ptr + 3` points to `&data[3]`. Dereferencing yields `data[3] = 40`. Hence, (A) is TRUE.
2. **Statement (B):** In C pointer subtraction, subtracting two pointers of the same type gives the number of elements between them:
   $$(\text{ptr} + 4) - \text{ptr} = 4$$
   Hence, (B) is TRUE.
3. **Statement (C):** In `*(ptr++)`:
   - Post-increment `ptr++` evaluates to the current pointer value (`&data[0]`) before incrementing.
   - Dereferencing `*(&data[0])` gives `10`.
   - As a side-effect, `ptr` advances to `&data[1]`.
   - Subsequently, `*ptr` evaluates to `data[1] = 20`.
   - Hence, (C) is TRUE.
4. **Statement (D):** `data` is an array identifier and cannot be reassigned directly (e.g. `data = ...` is illegal). However, `*(data + 2)` is identical to `data[2]`, which is a modifiable lvalue integer element. Writing `*(data + 2) = 35;` is completely valid in C and successfully updates `data[2]` to 35. Therefore, claiming it causes a compilation error is FALSE.

Correct options are A, B, C.
