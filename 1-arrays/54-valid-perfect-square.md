# 68 - Valid Perfect Square

## Problem
**LeetCode:** [#367 Valid Perfect Square](https://leetcode.com/problems/valid-perfect-square/)  
**Difficulty:** Easy  
**Topic:** Math, Binary Search

### Statement
Return `true` if `num` is a perfect square. No `Math.sqrt` allowed.

```
16  →  true   (4×4)
14  →  false
1   →  true
```

---

## Solution (JavaScript)

```javascript
// Binary Search — O(log n), O(1) ✅
function isPerfectSquare(num) {
    let lo = 1, hi = num;

    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const sq = mid * mid;

        if (sq === num) return true;
        else if (sq < num) lo = mid + 1;
        else hi = mid - 1;
    }

    return false;
}

console.log(isPerfectSquare(16)); // true  ✅
console.log(isPerfectSquare(14)); // false ✅
console.log(isPerfectSquare(1));  // true  ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Linear scan | O(√n) | O(1) |
| **Binary Search** | **O(log n)** | **O(1)** |

---

## Key Patterns & Takeaways

1. **Binary search on value space** — search `x` in `[1..num]` where `x*x = num`. Same as Sqrt(x) (LC #69) and Pow(x,n) (P14).
2. **Template 1 (`lo <= hi`)** — exact match search. Return true on match, false after loop.
3. **Overflow** — `mid*mid` overflows 32-bit in Java/C++. Use `long` or division: `mid <= num/mid`.