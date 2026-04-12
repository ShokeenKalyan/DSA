# 13 - Search in a Sorted 2D Matrix

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/search-in-a-sorted-2d-matrix) | [LeetCode #74](https://leetcode.com/problems/search-a-2d-matrix/) & [#240](https://leetcode.com/problems/search-a-2d-matrix-ii/)  
**Difficulty:** Medium  
**Topic:** Arrays, Binary Search, Matrix

---

## ⚠️ Two Variants — Know the Difference

| Variant | Matrix Property | Optimal Approach |
|---|---|---|
| **LC #74** | Each row sorted. First element of row `i` > last element of row `i-1`. **One big sorted array.** | Binary search treating matrix as flat 1D array |
| **LC #240** | Each row sorted L→R. Each col sorted T→B. **Rows don't continue.** | Staircase search from top-right corner |

**Always ask:** *"Does the first element of each row come after the last element of the previous row?"*
- Yes → Variant 1 → full binary search O(log(m×n))
- No → Variant 2 → staircase search O(m+n)

---

## Variant 1 — LC #74: Full Binary Search

### Intuition
The entire matrix is one long sorted array in row-major order. Use standard binary search with this index conversion:
```
1D index mid  →  row = Math.floor(mid / n),  col = mid % n
```

### Solution
```javascript
// Time: O(log(m*n)) | Space: O(1)
function searchMatrixV1(matrix, target) {
    const m = matrix.length;
    const n = matrix[0].length;
    let lo = 0;
    let hi = m * n - 1;

    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);

        // Convert 1D index to 2D row/col
        const row = Math.floor(mid / n);
        const col = mid % n;
        const val = matrix[row][col];

        if (val === target)      return true;
        else if (val < target)   lo = mid + 1;
        else                     hi = mid - 1;
    }

    return false;
}

const m1 = [[1,3,5,7],[10,11,16,20],[23,30,34,60]];
console.log(searchMatrixV1(m1, 3));  // true  ✅
console.log(searchMatrixV1(m1, 13)); // false ✅
```

### Dry Run
```
matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]] target=3, n=4

lo=0,hi=11: mid=5 → [1][1]=11 > 3 → hi=4
lo=0,hi=4:  mid=2 → [0][2]=5  > 3 → hi=1
lo=0,hi=1:  mid=0 → [0][0]=1  < 3 → lo=1
lo=1,hi=1:  mid=1 → [0][1]=3 === 3 → true ✅
```

### Complexity — Variant 1
| Approach | Time | Space |
|---|---|---|
| Brute | O(m×n) | O(1) |
| Binary search per row | O(m log n) | O(1) |
| **Full binary search** | **O(log(m×n))** | **O(1)** |

---

## Variant 2 — LC #240: Staircase Search

### Intuition
Start at **top-right corner**. Unique property:
- Move **left** → smaller values (eliminate column)
- Move **down** → larger values (eliminate row)

Each step eliminates one row or column → O(m+n).

Why top-right? Top-left: both directions increase (can't eliminate). Bottom-right: both decrease (can't eliminate). **Top-right** (or bottom-left): one increases, one decreases → elimination guaranteed every step.

### Solution
```javascript
// Time: O(m+n) | Space: O(1)
function searchMatrixV2(matrix, target) {
    const m = matrix.length;
    const n = matrix[0].length;

    // Start at top-right corner
    let row = 0;
    let col = n - 1;

    while (row < m && col >= 0) {
        const val = matrix[row][col];

        if (val === target) {
            return true;
        } else if (val > target) {
            col--; // Too large → eliminate this column, move left
        } else {
            row++; // Too small → eliminate this row, move down
        }
    }

    return false;
}

const m2 = [[1,4,7,11],[2,5,8,12],[3,6,9,16],[10,13,14,17]];
console.log(searchMatrixV2(m2, 5));  // true  ✅
console.log(searchMatrixV2(m2, 20)); // false ✅
```

### Dry Run
```
matrix above, target=5. Start: row=0, col=3

[0][3]=11 > 5  → col=2
[0][2]=7  > 5  → col=1
[0][1]=4  < 5  → row=1
[1][1]=5 === 5 → true ✅   (4 steps = O(m+n))
```

### Complexity — Variant 2
| Approach | Time | Space |
|---|---|---|
| Brute | O(m×n) | O(1) |
| Binary search per row | O(m log n) | O(1) |
| **Staircase search** | **O(m+n)** | **O(1)** |

---

## ⚠️ The Classic Trap

**Applying Variant 1's full binary search to Variant 2's matrix gives WRONG answers.**

Variant 2 doesn't guarantee rows continue into each other — the flattened virtual array is NOT sorted globally. Always identify the variant first.

---

## Key Patterns & Takeaways

1. **Flatten 2D → 1D with `row=mid/n, col=mid%n`** — powerful reusable technique for any row-major 2D array. Memorize this index math.
2. **Staircase search = one elimination per step** — top-right corner gives a unique combination of one increasing and one decreasing direction. O(m+n) elegantly follows from eliminating one row or col per move.
3. **Distinguish variants before coding** — the #1 interview trap here. A clarifying question (*"do rows continue into each other?"*) is the right senior engineering move.
4. **O(log(m×n)) = O(log m + log n)** — strictly better than O(m log n) for tall matrices. State this explicitly.
5. **Staircase search follow-up** — can also count occurrences of a value in Variant 2's matrix: run two staircase searches to find lower and upper bounds.