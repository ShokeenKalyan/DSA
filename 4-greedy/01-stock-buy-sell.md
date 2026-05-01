# 06 - Stock Buy and Sell

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/stock-buy-and-sell) | [LeetCode #121](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)  
**Difficulty:** Easy  
**Topic:** Arrays, Greedy

### Statement
Given an array `prices` where `prices[i]` is the stock price on day `i`, find the **maximum profit** from a **single buy-sell transaction**. Buy must happen before sell. Return `0` if no profit is possible.

```
Input:  [7, 1, 5, 3, 6, 4]
Output: 5   (buy day 1 @ price 1, sell day 4 @ price 6)

Input:  [7, 6, 4, 3, 1]
Output: 0   (no profitable transaction possible)
```

---

## Intuition

To maximize profit on sell day `j`, you want to have bought at the **lowest price seen before day `j`**.

Scan left to right:
- Track **minimum price seen so far** → your best buy opportunity
- At each day, compute `today's price − minPrice` → best profit if selling today
- Track the **maximum across all such profits**

One pass. O(n).

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Brute Force — O(n²) time, O(1) space
// ─────────────────────────────────────────────────────────
function maxProfitBrute(prices) {
    let maxProfit = 0;

    for (let i = 0; i < prices.length - 1; i++) {
        for (let j = i + 1; j < prices.length; j++) {
            const profit = prices[j] - prices[i];
            maxProfit = Math.max(maxProfit, profit);
        }
    }

    return maxProfit;
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Optimal — O(n) time, O(1) space
// ─────────────────────────────────────────────────────────
function maxProfit(prices) {
    // Track the minimum price seen so far (best buy opportunity)
    let minPrice = Infinity;

    // Track the maximum profit achievable
    let maxProfit = 0;

    for (let i = 0; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            // Found a new lower buying price — update best buy day
            minPrice = prices[i];
        } else {
            // Selling today at prices[i], having bought at minPrice
            const profit = prices[i] - minPrice;
            maxProfit = Math.max(maxProfit, profit);
        }
    }

    return maxProfit;
}

console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5  ✅
console.log(maxProfit([7, 6, 4, 3, 1]));     // 0  ✅
console.log(maxProfit([2, 4, 1]));            // 2  ✅
console.log(maxProfit([1]));                  // 0  ✅


// ─────────────────────────────────────────────────────────
// FOLLOW-UP: Return the buy and sell days too
// ─────────────────────────────────────────────────────────
function maxProfitWithDays(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    let buyDay = 0, sellDay = 0;
    let tempBuyDay = 0;

    for (let i = 0; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
            tempBuyDay = i;
        } else {
            const profit = prices[i] - minPrice;
            if (profit > maxProfit) {
                maxProfit = profit;
                buyDay = tempBuyDay;
                sellDay = i;
            }
        }
    }

    return { maxProfit, buyDay, sellDay };
}

console.log(maxProfitWithDays([7, 1, 5, 3, 6, 4]));
// { maxProfit: 5, buyDay: 1, sellDay: 4 } ✅


// ─────────────────────────────────────────────────────────
// BONUS: Stock Buy & Sell II — Unlimited Transactions
// LeetCode #122
// Key Insight: Capture every upward price movement
// Summing all upward slopes = globally optimal set of trades
// Time: O(n), Space: O(1)
// ─────────────────────────────────────────────────────────
function maxProfitII(prices) {
    let totalProfit = 0;

    for (let i = 1; i < prices.length; i++) {
        // If today's price > yesterday's, capture the gain
        if (prices[i] > prices[i - 1]) {
            totalProfit += prices[i] - prices[i - 1];
        }
    }

    return totalProfit;
}

console.log(maxProfitII([7, 1, 5, 3, 6, 4])); // 7
console.log(maxProfitII([1, 2, 3, 4, 5]));     // 4
console.log(maxProfitII([7, 6, 4, 3, 1]));     // 0
```

---

## Dry Run

```
Input: [7, 1, 5, 3, 6, 4]

i=0: price=7 → minPrice=7,  profit=0,  maxProfit=0
i=1: price=1 → 1 < 7, minPrice=1
i=2: price=5 → profit=5-1=4,  maxProfit=4
i=3: price=3 → profit=3-1=2,  maxProfit=4
i=4: price=6 → profit=6-1=5,  maxProfit=5  ✅
i=5: price=4 → profit=4-1=3,  maxProfit=5

Answer: 5
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute | O(n²) | O(1) |
| **Optimal** | **O(n)** | **O(1)** |

---

## Edge Cases

| Case | Input | Output | Note |
|---|---|---|---|
| Always decreasing | `[7,6,4,3,1]` | `0` | `maxProfit=0` init handles this |
| Single element | `[5]` | `0` | No sell day possible |
| All same | `[3,3,3]` | `0` | Profit always 0 |
| Monotonic increase | `[1,2,3,4]` | `3` | minPrice set on day 0 |

---

## The Full Stock Problem Family

| # | Problem | Constraint | Strategy |
|---|---|---|---|
| **I** | LC #121 | 1 transaction | Track `minPrice` greedily |
| **II** | LC #122 | Unlimited transactions | Greedy: sum all upward slopes |
| **III** | LC #123 | At most 2 transactions | DP with 4 states |
| **IV** | LC #188 | At most k transactions | DP generalised |
| **V** | LC #309 | Cooldown after sell | DP with 3 states |
| **VI** | LC #714 | Transaction fee | DP with 2 states |

---

## Key Patterns & Takeaways

1. **"Min so far" pattern** — tracking running minimum as you scan. Recurs in *Trapping Rain Water*, *Largest Rectangle in Histogram*.
2. **Greedy works for Part I & II** — no conflicting decisions. Part III+ breaks this and requires DP.
3. **`maxProfit = 0` init** — correctly handles no-profit case. Never use `-Infinity` here.
4. **Part II greedy insight** — summing all upward slopes equals the globally optimal set of trades. Elegant result worth understanding deeply.
5. **Know the full family** — senior interviewers often use this as a progression: Part I → "what if unlimited transactions?" → "what if at most 2?". Be ready for the DP escalation.