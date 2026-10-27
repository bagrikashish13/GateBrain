# C Programming Master Plan (GATE CSE)

**Target:** 100% accuracy on all GATE C Programming questions with $\le 1$ minute solve time per question.  
**Mode:** Chat-only interactive micro-lessons (no video lectures). Zero omissions.  
**Timeline:** 27 Oct 2026 – 1 Nov 2026 (Parallel with Compiler Design).

---

## 1. Operating Rules for Agents in Any Chat

1. **Step-by-Step Micro-Chunks (Never all at once):**
   - Teach in tiny, bite-sized pieces (3–5 lines).
   - End each step by checking in: *"Are you clear with this piece, or do you have any doubts before we move to the next part?"*
   - Only advance when she confirms she's clear.
   - Do NOT bundle concept, traps, shortcuts, and questions all into a single giant message. Take it step-by-step.
2. **Never Skip or Assume:** Cover every subtopic systematically. Do not gloss over basics.
3. **MANDATORY REAL-TIME TEMPLATE PROMPT (Crucial):**
   - The student has requested: **Do not rely on them remembering templates in advance.**
   - Whenever a topic involves **Loops**, the agent **must explicitly draw and remind** them of the *Variable State Table*.
   - Whenever a topic involves **Recursion or Static Variables**, the agent **must explicitly draw and remind** them of the *Activation Stack + Static Store*.
   - Whenever a topic involves **Pointers or Arrays**, the agent **must explicitly draw and remind** them of the *Address-Arrow Scaling Model*.

---

## 2. The 3 Paper-Pencil Tracing Templates

### Template A: The Address-Arrow Model (Pointers & Arrays)
- **Principle:** Never imagine pointers in memory. Write the base address, draw arrows, and apply type scaling.
- **Rules:**
  - Pointer addition: `p + i` points to address $\text{addr}(p) + i \times \text{sizeof}(*p)$.
  - Array equivalence: `a[i] == *(a + i)`.
  - 2D Array: `a[i][j] == *(*(a + i) + j)`. Base type of `a` is array, base type of `*a` is element.
- **Format:**
  ```text
  [Array a]  Base: 1000  | [0]: 1000 | [1]: 1004 | [2]: 1008 |
  [Pointer p] Value: 1000 ----> points to a[0]
  p++         Value: 1004 ----> points to a[1]
  ```

### Template B: Activation Stack + Static Store (Recursion & Storage Classes)
- **Principle:** Recursion mistakes come from mixing local stack frames with static memory.
- **Format:** A 2-column scratchpad:
  ```text
  [Global / Static Store] (Persists across ALL calls)
  x = 0 -> 1 -> 2 ...

  [Call Stack] (LIFO execution)
  | Frame 3: f(1) -> returns ... |
  | Frame 2: f(2) -> waiting ... |
  | Frame 1: f(3) -> waiting ... |
  ```
- Track **winding phase** (before recursive call) vs **unwinding phase** (after recursive call/returns).

### Template C: The Variable State Table (Loops & Control Flow)
- **Principle:** Never simulate 50 iterations blindly. Trace 2–3 rows to capture the state invariant.
- **Format:**
  ```text
  | Iteration | Variable Values (i, j, sum) | Loop Condition | Action / Output |
  |-----------|-----------------------------|----------------|-----------------|
  | init      | i=0, sum=0                  | 0 < n (True)    | sum += 0        |
  | 1         | i=1, sum=1                  | 1 < n (True)    | sum += 1        |
  | 2         | i=2, sum=3                  | 2 < n (True)    | sum += 2        |
  Invariant: At step k, sum = k*(k+1)/2. Termination when i == n.
  ```

---

## 3. Timeline & Schedule (27 Oct – 1 Nov 2026)

| Day | Date | Target Chapters & Topics | Status |
| :--- | :--- | :--- | :--- |
| **Day 1** | Tue 27 Oct | **Ch-01: Data Types & Operators** + **Ch-02: Control Flow Statements** | 🟡 In Progress |
| **Day 2** | Wed 28 Oct | **Ch-03: Functions, Storage Classes & Recursion** | ⚪ Pending |
| **Day 3** | Thu 29 Oct | **Ch-04 Part 1: Pointers, Pointer Arithmetic, 1D Arrays** | ⚪ Pending |
| **Day 4** | Fri 30 Oct | **Ch-04 Part 2: 2D Arrays, Pointer to Array, Array of Pointers, Function Pointers** | ⚪ Pending |
| **Day 5** | Sat 31 Oct | **Ch-05: Strings** + **Ch-06: Structures & Unions** | ⚪ Pending |
| **Day 6** | Sun 1 Nov | **Ch-07: Miscellaneous (Macros, DMA, Const)** + Mixed Speed Drills | ⚪ Pending |

---

## 4. Exhaustive Chapter Checklist

### Ch-01: Data Types & Operators
- [ ] 1.1 Primitive types, ranges, signed/unsigned representation & 2's complement
- [ ] 1.2 Type conversion & implicit promotions (signed vs unsigned `sizeof` trap)
- [ ] 1.3 Arithmetic, bitwise shifts (`<<`, `>>`), bitwise masking (`&`, `|`, `^`, `~`)
- [ ] 1.4 Logical operators & guaranteed **short-circuit evaluation**
- [ ] 1.5 Increment/decrement (`++`, `--`), prefix vs postfix, evaluation order
- [ ] 1.6 Precedence and associativity master table
- [ ] 1.7 Comma operator and conditional ternary (`?:`) operator

### Ch-02: Control Flow Statements
- [ ] 2.1 `if-else` & dangling-else resolution
- [ ] 2.2 `switch-case`: fall-through, `break`, `default` placement anywhere
- [ ] 2.3 `for`, `while`, `do-while`: loop invariants, condition timing, updates
- [ ] 2.4 `break` vs `continue` across nested loops and switches

### Ch-03: Functions & Storage Classes
- [ ] 3.1 Call stack & activation records (pass-by-value vs pass-by-reference)
- [ ] 3.2 Storage classes: `auto`, `register`, `static`, `extern` (scope vs lifetime vs linkage)
- [ ] 3.3 Static variables in recursion (state retention across calls)
- [ ] 3.4 Recursion tracing: winding vs unwinding prints, tree recursion

### Ch-04: Arrays and Pointers
- [ ] 4.1 Address-of (`&`), dereference (`*`), pointer sizes
- [ ] 4.2 Pointer arithmetic & scaling factors (`p + i` scaling by `sizeof(*p)`)
- [ ] 4.3 1D array-pointer equivalence: `a[i] == *(a + i)`, `&a` vs `a` vs `*a`
- [ ] 4.4 2D array row-major layout, `*(*(a + i) + j)`
- [ ] 4.5 Pointer to array `int (*p)[N]` vs array of pointers `int *p[N]`
- [ ] 4.6 Pointer to pointer (`int **`) & multi-level dereferencing
- [ ] 4.7 Function pointers: declaration, invocation, callbacks
- [ ] 4.8 Pointer casting, byte-level memory inspection & endianness
- [ ] 4.9 Void pointers, `NULL`, wild and dangling pointers

### Ch-05: Strings
- [ ] 5.1 `char s[]` vs `char *s` (read-only literal segment traps)
- [ ] 5.2 Null-terminator `'\0'` mechanics in declarations and array bounds
- [ ] 5.3 Pointer walking string loops (`while(*s++)`, `*p++ = *q++`)
- [ ] 5.4 Standard library internals: `strlen`, `strcpy`, `strcat`, `strcmp`
- [ ] 5.5 `printf` and `scanf`: format specifiers, field width, return values

### Ch-06: Structure & Union
- [ ] 6.1 `struct` definition, member access (`.` vs `->`), nested structs
- [ ] 6.2 Structure padding, data alignment rules, exact `sizeof(struct)`
- [ ] 6.3 Self-referential structures
- [ ] 6.4 `union`: overlapping memory, sizing, member overwriting
- [ ] 6.5 Bit-fields: allocation, signedness, sizing

### Ch-07: Miscellaneous
- [ ] 7.1 Preprocessor `#define` macros: text substitution traps, parenthesis rules
- [ ] 7.2 Conditional compilation (`#ifdef`, `#ifndef`, `#if`)
- [ ] 7.3 Dynamic memory allocation: `malloc`, `calloc`, `realloc`, `free`, memory leaks
- [ ] 7.4 `const` pointer variants: `const int *`, `int * const`, `const int * const`
- [ ] 7.5 `typedef` vs `#define`
- [ ] 7.6 Command line arguments: `argc`, `argv` pointer navigation
