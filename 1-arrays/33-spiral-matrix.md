# 47 - Spiral Matrix

## Problem
**LeetCode:** [#54 Spiral Matrix](https://leetcode.com/problems/spiral-matrix/)  
**Difficulty:** Medium  
**Topic:** Arrays, Matrix, Simulation

### Statement
Return all elements of an `m×n` matrix in clockwise spiral order.

```
[[1,2,3],      →  [1,2,3,6,9,8,7,4,5]
 [4,5,6],
 [7,8,9]]

[[1,2,3,4],    →  [1,2,3,4,8,12,11,10,9,5,6,7]
 [5,6,7,8],
 [9,10,11,12]]
```

---

## Intuition — Four Shrinking Boundaries

Maintain `top`, `bottom`, `left`, `right`. Traverse outer ring in 4 directions, then shrink each boundary inward.

```
L→R across top row    → top++
T→B down right col    → right--
R→L across bottom row → bottom--  [GUARD: top ≤ bottom]
B→T up left col       → left++    [GUARD: left ≤ right]

Repeat while top ≤ bottom AND left ≤ right
```

**The guards prevent duplicates** for single-row/column remainders. Without `if (top <= bottom)`, a matrix like `[[1,2,3]]` would have its top row duplicated when the bottom row traversal fires.

---

## Solution (JavaScript)

```javascript
/**
 * Spiral Matrix — LeetCode #54
 * Time: O(m*n) | Space: O(1) excluding output
 */
function spiralOrder(matrix) {
    const result = [];
    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;

    while (top <= bottom && left <= right) {
        // Direction 1: Left → Right
        for (let col = left; col <= right; col++)
            result.push(matrix[top][col]);
        top++;

        // Direction 2: Top → Bottom
        for (let row = top; row <= bottom; row++)
            result.push(matrix[row][right]);
        right--;

        // Direction 3: Right → Left (guard: rows remain)
        if (top <= bottom) {
            for (let col = right; col >= left; col--)
                result.push(matrix[bottom][col]);
            bottom--;
        }

        // Direction 4: Bottom → Top (guard: cols remain)
        if (left <= right) {
            for (let row = bottom; row >= top; row--)
                result.push(matrix[row][left]);
            left++;
        }
    }

    return result;
}

console.log(spiralOrder([[1,2,3],[4,5,6],[7,8,9]]));
// [1,2,3,6,9,8,7,4,5] ✅

console.log(spiralOrder([[1,2,3,4],[5,6,7,8],[9,10,11,12]]));
// [1,2,3,4,8,12,11,10,9,5,6,7] ✅

console.log(spiralOrder([[1]]));    // [1]   ✅
console.log(spiralOrder([[1,2,3]])); // [1,2,3] ✅ (single row)
console.log(spiralOrder([[1],[2],[3]])); // [1,2,3] ✅ (single col)
```

---

## Dry Run

```
[[1,2,3],[4,5,6],[7,8,9]], top=0,bot=2,left=0,right=2

L→R row0: 1,2,3  → top=1
T→B col2: 6,9    → right=1
R→L row2: 8,7    → bottom=1  (1≤1 guard passes)
B→T col0: 4      → left=1    (1≤1 guard passes)

Round 2: top=1,bot=1,left=1,right=1
L→R row1: 5      → top=2
T→B: top>bottom  → nothing
Guards fail → both skip

Result: [1,2,3,6,9,8,7,4,5] ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(m×n) — each element visited once |
| Space | O(1) — excluding output |

---

## Bonus: Spiral Matrix II — Generate (LC #59)

Same skeleton, write instead of read:

```javascript
function generateMatrix(n) {
    const matrix = Array.from({ length: n }, () => new Array(n).fill(0));
    let top=0, bottom=n-1, left=0, right=n-1, num=1;

    while (top <= bottom && left <= right) {
        for (let col=left; col<=right; col++)     matrix[top][col]=num++;
        top++;
        for (let row=top; row<=bottom; row++)     matrix[row][right]=num++;
        right--;
        if (top<=bottom) {
            for (let col=right; col>=left; col--) matrix[bottom][col]=num++;
            bottom--;
        }
        if (left<=right) {
            for (let row=bottom; row>=top; row--) matrix[row][left]=num++;
            left++;
        }
    }
    return matrix;
}

console.log(generateMatrix(3)); // [[1,2,3],[8,9,4],[7,6,5]] ✅
```

---

## Key Patterns & Takeaways

1. **Four-boundary shrinking** — `top`, `bottom`, `left`, `right` define the unvisited ring. Shrink after each direction. Handles any m×n matrix uniformly.
2. **Two guards after shrinking** — `if (top <= bottom)` before bottom row; `if (left <= right)` before left column. Prevents duplicates for single-row/col remainders.
3. **Direction order** — always L→R, T→B, R→L, B→T. Guards attach to directions 3 and 4.
4. **Spiral Matrix II is identical** — same boundary logic, just write `num++` instead of pushing `matrix[r][c]`.
5. **"Layers" mental model** — process ring by ring from outside in. Connects to Rotate Image (P07) which also works layer by layer.