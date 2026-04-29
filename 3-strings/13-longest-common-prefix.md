# 91 - Longest Common Prefix

## Problem
**LeetCode:** [#14 Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix/)  
**Difficulty:** Easy  
**Topic:** Strings

### Statement
Find the longest common prefix among an array of strings.

```
["flower","flow","flight"]  →  "fl"
["dog","racecar","car"]     →  ""
["a"]                       →  "a"
```

---

## Approaches

| Approach | Time | Space | Notes |
|---|---|---|---|
| **Vertical Scan** | **O(S)** | **O(1)** | Column-by-column, early exit |
| Horizontal Scan | O(S) | O(m) | Shrink prefix against each string |
| Sort + Compare | O(S log n) | O(1) | Only compare first/last after sort |

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Vertical Scan — O(S), O(1) ✅
// Check same position across all strings, stop on mismatch
// ─────────────────────────────────────────────────────────
function longestCommonPrefix(strs) {
    if (!strs.length) return "";

    for (let i = 0; i < strs[0].length; i++) {
        const ch = strs[0][i];
        for (let j = 1; j < strs.length; j++) {
            if (i >= strs[j].length || strs[j][i] !== ch) {
                return strs[0].slice(0, i); // Prefix ends before i
            }
        }
    }

    return strs[0]; // Entire strs[0] is common prefix
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Horizontal Scan — shrink prefix progressively
// ─────────────────────────────────────────────────────────
function longestCommonPrefixHorizontal(strs) {
    let prefix = strs[0];
    for (let i = 1; i < strs.length; i++) {
        while (!strs[i].startsWith(prefix)) {
            prefix = prefix.slice(0, -1);
            if (!prefix) return "";
        }
    }
    return prefix;
}


// ─────────────────────────────────────────────────────────
// APPROACH 3: Sort + Compare first/last — O(S log n)
// ─────────────────────────────────────────────────────────
function longestCommonPrefixSort(strs) {
    strs.sort();
    const first = strs[0], last = strs[strs.length-1];
    let i = 0;
    while (i < first.length && first[i] === last[i]) i++;
    return first.slice(0, i);
}

console.log(longestCommonPrefix(["flower","flow","flight"])); // "fl"  ✅
console.log(longestCommonPrefix(["dog","racecar","car"]));    // ""    ✅
console.log(longestCommonPrefix(["a"]));                       // "a"   ✅
console.log(longestCommonPrefix(["ab","a"]));                  // "a"   ✅
```

---

## Dry Run — Vertical Scan

```
["flower","flow","flight"]

i=0 ch='f': all start with 'f' ✅
i=1 ch='l': all have 'l' ✅
i=2 ch='o': "flight"[2]='i' ≠ 'o' → return slice(0,2)="fl" ✅
```

---

## Complexity

S = total characters across all strings.

---

## Key Patterns & Takeaways

1. **Vertical scan** — check column by column. Stop the moment any string disagrees. Natural early exit.
2. **`strs[0]` as anchor** — prefix can't exceed shortest string. Slice on mismatch at `i` gives `strs[0].slice(0,i)`.
3. **Sort trick** — lexicographic sort → only compare first and last. Middle strings guaranteed compatible. But sort cost is unnecessary.
4. **`slice(0, i)` on exit** — when mismatch found at `i`, prefix = everything before position `i`.
5. **All handled naturally** — empty array, single string, all identical: vertical scan handles without special cases.