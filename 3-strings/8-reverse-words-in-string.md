# 86 - Reverse Words in a String

## Problem
**LeetCode:** [#151 Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string/)  
**Difficulty:** Medium  
**Topic:** Strings, Two Pointers

### Statement
Reverse order of words in a string. Remove leading/trailing spaces, single-space between words.

```
"the sky is blue"   →  "blue is sky the"
"  hello world  "   →  "world hello"
"a good   example"  →  "example good a"
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Split/Reverse/Join — O(n), O(n) ✅
// Standard answer — readable, clean
// ─────────────────────────────────────────────────────────
function reverseWords(s) {
    return s.trim()       // Remove leading/trailing spaces
            .split(/\s+/) // Split on any whitespace run (not just ' ')
            .reverse()    // Reverse word order
            .join(' ');   // Single space between words
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Manual Right-to-Left — O(n), O(n)
// When split/regex disallowed. Scan right→left, extract words.
// Naturally produces reversed order — no extra reverse needed.
// ─────────────────────────────────────────────────────────
function reverseWordsManual(s) {
    const result = [];
    let i = s.length - 1;

    while (i >= 0) {
        while (i >= 0 && s[i] === ' ') i--;   // Skip spaces
        if (i < 0) break;

        let end = i;
        while (i >= 0 && s[i] !== ' ') i--;   // Walk to word start

        result.push(s.slice(i + 1, end + 1)); // Extract word
    }

    return result.join(' ');
}

console.log(reverseWords("the sky is blue"));   // "blue is sky the" ✅
console.log(reverseWords("  hello world  "));   // "world hello"     ✅
console.log(reverseWords("a good   example")); // "example good a"  ✅
```

---

## Dry Run — Manual

```
s="  hello world  ", i=13

Skip spaces → i=11 (end of "world")
Walk left → i=5 (space before "world")
word = s[6..11] = "world"

Skip spaces → i=4 (end of "hello")
Walk left → i=-1
word = s[0..4] = "hello"

return "world hello" ✅
```

---

## Key Details

```
split(/\s+/) not split(' '):
  "a  b".split(' ')   = ["a","","b"]  ← empty string for double space
  "a  b".split(/\s+/) = ["a","b"]    ← collapses multiple spaces ✅

trim() before split():
  Removes leading/trailing spaces so no empty strings at ends.

Manual scans right→left:
  Naturally extracts words in reversed order → no second reverse needed.
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| **Split/Reverse/Join** | **O(n)** | **O(n)** |
| Manual Two Pointer | O(n) | O(n) |

---

## Follow-up: O(1) Space (Char Array)

If given a mutable char array, use the three-reverse trick (same as Rotate Array P45):
1. Reverse entire array
2. Reverse each word individually

---

## Key Patterns & Takeaways

1. **`trim()` + `split(/\s+/)` + `reverse()` + `join(' ')`** — canonical one-liner. Lead with this.
2. **`/\s+/` not `' '`** — handles multiple consecutive spaces. Single space split creates empty strings.
3. **Right-to-left manual** — naturally reversed order. No extra reverse step.
4. **O(1) space follow-up** — three-reverse trick on char array. Same as Rotate Array (P45).