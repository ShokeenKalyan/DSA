# 71 - Heaters

## Problem
**LeetCode:** [#475 Heaters](https://leetcode.com/problems/heaters/)  
**Difficulty:** Medium  
**Topic:** Arrays, Binary Search, Two Pointers, Sorting

### Statement
Find the minimum radius such that all houses are covered by heaters.

```
houses=[1,2,3],   heaters=[2]    →  1
houses=[1,2,3,4], heaters=[1,4]  →  1
houses=[1,5],     heaters=[2]    →  3
```

---

## Core Insight — Max of Minimums

```
For each house → find closest heater → that's the minimum r for this house
Answer = max(closest heater distance for all houses)
```

---

## Approach 1 — Sort Heaters + Binary Search ✅

Sort heaters. For each house, lower bound gives first heater ≥ house. Closest is either that heater (right neighbor) or the one just before (left neighbor).

```
lo = lowerBound(heaters, house)

rightDist = lo < m ? heaters[lo] - house   : ∞
leftDist  = lo > 0 ? house - heaters[lo-1] : ∞
closest   = min(leftDist, rightDist)
```

## Approach 2 — Sort Both + Two Pointer

Sort both arrays. Walk heater pointer forward while next heater is closer to current house.

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Sort Heaters + Binary Search
// O((m+n) log m) time, O(1) space ✅
// ─────────────────────────────────────────────────────────
function findRadius(houses, heaters) {
    heaters.sort((a, b) => a - b);
    let minRadius = 0;

    for (const house of houses) {
        // Lower bound: first heater >= house
        let lo = 0, hi = heaters.length;
        while (lo < hi) {
            const mid = Math.floor((lo + hi) / 2);
            if (heaters[mid] < house) lo = mid + 1;
            else hi = mid;
        }

        const rightDist = lo < heaters.length ? heaters[lo] - house : Infinity;
        const leftDist  = lo > 0 ? house - heaters[lo-1] : Infinity;

        minRadius = Math.max(minRadius, Math.min(leftDist, rightDist));
    }

    return minRadius;
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Sort Both + Two Pointer
// O(n log n + m log m) time, O(1) space
// ─────────────────────────────────────────────────────────
function findRadiusTwoPointer(houses, heaters) {
    houses.sort((a, b) => a - b);
    heaters.sort((a, b) => a - b);
    let minRadius = 0, j = 0;

    for (const house of houses) {
        // Advance j while next heater is closer than current
        while (
            j < heaters.length - 1 &&
            Math.abs(heaters[j] - house) >= Math.abs(heaters[j+1] - house)
        ) j++;
        minRadius = Math.max(minRadius, Math.abs(heaters[j] - house));
    }

    return minRadius;
}

console.log(findRadius([1,2,3], [2]));         // 1 ✅
console.log(findRadius([1,2,3,4], [1,4]));     // 1 ✅
console.log(findRadius([1,5], [2]));            // 3 ✅
console.log(findRadius([1,2,3,4,5], [3]));     // 2 ✅
console.log(findRadius([1], [1]));              // 0 ✅
```

---

## Dry Run

```
houses=[1,2,3,4], heaters=[1,4]

house=1: lo=0, right=1-1=0, left=∞  → closest=0, radius=0
house=2: lo=1, right=4-2=2, left=2-1=1 → closest=1, radius=1
house=3: lo=1, right=4-3=1, left=3-1=2 → closest=1, radius=1
house=4: lo=1, right=4-4=0, left=4-1=3 → closest=0, radius=1

return 1 ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Sort + Binary Search | O((m+n) log m) | O(1) |
| Sort Both + Two Pointer | O((m+n) log(m+n)) | O(1) |

---

## Key Patterns & Takeaways

1. **"Max of minimums"** — each house contributes its minimum coverage requirement; answer = worst case across all houses.
2. **Lower bound for nearest neighbor** — binary search for insertion point gives two candidates (left & right neighbors). Pick closer. Use `Infinity` for missing side.
3. **Two pointer when both sorted** — advance heater pointer while next heater is closer. Elegant for when you want to avoid binary search.
4. **`Infinity` for boundary** — when `lo===0` (no left) or `lo===m` (no right), `Infinity` ensures `Math.min` picks the valid side.
5. **Real-world binary search** — sort the "database" (heaters), binary search for each "query" (house). The lower bound pattern from P67/P70 in a practical setting.