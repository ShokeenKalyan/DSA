# 54 - Squares of a Sorted Array

## Problem
**LeetCode:** [#977 Squares of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array/)  
**Difficulty:** Easy  
**Topic:** Arrays, Two Pointers, Sorting

### Statement
Return squares of a sorted array in non-decreasing order.

```
[-4,-1,0,3,10]  →  [0,1,9,16,100]
[-7,-3,2,3,11]  →  [4,9,9,49,121]
```

---

## Intuition — Largest Squares at Both Ends

Original array sorted → **largest absolute values (and squares) are always at the two ends**. Use two pointers from both ends, fill result array **from back to front** (largest square placed first).

```
[-4,-1,0,3,10]
  ↑          ↑
 left       right   → compare |left| vs |right|, place larger at pos--
```

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #977 — Squares of a Sorted Array
 * Time: O(n) | Space: O(n)
 */
function sortedSquares(nums) {
    const n = nums.length;
    const result = new Array(n);
    let left = 0, right = n - 1, pos = n - 1;

    while (left <= right) {
        const leftSq  = nums[left]  * nums[left];
        const rightSq = nums[right] * nums[right];

        if (leftSq >= rightSq) {
            result[pos] = leftSq;
            left++;
        } else {
            result[pos] = rightSq;
            right--;
        }
        pos--;
    }

    return result;
}

console.log(sortedSquares([-4,-1,0,3,10])); // [0,1,9,16,100] ✅
console.log(sortedSquares([-7,-3,2,3,11])); // [4,9,9,49,121] ✅
console.log(sortedSquares([-3,-2,-1]));      // [1,4,9]        ✅
console.log(sortedSquares([0,1,2,3]));       // [0,1,4,9]      ✅
```

---

## Dry Run

```
[-4,-1,0,3,10], left=0,right=4,pos=4

16 vs 100 → 100 wins → result[4]=100, right=3, pos=3
16 vs 9   → 16 wins  → result[3]=16,  left=1,  pos=2
1  vs 9   → 9 wins   → result[2]=9,   right=2, pos=1
1  vs 0   → 1 wins   → result[1]=1,   left=2,  pos=0
left==right: 0        → result[0]=0

[0,1,9,16,100] ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute (square + sort) | O(n log n) | O(n) |
| **Two Pointer** | **O(n)** | **O(n)** |

---

## Key Patterns & Takeaways

1. **Largest values at ends** — sorted array → max absolute values always at `left` or `right`. Fill from back with the larger square each step.
2. **Fill back to front** — we always place the current maximum. Backwards filling is natural for "largest first" placement.
3. **`>=` on tie** — take from left when equal. Either side is correct — just be consistent.
4. **All-negative/positive** — handled naturally. All-negative: left always wins, moves right. All-positive: right always wins, moves left.
5. **Same pattern as merging** — compare from both ends, place into result. Connects to Merge Two Sorted Lists (P25) and the merge step of merge sort.