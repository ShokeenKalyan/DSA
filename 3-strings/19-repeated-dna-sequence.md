# 96 - Repeated DNA Sequences

## Problem
**LeetCode:** [#187 Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences/)  
**Difficulty:** Medium  
**Topic:** Sliding Window, Hashing, Bit Manipulation

### Statement
Return all 10-letter substrings of DNA string `s` that appear more than once.

```
"AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"  →  ["AAAAACCCCC","CCCCCAAAAA"]
"AAAAAAAAAAAAA"                      →  ["AAAAAAAAAA"]
```

---

## Approaches

| Approach | Time | Space | Notes |
|---|---|---|---|
| **HashSet of substrings** | **O(n×10)=O(n)** | **O(n×10)** | Clean, standard |
| Rolling Hash (bit manip) | O(n) | O(n) | Integers vs strings |

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: HashSet of Substrings — O(n), O(n) ✅
// Two Sets: seen (all windows) + result (repeated only)
// ─────────────────────────────────────────────────────────
function findRepeatedDnaSequences(s) {
    const seen   = new Set();
    const result = new Set(); // Set prevents duplicate results

    for (let i = 0; i <= s.length - 10; i++) {
        const window = s.slice(i, i + 10);
        if (seen.has(window)) result.add(window);
        else seen.add(window);
    }

    return [...result];
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Rolling Hash — O(n), O(n)
// A=00, C=01, G=10, T=11 (2 bits each)
// 10-char window = 20 bits. Slide: shift left 2, mask.
// ─────────────────────────────────────────────────────────
function findRepeatedDnaSequencesHash(s) {
    const map  = { A:0, C:1, G:2, T:3 };
    const MASK = (1 << 20) - 1; // Keep only 20 bits

    const seen   = new Set();
    const result = new Set();
    let hash = 0;

    for (let i = 0; i < s.length; i++) {
        hash = ((hash << 2) | map[s[i]]) & MASK; // Slide window
        if (i >= 9) {
            if (seen.has(hash)) result.add(s.slice(i-9, i+1));
            else seen.add(hash);
        }
    }

    return [...result];
}

console.log(findRepeatedDnaSequences("AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"));
// ["AAAAACCCCC","CCCCCAAAAA"] ✅
console.log(findRepeatedDnaSequences("AAAAAAAAAAAAA")); // ["AAAAAAAAAA"] ✅
```

---

## Rolling Hash Pattern

```
Encoding: A=00, C=01, G=10, T=11
Window:   10 chars × 2 bits = 20 bits

Slide right by 1:
  hash = ((hash << 2) | newCharBits) & MASK

MASK = (1<<20)-1 automatically drops oldest char bits
after left shift grows hash beyond 20 bits.

General formula: MASK = (1 << 2L) - 1 for window size L
```

---

## Complexity

Both O(n) since L=10 is constant. Rolling hash uses integers (smaller memory per entry) instead of 10-char strings.

---

## Key Patterns & Takeaways

1. **Two Sets: `seen` + `result`** — `seen` tracks all windows; `result` (Set) prevents duplicates if same sequence appears 3+ times.
2. **Rolling hash for fixed windows** — encode small alphabet as bits, slide with `(hash<<bits | newBits) & MASK`. O(1) per slide vs O(L) substring creation.
3. **`MASK = (1<<2L)-1`** — keeps last L characters of bits. Left shift + mask automatically evicts oldest char.
4. **`result` as Set** — same sequence may appear many times. Set deduplicates output automatically.
5. **Fixed window L=10** — simpler than variable-window problems. No shrinking needed.