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
- **Parameter Passing Mechanisms (Other Languages / GATE Pseudo-code):**
  - **Call by Value:** Callee receives local copies. Caller unaffected.
  - **Call by Reference:** Parameter is an **alias (direct memory reference)** for the caller's variable. Changes affect caller in real time. Aliasing happens when two parameters bind to the same variable (`f(a, a)`).
  - **Call by Value-Result (Copy-Restore):** Copy-in at call $\rightarrow$ compute on private local variables $\rightarrow$ copy-out back to caller's arguments at return (left-to-right).
  - **Call by Name:** Argument expression is literally substituted into the function body and **re-evaluated in caller's context every single time it is accessed**.
- **Scoping & Runtime Links:**
  - **Static (Lexical) Scoping:** Non-local variable resolves to enclosing scope where function was **written**. **Access Link (Static Link)** points to the activation record of the static parent procedure.
  - **Dynamic Scoping:** Non-local variable resolves to most recent active caller on the **call stack**. **Control Link (Dynamic Link)** points to caller's activation record.
- **Recursion Tracing & Shortcuts:**
  - **Winding phase:** Code before the recursive call; executes top-down on descent ($n, n-1, \dots$).
  - **Unwinding phase:** Code after the recursive call; executes bottom-up as frames return ($1, 2, \dots, n$).
  - **Bottom-Up Tabulation (The Anti-Tree Shortcut):** Never draw sprawling call trees for branching recursion (`f(n-1) + 2*f(n-2)` or nested loops). Build a 1-line or 2D scratch table starting from base cases ($f(0), f(1), f(2)\dots$).
  - **Call Counting Recurrence:** Total calls $C(n) = 1 + \sum C(\text{children})$ with $C(\text{base}) = 1$. Total invocations $\ne$ peak stack depth!
  - **Tail Recursion:** If the recursive call is the very last operation with zero pending work, compiler reuses the stack frame as an iterative loop ($O(1)$ space).
  - **Mutual Recursion:** When functions call each other, maintain a separate column per function to trace alternating frames.

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
- **Missing prototype when definition is below (Top-to-Bottom single pass):**
  - *Confusion:* Assuming the compiler scans ahead to find the definition below `main`, or misreading code without noticing a removed prototype.
  - *The click:* C compiles strictly top-to-bottom. If a prototype is missing, it assumes the function returns `int`. When it later hits `float func(...)` below, the types clash $\rightarrow$ instant **conflicting types compilation error**!
- **Static variable during unwinding:**
  - *Confusion:* Believing a static variable rolls back its value as recursive stack frames pop off.
  - *The click:* Static variables do NOT live on the stack. They live in permanent global memory. Any increment persists, so every returning frame sees the latest accumulated value!
- **Unwinding output order:**
  - *Confusion:* Expecting statements after the recursive call to print in descending order ($3, 2, 1$).
  - *The click:* Calls dive to the base case first. Then, as each stack frame pops off (LIFO), lines after the recursive call execute, producing reverse order ($1, 2, 3$).
- **Abnormal Termination vs Infinite Loop:**
  - *Confusion:* Assuming any non-halting recursive code is just an "infinite loop".
  - *The click:* If a function calls itself infinitely without returning (like `f(val--)`), stack frames keep piling up until memory runs out $\implies$ **Stack Overflow $\implies$ Abnormal Termination (OS crash/SIGSEGV)**. An **Infinite Loop** occurs when a loop spins forever with constant, bounded stack space (calls return and pop cleanly).
- **Branching Recursion Expansion Overwhelm:**
  - *Confusion:* Drawing huge call trees for problems like `fun(5)` with nested loops or 2D transitions (`f(x, y)`), leading to lost branches and arithmetic slips.
  - *The click:* Work **bottom-up**! A 1-line or 2D table computed from $0, 1, 2\dots$ turns a 40-node tree into 30 seconds of simple addition.
- **Accumulator Initialization in Recursive Loop Tabulation:**
  - *Confusion:* In `ans = 1; for (j=1; j<n; j++) ans += ...`, tabulating only the sum of loop terms and forgetting to add the initial `ans = 1`.
  - *The click:* Always write down the initial value of the accumulator *before* evaluating loop iterations: `ans(n) = initial_val + sum_of_terms`. A slip at $n = 2$ cascades and ruins all subsequent terms.
- **Counting Frames for Call Stack Limits (Fencepost Error):**
  - *Confusion:* Computing $\text{frames} = n / \text{step}$ and missing the base-case frame.
  - *The click:* The base-case invocation (e.g. `fun(0)`) is also pushed onto the stack before returning! Peak stack depth is $\frac{n - \text{base}}{\text{step}} + 1$. For 32 frames with step 2 down to 0: $\frac{n}{2} + 1 = 32 \implies n = 62$, not 64.
- **Aliasing in Call by Reference:**
  - *Confusion:* Assuming a global variable and a parameter binding to it can hold different values during execution.
  - *The click:* In `procedure f(x, y)` called via `f(i, j)`, `x` IS `i`. If `x = 10` executes, `i` becomes 10 immediately! Any later statement `y = y + i` reads 10, not the previous global value.
- **Call by Name Expression Re-evaluation:**
  - *Confusion:* Evaluating `k + 10` once when `f(k + 10)` is called.
  - *The click:* Call by Name is textual macro substitution. If `k` changes inside the function body *before* `x` is read, `x` uses the *new* value of `k`!

## GATE traps
- **The Postfix Recursion Trap (`f(val--)`):**
  - Passing `val--` evaluates to the *current* (old) value of `val` before decrementing. So `f(3)` calls `f(3)` indefinitely $\implies$ Stack Overflow $\implies$ **Abnormal Termination**. (Use `val - 1` or `--val` instead).
- **Accumulator Initial Value in Recurrences:**
  - In functions like `int ans = 1; for (...) ans += ...`, the initial accumulator must be included. Missing `ans = 1` turns $n=2$ from 4 into 3, wrecking all higher values.
- **Off-by-One in Peak Stack Depth Limits:**
  - When calculating the largest $n$ fitting in stack memory, the base-case invocation is an active frame on the stack. Total frames is $\frac{n - \text{base}}{\text{step}} + 1$. Never omit the $+1$.
- **Stepping Over the Base Case:**
  - If base case is `if (n == 0)` and step is `f(n - 2)`, odd inputs ($5 \to 3 \to 1 \to -1 \dots$) skip $0$ entirely and run into negative infinity. It terminates ONLY for non-negative even integers.
- **Total Invocations $\ne$ Stack Depth:**
  - Total calls is the sum of all nodes ever visited. Stack depth (auxiliary space) is only the **maximum active chain of frames alive at any single instant**. When a frame returns, it pops and its memory is reused.
- **Side Effects in Mutual Recursion (`fun1(++n)`):**
  - Pre-increment `++n` in an argument expression modifies `n` *before* the call. When that frame wakes up during unwinding, it sees the permanently updated `n`.
- **Missing Prototype Implicit `int` Conflict:**
  - In C, calling a function before its prototype or definition causes the compiler to assume an implicit return type of `int`. If the function is later defined below returning `double` or `float`, it triggers a **conflicting types compile error**.
- **Unspecified Argument Evaluation Order:**
  - The C standard does not specify whether function arguments are evaluated left-to-right or right-to-left. When calls have side effects (e.g. `f(g(10), h(20))`), GATE specifies the order; right-to-left means `h(20)` finishes completely before `g(10)` starts.
- **File-Scope `static` vs Local `static`:**
  - Local `static` controls **lifetime** (persists in Static Store across calls). File-scope (global) `static` controls **visibility** (hides the symbol from other translation units/files to avoid linker collisions).
- **Shadowing with Function Side Effects:**
  - In `y = funcp() + x;` inside `main`: even if `funcp()` modifies its own internal `static x`, the local `x` in `main` remains unchanged.
- **Bit-length vs Set-bit Counting:**
  - `while (num) { count++; num >>= 1; }` counts the total bit-length ($\lfloor \log_2(\text{num}) \rfloor + 1$) until `num == 0`. Counting only set bits requires `count += (num & 1)`.
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
