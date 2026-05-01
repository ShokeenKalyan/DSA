# 50 - Intersection of Two Arrays

## Problem
**LeetCode:** [#349 Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays/)  
**Difficulty:** Easy  
**Topic:** Arrays, Hashing, Two Pointers, Sorting

### Statement
Return unique elements that appear in **both** arrays. No duplicates in result.

```
[1,2,2,1], [2,2]        →  [2]
[4,9,5],   [9,4,9,8,4]  →  [9,4]
```

---

## Solution (JavaScript)

```javascript
// Two Sets — O(m+n) time, O(m+n) space
function intersectionSets(nums1, nums2) {
    const set1 = new Set(nums1);
    const result = new Set();
    for (const num of nums2) {
        if (set1.has(num)) result.add(num);
    }
    return [...result];
}

// Sort + Two Pointer — O(m log m + n log n) time, O(1) space
function intersectionTwoPointer(nums1, nums2) {
    nums1.sort((a,b)=>a-b); nums2.sort((a,b)=>a-b);
    const result = [];
    let i=0, j=0;
    while (i < nums1.length && j < nums2.length) {
        if (nums1[i] === nums2[j]) {
            if (!result.length || result[result.length-1] !== nums1[i])
                result.push(nums1[i]);
            i++; j++;
        } else if (nums1[i] < nums2[j]) i++;
        else j++;
    }
    return result;
}

// One-liner ✅
const intersection = (nums1, nums2) => {
    const set2 = new Set(nums2);
    return [...new Set(nums1.filter(n => set2.has(n)))];
};

console.log(intersection([1,2,2,1], [2,2]));       // [2]    ✅
console.log(intersection([4,9,5], [9,4,9,8,4]));   // [9,4]  ✅
console.log(intersection([1,2,3], [4,5,6]));        // []     ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Two Sets | O(m+n) | O(m+n) |
| Sort + Two Pointer | O(m log m + n log n) | O(1) |

---

## I vs II — Know the Difference

| Problem | Result | LeetCode |
|---|---|---|
| **Intersection I** (this) | Unique elements only | #349 |
| **Intersection II** (next) | Respects frequency | #350 |

```
nums1=[1,2,2,1], nums2=[2,2]
I  → [2]     (unique)
II → [2,2]   (two 2s in both)
```

---

## Key Patterns & Takeaways

1. **Two Sets = O(m+n)** — build Set from smaller array, filter larger. Result Set auto-deduplicates.
2. **Sort + Two Pointer = O(1) space** — when input modification allowed and space constrained.
3. **I vs II distinction** — I uses Set (dedup). II uses HashMap (frequency count). Know both cold.
4. **Build Set from smaller array** — always iterate the larger array against the smaller Set for better performance.