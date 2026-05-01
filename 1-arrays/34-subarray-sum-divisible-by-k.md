# 52 - Subarray Sums Divisible by K

## Problem
**LeetCode:** [#974 Subarray Sums Divisible by K](https://leetcode.com/problems/subarray-sums-divisible-by-k/)  
**Difficulty:** Medium  
**Topic:** Arrays, Prefix Sum, Hashing

### Statement
Count non-empty subarrays with sum divisible by `k`.

```
[4,5,0,-2,-3,1], k=5  →  7
[5],             k=9  →  0
```

---

## Core Insight

```
sum(i..j) divisible by k
⟺ (prefixSum[j] - prefixSum[i-1]) % k === 0
⟺ prefixSum[j] % k === prefixSum[i-1] % k
```

**Count pairs of indices with the same prefix sum remainder mod k.**  
Store `remainder → frequency` in a HashMap. For each new remainder, add all previous matching occurrences to count.

---

## ⚠️ Negative Modulo Fix

JavaScript: `(-3) % 5 = -3` (wrong — need `2`).

```javascript
const rem = ((prefixSum % k) + k) % k;
// (-3%5+5)%5 = 2 ✅
// (7%5+5)%5  = 2 ✅ (positive unchanged)
```

**Most common bug in this problem.** Always normalise.

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #974 — Subarray Sums Divisible by K
 * Time: O(n) | Space: O(k) — only k distinct remainders possible
 */
function subarraysDivByK(nums, k) {
    const remainderCount = new Map();

    // Seed: remainder 0 before array starts (empty prefix, sum=0)
    remainderCount.set(0, 1);

    let prefixSum = 0, count = 0;

    for (const num of nums) {
        prefixSum += num;

        // Normalise to non-negative remainder
        const rem = ((prefixSum % k) + k) % k;

        // Each previous occurrence with same remainder = one valid subarray
        count += (remainderCount.get(rem) || 0);

        // Record this remainder
        remainderCount.set(rem, (remainderCount.get(rem) || 0) + 1);
    }

    return count;
}

console.log(subarraysDivByK([4,5,0,-2,-3,1], 5)); // 7 ✅
console.log(subarraysDivByK([5], 9));              // 0 ✅
console.log(subarraysDivByK([1,2,3], 6));          // 1 ✅
console.log(subarraysDivByK([-1,2,9], 2));         // 2 ✅
```

---

## Dry Run

```
nums=[4,5,0,-2,-3,1], k=5, seed={0:1}

ps=4,  rem=4 → not in map → {0:1,4:1},  count=0
ps=9,  rem=4 → freq=1     → {0:1,4:2},  count=1
ps=9,  rem=4 → freq=2     → {0:1,4:3},  count=3
ps=7,  rem=2 → not in map → {0:1,4:3,2:1}, count=3
ps=4,  rem=4 → freq=3     → {0:1,4:4,2:1}, count=6
ps=5,  rem=0 → freq=1     → {0:2,4:4,2:1}, count=7

Answer: 7 ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(n) |
| Space | O(k) — only k distinct remainders (0..k-1) |

Space O(k) not O(n) — a key improvement over general prefix sum pattern.

---

## The Prefix Sum + HashMap Family

| Problem | Map stores | Seed | Goal |
|---|---|---|---|
| **Longest Zero-Sum (P21)** | `ps → firstIndex` | `{0:-1}` | Max length |
| **Subarray Sum = K (LC #560)** | `ps → frequency` | `{0:1}` | Count |
| **Divisible by K (P52)** | `rem → frequency` | `{0:1}` | Count |
| **Equal 0s & 1s (LC #525)** | `ps → firstIndex` | `{0:-1}` | Max length |

**Rule:** Count problems → frequency + seed `{0:1}`. Length problems → firstIndex + seed `{0:-1}`.

---

## Key Patterns & Takeaways

1. **Same remainder = valid subarray** — modular version of prefix sum trick. `ps[j]%k === ps[i]%k` means `sum(i+1..j)` divisible by k.
2. **Negative modulo fix** — `((n%k)+k)%k`. The #1 bug. Essential for negative numbers in JS.
3. **Space O(k) not O(n)** — only k remainders possible. Map capped at k entries.
4. **Seed `{0:1}` for counting** — counts the empty prefix as one occurrence of remainder 0. Different from length problems which use `{0:-1}`.
5. **`count += frequency`, not `+= 1`** — each previous occurrence is a distinct valid subarray. Add the whole frequency count.