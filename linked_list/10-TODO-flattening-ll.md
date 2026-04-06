# 33 - Flattening a Linked List

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/flattening-a-linked-list) | [GFG](https://www.geeksforgeeks.org/flattening-a-linked-list/)  
**Difficulty:** Medium  
**Topic:** Linked List, Merge Sort, Divide & Conquer

### Statement
A linked list where each node has `next` (horizontal) and `child` (vertical, sorted sub-list). Flatten into a single sorted list using `child` pointers.

```
5 → 10 → 19 → 28
↓        ↓    ↓
7       22   35
↓       ↓
8      50
↓
30

Output: 5→7→8→10→19→22→28→30→35→50
```

---

## Node Structure

```javascript
class Node {
    constructor(val) {
        this.val = val;
        this.next = null;  // Horizontal: next main list node
        this.child = null; // Vertical: head of sorted sub-list
    }
}
```

---

## Core Insight — Merge K Sorted Lists Recursively

Each vertical list is already sorted. Recursively flatten the rest of the horizontal chain, then merge the current node's vertical list with the flattened result.

```
flatten(head):
  Base: head === null || head.next === null → return head
  flattenedRest = flatten(head.next)   // Flatten remaining horizontal
  head.next = null                     // Disconnect horizontal pointer
  return mergeSorted(head, flattenedRest)  // Merge current with rest
```

This is right-to-left pairwise merging — same D&C strategy as Merge K Sorted Lists.

---

## Complexity

| Approach | Time | Space | Notes |
|---|---|---|---|
| Brute (collect + sort) | O(N log N) | O(N) | Wastes sorted structure |
| **Recursive Merge** | **O(N log K)** | **O(K)** | K=horizontal nodes, N=total |

**Why O(N log K)?** O(log K) recursion levels × O(N) merge work per level = O(N log K). Better than naive left-to-right O(NK).

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// HELPER: Merge two sorted lists via child pointers
// Same as Problem 25 but uses child instead of next
// ─────────────────────────────────────────────────────────
function mergeSorted(l1, l2) {
    const dummy = new Node(0);
    let tail = dummy;

    while (l1 !== null && l2 !== null) {
        if (l1.val <= l2.val) {
            tail.child = l1;
            l1 = l1.child;
        } else {
            tail.child = l2;
            l2 = l2.child;
        }
        tail = tail.child;
        tail.next = null; // Clear stray horizontal pointers
    }

    tail.child = l1 !== null ? l1 : l2; // Append remainder
    return dummy.child;
}


// ─────────────────────────────────────────────────────────
// APPROACH 1: Brute Force — O(N log N), O(N) space
// ─────────────────────────────────────────────────────────
function flattenBrute(head) {
    const vals = [];
    let curr = head;
    while (curr) {
        let node = curr;
        while (node) { vals.push(node.val); node = node.child; }
        curr = curr.next;
    }
    vals.sort((a, b) => a - b);

    const dummy = new Node(0);
    let tail = dummy;
    for (const val of vals) { tail.child = new Node(val); tail = tail.child; }
    return dummy.child;
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Recursive Merge — O(N log K), O(K) ✅
// ─────────────────────────────────────────────────────────
function flatten(head) {
    if (head === null || head.next === null) return head;

    // Recursively flatten the rest of the horizontal chain
    const flattenedRest = flatten(head.next);

    // Disconnect horizontal link (result uses only child pointers)
    head.next = null;

    // Merge current vertical list with flattened rest
    return mergeSorted(head, flattenedRest);
}
```

---

## Dry Run

```
flatten(5→10→19→28):

  flatten(28): no next → return 28→35
  flatten(19): merge(19→22→50, 28→35) = 19→22→28→35→50
  flatten(10): merge(10, 19→22→28→35→50) = 10→19→22→28→35→50
  flatten(5):  merge(5→7→8→30, 10→19→22→28→35→50)
             = 5→7→8→10→19→22→28→30→35→50 ✅
```

---

## ⚠️ Critical Details

```
1. Use child pointers in merged result — NOT next.
   tail.child = chosen node. tail.next = null (clear stray horizontals).

2. head.next = null before merging — disconnect horizontal.
   Prevents stray next pointers in the result.

3. Base case on head.next === null (horizontal chain), not head.child:
   Recurse along horizontal. A node with no children still has a next.

4. Return dummy.child (not dummy.next) from mergeSorted.
```

---

## Key Patterns & Takeaways

1. **Flatten = Merge K Sorted Lists recursively** — each horizontal node heads a sorted vertical. Flatten right side first, merge current with result. Direct extension of Problem 25.
2. **Right-to-left pairwise merging** — recurse to rightmost, merge on the way back. Same D&C principle as Merge Sort.
3. **Child for result, clear next** — result must be purely child-linked. `tail.next = null` prevents corruption from leftover horizontal pointers.
4. **O(N log K) > O(NK)** — recursive D&C is better than naive left-to-right sequential merging. State this complexity analysis explicitly.
5. **Iterative fallback** — merge first two, then result with third, and so on. O(NK) worst case but simpler to implement under pressure.