# 97 - Verifying an Alien Dictionary

## Problem
**LeetCode:** [#953 Verifying an Alien Dictionary](https://leetcode.com/problems/verifying-an-alien-dictionary/)  
**Difficulty:** Easy  
**Topic:** Strings, Hashing

### Statement
Return `true` if `words` are sorted according to the alien `order` alphabet.

```
["hello","leetcode"], order="hlabcdefgijkmnopqrstuvwxyz"  →  true
["word","world","row"], order="worldabcefghijkmnpqstuvxyz" →  false
["apple","app"],       order="abcdefghijklmnopqrstuvwxyz"  →  false
```

---

## Intuition

Build rank array `rank[c] = position in alien order`. For each adjacent word pair:
- Find first differing character → compare ranks → decide order
- If no differing char: longer word must come second (prefix rule)

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #953 — Verifying an Alien Dictionary
 * Time: O(C) total characters | Space: O(1)
 */
function isAlienSorted(words, order) {
    // Build rank: char → alien alphabet position
    const rank = new Array(26).fill(0);
    const a = 'a'.charCodeAt(0);
    for (let i = 0; i < order.length; i++)
        rank[order.charCodeAt(i) - a] = i;

    for (let i = 0; i < words.length - 1; i++) {
        const w1 = words[i], w2 = words[i+1];
        const minLen = Math.min(w1.length, w2.length);
        let found = false;

        for (let j = 0; j < minLen; j++) {
            const r1 = rank[w1.charCodeAt(j) - a];
            const r2 = rank[w2.charCodeAt(j) - a];
            if (r1 < r2) { found = true; break; } // w1 < w2 ✅
            if (r1 > r2) return false;             // w1 > w2 ❌
        }

        // Prefix rule: longer first word is invalid
        if (!found && w1.length > w2.length) return false;
    }

    return true;
}

console.log(isAlienSorted(["hello","leetcode"],
    "hlabcdefgijkmnopqrstuvwxyz"));          // true  ✅
console.log(isAlienSorted(["word","world","row"],
    "worldabcefghijkmnpqstuvxyz"));           // false ✅
console.log(isAlienSorted(["apple","app"],
    "abcdefghijklmnopqrstuvwxyz"));           // false ✅
console.log(isAlienSorted(["app","apple"],
    "abcdefghijklmnopqrstuvwxyz"));           // true  ✅
```

---

## Dry Run

```
["word","world"], order rank: w=0,o=1,r=2,l=3,d=4,...

j=0: w vs w → equal
j=1: o vs o → equal
j=2: r vs r → equal
j=3: d(4) vs l(3) → 4>3 → return false ✅
```

---

## Edge Cases

```
["apple","app"]: no diff char, w1.length(5)>w2.length(3) → false ✅
["app","apple"]: no diff char, w1.length(3)≤w2.length(5) → true  ✅
Single word:     no pairs to check → true ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(C) — total characters |
| Space | O(1) — 26-element array |

---

## Key Patterns & Takeaways

1. **Rank array for O(1) lookup** — precompute `rank[c]=position`. Avoids `order.indexOf(c)` O(26) per char.
2. **Adjacent pairs only** — transitivity means only `(words[i], words[i+1])` pairs need checking.
3. **First differing char decides** — stop at first mismatch. Its rank comparison determines order.
4. **Prefix rule** — no differing char + `w1.length > w2.length` → invalid. `"apple"` before `"app"` is wrong.
5. **`found` flag** — cleanly separates the "order determined" case from the "prefix comparison needed" case.