# Structures and Unions

## TL;DR
A `struct` allocates separate contiguous memory for every member (total size = sum of member sizes + alignment padding). A `union` shares the exact same starting memory among all members (total size = size of largest member). `p->x` is shorthand for `(*p).x`. Bit-fields pack bits into an underlying integer word, but `int x : 1` is signed and evaluates to `-1` when set to `1`!

## Core idea
- **`struct` memory layout:** Members sit side-by-side in declaration order. Total size is at least the sum of members, expanded by compiler padding bytes for hardware alignment.
- **`union` memory layout:** All members overlap at offset 0. Only one member holds valid data at a time. Total size equals the largest member's size (rounded to its alignment).
- **Member access:** `.` accesses a member directly from a struct variable (`p.x`). `->` accesses a member through a pointer to a struct (`ptr->x`), equivalent to `(*ptr).x`.
- **Precedence:** `.` and `->` share the highest precedence level with postfix `++` and `[]` (associating left-to-right).
- **Self-referential structs:** A struct cannot contain an instance of itself, but it can contain a **pointer** to its own type (`struct node *next;`), forming the basis of linked lists and trees.
- **`typedef`:** Creates an alias (shorthand nickname) for an existing type; it does not define a new type (`typedef struct node Node;`).
- **Bit-fields:** `unsigned int b : k;` allocates exactly $k$ bits inside an underlying integer container word.

## Where I got confused → what made it click
- **What `typedef` actually does (alias vs new type):**
  - *Confusion:* Wondering if `typedef struct node Node;` creates a brand-new data structure or custom memory type.
  - *The click:* It is purely an **alias** (shorthand nickname). It just saves you from typing `struct node` every time.
- **Pointer to struct member vs whole struct:**
  - *Confusion:* In `struct test *p`, thinking `++p->c` moves from the first member `i` to the second member `c`.
  - *The click:* `p->c` *already* accesses member `c` directly! If `c` is a `char *` string pointer (e.g. `"better"`), `++(p->c)` increments that string pointer by 1 character, advancing it to `"etter"`.
- **Postfix pointer advancement in `p++->c`:**
  - *Confusion:* Believing `p++->c` reads the member of the next struct.
  - *The click:* Postfix `++` evaluates using the **old/current pointer** first (reading the current struct's `c`), and *then* advances `p` to the next struct in the array.
- **Why memory padding exists:**
  - *Confusion:* Why does `struct { char c; int i; };` take 8 bytes instead of 5?
  - *The click:* CPUs access memory at multiples of member sizes. A 4-byte `int` cannot sit at odd offsets (1, 2, 3); it must start at an address divisible by 4. So offsets 1, 2, 3 are empty padding bytes!
- **Tail padding for arrays:**
  - *Confusion:* Why does `struct { int i; char c; };` take 8 bytes if `char c` is at the end?
  - *The click:* If you create an array `arr[2]`, `arr[1]` must also be aligned! To ensure `arr[1].i` lands on a multiple of 4, the entire struct size rounds up to a multiple of its largest member (4 bytes $\implies 5 \to 8$).
- **Union size calculation:**
  - *Confusion:* Adding the members of a union together like a struct.
  - *The click:* Union members **share** memory. `sizeof(union)` is $\max(\text{members})$, NOT the sum!
- **"Ignoring alignment consideration":**
  - *Confusion:* Calculating padding when the GATE question says "ignoring alignment consideration".
  - *The click:* "Ignoring alignment" means **zero padding** — take the raw sizes directly.
- **Bit-field `sizeof` and 1-bit signed trap:**
  - *Confusion:* Thinking `sizeof` returns bits, or that `int x : 1; x = 1;` evaluates to `+1`.
  - *The click:* `sizeof` **always returns bytes** (the size of the underlying container, e.g. 4 bytes for `unsigned int`). Furthermore, in 2's complement, a 1-bit signed integer has only a sign bit: `1` represents **`-1`**, not `+1`! Use `unsigned int` for 1-bit flags.
- **Adjacent bit-fields share one container:**
  - *Confusion:* Allocating 4 bytes separately for each declared bit-field ($4 + 4 + 4 = 12$ bytes).
  - *The click:* Bit-fields **pack together**. If three `unsigned int` bit-fields use $4 + 4 + 8 = 16$ bits, they all pack into a **single 4-byte `unsigned int` container**! A new 4-byte container is only allocated when the remaining bits in the current container are exceeded.

## GATE traps
- **The Format Specifier `%c` vs Quotes Trap:**
  - `%c` outputs the bare character, never with quotes (`0`, not `'0'`). Distractor options intentionally add `' '` to lure students.
- **Adding Union Members Inside a Struct:**
  - In `struct S { short x[5]; union { float y; long z; } u; };`, the union contribution is $\max(\text{sizeof}(y), \text{sizeof}(z))$, NOT their sum.
- **Passing Struct by Value vs Array Decay:**
  - Unlike arrays (which decay into pointers when passed to functions), passing a `struct` copies the **entire struct by value**. To allow modifications to persist in the caller, you must explicitly pass a pointer (`&s`).
- **1-Bit Signed Bit-Field Trap:**
  - `int b : 1; b = 1; if (b == 1)` evaluates to **FALSE** because `b` holds `-1`.
- **Bit-Field Container Sharing vs Multiple Allocations:**
  - In `unsigned int a:4, b:4, c:8;`, total bits is 16, which fits in one 32-bit (4-byte) `unsigned int`. Do not allocate 4 bytes for each field; together they take only 4 bytes.

## Example
**GATE CSE 2000 (Q1.17):**
```c
struct {
    short x[5];
    union {
        float y;
        long z;
    } u;
} t;
```
Assume `short` = 2 bytes, `float` = 4 bytes, `long` = 8 bytes. What is the memory requirement for `t`, **ignoring alignment consideration**?

**Solution:**
1. Array member: `short x[5]` occupies $5 \times 2 = 10\text{ bytes}$.
2. Union member: `union { float y; long z; } u` occupies $\max(4, 8) = 8\text{ bytes}$ (shared storage).
3. Ignoring alignment $\implies$ no padding bytes added.
$$\text{Total size} = 10 + 8 = \mathbf{18\text{ bytes}}.$$
