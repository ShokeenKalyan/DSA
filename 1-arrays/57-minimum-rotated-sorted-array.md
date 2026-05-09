# 105 - Find Minimum in Rotated Sorted Array

## Problem
**LeetCode:** [#153 Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)  
**Difficulty:** Medium  
**Topic:** Binary Search

### Statement
Find the minimum element in a rotated sorted array (no duplicates). O(log n).

```
[3,4,5,1,2]     →  1
[4,5,6,7,0,1,2] →  0
[11,13,15,17]   →  11  (not rotated)
```

---

## Intuition — Compare `nums[mid]` with `nums[right]`

```
nums[mid] > nums[right]:
  Array "wraps" between mid and right → rotation point in right half
  Minimum is in RIGHT half → left = mid+1

nums[mid] <= nums[right]:
  Right half cleanly sorted → minimum at mid or in left half
  → right = mid  (don't exclude mid — could be the answer)
```

**Why `nums[right]` not `nums[left]`?**  
Comparing with `nums[left]` fails for non-rotated arrays — when left half is sorted, minimum could still be `nums[left]`. Comparing with `nums[right]` avoids this ambiguity.

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #153 — Find Minimum in Rotated Sorted Array
 * Time: O(log n) | Space: O(1)
 */
function findMin(nums) {
    let left = 0, right = nums.length - 1;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);

        if (nums[mid] > nums[right]) {
            left = mid + 1;  // Rotation point in right → go right
        } else {
            right = mid;     // Min at mid or left → go left (keep mid)
        }
    }

    return nums[left]; // left === right === min index
}

// Linear — O(n)
const findMinLinear = nums => {
    for (let i = 1; i < nums.length; i++)
        if (nums[i] < nums[i-1]) return nums[i];
    return nums[0];
};

console.log(findMin([3,4,5,1,2]));     // 1  ✅
console.log(findMin([4,5,6,7,0,1,2])); // 0  ✅
console.log(findMin([11,13,15,17]));   // 11 ✅
console.log(findMin([2,1]));           // 1  ✅


// ─────────────────────────────────────────────────────────
// FOLLOW-UP: Find Min II (LC #154) — with duplicates
// nums[mid]===nums[right] is ambiguous → shrink right
// ─────────────────────────────────────────────────────────
function findMinII(nums) {
    let left = 0, right = nums.length - 1;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if      (nums[mid] > nums[right]) left = mid + 1;
        else if (nums[mid] < nums[right]) right = mid;
        else right--; // Ambiguous — safely shrink right
    }
    return nums[left];
}
// O(log n) avg, O(n) worst
```

---

## Dry Run

```
[3,4,5,1,2]: l=0,r=4

mid=2: nums[2]=5>nums[4]=2 → l=3
mid=3: nums[3]=1<=nums[4]=2 → r=3
l===r=3 → nums[3]=1 ✅

[4,5,6,7,0,1,2]: l=0,r=6

mid=3: 7>2 → l=4
mid=5: 1<=2 → r=5
mid=4: 0<=1 → r=4
l===r=4 → nums[4]=0 ✅

[11,13,15,17]: l=0,r=3 (no rotation)

mid=1: 13<=17 → r=1
mid=0: 11<=13 → r=0
l===r=0 → nums[0]=11 ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Linear | O(n) | O(1) |
| **Binary Search** | **O(log n)** | **O(1)** |

---

## P103 vs P105 Comparison

| | Find Min (P105) | Search Rotated (P103) |
|---|---|---|
| Goal | Minimum value | Target index |
| Compare mid with | `nums[right]` | `nums[left]` |
| Template | `lo < hi`, `right=mid` | `lo <= hi`, exact match |

---

## The Rotated Array Family

| Problem | Goal | Compare | LC |
|---|---|---|---|
| **Find Min (P105)** | Minimum | `nums[right]` | #153 |
| Find Min II | Min (dups) | `nums[right]` + shrink | #154 |
| Search Rotated (P103) | Target | `nums[left]` | #33 |
| Search Rotated II | Target (dups) | `nums[left]` + shrink | #81 |

---

## Key Patterns & Takeaways

1. **Compare `nums[mid]` with `nums[right]`** — `nums[mid]>nums[right]` means rotation point (and min) is in right half.
2. **`right = mid` not `mid-1`** — mid could be the minimum. Don't exclude it.
3. **Template 2 (`left < right`)** — exits at `left===right`. Return `nums[left]`.
4. **No-rotation handled naturally** — always `nums[mid] <= nums[right]` → right shrinks to 0 → returns `nums[0]`.
5. **Duplicates: `right--`** — when `nums[mid]===nums[right]`, safe to shrink right (nums[mid] equals it so we don't lose the answer).