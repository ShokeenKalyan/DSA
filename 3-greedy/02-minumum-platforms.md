# 39 - Minimum Number of Platforms Required for a Railway

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/minimum-number-of-platforms-required-for-a-railway) | [GFG](https://practice.geeksforgeeks.org/problems/minimum-platforms-1587115620/1)  
**Difficulty:** Medium  
**Topic:** Greedy, Sorting, Two Pointers

### Statement
Given arrival and departure times of trains, find the **minimum number of platforms** needed so no train waits.

```
arrival  =[900,940,950,1100,1500,1800]
departure=[910,1200,1120,1130,1900,2000]  →  3

arrival=[900,1100,1235], departure=[1000,1200,1240]  →  1
```

---

## Core Insight

**Minimum platforms = maximum number of trains present simultaneously.**

At any moment, trains are "present" if arrived but not yet departed. Peak concurrent occupancy = platforms needed.

---

## Approaches

| Approach | Time | Space | Notes |
|---|---|---|---|
| Brute Force | O(n²) | O(1) | Count overlap for each train |
| Sort + Min-Heap | O(n log n) | O(n) | Meeting Rooms II style |
| **Two Pointer** | **O(n log n)** | **O(1)** | Sort independently + merge events |

---

## The Two-Pointer Insight

Sort arrivals and departures **independently** (not as pairs). Then merge both sorted arrays as an event timeline:

- `arr[i] <= dep[j]`: next event is an **arrival** → `platforms++`
- `dep[j] < arr[i]`: next event is a **departure** → `platforms--`

Track maximum platforms throughout.

**Why sort independently?** The two-pointer merge requires departure times to be sorted relative to themselves. Sorting as pairs would disrupt this order.

**Why `<=` on tie?** When a train arrives exactly as another departs, we process arrival first (conservative — they briefly share the platform).

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 2: Two Pointer — O(n log n) time, O(1) space ✅
// ─────────────────────────────────────────────────────────
function findPlatforms(arr, dep) {
    const n = arr.length;

    // Sort BOTH arrays INDEPENDENTLY — NOT as pairs
    const sortedArr = [...arr].sort((a, b) => a - b);
    const sortedDep = [...dep].sort((a, b) => a - b);

    let platforms = 0, maxPlatforms = 0;
    let i = 0, j = 0;

    while (i < n) {
        if (sortedArr[i] <= sortedDep[j]) {
            // Arrival event — train needs a platform
            platforms++;
            maxPlatforms = Math.max(maxPlatforms, platforms);
            i++;
        } else {
            // Departure event — platform freed
            platforms--;
            j++;
        }
    }

    return maxPlatforms;
}

console.log(findPlatforms([900,940,950,1100,1500,1800],[910,1200,1120,1130,1900,2000])); // 3 ✅
console.log(findPlatforms([900,1100,1235],[1000,1200,1240]));                            // 1 ✅
console.log(findPlatforms([100,200],[900,1000]));                                        // 2 ✅
```

---

## Dry Run

```
sortedArr = [900, 940, 950, 1100, 1500, 1800]
sortedDep = [910, 1120, 1130, 1200, 1900, 2000]

i=0,j=0: 900<=910 → ARRIVE, plat=1, max=1, i=1
i=1,j=0: 940>910  → DEPART, plat=0, j=1
i=1,j=1: 940<=1120 → ARRIVE, plat=1, max=1, i=2
i=2,j=1: 950<=1120 → ARRIVE, plat=2, max=2, i=3
i=3,j=1: 1100<=1120 → ARRIVE, plat=3, max=3, i=4 ← PEAK
i=4,j=1: 1500>1120 → DEPART, plat=2, j=2
i=4,j=2: 1500>1130 → DEPART, plat=1, j=3
i=4,j=3: 1500>1200 → DEPART, plat=0, j=4
i=4,j=4: 1500<=1900 → ARRIVE, plat=1, i=5
i=5,j=4: 1800<=1900 → ARRIVE, plat=2, i=6

i=6=n → EXIT. Answer: 3 ✅
```

---

## Comparison with N Meetings (Problem 38)

| | N Meetings (P38) | Min Platforms (P39) |
|---|---|---|
| Goal | Max meetings in 1 room | Min rooms for all meetings |
| Strategy | Sort by end, greedy pick | Sort both, count peak |
| Resources | Fixed (1 room) | Variable (find minimum) |
| Related | LC #435 | LC #253 Meeting Rooms II |

**These are mathematical duals** — one maximises selections with fixed resources, the other minimises resources to handle all events.

---

## Key Patterns & Takeaways

1. **Peak concurrent = minimum resources** — min platforms = max simultaneous trains. Same insight as Meeting Rooms II (min rooms = max concurrent meetings).
2. **Sort both arrays independently** — NOT as pairs. Departure sort order must be independent of arrival sort order for the two-pointer merge to work.
3. **Two-pointer merge of events** — comparing next arrival vs. next departure is a merge of two sorted streams. O(1) space vs. O(n) for heap approach.
4. **`<=` on tie = arrival first** — conservative: simultaneous arrival and departure momentarily share the platform. Some problems use `<` for end-exclusive intervals — read carefully.
5. **Dual to Activity Selection** — max non-overlapping (P38) and min concurrent resources (P39) are duals. Understanding this connects the interval problem family deeply.