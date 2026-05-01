# 65 - Find the Pivot Integer

## Problem
**LeetCode:** [#2485 Find the Pivot Integer](https://leetcode.com/problems/find-the-pivot-integer/)  
**Difficulty:** Easy  
**Topic:** Math, Prefix Sum

### Statement
Find integer `x` where `1+2+...+x = x+(x+1)+...+n`. Return -1 if none.

```
n=8  →  6   (1..6 = 6..8 = 21)
n=1  →  1
n=4  →  -1
```

---

## The Math Derivation

```
leftSum(x)  = x*(x+1)/2
rightSum(x) = n*(n+1)/2 - (x-1)*x/2

Setting equal:
  x*(x+1)/2 = n*(n+1)/2 - x*(x-1)/2
  x*(x+1)/2 + x*(x-1)/2 = n*(n+1)/2
  x*[(x+1)+(x-1)]/2 = n*(n+1)/2
  x² = n*(n+1)/2

x = √(n*(n+1)/2)   — valid only if whole number
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Linear — O(n), O(1)
// ─────────────────────────────────────────────────────────
function findThePivotIntegerLinear(n) {
    const total = n * (n + 1) / 2;
    for (let x = 1; x <= n; x++) {
        const leftSum = x * (x + 1) / 2;
        const rightSum = total - leftSum + x;
        if (leftSum === rightSum) return x;
    }
    return -1;
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Math — O(1), O(1) ✅
// x² = n*(n+1)/2 → valid if √ is a whole number
// ─────────────────────────────────────────────────────────
function findThePivotInteger(n) {
    const target = n * (n + 1) / 2;
    const x = Math.sqrt(target);
    return Number.isInteger(x) ? x : -1;
}

// Safer for large n (avoids float imprecision):
function findThePivotIntegerSafe(n) {
    const target = n * (n + 1) / 2;
    const x = Math.round(Math.sqrt(target));
    return x * x === target ? x : -1;
}

console.log(findThePivotInteger(8));  // 6  ✅
console.log(findThePivotInteger(1));  // 1  ✅
console.log(findThePivotInteger(4));  // -1 ✅
```

---

## Dry Run

```
n=8: target=36, √36=6 (integer) → return 6 ✅
n=4: target=10, √10≈3.16 (not integer) → return -1 ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Linear | O(n) | O(1) |
| **Math** | **O(1)** | **O(1)** |

---

## Key Patterns & Takeaways

1. **`x² = n*(n+1)/2`** — algebraic derivation collapses both sides cleanly. Derive this in the interview, don't just state it.
2. **`Math.round(√t)² === t`** — safer integer check than `Number.isInteger` for large inputs.
3. **Sum formula `n*(n+1)/2`** — arithmetic series sum. Burns into memory.
4. **Connection to P63** — same "balance point" concept. P63 scans an arbitrary array; P65 exploits series structure for O(1).