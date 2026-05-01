# 53 - First Missing Positive

## Problem
**LeetCode:** [#41 First Missing Positive](https://leetcode.com/problems/first-missing-positive/)  
**Difficulty:** Hard  
**Topic:** Arrays, Index as Hash Map

### Statement
Find the smallest missing positive integer. O(n) time, O(1) space required.

```
[1,2,0]       →  3
[3,4,-1,1]    →  2
[7,8,9,11,12] →  1
[1,2,3]       →  4
```

---

## Core Observation

**Answer is always in `[1, n+1]`** where `n = nums.length`.  
Best case: `[1..n]` all present → answer is `n+1`.  
Any gap → some number in `[1..n]` is missing.

This means we only care about values in `[1,n]` — and we have exactly `n` indices to track them. Use the **array itself as a hash map**: index `i` represents value `i+1`, sign represents presence.

---

## Three-Pass Algorithm (Negation Marking)

```
Pass 1 — Clean: replace values ≤0 or >n with n+1 (safe dummy)
Pass 2 — Mark:  for each value v in [1,n], negate nums[v-1]
Pass 3 — Scan:  first i where nums[i] > 0 → value i+1 is missing
```

---

## Solution (JavaScript)

```javascript
/**
 * First Missing Positive — LeetCode #41
 * Time: O(n) — 3 passes | Space: O(1) — array as hash map
 */
function firstMissingPositive(nums) {
    const n = nums.length;

    // Pass 1: Neutralise irrelevant values
    // ≤0 or >n can't be in [1..n], replace with n+1
    for (let i = 0; i < n; i++) {
        if (nums[i] <= 0 || nums[i] > n) nums[i] = n + 1;
    }

    // Pass 2: Mark presence
    // Value v present → negate nums[v-1]
    // Math.abs() needed: value may already be negated from earlier
    for (let i = 0; i < n; i++) {
        const val = Math.abs(nums[i]);
        if (val >= 1 && val <= n && nums[val - 1] > 0) {
            nums[val - 1] = -nums[val - 1]; // Mark as seen
        }
    }

    // Pass 3: Find first positive (= first missing value)
    for (let i = 0; i < n; i++) {
        if (nums[i] > 0) return i + 1;
    }

    return n + 1; // All 1..n present
}

console.log(firstMissingPositive([1,2,0]));       // 3 ✅
console.log(firstMissingPositive([3,4,-1,1]));    // 2 ✅
console.log(firstMissingPositive([7,8,9,11,12])); // 1 ✅
console.log(firstMissingPositive([1,2,3]));        // 4 ✅
console.log(firstMissingPositive([1,1]));           // 2 ✅ (duplicates)


// ─────────────────────────────────────────────────────────
// ALTERNATIVE: Cyclic Sort — place v at index v-1, then scan
// ─────────────────────────────────────────────────────────
function firstMissingPositiveCyclicSort(nums) {
    const n = nums.length;

    for (let i = 0; i < n; i++) {
        while (
            nums[i] >= 1 &&
            nums[i] <= n &&
            nums[nums[i]-1] !== nums[i] // Duplicate guard
        ) {
            [nums[i], nums[nums[i]-1]] = [nums[nums[i]-1], nums[i]];
        }
    }

    for (let i = 0; i < n; i++) {
        if (nums[i] !== i + 1) return i + 1;
    }

    return n + 1;
}
```

---

## Dry Run — Negation Marking

```
nums=[3,4,-1,1], n=4

Pass 1: -1 → 5       →  [3,4,5,1]

Pass 2:
  val=3 → negate nums[2]  →  [3,4,-5,1]
  val=4 → negate nums[3]  →  [3,4,-5,-1]
  val=5 → >n, skip
  val=1 → negate nums[0]  →  [-3,4,-5,-1]

Pass 3:
  i=0: -3<0 → 1 present
  i=1:  4>0 → 2 MISSING → return 2 ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(n) — 3 passes |
| Space | O(1) — in-place |

---

## ⚠️ Implementation Details

```
1. Pass 1 before Pass 2 — must neutralise negatives FIRST.
   Without it, -1 in Pass 2 gives Math.abs(-1)=1, falsely marking 1.

2. Math.abs() in Pass 2 — value may already be negated.
   Always use absolute value to get the original.

3. Guard: only negate if nums[val-1] > 0
   Prevents double-negation (which would incorrectly unmark).

4. Duplicates: [1,1] — second 1 sees nums[0] already negative,
   guard prevents re-negating. Works correctly.
```

---

## Two Approaches

| | Negation Marking | Cyclic Sort |
|---|---|---|
| Passes | 3 | 2 |
| Key idea | Sign = presence marker | Value at home index |
| Duplicate guard | `if (nums[v-1] > 0)` | `nums[nums[i]-1] !== nums[i]` |
| Easier to explain | ✅ | Slightly trickier |

---

## Key Patterns & Takeaways

1. **Answer in `[1, n+1]`** — bounding the search space is the critical insight. Enables using the array as a hash map.
2. **Array as hash map via sign** — index `i` ↔ value `i+1`. Negative = present, positive = absent. Same technique as Problems 10 & 11.
3. **Pass 1 is mandatory** — neutralise values outside `[1,n]` before marking. Without it, negatives corrupt Pass 2.
4. **`Math.abs()` in Pass 2** — values may already be marked. Always dereference with absolute value.
5. **Cyclic sort alternative** — places each value at its "home index" (v → index v-1). Conceptually clean but the swap loop with duplicate guard is harder under pressure.