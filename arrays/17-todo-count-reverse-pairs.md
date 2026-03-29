# 17 - Count Reverse Pairs

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/count-reverse-pairs) | [LeetCode #493](https://leetcode.com/problems/reverse-pairs/)  
**Difficulty:** Hard  
**Topic:** Arrays, Divide & Conquer, Modified Merge Sort

### Statement
Count pairs `(i, j)` where `i < j` AND `nums[i] > 2 * nums[j]`.

```
Input:  [1, 3, 2, 3, 1]  →  2   (pairs: (3,1),(3,1))
Input:  [2, 4, 3, 5, 1]  →  3   (pairs: (4,1),(3,1),(5,1))
```

---

## Approaches

| Approach | Time | Space |
|---|---|---|
| Brute Force | O(n²) | O(1) |
| **Modified Merge Sort** | **O(n log n)** | **O(n)** |

---

## The Critical Insight — Why Separate Count and Merge

This is a direct extension of **Count Inversions** (Problem 12), but with one key difference:

| | Count Inversions | Count Reverse Pairs |
|---|---|---|
| Condition | `arr[i] > arr[j]` | `arr[i] > 2 * arr[j]` |
| Count + Merge | **Same pass** ✅ | **Separate passes** ✅ |

**Why can't we count and merge in the same pass here?**

In Count Inversions, `arr[i] > arr[j]` aligns perfectly with the merge decision (`arr[j]` is picked because it's smaller). When we pick `arr[j]`, all remaining left elements are guaranteed to be > `arr[j]`.

In Count Reverse Pairs, `arr[i] > 2 * arr[j]` does NOT align with the merge decision (`arr[i] ≤ arr[j]` for picking left). A left element might be ≤ `arr[j]` but still ≤ `2 * arr[j]` — or not. The pointers get corrupted if mixed. **Separate the two passes.**

**Strategy per merge step:**
```
Phase A — COUNT: Two-pointer scan on sorted halves
          For each j (right), advance i (left) while arr[i] ≤ 2*arr[j]
          → count += (mid - i + 1)

Phase B — MERGE: Standard merge sort merge (completely separate)
```

**Two-pointer in Phase A is O(n):** Both halves are sorted. As `j` increases (values grow), threshold `2*arr[j]` grows monotonically → `i` only moves forward. Classic monotonic two-pointer.

---

## Solution (JavaScript)

```javascript
/**
 * Count Reverse Pairs — Modified Merge Sort
 * LeetCode #493
 * Time: O(n log n) | Space: O(n)
 */

// ─────────────────────────────────────────────────────────
// Count cross reverse pairs between two SORTED halves
// Phase A — separate from merging
// ─────────────────────────────────────────────────────────
function countCrossPairs(arr, left, mid, right) {
    let count = 0;
    let i = left; // i only moves forward (monotonic)

    for (let j = mid + 1; j <= right; j++) {
        // Advance i while arr[i] ≤ 2 * arr[j] (not a reverse pair)
        while (i <= mid && arr[i] <= 2 * arr[j]) i++;
        // arr[i..mid] all satisfy arr[k] > 2*arr[j]
        count += (mid - i + 1);
    }

    return count;
}

// ─────────────────────────────────────────────────────────
// Standard merge — Phase B, completely separate from Phase A
// ─────────────────────────────────────────────────────────
function mergeHalves(arr, temp, left, mid, right) {
    let i = left, j = mid + 1, k = left;

    while (i <= mid && j <= right) {
        arr[i] <= arr[j] ? (temp[k++] = arr[i++]) : (temp[k++] = arr[j++]);
    }
    while (i <= mid)   temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];

    for (let idx = left; idx <= right; idx++) arr[idx] = temp[idx];
}

// ─────────────────────────────────────────────────────────
// Recursive merge sort accumulating reverse pair count
// Order: recurse → COUNT (on sorted halves) → MERGE
// ─────────────────────────────────────────────────────────
function mergeSort(arr, temp, left, right) {
    if (left >= right) return 0;

    const mid = Math.floor((left + right) / 2);
    let count = 0;

    count += mergeSort(arr, temp, left, mid);       // sort & count left
    count += mergeSort(arr, temp, mid + 1, right);  // sort & count right
    count += countCrossPairs(arr, left, mid, right); // Phase A: count cross
    mergeHalves(arr, temp, left, mid, right);        // Phase B: merge

    return count;
}

function reversePairs(nums) {
    if (nums.length <= 1) return 0;
    const copy = [...nums];
    const temp = new Array(nums.length).fill(0);
    return mergeSort(copy, temp, 0, copy.length - 1);
}

console.log(reversePairs([1, 3, 2, 3, 1])); // 2 ✅
console.log(reversePairs([2, 4, 3, 5, 1])); // 3 ✅
console.log(reversePairs([1, 2, 3]));        // 0 ✅
console.log(reversePairs([3, 2, 1]));        // 1 ✅ (only 3>2×1=2)
```

---

## Dry Run

```
nums = [2, 4, 3, 5, 1]

Left recursion → [2,3,4] (sorted), 0 cross pairs
Right recursion → [1,5] (sorted), 1 cross pair (5>2×1=2)

Final cross on [2,3,4]|[1,5]:
  j=3(val=1): threshold=2
    arr[0]=2 ≤ 2 → i++
    arr[1]=3 > 2 → count += (2-1+1)=2
  j=4(val=5): threshold=10
    arr[1]=3 ≤ 10 → i++
    arr[2]=4 ≤ 10 → i++ → i=3 > mid=2 → count += 0
  Cross pairs = 2

Total = 0 + 1 + 2 = 3 ✅
```

---

## ⚠️ Key Subtleties

```
1. Separate count and merge — NEVER combine them for this problem.
   Mixing corrupts the i-pointer. Always: count THEN merge.

2. Two-pointer is O(n) in countCrossPairs because i is monotonic.
   i never goes backward as j increases → total O(n) across the loop.

3. Integer overflow in other languages:
   2 * nums[j] can overflow 32-bit int.
   Java/C++: cast to long → (long)nums[i] > 2L * nums[j]
   JavaScript: 64-bit float safe up to 2^53 (no issue, but mention it).

4. Count happens AFTER both recursive calls (on sorted halves).
   Counting on unsorted halves would give wrong results.
```

---

## Key Patterns & Takeaways

1. **"Separate count and merge"** — the core insight that distinguishes this from Count Inversions. Condition `arr[i] > 2*arr[j]` doesn't align with merge decision → separate passes mandatory.
2. **Two-pointer in countCrossPairs is O(n)** — both halves sorted + j increasing monotonically → i never backtracks. Recognise this as a monotonic two-pointer pattern.
3. **Count THEN merge** — counting requires sorted halves (done by recursion). Merging is after counting. Order is fixed: recurse → count → merge.
4. **Direct extension of Problem 12** — same skeleton, one word change (`2 *`), completely different implementation strategy. Knowing this difference cold is a genuine senior signal.
5. **Integer overflow** — `2 * nums[j]` overflows 32-bit. JS is safe but always mention it for Java/C++ awareness.