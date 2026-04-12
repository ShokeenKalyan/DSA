# 38 - N Meetings in One Room (Activity Selection)

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/n-meetings-in-one-room) | [GFG](https://practice.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1)  
**Difficulty:** Easy  
**Topic:** Greedy Algorithms, Intervals

### Statement
Given `n` meetings with start and end times, find the **maximum number of meetings** that can be held in a single room (one at a time).

```
start=[1,3,0,5,8,5], end=[2,4,6,7,9,9]  →  4  (meetings 1,2,4,5)
start=[1,3,2,5],     end=[2,4,3,6]       →  3
```

---

## The Greedy Insight — Always Pick Earliest Ending

**Goal:** fit maximum meetings → leave maximum future time → always pick the meeting that **ends the soonest**.

**Why?** Among all compatible meetings, picking the one that ends latest can only reduce future options. The earliest-ending meeting leaves the most room. Any optimal solution can be transformed to include the earliest-ending choice without decreasing the count (exchange argument).

**Algorithm:**
```
1. Sort meetings by end time
2. Start with lastEndTime = -∞
3. For each meeting: if start > lastEndTime → select it, lastEndTime = end
4. Return count
```

---

## Solution (JavaScript)

```javascript
/**
 * N Meetings in One Room — Greedy
 * Time: O(n log n) — sort + single pass
 * Space: O(n)
 */
function maxMeetings(start, end) {
    const n = start.length;

    // Create (start, end, originalIndex) tuples
    const meetings = start.map((s, i) => ({ start: s, end: end[i], index: i+1 }));

    // Sort by END time (key insight — not start time)
    meetings.sort((a, b) => a.end !== b.end ? a.end - b.end : a.start - b.start);

    let count = 0;
    let lastEndTime = -Infinity;
    const selected = [];

    for (const m of meetings) {
        // Select if this meeting starts AFTER the last one ended
        if (m.start > lastEndTime) {
            count++;
            lastEndTime = m.end;
            selected.push(m.index);
        }
    }

    return { count, selected };
}

console.log(maxMeetings([1,3,0,5,8,5], [2,4,6,7,9,9]));
// { count: 4, selected: [1,2,4,5] } ✅

console.log(maxMeetings([1,3,2,5], [2,4,3,6]));
// { count: 3 } ✅

console.log(maxMeetings([1,1,1], [3,3,3]));
// { count: 1 } ✅ (all same time)
```

---

## Dry Run

```
start=[1,3,0,5,8,5], end=[2,4,6,7,9,9]

Sort by end: (1,2,1), (3,4,2), (0,6,3), (5,7,4), (8,9,5), (5,9,6)

lastEnd=-∞:
(1,2,1): 1>-∞ → SELECT, lastEnd=2, count=1
(3,4,2): 3>2  → SELECT, lastEnd=4, count=2
(0,6,3): 0>4? NO → skip
(5,7,4): 5>4  → SELECT, lastEnd=7, count=3
(8,9,5): 8>7  → SELECT, lastEnd=9, count=4
(5,9,6): 5>9? NO → skip

Answer: 4 ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute Force | O(2^n) | O(n) |
| **Greedy** | **O(n log n)** | **O(n)** |

---

## Why Greedy is Correct — Exchange Argument

```
Suppose optimal solution picks meeting B (ends later) instead of A (ends earliest).

Replace B with A:
  - A ends earlier than B
  - Everything compatible with B is also compatible with A (A ends sooner → more room)
  - Count stays the same

∴ An optimal solution containing A exists.
By induction: always picking earliest-ending meeting is optimal. ✅
```

---

## ⚠️ Key Subtlety — `>` vs `>=`

```
End-inclusive meetings (occupy time e): use m.start > lastEndTime
End-exclusive meetings [s, e):          use m.start >= lastEndTime
```
Always clarify with the interviewer or problem statement.

---

## The Greedy Algorithm Family

| Problem | Sort by | Goal |
|---|---|---|
| **N Meetings** | End time | Max meetings |
| **Meeting Rooms I** (LC #252) | Start time | Can all be attended? |
| **Meeting Rooms II** (LC #253) | Start time + heap | Min rooms needed |
| **Non-overlapping Intervals** (LC #435) | End time | Min removals |
| **Job Sequencing** | Profit | Max profit |
| **Fractional Knapsack** | Value/weight ratio | Max value |

---

## Key Patterns & Takeaways

1. **Sort by END time — the key insight** — sorting by start time doesn't work (earliest-starting might end very late). End time determines future availability.
2. **Exchange argument** — the proof technique for greedy correctness. Show any optimal solution can include the greedy choice without decreasing the count.
3. **"Hello World" of greedy** — Activity Selection is the canonical greedy problem. The "sort by constraint, greedily select" template appears throughout greedy DSA.
4. **`>` vs `>=`** — depends on whether endpoints are inclusive or exclusive. Always clarify.
5. **Connection to intervals** — same problem appears as Non-overlapping Intervals (LC #435) where you count removals instead of selections. `removals = n - maxMeetings`.