# 57 - Longest Mountain in Array

## Problem
**LeetCode:** [#845 Longest Mountain in Array](https://leetcode.com/problems/longest-mountain-in-array/)  
**Difficulty:** Medium  
**Topic:** Arrays, Two Pointers, Greedy

### Statement
Return length of longest mountain subarray (strictly up then strictly down, length ≥ 3).

```
[2,1,4,7,3,2,5]   →  5  ([1,4,7,3,2])
[2,2,2]            →  0  (not strictly increasing)
[0,1,2,3,4,5,4,3] →  8  (whole array)
```

---

## Approaches

| Approach | Time | Space |
|---|---|---|
| Two Pass (up/down arrays) | O(n) | O(n) |
| **One Pass (expand from peak)** | **O(n)** | **O(1)** |

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Two Pass — O(n) time, O(n) space
// up[i] = strictly increasing run ending at i
// down[i] = strictly decreasing run starting at i
// Valid peak: up[i]>0 AND down[i]>0
// ─────────────────────────────────────────────────────────
function longestMountainTwoPass(arr) {
    const n = arr.length;
    if (n < 3) return 0;

    const up = new Array(n).fill(0);
    for (let i = 1; i < n; i++)
        if (arr[i] > arr[i-1]) up[i] = up[i-1] + 1;

    const down = new Array(n).fill(0);
    for (let i = n-2; i >= 0; i--)
        if (arr[i] > arr[i+1]) down[i] = down[i+1] + 1;

    let maxLen = 0;
    for (let i = 1; i < n-1; i++)
        if (up[i] > 0 && down[i] > 0)
            maxLen = Math.max(maxLen, up[i] + down[i] + 1);

    return maxLen;
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: One Pass — O(n) time, O(1) space ✅
// Find each peak, expand left/right, jump past processed mountain
// ─────────────────────────────────────────────────────────
function longestMountain(arr) {
    const n = arr.length;
    let maxLen = 0;
    let i = 1;

    while (i < n - 1) {
        if (arr[i-1] < arr[i] && arr[i] > arr[i+1]) {
            // Found a peak — expand both sides
            let left = i - 1;
            while (left > 0 && arr[left-1] < arr[left]) left--;

            let right = i + 1;
            while (right < n-1 && arr[right] > arr[right+1]) right++;

            maxLen = Math.max(maxLen, right - left + 1);
            i = right; // Jump past this mountain — no overlap possible
        } else {
            i++;
        }
    }

    return maxLen;
}

console.log(longestMountain([2,1,4,7,3,2,5]));    // 5 ✅
console.log(longestMountain([2,2,2]));              // 0 ✅
console.log(longestMountain([0,1,2,3,4,5,4,3]));  // 8 ✅
console.log(longestMountain([0,1,0]));              // 3 ✅
console.log(longestMountain([1,3,2,4,7,3,1,2]));  // 5 ✅
```

---

## Dry Run

```
arr=[2,1,4,7,3,2,5]

Two Pass:
  up  = [0,0,1,2,0,0,1]
  down= [0,0,0,2,1,0,0]
  i=3: up=2>0, down=2>0 → len=5 ✅

One Pass:
  i=3: arr[2]=4<arr[3]=7>arr[4]=3 → PEAK
  Expand left: left=1 (arr[1]<arr[2]<arr[3])
  Expand right: right=5 (arr[3]>arr[4]>arr[5])
  len=5-1+1=5, jump i=5 → done ✅
```

---

## Edge Cases

| Input | Output | Why |
|---|---|---|
| `[2,2,2]` | 0 | Not strictly increasing |
| `[1,2,3]` | 0 | No descent |
| `[3,2,1]` | 0 | No ascent |
| `[0,1,0]` | 3 | Minimum mountain |

---

## Key Patterns & Takeaways

1. **Peak: `arr[i-1] < arr[i] > arr[i+1]`** — strictly less than both neighbours. Standard peak detection.
2. **Jump `i = right`** — no valid mountain can overlap from inside a processed one. Skip forward.
3. **Two-pass `up[i]>0 AND down[i]>0`** — cleanly validates a peak has both sides. Reusable pattern in Longest Turbulent Subarray, Trapping Rainwater.
4. **Strictly increasing/decreasing** — equal neighbours break the mountain. Use `>` not `>=`.
5. **Two-pass arrays as building blocks** — precomputing runs from both directions is reusable across many array problems.