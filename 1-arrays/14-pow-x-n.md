# 14 - Implement Pow(x, n)

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/implement-powxn-x-raised-to-the-power-n) | [LeetCode #50](https://leetcode.com/problems/powx-n/)  
**Difficulty:** Medium  
**Topic:** Math, Recursion, Binary Exponentiation

### Statement
Implement `pow(x, n)` — compute `xⁿ` without using `Math.pow`.

```
x=2.00,  n=10   →  1024.0
x=2.00,  n=-2   →  0.25   (= 1/4)
x=2.10,  n=3    →  9.261
```

---

## Intuition

**Brute Force O(n):** multiply `x` by itself `n` times. For `n = 2^31` → ~2 billion ops. Too slow.

**Binary Exponentiation O(log n):** square at each step to halve the exponent.

```
x^8 (brute):   x×x×x×x×x×x×x×x = 8 multiplications
x^8 (optimal): x² → x⁴ → x⁸   = 3 squarings only
```

**The rule:**
```
n even: x^n = (x²)^(n/2)        → square x, halve n
n odd:  x^n = x × (x²)^((n-1)/2)→ peel one x, then square and halve
```

**Mental model — n's binary representation:**
```
n = 13 = 1101₂ = 2³ + 2² + 2⁰
x^13 = x^8 × x^4 × x^1

Algorithm processes each bit of n:
  bit=1 → multiply current x into result
  either way → square x and shift n right
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Brute Force — O(n) time, O(1) space
// ─────────────────────────────────────────────────────────
function myPowBrute(x, n) {
    if (n < 0) { x = 1 / x; n = -n; }
    let result = 1;
    for (let i = 0; i < n; i++) result *= x;
    return result;
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Recursive Binary Exponentiation — O(log n)
// O(log n) stack depth — elegant but stack risk for huge n
// ─────────────────────────────────────────────────────────
function myPowRecursive(x, n) {
    if (n === 0) return 1;
    if (n < 0)   return myPowRecursive(1 / x, -n);

    if (n % 2 === 0) {
        return myPowRecursive(x * x, n / 2);    // even: square and halve
    } else {
        return x * myPowRecursive(x * x, (n - 1) / 2); // odd: peel one x
    }
}


// ─────────────────────────────────────────────────────────
// APPROACH 3: Iterative Binary Exponentiation — O(log n) ✅
// O(1) space — preferred in interviews (no stack overflow risk)
// Processes each bit of n using repeated squaring
// ─────────────────────────────────────────────────────────
function myPow(x, n) {
    let power = n;

    // Handle negative exponent: x^(-n) = (1/x)^n
    if (power < 0) {
        x = 1 / x;
        power = -power;
    }

    let result = 1;

    while (power > 0) {
        if (power % 2 === 1) {  // current LSB is 1
            result *= x;         // include this power of x in result
        }
        x *= x;                              // square x for next bit position
        power = Math.floor(power / 2);       // shift right to next bit
    }

    return result;
}

// Test cases
console.log(myPow(2, 10));          // 1024     ✅
console.log(myPow(2, -2));          // 0.25     ✅
console.log(myPow(2.1, 3));         // 9.261... ✅
console.log(myPow(2, 0));           // 1        ✅
console.log(myPow(-2, 3));          // -8       ✅
console.log(myPow(-2, 4));          // 16       ✅
console.log(myPow(1, 2147483647));  // 1        ✅ (huge n, still O(log n))
```

---

## Dry Run — Iterative (x=2, n=13 = 1101₂)

```
power=13, x=2,   result=1
  13%2=1 → result=1×2=2,    x=4,   power=6
power=6,  x=4,   result=2
  6%2=0  → result unchanged, x=16,  power=3
power=3,  x=16,  result=2
  3%2=1  → result=2×16=32,  x=256, power=1
power=1,  x=256, result=32
  1%2=1  → result=32×256=8192, power=0

Answer: 8192  (= 2^13) ✅
```

---

## Complexity

| Approach | Time | Space | Notes |
|---|---|---|---|
| Brute Force | O(n) | O(1) | Too slow for n = 2³¹ |
| Recursive | O(log n) | O(log n) | Stack depth = O(log n) |
| **Iterative** | **O(log n)** | **O(1)** | Preferred — no stack risk |

---

## Edge Cases

| Case | Input | Output | Note |
|---|---|---|---|
| Zero exponent | `x=5, n=0` | `1` | Any base ^ 0 = 1 |
| Negative exponent | `x=2, n=-3` | `0.125` | `1/x`, then `+n` |
| Negative base, odd n | `x=-2, n=3` | `-8` | Sign preserved naturally |
| Negative base, even n | `x=-2, n=4` | `16` | Squaring removes sign |
| `n = INT_MIN` (-2³¹) | JS safe | — | In Java/C++: `-n` overflows! Cast to `long` |

---

## Key Patterns & Takeaways

1. **Binary exponentiation = repeated squaring** — foundational technique reducing O(n) → O(log n). Appears in modular exponentiation (cryptography), matrix exponentiation, Fibonacci in O(log n).
2. **Iterative > Recursive** — both O(log n) time, but iterative is O(1) space vs O(log n) stack. Always prefer iterative in interviews.
3. **n's binary representation** — the clearest mental model. Each bit of n tells you whether to include the current power of x. Process LSB to MSB while squaring x.
4. **Negative exponent** — flip x to `1/x` and negate n. Do this before the loop, not inside.
5. **INT_MIN overflow** — in Java/C++: `-(-2^31)` overflows. Fix: `long power = Math.abs((long)n)`. JS is safe (64-bit float). Mentioning this signals production awareness.
6. **Modular exponentiation follow-up** — same algorithm, add `% m` after each multiplication. Foundation of RSA and other cryptographic systems.