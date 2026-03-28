# 03 - Next Permutation

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/next_permutation-find-next-lexicographically-greater-permutation) | [LeetCode #31](https://leetcode.com/problems/next-permutation/)  
**Difficulty:** Medium  
**Topic:** Arrays

### Statement
Given an array of integers, rearrange it into the **next lexicographically greater permutation**.  
If no greater permutation exists (the array is descending), rearrange into the **smallest possible order** (ascending).  
Must be done **in-place** with O(1) extra space.

```
Input: [1, 3, 2]  →  Output: [2, 1, 3]
Input: [3, 2, 1]  →  Output: [1, 2, 3]  ← wrap around
Input: [1, 2, 3]  →  Output: [1, 3, 2]
Input: [2, 3, 1]  →  Output: [3, 1, 2]
```

---

## Intuition

**Observation 1:** A suffix in **descending order** is already at its maximum — no rearrangement within it gives something bigger. We must go *left* of it to make a change.

**Observation 2:** The element just left of the descending suffix is the **pivot**. Swap it with the **smallest element in the suffix that is still greater than the pivot** — this gives the next bigger value at that position without jumping too far.

**Observation 3:** After the swap, the suffix is still descending. **Reverse it** to get the smallest arrangement → next permutation achieved.

---

## The 4-Step Algorithm

```
Step 1: Find pivot — scan from right, find first index i where arr[i] < arr[i+1]
Step 2: If no pivot → entire array is descending → reverse whole array → done
Step 3: Find swap candidate — scan from right, find first index j where arr[j] > arr[i]
Step 4: Swap arr[i] and arr[j], then reverse suffix from i+1 to end
```

---

## Visual Dry Run

```
Input: [2, 3, 1, 4, 3, 2, 1]

Step 1 — Find pivot:
  arr[2]=1 < arr[3]=4  ← first dip from right → pivot index i = 2

Step 2 — Find swap candidate in suffix [4,3,2,1]:
  Scan from right: arr[5]=2 > arr[2]=1 ✅ → j = 5

Step 3 — Swap arr[2] and arr[5]:
  [2, 3, 1, 4, 3, 2, 1] → [2, 3, 2, 4, 3, 1, 1]

Step 4 — Reverse suffix from index 3:
  [4, 3, 1, 1] → [1, 1, 3, 4]
  Result: [2, 3, 2, 1, 1, 3, 4] ✅
```

---

## Solution (JavaScript)

```javascript
/**
 * Next Permutation
 * LeetCode #31
 * Time: O(n) | Space: O(1)
 *
 * The algorithm works in 3 passes, all O(n):
 * 1. Find the pivot (rightmost element that breaks descending order)
 * 2. Find the swap candidate (smallest element in suffix > pivot)
 * 3. Swap + reverse the suffix
 */
function nextPermutation(nums) {
    const n = nums.length;

    // ── STEP 1: Find the pivot ──────────────────────────────
    // Scan from right to left to find the first index `i`
    // where nums[i] < nums[i+1]
    // Everything to the right of i is in descending order
    let i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }

    // ── STEP 2: Find the swap candidate ────────────────────
    // Only do this if a pivot was found (i >= 0)
    // If i < 0, the entire array is descending — just reverse it
    if (i >= 0) {
        // Scan from right to find the first element greater than pivot
        // Since suffix is descending, the first one from the right
        // that is > nums[i] is the SMALLEST such element — perfect
        let j = n - 1;
        while (nums[j] <= nums[i]) {
            j--;
        }
        // Swap pivot with the swap candidate
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    // ── STEP 3: Reverse the suffix ──────────────────────────
    // After the swap, suffix (from i+1 to end) is still descending
    // Reversing it gives us the smallest possible arrangement
    // for that suffix — which is exactly what we want
    let left = i + 1;
    let right = n - 1;
    while (left < right) {
        [nums[left], nums[right]] = [nums[right], nums[left]];
        left++;
        right--;
    }

    // Array is modified in-place, no return needed
}

// ── Test cases ──────────────────────────────────────────
const t1 = [1, 2, 3];  nextPermutation(t1); console.log(t1); // [1, 3, 2]
const t2 = [3, 2, 1];  nextPermutation(t2); console.log(t2); // [1, 2, 3]
const t3 = [2, 3, 1];  nextPermutation(t3); console.log(t3); // [3, 1, 2]
const t4 = [1, 1, 5];  nextPermutation(t4); console.log(t4); // [1, 5, 1]
const t5 = [1];         nextPermutation(t5); console.log(t5); // [1]
```

---

## Complexity

| | Complexity |
|---|---|
| **Time** | O(n) — three linear passes at most |
| **Space** | O(1) — pure in-place, no extra data structures |

---

## Edge Cases

| Case | Input | Output | Why |
|---|---|---|---|
| Single element | `[1]` | `[1]` | No permutation possible |
| All same | `[2,2,2]` | `[2,2,2]` | Pivot never found, reverse = same |
| Already largest | `[3,2,1]` | `[1,2,3]` | No pivot → reverse whole array |
| Duplicates | `[1,1,5]` | `[1,5,1]` | Works — `>=` in step 1 handles it |

---

## Key Patterns & Takeaways

1. **"Descending suffix" pattern** — the descending suffix is frozen at its max. The action always happens just to its left. Recurs in *Find Largest Number*, *Palindrome by rearrangement*.
2. **Why scan from right for step 2?** Suffix is descending, so the first element from the right that beats the pivot is the *smallest* one that does — ensuring the minimal jump to the next permutation.
3. **Reverse, not sort** — after the swap the suffix is still descending, so reversing is O(n) vs O(n log n) for sorting. Always highlight this to the interviewer.
4. **The `>=` in step 1** — handles duplicates correctly in the pivot search.