# 02 - Pascal's Triangle

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/program-to-generate-pascals-triangle) | [LeetCode #118](https://leetcode.com/problems/pascals-triangle/) / [#119](https://leetcode.com/problems/pascals-triangle-ii/)  
**Difficulty:** Easy–Medium  
**Topic:** Arrays, Math

### Statement
Pascal's Triangle is a triangular array where:
- The **first and last element** of every row is `1`
- Every **middle element** is the sum of the two elements directly above it

```
Row 1:     [1]
Row 2:    [1, 1]
Row 3:   [1, 2, 1]
Row 4:  [1, 3, 3, 1]
Row 5: [1, 4, 6, 4, 1]
```

---

## The 3 Variants

| Variant | What's asked |
|---|---|
| **Variant 1** | Given row `r` and column `c`, find the element at that position |
| **Variant 2** | Given `n`, print the entire `n`th row |
| **Variant 3** | Given `n`, generate the full Pascal's Triangle up to `n` rows |

---

## Intuition

The element at row `r`, column `c` (1-indexed) is the **binomial coefficient**:

```
C(r-1, c-1) = (r-1)! / ((c-1)! × (r-c)!)
```

Computing factorials is expensive. Smarter: compute `C(n, r)` **iteratively** in O(r):

```
result = 1
for i from 0 to r-1:
    result = result * (n - i) / (i + 1)
```

Multiply and divide simultaneously at each step to stay in integer range.

For Variant 2 (full row), each element derives from the previous:
```
element[c] = element[c-1] * (n - c) / c
```
This avoids recomputing nCr from scratch for each column → O(n) for the full row.

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// HELPER: Compute C(n, r) — the binomial coefficient
// This gives us the element at any position in O(r) time
// ─────────────────────────────────────────────────────────
function nCr(n, r) {
    let result = 1;
    for (let i = 0; i < r; i++) {
        // Multiply numerator term, divide denominator term
        // We divide at each step to avoid integer overflow
        result = result * (n - i) / (i + 1);
    }
    return result;
}


// ─────────────────────────────────────────────────────────
// VARIANT 1: Find element at row r, column c (1-indexed)
// Time: O(c), Space: O(1)
// ─────────────────────────────────────────────────────────
function pascalElement(r, c) {
    // Element at (r, c) is simply C(r-1, c-1)
    return nCr(r - 1, c - 1);
}

// Example: row=5, col=3 → C(4,2) = 6 ✅


// ─────────────────────────────────────────────────────────
// VARIANT 2: Print the entire Nth row
//
// BRUTE: Call nCr(n-1, c) for each column c → O(n²)
//
// OPTIMAL INSIGHT: Each element in a row can be derived
// from the previous element using a simple formula:
//   element[c] = element[c-1] * (n - c) / c
// So we only need one pass → O(n) time, O(1) extra space
// ─────────────────────────────────────────────────────────
function printNthRow(n) {
    const row = [];
    let element = 1;

    // First element is always 1
    row.push(element);

    for (let c = 1; c < n; c++) {
        // Derive each next element from the previous one
        // Formula: next = prev * (rowIndex - colIndex) / colIndex
        // where rowIndex = n-1 (0-indexed)
        element = element * (n - c) / c;
        row.push(element);
    }

    return row;
}

// Example: n=5 → [1, 4, 6, 4, 1] ✅


// ─────────────────────────────────────────────────────────
// VARIANT 3: Generate the full Pascal's Triangle (n rows)
// LeetCode #118
//
// APPROACH 1 — Using nCr for each element: O(n³), not ideal
//
// APPROACH 2 — Optimal: Build each row from the previous row
// Each middle element = left parent + right parent
// Time: O(n²), Space: O(n²) to store the result
// ─────────────────────────────────────────────────────────
function generatePascalsTriangle(n) {
    const triangle = [];

    for (let row = 0; row < n; row++) {
        // Each row has (row+1) elements, initialized to 1
        // First and last are always 1, so this default works
        const currentRow = new Array(row + 1).fill(1);

        // Fill in the middle elements (indices 1 to row-1)
        // Each element is the sum of the two elements above it:
        // triangle[row-1][col-1] + triangle[row-1][col]
        for (let col = 1; col < row; col++) {
            currentRow[col] = triangle[row - 1][col - 1] + triangle[row - 1][col];
        }

        triangle.push(currentRow);
    }

    return triangle;
}

// Example: n=5 →
// [
//   [1],
//   [1, 1],
//   [1, 2, 1],
//   [1, 3, 3, 1],
//   [1, 4, 6, 4, 1]
// ] ✅
```

---

## Dry Run — Variant 3 (n=4)

```
row=0: currentRow = [1]                          → triangle = [[1]]
row=1: currentRow = [1,1], no middle elements    → triangle = [[1],[1,1]]
row=2: currentRow = [1,_,1], col=1:
         currentRow[1] = triangle[1][0] + triangle[1][1] = 1+1 = 2
       → [1,2,1]
row=3: currentRow = [1,_,_,1], col=1,2:
         currentRow[1] = triangle[2][0] + triangle[2][1] = 1+2 = 3
         currentRow[2] = triangle[2][1] + triangle[2][2] = 2+1 = 3
       → [1,3,3,1]

Final: [[1],[1,1],[1,2,1],[1,3,3,1]] ✅
```

---

## Complexity Summary

| Variant | Approach | Time | Space |
|---|---|---|---|
| V1: Single element | nCr formula | O(c) | O(1) |
| V2: Nth row | Iterative formula | O(n) | O(1) |
| V3: Full triangle | Build from prev row | O(n²) | O(n²) |

---

## Key Patterns & Takeaways

1. **Binomial coefficient `C(n,r)`** — the mathematical spine of this entire problem. Memorize the iterative form.
2. **Derive next from previous** — the O(n) row generation trick (`elem = elem * (n-c) / c`) is a beautiful optimization interviewers love to probe.
3. **Initialize to 1, fill middle** — the cleanest way to build rows in Variant 3. Avoids edge case handling for first/last elements.
4. **Know all 3 variants** — interviewers often start with Variant 3 then ask "can you find just the Nth row efficiently?" That's when Variant 2's O(n) trick shines.