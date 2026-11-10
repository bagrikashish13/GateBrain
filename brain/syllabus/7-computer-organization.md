# Part 7 · Computer Organization and Architecture

Official GATE 2027 wording (Section 3): "Instruction set and addressing modes. Design of arithmetic and logic unit (ALU). Design of control unit – hardwired and microprogrammed. Memory interfacing and hierarchy: performance, cache memory mapping. I/O interface (interrupt and DMA). Instruction pipelining, pipeline hazards." Secondary storage (disks) was dropped in 2027.

Main block, after Digital Logic. Weight from the papers: 7.1 marks a paper since 2014, 8.1 since 2021. Cache memory alone is about 2.7 marks a paper (address split, tag sizes, AMAT, miss counting), pipelining about 1.8 (time for n instructions, stalls, hazards), instruction formats and addressing about 1.1. That is the order here: cache first, then instructions (pipelines need them), then pipelines, datapath and control, I/O, memory chips.
How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic to teach, in this order. Nothing here uses an idea before the line that teaches it: `npm run check:syllabus` proves it.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers or the old syllabus). `Teaches:` names the concepts a line introduces (`concepts.json`).
PYQ ids are newest first. See `README.md` for the rules and `npm run syllabus` for the next step. Decoders, adders and 2's complement come from Digital Logic (Part 6); paging and TLBs from OS.

## CO01 · Cache mapping
notes: coa/01-cache-memory
hours: 2.5

### Why caches work
- CO01.1 T The memory hierarchy: registers, cache, main memory, disk, each slower, bigger and cheaper per byte than the one above. Temporal locality (reuse soon) and spatial locality (neighbours soon) make a small fast cache hold most of what the CPU needs. An access that finds its word in the cache is a hit; the hit ratio is the fraction of accesses that hit, the miss rate the rest. Teaches: cache, amat
- CO01.2 Q What locality justifies; why a block holds several words; what larger blocks do. PYQ: 2014s2-43, 2001-1.7, 1987-4b
- CO01.3 T Byte addressing: an n-bit address names 2ⁿ bytes. Main memory and cache are divided into blocks (lines) of B bytes, so the low log₂B bits of an address are the offset inside the block.

### The three mappings
- CO01.4 T Direct mapping: memory block j can only go to line j mod L (L lines). The address splits into tag | line | offset; the tag says which of the blocks sharing that line is there. Teaches: cache-mapping
- CO01.5 T Fully associative: any block in any line; the address is tag | offset and every tag is compared at once. k-way set associative: S = L/k sets, block j goes to set j mod S, address = tag | set | offset. Direct mapped is 1-way; fully associative is one set.
- CO01.6 Q Split an address into tag, index and offset bits for a given cache. PYQ: 2026s2-46, 2026s2-42, 2026s1-28, 2025s2-29, 2025s1-26, 2023-54, 2022-44, 2021s2-19, 2021s1-22, 2020-30, 2019-1, 2018-34, 2017s2-53, 2017s1-54, 2016s2-32, 2015s3-14, 2014s2-9, 2013-20, 2007-80, 2007-10, 2005-67, 2001-9, 1999-1.22, 1995-2.25, 1990-7a
- CO01.7 Q Which line or set a block or address goes to; what doubling the associativity changes. PYQ: 2014s2-44, 2006-81, 2006-80

### Replacement and writes
- CO01.8 T Replacement inside a set: LRU evicts the least recently used block, FIFO the oldest; direct mapping has no choice. Count hits and misses by tracing the blocks set by set.
- CO01.9 Q Trace a block sequence: hits, misses and what is left in the cache under LRU or FIFO. PYQ: 2017s1-51, 2009-29, IT2007-37, IT2005-61, 2004-65, IT2004-48
- CO01.10 T Write-through updates memory on every write; write-back writes a block back only when a dirty block is evicted. Write-allocate brings the block in on a write miss. Teaches: write-policy
- CO01.11 Q Write-back vs write-through: memory traffic, dirty bits, which statements hold. PYQ: 2024s1-43, 2022-14
- CO01.12 T Tag memory: one entry per line holding the tag plus valid and dirty bits (and replacement bits); total size = lines × bits per entry.
- CO01.13 Q Size of the tag directory. PYQ: 2012-55, 2012-54, 2011-43, IT2008-81, IT2008-80

## CO02 · Cache performance
notes: coa/01-cache-memory
hours: 2

### Access time
- CO02.1 T Hit ratio h, hit time t_c, miss penalty. Hierarchical access: AMAT = t_c + (1 − h) × penalty. Simultaneous access: h·t_c + (1 − h)·t_m. Read the question for which one it means.
- CO02.2 Q Average access time, or the hit ratio needed for a target, with one cache level. PYQ: 2022-23, 2020-21, 2019-45, 2016s2-50, 2015s2-24, 2014s3-44, 2014s1-44, IT2006-42, 1998-18, 1992-5.a
- CO02.3 T Two and three levels: AMAT = t₁ + m₁(t₂ + m₂ × t_mem) with local miss rates; global miss rate = m₁ × m₂. An inclusive L2 holds everything in L1.
- CO02.4 Q Multilevel hierarchies: average access time, misses per instruction, inclusion. PYQ: 2025s2-45, 2025s1-43, 2021s2-27, 2017s2-45, 2017s2-29, 2017s1-25, 2010-49, 2010-48, 2008-35, IT2006-43, IT2004-12, 1996-26, 1993-11
- CO02.5 T Memory stalls and CPI: CPI = CPI_ideal + (memory accesses per instruction) × miss rate × miss penalty, counting instruction fetches and data accesses separately. Teaches: cpi
- CO02.6 Q CPI or execution time once cache misses are counted. PYQ: 2024s1-46

### Misses for real programs
- CO02.7 T Misses for loops over arrays: work out which blocks each array uses, which ones collide in the same line or set, and whether the loop order walks memory sequentially (row-major) or jumps.
- CO02.8 Q Count the misses (or the miss rate) of a loop over arrays. PYQ: 2008-73, 2008-72, 2008-71, 2007-81, 2002-10
- CO02.9 Q Two cache organisations compared: hit latency, tag comparison hardware; caches with an MMU and a TLB. PYQ: 2026s1-44, 2006-75, 2006-74

## CO03 · Instructions and addressing modes
notes: coa/02-instructions
hours: 2.5

### Instruction formats
- CO03.1 T An instruction is an opcode plus operand fields: a register field needs log₂(registers) bits, the rest goes to immediates or addresses. 3-, 2-, 1- and 0-address machines (stack, accumulator). Teaches: instruction-format
- CO03.2 T Expanding opcodes: an opcode value can be reserved to extend into other fields, trading operands for more instructions. Count the instructions an encoding allows type by type.
- CO03.3 Q Field widths, the largest immediate, or how many instructions of each type an encoding allows. PYQ: 2026s2-34, 2026s1-5, 2025s1-27, 2024s2-51, 2020-44, 2018-51, 2016s2-31, 2016s2-10, 2015s1-8, 2014s1-9, 1994-3.2, 1992-01.vi, 1988-2.ii

### Addressing modes
- CO03.4 T Addressing modes and their effective address: immediate (the operand itself), direct, indirect, register, register indirect, indexed, base, PC-relative, auto-increment and auto-decrement. Count the memory references each needs. Teaches: addressing-mode
- CO03.5 Q Which mode suits which use (relocation, arrays, pointers, constants, local variables); the effective address or operand value. PYQ: 2026s1-4, 2024s2-47, 2017s1-11, 2011-21, 2008-33, IT2008-38, IT2006-40, IT2006-39, 2005-66, 2005-65, 2004-20, 2002-1.24, 2001-2.9, 2000-1.10, 1999-2.23, 1998-1.19, 1993-10, 1989-2.ii, 1988-9iii, 1987-1.V

### Running programs
- CO03.6 T Executing machine code: each instruction updates registers or memory and the PC; branch targets are PC-relative (offset from the next instruction); calls push a return address.
- CO03.7 T Interrupts and exceptions also transfer control: the CPU finishes the current instruction, saves the PC (and status) and jumps to a handler; a return-from-interrupt instruction restores them. Relative addressing makes code position-independent, which suits shared code and handlers. Teaches: interrupt
- CO03.8 Q Which addressing mode suits position-independent code, co-routines or interrupt handlers. PYQ: 1996-1.16
- CO03.9 Q Trace an assembly program: final values, memory references, the branch offset, the stack after a call. PYQ: 2023-31, 2021s1-55, 2017s1-49, 2015s2-42, 2008-34, 2007-73, 2007-72, 2007-71, 2007-54, 2006-43, 2006-09, 2004-64, 2004-63, 2003-49, 2003-48, 1999-17, 1994-12, 1988-9i
- CO03.10 T CPU time = instructions × CPI × clock period. With an instruction mix, CPI is the weighted average. Amdahl's law: speedup = 1 / ((1 − f) + f/s) when a fraction f is sped up s times.
- CO03.11 Q Execution time, average CPI, MIPS, Amdahl's speedup. PYQ: 2025s2-51, 2024s1-45, 2014s1-55, IT2007-36, IT2004-50
- CO03.12 T RISC: fixed-length instructions, load-store, register-to-register arithmetic, simple modes, designed to finish one instruction per cycle. CISC: variable length, memory operands, many modes. The ISA is what the programmer sees (instructions, registers, modes), not the cache size.
- CO03.13 Q RISC vs CISC; what is part of the instruction set architecture. PYQ: 2025s2-18, 1999-2.22

## CO04 · Datapath and control unit
notes: coa/03-datapath-control
hours: 1.5

### Datapath
- CO04.1 T The datapath: registers, the ALU and the buses joining them. An instruction runs as micro-operations (register transfers); a single bus allows one transfer per cycle, so count cycles transfer by transfer. Teaches: datapath
- CO04.2 Q The steps and cycles to run an instruction on a given datapath; valid micro-operation sequences. PYQ: 2025s1-17, 2020-4, 2016s2-30, 2013-28, 2005-80, 2005-79, 2001-2.13

### Control unit
- CO04.3 T Hardwired control generates signals from logic (fast, rigid); microprogrammed control reads them from a control memory (flexible, slower). Horizontal microinstructions have a bit per signal; vertical ones encode groups of mutually exclusive signals in fields of log₂ bits. Teaches: microprogram
- CO04.4 Q Control word width and control memory size; horizontal vs vertical; hardwired vs microprogrammed. PYQ: 2018-5, IT2008-39, IT2006-41, IT2005-49, IT2005-45, 2004-67, IT2004-49, 2002-2.7, 1999-2.19, 1997-5.3, 1996-2.25, 1990-8a, 1987-4a, 1987-1.vi

## CO05 · Pipelining
notes: coa/04-pipelining
hours: 3

### Timing
- CO05.1 T A k-stage pipeline: clock period = slowest stage + latch delay; n instructions take (k + n − 1) cycles; ideal speedup over the unpipelined machine approaches k, less once latches and unequal stages are counted. Teaches: pipeline
- CO05.2 Q Time for n instructions, throughput and speedup from stage delays and latch delays; pipelining a non-pipelined CPU. PYQ: 2025s2-46, 2021s1-53, 2020-43, 2016s2-33, 2016s1-32, 2015s1-38, 2014s3-9, 2014s1-43, 2011-41, IT2008-40, IT2007-6, IT2005-44, 2004-69, 2000-12, 2000-1.8
- CO05.3 Q Stage-occupancy tables: instructions taking different numbers of cycles per stage; reservation tables. PYQ: 2015s3-51, 2009-28

### Hazards
- CO05.4 T Structural hazards (two instructions want one unit), data hazards (RAW: true dependence; WAR and WAW only matter when instructions can overtake), control hazards (the next PC is not known yet). Teaches: hazard
- CO05.5 Q Which dependences cause hazards; renaming, bypassing and forwarding statements. PYQ: 2026s1-6, 2015s3-47, 2012-20, 2008-36, IT2007-39, IT2004-46, 2003-10, 2002-2.6
- CO05.6 T Stalls and forwarding: without forwarding a dependent instruction waits until the result is written back; forwarding passes it from EX (or MEM) straight on; a load followed by its use still stalls a cycle. Draw the cycle-by-cycle table.
- CO05.7 Q Cycles for an instruction sequence with dependences, with and without forwarding. PYQ: 2026s1-50, 2024s2-21, 2024s1-20, 2021s2-53, 2018-50, 2017s1-50, 2015s2-44, 2014s3-43, 2010-33, 2007-37, IT2007-41, IT2006-79, IT2006-78, 2005-68, IT2004-47, 2001-12, 1999-13
- CO05.8 T Control hazards: a branch costs a penalty of the stages until its target is known; CPI = 1 + (branch fraction × penalty) + other stalls. Delayed branches fill the slot with useful work.
- CO05.9 Q CPI, speedup or time with branch penalties and stalls; delayed branching. PYQ: 2026s2-47, 2024s2-48, 2023-23, 2022-51, 2013-45, 2008-77, 2008-76, 2006-42

## CO06 · Input and output
notes: coa/05-input-output
hours: 1.5

### Polling and interrupts
- CO06.1 T Programmed I/O (the CPU polls the device), interrupt-driven I/O (the device signals the CPU) and DMA (a controller moves the data). Polling wastes cycles on idle checks; interrupts cost the service routine each time. Teaches: io-modes
- CO06.2 Q Fraction of CPU time spent on I/O with polling or interrupts. PYQ: 2025s1-1, 2023-24, 2011-28, 2005-69
- CO06.3 T Interrupts in detail: vectored (the device supplies the handler address) vs non-vectored (a fixed address); priority by daisy chaining; masking and enabling.
- CO06.4 Q Interrupt mechanisms, priorities and what happens on an interrupt. PYQ: 2026s2-8, 2020-3, 2009-8, 2002-1.9, 1998-1.20, 1996-1.24, 1995-1.6, 1995-1.3, 1987-1.viii

### DMA
- CO06.5 T DMA: burst mode holds the bus for a whole block; cycle stealing takes one bus cycle per word. Fraction of CPU time lost = DMA cycles / total cycles; the count register limits a single transfer.
- CO06.6 Q DMA transfers: time, cycles stolen, the count register, which mode gives the highest throughput. PYQ: 2024s2-1, 2024s1-5, 2022-7, 2021s2-20, 2016s1-31, 2008-64, 2004-68, 1997-2.4, 1996-25, 1990-4.ii, 1987-2a, 1987-2b

## CO07 · Main memory and interfacing
notes: coa/06-memory-interfacing
hours: 1

### Building memory from chips
- CO07.1 T Chips side by side widen the word, chips stacked add words; high address bits drive a decoder that picks the chip (chip select). A DRAM is organised in rows that must be refreshed periodically. Teaches: memory-interfacing
- CO07.2 Q Chips, address lines, decoders and chip-select logic for a memory; DRAM rows and refresh. PYQ: 2023-32, 2019-2, 2018-23, 2016s1-09, 2013-46, 2010-7, 2009-7, IT2005-9, 1995-2.2
- CO07.3 T Interleaving: with low-order interleaving consecutive words sit in consecutive modules, so a block can come from k modules in about one access time.
- CO07.4 Q Interleaved memory and the time to fetch a block. PYQ: 2006-41, 1991-01.ii, 1990-4.iv
- CO07.5 L Disks (dropped from the 2027 syllabus): rotation, seek and transfer times. PYQ: 2026s1-49, 2005-70, IT2004-51
- CO07.6 L Filed under COA but really OS or old one-liners: free-block lists, paging, register windows, stack-less processors, kinds of memory. PYQ: 2026s2-43, 2008-38, 2008-37, 2004-47, 2002-1.13, 2001-1.10, 1995-1.2, 1992-01.iv, 1991-03.iii, 1990-4.iii, 1989-6a
