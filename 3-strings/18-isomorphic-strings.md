# 95 - Isomorphic Strings

## Problem
**LeetCode:** [#205 Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings/)  
**Difficulty:** Easy  
**Topic:** Strings, Hashing

### Statement
Return `true` if `s` and `t` are isomorphic — characters in `s` can be replaced to get `t`, preserving order, with a bijective mapping (no two chars map to the same char).

```
"egg",   "add"   →  true   (e→a, g→d)
"foo",   "bar"   →  false  (o maps to both a and r)
"paper", "title" →  true
"ab",    "aa"    →  false  (a and b both map to a)
```

---

## Intuition — Bidirectional Mapping (Two HashMaps)

One-way `s→t` map allows many-to-one (two source chars → same target). Need:
- `sToT`: `s[i]` must always map to same `t[i]`
- `tToS`: `t[i]` must not already be claimed by a different source char

Both checked at every position.

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #205 — Isomorphic Strings
 * Time: O(n) | Space: O(1) — at most 26 chars
 */

// Two HashMaps — O(n), O(1) ✅
function isIsomorphic(s, t) {
    const sToT = new Map();
    const tToS = new Map();

    for (let i = 0; i < s.length; i++) {
        const cs = s[i], ct = t[i];

        if (sToT.has(cs)) {
            // Existing mapping must match
            if (sToT.get(cs) !== ct) return false;
        } else {
            // New mapping — target must not be claimed
            if (tToS.has(ct)) return false;
            sToT.set(cs, ct);
            tToS.set(ct, cs);
        }
    }

    return true;
}

// Index comparison — O(n²), O(1) (elegant but slow)
function isIsomorphicIndex(s, t) {
    for (let i = 0; i < s.length; i++)
        if (s.indexOf(s[i]) !== t.indexOf(t[i])) return false;
    return true;
}

console.log(isIsomorphic("egg",   "add"));   // true  ✅
console.log(isIsomorphic("foo",   "bar"));   // false ✅
console.log(isIsomorphic("paper", "title")); // true  ✅
console.log(isIsomorphic("ab",    "aa"));    // false ✅
```

---

## Dry Run

```
s="ab", t="aa"

i=0: cs='a',ct='a' → new: sToT={a→a}, tToS={a→a}
i=1: cs='b',ct='a' → 'b' not in sToT
                      'a' IS in tToS → return false ✅

s="foo", t="bar"

i=0: f→b (new)
i=1: o→a (new)
i=2: sToT has o→a, but ct='r'≠'a' → false ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| **Two HashMaps** | **O(n)** | **O(1)** |
| Index comparison | O(n²) | O(1) |

---

## Why One HashMap Fails

```
s="ab", t="aa" — one-way sToT only:
  a→a ✅, b→a (new, added) ✅ → returns true ❌ WRONG

Reverse map tToS catches it:
  'a' already claimed by 'a' when 'b' tries to map to 'a' → false ✅
```

---

## Connection to Word Pattern (LC #290)

Same bidirectional map logic — just maps words instead of characters.

| | Isomorphic (P95) | Word Pattern (#290) |
|---|---|---|
| Unit | Character | Word |
| Core | Two char maps | Two word maps |

Know one → know both.

---

## Key Patterns & Takeaways

1. **Two maps for bijection** — one-way allows many-to-one. Reverse map catches two sources mapping to same target.
2. **Check existing before adding** — existing: verify match. New: verify target not claimed.
3. **Index shortcut O(n²)** — `indexOf(s[i])===indexOf(t[i])` elegant but slow. Mention as alternative.
4. **O(1) space** — 26 chars max regardless of input length.
5. **Word Pattern is identical** — same two-map logic on words. If you know this, Word Pattern is free.