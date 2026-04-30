# 99 - Remove Duplicates from Sorted List

## Problem
**LeetCode:** [#83 Remove Duplicates from Sorted List](https://leetcode.com/problems/remove-duplicates-from-sorted-list/)  
**Difficulty:** Easy  
**Topic:** Linked List

### Statement
Delete all duplicates from a sorted linked list so each element appears once.

```
1→1→2      →  1→2
1→1→2→3→3  →  1→2→3
1→1→1      →  1
```

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #83 — Remove Duplicates from Sorted List
 * Time: O(n) | Space: O(1)
 */
function deleteDuplicates(head) {
    let curr = head;

    while (curr !== null && curr.next !== null) {
        if (curr.val === curr.next.val) {
            curr.next = curr.next.next; // Skip duplicate
            // Don't advance — check again (e.g. 1→1→1)
        } else {
            curr = curr.next; // Advance only when no duplicate
        }
    }

    return head;
}
```

---

## Dry Run

```
1→1→2→3→3

curr=1: 1===1 → skip, curr.next=2→3→3  [1→2→3→3]
curr=1: 1!==2 → advance
curr=2: 2!==3 → advance
curr=3: 3===3 → skip, curr.next=null   [1→2→3]
curr=3: curr.next=null → exit → return 1→2→3 ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(n) |
| Space | O(1) |

---

## vs Remove Duplicates Array (P35)

| | Array (P35) | List (P99) |
|---|---|---|
| Approach | Read/write two pointer | Re-link to skip |
| Why | Must compact array | Just change pointer |
| Sorted insight | Adjacent = duplicate | Same |

---

## Key Patterns & Takeaways

1. **Re-link to skip** — `curr.next = curr.next.next`. No dummy node needed (head never deleted).
2. **Don't advance on skip** — stay at `curr` to handle consecutive duplicates (`1→1→1`).
3. **Sorted = adjacency** — same insight as P35. Duplicates always neighbours.
4. **No dummy node** — head is always kept. Return `head` directly.
5. **P35 connection** — same concept, different structure. Array overwrites; list re-links.