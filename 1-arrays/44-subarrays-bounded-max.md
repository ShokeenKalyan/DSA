# 62 - Number of Subarrays with Bounded Maximum

## Problem
**LeetCode:** [#795 Number of Subarrays with Bounded Maximum](https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum/)  
**Difficulty:** Medium  
**Topic:** Arrays, Sliding Window, Two Pointers

### Statement
Count contiguous subarrays where the maximum element is in `[left, right]`.

```
[2,1,4,3], left=2, right=3  →  3   ([2],[3],[2,1])
[2,9,2,5,6], left=2, right=8 →  7
```

---

## Core Insight — Inclusion-Exclusion

"Max in [L,R]" is hard directly. Decompose:

```
count(L ≤ max ≤ R) = count(max ≤ R) - count(max ≤ L-1)
```

Both subproblems are easy: count subarrays where max ≤ some bound.

---

## Helper: countAtMost(nums, bound)

Sliding window — reset `start` when `nums[i] > bound`.  
For each `i`, add `i - start + 1` subarrays (all subarrays ending at i within valid window).

```javascript
function countAtMost(nums, bound) {
    let count = 0, start = 0;

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > bound) start = i + 1; // Reset — this element is too large
        count += i - start + 1; // Subarrays [start..i],[start+1..i],...,[i..i]
        // Note: after reset, start=i+1 → i-(i+1)+1=0 → contributes 0 naturally
    }

    return count;
}
```

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #795 — Number of Subarrays with Bounded Maximum
 * Time: O(n) — two passes | Space: O(1)
 */
function numSubarrayBoundedMax(nums, left, right) {
    return countAtMost(nums, right) - countAtMost(nums, left - 1);
}

function countAtMost(nums, bound) {
    let count = 0, start = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > bound) start = i + 1;
        count += i - start + 1;
    }
    return count;
}

console.log(numSubarrayBoundedMax([2,1,4,3], 2, 3));   // 3 ✅
console.log(numSubarrayBoundedMax([2,9,2,5,6], 2, 8)); // 7 ✅
console.log(numSubarrayBoundedMax([1,1,1], 1, 1));      // 6 ✅
console.log(numSubarrayBoundedMax([9], 1, 8));           // 0 ✅
```

---

## Dry Run

```
nums=[2,9,2,5,6], left=2, right=8

countAtMost(8):
  i=0: 2≤8 → count+=1=1
  i=1: 9>8 → start=2, count+=0=1
  i=2: 2≤8 → count+=1=2
  i=3: 5≤8 → count+=2=4
  i=4: 6≤8 → count+=3=7   → 7

countAtMost(1):
  Every element >1 → start resets each time → count+=0 every step → 0

Answer = 7 - 0 = 7 ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(n) — two linear passes |
| Space | O(1) |

---

## The Inclusion-Exclusion Pattern

| Problem | Formula |
|---|---|
| **Max in [L,R] (P62)** | `f(R) - f(L-1)` where f = count(max≤bound) |
| **Exactly K distinct** | `f(K) - f(K-1)` where f = count(at most K distinct) |
| **Subarray Sum = K** | Prefix sum + HashMap |

**Key:** whenever "exactly in range [L,R]" is hard → try `f(R) - f(L-1)` where `f` handles "at most" bound.

---

## Key Patterns & Takeaways

1. **`f(R) - f(L-1)` decomposition** — transform "max in [L,R]" into two "max ≤ bound" counts. Generalises to any range constraint on subarrays.
2. **`count += i - start + 1` always** — elegant: after a reset (`start = i+1`), this contributes 0 naturally. No extra conditional needed.
3. **Reset on violation** — any element exceeding bound resets the window start. Classic sliding window without a right pointer.
4. **Generalises broadly** — works for min, max, sum, product with range constraints. Always ask: "can I express this as f(R) - f(L-1)?"
5. **Connection to LC #560** — Subarray Sum = K uses prefix sums for an additive constraint. This uses sliding window for a max constraint. Both transform a hard exact condition into manageable subproblems.