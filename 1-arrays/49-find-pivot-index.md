# 63 - Find Pivot Index

## Problem
**LeetCode:** [#724 Find Pivot Index](https://leetcode.com/problems/find-pivot-index/)  
**Difficulty:** Easy  
**Topic:** Arrays, Prefix Sum

### Statement
Return the leftmost index where left sum equals right sum (pivot not included in either). Return -1 if none.

```
[1,7,3,6,5,6]  →  3   (left=11, right=11)
[1,2,3]         →  -1
[2,1,-1]        →  0   (left=0, right=0)
```

---

## Intuition — Total Sum + Running Left Sum

```
rightSum = totalSum - leftSum - nums[i]
If leftSum === rightSum → pivot found
```

No extra array. Single pass after computing total. O(1) space.

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #724 — Find Pivot Index
 * Time: O(n) | Space: O(1)
 */
function pivotIndex(nums) {
    const totalSum = nums.reduce((acc, n) => acc + n, 0);
    let leftSum = 0;

    for (let i = 0; i < nums.length; i++) {
        const rightSum = totalSum - leftSum - nums[i];
        if (leftSum === rightSum) return i;
        leftSum += nums[i]; // Update AFTER check — pivot not in left sum
    }

    return -1;
}

console.log(pivotIndex([1,7,3,6,5,6]));      // 3  ✅
console.log(pivotIndex([1,2,3]));             // -1 ✅
console.log(pivotIndex([2,1,-1]));            // 0  ✅
console.log(pivotIndex([1]));                 // 0  ✅
```

---

## Dry Run

```
nums=[1,7,3,6,5,6], total=28

i=0: right=28-0-1=27, 0≠27. left=1
i=1: right=28-1-7=20, 1≠20. left=8
i=2: right=28-8-3=17, 8≠17. left=11
i=3: right=28-11-6=11, 11=11 → return 3 ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute Force | O(n²) | O(1) |
| **Total + Scan** | **O(n)** | **O(1)** |

---

## Key Patterns & Takeaways

1. **`rightSum = total - leftSum - nums[i]`** — core one-liner. Classic prefix sum avoidance.
2. **Check BEFORE updating leftSum** — current element is not part of left sum at its own index.
3. **Empty sum is 0** — index 0 (left=0) and index n-1 (right=0) handled naturally.
4. **Leftmost** — first return gives leftmost. Scan right-to-left for rightmost.
5. **Negative numbers work** — equality check is always correct regardless of sign.