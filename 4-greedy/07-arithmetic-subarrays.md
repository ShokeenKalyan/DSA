# 73 - Arithmetic Subarrays

## Problem
**LeetCode:** [#1630 Arithmetic Subarrays](https://leetcode.com/problems/arithmetic-subarrays/)  
**Difficulty:** Medium  
**Topic:** Arrays, Sorting

### Statement
For each query `[l, r]`, determine if `nums[l..r]` can be rearranged into an arithmetic sequence.

```
nums=[4,6,5,9,3,7], l=[0,0,2], r=[4,2,5]  →  [false,true,true]

Query[0]: [4,6,5,9,3] → sort=[3,4,5,6,9] → diffs: 1,1,1,3 → false
Query[1]: [4,6,5]     → sort=[4,5,6]     → diffs: 1,1     → true
Query[2]: [5,9,3,7]   → sort=[3,5,7,9]   → diffs: 2,2,2   → true
```

---

## Two Approaches

| Approach | Time per query | Space | Notes |
|---|---|---|---|
| **Sort + check diffs** | O(k log k) | O(k) | Simple, clean |
| **Set + min/max** | O(k) | O(k) | Avoids sorting |

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Sort per query — O(q × k log k)
// ─────────────────────────────────────────────────────────
function isArithmetic(arr) {
    if (arr.length <= 2) return true;
    arr.sort((a, b) => a - b);
    const diff = arr[1] - arr[0];
    for (let i = 2; i < arr.length; i++) {
        if (arr[i] - arr[i-1] !== diff) return false;
    }
    return true;
}

function checkArithmeticSubarrays(nums, l, r) {
    return l.map((li, i) => isArithmetic(nums.slice(li, r[i] + 1)));
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Set + min/max — O(q × k), no sorting ✅
// diff = (max-min)/(k-1), verify all expected values in Set
// ─────────────────────────────────────────────────────────
function isArithmeticSet(arr) {
    const k = arr.length;
    if (k <= 2) return true;

    let min = Infinity, max = -Infinity;
    const set = new Set(arr);
    for (const n of arr) { min = Math.min(min, n); max = Math.max(max, n); }

    if ((max - min) % (k - 1) !== 0) return false; // Non-integer diff

    const diff = (max - min) / (k - 1);
    if (diff === 0) return set.size === 1; // All same values

    for (let val = min; val <= max; val += diff) {
        if (!set.has(val)) return false;
    }
    return true;
}

function checkArithmeticSubarraysOptimal(nums, l, r) {
    return l.map((li, i) => isArithmeticSet(nums.slice(li, r[i] + 1)));
}

console.log(checkArithmeticSubarrays([4,6,5,9,3,7], [0,0,2], [4,2,5]));
// [false,true,true] ✅
```

---

## Dry Run

```
Query [2,5]: [5,9,3,7]

Sort approach:  sort=[3,5,7,9], diffs=2,2,2 → true ✅

Set approach:   min=3, max=9, k=4
  (9-3)%(4-1) = 6%3 = 0 ✓
  diff = 6/3 = 2
  Expected: 3,5,7,9 — all in Set? Yes → true ✅
```

---

## Edge Cases

```
Length 1 or 2  → always true (any 1-2 elements form arithmetic)
All same       → diff=0, set.size===1 check needed
Non-integer diff → (max-min)%(k-1) !== 0 → false immediately
```

---

## Key Patterns & Takeaways

1. **Sort + check diffs** — simplest approach. Sort, take first diff, verify all match. O(k log k).
2. **Set approach** — no sort. `diff = (max-min)/(k-1)`, verify expected values exist. O(k).
3. **`(max-min)%(k-1)===0` guard** — check before computing diff to avoid fractional diffs.
4. **`nums.slice(l,r+1)` creates a copy** — sorting doesn't mutate `nums`. Critical for multi-query correctness.
5. **`r[i]+1` for slice** — exclusive right bound. Easy off-by-one to miss.