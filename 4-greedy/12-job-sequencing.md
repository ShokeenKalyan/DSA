# 101 - Job Sequencing Problem

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/job-sequencing-problem) | [GFG](https://practice.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1)  
**Difficulty:** Medium  
**Topic:** Greedy Algorithms

### Statement
Given `n` jobs each with a **deadline** and **profit** (each takes 1 unit of time), schedule jobs to **maximise total profit**. Only one job runs at a time and each must complete by its deadline.

```
Jobs = [(A,4,20),(B,1,10),(C,1,40),(D,1,30)]  →  2 jobs, profit=60
Jobs = [(A,2,100),(B,1,19),(C,2,27),(D,1,25),(E,3,15)]  →  3 jobs, profit=142
```

---

## Greedy Insight — Sort by Profit, Assign Latest Slot

Process jobs in **descending profit** order. For each job, assign the **latest available slot ≤ its deadline** (not earliest — preserves early slots for deadline-constrained jobs).

```
Sort by profit desc → for each job, scan from deadline down to 1:
  First free slot found → schedule here, mark occupied
  No free slot → skip
```

**Why latest slot?** Assigning to an earlier slot than necessary blocks future jobs with tight deadlines. Latest-slot assignment maximises scheduling flexibility.

---

## Approaches

| Approach | Time | Space |
|---|---|---|
| Greedy + Slot Array | O(n log n + n×d) | O(d) |
| **Greedy + DSU** | **O(n log n + n α(d))** | **O(d)** |

d = max deadline, α = inverse Ackermann (effectively O(1))

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Greedy + Slot Array — O(n log n + n×d)
// For each job, scan backward from deadline for free slot
// ─────────────────────────────────────────────────────────
function jobSequencing(jobs) {
    // Step 1: Sort by profit descending
    jobs.sort((a, b) => b.profit - a.profit);

    // Step 2: Build slot array (1-indexed, -1 = free)
    const maxDeadline = Math.max(...jobs.map(j => j.deadline));
    const slots = new Array(maxDeadline + 1).fill(-1);

    let totalProfit = 0, jobCount = 0;

    // Step 3: Greedily assign to latest available slot ≤ deadline
    for (const job of jobs) {
        for (let t = job.deadline; t >= 1; t--) {
            if (slots[t] === -1) {       // Free slot found
                slots[t] = job.id;
                totalProfit += job.profit;
                jobCount++;
                break;                   // Done with this job
            }
        }
        // No free slot → skip this job
    }

    return { jobCount, totalProfit };
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Greedy + DSU — O(n log n + n α(d)) ✅
// parent[t] = latest free slot ≤ t
// When slot t used: parent[t] = t-1 (look left next time)
// ─────────────────────────────────────────────────────────
function jobSequencingDSU(jobs) {
    jobs.sort((a, b) => b.profit - a.profit);
    const maxDeadline = Math.max(...jobs.map(j => j.deadline));

    // Each slot initially points to itself (all free)
    const parent = Array.from({ length: maxDeadline + 1 }, (_, i) => i);

    function find(t) {
        if (parent[t] === t) return t;
        parent[t] = find(parent[t]); // Path compression
        return parent[t];
    }

    let totalProfit = 0, jobCount = 0;

    for (const job of jobs) {
        const slot = find(Math.min(maxDeadline, job.deadline));

        if (slot > 0) {              // slot=0 means no free slot ≤ deadline
            totalProfit += job.profit;
            jobCount++;
            parent[slot] = slot - 1; // Mark slot used, point left
        }
    }

    return { jobCount, totalProfit };
}

// ── Tests ─────────────────────────────────────────────────
const j1 = [
    {id:'A',deadline:4,profit:20},{id:'B',deadline:1,profit:10},
    {id:'C',deadline:1,profit:40},{id:'D',deadline:1,profit:30}
];
console.log(jobSequencing([...j1]));     // {jobCount:2, totalProfit:60} ✅

const j2 = [
    {id:'A',deadline:2,profit:100},{id:'B',deadline:1,profit:19},
    {id:'C',deadline:2,profit:27}, {id:'D',deadline:1,profit:25},
    {id:'E',deadline:3,profit:15}
];
console.log(jobSequencing([...j2]));     // {jobCount:3, totalProfit:142} ✅
```

---

## Dry Run — Slot Array

```
Jobs sorted by profit: [(C,1,40),(D,1,30),(A,4,20),(B,1,10)]
maxDeadline=4, slots=[-1,-1,-1,-1,-1]

C(d=1): t=1 free → slots[1]=C, profit=40, count=1
D(d=1): t=1 occupied → skip
A(d=4): t=4 free → slots[4]=A, profit=60, count=2
B(d=1): t=1 occupied → skip

Result: 2 jobs, profit=60 ✅
```

---

## DSU — How parent[t] = t-1 Works

```
parent=[0,1,2,3,4] initially (all free)

After scheduling at slot 1: parent[1]=0
  Next find(1): parent[1]=0 → find(0)=0 → returns 0 = no slot ✅

After scheduling at slot 4: parent[4]=3
  Next find(4): parent[4]=3 → find(3)=3 → returns 3 (still free)

Path compression ensures future finds are O(1) amortized.
```

---

## Why Greedy is Correct

```
Exchange argument:
  Suppose OPT skips job J (high profit) and includes job K (lower profit).
  Replace K with J in OPT → profit ≥ original (J has higher profit).
  J is valid at that slot (greedy always picks latest slot ≤ deadline).

  ∴ Any optimal solution can include J without losing profit.
  By induction: greedy (highest profit first, latest slot) is optimal. ✅
```

---

## Key Details

```
1. 1-indexed slots — slot 0 in DSU signals "no available slot"
2. Latest slot ≤ deadline — scan backward from deadline, not forward
3. maxDeadline from input — use max(deadlines), not n
4. DSU parent[t] = t-1 — occupied slot points left to next candidate
```

---

## Key Patterns & Takeaways

1. **Sort by profit desc + latest slot** — the canonical job sequencing greedy. Highest profit first; latest available slot preserves early slots for future jobs.
2. **Latest ≠ earliest** — assigning to earliest wastes early slots. Latest-slot is the critical greedy choice.
3. **DSU for O(1) slot finding** — `parent[t] = t-1` after use means find(t) jumps directly to next free slot. Path compression gives amortized O(1).
4. **Related to Activity Selection (P38)** — both scheduling greedy problems. Activity Selection maximises count; Job Sequencing maximises profit. Different objectives, same greedy paradigm.
5. **Generalisation: Weighted Job Scheduling** — if jobs have durations > 1, greedy fails. Requires DP sorted by finish time. This greedy is the special case for unit-duration jobs.