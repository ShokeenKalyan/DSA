# 67 - Search Insert Position

## Problem
**LeetCode:** [#35 Search Insert Position](https://leetcode.com/problems/search-insert-position/)  
**Difficulty:** Easy  
**Topic:** Arrays, Binary Search

### Statement
Return index of `target` in sorted `nums`, or index where it would be inserted. O(log n).

```
[1,3,5,6], target=5  →  2  (found)
[1,3,5,6], target=2  →  1  (insert between 1 and 3)
[1,3,5,6], target=7  →  4  (insert at end)
[1,3,5,6], target=0  →  0  (insert at start)
```

---

## Intuition — Lower Bound

Find the **first index where `nums[i] >= target`**. Whether target exists or not, lower bound gives the correct answer in one unified template.

---

## Two Templates

```
Template 1: while (lo <= hi)  — find exact match
  Returns -1 if not found. lo = insert pos when loop exits.

Template 2: while (lo < hi)   — find lower bound ✅
  hi = n (not n-1). Always returns valid index [0..n].
  Single template handles found + not-found.
  lo === hi at exit.
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Standard — explicit found check
// ─────────────────────────────────────────────────────────
function searchInsertExplicit(nums, target) {
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (nums[mid] === target) return mid;
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return lo; // Insertion point when not found
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Lower Bound — O(log n), O(1) ✅
// hi = n (handles end insertion)
// lo < hi (exits when lo===hi)
// hi = mid (mid could be the answer, don't skip it)
// ─────────────────────────────────────────────────────────
function searchInsert(nums, target) {
    let lo = 0, hi = nums.length; // hi = n, not n-1

    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (nums[mid] < target) lo = mid + 1; // Target right of mid
        else hi = mid;                         // nums[mid] >= target → could be answer
    }

    return lo; // lo === hi = first index where nums[i] >= target
}

console.log(searchInsert([1,3,5,6], 5)); // 2 ✅
console.log(searchInsert([1,3,5,6], 2)); // 1 ✅
console.log(searchInsert([1,3,5,6], 7)); // 4 ✅
console.log(searchInsert([1,3,5,6], 0)); // 0 ✅
```

---

## Dry Run

```
[1,3,5,6], target=2, lo=0, hi=4

mid=2: 5>=2 → hi=2
mid=1: 3>=2 → hi=1
mid=0: 1<2  → lo=1
lo===hi=1 → return 1 ✅

[1,3,5,6], target=7, lo=0, hi=4

mid=2: 5<7 → lo=3
mid=3: 6<7 → lo=4
lo===hi=4 → return 4 ✅ (end insertion)
```

---

## Complexity

| | Value |
|---|---|
| Time | O(log n) |
| Space | O(1) |

---

## Lower Bound / Upper Bound Family

| Operation | Condition | Returns |
|---|---|---|
| **Lower bound** | first `nums[i] >= target` | Insert pos / leftmost |
| **Upper bound** | first `nums[i] > target` | One past rightmost |
| **Search Insert (P67)** | = lower bound | Insert pos |
| **Find First & Last (LC #34)** | lower + upper bound | [first, last] |

---

## Key Patterns & Takeaways

1. **Lower bound = this problem** — first index where `nums[i] >= target`. One template for both found and not-found.
2. **`hi = nums.length`** — not `n-1`. End insertion (target > all) needs `n` as a valid return value.
3. **`lo < hi` not `lo <= hi`** — Template 2 exits at `lo===hi`. `lo<=hi` with `hi=mid` would infinite-loop.
4. **`hi = mid` not `hi = mid-1`** — mid could be the answer when `nums[mid] >= target`. Never skip it.
5. **Template 1 fallback** — standard `lo<=hi` template: `lo` = insert position when loop exits (target not found). Good fallback if you blank on Template 2.