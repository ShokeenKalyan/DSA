# 16 - Grid Unique Paths

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/grid-unique-paths-dp-on-grids-dp8) | [LeetCode #62](https://leetcode.com/problems/unique-paths/) & [#63](https://leetcode.com/problems/unique-paths-ii/)  
**Difficulty:** Medium  
**Topic:** Arrays, Dynamic Programming, Grid DP

### Statement
A robot at the top-left of an `m × n` grid can only move **right** or **down**. Count the number of unique paths to the bottom-right corner.

```
m=3, n=7  →  28
m=3, n=2  →  3
m=1, n=1  →  1
```

---

## The Full DP Thought Process (4 Levels)

| Level | Approach | Time | Space |
|---|---|---|---|
| 1 | Pure Recursion | O(2^(m+n)) | O(m+n) stack |
| 2 | Memoization (top-down) | O(m×n) | O(m×n) |
| 3 | Tabulation (bottom-up) | O(m×n) | O(m×n) |
| **4** | **Space Optimised** | **O(m×n)** | **O(n)** |
| ★ | Math (nCr) | O(min(m,n)) | O(1) |

---

## Recurrence Relation

```
paths(row, col) = paths(row-1, col) + paths(row, col-1)

Base cases:
  row=0 (first row): dp[0][col] = 1  (only one way: move right)
  col=0 (first col): dp[row][0] = 1  (only one way: move down)
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// LEVEL 2: Memoization — O(m*n) time, O(m*n) space
// ─────────────────────────────────────────────────────────
function uniquePathsMemo(m, n) {
    const memo = Array.from({ length: m }, () => new Array(n).fill(-1));

    function solve(row, col) {
        if (row === 0 && col === 0) return 1;
        if (row < 0 || col < 0) return 0;
        if (memo[row][col] !== -1) return memo[row][col];
        memo[row][col] = solve(row - 1, col) + solve(row, col - 1);
        return memo[row][col];
    }

    return solve(m - 1, n - 1);
}


// ─────────────────────────────────────────────────────────
// LEVEL 3: Tabulation — O(m*n) time, O(m*n) space
// ─────────────────────────────────────────────────────────
function uniquePathsTabulation(m, n) {
    const dp = Array.from({ length: m }, () => new Array(n).fill(0));

    for (let col = 0; col < n; col++) dp[0][col] = 1; // first row
    for (let row = 0; row < m; row++) dp[row][0] = 1; // first col

    for (let row = 1; row < m; row++)
        for (let col = 1; col < n; col++)
            dp[row][col] = dp[row - 1][col] + dp[row][col - 1];

    return dp[m - 1][n - 1];
}


// ─────────────────────────────────────────────────────────
// LEVEL 4: Space Optimised — O(m*n) time, O(n) space ✅
// Each row only needs the PREVIOUS row → use rolling 1D array
// ─────────────────────────────────────────────────────────
function uniquePaths(m, n) {
    let prev = new Array(n).fill(1); // First row: all 1s

    for (let row = 1; row < m; row++) {
        const curr = new Array(n).fill(0);
        curr[0] = 1; // First col always 1

        for (let col = 1; col < n; col++) {
            curr[col] = prev[col] + curr[col - 1]; // above + left
        }

        prev = curr; // Roll to next row
    }

    return prev[n - 1];
}


// ─────────────────────────────────────────────────────────
// MATH FORMULA: C(m+n-2, m-1) — O(min(m,n)) time, O(1) space
// Total moves = (m-1) downs + (n-1) rights
// Choose which (m-1) are "down" → nCr
// ─────────────────────────────────────────────────────────
function uniquePathsMath(m, n) {
    let N = m + n - 2;
    let r = Math.min(m - 1, n - 1);
    let result = 1;
    for (let i = 0; i < r; i++) result = result * (N - i) / (i + 1);
    return Math.round(result);
}

console.log(uniquePaths(3, 7)); // 28 ✅
console.log(uniquePaths(3, 2)); // 3  ✅
console.log(uniquePaths(1, 1)); // 1  ✅
console.log(uniquePaths(3, 3)); // 6  ✅
```

---

## Dry Run — Tabulation (m=3, n=3)

```
Init: first row & col = 1
dp = [[1,1,1],
      [1,0,0],
      [1,0,0]]

row=1: dp[1][1]=dp[0][1]+dp[1][0]=1+1=2, dp[1][2]=dp[0][2]+dp[1][1]=1+2=3
dp = [[1,1,1],[1,2,3],[1,0,0]]

row=2: dp[2][1]=dp[1][1]+dp[2][0]=2+1=3, dp[2][2]=dp[1][2]+dp[2][1]=3+3=6
dp = [[1,1,1],[1,2,3],[1,3,6]]

Answer: dp[2][2] = 6 ✅
```

---

## BONUS — Unique Paths II: With Obstacles (LC #63)

Obstacle at cell = 1. That cell contributes 0 paths.

```javascript
// Time: O(m*n) | Space: O(n)
function uniquePathsWithObstacles(obstacleGrid) {
    const m = obstacleGrid.length;
    const n = obstacleGrid[0].length;

    if (obstacleGrid[0][0] === 1 || obstacleGrid[m-1][n-1] === 1) return 0;

    // First row: 1 until first obstacle, then 0 for all further cells
    let prev = new Array(n).fill(0);
    for (let col = 0; col < n; col++) {
        if (obstacleGrid[0][col] === 1) break;
        prev[col] = 1;
    }

    for (let row = 1; row < m; row++) {
        const curr = new Array(n).fill(0);
        curr[0] = obstacleGrid[row][0] === 1 ? 0 : prev[0];

        for (let col = 1; col < n; col++) {
            curr[col] = obstacleGrid[row][col] === 1
                ? 0
                : prev[col] + curr[col - 1];
        }

        prev = curr;
    }

    return prev[n - 1];
}

console.log(uniquePathsWithObstacles([[0,0,0],[0,1,0],[0,0,0]])); // 2 ✅
console.log(uniquePathsWithObstacles([[0,1],[0,0]]));             // 1 ✅
```

---

## Key Patterns & Takeaways

1. **The 4-level DP template** — Recursion → Memoization → Tabulation → Space Optimisation. This progression applies to virtually every DP problem. Unique Paths is the cleanest example to practice explaining it.
2. **Rolling array (1D space optimisation)** — when each row only depends on the previous, replace the 2D table with two 1D arrays. Must-know for 2D grid DP problems.
3. **Math formula** — `C(m+n-2, m-1)`. Total moves = `(m-1)+(n-1)`, choose which are "down". Demonstrates mathematical depth.
4. **Obstacle variant** — identical DP structure; blocked cells contribute 0 paths. First row/col init needs a `break` at first obstacle.
5. **DP direction** — always flows in the direction of movement (top-left → bottom-right). Recurrence follows naturally.