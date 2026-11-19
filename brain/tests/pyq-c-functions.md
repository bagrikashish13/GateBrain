---
title: PYQ · C functions (all 114)
duration: 270
created: 2026-11-19
paper: pyq
description: Every functions PYQ from practicepaper.in, newest first (GATE 2026 back to 1987, plus ISRO). 114 questions, 150 marks.
---

## Q1
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: 1
pyq: 2026s2-51

*GATE CSE 2026 Set 2*

Consider the following ANSI-C function.

```c
int func(int start, int end){
     int length=end+1-start;
     if((length<1)||(start<0)||(end<0)){ return(0); }
     if(length%3==0){
         return(func(start+1, end));
     }else if(length%3==1){
         return(1+func(start, end-1));
     }else {
         return(func(start+2, end));
     }
}
```

The maximum possible value that can be returned from this function is ________. (answer in integer)
Note: Ignore syntax errors (if any) in the function.

### Solution
Track how $\text{length}\bmod3$ evolves across recursive calls, since only the $\text{length}\%3==1$ branch ever adds $1$ to the final result (the other two branches just recurse without contributing anything):

- If current length $\equiv0\ (\text{mod }3)$: recurse with length reduced by $1$ (no addition) → new length $\equiv2\ (\text{mod }3)$.

- If current length $\equiv1\ (\text{mod }3)$: add $1$, recurse with length reduced by $1$ → new length $\equiv0\ (\text{mod }3)$.

- If current length $\equiv2\ (\text{mod }3)$: recurse with length reduced by $2$ (no addition) → new length $\equiv0\ (\text{mod }3)$.

Once the length's residue enters the cycle $0\to2\to0\to2\to\cdots$, it can **never** return to residue $1$ again (the only transitions available from $0$ and $2$ both lead back into this same two-value cycle). So the "$+1$" branch can only ever be triggered **once** in any call chain — specifically only if the very first (initial) call's length happens to be $\equiv1\ (\text{mod }3)$. After that single possible addition, the recursion is permanently locked into the non-adding $0/2$ cycle until it terminates at the base case.

So the maximum possible total returned value, over all valid inputs, is just $1$.

**Answer: 1**

Source: GATE CSE 2026 Set 2. · [Detailed solution](https://gateoverflow.in/523095/gate-cse-2026-set-2-question-51#a_list)

## Q2
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: 65536
pyq: 2026s1-51

*GATE CSE 2026 Set 1*

Consider the recursive functions represented by the following code segment:

```c
int bar(int n) {
  if (n == 1) return 0;
  else return 1 + bar(n/2);
 }
 int foo(int n) {
  if (n == 1) return 1;
  else return 1 + foo(bar(n));
 }
```

The smallest positive integer n for which $\text{foo(n)}$ returns $5$ is ________. (answer in integer)
Note: Ignore syntax errors (if any) in the function.

### Solution
First, note $\text{bar}(n)$ repeatedly integer-halves $n$ until reaching $1$, counting the number of halvings — this is exactly $\lfloor\log_2 n\rfloor$.

$\text{foo}(n)=1+\text{foo}(\text{bar}(n))$ for $n>1$, and $\text{foo}(1)=1$. So $\text{foo}(n)$ counts $1$ plus the number of times we must apply $\text{bar}$ (i.e. take $\lfloor\log_2\cdot\rfloor$) starting from $n$ to eventually reach $1$.

Build up the *smallest* $n$ achieving each target value of $\text{foo}$:

- $\text{foo}(n)=1$: smallest $n=1$.

- $\text{foo}(n)=2$: need $\text{bar}(n)=1$, i.e. $\lfloor\log_2 n\rfloor=1$: smallest $n=2$.

- $\text{foo}(n)=3$: need $\text{bar}(n)=2$: smallest $n=2^2=4$.

- $\text{foo}(n)=4$: need $\text{bar}(n)=4$: smallest $n=2^4=16$.

- $\text{foo}(n)=5$: need $\text{bar}(n)=16$: smallest $n=2^{16}=65536$.

**Answer: 65536**

Source: GATE CSE 2026 Set 1. · [Detailed solution](https://gateoverflow.in/523029/gate-cse-2026-set-1-question-51#a_list)

## Q3
type: NAT
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: 9
pyq: 2026s1-24

*GATE CSE 2026 Set 1*

Consider the following program in C:

```c
#include <stdio.h>
void func(int i, int j) {
 if(i < j) {
     int i = 0;
     while (i < 10) {
         j += 2;
         i++;
     }
 }
 printf("%d", i);
}
int main() {
     int i = 9, j = 10;
     func(i, j);
     return 0;
}
```

The output of the program is ________. (answer in integer)
Note: Assume that the program compiles and runs successfully.

### Solution
Trace the call $\text{func(9, 10)}$ (parameters $i=9,\,j=10$ inside func, independent copies of main's variables):

1. Condition $i\lt j$ i.e. $9\lt 10$ is true, so we enter the block.

2. Inside the block, a **new, block-scoped** variable $\text{int } i=0$ is declared — this shadows/hides the outer parameter $i$ only within this inner block.

3. The while loop runs while this inner $i\lt 10$: it executes $10$ times, each time doing $j{+}{=}2$ (affecting the outer/parameter $j$) and incrementing the inner $i$ (from $0$ up to $10$, at which point the loop stops).

4. Once the block ends, the inner $i$ goes out of scope entirely; the outer parameter $i$ (value $9$) was never touched by anything in the block.

5. $\text{printf("\%d", i)}$ refers to the (unshadowed, outer) parameter $i$, which is still $9$.

**Answer: 9**

Source: GATE CSE 2026 Set 1. · [Detailed solution](https://gateoverflow.in/523056/gate-cse-2026-set-1-question-24#a_list)

## Q4
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: 46
pyq: 2025s2-53

*GATE CSE 2025 Set 2*

Consider the following C program:

```c
#include <stdio.h>

int g(int n) {
    return (n+10);
}

int f(int n) {
    return g(n*2);
}

int main() {
    int sum, n;
    sum=0;
    for (n=1; n<3; n++)
        sum += g(f(n));
    printf ("%d", sum);
    return 0;
}
```

The output of the given C program is ________. (Answer in integer)

### Solution
$g(n)=n+10$, $f(n)=g(n\times2)=2n+10$.

Loop $n=1$ to $2$:

$n{=}1$: $f(1)=2(1)+10=12$; $g(f(1))=g(12)=22$; $\text{sum}=0+22=22$

$n{=}2$: $f(2)=2(2)+10=14$; $g(f(2))=g(14)=24$; $\text{sum}=22+24=46$

**Answer: 46**

Source: GATE CSE 2025 Set 2. · [Detailed solution](https://gateoverflow.in/460840/gate-cse-2025-set-2-question-53#a_list)

## Q5
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: 5
pyq: 2025s1-51

*GATE CSE 2025 Set 1*

```c
#include <stdio.h>
int foo(int S[],int size){
    if(size == 0) return 0;
    if(size == 1) return 1;
    if(S[0] != S[1]) return 1+foo(S+1,size-1);
    return foo(S+1,size-1);
}
int main(){
    int A[]={0,1,2,2,2,0,0,1,1};
    printf("%d",foo(A,9));
    return 0;
}
```

The value printed by the given C program is _________. (Answer in integer).

### Solution
Trace the recursion on $A=[0,1,2,2,2,0,0,1,1]$ (comparing each element to its immediate neighbor, adding $1$ whenever they differ):

$\begin{array}{l}foo([0,1,\ldots])=1+foo([1,2,\ldots])\quad(0\ne1)\\foo([1,2,\ldots])=1+foo([2,2,\ldots])\quad(1\ne2)\\foo([2,2,2,0,\ldots])=foo([2,2,0,\ldots])\quad(2=2)\\foo([2,2,0,\ldots])=foo([2,0,0,\ldots])\quad(2=2)\\foo([2,0,0,1,1])=1+foo([0,0,1,1])\quad(2\ne0)\\foo([0,0,1,1])=foo([0,1,1])\quad(0=0)\\foo([0,1,1])=1+foo([1,1])\quad(0\ne1)\\foo([1,1])=foo([1])\quad(1=1)\\foo([1])=1\quad(\text{base case, size}=1)\end{array}$

Unwinding: $foo([1,1])=1$, $foo([0,1,1])=1+1=2$, $foo([0,0,1,1])=2$, $foo([2,0,0,1,1])=1+2=3$, $foo([2,2,0,\ldots])=3$, $foo([2,2,2,\ldots])=3$, $foo([1,2,\ldots])=1+3=4$, $foo([0,1,\ldots])=1+4=5$.

**Answer: 5**

Source: GATE CSE 2025 Set 1. · [Detailed solution](https://gateoverflow.in/460029/gate-cse-2025-set-1-question-51#a_list)

## Q6
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: A
pyq: 2024s2-3

*GATE CSE 2024 Set 2*

Consider the following C program. Assume parameters to a function are evaluated
from right to left.

```c
#include <stdio.h>
int g(int p) { printf("%d", p); return p; }
int h(int q) { printf("%d", q); return q; }
void f(int x, int y) {
g(x);
h(y);
}
int main() {
f(g(10),h(20));
}
```

Which one of the following options is the CORRECT output of the above
C program?

(A) 20101020
(B) 10202010
(C) 20102010
(D) 10201020

### Solution
Arguments of f are evaluated right to left:

- h(20) first $\rightarrow$ prints **20**

- then g(10) $\rightarrow$ prints **10**

Inside f(10, 20):

- g(x) $\rightarrow$ prints **10**

- h(y) $\rightarrow$ prints **20**

Output: 20101020

**Answer: 20101020**

Source: GATE CSE 2024 Set 2. · [Detailed solution](https://gateoverflow.in/422894/gate-cse-2024-set-2-question-3#a_list)

## Q7
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: 2024s1-9

*GATE CSE 2024 Set 1*

Consider the following C program:

```c
#include <stdio.h>
void fX();
int main(){
fX();
return 0;}

void fX(){
char a;
if((a=getchar()) != '\n')
fX();
if(a != '\n')
putchar(a);}
```

Assume that the input to the program from the command line is 1234 followed by
a newline character. Which one of the following statements is CORRECT?

(A) The program will not terminate
(B) The program will terminate with no outpu
(C) The program will terminate with 4321 as output
(D) The program will terminate with 1234 as output

### Solution
Each call of fX() reads one character and, if it is not newline, calls fX() again *before* printing. Each call has its own local $a$.

Calls read: '1' $\rightarrow$ '2' $\rightarrow$ '3' $\rightarrow$ '4' $\rightarrow$ '\n'. The last call reads newline, makes no further call and prints nothing.

While returning, the calls print their characters in reverse order: 4, 3, 2, 1. Then main returns normally.

**Answer: The program will terminate with 4321 as output**

Source: GATE CSE 2024 Set 1. · [Detailed solution](https://gateoverflow.in/422833/gate-cse-2024-set-1-question-9#a_list)

## Q8
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: A
pyq: 2023-26

*GATE CSE 2023*

Consider the following program:

```c
int main()
{
  f1();
  f2(2);
  f3();
  return(0);
}

int f1()
{
  return(1);
}

int f2(int X)
{
  f3();
  if (X==1)
     return f1();
  else
     return (X*f2(X-1));
}

int f3()
{
  return(5);
}
```

Which one of the following options represents the activation tree corresponding to
the main function?

Each option writes a node's children in call order inside parentheses.

(A) main( f1, f2( f3, f2( f3, f1 ) ), f3 )
(B) main( f1, f2( f3, f1 ), f3 )
(C) main( f1( f2( f3, f1 ) ) )
(D) main( f1, f2( f3, f2, f1 ), f3 )

### Solution
Trace the calls:

- main calls f1(), f2(2), f3() $\rightarrow$ 3 children.

- f2(2) calls f3(), then since X $\ne$ 1, calls f2(1).

- f2(1) calls f3(), then since X == 1, calls f1().

Tree: main $\rightarrow$ {f1, f2, f3}; f2 $\rightarrow$ {f3, f2}; inner f2 $\rightarrow$ {f3, f1}. This matches (A).

**Answer: A**

Source: GATE CSE 2023. · [Detailed solution](https://gateoverflow.in/399285/gate-cse-2023-question-26#a_list_title)

## Q9
type: NAT
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: 7
pyq: 2023-25

*GATE CSE 2023*

The integer value printed by the ANSI-C program given below is ______.

```c
#include <stdio.h>
int funcp(){
   static int x = 1;
   x++;
   return x;
}
int main(){
   int x,y;
   x = funcp();
   y = funcp()+x;
   printf("%d\n", (x+y));
   return 0;
}
```

### Solution
static x in funcp keeps its value between calls (starts at 1).

- x = funcp() $\rightarrow$ static x becomes 2 $\rightarrow$ **x = 2**

- y = funcp() + x $\rightarrow$ static x becomes 3 $\rightarrow$ **y = 3 + 2 = 5**

x + y = 7

**Answer: 7**

Source: GATE CSE 2023. · [Detailed solution](https://gateoverflow.in/399286/gate-cse-2023-question-25#a_list_title)

## Q10
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: 60
pyq: 2021s2-49

*GATE CSE 2021 Set 2*

Consider the following ANSI C program

```c
#include <stdio.h>
int foo(int x, int y, int q)
    {
        if ((x <= 0) && (y <= 0))
        return q;
        if (x <= 0)
        return foo(x, y-q, q);
        if (y <= 0)
        return foo(x-q, y, q);
        return foo(x, y-q, q) + foo(x-q, y, q);
    }
int main( )
{
    int r = foo(15, 15, 10);
    printf("%d", r);
    return 0;
}
```

The output of the program upon execution is ____

### Solution
Let F(x, y) = foo(x, y, 10). Both values go 15 $\rightarrow$ 5 $\rightarrow$ $-$5.

- F($-$5, $-$5) = 10

- F(5, $-$5) = F($-$5, $-$5) = 10, and similarly F($-$5, 5) = 10

- F(5, 5) = F(5, $-$5) + F($-$5, 5) = 20

- F(15, $-$5) = F(5, $-$5) = 10, so F(15, 5) = F(15, $-$5) + F(5, 5) = 30

- By symmetry F(5, 15) = 30

F(15, 15) = F(15, 5) + F(5, 15) = 60

**Answer: 60**

Source: GATE CSE 2021 Set 2. · [Detailed solution](https://gateoverflow.in/357488/gate-cse-2021-set-2-question-49#a_list_title)

## Q11
type: NAT
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: 15
pyq: 2021s2-23

*GATE CSE 2021 Set 2*

Consider the following ANSI C function:

```c
int SomeFunction (int x, int y)
{
    if ((x==1) || (y==1)) return 1;
    if (x==y) return x;
    if (x > y) return SomeFunction(x-y, y);
    if (y > x) return SomeFunction (x, y-x);

}
```

The value returned by SomeFunction(15, 255) is __________

### Solution
The function computes the GCD by repeated subtraction (and stops at 1 if either value hits 1).

SomeFunction(15, 255): 255 $-$ 15 repeatedly $\rightarrow$ (15, 240) $\rightarrow$ $\ldots$ $\rightarrow$ (15, 15) $\rightarrow$ returns 15.

gcd(15, 255) = 15

**Answer: 15**

Source: GATE CSE 2021 Set 2. · [Detailed solution](https://gateoverflow.in/357517/gate-cse-2021-set-2-question-23#a_list_title)

## Q12
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: 1023
pyq: 2021s1-48

*GATE CSE 2021 Set 1*

Consider the following ANSI C function:

```c
int SimpleFunction(int Y[], int n, int x)
{
int total = Y[0], loopIndex;
for (loopIndex=1; loopIndex<=n-1; loopIndex++)
    total=x*total +Y[loopIndex];
return total;
}
```

Let Z be an array of 10 elements with Z[i]=1, for all i such that $0\leq i \leq 9$. The value returned by SimpleFunction(Z,10,2) is __________

### Solution
The function is Horner's rule: it evaluates $Y[0]x^{n-1}+\cdots+Y[n-1]$.

With all Y[i] = 1, x = 2, n = 10: $2^9+2^8+\cdots+1=2^{10}-1=1023$

**Answer: 1023**

Source: GATE CSE 2021 Set 1. · [Detailed solution](https://gateoverflow.in/357403/gate-cse-2021-set-1-question-48#a_list_title)

## Q13
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: B

*ISRO CSE 2020*

In the following procedure

```pascal
Integer procedure P(X,Y);
Integer X,Y;
value x;
begin
      K=5;
      L=8;
      P=x+y;
end
```

X  is called by value and Y is called by name. If the procedure were invoked by the following program fragment

```c
K=0;
L=0;
Z=P(K,L);
```

then the value of Z will be set equal to

(A) 5
(B) 8
(C) 13
(D) 0

### Solution
X is passed by value, so x = 0 is copied at the call. Y is passed by name, so every use of Y means L itself.

Inside P: K = 5 (does not affect x), L = 8, then P = x + Y = 0 + L = 0 + 8 = 8.

**Answer: 8**

Source: ISRO CSE 2020. · [Detailed solution](https://gateoverflow.in/331379/isro2020-78)

## Q14
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D

*ISRO CSE 2020*

What is the output in a 32 bit machine with 32 bit compiler?

```c
#include <stdio.h>
rer(int **ptr2, int **ptr1)
{
    int *ii;
    ii=*ptr2;
    *ptr2=*ptr1;
    *ptr1=ii;
    **ptr1*=**ptr2;
    **ptr2+=**ptr1;
}
void main(){
    int var1=5, var2=10;
    int *ptr1=&var1,*ptr2=&var2;
    rer(&ptr1,&ptr2);
    printf("%d %d",var2,var1);
}
```

(A) 60,70
(B) 50,50
(C) 50,60
(D) 60,50

### Solution
Inside rer, ptr2 = $\&$main.ptr1 and ptr1 = $\&$main.ptr2. The first three lines swap main's pointers: main.ptr1 $\rightarrow$ var2, main.ptr2 $\rightarrow$ var1.

- **ptr1 is var1: var1 *= var2 $\rightarrow$ 5 $\times$ 10 = **50**

- **ptr2 is var2: var2 += var1 $\rightarrow$ 10 + 50 = **60**

printf prints var2 then var1: 60 50

**Answer: 60,50**

Source: ISRO CSE 2020. · [Detailed solution](https://gateoverflow.in/331226/isro2020-63)

## Q15
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D

*ISRO CSE 2020*

Consider the following recursive C function that takes two arguments

```c
 unsigned int rer(unsigned int n, unsigned int r){
    if(n>0)return(n%r + rer(n/r,r));
    else return 0;
}
```

What is the return value of the function rer when it is called as rer(513,2)?

(A) 9
(B) 8
(C) 5
(D) 2

### Solution
rer(n, r) adds the digits of n in base r: n % r is the last digit, and n / r removes it.

513 in binary = 1000000001 $\rightarrow$ sum of digits = 2.

**Answer: 2**

Source: ISRO CSE 2020. · [Detailed solution](https://gateoverflow.in/331460/isro2020-59)

## Q16
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: 81
pyq: 2020-48

*GATE CSE 2020*

Consider the following C functions.

```c
int tob(int b, int* arr) {
    int i;
    for (i = 0; b > 0; i++) {
        if (b % 2) arr[i] = 1;
        else       arr[i] = 0;
        b = b / 2;
    }
    return (i);
}

int pp(int a, int b) {
    int arr[20];
    int i, tot = 1, ex, len;
    ex = a;
    len = tob(b, arr);
    for (i = 0; i < len; i++) {
        if (arr[i] == 1)
            tot = tot * ex;
        ex = ex * ex;
    }
    return (tot);
}
```

The value returned by pp(3,4) is _____

### Solution
tob(b, arr) stores the binary digits of b (LSB first) and returns their count. b = 4 = 100${}_2$ $\rightarrow$ arr = [0, 0, 1], len = 3.

pp computes $a^b$ by repeated squaring: ex goes 3 $\rightarrow$ 9 $\rightarrow$ 81, and tot is multiplied only where the bit is 1 (the third bit) $\rightarrow$ tot = 81.

$3^4=81$

**Answer: 81**

Source: GATE CSE 2020. · [Detailed solution](https://gateoverflow.in/333183/gate2020-cs-48#a_list)

## Q17
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: 55
pyq: 2020-46

*GATE CSE 2020*

Consider the following C functions.

```c
int fun1(int n) {
    static int i = 0;
    if (n > 0) {
        ++i;
        fun1(n - 1);
    }
    return (i);
}

int fun2(int n) {
    static int i = 0;
    if (n > 0) {
        i = i + fun1(n);
        fun2(n - 1);
    }
    return (i);
}
```

The return value of fun2(5) is ______

### Solution
Both functions keep a static i that is **never reset**. fun1(n) adds n to its own i and returns it.

fun2(5) adds fun1(5), fun1(4), $\ldots$, fun1(1) to fun2's i:

- fun1(5) = 5, fun1(4) = 9, fun1(3) = 12, fun1(2) = 14, fun1(1) = 15

fun2's i = 5 + 9 + 12 + 14 + 15 = 55

**Answer: 55**

Source: GATE CSE 2020. · [Detailed solution](https://gateoverflow.in/333185/gate2020-cs-46#a_list)

## Q18
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: B
pyq: 2019-27

*GATE CSE 2019*

Consider the following C program:

```c
#include <stdio.h>
int r(){
 int static num=7;
 return num--;
}
int main() {
 for(r();r();r()) {
  printf("%d ",r());
  };
 return 0;
}
```

Which one of the following values will be displayed on execution of the programs?

(A) 41
(B) 52
(C) 63
(D) 630

### Solution
num is static, starts at 7, and r() returns num and then decrements it.

- init: r() $\rightarrow$ 7 (num = 6)

- condition: r() $\rightarrow$ 6, true; body prints r() $\rightarrow$ **5**

- update: r() $\rightarrow$ 4; condition: r() $\rightarrow$ 3, true; body prints r() $\rightarrow$ **2**

- update: r() $\rightarrow$ 1; condition: r() $\rightarrow$ 0, false $\rightarrow$ stop

Output: 5 2

**Answer: 52**

Source: GATE CSE 2019. · [Detailed solution](https://gateoverflow.in/302821/gate2019-cs-27#a_list)

## Q19
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 2019-26

*GATE CSE 2019*

Consider the following C program:

```c
void convert(int n) {
  if (n<0)
    printf("%d",n);
  else {
    convert(n/2);
    printf("%d",n%2);
  }
}
```

Which one of the following will happen when the function convert is called with any positive integer n as argument?

(A) It will print the binary representation of n and terminate.
(B) It will print the binary representation of n in the reverse order and terminate.
(C) It will print the binary representation of n but will not terminate.
(D) It will not print anything and will not terminate.

### Solution
For positive n, n/2 keeps getting smaller until it becomes 0. But the base case is n $\lt$ 0, which never happens: convert(0) calls convert(0) again forever.

printf comes **after** the recursive call, so nothing is ever printed. The program does not terminate (until the stack overflows).

**Answer: It will not print anything and will not terminate**

Source: GATE CSE 2019. · [Detailed solution](https://gateoverflow.in/302822/gate2019-cs-26#a_list)

## Q20
type: NAT
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: 26
pyq: 2019-18

*GATE CSE 2019*

Consider the following C program:

```c
#include <stdio.h>
  int jumble(int x, int y) {
    x = 2 * x + y;
    return x;
  }
int main() {
  int x = 2, y = 5;
  y = jumble(y, x);
  x = jumble(y, x);
  printf("%d\n", x);
  return 0;
}
```

The value printed by program is __________ .

### Solution
jumble(x, y) returns 2x + y.

- y = jumble(5, 2) = 2$\times$5 + 2 = 12

- x = jumble(12, 2) = 2$\times$12 + 2 = 26

**Answer: 26**

Source: GATE CSE 2019. · [Detailed solution](https://gateoverflow.in/302830/gate2019-cs-18#a_list)

## Q21
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: B

*ISRO CSE 2018*

Consider the following C code segment

```c
int f(int x)
{
    if(x<1) return 1;
    else return (f(x-1) + g(x));
}
int g(int x)
{
    if(x<2) return 2;
    else return (f(x-1) + g(x/2));
}
```

Of the following, which best describes the growth of f(x) as a function of x ?

(A) Linear
(B) Exponential
(C) Quadratic
(D) Cubic

### Solution
$f(x)=f(x-1)+g(x)$ and $g(x)\ge f(x-1)$, so $f(x)\ge2f(x-1)$. The value at least doubles at every step $\rightarrow$ exponential growth.

**Answer: Exponential**

Source: ISRO CSE 2018. · [Detailed solution](https://gateoverflow.in/213516/isro2018-72)

## Q22
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: A

*ISRO CSE 2018*

Consider the following C++ program

```c
int a (int m)
{return ++m;}
int b(int&m)
{return ++m;}
int c(char &m)
{return ++m;}
void main()
{
       int p = 0, q=0, r = 0;
       p += a(b(p)) ;
       q+= b(a(q));
       r+=a(c(r));
       cout << p << q << r;
}
```

Assuming the required header first are already included, the above program

(A) results in compilation error
(B) print 123
(C) print 111
(D) print 322

### Solution
The code has syntax errors: "int{char &m}" has no function name, and "q += b(a(q);)" has a misplaced semicolon. (Also b(a(q)) would pass a temporary to an int&.) So it does not compile.

**Answer: results in compilation error**

Source: ISRO CSE 2018. · [Detailed solution](https://gateoverflow.in/213545/isro2018-43)

## Q23
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: A

*ISRO CSE 2018*

A language with string manipulation facilities uses the following operations.

head(s)- returns the first character of the string s
tails(s)- returns all but the first character of the string s
concat(s1,s2)- concatenates string s1 with s2.

The output of concat(head(s), head(tail(tail(s)))), where s is acbc is:

(A) ab
(B) ba
(C) ac
(D) aa

### Solution
s = acbc. head(s) = a. tail(s) = cbc, tail(cbc) = bc, head(bc) = b.

concat(a, b) = ab

**Answer: ab**

Source: ISRO CSE 2018. · [Detailed solution](https://gateoverflow.in/213580/isro2018-8)

## Q24
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: 10230
pyq: 2018-45

*GATE CSE 2018*

Consider the following program written in pseudo-code. Assume that x and y are integers.

```c
Count(x,y) {
     if (y != 1){
        if (x != 1) {
                  print("*");
                  Count(x/2, y);
                  }
            else {
                     y = y-1;
                    Count(1024, y);
                  }
      }
}
```

The number of times that the print statement is executed by the call
Count(1024,1024) is _____.

### Solution
For each value of y from 1024 down to 2, x is halved from 1024 to 1, printing once per halving: 10 stars. Then y decreases by 1 and x resets to 1024. When y = 1 the recursion stops.

Stars = 10 $\times$ 1023 = 10230

**Answer: 10230**

Source: GATE CSE 2018. · [Detailed solution](https://gateoverflow.in/204120/gate2018-45#a_list)

## Q25
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: A
pyq: 2018-29

*GATE CSE 2018*

Consider the following C program:

```c
#include <stdio.h>
void fun1(char *s1, char *s2){
char *tmp;
tmp = s1;
s1 = s2;
s2 = tmp;
}
void fun2(char **s1, char **s2){
char *tmp;
tmp = *s1;
*s1 = *s2;
*s2 = tmp;
}
int main(){
char *str1 = "Hi", *str2 = "Bye";
fun1(str1, str2);
printf("%s %s ", str1, str2);
fun2(&str1, &str2);
printf("%s %s", str1, str2);
return 0;
}
```

The output of the program above is

(A) Hi Bye Bye Hi
(B) Hi Bye Hi Bye
(C) Bye Hi Hi Bye
(D) Bye Hi Bye Hi

### Solution
Checking each statement:
- fun1 swaps only its own copies of the pointers, so str1 and str2 in main are unchanged $\rightarrow$ "Hi Bye".

- fun2 receives the addresses of str1 and str2 and swaps the pointers themselves $\rightarrow$ "Bye Hi".

**Answer: Hi Bye Bye Hi**

Source: GATE CSE 2018. · [Detailed solution](https://gateoverflow.in/204103/gate2018-29#a_list)

## Q26
type: NAT
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: 4
pyq: 2018-21

*GATE CSE 2018*

Consider the following C program:

```c
#include <stdio.h>
int counter = 0;
int calc (int a, int b) {
    int c;
    counter++;
    if (b==3) return (a*a*a);
    else {
       c = calc(a, b/3);
       return (c*c*c);
           }
}
int main (){
calc(4, 81);
printf ("%d", counter);
}
```

The output of this program is _____.

### Solution
counter increases on every call: calc(4, 81) $\rightarrow$ calc(4, 27) $\rightarrow$ calc(4, 9) $\rightarrow$ calc(4, 3) (base case). 4 calls.

**Answer: 4**

Source: GATE CSE 2018. · [Detailed solution](https://gateoverflow.in/204095/gate2018-21#a_list)

## Q27
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: B

*ISRO CSE 2017*

What is the output of the following program?

```c
#include <stdio.h>
int tmp=20;
main()
{
  printf("%d", tmp);
  func();
  printf("%d", tmp);

}
func()
{
 static int tmp=10;
 printf("%d", tmp);
}
```

(A) 20 10 10
(B) 20 10 20
(C) 20 20 20
(D) 10 10 10

### Solution
main uses the global tmp (20). func has its own static local tmp (10), which hides the global one inside func only.

Output: 20 10 20

**Answer: 20 10 20**

Source: ISRO CSE 2017. · [Detailed solution](https://gateoverflow.in/128754/isro2017-64)

## Q28
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: 2005-1

*ISRO CSE 2017*

What does the following C-statement declare?

```c
int (*f) (int * );
```

(A) A function that takes an integer pointer as argument and returns an integer
(B) A function that takes an integer as argument and returns an integer pointer
(C) A pointer to a function that takes an integer pointer as argument and returns an integer
(D) A function that takes an integer pointer as argument and returns a function pointer

### Solution
Read from the name outwards: (*f) means f is a pointer; (int *) means to a function taking an int pointer; the leading int is its return type.

**Answer: A pointer to a function that takes an integer pointer as argument and returns an integer**

Source: ISRO CSE 2017. · [Detailed solution](https://gateoverflow.in/1343/gate2005-1-isro2017-55)

## Q29
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 2004-2

*ISRO CSE 2017*

Consider the following function

```c
void swap(int a, int b)
{
    int temp;
    temp = a;
    a = b;
    b = temp;
}
```

In order to exchange the values of two variables x and y.

(A) call swap(x,y)
(B) call swap(&x,&y)
(C) swap(x,y)  cannot be used as it does not return any value
(D) swap(x,y)  cannot be used as the parameters are passed by value

### Solution
swap receives copies of x and y (call by value) and exchanges only the copies; x and y in the caller are unchanged. Passing $\&$x, $\&$y would not even match int parameters.

**Answer: swap(x,y) cannot be used as the parameters are passed by value**

Source: ISRO CSE 2017. · [Detailed solution](https://gateoverflow.in/999/gate2004-2-isro2017-54)

## Q30
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C

*ISRO CSE 2017*

What is the output of the C++ program?

```c
#include <iostream>
using namespace std;

void square(int *x){
    *x = (*x)++ * (*x);
}

void square(int *x, int *y){
    *x = (*x) * --(*y);
}

int main()
{
  int number = 30;
  square(&number, &number);
  cout << number;
  return 0;
}
```

(A) 910
(B) 920
(C) 870
(D) 900

### Solution
square($\&$number, $\&$number) calls the two-argument version, where x and y both point to number. Reading *x first gives 30, then --(*y) makes number 29:

*x = 30 $\times$ 29 = 870

(Strictly, mixing a read and a modification of the same variable in one expression has unspecified order; the keyed answer uses left-to-right evaluation.)

**Answer: 870**

Source: ISRO CSE 2017. · [Detailed solution](https://gateoverflow.in/128615/isro2017-41)

## Q31
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: 23
pyq: 2017s1-55

*GATE CSE 2017 Set 1*

The output of executing the following C program is ________.

```c
#include <stdio.h>
int total (int v) {
    static int count = 0;
    while (v) {
        count += v & 1;
        v >>= 1;
    }
    return count;
 }
void main ( ) {
static int x = 0;
int i = 5;
for (; i> 0; i--) {
x=x + total (i) ;
}
printf ("%d\n", x) ; }
```

### Solution
total(v) adds the number of 1-bits of v to a **static** count that is never reset, and returns it.

- i = 5 (101): count = 2 $\rightarrow$ x = 2

- i = 4 (100): count = 3 $\rightarrow$ x = 5

- i = 3 (11): count = 5 $\rightarrow$ x = 10

- i = 2 (10): count = 6 $\rightarrow$ x = 16

- i = 1 (1): count = 7 $\rightarrow$ x = 23

**Answer: 23**

Source: GATE CSE 2017 Set 1. · [Detailed solution](https://gateoverflow.in/118442/gate2017-1-55#a_list)

## Q32
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: 2017s1-36

*GATE CSE 2017 Set 1*

Consider the C functions foo and bar given below:

```c
int foo (int val ) {
    int x = 0;
    while (val > 0) {
    x = x + foo(val--);
}
   return val ;
}
int bar (int val ) {
int x = 0;
while (val > 0) {
    x = x + bar(val-1);}
    return val ;
}
```

Invocations of foo(3) and bar(3) will result in:

(A) Return of 6 and 6 respectively.
(B) Infinite loop and abnormal termination respectively.
(C) Abnormal termination and infinite loop respectively.
(D) Both terminating abnormally

### Solution
Checking each statement:
- foo(3): foo(val--) passes the **old** value 3, so foo(3) calls foo(3) again and again $\rightarrow$ stack overflow $\rightarrow$ **abnormal termination**.

- bar(3) $\rightarrow$ bar(2) $\rightarrow$ bar(1) $\rightarrow$ bar(0) returns 0. Back in bar(1), val is never changed, so while (val $\gt$ 0) loops forever $\rightarrow$ **infinite loop**.

**Answer: Abnormal termination and infinite loop respectively**

Source: GATE CSE 2017 Set 1. · [Detailed solution](https://gateoverflow.in/118319/gate2017-1-36#a_list)

## Q33
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: A
pyq: 2017s1-35

*GATE CSE 2017 Set 1*

Consider the following two functions.

```c
void fun1(int n) {
    if (n == 0) return;
    printf("%d", n);
    fun2(n - 2);
    printf("%d", n);
}

void fun2(int n) {
    if (n == 0) return;
    printf("%d", n);
    fun1(++n);
    printf("%d", n);
}
```

The output printed when fun1(5) is called is

(A) $53423122233445$
(B) $53423120112233$
(C) $53423122132435$
(D) $53423120213243$

### Solution
Trace (each function prints n before and after its call; fun2 calls fun1(++n), so its second print shows n + 1):

fun1(5): 5 $\rightarrow$ fun2(3): 3 $\rightarrow$ fun1(4): 4 $\rightarrow$ fun2(2): 2 $\rightarrow$ fun1(3): 3 $\rightarrow$ fun2(1): 1 $\rightarrow$ fun1(2): 2 $\rightarrow$ fun2(0) returns.

Unwinding: 2, 2, 3, 3, 4, 4, 5.

Output: 5 3 4 2 3 1 2 2 2 3 3 4 4 5

**Answer: 53423122233445**

Source: GATE CSE 2017 Set 1. · [Detailed solution](https://gateoverflow.in/118317/gate2017-1-35#a_list)

## Q34
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D

*ISRO CSE 2016*

Which one of the following is correct about the statements given below?

I.  All function calls are resolved at compile time in C lang

II. All function calls are resolved at compile time in C++ lang

(A) Only II is correct
(B) Both I and II are correct
(C) Only I is correct
(D) Both I and II are incorrect

### Solution
Checking each statement:
- C: calls through function pointers are resolved at run time $\rightarrow$ I is false.

- C++: virtual functions are bound at run time (dynamic dispatch) $\rightarrow$ II is false.

**Answer: Both I and II are incorrect**

Source: ISRO CSE 2016. · [Detailed solution](https://gateoverflow.in/55534/isro2016-79)

## Q35
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: 3
pyq: 2016s2-37

*GATE CSE 2016 Set 2*

Consider thefollowingprogram:

```c
int f(int*p, int n)
{
   if (n<=1)return 0;
    else return max(f(p+1,n-1),p[0]-p[1]);
}
int main()
{
    int a[]={3,5,2,6,4};
    printf("%d", f(a,5));
 }
```

Note: max(x,y) returns the maxi mumof x and y.
The value printed by this program is____________ .

### Solution
f returns the largest value of p[i] $-$ p[i+1] over neighbouring pairs (or 0):

3 $-$ 5 = $-$2, 5 $-$ 2 = 3, 2 $-$ 6 = $-$4, 6 $-$ 4 = 2

max = 3

**Answer: 3**

Source: GATE CSE 2016 Set 2. · [Detailed solution](https://gateoverflow.in/39602/gate2016-2-37#a_list)

## Q36
type: NAT
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: 30
pyq: 2016s2-12

*GATE CSE 2016 Set 2*

The value printed by the following program is .

```c
void f(int*p, int m){
     m =m+5;
     *p =*p+m;
      return;
}
void main(){
     int i=5, j=10;
     f(&i, j);
     printf("%d", i+j);
}
```

### Solution
m is a copy of j: m = 10 + 5 = 15. *p is i: i = 5 + 15 = 20. j stays 10.

i + j = 20 + 10 = 30

**Answer: 30**

Source: GATE CSE 2016 Set 2. · [Detailed solution](https://gateoverflow.in/39565/gate2016-2-12#a_list)

## Q37
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 2016s1-36

*GATE CSE 2016 Set 1*

What will be the output of the following pseudo-code when parameters are passed by reference and dynamic scoping is assumed?

```c
a=3;
void n(x){x=x*a;  print(x);}
void m(y){a=1;a=y-a;n(a);print(a);}
void main(){m(a);}
```

(A) 6,2
(B) 6,6
(C) 4,2
(D) 4,4

### Solution
Read "a = 1" in m as declaring a **local a** of m. y refers to the global a (= 3).

- m: local a = 1, then a = y $-$ a = 3 $-$ 1 = **2**.

- n(a): x refers to m's local a. With dynamic scoping, the a inside n is also m's a (the most recent active a). x = x $\times$ a = 2 $\times$ 2 = 4, and since x is that same a, a becomes 4. Prints **4**.

- Back in m: print(a) prints **4**.

**Answer: 4,4**

Source: GATE CSE 2016 Set 1. · [Detailed solution](https://gateoverflow.in/39701/gate2016-1-36#a_list)

## Q38
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: A
pyq: 2016s1-35

*GATE CSE 2016 Set 1*

What will be the output of the following C program?

```c
void count(int n){
   static int d=1;
   printf("%d ",n);
   printf("%d ",d);
   d++;
   if(n>1) count(n-1);
   printf("%d ",d);
}
void main(){
    count(3);
}
```

(A) 312213444
(B) 312111222
(C) 3122134
(D) 3121112

### Solution
d is static (one copy, starts at 1).

- count(3): prints 3, 1; d = 2; calls count(2)

- count(2): prints 2, 2; d = 3; calls count(1)

- count(1): prints 1, 3; d = 4; prints 4

- back in count(2): prints 4; back in count(3): prints 4

Output: 3 1 2 2 1 3 4 4 4

**Answer: 312213444**

Source: GATE CSE 2016 Set 1. · [Detailed solution](https://gateoverflow.in/39730/gate2016-1-35#a_list)

## Q39
type: NAT
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: 2016
pyq: 2016s1-15

*GATE CSE 2016 Set 1*

Consider  the following C program.

```c
#include <stdio.h>
void mystery(int *ptra,int *ptrb){
   int *temp;
   temp =ptrb;
   ptrb =ptra;
   ptra =temp;
}
int main(){
   int a=2016,b=0,c=4,d=42;
   mystery(&a, &b);
   if (a < c)
            mystery(&c, &a);
   mystery(&a, &d);
   printf("%d\n", a);
}
```

The output of the program is _________.

### Solution
mystery only swaps its **local pointer copies** (ptra, ptrb); it never changes *ptra or *ptrb. So a, b, c, d in main never change.

a is still 2016.

**Answer: 2016**

Source: GATE CSE 2016 Set 1. · [Detailed solution](https://gateoverflow.in/39642/gate2016-1-15#a_list)

## Q40
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 2016s1-12

*GATE CSE 2016 Set 1*

Consider the following C program.

```c
void f(int,short);
void main()
{
int i=100;
short s=12;
short *p=&s;
__________ ;//calltof()
}
```

Which one of the following expressions, when placed in the blank above, will NOT result in a typec hecking error?

(A) f(s,*s)
(B) i=f(i,s)
(C) f(i,*s)
(D) f(i,*p)

### Solution
f takes (int, short) and returns void.

- f(s, *s): s is a short, not a pointer, so *s is invalid.

- i = f(i, s): f returns void, so it cannot be assigned.

- f(i, *s): again *s is invalid.

- **f(i, *p)**: i is int, *p is the short s True

**Answer: f(i,*p)**

Source: GATE CSE 2016 Set 1. · [Detailed solution](https://gateoverflow.in/39638/gate2016-1-12#a_list)

## Q41
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C

*ISRO CSE 2015*

Consider the following code fragment

```c
void foo(int x, int y)
{
    x+=y;
    y+=x;
}
main()
{
    int x=5.5;
    foo(x,x);
}
```

What is the final value of x in both call by value and call by reference, respectively?

(A) 5 and 16
(B) 5 and 12
(C) 5 and 20
(D) 12 and 20

### Solution
x = 5.5 is stored in an int, so x = 5.

- Call by value: foo changes only copies $\rightarrow$ x stays 5

- Call by reference: x and y both refer to x. x += y $\rightarrow$ 10; y += x $\rightarrow$ 20

**Answer: 5 and 20**

Source: ISRO CSE 2015. · [Detailed solution](https://gateoverflow.in/52145/isro2015-80)

## Q42
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: B

*ISRO CSE 2015*

The following program

```c
main()
{
    inc(); inc(); inc();
}
inc()
{
    static int x;
    printf("%d", ++x);
}
```

(A) prints 012
(B) prints 123
(C) prints 3 consecutive, but unpredictable numbers
(D) prints 111

### Solution
A static variable is initialised to 0 once and keeps its value between calls. ++x gives 1, 2, 3.

**Answer: prints 123**

Source: ISRO CSE 2015. · [Detailed solution](https://gateoverflow.in/52131/isro2015-70)

## Q43
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: 0
pyq: 2015s3-49

*GATE CSE 2015 Set 3*

Suppose c=(c[0],...,c[k-1]) is an array of length k, where all the entries are from the set {0,1}. For any positive integers a and n, consider the following pseudocode.

```
DOSOMETHING(c, a, n)
z ← 1
for i ← 0 to k − 1
    do z ← z² mod n
       if c[i] = 1
           then z ← (z × a) mod n
return z
```

If k=4, c=(1,0,1,1), a=2 and n=8, then the output of DOSOMETHING(c,a,n) is _____.

### Solution
z = 1, a = 2, n = 8, c = (1, 0, 1, 1):

- i = 0: z = 1, c = 1 $\rightarrow$ z = 2

- i = 1: z = 4, c = 0

- i = 2: z = 16 mod 8 = 0, c = 1 $\rightarrow$ z = 0

- i = 3: z = 0

(It computes $2^{11}\bmod8=0$.)

**Answer: 0**

Source: GATE CSE 2015 Set 3. · [Detailed solution](https://gateoverflow.in/8558/gate2015-3-53#a_list)

## Q44
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: 230
pyq: 2015s3-54

*GATE CSE 2015 Set 3*

Consider the following C program.

```c
#include <stdio.h>
int f1(void);
int f2(void);
int f3(void);
int x = 10;
int main( )
{
   int x = 1;
   x += f1( ) + f2( ) + f3( ) + f2( );
   printf("%d", x);
   return 0;
}
int f1() { int x = 25; x++; return x;}
int f2() { static int x = 50; x++; return x;}
int f3() { x *= 10; return x;}
```

The output of the program is ________.

### Solution
main's local x = 1.

- f1() = 26 (its own local x)

- f2() = 51 (static x becomes 51)

- f3() changes the global x: 10 $\times$ 10 = 100

- f2() = 52

x = 1 + 26 + 51 + 100 + 52 = 230

**Answer: 230**

Source: GATE CSE 2015 Set 3. · [Detailed solution](https://gateoverflow.in/8563/gate2015-3-32#a_list)

## Q45
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: B
pyq: 2015s3-39

*GATE CSE 2015 Set 3*

Consider the following recursive C function.

```c
void get(int n)
{
if (n<1) return;
get(n-1);
get(n-3);
printf("%d", n);
}
```

If get(6) function is being called in main()then how many times will the get()function be invoked before returning to the main()?

(A) 15
(B) 25
(C) 35
(D) 45

### Solution
Let C(n) = number of calls made by get(n). C(n) = 1 for n $\lt$ 1, else C(n) = 1 + C(n$-$1) + C(n$-$3).

- C(1) = 1 + 1 + 1 = 3

- C(2) = 1 + 3 + 1 = 5

- C(3) = 1 + 5 + 1 = 7

- C(4) = 1 + 7 + 3 = 11

- C(5) = 1 + 11 + 5 = 17

- C(6) = 1 + 17 + 7 = 25

**Answer: 25**

Source: GATE CSE 2015 Set 3. · [Detailed solution](https://gateoverflow.in/8498/gate2015-3-28#a_list)

## Q46
type: NAT
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: 51
pyq: 2015s2-11

*GATE CSE 2015 Set 2*

Consider the following C function.

```c
int fun(int n){
   int x=1,k;
   if (n==1) return x;
   for (k=1; k < n; ++k)
       x = x + fun(k) * fun(n-k);
   return x;
}
```

The return value of fun(5) is ________.

### Solution
$fun(n)=1+\sum_{k=1}^{n-1}fun(k)\,fun(n-k)$, fun(1) = 1:

- fun(2) = 1 + 1 = 2

- fun(3) = 1 + 2 + 2 = 5

- fun(4) = 1 + 5 + 4 + 5 = 15

- fun(5) = 1 + 15 + 10 + 10 + 15 = 51

**Answer: 51**

Source: GATE CSE 2015 Set 2. · [Detailed solution](https://gateoverflow.in/8060/gate2015-2-14#a_list)

## Q47
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 2015s2-15

*GATE CSE 2015 Set 2*

Consider the following function written in the C programming language.

```c
   void foo(char *a){
     if ( *a && *a != ' '){
          foo(a+1);
          putchar(*a);
       }
}
```

The output of the above function on input $"ABCD \;  \; EFGH"$ is

(A) ABCD EFGH
(B) ABCD
(C) HGFE DCBA
(D) DCBA

### Solution
foo first recurses to the next character and prints the current one on the way back, so it prints in reverse. It stops at the end of string or at a space.

Only "ABCD" is processed, printed reversed: DCBA

**Answer: DCBA**

Source: GATE CSE 2015 Set 2. · [Detailed solution](https://gateoverflow.in/8086/gate2015-2-11#a_list)

## Q48
type: NAT
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: -5

*GATE CSE 2015 Set 1*

The output of the following C program is__________.

```c
  void f1(int a, int b) {
    int c;
    c=a; a=b; b=c;
}
void f2(int *a, int *b) {
    int c;
    c=*a; *a=*b; *b=c;
}
int main(){
    int a=4, b=5, c=6;
    f1(a,b);
    f2(&b, &c);
     printf("%d",c-a-b);
}
```

### Solution
Checking each statement:
- f1 swaps copies only (call by value), so a = 4, b = 5 stay.

- f2 swaps through pointers: b = 6, c = 5.

c $-$ a $-$ b = 5 $-$ 4 $-$ 6 = $-$5

**Answer: -5**

Source: GATE CSE 2015 Set 1. · [Detailed solution](https://gateoverflow.in/8185/gate2015-1-24#a_list)

## Q49
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: A

*ISRO CSE 2014*

What is the time complexity for the following C module? Assume that $n \gt 0$.

```c
int module(int n)
{
    if (n == 1)
        return 1;
    else
        return (n + module(n-1));
}
```

(A) O(n)
(B) $O(\log n)$
(C) $O\left(n^{2}\right)$
(D) O(n!)

### Solution
T(n) = T(n $-$ 1) + c: one call for each of n, n$-$1, ..., 1, each doing constant work.

T(n) = O(n)

**Answer: O(n)**

Source: ISRO CSE 2014. · [Detailed solution](https://gateoverflow.in/55082/isro2014-67)

## Q50
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: A

*ISRO CSE 2014*

Which of the following is true with respect to Reference?

(A) A reference can never be NULL
(B) A reference needs an explicit dereferencing mechanism
(C) A reference can be reassigned after it is established
(D) A reference and pointer are synonymous

### Solution
A C++ reference must be bound to an object when created, so it can never be NULL. It is used without explicit dereferencing and cannot be re-bound later, which also makes it different from a pointer.

**Answer: A reference can never be NULL**

Source: ISRO CSE 2014. · [Detailed solution](https://gateoverflow.in/17420/isro2014-13)

## Q51
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 2014s2-42

*GATE CSE 2014 Set 2*

Consider the C function given below

```c
int f(int j)
{
static int i = 50;
int k;
if (i == j)
{
printf("something");
k = f(i);
return 0;
}
else return 0;
}
```

Which one of the following is TRUE?

(A) The function returns 0 for all values of j.
(B) The function prints the string something for all values of j.
(C) The function returns 0 when j = 50.
(D) The function will exhaust the runtime stack or run into an infinite loop when j = 50

### Solution
i is static and stays 50. When j = 50, i == j is true, so f(i) = f(50) is called again, which again finds i == j... The recursion never ends and the stack overflows.

For other j it simply returns 0.

**Answer: The function will exhaust the runtime stack or run into an infinite loop when j = 50**

Source: GATE CSE 2014 Set 2. · [Detailed solution](https://gateoverflow.in/2008/gate2014-2-42#a_list)

## Q52
type: NAT
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: 1.72 to 1.74
pyq: 2014s2-40

*GATE CSE 2014 Set 2*

Consider the following function

```c
double f (double x) {
if ( abs (x*x - 3) < 0.01) return x;
else return f (x / 2 + 1.5/x);
}
```

Give a value q (to 2 decimals) such that f(q) will return q:______

### Solution
f returns x only when $|x^2-3|\lt 0.01$, i.e. $x\approx\sqrt3$. (The recursion x/2 + 1.5/x is Newton's method for $\sqrt3$.)

q = 1.73: $1.73^2=2.9929$, $|2.9929-3|=0.0071\lt 0.01$ $\rightarrow$ f(1.73) returns 1.73.

**Answer: 1.73**

Source: GATE CSE 2014 Set 2. · [Detailed solution](https://gateoverflow.in/2000/gate2014-2-40#a_list)

## Q53
type: NAT
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: 9
pyq: 2014s2-10

*GATE CSE 2014 Set 2*

Consider the function func shown below:

```c
int func(int num) {
int count = 0;
while (num) {
    count++;
    num >>= 1;
}
return (count);
}
```

The value returned by func(435)is __________.

### Solution
The loop shifts num right until it becomes 0, so it counts the number of bits in num.

$435=(110110011)_2$ (256 + 128 + 32 + 16 + 2 + 1) $\rightarrow$ 9 bits.

**Answer: 9**

Source: GATE CSE 2014 Set 2. · [Detailed solution](https://gateoverflow.in/1964/gate2014-2-10#a_list)

## Q54
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C

*ISRO CSE 2013*

Consider the following psuedocode:

```pascal
x: integer := 1
y: integer := 2
procedure add
    x:= x + y
procedure second (P: Procedure)
    x: integer := 2
    p()
procedure first
    y: integer := 3
    second (add)
first ()
write_integer(x)
```

What does it print if the language uses dynamic scoping with deep binding?

(A) 2
(B) 3
(C) 4
(D) 5

### Solution
Dynamic scoping with **deep binding**: the environment `add` runs in is fixed when `add` is *passed* as a parameter, inside `first`.

- At that point the live bindings are `first`'s `y = 3` and the global `x = 1` (`second`'s local `x` doesn't exist yet).
- `add` runs `x := x + y` → global `x` = 1 + 3 = 4.
- `write_integer(x)` in the main program prints the global `x` = 4.

Shallow binding would use `second`'s `x = 2` (giving 5 into `second`'s local, printing 1), which isn't asked here. 2 and 3 come from mixing up which `x` or `y` is live.

**Answer: (C) 4**

Source: ISRO CSE 2013. · [Detailed solution](https://gateoverflow.in/43764/isro-2013-7)

## Q55
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: B
pyq: 2013-42

*GATE CSE 2013*

What is the return value of f(p,p), if the value of p is initialized to 5 before the call? Note that
the first parameter is passed by reference, whereas the second parameter is passed by value.

```c
 int f (int &x, int c) {
  c = c - 1;
  if (c==0) return 1;
   x = x + 1;
return f(x,c) * x;
}
```

(A) 3024
(B) 6561
(C) 55440
(D) 161051

### Solution
`x` is a reference to `p`, `c` is a copy. Each call does `c--`, then (if `c ≠ 0`) `x++` and returns `f(x, c) * x`.

| call | c after `c-1` | p after `x+1` |
|---|---|---|
| 1 | 4 | 6 |
| 2 | 3 | 7 |
| 3 | 2 | 8 |
| 4 | 1 | 9 |
| 5 | 0 | returns 1 |

Each multiplication `f(x,c) * x` happens on the way back, when `p` is already 9. So the result is $1 \times 9 \times 9 \times 9 \times 9 = 6561$.

The trap: 3024 = 6·7·8·9 uses the value of `x` at each call, but `x` is read after the recursive call returns, through the reference.

**Answer: (B) 6561**

Source: GATE CSE 2013. · [Detailed solution](https://gateoverflow.in/60/gate2013-42#a_list)

## Q56
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 2012-49

*GATE CSE 2012*

Consider the following C code segment.

```c
int a, b, c = 0;
void prtFun(void);
main( )
{ static int a = 1; /* Line 1 */
   prtFun( );
   a += 1;
   prtFun( );
   printf(" \n %d %d ", a, b);
}
void prtFun(void)
{ static int a = 2; /* Line 2 */
   int b = 1;
   a += ++b;
   printf(" \n %d %d ", a, b);
}
```

What output will be generated by the given code segment if:

Line 1 is replaced by auto int a = 1;

Line 2 is replaced by register int a = 2;

(A) 3 1; 4 1; 4 2
(B) 4 2; 6 1; 6 1
(C) 4 2; 6 2; 2 0
(D) 4 2; 4 2; 2 0

### Solution
Now main's `a` is a plain local (`auto`, starts 1) and prtFun's `a` is `register`: a local, **re-initialised to 2 on every call**.

- 1st `prtFun()`: `b = 1`, `++b` → 2, `a = 2 + 2 = 4` → prints `4 2`.
- main: `a += 1` → main's `a` = 2.
- 2nd `prtFun()`: fresh `a = 2`, again `4 2`.
- main prints its `a` = 2 and the **global** `b` = 0 (prtFun's `b` is local) → `2 0`.

**Answer: (D) 4 2, 4 2, 2 0**

Source: GATE CSE 2012. · [Detailed solution](https://gateoverflow.in/43314/gate2012-49#a_list)

## Q57
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: 2012-48

*GATE CSE 2012*

Consider the following C code segment.

```c
int a, b, c = 0;
void prtFun(void);
main( )
{ static int a = 1; /* Line 1 */
   prtFun( );
   a += 1;
   prtFun( );
   printf(" \n %d %d ", a, b);
}
void prtFun(void)
{ static int a = 2; /* Line 2 */
   int b = 1;
   a += ++b;
   printf(" \n %d %d ", a, b);
}
```

What output will be generated by the given code segment?

(A) 3 1; 4 1; 4 2
(B) 4 2; 6 1; 6 1
(C) 4 2; 6 2; 2 0
(D) 3 1; 5 2; 5 2

### Solution
prtFun's `a` is `static` (initialised to 2 once, keeps its value); its `b` is a fresh local each call.

- 1st call: `b` → 2, `a = 2 + 2 = 4` → `4 2`.
- main's static `a`: 1 → 2.
- 2nd call: `b` → 2, `a = 4 + 2 = 6` → `6 2`.
- main prints its own `a` = 2 and the global `b` = 0 → `2 0`.

(D) prints prtFun's values in main, but main's `a` and the global `b` are different variables.

**Answer: (C) 4 2, 6 2, 2 0**

Source: GATE CSE 2012. · [Detailed solution](https://gateoverflow.in/2176/gate2012-48#a_list)

## Q58
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 2011-49

*GATE CSE 2011*

Consider the following recursive C function that takes two arguments

```c
 unsigned int foo(unsigned int n, unsigned int r) {
  if (n  > 0) return (n%r +  foo (n/r, r ));
  else return 0;
}
```

What is the return value of the function foo when it is called as foo (513, 2)?

(A) 9
(B) 8
(C) 5
(D) 2

### Solution
`foo(n, r)` adds up `n % r`, then recurses on `n / r`: it is the **sum of the digits of n in base r**.

513 in binary is `1000000001` (512 + 1), so the digit sum is 2.

**Answer: (D) 2**

Source: GATE CSE 2011. · [Detailed solution](https://gateoverflow.in/43324/gate2011-49#a_list)

## Q59
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: B
pyq: 2011-48

*GATE CSE 2011*

Consider the following recursive C function that takes two arguments

```c
 unsigned int foo(unsigned int n, unsigned int r) {
  if (n  > 0) return (n%r +  foo (n/r, r ));
  else return 0;
}
```

What is the return value of the function foo when it is called as foo (345, 10) ?

(A) 345
(B) 12
(C) 5
(D) 3

### Solution
`foo(n, r)` is the sum of the base-r digits of n.

foo(345, 10) = 5 + 4 + 3 + foo(0) = 12.

345 is the number itself, 5 and 3 are single digits.

**Answer: (B) 12**

Source: GATE CSE 2011. · [Detailed solution](https://gateoverflow.in/2154/gate2011-48#a_list)

## Q60
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: 2010-35

*GATE CSE 2010*

What is the value printed by the following C program?

```c
#include <stdio.h>
int f(int * a, int n)
{
    if(n<=0)return 0;
    else if(*a% 2 ==0) return *a+f(a+1,n-1);
    else return *a-f(a+1,n-1);
}
int main ( )
{
    int a[ ] = {12, 7, 13, 4, 11, 6};
    printf ("%d", f(a,6));
    return 0;
}
```

(A) -9
(B) 5
(C) 15
(D) 19

### Solution
Even element: `*a + f(rest)`; odd element: `*a - f(rest)`. Work from the end:

- f({6}) = 6 + 0 = 6
- f({11, 6}) = 11 − 6 = 5
- f({4, 11, 6}) = 4 + 5 = 9
- f({13, 4, 11, 6}) = 13 − 9 = 4
- f({7, 13, …}) = 7 − 4 = 3
- f({12, 7, …}) = 12 + 3 = **15**

**Answer: (C) 15**

Source: GATE CSE 2010. · [Detailed solution](https://gateoverflow.in/2336/gate2010-35#a_list)

## Q61
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 2010-11

*GATE CSE 2010*

What does the following program print?

```c
#include <stdio.h>
void f (int *p, int * q) {
       p=q;
       *p=2;
}
int i= 0, j= 1;
int main ( ){
     f(&i, & j);
     printf( "%d%d \n", i,j);
     return 0;
}
```

(A) 2 2
(B) 2 1
(C) 0 1
(D) 0 2

### Solution
`p` and `q` are copies of `&i` and `&j`. `p = q` changes only the local copy `p`, which now points to `j`. `*p = 2` sets `j = 2`. `i` is untouched.

Output: `0 2`. (A)/(B) assume `p = q` changes `i`'s address or value; it can't.

**Answer: (D) 0 2**

Source: GATE CSE 2010. · [Detailed solution](https://gateoverflow.in/2184/gate2010-11#a_list)

## Q62
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: B

*ISRO CSE 2009*

Consider the following code written in a pass-by-reference language like FORTRAN and these statements about the code.

```c
 subroutine swap(ix,iy)
     it = ix
L1 : ix = iy
L2 : iy = it
    end
    ia = 3
    ib = 8
    call swap (ia, ib+5)
    print *, ia, ib
    end
```

S1: The compiler will  generate code to allocate a temporary nameless cell, initialize it to 13, and pass the address of the cell to swap

S2: On execution the code will generate a runtime error on line L1

S3: On execution the code will generate a runtime error on line L2

S4: The program will print 13 and 8

S5: The program will print 13 and -2

Exactly the following set of statement(s) is correct:

(A) S1 and S2
(B) S1 and S4
(C) S3
(D) S1 and S5

### Solution
With pass-by-reference, an expression like `ib+5` has no address. The compiler evaluates it (13) into a **temporary nameless cell** and passes that cell's address (S1 true).

Inside swap: `ia` becomes 13 and the temporary becomes 3. Nothing ever writes to `ib`. No runtime error happens (S2, S3 false). It prints `13 8` (S4 true, S5 false).

**Answer: (B) S1 and S4**

Source: ISRO CSE 2009. · [Detailed solution](https://gateoverflow.in/1834/gate2006-56-isro2009-58)

## Q63
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: B
pyq: 2009-18

*GATE CSE 2009*

Consider the program below:

```c
#include <stdio.h>
int fun(int n, int * f_p) {
   int t, f;
   if (n <=1) {
         *f_p =1;
          return 1;
   }
   t = fun (n-1, f_p);
   f = t+*f_p;
   *f_p = t;
   return f;
}
int main() {
    int x = 15;
    printf ("%d\n", fun(5,& x));
    return 0;
}
```

The value printed is

(A) 6
(B) 8
(C) 14
(D) 15

### Solution
`fun(n)` returns a Fibonacci number and leaves the previous one in `*f_p`.

| n | t = fun(n−1) | *f_p before | f = t + *f_p | *f_p after |
|---|---|---|---|---|
| 1 | – | – | returns 1 | 1 |
| 2 | 1 | 1 | 2 | 1 |
| 3 | 2 | 1 | 3 | 2 |
| 4 | 3 | 2 | 5 | 3 |
| 5 | 5 | 3 | **8** | 5 |

The initial `x = 15` is overwritten in the base case, so it never matters.

**Answer: (B) 8**

Source: GATE CSE 2009. · [Detailed solution](https://gateoverflow.in/1310/gate2009-18#a_list)

## Q64
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: A

*ISRO CSE 2008*

What is the value of F(4) using the following procedure:

```pascal
function F(K : integer)
integer;
begin
if (k<3) then F:=k else F:=F(k-1)*F(k-2)+F(k-3)
end;
```

(A) 5
(B) 6
(C) 7
(D) 8

### Solution
F(k) = k for k < 3, so F(0) = 0, F(1) = 1, F(2) = 2.

- F(3) = F(2)·F(1) + F(0) = 2·1 + 0 = 2
- F(4) = F(3)·F(2) + F(1) = 2·2 + 1 = **5**

**Answer: (A) 5**

Source: ISRO CSE 2008. · [Detailed solution](https://gateoverflow.in/50136/isro2008-69)

## Q65
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: 2004-31

*ISRO CSE 2008*

Consider the following C function:

```c
int f(int n)
{
    static int i = 1;
    if(n >= 5) return n;
    n = n+i;
    i++;
    return f(n);
}
```

The value returned by f(1) is:

(A) 5
(B) 6
(C) 7
(D) 8

### Solution
`i` is static: initialised once, and it keeps growing across the recursive calls.

- f(1): n = 1 + 1 = 2, i = 2
- f(2): n = 2 + 2 = 4, i = 3
- f(4): n = 4 + 3 = 7, i = 4
- f(7): 7 ≥ 5 → returns **7**

(B) 6 comes from treating `i` as always 1.

**Answer: (C) 7**

Source: ISRO CSE 2008. · [Detailed solution](https://gateoverflow.in/1028/gate2004-31-isro2008-40)

## Q66
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: IT2008-83

*GATE IT 2008*

Consider the code fragment written in C below :

```c
void f (int n)
{
    if (n <= 1)  {
        printf ("%d", n);
    }
    else {
        f (n/2);
        printf ("%d", n%2);
    }
}
```

Which of the following implementations will produce the same output for f(173) as the above code?
P1

```c
void f (int n)
{
    if (n/2)  {
        f(n/2);
    }
    printf ("%d", n%2);
}
```

P2

```c
void f (int n)
{
    if (n <=1)  {
        printf ("%d", n);
    }
    else {
        printf ("%d", n%2);
        f (n/2);
    }
}
```

(A) Both P1 and P2
(B) P2 only
(C) P1 only
(D) Neither P1 nor P2

### Solution
The original prints n in binary, most significant bit first (recurse, then print `n%2`).

- **P1:** recurse while `n/2 ≠ 0`, then print `n%2`. For n = 1 it prints `1%2 = 1`, the same as printing `n`. Same output.
- **P2:** prints `n%2` *before* recursing, so the bits come out reversed (LSB first): `10110101` ≠ `10101101`.

**Answer: (C) P1 only**

Source: GATE IT 2008. · [Detailed solution](https://gateoverflow.in/3407/gate2008-it-83)

## Q67
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: IT2008-82

*GATE IT 2008*

Consider the code fragment written in C below :

```c
void f (int n)
{
  if (n <=1)  {
   printf ("%d", n);
  }
  else {
   f (n/2);
   printf ("%d", n%2);
  }
}
```

What does f(173) print?

(A) 10110101
(B) 010101101
(C) 010110101
(D) 10101101

### Solution
The function prints n in binary, MSB first (it recurses before printing each `n%2`).

173 = 128 + 32 + 8 + 4 + 1 = `10101101`.

(A) is the reversed order (what printing before recursing gives). (B), (C) have an extra leading 0.

**Answer: (D) 10101101**

Source: GATE IT 2008. · [Detailed solution](https://gateoverflow.in/3406/gate2008-it-82)

## Q68
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: IT2008-50

*GATE IT 2008*

Consider the C program below. What does it print?

```c
#include <stdio.h>
# define swap1 (a, b) tmp = a; a = b; b = tmp
void swap2 ( int a, int b)
{
        int tmp;
        tmp = a; a = b; b = tmp;
 }
void swap3 (int*a, int*b)
{
        int tmp;
        tmp = *a; *a = *b; *b = tmp;
}
int main ()
{
        int num1 = 5, num2 = 4, tmp;
        if (num1 < num2) {swap1 (num1, num2);}
        if (num1 < num2) {swap2 (num1 + 1, num2);}
        if (num1 >= num2) {swap3 (&num1, &num2);}
        printf ("%d, %d", num1, num2);
}
```

(A) 5,5
(B) 5,4
(C) 4,5
(D) 4,4

### Solution
`num1 = 5`, `num2 = 4`.

- `if (num1 < num2)`: 5 < 4 is false, so swap1 is skipped.
- Second `if`: still false, so swap2 is skipped (and it would swap only copies anyway).
- `if (num1 >= num2)`: true, so swap3 swaps through pointers → `num1 = 4`, `num2 = 5`.

Prints `4, 5`. (The space in `swap1 (a, b)` turns it into an object-like macro; GATE's intended answer ignores that, and it never runs anyway.)

**Answer: (C) 4,5**

Source: GATE IT 2008. · [Detailed solution](https://gateoverflow.in/3360/gate2008-it-50)

## Q69
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: 2008-75

*GATE CSE 2008*

Consider the following C functions:

```c
int f1(int n)
{
  if(n == 0 || n == 1)
    return n;
  else
    return (2*f1(n-1) + 3*f1(n-2));
}

int f2(int n)
{
  int i;
  int X[N], Y[N], Z[N] ;
  X[0] = Y[0] = Z[0] = 0;
  X[1] = 1; Y[1] = 2; Z[1] = 3;
  for(i = 2; i <= n; i++)
  {
    X[i] = Y[i-1] + Z[i-2];
    Y[i] = 2*X[i];
    Z[i] = 3*X[i];
  }
  return X[n] ;
}
```

f1(8) and f2(8) return the values

(A) 1661 and 1640
(B) 59 and 59
(C) 1640 and 1640
(D) 1640 and 1661

### Solution
**f1:** $f(n) = 2f(n-1) + 3f(n-2)$, with f(0) = 0, f(1) = 1:
0, 1, 2, 7, 20, 61, 182, 547, **1640**.

**f2:** `Y[i-1] = 2X[i-1]` and `Z[i-2] = 3X[i-2]` (this also holds at the start: Y[1] = 2 = 2·X[1], Z[0] = 0). So `X[i] = 2X[i-1] + 3X[i-2]`, the same recurrence with the same start values, done bottom-up. X[8] = **1640**.

**Answer: (C) 1640 and 1640**

Source: GATE CSE 2008. · [Detailed solution](https://gateoverflow.in/43489/gate2008-75#a_list)

## Q70
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 2008-61

*GATE CSE 2008*

Choose the correct option to fill ? 1 and ? 2 so that the program below prints an
input string in reverse order. Assume that the input string is terminated by a
newline character.

```c
 void reverse(void) {
   int c;
   if (?1) reverse ();
   ?2
}
main() {
    printf("Enter Text "); printf("\n") ;
    reverse();  printf("\n");
}
```

(A) ?1 is (getchar ( ) != '\n'); ?2 is getchar (c);
(B) ?1 is (c = getchar ( ) ) != '\n'); ?2 is getchar (c);
(C) ?1 is (c != '\n'); ?2 is putchar (c);
(D) ?1 is ((c = getchar ( ) ) != '\n'); ?2 is putchar (c);

### Solution
Each call must **read one character into its own `c`** and recurse only if it isn't the newline. After the recursive call returns, it prints `c`. The deepest call (the last character) prints first, so the string comes out reversed.

- ?1 = `((c = getchar()) != '\n')`: reads and tests in one step.
- ?2 = `putchar(c);`

(A), (B) use `getchar(c)` to print, which is wrong (B also has unbalanced brackets). (C) tests `c` before anything is read into it.

**Answer: (D)**

Source: GATE CSE 2008. · [Detailed solution](https://gateoverflow.in/484/gate2008-61#a_list)

## Q71
type: MCQ
marks: 2
subject: programming-ds
topic: functions-and-recursion
answer: B
pyq: 2008-60

*GATE CSE 2008*

What is printed by the following C program?

```c
int f(int x, int *py, int **ppz)
{
    int y, z;
    **ppz += 1; z = **ppz;
    *py += 2; y = *py;
    x += 3;
    return x+y+z;
}

void main()
{
    int c, *b, **a;
    c = 4; b = &c; a = &b;
    printf("%d", f(c, b, a));

}
```

(A) 18
(B) 19
(C) 21
(D) 22

### Solution
`b = &c`, `a = &b`, `c = 4`. `x` gets a copy of `c` (4) when f is called.

- `**ppz += 1` → c = 5; `z = 5`
- `*py += 2` → c = 7; `y = 7`
- `x += 3` → x = 4 + 3 = 7 (the copy, not c)
- return 7 + 7 + 5 = **19**

The trap is using the updated c for `x`: `x` was copied before any change.

**Answer: (B) 19**

Source: GATE CSE 2008. · [Detailed solution](https://gateoverflow.in/483/gate2008-60#a_list)

## Q72
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D

*ISRO CSE 2007*

Study the following program

```c
//precondition: x>=0
public void demo(int x)
{
    System.out.print(x % 10);
    if (x % 10 != 0)
    {
        demo(x/10);
    }
    System.out.print(x%10);
}
```

Which of the following is printed as a result of the call demo (1234)?

(A) 1441
(B) 3443
(C) 12344321
(D) 43211234

### Solution
Each call prints `x % 10`, recurses on `x/10` if that digit isn't 0, then prints `x % 10` again.

demo(1234) → 4, demo(123) → 3, demo(12) → 2, demo(1) → 1, and since 1 % 10 ≠ 0, demo(0) → 0 (no recursion) 0. Then on the way back: 1, 2, 3, 4.

Strictly the output is `4321001234`: the call demo(0) adds `00` in the middle. None of the options shows that. ISRO's key is (D), the intended "digits down, then back up" pattern. Remember the method: print before the call = top-down order, print after the call = reversed order.

**Answer: (D) 43211234** (official key; see the note above)

Source: ISRO CSE 2007. · [Detailed solution](https://gateoverflow.in/49496/isro2007-23)

## Q73
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: A
pyq: IT2007-34

*GATE IT 2007*

Consider the program below in a hypothetical programming language which allows global variables and a choice of static or dynamic scoping.

```c
int i ;
program main ()
{
    i = 10;
    call f();
}

procedure f()
{
    int i = 20;
    call g ();
}
procedure g ()
{
    print i;
}
```

Let x be the value printed under static scoping and y be the value printed under dynamic scoping. Then, x and y are:

(A) x=10, y=20
(B) x=20, y=10
(C) x=10, y=10
(D) x=20, y=20

### Solution
**Static scoping:** `g` is defined at the top level, so its `i` is the global `i` = 10 → x = 10.

**Dynamic scoping:** `g` uses the most recent live binding of `i` on the call stack. main → f (declares `i = 20`) → g, so it prints 20 → y = 20.

**Answer: (A) x=10, y=20**

Source: GATE IT 2007. · [Detailed solution](https://gateoverflow.in/3467/gate2007-it-34-ugcnet-dec2012-iii-52)

## Q74
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: IT2007-33

*GATE IT 2007*

Consider the program below in a hypothetical language which allows global variable and a choice of call by reference or call by value methods of parameter passing.

```c
int i ;
program main ()
{
    int j = 60;
    i = 50;
    call f (i, j);
    print i, j;
}
procedure f (x, y)
{
    i = 100;
    x = 10;
    y = y + i ;
}
```

Which one of the following options represents the correct output of the program for the two parameter passing mechanisms?

(A) Call by value : i = 70, j = 10; Call by reference :i = 60, j = 70
(B) Call by value : i = 50, j = 60; Call by reference :i = 50, j = 70
(C) Call by value : i = 10, j = 70; Call by reference :i = 100, j = 60
(D) Call by value : i = 100, j = 60; Call by reference :i = 10, j = 70

### Solution
**Call by value:** `x` and `y` are copies. `i = 100` sets the global `i`; `x = 10` and `y = y + i` change only the copies. Prints i = 100, j = 60.

**Call by reference:** `x` is `i` and `y` is `j`. `i = 100`, then `x = 10` makes `i = 10`, then `y = y + i` = 60 + 10 → `j = 70`. Prints i = 10, j = 70.

**Answer: (D)**

Source: GATE IT 2007. · [Detailed solution](https://gateoverflow.in/3466/gate2007-it-33)

## Q75
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: IT2007-27

*GATE IT 2007*

The function f is defined as follows:

```c
 int f (int n) {
    if (n <= 1) return 1;
    else if (n % 2  ==  0) return f(n/2);
    else return f(3n - 1);
}
```

Assuming that arbitrarily large integers can be passed as a parameter to the function, consider the following statements.

i. The function f terminates for finitely many different values of $n \geq 1$.

ii. The function f terminates for infinitely many different values of $n \geq 1$.

iii. The function f does not terminate for finitely many different values of $n \geq 1$.

iv. The function f does not terminate for infinitely many different values of $n \geq 1$.

Which one of the following options is true of the above?

(A) i and iii
(B) i and iv
(C) ii and iii
(D) ii and iv

### Solution
For odd n, `3n − 1` is even, so it is then halved.

- **Terminates for infinitely many n:** every power of 2 (2 → 1, 4 → 2 → 1, …). So ii is true and i false.
- **Doesn't terminate for infinitely many n:** n = 5 → 14 → 7 → 20 → 10 → 5 loops forever, and so does every 5·2ᵏ (it halves down to 5). So iv is true and iii false.

**Answer: (D) ii and iv**

Source: GATE IT 2007. · [Detailed solution](https://gateoverflow.in/3460/gate2007-it-27)

## Q76
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 2007-42

*GATE CSE 2007*

Consider the following C function:

```c
#include <stdio.h>
int f(int n)
{
    static int r = 0;
    if (n <= 0) return 1;
    if (n > 3)
    {
        r = n;
        return f(n-2)+2;
    }
    return f(n-1)+r;
}

int main()
{
    printf("%d", f(5));
}
```

What is the value of f(5)?

(A) 5
(B) 7
(C) 9
(D) 18

### Solution
`r` is static.

- f(5): 5 > 3, so r = 5; returns f(3) + 2
- f(3): returns f(2) + r
- f(2): f(1) + r; f(1): f(0) + r; f(0) = 1

`r` stays 5 the whole time: f(1) = 6, f(2) = 11, f(3) = 16, f(5) = 16 + 2 = **18**.

**Answer: (D) 18**

Source: GATE CSE 2007. · [Detailed solution](https://gateoverflow.in/1240/gate2007-42#a_list)

## Q77
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: IT2006-52

*GATE IT 2006*

The following function computes the value of  $\binom{m}{n}$ correctly for all legal values $m$ and $n$ $(m \geq 1, n \geq 0 \text{ and } m \gt n)$

```c
int func(int m, int n)
{
    if (E) return 1;
    else return(func(m -1, n) + func(m - 1, n - 1));
}
```

In the above function, which of the following is the correct expression for E?

(A) (n = = 0) || (m = = 1)
(B) (n = = 0) && (m = = 1)
(C) (n = = 0) || (m = = n)
(D) (n = = 0) && (m = = n)

### Solution
The recursion is Pascal's rule, $\binom{m}{n} = \binom{m-1}{n} + \binom{m-1}{n-1}$. It needs both edges of the triangle as base cases: $\binom{m}{0} = 1$ and $\binom{n}{n} = 1$.

So E = `(n == 0) || (m == n)`.

(A) `m == 1` misses $\binom{n}{n}$, e.g. func(2,2) would recurse into func(1,2). With `&&` ((B), (D)) the recursion almost never stops.

**Answer: (C)**

Source: GATE IT 2006. · [Detailed solution](https://gateoverflow.in/3595/gate2006-it-52)

## Q78
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: IT2006-50

*GATE IT 2006*

Which one of the choices given below would be printed when the following program is executed?

```c
#include <stdio.h>
void swap (int *x, int *y)
{
    static int *temp;
    temp = x;
    x = y;
    y = temp;
}
void printab ()
{
    static int i, a = -3, b = -6;
    i = 0;
    while (i <= 4)
    {
        if ((i++)%2 == 1) continue;
        a = a + i;
        b = b + i;
    }
    swap (&a, &b);
    printf("a =  %d, b = %d\n", a, b);
}
main()
{
    printab();
    printab();
}
```

(A) a = 0, b = 3; a = 0, b = 3
(B) a = 3, b = 0; a = 12, b = 9
(C) a = 3, b = 6; a = 3, b = 6
(D) a = 6, b = 3; a = 15, b = 12

### Solution
`swap` only swaps its local pointer copies, so it changes nothing. `a`, `b` are static: they keep their values between calls; `i` is reset to 0 each time.

Loop: `(i++)%2 == 1` tests the old i and skips odd ones. Additions happen with the *new* i after old i = 0, 2, 4, that is +1, +3, +5 = +9.

- 1st call: a = −3 + 9 = 6, b = −6 + 9 = 3 → `a = 6, b = 3`
- 2nd call: a = 15, b = 12

**Answer: (D)**

Source: GATE IT 2006. · [Detailed solution](https://gateoverflow.in/3593/gate2006-it-50)

## Q79
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: 2006-57

*GATE CSE 2006*

Consider the C code to swap two integers and these five statements: the code

```c
void swap(int *px,int *py){
*px=*px-*py;
*py=*px+*py;
*px=*py-*px;
}
```

S1 : will generate a compilation error

S2 : may generate a segmentation fault at runtime depending on the arguments passed

S3 : correctly implements the swap procedure for all input pointers referreing to integers stored in memory locations accessible tot he process

S4 : implements the swap procedure correctly for some but not all valid input pointers

S5 : may add or subtract integers and pointers

(A) S1
(B) S2 and S3
(C) S2 and S4
(D) S2 and S5

### Solution
The arithmetic swap works for distinct ints (ignoring overflow), but:

- If `px == py` (both point to the same int), the first line sets it to 0 and it stays 0. So it is correct for some but not all inputs: **S4** true, S3 false.
- Invalid pointers can segfault: **S2** true.
- It compiles fine (S1 false) and only does integer arithmetic on `*px`, `*py`, never pointer arithmetic (S5 false).

**Answer: (C) S2 and S4**

Source: GATE CSE 2006. · [Detailed solution](https://gateoverflow.in/1835/gate2006-57#a_list)

## Q80
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: B

*GATE CSE 2006*

Consider the following code written in a pass-by reference language like FORTAN
and these statements about the code.

```c
subroutine swap(ix,iy)
     it = ix
L1 : ix = iy
L2 : iy = it
end
  ia = 3
  ib = 8
  call swap (ia, ib+5)
  print *, ia, ib
end
```

S1: The complier will generate code to allocate a temporary nameless cell,
initialize it to 13, and pass the address of the cell to swap

S2: On execution the code will generate a runtime error on line L1

S3: On execution the code will generate a runtime error on line L2
S4: The program will print 13 and 8

S5: The program will print 13 and -2

Exactly the following set of statement (s) is correct:

(A) S1 and S2
(B) S1 and S4
(C) S3
(D) S1 and S5

### Solution
Pass-by-reference with an expression argument: the compiler puts `ib+5` = 13 into a **temporary cell** and passes its address (S1 true).

swap sets `ia = 13` and the temporary to 3. `ib` is never touched, there is no runtime error, and it prints `13 8` (S4 true).

**Answer: (B) S1 and S4**

Source: GATE CSE 2006. · [Detailed solution](https://gateoverflow.in/1834/gate2006-56#a_list)

## Q81
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: IT2005-57

*GATE IT 2005*

What is the output printed by the following program?

```c
#include <stdio.h>
int f(int n, int k) {
    if (n == 0) return 0;
    else if (n % 2) return f(n/2, 2*k) + k;
    else return f(n/2, 2*k) - k;
}

int main () {
    printf("%d", f(20, 1));
    return 0;
}
```

(A) 5
(B) 8
(C) 9
(D) 20

### Solution
Odd n: `f(n/2, 2k) + k`; even n: `f(n/2, 2k) − k`.

| call | n parity | result |
|---|---|---|
| f(1, 16) | odd | f(0) + 16 = 16 |
| f(2, 8) | even | 16 − 8 = 8 |
| f(5, 4) | odd | 8 + 4 = 12 |
| f(10, 2) | even | 12 − 2 = 10 |
| f(20, 1) | even | 10 − 1 = **9** |

**Answer: (C) 9**

Source: GATE IT 2005. · [Detailed solution](https://gateoverflow.in/3818/gate2005-it-57)

## Q82
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 2005-32

*GATE CSE 2005*

Consider the following C-program:

```c
double foo (double); /* Line 1 */
int main()
{
    double da, db;
    // input da
    db = foo(da);
}
double foo(double a)
{
    return a;
}
```

The above code compiled without any error or warning. If Line 1 is deleted, the above code will
show:

(A) no compile warning or error
(B) some compiler-warnings not leading to unintended results
(C) some compiler-warnings due to type-mismatch eventually leading to unintended results
(D) compiler errors

### Solution
Without the prototype, the call `foo(da)` in main makes C89 assume `int foo()`. The later definition `double foo(double a)` then **conflicts with that implicit declaration**: "conflicting types for foo", a compile error, not just a warning.

**Answer: (D) compiler errors**

Source: GATE CSE 2005. · [Detailed solution](https://gateoverflow.in/1368/gate2005-32#a_list)

## Q83
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 2005-31

*GATE CSE 2005*

Consider the following C-program:

```c
void foo(int n, int sum)
{
  int k = 0, j = 0;
  if (n == 0) return;
    k = n % 10;
  j = n / 10;
  sum = sum + k;
  foo (j, sum);
  printf ("%d,", k);
}

int main ()
{
  int a = 2048, sum = 0;
  foo (a, sum);
  printf ("%d\n", sum);

  getchar();
}
```

What does the above program print?

(A) 8, 4, 0, 2, 14
(B) 8, 4, 0, 2, 0
(C) 2, 0, 4, 8, 14
(D) 2, 0, 4, 8, 0

### Solution
Each call takes the last digit `k`, recurses on the rest, and prints `k` **after** returning. So the digits come out in original order: 2, 0, 4, 8.

`sum` is passed by value: the additions happen in the copies. main's `sum` stays 0, so it prints `2,0,4,8,0`.

(A), (B) print the digits reversed; (A), (C) assume `sum` comes back as 14.

**Answer: (D)**

Source: GATE CSE 2005. · [Detailed solution](https://gateoverflow.in/1367/gate2005-31#a_list)

## Q84
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: 2005-1

*GATE CSE 2005*

What does the following C-statement declare?

```c
int ( * f) (int * ) ;
```

(A) A function that takes an integer pointer as argument and returns an integer
(B) A function that takes an integer as argument and returns an integer pointer
(C) A pointer to a function that takes an integer pointer as argument and returns an integer.
(D) A function that takes an integer pointer as argument and returns a function pointer

### Solution
Read from the name outward: `(*f)` means f is a **pointer**; `(...)(int *)` means to a function taking `int *`; `int` at the front means returning int.

Without the brackets, `int *f(int *)` would be a function returning `int *`.

**Answer: (C)**

Source: GATE CSE 2005. · [Detailed solution](https://gateoverflow.in/1343/gate2005-1#a_list)

## Q85
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: B
pyq: IT2004-61

*GATE IT 2004*

Consider the following C program:

```c
#include <stdio.h>
typedef struct {
    char *a;
    char *b;
    } t;
void f1 (t s);
void f2 (t *p);
main()
{
    static t s = {"A", "B"};
    printf ("%s %s\n", s.a, s.b);
    f1(s);
    printf ("%s %s\n", s.a, s.b);
    f2(&s);
}
void f1 (t s)
{
    s.a = "U";
    s.b = "V";
    printf ("%s %s\n", s.a, s.b);
    return;
}
void f2(t *p)
{
    p -> a  = "V";
    p -> b = "W";
    printf("%s %s\n", p -> a, p -> b);
    return;
}
```

What is the output generated by the program ?

(A) A  B; U  V; V  W; V  W
(B) A  B; U  V; A  B; V  W
(C) A  B; U  V; U  V; V  W
(D) A  B; U  V; V  W; U  V

### Solution
`f1(s)` gets a **copy** of the struct: it changes the copy's pointers and prints `U V`, but main's `s` stays `A B`. `f2(&s)` changes the real struct through the pointer and prints `V W`.

Output: `A B`, `U V`, `A B`, `V W`.

**Answer: (B)**

Source: GATE IT 2004. · [Detailed solution](https://gateoverflow.in/3704/gate2004-it-61)

## Q86
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: IT2004-60

*GATE IT 2004*

Choose the correct option to fill the ?1 and ?2 so that the program prints an input string in reverse order. Assume that the input string is terminated by a new line character.

```c
#include <stdio.h>
void wrt_it (void);
int main (void)
{
    printf("Enter Text");
    printf ("\n");
    wrt_it();
    printf ("\n");
    return 0;
}
void wrt_it (void)
{
    int c;
    if (?1)
        wrt_it();
    ?2
}
```

(A) ?1 is  getchar()!= '\n'; ?2 is  getchar(c);
(B) ?1 is  (c=getchar());!= '\n'; ?2 is  getchar(c);
(C) ?1 is  c!= '\n'; ?2 is  putchar(c);
(D) ?1 is  (c=getchar())!= '\n'; ?2 is  putchar(c);

### Solution
Each call reads one character into its own local `c`, recurses if it isn't the newline, then prints `c` after the recursive call returns. The last character is printed first, so the string comes out reversed.

?1 = `(c=getchar()) != '\n'`, ?2 = `putchar(c);`

(A), (B) "print" with `getchar(c)`, and (B) has a stray `;`. (C) tests `c` before reading anything into it.

**Answer: (D)**

Source: GATE IT 2004. · [Detailed solution](https://gateoverflow.in/3703/gate2004-it-60)

## Q87
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: A
pyq: IT2004-59

*GATE IT 2004*

What is the output of the following program?

```c
#include <stdio.h>
int funcf (int x);
int funcg (int y);
main ()
{
    int x = 5, y = 10, count;
    for (count = 1; count <= 2; ++count) {
        y += funcf(x) + funcg(x);
        printf ("%d", y);
    }
}
funcf (int x) {
    int y;
    y = funcg(x);
    return (y);
}
funcg (int x) {
    static int y = 10;
    y += 1;
    return (y + x);
}
```

(A) 43 80
(B) 42 74
(C) 33 37
(D) 32 32

### Solution
funcg's `y` is static (10 at the start); main's `x = 5` throughout.

- count 1: funcf(5) → funcg: y = 11, returns 16. Then funcg(5): y = 12, returns 17. main's y = 10 + 16 + 17 = **43**.
- count 2: funcf → funcg: y = 13 → 18. funcg: y = 14 → 19. y = 43 + 37 = **80**.

**Answer: (A) 43 80**

Source: GATE IT 2004. · [Detailed solution](https://gateoverflow.in/3702/gate2004-it-59)

## Q88
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: 2004-31

*GATE CSE 2004*

Consider the following C function:

```c
int f(int n)
{
   static int i = 1;
   if (n >= 5)
      return n;
   n = n+i;
   i++;
   return f(n);
}
```

The value returned by f(1) is

(A) 5
(B) 6
(C) 7
(D) 8

### Solution
`i` is static: initialised once, and it grows across the calls.

- f(1): n = 2, i = 2
- f(2): n = 4, i = 3
- f(4): n = 7, i = 4
- f(7) returns **7**

**Answer: (C) 7**

Source: GATE CSE 2004. · [Detailed solution](https://gateoverflow.in/1028/gate2004-31#a_list)

## Q89
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 2004-2

*GATE CSE 2004*

Consider the following C function

```c
void swap (int a, int b)
{
   int temp;
   temp = a;
   a = b;
   b = temp;
}
```

In order to exchange the values of two variables x and y.

(A) call swap (x, y)
(B) call swap (&x, &y)
(C) swap (x,y) cannot be used as it does not return any value
(D) swap (x,y) cannot be used as the parameters are passed by value

### Solution
C passes arguments by value: `swap(x, y)` swaps copies `a` and `b`, and `x`, `y` are unchanged.

(B) `swap(&x, &y)` passes addresses to `int` parameters: a type mismatch, and it still only swaps the copies. (C) is wrong because the missing return value isn't the issue.

**Answer: (D)**

Source: GATE CSE 2004. · [Detailed solution](https://gateoverflow.in/999/gate2004-2#a_list)

## Q90
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: A
pyq: 2003-89

*GATE CSE 2003*

Consider the C program shown below.

```c
#include <stdio.h>
#define print(x) printf("%d ", x)
int x;
void Q(int z)
{
    z += x;
    print(z);
}
void P(int *y)
{
    int x = *y + 2;
    Q(x);
    *y = x - 1;
    print(x);
}
main(void)
{
    x = 5;
    P(&x);
    print(x);
}
```

The output of this program is

(A) 12 7 6
(B) 22 12 11
(C) 14 6 6
(D) 7 6 6

### Solution
Global `x = 5`. `P(&x)`: `y` points to the global `x`.

- P's local `x = *y + 2 = 7`
- `Q(7)`: `z = 7 + x`, where Q sees the **global** x = 5 → prints **12**
- `*y = x − 1` = 7 − 1 → global x = 6
- `print(x)` in P prints its local x → **7**
- main prints the global x → **6**

**Answer: (A) 12 7 6**

Source: GATE CSE 2003. · [Detailed solution](https://gateoverflow.in/972/gate2003-89#a_list)

## Q91
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: B
pyq: 2003-74

*GATE CSE 2003*

The following program fragment is written in a programming language that allows
variables and does not allow nested declarations of functions.

```c
global int i = 100, j = 5;
void P(x)
{
    int i = 10;
    print(x + 10);
    i = 200;
    j = 20;
    print(x);
}
main()
{
    P(i + j);
}
```

If the programming language uses dynamic scoping and call by name parameter
passing mechanism, the values printed by the above program are

(A) 115,220
(B) 25,220
(C) 25,15
(D) 115,105

### Solution
**Call by name** substitutes the text `i + j` for `x` in the body, re-evaluated at each use. **Dynamic scoping** means the `i` in it is the most recent binding, which is P's local `i`.

- `print(x + 10)`: i = 10 (local), j = 5 (global) → 15 + 10 = **25**
- `i = 200` (local), `j = 20` (global)
- `print(x)`: 200 + 20 = **220**

(A) 115 evaluates `i` as the global 100, which is the static scoping reading. (D) is call by need with static scoping (that's the other question).

**Answer: (B) 25, 220**

(The practicepaper.in key says (A); GATE's key for this question is (B).)

Source: GATE CSE 2003. · [Detailed solution](https://gateoverflow.in/43575/gate2003-74#a_list)

## Q92
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 2003-73

*GATE CSE 2003*

The following program fragment is written in a programming language that allows
variables and does not allow nested declarations of functions.

```c
global int i = 100, j = 5;
void P(x)
{
    int i = 10;
    print(x + 10);
    i = 200;
    j = 20;
    print(x);
}
main()
{
    P(i + j);
}
```

If the programming language uses static scoping and call by need parameter
passing mechanism, the values printed by the above program are

(A) 115,220
(B) 25,220
(C) 25,15
(D) 115,105

### Solution
**Call by need:** `x` is evaluated once, at its first use, and then remembered. **Static scoping:** `i + j` uses main's environment, the globals.

- First use: `x` = 100 + 5 = 105; prints 105 + 10 = **115**
- `i = 200` changes P's local `i`; `j = 20` changes the global `j`, but `x` is already fixed
- `print(x)` → **105**

**Answer: (D) 115,105**

Source: GATE CSE 2003. · [Detailed solution](https://gateoverflow.in/960/gate2003-73#a_list)

## Q93
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D

*GATE CSE 2002*

The results returned by function under value-result and reference parameter
passing conventions

(A) Do not differ
(B) Differ in the presence of loops
(C) Differ in all cases
(D) May differ in the presence of exception

### Solution
Value-result copies the argument in, works on a local copy, and copies back on **normal return**. Reference works on the actual variable throughout.

They can differ with aliasing, and when the procedure exits abnormally (an exception or a jump out): by reference the changes have already happened, by value-result the copy-back never runs. Of the options, only the exception case is right.

**Answer: (D)**

Source: GATE CSE 2002. · [Detailed solution](https://gateoverflow.in/823/gate2002-1-18#a_list)

## Q94
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: A
pyq: 2000-2.20

*GATE CSE 2000*

The value of j at the end of the execution of the following C program:

```c
int incr (int i)
{
    static int count = 0;
    count = count + i;
    return (count);
}
main () {
    int i, j;
    for (i = 0; i <= 4; i++)
       j = incr (i);
}
```

is:

(A) 10
(B) 4
(C) 6
(D) 7

### Solution
`count` is static: count = 0 + 1 + 2 + 3 + 4 = 10, and `j` holds the last returned value.

**Answer: (A) 10**

Source: GATE CSE 2000. · [Detailed solution](https://gateoverflow.in/667/gate2000-2-20)

## Q95
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 1999-2.24

*GATE CSE 1999*

Consider the following C function definition

```c
int Trial (int a, int b, int c)
{
    if ((a>=b) && (c < b)) return b;
    else if (a >= b) return Trial(a, c, b);
    else return Trial(b, a, c);
}
```

The functional Trial:

(A) Finds the maximum of a, b, and c
(B) Finds the minimum of a, b, and c
(C) Finds the middle number of a, b, c
(D) None of the above

### Solution
For three distinct numbers, Trial keeps rotating the arguments until `a ≥ b > c` and returns `b`, the middle one. For example Trial(1,2,3) → Trial(2,1,3) → Trial(2,3,1) → Trial(3,2,1) → 2.

But with equal values, e.g. Trial(1,1,1): `a ≥ b` but `c < b` is false, so it calls Trial(1,1,1) again. It **never terminates**. So it doesn't always find the middle number.

**Answer: (D) None of the above**

Source: GATE CSE 1999. · [Detailed solution](https://gateoverflow.in/1501/gate1999-2-24)

## Q96
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C

*GATE CSE 1999*

Consider the following program in a language that has dynamic scooping:

```pascal
var x: real;
procedure show;
    begin print(x);end;
procedure small;
    var x: real;
        begin x := 0.125; show; end;
begin x:=0.25
    show; small
    end.
```

Then the output of the program is:

(A) 0.125 0.125
(B) 0.25 0.25
(C) 0.25 0.125
(D) 0.125 0.25

### Solution
Dynamic scoping: `show` prints the most recent live `x` on the call stack.

- main calls `show`: the only `x` is the global one, 0.25
- main calls `small`, which declares its own `x = 0.125` and calls `show`: the most recent `x` is small's, 0.125

Static scoping would print 0.25 twice (B).

**Answer: (C) 0.25 0.125**

Source: GATE CSE 1999. · [Detailed solution](https://gateoverflow.in/1491/gate1999-2-13)

## Q97
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 1998-2.13

*GATE CSE 1998*

What is the result of the following program?

```pascal
program side-effect (input, output);
var x, result: integer;
function f (var x:integer):integer;
begin
    x:=x+1;f:=x;
end
begin
x:=5;
result:=f(x)*f(x);
writeln(result);
end
```

(A) 5
(B) 25
(C) 36
(D) 42

### Solution
`x` is passed by reference, so each call changes the global `x`.

- 1st `f(x)`: x = 6, returns 6
- 2nd `f(x)`: x = 7, returns 7
- result = 6 × 7 = **42**

36 treats both calls as returning 6, but the second call increments the same variable again.

**Answer: (D) 42**

(The practicepaper.in key says (C) 36; by-reference semantics give 42.)

Source: GATE CSE 1998. · [Detailed solution](https://gateoverflow.in/1685/gate1998-2-13)

## Q98
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: 1998-2.12

*GATE CSE 1998*

What value would the following function return for the input x=95?

```pascal
Function fun (x:integer):integer;
Begin
    If x > 100 then fun = x- 10
    Else fun = fun(fun (x+11))
End;
```

(A) 89
(B) 90
(C) 91
(D) 92

### Solution
This is McCarthy's 91 function: for any x ≤ 100 it returns 91.

Trace: fun(95) = fun(fun(106)) = fun(96) = fun(fun(107)) = fun(97) = … = fun(100) = fun(fun(111)) = fun(101) = **91**.

**Answer: (C) 91**

Source: GATE CSE 1998. · [Detailed solution](https://gateoverflow.in/1684/gate1998-2-12)

## Q99
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: A
pyq: 1996-2.16

*GATE CSE 1996*

Which of the following macros can put a macro assembler into an infinite loop?
I.

```c
.MACRO M1, X
.IF EQ, X   ;if X=0 then
M1 X + 1
.ENDC
.IF NE, X   ;if X ≠ 0 then
.WORD X  ;address (X) is stored here
.ENDC
.ENDM
```

II.

```c
.MACRO M2, X
.IF EQ, X
M2 X
.ENDC
.IF NE, X
.WORD X + 1
.ENDC
.ENDM
```

(A) II only
(B) I only
(C) both I and II
(D) None of the above

### Solution
- **M1:** for X = 0 it expands `M1 X + 1`, that is `M1 1`. Now X ≠ 0, so it emits `.WORD 1` and stops. It terminates.
- **M2:** for X = 0 it expands `M2 X`, that is `M2 0` again, and again… forever.

**Answer: (A) II only**

Source: GATE CSE 1996. · [Detailed solution](https://gateoverflow.in/2745/gate1996-2-16)

## Q100
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: 1995-2.9

*GATE CSE 1995*

A language with string manipulation facilities uses the following operations

```c
head(s): first character of a string
tail(s): all but exclude the first character of a string
```

```c
concat(s1, s2): s1s2
```

For the string "acbc" what will be the output of

```c
concat(head(s), head(tail(tail(s))))
```

(A) ac
(B) bc
(C) ab
(D) cc

### Solution
s = "acbc". head(s) = 'a'. tail(s) = "cbc", tail(tail(s)) = "bc", and its head is 'b'.

concat('a', 'b') = **"ab"**

**Answer: (C) ab**

Source: GATE CSE 1995. · [Detailed solution](https://gateoverflow.in/2621/gate1995-2-9)

## Q101
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: A
pyq: 1995-2.4

*GATE CSE 1995*

What is the value of X printed by the following program?

```pascal
program COMPUTE (input, output);
var X:integer;
procedure FIND (X:real);
    begin
        X:=sqrt(X);
    end;
begin
    X:=2
    FIND(X);
    writeln(X);
end.
```

(A) 2
(B) $\sqrt{2}$
(C) Run time error
(D) None of the above

### Solution
FIND's parameter `X` is passed **by value** (no `var`). `X := sqrt(X)` changes only FIND's local real copy. The global integer `X` stays 2. Passing an integer to a real value parameter is legal in Pascal, so there is no error.

**Answer: (A) 2**

Source: GATE CSE 1995. · [Detailed solution](https://gateoverflow.in/2616/gate1995-2-4)

## Q102
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D
pyq: 1995-1.11

*GATE CSE 1995*

What are x and y in the following macro definition?

```c
macro    Add x, y
        Load y
        Mul x
        Store y
end macro
```

(A) Variables
(B) Identifiers
(C) Actual parameters
(D) Formal parameters

### Solution
In a macro definition, the names after the macro name (`x`, `y`) are placeholders replaced at each call: **formal parameters**. The values given at a call are the actual parameters.

**Answer: (D) Formal parameters**

Source: GATE CSE 1995. · [Detailed solution](https://gateoverflow.in/2598/gate1995-1-11)

## Q103
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: 1994-1.20

*GATE CSE 1994*

In which of the following cases is it possible to obtain different results for call-by-reference and call-by-name parameter passing methods?

(A) Passing a constant value as a parameter
(B) Passing the address of an array as a parameter
(C) Passing an array element as a parameter
(D) Passing an array

### Solution
Call by reference fixes the address of `A[i]` once, at the call. Call by name re-evaluates `A[i]` at every use, so if the body changes `i`, it refers to a different element. Results can differ.

A constant, an array, or an array's address denote the same thing however often they're evaluated.

**Answer: (C)**

Source: GATE CSE 1994. · [Detailed solution](https://gateoverflow.in/305/gate1994-1-20)

## Q104
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C

*GATE CSE 1993*

Refer to the PASCAL program shown below.

```pascal
Program PARAM (input, output);
var m, n : integer;
procedure P (var x, y : integer);
var m : integer;
begin
m := 1;
x := y + 1
end;
procedure Q (x:integer; var y : integer);
begin
x:=y+1;
end;
begin
m:=0; P(m,m); write (m);
n:=0; Q(n*1,n); write (n)
end
```

What is the scope of m declared in the main program?

(A) PARAM, P, Q
(B) PARAM, P
(C) PARAM, Q
(D) P, Q

### Solution
P declares its own local `m`, which hides the global `m` inside P. So the global `m` is visible in the main program (PARAM) and in Q, but not in P.

**Answer: (C) PARAM, Q**

(The practicepaper.in key says (A); that ignores the local `m` in P.)

Source: GATE CSE 1993.

## Q105
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: B

*GATE CSE 1993*

Refer to the PASCAL program shown below.

```pascal
Program PARAM (input, output);
var m, n : integer;
procedure P (var x, y : integer);
var m : integer;
begin
m := 1;
x := y + 1
end;
procedure Q (x:integer; var y : integer);
begin
x:=y+1;
end;
begin
m:=0; P(m,m); write (m);
n:=0; Q(n*1,n); write (n)
end
```

The value of n, output by the program PARAM is:

(A) 0, because n is the actual parameter corresponding to x in procedure Q.
(B) 0, because n is the actual parameter to y in procedure Q.
(C) 1, because n is the actual parameter corresponding to x in procedure Q.
(D) 1, because n is the actual parameter corresponding to y in procedure Q.

### Solution
`Q(n*1, n)`: `x` is a value parameter and gets the value of the expression `n*1` = 0 (a copy, not `n`). `y` is a `var` (reference) parameter, so `y` is `n`. Q does `x := y + 1`, which changes only its local copy `x`. `y` (that is, `n`) is never assigned, so `n` stays 0.

(A) is wrong: the actual parameter for `x` is the expression `n*1`, not `n`. (C), (D) say 1, but `n` is never changed.

**Answer: (B)**

(The practicepaper.in key says "none of the above", an option dropped here; the output is 0 and n is the actual parameter of y.)

Source: GATE CSE 1993.

## Q106
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D

*GATE CSE 1993*

Refer to the PASCAL program shown below.

```pascal
Program PARAM (input, output);
var m, n : integer;
procedure P (var x, y : integer);
var m : integer;
begin
m := 1;
x := y + 1
end;
procedure Q (x:integer; var y : integer);
begin
x:=y+1;
end;
begin
m:=0; P(m,m); write (m);
n:=0; Q(n*1,n); write (n)
end
```

The value of m, output by the program PARAM is:

(A) 1, because m is a local variable in P
(B) 0, because m is the actual parameter that corresponds to the formal parameter in p
(C) 0, because both x and y are just reference to m, and y has the value 0
(D) 1, because both x and y are just references to m which gets modified in procedure P

### Solution
`P(m, m)`: both `x` and `y` are `var` parameters, so both are aliases of the global `m`. Inside P, `m := 1` sets P's own local `m`, not the global one. Then `x := y + 1` = 0 + 1 writes 1 into the global `m`. So `write(m)` prints 1.

(A) has the right value for the wrong reason: P's local `m` is a different variable. (B), (C) say 0, but the global `m` is changed through `x`.

**Answer: (D)**

(The practicepaper.in key says (B); that misses the aliasing through `x`.)

Source: GATE CSE 1993. · [Detailed solution](https://gateoverflow.in/2291/gate1993-7-1-2-3)

## Q107
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D

*GATE CSE 2001*

Consider the following program

```pascal
 Program P2
    var n: int:
     procedure W(var x: int)
     begin
         x=x+1;
         print x;
     end

     procedure D
     begin
         var n: int;
         n=3;
         W(n);
     end
begin //beginP2
  n=10;
  D;
end
```

If the language has dynamic scooping and parameters are passed by reference,
what will be printed by the program ?

(A) 10
(B) 11
(C) 3
(D) None of the above

### Solution
Dynamic scoping, by reference. main sets the global `n = 10` and calls D. D declares its own `n = 3` and calls `W(n)`. The argument is D's `n` (it is evaluated in D), so `x` is D's `n`.

`x = x + 1` → 4, and it prints **4**. That isn't among 10, 11 or 3.

**Answer: (D) None of the above**

Source: GATE CSE 2001. · [Detailed solution](https://gateoverflow.in/737/gate2001-2-19#a_list)

## Q108
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: 2001-2.18

*GATE CSE 2001*

Consider the following three functions :

[P1]

```c
int * g (void)
{
  int x= 10;
  return (&x);
}
```

[P2]

```c
int * g (void)
{
  int * px;
  *px= 10;
  return px;
}
```

[P3]

```c
int *g (void)
{
  int *px;
  px = (int *) malloc (sizeof(int));
  *px= 10;
  return px;
}
```

Which of the above three functions are likely to cause problems with pointers ?

(A) Only P3
(B) Only P1 and P3
(C) Only P1 and P2
(D) P1, P2 and P3

### Solution
- **P1:** returns the address of a local variable. `x` dies when g returns, leaving a dangling pointer. Problem.
- **P2:** `px` is uninitialised, so `*px = 10` writes through a garbage pointer. Problem.
- **P3:** `malloc`'d memory outlives the call. Fine (the caller must free it later).

**Answer: (C) Only P1 and P2**

Source: GATE CSE 2001. · [Detailed solution](https://gateoverflow.in/736/gate2001-2-18#a_list)

## Q109
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: B
pyq: 2001-2.17

*GATE CSE 2001*

What is printed by the print statements in the program P1 assuming call by
reference parameter passing ?

```c
Program P1()
{
   x = 10;
   y = 3;
   func1(y,x,x);
   print x;
   print y;
}
func1(x,y,z)
{
   y = y+4;
   z = x+y+z;
}
```

(A) 10, 3
(B) 31, 3
(C) 27, 7
(D) None of the above

### Solution
By reference: in func1, formal `x` is main's `y`, formal `y` is main's `x`, and formal `z` is also main's `x` (aliases).

- `y = y + 4` → main's x = 10 + 4 = 14
- `z = x + y + z` = 3 + 14 + 14 = 31 → main's x = 31

Prints x = 31, y = 3.

**Answer: (B) 31, 3**

Source: GATE CSE 2001. · [Detailed solution](https://gateoverflow.in/735/gate2001-2-17#a_list)

## Q110
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: D

*GATE CSE 1992*

What type of parameter passing mechanism (call-by-value, call-by-reference, call-by-name, or-by-value result) is the following sequence of actions trying to implement for a procedure call P(A[i]) where P (i:integer) is a procedure and A is an integer array?
Is the implementation correct? Explain and correct it if necessary. You are supposed to make only small changes

Create a new local variable, say z.

Assign to z the value of A[i].

Execute the body of P using z for A[i]

Set A[i] to z.?

(A) call-by-value
(B) call-by-reference
(C) call-by-name
(D) call-by-value result

### Solution
Copy the value in (z = A[i]), run the body on the copy, copy it back out (A[i] = z): that is **call-by-value-result** (copy-in/copy-out).

The 1992 question also asked whether this is right. The fix is to compute the *address* of A[i] at entry and copy back to that address, because the body might change `i`.

**Answer: (D)**

Source: GATE CSE 1992. · [Detailed solution](https://gateoverflow.in/589/gate1992-10a)

## Q111
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: C
pyq: 1991-03.viii

*GATE CSE 1991*

Consider the following Pascal function:

```pascal
Function X(M:integer):integer;
Var i:integer;
Begin
    i := 0;
    while i*i < M
    do i:= i+1
    X := i
 end
```

The function call X(N), if N is positive, will return

(A) $\lfloor\sqrt N \rfloor$
(B) $\lfloor\sqrt N \rfloor + 1$
(C) $\lceil \sqrt N \rceil$
(D) $\lceil \sqrt N \rceil + 1$

### Solution
The loop stops at the first i with $i^2 \ge M$, the smallest integer whose square is at least N. That is $\lceil \sqrt N \rceil$.

Check: N = 4 gives i = 2 = ⌈2⌉ (B would give 3); N = 5 gives i = 3 = ⌈2.23⌉ (A would give 2).

**Answer: (C)**

Source: GATE CSE 1991. · [Detailed solution](https://gateoverflow.in/523/gate1991-03-viii)

## Q112
type: MSQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: A, D
pyq: 1989-3.viii

*GATE CSE 1989*

In which of the following case(s) is it possible to obtain different results for call-by-reference and call-by-name parameter passing?

(A) Passing an expression as a parameter
(B) Passing an array as a parameter
(C) Passing a pointer as a parameter
(D) Passing as array element as a parameter

### Solution
Call by reference binds the parameter to one address, fixed at the call. Call by name re-evaluates the argument's text at every use.

- **Expression (A):** by reference, it is evaluated once into a temporary; by name, it is re-evaluated each time. If the body changes a variable in it, the results differ.
- **Array element (D):** `A[i]` by name re-computes the index. If `i` changes in the body, it is a different element.
- An array or a pointer denotes the same object however often it's evaluated: no difference.

**Answer: (A, D)**

Source: GATE CSE 1989. · [Detailed solution](https://gateoverflow.in/37264/gate1989-3-viii)

## Q113
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: B
pyq: 1987-1.xx

*GATE CSE 1987*

For the program given below what will be printed by the write statements marked (1) and (2) in the program if the variables are dynamically scoped?

```pascal
Var x, y:integer;
procedure P(n:integer);
begin
     x := (n+2)/(n-3);
end;

procedure Q
Var x, y:integer;
begin
    x:=3;
    y:=4;
    P(y);
    Write(x);           __(1)
end;

begin
    x:=7;
    y:=8;
    Q;
    Write(x);           __(2)
end.
```

(A) 3, 6
(B) 6, 7
(C) 3, 7
(D) None of the above

### Solution
Dynamic scoping: P's `x` is the most recent live `x`, which is Q's (main → Q → P).

- P(4): Q's x = (4 + 2)/(4 − 3) = 6 → write (1) prints **6**
- The global x is untouched: write (2) prints **7**

**Answer: (B) 6, 7**

Source: GATE CSE 1987. · [Detailed solution](https://gateoverflow.in/80374/gate1987-1-xx)

## Q114
type: MCQ
marks: 1
subject: programming-ds
topic: functions-and-recursion
answer: A
pyq: 1987-1.xix

*GATE CSE 1987*

Study the following program written in a block-structured language:

```pascal
Var x, y:integer;
procedure P(n:integer);
begin
     x:=(n+2)/(n-3);
end;

procedure Q
Var x, y:integer;
begin
    x:=3;
    y:=4;
    P(y);
    Write(x)          __(1)
end;

begin
    x:=7;
    y:=8;
    Q;
Write(x);             __(2)
end.
```

What will be printed by the write statements marked (1) and (2) in the program if the variables are statically scoped?

(A) 3, 6
(B) 6, 7
(C) 3, 7
(D) None of the above.

### Solution
Static scoping: P is declared at the top level, so its `x` is the **global** x.

- Q sets its own local x = 3, y = 4, and calls P(4). P sets the global x = (4 + 2)/(4 − 3) = 6.
- write (1) in Q prints Q's local x = **3**
- write (2) prints the global x = **6**

**Answer: (A) 3, 6**

Source: GATE CSE 1987. · [Detailed solution](https://gateoverflow.in/80373/gate1987-1-xix)
