---
test: c-ut-05-r2
title: "C Programming · Unit Test 05 Retest (Structures, Dynamic Memory & Preprocessor)"
duration: 30
marks: 15
pass: 70%
---

# C Programming · Unit Test 05 Retest (Structures, Dynamic Memory & Preprocessor)

## Q1
type: MCQ
marks: 1
subject: programming-ds
topic: structures-and-memory
syllabus: P12.5
answer: A
difficulty: easy

In the C runtime memory layout, which of the following is allocated in the runtime call stack?

(A) Automatic local variables declared inside a function
(B) Memory dynamically allocated via `calloc()`
(C) Global variables initialized at program start
(D) Static variables defined inside a function

### Solution
- (A) is CORRECT: Local automatic variables declared inside a function have automatic storage duration and are allocated inside that function's activation record (stack frame) on the runtime call stack.
- (B) is INCORRECT: `calloc()` allocates memory dynamically in the heap segment.
- (C) is INCORRECT: Initialized global variables are stored in the data segment.
- (D) is INCORRECT: Static variables (whether global or inside a function) have static storage duration and are stored in the data or BSS segment, not on the call stack.

Hence, (A) is correct.

## Q2
type: MCQ
marks: 1
subject: programming-ds
topic: structures-and-memory
syllabus: P12.11
answer: A
difficulty: easy

Consider the following C program with a multi-statement preprocessor macro:

```c
#include <stdio.h>

#define UPDATE(x, y) x = x + 1; y = y + 1

int main() {
    int a = 10, b = 20;
    if (a > b)
        UPDATE(a, b);
    printf("%d %d", a, b);
    return 0;
}
```

What is the output printed upon execution?

(A) `10 21`
(B) `10 20`
(C) `11 21`
(D) `11 20`

### Solution
- The preprocessor expands `UPDATE(a, b)` by direct textual substitution into:
  ```c
  if (a > b)
      a = a + 1; y = y + 1;
  ```
- Because the `if` statement does not use curly braces `{ ... }`, only the first statement `a = a + 1;` is guarded by the condition `a > b`.
- The condition `10 > 20` is false, so `a = a + 1;` is skipped. Variable `a` remains `10`.
- The second statement `y = y + 1;` (which expands to `b = b + 1;`) is outside the `if` block and executes unconditionally. Variable `b` increments from `20` to `21`.
- The program prints `10 21`.

Hence, (A) is correct.

## Q3
type: NAT
marks: 1
subject: programming-ds
topic: structures-and-memory
syllabus: P11.11
answer: 6
difficulty: medium

Consider the following C program with bit-fields:

```c
#include <stdio.h>

struct Register {
    unsigned int mode : 3;
    int flag : 2;
};

int main() {
    struct Register r;
    r.mode = 7;
    r.flag = 3;
    printf("%d", (int)r.mode + (int)r.flag);
    return 0;
}
```

What integer value is printed upon execution?

### Solution
1. `mode` is declared as `unsigned int mode : 3`.
   - An unsigned 3-bit integer represents values in the range $0$ to $2^3 - 1 = 7$.
   - Storing $7$ stores binary `111`, which evaluates to $+7$.
2. `flag` is declared as `int flag : 2` (a signed 2-bit integer).
   - In 2's complement representation, a 2-bit signed integer has 1 sign bit and 1 magnitude bit, representing values in the range $[-2^{2-1}, 2^{2-1} - 1] = [-2, 1]$:
     - `00` $\implies 0$
     - `01` $\implies 1$
     - `10` $\implies -2$
     - `11` $\implies -1$
   - Assigning $3$ (binary `11`) into a 2-bit signed field stores bit pattern `11`, which represents **$-1$**.
3. Therefore:
   `(int)r.mode + (int)r.flag` evaluates to $7 + (-1) = 6$.

The printed value is 6.

## Q4
type: MSQ
marks: 1
subject: programming-ds
topic: structures-and-memory
syllabus: P12.8
answer: A, B, C
difficulty: medium

Which of the following statements is/are **CORRECT** regarding runtime memory management in C?

(A) Static memory allocation of all data areas makes it impossible to support recursive function calls.
(B) Dynamic allocation of activation records on a runtime call stack is essential to support recursion.
(C) Objects whose lifetime must exceed the execution of the function invocation that created them require heap allocation (or static storage).
(D) Dynamic memory allocation using `malloc()` is performed entirely during compile time without runtime operating system support.

### Solution
- (A) is TRUE: Under purely static memory allocation, each function has exactly one fixed, static memory location for its local variables and return address. A recursive call would overwrite the caller's local state and return address, making general recursion impossible.
- (B) is TRUE: Recursion requires allocating a separate activation record for each active invocation on the runtime stack and deallocating it upon return.
- (C) is TRUE: Local variables inside activation records are automatically reclaimed when the function returns. Data that needs to persist across function calls must be allocated on the heap (or in static memory).
- (D) is FALSE: `malloc()` requests memory dynamically at runtime from the heap, involving runtime OS memory management routines.

Hence, (A), (B), and (C) are correct.

## Q5
type: MCQ
marks: 1
subject: programming-ds
topic: structures-and-memory
syllabus: P11.11
answer: A
difficulty: easy

Consider the following C program:

```c
#include <stdio.h>

struct Device {
    int state : 1;
};

int main() {
    struct Device d;
    d.state = 1;
    if (d.state == 1)
        printf("ENABLED");
    else
        printf("DISABLED");
    return 0;
}
```

What is printed upon execution?

(A) `DISABLED`
(B) `ENABLED`
(C) Compiler error: bit-field comparison not supported
(D) Undefined behavior

### Solution
- Member `state` is declared as `int state : 1`, which is a 1-bit **signed** integer.
- In 2's complement, a 1-bit signed integer has only a sign bit:
  - bit `0` represents $0$
  - bit `1` represents $-1$
- The assignment `d.state = 1` sets the single bit to `1`. When read as a signed integer, its value is $-1$.
- The condition `d.state == 1` tests whether $-1 == 1$, which evaluates to false ($0$).
- The `else` branch executes, printing `DISABLED`.

Hence, (A) is correct.

## Q6
type: NAT
marks: 2
subject: programming-ds
topic: structures-and-memory
syllabus: P11.11
answer: 12
difficulty: hard
pyq: 2000-1.17

Consider the following structure declaration on a 32-bit architecture:

```c
struct Header {
    unsigned int a : 12;
    unsigned int b : 12;
    unsigned int c : 12;
    int data;
};
```

Assume:
- `unsigned int` and `int` occupy 4 bytes (32 bits), requiring 4-byte alignment.
- The compiler packs adjacent bit-fields of the same underlying type into the same container word until the remaining bits are insufficient, in which case a new container word is started.
- Structure size is padded to a multiple of its largest alignment requirement.

The value of `sizeof(struct Header)` in bytes is ________.

### Solution
1. **Container 1 (offsets 0–3, 4 bytes):**
   - Bit-field `a` uses 12 bits.
   - Bit-field `b` uses 12 bits.
   - Combined bits used = $12 + 12 = 24$ bits.
   - Remaining bits in Container 1 = $32 - 24 = 8$ bits.
2. **Container 2 (offsets 4–7, 4 bytes):**
   - Bit-field `c` requires 12 bits. Since 12 bits cannot fit into the 8 remaining bits of Container 1, the compiler starts a new 4-byte `unsigned int` container word for `c`.
3. **Member `data` (offsets 8–11, 4 bytes):**
   - `data` is an `int` requiring 4-byte alignment. Offset 8 is a multiple of 4, so `data` occupies offsets 8 through 11.
4. **Total size:**
   Offsets 0 through 11 are used $\implies$ 12 bytes.
   Since 12 is a multiple of 4 (largest alignment requirement), no tail padding is needed.

The value of `sizeof(struct Header)` is 12 bytes.

## Q7
type: NAT
marks: 2
subject: programming-ds
topic: structures-and-memory
syllabus: P11.10
answer: 24
difficulty: hard
pyq: 2000-1.17

Consider the following structure declaration on a 32-bit architecture:

```c
struct Record {
    int id;
    union {
        char name[14];
        int code[3];
    } data;
    short status;
};
```

Assume:
- `char` occupies 1 byte
- `short` occupies 2 bytes (aligned to multiples of 2)
- `int` occupies 4 bytes (aligned to multiples of 4)
- A union's size is padded to a multiple of its largest member's alignment requirement.
- The structure's members are naturally aligned and the overall structure size is padded to a multiple of its largest alignment requirement.

The value of `sizeof(struct Record)` in bytes is ________.

### Solution
1. `int id` occupies 4 bytes at offsets 0, 1, 2, 3.
2. `union data`:
   - Member `char name[14]` requires 14 bytes (alignment 1 byte).
   - Member `int code[3]` requires $3 \times 4 = 12$ bytes (alignment 4 bytes).
   - The largest alignment requirement among the union's members is 4 bytes (from `int`).
   - The union size must accommodate the largest member (14 bytes) and must be a multiple of its alignment (4 bytes).
     The next multiple of 4 greater than or equal to 14 is 16.
     Therefore, the size of `union data` is 16 bytes.
   - The union starts at offset 4 (which is a multiple of 4), occupying offsets 4 through 19 (16 bytes).
3. `short status` requires 2 bytes and 2-byte alignment:
   - Next available offset is 20, which is a multiple of 2.
   - `status` occupies offsets 20 and 21 (2 bytes).
4. Total bytes used: offsets 0 through 21 $\implies 22$ bytes.
   - The largest alignment requirement of `struct Record` is 4 bytes (from `int`).
   - The total structure size must be a multiple of 4.
   - Next multiple of 4 greater than or equal to 22 is 24.
   - Offsets 22 and 23 (2 bytes) are added as tail padding.

The value of `sizeof(struct Record)` is 24 bytes.

## Q8
type: MCQ
marks: 2
subject: programming-ds
topic: structures-and-memory
syllabus: P11.6
answer: A
difficulty: medium

Consider the following C program:

```c
#include <stdio.h>

struct Item {
    int id;
    char *name;
} items[] = {
    {10, "apple"},
    {20, "banana"},
    {30, "cherry"},
    {40, "date"}
};

int main() {
    struct Item *p = items;
    p++;
    ++p->name;
    printf("%s ", p++->name);
    printf("%c ", *++p->name);
    printf("%d", p->id);
    return 0;
}
```

What is the output printed by the program?

(A) `anana h 30`
(B) `banana c 30`
(C) `anana c 20`
(D) `banana h 40`

### Solution
- `p = items` points to `items[0]`.
- `p++` increments `p` to point to `items[1]` (`{20, "banana"}`).
- `++p->name` increments the `char *` pointer of `items[1]` from `"banana"` to `"anana"`.
- `printf("%s ", p++->name);`:
  Postfix `p++` evaluates using the current pointer `items[1]`, printing `"anana "`.
  Then `p` advances to point to `items[2]` (`{30, "cherry"}`).
- `printf("%c ", *++p->name);`:
  In `items[2]`, `++p->name` increments `"cherry"` to `"herry"`.
  Dereferencing with `*` yields `'h'`, printing `'h '`.
- `printf("%d", p->id);`:
  `p` still points to `items[2]`, printing `30`.

The complete output is `anana h 30`.
Hence, (A) is correct.

## Q9
type: MSQ
marks: 2
subject: programming-ds
topic: structures-and-memory
syllabus: P12.4
answer: A, B
difficulty: medium

Consider the following statements regarding memory allocation and pointer operations in C:

(A) Passing a pointer `p + 1` to `free()`, where `p` is the address returned by `malloc()`, causes undefined behavior at runtime.
(B) Invoking `free(p)` twice consecutively on the same dynamically allocated pointer without an intervening allocation causes undefined behavior (double free).
(C) If `malloc()` fails to allocate the requested memory block on the heap, it returns a pointer to the start of the runtime stack.
(D) After `free(p)` executes successfully, the pointer variable `p` automatically resets to `NULL`.

### Solution
- (A) is TRUE: Under the ANSI C standard (§7.22.3.3), `free(ptr)` requires `ptr` to be either `NULL` or an exact pointer value previously returned by `malloc()`, `calloc()`, or `realloc()`. Passing an interior or shifted pointer like `p + 1` causes memory manager corruption and undefined behavior.
- (B) is TRUE: Calling `free()` on an already freed pointer without reallocation is a double-free bug that corrupts the heap management data structures and results in undefined behavior.
- (C) is FALSE: When `malloc()` cannot fulfill a memory request, it returns a `NULL` pointer, never a pointer to the stack.
- (D) is FALSE: `free(p)` deallocates the heap block pointed to by `p`, but `p` itself retains the old memory address (becoming a dangling pointer). It does not automatically become `NULL`.

Hence, (A) and (B) are correct.

## Q10
type: MCQ
marks: 2
subject: programming-ds
topic: structures-and-memory
syllabus: P12.11
answer: A
difficulty: medium

Consider the following C program comparing macro expansion with function execution:

```c
#include <stdio.h>

#define MAX_MACRO(a, b) ((a) > (b) ? (a) : (b))

int max_func(int a, int b) {
    return (a > b) ? a : b;
}

int main() {
    int p = 4, q = 2;
    int r1 = max_func(++p, q);

    int s = 4, t = 2;
    int r2 = MAX_MACRO(++s, t);

    printf("%d %d", r1, r2);
    return 0;
}
```

What is the output printed upon execution?

(A) `5 6`
(B) `5 5`
(C) `6 6`
(D) `6 5`

### Solution
1. **Function call `max_func(++p, q)`:**
   - Arguments are evaluated eagerly before the call:
     `++p` increments `p` from 4 to 5.
   - `max_func(5, 2)` is called. Inside `max_func`: `(5 > 2) ? 5 : 2` returns 5.
   - Thus, $r1 = 5$ and $p = 5$.

2. **Macro invocation `MAX_MACRO(++s, t)`:**
   - The preprocessor expands `MAX_MACRO(++s, t)` textually:
     `((++s) > (t) ? (++s) : (t))`.
   - In C, the conditional operator `?:` has a sequence point after the evaluation of its first operand.
   - The first operand `(++s)` is evaluated: `s` increments from 4 to 5.
   - The condition $5 > 2$ evaluates to true (non-zero).
   - Because the condition is true, only the second operand `(++s)` is evaluated.
   - The second operand `(++s)` increments `s` from 5 to 6 and yields 6.
   - Thus, $r2 = 6$ and $s = 6$.

The program prints `5 6`.
Hence, (A) is correct.
