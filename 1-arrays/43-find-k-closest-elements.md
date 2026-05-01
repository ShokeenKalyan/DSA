# 61 - Find K Closest Elements

## Problem
**LeetCode:** [#658 Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements/)  
**Difficulty:** Medium  
**Topic:** Arrays, Binary Search, Sliding Window, Two Pointers

### Statement
Return `k` closest elements to `x` from a sorted array, in sorted order. Ties prefer the smaller element.

```
[1,2,3,4,5], k=4, x=3   →  [1,2,3,4]
[1,2,3,4,5], k=4, x=-1  →  [1,2,3,4]
[1,2,3,4,5], k=4, x=6   →  [2,3,4,5]
[1,3,5,7,9], k=2, x=4   →  [3,5]
```

---

## Approaches

| Approach | Time | Space | Notes |
|---|---|---|---|
| Sort by distance | O(n log n) | O(n) | Simple but slow |
| **Shrinking Window** | **O(n)** | **O(1)** | Most intuitive to derive |
| **Binary Search** | **O(log(n-k)+k)** | **O(1)** | Optimal for large n |

---

## Approach 2 — Shrinking Window (Most Intuitive) ✅

**Intuition:** Start with the full array as the window. At each step, eliminate the element **farther from x** — leftmost or rightmost. Repeat until exactly `k` elements remain.

```
while (right - left + 1) > k:
    if x - arr[left] > arr[right] - x:
        left++   ← left is farther, remove it
    else:
        right--  ← right is farther or equal, remove it
return arr[left..right+1]
```

**Why this works:** always eliminates the least useful element. After n-k steps, exactly the k closest remain.

**Tie-breaking:** equal distances → `else` branch → `right--` → smaller (left) element kept ✅

---

## Approach 3 — Binary Search on Window Start

**Intuition:** Binary search for the **optimal starting index** of the k-window.

```
hi = arr.length - k   ← last valid start (window [lo..lo+k-1] must fit in array)

if x - arr[mid] > arr[mid+k] - x:
    lo = mid + 1      ← left edge farther → slide window right
else:
    hi = mid          ← right edge farther or equal → keep/slide left
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 2: Shrinking Window — O(n) time, O(1) space ✅
// Start with full array, eliminate the farther end each step
// ─────────────────────────────────────────────────────────
function findClosestElementsShrink(arr, k, x) {
    let left = 0, right = arr.length - 1;

    while (right - left + 1 > k) {
        if (x - arr[left] > arr[right] - x) {
            left++;  // Left edge farther → eliminate left
        } else {
            right--; // Right edge farther or equal → eliminate right
                     // (equal: prefer smaller/left → remove right)
        }
    }

    return arr.slice(left, right + 1);
}


// ─────────────────────────────────────────────────────────
// APPROACH 3: Binary Search on Window Start — O(log(n-k)+k)
// hi = n-k because window [mid..mid+k-1] must fit (prevents arr[mid+k] OOB)
// ─────────────────────────────────────────────────────────
function findClosestElements(arr, k, x) {
    let lo = 0, hi = arr.length - k;

    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1;
        else hi = mid;
    }

    return arr.slice(lo, lo + k);
}

// Tests
console.log(findClosestElementsShrink([1,2,3,4,5], 4, 3));  // [1,2,3,4] ✅
console.log(findClosestElementsShrink([1,2,3,4,5], 4, -1)); // [1,2,3,4] ✅
console.log(findClosestElementsShrink([1,2,3,4,5], 4, 6));  // [2,3,4,5] ✅
console.log(findClosestElementsShrink([1,3,5,7,9], 2, 4));  // [3,5]     ✅

console.log(findClosestElements([1,2,3,4,5], 4, 3));         // [1,2,3,4] ✅
console.log(findClosestElements([1,3,5,7,9], 2, 4));         // [3,5]     ✅
```

---

## Dry Run — Shrinking Window

```
arr=[1,3,5,7,9], k=2, x=4, left=0, right=4

size=5>2: x-arr[0]=4-1=3, arr[4]-x=9-4=5 → 3>5? NO  → right=3  [1,3,5,7]
size=4>2: x-arr[0]=4-1=3, arr[3]-x=7-4=3 → 3>3? NO  → right=2  [1,3,5]
size=3>2: x-arr[0]=4-1=3, arr[2]-x=5-4=1 → 3>1? YES → left=1   [3,5]

size=2=k → return [3,5] ✅


arr=[1,2,3,4,5], k=4, x=3, left=0, right=4

size=5>4: x-arr[0]=3-1=2, arr[4]-x=5-3=2 → 2>2? NO → right=3  [1,2,3,4]

size=4=k → return [1,2,3,4] ✅  (tie: right removed, smaller kept)
```

---

## Dry Run — Binary Search

```
arr=[1,3,5,7,9], k=2, x=4, lo=0, hi=3

mid=1: x-arr[1]=4-3=1, arr[3]-x=7-4=3 → 1>3? NO → hi=1
mid=0: x-arr[0]=4-1=3, arr[2]-x=5-4=1 → 3>1? YES → lo=1
lo===hi=1 → arr[1..2]=[3,5] ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Sort | O(n log n) | O(n) |
| **Shrinking Window** | **O(n)** | **O(1)** |
| **Binary Search** | **O(log(n-k)+k)** | **O(1)** |

---

## Tie-Breaking — Both Approaches Use `>` Not `>=`

```
Condition: x - arr[left] > arr[right] - x

Equal distances → condition FALSE → right-- (shrink) or hi=mid (BS)
→ Left (smaller) element kept ✅

Using >= on equal → left++ (or lo=mid+1)
→ Right (larger) element kept ❌ Wrong
```

---

## When to Use Which

```
Interview (easy to explain)  → Shrinking Window
Large n, small k             → Binary Search (O(log n) vs O(n))
```

---

## Key Patterns & Takeaways

1. **Shrinking window = most intuitive** — start full, eliminate farther end each step. Easy to derive from scratch under pressure. Great for interviews.
2. **Binary search = faster** — O(log(n-k)) search. `hi = n-k` prevents `arr[mid+k]` out of bounds.
3. **Same core comparison** — `x - arr[left] > arr[right] - x` drives both algorithms. One shrinks, the other jumps.
4. **`>` not `>=`** — ties prefer smaller (left) element. Strict greater-than preserves left on equal distances.
5. **No absolute values** — comparison works even when negative (x outside array range). Negative means x is beyond that side — other side is always closer.