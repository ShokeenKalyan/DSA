# 15 - Majority Element (> n/2 times) + Bonus: > n/3 times

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/find-the-majority-element-that-occurs-more-than-n-2-times) | [LeetCode #169](https://leetcode.com/problems/majority-element/) & [#229](https://leetcode.com/problems/majority-element-ii/)  
**Difficulty:** Medium  
**Topic:** Arrays, Boyer-Moore Voting Algorithm

### Statement
Given an array of `n` integers, find the element that appears **more than `n/2` times**. Majority element is guaranteed to exist.

```
Input:  [3, 2, 3]               →  3
Input:  [2, 2, 1, 1, 1, 2, 2]  →  2
```

---

## Approaches

| Approach | Time | Space | Notes |
|---|---|---|---|
| Brute Force | O(n²) | O(1) | Count each element |
| HashMap | O(n) | O(n) | Frequency map |
| **Boyer-Moore Voting** | **O(n)** | **O(1)** | One pass, no extra space |

---

## Boyer-Moore Voting Algorithm

**Intuition:** Imagine all elements "fighting" — different elements cancel each other out. The majority element (> n/2 votes) can **never be fully cancelled** because all other elements combined have fewer than n/2 votes. The majority element is always the last survivor.

```
Maintain: candidate + count ("vote health")

For each element:
  count === 0      → elect element as new candidate, count = 1
  element === cand → count++ (reinforce)
  element !== cand → count-- (cancel)

Final candidate = majority element ✅
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 2: HashMap — O(n) time, O(n) space
// ─────────────────────────────────────────────────────────
function majorityElementMap(nums) {
    const count = new Map();
    for (const num of nums) {
        count.set(num, (count.get(num) || 0) + 1);
        if (count.get(num) > Math.floor(nums.length / 2)) return num;
    }
    return -1;
}


// ─────────────────────────────────────────────────────────
// APPROACH 3: Boyer-Moore Voting — O(n) time, O(1) space ✅
// ─────────────────────────────────────────────────────────
function majorityElement(nums) {
    let candidate = null;
    let count = 0;

    for (const num of nums) {
        if (count === 0) {
            candidate = num; // No current champion — elect this one
            count = 1;
        } else if (num === candidate) {
            count++;         // Same team — reinforce
        } else {
            count--;         // Different — cancel one out
        }
    }

    return candidate; // Majority guaranteed → candidate is correct
}


// ─────────────────────────────────────────────────────────
// WITH VERIFICATION (when majority not guaranteed to exist)
// ─────────────────────────────────────────────────────────
function majorityElementVerified(nums) {
    let candidate = null, count = 0;

    for (const num of nums) {
        if (count === 0) { candidate = num; count = 1; }
        else if (num === candidate) count++;
        else count--;
    }

    // Verify: count actual frequency of candidate
    const freq = nums.filter(n => n === candidate).length;
    return freq > Math.floor(nums.length / 2) ? candidate : -1;
}

console.log(majorityElement([3, 2, 3]));              // 3 ✅
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // 2 ✅
console.log(majorityElement([1]));                    // 1 ✅
```

---

## Dry Run

```
nums = [2, 2, 1, 1, 1, 2, 2]

i=0: count=0 → elect 2,  c=2, cnt=1
i=1: num=2=c → reinforce, cnt=2
i=2: num=1≠c → cancel,    cnt=1
i=3: num=1≠c → cancel,    cnt=0
i=4: count=0 → elect 1,  c=1, cnt=1
i=5: num=2≠c → cancel,    cnt=0
i=6: count=0 → elect 2,  c=2, cnt=1

Final candidate: 2 ✅
```

---

## BONUS — Majority Element II: Elements > n/3 Times (LC #229)

At most **2** elements can appear > n/3 times (since `3 × ⌊n/3+1⌋ > n`). Maintain **two candidates** with Extended Boyer-Moore.

```javascript
/**
 * LC #229 — Majority Element II
 * Time: O(n) | Space: O(1)
 * Verification phase is MANDATORY here (unlike n/2 variant)
 */
function majorityElementII(nums) {
    let candidate1 = null, count1 = 0;
    let candidate2 = null, count2 = 0;

    // ── Phase 1: Find two surviving candidates ──────────────
    // IMPORTANT: Check equality BEFORE checking count === 0
    for (const num of nums) {
        if (num === candidate1) {
            count1++;
        } else if (num === candidate2) {
            count2++;
        } else if (count1 === 0) {
            candidate1 = num; count1 = 1;
        } else if (count2 === 0) {
            candidate2 = num; count2 = 1;
        } else {
            count1--; // Cancel one from each candidate
            count2--;
        }
    }

    // ── Phase 2: Verify both candidates ────────────────────
    // Boyer-Moore finds POTENTIAL candidates — must verify
    count1 = 0; count2 = 0;
    for (const num of nums) {
        if (num === candidate1) count1++;
        else if (num === candidate2) count2++;
    }

    const result = [];
    const threshold = Math.floor(nums.length / 3);
    if (count1 > threshold) result.push(candidate1);
    if (count2 > threshold) result.push(candidate2);

    return result;
}

console.log(majorityElementII([3, 2, 3]));                   // [3]    ✅
console.log(majorityElementII([1, 1, 1, 3, 3, 2, 2, 2]));   // [1, 2] ✅
console.log(majorityElementII([1, 2, 3]));                   // []     ✅
```

### Dry Run — Majority II
```
nums = [1,1,1,3,3,2,2,2], threshold=2

Phase 1:
i=0: c1=null,cnt1=0 → elect 1, c1=1,cnt1=1
i=1: num=1=c1 → cnt1=2
i=2: num=1=c1 → cnt1=3
i=3: c2=null,cnt2=0 → elect 3, c2=3,cnt2=1
i=4: num=3=c2 → cnt2=2
i=5: neither → cnt1=2, cnt2=1
i=6: neither → cnt1=1, cnt2=0
i=7: cnt2=0  → elect 2, c2=2,cnt2=1

Candidates: 1, 2

Phase 2: count(1)=3>2 ✅, count(2)=3>2 ✅
Result: [1, 2] ✅
```

---

## Key Patterns & Takeaways

1. **Boyer-Moore = cancellation game** — majority can't be cancelled because non-majority elements collectively have fewer votes. If you can explain this intuition clearly, you've nailed the problem.
2. **Verification step** — when majority isn't guaranteed, always add a second pass to verify. Critical correctness detail.
3. **The n/3 generalisation** — for majority > n/k, maintain k-1 candidates. For n/3 → 2 candidates; for n/4 → 3 candidates.
4. **Order in Phase 1 of n/3** — check `num === candidate` BEFORE checking `count === 0`. Otherwise a valid candidate gets incorrectly replaced.
5. **Verification is mandatory for n/3** — unlike the n/2 case, majority isn't guaranteed. Boyer-Moore finds potential survivors, not guaranteed winners.