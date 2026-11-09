# Strings and Character Arrays

## TL;DR
In C, a string is a `char` array ending with `\0`. `char s[] = "abc"` is a writable 4-byte stack array; `char *s = "abc"` points to read-only memory. `strlen()` returns unsigned `size_t` and excludes `\0`, while `sizeof()` includes all allocated buffer bytes. Subtracting `strlen(s) - strlen(t)` triggers unsigned underflow whenever lengths differ.

## Core idea
- **String Representation:**
  - C has no native `string` type. A string is a contiguous `char` array terminated by the null character `'\0'` (ASCII value 0).
  - `%s` in `printf` starts at the given pointer and prints character-by-character until it encounters the first `'\0'`. Any characters after `'\0'` in the array are ignored.
- **`char s[]` vs `char *s`:**
  - `char s[] = "abc";` allocates 4 bytes on the stack and copies `'a'`, `'b'`, `'c'`, `'\0'`. It is fully writable (`s[0] = 'z';` is valid). `sizeof(s) == 4`.
  - `char *s = "abc";` creates a pointer `s` to a string literal in read-only memory (`.rodata`). Reading is valid; writing (`s[0] = 'z';`) invokes Undefined Behavior (Segmentation Fault). `sizeof(s)` is the pointer size (8 bytes on 64-bit).
- **`sizeof` vs `strlen`:**
  - `sizeof(arr)`: Compile-time operator; measures total allocated buffer bytes (including all zero-fill elements and `'\0'`).
  - `strlen(s)`: Runtime function; counts characters strictly before `'\0'`. Returns unsigned type `size_t`.
- **Pointer Walking Idioms:**
  - `while (*s++)`: Post-increments `s` even on the exit iteration when `*s == '\0'`. After loop, `s` points one byte *past* `'\0'`.
  - `while (*p++ = *q++)`: Classic 1-line copy; copies characters including `'\0'` and stops when the copied `'\0'` yields false (0).
  - Pointer distance: If `a` points to string start and `b` points to `'\0'`, string length is `b - a`.
- **Command Line Arguments (`argc`, `argv`):**
  - `argc`: Total argument count including the executable name `argv[0]`.
  - `argv`: Array of pointers to strings (`char *argv[]`). `argv[argc]` is `NULL`.

## Where I got confused → what made it click
- **Missing `'\0'` in custom copy loops:**
  - *Confusion:* Expecting `while (*t) *s++ = *t++;` to copy the whole string like standard `strcpy`.
  - *The click:* `while (*t)` halts the instant `*t == '\0'` without copying the null terminator or terminating `s`. If `s` was an existing string, any trailing characters beyond the copied length remain unchanged!
- **The Unsigned `strlen` Subtraction Trap:**
  - *Confusion:* Thinking `strlen(s) - strlen(t) > 0` checks if `s` is strictly longer than `t`.
  - *The click:* `strlen` returns unsigned `size_t`. When $s$ is shorter than $t$ ($3 - 5 = -2$), unsigned arithmetic wraps around to a massive positive value ($\text{UINT\_MAX} - 1$). Thus `(strlen(s) - strlen(t) > 0)` is **TRUE** whenever lengths are unequal! Always write `strlen(s) > strlen(t)`.
- **Character Math in Pointer Offsets:**
  - *Confusion:* Confusing character value arithmetic with pointer stepping.
  - *The click:* `'E' - 'A' = 4`. When added to a pointer `p + ('E' - 'A')`, it steps the memory address forward by 4 elements (`&p[4]`). Commutative indexing `2[p]` is just `p[2]`.
- **Cascading Replacement in `find_and_replace`:**
  - *Confusion:* Missing that replacing in-place without a `break;` allows the new character to match a later rule in the same pass.
  - *The click:* If `oldc = "bca", newc = "cda"`, replacing `'b'` with `'c'` allows that newly formed `'c'` to match the next iteration $j=1$ (`oldc[1] = 'c'`), mutating `'b'` all the way into `'d'`!

## GATE traps
- **`'0'` vs `'\0'`:**
  - `'0'` is the ASCII digit 48. Writing `*p = '0'` replaces the character with `'0'`; it does NOT terminate the string.
  - `'\0'` is the null character with ASCII value 0, which terminates the string.
- **Unterminated array reading:**
  - `char s[4] = "GATE";` fills all 4 allocated bytes without room for `'\0'`. Calling `strlen(s)` or `printf("%s", s)` reads out of bounds into stack garbage.
- **`strcpy` overlapping memory:**
  - Calling `strcpy(s + 1, s)` has undefined behavior because source and destination overlap, propagating characters infinitely.

## Example: GATE CSE 2025 Set 2
```c
#include <stdio.h>
void stringcopy(char *s, char *t) {
    while (*t)
        *s++ = *t++;
}
int main() {
    char a[30] = "@#Hello World!";
    stringcopy(a, a + 2);
    printf("%s\n", a);
    return 0;
}
```
**Working:**
1. `a` initially holds: `@`, `#`, `H`, `e`, `l`, `l`, `o`, ` `, `W`, `o`, `r`, `l`, `d`, `!`, `\0` (14 chars).
2. `stringcopy(a, a + 2)` copies 12 characters (`"Hello World!"`) into indices $0 \dots 11$.
3. When `*t == '\0'`, the loop exits immediately **without copying `\0`**.
4. Indices 12, 13, 14 retain their original values: `'d'`, `'!'`, and `'\0'`.
5. Output: **`Hello World!d!`**.
