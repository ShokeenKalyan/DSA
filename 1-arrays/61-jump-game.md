# 75 - Jump Game

## Problem
**LeetCode:** [#55 Jump Game](https://leetcode.com/problems/jump-game/)  
**Difficulty:** Medium  
**Topic:** Arrays, Greedy

### Statement
`nums[i]` = max jump from index `i`. Can you reach the last index from 0?

```
[2,3,1,1,4]  →  true
[3,2,1,0,4]  →  false  (stuck at index 3: nums[3]=0)
[0]           →  true   (already at end)
```

---

## Intuition — Track Maximum Reachable Index

Maintain `maxReach` = furthest index reachable from any visited position.

- `i > maxReach` → can't stand here → `false`
- Otherwise → `maxReach = max(maxReach, i + nums[i])`
- `maxReach >= n-1` → reached the end → `true`

```
Think of maxReach as a "frontier". If the frontier falls behind
your current position, you're stuck with no way forward.
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Forward Greedy — O(n), O(1) ✅
// ─────────────────────────────────────────────────────────
function canJump(nums) {
    let maxReach = 0;

    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;           // Stuck — can't reach i
        maxReach = Math.max(maxReach, i + nums[i]); // Extend frontier
        if (maxReach >= nums.length - 1) return true; // Reached end
    }

    return true;
}

// ─────────────────────────────────────────────────────────
// APPROACH 2: Backward Greedy — O(n), O(1)
// Track leftmost "good" position (can reach end from there)
// ─────────────────────────────────────────────────────────
function canJumpBackward(nums) {
    let leftmostGood = nums.length - 1;

    for (let i = nums.length - 2; i >= 0; i--) {
        if (i + nums[i] >= leftmostGood) leftmostGood = i;
    }

    return leftmostGood === 0;
}

console.log(canJump([2,3,1,1,4])); // true  ✅
console.log(canJump([3,2,1,0,4])); // false ✅
console.log(canJump([0]));          // true  ✅
console.log(canJump([2,0,0]));      // true  ✅


// ─────────────────────────────────────────────────────────
// BONUS: Jump Game II (LC #45) — Minimum jumps
// BFS levels: currentEnd = level boundary, farthest = next level end
// ─────────────────────────────────────────────────────────
function jump(nums) {
    let jumps = 0, currentEnd = 0, farthest = 0;

    for (let i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        if (i === currentEnd) {  // Exhausted current level → must jump
            jumps++;
            currentEnd = farthest;
        }
    }

    return jumps;
}

console.log(jump([2,3,1,1,4])); // 2 ✅
console.log(jump([2,3,0,1,4])); // 2 ✅
```

---

## Dry Run

```
[2,3,1,1,4]:
i=0: maxReach=2
i=1: maxReach=max(2,4)=4 ≥ 4 → return true ✅

[3,2,1,0,4]:
i=0: maxReach=3
i=1: maxReach=max(3,3)=3
i=2: maxReach=max(3,3)=3
i=3: maxReach=max(3,3)=3
i=4: 4>maxReach(3) → return false ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| **Forward Greedy** | **O(n)** | **O(1)** |
| Backward Greedy | O(n) | O(1) |
| Jump Game II | O(n) | O(1) |

---

## Key Patterns & Takeaways

1. **`maxReach` as frontier** — furthest reachable from any visited position. If frontier falls behind `i`, stuck. Core greedy insight.
2. **`i > maxReach` = stuck** — immediate false. Current index unreachable from any previous position.
3. **Early exit `maxReach >= n-1`** — once frontier passes end, done. Skip remaining scan.
4. **Jump Game II = BFS levels** — `currentEnd` = current level boundary. When `i === currentEnd`, must jump and advance to `farthest`. Minimum jumps = number of level transitions.
5. **Backward greedy equivalent** — tracks leftmost "good" position right-to-left. Same result, different perspective. Forward greedy is more natural.