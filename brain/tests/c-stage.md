---
test: c-stage
title: "C Programming · Stage Test"
duration: 60
marks: 30
pass: 65%
---

# C Programming · Stage Test

## Q1
type: MCQ
marks: 1
subject: programming-ds
topic: types-and-operators
syllabus: P01.5
answer: B
difficulty: easy

Consider the following program snippet:

```c
int a = -5;
unsigned int b = 4;
if (a + b > 0)
    puts("TRUE");
else
    puts("FALSE");
```

What does this snippet print?

(A) FALSE  
(B) TRUE  
(C) Compilation error  
(D) Undefined behavior  

### Solution
In C, when a binary arithmetic operator operates on an `int` and an `unsigned int`, the `int` operand undergoes usual arithmetic conversion to `unsigned int`.  
Here, $a + b$ evaluates $-5 + 4 = -1$. Converted to `unsigned int`, $-1$ becomes `UINT_MAX` (e.g. $2^{32} - 1$ on a 32-bit machine).  
Since `UINT_MAX > 0` is true, the condition evaluates to true.  
The program prints `TRUE`.  
Hence, (B) is correct.

## Q2
type: MCQ
marks: 1
subject: programming-ds
topic: types-and-operators
syllabus: P02.3
answer: A
difficulty: easy

What is the resulting value of integer variable `res` after the following declaration is evaluated?

```c
int x = 10, y = 20, z = 30;
int res = x < y < z;
```

(A) 1  
(B) 0  
(C) 30  
(D) Compilation error  

### Solution
In C, relational operator `<` associates strictly from left to right:
$$x < y < z \iff (x < y) < z$$
1. `x < y` evaluates `10 < 20`, which is true, producing integer `1`.
2. The expression simplifies to `1 < z`, which is `1 < 30`. This is also true, producing integer `1`.  
Thus `res` is assigned `1`.  
Hence, (A) is correct.

## Q3
type: MSQ
marks: 1
subject: programming-ds
topic: types-and-operators
syllabus: P03.12
answer: A, B, C
difficulty: medium

Let `val` be an unsigned integer variable (`unsigned int val`).  
Which of the following statements is/are TRUE in C?

(A) The expression `val & (val - 1)` clears (sets to 0) the least significant 1-bit of `val`.  
(B) The expression `(val > 0) && ((val & (val - 1)) == 0)` evaluates to 1 if and only if `val` is an exact power of 2.  
(C) The expression `val ^ val` evaluates to 0 for every value of `val`.  
(D) The expression `~val` is arithmetic negation and is always equal to `-val`.  

### Solution
- (A) True: Subtracting 1 flips the rightmost set bit and all trailing 0-bits. Bitwise AND with `val` zeroes that bit while leaving all higher bits intact.
- (B) True: A positive integer is a power of 2 if and only if its binary representation has exactly one set bit. Clearing that single set bit yields 0.
- (C) True: In bitwise XOR, any bit XORed with itself is 0 ($b \oplus b = 0$). Hence `val ^ val` is always 0.
- (D) False: In two's complement, bitwise NOT `~val` equals `-val - 1`. Arithmetic negation is `-val = ~val + 1`.

Hence, (A), (B), and (C) are correct.

## Q4
type: MCQ
marks: 1
subject: programming-ds
topic: control-flow
syllabus: P04.5
answer: C
difficulty: easy

Consider the following conditional assignment:

```c
if (flag) {
    target = first;
} else {
    target = second;
}
```

Which of the following single expressions produces the exact same result for `target` across all integer values of `flag`?

(A) `target = (!flag) ? first : second;`  
(B) `target = flag ? second : first;`  
(C) `target = flag ? first : second;`  
(D) `target = (flag == 0) ? first : second;`  

### Solution
- The conditional ternary operator `cond ? val1 : val2` evaluates `val1` when `cond` is non-zero (true) and `val2` when `cond` is zero (false).
- This matches `if (flag) target = first; else target = second;`.
- Options (A) and (D) invert the condition, assigning `first` when `flag` is false.
- Option (B) swaps the true and false expressions.

Hence, (C) is correct.

## Q5
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P05.11
answer: C
difficulty: medium

Consider the following C code:

```c
#include <stdio.h>

int count = 10;

void inspect() {
    int count = 20;
    {
        int count = 30;
        count += 5;
    }
    printf("%d ", count);
}

int main() {
    inspect();
    printf("%d", count);
    return 0;
}
```

What is the output printed by this program?

(A) 35 10  
(B) 20 20  
(C) 20 10  
(D) 35 20  

### Solution
In C, block scope allows inner declarations to shadow outer declarations of the same identifier:
1. Inside `inspect`, local `count = 20` shadows the global `count = 10`.
2. Inside the inner block `{ int count = 30; count += 5; }`, block-local `count` shadows `inspect`'s `count`. It becomes 35 and goes out of scope when the block closes.
3. The `printf("%d ", count);` inside `inspect` accesses `inspect`'s local variable, which is `20`.
4. In `main`, `printf("%d", count);` accesses the global variable `count`, which is `10`.

The output is `20 10`.  
Hence, (C) is correct.

## Q6
type: MCQ
marks: 1
subject: programming-ds
topic: program-reasoning
syllabus: P13.8
answer: D
difficulty: medium

Consider the following loop computing $2^n$ for non-negative integer $n$:

```c
int p = 1, i = 0;
while (i < n) {
    p = p * 2;
    i = i + 1;
}
```

Which of the following assertions is a valid **loop invariant** that holds before the loop and after every iteration?

(A) $p = 2^n \land i \le n$  
(B) $p = 2i \land i \le n$  
(C) $p = 2^{i+1} \land i < n$  
(D) $p = 2^i \land i \le n$  

### Solution
- **Initialization (before loop):** $p = 1, i = 0$. Since $2^0 = 1$ and $0 \le n$, the assertion $p = 2^i \land i \le n$ holds true. (Options A, B, and C evaluate to false at step 0).
- **Maintenance:** If $p = 2^i$ and $i < n$ at the start of an iteration, then after `p = p * 2` and `i = i + 1`, we have $p_{\text{new}} = 2^{i+1} = 2^{i_{\text{new}}}$, and $i_{\text{new}} = i + 1 \le n$. The assertion is preserved!
- **Termination:** When the loop exits ($i = n$), $p = 2^i = 2^n$, confirming the postcondition.

Hence, (D) is correct.

## Q7
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P10.4
answer: B
difficulty: medium

Consider the following C function and caller:

```c
void exchange(int *p, int *q) {
    int *temp = p;
    p = q;
    q = temp;
}

int main() {
    int u = 10, v = 20;
    exchange(&u, &v);
    printf("%d %d", u, v);
    return 0;
}
```

What is the output printed by `main`?

(A) 20 10  
(B) 10 20  
(C) 10 10  
(D) 20 20  

### Solution
In C, all function arguments are passed strictly by value:
- `exchange` receives copies of the pointer values `&u` and `&v` in its local parameters `p` and `q`.
- `exchange` swaps its own local pointers `p` and `q`.
- No dereference assignment (`*p` or `*q`) is performed, so the contents of memory locations `u` and `v` in `main` are untouched.  
Thus, `u` remains 10 and `v` remains 20.  
Hence, (B) is correct.

## Q8
type: MSQ
marks: 1
subject: programming-ds
topic: structures-and-memory
syllabus: P11.7
answer: A, B, C
difficulty: medium

Consider the following structure declaration in C:

```c
struct Record {
    int id;
    int score;
};
```

Which of the following statements is/are TRUE?

(A) The declaration `struct Record { int id; int score; };` creates a type definition but does not allocate storage for `id` or `score`.  
(B) On a system where `sizeof(int) == 4` with 4-byte natural alignment, `sizeof(struct Record)` is 8 bytes.  
(C) A structure cannot contain an instance of itself as a direct member, but it can contain a pointer to an instance of its own type.  
(D) In C, two structure variables `struct Record r1, r2;` can be compared for equality directly using `if (r1 == r2)`.  

### Solution
- (A) True: A struct declaration defines a type template; memory is only reserved when a variable of that struct type is defined.
- (B) True: `sizeof(int) == 4`, and `struct Record` contains two integers: `id` at offset 0 and `score` at offset 4. Total size is $4 + 4 = 8$ bytes, with zero padding.
- (C) True: Including `struct Record r;` inside `struct Record` would require infinite recursive size (incomplete type error). However, `struct Record *next;` is valid because pointer sizes are fixed and known.
- (D) False: C does not provide built-in equality comparison (`==` or `!=`) for structures; attempting to compare them directly results in a compilation error.

Hence, (A), (B), and (C) are correct.

## Q9
type: NAT
marks: 1
subject: programming-ds
topic: arrays-and-pointers
syllabus: P07.6
answer: 14
difficulty: medium

Consider the following program:

```c
#include <stdio.h>

int main() {
    int matrix[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    int *p = &matrix[0][0];
    int val = *(*(matrix + 1) + 2) + *(p + 7);
    printf("%d", val);
    return 0;
}
```

What is the value printed by the program?

### Solution
1. `*(*(matrix + 1) + 2)`:
   - `matrix + 1` points to row 1.
   - `*(matrix + 1)` decays to a pointer to `matrix[1][0]`.
   - `*(matrix + 1) + 2` points to `matrix[1][2]`.
   - Dereferencing gives `matrix[1][2] = 6`.
2. `*(p + 7)`:
   - In C, 2D arrays are stored in contiguous row-major order:
     indices $0 \dots 8$ map to:
     `{1, 2, 3, 4, 5, 6, 7, 8, 9}`
   - Index 7 maps to row $7 / 3 = 2$, column $7 \% 3 = 1$, which is `matrix[2][1] = 8`.
3. Total sum:
   $$\text{val} = 6 + 8 = \mathbf{14}$$

Hence, the answer is 14.

## Q10
type: NAT
marks: 1
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.19
answer: 5
difficulty: medium

Consider the following recursive function:

```c
void traverse(int n) {
    if (n <= 1)
        return;
    traverse(n - 1);
    traverse(n - 2);
}
```

Assume `main()` calls `traverse(5)`.  
What is the **maximum number of stack frames for `traverse`** simultaneously present on the call stack at any instant during execution (excluding `main`)?

### Solution
The maximum call stack depth corresponds to the longest path in the recursion tree.  
Because `traverse(n - 1)` is invoked first, execution drives down the left branch:
1. `traverse(5)` (depth 1)
2. `traverse(4)` (depth 2)
3. `traverse(3)` (depth 3)
4. `traverse(2)` (depth 4)
5. `traverse(1)` (depth 5)

At `traverse(1)`, the base case `n <= 1` is reached with all 5 frames active simultaneously on the stack:
$$\text{traverse}(5), \text{traverse}(4), \text{traverse}(3), \text{traverse}(2), \text{traverse}(1)$$
When `traverse(1)` returns, frames pop before other branches execute. The maximum depth is never greater than 5.  
Hence, the answer is 5.

## Q11
type: MCQ
marks: 2
subject: programming-ds
topic: arrays-and-pointers
syllabus: P06.19
answer: D
difficulty: medium

Consider the following C program:

```c
#include <stdio.h>

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int *ptr = arr;
    int x = *ptr++;
    int y = ++*ptr;
    int z = *++ptr;
    printf("%d %d %d", x, y, z);
    return 0;
}
```

What is the output printed by the program?

(A) 10 20 30  
(B) 20 21 40  
(C) 10 21 40  
(D) 10 21 30  

### Solution
Let us trace using pointer navigation:
1. `ptr = arr` points to `arr[0]` (10).
2. `x = *ptr++;`: Postfix `++` has higher precedence than `*`.  
   - `ptr++` evaluates to current pointer (`&arr[0]`), and advances `ptr` to `&arr[1]`.
   - `*` dereferences the old address: `x = 10`.
   - `ptr` now points to `arr[1]` (20).
3. `y = ++*ptr;`: Prefix `++` and `*` associate right-to-left.  
   - `*ptr` accesses `arr[1]`. Prefix `++` increments `arr[1]` in place from 20 to 21 and evaluates to 21.
   - `y = 21`. `ptr` still points to `arr[1]`.
4. `z = *++ptr;`: Prefix `++ptr` advances `ptr` to point to `arr[2]`.  
   - `*` dereferences it: `z = arr[2] = 30`.

The printed output is `10 21 30`.  
Hence, (D) is correct.

## Q12
type: MSQ
marks: 2
subject: programming-ds
topic: strings
syllabus: P08.12
answer: A, B, C
difficulty: medium

Consider the following implementation of a string copy routine:

```c
void my_strcpy(char *dest, const char *src) {
    int i = 0;
    while (src[i] != '\0') {
        dest[i] = src[i];
        i++;
    }
}
```

Which of the following statements is/are TRUE about this implementation?

(A) The function fails to append the null terminator `'\0'` to `dest`.  
(B) If `src` is an empty string `""`, `my_strcpy` does not write any character to `dest`.  
(C) Passing `dest` to standard functions like `strlen(dest)` or `printf("%s", dest)` after `my_strcpy` results in undefined behavior if `dest` was not previously zero-initialized.  
(D) The `while` loop condition causes a buffer overrun by reading past the null terminator of `src`.  

### Solution
- (A) True: The loop condition `src[i] != '\0'` terminates as soon as the null terminator of `src` is reached. The function exits without writing `dest[i] = '\0'`.
- (B) True: For `src = ""`, `src[0] == '\0'`, so the loop body executes 0 times and no write to `dest` occurs.
- (C) True: Without a null terminator, functions like `strlen()` and `printf("%s")` continue reading memory until encountering an arbitrary `\0` in memory, causing out-of-bounds reads and undefined behavior.
- (D) False: The loop condition stops precisely at the null terminator; it never accesses `src` beyond its terminating byte.

Hence, (A), (B), and (C) are correct.

## Q13
type: MCQ
marks: 2
subject: programming-ds
topic: structures-and-memory
syllabus: P12.11
answer: C
difficulty: medium

Consider the following program comparing a macro with a function:

```c
#include <stdio.h>

#define MULT_M(x, y) x * y

int mult_f(int x, int y) {
    return x * y;
}

int main() {
    int p = MULT_M(2 + 3, 3 + 4);
    int q = mult_f(2 + 3, 3 + 4);
    printf("%d", q - p);
    return 0;
}
```

What is the output printed by the program?

(A) 0  
(B) 10  
(C) 20  
(D) 35  

### Solution
1. `MULT_M(2 + 3, 3 + 4)` undergoes text substitution without parentheses:
   $$p = 2 + 3 * 3 + 4$$
   Because multiplication has higher precedence than addition:
   $$p = 2 + (3 * 3) + 4 = 2 + 9 + 4 = 15$$
2. `mult_f(2 + 3, 3 + 4)` is a function call. Arguments are evaluated eagerly before the call:
   $$q = \text{mult\_f}(5, 7) = 5 \times 7 = 35$$
3. The difference printed is:
   $$q - p = 35 - 15 = \mathbf{20}$$

Hence, (C) is correct.

## Q14
type: MCQ
marks: 2
subject: programming-ds
topic: structures-and-memory
syllabus: P12.5
answer: B
difficulty: medium

Consider the following C function:

```c
#include <stdlib.h>

int global_counter = 100;

void process_request(int n) {
    static int cache_hits = 0;
    int local_buf = n * 2;
    int *dyn_mem = (int *)malloc(sizeof(int) * n);
    // ...
}
```

In the standard C runtime memory layout, in which segments are `cache_hits`, `local_buf`, and the dynamic block allocated by `malloc` stored respectively?

(A) Stack, Data segment, Heap  
(B) Data segment, Stack, Heap  
(C) Data segment, Heap, Stack  
(D) Stack, Stack, Heap  

### Solution
- `cache_hits` is a local `static` variable: it has static storage duration that persists across function calls and is placed in the **Data segment** (Static Store).
- `local_buf` is an automatic variable local to `process_request`: it is allocated on the function's activation frame on the **Stack**.
- The dynamic memory block allocated via `malloc` resides on the **Heap** (the pointer `dyn_mem` itself is on the Stack, but it points to the Heap).

Therefore, the segments are Data segment, Stack, and Heap respectively.  
Hence, (B) is correct.

## Q15
type: NAT
marks: 2
subject: programming-ds
topic: structures-and-memory
syllabus: P11.10
answer: 24
difficulty: medium

Consider the following C declarations on a 64-bit architecture with natural alignment (`char`: 1 byte, `short`: 2 bytes with 2-byte alignment, `int`: 4 bytes with 4-byte alignment, `double`: 8 bytes with 8-byte alignment):

```c
union U {
    char c;
    int i;
    short s[3];
};

struct S {
    char a;
    union U u;
    double d;
};
```

What is `sizeof(struct S)` in bytes?

### Solution
1. **Size and alignment of `union U`:**
   - Members: `char c` (1 B), `int i` (4 B, align 4), `short s[3]` (6 B, align 2).
   - Alignment of `union U` is $\max(1, 4, 2) = 4$ bytes.
   - Size must be at least 6 bytes and a multiple of 4 bytes. Smallest multiple of 4 that is $\ge 6$ is **8 bytes**.  
   `sizeof(union U) = 8`, `alignof(union U) = 4`.

2. **Layout of `struct S`:**
   - `char a`: size 1 byte at offset 0.
   - `union U u`: alignment is 4 bytes. Next offset multiple of 4 is offset 4 (3 padding bytes at offsets 1, 2, 3).  
     `u` occupies offsets 4 to 11 (8 bytes).
   - `double d`: alignment is 8 bytes. Next offset multiple of 8 is offset 16 (4 padding bytes at offsets 12, 13, 14, 15).  
     `d` occupies offsets 16 to 23 (8 bytes).
   - Total current size = 24 bytes.
   - Alignment of `struct S` is $\max(1, 4, 8) = 8$ bytes.
   - 24 is already an exact multiple of 8, so 0 trailing padding bytes are required.

Total `sizeof(struct S)` = **24** bytes.  
Hence, the answer is 24.

## Q16
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.20
answer: 63
difficulty: medium

Consider the following recursive program for the Towers of Hanoi puzzle:

```c
#include <stdio.h>

int moves = 0;

void hanoi(int n, char from, char to, char aux) {
    if (n == 0)
        return;
    hanoi(n - 1, from, aux, to);
    moves++;
    hanoi(n - 1, aux, to, from);
}

int main() {
    hanoi(6, 'A', 'B', 'C');
    printf("%d", moves);
    return 0;
}
```

What is the output printed by the program?

### Solution
The recurrence relation for the number of moves `moves` in `hanoi(n)` is:
$$M(0) = 0$$
$$M(n) = 2 \times M(n - 1) + 1 \quad \text{for } n \ge 1$$
Solving this recurrence:
- $M(1) = 2(0) + 1 = 1 = 2^1 - 1$
- $M(2) = 2(1) + 1 = 3 = 2^2 - 1$
- $M(3) = 2(3) + 1 = 7 = 2^3 - 1$
- In general, $M(n) = 2^n - 1$.

For $n = 6$:
$$M(6) = 2^6 - 1 = 64 - 1 = \mathbf{63}$$

Hence, the answer is 63.

## Q17
type: NAT
marks: 2
subject: programming-ds
topic: program-reasoning
syllabus: P13.2
answer: 3
difficulty: hard
pyq: 2020-48

Consider the following C function:

```c
int solve(int base, int exp, int mod) {
    int result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 == 1)
            result = (result * base) % mod;
        base = (base * base) % mod;
        exp = exp / 2;
    }
    return result;
}
```

What is the value returned by the call `solve(3, 13, 7)`?

### Solution
This function computes modular exponentiation $\text{base}^{\text{exp}} \bmod \text{mod}$, i.e., $3^{13} \bmod 7$, via repeated squaring (binary exponentiation).  
The binary representation of $13$ is $1101_2$ ($8 + 4 + 1$).

Tracing through the loop:
- Initial: `result = 1`, `base = 3 % 7 = 3`, `exp = 13`.
- **Iteration 1:** `exp = 13` (odd)
  - `result = (1 * 3) % 7 = 3`
  - `base = (3 * 3) % 7 = 9 % 7 = 2`
  - `exp = 13 / 2 = 6`
- **Iteration 2:** `exp = 6` (even)
  - `result` remains 3
  - `base = (2 * 2) % 7 = 4`
  - `exp = 6 / 2 = 3`
- **Iteration 3:** `exp = 3` (odd)
  - `result = (3 * 4) % 7 = 12 % 7 = 5`
  - `base = (4 * 4) % 7 = 16 % 7 = 2`
  - `exp = 3 / 2 = 1`
- **Iteration 4:** `exp = 1` (odd)
  - `result = (5 * 2) % 7 = 10 % 7 = 3`
  - `base = (2 * 2) % 7 = 4`
  - `exp = 1 / 2 = 0`

The loop terminates when `exp == 0`, returning `3`.  
*(Verification by Fermat's Little Theorem: Since 7 is prime, $3^6 \equiv 1 \pmod 7$. Thus $3^{13} = (3^6)^2 \times 3^1 \equiv 1^2 \times 3 \equiv 3 \pmod 7$).*

Hence, the answer is 3.

## Q18
type: NAT
marks: 2
subject: programming-ds
topic: structures-and-memory
syllabus: P12.6
answer: 30
difficulty: hard
pyq: 2021s2-35

Consider the following C program:

```c
#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *next;
};

int main() {
    struct Node *head = NULL, *tail = NULL;
    for (int i = 1; i <= 4; i++) {
        struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));
        newNode->data = i * 10;
        newNode->next = NULL;
        if (head == NULL) {
            head = newNode;
            tail = newNode;
        } else {
            tail->next = newNode;
            tail = newNode;
        }
    }
    
    int sum = 0;
    struct Node *curr = head;
    while (curr != NULL && curr->next != NULL) {
        sum += curr->next->data - curr->data;
        curr = curr->next;
    }
    printf("%d", sum);
    return 0;
}
```

What is the output printed by the program?

### Solution
1. **Creation phase:**
   The `for` loop dynamically allocates 4 nodes chained via `next`:
   - Node 1: `data = 10`
   - Node 2: `data = 20`
   - Node 3: `data = 30`
   - Node 4: `data = 40`, `next = NULL`
   `head` points to Node 1.

2. **Traversal and summation:**
   The loop continues while `curr != NULL && curr->next != NULL`:
   - Step 1: `curr` is Node 1 (`10`), `curr->next` is Node 2 (`20`):  
     `sum += 20 - 10 = 10`. `curr` becomes Node 2.
   - Step 2: `curr` is Node 2 (`20`), `curr->next` is Node 3 (`30`):  
     `sum += 30 - 20 = 10`. `curr` becomes Node 3.
   - Step 3: `curr` is Node 3 (`30`), `curr->next` is Node 4 (`40`):  
     `sum += 40 - 30 = 10`. `curr` becomes Node 4.
   - Step 4: `curr` is Node 4 (`40`), `curr->next` is `NULL`. Loop terminates.

This is a telescoping sum:
$$\text{sum} = (20 - 10) + (30 - 20) + (40 - 30) = 40 - 10 = \mathbf{30}$$

Hence, the answer is 30.

## Q19
type: MCQ
marks: 2
subject: programming-ds
topic: structures-and-memory
syllabus: P11.6
answer: C
difficulty: hard
pyq: 2018-2

Consider the following C program:

```c
#include <stdio.h>

struct Packet {
    char hdr[3];
    char id;
};

int main() {
    struct Packet pkts[] = {
        {{'A', 'B', 'C'}, '1'},
        {{'D', 'E', 'F'}, '2'},
        {{'G', 'H', 'I'}, '3'}
    };

    struct Packet *p = pkts;
    p++;
    char ch1 = *((char *)p + 1);
    char ch2 = *((char *)p + 3);
    printf("%c%c", ch1, ch2);
    return 0;
}
```

What is the output printed by the program?

(A) D1  
(B) F2  
(C) E2  
(D) E1  

### Solution
1. `struct Packet` consists of `char hdr[3]` (3 bytes) and `char id` (1 byte).  
   Since all members are `char` (alignment 1 byte), there is **zero padding** inside `struct Packet` or at the end.  
   `sizeof(struct Packet) = 4` bytes.
2. `pkts` is an array of 3 `struct Packet` objects laid out contiguously in memory:
   - `pkts[0]`: `{'A', 'B', 'C', '1'}` (bytes 0, 1, 2, 3)
   - `pkts[1]`: `{'D', 'E', 'F', '2'}` (bytes 4, 5, 6, 7)
   - `pkts[2]`: `{'G', 'H', 'I', '3'}` (bytes 8, 9, 10, 11)
3. `p = pkts; p++;` advances pointer `p` by `sizeof(struct Packet)` to point to `pkts[1]`.
4. `(char *)p` casts `p` to a character pointer pointing to the first byte of `pkts[1]` (which contains `'D'`).
5. Pointer scaling with `char *`:
   - `*((char *)p + 1)` accesses byte at offset 1 from `pkts[1]`, which is `pkts[1].hdr[1] = 'E'`. Thus `ch1 = 'E'`.
   - `*((char *)p + 3)` accesses byte at offset 3 from `pkts[1]`, which is `pkts[1].id = '2'`. Thus `ch2 = '2'`.

The program prints `E2`.  
Hence, (C) is correct.

## Q20
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
syllabus: P09.5
answer: 12
difficulty: hard
pyq: 2016s2-37

Consider the following recursive program:

```c
#include <stdio.h>

int fun(int arr[], int n) {
    if (n == 1)
        return arr[0];
    int sub = fun(arr + 1, n - 1);
    return (arr[0] > sub) ? (arr[0] - sub) : (sub - arr[0]);
}

int main() {
    int a[] = {12, 5, 8, 3};
    printf("%d", fun(a, 4));
    return 0;
}
```

What is the output printed by the program?

### Solution
Let us trace the unwinding phase of the recursion:
1. `fun(a, 4)` calls `fun(a + 1, 3)` with `arr[0] = 12`.
2. `fun(a + 1, 3)` calls `fun(a + 2, 2)` with `arr[0] = 5`.
3. `fun(a + 2, 2)` calls `fun(a + 3, 1)` with `arr[0] = 8`.
4. `fun(a + 3, 1)`: Base case reached since $n == 1$.  
   Returns `arr[0] = a[3] = 3`.

Now unwinding up the Activation Stack:
- In `fun(a + 2, 2)`: `arr[0] = 8`, `sub = 3`.  
  Returns $|8 - 3| = \mathbf{5}$.
- In `fun(a + 1, 3)`: `arr[0] = 5`, `sub = 5`.  
  Returns $|5 - 5| = \mathbf{0}$.
- In `fun(a, 4)`: `arr[0] = 12`, `sub = 0`.  
  Returns $|12 - 0| = \mathbf{12}$.

The final value returned and printed is **12**.  
Hence, the answer is 12.
