# 40 - Move Zeroes

## Problem
**LeetCode:** [#283 Move Zeroes](https://leetcode.com/problems/move-zeroes/)  
**Difficulty:** Easy  
**Topic:** Arrays, Two Pointers

### Statement
Move all `0`s to the end while maintaining the **relative order** of non-zero elements. In-place, O(1) space.

```
[0, 1, 0, 3, 12]  →  [1, 3, 12, 0, 0]
[0, 0, 1]         →  [1, 0, 0]
[1, 2, 3]         →  [1, 2, 3]  (no change)
```

---

## Intuition — Read/Write Two Pointer

Same pattern as Remove Duplicates (P35):
- `slow` = write pointer (next slot for a non-zero)
- `fast` = read pointer (scans for non-zeros)

**Swap variant:** swap non-zero at `fast` with position at `slow`. Zeros bubble to the end automatically — no fill pass needed.

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Write + Fill — 2 passes
// ─────────────────────────────────────────────────────────
function moveZeroesWriteFill(nums) {
    let slow = 0;
    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== 0) nums[slow++] = nums[fast];
    }
    for (let i = slow; i < nums.length; i++) nums[i] = 0;
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Swap — 1 pass ✅ Preferred
// Non-zero swaps to slow; zero naturally moves to fast's position
// ─────────────────────────────────────────────────────────
function moveZeroes(nums) {
    let slow = 0;

    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== 0) {
            [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
            slow++;
        }
    }
}

const t1 = [0,1,0,3,12]; moveZeroes(t1); console.log(t1); // [1,3,12,0,0] ✅
const t2 = [0,0,0,4];    moveZeroes(t2); console.log(t2); // [4,0,0,0]    ✅
const t3 = [1,2,3];      moveZeroes(t3); console.log(t3); // [1,2,3]      ✅
```

---

## Dry Run

```
nums=[0,1,0,3,12], slow=0

fast=0: 0 → skip
fast=1: 1 → swap(0,1) → [1,0,0,3,12], slow=1
fast=2: 0 → skip
fast=3: 3 → swap(1,3) → [1,3,0,0,12], slow=2
fast=4: 12→ swap(2,4) → [1,3,12,0,0], slow=3

Result: [1,3,12,0,0] ✅
```

---

## Complexity

| Approach | Time | Space | Passes |
|---|---|---|---|
| Write + Fill | O(n) | O(1) | 2 |
| **Swap** | **O(n)** | **O(1)** | **1** |

---

## The Read/Write Two Pointer Family

| Problem | Write condition | Fill after? |
|---|---|---|
| **Move Zeroes** | `nums[fast] !== 0` | Swap handles it |
| **Remove Duplicates (P35)** | `nums[fast] !== nums[slow-1]` | No — return `slow` |
| **Remove Element (LC #27)** | `nums[fast] !== val` | No — return `slow` |

Template: **slow = write head, fast = read head, write/swap only when condition met.**

---

## Key Patterns & Takeaways

1. **Swap eliminates fill pass** — zeros bubble to the back automatically. Fewer total writes for mostly-non-zero arrays.
2. **Relative order preserved** — fast scans L→R, slow writes in order. Non-zero relative sequence is always maintained.
3. **`slow === fast` when no zeros** — every swap is a no-op `(i, i)`. Degrades gracefully with zero overhead.
4. **Same family as P35** — just a different write condition. Never re-derive from scratch.