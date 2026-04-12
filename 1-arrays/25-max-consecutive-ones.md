# 36 - Maximum Consecutive Ones

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/count-maximum-consecutive-ones-in-the-array) | [LeetCode #485](https://leetcode.com/problems/max-consecutive-ones/)  
**Difficulty:** Easy  
**Topic:** Arrays, Sliding Window

### Statement
Given a binary array, return the maximum number of consecutive `1`s.

```
[1,1,0,1,1,1]  →  3
[1,0,1,1,0,1]  →  2
[0,0,0]        →  0
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// Single Pass — O(n) time, O(1) space ✅
// ─────────────────────────────────────────────────────────
function findMaxConsecutiveOnes(nums) {
    let currentStreak = 0;
    let maxStreak = 0;

    for (const num of nums) {
        if (num === 1) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak); // Update inside loop
        } else {
            currentStreak = 0; // Reset on 0
        }
    }

    return maxStreak;
}

console.log(findMaxConsecutiveOnes([1,1,0,1,1,1])); // 3 ✅
console.log(findMaxConsecutiveOnes([1,0,1,1,0,1])); // 2 ✅
console.log(findMaxConsecutiveOnes([0,0,0]));        // 0 ✅
console.log(findMaxConsecutiveOnes([1,1,1,1]));      // 4 ✅
```

---

## Dry Run

```
nums = [1,1,0,1,1,1]

1: streak=1, max=1
1: streak=2, max=2
0: streak=0
1: streak=1, max=2
1: streak=2, max=2
1: streak=3, max=3

Answer: 3 ✅
```

---

## The Important Variants — Interviewers Always Follow Up Here

### Variant 1: Flip At Most 1 Zero (LC #487)

```javascript
// Sliding Window: window with at most 1 zero
// Time: O(n) | Space: O(1)
function findMaxConsecutiveOnesII(nums) {
    let left = 0, maxLen = 0, zeroCount = 0;

    for (let right = 0; right < nums.length; right++) {
        if (nums[right] === 0) zeroCount++;

        while (zeroCount > 1) {          // Shrink until valid
            if (nums[left] === 0) zeroCount--;
            left++;
        }

        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}

console.log(findMaxConsecutiveOnesII([1,0,1,1,0])); // 4 ✅
```

### Variant 2: Flip At Most K Zeros (LC #1004) — Most Important

```javascript
// Time: O(n) | Space: O(1)
function longestOnes(nums, k) {
    let left = 0, maxLen = 0, zeroCount = 0;

    for (let right = 0; right < nums.length; right++) {
        if (nums[right] === 0) zeroCount++;

        // Shrink if invalid (more than k zeros in window)
        if (zeroCount > k) {
            if (nums[left] === 0) zeroCount--;
            left++;
        }

        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}

console.log(longestOnes([1,1,1,0,0,0,1,1,1,1,0], 2));  // 6  ✅
console.log(longestOnes([1,1,1,1], 0));                  // 4  ✅
console.log(longestOnes([0,0,0], 0));                    // 0  ✅
```

### Optimised Version — Window Never Shrinks

```javascript
// Using if instead of while keeps window monotonically non-decreasing.
// Answer = nums.length - left (no explicit maxLen needed).
function longestOnesOptimised(nums, k) {
    let left = 0, zeroCount = 0;

    for (let right = 0; right < nums.length; right++) {
        if (nums[right] === 0) zeroCount++;
        if (zeroCount > k) {           // if, not while
            if (nums[left] === 0) zeroCount--;
            left++;                    // Window slides, never shrinks
        }
    }

    return nums.length - left; // Window size = total - left offset
}
```

---

## The Sliding Window Family

| Problem | Constraint | LeetCode |
|---|---|---|
| **Max Consecutive Ones** | 0 zeros | #485 |
| **Max Consecutive Ones II** | ≤ 1 zero | #487 |
| **Max Consecutive Ones III** | ≤ k zeros | #1004 |
| **Longest Substring No Repeat** | All unique | #3 |
| **Longest K Distinct** | ≤ k distinct | #340 |

Template: `expand right → check validity → shrink left if invalid → update max`

---

## Key Patterns & Takeaways

1. **Base = simple counter** — increment on 1, reset on 0, update max inside the loop. O(n), O(1). No post-loop update needed.
2. **Flip variants = sliding window** — "at most K zeros" becomes "window with at most K zeros". Same template as Longest Substring (Problem 22).
3. **`if` not `while` for optimised version** — using `if` keeps window size non-decreasing. Answer is `nums.length - left` implicitly.
4. **Always have all 3 variants ready** — interviewers almost always escalate: base → flip 1 → flip K. Know the progression cold.
5. **K=0 is the base problem** — `longestOnes(nums, 0)` is equivalent to `findMaxConsecutiveOnes`. The general solution subsumes the base case.