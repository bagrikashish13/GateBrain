# Functions, Storage Classes & Recursion in C

## TL;DR
C is strictly pass-by-value; reference modification requires passing pointers (`&x` and `*p`). `static` variables live in the permanent Data Segment, initialize once (default `0`), and persist across calls and recursion. In recursive calls, winding executes before the call in forward order; unwinding executes as frames pop off the stack in reverse LIFO order.

## Core idea
- **Pass-by-Value vs Reference Simulation:**
  - In C, all arguments are passed by value: callee receives a local copy on its stack frame. Changes to that copy do not affect the caller.
  - To simulate pass-by-reference: caller passes an address (`&x`), and callee receives a pointer (`int *p`). Dereferencing (`*p = ...`) mutates the original variable in memory.
- **Storage Classes Master Table:**
  - **`auto`:** Default local variable. Stack lifetime, local scope, default value is **garbage**.
  - **`register`:** Suggests CPU register storage for fast access. **Cannot take address `&x`** (compile error!). Default value is garbage.
  - **`static`:** Allocated in the permanent **Data Segment**. Lives for the entire program runtime. Initialized to **`0`** by default. Initialization executes **only once** at startup.
  - **`extern`:** Declaration referring to a global variable defined elsewhere (allocates no memory).
- **Variable Shadowing:**
  - When a local variable has the same identifier as a global variable, the local variable takes precedence within its scope.
- **Static Variables in Recursion:**
  - A `static` variable inside a recursive function is **allocated only once** and shared across all recursive invocations.
  - Changes made to the static variable accumulate and remain intact across both winding and unwinding phases.
- **Recursion Tracing:**
  - **Winding phase:** Code before the recursive call; executes top-down on descent ($n, n-1, \dots$).
  - **Unwinding phase:** Code after the recursive call; executes bottom-up as frames return ($1, 2, \dots, n$).
  - **Tree recursion:** Functions with multiple recursive calls branch into a call tree, evaluated via in-order/pre-order traversal.

---

### 📝 Template B: Activation Stack + Static Store
Always separate permanent static state from temporary stack frames:

```text
[Static Store] (Single shared cell, persists across all calls)
x = 0 -> 1 -> 2 ...

[Call Stack] (LIFO frames)
| Frame 3: f(1) -> waiting for child return |
| Frame 2: f(2) -> waiting for child return |
| Frame 1: f(3) -> waiting for child return |
```

## Where I got confused → what made it click
- **Static variable during unwinding:**
  - *Confusion:* Believing a static variable rolls back its value as recursive stack frames pop off.
  - *The click:* Static variables do NOT live on the stack. They live in permanent global memory. Any increment persists, so every returning frame sees the latest accumulated value!
- **Unwinding output order:**
  - *Confusion:* Expecting statements after the recursive call to print in descending order ($3, 2, 1$).
  - *The click:* Calls dive to the base case first. Then, as each stack frame pops off (LIFO), lines after the recursive call execute, producing reverse order ($1, 2, 3$).

## GATE traps
- **Address of Register Variable:**
  - `register int r; int *p = &r;` produces an immediate **Compile Error** because CPU registers have no memory addresses.
- **Repeated Static Initialization:**
  - `static int count = 5;` is executed only once by the runtime system. It is skipped on all subsequent entries into the function.
- **Global Shadowing:**
  - If a function declares `int x;`, any reference to `x` inside that function refers exclusively to the local variable; the global `x` is inaccessible by direct name.

## Example
**GATE CSE 2015 Set 1:**
```c
#include <stdio.h>

int f(int n) {
    static int i = 1;
    if (n >= 5)
        return n;
    n = n + i;
    i++;
    return f(n);
}

int main() {
    printf("%d", f(1));
    return 0;
}
```

**Trace via Template B:**
- **f(1):** `i = 1`. $n = 1 + 1 = 2$, $i$ increments to $2 \rightarrow$ calls `f(2)`.
- **f(2):** `i = 2`. $n = 2 + 2 = 4$, $i$ increments to $3 \rightarrow$ calls `f(4)`.
- **f(4):** `i = 3`. $n = 4 + 3 = 7$, $i$ increments to $4 \rightarrow$ calls `f(7)`.
- **f(7):** `n >= 5` ($7 \ge 5$) is **TRUE** $\rightarrow$ returns **`7`**.
- Return value `7` propagates all the way up the stack. Output: **`7`**.
