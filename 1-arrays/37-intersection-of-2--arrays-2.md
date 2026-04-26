# 51 - Intersection of Two Arrays II

## Problem
**LeetCode:** [#350 Intersection of Two Arrays II](https://leetcode.com/problems/intersection-of-two-arrays-ii/)  
**Difficulty:** Easy  
**Topic:** Arrays, Hashing, Two Pointers, Sorting

### Statement
Return intersection where each element appears **as many times as it appears in both arrays**.

```
[1,2,2,1], [2,2]        →  [2,2]
[4,9,5],   [9,4,9,8,4]  →  [4,9]
```

Result count for each value = `min(freq in nums1, freq in nums2)`.

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: HashMap — O(m+n) time, O(min(m,n)) space ✅
// Build freq map from smaller array, consume from larger
// ─────────────────────────────────────────────────────────
function intersect(nums1, nums2) {
    // Always build map from the smaller array
    if (nums1.length > nums2.length) return intersect(nums2, nums1);

    const freq = new Map();
    for (const num of nums1)
        freq.set(num, (freq.get(num) || 0) + 1);

    const result = [];
    for (const num of nums2) {
        if (freq.get(num) > 0) {
            result.push(num);
            freq.set(num, freq.get(num) - 1); // Consume one occurrence
        }
    }

    return result;
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Sort + Two Pointer — O(m log m + n log n), O(1)
// Best when arrays already sorted — no dedup needed unlike I
// ─────────────────────────────────────────────────────────
function intersectSorted(nums1, nums2) {
    nums1.sort((a,b)=>a-b); nums2.sort((a,b)=>a-b);
    const result = [];
    let i=0, j=0;

    while (i < nums1.length && j < nums2.length) {
        if (nums1[i] === nums2[j]) {
            result.push(nums1[i]); // Push every match (no dedup)
            i++; j++;
        } else if (nums1[i] < nums2[j]) i++;
        else j++;
    }
    return result;
}

console.log(intersect([1,2,2,1], [2,2]));      // [2,2] ✅
console.log(intersect([4,9,5], [9,4,9,8,4]));  // [4,9] ✅
console.log(intersect([3,1,2], [1,1,2]));       // [1,2] ✅
```

---

## Dry Run — HashMap

```
nums1=[1,2,2,1], nums2=[2,2]

freq = {1:2, 2:2}

num=2: freq[2]=2>0 → push 2, freq[2]=1.  result=[2]
num=2: freq[2]=1>0 → push 2, freq[2]=0.  result=[2,2]

Return [2,2] ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| **HashMap** | **O(m+n)** | **O(min(m,n))** |
| Sort + Two Pointer | O(m log m + n log n) | O(1) |

---

## Follow-up Questions

```
Q1: Arrays already sorted?
A:  Use two-pointer directly — O(m+n), skip sort overhead.

Q2: nums1 much smaller than nums2?
A:  Build map from nums1 — space O(|nums1|).
    The swap trick enforces this automatically.

Q3: nums2 too large for memory?
A:  Build map from nums1 (fits in RAM).
    Stream nums2 one element at a time — never fully loaded.
    Senior-level answer that shows real-world awareness.
```

---

## I vs II Comparison

| | Intersection I (#349) | Intersection II (#350) |
|---|---|---|
| Result | Unique only | Min frequency |
| Data structure | Set | HashMap (freq count) |
| Two-pointer | Skip duplicates | Push every match |

---

## Key Patterns & Takeaways

1. **`min(freq1, freq2)`** — result count per value. HashMap consume-and-decrement implements this naturally.
2. **Build from smaller, iterate larger** — minimises space. Swap trick enforces automatically.
3. **Decrement not delete** — `freq.set(num, freq.get(num)-1)`. Check `> 0` handles exhausted keys cleanly.
4. **Two-pointer simpler than I** — no dedup needed. Push every match directly.
5. **Streaming follow-up** — stream nums2 against HashMap of nums1. The senior-level answer that shows production thinking.