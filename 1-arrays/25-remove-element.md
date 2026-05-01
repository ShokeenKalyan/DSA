# 43 - Remove Element

## Problem
**LeetCode:** [#27 Remove Element](https://leetcode.com/problems/remove-element/)  
**Difficulty:** Easy  
**Topic:** Arrays, Two Pointers

### Statement
Remove all occurrences of `val` in-place. Return `k` (count of non-val elements). First `k` positions must hold non-val elements. Order doesn't matter.

```
[3,2,2,3], val=3        →  k=2,  nums=[2,2,_,_]
[0,1,2,2,3,0,4,2], val=2 →  k=5, nums=[0,1,4,0,3,_,_,_]
```

---

## Two Approaches

**Read/Write:** scan forward, write non-val elements to `slow`. Simple, O(n) writes.  
**Two-Ends Swap:** replace val at `left` with last valid element (`right-1`), shrink `right`. Only O(k) writes where k = occurrences of val. Better when val is rare.

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Read/Write — stable, O(n) writes
// ─────────────────────────────────────────────────────────
function removeElementReadWrite(nums, val) {
    let slow = 0;
    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== val) nums[slow++] = nums[fast];
    }
    return slow;
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Two-Ends Swap — O(k) writes ✅
// Best when val is rare — minimises total writes
// Don't advance left after swap — swapped element unchecked
// ─────────────────────────────────────────────────────────
function removeElement(nums, val) {
    let left = 0;
    let right = nums.length; // One past last valid

    while (left < right) {
        if (nums[left] === val) {
            nums[left] = nums[right - 1]; // Replace with last valid
            right--;                       // Shrink valid range
            // Don't left++ — need to check nums[left] again
        } else {
            left++;
        }
    }

    return right; // right = k directly
}

let n1 = [3,2,2,3];       console.log(removeElement(n1, 3)); // 2 ✅
let n2 = [0,1,2,2,3,0,4,2]; console.log(removeElement(n2, 2)); // 5 ✅
let n3 = [2,2,2];          console.log(removeElement(n3, 2)); // 0 ✅
let n4 = [1,2,3];          console.log(removeElement(n4, 4)); // 3 ✅
```

---

## Dry Run — Two-Ends Swap

```
nums=[0,1,2,2,3,0,4,2], val=2, left=0, right=8

l=0: 0≠2 → l=1
l=1: 1≠2 → l=2
l=2: 2=2 → nums[2]=nums[7]=2, r=7  still val at 2
l=2: 2=2 → nums[2]=nums[6]=4, r=6  → left=3 (4≠2)
l=3: 2=2 → nums[3]=nums[5]=0, r=5  → left=4 (0≠2, after re-check)
l=4: 3≠2 → l=5
left(5)>=right(5) → STOP. k=5 ✅
```

---

## Complexity

| Approach | Time | Space | Writes |
|---|---|---|---|
| Read/Write | O(n) | O(1) | O(n) |
| **Two-Ends Swap** | **O(n)** | **O(1)** | **O(k)** |

---

## The Read/Write Family

| Problem | Write condition | Return |
|---|---|---|
| **Remove Element (P43)** | `!= val` | `slow` or `right` |
| **Move Zeroes (P40)** | `!= 0` | void |
| **Remove Duplicates (P35)** | `!= nums[slow-1]` | `slow` |
| **Sort by Parity (P41)** | `% 2 === 0` | `nums` |

---

## Key Patterns & Takeaways

1. **Read/Write vs Two-Ends** — order matters or val frequent → read/write. Order irrelevant and val rare → two-ends (O(k) writes).
2. **Don't advance left after swap** — swapped element from `right-1` hasn't been checked. Re-examine before moving left.
3. **`right` is the return value** — in two-ends approach, `right` directly equals `k`. No `slow+1` needed.
4. **val not in array** — gracefully returns `nums.length`. No special case.