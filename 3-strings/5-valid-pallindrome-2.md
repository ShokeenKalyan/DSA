# 83 - Valid Palindrome II

## Problem
**LeetCode:** [#680 Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii/)  
**Difficulty:** Easy  
**Topic:** Two Pointers, Strings, Greedy

### Statement
Return `true` if the string can be a palindrome after deleting **at most one character**.

```
"aba"   →  true   (already palindrome)
"abca"  →  true   (delete 'c')
"abc"   →  false
```

---

## Intuition — Two Pointer + One Branch on Mismatch

Walk two pointers inward comparing characters:
- **Match** → advance both, continue
- **Mismatch** → must delete one character. Try BOTH:
  - Skip `s[left]`  → check if `s[left+1..right]` is palindrome
  - Skip `s[right]` → check if `s[left..right-1]` is palindrome
  - Either true → `true`. Both false → `false`

**One chance only** — after the branch, `isPalindromeRange` does a strict check (no more deletions).

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #680 — Valid Palindrome II
 * Time: O(n) | Space: O(1)
 */

// Strict palindrome check on s[left..right] — no deletions allowed
function isPalindromeRange(s, left, right) {
    while (left < right) {
        if (s[left] !== s[right]) return false;
        left++; right--;
    }
    return true;
}

function validPalindrome(s) {
    let left = 0, right = s.length - 1;

    while (left < right) {
        if (s[left] !== s[right]) {
            // Try skipping left OR right — one chance only
            return isPalindromeRange(s, left+1, right) ||
                   isPalindromeRange(s, left, right-1);
        }
        left++; right--;
    }

    return true; // Perfect palindrome — no deletion needed
}

console.log(validPalindrome("aba"));    // true  ✅
console.log(validPalindrome("abca"));   // true  ✅
console.log(validPalindrome("abc"));    // false ✅
console.log(validPalindrome("deeee"));  // true  ✅
```

---

## Dry Run

```
"abca": l=0,r=3
  a===a ✅ → l=1,r=2
  b!==c ← MISMATCH
  isPalindromeRange(l+1=2, r=2) = "c" → single char → true ✅

"abc": l=0,r=2
  a!==c ← MISMATCH
  isPalindromeRange(1,2)="bc" b≠c → false
  isPalindromeRange(0,1)="ab" a≠b → false
  → false ✅

"deeee": l=0,r=4
  d!==e ← MISMATCH
  isPalindromeRange(1,4)="eeee" → true ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(n) — outer loop + one O(n) check at most |
| Space | O(1) |

---

## The Palindrome Two-Pointer Family

| Problem | Skip condition | Deletions |
|---|---|---|
| **Valid Palindrome (P82)** | Skip non-alphanumeric | 0 |
| **Valid Palindrome II (P83)** | Branch on mismatch | 1 |
| **k deletions** | Recursive / DP | k |

---

## Key Patterns & Takeaways

1. **Try both sides on mismatch** — skip `left` or skip `right`, check both subranges. Return true if either is a palindrome.
2. **One chance only** — `isPalindromeRange` is strict (no tolerance). Correctly enforces at most one deletion.
3. **Early return on mismatch** — `return A || B` exits immediately. No need to continue outer loop.
4. **O(n) total** — outer loop to first mismatch + one O(n) palindrome check = O(n), not O(n²).
5. **k > 1 deletions** — greedy two-pointer only works for k=1. For k > 1 need DP.