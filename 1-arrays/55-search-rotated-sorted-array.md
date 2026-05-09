# 103 - Search in Rotated Sorted Array

## Problem
**LeetCode:** [#33 Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)  
**Difficulty:** Medium  
**Topic:** Binary Search

### Statement
Given a rotated sorted array (no duplicates) and a target, return its index or -1. O(log n) required.

```
[4,5,6,7,0,1,2], target=0  →  4
[4,5,6,7,0,1,2], target=3  →  -1
[1,3],           target=3  →  1
```

---

## Core Insight — One Half is Always Sorted

After rotation, at any `mid`, exactly one of `[left..mid]` or `[mid..right]` is sorted. Use that half's bounds to decide where to search.

```
nums[left] <= nums[mid] → LEFT half [left..mid] is sorted
  target in [nums[left], nums[mid]) → search LEFT
  else → search RIGHT

nums[left] > nums[mid] → RIGHT half [mid..right] is sorted
  target in (nums[mid], nums[right]] → search RIGHT
  else → search LEFT
```

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #33 — Search in Rotated Sorted Array
 * Time: O(log n) | Space: O(1)
 */
function search(nums, target) {
    let left = 0, right = nums.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (nums[mid] === target) return mid;

        if (nums[left] <= nums[mid]) {
            // LEFT half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1; // Target in left half
            } else {
                left = mid + 1;  // Target in right half
            }
        } else {
            // RIGHT half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;  // Target in right half
            } else {
                right = mid - 1; // Target in left half
            }
        }
    }

    return -1;
}

console.log(search([4,5,6,7,0,1,2], 0)); // 4  ✅
console.log(search([4,5,6,7,0,1,2], 3)); // -1 ✅
console.log(search([1,3], 3));             // 1  ✅
console.log(search([3,1], 1));             // 1  ✅
console.log(search([1,2,3,4,5], 3));       // 2  ✅ (no rotation)
```

---

## Dry Run

```
[4,5,6,7,0,1,2], target=0

mid=3: nums[3]=7≠0
  nums[0]=4<=nums[3]=7 → LEFT sorted
  4<=0? NO → search right → left=4

mid=5: nums[5]=1≠0
  nums[4]=0<=nums[5]=1 → LEFT sorted
  0<=0 AND 0<1 → YES → search left → right=4

mid=4: nums[4]=0===0 → return 4 ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(log n) |
| Space | O(1) |

---

## Why `<=` in `nums[left] <= nums[mid]`

```
When left===mid (two-element array, mid=left):
  nums[left]===nums[mid] always.
  Using < would fail to classify correctly.
  Using <= handles single-element left half as trivially sorted.

Example: [3,1], target=1
  mid=0: nums[0]=3<=nums[0]=3 → LEFT sorted
  3<=1? NO → search right → left=1
  mid=1: nums[1]=1===1 → return 1 ✅
```

---

## Follow-up: Search Rotated Array II (LC #81) — With Duplicates

```javascript
// When nums[left]===nums[mid]===nums[right], can't determine sorted half
// Fix: shrink both bounds. Worst case O(n) for all-duplicate arrays.
function searchII(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) return true;

        if (nums[left] === nums[mid] && nums[mid] === nums[right]) {
            left++; right--; // Can't determine sorted half — shrink both
        } else if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) right = mid-1;
            else left = mid+1;
        } else {
            if (nums[mid] < target && target <= nums[right]) left = mid+1;
            else right = mid-1;
        }
    }
    return false;
}
// O(log n) avg, O(n) worst
```

---

## Rotated Array Family

| Problem | Goal | LC |
|---|---|---|
| **Search Rotated (P103)** | Find index | #33 |
| **Search Rotated II** | Find (duplicates) | #81 |
| **Find Min Rotated** | Find minimum | #153 |
| **Find Min Rotated II** | Find min (duplicates) | #154 |

All use the same "identify sorted half" binary search pattern.

---

## Key Patterns & Takeaways

1. **One half always sorted** — core insight. At any mid, exactly one half is sorted. Use its bounds to locate target.
2. **`nums[left] <= nums[mid]` = left sorted** — `<=` handles single-element left half (`left===mid`).
3. **Strict range inequalities** — `nums[left] <= target < nums[mid]` for left; `nums[mid] < target <= nums[right]` for right.
4. **No-rotation handled automatically** — unrotated array always has sorted left half. Algorithm degrades to standard binary search.
5. **Duplicates break it** — `nums[left]===nums[mid]===nums[right]` is ambiguous. Fix: `left++, right--`. Worst case O(n).