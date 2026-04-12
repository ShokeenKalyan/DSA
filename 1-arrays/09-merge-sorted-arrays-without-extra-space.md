# 09 - Merge Two Sorted Arrays Without Extra Space

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/merge-two-sorted-arrays-without-extra-space) | [LeetCode #88](https://leetcode.com/problems/merge-sorted-array/) (variant)  
**Difficulty:** Hard  
**Topic:** Arrays, Two Pointers, Sorting

### Statement
Given two sorted arrays `arr1` (size `m`) and `arr2` (size `n`), merge them **in-place** without extra space such that:
- `arr1` contains the **smallest `m` elements** (sorted)
- `arr2` contains the **largest `n` elements** (sorted)

```
Input:  arr1=[1,4,8,10],  arr2=[2,3,9]
Output: arr1=[1,2,3,4],   arr2=[8,9,10]

Input:  arr1=[1,3,5,7],   arr2=[0,2,6,8,9]
Output: arr1=[0,1,2,3],   arr2=[5,6,7,8,9]
```

---

## Approaches

| Approach | Time | Space | Notes |
|---|---|---|---|
| Brute (extra array) | O((m+n)log(m+n)) | O(m+n) | Violates constraint |
| Two Pointer Swap | O(m×n) worst case | O(1) | Simple, good stepping stone |
| **Gap Method** | **O((m+n)log(m+n))** | **O(1)** | True optimal |

---

## Approach 2 — Two Pointer Swap

**Intuition:** The largest elements that belong in `arr2` are held in `arr1`'s tail; the smallest that belong in `arr1` sit in `arr2`'s head. Compare `arr1[end]` vs `arr2[start]`, swap if out of order, then individually sort both arrays.

```javascript
function mergeTwoPointer(arr1, arr2) {
    let left = arr1.length - 1; // end of arr1
    let right = 0;              // start of arr2

    // Swap out-of-place elements until sorted boundary is correct
    while (left >= 0 && right < arr2.length) {
        if (arr1[left] > arr2[right]) {
            [arr1[left], arr2[right]] = [arr2[right], arr1[left]];
            left--;
            right++;
        } else {
            break; // arr1[left] <= arr2[right] → boundary is correct
        }
    }

    // Each array individually sorted to fix internal order
    arr1.sort((a, b) => a - b);
    arr2.sort((a, b) => a - b);
}
```

---

## Approach 3 — Gap Method (Shell Sort Inspired) ✅ Optimal

**Intuition:** Treat both arrays as a single **virtual array** of size `m+n`. Use a shrinking gap (starting at `ceil((m+n)/2)`) to compare and swap elements `gap` positions apart across the virtual array. Halve the gap each round until gap=1. Identical to Shell Sort's philosophy.

**Virtual array indexing:**
```
index i → arr1[i]      if i < m
index i → arr2[i - m]  if i >= m
```

**Gap sequence for total=7:** `4 → 2 → 1 → stop`

```javascript
function mergeGapMethod(arr1, arr2) {
    const m = arr1.length;
    const n = arr2.length;
    const total = m + n;

    // Access virtual combined array by logical index
    function getVal(i) {
        return i < m ? arr1[i] : arr2[i - m];
    }

    // Set value in virtual combined array by logical index
    function setVal(i, val) {
        if (i < m) arr1[i] = val;
        else arr2[i - m] = val;
    }

    // Swap two positions in virtual array if left > right
    function swapIfNeeded(i, j) {
        const vi = getVal(i);
        const vj = getVal(j);
        if (vi > vj) {
            setVal(i, vj);
            setVal(j, vi);
        }
    }

    // ── Gap Method ──────────────────────────────────────────
    // Start at ceil((m+n)/2), halve each round, stop after gap=1
    let gap = Math.ceil(total / 2);

    while (gap > 0) {
        // Compare and swap all pairs that are `gap` apart
        let left = 0;
        let right = left + gap;

        while (right < total) {
            swapIfNeeded(left, right);
            left++;
            right++;
        }

        // gap=1 was the final pass → stop
        if (gap === 1) break;

        // Ceiling halve the gap
        gap = Math.ceil(gap / 2);
    }
}

// Test cases
const a1 = [1, 4, 8, 10], b1 = [2, 3, 9];
mergeGapMethod(a1, b1);
console.log(a1, b1); // [1,2,3,4] [8,9,10] ✅

const a2 = [1, 3, 5, 7], b2 = [0, 2, 6, 8, 9];
mergeGapMethod(a2, b2);
console.log(a2, b2); // [0,1,2,3] [5,6,7,8,9] ✅

const a3 = [10], b3 = [1];
mergeGapMethod(a3, b3);
console.log(a3, b3); // [1] [10] ✅
```

---

## Dry Run — Gap Method

```
arr1=[1,4,8,10], arr2=[2,3,9]
Virtual: [1, 4, 8, 10, 2, 3, 9]   total=7

Round 1: gap = ceil(7/2) = 4
  (0,4): 1 vs 2 → ok
  (1,5): 4 vs 3 → SWAP → arr1=[1,3,8,10], arr2=[2,4,9]
  (2,6): 8 vs 9 → ok
  Virtual: [1, 3, 8, 10, 2, 4, 9]

Round 2: gap = ceil(4/2) = 2
  (0,2): 1 vs 8  → ok
  (1,3): 3 vs 10 → ok
  (2,4): 8 vs 2  → SWAP → arr1=[1,3,2,10], arr2=[8,4,9]
  (3,5): 10 vs 4 → SWAP → arr1=[1,3,2,4],  arr2=[8,10,9]
  (4,6): 8 vs 9  → ok

Round 3: gap = ceil(2/2) = 1  ← final pass
  (1,2): 3 vs 2  → SWAP → arr1=[1,2,3,4]
  (5,6): 10 vs 9 → SWAP → arr2=[8,9,10]
  gap=1 → break

Result: arr1=[1,2,3,4], arr2=[8,9,10] ✅
```

---

## Critical Subtleties

```
1. Ceiling division: Math.ceil(gap/2) — NOT Math.floor or gap>>1
   Ensures gap correctly reaches 1 for the final pass.

2. Break AFTER processing gap=1, not before.
   gap=1 is the crucial final "bubble sort" pass.

3. Virtual array boundary: i < m → arr1[i], else → arr2[i-m]
   Keep this in clean helper functions to avoid index bugs.

4. Two Pointer Swap is O(m×n) worst case — worse than naive sort
   for large arrays. Always escalate to Gap Method as the optimal.
```

---

## Key Patterns & Takeaways

1. **Gap Method = Shell Sort on a virtual array** — if you know Shell Sort's decreasing-gap philosophy, this follows naturally.
2. **Two Pointer as stepping stone** — always present this first in an interview (it's O(1) space and correct), then escalate to Gap Method for optimal time.
3. **Virtual array abstraction** — treating two separate arrays as one logical unit via index mapping. A powerful general technique: hide boundary logic in helpers, keep the main algorithm clean.
4. **Ceiling division is critical** — `Math.ceil(gap/2)` ensures gap reaches 1 and the final pass actually runs.
5. **Harder than it looks** — if this is asked, the interviewer wants Gap Method. Two Pointer is O(m×n) worst case which is worse than naive sort for large inputs.