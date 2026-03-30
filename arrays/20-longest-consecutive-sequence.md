# 20 - Longest Consecutive Sequence

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/longest-consecutive-sequence-in-an-array) | [LeetCode #128](https://leetcode.com/problems/longest-consecutive-sequence/)  
**Difficulty:** Medium  
**Topic:** Arrays, Hashing

### Statement
Given an unsorted array, return the length of the **longest consecutive sequence**. Must run in **O(n)** time.

```
[100, 4, 200, 1, 3, 2]         →  4   (1,2,3,4)
[0, 3, 7, 2, 5, 8, 4, 6, 0, 1] →  9   (0..8)
```

---

## Approaches

| Approach | Time | Space | Notes |
|---|---|---|---|
| Brute Force | O(n³) | O(1) | Too slow |
| Sorting | O(n log n) | O(1) | Fails O(n) requirement |
| **HashSet** | **O(n)** | **O(n)** | Amortized O(n) — optimal |

---

## The Core Insight — "Only Start at Sequence Beginnings"

Before counting a sequence from `num`, check if `num - 1` exists in the set:
- `num - 1` **exists** → `num` is mid-sequence → **skip** (avoid redundant counting)
- `num - 1` **absent** → `num` is a sequence start → **count upward**

```
nums = [100, 4, 200, 1, 3, 2]
Set  = {100, 4, 200, 1, 3, 2}

num=100: 99 in set? NO  → start → streak=1
num=4:   3 in set?  YES → skip ✅
num=1:   0 in set?  NO  → start → 1,2,3,4 → streak=4 ✅
num=3:   2 in set?  YES → skip ✅
num=2:   1 in set?  YES → skip ✅
```

---

## Why Is This O(n)? — Amortized Analysis

The inner `while` loop looks like O(n²), but:

```
The inner while ONLY runs for sequence STARTS.
Each element is visited by the inner while AT MOST ONCE total —
because each element belongs to exactly one sequence.

Total inner loop iterations across all outer iterations ≤ n
→ O(n) outer + O(n) inner = O(n) overall ✅
```

Same amortized argument as sliding window — a pointer that only moves forward, never backward.

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 2: Sorting — O(n log n) time, O(1) space
// ─────────────────────────────────────────────────────────
function longestConsecutiveSorting(nums) {
    if (nums.length === 0) return 0;
    nums.sort((a, b) => a - b);

    let longest = 1, streak = 1;

    for (let i = 1; i < nums.length; i++) {
        if (nums[i] === nums[i - 1]) continue;      // skip duplicates
        else if (nums[i] === nums[i - 1] + 1) {
            streak++;
            longest = Math.max(longest, streak);
        } else {
            streak = 1; // gap → reset
        }
    }

    return longest;
}


// ─────────────────────────────────────────────────────────
// APPROACH 3: HashSet — O(n) time, O(n) space ✅
// Only count from sequence starts (no num-1 in set)
// ─────────────────────────────────────────────────────────
function longestConsecutive(nums) {
    if (nums.length === 0) return 0;

    const numSet = new Set(nums); // O(1) lookups; auto-deduplicates
    let longest = 0;

    for (const num of numSet) {
        // Only start counting if this is a sequence beginning
        if (!numSet.has(num - 1)) {
            let currentNum = num;
            let streak = 1;

            // Count upward as long as consecutive elements exist
            while (numSet.has(currentNum + 1)) {
                currentNum++;
                streak++;
            }

            longest = Math.max(longest, streak);
        }
        // num-1 exists → mid-sequence → skip entirely (O(1))
    }

    return longest;
}

console.log(longestConsecutive([100, 4, 200, 1, 3, 2]));          // 4 ✅
console.log(longestConsecutive([0,3,7,2,5,8,4,6,0,1]));           // 9 ✅
console.log(longestConsecutive([1, 2, 3, 4, 5]));                 // 5 ✅
console.log(longestConsecutive([]));                               // 0 ✅
console.log(longestConsecutive([1, 1, 1, 1]));                    // 1 ✅
console.log(longestConsecutive([-1, 0, 1, 2]));                   // 4 ✅
```

---

## Dry Run

```
nums = [0,3,7,2,5,8,4,6,0,1]
Set  = {0,1,2,3,4,5,6,7,8}

num=0: -1 in set? NO → start → 0→1→2→3→4→5→6→7→8 → streak=9, longest=9
num=1: 0 in set?  YES → skip
num=2: 1 in set?  YES → skip
...all others skipped...

Answer: 9 ✅
Inner while ran once, 9 total iterations. All else O(1). Total = O(n).
```

---

## Edge Cases

| Case | Input | Output | Note |
|---|---|---|---|
| Empty | `[]` | `0` | Early return |
| All duplicates | `[2,2,2]` | `1` | Set deduplicates → streak of 1 |
| All consecutive | `[3,4,5,6]` | `4` | One start, counts all |
| Negatives | `[-3,-2,-1,0]` | `4` | Works naturally |
| Large gaps | `[1,100,200]` | `1` | Three separate sequences |

---

## Key Patterns & Takeaways

1. **"Only start at sequence beginnings"** — `!numSet.has(num-1)` guard. Eliminates all redundant counting. Every element consumed by inner while at most once.
2. **Amortized O(n)** — inner while looks O(n²) but each element is visited at most once total. Same argument as sliding window. Must explain this to the interviewer.
3. **Iterate over Set, not array** — avoids processing duplicates in the outer loop. More precise and slightly more efficient.
4. **Sorting fallback** — O(n log n), correct, with careful duplicate skip (`nums[i] === nums[i-1]`). Good to mention before jumping to the optimal.
5. **Union-Find extension** — for "return the actual sequence" or "streaming input" follow-ups, Union-Find groups consecutive elements naturally. Worth knowing at senior level.