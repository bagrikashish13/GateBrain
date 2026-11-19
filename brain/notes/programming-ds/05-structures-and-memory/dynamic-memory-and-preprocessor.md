# Dynamic Memory & Preprocessor

## TL;DR
- `malloc(n)` allocates $n$ uninitialized heap bytes (returns `NULL` on failure, never stack pointer). `calloc(n, sz)` zeroes memory; `realloc(p, sz)` resizes; `free(p)` releases heap memory.
- `free(p)` deallocates heap memory, but `p` does **not** become `NULL` (it becomes a dangling pointer). Passing an offset pointer like `p + 1` or freeing twice is **undefined behavior**.
- Macros (`#define`) perform literal text substitution before compilation. Function calls evaluate arguments **once** before entry; macros re-evaluate argument expressions every time they appear in the expansion!

## Core idea

### 1. Runtime Memory Segments
| Segment | Contents | Lifetime | Managed By |
|---|---|---|---|
| **Stack** | Activation records, local automatic variables, return addresses | Function call to return | Automatic (CPU / compiler) |
| **Heap** | Dynamic memory allocated by `malloc`, `calloc`, `realloc` | Until explicitly freed by `free()` | Programmer |
| **Data / BSS** | Global variables, static variables (`static int x`) | Entire program duration | Program loader |
| **Text (Code)** | Compiled machine instructions (read-only) | Entire program duration | OS |

### 2. Common Pointer Errors
- **Dangling pointer:** Pointer referencing deallocated memory (e.g. `free(p); *p = 10;` or returning address of local stack variable `&x`).
- **Memory leak:** Heap block losing all accessible pointers without being freed (e.g. `p = malloc(10); p = NULL;`).
- **Wild pointer:** Pointer declared but uninitialized (`int *p; *p = 10;`).

### 3. Preprocessor Macros vs Functions
- **Argument side-effects:** In `MAX(++x, y)`, if expanded to `((++x) > (y) ? (++x) : (y))`, `++x` evaluates in the condition and again in the chosen branch.
- **Ternary sequence point:** In `cond ? expr1 : expr2`, there is a sequence point after `cond`. Only the selected branch is evaluated.
- **Pre-increment vs Post-increment:** `++x` increments first and yields the new value; `x++` yields the old value and then increments.

## Where I got confused → what made it click
- **Pre-increment inside macro branches:**
  - *Confusion:* Thinking `(++s)` returns the old value and increments afterwards.
  - *The click:* `++s` is **pre-increment**. It increments immediately, so the expression evaluates to the **incremented** value!
- **Function call vs Macro evaluation:**
  - *Confusion:* Thinking `++x` inside a function call like `f(++x)` evaluates multiple times if `f` uses its argument twice.
  - *The click:* Functions evaluate arguments **eagerly exactly once** before passing by value. Only preprocessor text substitution duplicates argument evaluation.
- **`malloc()` failure return value:**
  - *Confusion:* Thinking `malloc` returns a pointer to the stack if heap is exhausted.
  - *The click:* `malloc()` returns `NULL` on failure, never a stack address.

## GATE traps
- **Macro Arguments with Side-Effects (`++`):**
  - If a macro parameter appears multiple times, any side-effecting expression passed (like `++x` or `i++`) runs multiple times.
- **Multi-statement Macro in `if` without braces:**
  - `#define FOO(x) a = x; b = x;` inside `if (cond) FOO(5);` expands to `if (cond) a = 5; b = 5;`. The second statement runs unconditionally!
- **`free()` on Offset Pointer:**
  - `p = malloc(10); free(p + 1);` is **undefined behavior**. You must pass the exact base pointer returned by allocation.
- **Returning Address of Local Variable:**
  - A function returning `&local_var` returns an address whose activation record is reclaimed on return $\implies$ dangling pointer.

## Example
**GATE IT 2008 (Q50):**
```c
#include <stdio.h>
#define swap1(a, b) tmp = a; a = b; b = tmp
void swap2(int a, int b) { int tmp; tmp = a; a = b; b = tmp; }
void swap3(int *a, int *b) { int tmp; tmp = *a; *a = *b; *b = tmp; }

int main() {
    int num1 = 5, num2 = 4, tmp;
    if (num1 < num2) swap1(num1, num2);
    if (num1 < num2) swap2(num1 + 1, num2);
    if (num1 >= num2) swap3(&num1, &num2);
    printf("%d, %d", num1, num2);
    return 0;
}
```
**Output:** `4, 5`. `swap1` without braces inside `if` would execute un-guarded statements, but condition $5 < 4$ is false, while `swap3` correctly swaps through pointers!
