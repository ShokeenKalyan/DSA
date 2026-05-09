# 108 - Shortest Distance to a Character

## Problem
**LeetCode:** [#821 Shortest Distance to a Character](https://leetcode.com/problems/shortest-distance-to-a-character/)  
**Difficulty:** Easy  
**Topic:** Strings, Two Passes

### Statement
Return array where `answer[i]` = shortest distance from index `i` to any occurrence of `c` in `s`.

```
s="loveleetcode", c="e"  →  [3,2,1,0,1,0,0,1,2,2,1,0]
s="aaab",         c="b"  →  [3,2,1,0]
```

---

## Intuition — Two Passes: Left Then Right

```
Pass 1 (L→R): distance from nearest 'c' to the LEFT of each index
Pass 2 (R→L): update with distance from nearest 'c' to the RIGHT
Answer: min(leftDist, rightDist) at each index
```

Same two-pass pattern as Trapping Rainwater (P34) and Product Except Self (P66).

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #821 — Shortest Distance to a Character
 * Time: O(n) | Space: O(n)
 */
function shortestToChar(s, c) {
    const n = s.length;
    const result = new Array(n).fill(Infinity);
    let prev = -Infinity;

    // Pass 1: L→R — distance from last 'c' seen on the left
    for (let i = 0; i < n; i++) {
        if (s[i] === c) prev = i;
        result[i] = i - prev;
    }

    prev = Infinity;

    // Pass 2: R→L — update with distance from next 'c' on the right
    for (let i = n-1; i >= 0; i--) {
        if (s[i] === c) prev = i;
        result[i] = Math.min(result[i], prev - i);
    }

    return result;
}

console.log(shortestToChar("loveleetcode", "e"));
// [3,2,1,0,1,0,0,1,2,2,1,0] ✅

console.log(shortestToChar("aaab", "b")); // [3,2,1,0] ✅
console.log(shortestToChar("aaba", "b")); // [2,1,0,1] ✅
```

---

## Dry Run

```
s="aaab", c="b"

Pass 1 (L→R), prev=-∞:
  i=0,1,2: 'a' → result=[∞,∞,∞,_]
  i=3: 'b' → prev=3, result[3]=0
  After: [∞,∞,∞,0]

Pass 2 (R→L), prev=∞:
  i=3: 'b' → prev=3, result[3]=min(0,0)=0
  i=2: result[2]=min(∞,1)=1
  i=1: result[1]=min(∞,2)=2
  i=0: result[0]=min(∞,3)=3

Final: [3,2,1,0] ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(n) — two passes |
| Space | O(n) — result array |

---

## Key Patterns & Takeaways

1. **Two-pass left-right** — closest occurrence in both directions: pass 1 tracks last seen (left), pass 2 tracks next seen (right). Take min. Reusable pattern.
2. **`prev = -Infinity` / `Infinity`** — initialise far outside array so first distances before first `c` are large but not zero.
3. **Distance formulas** — left: `i - prev`. Right: `prev - i`. Always non-negative by construction.
4. **Guaranteed occurrence** — problem guarantees `c` appears, so no `Infinity` remains in final result.
5. **Same pattern as P34, P66** — Trapping Rainwater and Product Except Self both use left pass + right pass combining with min/max.