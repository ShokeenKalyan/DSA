# 05 - Sort an Array of 0s, 1s and 2s (Dutch National Flag)

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/sort-an-array-of-0s-1s-and-2s) | [LeetCode #75](https://leetcode.com/problems/sort-colors/)  
**Difficulty:** Medium  
**Topic:** Arrays, Two Pointers

### Statement
Given an array containing only `0`s, `1`s, and `2`s, sort it **in-place** in a **single pass** without using any sorting algorithm or extra space.

```
Input:  [2, 0, 2, 1, 1, 0]
Output: [0, 0, 1, 1, 2, 2]

Input:  [2, 0, 1]
Output: [0, 1, 2]
```

---

## Intuition

A generic sort is O(n log n). We can do **O(n) in a single pass** because the domain is restricted to exactly `{0, 1, 2}`.

**Dutch National Flag** (proposed by Dijkstra): maintain three pointers that divide the array into four regions simultaneously, processing one element per step.

```
[  0s region  |  1s region  |  unknown  |  2s region  ]
              ↑             ↑           ↑
             low           mid         high

Invariants:
  arr[0..low-1]    → all 0s
  arr[low..mid-1]  → all 1s
  arr[mid..high]   → unknown (being processed)
  arr[high+1..n-1] → all 2s
```

---

## The 3 Cases at `mid`

```
Case 1: arr[mid] === 0 → swap(mid, low), low++, mid++
Case 2: arr[mid] === 1 → mid++ (already in right place)
Case 3: arr[mid] === 2 → swap(mid, high), high-- (do NOT advance mid)
```

**Why mid doesn't advance for `2`:**  
When swapping with `high`, the element that comes back to `mid` is from the unknown region — we don't know what it is yet, so we must re-examine it.  
When swapping with `low`, we know `arr[low]` was a `1` (since `low..mid-1` are all 1s), so `mid` safely receives a `1` and can advance.

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 2: Counting — O(n) time, O(1) space, 2 passes
// ─────────────────────────────────────────────────────────
function sortColorsCounting(nums) {
    let count0 = 0, count1 = 0, count2 = 0;

    // Pass 1: Count occurrences of each value
    for (const num of nums) {
        if (num === 0) count0++;
        else if (num === 1) count1++;
        else count2++;
    }

    // Pass 2: Overwrite array with correct counts
    let i = 0;
    while (count0-- > 0) nums[i++] = 0;
    while (count1-- > 0) nums[i++] = 1;
    while (count2-- > 0) nums[i++] = 2;
}


// ─────────────────────────────────────────────────────────
// APPROACH 3: Dutch National Flag — O(n) time, O(1) space, 1 pass
// ─────────────────────────────────────────────────────────
function sortColors(nums) {
    // Three pointers defining the boundaries of each region:
    // low  → next position to place a 0
    // mid  → current element under examination
    // high → next position to place a 2
    let low = 0;
    let mid = 0;
    let high = nums.length - 1;

    // Process until mid crosses high (unknown region exhausted)
    while (mid <= high) {

        if (nums[mid] === 0) {
            // Current element is 0 → swap with low boundary
            // arr[low] was a 1 (invariant), so arr[mid] gets 1 → safe to advance mid
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++;
            mid++;

        } else if (nums[mid] === 1) {
            // Current element is 1 → already in correct region
            mid++;

        } else {
            // Current element is 2 → swap with high boundary
            // arr[mid] receives unknown element from high → do NOT advance mid
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
        }
    }
}

// ── Test cases ──────────────────────────────────────────
const t1 = [2, 0, 2, 1, 1, 0]; sortColors(t1); console.log(t1); // [0,0,1,1,2,2]
const t2 = [2, 0, 1];          sortColors(t2); console.log(t2); // [0,1,2]
const t3 = [0];                 sortColors(t3); console.log(t3); // [0]
const t4 = [1, 2, 0, 1, 2, 0]; sortColors(t4); console.log(t4); // [0,0,1,1,2,2]
```

---

## Dry Run

```
Input: [2, 0, 2, 1, 1, 0]  low=0, mid=0, high=5

mid=0, nums[0]=2 → swap(0,5) → [0,0,2,1,1,2], high=4  (mid stays 0)
mid=0, nums[0]=0 → swap(0,0) → no change, low=1, mid=1
mid=1, nums[1]=0 → swap(1,1) → no change, low=2, mid=2
mid=2, nums[2]=2 → swap(2,4) → [0,0,1,1,2,2], high=3  (mid stays 2)
mid=2, nums[2]=1 → mid=3
mid=3, nums[3]=1 → mid=4
mid(4) > high(3) → STOP

Result: [0, 0, 1, 1, 2, 2] ✅
```

---

## Complexity Summary

| Approach | Time | Space | Passes |
|---|---|---|---|
| Brute (sort) | O(n log n) | O(1) | 1 |
| Counting | O(n) | O(1) | 2 |
| **Dutch National Flag** | **O(n)** | **O(1)** | **1** |

---

## Key Patterns & Takeaways

1. **Dutch National Flag pattern** — 3-pointer partition. This is the foundation of **QuickSort's partition step**. Know it cold.
2. **Invariant-based thinking** — define what each region means, maintain those invariants, and correctness follows automatically. A powerful reasoning technique for all pointer problems.
3. **mid doesn't advance for `2`, does for `0`** — asymmetry because: swapping with `low` gives back a known `1`; swapping with `high` gives back an unknown value.
4. **Counting as fallback** — if you blank on DNF, counting is still O(n) and fully correct. Mention it first, then optimize to single pass.
5. **Generalization follow-up** — *"What if 4 colors?"* Counting generalizes trivially; DNF doesn't scale as cleanly beyond 3 values.