# 48 - Contains Duplicate

## Problem
**LeetCode:** [#217 Contains Duplicate](https://leetcode.com/problems/contains-duplicate/)  
**Difficulty:** Easy  
**Topic:** Arrays, Hashing

### Statement
Return `true` if any value appears at least twice, `false` if all elements are distinct.

```
[1,2,3,1]  →  true
[1,2,3,4]  →  false
```

---

## Solution (JavaScript)

```javascript
// HashSet — O(n) time, O(n) space ✅
// Early return on first duplicate
function containsDuplicate(nums) {
    const seen = new Set();
    for (const num of nums) {
        if (seen.has(num)) return true;
        seen.add(num);
    }
    return false;
}

// One-liner (no early return — always full scan)
const oneLiner = nums => new Set(nums).size !== nums.length;

// Sort — O(n log n) time, O(1) space (modifies input)
function containsDuplicateSort(nums) {
    nums.sort((a, b) => a - b);
    for (let i = 1; i < nums.length; i++)
        if (nums[i] === nums[i-1]) return true;
    return false;
}
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Sort | O(n log n) | O(1) |
| **HashSet** | **O(n)** | **O(n)** |

---

## Key Patterns & Takeaways

1. **HashSet "have I seen this?"** — add as you scan, return on first repeat. Standard pattern for duplicate detection.
2. **Early return beats one-liner** — `new Set(nums).size !== nums.length` always scans all; explicit loop exits on first duplicate.
3. **Sort for O(1) space** — if input modification allowed and space is constrained.
4. **Contains Duplicate II follow-up** — same value within `k` indices → sliding window HashSet of size `k`.