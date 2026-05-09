# 109 - Swap Nodes in Pairs

## Problem
**LeetCode:** [#24 Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs/)  
**Difficulty:** Medium  
**Topic:** Linked List

### Statement
Swap every two adjacent nodes. Return the new head. Must swap nodes, not values.

```
1→2→3→4  →  2→1→4→3
1→2→3    →  2→1→3
[1]      →  [1]
```

---

## Intuition — Dummy Node + Three-Pointer Rewiring

Use dummy node before head. For each pair `(first, second)`:

```
Before: prev → first → second → rest
After:  prev → second → first → rest

Steps (ORDER MATTERS):
  1. first.next  = second.next  (save rest — MUST come before step 3)
  2. second.next = first        (second points back to first)
  3. prev.next   = second       (prev jumps over first to second)
  4. prev = first               (advance prev to end of swapped pair)
```

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #24 — Swap Nodes in Pairs
 * Time: O(n) | Space: O(1)
 */

// Iterative — O(n), O(1) ✅
function swapPairs(head) {
    const dummy = new ListNode(0);
    dummy.next = head;
    let prev = dummy;

    while (prev.next !== null && prev.next.next !== null) {
        const first  = prev.next;
        const second = prev.next.next;

        first.next  = second.next; // Step 1: save rest
        second.next = first;       // Step 2: second → first
        prev.next   = second;      // Step 3: prev → second

        prev = first;              // Advance: prev moves to end of pair
    }

    return dummy.next;
}


// Recursive — O(n), O(n) stack
function swapPairsRecursive(head) {
    if (!head || !head.next) return head;

    const first  = head;
    const second = head.next;

    first.next  = swapPairsRecursive(second.next); // Recurse on rest
    second.next = first;

    return second; // New head of this pair
}
```

---

## Dry Run

```
1→2→3→4, prev=dummy

Round 1: first=1, second=2
  1.next=3, 2.next=1, prev.next=2 → dummy→2→1→3→4, prev=1

Round 2: first=3, second=4
  3.next=null, 4.next=3, 1.next=4 → dummy→2→1→4→3, prev=3

prev.next=null → exit. return 2→1→4→3 ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| **Iterative** | **O(n)** | **O(1)** |
| Recursive | O(n) | O(n) stack |

---

## Key Details

```
Order matters for rewiring:
  first.next = second.next BEFORE second.next = first
  Otherwise second.next (the rest) is lost before we save it.

While condition: prev.next AND prev.next.next both non-null
  → ensures a complete pair exists before each swap.

prev = first after swap:
  first ends up at position 2 of the pair after swapping.
  prev must point to the last node of the current pair
  to correctly link to the next pair.

Dummy node:
  Without it, the original head swap needs special handling.
  Dummy makes all pairs uniform.
```

---

## Key Patterns & Takeaways

1. **Dummy node for head swaps** — first pair includes original head. Dummy makes all pairs identical to process.
2. **Order of rewiring** — save `second.next` into `first.next` BEFORE overwriting `second.next`. Critical sequence.
3. **`prev = first` after swap** — first is at position 2 post-swap. Advance prev there for next iteration.
4. **Two null checks in while** — both `prev.next` (pair exists) and `prev.next.next` (pair is complete). Handles odd length.
5. **Recursive elegance** — base case + 4 lines. Clarity at the cost of O(n) stack space. Know both.