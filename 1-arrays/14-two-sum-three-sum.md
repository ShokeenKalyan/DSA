# 18 - Two Sum (+ k-Sum Family)

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/two-sum-check-if-a-pair-with-given-sum-exists-in-array) | [LeetCode #1](https://leetcode.com/problems/two-sum/)  
**Difficulty:** Easy  
**Topic:** Arrays, Hashing, Two Pointers

### Statement
Given `nums` and `target`, return indices of two numbers that add up to `target`. Exactly one solution exists. Cannot use the same element twice.

```
[2,7,11,15], target=9  →  [0,1]   (2+7=9)
[3,2,4],     target=6  →  [1,2]   (2+4=6)
[3,3],       target=6  →  [0,1]
```

---

## The "Complement" Mental Model

```
For each nums[i], we need:  complement = target - nums[i]

If complement already seen → pair found!
If not → store nums[i] → index for future lookups
```

This eliminates the inner loop → O(n).

---

## Approaches

| Approach | Time | Space | When to Use |
|---|---|---|---|
| Brute Force | O(n²) | O(1) | Never |
| **HashMap** | **O(n)** | **O(n)** | Default — unsorted, need indices |
| Two Pointer | O(n log n) | O(1) | Sorted array or only values needed |

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 2: HashMap — O(n) time, O(n) space ✅
// One pass: check complement, then store current element
// ─────────────────────────────────────────────────────────
function twoSum(nums, target) {
    const seen = new Map(); // value → index

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        if (seen.has(complement)) {
            return [seen.get(complement), i]; // Found!
        }

        // Check BEFORE insert → handles "same element twice" naturally
        seen.set(nums[i], i);
    }

    return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1] ✅
console.log(twoSum([3, 2, 4], 6));      // [1, 2] ✅
console.log(twoSum([3, 3], 6));         // [0, 1] ✅


// ─────────────────────────────────────────────────────────
// APPROACH 3: Two Pointer — O(n log n) time, O(1) space
// Only for sorted arrays or when original indices not needed
// ─────────────────────────────────────────────────────────
function twoSumTwoPointer(nums, target) {
    const indexed = nums.map((val, idx) => [val, idx]);
    indexed.sort((a, b) => a[0] - b[0]);

    let left = 0, right = indexed.length - 1;

    while (left < right) {
        const sum = indexed[left][0] + indexed[right][0];
        if (sum === target) {
            return [indexed[left][1], indexed[right][1]].sort((a,b) => a-b);
        } else if (sum < target) left++;
        else right--;
    }

    return [];
}


// ─────────────────────────────────────────────────────────
// Boolean variant: does pair exist?
// ─────────────────────────────────────────────────────────
function hasTwoSum(nums, target) {
    const sorted = [...nums].sort((a, b) => a - b);
    let left = 0, right = sorted.length - 1;

    while (left < right) {
        const sum = sorted[left] + sorted[right];
        if (sum === target) return true;
        else if (sum < target) left++;
        else right--;
    }
    return false;
}
```

---

## Dry Run — HashMap

```
nums=[2,7,11,15], target=9

i=0: complement=7,  seen has 7? NO  → seen={2:0}
i=1: complement=2,  seen has 2? YES → return [0, 1] ✅

nums=[3,2,4], target=6

i=0: complement=3,  seen has 3? NO  → seen={3:0}
i=1: complement=4,  seen has 4? NO  → seen={3:0,2:1}
i=2: complement=2,  seen has 2? YES → return [1, 2] ✅
```

---

## BONUS — 3Sum (LC #15) — Most Common Follow-up

Find all unique triplets summing to zero.  
Strategy: **Sort + fix one element + Two Sum (Two Pointer) on the rest**

```javascript
// Time: O(n²) | Space: O(1) excluding output
function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const result = [];

    for (let i = 0; i < nums.length - 2; i++) {
        // Skip duplicates for fixed element
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        let left = i + 1, right = nums.length - 1;

        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];

            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                // Skip duplicates for both pointers
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }

    return result;
}

console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1,-1,2],[-1,0,1]] ✅
console.log(threeSum([0, 0, 0]));              // [[0,0,0]] ✅
```

---

## The k-Sum Family

| Problem | Approach | LeetCode |
|---|---|---|
| **Two Sum** | HashMap O(n) or Two Pointer | #1 |
| **Two Sum II** (sorted) | Two Pointer O(n) | #167 |
| **3Sum** | Sort + Two Pointer per element | #15 |
| **3Sum Closest** | Sort + Two Pointer, track min diff | #16 |
| **4Sum** | Sort + Two Pointer per pair | #18 |
| **Subarray Sum = K** | Prefix sum + HashMap | #560 |

---

## Edge Cases

| Case | Note |
|---|---|
| Same element twice `[3,3], target=6` | Check BEFORE insert → first index stored, second finds it |
| Negative numbers | HashMap handles naturally |
| Complement is 0 | `target=0` with `nums=[0,4,0]` → check before insert handles it |

---

## Key Patterns & Takeaways

1. **"Complement lookup"** — `complement = target - nums[i]`. Check if seen, then store current. Eliminates inner loop → O(n). Recurs in Subarray Sum=K, 4Sum, and many more.
2. **HashMap stores value → index** — not a Set. We need indices for the answer. Use Set only when existence check suffices.
3. **Check BEFORE insert** — `seen.has(complement)` before `seen.set(nums[i], i)`. Handles "can't use same element twice" naturally and elegantly.
4. **Two Pointer only for sorted** — if unsorted and need original indices, HashMap is cleaner. If sorted or only values needed, Two Pointer is O(1) space.
5. **3Sum duplicate skipping** — skip duplicates at BOTH the outer loop AND the inner pointers. Getting this right under pressure is the hard part of 3Sum.