# 41 - Sort Array by Parity

## Problem
**LeetCode:** [#905 Sort Array by Parity](https://leetcode.com/problems/sort-array-by-parity/)  
**Difficulty:** Easy  
**Topic:** Arrays, Two Pointers

### Statement
Move all even integers to the beginning, odds to the end. Any valid order within each group is acceptable.

```
[3, 1, 2, 4]  →  [2, 4, 3, 1]  (or [4, 2, 1, 3] etc.)
[1, 2, 3, 4]  →  [4, 2, 1, 3]
```

---

## Key Insight — Order Not Required → Two Ends Pointer

Since relative order doesn't need to be preserved, we can use **two pointers from both ends** (QuickSort partition style) instead of the stable read/write approach.

- `left` seeks odds from the left (wrong side)
- `right` seeks evens from the right (wrong side)  
- When both found → swap → both move inward

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Read/Write — O(n), stable (order preserved)
// Use when relative order must be maintained
// ─────────────────────────────────────────────────────────
function sortArrayByParityStable(nums) {
    let slow = 0;
    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] % 2 === 0) {
            [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
            slow++;
        }
    }
    return nums;
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Two Pointer from Both Ends — O(n), O(1) ✅
// Use when order doesn't matter — mirrors QuickSort partition
// ─────────────────────────────────────────────────────────
function sortArrayByParity(nums) {
    let left = 0, right = nums.length - 1;

    while (left < right) {
        while (left < right && nums[left] % 2 === 0) left++;   // skip evens on left
        while (left < right && nums[right] % 2 !== 0) right--; // skip odds on right

        if (left < right) {
            [nums[left], nums[right]] = [nums[right], nums[left]];
            left++;
            right--;
        }
    }

    return nums;
}

console.log(sortArrayByParity([3,1,2,4])); // [4,2,1,3] ✅
console.log(sortArrayByParity([1,3,5]));   // [1,3,5]   ✅ (all odd, no swaps)
console.log(sortArrayByParity([2,4,6]));   // [2,4,6]   ✅ (all even, no swaps)
```

---

## Dry Run

```
nums=[3,1,2,4], left=0, right=3

left=0: nums[0]=3 odd → stop
right=3: nums[3]=4 even → stop
Swap(0,3) → [4,1,2,3], left=1, right=2

left=1: nums[1]=1 odd → stop
right=2: nums[2]=2 even → stop
Swap(1,2) → [4,2,1,3], left=2, right=1

left >= right → STOP ✅
```

---

## Complexity

| Approach | Time | Space | Order? |
|---|---|---|---|
| Read/Write | O(n) | O(1) | ✅ Stable |
| **Two Pointer (ends)** | **O(n)** | **O(1)** | ❌ Unstable |

---

## Key Patterns & Takeaways

1. **"Any order" → two ends pointer** — whenever a partition problem doesn't require stable order, two-ends is cleaner and mirrors QuickSort's Hoare partition.
2. **"Preserve order" → read/write pointer** — use the Move Zeroes (P40) approach instead.
3. **Bitwise parity check** — `(num & 1) === 0` for even is faster than `num % 2 === 0`. Negligible in JS but shows bit awareness.
4. **This IS QuickSort's partition** — the two-ends approach with a pivot condition is Hoare's partition. Naming this connection impresses.
5. **The decision rule** — always ask: "does the problem require maintaining relative order?" Yes → read/write. No → two ends.