# Pointers and 1D Arrays

## TL;DR
A variable lives at a house number (address `&x`) and holds content (`x`). A pointer stores an address; `*p` follows the arrow to look inside or modify that house. Pointer arithmetic scales by the size of the target: `p + i` advances by $i \times \text{sizeof}(*p)$ bytes. In C, arrays are syntactic sugar for pointers: `a[i] \equiv *(a + i) \equiv i[a]`.

## Core idea
- **Address-of (`&`) vs Dereference (`*`):**
  - `&x`: Fetches the memory address (house number) where `x` lives.
  - `int *p = &x;`: In declarations, `*` labels `p` as a pointer storing an address of an `int`.
  - `*p`: In expressions, `*` means "follow the arrow to the house and access the content".
- **Pointer Size vs Target Size:**
  - On a 64-bit architecture, **every pointer variable takes 8 bytes** (holds a 64-bit address), regardless of whether it is `char*`, `int*`, or `double*`.
  - `sizeof(p)` is 8 bytes. `sizeof(*p)` is the size of the pointed-to type (`sizeof(int) = 4`, `sizeof(char) = 1`).
- **Pointer Arithmetic (The Scaling Factor):**
  - Pointer addition does not add raw bytes: $\text{new address} = \text{old address} + i \times \text{sizeof}(*p)$.
  - `p + 1` moves to the *next item* of that type.
  - Pointer subtraction `p2 - p1` gives the **number of elements** between them, not bytes: $\frac{\text{addr}(p2) - \text{addr}(p1)}{\text{sizeof}(*p)}$. Pointer addition `p1 + p2` is illegal.
- **Array-Pointer Identity:**
  - In expressions, an array name `a` decays to a pointer to its first element (`&a[0]`).
  - `a[i] \equiv *(a + i) \equiv *(i + a) \equiv i[a]`.
- **Negative Indexing:**
  - `p[-1] \equiv *(p - 1)`. Steps backwards in memory by elements.
- **Double Pointers (`int **q = &p;`):**
  - Stores the address of pointer variable `p`.
  - `q` holds address of `p`, `*q` follows 1 arrow (yields `p` / `&x`), `**q` follows 2 arrows (yields `x`).

---

### 📝 Template A: The Address-Arrow Scaling Model
Never imagine pointers in your head. Draw the base address, write the jump sizes, and trace arrows:

```text
Address:    1000        1004        1008        1012
          +-----------+-----------+-----------+-----------+
arr:      |  arr[0]   |  arr[1]   |  arr[2]   |  arr[3]   |
          +-----------+-----------+-----------+-----------+
            ^           ^
            |           |
           arr        arr + 1 (jump = 1 int = 4B)
            *arr      *(arr + 1) == arr[1]
```

## Where I got confused → what made it click
- **`sizeof(a)` does NOT decay to `a[0]`:**
  - *Confusion:* Thinking `sizeof(a)` evaluates to just the first element `a[0]` because `a` points to `a[0]` everywhere else in C.
  - *The click:* `sizeof` is an explicit exception to decay! `sizeof(a)` always gives the **entire array** size ($N \times \text{element size}$). To get one element, you must explicitly ask for `sizeof(a[0])`.
- **No bounds checking in C:**
  - *Confusion:* Expecting `a[5] = 10` on `int a[5]` to give a compile error or throw an out-of-bounds exception.
  - *The click:* C does zero bounds checking. It calculates the offset and silently accesses memory $\rightarrow$ Undefined Behavior!
- **`arr` vs `&arr`:**
  - *Confusion:* Both print the same numerical address (e.g. 1000), so they seem identical.
  - *The click:* Their **types** are different! `arr` is `int*` (points to 1 element; `arr + 1` jumps 4 bytes). `&arr` is `int (*)[N]` (points to the *entire array*; `&arr + 1` jumps the whole array size $N \times 4$ bytes!).
- **Pointer parameter reassignment in functions:**
  - *Confusion:* Doing `p = q;` inside a function changes the caller's pointer.
  - *The click:* Pointers are passed by value! `p` is a local copy of an address. `p = q;` only swings the local arrow. To change the caller's value, you must dereference: `*p = ...`. To change the caller's pointer, the parameter must be `int **pp`.
- **`*p++` vs `(*p)++`:**
  - *Confusion:* Mixing up which one moves the pointer and which one changes the value.
  - *The click:* Postfix `++` has higher priority: `*p++` reads the current value, then advances the pointer arrow (`p = p + 1`). `(*p)++` forces `*p` first, adding 1 to the *content* inside the house while the arrow stays put.
- **Endianness byte layout:**
  - *Confusion:* Mixing up which end goes to the lowest memory address.
  - *The click:* *"Little end comes first"* $\rightarrow$ Little-Endian stores the Least Significant Byte (LSB) at the lowest memory address. Tested via `*(char *)&x == 1` for `x = 1`.

## GATE traps
- **Partial initialization zeroing:** `int a[5] = {1, 2};` sets `a[0]=1, a[1]=2`, and ALL missing elements `a[2], a[3], a[4]` automatically become `0` (unlike uninitialized `int a[5];` which has garbage).
- **The declaration asterisk trap:** `int *p, q;` declares `p` as `int *` and `q` as plain `int`!
- **Array decay in parameters:** In `void f(int a[10])`, `a` decays to `int *a`. So `sizeof(a)` inside `f` is pointer size (8 bytes), NOT 40 bytes!
- **`scanf` return value:** `scanf("%d %d", &a, &b)` returns the number of successfully matched items (e.g. 2), NOT the values scanned.
- **Wild vs Dangling pointer:** Wild pointer = never initialized (contains garbage bits). Dangling pointer = points to deallocated memory (e.g. returning address of a local stack variable).
- **`*(p + 2)` vs `*p + 2`:**
  - `*(p + 2)` steps 2 elements forward in memory and reads the value.
  - `*p + 2` evaluates `(*p) + 2`: reads the current element and adds regular integer 2.
- **The Pre- vs Post-Increment Quartet:**
  - `*p++`: Fetch current value, then advance pointer.
  - `(*p)++`: Increment current value in-place, pointer does not move.
  - `*++p`: Advance pointer first, then fetch new value.
  - `++*p`: Increment current value in-place first, then yield new value.

## Examples

### Example 1: GATE CSE 2008
```c
#include <stdio.h>
int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int *ptr = (int*)(&arr + 1);
    printf("%d %d\n", *(arr + 1), *(ptr - 1));
    return 0;
}
```
**Working:**
1. `*(arr + 1)` is `arr[1] = 2`.
2. `&arr + 1` jumps past all 5 integers (points immediately after element 5).
3. `ptr` is cast to `int*`. So `ptr - 1` steps backward by 1 `int`, pointing right at `5`.
4. Output: `2 5`.

### Example 2: GATE CSE 2019
```c
#include <stdio.h>
void f(int *p, int *q) {
    p = q;
    *p = 2;
}
int main() {
    int i = 0, j = 1;
    f(&i, &j);
    printf("%d %d\n", i, j);
    return 0;
}
```
**Working:**
1. `f` receives copies of addresses: local `p = &i`, local `q = &j`.
2. `p = q;` swings local `p` to point to `j`.
3. `*p = 2;` dereferences local `p`, overwriting `j` with `2`. `i` is never touched.
4. Output: `0 2`.
