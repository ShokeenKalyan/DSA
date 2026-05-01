# 69 - Peak Index in a Mountain Array

## Problem
**LeetCode:** [#852 Peak Index in a Mountain Array](https://leetcode.com/problems/peak-index-in-a-mountain-array/)  
**Difficulty:** Medium  
**Topic:** Arrays, Binary Search

### Statement
Given a guaranteed mountain array, return the peak index.

```
[0,1,0]     →  1
[0,2,1,0]   →  1
[3,4,5,1]   →  2
[0,1,2,3,1] →  3
```

---

## Intuition — Slope Direction Eliminates Half

```
arr[mid] < arr[mid+1] → ascending  → peak is RIGHT → lo = mid+1
arr[mid] > arr[mid+1] → descending → peak at mid or LEFT → hi = mid
```

Lower bound template: exits when `lo === hi` = peak index.

---

## Solution (JavaScript)

```javascript
// Binary Search — O(log n), O(1) ✅
function peakIndexInMountainArray(arr) {
    let lo = 0, hi = arr.length - 1;

    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (arr[mid] < arr[mid+1]) lo = mid + 1; // Ascending → go right
        else hi = mid;                             // Descending → stay or go left
    }

    return lo;
}

console.log(peakIndexInMountainArray([0,1,0]));      // 1 ✅
console.log(peakIndexInMountainArray([0,2,1,0]));    // 1 ✅
console.log(peakIndexInMountainArray([3,4,5,1]));    // 2 ✅
console.log(peakIndexInMountainArray([0,1,2,3,1]));  // 3 ✅
```

---

## Dry Run

```
arr=[0,10,5,2], lo=0, hi=3

mid=1: arr[1]=10>arr[2]=5 → descending → hi=1
mid=0: arr[0]=0<arr[1]=10 → ascending  → lo=1
lo===hi=1 → return 1 ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Linear | O(n) | O(1) |
| **Binary Search** | **O(log n)** | **O(1)** |

---

## Mountain Array vs Find Peak Element (LC #162)

| | This Problem | LC #162 |
|---|---|---|
| Array | Guaranteed one peak | Any array, multiple peaks ok |
| Answer | That one peak | Any valid peak |
| BS logic | Same slope comparison | Same template |

---

## Key Patterns & Takeaways

1. **Slope eliminates half** — ascending: go right. Descending: at mid or left. Classic binary search on implicit condition.
2. **Lower bound template** — `lo < hi`, `hi = mid`. Exits at `lo===hi` = peak. `hi = mid` because mid could be the peak.
3. **`hi = arr.length - 1`** — peak guaranteed within bounds. No need for `hi = n`.
4. **Same as Find Peak Element (LC #162)** — identical template. Difference: mountain = one peak; general = any peak.
5. **Connects to Longest Mountain (P57)** — same slope check `arr[i] < arr[i+1]` used for peak detection.