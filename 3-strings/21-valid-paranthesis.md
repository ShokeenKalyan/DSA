# 98 - Valid Parentheses

## Problem
**LeetCode:** [#20 Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)  
**Difficulty:** Easy  
**Topic:** Stack, Strings

### Statement
Return `true` if brackets are valid — every open bracket closed by same type in correct order.

```
"()"     →  true
"()[]{}" →  true
"(]"     →  false
"([)]"   →  false
"{[]}"   →  true
```

---

## Intuition — Stack for Matching

Opening bracket → push.  
Closing bracket → must match top of stack → pop.  
After all chars: stack must be empty.

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #20 — Valid Parentheses
 * Time: O(n) | Space: O(n)
 */
function isValid(s) {
    const stack = [];
    const match = { ')':'(', '}':'{', ']':'[' };

    for (const ch of s) {
        if (ch === '(' || ch === '{' || ch === '[') {
            stack.push(ch);
        } else {
            // Closing: stack must have matching opener on top
            if (!stack.length || stack[stack.length-1] !== match[ch])
                return false;
            stack.pop();
        }
    }

    return stack.length === 0; // Unmatched opens → false
}

console.log(isValid("()"));      // true  ✅
console.log(isValid("()[]{}")); // true  ✅
console.log(isValid("(]"));     // false ✅
console.log(isValid("([)]"));   // false ✅
console.log(isValid("{[]}"));   // true  ✅
console.log(isValid("("));      // false ✅
console.log(isValid(")"));      // false ✅
```

---

## Dry Run

```
"{[]}":
  '{' → push. stack=['{']
  '[' → push. stack=['{','[']
  ']' → match='[', top='[' ✅ → pop. stack=['{']
  '}' → match='{', top='{' ✅ → pop. stack=[]
  → true ✅

"([)]":
  '(' → push. '['→push. stack=['(','[']
  ')' → match='(', top='[' ≠ '(' → false ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(n) |
| Space | O(n) |

---

## Key Patterns & Takeaways

1. **Push opens, check+pop closes** — canonical stack matching. Works for any nested pair matching.
2. **HashMap for pair lookup** — `{')':'(', '}':'{', ']':'['}`. O(1) per lookup.
3. **Two failure conditions** — empty stack on close (too many closers) OR non-empty at end (too many openers).
4. **`!stack.length` guard** — check before peeking at top. Prevents undefined access.
5. **Foundation for harder stack problems** — Largest Rectangle, Daily Temperatures, Next Greater Element all use push/pop-on-condition pattern.