# 04 - Kadane's Algorithm — Maximum Subarray Sum

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/kadanes-algorithm-maximum-subarray-sum-in-an-array) | [LeetCode #53](https://leetcode.com/problems/maximum-subarray/)  
**Difficulty:** Medium  
**Topic:** Arrays, Dynamic Programming

### Statement
Given an integer array `nums`, find the **contiguous subarray** (containing at least one number) which has the **largest sum**, and return its sum.

```
Input:  [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6
Explanation: Subarray [4, -1, 2, 1] has the largest sum = 6
```

---

## Intuition

At each position `i`, ask: **"Is it better to extend the existing subarray to include `nums[i]`, or start fresh at `nums[i]`?"**

- If running sum is **positive** → keep it, it's helping
- If running sum is **negative** → drop it, start fresh

A negative prefix can only *drag down* whatever comes after it. Reset to 0 the moment the running sum goes negative. One pass. O(n).

**Kadane's is implicit DP:**  
`currentSum` at index `i` = `dp[i]` = max subarray sum ending at `i`.  
Recurrence: `dp[i] = max(nums[i], dp[i-1] + nums[i])`  
Kadane's optimizes this to O(1) space by only tracking the previous value.

---

## Approaches

| Approach | Time | Space |
|---|---|---|
| Brute (3 loops) | O(n³) | O(1) |
| Better (2 loops) | O(n²) | O(1) |
| **Kadane's** | **O(n)** | **O(1)** |

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 2: Better — O(n²) time, O(1) space
// ─────────────────────────────────────────────────────────
function maxSubarrayBrute(nums) {
    let maxSum = -Infinity;

    for (let i = 0; i < nums.length; i++) {
        let currentSum = 0;
        for (let j = i; j < nums.length; j++) {
            currentSum += nums[j];
            maxSum = Math.max(maxSum, currentSum);
        }
    }

    return maxSum;
}


// ─────────────────────────────────────────────────────────
// APPROACH 3: Kadane's Algorithm — O(n) time, O(1) space
// ─────────────────────────────────────────────────────────
function maxSubarray(nums) {
    // maxSum tracks the global best seen so far
    // Start at -Infinity to correctly handle all-negative arrays
    let maxSum = -Infinity;

    // currentSum is the running sum of the current subarray
    let currentSum = 0;

    for (let i = 0; i < nums.length; i++) {
        // Extend current subarray to include nums[i]
        currentSum += nums[i];

        // Update global max if current subarray is better
        maxSum = Math.max(maxSum, currentSum);

        // Key decision: if currentSum has gone negative,
        // it will only hurt future subarrays → reset to 0
        // (i.e., start a fresh subarray from the next element)
        if (currentSum < 0) {
            currentSum = 0;
        }
    }

    return maxSum;
}

// Test cases
console.log(maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubarray([-1]));                               // -1 (all negative)
console.log(maxSubarray([5, 4, -1, 7, 8]));                  // 23


// ─────────────────────────────────────────────────────────
// FOLLOW-UP VARIANT: Return the actual subarray, not just the sum
// Very commonly asked as a follow-up at senior interviews
// ─────────────────────────────────────────────────────────
function maxSubarrayWithIndices(nums) {
    let maxSum = -Infinity;
    let currentSum = 0;

    // Track indices of the best subarray found
    let start = 0, end = 0;

    // Track the tentative start of the current subarray being built
    let tempStart = 0;

    for (let i = 0; i < nums.length; i++) {
        currentSum += nums[i];

        // Found a new best — record the subarray boundaries
        if (currentSum > maxSum) {
            maxSum = currentSum;
            start = tempStart; // current subarray started at tempStart
            end = i;
        }

        // Current sum negative — reset and mark next index
        // as potential start of a new subarray
        if (currentSum < 0) {
            currentSum = 0;
            tempStart = i + 1;
        }
    }

    return {
        maxSum,
        subarray: nums.slice(start, end + 1)
    };
}

// Test
console.log(maxSubarrayWithIndices([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
// { maxSum: 6, subarray: [4, -1, 2, 1] }
```

---

## Dry Run

```
Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]

i=0: curr = -2  | max = -2  | curr < 0 → reset to 0
i=1: curr =  1  | max =  1
i=2: curr = -2  | max =  1  | curr < 0 → reset to 0
i=3: curr =  4  | max =  4
i=4: curr =  3  | max =  4
i=5: curr =  5  | max =  5
i=6: curr =  6  | max =  6  ✅
i=7: curr =  1  | max =  6
i=8: curr =  5  | max =  6

Answer: 6  (subarray [4, -1, 2, 1] at indices 3–6)
```

---

## Edge Cases

| Case | Input | Output | Trap |
|---|---|---|---|
| All negative | `[-3, -1, -2]` | `-1` | Must init `maxSum = -Infinity`, NOT `0` |
| Single element | `[5]` | `5` | Works fine |
| All positive | `[1, 2, 3]` | `6` | Never resets, entire array is answer |
| One negative in middle | `[5, -1, 6]` | `10` | `-1` doesn't cause reset since sum stays positive |

> ⚠️ **The #1 mistake**: Initializing `maxSum = 0`. Breaks for all-negative arrays — incorrectly returns `0` instead of the least-negative element.

---

## Key Patterns & Takeaways

1. **"Reset when negative" pattern** — the heart of Kadane's. A negative running sum is a liability; cut it and start fresh. Recurs in many DP problems.
2. **Kadane's is implicit DP** — `dp[i] = max(nums[i], dp[i-1] + nums[i])`. Kadane's just collapses it to O(1) space.
3. **Always init maxSum to `-Infinity`** — handles all-negative input correctly. Most common bug in interview implementations.
4. **Index-tracking follow-up** — always be ready to return the subarray itself, not just the sum. Use `tempStart` pointer pattern.
5. **Related problems** — Maximum Product Subarray (LC #152), Maximum Sum Circular Subarray (LC #918). Both build directly on Kadane's intuition.