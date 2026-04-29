# 82 - Valid Palindrome

## Problem
**LeetCode:** [#125 Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)  
**Difficulty:** Easy  
**Topic:** Two Pointers, Strings

### Statement
Return `true` if the string is a palindrome considering only alphanumeric characters (case-insensitive).

```
"A man, a plan, a canal: Panama"  →  true
"race a car"                       →  false
" "                               →  true  (empty after filter)
```

---

## Intuition — Two Pointer with Skip

Same pattern as Reverse Vowels (P80) — two pointers from both ends, skip irrelevant characters with inner `while` loops, compare what remains.

```
skip non-alphanumeric from left
skip non-alphanumeric from right
compare lowercase → if mismatch → false
move both inward
```

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #125 — Valid Palindrome
 * Time: O(n) | Space: O(1)
 */
function isAlphanumeric(c) {
    return (c >= 'a' && c <= 'z') ||
           (c >= 'A' && c <= 'Z') ||
           (c >= '0' && c <= '9');
}

// Two Pointer — O(n), O(1) ✅
function isPalindrome(s) {
    let left = 0, right = s.length - 1;

    while (left < right) {
        while (left < right && !isAlphanumeric(s[left]))  left++;
        while (left < right && !isAlphanumeric(s[right])) right--;

        if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
        left++;
        right--;
    }

    return true;
}

// Filter + Reverse — O(n), O(n) (cleaner, more space)
const isPalindromeClean = s => {
    const f = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return f === f.split('').reverse().join('');
};

console.log(isPalindrome("A man, a plan, a canal: Panama")); // true  ✅
console.log(isPalindrome("race a car"));                      // false ✅
console.log(isPalindrome(" "));                               // true  ✅
console.log(isPalindrome("0P"));                              // false ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| **Two Pointer** | **O(n)** | **O(1)** |
| Filter + Reverse | O(n) | O(n) |

---

## Key Patterns & Takeaways

1. **Skip non-alphanumeric** — inner `while` loops skip irrelevant chars. Same "skip until condition" pattern as P80.
2. **Compare lowercase** — `toLowerCase()` for case-insensitive check without mutating string.
3. **`left < right` in inner loops** — prevents crossing during skip phase.
4. **Empty/whitespace** — no alphanumeric chars → loop never runs → `true`. Handled naturally.
5. **`isAlphanumeric` without regex** — character range checks faster than regex for single chars.