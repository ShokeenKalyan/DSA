# 19 - 4Sum (Find Quads That Add Up to Target)

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/4-sum-find-quads-that-add-up-to-a-target-value) | [LeetCode #18](https://leetcode.com/problems/4sum/)  
**Difficulty:** Medium  
**Topic:** Arrays, Sorting, Two Pointers

### Statement
Return all unique quadruplets `[a, b, c, d]` from `nums` such that `a + b + c + d === target`.

```
[1,0,-1,0,-2,2], target=0  →  [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
[2,2,2,2,2],     target=8  →  [[2,2,2,2]]
```

---

## The k-Sum Pattern

```
Two Sum  (k=2): Two Pointer → O(n)
3Sum     (k=3): Fix one + Two Pointer → O(n²)
4Sum     (k=4): Fix two + Two Pointer → O(n³)
k-Sum    (k=k): Fix k-2 + Two Pointer → O(n^(k-1))
```

---

## Approach: Sort + Two Nested Loops + Two Pointer

**Time: O(n³) | Space: O(1) (excluding output)**

The entire challenge: **correctly skip duplicates at ALL THREE levels.**

```
Level 1 (i loop):  i > 0 && nums[i] === nums[i-1]       → skip
Level 2 (j loop):  j > i+1 && nums[j] === nums[j-1]     → skip
Level 3 (ptrs):    after match, advance past equal neighbours

Why j > i+1 (not j > 0)?
  j starts fresh at i+1 each iteration. Skipping when j === i+1
  would skip the first valid j for the current i. Only skip once j
  has moved past its initial position.
```

---

## Solution (JavaScript)

```javascript
/**
 * 4Sum
 * LeetCode #18
 * Time: O(n³) | Space: O(1)
 */
function fourSum(nums, target) {
    const n = nums.length;
    const result = [];

    nums.sort((a, b) => a - b); // Sort enables two pointer + dup skip

    for (let i = 0; i < n - 3; i++) {
        // Level 1: skip duplicates for i
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        for (let j = i + 1; j < n - 2; j++) {
            // Level 2: skip duplicates for j (only after first j per i)
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;

            let left = j + 1;
            let right = n - 1;

            while (left < right) {
                const sum = nums[i] + nums[j] + nums[left] + nums[right];

                if (sum === target) {
                    result.push([nums[i], nums[j], nums[left], nums[right]]);

                    // Level 3: skip duplicates for both pointers
                    while (left < right && nums[left] === nums[left + 1]) left++;
                    while (left < right && nums[right] === nums[right - 1]) right--;
                    left++;
                    right--;

                } else if (sum < target) {
                    left++;  // Need larger sum
                } else {
                    right--; // Need smaller sum
                }
            }
        }
    }

    return result;
}

console.log(fourSum([1, 0, -1, 0, -2, 2], 0));
// [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]] ✅

console.log(fourSum([2, 2, 2, 2, 2], 8));
// [[2,2,2,2]] ✅

console.log(fourSum([0, 0, 0, 0], 0));
// [[0,0,0,0]] ✅
```

---

## Dry Run

```
nums=[1,0,-1,0,-2,2], target=0
After sort: [-2,-1,0,0,1,2]

i=0(-2), j=1(-1): left=2,right=5
  sum=-2+-1+0+2=-1<0 → left++
  sum=-2+-1+0+2=-1<0 → left++ (left=4)
  sum=-2+-1+1+2=0 → push[-2,-1,1,2] ✅, left++,right--

i=0(-2), j=2(0): left=3,right=5
  sum=-2+0+0+2=0 → push[-2,0,0,2] ✅
  nums[3]=nums[4]=0 → skip dup → left=4,right=4, left++,right-- → break

i=0(-2), j=3(0): j>i+1, nums[3]=nums[2]=0 → SKIP

i=1(-1), j=2(0): left=3,right=5
  sum=-1+0+0+2=1>0 → right--
  sum=-1+0+0+1=0 → push[-1,0,0,1] ✅

Result: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]] ✅
```

---

## General k-Sum (Recursive)

```javascript
/**
 * Generalised k-Sum — works for any k ≥ 2
 * Time: O(n^(k-1)) | Space: O(k) stack depth
 */
function kSum(nums, target, k, start) {
    const result = [];

    if (k === 2) {
        // Base case: Two Pointer
        let left = start, right = nums.length - 1;
        while (left < right) {
            const sum = nums[left] + nums[right];
            if (sum === target) {
                result.push([nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left+1]) left++;
                while (left < right && nums[right] === nums[right-1]) right--;
                left++; right--;
            } else if (sum < target) left++;
            else right--;
        }
        return result;
    }

    for (let i = start; i < nums.length - k + 1; i++) {
        if (i > start && nums[i] === nums[i-1]) continue;
        const subResults = kSum(nums, target - nums[i], k - 1, i + 1);
        for (const sub of subResults) result.push([nums[i], ...sub]);
    }

    return result;
}

function fourSumGeneral(nums, target) {
    nums.sort((a, b) => a - b);
    return kSum(nums, target, 4, 0);
}
```

---

## ⚠️ Integer Overflow

`nums[i] + nums[j] + nums[left] + nums[right]` can overflow 32-bit integers for large values.
- **JavaScript**: 64-bit float, safe up to 2^53 ✅
- **Java/C++**: must cast to `long` → `(long)nums[i] + nums[j] + nums[left] + nums[right]`

---

## Key Patterns & Takeaways

1. **Sort + fix (k-2) + Two Pointer** — universal k-Sum template. Each extra fixed element adds O(n) factor.
2. **Duplicate skipping at ALL levels** — the hardest part. Three levels for 4Sum. Getting all three right under pressure is the senior-level skill.
3. **`j > i+1` not `j > 0`** — j starts fresh at i+1 per iteration. Only skip once j has advanced past its initial position for the current i.
4. **Integer overflow** — always mention for Java/C++. Shows production awareness.
5. **k-Sum generalisation** — being able to write recursive `kSum(nums, target, k, start)` shows you understand the pattern deeply, not just the 4Sum special case.