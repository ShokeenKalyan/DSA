# 106 - Number of Subsequences That Satisfy the Given Sum Condition

## Problem
**LeetCode:** [#1498 Number of Subsequences That Satisfy the Given Sum Condition](https://leetcode.com/problems/number-of-subsequences-that-satisfy-the-given-sum-condition/)  
**Difficulty:** Medium  
**Topic:** Arrays, Two Pointers, Sorting, Math

### Statement
Count non-empty subsequences where `min + max ≤ target`. Return result mod `10^9 + 7`.

```
[3,5,6,7], target=9     →  4   ([3],[3,5],[3,6],[3,5,6])
[3,3,6,8], target=10    →  6
[2,3,3,4,6,7], target=12 →  61
```

---

## Intuition — Sort + Two Pointer + Count

Subsequences only care about **min and max**, not order → **sort first**.

After sorting, fix `left` as the minimum element. Find the farthest `right` where `nums[left] + nums[right] ≤ target`. All `2^(right-left)` subsequences using `nums[left]` as min (choosing any subset of elements `(left+1..right)`) are valid.

```
nums[left] = fixed minimum (must be included)
Elements (left+1..right) = each independently in or out
→ 2^(right-left) valid subsequences per left position
```

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #1498
 * Time: O(n log n) | Space: O(n)
 */
const MOD = 1_000_000_007n; // BigInt — avoids overflow in modular multiply

function numSubseq(nums, target) {
    nums.sort((a, b) => a - b);
    const n = nums.length;

    // Precompute pow2[i] = 2^i mod MOD — O(n), avoids repeated pow calls
    const pow2 = new Array(n);
    pow2[0] = 1n;
    for (let i = 1; i < n; i++) pow2[i] = (pow2[i-1] * 2n) % MOD;

    let count = 0n;
    let left = 0, right = n - 1;

    while (left <= right) {
        if (nums[left] + nums[right] <= target) {
            // nums[left] is valid min — add all 2^(right-left) subsequences
            count = (count + pow2[right - left]) % MOD;
            left++; // Try next minimum
        } else {
            right--; // Max too large — shrink window
        }
    }

    return Number(count);
}

console.log(numSubseq([3,5,6,7], 9));          // 4   ✅
console.log(numSubseq([3,3,6,8], 10));         // 6   ✅
console.log(numSubseq([2,3,3,4,6,7], 12));     // 61  ✅
```

---

## Dry Run

```
nums=[3,5,6,7], target=9, sorted=[3,5,6,7]
pow2=[1,2,4,8]

l=0,r=3: 3+7=10>9 → r=2
l=0,r=2: 3+6=9≤9 → count+=pow2[2]=4, l=1
l=1,r=2: 5+6=11>9 → r=1
l=1,r=1: 5+5=10>9 → r=0
l>r → exit. return 4 ✅

Subsequences: {3},{3,5},{3,6},{3,5,6} → min+max ≤ 9 ✓
```

---

## Complexity

| | Value |
|---|---|
| Time | O(n log n) — sort + O(n) two pointer |
| Space | O(n) — powers array |

---

## Why `2^(right-left)` not `2^(right-left+1)`

```
nums[left] MUST be included (it's the fixed minimum).
Only the (right-left) elements at indices (left+1..right)
can freely be in or out → 2^(right-left) subsets.

When left===right: pow2[0]=1 → just {nums[left]} ✅
```

---

## Why BigInt in JS

```
MOD = 10^9+7. In pow2 computation: pow2[i-1] * 2 could be up to
2 × (MOD-1) ≈ 2×10^9, which exceeds Number.MAX_SAFE_INTEGER (2^53)?
Actually 2×10^9 < 2^53 ≈ 9×10^15, so regular numbers work here.

BUT: count + pow2[...] accumulates. For safety and correctness
at scale, BigInt is the robust choice. Convert to Number at end.
```

---

## Key Details

```
1. Sort first — min/max only, order irrelevant for subsequences
2. pow2[right-left] not pow2[right-left+1] — left is fixed
3. Add THEN left++ — right stays valid for the new left
4. Single element: left===right, pow2[0]=1 → adds {nums[left]}
5. Precompute powers — O(n) once vs O(log n) per call × n steps
```

---

## Key Patterns & Takeaways

1. **Sort for min/max subsequences** — when only min+max matters, sort enables two-pointer to find valid ranges efficiently.
2. **`2^(right-left)` bulk count** — each valid left contributes an exponential count of subsequences. Add in bulk rather than enumerate.
3. **Precompute powers mod MOD** — standard competitive programming pattern. O(n) precompute, O(1) lookup, exact arithmetic.
4. **Two pointer counting, not finding** — unlike Two Sum, we accumulate counts as we move pointers. Classic extension of the two-pointer pattern.
5. **BigInt for modular safety in JS** — when intermediate products could overflow, use BigInt and convert back at the end.