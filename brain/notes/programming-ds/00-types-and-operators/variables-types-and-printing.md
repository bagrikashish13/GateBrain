# Variables, Types and Printing in C

## TL;DR
Local variables default to garbage. In an $n$-bit system, unsigned ranges from $0$ to $2^n - 1$ (`%u`), while 2's complement signed ranges from $-2^{n-1}$ to $2^{n-1} - 1$ (`%d`). `char` is simply a 1-byte integer with consecutive letters/digits, enabling arithmetic (`'5' - '0' == 5`). `float` stores binary approximations, never exact decimal fractions. `printf` returns the total count of characters output.

## Core idea
- **Local Variable Initialization:**
  - Local variables declared without an initial value contain indeterminate **garbage**, never an automatic zero.
- **Sizes and Representation:**
  - `sizeof(...)` evaluates memory size in **bytes** at compile time.
  - $\text{sizeof}(\text{short}) \le \text{sizeof}(\text{int}) \le \text{sizeof}(\text{long})$.
- **2's Complement Representation ($n$ bits):**
  - Sign bit (MSB) has negative weight: $-b_{n-1} \cdot 2^{n-1}$.
  - Range: $-2^{n-1} \text{ to } 2^{n-1} - 1$.
  - To negate a number: invert all bits ($0 \leftrightarrow 1$), then add $1$.
- **Overflow & Wrap-Around:**
  - Signed overflow: adding 1 to maximum positive wraps to the minimum negative (e.g. 8-bit: $127 + 1 = -128$).
  - Unsigned underflow: $0 - 1$ wraps modulo $2^n$ to the maximum value $2^n - 1$ (e.g. 8-bit: $0 - 1 = 255$).
- **Characters as Small Integers:**
  - `char` is a 1-byte integer storing an ASCII character code.
  - Standard guarantees consecutive values for `'0'..'9'`, `'A'..'Z'`, and `'a'..'z'`.
  - Shift characters: `'a' + 2 \rightarrow \text{'c'}`.
  - Extract digit value: `'7' - '0' \rightarrow 7$.
- **Floating-Point Storage:**
  - `float` (4 bytes) and `double` (8 bytes) represent fractions as binary approximations.
  - Fractions with denominators not powers of 2 (like $0.1 = 1/10$) repeat infinitely in binary and are truncated.
- **`printf` & Format Specifiers:**
  - `%d` (signed int), `%u` (unsigned int), `%c` (char), `%f` (float/double), `%x` (hex), `%o` (octal).
  - Return value: `printf` returns the integer count of characters printed to standard output.

## Where I got confused → what made it click
- **Why signed range is asymmetric ($-2^{n-1}$ to $2^{n-1} - 1$):**
  - *Confusion:* Wondering why there is one more negative value than positive.
  - *The click:* $n$ bits produce $2^n$ patterns split equally by the MSB ($2^{n-1}$ each). The non-negative half must spend one pattern on `0` (`00...0`), so positives only reach $2^{n-1} - 1$. On the negative side, there is no duplicate zero, so all $2^{n-1}$ patterns represent distinct negative numbers down to $-2^{n-1}$.
- **Why `float` is inexact even for `0.1`:**
  - *Confusion:* `0.1` terminates cleanly in base 10 (one digit after the dot), so why is it inexact in memory?
  - *The click:* Computers work in **binary (base 2)**, not base 10. Just like $1/3$ repeats infinitely in decimal ($0.3333...$), $1/10$ repeats infinitely in binary ($0.0001100110011..._2$). The finite 32-bit `float` must chop off the repeating tail, making it a cut-off approximation.
- **Counting characters in `printf`:**
  - *Confusion:* Treating `\n` as two characters because it takes two keys to type.
  - *The click:* In C, `\n` is a single escape character (ASCII 10, newline). `printf("Hi\n")` outputs `'H'`, `'i'`, and `'\n'`—exactly 3 characters.

## GATE traps
- **The Float Equality Trap:**
  ```c
  float x = 0.1;
  if (x == 0.1)  // Evaluates to FALSE!
  ```
  In C, literal `0.1` defaults to `double` (64-bit). The truncated 32-bit `float x` does not bit-match the 64-bit `double 0.1`.
- **Leading Zero Octal Trap:**
  ```c
  int a = 017;  // This is OCTAL (base 8), not 17! Value is 1*8 + 7 = 15.
  int b = 0x1F; // Hexadecimal (base 16): 1*16 + 15 = 31.
  ```
- **Garbage Local Trap:**
  Uninitialized locals in C do not default to 0. Relying on `int sum;` inside a function produces unpredictable results.

## Example
**GATE CSE 2014 / 2017 style representation check:**
```c
#include <stdio.h>

int main() {
    int c = printf("Hi\n");
    char ch = '0' + 7;
    unsigned char u = 0;
    u = u - 1;

    printf("%d %c %u\n", c, ch, u);
    return 0;
}
```
**Output:**
```text
Hi
3 7 255
```
* `printf("Hi\n")` prints `Hi` followed by newline, returning `3` to `c`.
* `'0' + 7` evaluates to `'7'`.
* 8-bit unsigned `0 - 1` wraps around modulo $2^8$ to `255`.
