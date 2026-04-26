# 46 - Pancake Sorting

## Problem
**LeetCode:** [#969 Pancake Sorting](https://leetcode.com/problems/pancake-sorting/)  
**Difficulty:** Medium  
**Topic:** Arrays, Sorting, Simulation

### Statement
Sort an array using only **pancake flips** (reverse first `k` elements). Return any valid sequence of flip sizes. Length must be ≤ `10 * arr.length`.

```
[3,2,4,1]  →  [4,2,4,3]  (one valid answer)
[1,2,3]    →  []          (already sorted)
```

---

## Intuition — Selection Sort with 2 Flips per Round

For each size from n down to 2, place the largest unsorted element at its correct position:

```
1. Find index of max in arr[0..size-1]
2. If already at size-1: skip (0 flips)
3. If not at front: flip(maxIdx+1) → bring to front (1 flip)
4. flip(size) → move from front to correct position (1 flip)

At most 2 flips per element → total ≤ 2(n-1) ≤ 10n ✅
```

---

## Solution (JavaScript)

```javascript
/**
 * Pancake Sorting — LeetCode #969
 * Time: O(n²) | Space: O(n)
 */
function pancakeSort(arr) {
    const result = [];
    const n = arr.length;

    function flip(k) {
        let left = 0, right = k - 1;
        while (left < right) {
            [arr[left], arr[right]] = [arr[right], arr[left]];
            left++; right--;
        }
    }

    for (let size = n; size >= 2; size--) {
        // Find index of max in arr[0..size-1]
        let maxIdx = 0;
        for (let i = 1; i < size; i++) {
            if (arr[i] > arr[maxIdx]) maxIdx = i;
        }

        if (maxIdx === size - 1) continue; // Already in place — skip

        if (maxIdx !== 0) {
            // Bring max to front
            flip(maxIdx + 1);
            result.push(maxIdx + 1);
        }

        // Send max from front to correct position
        flip(size);
        result.push(size);
    }

    return result;
}

// Verify helper
function verify(original, flips) {
    const arr = [...original];
    for (const k of flips) {
        let l = 0, r = k - 1;
        while (l < r) { [arr[l], arr[r]] = [arr[r], arr[l]]; l++; r--; }
    }
    return arr.every((v, i, a) => i === 0 || a[i-1] <= v);
}

const t1 = [3,2,4,1]; console.log(verify(t1, pancakeSort([...t1]))); // true ✅
const t2 = [1,2,3];   console.log(pancakeSort([...t2]));              // []   ✅
```

---

## Dry Run

```
arr=[3,2,4,1]

size=4: max=4 at idx=2
  flip(3)→[4,2,3,1], push 3
  flip(4)→[1,3,2,4], push 4

size=3: max=3 at idx=1
  flip(2)→[3,1,2,4], push 2
  flip(3)→[2,1,3,4], push 3

size=2: max=2 at idx=0 (already at front)
  flip(2)→[1,2,3,4], push 2

Result: [3,4,2,3,2] → verifies to sorted ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(n²) — n rounds × O(n) per round |
| Space | O(n) — result array |
| Max flips | 2(n-1) ≤ 10n ✅ |

---

## Key Details

```
1. Skip if maxIdx === size-1: already in place, no flips needed
2. Skip step 3 if maxIdx === 0: already at front, one flip suffices
3. flip(maxIdx+1) not flip(maxIdx):
   Reversing arr[0..maxIdx] has size maxIdx+1
4. Always write a verify() function — any valid answer accepted,
   so testing catches off-by-one bugs quickly
```

---

## Key Patterns & Takeaways

1. **Selection sort + restricted operation** — when only one operation is allowed, ask how to simulate selection sort with it. Find max → bring to front → send to end. General approach for restricted sorting.
2. **Two flips per element** — at most 2(n-1) total flips. State this bound explicitly — it satisfies the ≤ 10n constraint with room to spare.
3. **"Bring to front, send to position"** — a general two-step technique for restricted reversal sorting. Appears in similar constraint-based sorting problems.
4. **Skip optimisations** — check `maxIdx === size-1` (in place) and `maxIdx === 0` (already at front) before doing unnecessary flips.
5. **Verify with helper** — since any valid sequence is accepted, a verify function is essential for catching off-by-one errors during development.