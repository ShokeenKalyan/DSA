# 29 - Find Intersection of Two Linked Lists

## Problem

**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/find-intersection-of-two-linked-lists) | [LeetCode #160](https://leetcode.com/problems/intersection-of-two-linked-lists/)  
**Difficulty:** Easy  
**Topic:** Linked List, Two Pointers

### Statement

Return the **node** (by reference) where two linked lists intersect. Return `null` if no intersection.

```
A: a1→a2 ↘
            c1→c2→c3→null   → return node c1
B: b1→b2→b3 ↗
```

---

## Approaches

| Approach          | Time       | Space    | Notes                         |
| ----------------- | ---------- | -------- | ----------------------------- |
| HashSet           | O(m+n)     | O(m)     | Simple but extra space        |
| Length Difference | O(m+n)     | O(1)     | 3 passes (2 lengths + 1 sync) |
| **Two Pointer**   | **O(m+n)** | **O(1)** | Mathematically elegant        |

---

## The Two-Pointer Mathematical Proof

```
Let: a = length of A before intersection
     b = length of B before intersection
     c = length of common tail

pA travels: A then B = (a + c) + b = a + b + c steps to intersection
pB travels: B then A = (b + c) + a = a + b + c steps to intersection

Both travel EXACTLY the same distance → guaranteed to meet at intersection!

No intersection (c=0):
  pA travels a + b steps → reaches null
  pB travels b + a steps → reaches null
  Both reach null simultaneously → while (pA !== pB) exits ✅
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: HashSet — O(m+n) time, O(m) space
// ─────────────────────────────────────────────────────────
function getIntersectionNodeHashSet(headA, headB) {
  const visited = new Set();
  let curr = headA;
  while (curr) {
    visited.add(curr);
    curr = curr.next;
  } // Store all A nodes

  curr = headB;
  while (curr) {
    if (visited.has(curr)) return curr; // Same node reference = intersection
    curr = curr.next;
  }
  return null;
}

// ─────────────────────────────────────────────────────────
// APPROACH 2: Length Difference — O(m+n) time, O(1) space
// ─────────────────────────────────────────────────────────
function getIntersectionNodeLengthDiff(headA, headB) {
  const getLength = (head) => {
    let l = 0;
    while (head) {
      l++;
      head = head.next;
    }
    return l;
  };
  let lenA = getLength(headA),
    lenB = getLength(headB);
  let pA = headA,
    pB = headB;

  // Advance longer list by the difference — equalise distances to intersection
  while (lenA > lenB) {
    pA = pA.next;
    lenA--;
  }
  while (lenB > lenA) {
    pB = pB.next;
    lenB--;
  }

  while (pA !== pB) {
    pA = pA.next;
    pB = pB.next;
  } // Walk in sync
  return pA; // null if no intersection, intersection node otherwise
}

// ─────────────────────────────────────────────────────────
// APPROACH 3: Two Pointer — O(m+n) time, O(1) space ✅
// When pointer reaches null → redirect to the OTHER list's head
// Both travel a+b+c steps → guaranteed to meet at intersection
// ─────────────────────────────────────────────────────────
function getIntersectionNode(headA, headB) {
  if (!headA || !headB) return null;

  let pA = headA,
    pB = headB;

  while (pA !== pB) {
    // Redirect to other list's head when reaching null
    // NOT when reaching the last node — that would skip it
    pA = pA === null ? headB : pA.next;
    pB = pB === null ? headA : pB.next;
  }

  return pA; // intersection node OR null (both null = no intersection)
}
```

---

## Dry Run — Two Pointer

```
A: 1→3→5→7→9→null  (a=3, c=2)
B: 2→4→7→9→null    (b=2, c=2)
Intersection at node(7)

pA=1, pB=2
→ pA=3,    pB=4
→ pA=5,    pB=7
→ pA=7,    pB=9
→ pA=9,    pB=null → pB=headA=1
→ pA=null  → pA=headB=2,   pB=3
→ pA=4,    pB=5
→ pA=7,    pB=7  ← pA === pB ✅

return node(7)   (both traveled 3+2+2=7 steps to intersection)
```

---

## ⚠️ Critical Implementation Details

```
1. Compare node REFERENCES, not values:
   while (pA !== pB)   ← CORRECT (object identity)
   while (pA.val !== pB.val)  ← WRONG (different nodes, same value)

2. Redirect at null, not at last node:
   pA = pA === null ? headB : pA.next   ← CORRECT
   pA = pA.next === null ? headB : pA.next  ← WRONG (off by one, skips last node)

3. No intersection: both reach null simultaneously → pA === pB === null → exits loop ✅

4. Equal length, no intersection: both reach null at the same step ✅
```

---

## Key Patterns & Takeaways

1. **Derive the math, don't just state the trick** — explain that `a+b+c = b+c+a` is why both pointers meet. Derivation under interview pressure is the senior signal.
2. **Node identity, not value** — `pA !== pB` compares references. Two different nodes with the same value are NOT an intersection. The #1 conceptual mistake.
3. **Redirect at null, not before null** — redirecting when `pA.next === null` skips the last node. Redirect only when the pointer itself IS null.
4. **Length difference as fallback** — O(1) space, correct, easier to reason about under pressure. Present it first, then offer the two-pointer as the elegant O(1)-space one-pass solution.
5. **Connection to Floyd's** — manipulating pointer speeds/redirects to create a mathematical meeting guarantee. Same elegant principle as cycle detection (Problem 10).
