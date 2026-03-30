# 21 - Longest Subarray with Zero Sum

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/length-of-the-longest-subarray-with-zero-sum)  
**Difficulty:** Medium  
**Topic:** Arrays, Hashing, Prefix Sum

### Statement
Given an array of integers (positive and negative), find the length of the **longest subarray with sum = 0**.

```
[15, -2, 2, -8, 1, 7, 10, 23]  →  5  (subarray [-2,2,-8,1,7])
[1, -1, 3, -3, 2, -2]           →  6  (whole array)
[1, 2, 3]                        →  0  (no zero-sum subarray)
[0]                              →  1
```

---

## Core Insight — Prefix Sum + HashMap

```
sum(arr[i..j]) = prefixSum[j] - prefixSum[i-1]
sum = 0  iff  prefixSum[j] === prefixSum[i-1]
```

**Same prefix sum appearing twice → zero-sum subarray between those positions.**

Store each prefix sum's **earliest index** in a HashMap. When a prefix sum repeats, the subarray between the first and current occurrence has sum 0. We want the first occurrence to maximise length — never overwrite.

**Critical seeding:** `prefixMap.set(0, -1)` — handles subarrays starting at index 0. The `-1` is a virtual index meaning "before the array starts", so length = `i - (-1) = i + 1`.

---

## Why Store Only the First Occurrence?

```
prefixSum[j] = prefixSum[k] = prefixSum[i], where j < k < i:
  Subarray j+1..i → length i - j  (LONGER)  ← we want this
  Subarray k+1..i → length i - k  (shorter)

→ Store only on first encounter (else branch — never overwrite).
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Brute Force — O(n²) time, O(1) space
// ─────────────────────────────────────────────────────────
function longestZeroSumBrute(arr) {
    let maxLen = 0;
    for (let i = 0; i < arr.length; i++) {
        let sum = 0;
        for (let j = i; j < arr.length; j++) {
            sum += arr[j];
            if (sum === 0) maxLen = Math.max(maxLen, j - i + 1);
        }
    }
    return maxLen;
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Prefix Sum + HashMap — O(n) time, O(n) space ✅
// ─────────────────────────────────────────────────────────
function longestZeroSum(arr) {
    const prefixMap = new Map();

    // Seed: prefix sum 0 occurred at virtual index -1
    // Handles subarrays starting at index 0
    prefixMap.set(0, -1);

    let prefixSum = 0;
    let maxLen = 0;

    for (let i = 0; i < arr.length; i++) {
        prefixSum += arr[i];

        if (prefixMap.has(prefixSum)) {
            // Same prefix sum seen at prevIndex
            // arr[prevIndex+1 .. i] has sum 0
            const prevIndex = prefixMap.get(prefixSum);
            maxLen = Math.max(maxLen, i - prevIndex);
            // DO NOT overwrite — we want the earliest occurrence
        } else {
            // First time seeing this prefix sum → store it
            prefixMap.set(prefixSum, i);
        }
    }

    return maxLen;
}

console.log(longestZeroSum([15, -2, 2, -8, 1, 7, 10, 23])); // 5  ✅
console.log(longestZeroSum([1, -1, 3, -3, 2, -2]));          // 6  ✅
console.log(longestZeroSum([1, 2, 3]));                       // 0  ✅
console.log(longestZeroSum([0]));                             // 1  ✅
console.log(longestZeroSum([0, 0, 0]));                       // 3  ✅
console.log(longestZeroSum([-3, 3, -3, 3]));                  // 4  ✅
```

---

## Dry Run

```
arr = [15, -2, 2, -8, 1, 7, 10, 23],  prefixMap = {0: -1}

i=0: ps=15,  seen? NO  → store {15:0}
i=1: ps=13,  seen? NO  → store {13:1}
i=2: ps=15,  seen? YES → prevIdx=0, len=2-0=2, maxLen=2 (don't overwrite 15:0)
i=3: ps=7,   seen? NO  → store {7:3}
i=4: ps=8,   seen? NO  → store {8:4}
i=5: ps=15,  seen? YES → prevIdx=0, len=5-0=5, maxLen=5 ✅
i=6: ps=25,  seen? NO  → store {25:6}
i=7: ps=48,  seen? NO  → store {48:7}

Answer: 5  (arr[1..5] = [-2,2,-8,1,7], sum=0) ✅
```

---

## The Prefix Sum + HashMap Family

| Problem | What changes | LeetCode |
|---|---|---|
| **Longest subarray sum=0** | target=0, store first index | — |
| **Longest subarray sum=K** | look for `prefixSum-K` in map | #325 |
| **Count subarrays sum=K** | store frequency, not index | #560 |
| **Longest equal 0s and 1s** | map 0→-1, find sum=0 | #525 |
| **Subarray sum divisible by K** | store `prefixSum % K` | #974 |

### Subarray Sum = K (Count variant — LC #560)

```javascript
// Store FREQUENCY (not index) because we COUNT all subarrays
// Seed: {0: 1} (empty prefix counts once, not -1)
function subarraySum(nums, k) {
    const prefixCount = new Map();
    prefixCount.set(0, 1); // seed changes to frequency

    let prefixSum = 0, count = 0;

    for (const num of nums) {
        prefixSum += num;
        // How many previous prefix sums equal prefixSum - k?
        // Each gives one subarray ending here with sum k
        count += (prefixCount.get(prefixSum - k) || 0);
        prefixCount.set(prefixSum, (prefixCount.get(prefixSum) || 0) + 1);
    }

    return count;
}

console.log(subarraySum([1, 1, 1], 2)); // 2 ✅
console.log(subarraySum([1, 2, 3], 3)); // 2 ✅
```

---

## ⚠️ Critical Details

```
1. Seed {0: -1} before loop — NEVER forget this.
   Without it, subarrays starting at index 0 are missed.

2. Never overwrite in the map (else branch) — for longest subarray.
   Earlier index = longer subarray when prefix sum repeats.

3. For COUNT problems: use frequency map + seed {0: 1} instead.
   The distinction between length and count variants is a common
   interview follow-up question.
```

---

## Key Patterns & Takeaways

1. **Prefix Sum + HashMap = Swiss Army knife for subarrays** — `sum(i..j) = ps[j] - ps[i-1]`. Whenever you see "subarray sum = X", this is the tool.
2. **Seed `{0: -1}` before the loop** — the #1 implementation bug. Handles subarrays from index 0. Virtual index `-1` means "before the array".
3. **Store FIRST occurrence, never overwrite** — for longest subarray. First occurrence gives the longest possible subarray when the prefix sum repeats.
4. **Count vs. length distinction** — longest: `prefixSum → firstIndex`, seed `{0:-1}`. Counting: `prefixSum → frequency`, seed `{0:1}`. Know which you need before coding.
5. **Equal 0s and 1s** (LC #525) — map `0→-1`, then identical to zero-sum subarray. Pure reduction. Shows pattern generalisation.