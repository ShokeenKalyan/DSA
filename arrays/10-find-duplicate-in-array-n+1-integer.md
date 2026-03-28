# 10 - Find the Duplicate in an Array of N+1 Integers

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/find-the-duplicate-in-an-array-of-n1-integers) | [LeetCode #287](https://leetcode.com/problems/find-the-duplicate-number/)  
**Difficulty:** Medium  
**Topic:** Arrays, Two Pointers, Floyd's Cycle Detection

### Statement
Given an array `nums` of `n+1` integers where each integer is in `[1, n]`, there is exactly one duplicate. Find it **without modifying the array** and using **O(1) extra space** in **O(n) time**.

```
Input:  [1, 3, 4, 2, 2]  →  Output: 2
Input:  [3, 1, 3, 4, 2]  →  Output: 3
Input:  [1, 1]            →  Output: 1
```

---

## Approaches

| Approach | Time | Space | Modifies Array |
|---|---|---|---|
| Sorting | O(n log n) | O(1) | ✅ Yes |
| Hash Set | O(n) | O(n) | ❌ No |
| Negative Marking | O(n) | O(1) | ✅ Yes |
| **Floyd's Cycle** | **O(n)** | **O(1)** | **❌ No** |

Only Floyd's satisfies ALL constraints simultaneously.

---

## The Core Insight — Array as a Linked List

Values are in `[1, n]` and array has `n+1` elements → **every value is a valid index pointer**.

Treat the array as a linked list: `index → nums[index] → nums[nums[index]] → ...`

```
nums = [1, 3, 4, 2, 2]
0 → nums[0]=1 → nums[1]=3 → nums[3]=2 → nums[2]=4 → nums[4]=2 → cycle!
```

**Why is there always a cycle?**
`n+1` indices, only `n` distinct values → by the **Pigeonhole Principle**, two indices point to the same value → node with two incoming edges → cycle.

**Why does cycle entrance = duplicate?**
The duplicate is pointed to by two different indices → it's the node with two incoming edges → the cycle entrance.

---

## Floyd's Cycle Detection — Phase 1 & 2

```
Phase 1: Find meeting point inside cycle
  slow = nums[slow]           (1 step)
  fast = nums[nums[fast]]     (2 steps)
  Loop until slow === fast

Phase 2: Find cycle entrance (= duplicate)
  Reset slow to nums[0] (start)
  Keep fast at meeting point
  Both move 1 step until they meet → meeting point = duplicate
```

**Why Phase 2 works (math):**
```
Let F = distance from start to cycle entrance
    h = distance from entrance to meeting point
    C = cycle length

After Phase 1: F + h = n*C  →  F = n*C - h

Phase 2: slow travels F from start → reaches entrance
         fast travels F = n*C - h from meeting point
         → ends at h + (n*C - h) = n*C = 0 = entrance ✅
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 2: Hash Set — O(n) time, O(n) space
// ─────────────────────────────────────────────────────────
function findDuplicateHashSet(nums) {
    const seen = new Set();
    for (const num of nums) {
        if (seen.has(num)) return num;
        seen.add(num);
    }
    return -1;
}


// ─────────────────────────────────────────────────────────
// APPROACH 3: Negative Marking — O(n) time, O(1) space
// Modifies array — violates "no modification" constraint
// ─────────────────────────────────────────────────────────
function findDuplicateNegMark(nums) {
    for (let i = 0; i < nums.length; i++) {
        const idx = Math.abs(nums[i]);
        if (nums[idx] < 0) return idx; // Already negated = visited before
        nums[idx] = -nums[idx];        // Mark as visited
    }
    return -1;
}


// ─────────────────────────────────────────────────────────
// APPROACH 4: Floyd's Cycle Detection — O(n) time, O(1) space
// Does NOT modify array — the true optimal solution
// ─────────────────────────────────────────────────────────
function findDuplicate(nums) {
    // ── Phase 1: Detect the cycle ───────────────────────────
    // MUST use do-while: slow and fast both start at nums[0]
    // (already equal), so regular while would exit immediately
    let slow = nums[0];
    let fast = nums[0];

    do {
        slow = nums[slow];          // 1 step
        fast = nums[nums[fast]];    // 2 steps
    } while (slow !== fast);

    // ── Phase 2: Find cycle entrance = duplicate ────────────
    // Reset slow to START VALUE (nums[0]), not index 0
    // Both move 1 step until they meet at cycle entrance
    slow = nums[0];

    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
    }

    return slow; // = duplicate number
}

console.log(findDuplicate([1, 3, 4, 2, 2])); // 2 ✅
console.log(findDuplicate([3, 1, 3, 4, 2])); // 3 ✅
console.log(findDuplicate([1, 1]));           // 1 ✅
console.log(findDuplicate([2, 2, 2, 2, 2])); // 2 ✅
```

---

## Dry Run

```
nums = [1, 3, 4, 2, 2]
Linked list: 0→1→3→2→4→2→4... (cycle at node 2)

Phase 1:
  slow=1, fast=1
  Step 1: slow=nums[1]=3,  fast=nums[nums[1]]=nums[3]=2
  Step 2: slow=nums[3]=2,  fast=nums[nums[2]]=nums[4]=2
  slow==fast==2 → meet

Phase 2:
  slow=nums[0]=1, fast=2
  Step 1: slow=nums[1]=3,  fast=nums[2]=4
  Step 2: slow=nums[3]=2,  fast=nums[4]=2
  slow==fast==2 → cycle entrance = 2 ✅
```

---

## Common Mistakes

```
1. Starting at index 0 instead of nums[0]:
   The linked list NODE values are in [1,n]. Starting traversal
   at index 0 is correct, but the POINTER is nums[0], not 0.

2. Using while instead of do-while for Phase 1:
   slow and fast both start at nums[0] → already equal before
   any movement → while exits immediately. Use do-while.

3. Phase 2 reset to nums[0] not 0:
   The "start" of the virtual linked list is the value nums[0],
   not index 0 itself.
```

---

## Key Patterns & Takeaways

1. **Array as a linked list** — when values are in `[1, n]` for size `n+1` array, every value is a valid index pointer. Reappears in *Find All Missing Numbers* (LC #448), *First Missing Positive* (LC #41).
2. **Floyd's Cycle = Tortoise and Hare** — foundational algorithm. Also solves *Linked List Cycle* (LC #141/#142) and *Happy Number* (LC #202).
3. **Pigeonhole Principle** — the mathematical guarantee of a cycle. Mentioning it signals strong theoretical grounding.
4. **do-while for Phase 1** — critical implementation detail. slow and fast start equal; regular while exits before moving.
5. **Phase 2 derivation** — be ready to explain `F = nC - h` if asked why resetting to start finds the entrance. Shows deep understanding vs. just memorizing the algorithm.