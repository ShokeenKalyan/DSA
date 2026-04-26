# 72 - Kth Smallest Element in a Sorted Matrix

## Problem
**LeetCode:** [#378 Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)  
**Difficulty:** Medium  
**Topic:** Arrays, Binary Search, Heap, Matrix

### Statement
Given an `n×n` matrix with sorted rows and columns, return the kth smallest element.

```
[[1,5,9],[10,11,13],[12,13,15]], k=8  →  13
[[-5]], k=1                           →  -5
[[1,2],[1,3]], k=2                    →  1
```

---

## Approaches

| Approach | Time | Space | Notes |
|---|---|---|---|
| Flatten + Sort | O(n² log n) | O(n²) | Ignores sorted structure |
| Min-Heap | O(k log n) | O(n) | Good when k is small |
| **Binary Search on Value** | **O(n log(max-min))** | **O(1)** | Best overall |

---

## Approach 3 — Binary Search on Value ✅

**Search the value range** `[matrix[0][0], matrix[n-1][n-1]]`.  
For each `mid`, count elements ≤ `mid`. If `count < k` → search right; else → search left.

**Count elements ≤ target in O(n) — staircase from bottom-left:**
```
Start at matrix[n-1][0]:
  matrix[row][col] ≤ target → count += row+1, col++  (entire column above valid)
  matrix[row][col] > target → row--                   (move up)

At most 2n steps → O(n)
```

**Why `lo` is always a matrix value at convergence:**  
`count(lo-1) < k` and `count(lo) >= k` — meaning exactly `k-1` elements are strictly less than `lo`. Since the count jumps at `lo`, `lo` must exist in the matrix.

---

## Solution (JavaScript)

```javascript
// Count elements ≤ target using staircase from bottom-left — O(n)
function countLessOrEqual(matrix, target, n) {
    let count = 0, row = n-1, col = 0;

    while (row >= 0 && col < n) {
        if (matrix[row][col] <= target) {
            count += row + 1; // All elements in this col from 0..row are ≤ target
            col++;
        } else {
            row--;
        }
    }

    return count;
}

// ─────────────────────────────────────────────────────────
// Binary Search on Value — O(n log(max-min)), O(1) space ✅
// ─────────────────────────────────────────────────────────
function kthSmallest(matrix, k) {
    const n = matrix.length;
    let lo = matrix[0][0];
    let hi = matrix[n-1][n-1];

    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        const count = countLessOrEqual(matrix, mid, n);

        if (count < k) lo = mid + 1; // Fewer than k elements ≤ mid → go right
        else           hi = mid;     // k+ elements ≤ mid → answer ≤ mid
    }

    return lo; // Guaranteed to be an actual matrix value
}

// ─────────────────────────────────────────────────────────
// Min-Heap — O(k log n), O(n) space
// Better when k << n²
// ─────────────────────────────────────────────────────────
function kthSmallestHeap(matrix, k) {
    const n = matrix.length;
    const heap = [];
    for (let r = 0; r < n; r++) heap.push([matrix[r][0], r, 0]);
    heap.sort((a, b) => a[0] - b[0]);

    let result = 0;
    for (let i = 0; i < k; i++) {
        const [val, row, col] = heap.shift();
        result = val;
        if (col + 1 < n) {
            heap.push([matrix[row][col+1], row, col+1]);
            heap.sort((a, b) => a[0] - b[0]);
        }
    }
    return result;
}

console.log(kthSmallest([[1,5,9],[10,11,13],[12,13,15]], 8)); // 13 ✅
console.log(kthSmallest([[-5]], 1));                          // -5 ✅
console.log(kthSmallest([[1,2],[1,3]], 2));                   // 1  ✅
console.log(kthSmallest([[1,2],[3,3]], 3));                   // 3  ✅
```

---

## Dry Run — Binary Search

```
matrix=[[1,5,9],[10,11,13],[12,13,15]], k=8, lo=1, hi=15

mid=8:  count(≤8)=2  < 8 → lo=9
mid=12: count(≤12)=6 < 8 → lo=13
mid=14: count(≤14)=8 ≥ 8 → hi=14
mid=13: count(≤13)=8 ≥ 8 → hi=13
lo===hi=13 → return 13 ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Flatten + Sort | O(n² log n) | O(n²) |
| Min-Heap | O(k log n) | O(n) |
| **Binary Search** | **O(n log(max-min))** | **O(1)** |

---

## Key Patterns & Takeaways

1. **Binary search on value range** — when answer is a value in `[lo, hi]`, binary search counting "how many ≤ mid". Applies to Kth Largest, Capacity to Ship, Split Array Largest Sum.
2. **Staircase count O(n)** — bottom-left corner, go right when ≤ target (count entire column), go up when > target. At most 2n moves. Same technique as Search 2D Matrix II (P13).
3. **`lo` converges to actual value** — count jumps at real matrix values. `lo` at convergence is guaranteed to be in the matrix.
4. **Min-heap for small k** — O(k log n) better than O(n log V) when k << n².
5. **Connection to P13** — staircase traversal from bottom-left is the same pattern. Both exploit sorted rows + columns.