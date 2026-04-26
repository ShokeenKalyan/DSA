# 81 - Reverse Prefix of Word

## Problem
**LeetCode:** [#2000 Reverse Prefix of Word](https://leetcode.com/problems/reverse-prefix-of-word/)  
**Difficulty:** Easy  
**Topic:** Two Pointers, Strings

### Statement
Reverse the prefix of `word` up to and including the first occurrence of `ch`. Return unchanged if `ch` not found.

```
"abcdefd", ch="d"  →  "dcbaefd"  (reverse "abcd")
"xyxzx",   ch="z"  →  "zxyxx"
"abcd",    ch="z"  →  "abcd"     (not found)
```

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #2000 — Reverse Prefix of Word
 * Time: O(n) | Space: O(n)
 */
function reversePrefix(word, ch) {
    const idx = word.indexOf(ch);
    if (idx === -1) return word; // Not found — unchanged

    const arr = word.split('');
    let left = 0, right = idx;  // Reverse [0..idx] inclusive

    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++; right--;
    }

    return arr.join('');
}

console.log(reversePrefix("abcdefd", "d")); // "dcbaefd" ✅
console.log(reversePrefix("xyxzx",   "z")); // "zxyxx"   ✅
console.log(reversePrefix("abcd",    "z")); // "abcd"    ✅
console.log(reversePrefix("a",       "a")); // "a"       ✅
```

---

## Dry Run

```
"abcdefd", ch="d" → idx=3
arr=['a','b','c','d','e','f','d'], reverse [0..3]
  swap a↔d → ['d','b','c','a',...]
  swap b↔c → ['d','c','b','a',...]
return "dcbaefd" ✅
```

---

## Key Patterns & Takeaways

1. **Find index → reverse subrange** — `indexOf` for boundary, two-pointer reverse on `[0..idx]`. Direct reuse of P79.
2. **`idx === -1` guard** — early return if ch not found.
3. **`right = idx` inclusive** — reverse includes `ch` itself. Not `idx-1`.
4. **Subrange reverse** — same building block used in Rotate Array (P45)'s three-reverse trick.