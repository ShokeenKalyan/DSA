# 107 - Add Strings

## Problem
**LeetCode:** [#415 Add Strings](https://leetcode.com/problems/add-strings/)  
**Difficulty:** Easy  
**Topic:** Strings, Math, Simulation

### Statement
Add two non-negative integers given as strings. Return sum as string. No direct integer conversion.

```
"11",  "123"  →  "134"
"456", "77"   →  "533"
"999", "1"    →  "1000"
```

---

## Intuition — Grade-School Addition Right to Left

Walk both strings from right to left, add digits + carry, collect result digits (reversed), then reverse at end. Same carry propagation as Add Two Numbers (P27).

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #415 — Add Strings
 * Time: O(max(m,n)) | Space: O(max(m,n))
 */
function addStrings(num1, num2) {
    let i = num1.length - 1;
    let j = num2.length - 1;
    let carry = 0;
    const result = [];

    while (i >= 0 || j >= 0 || carry > 0) {
        const d1 = i >= 0 ? num1.charCodeAt(i--) - 48 : 0;
        const d2 = j >= 0 ? num2.charCodeAt(j--) - 48 : 0;

        const sum = d1 + d2 + carry;
        result.push(sum % 10);
        carry = Math.floor(sum / 10);
    }

    return result.reverse().join('');
}

console.log(addStrings("11",  "123")); // "134"  ✅
console.log(addStrings("456", "77"));  // "533"  ✅
console.log(addStrings("0",   "0"));   // "0"    ✅
console.log(addStrings("999", "1"));   // "1000" ✅
```

---

## Dry Run

```
"456" + "77": i=2,j=1

6+7+0=13 → push 3, carry=1
5+7+1=13 → push 3, carry=1
4+0+1=5  → push 5, carry=0

[3,3,5] → reverse → "533" ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(max(m,n)) |
| Space | O(max(m,n)) |

---

## Connection to Add Two Numbers (P27)

| | Add Two Numbers | Add Strings |
|---|---|---|
| Input | Linked list | String |
| Direction | Forward (LL reversed) | Right to left |
| Carry logic | Identical | Identical |

---

## Key Patterns & Takeaways

1. **`charCodeAt(i) - 48`** — char to int. `'0'=48`, so `'9'-48=9`. Cleaner than `parseInt`.
2. **Three-condition while** — `i>=0 || j>=0 || carry>0`. Handles length mismatch and final carry.
3. **Push + reverse** — O(1) push vs O(n) unshift. Reverse once at the end.
4. **`d = i>=0 ? digit : 0`** — treat exhausted string as zeros. Handles unequal lengths naturally.
5. **Carry propagation family** — Add Two Numbers (P27), Add Strings (P107), Plus One (P44) all use identical carry logic on different structures.