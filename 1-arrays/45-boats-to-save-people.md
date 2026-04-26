# 59 - Boats to Save People

## Problem
**LeetCode:** [#881 Boats to Save People](https://leetcode.com/problems/boats-to-save-people/)  
**Difficulty:** Medium  
**Topic:** Arrays, Two Pointers, Greedy, Sorting

### Statement
Each boat carries at most 2 people with combined weight ≤ `limit`. Return minimum boats needed.

```
[1,2],    limit=3  →  1
[3,2,2,1],limit=3  →  3
[3,5,3,4],limit=5  →  4
```

---

## Intuition — Sort + Pair Heaviest with Lightest

Sort ascending. Two pointers: lightest (`left`) and heaviest (`right`).

- `people[left] + people[right] ≤ limit` → pair them, `left++, right--`
- Otherwise → heaviest goes alone, `right--`
- Either way: `boats++`

**Why greedy?** The heaviest person's best possible pairing partner is the lightest. If they can't pair with the lightest, they can't pair with anyone — must go alone.

---

## Solution (JavaScript)

```javascript
/**
 * Boats to Save People — LeetCode #881
 * Time: O(n log n) | Space: O(1)
 */
function numRescueBoats(people, limit) {
    people.sort((a, b) => a - b);

    let left = 0, right = people.length - 1, boats = 0;

    while (left <= right) {
        if (people[left] + people[right] <= limit) {
            left++;  // Lightest pairs with heaviest
        }
        right--; // Heaviest always takes a boat (paired or alone)
        boats++;
    }

    return boats;
}

console.log(numRescueBoats([1,2], 3));       // 1 ✅
console.log(numRescueBoats([3,2,2,1], 3));   // 3 ✅
console.log(numRescueBoats([3,5,3,4], 5));   // 4 ✅
console.log(numRescueBoats([5,1,4,2], 6));   // 2 ✅
console.log(numRescueBoats([3,3,3,3], 6));   // 2 ✅
```

---

## Dry Run

```
[3,2,2,1], limit=3 → sorted [1,2,2,3]
l=0,r=3: 1+3=4>3 → heaviest alone. r=2, boats=1
l=0,r=2: 1+2=3≤3 → pair. l=1,r=1, boats=2
l=1,r=1: 2+2=4>3 → alone. r=0, boats=3
l>r → stop. Answer: 3 ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(n log n) — sort dominates |
| Space | O(1) |

---

## Key Implementation Details

```
1. boats++ every iteration — whether paired or alone, always 1 boat.
   Cleaner than boats++ in both if/else branches.

2. Simplified: always right-- (heaviest always boards a boat).
   Only question is whether lightest joins them (left++ or not).

3. left <= right handles single remaining person:
   last person takes a boat alone — loop handles naturally.

4. Sort is mandatory — greedy only correct on sorted array.
```

---

## Greedy Two-Pointer Family

| Problem | Sort | Move condition | Goal |
|---|---|---|---|
| **Boats (P59)** | By weight | Pair if ≤ limit | Min boats |
| **Two Sum II (P55)** | By value | Move smaller if sum < target | Find pair |
| **Container Water (P58)** | None | Move shorter line | Max area |

---

## Key Patterns & Takeaways

1. **Pair heaviest with lightest** — canonical greedy for min groups of 2. Best case pairing for heaviest is lightest — if that fails, they go alone.
2. **`boats++` every iteration** — always 1 boat per step regardless of pairing.
3. **`left <= right`** — handles odd-count case (single person = both pointers same).
4. **Sort first** — greedy correctness requires knowing lightest and heaviest at each step.
5. **At most 2 per boat** — this greedy only works for k=2. For k>2 the problem becomes NP-hard.