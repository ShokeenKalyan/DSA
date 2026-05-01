# 102 - Fractional Knapsack Problem

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/fractional-knapsack-problem-greedy-approach) | [GFG](https://practice.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1)  
**Difficulty:** Medium  
**Topic:** Greedy Algorithms

### Statement
Given `n` items with weights and values, and a knapsack of capacity `W`, find the maximum value achievable. **Fractions of items are allowed.**

```
items=[(v=60,w=10),(v=100,w=20),(v=120,w=30)], W=50
→ 240  (all item1, all item2, 2/3 of item3)

items=[(v=500,w=30)], W=10
→ 166.67  (take 10/30 fraction)
```

---

## Greedy Insight — Sort by Value/Weight Ratio

Each item can be thought of as a **liquid** — take the most valuable liquid per unit weight first.

```
ratio = value / weight

Sort by ratio descending. For each item:
  If entire item fits → take all, reduce capacity
  If item doesn't fit → take fraction = value × (remaining/weight), STOP
  If knapsack full → stop
```

**Why ratio, not value or weight alone?**
- Sort by value → might pick heavy low-efficiency items
- Sort by weight → might pick light but low-value items
- Only ratio captures "value per unit weight" correctly

---

## Solution (JavaScript)

```javascript
/**
 * Fractional Knapsack — Greedy
 * Time: O(n log n) | Space: O(1)
 */
function fractionalKnapsack(items, W) {
    // Sort by value/weight ratio descending
    items.sort((a, b) => (b.value / b.weight) - (a.value / a.weight));

    let totalValue = 0;
    let remaining = W;

    for (const item of items) {
        if (remaining === 0) break;

        if (item.weight <= remaining) {
            // Take entire item
            totalValue += item.value;
            remaining  -= item.weight;
        } else {
            // Take fraction to fill remaining capacity
            totalValue += item.value * (remaining / item.weight);
            remaining = 0; // Knapsack full
        }
    }

    return totalValue;
}

console.log(fractionalKnapsack(
    [{value:60,weight:10},{value:100,weight:20},{value:120,weight:30}], 50
)); // 240 ✅

console.log(fractionalKnapsack([{value:500,weight:30}], 10));
// 166.666... ✅

console.log(fractionalKnapsack(
    [{value:10,weight:2},{value:5,weight:3},{value:15,weight:5},
     {value:7,weight:1},{value:6,weight:4}], 10
)); // 35.33 ✅
```

---

## Dry Run

```
items=[(60,10),(100,20),(120,30)], W=50

Ratios: 6.0, 5.0, 4.0 → already sorted

item(60,10): 10≤50 → take all. value=60,  rem=40
item(100,20): 20≤40 → take all. value=160, rem=20
item(120,30): 30>20 → take 20/30
  value += 120×(20/30) = 80. value=240, rem=0

return 240.0 ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(n log n) — sort dominates |
| Space | O(1) |

---

## Fractional vs 0/1 Knapsack — Critical Distinction

| | Fractional | 0/1 Knapsack |
|---|---|---|
| Split items? | ✅ Yes | ❌ No |
| Approach | Greedy | DP |
| Time | O(n log n) | O(n×W) |
| Greedy works? | ✅ | ❌ |

**Why greedy fails for 0/1:**
```
items=[(60,10),(100,20),(120,30)], W=50

Greedy picks (60,10) first (ratio=6).
0/1 optimal: take (100,20)+(120,30)=220 > greedy's result.
Greedy gives wrong answer → DP needed for 0/1. ❌
```

The divisibility of fractional items is what makes greedy work.

---

## Why Greedy is Correct — Exchange Argument

```
Suppose solution S takes lower-ratio item B before higher-ratio item A.
Replace 1kg of B with 1kg of A in S:
  Value changes by (ratio_A - ratio_B) × 1 > 0 → improvement.

∴ Any non-ratio-sorted solution can be improved.
By induction: ratio-sorted greedy is optimal. ✅
```

---

## Key Details

```
Fractional value formula:
  value_taken = item.value × (remainingCapacity / item.weight)

Three cases only:
  1. remaining === 0 → stop
  2. item.weight ≤ remaining → take all
  3. item.weight > remaining → take fraction, remaining=0, stop
```

---

## Key Patterns & Takeaways

1. **Sort by value/weight ratio** — canonical greedy for fractional knapsack. Highest ratio = fill first.
2. **Three cases** — full knapsack (stop), item fits (take all), item overflows (take fraction, stop).
3. **Fractional formula** — `value × (remaining/weight)`. Precise partial-item calculation.
4. **Greedy correct here, DP for 0/1** — divisibility makes greedy work. Without it, greedy fails. Most important interview distinction.
5. **Exchange argument** — replacing any lower-ratio item with a higher-ratio one improves value. Proves greedy is optimal by induction.