---
test: c-ut-05
title: "C Programming · Unit Test 05 (Structures, Dynamic Memory & Preprocessor)"
duration: 30
marks: 15
pass: 70%
---

# C Programming · Unit Test 05 (Structures, Dynamic Memory & Preprocessor)

## Q1
type: MCQ
marks: 1
subject: programming-ds
topic: structures-and-memory
syllabus: P12.5
answer: A
difficulty: easy

Consider the following C program:

```c
#include <stdio.h>
#include <stdlib.h>

int g = 10;

void fun() {
    static int s = 20;
    int x = 30;
    int *p = (int *)malloc(sizeof(int));
    *p = 40;
}
```

In the C runtime memory layout, in which memory segments are variable `s`, variable `x`, and the allocated block pointed to by `p` stored respectively?

(A) Data segment, Stack, Heap
(B) Stack, Data segment, Heap
(C) Data segment, Heap, Stack
(D) Stack, Stack, Heap

### Solution
- `s` is a local `static` variable: it has permanent lifetime across function calls and is stored in the **Data segment** (Static Store).
- `x` is a local automatic variable: it is stored inside `fun`'s activation record on the **Stack**.
- The memory allocated via `malloc` is dynamically allocated at runtime on the **Heap** (while pointer variable `p` itself sits on the Stack).

The segments are Data segment, Stack, and Heap respectively.
Hence, (A) is correct.

## Q2
type: MCQ
marks: 1
subject: programming-ds
topic: structures-and-memory
syllabus: P12.14
answer: A
difficulty: easy

Consider the following three C programs:

```c
/* Program 1 */
int x = 10;
void f1() {
    int x = 20;
}

/* Program 2 */
void f2() {
    int y = 10;
    int y = 20;
}

/* Program 3 */
void f3() {
    int z = 10;
    {
        int z = 20;
    }
}
```

Which of the programs will compile without any error?

(A) Program 1 and Program 3 only
(B) Program 1 only
(C) Program 2 and Program 3 only
(D) All three programs

### Solution
- In Program 1, the local variable `x` inside `f1` shadows the global variable `x`. This is legal because they are in different scopes (block scope vs file scope). Compiles cleanly.
- In Program 2, `int y` is declared twice within the same block scope. Redefinition of an identifier in the same scope triggers a compile error.
- In Program 3, the inner `z` is declared inside a nested inner block `{ ... }`, creating a distinct inner scope that shadows the outer `z`. Compiles cleanly.

Thus, only Program 1 and Program 3 compile successfully.
Hence, (A) is correct.

## Q3
type: NAT
marks: 1
subject: programming-ds
topic: structures-and-memory
syllabus: P11.10
answer: 16
difficulty: medium

Consider the following C declaration on a 32-bit machine:

```c
struct Record {
    char code[3];
    union {
        int id;
        double salary;
    } data;
};
```

Assume:
- `char` occupies 1 byte
- `int` occupies 4 bytes (aligned to multiples of 4)
- `double` occupies 8 bytes (aligned to multiples of 8)
- The compiler inserts padding bytes to satisfy natural alignment requirements.

The value of `sizeof(struct Record)` in bytes is ________.

### Solution
1. `char code[3]` occupies 3 bytes at offsets 0, 1, 2.
2. `union data` contains:
   - `int id` (4 bytes)
   - `double salary` (8 bytes)
   The size of the union is $\max(4, 8) = 8$ bytes, and its alignment requirement is 8 bytes (the largest member alignment).
3. Therefore, `data` must start at an offset that is a multiple of 8.
   Offsets 3, 4, 5, 6, 7 (5 bytes) are inserted as padding bytes.
4. `union data` occupies offsets 8 through 15 (8 bytes).
5. The total size is 16 bytes. Because 16 is already a multiple of the largest member alignment (8 bytes), no tail padding is needed.

The size of `struct Record` is 16 bytes.

## Q4
type: MSQ
marks: 1
subject: programming-ds
topic: structures-and-memory
syllabus: P12.8
answer: A, C, D
difficulty: medium

Which of the following statements is/are **CORRECT** regarding runtime storage allocation and language features in C?

(A) Static allocation of all variable areas makes it impossible to implement recursion because multiple simultaneous activations of the same function cannot share a single fixed memory location.
(B) Dynamic memory allocation using `malloc()` is performed at compile-time by the compiler.
(C) Stack-based allocation of activation records is sufficient to support recursive procedure calls.
(D) Heap allocation is required for data structures whose lifetimes must exceed the invocation of the function that created them.

### Solution
- (A) is TRUE: Pure static allocation assigns one fixed address per function, which would overwrite local state if the function called itself recursively.
- (B) is FALSE: `malloc()` is executed dynamically at run-time by requesting memory from the operating system heap.
- (C) is TRUE: The LIFO stack allocates a new activation frame per recursive call and pops it upon return, which is sufficient for recursion without needing a heap or garbage collection.
- (D) is TRUE: Stack frames are destroyed upon function exit, so data that must persist arbitrarily across function calls must reside in heap storage.

Hence, (A), (C), and (D) are correct.

## Q5
type: MCQ
marks: 1
subject: programming-ds
topic: structures-and-memory
syllabus: P12.13
answer: A
difficulty: easy

Consider the following C declarations:

```c
typedef int* PtrA;
#define PtrB int*

PtrA p1, p2;
PtrB q1, q2;
```

Which of the following statements is **CORRECT**?

(A) `p1` and `p2` are both pointers to `int`, while `q1` is a pointer to `int` and `q2` is a regular `int`.
(B) `p1`, `p2`, `q1`, and `q2` are all pointers to `int`.
(C) `p1` is a pointer to `int` and `p2` is a regular `int`, while `q1` and `q2` are both pointers to `int`.
(D) Both `p2` and `q2` are regular `int` variables.

### Solution
- `typedef int* PtrA;` defines `PtrA` as a true type alias for `int*`. Thus, `PtrA p1, p2;` declares both `p1` and `p2` as pointers to `int` (`int *p1, *p2`).
- `#define PtrB int*` is simple textual substitution. `PtrB q1, q2;` expands blindly to `int* q1, q2;`. In C declarator syntax, `*` binds to the identifier `q1`, leaving `q2` as a regular `int`.

Hence, (A) is correct.

## Q6
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.5
answer: 15
difficulty: hard
pyq: 2018-21

Consider the following recursive C program:

```c
#include <stdio.h>

int counter = 0;

int calc(int a, int b) {
    counter++;
    if (b <= 1) return a;
    return calc(a, b / 2) + calc(a, b / 4);
}

int main() {
    calc(5, 16);
    return 0;
}
```

The final value of the global variable `counter` after executing `calc(5, 16)` is ________.

### Solution
Each invocation of `calc` increments `counter` by 1.
Let $C(b)$ denote the number of calls initiated for parameter $b$:
- For $b \le 1$: Base case hits immediately $\implies C(b) = 1$.
- For $b \ge 2$: $C(b) = 1 + C(\lfloor b / 2 \rfloor) + C(\lfloor b / 4 \rfloor)$.

Tabulating bottom-up:
- $C(0) = 1, C(1) = 1$
- $C(2) = 1 + C(1) + C(0) = 1 + 1 + 1 = 3$
- $C(4) = 1 + C(2) + C(1) = 1 + 3 + 1 = 5$
- $C(8) = 1 + C(4) + C(2) = 1 + 5 + 3 = 9$
- $C(16) = 1 + C(8) + C(4) = 1 + 9 + 5 = 15$

The final value of `counter` is 15.

## Q7
type: NAT
marks: 2
subject: programming-ds
topic: structures-and-memory
syllabus: P11.11
answer: 8
difficulty: hard
pyq: 2000-1.17

Consider the following structure declaration on a 32-bit machine:

```c
struct Packet {
    unsigned int type : 4;
    unsigned int priority : 4;
    unsigned int seq : 8;
    char code;
    short length;
};
```

Assume:
- `unsigned int` bit-fields are packed within a 4-byte `unsigned int` container.
- `char` occupies 1 byte.
- `short` occupies 2 bytes (aligned to multiples of 2).
- The compiler inserts padding to align each member to a multiple of its size, and pads the total structure size to a multiple of its largest alignment requirement (4 bytes for `unsigned int`).

The value of `sizeof(struct Packet)` in bytes is ________.

### Solution
1. **Bit-fields:**
   `type` (4 bits) + `priority` (4 bits) + `seq` (8 bits) = 16 bits total.
   Since 16 bits $\le 32$ bits, they are packed inside a single 4-byte `unsigned int` container (offsets 0, 1, 2, 3).
2. **`char code`:**
   Occupies 1 byte at offset 4.
3. **`short length`:**
   Requires alignment to a multiple of 2 bytes.
   Offset 5 is odd, so offset 5 is inserted as a padding byte.
   `length` occupies offsets 6 and 7 (2 bytes).
4. **Total size:**
   Offsets 0 through 7 are used $\implies 8$ bytes.
   The largest alignment requirement is 4 bytes (from `unsigned int`). Since 8 is a multiple of 4, no tail padding is required.

The size of `struct Packet` is 8 bytes.

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

struct Data {
    char a, b, c;
};

int main() {
    struct Data d = {'G', 'A', 'T' + 1};
    struct Data *p = &d;
    printf("%c%c", *((char*)p + 1), *((char*)p + 2));
    return 0;
}
```

What is the output printed upon execution?

(A) `AU`
(B) `AT`
(C) `'A''U'`
(D) `GA`

### Solution
- Struct `d` has three `char` members allocated contiguously in memory:
  - Offset 0: `d.a = 'G'`
  - Offset 1: `d.b = 'A'`
  - Offset 2: `d.c = 'T' + 1 = 'U'`
- `(char *)p` casts the struct pointer to a byte pointer pointing to offset 0.
- `*((char *)p + 1)` accesses the character at offset 1 $\implies 'A'$.
- `*((char *)p + 2)` accesses the character at offset 2 $\implies 'U'$.
- `%c%c` prints characters without quotes or spaces, producing `AU`.

Hence, (A) is correct.

## Q9
type: MSQ
marks: 2
subject: programming-ds
topic: structures-and-memory
syllabus: P12.4
answer: A, B, C
difficulty: medium

Consider the following functions dealing with dynamic memory and pointers in C:

```c
/* Function 1 */
int* func1() {
    int *p = (int *)malloc(sizeof(int));
    *p = 50;
    free(p);
    return p;
}

/* Function 2 */
int* func2() {
    int x = 50;
    return &x;
}

/* Function 3 */
void func3() {
    int *p = (int *)malloc(sizeof(int));
    *p = 50;
    p = NULL;
}

/* Function 4 */
void func4() {
    int *p;
    *p = 50;
}
```

Which of the following statements is/are **CORRECT**?

(A) Calling `func1()` and dereferencing its returned pointer results in dereferencing a dangling pointer.
(B) Function `func2()` returns the address of a local automatic variable whose stack frame is deallocated upon return.
(C) Function `func3()` causes a memory leak because the allocated heap memory is orphaned without being freed.
(D) Function `func4()` causes a compiler error because pointer `p` is not dynamically allocated.

### Solution
- (A) is TRUE: `func1()` frees `p` before returning its address. Any dereference of the returned pointer accesses deallocated heap memory (dangling pointer).
- (B) is TRUE: Variable `x` is local to `func2`'s stack frame. Returning `&x` returns an address whose memory is reclaimed when `func2` pops, resulting in undefined behavior if accessed.
- (C) is TRUE: `p` is overwritten with `NULL` without calling `free(p)`, so the heap block is permanently orphaned and cannot be reclaimed (memory leak).
- (D) is FALSE: `func4()` compiles without error. However, at runtime it dereferences an uninitialized (wild) pointer `p`, causing undefined behavior.

Hence, (A), (B), and (C) are correct.

## Q10
type: MCQ
marks: 2
subject: programming-ds
topic: structures-and-memory
syllabus: P12.11
answer: A
difficulty: medium

Consider the following C program:

```c
#include <stdio.h>

#define CALC_M(x, y) x + y * x

int calc_f(int x, int y) {
    return x + y * x;
}

int main() {
    int r1 = calc_f(2 + 1, 3);
    int r2 = CALC_M(2 + 1, 3);
    printf("%d %d", r1, r2);
    return 0;
}
```

What is the output printed by the program?

(A) `12 10`
(B) `12 12`
(C) `10 10`
(D) `10 12`

### Solution
1. **Function call `calc_f(2 + 1, 3)`:**
   - Arguments are evaluated before the call: $x = 2 + 1 = 3$, $y = 3$.
   - Body evaluates: $x + y \times x = 3 + 3 \times 3 = 3 + 9 = 12$.
   - Thus, $r1 = 12$.

2. **Macro invocation `CALC_M(2 + 1, 3)`:**
   - Macro performs textual substitution: `2 + 1 + 3 * 2 + 1`.
   - Multiplication `*` has higher precedence than addition `+`:
     $3 * 2 = 6$.
   - Expression becomes: $2 + 1 + 6 + 1 = 10$.
   - Thus, $r2 = 10$.

The output printed is `12 10`.
Hence, (A) is correct.
