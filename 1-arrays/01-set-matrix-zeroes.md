# 01 - Set Matrix Zeroes

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/dsa/strivers-sde-sheet-top-coding-interview-problems) | [LeetCode #73](https://leetcode.com/problems/set-matrix-zeroes/)  
**Difficulty:** Medium  
**Topic:** Arrays

### Statement
Given an `m x n` matrix, if any cell contains `0`, set its **entire row and entire column** to `0`. Do it **in-place**.

### Example
```
Input:                     Output:
[1, 1, 1]                  [1, 0, 1]
[1, 0, 1]    ──────►       [0, 0, 0]
[1, 1, 1]                  [1, 0, 1]
```

---

## Intuition
The core trap: if you start zeroing rows/columns immediately as you find a zero, you create **new zeros** that weren't originally there — these cascade and corrupt your result.

**Key insight:** First record WHERE the original zeros are, then apply the changes.  
The question then becomes: how efficiently can you store that information?

---

## Approaches

### 🟡 Approach 2 — Better | O(m×n) time, O(m+n) space
Use two separate arrays — one to track which **rows** have a zero, one for **columns**.  
Two passes: first scan to mark, second pass to apply.

### 🟢 Approach 3 — Optimal | O(m×n) time, O(1) space
Instead of extra arrays, **use the first row and first column of the matrix itself** as marker arrays.

**The (0,0) conflict:** `matrix[0][0]` can't represent both "first row has zero" AND "first col has zero" simultaneously.  
**Resolution:** Use `matrix[0][0]` for the first row, and a separate boolean `firstColHasZero` for the first column.

**Order of operations is critical:**  
Process the first row and first column **last** — otherwise you corrupt your own markers mid-way.

---

## Solution (JavaScript)

### Approach 2 — Better (O(m+n) space)

```javascript
function setZeroesBetter(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;

    // Track which rows and columns contain a zero
    const zeroRows = new Array(m).fill(false);
    const zeroCols = new Array(n).fill(false);

    // Pass 1: Record positions of all original zeros
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === 0) {
                zeroRows[i] = true;
                zeroCols[j] = true;
            }
        }
    }

    // Pass 2: Use the markers to set cells to zero
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (zeroRows[i] || zeroCols[j]) {
                matrix[i][j] = 0;
            }
        }
    }
}
```

---

### Approach 3 — Optimal (O(1) space) ✅ Preferred

```javascript
function setZeroesOptimal(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;

    // We need a separate variable for the first column
    // because matrix[0][0] will be used for the first row
    let firstColHasZero = false;

    // Pass 1: Scan the matrix and mark the first row/col
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === 0) {
                // Mark the first row for this column
                matrix[0][j] = 0;

                if (j === 0) {
                    // Special case: can't use matrix[i][0] to also
                    // represent col 0 — use our separate flag instead
                    firstColHasZero = true;
                } else {
                    // Mark the first col for this row
                    matrix[i][0] = 0;
                }
            }
        }
    }

    // Pass 2: Use the markers in row 0 and col 0 to zero out
    // the inner matrix (rows 1..m-1, cols 1..n-1)
    // We SKIP row 0 and col 0 themselves for now — we'll handle
    // them last, otherwise we'd corrupt our own markers!
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][0] === 0 || matrix[0][j] === 0) {
                matrix[i][j] = 0;
            }
        }
    }

    // Pass 3: Handle the first ROW
    // If matrix[0][0] was marked (meaning some column had a zero
    // in row 0), zero out the entire first row
    if (matrix[0][0] === 0) {
        for (let j = 0; j < n; j++) {
            matrix[0][j] = 0;
        }
    }

    // Pass 4: Handle the first COLUMN using our separate flag
    if (firstColHasZero) {
        for (let i = 0; i < m; i++) {
            matrix[i][0] = 0;
        }
    }
}
```

---

## Complexity Summary

| Approach | Time | Space | Notes |
|---|---|---|---|
| Brute | O(m×n×(m+n)) | O(1) | Too slow, not recommended |
| Better | O(m×n) | O(m+n) | Clean, interview-acceptable |
| **Optimal** | **O(m×n)** | **O(1)** | What interviewers want at senior level |

---

## Key Patterns & Takeaways

1. **"In-place with a marker" pattern** — using existing structure (first row/col) as metadata storage. Reappears in *Rotate Matrix*, *Spiral Order*.
2. **Order of operations matters** — always process the "marker rows/cols" **last**, otherwise you corrupt your own markers mid-way.
3. **The (0,0) conflict** — the most important edge case. Recognizing and handling this cleanly is what separates a good solution from a great one in interviews.
4. **Two-pass pattern** — scan first, mutate second. A recurring theme in in-place array problems.