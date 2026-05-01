# 44 - Plus One

## Problem
**LeetCode:** [#66 Plus One](https://leetcode.com/problems/plus-one/)  
**Difficulty:** Easy  
**Topic:** Arrays, Math, Carry Propagation

### Statement
Increment a large integer represented as a digit array by one.

```
[1,2,3]   →  [1,2,4]
[1,2,9]   →  [1,3,0]
[9,9,9]   →  [1,0,0,0]
```

---

## Intuition — Walk Right to Left, Stop on No Carry

Walk from the last digit backwards:
- `digit < 9` → increment and **return immediately** (no carry, done)
- `digit === 9` → set to 0, carry propagates left
- If loop finishes (all 9s) → prepend 1

**Early return makes common case O(1).**

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #66 — Plus One
 * Time: O(1) amortized (early return), O(n) worst (all 9s)
 * Space: O(1) in-place, O(n) only when new digit needed
 */
function plusOne(digits) {
    for (let i = digits.length - 1; i >= 0; i--) {
        if (digits[i] < 9) {
            digits[i]++;
            return digits; // No carry — done immediately
        }
        digits[i] = 0; // Was 9 → becomes 0, carry continues
    }

    // All digits were 9 → need new leading 1
    digits.unshift(1);
    return digits;
}

console.log(plusOne([1,2,3])); // [1,2,4]   ✅
console.log(plusOne([1,2,9])); // [1,3,0]   ✅
console.log(plusOne([9,9,9])); // [1,0,0,0] ✅
console.log(plusOne([9]));      // [1,0]     ✅
```

---

## Dry Run

```
[9,9,9]:
i=2: 9→0, carry  →  [9,9,0]
i=1: 9→0, carry  →  [9,0,0]
i=0: 9→0, carry  →  [0,0,0]
Loop ends → unshift(1) → [1,0,0,0] ✅

[1,2,9]:
i=2: 9→0, carry  →  [1,2,0]
i=1: 2<9 → 3, return  →  [1,3,0] ✅
```

---

## Complexity

| Case | Time | Space |
|---|---|---|
| Last digit < 9 | O(1) | O(1) |
| k trailing 9s | O(k) | O(1) |
| All 9s | O(n) | O(n) |

---

## Key Patterns & Takeaways

1. **Walk right to left, stop on no carry** — early return when `digit < 9` makes this O(1) for most inputs. Critical optimisation.
2. **All-9s edge case** — only case needing a new digit. `unshift(1)` prepends cleanly.
3. **Same carry logic as Add Two Numbers (P27)** — Plus One is a simplified instantiation of the same carry propagation pattern.
4. **`unshift` vs spread** — `unshift(1)` mutates in-place; `[1, ...digits]` creates new array. Either is O(n) — pick whichever is clearer.