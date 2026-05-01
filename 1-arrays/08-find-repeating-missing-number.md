# 11 - Find the Repeating and Missing Numbers

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/find-the-repeating-and-missing-numbers)  
**Difficulty:** Hard  
**Topic:** Arrays, Math, Bit Manipulation

### Statement
Given an array of `n` integers containing numbers from `1` to `n`, exactly **one number is repeated** and **one is missing**. Find both.

```
Input:  [3, 1, 2, 5, 4, 6, 7, 5]  →  repeating=5, missing=8
Input:  [3, 1, 2, 5, 3]            →  repeating=3, missing=4
```

---

## Approaches

| Approach | Time | Space | Notes |
|---|---|---|---|
| Brute Force | O(n²) | O(1) | Count each number — too slow |
| Count Array | O(n) | O(n) | freq=2 is repeating, freq=0 is missing |
| **Math** | **O(n)** | **O(1)** | Two equations, two unknowns |
| **XOR** | **O(n)** | **O(1)** | Most elegant, no overflow risk |

---

## Approach 3 — Math (Sum + Sum of Squares)

**Setup:** Let `X` = repeating, `Y` = missing.

```
S    = n*(n+1)/2          (expected sum of [1..n])
S2   = n*(n+1)*(2n+1)/6   (expected sum of squares)
sumA  = actual array sum
sum2A = actual sum of squares

Equation 1: X - Y = sumA - S                        ... (i)
Equation 2: X + Y = (sum2A - S2) / (X - Y)          ... (ii)
            [from X²-Y² = (X+Y)(X-Y) = sum2A - S2]

Solve: X = ((X+Y) + (X-Y)) / 2    (repeating)
       Y = ((X+Y) - (X-Y)) / 2    (missing)
```

**Why sum of squares?** `X - Y` alone gives one equation with two unknowns. Sum of squares provides a second independent equation via the difference-of-squares factorization `X² - Y² = (X+Y)(X-Y)`.

---

## Approach 4 — XOR (Most Elegant)

**Core insight:** XOR of all array elements AND all `1..n` — everything that appears exactly once cancels (`a^a=0`). Left with `X XOR Y`. Then use the rightmost set bit to partition into two groups, isolating X and Y.

```
Step 1: xorAll = XOR(all nums) ^ XOR(1..n) = X ^ Y
Step 2: rightmostBit = xorAll & (-xorAll)
Step 3: Partition all numbers by rightmostBit → two groups
        XOR each group → get X and Y (in some order)
Step 4: Check array frequency to assign repeating vs missing
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 2: Count Array — O(n) time, O(n) space
// ─────────────────────────────────────────────────────────
function findRepeatMissingCount(nums) {
    const n = nums.length;
    const count = new Array(n + 1).fill(0);

    for (const num of nums) count[num]++;

    let repeating = -1, missing = -1;
    for (let i = 1; i <= n; i++) {
        if (count[i] === 2) repeating = i;
        if (count[i] === 0) missing = i;
    }
    return [repeating, missing];
}


// ─────────────────────────────────────────────────────────
// APPROACH 3: Math — O(n) time, O(1) space
// ─────────────────────────────────────────────────────────
function findRepeatMissingMath(nums) {
    const n = nums.length;
    const S   = (n * (n + 1)) / 2;
    const S2  = (n * (n + 1) * (2 * n + 1)) / 6;

    let sumA = 0, sum2A = 0;
    for (const num of nums) {
        sumA  += num;
        sum2A += num * num;
    }

    const diff  = sumA - S;               // X - Y
    const sumXY = (sum2A - S2) / diff;    // X + Y

    const X = (sumXY + diff) / 2;   // repeating
    const Y = (sumXY - diff) / 2;   // missing

    return [X, Y];
}


// ─────────────────────────────────────────────────────────
// APPROACH 4: XOR — O(n) time, O(1) space
// ─────────────────────────────────────────────────────────
function findRepeatMissingXOR(nums) {
    const n = nums.length;

    // Step 1: XOR all array elements and 1..n → leaves X^Y
    let xorAll = 0;
    for (let i = 0; i < n; i++) {
        xorAll ^= nums[i];
        xorAll ^= (i + 1);
    }

    // Step 2: Isolate rightmost set bit (differs between X and Y)
    const rightmostBit = xorAll & (-xorAll);

    // Step 3: Partition all numbers by this bit and XOR each group
    let xorGroup1 = 0, xorGroup2 = 0;
    for (let i = 0; i < n; i++) {
        if (nums[i] & rightmostBit) xorGroup1 ^= nums[i];
        else                        xorGroup2 ^= nums[i];

        if ((i + 1) & rightmostBit) xorGroup1 ^= (i + 1);
        else                        xorGroup2 ^= (i + 1);
    }

    // Step 4: Determine which is repeating vs missing
    let count = 0;
    for (const num of nums) if (num === xorGroup1) count++;

    return count === 2
        ? [xorGroup1, xorGroup2]   // xorGroup1 is repeating
        : [xorGroup2, xorGroup1];  // xorGroup2 is repeating
}

// Test cases
console.log(findRepeatMissingMath([3, 1, 2, 5, 4, 6, 7, 5])); // [5, 8] ✅
console.log(findRepeatMissingMath([3, 1, 2, 5, 3]));           // [3, 4] ✅
console.log(findRepeatMissingXOR([3, 1, 2, 5, 4, 6, 7, 5]));  // [5, 8] ✅
console.log(findRepeatMissingXOR([3, 1, 2, 5, 3]));            // [3, 4] ✅
```

---

## Dry Run — Math Approach

```
nums = [3, 1, 2, 5, 3],  n = 5

S   = 5*6/2   = 15,  S2  = 5*6*11/6 = 55
sumA = 14,           sum2A = 48

X - Y = 14 - 15 = -1
X + Y = (48 - 55) / (-1) = 7

X = (7 + (-1)) / 2 = 3  → repeating ✅
Y = (7 - (-1)) / 2 = 4  → missing  ✅
```

---

## Dry Run — XOR Approach

```
nums = [3, 1, 2, 5, 3],  n = 5

Step 1: xorAll = (3^1^2^5^3) ^ (1^2^3^4^5) = 3^4 = 7 (0111)
Step 2: rightmostBit = 7 & -7 = 1 (bit 0)
Step 3: Partition by bit 0 (odd vs even):
  Odd  (bit=1): 3,1,5,3 from array + 1,3,5 from [1..5]
               → xorGroup1 = 3^1^5^3^1^3^5 = 3
  Even (bit=0): 2 from array + 2,4 from [1..5]
               → xorGroup2 = 2^2^4 = 4
Step 4: count of 3 in array = 2 → repeating=3, missing=4 ✅
```

---

## ⚠️ Overflow Warning (Math Approach)

For large `n`, `n*(n+1)*(2n+1)/6` can overflow 32-bit integers. JavaScript uses 64-bit floats (safe up to 2^53), but for very large `n` or other languages:
```javascript
// Safe for large n using BigInt:
const S2 = Number(BigInt(n) * BigInt(n+1) * BigInt(2*n+1) / 6n);
```

---

## Key Patterns & Takeaways

1. **Two unknowns → two equations** — Sum gives `X-Y`, sum of squares gives `X²-Y²`. Factor via `(X+Y)(X-Y)` to get `X+Y`. Classic algebra template.
2. **XOR cancellation** — numbers appearing an even number of times cancel out. Repeating appears 3 times (odd), missing appears once (odd) → both survive XOR. Core XOR technique.
3. **`n & (-n)` isolates rightmost set bit** — two numbers differing at this bit end up in different groups. Fundamental bit manipulation.
4. **Difference of squares factorization** — `X² - Y² = (X+Y)(X-Y)`. The algebraic trick powering Approach 3.
5. **Overflow awareness** — always mention for sum-of-squares approaches. Shows senior engineering maturity.