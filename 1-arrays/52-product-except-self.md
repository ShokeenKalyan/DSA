# 66 - Product of Array Except Self

## Problem
**LeetCode:** [#238 Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)  
**Difficulty:** Medium  
**Topic:** Arrays, Prefix Product

### Statement
Return array where `answer[i]` = product of all elements except `nums[i]`. O(n), no division.

```
[1,2,3,4]     →  [24,12,8,6]
[-1,1,0,-3,3] →  [0,0,9,0,0]
```

---

## Intuition — Left Products × Right Products

```
answer[i] = (product of nums[0..i-1]) × (product of nums[i+1..n-1])
              ↑ left prefix product        ↑ right suffix product
```

**Two passes:**
1. Left pass: fill `result[i]` with product of everything left of `i`
2. Right pass: multiply `result[i]` by running right product

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Two Arrays — O(n) time, O(n) space
// Explicit for clarity
// ─────────────────────────────────────────────────────────
function productExceptSelfTwoArrays(nums) {
    const n = nums.length;
    const left = new Array(n).fill(1);
    const right = new Array(n).fill(1);

    for (let i = 1; i < n; i++) left[i] = left[i-1] * nums[i-1];
    for (let i = n-2; i >= 0; i--) right[i] = right[i+1] * nums[i+1];

    return left.map((l, i) => l * right[i]);
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Space Optimised — O(n) time, O(1) extra space ✅
// Pass 1: result[i] = left product (everything left of i)
// Pass 2: multiply by right product using running variable
// ─────────────────────────────────────────────────────────
function productExceptSelf(nums) {
    const n = nums.length;
    const result = new Array(n).fill(1);

    // Pass 1: result[i] = product of nums[0..i-1]
    let leftProduct = 1;
    for (let i = 0; i < n; i++) {
        result[i] = leftProduct;  // Set BEFORE including nums[i]
        leftProduct *= nums[i];   // Include for next index
    }

    // Pass 2: multiply result[i] by product of nums[i+1..n-1]
    let rightProduct = 1;
    for (let i = n-1; i >= 0; i--) {
        result[i] *= rightProduct; // Multiply in right product
        rightProduct *= nums[i];   // Include for next (leftward) index
    }

    return result;
}

console.log(productExceptSelf([1,2,3,4]));     // [24,12,8,6]  ✅
console.log(productExceptSelf([-1,1,0,-3,3])); // [0,0,9,0,0]  ✅
console.log(productExceptSelf([2,3]));          // [3,2]         ✅
```

---

## Dry Run

```
nums=[1,2,3,4]

Pass 1 (left products):
  i=0: result[0]=1,  leftProduct=1
  i=1: result[1]=1,  leftProduct=2
  i=2: result[2]=2,  leftProduct=6
  i=3: result[3]=6,  leftProduct=24
  result=[1,1,2,6]

Pass 2 (right products):
  i=3: result[3]=6×1=6,   rightProduct=4
  i=2: result[2]=2×4=8,   rightProduct=12
  i=1: result[1]=1×12=12, rightProduct=24
  i=0: result[0]=1×24=24, rightProduct=24
  result=[24,12,8,6] ✅
```

---

## Complexity

| Approach | Time | Space | Notes |
|---|---|---|---|
| Two Arrays | O(n) | O(n) | Easy to understand |
| **Space Optimised** | **O(n)** | **O(1)** | Output array not counted |

---

## Why No Division?

Naive approach: total product ÷ `nums[i]`. Problems:
- Division disallowed by problem
- Breaks on zeros (can't divide by 0)

Left×right handles zeros naturally — any zero propagates correctly.

---

## Key Patterns & Takeaways

1. **Left pass × right pass** — canonical "operation except self" technique. Works for product, sum, XOR, min, max — any associative operation.
2. **Running variable = O(1) space** — instead of a full right-products array, one variable accumulated right-to-left. Classic space optimisation.
3. **Set result THEN update leftProduct** — order is critical. `result[i] = leftProduct` captures product up to but NOT including `i`. Then include `nums[i]` for the next index.
4. **No division needed** — prefix product handles zeros correctly. Always preferred over the division approach.
5. **Generalises broadly** — same left+right pass template for any prefix/suffix operation. Recognising this is a senior signal.