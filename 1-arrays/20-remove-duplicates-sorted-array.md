# 35 - Remove Duplicates In-Place from Sorted Array

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/remove-duplicates-in-place-from-sorted-array) | [LeetCode #26](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)  
**Difficulty:** Easy  
**Topic:** Arrays, Two Pointers

### Statement
Given a **sorted** array, remove duplicates in-place so each unique element appears once. Return `k` (count of unique elements). First `k` positions must hold the unique values. O(1) extra space required.

```
[1,1,2]                  →  k=2, [1,2,_]
[0,0,1,1,1,2,2,3,3,4]   →  k=5, [0,1,2,3,4,_,_,_,_,_]
```

---

## Intuition — Sorted → Duplicates Adjacent → Two Pointers

Since the array is **sorted**, duplicates are always adjacent. No need to search globally — just compare each element with the previous unique one.

```
slow = write pointer (last position of confirmed unique elements)
fast = read pointer  (scans for next new unique element)

When nums[fast] !== nums[slow]: found new unique → write to nums[++slow]
When nums[fast] === nums[slow]: duplicate → skip fast, don't advance slow
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 2: Two Pointer — O(n) time, O(1) space ✅
// ─────────────────────────────────────────────────────────
function removeDuplicates(nums) {
    if (nums.length === 0) return 0;

    let slow = 0; // Last written unique element (starts at index 0)

    for (let fast = 1; fast < nums.length; fast++) {
        if (nums[fast] !== nums[slow]) {
            // New unique found → write to next position
            slow++;
            nums[slow] = nums[fast];
        }
        // Equal → duplicate → skip (don't advance slow)
    }

    return slow + 1; // slow is 0-indexed; count = slow + 1
}

// Tests
const a1 = [1,1,2];          console.log(removeDuplicates(a1)); // 2 ✅
const a2 = [0,0,1,1,1,2,2,3,3,4]; console.log(removeDuplicates(a2)); // 5 ✅
const a3 = [1,1,1,1];        console.log(removeDuplicates(a3)); // 1 ✅
const a4 = [1,2,3,4];        console.log(removeDuplicates(a4)); // 4 ✅


// ─────────────────────────────────────────────────────────
// VARIANT: Remove Duplicates II — At most 2 copies (LC #80)
// Compare fast with nums[slow-2] instead of nums[slow]
// ─────────────────────────────────────────────────────────
function removeDuplicatesII(nums) {
    if (nums.length <= 2) return nums.length;
    let slow = 2; // First two elements always valid

    for (let fast = 2; fast < nums.length; fast++) {
        // If nums[fast] !== nums[slow-2], writing it won't make a 3rd copy
        if (nums[fast] !== nums[slow - 2]) {
            nums[slow] = nums[fast];
            slow++;
        }
    }
    return slow;
}

console.log(removeDuplicatesII([1,1,1,2,2,3]));   // 5 ✅ [1,1,2,2,3]
console.log(removeDuplicatesII([0,0,1,1,1,1,2,3,3])); // 7 ✅ [0,0,1,1,2,3,3]


// ─────────────────────────────────────────────────────────
// GENERAL: Keep at most K copies (generalises both above)
// ─────────────────────────────────────────────────────────
function removeDuplicatesK(nums, k) {
    let slow = 0;
    for (const num of nums) {
        // Write if we've written < k elements total OR
        // the element k positions back is different (not a kth copy)
        if (slow < k || nums[slow - k] !== num) {
            nums[slow++] = num;
        }
    }
    return slow;
}
// k=1 → Part I,  k=2 → Part II,  k=N → allow all
```

---

## Dry Run

```
nums = [0,0,1,1,1,2,2,3,3,4],  slow=0

fast=1: 0===0 → skip
fast=2: 1!==0 → slow=1, nums[1]=1    [0,1,...]
fast=3: 1===1 → skip
fast=4: 1===1 → skip
fast=5: 2!==1 → slow=2, nums[2]=2    [0,1,2,...]
fast=6: 2===2 → skip
fast=7: 3!==2 → slow=3, nums[3]=3    [0,1,2,3,...]
fast=8: 3===3 → skip
fast=9: 4!==3 → slow=4, nums[4]=4    [0,1,2,3,4,...]

Return slow+1 = 5 ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Set (not in-place) | O(n) | O(n) |
| **Two Pointer** | **O(n)** | **O(1)** |

---

## Edge Cases

| Input | k | Note |
|---|---|---|
| `[]` | `0` | Guard |
| `[5]` | `1` | slow never advances |
| `[2,2,2,2]` | `1` | All same — slow stays at 0 |
| `[1,2,3,4]` | `4` | All unique — slow follows fast |

---

## Key Patterns & Takeaways

1. **Sorted → adjacent duplicates → two pointers** — sorted array collapses "find all duplicates" into a simple adjacent comparison. Always ask if the array is sorted — it's a massive hint.
2. **slow = write head, fast = read head** — a reusable pattern for in-place array compaction. Also appears in Remove Element (LC #27), Move Zeroes (LC #283), Filter Array.
3. **`return slow + 1`** — slow is 0-indexed. Count = slow + 1. Easy to get wrong under pressure.
4. **Part II: compare `fast` with `nums[slow-2]`** — checking 2 positions back ensures we don't write a 3rd copy. Extends to arbitrary k.
5. **`removeDuplicatesK(nums, k)` template** — `if (slow < k || nums[slow-k] !== num)` generalises to any k. Demonstrating this is a senior-level signal.