# 26 - Remove Nth Node from End of Linked List

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/remove-n-th-node-from-the-end-of-a-linked-list) | [LeetCode #19](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)  
**Difficulty:** Medium  
**Topic:** Linked List, Two Pointers, Dummy Node

### Statement
Remove the **nth node from the end** of the list in a single pass. Return the head.

```
1→2→3→4→5, n=2  →  1→2→3→5   (removed 4, 2nd from end)
1,          n=1  →  []         (only node removed)
1→2,        n=2  →  2          (removed head)
```

---

## Intuition — The Gap Technique

**The one-pass insight:** establish a gap of `n+1` between `fast` and `slow`. When `fast` reaches `null`, `slow` is at the node **before** the target — enabling clean deletion.

```
Gap setup: move fast n+1 steps from dummy
Then: move both until fast = null
→ slow lands at predecessor of target
→ slow.next = slow.next.next  (delete target)
```

**Why n+1 and not n?**
- `n` steps → slow lands AT the target → can't delete without predecessor
- `n+1` steps → slow lands BEFORE the target → clean deletion ✅

**Why dummy node?**
When `n = list length` (removing head), there's no predecessor. Dummy is the predecessor of head, making deletion uniform for all cases.

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Two Pass — O(L), 2 traversals
// ─────────────────────────────────────────────────────────
function removeNthFromEndTwoPass(head, n) {
    let length = 0, curr = head;
    while (curr) { length++; curr = curr.next; }
    if (n === length) return head.next; // remove head edge case
    curr = head;
    for (let i = 0; i < length - n - 1; i++) curr = curr.next;
    curr.next = curr.next.next;
    return head;
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: One Pass Gap Technique — O(L), O(1) ✅
// ─────────────────────────────────────────────────────────
function removeNthFromEnd(head, n) {
    const dummy = new ListNode(0);
    dummy.next = head;

    let slow = dummy; // Will stop at predecessor of target
    let fast = dummy;

    // Step 1: Move fast n+1 steps ahead of slow
    for (let i = 0; i <= n; i++) {
        fast = fast.next;
    }

    // Step 2: Move both until fast = null
    while (fast !== null) {
        slow = slow.next;
        fast = fast.next;
    }

    // Step 3: slow is at predecessor → delete target
    slow.next = slow.next.next;

    return dummy.next; // Handles head-removal case
}

console.log(printList(removeNthFromEnd(buildList([1,2,3,4,5]), 2))); // 1→2→3→5 ✅
console.log(printList(removeNthFromEnd(buildList([1]), 1)));          // (empty) ✅
console.log(printList(removeNthFromEnd(buildList([1,2]), 2)));        // 2 ✅ (head removed)
console.log(printList(removeNthFromEnd(buildList([1,2]), 1)));        // 1 ✅
```

---

## Dry Run

```
head=1→2→3→4→5, n=2,  dummy=0→1→2→3→4→5

Step 1: Move fast n+1=3 steps from dummy
  fast: dummy→1→2→3   slow: dummy

Step 2: Move both until fast=null
  slow=1, fast=4
  slow=2, fast=5
  slow=3, fast=null → STOP

Step 3: slow.next=4, slow.next.next=5
  slow.next = 5  → list: 1→2→3→5 ✅


head=[1,2], n=2 (remove head):
Step 1: fast moves 3 steps from dummy → null (list only has 2+dummy=3 nodes)
Step 2: fast=null immediately → skip loop
Step 3: slow=dummy, dummy.next = 1's next = 2 → [2] ✅
```

---

## Complexity

| Approach | Time | Space | Passes |
|---|---|---|---|
| Two Pass | O(L) | O(1) | 2 |
| **One Pass Gap** | **O(L)** | **O(1)** | **1** |

---

## Why Dummy Node Is Non-Negotiable

```
Without dummy: removing head (n = list length) is a special case.
With dummy:    slow starts at dummy (predecessor of head).
               Deletion is always: slow.next = slow.next.next
               No edge cases. Uniform logic for every n. ✅
```

---

## The Gap Technique Family

| Problem | Gap size | What slow finds | LeetCode |
|---|---|---|---|
| **Remove Nth from End** | n+1 | Predecessor of target | #19 |
| **Find Middle** | half-speed (n/2) | Middle node | #876 |
| **Find Kth from End** | k | Kth from end | — |
| **Intersection of Two LL** | length difference | Intersection node | #160 |

---

## Key Patterns & Takeaways

1. **Gap of n+1, not n** — lands slow at predecessor of target, enabling `slow.next = slow.next.next`. Moving only n steps lands slow at the target itself — can't delete without predecessor.
2. **Dummy node is essential** — handles `n = list length` (head removal) uniformly. Dummy is the predecessor of head.
3. **Both start at dummy** — consistent mental model. Move fast `n+1` steps, then walk both until `fast = null`.
4. **`while (fast !== null)` not `fast.next !== null`** — because fast starts at dummy and moves `n+1` steps. When fast is null, slow is exactly at the predecessor.
5. **Gap technique generalises** — any "kth-from-end" problem uses this. Establish gap first, walk both at equal speed. Gap size = offset from end.