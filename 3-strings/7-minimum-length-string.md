# 85 - Minimum Length of String After Deleting Similar Ends

## Problem
**LeetCode:** [#1750 Minimum Length of String After Deleting Similar Ends](https://leetcode.com/problems/minimum-length-of-string-after-deleting-similar-ends/)  
**Difficulty:** Medium  
**Topic:** Two Pointers, Strings

### Statement
Repeatedly delete the longest equal prefix and suffix sharing the same character. Return the minimum length remaining.

```
"ca"       →  2  (no matching ends)
"cabacc"   →  1  (c+cc → "aba" → a+a → "b")
"aabccabba" → 3
"aaaa"     →  0  (fully consumed)
```

---

## Intuition — Shrink from Both Ends

Two pointers inward. While `s[left] === s[right]`:
1. Save the matching character `ch`
2. Eat ALL left occurrences of `ch` (`left++` while `s[left]===ch`)
3. Eat ALL right occurrences of `ch` (`right--` while `s[right]===ch`)
4. Repeat

Return `max(0, right-left+1)`.

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #1750 — Minimum Length After Deleting Similar Ends
 * Time: O(n) | Space: O(1)
 */
function minimumLength(s) {
    let left = 0, right = s.length - 1;

    while (left < right && s[left] === s[right]) {
        const ch = s[left]; // Character to consume

        // Eat entire run of ch from left
        while (left <= right && s[left] === ch)  left++;

        // Eat entire run of ch from right
        while (left <= right && s[right] === ch) right--;
    }

    return Math.max(0, right - left + 1);
}

console.log(minimumLength("ca"));          // 2 ✅
console.log(minimumLength("cabacc"));      // 1 ✅
console.log(minimumLength("aabccabba"));   // 3 ✅
console.log(minimumLength("aaaa"));        // 0 ✅
console.log(minimumLength("a"));           // 1 ✅
```

---

## Dry Run

```
s="aabccabba"

left=0,right=8: a===a → ch='a'
  eat left:  aa → left=2
  eat right: a  → right=7   → "bccabb"

left=2,right=7: b===b → ch='b'
  eat left:  b  → left=3
  eat right: bb → right=5   → "cca"

left=3,right=5: c!==a → STOP
return 5-3+1 = 3 ✅

s="aaaa"
left=0,right=3: a===a → ch='a'
  eat left:  aaaa → left=4 (past right)
  eat right: already past → right stays or decrements
  → left=4,right=3 (crossed)
Outer: left>right → STOP
return max(0, 3-4+1)=max(0,0)=0 ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(n) — each char visited once |
| Space | O(1) |

---

## Key Details

```
1. Inner loops use left <= right (not <):
   Pointers can meet at same index while eating.

2. Outer loop: left < right AND s[left]===s[right]:
   Both conditions needed — stop on cross or mismatch.

3. Math.max(0, right-left+1):
   When left > right, result is negative → max returns 0.

4. Record ch before eating:
   Eat entire run, not just one character.
```

---

## Key Patterns & Takeaways

1. **"Eat entire run" inner loops** — consume ALL consecutive occurrences from each end. Not just one step — the full run of that character.
2. **`left <= right` in inner loops** — pointers can meet mid-string. `<` would leave the middle char incorrectly unhandled.
3. **`Math.max(0, right-left+1)`** — handles fully-consumed case elegantly. Negative result → 0.
4. **Outer: match check + cross check** — `left < right && s[left]===s[right]`. Both needed.
5. **Same "shrink from ends" skeleton** — connects to Valid Palindrome (P82) and Valid Palindrome II (P83). This variant eats entire runs instead of single characters.