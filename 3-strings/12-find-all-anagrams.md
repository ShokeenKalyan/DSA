# 90 - Find All Anagrams in a String

## Problem
**LeetCode:** [#438 Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/)  
**Difficulty:** Medium  
**Topic:** Sliding Window, Hashing, Strings

### Statement
Return all start indices of `p`'s anagrams in `s`.

```
s="cbaebabacd", p="abc"  →  [0,6]   ("cba","bac")
s="abab",       p="ab"   →  [0,1,2] ("ab","ba","ab")
```

---

## Intuition — Fixed Window + Frequency Diff

Maintain a window of size `|p|` over `s`. Track `count[c] = freq(c in p) - freq(c in window)`. Count `diffCount` = chars where `count[c] !== 0`. Valid anagram when `diffCount === 0`.

**Sliding:**
- Add right char: `count[c]--`. If 0→non-zero: `diffCount++`. If non-zero→0: `diffCount--`.
- Remove left char: `count[c]++`. Same symmetric logic.

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #438 — Find All Anagrams in a String
 * Time: O(n) | Space: O(1) — 26 chars
 */

// ─────────────────────────────────────────────────────────
// APPROACH 1: Compare freq arrays — O(n×26) = O(n)
// ─────────────────────────────────────────────────────────
function findAnagramsSimple(s, p) {
    const result = [], k = p.length, a = 'a'.charCodeAt(0);
    const pFreq = new Array(26).fill(0);
    const wFreq = new Array(26).fill(0);

    for (const c of p) pFreq[c.charCodeAt(0) - a]++;

    for (let i = 0; i < s.length; i++) {
        wFreq[s.charCodeAt(i) - a]++;
        if (i >= k) wFreq[s.charCodeAt(i - k) - a]--;
        if (i >= k-1 && pFreq.every((f,idx) => f === wFreq[idx]))
            result.push(i - k + 1);
    }
    return result;
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Diff Counter — O(n) strict ✅
// diffCount = chars where freq mismatch exists
// Valid when diffCount === 0
// ─────────────────────────────────────────────────────────
function findAnagrams(s, p) {
    const result = [], k = p.length;
    if (s.length < k) return result;

    const a = 'a'.charCodeAt(0);
    const count = new Array(26).fill(0);
    let diffCount = 0;

    // Build freq for p
    for (const c of p) {
        const i = c.charCodeAt(0) - a;
        if (count[i] === 0) diffCount++;
        count[i]++;
    }

    const addToWindow = c => {
        const i = c.charCodeAt(0) - a;
        if (count[i] === 0) diffCount++;
        count[i]--;
        if (count[i] === 0) diffCount--;
    };

    const removeFromWindow = c => {
        const i = c.charCodeAt(0) - a;
        if (count[i] === 0) diffCount++;
        count[i]++;
        if (count[i] === 0) diffCount--;
    };

    // Build initial window
    for (let i = 0; i < k; i++) addToWindow(s[i]);
    if (diffCount === 0) result.push(0);

    // Slide
    for (let i = k; i < s.length; i++) {
        addToWindow(s[i]);
        removeFromWindow(s[i - k]);
        if (diffCount === 0) result.push(i - k + 1);
    }

    return result;
}

console.log(findAnagrams("cbaebabacd", "abc")); // [0,6]   ✅
console.log(findAnagrams("abab", "ab"));         // [0,1,2] ✅
console.log(findAnagrams("aa", "bb"));           // []      ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Compare freq arrays | O(n×26) | O(1) |
| **Diff Counter** | **O(n)** | **O(1)** |

---

## Fixed Sliding Window Family

| Problem | Window | Check |
|---|---|---|
| **Substrings Size 3 (P89)** | k=3 | Distinct chars |
| **Find All Anagrams (P90)** | k=\|p\| | Freq match |
| **Min Window Substring (LC #76)** | Variable | Contains all of p |
| **Longest No Repeat (P22)** | Variable | All unique |

---

## Key Patterns & Takeaways

1. **Fixed window + freq diff** — canonical anagram detection. `count[c] = p_freq - window_freq`. Valid when `diffCount === 0`.
2. **`diffCount` avoids O(26) comparison** — only update diffCount when a char crosses zero. O(1) per slide step.
3. **Initialise first window separately** — build window of size k, check it, then slide from i=k. Cleaner than in-loop special-casing.
4. **`s.length < k` early return** — no anagram possible if p longer than s.
5. **Min Window Substring connection** — same freq diff approach with variable window. Anagram detection = fixed-window version.