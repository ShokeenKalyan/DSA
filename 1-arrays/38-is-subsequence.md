# 56 - Is Subsequence

## Problem
**LeetCode:** [#392 Is Subsequence](https://leetcode.com/problems/is-subsequence/)  
**Difficulty:** Easy  
**Topic:** Two Pointers, String, Greedy, Binary Search (follow-up)

### Statement
Return `true` if `s` is a subsequence of `t` (relative order preserved, gaps allowed).

```
s="ace", t="abcde"  →  true   (a_c_e)
s="aec", t="abcde"  →  false  (order violated)
s="",    t="abcde"  →  true   (empty always true)
```

---

## Intuition — Greedy Two Pointer

Walk `t` greedily. When `t[j] === s[i]`, match and advance `i`. Always advance `j`. Return `i === s.length`.

**Why greedy?** Matching to the earliest possible position in `t` is optimal — saving it for later only reduces future options.

---

## Solution (JavaScript)

```javascript
// Two Pointer — O(n) time, O(1) space
function isSubsequence(s, t) {
    let i = 0, j = 0;

    while (i < s.length && j < t.length) {
        if (s[i] === t[j]) i++; // Match → advance s pointer
        j++;                     // Always advance t pointer
    }

    return i === s.length;
}

console.log(isSubsequence("ace", "abcde"));  // true  ✅
console.log(isSubsequence("aec", "abcde"));  // false ✅
console.log(isSubsequence("", "abcde"));     // true  ✅
console.log(isSubsequence("abc", ""));       // false ✅


// ─────────────────────────────────────────────────────────
// FOLLOW-UP: Many queries against same t → Binary Search
// Preprocess t: char → sorted positions list
// Each query: O(|s| log|t|) instead of O(|t|)
// ─────────────────────────────────────────────────────────
function isSubsequenceMultiple(s, t) {
    const positions = {};
    for (let i = 0; i < t.length; i++) {
        if (!positions[t[i]]) positions[t[i]] = [];
        positions[t[i]].push(i);
    }

    let prevIdx = -1;
    for (const char of s) {
        const idxList = positions[char];
        if (!idxList) return false;

        // Binary search: smallest index > prevIdx
        let lo = 0, hi = idxList.length - 1, found = -1;
        while (lo <= hi) {
            const mid = Math.floor((lo + hi) / 2);
            if (idxList[mid] > prevIdx) { found = idxList[mid]; hi = mid - 1; }
            else lo = mid + 1;
        }

        if (found === -1) return false;
        prevIdx = found;
    }
    return true;
}
// Preprocess: O(|t|) once. Each query: O(|s| log|t|)
```

---

## Dry Run

```
s="ace", t="abcde"

t[0]='a'=s[0] → i=1
t[1]='b'≠s[1] → skip
t[2]='c'=s[1] → i=2
t[3]='d'≠s[2] → skip
t[4]='e'=s[2] → i=3

i(3)===s.length(3) → true ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| **Two Pointer** | **O(n)** where n=\|t\| | **O(1)** |
| Follow-up (preprocess) | O(\|t\|) build + O(\|s\|log\|t\|)/query | O(\|t\|) |

---

## Key Patterns & Takeaways

1. **Greedy two pointer** — match `s[i]` to earliest available position in `t`. Advance `j` always, `i` on match. Return `i === s.length`.
2. **Subsequence ≠ substring** — order preserved, gaps allowed. Substring requires contiguity.
3. **Follow-up = senior signal** — preprocess `t` into position map, binary search per character. Shifts per-query from O(\|t\|) to O(\|s\|log\|t\|).
4. **DP connection** — Is Subsequence is LCS(s,t)===\|s\|. Greedy two-pointer is the O(n) shortcut for this special case.
5. **Empty string** — `s=""` → `i=0=s.length` → `true` before loop runs. Handled naturally.