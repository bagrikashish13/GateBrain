# C Control Flow: If-Else, Switch, Loops & Jump Statements

## TL;DR
Non-zero is TRUE, `0` is FALSE. Dangling `else` always binds to the nearest preceding unmatched `if`. `switch` requires integral constants, and missing `break` causes fall-through—even from `default:`. In loops, track state invariants with the Variable State Table; `break` exits the nearest loop or switch, while `continue` jumps to the enclosing loop's update step.

## Core idea
- **Truthiness in C:**
  - `0` is **FALSE**; any non-zero value (e.g. `1`, `-5`, `42`) is **TRUE**.
  - **Assignment trap:** `if (x = 0)` assigns `0` to `x` and evaluates to FALSE. `if (x = 5)` assigns `5` and evaluates to TRUE.
- **Dangling Else Resolution:**
  - An `else` **always pairs with the nearest preceding `if`** that does not already have an `else`, regardless of indentation.
  - If the outer `if` condition is FALSE, the entire inner block—including its attached `else`—is skipped completely.
- **`switch-case` Rules:**
  - `switch(expr)` requires an **integral type** (`int`, `char`, `enum`). Floats/doubles produce a compile error.
  - `case CONST:` labels must be **compile-time constant integer expressions**. Variables are not allowed.
  - **Fall-through:** Execution jumps to the matching case and runs sequentially through all subsequent cases until a `break;` or closing `}` is reached.
  - `default:` can appear anywhere (top, middle, bottom). If it has no `break;`, it falls through into the case immediately below it.
- **Loops (`for`, `while`, `do-while`):**
  - `for(init; cond; update)` executes: Init $\rightarrow$ Condition $\rightarrow$ Body $\rightarrow$ Update $\rightarrow$ Condition.
  - `while(cond)` is pre-tested (runs $\ge 0$ times).
  - `do { ... } while(cond);` is post-tested (runs $\ge 1$ times, requires trailing `;`).
  - **The Semicolon Trap:** `while(cond);` or `for(...);` repeats an empty statement.
- **Jump Statements:**
  - `break;` terminates the nearest enclosing loop or `switch`.
  - `continue;` skips the remainder of the current iteration and jumps to the next cycle (to `update` in `for`, to `condition` in `while`). It is invalid outside loops.
  - Inside a `switch` that is inside a loop: `break` exits only the `switch`; `continue` acts on the **enclosing loop**.

---

### 📝 Template C: The Variable State Table
Always trace loops by capturing the state invariant over 2–3 rows rather than blind iteration:

```text
| Iteration | Variable Values (i, j) | Condition | Action / Output | Update |
|-----------|------------------------|-----------|-----------------|--------|
| init      | i=0, j=0               | 0 < 5 (T) | body executes   | i++    |
| 1         | i=1, j=5               | 1 < 5 (T) | body executes   | i++    |
```

## Where I got confused → what made it click
- **Dangling-else indentation illusion:**
  - *Confusion:* Seeing `else` indented under the outer `if` and assuming it triggers when outer `if` is false.
  - *The click:* The compiler completely ignores whitespace. The `else` clings to the nearest inner `if`. If the outer `if` is false, the whole inner structure (and its `else`) is skipped!
- **`continue` inside a nested switch:**
  - *Confusion:* Expecting `continue` to break out of the switch like `break` does.
  - *The click:* `switch` does not own `continue`. The `continue` passes straight through the switch to the enclosing loop, skipping whatever code follows the switch in that iteration.

## GATE traps
- **Inner Loop Non-Reinitialization:**
  - If inner loop variable `j` is initialized outside the outer loop and never reset inside, the inner loop runs only during the first outer iteration. For all subsequent outer iterations, `j < N` is already false!
- **Float in `switch`:**
  - `float x = 1.0; switch(x)` is an immediate **Compile Error**.
- **Variable Case Label:**
  - `int c = 2; switch(x) { case c: ... }` causes a **Compile Error** because case expressions must be constants known at compile time.
- **`default:` at the top without `break`:**
  - If no cases match, execution jumps to `default:`, executes its statements, and falls right through to `case 1:` below it unless terminated with `break`.

## Example
**GATE CSE 2014:**
```c
#include <stdio.h>
int main() {
    int i = 0, j = 0;
    while (i < 5) {
        i++;
        while (j < 5) {
            if (i == 3)
                break;
            j++;
        }
    }
    printf("%d %d", i, j);
    return 0;
}
```

**Trace via Variable State Table:**
- **Pass 1 ($i=0 \rightarrow 1$):** Inner loop runs from $j=0$ to $j=5$. $j$ becomes $5$.
- **Pass 2 ($i=1 \rightarrow 2$):** Inner loop check `j < 5` ($5 < 5$) is **FALSE** immediately. Inner loop runs 0 times.
- **Pass 3 ($i=2 \rightarrow 3$):** Inner loop check `j < 5` is FALSE. Inner loop runs 0 times (the `if (i == 3) break;` is never reached!).
- **Pass 4 ($i=3 \rightarrow 4$):** Inner loop skipped.
- **Pass 5 ($i=4 \rightarrow 5$):** Inner loop skipped.
- Outer loop exits when $i = 5$. Output: **`5 5`**.
