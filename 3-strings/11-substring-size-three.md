# 89 - Substrings of Size Three with Distinct Characters

## Problem
**LeetCode:** [#1876 Substrings of Size Three with Distinct Characters](https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters/)  
**Difficulty:** Easy  
**Topic:** Sliding Window, Strings

### Statement
Count substrings of length 3 with all distinct characters.

```
"xyzzaz"    →  1  ("xyz")
"aababcabc" →  4
"abc"        →  1
```

---

## Solution (JavaScript)

```javascript
// Fixed window size 3 — O(n) time, O(1) space
function countGoodSubstrings(s) {
    let count = 0;
    for (let i = 0; i <= s.length - 3; i++) {
        if (s[i] !== s[i+1] && s[i+1] !== s[i+2] && s[i] !== s[i+2])
            count++;
    }
    return count;
}

// Set-based (generalises to any window size k)
const countGood = (s, k=3) => {
    let count = 0;
    for (let i = 0; i <= s.length-k; i++)
        if (new Set(s.slice(i, i+k)).size === k) count++;
    return count;
};

console.log(countGoodSubstrings("xyzzaz"));    // 1 ✅
console.log(countGoodSubstrings("aababcabc")); // 4 ✅
```

---

## Key Patterns & Takeaways

1. **Fixed sliding window** — size k=3, no shrinking. Slide one step, check, count.
2. **Three pairwise comparisons** — faster than Set for k=3 specifically.
3. **Set generalisation** — `new Set(...).size === k` for any window size k.
4. **Loop bound `s.length - 3`** — last valid start. `i <= n-3` not `i < n`.