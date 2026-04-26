# 55 - Two Sum II — Input Array Is Sorted

## Problem
**LeetCode:** [#167 Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)  
**Difficulty:** Medium  
**Topic:** Arrays, Two Pointers, Binary Search

### Statement
Given a **1-indexed sorted** array, find two numbers adding to `target`. Return 1-indexed indices. O(1) extra space required.

```
[2,7,11,15], target=9  →  [1,2]
[2,3,4],     target=6  →  [1,3]
[-1,0],      target=-1 →  [1,2]
```

---

## Intuition — Two Pointer from Both Ends

Sorted array → largest values at ends → two pointer:
- `sum < target` → `left++` (need larger)
- `sum > target` → `right--` (need smaller)
- `sum === target` → found

**Elimination argument:** when `sum < target`, `numbers[left]` is too small to pair with anything to its left (all smaller), so safely eliminate it.

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #167 — Two Sum II
 * Time: O(n) | Space: O(1)
 */
function twoSum(numbers, target) {
    let left = 0, right = numbers.length - 1;

    while (left < right) {
        const sum = numbers[left] + numbers[right];
        if (sum === target) return [left + 1, right + 1]; // 1-indexed!
        else if (sum < target) left++;
        else right--;
    }

    return [];
}

console.log(twoSum([2,7,11,15], 9));  // [1,2] ✅
console.log(twoSum([2,3,4], 6));       // [1,3] ✅
console.log(twoSum([-1,0], -1));       // [1,2] ✅
```

---

## Two Sum I vs II

| | Two Sum I (P18) | Two Sum II (P55) |
|---|---|---|
| Input | Unsorted | Sorted |
| Indices | 0-indexed | **1-indexed** |
| Approach | HashMap O(n) space | Two Pointer O(1) space |

**Rule:** sorted → two pointer. Unsorted + need indices → HashMap.

---

## Key Patterns & Takeaways

1. **Sorted → two pointer** — canonical sorted array pair sum. O(1) space, O(n) time.
2. **Elimination argument** — `sum < target`: left can't pair with anything smaller → eliminate. Guarantees correctness.
3. **O(1) space constraint = hint** — problem says O(1) extra space → HashMap disallowed → two pointer expected.
4. **1-indexed return** — `left+1`, `right+1`. Common off-by-one in interviews.
5. **Inner loop of 3Sum** — 3Sum (P18 bonus) sorts first, then runs this exact two-pointer for each fixed element.