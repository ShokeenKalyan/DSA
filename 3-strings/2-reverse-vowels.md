# 80 - Reverse Vowels of a String

## Problem
**LeetCode:** [#345 Reverse Vowels of a String](https://leetcode.com/problems/reverse-vowels-of-a-string/)  
**Difficulty:** Easy  
**Topic:** Two Pointers, Strings

### Statement
Reverse only the vowels in a string, leaving other characters in place.

```
"hello"    →  "holle"
"leetcode" →  "leotcede"
"aA"       →  "Aa"
```

---

## Intuition — Conditional Two-Pointer Swap

Same skeleton as Reverse String (P79) — two pointers from both ends. Add inner `while` loops to **skip non-vowels** before each swap.

```
while left < right:
    skip left  while not a vowel
    skip right while not a vowel
    if left < right: swap, move both inward
```

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #345 — Reverse Vowels of a String
 * Time: O(n) | Space: O(n) — array conversion
 */
function reverseVowels(s) {
    const VOWELS = new Set(['a','e','i','o','u','A','E','I','O','U']);
    const arr = s.split(''); // Strings immutable in JS
    let left = 0, right = arr.length - 1;

    while (left < right) {
        while (left < right && !VOWELS.has(arr[left]))  left++;
        while (left < right && !VOWELS.has(arr[right])) right--;

        if (left < right) {
            [arr[left], arr[right]] = [arr[right], arr[left]];
            left++;
            right--;
        }
    }

    return arr.join('');
}

console.log(reverseVowels("hello"));    // "holle"    ✅
console.log(reverseVowels("leetcode")); // "leotcede" ✅
console.log(reverseVowels("aA"));       // "Aa"       ✅
console.log(reverseVowels("bcdfg"));    // "bcdfg"    ✅ (no vowels)
```

---

## Dry Run

```
"hello" → ['h','e','l','l','o'], left=0, right=4

Skip left:  h→skip, e=vowel stop. left=1
Skip right: o=vowel stop. right=4
Swap e↔o: ['h','o','l','l','e'], left=2, right=3

Skip left:  l→skip, l→skip. left=4>right=3 → stop
left>right → EXIT

return "holle" ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(n) |
| Space | O(n) — split/join |

---

## Key Patterns & Takeaways

1. **Conditional two-pointer** — skip non-vowels with inner `while` loops. Foundation of many two-pointer string problems.
2. **HashSet for O(1) lookup** — `new Set([...])` over string `includes`. O(1) vs O(k) per check.
3. **`if (left < right)` guard** — inner loops can cross pointers (no second vowel). Guard prevents invalid swap.
4. **Strings immutable in JS** — `split('')` → modify → `join('')`. Same pattern in Java/Python.
5. **Same pattern as Valid Palindrome** — both use "advance until condition met" inner loop. Reusable template.