# 2D Arrays and Advanced Pointers

## TL;DR
2D arrays are stored linearly in row-major order: `a[i][j] \equiv *(*(a + i) + j)`. `int (*p)[N]` is 1 pointer to an array of $N$ elements (row jump size $N \times 4$ bytes); `int *p[N]` is an array of $N$ separate pointers. Function pointers `int (*fp)(...)` hold the address of code. Casting changes the byte inspection lens without changing the address.

## Core idea
- **Row-Major Layout:**
  - Multidimensional arrays in C are stored row-by-row in contiguous memory.
  - `a[i][j]` expands by applying the pointer-index identity twice:
    $$a[i][j] \iff *(a[i] + j) \iff *(*(a + i) + j)$$
  - `a + i` skips $i$ entire rows (jump size = row size).
  - `*(a + i)` unpacks the row: same numerical address, but jump size shrinks to 1 element.
  - `*(a + i) + j` moves forward by $j$ elements in that row.
  - `*(*(a + i) + j)` follows the arrow and reads the value.
- **The 2D Array Triple (`a`, `*a`, `**a`):**
  - `a` and `*a` share the **exact same numerical address**, but differ in type:
    - `a`: Pointer to a whole row (jump = row bytes).
    - `*a`: Pointer to the first element (jump = 1 element bytes).
    - `**a`: The integer value inside `a[0][0]`.
- **`int (*p)[N]` vs `int *p[N]`:**
  - `int (*p)[N]`: Parentheses force `*` first $\to$ **1 single pointer** pointing to an array of $N$ ints (jump size = $N \times \text{sizeof(int)}$).
  - `int *p[N]`: Brackets `[]` bind first $\to$ an **array of $N$ separate pointers** to int.
- **Function Pointers:**
  - Code lives in memory and has addresses.
  - `int (*fp)(int, int);`: Pointer to a function taking two ints and returning an int.
  - `int *fp(int, int);`: A normal function returning an `int*`.
  - Assignment: `fp = add;`. Invocation: `fp(3, 4)` or `(*fp)(3, 4)`.
- **Byte Inspection & Endianness:**
  - Casting `(char *)&x` changes the viewing lens to 1 byte.
  - **Little Endian** (standard x86 / GATE): Least significant byte (LSB) sits at the lowest address.
- **Special Pointers:**
  - `void *`: Generic raw address. Cannot be dereferenced (`*vp` is illegal) or scaled (`vp + 1` is invalid in ISO C) without casting first.
  - `NULL`: Explicitly points to 0. Safe to check `p != NULL`.
  - **Wild Pointer:** Uninitialized pointer (`int *p;`) holding random garbage address.
  - **Dangling Pointer:** Points to memory that has been freed or whose scope has ended (e.g. returning address of a local variable).

---

### 📝 Template A: 2D Row-Major Address-Arrow Model
```text
int a[2][3] from base 1000 (Row = 3 ints = 12B, Int = 4B):

Address:    1000       1004       1008        1012       1016       1020
         +----------+----------+----------+ +----------+----------+----------+
         | a[0][0]  | a[0][1]  | a[0][2]  | | a[1][0]  | a[1][1]  | a[1][2]  |
         +----------+----------+----------+ +----------+----------+----------+
          ^          ^                       ^
          |          |                       |
        a, *a      *a + 1                  a + 1, *(a + 1)
```

## Where I got confused → what made it click
- **`a` vs `*a` having the same address:**
  - *Confusion:* If `*` means dereference, why does `*a` give the same address number as `a`?
  - *The click:* A 2D array is an array of arrays. `a` points to the whole container (Row 0). `*a` unpacks the container to point to the first item inside it (`a[0][0]`). Both start at the same physical byte!
- **`int (*p)[N]` vs `int *p[N]`:**
  - *Confusion:* Forgetting which is the array and which is the pointer.
  - *The click:* Follow operator priority inside-out! Parentheses `(*p)` protect `p` as a pointer first. Without parentheses, `p[N]` makes it an array first.
- **Wild vs Dangling:**
  - *Confusion:* Calling any invalid pointer a dangling pointer.
  - *The click:* Wild was *never initialized* (born broken, points to garbage). Dangling *used to point to valid memory*, but the memory died (was freed or stack frame popped).

## GATE traps
- **Dereferencing `void *`:**
  - `void *p = &x; printf("%d", *p);` causes a **Compile Error**. Must write `*(int *)p`.
  - `p + 1` on `void *` is a compile error in ISO C (GNU C treats `sizeof(void)` as 1 as an extension, but GATE follows ISO C).
- **Dangling Local Return:**
  - `int *f() { int x = 10; return &x; }` returns a pointer to a destroyed stack frame $\to$ Dangling Pointer!

## Example: GATE CSE
```c
#include <stdio.h>
int main() {
    int a[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    int (*p)[3] = a;
    printf("%d %d\n", *(*p + 1), *(*(p + 2) + 1));
    return 0;
}
```
**Working:**
1. `p` points to Row 0. `*p` unpacks to element level (`&a[0][0]`).
2. `*p + 1` moves to `&a[0][1]`, so `*(*p + 1)` reads **`2`**.
3. `p + 2` skips 2 whole rows (jumps $2 \times 12 = 24$ bytes), reaching Row 2 (`{7, 8, 9}`).
4. `*(p + 2)` unpacks to `&a[2][0]`. Adding `+ 1` moves to `&a[2][1]`.
5. `*(*(p + 2) + 1)` reads **`8`**.
6. Output: `2 8`.
