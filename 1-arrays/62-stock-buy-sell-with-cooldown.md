# 77 - Best Time to Buy and Sell Stock with Cooldown

## Problem
**LeetCode:** [#309 Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)  
**Difficulty:** Medium  
**Topic:** Dynamic Programming, State Machine

### Statement
Unlimited transactions but must wait one cooldown day after selling before buying. Maximise profit.

```
[1,2,3,0,2]  →  3   (buy@1,sell@2,cooldown,buy@0,sell@2)
[1]           →  0
[1,2]         →  1
```

---

## Intuition — Three States DP

At each day, exactly one of three states applies:

```
HOLD: currently holding stock
SOLD: just sold today (cooldown tomorrow)
REST: in cooldown or idle (can buy tomorrow)
```

**Transitions:**
```
HOLD[i] = max(HOLD[i-1],          REST[i-1] - prices[i])
           keep holding             buy today (only from REST!)

SOLD[i] = HOLD[i-1] + prices[i]   sell today

REST[i] = max(REST[i-1],           SOLD[i-1])
           stay idle                cooldown day after selling

Answer = max(SOLD[n-1], REST[n-1])  (never end while holding)
```

**State machine:**
```
REST ──buy──► HOLD
 ▲              │ sell
 └─cooldown─ SOLD ◄┘
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// Space Optimised — O(n) time, O(1) space ✅
// Only previous day's states needed
// ─────────────────────────────────────────────────────────
function maxProfit(prices) {
    if (prices.length <= 1) return 0;

    let hold = -prices[0]; // Buy on day 0
    let sold = 0;
    let rest = 0;

    for (let i = 1; i < prices.length; i++) {
        // Snapshot previous values — all transitions use prev state
        const prevHold = hold;
        const prevSold = sold;
        const prevRest = rest;

        hold = Math.max(prevHold, prevRest - prices[i]); // Keep or buy
        sold = prevHold + prices[i];                      // Sell today
        rest = Math.max(prevRest, prevSold);              // Idle or cooldown
    }

    return Math.max(sold, rest); // Never profitable to end holding
}

// ─────────────────────────────────────────────────────────
// With arrays — O(n) space (easier to trace)
// ─────────────────────────────────────────────────────────
function maxProfitArrays(prices) {
    const n = prices.length;
    if (n <= 1) return 0;

    const hold = new Array(n).fill(0);
    const sold = new Array(n).fill(0);
    const rest = new Array(n).fill(0);

    hold[0] = -prices[0];

    for (let i = 1; i < n; i++) {
        hold[i] = Math.max(hold[i-1], rest[i-1] - prices[i]);
        sold[i] = hold[i-1] + prices[i];
        rest[i] = Math.max(rest[i-1], sold[i-1]);
    }

    return Math.max(sold[n-1], rest[n-1]);
}

console.log(maxProfit([1,2,3,0,2])); // 3 ✅
console.log(maxProfit([1]));          // 0 ✅
console.log(maxProfit([1,2]));        // 1 ✅
console.log(maxProfit([6,1,3,2,4,7])); // 6 ✅
```

---

## Dry Run

```
prices=[1,2,3,0,2]

Day 0: hold=-1, sold=0,  rest=0

Day 1 (p=2): hold=max(-1,0-2)=-1, sold=-1+2=1,  rest=max(0,0)=0
Day 2 (p=3): hold=max(-1,0-3)=-1, sold=-1+3=2,  rest=max(0,1)=1
Day 3 (p=0): hold=max(-1,1-0)=1,  sold=-1+0=-1, rest=max(1,2)=2
Day 4 (p=2): hold=max(1,2-2)=1,   sold=1+2=3,   rest=max(2,-1)=2

max(sold=3, rest=2) = 3 ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(n) |
| Space | O(1) |

---

## The Stock Problem Family

| Problem | Strategy | Key constraint |
|---|---|---|
| **Stock I (P6)** | Min-so-far greedy | 1 transaction |
| **Stock II (P6)** | Sum upward slopes | Unlimited |
| **Stock III (LC #123)** | DP 4 states | At most 2 transactions |
| **Stock IV (LC #188)** | DP 2k states | At most k transactions |
| **Cooldown (P77)** | DP 3 states (this) | Unlimited + 1 day cooldown |
| **Fee (LC #714)** | DP 2 states | Unlimited + transaction fee |

---

## Key Patterns & Takeaways

1. **Three states: HOLD, SOLD, REST** — the key modelling step. Cooldown forces a one-day gap, which REST enforces (can only buy from REST).
2. **Snapshot previous values** — `const prevHold = hold` etc. before updating. All transitions reference the previous day — computing in-place corrupts later values.
3. **`hold[0] = -prices[0]`** — buying day 0 costs `prices[0]`. Initialising to 0 is wrong.
4. **Answer excludes HOLD** — `max(sold, rest)`. Ending while holding is never optimal.
5. **State machine thinking** — draw transitions as a diagram. Each arrow becomes a DP recurrence. This approach generalises to all stock variants.