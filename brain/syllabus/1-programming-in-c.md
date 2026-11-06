# Part 1 · Programming in C

Official GATE 2027 wording (Section 4): "Programming in C. Recursion."

How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic to teach, in this order.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers or other languages).
PYQ ids are newest first. See `README.md` for the rules and `npm run syllabus` for the next step.

## P01 · Types, operators and expressions
notes: programming-ds/00-types-and-operators
hours: 2.5

### Types and conversions
- P01.1 T Integer types and `sizeof`, signed vs unsigned ranges, 2's complement wrap-around. `char` is a small integer, so `'a'+2` and `'5'-'0'` work.
- P01.2 T Integer division truncates and `%` follows the dividend's sign. Mixed expressions convert per operator, left to right: work through `2*3/4 + 2.0/5 + 8/5`. Assigning a float to an int truncates. Explicit casts.
- P01.3 T The signed/unsigned trap: with an unsigned operand the signed value converts to unsigned, so `strlen(s)-strlen(t) > 0` is true unless the lengths are equal, and `-1 > 1u`.
- P01.4 Q Overflow: which order of multiply and divide computes a formula correctly for large values. PYQ: 2014s2-11
- P01.5 Q Loops controlled by float values: count iterations when a ratio halves each time. PYQ: 2019-52

### Operators
- P01.6 T Precedence and associativity table: unary > `* / %` > `+ -` > `<< >>` > relational > `== !=` > `&` > `^` > `|` > `&&` > `||` > `?:` > assignment > comma. Unary, `?:` and assignment are right associative.
- P01.7 T Pre vs post `++`/`--`: the value used vs the value stored. GATE does not test undefined behaviour (one variable changed twice in one expression).
- P01.8 T `&&` and `||` give 0 or 1 and short-circuit, so side effects on the right may never run.
- P01.9 T Bitwise `& | ^ ~ << >>`: test the last bit with `v & 1`, drop it with `v >>= 1`, count set bits, clear the lowest set bit with `x & (x-1)`, swap with XOR.
- P01.10 T Ternary (nests right to left), comma (value of the last), compound assignment, `sizeof` (compile time, operand not evaluated, array vs pointer).
- P01.11 Q Trace chains of pre and post increment. PYQ: 2017s2-54
- P01.12 Q Short-circuit with a side effect in a loop. PYQ: 2021s1-37
- P01.13 Q Bit operations on ints and on characters using given ASCII codes; loops that count bits. PYQ: 2022-34, 2017s1-55, 2014s2-10
- P01.14 Q Evaluate a nested ternary; find a statement equivalent to an if-else. PYQ: 2008-18, IT2004-15
- P01.15 N `printf`/`scanf`: `%d %u %c %s %f %x`, field width, `printf` returns characters printed, `scanf` returns items read.

## P02 · Control flow
notes: programming-ds/01-control-flow
hours: 1.5

- P02.1 T `if-else`: any non-zero value is true; a dangling `else` binds to the nearest unmatched `if`, whatever the indentation says.
- P02.2 Q Trace a dangling else. PYQ: 1995-1.4
- P02.3 T `switch`: fall-through without `break`, `default` runs only if no case matches wherever it is written, case labels are constants, the expression is an integer.
- P02.4 Q Count or trace `printf` calls through a fall-through inside a loop. PYQ: 2015s3-48, 2012-3
- P02.5 T Loops: order of init, condition, update in `for`; `do-while` runs at least once; the value of the counter after exit; empty bodies `for(...);`. `break` leaves the innermost loop or switch; `continue` jumps to the update or condition. Use the Variable State Table.
- P02.6 Q Trace a loop to its output, including loops that never end. PYQ: 2025s2-23, 2025s1-53, 2024s1-8, 2024s1-38, 2018-32
- P02.7 L `goto`, structured programming, paradigms, type systems, aliasing: recall only, one line each. PYQ: 2004-90, 2004-1, 2003-24, 2002-2.18, 2000-1.16, 1999-2.5, 1994-1.5, 1989-3.i

## P03 · Functions, scope, storage and parameter passing
notes: programming-ds/02-functions-and-recursion
hours: 3.5

### Memory layout
- P03.1 T Process memory: code, data/BSS (globals and statics), stack (locals, parameters, return address), heap (`malloc`). What an activation record holds.
- P03.2 Q Say where a variable lives and how activation records behave. PYQ: 2026s2-7, 2017s2-2, 2002-1.17

### Scope and storage classes
- P03.3 T Scope vs lifetime vs linkage. A name resolves to the innermost declaration visible, and a block can shadow a parameter or a global.
- P03.4 Q Trace shadowed names across blocks and functions. PYQ: 2026s1-24, IT2008-51, 2003-89
- P03.5 T `static` local: one copy, initialised once, keeps its value. Globals and statics default to 0. `auto`, `register`, `extern`.
- P03.6 Q Trace `static`, global and local variables with the same name. PYQ: 2023-25, 2019-27, 2015s3-54, 2014s2-42, 2012-48, 2012-49, IT2004-59, 2000-2.20

### Functions
- P03.7 T Declaration vs definition, prototypes, what happens without one (implicit `int`), argument type checking, `void`.
- P03.8 Q Decide whether a program compiles or which warning it gives. PYQ: 2026s2-9, 2016s1-12, 2005-32
- P03.9 T Order of evaluating arguments is unspecified, so GATE states it when it matters; inner calls finish before the outer call starts.
- P03.10 Q Trace nested calls under a given evaluation order. PYQ: 2025s2-53, 2024s2-3, 2019-18

### Parameter passing in C
- P03.11 T C passes by value only. A pointer argument lets the callee change the caller's object; reassigning the pointer parameter itself changes nothing in the caller; changing a caller's pointer needs `**`.
- P03.12 Q The swap family: which versions really swap. PYQ: 2018-29, 2016s1-15, 2015s1-11, IT2008-50, 2006-57, IT2006-50, 2010-11, 2004-2
- P03.13 Q Value and pointer parameters mixed, including `**`. PYQ: 2025s1-24, 2017s2-14, 2016s2-12, 2008-60

### Other languages' rules (asked in pseudo-languages, also part of Compiler Design's runtime environments)
- P03.14 T Call by reference, value-result and name: how to trace each, and when reference and name differ.
- P03.15 Q Trace a program under a stated passing method. PYQ: 2016s1-36, 2013-42, IT2007-33, 2001-2.17
- P03.16 T Static vs dynamic scoping: a free variable comes from the enclosing text vs the most recent caller.
- P03.17 Q Output under static and under dynamic scoping. PYQ: 2012-36, IT2007-34, 2003-74, 2003-73
- P03.18 L Older pseudo-Pascal versions of the same two ideas: do one, read the rest. PYQ: 1999-15, 1998-2.15, 1998-2.13, 1995-2.4, 1994-1.20, 1993-26, 1992-10b, 1991-09b, 1991-09a, 1991-03.x, 1990-11a, 1989-8b, 1989-3.viii, 1988-8i, 1988-2xv, 1988-2xii, 1987-1.xx, 1987-1.xix

### Activation records
- P03.19 Q Activation tree and stack depth; which language features need stack or heap allocation. PYQ: 2023-26, 2021s1-4, 2014s3-18, 2014s2-18, 2010-14, 2008-54, 1997-1.10, 1997-1.8, 1990-2.v, 1989-10a

## P04 · Recursion
notes: programming-ds/02-functions-and-recursion
hours: 4

### Print order
- P04.1 T Frames, base case, winding and unwinding: code before the call runs on the way down, code after it runs in reverse on the way up. Use the Activation Stack + Static Store template.
- P04.2 Q Print order, reversing input or a string, printing binary digits, recursion that never stops. PYQ: 2024s1-9, 2019-26, 2015s2-15, IT2008-83, IT2008-82, 2008-61, IT2004-60, 2001-13, 1995-2.9, 1989-8a

### Return values
- P04.3 T Work bottom-up: write a small table f(0), f(1), f(2)… instead of expanding the whole tree.
- P04.4 Q Value returned by a recursive function. PYQ: 2026s2-51, 2026s1-51, 2025s1-51, 2021s2-23, 2018-21, 2016s2-37, 2015s2-11, 2011-49, 2011-48, 2010-35, IT2006-52, IT2005-57, 2005-31, 1998-2.12, 1995-4, 1994-6
- P04.5 T A `static` or global shared by all frames, and a pointer argument shared between frames.
- P04.6 Q Recursion with `static` variables or a shared pointer. PYQ: 2020-46, 2016s1-35, 2009-18, 2007-42, 2004-31

### Counting and stack use
- P04.7 T Tree recursion: count calls with a recurrence such as C(n) = 1 + C(n-1) + C(n-2).
- P04.8 Q Count calls, or how many times a statement prints. PYQ: 2021s2-49, 2018-45, 2015s3-39, 1991-01.x
- P04.9 T Mutual recursion: keep one frame column per function.
- P04.10 Q Trace two functions calling each other. PYQ: 2017s1-35
- P04.11 T Termination: when recursion never ends, such as `f(val--)` passing the old value; stack overflow; for which inputs a function halts.
- P04.12 Q Does it terminate, and for which inputs. PYQ: 2017s1-36, IT2007-27
- P04.13 T Stack depth is the space used. Tail recursion can become a loop. Memoisation turns exponential calls into linear ones.
- P04.14 Q Stack size, space complexity, and the effect of memoisation. PYQ: 2005-81b, 2005-81a, 2000-16, 1994-21
- P04.15 Q Towers of Hanoi: complete the code; a numeric recursion's fixed point. PYQ: 2014s2-40, 2002-11

## P05 · Pointers and 1D arrays
notes: programming-ds/03-arrays-and-pointers
hours: 3

- P05.1 T `&`, `*`, pointer variables and pointer size. Use the Address-Arrow Scaling Model.
- P05.2 T Pointer arithmetic scales by `sizeof(*p)`; `q-p` counts elements, not bytes; pointer comparison.
- P05.3 T `a[i] == *(a+i) == *(i+a) == i[a]`. An array name decays to a pointer except with `sizeof` and `&`; `&a+1` jumps a whole array; negative indexing; passing an array passes a pointer.
- P05.4 T `*p++` vs `(*p)++` vs `*++p` vs `++*p`.
- P05.5 T `void *`, `NULL`, wild and dangling pointers, casts, reading memory byte by byte, endianness.
- P05.6 Q Trace pointer and array code to its output. PYQ: 2026s2-50, 2025s2-52, 2024s2-26, 2022-11, 2019-53, 2019-24, 2014s1-10

## P06 · Multi-dimensional arrays, arrays of pointers, declarations
notes: programming-ds/03-arrays-and-pointers
hours: 3

- P06.1 T 2D layout is row-major. `a[i][j] == *(*(a+i)+j)`. The type and scale of `a`, `*a`, `a+1`, `*a+1`.
- P06.2 T 3D arrays, partially braced initialisers (missing elements are 0), passing 2D arrays to functions.
- P06.3 T `int (*p)[N]` vs `int *p[N]`, `int **`, function pointers, reading a declaration inside-out, `typedef`.
- P06.4 Q Evaluate 2D and 3D array expressions by hand. PYQ: 2022-33, 2021s2-10, 2020-22, 2015s1-35, IT2008-52
- P06.5 Q Arrays of pointers and double pointers. PYQ: 2015s3-26, IT2006-51
- P06.6 Q What a declaration means; which expressions are valid lvalues. PYQ: 2005-1, 2003-2, 2000-1.11
- P06.7 Q Address or element types from a declaration or from intermediate code. PYQ: 2014s2-34, 2002-2.8
- P06.8 Q Code on matrices: equivalence of two loops, transpose bugs. PYQ: 2015s3-30, IT2004-58
- P06.9 N Command line arguments: `argc`, `argv`, walking `argv` with pointers.

## P07 · Strings
notes: programming-ds/04-strings
hours: 2

- P07.1 T `char s[]="abc"` is a writable array of size 4; `char *s="abc"` points to a read-only literal.
- P07.2 T `\0`: `%s` stops at the first `\0`, so a string starting with `\0` prints nothing; unfilled array elements are 0.
- P07.3 T `strlen` excludes `\0` and returns an unsigned value, `sizeof` is the array size; how `strcpy`, `strcat`, `strcmp` work inside.
- P07.4 T Walking with pointers: `while(*s++)`, `*p++ = *q++`, `b-a` as length; copying over overlapping memory; forgetting to copy the terminator.
- P07.5 T Characters used as numbers in pointer arithmetic: `p + p[3] - p[1]`, `2[p]`.
- P07.6 Q Output of string and character-array code. PYQ: 2025s2-9, 2024s2-23, 2017s2-55, 2017s1-53, 2015s3-7, 2011-22, IT2008-49, 2004-33
- P07.7 Q Find the bug in a character-array procedure and the input that exposes it. PYQ: 2013-51, 2013-50

## P08 · Structures, unions, dynamic memory, preprocessor
notes: programming-ds/05-structures-and-memory
hours: 3.5

### Structures and unions
- P08.1 T `struct`, `.` vs `->`, nesting, arrays of structs, initialiser lists, passing by value (a copy) vs by pointer.
- P08.2 T Precedence with structs: `++p->c`, `p++->c`, `(*p).x`.
- P08.3 T `sizeof`: sum of members when alignment is ignored, then padding and alignment rules; a `union` takes its largest member and its members overlap.
- P08.4 T Self-referential structs and `typedef struct`: the basis of every linked structure.
- P08.5 Q Navigate structs through pointers, including casts to `char *`. PYQ: 2021s2-35, 2018-2, IT2006-49, IT2004-61
- P08.6 Q Size of a struct containing a union. PYQ: 2000-1.17
- P08.7 N Bit-fields: allocation, signedness, size.

### Dynamic memory
- P08.8 T `malloc`, `calloc`, `realloc`, `free`; heap memory lives until freed.
- P08.9 T The errors by name: memory leak, dangling pointer, uninitialised pointer, returning the address of a local.
- P08.10 Q Name the error in a code fragment. PYQ: 2017s1-13, 2017s2-2, 2001-2.18, 2000-1.12

### Preprocessor and const
- P08.11 T `#define` is text substitution: parenthesis traps, a multi-statement macro inside an `if`, macro vs function.
- P08.12 Q Macro vs function behaviour in the same program. PYQ: IT2008-50
- P08.13 N Conditional compilation (`#ifdef`, `#ifndef`, `#if`), `const int *` vs `int * const` vs both, `typedef` vs `#define`.

## P09 · Reasoning about programs
notes: programming-ds/06-program-reasoning
hours: 4

### Identify what code computes
- P09.1 T Method: run it on 2 or 3 tiny inputs, guess the function, test the guess against the options. Never simulate fifty iterations.
- P09.2 Q Which mathematical function: gcd, power, square root, series, Horner, set operation, modular exponentiation. PYQ: 2021s1-48, 2020-48, 2015s3-49, 2006-50, 2004-42, 2004-41, 2003-88, 2003-1, 1999-2.24, 1995-2.3, 1993-7.4, 1991-03.viii, 1990-11b
- P09.3 Q What an array or matrix routine does: max subarray by brute force, swap twice, reverse-based rotation, merge state after a loop, run sums. PYQ: 2017s2-43, 2014s3-10, 2014s1-41, IT2007-31, 2006-53, 2000-2.15
- P09.4 Q Asymptotic size of a returned value. PYQ: 2015s1-31, 2013-31

### Complete or fix code
- P09.5 T Method: test each option on the smallest inputs and on the boundary cases.
- P09.6 Q Fill in the missing condition or statement. PYQ: 2016s1-34, IT2005-58, IT2005-53, 1994-7, 1993-12
- P09.7 Q Spot where a search-style routine goes wrong. PYQ: 2014s3-42

### Loop invariants
- P09.8 T An invariant is true before the loop and after every iteration; invariant + exit condition = postcondition. To answer, check each option before the loop and after one iteration.
- P09.9 Q Pick the invariant or precondition that makes a loop correct. PYQ: 2017s2-37, 2016s2-35, 2015s1-33, 2004-32
- P09.10 L Proof-style invariant and equivalence questions from early papers. PYQ: 1991-1.vi, 1988-8ii, 1988-6ii, 1987-7a

### Early-paper oddities
- P09.11 L One worked pass over unsigned byte arithmetic and a game-tree sketch: not repeated since. PYQ: 1995-3, 1988-6i
