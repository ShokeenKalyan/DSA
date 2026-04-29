# 94 - Group Anagrams

## Problem
**LeetCode:** [#49 Group Anagrams](https://leetcode.com/problems/group-anagrams/)  
**Difficulty:** Medium  
**Topic:** Strings, Hashing

### Statement
Group strings that are anagrams of each other. Return in any order.

```
["eat","tea","tan","ate","nat","bat"]
→ [["eat","tea","ate"],["tan","nat"],["bat"]]
```

---

## Intuition — Canonical Key → HashMap

All anagrams produce the same canonical form. Use it as a HashMap key.

**Two key options:**
- **Sorted string:** `"eat"` → `"aet"`. O(k log k) — clean and standard.
- **Freq array:** `"eat"` → `"1#0#0#0#1#..."`. O(k) — faster, heavier key.

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #49 — Group Anagrams
 * Time: O(n×k log k) | Space: O(n×k)
 */

// APPROACH 1: Sorted String Key — O(n×k log k) ✅
function groupAnagrams(strs) {
    const map = new Map();

    for (const str of strs) {
        const key = str.split('').sort().join(''); // Canonical form
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(str);
    }

    return [...map.values()];
}


// APPROACH 2: Frequency Array Key — O(n×k)
function groupAnagramsFreq(strs) {
    const map = new Map();
    const a = 'a'.charCodeAt(0);

    for (const str of strs) {
        const freq = new Array(26).fill(0);
        for (const c of str) freq[c.charCodeAt(0) - a]++;
        const key = freq.join('#'); // '#' delimiter prevents collisions
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(str);
    }

    return [...map.values()];
}

console.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));
// [["eat","tea","ate"],["tan","nat"],["bat"]] ✅
console.log(groupAnagrams([[""]]));  // [[""]] ✅
console.log(groupAnagrams(["a"]));   // [["a"]] ✅
```

---

## Dry Run

```
"eat"→"aet", "tea"→"aet", "tan"→"ant",
"ate"→"aet", "nat"→"ant", "bat"→"abt"

map: {"aet":["eat","tea","ate"], "ant":["tan","nat"], "abt":["bat"]}

return [[...], [...], [...]] ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| **Sorted key** | **O(n×k log k)** | **O(n×k)** |
| Freq key | O(n×k) | O(n×k) |

---

## Key Patterns & Takeaways

1. **Canonical key = sorted string** — all anagrams produce the same sorted form. The go-to approach.
2. **`#` delimiter in freq key** — prevents collisions between different frequency arrays (e.g. `[1,12]` vs `[11,2]`).
3. **`[...map.values()]`** — clean one-liner to get array of groups.
4. **Connection to Valid Anagram (P93)** — same frequency idea, applied as HashMap key instead of direct equality check.
5. **"Canonical key → group" pattern** — generalises to any equivalence grouping problem.