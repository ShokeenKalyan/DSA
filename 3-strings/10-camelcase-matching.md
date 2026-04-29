# 88 - CamelCase Matching

## Problem
**LeetCode:** [#1023 Camelcase Matching](https://leetcode.com/problems/camelcase-matching/)  
**Difficulty:** Medium  
**Topic:** Two Pointers, Strings

### Statement
For each query, return `true` if inserting only lowercase letters into `pattern` can produce the query. Uppercase letters must match exactly.

```
queries=["FooBar","FooBarTest","FootBall","FrameBuffer","ForceFeedBack"], pattern="FB"
→ [true,false,true,true,false]
```

---

## Intuition — Is Subsequence + Uppercase Constraint

```
Is Subsequence (P56): pattern is a subsequence of query.
                      Unmatched query chars: any allowed.

CamelCase Matching:   pattern is a subsequence of query.
                      Unmatched query chars: must be LOWERCASE.
                      Unmatched UPPERCASE in query → false.
```

**Three cases per query character:**
```
query[j] === pattern[i]        → match, advance both
query[j] ≠ pattern[i], lowercase → valid insertion, skip j
query[j] ≠ pattern[i], UPPERCASE → invalid → false
```

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #1023 — CamelCase Matching
 * Time: O(q × n) | Space: O(1) per query
 */
function isUpperCase(c) { return c >= 'A' && c <= 'Z'; }

function matchesPattern(query, pattern) {
    let i = 0; // Pattern pointer

    for (let j = 0; j < query.length; j++) {
        if (i < pattern.length && query[j] === pattern[i]) {
            i++; // Match → advance pattern
        } else if (isUpperCase(query[j])) {
            return false; // Unmatched uppercase → invalid
        }
        // Unmatched lowercase → valid insertion → continue
    }

    return i === pattern.length; // All pattern chars consumed?
}

function camelMatch(queries, pattern) {
    return queries.map(q => matchesPattern(q, pattern));
}

console.log(camelMatch(
    ["FooBar","FooBarTest","FootBall","FrameBuffer","ForceFeedBack"], "FB"
)); // [true,false,true,true,false] ✅

console.log(camelMatch(
    ["FooBar","FooBarTest","FootBall","FrameBuffer"], "FoBa"
)); // [true,false,true,false] ✅
```

---

## Dry Run

```
query="FooBarTest", pattern="FB"

j=0: 'F'==='F' → match, i=1
j=1-2: 'o','o' lowercase → skip
j=3: 'B'==='B' → match, i=2
j=4-5: 'a','r' lowercase → skip
j=6: 'T' UPPERCASE, i=2=pattern.length → 'T'!==pattern[2](OOB)
     isUpperCase('T') → false ✅

query="FrameBuffer", pattern="FB"

j=0: 'F'==='F' → match, i=1
j=1-4: lowercase → skip
j=5: 'B'==='B' → match, i=2
j=6-9: lowercase → skip
i=2===2 → true ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(q × n) |
| Space | O(1) per query |

---

## vs Is Subsequence (P56)

| | Is Subsequence | CamelCase |
|---|---|---|
| Subsequence check | ✅ | ✅ |
| Unmatched chars | Any OK | Lowercase only |
| Extra rule | None | Uppercase → false |

---

## Key Patterns & Takeaways

1. **Is Subsequence + uppercase constraint** — the whole problem. Pattern as subsequence, unmatched chars must be lowercase.
2. **Three exhaustive cases** — match, lowercase skip, uppercase fail. Clean and complete.
3. **Iterate query outer loop** — ensures every query char is checked for uppercase constraint, even after pattern is fully matched.
4. **`i < pattern.length` guard** — when pattern exhausted, any remaining uppercase in query still fails.
5. **`return i === pattern.length`** — pattern must be fully consumed. Early query end → false.