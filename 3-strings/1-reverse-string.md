# 79 - Reverse String

## Problem
**LeetCode:** [#344 Reverse String](https://leetcode.com/problems/reverse-string/)  
**Difficulty:** Easy  
**Topic:** Two Pointers, Strings

### Statement
Reverse a character array in-place. O(1) extra memory.

```
["h","e","l","l","o"]       →  ["o","l","l","e","h"]
["H","a","n","n","a","h"]   →  ["h","a","n","n","a","H"]
```

---

## Solution (JavaScript)

```javascript
// Two Pointer — O(n) time, O(1) space
function reverseString(s) {
    let left = 0, right = s.length - 1;
    while (left < right) {
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
}
```

---

## Key Takeaway

Purest form of **two-pointer swap**. Swap outermost, move inward, stop when pointers meet. Foundation of: Rotate Array (P45), Palindrome LL (P31), Next Permutation (P03), Reverse LL (P23).