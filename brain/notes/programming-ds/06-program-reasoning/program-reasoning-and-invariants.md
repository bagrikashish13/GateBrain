# Program Reasoning & Loop Invariants

## TL;DR
- Never simulate 50 iterations blindly in GATE. Spot the standard algorithmic archetype or test with tiny inputs ($n=0, 1, 2$).
- **Horner's Rule:** `tot = x * tot + Y[i]` evaluates polynomials or base-$x$ numbers without computing powers. $k$ ones in base 2 is always $2^k - 1$.
- **Binary Exponentiation:** Halving exponent (`b = b / 2`) while squaring base (`a = a * a`) computes $a^b$ in $O(\log b)$ time.
- **Loop Invariants are NOT memorized:** In MCQs, use the **Plug-and-Eliminate** test: check options at Step 0 (before loop) and Step 1 (after 1 iteration). Wrong options die immediately.

## Core idea

### 1. The 7 GATE Code-Reasoning Archetypes
| Archetype | The Code Signature | Mathematical Operation |
|---|---|---|
| **Horner's Rule** | `tot = x * tot + Y[i]` | Polynomial $P(x)$ or base-$x$ number conversion |
| **Binary Exponentiation** | `a = a * a; b = b / 2;` | Power $a^b$ (in $O(\log b)$ steps) |
| **Modular Exponentiation** | `z = (z * z) % n; z = (z * a) % n;` | $a^b \bmod n$ without integer overflow |
| **Euclidean GCD** | `while (a != b) a > b ? a -= b : b -= a;` | $\gcd(a, b)$ via common divisor invariance |
| **Division by Subtraction** | `while (r >= y) { r -= y; q++; }` | Quotient $q = \lfloor x/y \rfloor$, Remainder $r = x \bmod y$ |
| **Integer Square Root** | `while (i * i <= n) i++; return i - 1;` | $\lfloor\sqrt{n}\rfloor$ |
| **Array Double Swap** | `for i=1..n for j=1..n swap(A[i][j], A[j][i])` | Restores original matrix $A$ (identity) |

### 2. Missing Condition / Statement Method
- Never derive algebra from scratch.
- Test options on the **smallest valid inputs** and edge boundaries ($n = 1$, 1-element array, $a == b$).
- Discard any option that enters an infinite loop, accesses out-of-bounds indices, or fails to execute on boundary inputs.

### 3. Formal Loop Invariants & Postconditions
- **Loop Invariant:** An assertion about program variables that is:
  1. **True before the loop** (Initialization).
  2. **Preserved across each iteration** (Maintenance).
- **Postcondition:** What the program actually computed upon termination:
  $$\text{Postcondition} = (\text{Loop Invariant}) \land (\text{Exit Condition / Negation of Loop Guard})$$

## Where I got confused → what made it click

- **Subarray sum exceeding the full array sum:**
  - *Confusion:* Wondering how a contiguous subarray sum could ever be strictly greater than the sum of all elements in the array.
  - *The click:* Array elements can be **negative numbers**! If $E = \{-2, 10, -5\}$, the total sum is $3$, but subarray $\{10\}$ has sum $10$. Excluding negatives gives a larger sum.
- **Double matrix swap trap (GATE 2014 Set 3):**
  - *Confusion:* Seeing `swap(A[i][j], A[j][i])` and jumping to the conclusion that it transposes the matrix.
  - *The click:* If both loops run $1 \dots n$, every off-diagonal element is swapped **twice** (once at $(i, j)$ and once at $(j, i)$), which restores the original matrix $A$!
- **Loop invariant anxiety / "Do I have to remember all these?":**
  - *Confusion:* Feeling stressed about having to derive or remember complex invariant equations.
  - *The click:* In GATE, these are **always MCQs**. You **never** need to memorize them. Plug in tiny values ($0$ and $1$) at Step 0 (before loop) and Step 1 (after 1 iteration). Wrong options are eliminated within 10 seconds.
- **Picking sample values ("letting values") for invariant & postcondition MCQs:**
  - *Confusion:* Freezing up or feeling overwhelmed about what numbers to choose to trace code.
  - *The click:* Always choose tiny numbers that allow the loop to run just 1 or 2 iterations and stop (e.g. $x = 7, y = 3$). Record the terminal variable values upon exit and plug them into the options: false options immediately produce absurd arithmetic (like $1 = 17$) and die instantly.
- **Modular Exponentiation trace & early loop exit:**
  - *Confusion:* Multiplying linearly by hand (error-prone) or stopping the trace when `exp` reaches 1.
  - *The click:* The code is binary exponentiation running in $\lfloor \log_2 \text{exp} \rfloor + 1$ iterations. `exp` halves each step; when `exp % 2 == 1`, `result` multiplies by the current squared `base`. The loop guard `while (exp > 0)` requires executing the final iteration for `exp = 1` before terminating at `exp = 0`!

## GATE traps

- **Full-matrix vs Upper-triangle swap:**
  - $1 \le i \le n, 1 \le j \le n \implies$ swaps twice $\implies$ original matrix.
  - $1 \le i \le n, i < j \le n \implies$ swaps once $\implies$ transpose.
- **Assuming all array numbers are positive:**
  - In max/min subarray problems, always consider arrays with mixed positive and negative numbers.
- **Precondition missing a termination guard:**
  - In repeated subtraction division, $y > 0$ is strictly required as part of the precondition; without it, $y = 0$ causes an infinite loop.
- **Stopping binary/modular exponentiation at `exp = 1`:**
  - The loop condition is `while (exp > 0)`. When `exp == 1`, $1 > 0$ is true: it MUST execute this final iteration to fold the highest power of 2 into `result`, updating `exp = 1 / 2 = 0`. Skipping it leaves `result` missing the leading bit!

## Example

### GATE CSE 2021 Set 1 (Q48) · Horner's Rule
```c
int SimpleFunction(int Y[], int n, int x) {
    int total = Y[0], loopIndex;
    for (loopIndex = 1; loopIndex <= n - 1; loopIndex++)
        total = x * total + Y[loopIndex];
    return total;
}
```
For $n = 10$, all $Y[i] = 1$, and $x = 2$:  
The loop computes 10 ones in base 2:
$$2^{10} - 1 = 1024 - 1 = \mathbf{1023}$$

### GATE CSE 2017 Set 2 (Q37) · Precondition
For `while (r >= y) { r = r - y; q = q + 1; }` to establish $x = y \times q + r$:  
Before the loop, $q = 0 \implies y(0) + r = r$. For this to equal $x$, we must have $r = x$.  
To terminate, $y > 0$ is required. Precondition: `(q == 0) && (r == x) && (y > 0)`.
