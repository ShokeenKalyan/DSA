# 64 - Running Sum of 1D Array

## Problem
**LeetCode:** [#1480 Running Sum of 1D Array](https://leetcode.com/problems/running-sum-of-1d-array/)  
**Difficulty:** Easy  
**Topic:** Arrays, Prefix Sum

### Statement
Return running sum where `result[i] = sum(nums[0..i])`.

```
[1,2,3,4]    →  [1,3,6,10]
[1,1,1,1,1]  →  [1,2,3,4,5]
```

---

## Solution (JavaScript)

```javascript
// In-place — O(n) time, O(1) space
function runningSum(nums) {
    for (let i = 1; i < nums.length; i++) {
        nums[i] += nums[i - 1];
    }
    return nums;
}

// Non-mutating — O(n) time, O(n) space
const runningSumClean = nums =>
    nums.reduce((acc, n) => [...acc, (acc.at(-1) ?? 0) + n], []);

console.log(runningSum([1,2,3,4]));    // [1,3,6,10]   ✅
console.log(runningSum([3,1,2,10,1])); // [3,4,6,16,17] ✅
```

---

## Key Takeaway

`nums[i] += nums[i-1]` — each element absorbs all previous. The foundational prefix sum operation. Building block for P63 (Pivot Index), Subarray Sum = K, and all prefix sum problems.