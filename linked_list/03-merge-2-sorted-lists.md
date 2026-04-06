# 25 - Merge Two Sorted Linked Lists

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/merge-two-sorted-linked-lists) | [LeetCode #21](https://leetcode.com/problems/merge-two-sorted-lists/)  
**Difficulty:** Easy  
**Topic:** Linked List, Two Pointers, Dummy Node

### Statement
Merge two sorted linked lists in-place (relink nodes, no new nodes). Return the head of the merged sorted list.

```
l1=1→2→4,  l2=1→3→4  →  1→1→2→3→4→4
l1=[],     l2=[0]     →  0
```

---

## Intuition

The merge step of Merge Sort applied to linked lists. Advantage over arrays: **no extra space** — just relink `next` pointers.

Compare heads of both lists, pick the smaller one, attach it to result, advance that list's pointer. When one list is exhausted, append the entire remainder (already sorted).

---

## The Dummy Node Pattern

```
Without dummy: special case for the first node, messy conditionals.
With dummy:    treat every node uniformly — no special first node.
               return dummy.next to skip the sentinel.
```

Use a dummy node any time you're building a linked list by attaching nodes one by one. Pattern appears in: Merge Two Lists, Add Two Numbers, Partition List.

---

## Complexity

| Approach | Time | Space | Notes |
|---|---|---|---|
| **Iterative + Dummy** | **O(m+n)** | **O(1)** | Preferred |
| Recursive | O(m+n) | O(m+n) | Elegant but O(m+n) stack depth |

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Iterative + Dummy — O(m+n) time, O(1) space ✅
// ─────────────────────────────────────────────────────────
function mergeTwoLists(l1, l2) {
    const dummy = new ListNode(0); // Anchor — eliminates head edge case
    let tail = dummy;

    while (l1 !== null && l2 !== null) {
        if (l1.val <= l2.val) {
            tail.next = l1; // Attach smaller node
            l1 = l1.next;
        } else {
            tail.next = l2;
            l2 = l2.next;
        }
        tail = tail.next; // Advance tail
    }

    // Append remaining nodes (already sorted & linked)
    tail.next = l1 !== null ? l1 : l2;

    return dummy.next; // Skip dummy, return real head
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Recursive — O(m+n) time, O(m+n) stack
// ─────────────────────────────────────────────────────────
function mergeTwoListsRecursive(l1, l2) {
    if (l1 === null) return l2;
    if (l2 === null) return l1;

    if (l1.val <= l2.val) {
        l1.next = mergeTwoListsRecursive(l1.next, l2);
        return l1;
    } else {
        l2.next = mergeTwoListsRecursive(l1, l2.next);
        return l2;
    }
}

// Tests
console.log(printList(mergeTwoLists(buildList([1,2,4]), buildList([1,3,4])))); // 1→1→2→3→4→4 ✅
console.log(printList(mergeTwoLists(buildList([]), buildList([0]))));          // 0 ✅
console.log(printList(mergeTwoLists(buildList([1,3,5]), buildList([2,4,6])))); // 1→2→3→4→5→6 ✅
```

---

## Dry Run

```
l1=1→2→4, l2=1→3→4,  dummy=0, tail=dummy

1<=1 → attach l1(1), l1=2→4, tail=1        → dummy→1
2>1  → attach l2(1), l2=3→4, tail=1        → dummy→1→1
2<=3 → attach l1(2), l1=4,   tail=2        → dummy→1→1→2
4>3  → attach l2(3), l2=4,   tail=3        → dummy→1→1→2→3
4<=4 → attach l1(4), l1=null, tail=4       → dummy→1→1→2→3→4

Loop ends (l1=null). tail.next = l2(4→null)
Result: dummy.next = 1→1→2→3→4→4 ✅
```

---

## BONUS — Merge K Sorted Lists (LC #23)

**Divide & Conquer approach — O(N log k):**
Pair up lists, merge pairs, repeat. O(log k) rounds × O(N) per round.

```javascript
function mergeKListsDivideConquer(lists) {
    if (!lists || lists.length === 0) return null;

    while (lists.length > 1) {
        const mergedLists = [];
        for (let i = 0; i < lists.length; i += 2) {
            const l1 = lists[i];
            const l2 = i + 1 < lists.length ? lists[i + 1] : null;
            mergedLists.push(mergeTwoLists(l1, l2));
        }
        lists = mergedLists;
    }

    return lists[0];
}

// 3 lists → [1,4,5], [1,3,4], [2,6]
// Round 1: merge pair(0,1)=[1,1,3,4,4,5], keep [2,6] → 2 lists
// Round 2: merge both → 1,1,2,3,4,4,5,6
```

**Approaches comparison:**
| Approach | Time | Space |
|---|---|---|
| Merge one by one | O(k×N) | O(1) |
| **Divide & Conquer** | **O(N log k)** | **O(log k)** |
| Min-Heap | O(N log k) | O(k) |

---

## Edge Cases

| Case | Note |
|---|---|
| Both empty | Loop never runs, `tail.next=null` → null |
| One empty | Loop skipped, `tail.next=l2` handles it |
| All equal values | `<=` ensures stability (l1's equal nodes come first) |
| One much longer | Remainder appended cleanly in O(1) |

---

## Key Patterns & Takeaways

1. **Dummy node for list construction** — eliminates first-node special case. Use whenever building a list by attaching nodes one by one. Return `dummy.next`.
2. **Append remainder in O(1)** — `tail.next = remaining list`. No loop needed since remaining is already sorted and linked.
3. **`<=` not `<`** — ensures stability (equal elements keep relative order from original lists).
4. **Recursive elegant, iterative preferred** — recursive is beautiful for explaining logic; iterative is O(1) space and production-safe.
5. **Merge K = D&C on Merge Two** — O(log k) rounds × O(N) per round = O(N log k). Same principle as Merge Sort. The #1 senior follow-up to this problem.