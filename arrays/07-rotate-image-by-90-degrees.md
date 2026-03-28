# 07 - Rotate Image by 90 Degrees

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/rotate-image-by-90-degree) | [LeetCode #48](https://leetcode.com/problems/rotate-image/)  
**Difficulty:** Medium  
**Topic:** Arrays, Matrix

### Statement
Given an `n × n` 2D matrix, rotate it **90 degrees clockwise in-place**. Cannot use extra space for another matrix.

```
Input:                Output:
[1, 2, 3]            [7, 4, 1]
[4, 5, 6]   ──────►  [8, 5, 2]
[7, 8, 9]            [9, 6, 3]
```

---

## Intuition

**Mathematical mapping** for 90° clockwise rotation on `n × n`:
```
(row, col)  →  (col, n-1-row)
```

**The elegant trick — Transpose + Reverse each row:**

Instead of a complex 4-element cycle, decompose into two simple steps:
1. **Transpose**: swap `matrix[i][j]` with `matrix[j][i]` → rows become columns
2. **Reverse each row**: flip each row left-to-right

**Why this works mathematically:**
- Transpose maps `(i,j) → (j,i)`
- Reverse row maps `(j,i) → (j, n-1-i)`
- Combined: `(i,j) → (j, n-1-i)` = `(col, n-1-row)` ✅

```
Original:      Transpose:     Reverse rows:
[1, 2, 3]      [1, 4, 7]      [7, 4, 1]  ✅
[4, 5, 6]  →   [2, 5, 8]  →   [8, 5, 2]  ✅
[7, 8, 9]      [3, 6, 9]      [9, 6, 3]  ✅
```

---

## Critical Subtlety — Upper Triangle Only in Transpose

`j` starts at `i+1`, NOT `0`.

If `j` starts at `0`: you swap `(0,1)↔(1,0)` correctly, then later swap `(1,0)↔(0,1)` again — **undoes the first swap!**

Starting `j` at `i+1` ensures each pair is swapped **exactly once**. The diagonal (`i==j`) is skipped naturally.

---

## Solution (JavaScript)

```javascript
/**
 * Rotate Image 90° Clockwise
 * LeetCode #48
 * Time: O(n²) | Space: O(1)
 *
 * Key insight: 90° clockwise = Transpose + Reverse each row
 */
function rotate(matrix) {
    const n = matrix.length;

    // ── STEP 1: Transpose the matrix ───────────────────────
    // Swap matrix[i][j] with matrix[j][i]
    // CRITICAL: j starts at i+1 (upper triangle only!)
    // Full matrix iteration would double-swap → undo everything
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }

    // ── STEP 2: Reverse each row ────────────────────────────
    // Completes the 90° clockwise rotation
    for (let i = 0; i < n; i++) {
        let left = 0;
        let right = n - 1;
        while (left < right) {
            [matrix[i][left], matrix[i][right]] = [matrix[i][right], matrix[i][left]];
            left++;
            right--;
        }
    }
}

const m1 = [[1,2,3],[4,5,6],[7,8,9]];
rotate(m1);
console.log(m1); // [[7,4,1],[8,5,2],[9,6,3]] ✅

const m2 = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]];
rotate(m2);
console.log(m2); // [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]] ✅


// ── BONUS: Anti-clockwise (90° Counter-Clockwise) ──────────
// Anti-clockwise = Reverse each row FIRST, then Transpose
// (just swap the order of the two steps!)
function rotateAntiClockwise(matrix) {
    const n = matrix.length;

    // Step 1: Reverse each row
    for (let i = 0; i < n; i++) {
        let left = 0, right = n - 1;
        while (left < right) {
            [matrix[i][left], matrix[i][right]] = [matrix[i][right], matrix[i][left]];
            left++;
            right--;
        }
    }

    // Step 2: Transpose
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
}

const m3 = [[1,2,3],[4,5,6],[7,8,9]];
rotateAntiClockwise(m3);
console.log(m3); // [[3,6,9],[2,5,8],[1,4,7]] ✅
```

---

## Dry Run — 3×3

```
Input: [[1,2,3],[4,5,6],[7,8,9]]

── STEP 1: Transpose (upper triangle swaps) ──
Swap (0,1)↔(1,0): 2↔4  → [[1,4,3],[2,5,6],[7,8,9]]
Swap (0,2)↔(2,0): 3↔7  → [[1,4,7],[2,5,6],[3,8,9]]
Swap (1,2)↔(2,1): 6↔8  → [[1,4,7],[2,5,8],[3,6,9]]

── STEP 2: Reverse each row ──
Row 0: [1,4,7] → [7,4,1]
Row 1: [2,5,8] → [8,5,2]
Row 2: [3,6,9] → [9,6,3]

Result: [[7,4,1],[8,5,2],[9,6,3]] ✅
```

---

## Complexity

| Approach | Time | Space | Notes |
|---|---|---|---|
| Brute (extra matrix) | O(n²) | O(n²) | Simple but violates in-place constraint |
| **Transpose + Reverse** | **O(n²)** | **O(1)** | In-place, elegant |

---

## Key Patterns & Takeaways

1. **Transpose + Reverse = 90° clockwise** — burn this into memory. Clean, two-step, fully in-place.
2. **Reverse + Transpose = 90° anti-clockwise** — just swap the order of steps. Interviewers sometimes ask for both.
3. **Upper triangle only in transpose** — `j` starts at `i+1`. Iterating full matrix double-swaps and cancels out. Very common bug.
4. **Why not 4-element cycle?** — It works but is harder to derive under pressure. Transpose + Reverse is far easier to remember.
5. **In-place matrix pattern** — connects to *Set Matrix Zeroes*. Both use the matrix as its own scratch space. A recurring senior-level theme.