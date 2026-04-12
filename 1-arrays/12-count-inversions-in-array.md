# 12 - Count Inversions in an Array

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/count-inversions-in-an-array)  
**Difficulty:** Hard  
**Topic:** Arrays, Divide & Conquer, Merge Sort

### Statement
Count the number of **inversions** in an array. A pair `(i, j)` is an inversion if `i < j` AND `arr[i] > arr[j]`.

Inversions measure how far an array is from being sorted.

```
Input:  [2, 4, 1, 3, 5]  →  3   (pairs: (2,1), (4,1), (4,3))
Input:  [5, 4, 3, 2, 1]  →  10  (every pair is an inversion)
Input:  [1, 2, 3, 4, 5]  →  0   (already sorted)
```

---

## Approaches

| Approach | Time | Space | Notes |
|---|---|---|---|
| Brute Force | O(n²) | O(1) | Check every pair |
| **Modified Merge Sort** | **O(n log n)** | **O(n)** | Count while sorting |

---

## Core Insight

**Merge Sort's merge step naturally reveals inversions.**

When merging two sorted halves and we pick an element from the **right half** before elements from the **left half** — it means ALL remaining left half elements are greater than the current right element (because the left is sorted). We can count them all at once:

```
inversions += (mid - leftPointer + 1)
```

Three types of inversions, each counted separately:
```
Total = inversions within LEFT half     (recursive left call)
      + inversions within RIGHT half    (recursive right call)
      + CROSS inversions                (counted during merge)
```

---

## Why the Merge Step Works

```
Left (sorted):  [1, 4, 6]    Right (sorted): [2, 3, 5]

i=1: 4 > 2 → pick right. All of [4,6] > 2 → inversions += 2
i=1: 4 > 3 → pick right. All of [4,6] > 3 → inversions += 2
i=1: 4 < 5 → pick left.
i=2: 6 > 5 → pick right. [6] > 5 → inversions += 1
Total cross inversions = 5
```

---

## Solution (JavaScript)

```javascript
/**
 * Count Inversions — Modified Merge Sort
 * Time: O(n log n) | Space: O(n)
 */

// ─────────────────────────────────────────────────────────
// APPROACH 1: Brute Force — O(n²)
// ─────────────────────────────────────────────────────────
function countInversionsBrute(arr) {
    let count = 0;
    for (let i = 0; i < arr.length - 1; i++)
        for (let j = i + 1; j < arr.length; j++)
            if (arr[i] > arr[j]) count++;
    return count;
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Modified Merge Sort — O(n log n)
// ─────────────────────────────────────────────────────────

/**
 * Merge two sorted halves and count CROSS inversions
 */
function mergeAndCount(arr, temp, left, mid, right) {
    let i = left;     // left half pointer
    let j = mid + 1;  // right half pointer
    let k = left;     // temp array pointer
    let inversions = 0;

    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            // Equal elements are NOT inversions → use <=
            temp[k++] = arr[i++];
        } else {
            // arr[i] > arr[j]: all remaining left elements form inversions
            // Left is sorted → arr[i..mid] are ALL > arr[j]
            inversions += (mid - i + 1); // ← KEY: count all at once
            temp[k++] = arr[j++];
        }
    }

    while (i <= mid)  temp[k++] = arr[i++]; // remaining left
    while (j <= right) temp[k++] = arr[j++]; // remaining right

    // Copy merged result back into original array
    for (let idx = left; idx <= right; idx++) arr[idx] = temp[idx];

    return inversions;
}

/**
 * Recursive merge sort accumulating inversion count
 */
function mergeSortCount(arr, temp, left, right) {
    if (left >= right) return 0; // base case: single element

    const mid = Math.floor((left + right) / 2);

    let inversions = 0;
    inversions += mergeSortCount(arr, temp, left, mid);      // left half
    inversions += mergeSortCount(arr, temp, mid + 1, right); // right half
    inversions += mergeAndCount(arr, temp, left, mid, right); // cross

    return inversions;
}

/**
 * Main wrapper — allocates temp array once, works on a copy
 */
function countInversions(arr) {
    const copy = [...arr]; // don't mutate original
    const temp = new Array(arr.length).fill(0);
    return mergeSortCount(copy, temp, 0, copy.length - 1);
}

// Test cases
console.log(countInversions([2, 4, 1, 3, 5])); // 3  ✅
console.log(countInversions([5, 4, 3, 2, 1])); // 10 ✅
console.log(countInversions([1, 2, 3, 4, 5])); // 0  ✅
console.log(countInversions([3, 1, 2]));        // 2  ✅
```

---

## Dry Run

```
arr = [2, 4, 1, 3, 5]

Left recursion on [2,4,1]:
  Left [2,4]: merge → 0 inversions
  Right [1]:  0 inversions
  Merge [2,4]|[1]: 2>1 → inversions += (1-0+1)=2, merged=[1,2,4]

Right recursion on [3,5]:
  Merge [3]|[5]: 3<5 → pick left. 0 inversions.

Final merge [1,2,4]|[3,5]:
  1<3 → pick 1
  2<3 → pick 2
  4>3 → inversions += (2-2+1)=1, pick 3
  4<5 → pick 4, pick 5

Total = 2 + 0 + 1 = 3 ✅
```

---

## Critical Implementation Details

```
1. Use <= in merge (not <):
   arr[i] <= arr[j] → pick left. Equal elements are NOT inversions.
   Using < would count equals as inversions → wrong answer.

2. inversions += (mid - i + 1), not (mid - i):
   Elements from index i TO mid inclusive = (mid - i + 1) elements.

3. Allocate temp array ONCE in the wrapper:
   Don't allocate new arrays in each recursive call → unnecessary allocations.

4. Work on a copy of the input:
   Merge sort mutates the array. Use [...arr] if original must be preserved.
```

---

## Merge Sort Based Problem Family

| Problem | Count in merge step | LeetCode |
|---|---|---|
| **Count Inversions** | `arr[i] > arr[j]` | — |
| **Count Reverse Pairs** | `arr[i] > 2*arr[j]` (separate pass before merge) | #493 |
| **Merge Sort** | Nothing — just sort | — |

> ⚠️ **Count Reverse Pairs (LC #493)** — common senior follow-up. Same structure, but you must count `arr[i] > 2*arr[j]` in a **separate pass before merging** (can't merge and count simultaneously for this variant).

---

## Key Patterns & Takeaways

1. **Piggyback on Merge Sort** — the core technique. Merge sort already compares every cross-half pair during merge. Intercept those comparisons to count inversions for free. Generalizable to many counting problems.
2. **`(mid - i + 1)` not 1** — the left half is sorted, so if `arr[i] > arr[j]`, ALL elements from `i` to `mid` are inversions with `arr[j]`. Count in bulk — this is what makes it O(n log n) vs O(n²).
3. **`<=` not `<`** — equal elements are NOT inversions. A subtle but critical correctness detail.
4. **Divide & conquer = left + right + cross** — a powerful mental model for counting pairs across any partition. Applies broadly beyond just inversions.
5. **Count Reverse Pairs follow-up** — identical structure but requires a separate counting pass before merging. Knowing the difference demonstrates deep understanding.