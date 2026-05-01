# 45 - Rotate Array

## Problem
**LeetCode:** [#189 Rotate Array](https://leetcode.com/problems/rotate-array/)  
**Difficulty:** Medium  
**Topic:** Arrays, Two Pointers, Reverse Trick

### Statement
Rotate array to the **right** by `k` steps in-place.

```
[1,2,3,4,5,6,7], k=3  →  [5,6,7,1,2,3,4]
[-1,-100,3,99],  k=2  →  [3,99,-1,-100]
[1,2,3],         k=4  →  [3,1,2]  (k%3=1)
```

---

## Intuition — The Reverse Trick

Rotating right by `k` = three reversals:

```
Step 1: Reverse entire array
Step 2: Reverse first k elements
Step 3: Reverse remaining n-k elements
```

**Why?** Reversing the whole array puts the last `k` elements at the front but backwards. Step 2 fixes their order. Step 3 fixes the original prefix order.

**Always normalise `k = k % n` first** — same as Rotate LL (P37).

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Extra Array — O(n) time, O(n) space
// ─────────────────────────────────────────────────────────
function rotateExtraArray(nums, k) {
    const n = nums.length;
    k = k % n;
    const result = new Array(n);
    for (let i = 0; i < n; i++) result[(i + k) % n] = nums[i];
    for (let i = 0; i < n; i++) nums[i] = result[i];
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Reverse Trick — O(n) time, O(1) space ✅
// ─────────────────────────────────────────────────────────
function rotate(nums, k) {
    const n = nums.length;
    k = k % n;
    if (k === 0) return;

    function reverse(left, right) {
        while (left < right) {
            [nums[left], nums[right]] = [nums[right], nums[left]];
            left++;
            right--;
        }
    }

    reverse(0, n - 1); // Step 1: reverse entire array
    reverse(0, k - 1); // Step 2: reverse first k
    reverse(k, n - 1); // Step 3: reverse last n-k
}

const t1 = [1,2,3,4,5,6,7]; rotate(t1, 3); console.log(t1); // [5,6,7,1,2,3,4] ✅
const t2 = [-1,-100,3,99];  rotate(t2, 2); console.log(t2); // [3,99,-1,-100]  ✅
const t3 = [1,2,3];          rotate(t3, 4); console.log(t3); // [3,1,2]          ✅
```

---

## Dry Run

```
[1,2,3,4,5,6,7], k=3

reverse(0,6) → [7,6,5,4,3,2,1]
reverse(0,2) → [5,6,7,4,3,2,1]  ← first k=3 fixed
reverse(3,6) → [5,6,7,1,2,3,4]  ← last n-k=4 fixed ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Extra Array | O(n) | O(n) |
| **Reverse Trick** | **O(n)** | **O(1)** |

---

## Connection to Rotate LL (P37)

Both need `k % n` normalisation. Array uses reverse trick (random access). LL uses circular cut-and-reconnect (sequential access). Same logical operation, different implementation based on DS constraints.

**Left rotation** → `k = n - k`, then apply same three-reverse algorithm.

---

## Key Patterns & Takeaways

1. **`k % n` first — always** — rotating by n is a no-op. Mandatory before anything else.
2. **Three reverses** — entire → first k → last n-k. Easy to memorise and verify.
3. **Why it works** — whole reverse puts last k at front backwards. Step 2 fixes their order. Step 3 fixes prefix order.
4. **Generalises to string rotation** — same three-reverse trick works for any reversible sequence.
5. **Left rotation** — right rotate by `n - k`. Same algorithm, substitute k.