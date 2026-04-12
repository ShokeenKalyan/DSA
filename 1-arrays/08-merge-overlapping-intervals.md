# 08 - Merge Overlapping Intervals

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/merge-overlapping-sub-intervals) | [LeetCode #56](https://leetcode.com/problems/merge-intervals/)  
**Difficulty:** Medium  
**Topic:** Arrays, Sorting, Intervals

### Statement
Given an array of intervals `[start, end]`, merge all **overlapping intervals** and return an array of non-overlapping intervals that cover all the input intervals.

```
Input:  [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]

Input:  [[1,4],[4,5]]
Output: [[1,5]]   ← touching intervals merge too
```

---

## Intuition

**Sort by start time first.** After sorting, an interval can only overlap with its immediate predecessor — no need to look further back. Reduces the problem to a single O(n) sweep.

**Why?** After sorting: if `intervals[i].start > intervals[i-1].end`, they can't overlap — and neither can anything after `i` with `i-1`. If they do overlap, extend end: `max(current.end, next.end)`.

---

## Strategy

```
1. Sort intervals by start time
2. Push first interval into result as the initial merge window
3. For each subsequent interval:
   - If current.start <= lastMerged.end → overlap → extend end (Math.max)
   - Else → no overlap → push as new interval
```

---

## Solution (JavaScript)

```javascript
/**
 * Merge Intervals
 * LeetCode #56
 * Time:  O(n log n) — dominated by sort
 * Space: O(n)       — output array
 */
function merge(intervals) {
    if (intervals.length <= 1) return intervals;

    // ── STEP 1: Sort by start time ──────────────────────────
    // Overlapping intervals become adjacent after sorting
    intervals.sort((a, b) => a[0] - b[0]);

    // ── STEP 2: Sweep and merge ─────────────────────────────
    const result = [];
    result.push(intervals[0]);

    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const lastMerged = result[result.length - 1];

        if (current[0] <= lastMerged[1]) {
            // Overlapping → extend end (Math.max handles fully-contained case)
            // NEVER shrink: [1,10] merged with [2,3] should stay [1,10]
            lastMerged[1] = Math.max(lastMerged[1], current[1]);
        } else {
            // No overlap → new separate interval
            result.push(current);
        }
    }

    return result;
}

console.log(merge([[1,3],[2,6],[8,10],[15,18]])); // [[1,6],[8,10],[15,18]] ✅
console.log(merge([[1,4],[4,5]]));                // [[1,5]] ✅
console.log(merge([[1,4],[2,3]]));                // [[1,4]] ✅ (fully contained)
console.log(merge([[1,10],[2,3],[4,8],[9,11]]));  // [[1,11]] ✅
```

---

## Dry Run

```
Input: [[1,3],[2,6],[8,10],[15,18]]  (already sorted)

result = [[1,3]]

i=1: [2,6] → 2<=3? YES → end=max(3,6)=6   → result=[[1,6]]
i=2: [8,10]→ 8<=6? NO  → push             → result=[[1,6],[8,10]]
i=3: [15,18]→15<=10? NO→ push             → result=[[1,6],[8,10],[15,18]] ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute | O(n² log n) | O(n) |
| **Optimal** | **O(n log n)** | **O(n)** |

Can we beat O(n log n)? Only if input is pre-sorted → O(n). Otherwise sorting is the lower bound.

---

## Edge Cases

| Case | Input | Output | Note |
|---|---|---|---|
| Touching intervals | `[[1,4],[4,5]]` | `[[1,5]]` | Use `<=` not `<` in overlap check |
| Fully contained | `[[1,10],[2,3]]` | `[[1,10]]` | `Math.max` prevents shrinking end |
| Single interval | `[[5,7]]` | `[[5,7]]` | Early return |
| All merge into one | `[[1,4],[2,5],[3,6]]` | `[[1,6]]` | Chain of overlaps handled |
| Unsorted input | `[[3,5],[1,2]]` | `[[1,2],[3,5]]` | Sort step handles it |

---

## The Interval Problem Family

| Problem | Key Idea | LeetCode |
|---|---|---|
| **Merge Intervals** | Sort + sweep, extend end | #56 |
| **Insert Interval** | Find overlap zone, merge, reconstruct | #57 |
| **Non-overlapping Intervals** | Greedy: remove min to make non-overlapping | #435 |
| **Meeting Rooms I** | Can one person attend all? Any overlap? | #252 |
| **Meeting Rooms II** | Min rooms = max concurrent meetings | #253 |

---

## Key Patterns & Takeaways

1. **Sort-then-sweep** is the universal interval pattern. Sorting by start makes overlaps local (adjacent) → enables clean O(n) sweep. Applies to almost every interval problem.
2. **`Math.max` on end, never `Math.min`** — always extend, never shrink the active merge window. Forgetting this breaks fully-contained cases.
3. **`<=` not `<` for overlap** — touching intervals `[1,4],[4,5]` are overlapping. Using `<` incorrectly leaves them separate.
4. **Mutate result's last element directly** — `result[result.length-1][1] = Math.max(...)` is clean. No need to pop and re-push.
5. **Meeting Rooms II follow-up** — min conference rooms needed = max concurrent meetings. Use min-heap on end times, or sort start/end arrays separately with two pointers.