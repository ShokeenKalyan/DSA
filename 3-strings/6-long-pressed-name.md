# 84 - Long Pressed Name

## Problem
**LeetCode:** [#925 Long Pressed Name](https://leetcode.com/problems/long-pressed-name/)  
**Difficulty:** Easy  
**Topic:** Two Pointers, Strings, Simulation

### Statement
Return `true` if `typed` could result from long-pressing characters in `name` (some chars may be repeated).

```
name="alex",  typed="aaleex"   →  true
name="saeed", typed="ssaaedd"  →  false
name="leelee",typed="lleeelee" →  true
```

---

## Intuition — Three Cases per Step

Walk `i` (name) and `j` (typed) simultaneously:

```
typed[j] === name[i]         → match → i++, j++
typed[j] === typed[j-1]      → long press of prev char → j++ only
otherwise                    → invalid → false
```

After loop: `i === name.length` (all of name consumed).

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #925 — Long Pressed Name
 * Time: O(m+n) | Space: O(1)
 */
function isLongPressedName(name, typed) {
    let i = 0, j = 0;

    while (j < typed.length) {
        if (i < name.length && typed[j] === name[i]) {
            i++; j++; // Direct match
        } else if (j > 0 && typed[j] === typed[j-1]) {
            j++;      // Long press of previous char
        } else {
            return false; // Invalid character
        }
    }

    return i === name.length; // All of name must be matched
}

console.log(isLongPressedName("alex",   "aaleex"));   // true  ✅
console.log(isLongPressedName("saeed",  "ssaaedd"));  // false ✅
console.log(isLongPressedName("leelee", "lleeelee")); // true  ✅
console.log(isLongPressedName("laiden", "laiden"));   // true  ✅
console.log(isLongPressedName("alex",   "aaleexa"));  // false ✅
```

---

## Dry Run

```
name="alex", typed="aaleex"

j=0: a===a → match, i=1,j=1
j=1: a!==l, a===a(prev) → long press, j=2
j=2: l===l → match, i=2,j=3
j=3: e===e → match, i=3,j=4
j=4: e!==x, e===e(prev) → long press, j=5
j=5: x===x → match, i=4,j=6

i(4)===name.length(4) → true ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(m+n) |
| Space | O(1) |

---

## Edge Cases

```
typed shorter than name  → i never reaches name.length → false
Extra chars at end       → no match + not long press → false
j=0 guard               → can't check typed[j-1] at start
name not fully consumed → return i===name.length catches this
```

---

## Connection to Is Subsequence (P56)

| | Is Subsequence (P56) | Long Pressed (P84) |
|---|---|---|
| Advance j when | Always | Match OR long press |
| Advance i when | Match | Match |
| Extra tolerance | None | Repeated prev char |

Long Pressed = Is Subsequence + long press exception for `j`.

---

## Key Patterns & Takeaways

1. **Three exhaustive cases** — match, long press, invalid. Every character handled exactly once.
2. **`j > 0` guard** — no previous char at `j=0`. Required before checking `typed[j-1]`.
3. **`return i === name.length`** — typed consumed but name might not be. Always verify.
4. **Simulation pattern** — describe all valid transitions, handle each, check end state.
5. **Is Subsequence connection** — same two-pointer skeleton with one added exception.