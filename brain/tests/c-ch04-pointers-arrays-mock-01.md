---
title: "C Programming · Chapter 4 (Arrays & Pointers) Hard Mock"
duration: 60
created: 2026-11-04
description: "20-Question GATE Hard Level Mock on C Chapter 4: Pointers, 1D/2D/3D Arrays, Function Pointers, Endianness, Void Pointers, and Storage Semantics."
---

## Q1
type: MCQ
marks: 1
subject: programming-ds
topic: arrays-and-pointers
answer: B

Consider the following C program:

```c
#include <stdio.h>

int main() {
    int arr[] = {12, 25, 38, 47, 59};
    int *p = arr + 1;
    int a = (*p++)++;
    int b = *--p;
    int c = ++*p;
    printf("%d %d %d\n", a, b, c);
    return 0;
}
```

What is the output printed by the program?

(A) 25 25 26
(B) 25 26 27
(C) 26 26 27
(D) 25 38 39

### Solution
- **Initial Setup:**
  - `arr = {12, 25, 38, 47, 59}`.
  - `p = arr + 1` points to `arr[1]` (where value is 25).
- **Step 1 (`int a = (*p++)++;`):**
  - Inside parens `*p++`: Postfix `++` has higher precedence than unary `*`.
  - `p++` yields the current pointer `p` (pointing to `arr[1]`), and schedules `p` to advance to `arr[2]`.
  - `*(old p)` accesses `arr[1]` (value 25).
  - Outside parens `(...)++`: Postfix increment is applied to `arr[1]`. It yields the current value (25) for `a`, and then increments `arr[1]` to 26 in memory.
  - After this line: `a = 25`, `arr[1] = 26`, and `p` points to `arr[2]`.
- **Step 2 (`int b = *--p;`):**
  - Prefix `--p` decrements `p` first, moving `p` from `arr[2]` back to `arr[1]`.
  - Dereferencing `*p` yields `arr[1]`, which is now 26.
  - Thus, `b = 26`.
- **Step 3 (`int c = ++*p;`):**
  - Unary prefix `++` and unary `*` have the same precedence and associate from right to left: `++(*p)`.
  - `*p` is `arr[1]` (current value 26).
  - `++(*p)` increments `arr[1]` in place from 26 to 27, and evaluates to 27.
  - Thus, `c = 27`.
- **Final Output:** `25 26 27`. Correct option is **(B)**.

---

## Q2
type: MCQ
marks: 1
subject: programming-ds
topic: arrays-and-pointers
answer: B

Consider the following C program:

```c
#include <stdio.h>

int main() {
    int arr[4][5];
    int (*p)[5] = arr;
    int (*q)[5] = arr + 3;
    int *r = (int *)(arr + 3);
    int *s = (int *)arr;
    printf("%d, %d\n", (int)(q - p), (int)(r - s));
    return 0;
}
```

What is the output printed by the program?

(A) 3, 3
(B) 3, 15
(C) 15, 15
(D) 12, 60

### Solution
- **Pointer Subtraction Rule:**
  - For two pointers `ptr2` and `ptr1` pointing to elements of the same array object, `ptr2 - ptr1` evaluates to:
    $$\frac{\text{Memory Address}(ptr2) - \text{Memory Address}(ptr1)}{\text{sizeof}(*\text{ptr1})}$$
  - It yields the number of elements of the pointed-to type between them, NOT raw bytes.
- **Evaluating `q - p`:**
  - `p` and `q` are of type `int (*)[5]` (pointers to an array of 5 integers).
  - Base type size `sizeof(*p) = sizeof(int[5]) = 5 \times \text{sizeof}(int)`.
  - `q` points to Row 3 (`arr + 3`), `p` points to Row 0 (`arr`).
  - Difference $q - p = (arr + 3) - arr = 3$ (units of `int[5]`).
- **Evaluating `r - s`:**
  - `r` and `s` are cast to `int *` (pointers to single `int`).
  - Base type size `sizeof(*r) = sizeof(int)`.
  - `s` points to `arr[0][0]` (linear index 0).
  - `r` points to `arr[3][0]` (linear index $3 \times 5 = 15$).
  - Difference $r - s = 15 - 0 = 15$ (units of `int`).
- **Printed Output:** `3, 15`. Correct option is **(B)**.

---

## Q3
type: MCQ
marks: 2
subject: programming-ds
topic: arrays-and-pointers
answer: A

Consider the following C code snippet:

```c
#include <stdio.h>

int main() {
    int a[4][3] = {
        {1,  2,  3},
        {4,  5,  6},
        {7,  8,  9},
        {10, 11, 12}
    };
    int (*ptr)[3] = a + 1;
    int *p = *(ptr + 1);
    printf("%d %d %d\n", ptr[-1][2], p[-2], *(*(a + 2) - 1));
    return 0;
}
```

What is the output printed by the program?

(A) 3 5 6
(B) 3 8 8
(C) 2 4 6
(D) 1 5 9

### Solution
- **Analysis using Template A (Address-Arrow Scaling Model):**
  - Matrix `a` has 4 rows, each containing 3 integers:
    - Row 0: `a[0][0]=1,  a[0][1]=2,  a[0][2]=3`
    - Row 1: `a[1][0]=4,  a[1][1]=5,  a[1][2]=6`
    - Row 2: `a[2][0]=7,  a[2][1]=8,  a[2][2]=9`
    - Row 3: `a[3][0]=10, a[3][1]=11, a[3][2]=12`
- **Term 1 (`ptr[-1][2]`):**
  - `ptr` is initialized to `a + 1` (points to Row 1).
  - By index-pointer equivalence: `ptr[-1] \equiv *(ptr - 1) = *(a + 1 - 1) = *a = a[0]`.
  - `ptr[-1][2] \equiv a[0][2] = 3`.
- **Term 2 (`p[-2]`):**
  - `ptr + 1` points to Row 2 (`a + 2`).
  - `*(ptr + 1)` unpacks Row 2 into `int *` pointing to `a[2][0]` (value 7).
  - `p` is `int *` pointing to `a[2][0]`.
  - Because 2D arrays are stored contiguously in row-major order:
    - `p[-1]` points to the element immediately before `a[2][0]`, which is `a[1][2]` (value 6).
    - `p[-2]` points to two elements before `a[2][0]`, which is `a[1][1]` (value 5).
  - Thus, `p[-2] = 5`.
- **Term 3 (`*(*(a + 2) - 1)`):**
  - `a + 2` points to Row 2 (`&a[2]`).
  - `*(a + 2)` decays to `&a[2][0]` (type `int *`).
  - `*(a + 2) - 1` steps back by 1 `int`, pointing to `&a[1][2]`.
  - Dereferencing `*(*(a + 2) - 1)` reads `a[1][2] = 6`.
- **Output:** `3 5 6`. Correct option is **(A)**.

---

## Q4
type: NAT
marks: 2
subject: programming-ds
topic: arrays-and-pointers
answer: 518

Consider the following C program running on a standard 32-bit Little-Endian architecture:

```c
#include <stdio.h>

int main() {
    unsigned int arr[] = {0x00010203, 0x00040506};
    unsigned char *p = (unsigned char *)arr;
    printf("%d\n", (p[1] << 8) | p[4]);
    return 0;
}
```

What is the integer value printed by the program?

### Solution
- **Endianness Memory Layout:**
  - On a Little-Endian system, the least significant byte (LSB) of a multi-byte integer is stored at the lowest memory address.
- **Decomposing `arr[0] = 0x00010203` (4 bytes):**
  - Base address + 0 (LSB): `0x03` $\to p[0] = 0x03$
  - Base address + 1: `0x02` $\to p[1] = 0x02$
  - Base address + 2: `0x01` $\to p[2] = 0x01$
  - Base address + 3 (MSB): `0x00` $\to p[3] = 0x00$
- **Decomposing `arr[1] = 0x00040506` (4 bytes):**
  - Base address + 4 (LSB): `0x06` $\to p[4] = 0x06$
  - Base address + 5: `0x05` $\to p[5] = 0x05$
  - Base address + 6: `0x04` $\to p[6] = 0x04$
  - Base address + 7 (MSB): `0x00` $\to p[7] = 0x00$
- **Evaluating `(p[1] << 8) | p[4]`:**
  - $p[1] = 0x02 = 2$ in decimal.
  - $p[4] = 0x06 = 6$ in decimal.
  - $p[1] \ll 8 = 2 \times 256 = 512 = 0x0200$.
  - Bitwise OR: $512 \mid 6 = 518 = 0x0206$.
- **Answer:** 518.

---

## Q5
type: MCQ
marks: 2
subject: programming-ds
topic: arrays-and-pointers
answer: A

Consider the following C program:

```c
#include <stdio.h>

int main() {
    int a[] = {10, 20, 30, 40, 50, 60, 70, 80};
    int *p[] = {a + 1, a + 3, a + 5, a + 7};
    int **ptr = p + 1;

    ptr++;
    int v1 = **ptr;
    int v2 = *(*--ptr + 1);
    printf("%d %d\n", v1, v2);
    return 0;
}
```

What is the output printed by the program?

(A) 60 50
(B) 60 41
(C) 50 40
(D) 50 31

### Solution
- **Array of Pointers Setup:**
  - `a = {10, 20, 30, 40, 50, 60, 70, 80}` (indices 0 to 7).
  - `p[0] = a + 1` (points to `a[1]`, value 20)
  - `p[1] = a + 3` (points to `a[3]`, value 40)
  - `p[2] = a + 5` (points to `a[5]`, value 60)
  - `p[3] = a + 7` (points to `a[7]`, value 80)
- **Tracing `ptr` movements:**
  - `ptr` is of type `int **`.
  - `int **ptr = p + 1;` $\to ptr$ points to element `p[1]`.
  - `ptr++;` $\to ptr$ advances to point to element `p[2]`.
- **Evaluating `v1 = **ptr;`:**
  - `*ptr` dereferences `ptr` to get `p[2]`, which is address `a + 5`.
  - `**ptr` dereferences `a + 5` to get `a[5] = 60`.
  - So `v1 = 60`.
- **Evaluating `v2 = *(*--ptr + 1);`:**
  - `--ptr` decrements `ptr` first, so `ptr` moves back to point to `p[1]`.
  - `*--ptr` dereferences `ptr` to fetch `p[1]`, which is address `a + 3`.
  - `*--ptr + 1` performs pointer arithmetic on `int *`: $(a + 3) + 1 = a + 4$.
  - Dereferencing `*(a + 4)` accesses `a[4] = 50`.
  - So `v2 = 50`.
- **Output:** `60 50`. Correct option is **(A)**.

---

## Q6
type: NAT
marks: 2
subject: programming-ds
topic: arrays-and-pointers
answer: 17

Consider the following C program:

```c
#include <stdio.h>

int main() {
    int a[3][4] = {
        { 1,  2,  3,  4},
        { 5,  6,  7,  8},
        { 9, 10, 11, 12}
    };
    int *p = (int *)(&a + 1);
    int (*q)[4] = a + 1;
    int ans = *(p - 3) + *(*q + 2);
    printf("%d\n", ans);
    return 0;
}
```

What is the integer value printed by the program?

### Solution
- **Tracing `p = (int *)(&a + 1)`:**
  - `a` is an array of size $3 \times 4$ integers.
  - `&a` has type `int (*)[3][4]` (pointer to the entire 2D array).
  - `&a + 1` advances by $1 \times \text{sizeof}(a) = 3 \times 4 \times \text{sizeof}(int) = 12$ integers.
  - It points immediately past the last element of `a` (`a[2][3]`), i.e., linear index 12.
  - `p` is cast to `int *`.
  - `p - 3` steps back by 3 integers in linear memory:
    - Linear index $12 - 3 = 9$.
    - Linear index 9 in a $3 \times 4$ array corresponds to:
      $$\text{Row} = \lfloor 9 / 4 \rfloor = 2, \quad \text{Col} = 9 \pmod 4 = 1$$
    - Element `a[2][1] = 10`.
    - Thus, `*(p - 3) = 10`.
- **Tracing `q = a + 1`:**
  - `a` decays to `int (*)[4]` (pointer to Row 0).
  - `a + 1` points to Row 1 (`{5, 6, 7, 8}`).
  - `*q` dereferences Row 1, decaying into `int *` pointing to `a[1][0]` (value 5).
  - `*q + 2` steps forward by 2 integers, pointing to `a[1][2]` (value 7).
  - `*(*q + 2) = a[1][2] = 7`.
- **Sum:**
  $$\text{ans} = *(p - 3) + *(*q + 2) = 10 + 7 = 17$$
- **Answer:** 17.

---

## Q7
type: MSQ
marks: 2
subject: programming-ds
topic: arrays-and-pointers
answer: A, B, C

Consider the declaration:

```c
int arr[5][10];
```

Which of the following statements is/are **TRUE** according to the ISO C standard?

(A) The expressions `arr` and `*arr` evaluate to the same numerical memory address, but their types are different: `arr` has type `int (*)[10]` while `*arr` has type `int *`.
(B) `sizeof(arr)` evaluates to `50 * sizeof(int)`, whereas `sizeof(*arr)` evaluates to `10 * sizeof(int)`.
(C) The expressions `*(arr + 2) + 4` and `&arr[2][4]` evaluate to the same memory address and both have type `int *`.
(D) The expression `*arr + 1` points to `arr[1][0]`.

### Solution
- **Option (A) is TRUE:**
  - In value context, `arr` decays to a pointer to its first row, which has type `int (*)[10]`.
  - `*arr` dereferences `arr` to yield the first row (`arr[0]`), which decays into a pointer to its first element, having type `int *`.
  - Since Row 0 starts at the exact same physical byte as `arr[0][0]`, both expressions evaluate to the identical memory address.
- **Option (B) is TRUE:**
  - Array names do NOT decay inside `sizeof`.
  - `sizeof(arr)` yields the size of the entire 2D array: $5 \times 10 \times \text{sizeof}(int) = 50 \times \text{sizeof}(int)$.
  - `sizeof(*arr)` yields the size of one complete row (`int[10]`): $10 \times \text{sizeof}(int)$.
- **Option (C) is TRUE:**
  - `arr + 2` points to Row 2 (`&arr[2]`).
  - `*(arr + 2)` decays to `&arr[2][0]` with type `int *`.
  - `*(arr + 2) + 4` steps 4 integers forward in Row 2, pointing to `&arr[2][4]` with type `int *`.
  - Both evaluate to the address of `arr[2][4]` and share type `int *`.
- **Option (D) is FALSE:**
  - `*arr` decays to `&arr[0][0]` (type `int *`).
  - Adding 1 (`*arr + 1`) advances by 1 `int`, pointing to `&arr[0][1]`, NOT `arr[1][0]`.
  - To point to `arr[1][0]`, one must write `*(arr + 1)`.
- **Correct Options:** **A, B, C**.

---

## Q8
type: MCQ
marks: 2
subject: programming-ds
topic: arrays-and-pointers
answer: A

Consider the following C program:

```c
#include <stdio.h>

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }

int main() {
    int (*ops[])(int, int) = {add, sub, mul};
    int (*(*p)[3])(int, int) = &ops;
    
    int val = (*p)[1]((*p)[0](5, 3), (*p)[2](2, 3));
    printf("%d\n", val);
    return 0;
}
```

What is the output printed by the program?

(A) 2
(B) -2
(C) 14
(D) Compilation error due to invalid function pointer declaration

### Solution
- **Type Declaration Analysis:**
  - `ops` is an array of 3 function pointers, each of signature `int (*)(int, int)`.
  - `int (*(*p)[3])(int, int) = &ops;`:
    - `(*p)`: `p` is a pointer to...
    - `(*p)[3]`: an array of 3...
    - `*`: pointers to...
    - `(int, int)`: functions taking two `int`s and returning `int`.
    - Hence, `p` is a valid pointer to the array `ops`.
- **Dereferencing `p`:**
  - `*p` yields the array `ops`.
  - `(*p)[0]` is `ops[0]`, which is pointer to `add`.
  - `(*p)[1]` is `ops[1]`, which is pointer to `sub`.
  - `(*p)[2]` is `ops[2]`, which is pointer to `mul`.
- **Tracing Expressions:**
  - First inner argument: `(*p)[0](5, 3) = add(5, 3) = 5 + 3 = 8`.
  - Second inner argument: `(*p)[2](2, 3) = mul(2, 3) = 2 * 3 = 6`.
  - Outer call: `(*p)[1](8, 6) = sub(8, 6) = 8 - 6 = 2`.
- **Output:** `2`. Correct option is **(A)**.

---

## Q9
type: NAT
marks: 2
subject: programming-ds
topic: arrays-and-pointers
answer: 38

Consider the following recursive C function:

```c
#include <stdio.h>

int solve(int *p, int n) {
    if (n <= 1) return *p;
    return *p + solve(p + 2, n - 2) - *(p + 1);
}

int main() {
    int arr[] = {4, 7, 12, 5, 18, 9, 25};
    printf("%d\n", solve(arr, 7));
    return 0;
}
```

What integer value is printed by the program?

### Solution
- **Template B: Call Stack & Pointer Progression:**
  - Initial call: `solve(arr, 7)` with `arr = {4, 7, 12, 5, 18, 9, 25}`.
  - **Frame 1 (`p = arr`, $n = 7$):**
    - `*p = arr[0] = 4`.
    - `*(p + 1) = arr[1] = 7`.
    - Returns: $4 + \text{solve}(arr + 2, 5) - 7$.
  - **Frame 2 (`p = arr + 2`, $n = 5$):**
    - `*p = arr[2] = 12`.
    - `*(p + 1) = arr[3] = 5`.
    - Returns: $12 + \text{solve}(arr + 4, 3) - 5$.
  - **Frame 3 (`p = arr + 4`, $n = 3$):**
    - `*p = arr[4] = 18`.
    - `*(p + 1) = arr[5] = 9`.
    - Returns: $18 + \text{solve}(arr + 6, 1) - 9$.
  - **Frame 4 (`p = arr + 6`, $n = 1$):**
    - Base condition: $n \le 1$ ($1 \le 1$) is TRUE.
    - Returns `*p = arr[6] = 25`.
- **Unwinding Phase:**
  - Frame 3 returns: $18 + 25 - 9 = 34$.
  - Frame 2 returns: $12 + 34 - 5 = 41$.
  - Frame 1 returns: $4 + 41 - 7 = 38$.
- **Answer:** 38.

---

## Q10
type: MCQ
marks: 1
subject: programming-ds
topic: arrays-and-pointers
answer: A

Consider the following four code snippets in C:

```c
// Snippet I
int *f1() {
    int x = 50;
    return &x;
}

// Snippet II
int *f2() {
    static int y = 50;
    return &y;
}

// Snippet III
int *f3() {
    int *p;
    return p;
}

// Snippet IV
void f4() {
    int *ptr = (int *)malloc(sizeof(int));
    *ptr = 100;
    free(ptr);
    // ptr at this point
}
```

Which of the snippets produce or result in a **dangling pointer**?

(A) I and IV only
(B) I, III, and IV only
(C) I only
(D) II and IV only

### Solution
- **Definition of Dangling Pointer:**
  - A dangling pointer is a pointer that previously pointed to a valid memory location, but that memory location has since been deallocated, freed, or gone out of scope.
- **Analysis of Snippets:**
  - **Snippet I:** Variable `x` is allocated on the activation call stack (automatic storage). When `f1` returns, its stack frame is popped/deallocated. The returned pointer points to reclaimed memory $\to$ **Dangling Pointer**.
  - **Snippet II:** Variable `y` is declared `static`. It resides in the data segment and lives for the entire execution of the program. The returned pointer remains completely valid $\to$ **Valid Pointer (Not dangling)**.
  - **Snippet III:** Pointer `p` is an uninitialized local variable containing an indeterminate garbage address. It never pointed to a valid allocated object $\to$ **Wild Pointer**, not a dangling pointer.
  - **Snippet IV:** Memory allocated by `malloc` is explicitly deallocated by `free(ptr)`. However, `ptr` still stores the address of that freed heap block $\to$ **Dangling Pointer**.
- Hence, snippets I and IV result in dangling pointers. Correct option is **(A)**.

---

## Q11
type: NAT
marks: 2
subject: programming-ds
topic: arrays-and-pointers
answer: 22

Consider the following C program with a 3-dimensional array:

```c
#include <stdio.h>

int main() {
    int a[2][3][4] = {
        {
            { 1,  2,  3,  4},
            { 5,  6,  7,  8},
            { 9, 10, 11, 12}
        },
        {
            {13, 14, 15, 16},
            {17, 18, 19, 20},
            {21, 22, 23, 24}
        }
    };
    int (*p)[3][4] = a;
    int *ptr = *(*(p + 1) + 2) + 1;
    printf("%d\n", *ptr);
    return 0;
}
```

What integer value is printed by the program?

### Solution
- **3D Array Pointer Equivalence Principle:**
  - In general:
    $$a[i][j][k] \iff *(*(*(a + i) + j) + k)$$
- **Step-by-Step Address Scaling:**
  - `p` has type `int (*)[3][4]` and points to 2D block 0 (`a[0]`).
  - `p + 1` advances by $1 \times \text{sizeof}(int[3][4]) = 12 \times \text{sizeof}(int)$, pointing to 2D block 1 (`a[1]`).
  - `*(p + 1)` dereferences block 1, decaying into type `int (*)[4]` (pointer to row 0 of block 1, i.e., `&a[1][0]`).
  - `*(p + 1) + 2` advances by 2 rows of 4 ints ($2 \times 4 \times \text{sizeof}(int)$), pointing to row 2 of block 1, i.e., `&a[1][2]`.
  - `*(*(p + 1) + 2)` dereferences row 2, decaying into `int *` pointing to `&a[1][2][0]`.
  - `*(*(p + 1) + 2) + 1` advances by 1 `int`, pointing to `&a[1][2][1]`.
- **Value Lookup:**
  - Block 1, Row 2 contains `{21, 22, 23, 24}`.
  - Element at index `[1][2][1]` is 22.
  - Thus, `*ptr = 22`.
- **Answer:** 22.

---

## Q12
type: MCQ
marks: 2
subject: programming-ds
topic: arrays-and-pointers
answer: A

Consider a 2D array declared in `main()`:

```c
int matrix[10][20];
```

Suppose a programmer writes several candidate function prototypes intended to receive `matrix` when called as `foo(matrix)`.

Which of the following function prototypes will cause a **compilation error / incompatible pointer type mismatch** according to the ISO C standard?

I. `void foo(int m[10][20]);`  
II. `void foo(int m[][20]);`  
III. `void foo(int (*m)[20]);`  
IV. `void foo(int **m);`  
V. `void foo(int *m[20]);`  

(A) IV and V only
(B) IV only
(C) II, IV, and V only
(D) I, IV, and V only

### Solution
- **Array Parameter Decay Rule in ISO C:**
  - In a function argument list, any parameter of array type `T[N]` automatically decays into a pointer to its first element: `T*`.
  - For `matrix[10][20]`, its element type is an array of 20 integers (`int[20]`).
  - Therefore, passing `matrix` passes a pointer of type `int (*)[20]` (pointer to an array of 20 ints).
- **Evaluating Each Prototype:**
  - **I. `int m[10][20]`:** Decays to `int (*m)[20]`. Compatible!
  - **II. `int m[][20]`:** Decays to `int (*m)[20]`. Compatible!
  - **III. `int (*m)[20]`:** Explicitly declared as `int (*m)[20]`. Compatible!
  - **IV. `int **m`:** This is a pointer to an `int *`. An `int (*)[20]` is completely incompatible with `int **` (different indirection scale and stride). In C, passing `matrix` produces an incompatible pointer type compiler error/warning.
  - **V. `int *m[20]`:** This is an array of 20 pointers. In a parameter list, it decays to `int **m`. As in IV, this is incompatible with `int (*)[20]`.
- Therefore, prototypes IV and V are invalid / cause type mismatch errors. Correct option is **(A)**.

---

## Q13
type: MSQ
marks: 2
subject: programming-ds
topic: arrays-and-pointers
answer: A, C, D

Consider the following variable declarations in an ISO C program:

```c
int a = 10, b = 20;
int *p = &a, *q = &b;
void *v = &a;
int * const pc = &a;
```

Which of the following operations is/are **ILLEGAL (causes a compile-time error)**?

(A) `p + q`
(B) `q - p`
(C) `*v`
(D) `pc++`

### Solution
- **Evaluating Each Operation:**
  - **(A) `p + q` is ILLEGAL:** The addition of two pointers is meaningless in memory semantics and strictly prohibited by the ISO C standard (`error: invalid operands to binary +`).
  - **(B) `q - p` is LEGAL:** Subtracting two pointers of compatible object type is valid C syntax and evaluates to an integer of type `ptrdiff_t` representing the difference in element index positions.
  - **(C) `*v` is ILLEGAL:** In ISO C, `void` is an incomplete type that cannot be completed. The compiler does not know the size or type of the object pointed to by a `void *`, so dereferencing `*v` without an explicit typecast causes a compile-time error (`error: dereferencing 'void *' pointer`).
  - **(D) `pc++` is ILLEGAL:** `pc` is declared as a constant pointer to `int` (`int * const pc`). The address stored in `pc` is read-only and cannot be modified. Attempting `pc++` modifies `pc`, causing a compile-time error (`error: increment of read-only variable`).
- **Correct Options:** **A, C, D**.

---

## Q14
type: NAT
marks: 2
subject: programming-ds
topic: arrays-and-pointers
answer: 47

Consider the following C program:

```c
#include <stdio.h>

int main() {
    int arr[] = {2, 4, 6, 8, 10, 12};
    int *p1 = arr + 1;
    int *p2 = arr + 4;
    int **pp = &p1;

    *pp = *pp + 2;
    pp = &p2;
    *pp = *pp - 2;

    int result = *p1 * *p2 + (p2 - p1);
    printf("%d\n", result);
    return 0;
}
```

What integer value is printed by the program?

### Solution
- **Initial Setup:**
  - `arr = {2, 4, 6, 8, 10, 12}` (indices 0 to 5).
  - `p1 = arr + 1` (points to `arr[1]`, value 4).
  - `p2 = arr + 4` (points to `arr[4]`, value 10).
  - `pp = &p1` (points to pointer variable `p1`).
- **Modification 1 (`*pp = *pp + 2;`):**
  - `*pp` refers to `p1`.
  - `p1 = p1 + 2 = (arr + 1) + 2 = arr + 3`.
  - Now `p1` points to `arr[3]`, where `*p1 = 8`.
- **Modification 2 (`pp = &p2; *pp = *pp - 2;`):**
  - `pp` now stores the address of `p2`.
  - `*pp` refers to `p2`.
  - `p2 = p2 - 2 = (arr + 4) - 2 = arr + 2`.
  - Now `p2` points to `arr[2]`, where `*p2 = 6`.
- **Evaluating `result = *p1 * *p2 + (p2 - p1);`:**
  - `*p1 = 8`.
  - `*p2 = 6`.
  - `*p1 * *p2 = 8 \times 6 = 48`.
  - Pointer subtraction `p2 - p1`:
    $$p2 - p1 = (arr + 2) - (arr + 3) = -1$$
  - `result = 48 + (-1) = 47`.
- **Answer:** 47.

---

## Q15
type: MCQ
marks: 1
subject: programming-ds
topic: arrays-and-pointers
answer: A

Which of the following correctly describes the declaration:

```c
int *(*foo[5])(int (*)[3]);
```

(A) `foo` is an array of 5 pointers to functions, each accepting a pointer to an array of 3 integers and returning a pointer to an integer.
(B) `foo` is a pointer to an array of 5 functions, each returning an array of 3 pointers to integers.
(C) `foo` is an array of 5 functions returning pointers to an array of 3 integers.
(D) `foo` is a function taking 5 integer pointers and returning a pointer to an array of 3 integers.

### Solution
- **Inside-Out (Spiral Rule) Parsing:**
  1. Start with the identifier: `foo`.
  2. Array subscript `[5]` binds tighter than prefix `*`: `foo[5]` $\to$ "`foo` is an array of 5..."
  3. Preceding `*`: `*foo[5]` $\to$ "...pointers to..."
  4. Function call parentheses `(...)`: `(*foo[5])(int (*)[3])` $\to$ "...functions taking a parameter `int (*)[3]`..."
     - In parameter: `(*)[3]` is a pointer to an array of 3 `int`s.
  5. Return type `int *`: $\to$ "...and returning a pointer to `int`."
- Thus: "`foo` is an array of 5 pointers to functions, each accepting a pointer to an array of 3 integers and returning a pointer to an integer."
- Correct option is **(A)**.

---

## Q16
type: NAT
marks: 2
subject: programming-ds
topic: arrays-and-pointers
answer: 44

Consider the following C program:

```c
#include <stdio.h>

int main() {
    int a[] = {2, 4, 6, 8, 10, 12, 14, 16};
    int *p = a;
    int *q = a + 6;
    while (p < q) {
        *p = *p + *(q--);
        p += 2;
    }
    printf("%d\n", a[0] + a[2] + a[4]);
    return 0;
}
```

What integer value is printed by the program?

### Solution
- **Initial Array State:**
  - `a = {2, 4, 6, 8, 10, 12, 14, 16}` (indices 0 through 7).
  - `p` points to `a[0]` (index 0).
  - `q` points to `a[6]` (index 6, value 14).
- **Template C: Loop Iteration Tracing:**
  - **Iteration 1:**
    - Check condition: `p < q` (index 0 < 6 is TRUE).
    - `*(q--)`: Dereferences current `q` (`a[6] = 14`), then decrements `q` to index 5.
    - `*p = *p + 14 = a[0] + 14 = 2 + 14 = 16`.
    - `a[0]` becomes 16.
    - `p += 2`: `p` moves to index 2.
    - State: `p` at index 2, `q` at index 5.
  - **Iteration 2:**
    - Check condition: `p < q` (index 2 < 5 is TRUE).
    - `*(q--)`: Dereferences current `q` (`a[5] = 12`), then decrements `q` to index 4.
    - `*p = *p + 12 = a[2] + 12 = 6 + 12 = 18`.
    - `a[2]` becomes 18.
    - `p += 2`: `p` moves to index 4.
    - State: `p` at index 4, `q` at index 4.
  - **Iteration 3:**
    - Check condition: `p < q` (index 4 < 4 is FALSE).
    - Loop terminates!
- **Evaluating `a[0] + a[2] + a[4]`:**
  - `a[0] = 16`
  - `a[2] = 18`
  - `a[4] = 10` (unmodified)
  - Sum $= 16 + 18 + 10 = 44$.
- **Answer:** 44.

---

## Q17
type: MCQ
marks: 2
subject: programming-ds
topic: arrays-and-pointers
answer: A

Consider the following C program:

```c
#include <stdio.h>

int main() {
    int arr[3][3] = {
        {10, 20, 30},
        {40, 50, 60},
        {70, 80, 90}
    };
    int (*p)[2] = (int (*)[2])arr;
    printf("%d %d\n", p[1][1], p[2][1]);
    return 0;
}
```

What is the output printed by the program?

(A) 40 60
(B) 50 80
(C) 30 50
(D) 20 40

### Solution
- **Contiguous Memory Layout of `arr`:**
  - `arr` is stored in contiguous row-major order:
    - Offset 0: `10` (`arr[0][0]`)
    - Offset 1: `20` (`arr[0][1]`)
    - Offset 2: `30` (`arr[0][2]`)
    - Offset 3: `40` (`arr[1][0]`)
    - Offset 4: `50` (`arr[1][1]`)
    - Offset 5: `60` (`arr[1][2]`)
    - Offset 6: `70` (`arr[2][0]`)
    - Offset 7: `80` (`arr[2][1]`)
    - Offset 8: `90` (`arr[2][2]`)
- **Pointer Stride of `p`:**
  - `p` is typed as `int (*)[2]`, meaning pointer to an array of **2** integers.
  - Each increment `p + i` advances by $i \times 2 \times \text{sizeof}(int)$ (stride = 2 integers).
  - Therefore, subscript expansion evaluates linearly as:
    $$p[i][j] \iff \text{element at offset } (i \times 2 + j)$$
- **Evaluating Values:**
  - For `p[1][1]`:
    $$\text{Offset} = 1 \times 2 + 1 = 3 \implies \text{Value at offset 3 is } 40$$
  - For `p[2][1]`:
    $$\text{Offset} = 2 \times 2 + 1 = 5 \implies \text{Value at offset 5 is } 60$$
- **Output:** `40 60`. Correct option is **(A)**.

---

## Q18
type: MSQ
marks: 2
subject: programming-ds
topic: arrays-and-pointers
answer: A, B, C

Consider the following C code containing callbacks and array traversal:

```c
#include <stdio.h>

int transform(int x, int (*f)(int)) {
    return f(x);
}

int sq(int n)  { return n * n; }
int dbl(int n) { return 2 * n; }

int apply_all(int *arr, int n, int (*f)(int)) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += transform(*(arr + i), f);
    }
    return sum;
}
```

Which of the following statements is/are **TRUE**?

(A) In `apply_all`, `*(arr + i)` can be equivalently written as `i[arr]` or `arr[i]`.
(B) Passing `&sq` or `sq` to `transform` produces identical behavior because a function designator automatically converts to a pointer to the function.
(C) The function call `apply_all(arr, 3, sq)` for `int arr[] = {1, 2, 3};` returns 14.
(D) If the prototype of `apply_all` is changed to `int apply_all(int arr[10], int n, int (*f)(int))`, then `sizeof(arr)` inside `apply_all` evaluates to `10 * sizeof(int)` on a 64-bit architecture.

### Solution
- **Statement (A) is TRUE:**
  - In C, array indexing is commutative and strictly defined by pointer addition:
    $$arr[i] \iff *(arr + i) \iff *(i + arr) \iff i[arr]$$
- **Statement (B) is TRUE:**
  - In ISO C (C99/C11 §6.3.2.1), a function designator with function type is automatically converted to a pointer to the function unless it is the operand of `sizeof` or the unary `&`.
  - Thus, `sq` and `&sq` pass the identical function pointer address.
- **Statement (C) is TRUE:**
  - For `arr = {1, 2, 3}` and `f = sq`:
    - $i = 0 \implies sq(1) = 1$
    - $i = 1 \implies sq(2) = 4$
    - $i = 2 \implies sq(3) = 9$
    - $\text{sum} = 1 + 4 + 9 = 14$.
- **Statement (D) is FALSE:**
  - In a function parameter declaration, `int arr[10]` decays to `int *arr`.
  - Inside `apply_all`, `sizeof(arr)` evaluates to `sizeof(int *)`, which is 8 bytes on a 64-bit system, NOT $10 \times 4 = 40$ bytes.
- **Correct Options:** **A, B, C**.

---

## Q19
type: NAT
marks: 1
subject: programming-ds
topic: arrays-and-pointers
answer: 5

Consider the following C program:

```c
#include <stdio.h>

int main() {
    char arr[] = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
    char *p = arr + 2;
    char **pp = &p;
    *pp += 3;
    printf("%d\n", *p - arr[0]);
    return 0;
}
```

What integer value is printed by the program?

### Solution
- **Initial Setup:**
  - `arr` holds `{'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'}` at indices 0 to 7.
  - `p = arr + 2` points to `arr[2]` (character `'C'`).
  - `pp = &p` (points to the pointer variable `p`).
- **Pointer Update via Double Pointer (`*pp += 3;`):**
  - Dereferencing `*pp` accesses `p`.
  - `*pp += 3` evaluates as `p = p + 3`.
  - `p` advances from `arr + 2` by 3 characters to `arr + 5`.
  - Now `p` points to `arr[5]`, where `*p = 'F'`.
- **Difference Calculation:**
  - `*p - arr[0] = 'F' - 'A'`.
  - In ASCII: `'F' = 70`, `'A' = 65`.
  - $70 - 65 = 5$.
- **Answer:** 5.

---

## Q20
type: NAT
marks: 2
subject: programming-ds
topic: arrays-and-pointers
answer: 80

Consider the following C program involving an array of pointers and negative indexing:

```c
#include <stdio.h>

int main() {
    int x[] = {10, 20, 30, 40, 50};
    int *p[] = {x + 4, x + 3, x + 2, x + 1, x};
    int **ptr = p + 2;

    int val = *ptr[-1] + ptr[1][-1] + **ptr;
    printf("%d\n", val);
    return 0;
}
```

What integer value is printed by the program?

### Solution
- **Memory Setup:**
  - `x = {10, 20, 30, 40, 50}` (indices 0 to 4).
  - Array of pointers `p`:
    - `p[0] = x + 4` (points to `x[4] = 50`)
    - `p[1] = x + 3` (points to `x[3] = 40`)
    - `p[2] = x + 2` (points to `x[2] = 30`)
    - `p[3] = x + 1` (points to `x[1] = 20`)
    - `p[4] = x`     (points to `x[0] = 10`)
  - `ptr = p + 2` (points to element `p[2]`).
- **Evaluating Term 1 (`*ptr[-1]`):**
  - `ptr[-1] \equiv *(ptr - 1) = *(p + 2 - 1) = p[1]`.
  - `p[1]` is `x + 3`.
  - `*ptr[-1] = *(x + 3) = x[3] = 40`.
- **Evaluating Term 2 (`ptr[1][-1]`):**
  - `ptr[1] \equiv *(ptr + 1) = *(p + 2 + 1) = p[3]`.
  - `p[3]` is `x + 1` (points to `x[1]`).
  - `ptr[1][-1] \equiv (p[3])[-1] \equiv *(p[3] - 1) = *((x + 1) - 1) = *x = x[0] = 10`.
- **Evaluating Term 3 (`**ptr`):**
  - `*ptr = p[2] = x + 2`.
  - `**ptr = *(x + 2) = x[2] = 30`.
- **Total Sum:**
  $$\text{val} = *ptr[-1] + ptr[1][-1] + **ptr = 40 + 10 + 30 = 80$$
- **Answer:** 80.
