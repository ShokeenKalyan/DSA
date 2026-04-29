# 93 - Valid Anagram

## Problem
**LeetCode:** [#242 Valid Anagram](https://leetcode.com/problems/valid-anagram/)  
**Difficulty:** Easy  
**Topic:** Strings, Hashing

### Statement
Return `true` if `t` is an anagram of `s` (same characters, same frequencies).

```
"anagram", "nagaram"  →  true
"rat",     "car"      →  false
```

---

## Solution (JavaScript)

```javascript
// Frequency Count — O(n), O(1) ✅
function isAnagram(s, t) {
    if (s.length !== t.length) return false;

    const count = new Array(26).fill(0);
    const a = 'a'.charCodeAt(0);

    for (let i = 0; i < s.length; i++) {
        count[s.charCodeAt(i) - a]++;
        count[t.charCodeAt(i) - a]--;
    }

    return count.every(c => c === 0);
}

// Sort — O(n log n), O(n)
const isAnagramSort = (s, t) =>
    s.length === t.length &&
    s.split('').sort().join('') === t.split('').sort().join('');

console.log(isAnagram("anagram", "nagaram")); // true  ✅
console.log(isAnagram("rat", "car"));          // false ✅
```

---

## The Anagram Family

| Problem | Technique |
|---|---|
| **Valid Anagram (P93)** | Freq count single pair |
| **Group Anagrams (LC #49)** | HashMap, sorted string as key |
| **Find All Anagrams (P90)** | Sliding window freq diff |
| **Min Window Substring** | Variable sliding window |

---

## Key Patterns & Takeaways

1. **Length check first** — different lengths → `false` immediately.
2. **Single array, ++ and --** — count `s` up, count `t` down, check all zeros. One pass.
3. **Unicode follow-up** — use `Map` instead of 26-element array for general Unicode input.
4. **Group Anagrams key** — `word.split('').sort().join('')`. All anagrams produce the same sorted string.
5. **Foundation of P90** — Find All Anagrams is just this comparison applied in a sliding window.