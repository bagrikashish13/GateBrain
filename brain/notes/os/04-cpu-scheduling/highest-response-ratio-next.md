# Highest Response Ratio Next (HRRN) Scheduling

## TL;DR
Non-preemptive algorithm that prevents starvation by dynamically increasing priority with waiting time: $RR = \frac{W + S}{S} = 1 + \frac{W}{S}$. Fast test-taking trick: drop the $+1$ and compare $\frac{W}{S}$ using cross-multiplication ($W_1 \cdot S_2 \gtrless W_2 \cdot S_1$) to pick the next process in seconds without decimal divisions.

## Core idea
- **Formula:**
  $$RR = \frac{W + S}{S} = 1 + \frac{W}{S}$$
  - $W$: Waiting time accumulated so far ($\text{Current Time} - \text{Arrival Time}$).
  - $S$: CPU burst time (service time).
- **Properties:**
  - **Non-preemptive:** Once a process starts executing on the CPU, it runs until its burst completes. Never re-evaluate $RR$ while a process is running!
  - **Starvation-free:** As $W$ grows, $RR$ increases monotonically, guaranteeing that long jobs eventually gain higher priority than newly arriving short jobs.
  - **SJF approximation:** When waiting times are short ($W \approx 0$), $RR \approx 1 + 0/S$; shorter jobs have higher relative priority.

- **Speed Technique for GATE:**
  - Because $RR = 1 + \frac{W}{S}$, comparing $RR(A)$ vs $RR(B)$ is strictly equivalent to comparing $\frac{W_A}{S_A}$ vs $\frac{W_B}{S_B}$.
  - To compare $\frac{W_A}{S_A}$ and $\frac{W_B}{S_B}$, compute cross-products:
    $$W_A \cdot S_B \quad \text{vs} \quad W_B \cdot S_A$$
  - Avoids floating-point divisions on the GATE virtual calculator.

## Where I got confused → what made it click
- **Time spent on calculations:**
  - *Confusion:* Spending 6 to 7 minutes during the test computing long decimal response ratios at every scheduling decision.
  - *The click:* HRRN decisions only occur at process termination boundaries. At each boundary, only compute $W = t - \text{Arrival}$ for the processes actually present in the ready queue, then cross-multiply $W/S$.

## GATE traps
- **Premature evaluation:** Only evaluate ready queue processes at the exact instant the current process finishes. Processes arriving in the future cannot be compared.
- **Turnaround time vs Waiting time:**
  - $\text{Turnaround Time (TAT)} = \text{Completion Time} - \text{Arrival Time} = W + S$.
  - $\text{Waiting Time } W = \text{TAT} - S = \text{Completion Time} - \text{Arrival Time} - S$.
- **Ties:** If two processes have identical $RR$, check the question's tie-breaking rule (usually smaller PID or smaller arrival time).

## Example
**GATE Mock 03 Q2:**
$P_1(0, 3), P_2(1, 6), P_3(3, 4), P_4(5, 2)$. Non-preemptive HRRN.
1. **$t = 0$:** Only $P_1$ present $\implies P_1$ runs from $t = 0 \to 3$. ($P_1$ finishes at 3).
2. **$t = 3$:** Ready: $P_2(W = 3-1 = 2, S = 6)$, $P_3(W = 3-3 = 0, S = 4)$.
   - $\frac{W}{S}(P_2) = \frac{2}{6} = \frac{1}{3} > \frac{W}{S}(P_3) = \frac{0}{4} = 0 \implies$ Schedule $P_2$ from $t = 3 \to 9$.
3. **$t = 9$:** Ready: $P_3(W = 9-3 = 6, S = 4)$, $P_4(W = 9-5 = 4, S = 2)$.
   - Compare $\frac{6}{4} = 1.5$ vs $\frac{4}{2} = 2.0$.
   - Cross-check: $6 \times 2 = 12 < 4 \times 4 = 16 \implies P_4$ wins!
   - Schedule $P_4$ from $t = 9 \to 11$.
4. **$t = 11$:** Schedule $P_3$ from $t = 11 \to 15$.
- $\text{TAT}$: $P_1 = 3 - 0 = 3$; $P_2 = 9 - 1 = 8$; $P_4 = 11 - 5 = 6$; $P_3 = 15 - 3 = 12$.
- $\text{Avg TAT} = \frac{3 + 8 + 6 + 12}{4} = \frac{29}{4} = \mathbf{7.25\text{ ms}}$.
