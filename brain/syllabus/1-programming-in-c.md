# Part 1 · Programming in C

Official GATE 2027 wording (Section 4): "Programming in C. Recursion."

How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic to teach, in this order. Nothing here uses an idea before the line that teaches it: `npm run check:syllabus` proves it.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers or other languages). `Teaches:` names the concepts a line introduces (`concepts.json`).
PYQ ids are newest first. See `README.md` for the rules and `npm run syllabus` for the next step.

## P01 · First programs: variables, types, printing
notes: programming-ds/00-types-and-operators
hours: 1.5

### Shape of a program
- P01.1 T `#include <stdio.h>`, `int main() { ... return 0; }`, every statement ends with `;`. Execution starts at the first line inside `main`.
- P01.2 T Variables: declare with a type, assign with `=`, or initialise on the same line. A local that was never given a value holds garbage.
- P01.3 T `printf("%d\n", x)` prints an int and a newline. One `%d` per value. Teaches: printf

### Integer types
- P01.4 T `short`, `int` and `long` hold whole numbers in a fixed number of bytes. Sizes are stated in the question when they matter. `sizeof(int)` gives the bytes. Teaches: sizeof
- P01.5 T `unsigned` with n bits holds 0 to 2^n - 1. Print it with `%u`. Teaches: unsigned
- P01.6 T Signed n-bit numbers use 2's complement: range -2^(n-1) to 2^(n-1) - 1. To negate: invert every bit, then add 1. Teaches: twos
- P01.7 T Overflow wraps around: in 8-bit signed, 127 + 1 is -128. In unsigned, 0 - 1 is the largest value.

### Characters
- P01.8 T `char` is a 1-byte integer holding a code, such as 65 for `'A'`. `%c` prints the character, `%d` the number. Teaches: char
- P01.9 T Characters do arithmetic as numbers: `'a'+2` is `'c'`, `'5'-'0'` is 5.
- P01.10 T `putchar(c)` prints one character, `getchar()` reads one. Teaches: getchar

### Fractions
- P01.11 T `float` and `double` hold fractions, only approximately, so two calculations that look equal may differ slightly. Print them with `%f`. Teaches: float

### Fair game
- P01.12 N `printf` details: field width `%5d`, `%x` and `%o`, and `printf` returns the number of characters printed. Literals: `0x1F` is hex, `017` is octal. Teaches: hex

## P02 · Arithmetic, conversions and casts
notes: programming-ds/00-types-and-operators
hours: 1.5

### Arithmetic
- P02.1 T `+ - * /` on ints: `/` truncates toward zero, so `7/2` is 3 and `-7/2` is -3. Teaches: intdiv
- P02.2 T `%` works on ints only, and the result takes the sign of the dividend: `-7%3` is -1, `7%-3` is 1.

### Which operator goes first
- P02.3 T Precedence: `* / %` before `+ -`. Brackets override. `2+3*4` is 14. Teaches: precedence
- P02.4 T Associativity: operators of equal precedence go left to right, so `8/2*4` is 16 and `7-3-2` is 2.

### Implicit conversions
- P02.5 T Mixed operands: if either side is `float` or `double`, the other side converts for that one operator. `5/2` is 2 but `5/2.0` is 2.5. Teaches: conversion
- P02.6 T Conversion happens per operator, in evaluation order: work through `2*3/4 + 2.0/5 + 8/5` step by step.
- P02.7 T `char` and `short` become `int` before arithmetic, so `'a'+1` has type `int`.
- P02.8 T Assignment converts to the left side's type: `int i = 3.9` stores 3. `char c = 300` keeps only the low byte.

### Explicit casts
- P02.9 T A cast converts one value: `(float)5/2` is 2.5, `(float)(5/2)` is 2.0. A cast binds tighter than `/`. Teaches: cast
- P02.10 T Casting a fraction to `int` truncates toward zero: `(int)3.9` is 3, `(int)-3.9` is -3.

### PYQs
- P02.11 Q Overflow: which order of multiply and divide computes a formula correctly for large values. PYQ: 2014s2-11

## P03 · Operators and the precedence table
notes: programming-ds/00-types-and-operators
hours: 2

### Assignment
- P03.1 T `=` is an expression whose value is the value stored, and it goes right to left: `a = b = 5`, `y = (x = 5) + 1`.
- P03.2 T Compound assignment treats the right side as bracketed: `x *= 2 + 3` means `x = x * (2 + 3)`. Teaches: compound

### Increment and decrement
- P03.3 T `x++` gives the old value then adds 1. `++x` adds 1 then gives the new value. Same for `--`. GATE does not test one variable changed twice in one expression. Teaches: incdec
- P03.4 Q Trace chains of pre and post increment. PYQ: 2017s2-54

### Comparisons
- P03.5 T `< > <= >= == !=` give 1 or 0, so `3 < 2 < 1` means `(3<2)<1`, which is 1. Teaches: relational
- P03.6 T When one operand is unsigned, the other converts to unsigned first: `-1 > 1u` is true.

### Logical operators
- P03.7 T `&& || !`: any non-zero value is true, and the result is 0 or 1. Teaches: logical
- P03.8 T Short-circuit: `&&` skips its right side if the left is 0, `||` if the left is non-zero, so a side effect on the right may never run.

### Bitwise operators
- P03.9 T `& | ^ ~` work bit by bit. `~x` equals `-x-1` in 2's complement. Teaches: bitwise
- P03.10 T `<<` shifts left (multiply by 2 per step), `>>` shifts right (divide by 2 for non-negative values).
- P03.11 T Idioms: `v & 1` tests the last bit, `v >> 1` drops it, `x & (x-1)` clears the lowest set bit, XOR swaps two values.
- P03.12 Q Bit operations on characters using given ASCII codes. PYQ: 2022-34

### Other operators
- P03.13 T `a ? b : c`: only one of `b` and `c` is evaluated. Nested ternaries group right to left. Teaches: ternary
- P03.14 Q Evaluate a nested ternary. PYQ: 2008-18
- P03.15 T Comma operator: evaluates left to right, the value is the last one, and it has the lowest precedence of all: `x = (1, 2)` stores 2.
- P03.16 T `sizeof` is worked out at compile time and its operand is not evaluated: `sizeof(x++)` leaves `x` unchanged.

### The whole table
- P03.17 T The full precedence, highest first: unary, `* / %`, `+ -`, `<< >>`, relational, `== !=`, `&`, `^`, `|`, `&&`, `||`, `?:`, assignment, comma.
- P03.18 T Right to left: unary, `?:`, assignment. Everything else goes left to right.
- P03.19 T The classic traps: `a & b == c` is `a & (b == c)`. `x = y == z` is `x = (y == z)`. `!a < b` is `(!a) < b`. `a << 1 + 2` is `a << 3`.

## P04 · Control flow
notes: programming-ds/01-control-flow
hours: 2

### Reading old papers
- P04.1 T Old papers write code Pascal-style: `:=` assigns, `begin ... end` is `{ ... }`, `div` and `mod` are `/` and `%`. Read it as C.

### Branching
- P04.2 T `if (c) a; else b;`: any non-zero `c` is true. `if (x = 5)` assigns, and is always true. Teaches: if
- P04.3 T A dangling `else` binds to the nearest unmatched `if`, whatever the indentation says.
- P04.4 Q Trace a dangling else. PYQ: 1995-1.4
- P04.5 Q Find the statement equivalent to an if-else. PYQ: IT2004-15
- P04.6 T `switch (e)`: `e` is an integer, case labels are constants. Execution starts at the matching label and falls through until `break`. `default` runs only if no case matches, wherever it is written. Teaches: switch, break
- P04.7 Q Trace a fall-through. PYQ: 2012-3

### Loops
- P04.8 T `while (c) { ... }`: test, body, test again. Draw the Variable State Table: one row per iteration. Teaches: while
- P04.9 T `for (init; cond; update)`: `init` once, then cond, body, update, and any part may be empty. Teaches: for
- P04.10 T `for (...);` with a semicolon has an empty body. The counter keeps its last value after the loop.
- P04.11 T `do { ... } while (c);` runs the body at least once. Teaches: dowhile
- P04.12 T `break` leaves the innermost loop or `switch`. `continue` jumps to the update or the condition.
- P04.13 T Nested loops: the inner loop runs fully for each outer iteration.
- P04.14 T Loops that never end: a condition that cannot become false, such as an `unsigned` counter with `i >= 0`.
- P04.15 Q Trace a loop to its output. PYQ: 2025s2-23, 2025s1-53, 2024s1-8
- P04.16 Q Count `printf` calls through a fall-through inside a loop. PYQ: 2015s3-48
- P04.17 Q Loops controlled by float values: count iterations when a ratio halves each time. PYQ: 2019-52
- P04.18 Q Short-circuit with a side effect in a loop. PYQ: 2021s1-37

## P05 · Functions, scope and storage
notes: programming-ds/02-functions-and-recursion
hours: 3

### Functions
- P05.1 T Defining and calling: parameters, `return`, `void`. Arguments are copied, so changing a parameter never touches the caller's variable. Teaches: function
- P05.2 Q Value returned by a function with loops. PYQ: 2024s1-38, 2018-32
- P05.3 T Declaration vs definition: a prototype tells the compiler the types before the call.
- P05.4 T Without a prototype the compiler assumes `int`, and argument types are not checked.
- P05.5 Q Decide whether a program compiles, or which warning it gives. PYQ: 2005-32
- P05.6 T The order of evaluating arguments is unspecified, so GATE states it when it matters. Inner calls finish before the outer call starts.
- P05.7 Q Trace nested calls under a given evaluation order. PYQ: 2025s2-53, 2024s2-3, 2019-18

### Scope
- P05.8 T Scope is where a name is visible, lifetime is how long the variable exists. Teaches: scope
- P05.9 T Globals are visible everywhere after their declaration and default to 0. Locals live in their block.
- P05.10 T A name resolves to the innermost declaration visible, so a block can shadow a parameter or a global.
- P05.11 Q Trace shadowed names across blocks and functions. PYQ: 2026s1-24

### Storage classes
- P05.12 T `static` local: one copy, initialised once, keeps its value between calls, defaults to 0. Teaches: static
- P05.13 T `auto`, `register` (a request only), `extern` (declared here, defined elsewhere). `static` at file level hides a name from other files. Teaches: storage
- P05.14 Q Trace `static`, global and local variables with the same name. PYQ: 2023-25, 2019-27, 2015s3-54, 2012-48, 2012-49, IT2004-59, 2000-2.20
- P05.15 Q Loops that count bits in a function, with `static` state. PYQ: 2017s1-55, 2014s2-10

### Memory layout
- P05.16 T Process memory has four parts: code, data/BSS (globals and statics), stack (locals, parameters, return address), heap (asked for at run time, comes later). Teaches: memory
- P05.17 T An activation record (stack frame) is created on each call and removed on return. It holds parameters, locals and the return address.

## P06 · Arrays and pointers
notes: programming-ds/03-arrays-and-pointers
hours: 4

### 1D arrays
- P06.1 T `int a[5]` has indexes 0 to 4, stored next to each other. C does not check bounds. Teaches: array
- P06.2 T `int a[5] = {1, 2}`: missing elements become 0. `int a[] = {1, 2, 3}` has size 3.
- P06.3 T `sizeof(a)/sizeof(a[0])` gives the element count.
- P06.4 Q Array code with a shadowed loop variable. PYQ: IT2008-51

### Pointers
- P06.5 T `&x` is the address of `x`, `int *p = &x` stores it, `*p` reads or writes `x`. Draw the Address-Arrow Scaling Model. Teaches: pointer
- P06.6 T A pointer has the same size whatever it points to. `int *p, q;` makes `q` a plain `int`.
- P06.7 T `scanf("%d", &x)` reads into `x`, which is why it needs the address. It returns the number of items read. Teaches: scanf
- P06.8 T `NULL` points nowhere. `void *` holds any address and must be cast before `*`. A wild pointer was never set; a dangling one points at memory that is gone, such as a local after its function returned. Teaches: nullptr
- P06.9 Q Type-check a call with a pointer argument. PYQ: 2016s1-12

### Pointers as parameters
- P06.10 T C passes by value only: a pointer argument lets the callee change the caller's object, but reassigning the pointer parameter changes nothing in the caller.
- P06.11 T `int **pp` holds the address of a pointer. Changing a caller's pointer needs `**`. Teaches: ptrptr
- P06.12 Q The swap family: which versions really swap. PYQ: 2016s1-15, 2015s1-11, IT2006-50, 2010-11, 2006-57, 2004-2
- P06.13 Q Value and pointer parameters mixed, including `**`. PYQ: 2025s1-24, 2017s2-14, 2016s2-12, 2008-60

### Pointer arithmetic
- P06.14 T `p+1` moves by `sizeof(*p)` bytes. `q-p` counts elements, not bytes. Pointers into one array can be compared.
- P06.15 T `a[i]`, `*(a+i)`, `*(i+a)` and `i[a]` are the same thing.
- P06.16 T An array name decays to a pointer to its first element, except with `sizeof` and `&`. So `sizeof(a)` is the whole array, `sizeof(p)` one pointer, and `&a+1` jumps a whole array.
- P06.17 T Passing an array passes a pointer, so `sizeof` inside the function gives the pointer's size. Negative indexing works: `p[-1]`.
- P06.18 T `*p++`, `(*p)++`, `*++p`, `++*p`: use the precedence table, and say which one changes the pointer and which the value.
- P06.19 Q Trace pointer and array code to its output. PYQ: 2026s2-50, 2025s2-52, 2024s2-26, 2022-11, 2019-53, 2019-24, 2014s1-10

### Reading memory
- P06.20 T Casting to `char *` reads memory byte by byte. Little-endian stores the low byte first, big-endian the high byte. Teaches: endian

## P07 · Multi-dimensional arrays, arrays of pointers, declarations
notes: programming-ds/03-arrays-and-pointers
hours: 3

### 2D arrays
- P07.1 T `int a[2][3]` is stored row after row (row-major), and `a[i]` is a whole row. Teaches: array2d
- P07.2 T `a[i][j]` is `*(*(a+i)+j)`.
- P07.3 T Types and scaling: `a` is a pointer to a row, so `a+1` jumps a row. `*a` is a pointer to an element, so `*a+1` jumps one element.
- P07.4 T 3D arrays, and partly braced initialisers: they fill in order and missing elements are 0.
- P07.5 T Passing a 2D array needs every size but the first: `void f(int a[][3])`.
- P07.6 Q Evaluate 2D and 3D array expressions by hand. PYQ: 2022-33, 2021s2-10, 2020-22, 2015s1-35, IT2008-52
- P07.7 Q Address or element types from a declaration or from intermediate code. PYQ: 2014s2-34, 2002-2.8
- P07.8 Q Code on matrices: are two loops equivalent. PYQ: 2015s3-30

### Pointers and arrays together
- P07.9 T `int (*p)[N]` is one pointer to an array of N. `int *p[N]` is an array of N pointers. Teaches: ptrarray
- P07.10 T `int **` is not `int [][N]`: the first follows two pointers, the second calculates one offset.
- P07.11 Q Arrays of pointers and double pointers. PYQ: 2015s3-26, IT2006-51

### Declarations
- P07.12 T `int (*f)(int)` is a pointer to a function. Call it as `f(3)`. Teaches: funcptr
- P07.13 T Reading a declaration: start at the name, go right, then left, and respect the brackets.
- P07.14 T `typedef` gives a type a new name. Teaches: typedef
- P07.15 Q What a declaration means; which expressions are valid lvalues. PYQ: 2005-1, 2003-2

## P08 · Strings
notes: programming-ds/04-strings
hours: 2

### What a string is
- P08.1 T A string is a `char` array ending in `\0`. `char s[] = "abc"` is a writable array of size 4. `%s` prints up to the `\0`. Teaches: string
- P08.2 T `char *s = "abc"` points to a read-only literal: reading is fine, writing to it is undefined.
- P08.3 T `%s` stops at the first `\0`, so a string starting with `\0` prints nothing. Unfilled array elements are 0.

### The library
- P08.4 T `strlen` excludes the `\0`, while `sizeof` of an array includes it. `strlen` returns an unsigned value. Teaches: strlib
- P08.5 T The unsigned trap: `strlen(s)-strlen(t) > 0` is true unless the lengths are equal.
- P08.6 T How `strcpy`, `strcat` and `strcmp` work inside, as loops over characters.

### Walking with pointers
- P08.7 T `while (*s++)`, `*p++ = *q++`, and `b-a` as a length.
- P08.8 T Common bugs: copying over overlapping memory, forgetting the terminator.
- P08.9 T Characters as numbers in pointer arithmetic: `p + p[3] - p[1]`, `2[p]`.
- P08.10 Q Output of string and character-array code. PYQ: 2025s2-9, 2024s2-23, 2017s2-55, 2017s1-53, 2015s3-7, 2011-22, IT2008-49, 2004-33
- P08.11 Q Swap two strings through `char *` and `char **`. PYQ: 2018-29
- P08.12 Q Find the bug in a character-array procedure and the input that exposes it. PYQ: 2013-51, 2013-50
- P08.13 N Command line arguments: `argc`, `argv`, walking `argv` with pointers. Teaches: argv

## P09 · Recursion
notes: programming-ds/02-functions-and-recursion
hours: 4.5

### Print order
- P09.1 T A function can call itself. Each call gets its own frame with its own locals, and a base case stops it. Use the Activation Stack + Static Store template. Teaches: recursion
- P09.2 T Winding and unwinding: code before the call runs on the way down, code after it runs in reverse on the way up.
- P09.3 Q Print order, reversing input or a string, printing binary digits, recursion that never stops. PYQ: 2024s1-9, 2019-26, 2015s2-15, IT2008-83, IT2008-82, 2008-61, IT2004-60, 2001-13, 1995-2.9, 1989-8a

### Return values
- P09.4 T Work bottom-up: write a small table f(0), f(1), f(2)… instead of expanding every call.
- P09.5 Q Value returned by a recursive function. PYQ: 2026s2-51, 2026s1-51, 2025s1-51, 2021s2-23, 2018-21, 2016s2-37, 2015s2-11, 2011-49, 2011-48, 2010-35, IT2006-52, IT2005-57, 2005-31, 1998-2.12, 1995-4, 1994-6
- P09.6 T A `static` or global is shared by all frames.
- P09.7 T A pointer argument lets every frame share one object.
- P09.8 Q Recursion with `static` variables or a shared pointer. PYQ: 2020-46, 2016s1-35, 2014s2-42, 2009-18, 2007-42, 2004-31

### Counting calls
- P09.9 T Two calls per call: count them with a formula such as C(n) = 1 + C(n-1) + C(n-2).
- P09.10 Q Count calls, or how many times a statement prints. PYQ: 2021s2-49, 2018-45, 2015s3-39, 1991-01.x
- P09.11 T Mutual recursion: keep one frame column per function.
- P09.12 Q Trace two functions calling each other. PYQ: 2017s1-35
- P09.13 T Termination: when recursion never ends, such as `f(val--)` passing the old value, and for which inputs a function halts.
- P09.14 Q Does it terminate, and for which inputs. PYQ: 2017s1-36, IT2007-27

### Stack use
- P09.15 T Stack depth is the space used, and too many frames overflow the stack.
- P09.16 T Tail recursion can become a loop.
- P09.17 T Memoisation stores each result, turning exponentially many calls into linearly many. Teaches: memo
- P09.18 Q How large a stack a recursion needs. PYQ: 1994-21
- P09.19 Q How activation records behave; activation trees and how deep the stack goes. PYQ: 2023-26, 2002-1.17
- P09.20 Q Towers of Hanoi: complete the code; a numeric recursion's fixed point. PYQ: 2014s2-40, 2002-11

## P10 · Parameter passing and scoping in other languages
notes: programming-ds/02-functions-and-recursion
hours: 1.5

### Parameter passing
- P10.1 T Call by reference: the parameter is another name for the caller's variable. Teaches: passing
- P10.2 T Call by value-result: copy in at the call, copy back at return.
- P10.3 T Call by name: the argument's expression is re-evaluated at each use, in the caller's context. When it differs from call by reference.
- P10.4 Q Trace a program under a stated passing method. PYQ: 2013-42, IT2007-33, 2001-2.17

### Scoping
- P10.5 T Static scoping: a free variable comes from the enclosing text. Dynamic scoping: from the most recent caller that has it. Teaches: dynscope
- P10.6 Q Output under static and under dynamic scoping, sometimes with a passing method too. PYQ: 2016s1-36, 2012-36, IT2007-34, 2003-74, 2003-73
- P10.7 L Older pseudo-Pascal versions of the same two ideas: do one, read the rest. PYQ: 1999-15, 1998-2.15, 1998-2.13, 1995-2.4, 1994-1.20, 1993-26, 1992-10b, 1991-09b, 1991-09a, 1991-03.x, 1990-11a, 1989-8b, 1989-3.viii, 1988-8i, 1988-2xv, 1988-2xii, 1987-1.xx, 1987-1.xix

## P11 · Structures and unions
notes: programming-ds/05-structures-and-memory
hours: 2

### Structures
- P11.1 T `struct` groups named members: declare, initialise with a list, read with `.`, nest them, make arrays of them. Teaches: struct
- P11.2 T `p->x` is `(*p).x`.
- P11.3 T Passing a struct copies the whole thing, passing a pointer shares it.
- P11.4 T Precedence with structs: `->` and `.` bind tightest, so `++p->c` increments the member and `p++->c` moves the pointer afterwards.
- P11.5 T A self-referential struct holds a pointer to its own type: `struct node { int v; struct node *next; };`. It is the basis of every linked structure. `typedef struct` shortens the name.
- P11.6 Q Navigate structs through pointers, including casts to `char *`. PYQ: 2018-2, IT2006-49, IT2004-61
- P11.7 Q What a struct declaration means. PYQ: 2000-1.11

### Size and unions
- P11.8 T `sizeof` a struct: the sum of its members if alignment is ignored, otherwise add padding so each member sits at a multiple of its size.
- P11.9 T A `union` is as large as its largest member, and all members share the same bytes. Teaches: union
- P11.10 Q Size of a struct containing a union. PYQ: 2000-1.17
- P11.11 N Bit-fields: allocation, signedness, size. Teaches: bitfield

## P12 · Dynamic memory and the preprocessor
notes: programming-ds/05-structures-and-memory
hours: 2.5

### Dynamic memory
- P12.1 T `malloc(n)` returns n uninitialised bytes from the heap, or `NULL`. `calloc` zeroes them, `realloc` resizes, `free` gives them back. Teaches: malloc
- P12.2 T Heap memory lives until freed, whichever function asked for it.
- P12.3 T The errors by name: memory leak, dangling pointer, uninitialised pointer, returning the address of a local.
- P12.4 Q Name the error in a code fragment. PYQ: 2017s1-13, 2017s2-2, 2001-2.18, 2000-1.12
- P12.5 Q Say where a variable lives: stack, heap or data. PYQ: 2026s2-7
- P12.6 Q Build a chain of structs with `malloc`, then read it back. PYQ: 2021s2-35
- P12.7 T Which features need what: static allocation cannot support recursion, because each call needs its own frame. The stack serves recursion. The heap serves data that outlives a call.
- P12.8 Q Which language features need the stack or the heap. PYQ: 2014s3-18, 2014s2-18, 2010-14, 2008-54, 1997-1.10, 1997-1.8, 1990-2.v, 1989-10a

### Preprocessor
- P12.9 T `#define N 10` is text substitution before compilation. `#define SQ(x) x*x` breaks on `SQ(a+1)`, so bracket everything. Teaches: macro
- P12.10 T A multi-statement macro inside an `if` guards only its first statement. A macro argument with `++` is evaluated as often as it appears. There is no type check and no copy.
- P12.11 Q Macro vs function behaviour in the same program. PYQ: IT2008-50, IT2004-58, 2003-89
- P12.12 N Conditional compilation: `#ifdef`, `#ifndef`, `#if`. Teaches: condcomp
- P12.13 N `const int *p` fixes the value, `int * const p` fixes the pointer. `typedef` vs `#define`. Teaches: const
- P12.14 Q Decide whether a program compiles, now with all of C available. PYQ: 2026s2-9

## P13 · Reasoning about programs
notes: programming-ds/06-program-reasoning
hours: 4

### Identify what code computes
- P13.1 T Method: run it on 2 or 3 tiny inputs, guess the function, test the guess against the options. Never simulate fifty iterations.
- P13.2 Q Which mathematical function: gcd, power, square root, series, Horner, set operation, modular exponentiation. PYQ: 2021s1-48, 2020-48, 2015s3-49, 2006-50, 2004-42, 2004-41, 2003-88, 2003-1, 1999-2.24, 1995-2.3, 1993-7.4, 1991-03.viii, 1990-11b
- P13.3 Q What an array or matrix routine does: max subarray by brute force, swap twice, reverse-based rotation, merge state after a loop, run sums. PYQ: 2017s2-43, 2014s3-10, 2014s1-41, IT2007-31, 2006-53, 2000-2.15

### Complete or fix code
- P13.4 T Method: test each option on the smallest inputs and on the boundary cases.
- P13.5 Q Fill in the missing condition or statement. PYQ: 2016s1-34, IT2005-58, IT2005-53, 1994-7, 1993-12

### Loop invariants
- P13.6 T An invariant is true before the loop and after every iteration. Teaches: invariant
- P13.7 T Invariant + exit condition = postcondition. To answer, check each option before the loop and after one iteration.
- P13.8 Q Pick the invariant or precondition that makes a loop correct. PYQ: 2017s2-37, 2016s2-35, 2015s1-33, 2004-32
- P13.9 L Proof-style invariant and equivalence questions from early papers. PYQ: 1991-1.vi, 1988-8ii, 1988-6ii, 1987-7a

### Early-paper oddities
- P13.10 L `goto`, structured programming, paradigms, type systems, aliasing: recall only, one line each. PYQ: 2004-90, 2004-1, 2003-24, 2002-2.18, 2000-1.16, 1999-2.5, 1994-1.5, 1989-3.i Teaches: goto
- P13.11 L One worked pass over unsigned byte arithmetic: not repeated since. PYQ: 1995-3
