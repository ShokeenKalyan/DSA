# 78 - Task Scheduler

## Problem
**LeetCode:** [#621 Task Scheduler](https://leetcode.com/problems/task-scheduler/)  
**Difficulty:** Medium  
**Topic:** Arrays, Greedy, Math, Heap

### Statement
Given tasks and cooldown `n` (same task must wait `n` intervals), return minimum intervals to finish all tasks.

```
["A","A","A","B","B","B"], n=2  →  8   (A→B→_→A→B→_→A→B)
["A","A","A","B","B","B"], n=0  →  6   (no cooldown)
["A","A","A","A","B","B","C","C"], n=2 → 10
```

---

## Core Insight — Think in Frames

Most frequent task anchors frames of size `(n+1)`.

```
tasks=[A,A,A,B,B,B], n=2, maxFreq=3, countOfMaxFreq=2

Frame 1: [A, B, _]   ← n+1 = 3 slots
Frame 2: [A, B, _]
Last:    [A, B]      ← no trailing idle on last frame

Total = (maxFreq-1)×(n+1) + countOfMaxFreq
      = (3-1)×3 + 2 = 8 ✅
```

**Formula:**
```
result = max(tasks.length, (maxFreq-1)×(n+1) + countOfMaxFreq)
```

`max` because if tasks are diverse enough, they fill all idle slots
and overflow — then just `tasks.length` intervals needed, no idle.

---

## Solution (JavaScript)

```javascript
/**
 * Task Scheduler — LeetCode #621
 * Time: O(n) | Space: O(1) — 26 task types max
 */
function leastInterval(tasks, n) {
    // Count frequencies
    const freq = new Array(26).fill(0);
    for (const task of tasks) freq[task.charCodeAt(0) - 65]++;

    const maxFreq = Math.max(...freq);
    const countOfMaxFreq = freq.filter(f => f === maxFreq).length;

    const formulaResult = (maxFreq - 1) * (n + 1) + countOfMaxFreq;

    return Math.max(tasks.length, formulaResult);
}

console.log(leastInterval(["A","A","A","B","B","B"], 2));          // 8  ✅
console.log(leastInterval(["A","A","A","B","B","B"], 0));          // 6  ✅
console.log(leastInterval(["A","A","A","A","B","B","C","C"], 2));  // 10 ✅
console.log(leastInterval(["A"], 10));                              // 1  ✅
console.log(leastInterval(["A","A","B","B"], 2));                   // 5  ✅
```

---

## Dry Run

```
tasks=[A,A,A,A,B,B,C,C], n=2

freq: A=4, B=2, C=2
maxFreq=4, countOfMaxFreq=1

formula = (4-1)×3 + 1 = 10
tasks.length = 8
max(8,10) = 10 ✅

Frames:
  [A,B,C] [A,B,C] [A,_,_] [A]
    3    +   3    +   3   + 1 = 10 ✅
```

---

## Why the Formula Works

```
maxFreq task A appears maxFreq times.
Between each pair of A's: must have n slots.
Creates (maxFreq-1) gaps of size n → frames of size (n+1).

(maxFreq-1) full frames + final partial frame:
  Final frame has countOfMaxFreq tasks (all tied for maxFreq)
  → (maxFreq-1)×(n+1) + countOfMaxFreq

If tasks overflow (diverse enough to fill all slots):
  No idle time needed → answer = tasks.length
→ max(tasks.length, formula)
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| **Math Formula** | **O(n)** | **O(1)** |
| Greedy + Heap | O(n log 26) | O(26) |

---

## Key Patterns & Takeaways

1. **Think in frames of `n+1`** — most frequent task anchors each frame. `(maxFreq-1)` complete frames + final partial frame.
2. **`max(tasks.length, formula)`** — tasks overflow → no idle needed → `tasks.length`. Formula dominates when idle slots remain. Both cases handled by `max`.
3. **`+ countOfMaxFreq` not `+ 1`** — last frame has ALL tasks tied for max frequency. Common mistake to use +1.
4. **O(1) space** — only 26 task types. Frequency array is constant size. State this explicitly.
5. **Greedy alternative** — always pick highest-frequency available task. Max-heap approach. O(n log 26) = O(n). Good fallback if formula is forgotten.