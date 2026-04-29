# 92 - Find the Index of the First Occurrence in a String

## Problem
**LeetCode:** [#28 Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/)  
**Difficulty:** Easy  
**Topic:** Strings, KMP, Two Pointers

### Statement
Return the index of the first occurrence of `needle` in `haystack`, or -1.

```
"sadbutsad", needle="sad"   →  0
"leetcode",  needle="leeto" →  -1
"hello",     needle="ll"    →  2
```

---

## Approaches

| Approach | Time | Space | Notes |
|---|---|---|---|
| Built-in `indexOf` | O(n×m) avg | O(1) | Acceptable in interviews |
| Brute Force | O(n×m) | O(1) | Simple |
| **KMP** | **O(n+m)** | **O(m)** | Optimal — senior signal |

---

## KMP — Core Idea

Brute force backtracks `j` to 0 on every mismatch — wastes prior matching info.

**KMP:** build LPS (Longest Proper Prefix = Suffix) table from needle. On mismatch at `needle[j]`, jump to `j = lps[j-1]` instead of 0. Haystack pointer `i` never goes back.

```
LPS[i] = length of longest proper prefix of needle[0..i]
         that is also a suffix

needle = "ABABC" → lps = [0,0,1,2,0]
  "AB" is both a prefix and suffix of "ABAB" → lps[3]=2
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 2: Brute Force — O(n×m), O(1)
// ─────────────────────────────────────────────────────────
function strStrBrute(haystack, needle) {
    const n = haystack.length, m = needle.length;
    for (let i = 0; i <= n - m; i++) {
        let j = 0;
        while (j < m && haystack[i+j] === needle[j]) j++;
        if (j === m) return i;
    }
    return -1;
}


// ─────────────────────────────────────────────────────────
// APPROACH 3: KMP — O(n+m), O(m) ✅
// ─────────────────────────────────────────────────────────
function buildLPS(needle) {
    const m = needle.length;
    const lps = new Array(m).fill(0);
    let len = 0, i = 1;

    while (i < m) {
        if (needle[i] === needle[len]) {
            lps[i++] = ++len;
        } else if (len !== 0) {
            len = lps[len - 1]; // Fall back, don't move i
        } else {
            lps[i++] = 0;
        }
    }
    return lps;
}

function strStr(haystack, needle) {
    const n = haystack.length, m = needle.length;
    if (m === 0) return 0;
    if (n < m) return -1;

    const lps = buildLPS(needle);
    let i = 0, j = 0;

    while (i < n) {
        if (haystack[i] === needle[j]) {
            i++; j++;
            if (j === m) return i - m; // Match found
        } else if (j !== 0) {
            j = lps[j - 1]; // Jump using LPS — don't move i back
        } else {
            i++;
        }
    }

    return -1;
}

console.log(strStr("sadbutsad", "sad"));    // 0  ✅
console.log(strStr("leetcode", "leeto"));   // -1 ✅
console.log(strStr("aabaabaaf", "aabaaf")); // 3  ✅
```

---

## Dry Run — KMP

```
haystack="aabaabaaf", needle="aabaaf"
lps = [0,1,0,1,2,0]

Matching:
i=0-4: match a,a,b,a,a → j=5
i=5,j=5: h[5]='b'≠n[5]='f' → j=lps[4]=2
i=5,j=2: h[5]='b'=n[2]='b' → i=6,j=3
i=6-8:   match a,a,f → j=6=m → return 9-6=3 ✅
```

---

## Building LPS

```
"ABABC":
i=1: B≠A, len=0 → lps[1]=0
i=2: A=A, len=1 → lps[2]=1
i=3: B=B, len=2 → lps[3]=2
i=4: C≠A → len=lps[1]=0 → C≠A → lps[4]=0

lps = [0,0,1,2,0] ✅
```

---

## Key Patterns & Takeaways

1. **`j = lps[j-1]` on mismatch** — the KMP algorithm in one line. Skip to the longest prefix still valid. Never backtrack `i`.
2. **LPS = preprocessing the needle** — O(m) time/space to build. Enables O(n) scan with no backtracking.
3. **LPS build mirrors KMP search** — both use `len = lps[len-1]` on mismatch. Same pattern, applied to the needle itself during preprocessing.
4. **Built-in is fine** — `indexOf` is acceptable in most interviews. Use KMP when interviewer asks for O(n+m) or "implement from scratch".
5. **`i` never goes back** — the defining property of KMP. Haystack is scanned exactly once → O(n) scan regardless of mismatches.