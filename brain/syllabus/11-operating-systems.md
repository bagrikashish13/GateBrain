# Part 11 · Operating Systems

Official GATE 2027 wording (Section 8): "System calls, processes, threads, inter-process communication, concurrency and synchronization. Deadlock. CPU and I/O scheduling. Memory management and virtual memory. File systems."

Anytime track: no dates, never in the day's plan. The student finished OS before this syllabus existed, so every concept line is marked seen (one hard check each, teach only what the check exposes) and the PYQ patterns are the practice: she solves them herself.
Weight from the papers: 8.0 marks a paper since 2014, 8.0 since 2021. Memory (paging, the TLB, virtual memory, page replacement) is about 2.5 of it, CPU scheduling 1.6, synchronization 1.1, disks and file systems 1.1, deadlock 0.9, threads and fork 0.6.
Order: processes and kernel mode first (everything builds on them), then the heaviest topics as far as prerequisites allow: memory and virtual memory, CPU scheduling, threads and fork, synchronization (its questions use threads), deadlock (its questions use semaphores), disks, file systems.
How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic, in this order. Nothing here uses an idea before the line that teaches it: `npm run check:syllabus` proves it.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers, or another subject's material filed under OS). `Teaches:` names the concepts a line introduces (`concepts.json`).
PYQ ids are newest first. See `README.md` for the rules and `npm run syllabus -- next os` for the next step.

## OS01 · Processes, kernel mode and system calls
notes: os/01-processes-threads
hours: 1.5

### Processes and their states
- OS01.1 T A process is a program in execution: its code, data, heap and stack, plus a process control block (PCB) holding its state, program counter, registers, open files and memory information.
- OS01.2 T Five states: new, ready, running, waiting (blocked) and terminated; ready → running is dispatch, running → waiting an I/O request or event wait, waiting → ready when it completes, running → terminated on exit. Teaches: process-state
- OS01.3 T Preemption: in a preemptive OS a running process can be sent back to ready (a timer interrupt, a higher-priority arrival); a non-preemptive OS lets it run until it blocks or exits. Teaches: preemption
- OS01.4 T Waiting never goes straight to running, and ready never goes straight to waiting.
- OS01.5 T With n CPUs at most n processes are running at once; any number can be ready or waiting.
- OS01.6 Q Which state transitions are possible, and what a state diagram says about the OS (preemptive or not, batch or time-shared). PYQ: 2024s1-15, 2020-12, 2015s3-1, 2009-32, IT2006-13, 2002-18.a, 1996-1.18
- OS01.7 T Multiprogramming keeps several programs in memory so the CPU switches to another when one waits for I/O; time sharing adds a timer that switches between them regularly.
- OS01.8 Q What makes an OS multiprogrammed; which events interrupt a running process. PYQ: 2002-2.21, 2001-2.20

### Kernel mode and system calls
- OS01.9 T Dual mode: privileged instructions (I/O, changing the mode, setting the timer) run only in kernel mode; a user program enters the kernel only through a trap: a system call, an exception or an interrupt. Teaches: kernel-mode
- OS01.10 T A system call is a software interrupt (trap) into the kernel; strlen runs entirely in user mode and malloc asks the kernel only when the heap must grow, while exit, sleep, read and write always need it.
- OS01.11 T Kernel mode to user mode is a privileged instruction (the return from the trap); user mode to kernel mode only a trap.
- OS01.12 Q Which library calls always enter kernel mode, how system calls are invoked, how the mode changes, and why I/O instructions are privileged. PYQ: 2021s1-14, 2005-20, 2001-1.13, 1999-1.11
- OS01.13 T A signal is a software notification to a process (Ctrl-C sends one); the process can catch it with a handler, ignore it, or take the default action.
- OS01.14 Q Signals and their handlers. PYQ: IT2005-19

### Context switch
- OS01.15 T A context switch saves the running process's state (program counter, registers, stack pointer) in its PCB and loads the next one's; it is pure overhead. Teaches: context-switch
- OS01.16 T A switch between two user processes costs more than a switch between user and kernel mode, which only changes the mode.
- OS01.17 Q Context-switch costs, and how many switches a program's I/O calls cause. PYQ: 2025s1-19, 2011-6

### Interrupts and I/O, the OS side
- OS01.18 T On an interrupt the CPU finishes the current instruction, saves the program counter and status, and jumps through the interrupt vector to the handler; afterwards the interrupted process resumes, or the scheduler picks another.
- OS01.19 T Interrupt priorities: urgent or fast devices (a temperature alarm, a disk) outrank slow ones (keyboard, mouse, printer).
- OS01.20 Q The order of events when a device interrupts, which device gets the higher priority, what the OS does on an interrupt, and what software interrupts are for. PYQ: 2018-9, 2011-11, 2001-1.12, 1998-1.18, 1997-3.8
- OS01.21 T Spooling keeps the output for a slow shared device (a printer) on disk, so jobs never wait for the device; I/O redirection connects a program's input or output to a file.
- OS01.22 Q Spooled devices and I/O redirection. PYQ: 1998-1.29, 1997-3.7, 1996-1.20
- OS01.23 L Interrupt, DMA and I/O hardware (the COA side, asked under OS). PYQ: IT2006-8, 2005-19, IT2004-11, 1993-6.8

## OS02 · Memory allocation and paging
notes: os/05-memory-management
hours: 2.5

### Contiguous allocation
- OS02.1 T Logical (virtual) addresses are what a program uses, physical addresses are real memory locations, and the MMU translates every logical address at run time. Teaches: logical-address
- OS02.2 T Contiguous allocation gives each process one block: a relocation (base) register is added to every address and a limit register checks it.
- OS02.3 T Fixed partitions waste space inside a partition (internal fragmentation); variable partitions leave free holes between processes (external fragmentation), which compaction removes.
- OS02.4 T Placing a process in a hole: first fit takes the first hole big enough, best fit the smallest that fits, worst fit the largest, next fit continues from the last placement. Teaches: fit-policy
- OS02.5 T Best fit leaves the smallest leftover holes and worst fit the largest; first fit is the quickest to search.
- OS02.6 Q Place a sequence of requests by first, best or worst fit: which holes remain, which request fails, when a job finishes. PYQ: 2026s2-45, 2020-11, 2015s2-30, IT2007-11, 1998-7.b, 1996-2.18, 1995-5, 1994-1.24
- OS02.7 N Buddy system: block sizes are powers of 2; a request is served by halving a block until it just fits, and a freed block merges with its buddy.
- OS02.8 L Overlays: parts of a program that never run together share the same memory. PYQ: 1998-2.16
- OS02.9 L Memory modules on a shared bus: the write rate when each write holds the bus and then the module (COA material, asked under OS). PYQ: 2014s2-55

### Paging
- OS02.10 T Paging splits logical memory into pages and physical memory into frames of the same size; any page can sit in any frame, so there is no external fragmentation, only internal fragmentation in a process's last page. Teaches: paging
- OS02.11 T A logical address is a page number and an offset: with page size 2^d the low d bits are the offset; the physical address is the frame number followed by the same offset.
- OS02.12 T The page table has one entry per page, holding the frame number and flag bits (valid, dirty, referenced, protection); it is indexed by page number, so the page number itself is not stored.
- OS02.13 T Page-table size = number of pages × entry size; an entry needs the frame-number bits plus the flag bits, rounded up to whole bytes.
- OS02.14 Q Translate an address; count pages and frames; page-table size; the bits left for flags in an entry; what an entry holds. PYQ: 2025s1-4, 2024s1-52, 2016s1-47, 2015s2-47, 2015s1-12, 2009-10, IT2004-66, 2001-2.21
- OS02.15 N Inverted page table: one entry per frame (process id and page number), searched through a hash table; its size depends on physical memory, not on the virtual address space.

### Multilevel page tables
- OS02.16 T A one-level table for a large virtual space is huge and must be contiguous; a multilevel table pages the page table itself, and only the inner tables actually in use need to exist. Teaches: multilevel-paging
- OS02.17 T When each table fits one page, a level indexes page size ÷ entry size entries, so it takes log2 of that many address bits.
- OS02.18 T Levels needed = page-number bits ÷ bits per level, rounded up; the memory a process's tables take is the sum, over the levels, of the tables needed to map the pages it uses.
- OS02.19 Q Bits per level, number of levels, the size of the tables a process needs, why multilevel tables save memory, and which statements about paging hold. PYQ: 2025s2-48, 2024s2-54, 2023-48, 2021s2-48, 2021s1-11, 2013-53, 2013-52, 2008-67, 2003-79, 2003-26, 2002-19

## OS03 · Demand paging and page replacement
notes: os/06-virtual-memory
hours: 2.5

### Demand paging
- OS03.1 T Virtual memory keeps only part of each process in memory and the rest in swap space on disk; demand paging loads a page only when it is first touched. Teaches: page-fault
- OS03.2 T A page fault: touching a page marked invalid traps to the OS, which finds a free frame (or evicts a victim, writing it back only if dirty), reads the page from disk, updates the page table and restarts the instruction.
- OS03.3 T The MMU (hardware) translates and raises the fault; the OS (software) handles it: allocating frames, choosing victims and filling in the page table are OS jobs.
- OS03.4 Q Who does what, the MMU or the OS; what a page fault involves (and that it always enters kernel mode); where swap space lives and what it holds. PYQ: 2024s2-14, 2023-13, 2005-21, 2001-1.20
- OS03.5 T Virtual memory lets a program bigger than physical memory run and gives each process its own protected address space; the virtual space is bounded by the address bits and the swap space, not by RAM.
- OS03.6 Q What virtual memory does and doesn't do: true and false statements, and what a system without it would lose. PYQ: 2006-63, 2001-1.8, 1999-2.11, 1999-2.10, 1995-2.16, 1994-1.21, 1990-1.v
- OS03.7 T Effective access time with page faults = (1 − p)·m + p·(fault service time); the service time is about a million memory accesses, so p must be tiny.
- OS03.8 Q Effective access time with page faults, with dirty-page writes, or the fault rate a target time allows. PYQ: 2018-10, 2011-20, IT2007-58, 2000-2.22, 1998-2.18, 1990-7.b
- OS03.9 T The fewest frames a process can run with is set by the instruction set: the most pages a single instruction can touch.
- OS03.10 Q What sets the minimum number of frames. PYQ: 2004-21

### Page replacement
- OS03.11 T FIFO evicts the page loaded earliest, optimal the page whose next use is farthest away, LRU the page unused for the longest time. Teaches: page-replacement
- OS03.12 T To count faults, track the frames after every reference; the first touch of each page is always a fault.
- OS03.13 Q Count page faults for FIFO, LRU or optimal on a reference string, or on addresses turned into page numbers; identify the policy from the frame contents. PYQ: 2025s2-37, 2022-54, 2015s1-47, 2014s3-20, 2014s1-33, 2012-42, IT2008-41, 2007-83, 2007-82, IT2007-12, 1996-7, 1995-2.7, 1993-21
- OS03.14 Q Faults when a loop sweeps more pages than there are frames (FIFO, LRU, LIFO, MRU on long cyclic patterns). PYQ: 2016s1-49, 2014s2-33, 2010-24
- OS03.15 Q Page faults of a program walking an array row by row or column by column. PYQ: 2023-47
- OS03.16 T Belady's anomaly: under FIFO, more frames can cause more faults; LRU and optimal (stack algorithms) never show it.
- OS03.17 Q Which policies can show Belady's anomaly. PYQ: 2017s1-40, 2016s2-20, 2009-9, 2007-56, 2001-1.21, 1995-1.8
- OS03.18 Q Variants and properties: optimal with limited look-ahead, what optimal and LRU really select, a heavily used page evicted early. PYQ: 2025s1-44, 2002-1.23, 1994-1.13
- OS03.19 T Locality of reference: a program keeps using a small set of pages (temporal) and nearby addresses (spatial), which is why paging works.
- OS03.20 T Thrashing: too many processes for the frames, so each spends its time page-faulting and CPU use collapses; the working-set model keeps each process's recently used pages in memory and suspends a process when the working sets don't fit. Teaches: thrashing
- OS03.21 Q Thrashing, locality, working sets, the page-table flag bits (dirty, referenced) and what they are for, and why more RAM helps. PYQ: IT2008-56, IT2006-12, 2005-22, 1997-3.9, 1997-3.5, 1997-3.10, 1992-12.b

## OS04 · The TLB and segmentation
notes: os/06-virtual-memory
hours: 1

### Translation with a TLB
- OS04.1 T The TLB is a small associative cache of recent page-to-frame translations: a hit skips the page-table walk. Teaches: tlb
- OS04.2 T Effective memory access time with one level: h(t + m) + (1 − h)(t + 2m), where t is the TLB lookup and m one memory access; with k levels a miss costs k + 1 memory accesses.
- OS04.3 T If the TLB is searched in parallel with the first memory access, drop t from the miss term; read which one the question says.
- OS04.4 Q Effective memory access time with a TLB, with one or more page-table levels (and a cache, where given). PYQ: 2020-53, 2014s3-33, IT2008-16, 2003-78
- OS04.5 T TLB reach = number of entries × page size; in a set-associative TLB the tag is the virtual page number minus the set-index bits.
- OS04.6 Q TLB reach, the addresses translatable without a miss, TLB tag bits, and which statements about the TLB and multilevel tables hold. PYQ: 2026s2-44, 2022-28, 2019-33, 2015s2-25, 2009-34, 2006-62
- OS04.7 T On a process switch the registers and program counter are saved; the TLB is not saved but flushed (or its entries tagged with an address-space id), because the next process has its own translations.
- OS04.8 Q What a context switch saves, flushes or leaves alone. PYQ: 2000-1.20, 1999-2.12

### Segmentation
- OS04.9 T Segmentation divides a program into variable-size logical segments (code, data, stack), each with a base and a limit, so external fragmentation returns; segmented paging pages each segment. Teaches: segmentation
- OS04.10 Q Segment tables, segmented paging, and why a large segment table is itself paged. PYQ: IT2006-56, 1999-19, 1995-1.7

## OS05 · CPU scheduling
notes: os/04-cpu-scheduling
hours: 3

### Criteria
- OS05.1 T The short-term scheduler picks the next ready process; processes alternate CPU bursts and I/O bursts. Teaches: scheduling
- OS05.2 T Per process: turnaround time = completion − arrival, waiting time = turnaround − burst, response time = first run − arrival.
- OS05.3 Q What the criteria mean and what a scheduler optimises. PYQ: 2021s2-14, 1988-2xa, 1988-2xb

### The algorithms
- OS05.4 T FCFS runs processes in arrival order, without preemption; short jobs can wait behind a long one (the convoy effect).
- OS05.5 T SJF runs the shortest next burst first and gives the least average waiting time; SRTF is its preemptive form: a new arrival shorter than the running process's remaining time takes the CPU.
- OS05.6 T Priority scheduling (preemptive or not) can starve low-priority processes; aging raises the priority of those that wait.
- OS05.7 T Round robin gives each process at most one time quantum, then moves it to the tail of the ready queue; read the question's rule for a process arriving just as another's quantum ends.
- OS05.8 Q FCFS, SJF and priority scheduling: average waiting or turnaround time, the best order, idle time, and which algorithm gives the least turnaround. PYQ: 2021s1-25, 2020-50, 2017s2-51, 2015s3-34, IT2005-60, 1995-2.6
- OS05.9 Q SRTF and other preemptive length-based rules (longest remaining time first): waiting and turnaround times, context switches, a missing burst time. PYQ: 2025s2-16, 2024s2-27, 2019-41, 2017s1-24, 2016s2-47, 2014s3-32, 2014s1-32, 2011-35, 2007-55, 2006-64, 2006-06, 2004-46
- OS05.10 Q Round robin: completion order and times, context switches. PYQ: 2022-32, 2012-31, 1996-2.20, 1993-7.10
- OS05.11 Q Which algorithms can starve, which cannot be preemptive, which suit time sharing. PYQ: 2026s2-13, 2023-17, 2016s1-20, 2010-25, 2002-1.22, 1995-1.15
- OS05.12 T A quantum longer than every burst turns round robin into FCFS; a very small quantum makes switching overhead dominate.
- OS05.13 Q The effect of the time quantum, and the quantum that keeps every process's wait within a bound. PYQ: IT2008-55, 1998-2.17
- OS05.14 T Highest response ratio next picks the largest (waiting + burst) ÷ burst: it favours short jobs but ages long ones.
- OS05.15 Q Response-ratio and waiting-time priorities: which policy a rule turns into. PYQ: 2013-10, 1990-1.vi

### Harder setups
- OS05.16 Q Processes that alternate computing and I/O: CPU utilisation and completion times. PYQ: 2014s2-32, 2006-65, IT2006-54, 2003-77
- OS05.17 Q Several CPUs, or several types of process with their own rules. PYQ: 2026s1-54, 2025s1-28
- OS05.18 Q Periodic tasks prioritised by their period (rate-monotonic). PYQ: 2015s1-46
- OS05.19 Q The job order that minimises average or weighted completion time (shortest first, or by time ÷ weight). PYQ: IT2007-26, 1998-24
- OS05.20 Q Which events always make the running process give up the CPU. PYQ: 2024s2-15

## OS06 · Threads and fork
notes: os/01-processes-threads
hours: 1.5

### Threads
- OS06.1 T A thread is a unit of execution inside a process with its own program counter, registers and stack; the threads of a process share its code, global data, heap, open files and address space. Teaches: thread
- OS06.2 T Switching between threads of the same process saves the program counter, stack pointer and registers but keeps the page tables, so it is cheaper than a process switch.
- OS06.3 Q What threads share, what a thread switch saves, and what separate processes running the same threaded code share. PYQ: 2024s1-14, 2023-12, 2021s2-42, 2017s2-07, 2017s1-18, 2011-16, IT2004-14
- OS06.4 T User-level threads are run by a library: switching is fast, but the kernel sees one process, so one blocking call blocks them all and they cannot use two CPUs; kernel-level threads are scheduled by the OS.
- OS06.5 Q User-level vs kernel-level threads. PYQ: 2014s1-20, 2007-17, 2004-11

### fork
- OS06.6 T fork() creates a child process that is a copy of the parent and returns 0 in the child and the child's pid in the parent; both continue from the next statement. Teaches: fork
- OS06.7 T The child's variables have the same virtual addresses as the parent's but separate physical copies, so a change in one is not seen by the other.
- OS06.8 T n fork() calls one after another give 2^n processes (2^n − 1 children); inside loops and conditions, draw the process tree.
- OS06.9 Q Count the processes created or the lines printed by fork() in sequences, loops and conditions. PYQ: 2026s1-53, 2024s1-47, 2019-17, 2012-8, 2008-66, IT2004-64
- OS06.10 Q Values and addresses printed by the parent and the child. PYQ: 2005-72

## OS07 · Critical sections and semaphores
notes: os/02-concurrency-synchronization
hours: 2.5

### Race conditions
- OS07.1 T A race condition: the result depends on how concurrent processes interleave; x = x + 1 is a load, an add and a store, so two updates can lose one. Teaches: race
- OS07.2 Q Possible final values of shared variables, or possible outputs, when statements interleave. PYQ: 2024s1-30, 2019-23, 2015s1-9

### The critical-section problem
- OS07.3 T A critical section is code that touches shared data; a solution must give mutual exclusion, progress (only processes trying to enter take part in choosing, and they choose in finite time) and bounded waiting. Teaches: critical-section
- OS07.4 T A protocol can also deadlock (each waits for the other forever) or starve a process; judge each property separately. Teaches: deadlock
- OS07.5 T Strict alternation (a turn variable) gives mutual exclusion but not progress; two flags set before testing can deadlock; Peterson's algorithm (flags plus turn) gives all three for two processes.
- OS07.6 Q Does an entry/exit protocol give mutual exclusion, progress and bounded waiting; can it deadlock or starve. PYQ: 2016s2-48, 2016s1-50, 2015s3-10, 2010-23, 2007-58, IT2007-10, 2001-2.22, 1991-11.a, 1991-11.b, 1988-10iib

### Semaphores
- OS07.7 T A semaphore is an integer with two atomic operations: wait (P) decrements it and blocks the caller when it can't proceed; signal (V) increments it and wakes a waiting process. Teaches: semaphore
- OS07.8 T A binary semaphore (a mutex) is 0 or 1; a counting semaphore counts free resources, and a negative value (in the blocking version) counts the waiting processes.
- OS07.9 Q Definitions: critical section, critical region, race condition. PYQ: 1998-1.30, 1996-1.19, 1987-1.xvi
- OS07.10 T Atomic read-modify-write instructions (test-and-set, swap, fetch-and-add) are how locks and semaphores are built; a spin lock busy-waits on one. Teaches: atomic-instr
- OS07.11 Q Locks and semaphores built from test-and-set or fetch-and-add: is mutual exclusion guaranteed, can they deadlock or starve, what goes in the blank. PYQ: 2012-32, 2009-33, 2006-61, 2002-18.b, 1999-20.a
- OS07.12 Q The value of a counting semaphore after P and V operations, the bounds on its initial value, and how semaphores are built from binary ones or kept atomic. PYQ: 2016s2-49, 2008-63, 1998-1.31, 1992-02.x, 1990-1.vii
- OS07.13 T A semaphore initialised to 0 enforces order: S2 waits on it and S1 signals it, so S2 always runs after S1.
- OS07.14 Q Which outputs, orders or final values are possible when processes synchronise with semaphores. PYQ: 2026s2-41, 2024s2-36, 2023-28, 2022-9, 2021s1-46, 2020-34, 2013-39, 2013-34, 2010-45, IT2005-41, 2003-81, 2003-80, 1997-6.8
- OS07.15 L Precedence graphs, fork/join and parbegin/parend implemented with semaphores (old descriptive style). PYQ: 1996-21, 1995-19, 1994-27, 1993-22, 1992-12.a, 1991-01.xii, 1989-11b

## OS08 · Classic synchronization problems
notes: os/02-concurrency-synchronization
hours: 1.5

### Bounded buffer
- OS08.1 T Bounded buffer (producer-consumer): semaphores empty = N, full = 0 and mutex = 1; the producer waits on empty and then mutex, the consumer on full and then mutex. Teaches: producer-consumer
- OS08.2 T Waiting on mutex before empty (or full) can deadlock: a producer holding mutex sleeps on a full buffer, and the consumer can never get in.
- OS08.3 Q Producer-consumer code: what is missing, which order deadlocks, how many items the buffer can hold. PYQ: 2018-40, 2014s2-31, IT2008-53, IT2006-55, IT2004-65, 2002-20, 1999-20.b

### Readers, philosophers, barriers, monitors
- OS08.4 T Readers-writers: readers may share, a writer needs exclusive access; a reader count guarded by a mutex lets the first reader lock writers out and the last let them in. Teaches: readers-writers
- OS08.5 Q Complete or judge a readers-writers solution. PYQ: IT2007-56, 2000-20, 1987-8a
- OS08.6 T Dining philosophers: if everyone picks up the left fork first they can deadlock; making one philosopher pick up the right fork first (an order on the forks) breaks the cycle. Teaches: dining
- OS08.7 Q Dining philosophers and rings of semaphores: which scheme avoids deadlock. PYQ: 2000-1.21, 1996-2.19
- OS08.8 T A barrier makes every process wait until all n have arrived; a reusable barrier must stop a fast process from going through twice. Teaches: barrier
- OS08.9 Q Barrier code and its bug. PYQ: 2006-79, 2006-78
- OS08.10 T A monitor lets one process inside at a time; condition variables with wait and signal block and wake processes inside it. Teaches: monitor
- OS08.11 Q Monitors built from semaphores. PYQ: IT2006-57
- OS08.12 L Old descriptive design: giving a resource to the highest-priority request with semaphores. PYQ: 1997-73

## OS09 · Deadlock
notes: os/03-deadlock
hours: 2

### Conditions and handling
- OS09.1 T Deadlock needs four conditions at once: mutual exclusion, hold and wait, no preemption and circular wait. Teaches: deadlock-conditions
- OS09.2 T Handling: prevention makes one condition impossible, avoidance grants a request only if the state stays safe, detection finds a deadlock and recovers, or the OS ignores it.
- OS09.3 T Prevention: request everything at once or release everything before asking again (no hold and wait); number the resources and request in increasing order (no circular wait); take resources away (preemption).
- OS09.4 Q Is a given policy a valid prevention scheme; how prevention and avoidance differ. PYQ: 2015s3-52, 2008-65, IT2008-54, 2000-2.23
- OS09.5 Q Timestamp and priority schemes (wait-die, wound-wait, processes that snatch resources): deadlock and starvation. PYQ: IT2005-62, IT2004-63, 1997-75
- OS09.6 Q Can this code or request pattern deadlock: processes taking locks or semaphores in different orders; the fewest threads and locks for a deadlock. PYQ: 2021s2-43, 2017s1-27, 2013-16, 2010-46, IT2005-42, 2004-48, 2001-19, 1989-11a

### How many resources
- OS09.7 T n processes each needing at most k units of one resource can never deadlock if there are at least n(k − 1) + 1 units: even with everyone holding k − 1, one more unit lets someone finish.
- OS09.8 Q The fewest units that guarantee no deadlock, or the most processes or the largest demand. PYQ: 2026s1-25, 2018-24, 2015s2-23, 2014s3-31, 2005-71, 1998-1.32, 1997-6.7, 1993-7.9, 1992-02.xi

### Graphs and the banker's algorithm
- OS09.9 T Resource allocation graph: request edges go process → resource, assignment edges resource → process; with single-instance resources a cycle means deadlock, with several instances a cycle is necessary but not enough. Teaches: rag
- OS09.10 Q Deadlock from a resource allocation graph. PYQ: 2025s2-38
- OS09.11 T Banker's algorithm: Need = Max − Allocation; a state is safe if some order lets every process get its need and finish; a request is granted only if the state after it is safe. Teaches: bankers
- OS09.12 Q Is the state safe, a safe sequence (from a table or a graph), can this request be granted. PYQ: 2018-39, 2017s2-33, 2014s1-31, 2007-57, 1996-22, 1994-28, 1988-11
- OS09.13 Q Detection: whether the system is deadlocked, which requests can still be met, when non-preemptive allocation stalls. PYQ: 2019-39, 2009-30, 2006-66
- OS09.14 Q Which statements about deadlock hold: the conditions, wait-for and allocation graphs, safe and unsafe states, what the banker's algorithm is for. PYQ: 2026s1-19, 2022-16

## OS10 · Disks and disk scheduling
notes: os/07-file-systems-io
hours: 2

### Disk structure and access time
- OS10.1 T A disk has platters with two recording surfaces, tracks on each surface and sectors on each track; a cylinder is the same track across all surfaces. Teaches: disk-geometry
- OS10.2 T Capacity = surfaces × tracks per surface × sectors per track × bytes per sector.
- OS10.3 T Access time = seek time + rotational latency (half a rotation on average) + transfer time; one rotation takes 60 ÷ RPM seconds.
- OS10.4 Q Capacity, number of cylinders, sector addresses (c, h, s) and address bits. PYQ: 2024s1-44, 2013-29, 2009-52, 2009-51, 2007-11, 1995-14, 1993-6.7, 1990-7.c
- OS10.5 Q Time to read a file, a set of records or a set of libraries: seek, latency and transfer, with DMA where given. PYQ: 2024s2-43, 2015s2-49, 2015s1-48, 2011-44, IT2007-44, 2001-8, 1998-25b, 1997-74
- OS10.6 Q Disk facts: seek time vs distance, RAID, formatting, device drivers. PYQ: 2008-32, 2001-1.22, 1999-2.18, 1998-2.9
- OS10.7 L Tracks with different densities (old IT papers). PYQ: IT2005-81-a, IT2005-81-b

### Disk scheduling
- OS10.8 T FCFS serves requests in order; SSTF serves the nearest next (and can starve); SCAN (elevator) sweeps to the end and back; C-SCAN sweeps one way and jumps back; LOOK and C-LOOK turn at the last request instead of the end. Teaches: disk-scheduling
- OS10.9 Q Total head movement, the order served, or the request that makes two policies differ, under FCFS, SSTF, SCAN, C-SCAN, LOOK or C-LOOK. PYQ: 2020-35, 2018-53, 2016s1-48, 2015s1-30, 2014s1-19, 2009-31, IT2007-83, IT2007-82, 2004-12, IT2004-62, 2001-20, 1995-20, 1990-9b, 1989-4.xii
- OS10.10 Q Which policy gives the best throughput; matching policies to uses. PYQ: 1999-1.10, 1997-3.6

## OS11 · File systems
notes: os/07-file-systems-io
hours: 1.5

### Allocation
- OS11.1 T Contiguous allocation gives fast sequential and direct access but external fragmentation; linked allocation has no fragmentation but only sequential access and a pointer in every block; indexed allocation keeps a block of pointers per file. Teaches: file-allocation
- OS11.2 T FAT keeps linked allocation's next-block pointers in a table at the start of the disk, one entry per block.
- OS11.3 T Bigger blocks mean fewer blocks to fetch (better throughput) but more space lost in each file's last block.
- OS11.4 Q Allocation methods: which avoid external fragmentation, the cost of inserting or reading a block, FAT size, the space used with each block size. PYQ: 2025s1-41, 2022-53, 2017s2-08, 2014s2-20, 2008-20, IT2005-63, 2003-25, 1996-23

### Inodes
- OS11.5 T A Unix inode holds a file's metadata and its block pointers: direct pointers, then single, double and triple indirect blocks. Teaches: inode
- OS11.6 T With p = block size ÷ pointer size, the largest file is (direct + p + p² + p³) blocks.
- OS11.7 Q Largest file size, or the disk blocks read to reach a given byte. PYQ: 2019-42, 2012-41, 2004-49, IT2004-67, 2002-2.22

### Directories and free space
- OS11.8 T A directory maps names to files; a linear-list directory is searched entry by entry; the root directory sits at a fixed place on the disk.
- OS11.9 Q Which directory operations must touch what. PYQ: 2021s1-15, 1993-7.8
- OS11.10 T Free space is tracked by a bit map (one bit per block) or a free list (the free blocks chained, or their addresses listed).
- OS11.11 Q Bit map vs free list size. PYQ: 1998-25.a

### Putting it together
- OS11.12 Q Match OS abstractions and mechanisms: threads, address spaces, files and signals to hardware; wait/signal, working sets and deadlock to their ideas; buffers to locality; scheduling policies to their uses. PYQ: 2007-16, 1999-1.9, 1990-2.iii, 1989-2.iv
- OS11.13 Q Mixed true-or-false statements across the subject (virtual memory, critical sections, replacement, fitting). PYQ: 1991-03.xi
