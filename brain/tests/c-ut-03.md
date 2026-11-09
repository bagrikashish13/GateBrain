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

Consider the following declarations in a C program:

```c
int *P[5], (*Q)[5];
int R[5][5];
```

Which of the following expressions are valid modifiable lvalues (i.e. can appear as the left-hand side of an assignment without causing a compilation error)?

I. `P[1]`
II. `Q[1]`
III. `(*Q)[2]`
IV. `R[1]`
V. `R[2][3]`

(A) I, II, and V only
(B) I, III, and V only
(C) II, III, and IV only
(D) III and V only

### Solution
1. `P` is declared as `int *P[5]`, an array of 5 pointers to `int`. Each element `P[i]` is a pointer variable of type `int *`. Hence, `P[1]` is a valid modifiable lvalue (e.g. `P[1] = &x;` compiles cleanly). (I is valid).
2. `Q` is declared as `int (*Q)[5]`, a pointer to an array of 5 integers. `Q[1]` is equivalent to `*(Q + 1)`. Its type is `int [5]` (an array type). In C, expressions of array type decay to address constants and are not modifiable lvalues. Attempting `Q[1] = ...` causes a compilation error (`assignment to expression with array type`). (II is invalid).
3. `(*Q)` dereferences `Q` to access the array of 5 integers at index 0 (`Q[0]`). Then `(*Q)[2]` accesses the integer element at index 2, which has type `int`. A scalar integer element is a modifiable lvalue. (III is valid).
4. `R` is declared as `int R[5][5]`. `R[1]` represents the entire 1st row (an array of 5 integers, type `int [5]`). An array name/subarray cannot appear on the LHS of an assignment. (IV is invalid).
5. `R[2][3]` represents a specific scalar element of type `int` in row 2, column 3. It can be modified (e.g. `R[2][3] = 42;`). (V is valid).

Thus, only I, III, and V are valid modifiable lvalues. Correct option is (B).

## Q2
type: MCQ
marks: 1
subject: programming-ds
topic: strings
syllabus: P08.5
answer: B

Consider the following C program:

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char s1[12] = "GATE";
    char *s2 = "COMPUTER";
    int res = 0;

    if (strlen(s1) - strlen(s2) > 0)
        res += 10;
    else
        res += 20;

    if (sizeof(s1) > sizeof(s2))
        res += 100;
    else
        res += 200;

    printf("%d\n", res);
    return 0;
}
```

Assume a 64-bit architecture where `sizeof(void *) = 8` and `sizeof(int) = 4`. What is printed by the program?

(A) 220
(B) 110
(C) 120
(D) 210

### Solution
1. **Analysis of strings:**
   - `s1` is a `char` array of size 12 initialized with `"GATE"`. Its length is `strlen(s1) = 4`. Its allocated buffer size is `sizeof(s1) = 12` bytes.
   - `s2` is a pointer of type `char *` pointing to the string literal `"COMPUTER"`. Its length is `strlen(s2) = 8`. Being a pointer variable on a 64-bit machine, `sizeof(s2) = 8` bytes.
2. **First condition (`strlen(s1) - strlen(s2) > 0`):**
   - In `<string.h>`, `strlen()` returns an unsigned integer type (`size_t`).
   - The expression `strlen(s1) - strlen(s2)` performs unsigned subtraction: $4 - 8 = -4$.
   - In unsigned arithmetic (two's complement wrap-around), $-4$ underflows to a very large positive value (`SIZE_MAX - 3`).
   - Because this value is unsigned and non-zero, `(unsigned value > 0)` evaluates to **true**!
   - Therefore, the `if` branch executes: `res += 10` (so `res` becomes 10).
3. **Second condition (`sizeof(s1) > sizeof(s2)`):**
   - `sizeof(s1) = 12` bytes (the full array size).
   - `sizeof(s2) = 8` bytes (the size of a `char *` pointer on a 64-bit platform).
   - $12 > 8$ is **true**.
   - Therefore, `res += 100` (so `res` becomes $10 + 100 = 110$).
4. The program prints `110`. Correct option is (B).

## Q3
type: MSQ
marks: 1
subject: programming-ds
topic: strings
syllabus: P08.2
answer: B, C, D

Consider the following two declarations in a C program:

```c
char str1[] = "Antigravity";
char *str2  = "Antigravity";
```

Which of the following statements is/are **TRUE**?

(A) `str1 = "NewString";` is a valid statement that reassigns the array.
(B) `str2 = "NewString";` is a valid statement that updates the pointer.
(C) `str1[0] = 'a';` is well-defined and modifies the first character of `str1`.
(D) `str2[0] = 'a';` attempts to modify a string literal, resulting in undefined behavior.

### Solution
1. **Option (A):** `str1` is an array identifier. In C, array names represent fixed addresses and are non-modifiable lvalues. They cannot be reassigned. Attempting `str1 = "NewString";` produces a compilation error. Hence, (A) is FALSE.
2. **Option (B):** `str2` is a pointer variable of type `char *`. It holds the address of a string literal. Reassigning `str2` to point to a different string literal (`str2 = "NewString";`) is completely valid in C. Hence, (B) is TRUE.
3. **Option (C):** `char str1[]` allocates a 12-byte array in writable stack memory. Mutating its elements (e.g. `str1[0] = 'a';`) is well-defined. Hence, (C) is TRUE.
4. **Option (D):** `str2` points directly to the string literal `"Antigravity"` located in read-only memory (`.rodata`). In the C standard, attempting to modify a string literal invokes undefined behavior (typically causing a segmentation fault at runtime). Hence, (D) is TRUE.

Correct options are B, C, D.

## Q4
type: NAT
marks: 1
subject: programming-ds
topic: arrays-and-pointers
syllabus: P07.7
answer: 1284

Consider a 3-dimensional array declared in C as:

```c
int M[10][15][20];
```

Assume that elements of `M` are stored in row-major order, each `int` occupies 4 bytes of memory, and the base address `&M[0][0][0]` is 2000.

An optimizing compiler generates intermediate code to compute the byte address of element `M[i][j][k]` in the form:

$$\text{Address}(M[i][j][k]) = 2000 + i \times C_1 + j \times C_2 + k \times C_3$$

where $C_1, C_2, C_3$ are integer constants.

The value of $C_1 + C_2 + C_3$ is _______.

### Solution
1. **Dimensions and size:**
   - Dimension sizes: $D_1 = 10$, $D_2 = 15$, $D_3 = 20$.
   - Element size $S = 4$ bytes.
2. **Row-Major 3D Address Formula:**
   For a 3D array $M[D_1][D_2][D_3]$, the element index offset for $M[i][j][k]$ is:
   $$\text{Offset} = \Big(i \times (D_2 \times D_3) + j \times D_3 + k\Big) \times S$$
   Expanding this with the element size $S = 4$:
   $$\text{Address} = \text{Base} + i \times (D_2 \times D_3 \times S) + j \times (D_3 \times S) + k \times S$$
3. **Calculating coefficients:**
   - $C_1 = D_2 \times D_3 \times S = 15 \times 20 \times 4 = 1200$
   - $C_2 = D_3 \times S = 20 \times 4 = 80$
   - $C_3 = S = 4$
4. **Sum of coefficients:**
   $$C_1 + C_2 + C_3 = 1200 + 80 + 4 = 1284$$

Hence, the answer is 1284.

## Q5
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P05.2
answer: C

Consider the following C function:

```c
int solve(int n) {
    int count = 0;
    while (n > 0) {
        if (n % 2 == 1) {
            count += (n & 3);
        }
        n /= 2;
    }
    return count;
}
```

What value is returned by the call `solve(23)`?

(A) 5
(B) 6
(C) 8
(D) 10

### Solution
We trace `solve(23)` iteration by iteration:

* **Initial state:** `n = 23`, `count = 0`.
* **Iteration 1:**
  - `n = 23`: $23 \% 2 == 1$ (True).
  - Binary representation of 23 is $10111_2$.
  - `23 & 3` $= 10111_2 \ \& \ 00011_2 = 00011_2 = 3$.
  - `count += 3` $\implies \text{count} = 3$.
  - `n /= 2` $\implies n = 11$.
* **Iteration 2:**
  - `n = 11`: $11 \% 2 == 1$ (True).
  - Binary representation of 11 is $1011_2$.
  - `11 & 3` $= 1011_2 \ \& \ 0011_2 = 3$.
  - `count += 3` $\implies \text{count} = 6$.
  - `n /= 2` $\implies n = 5$.
* **Iteration 3:**
  - `n = 5`: $5 \% 2 == 1$ (True).
  - Binary representation of 5 is $0101_2$.
  - `5 & 3` $= 0101_2 \ \& \ 0011_2 = 1$.
  - `count += 1` $\implies \text{count} = 7$.
  - `n /= 2` $\implies n = 2$.
* **Iteration 4:**
  - `n = 2`: $2 \% 2 == 0$ (False, `if` body does not execute).
  - `n /= 2` $\implies n = 1$.
* **Iteration 5:**
  - `n = 1`: $1 \% 2 == 1$ (True).
  - `1 & 3` $= 1$.
  - `count += 1` $\implies \text{count} = 8$.
  - `n /= 2` $\implies n = 0$.
* **Loop termination:** `n = 0`, loop terminates.
* The function returns `count = 8`.

Correct option is (C).

## Q6
type: NAT
marks: 2
subject: programming-ds
topic: arrays-and-pointers
syllabus: P07.6
answer: 48

Consider the following C program:

```c
#include <stdio.h>

int main(void) {
    int arr[3][4] = {
        {2,  4,  6,  8},
        {10, 12, 14, 16},
        {18, 20, 22, 24}
    };
    int (*ptr)[4] = arr;
    
    int val1 = *(*(ptr + 1) + 2);
    int val2 = *(ptr[2] - 1);
    int val3 = **(ptr + 2);
    
    printf("%d\n", val1 + val2 + val3);
    return 0;
}
```

The output of the program is _______.

### Solution
1. `arr` is a $3 \times 4$ 2D integer array laid out contiguously in row-major order:
   - Row 0: `arr[0][0]=2,  arr[0][1]=4,  arr[0][2]=6,  arr[0][3]=8`
   - Row 1: `arr[1][0]=10, arr[1][1]=12, arr[1][2]=14, arr[1][3]=16`
   - Row 2: `arr[2][0]=18, arr[2][1]=20, arr[2][2]=22, arr[2][3]=24`
2. `ptr` is declared as `int (*ptr)[4] = arr;`, which is a pointer to an array of 4 integers, initially pointing to Row 0 (`arr[0]`).
3. **Evaluating `val1 = *(*(ptr + 1) + 2)`:**
   - `ptr + 1` advances by 1 entire row, pointing to Row 1 (`arr[1]`).
   - `*(ptr + 1)` unpacks Row 1, decaying into pointer to its first element (`&arr[1][0]`).
   - `*(ptr + 1) + 2` moves 2 elements forward to `&arr[1][2]`.
   - Dereferencing gives `*(*(ptr + 1) + 2) = arr[1][2] = 14`.
   - Thus, `val1 = 14`.
4. **Evaluating `val2 = *(ptr[2] - 1)`:**
   - `ptr[2]` is equivalent to `*(ptr + 2)`, which represents Row 2 (`arr[2]`).
   - In pointer arithmetic, `ptr[2]` decays to `&arr[2][0]`.
   - `ptr[2] - 1` steps 1 integer backward in memory from `&arr[2][0]`.
   - Because 2D arrays are stored contiguously row by row, the element immediately preceding `arr[2][0]` in physical memory is the last element of Row 1, which is `arr[1][3]` (value 16).
   - Thus, `val2 = 16`.
5. **Evaluating `val3 = **(ptr + 2)`:**
   - `ptr + 2` points to Row 2 (`&arr[2]`).
   - `*(ptr + 2)` unpacks to `&arr[2][0]`.
   - `**(ptr + 2)` reads `arr[2][0] = 18`.
   - Thus, `val3 = 18`.
6. **Final sum:**
   $$\text{val1} + \text{val2} + \text{val3} = 14 + 16 + 18 = 48$$

The output of the program is 48.

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
    int nums[] = {15, 25, 35, 45, 55, 65};
    int *arr[] = {nums + 1, nums + 4, nums, nums + 3, nums + 2};
    int **p = arr;

    p++;
    printf("%ld, %d, %d\n", p - arr, **p, *(*p - 1));
    return 0;
}
```

What is printed by the program?

(A) `1, 55, 45`
(B) `1, 55, 35`
(C) `4, 45, 35`
(D) `2, 15, 25`

### Solution
1. **Initial setup:**
   - `nums` is an array of 6 integers:
     `nums[0] = 15, nums[1] = 25, nums[2] = 35, nums[3] = 45, nums[4] = 55, nums[5] = 65`.
   - `arr` is an array of 5 pointers to `int`:
     - `arr[0] = nums + 1` (points to `nums[1]`, value 25)
     - `arr[1] = nums + 4` (points to `nums[4]`, value 55)
     - `arr[2] = nums`     (points to `nums[0]`, value 15)
     - `arr[3] = nums + 3` (points to `nums[3]`, value 45)
     - `arr[4] = nums + 2` (points to `nums[2]`, value 35)
   - `int **p = arr;` initializes `p` pointing to `arr[0]`.
2. **Pointer increment (`p++`):**
   - `p` advances by 1 element of `arr` (`sizeof(int *)`), so `p` now points to `arr[1]`.
3. **Evaluating expressions in `printf`:**
   - `p - arr`: Pointer subtraction `&arr[1] - &arr[0] = 1` element.
   - `**p`: Dereferencing `p` once gives `arr[1]` (which holds `nums + 4`). Dereferencing again gives `*(nums + 4) = nums[4] = 55`.
   - `*(*p - 1)`: `*p` is `nums + 4`. Subtracting 1 gives pointer `nums + 3`. Dereferencing gives `*(nums + 3) = nums[3] = 45`.
4. The output is `1, 55, 45`.

Correct option is (A).

## Q8
type: NAT
marks: 2
subject: programming-ds
topic: strings
syllabus: P08.10
answer: 8

Consider the following C program:

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char *str = "ALGORITHM2026";
    char *p = str;
    int offset = 3[p] - 1[p] + 2;
    printf("%d\n", (int)strlen(str + offset));
    return 0;
}
```

The output of the program is _______.

### Solution
1. **Character array layout:**
   The string literal `"ALGORITHM2026"` has 13 characters plus the null terminator `'\0'` at index 13:
   ```text
   Index: 0  1  2  3  4  5  6  7  8  9  10 11 12 13
   Char:  A  L  G  O  R  I  T  H  M  2  0  2  6  \0
   ```
2. **Evaluating commutative indexing `3[p]` and `1[p]`:**
   - In C, `i[p] \equiv *(p + i) \equiv p[i]`.
   - `3[p] = p[3] = 'O'`.
   - `1[p] = p[1] = 'L'`.
3. **Evaluating character arithmetic:**
   - In C, characters in arithmetic expressions are promoted to integer ASCII values.
   - Alphabetically, `'O'` is the 15th letter and `'L'` is the 12th letter (ASCII 79 and 76).
   - `3[p] - 1[p] = 'O' - 'L' = 79 - 76 = 3`.
   - Therefore, `offset = 3 + 2 = 5`.
4. **Evaluating `strlen(str + offset)`:**
   - `str + offset` points to `str + 5`, which starts at index 5 (character `'I'`).
   - The substring starting from index 5 is `"ITHM2026"`.
   - Counting characters before `'\0'`:
     `'I'`, `'T'`, `'H'`, `'M'`, `'2'`, `'0'`, `'2'`, `'6'` $\implies$ exactly 8 characters.
   - `strlen(str + 5) = 8`.

The output of the program is 8.

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

void swap_ptrs(char **p1, char **p2) {
    char *t = *p1;
    *p1 = *p2;
    *p2 = t;
}

void modify_ptrs(char *p1, char *p2) {
    p1 = p2;
}

int main(void) {
    char *a = "Apple";
    char *b = "Berry";
    char *c = "Cherry";

    modify_ptrs(a, b);
    swap_ptrs(&b, &c);

    printf("%s %s %s\n", a, b, c);
    return 0;
}
```

What is printed by the program?

(A) `Berry Cherry Apple`
(B) `Apple Cherry Berry`
(C) `Apple Berry Cherry`
(D) `Berry Berry Cherry`

### Solution
1. **Initial state in `main`:**
   - `a` points to `"Apple"`
   - `b` points to `"Berry"`
   - `c` points to `"Cherry"`
2. **Call `modify_ptrs(a, b)`:**
   - Parameters `p1` and `p2` receive copies of pointers `a` and `b` (pass-by-value).
   - Inside `modify_ptrs`, `p1 = p2;` alters only the local parameter `p1` within `modify_ptrs`'s activation record.
   - Pointers `a`, `b`, and `c` in `main` remain completely unchanged!
   - After return: `a` still points to `"Apple"`, `b` still points to `"Berry"`, `c` still points to `"Cherry"`.
3. **Call `swap_ptrs(&b, &c)`:**
   - The addresses of pointers `b` and `c` are passed to `char **p1` and `char **p2`.
   - `*p1` accesses variable `b` in `main`; `*p2` accesses variable `c` in `main`.
   - The swap logic:
     - `char *t = *p1;` stores pointer `b` (`"Berry"`).
     - `*p1 = *p2;` sets `b` to point to `"Cherry"`.
     - `*p2 = t;` sets `c` to point to `"Berry"`.
   - After return: `b` now points to `"Cherry"`, and `c` now points to `"Berry"`.
4. **Final output:**
   - `printf("%s %s %s\n", a, b, c);` prints: `Apple Cherry Berry`.

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
int arr[] = {2, 4, 6, 8, 10, 12};
int *p1 = arr + 1;
int *p2 = arr + 4;
```

Which of the following statements is/are **TRUE**?

(A) The expression `p2 - p1` evaluates to `3`.
(B) The expression `*(p1 + 2)` evaluates to `8`.
(C) The expression `*p2 - *p1` evaluates to `3`.
(D) After executing `*(p1++) += 5;`, `arr[1]` equals `9` and `*p1` equals `6`.

### Solution
1. **Initial state:**
   - `arr`: `arr[0]=2, arr[1]=4, arr[2]=6, arr[3]=8, arr[4]=10, arr[5]=12`.
   - `p1 = arr + 1` points to `&arr[1]` (value 4).
   - `p2 = arr + 4` points to `&arr[4]` (value 10).
2. **Statement (A):**
   - In C pointer arithmetic, subtracting two pointers of the same type yields the number of elements between them:
     $$\text{distance} = p2 - p1 = (\text{arr} + 4) - (\text{arr} + 1) = 3$$
   - Hence, (A) is TRUE.
3. **Statement (B):**
   - `p1 + 2` is `(arr + 1) + 2 = arr + 3`.
   - Dereferencing gives `*(arr + 3) = arr[3] = 8`.
   - Hence, (B) is TRUE.
4. **Statement (C):**
   - `*p2` evaluates to the integer value at `p2`, which is `arr[4] = 10`.
   - `*p1` evaluates to the integer value at `p1`, which is `arr[1] = 4`.
   - `*p2 - *p1 = 10 - 4 = 6`.
   - Note the difference between pointer subtraction `p2 - p1 = 3` and integer value subtraction `*p2 - *p1 = 6`.
   - Hence, (C) is FALSE.
5. **Statement (D):**
   - `*(p1++) += 5;`:
     - Post-increment `p1++` evaluates to current `p1` (`&arr[1]`) for dereferencing, while advancing `p1` to `&arr[2]`.
     - `*(&arr[1]) += 5` modifies `arr[1]`: was 4, now becomes $4 + 5 = 9$.
     - After the statement, `p1` points to `arr[2]`, so `*p1` evaluates to `arr[2] = 6`.
   - Both assertions (`arr[1] == 9` and `*p1 == 6`) are correct.
   - Hence, (D) is TRUE.

Correct options are A, B, D.
