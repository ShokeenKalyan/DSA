# 74 - Gas Station

## Problem
**LeetCode:** [#134 Gas Station](https://leetcode.com/problems/gas-station/)  
**Difficulty:** Medium  
**Topic:** Arrays, Greedy

### Statement
Find the starting station to complete a circular route. Return `-1` if impossible. At most one valid answer guaranteed.

```
gas=[1,2,3,4,5], cost=[3,4,5,1,2]  →  3
gas=[2,3,4],     cost=[3,4,3]       →  -1
```

---

## Two Key Observations

**1. Global feasibility:** `sum(gas) < sum(cost)` → impossible. Return -1.

**2. Finding the start (greedy):** scan L→R with running `tank`. When `tank < 0` at index `i` → none of positions 0..i can be the start → reset `start = i+1`, `tank = 0`.

**Why?** If starting at `s`, tank goes negative at `i`. Any intermediate start `j` (s < j ≤ i) would also fail — it misses the positive contributions from `s..j-1`, making the partial sum from `j` to `i` even worse.

**The last reset is the answer** when `totalSurplus >= 0`:
- Everything from `start..n-1` has non-negative running tank
- Global surplus covers any deficit from `0..start-1` on wrap-around

---

## Solution (JavaScript)

```javascript
/**
 * Gas Station — LeetCode #134
 * Time: O(n) | Space: O(1)
 */
function canCompleteCircuit(gas, cost) {
    let totalSurplus = 0; // Global feasibility check
    let currentTank  = 0; // Current journey tank
    let start        = 0; // Candidate starting station

    for (let i = 0; i < gas.length; i++) {
        const surplus = gas[i] - cost[i];
        totalSurplus += surplus;
        currentTank  += surplus;

        if (currentTank < 0) {
            // Can't continue from current start → try i+1
            start = i + 1;
            currentTank = 0;
        }
    }

    // One pass: totalSurplus checks feasibility, start is the answer
    return totalSurplus >= 0 ? start : -1;
}

console.log(canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2])); // 3  ✅
console.log(canCompleteCircuit([2,3,4], [3,4,3]));          // -1 ✅
console.log(canCompleteCircuit([5], [4]));                   // 0  ✅
console.log(canCompleteCircuit([1,2], [2,1]));               // 1  ✅
```

---

## Dry Run

```
gas=[1,2,3,4,5], cost=[3,4,5,1,2], surplus=[-2,-2,-2,3,3]

i=0: total=-2, tank=-2<0 → start=1, tank=0
i=1: total=-4, tank=-2<0 → start=2, tank=0
i=2: total=-6, tank=-2<0 → start=3, tank=0
i=3: total=-3, tank=3
i=4: total=0,  tank=6

total≥0 → return start=3 ✅

Verify: 3(+3)→4(+6)→0(+4)→1(+2)→2(0) ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute Force | O(n²) | O(1) |
| **Greedy** | **O(n)** | **O(1)** |

---

## The Proof

```
At convergence, 'start' is the last reset point.
sum(gas[start..n-1] - cost[..]) ≥ 0  (no reset in this range)
sum(gas[0..n-1]    - cost[..]) ≥ 0  (global condition)

Subtracting: sum(gas[0..start-1] - cost[..]) ≤ 0

The surplus from start..n-1 covers the deficit from 0..start-1
on wrap-around → circuit is completable from 'start'. ✅
```

---

## Key Patterns & Takeaways

1. **Global check first** — `sum(gas) < sum(cost)` → -1. Determines existence before searching.
2. **Greedy reset** — `tank < 0` at `i` → `start = i+1`. Any start in 0..i also fails (they'd have less fuel reaching i).
3. **One pass covers both** — `totalSurplus` for feasibility, `currentTank` for start finding. No second pass needed.
4. **Last reset wins** — multiple resets happen; only the final candidate matters. Earlier ones are provably wrong.
5. **Uniqueness** — problem guarantees at most one answer. Greedy finds it without validation because the last reset is provably correct when total surplus ≥ 0.