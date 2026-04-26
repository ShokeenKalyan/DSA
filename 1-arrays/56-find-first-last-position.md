# 70 - Find First and Last Position of Element in Sorted Array

## Problem
**LeetCode:** [#34 Find First and Last Position](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)  
**Difficulty:** Medium  
**Topic:** Arrays, Binary Search

### Statement
Return `[first, last]` indices of `target` in sorted `nums`. Return `[-1,-1]` if not found. O(log n).

```
[5,7,7,8,8,10], target=8  →  [3,4]
[5,7,7,8,8,10], target=6  →  [-1,-1]
[2,2,2,2],      target=2  →  [0,3]
```

---

## Two Approaches — Both O(log n)

| Approach | Intuition | Easier to... |
|---|---|---|
| **Save & Keep Searching** | On match, save pos and keep narrowing | Derive under pressure |
| **Lower/Upper Bound** | Two separate bound searches | Generalise to other problems |

---

## Approach 1 — Save & Keep Searching ✅ (Most Intuitive)

When `nums[mid] === target`, **save the position** then keep searching in the direction that could yield a better result:
- Finding **first**: go left (`r = mid - 1`) — maybe there's an earlier occurrence
- Finding **last**: go right (`l = mid + 1`) — maybe there's a later occurrence

```
binarySearch(nums, target, findFirst):
    l=0, r=n-1, pos=-1

    while l <= r:
        mid = (l+r) // 2
        if nums[mid] === target:
            pos = mid              ← save this occurrence
            if findFirst: r=mid-1  ← keep searching left for earlier
            else: l=mid+1          ← keep searching right for later
        else if nums[mid] < target: l=mid+1
        else: r=mid-1

    return pos   (-1 if never found)
```

**Why this works:** every time we find a match, we record it and then deliberately search in the direction that could yield a better (earlier/later) match. The loop continues until the search space is exhausted, at which point `pos` holds the best match found.

---

## Approach 2 — Lower Bound + Upper Bound

Lower bound: first `i` where `nums[i] >= target`  
Upper bound: first `i` where `nums[i] > target` → last = `upperBound - 1`

```
Only difference: < vs <=
  Lower: nums[mid] < target  → lo=mid+1   (finds first >=)
  Upper: nums[mid] <= target → lo=mid+1   (finds first >)
```

---

## Solution (JavaScript)

```javascript
/**
 * Find First and Last Position — LeetCode #34
 * Time: O(log n) — two binary searches | Space: O(1)
 */

// ─────────────────────────────────────────────────────────
// APPROACH 1: Save & Keep Searching — Most Intuitive ✅
// On match: save position, keep searching toward first or last
// findFirst=true  → go left  (r = mid-1) to find earlier occurrence
// findFirst=false → go right (l = mid+1) to find later occurrence
// ─────────────────────────────────────────────────────────
function binarySearch(nums, target, findFirst) {
    let l = 0, r = nums.length - 1;
    let pos = -1; // -1 means not found yet

    while (l <= r) {
        const mid = Math.floor((l + r) / 2);

        if (nums[mid] === target) {
            pos = mid;              // Found a match — record it
            if (findFirst) r = mid - 1; // Search left for earlier occurrence
            else           l = mid + 1; // Search right for later occurrence
        } else if (nums[mid] < target) {
            l = mid + 1;           // Target is to the right
        } else {
            r = mid - 1;           // Target is to the left
        }
    }

    return pos; // Best occurrence found, or -1
}

function searchRange(nums, target) {
    return [
        binarySearch(nums, target, true),  // Find first
        binarySearch(nums, target, false)  // Find last
    ];
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Lower Bound + Upper Bound
// More generalisable — foundation of range queries
// ─────────────────────────────────────────────────────────
function lowerBound(nums, target) {
    let lo = 0, hi = nums.length; // hi=n handles not-found
    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

function upperBound(nums, target) {
    let lo = 0, hi = nums.length;
    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (nums[mid] <= target) lo = mid + 1; // <= not < (only difference)
        else hi = mid;
    }
    return lo;
}

function searchRangeBounds(nums, target) {
    const first = lowerBound(nums, target);
    if (first === nums.length || nums[first] !== target) return [-1, -1];
    return [first, upperBound(nums, target) - 1];
}


// ── Test cases ──────────────────────────────────────────────
console.log(searchRange([5,7,7,8,8,10], 8));  // [3,4]   ✅
console.log(searchRange([5,7,7,8,8,10], 6));  // [-1,-1] ✅
console.log(searchRange([], 0));               // [-1,-1] ✅
console.log(searchRange([1], 1));              // [0,0]   ✅
console.log(searchRange([2,2,2,2], 2));        // [0,3]   ✅
console.log(searchRange([1,4], 4));            // [1,1]   ✅
```

---

## Dry Run — Save & Keep Searching

```
nums=[5,7,7,8,8,10], target=8

findFirst=true:
  l=0,r=5: mid=2, nums[2]=7<8 → l=3
  l=3,r=5: mid=4, nums[4]=8=8 → pos=4, go left: r=3
  l=3,r=3: mid=3, nums[3]=8=8 → pos=3, go left: r=2
  l=3>r=2 → STOP. pos=3 ✅

findFirst=false:
  l=0,r=5: mid=2, nums[2]=7<8 → l=3
  l=3,r=5: mid=4, nums[4]=8=8 → pos=4, go right: l=5
  l=5,r=5: mid=5, nums[5]=10>8 → r=4
  l=5>r=4 → STOP. pos=4 ✅

return [3,4] ✅
```

---

## Dry Run — Lower/Upper Bound

```
nums=[5,7,7,8,8,10], target=8

lowerBound(8): lo=0, hi=6
  mid=3: nums[3]=8>=8 → hi=3
  mid=1: nums[1]=7<8  → lo=2
  mid=2: nums[2]=7<8  → lo=3
  lo===hi=3. nums[3]=8 ✓ → first=3

upperBound(8): lo=0, hi=6
  mid=3: nums[3]=8<=8 → lo=4
  mid=5: nums[5]=10>8 → hi=5
  mid=4: nums[4]=8<=8 → lo=5
  lo===hi=5 → last=5-1=4

return [3,4] ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(log n) — 2 binary searches |
| Space | O(1) |

---

## Comparing the Two Approaches

| | Save & Keep Searching | Lower/Upper Bound |
|---|---|---|
| **Intuition** | "Found it — save it and look for better" | "Find boundary positions" |
| **Derive under pressure** | ✅ Easier | Slightly trickier |
| **Handles not-found** | Built-in (`pos=-1`) | Needs post-loop validation |
| **Generalisability** | This problem specifically | Powers all range queries |
| **Template** | Template 1 (`lo <= hi`) + save | Template 2 (`lo < hi`) |

Both are O(log n) and O(1) space. Choose based on what you can derive most confidently.

---

## The One-Character Difference (Lower/Upper Bound)

```
Lower: nums[mid] <  target → go right  (first >=)
Upper: nums[mid] <= target → go right  (first >)

< vs <= is the entire difference.
```

---

## Binary Search Family

| Problem | Uses | Key condition |
|---|---|---|
| **Search Insert (P67)** | Lower bound | `nums[mid] < target` |
| **Find First (P70)** | Lower bound OR save+search | `nums[mid] < target` / `findFirst` |
| **Find Last (P70)** | Upper bound-1 OR save+search | `nums[mid] <= target` / `!findFirst` |
| **Peak Index (P69)** | Lower bound on slope | `arr[mid] < arr[mid+1]` |

---

## Key Patterns & Takeaways

1. **Save & Keep Searching = most derivable** — on match, record `pos` and continue searching left (for first) or right (for last). Natural translation of the problem statement into code.
2. **Lower + upper bound = most generalisable** — `<` vs `<=` is the only difference. Foundation of all range queries on sorted arrays.
3. **`pos = -1` default** — save & search handles not-found automatically. No post-loop validation needed.
4. **Validate after lower bound** — `nums[first] !== target` check needed since lower bound returns a position that may not contain target.
5. **Choose what you can derive** — both approaches are equally valid. In an interview, lead with whichever you can explain from first principles most confidently.