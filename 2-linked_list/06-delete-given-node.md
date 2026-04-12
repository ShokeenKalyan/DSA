# 28 - Delete Given Node in a Linked List (O(1) Approach)

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/delete-given-node-in-a-linked-list-o1-approach) | [LeetCode #237](https://leetcode.com/problems/delete-node-in-a-linked-list/)  
**Difficulty:** Medium  
**Topic:** Linked List

### Statement
Given **only the node to be deleted** (not the head), delete it. The node is guaranteed to not be the tail.

```
List: 1→2→3→4→5,  given node(3)  →  1→2→4→5
```

---

## The Counterintuitive Insight

Normal deletion needs the **predecessor**: `prev.next = node.next`. But we don't have `prev`.

**The trick:** instead of deleting the node, **impersonate the next node**:

```
Step 1: Copy next node's value into the current node
  [3] → [4] → [5]   becomes   [4] → [4] → [5]
   ↑ given                      ↑ given (now val=4)

Step 2: Delete the next node (we CAN access node.next)
  [4] → [5]

Logically: node with value 3 is gone from the list. ✅
```

From the list's perspective, the result is identical to standard deletion. The original node object remains but now holds the identity of what was node(4).

---

## Critical Constraint

**Node must NOT be the tail.** If `node.next === null`, Step 1 crashes (`null.val`). The problem guarantees this.

---

## Solution (JavaScript)

```javascript
/**
 * Delete Node in a Linked List — LeetCode #237
 * Time: O(1) | Space: O(1)
 *
 * We can't find the predecessor without the head.
 * Instead: copy next node's value in, delete the next node.
 */
function deleteNode(node) {
    // Copy next node's value into the current node
    node.val = node.next.val;

    // Delete the next node (we have access to it)
    node.next = node.next.next;
}

// Demo
const head = buildList([1, 2, 3, 4, 5]);
const nodeToDelete = head.next.next; // node(3)
deleteNode(nodeToDelete);
console.log(printList(head)); // 1→2→4→5 ✅
```

---

## Dry Run

```
List: 1 → 2 → 3 → 4 → 5,  given: node(3)

Before:  node.val=3, node.next=node(4), node.next.next=node(5)

Step 1:  node.val = node.next.val = 4
         List: 1 → 2 → [4*] → 4 → 5  (* = original node3 object)

Step 2:  node.next = node.next.next = node(5)
         List: 1 → 2 → 4 → 5 ✅

Original node3 object now has val=4, points to node(5).
Original node4 object is now unreachable → garbage collected.
```

---

## Complexity

| | Value |
|---|---|
| Time | O(1) — two pointer operations, no traversal |
| Space | O(1) |

---

## The Philosophical Distinction

```
Normal deletion:  Remove the NODE OBJECT from the chain
                  prev.next = node.next

Copy-next trick:  Remove the NODE'S LOGICAL IDENTITY
                  Copy next identity into this node, free the next node

Observable result is identical. Memory behaviour differs slightly.
Worth discussing in an interview — shows systems thinking.
```

---

## Related Deletion Patterns

| Problem | Access | Strategy |
|---|---|---|
| **Delete given node (no head)** | Only the node | Copy-next trick |
| **Delete by value** | Head + value | Traverse to predecessor |
| **Remove nth from end** | Head + n | Gap technique (Problem 26) |
| **Remove duplicates (sorted)** | Head | Skip consecutive duplicates |
| **Delete all occurrences** | Head + value | Dummy + skip while matching |

---

## Key Patterns & Takeaways

1. **Copy-next trick** — overwrite current node's value with next node's value, then skip the next node. O(1), no traversal, no head needed.
2. **Only works for non-tail nodes** — `node.next` must not be null. Problem guarantees this; always state the assumption explicitly.
3. **No head access needed** — the only O(1) solution. If you were allowed O(n), you could get the head and traverse to find the predecessor — but the problem asks for O(1).
4. **Identity vs. value** — the node object isn't truly freed; it becomes node(4)'s logical replacement. Observable list behaviour is correct. Brings up GC vs. manual memory in interviews.
5. **Real systems use** — in-place modification with only a local reference appears in OS data structures, linked hash maps, and concurrent data structures where you don't always have parent pointers.