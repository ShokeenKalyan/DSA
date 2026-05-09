# 110 - Sort List

## Problem
**LeetCode:** [#148 Sort List](https://leetcode.com/problems/sort-list/)  
**Difficulty:** Medium  
**Topic:** Linked List, Merge Sort, Divide & Conquer

### Statement
Sort a linked list in ascending order. O(n log n) time, O(1) space (bonus).

```
4→2→1→3      →  1→2→3→4
-1→5→3→4→0   →  -1→0→3→4→5
```

---

## Why Merge Sort?

```
QuickSort needs random access → O(n) per partition on LL → O(n²) worst
Merge Sort uses only sequential access:
  Split: O(n) slow/fast pointer (P24)
  Merge: O(n) pointer rewiring (P25)
  log n levels → O(n log n) total ✅
```

**Synthesis: Sort List = P24 (Find Middle) + P25 (Merge Two Sorted Lists)**

---

## Approaches

| Approach | Time | Space | Notes |
|---|---|---|---|
| **Top-Down (recursive)** | **O(n log n)** | **O(log n)** | Clean, interview-friendly |
| **Bottom-Up (iterative)** | **O(n log n)** | **O(1)** | Optimal, for follow-up |

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Top-Down — O(n log n), O(log n) stack ✅
// ─────────────────────────────────────────────────────────
function getMiddle(head) {
    let slow = head, fast = head.next;
    while (fast !== null && fast.next !== null) {
        slow = slow.next; fast = fast.next.next;
    }
    return slow;
}

function merge(l1, l2) {
    const dummy = new ListNode(0);
    let tail = dummy;
    while (l1 !== null && l2 !== null) {
        if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
        else                  { tail.next = l2; l2 = l2.next; }
        tail = tail.next;
    }
    tail.next = l1 ?? l2;
    return dummy.next;
}

function sortListTopDown(head) {
    if (!head || !head.next) return head;

    const mid = getMiddle(head);
    const right = mid.next;
    mid.next = null; // Cut

    return merge(sortListTopDown(head), sortListTopDown(right));
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Bottom-Up — O(n log n), O(1) space
// Merge sublists of size 1, then 2, then 4...
// ─────────────────────────────────────────────────────────
function sortList(head) {
    if (!head || !head.next) return head;

    let length = 0, node = head;
    while (node) { length++; node = node.next; }

    const dummy = new ListNode(0);
    dummy.next = head;

    for (let size = 1; size < length; size *= 2) {
        let curr = dummy.next, tail = dummy;

        while (curr !== null) {
            const left  = curr;
            const right = split(left, size);
            curr = split(right, size);

            const [mHead, mTail] = mergeGetTail(left, right);
            tail.next = mHead;
            tail = mTail;
            tail.next = curr;
        }
    }

    return dummy.next;
}

// Advance size nodes, cut, return head of second part
function split(head, size) {
    for (let i = 1; i < size && head?.next; i++) head = head.next;
    if (!head) return null;
    const second = head.next;
    head.next = null;
    return second;
}

// Merge two sorted lists, return [head, tail]
function mergeGetTail(l1, l2) {
    const dummy = new ListNode(0);
    let tail = dummy;
    while (l1 && l2) {
        if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
        else                  { tail.next = l2; l2 = l2.next; }
        tail = tail.next;
    }
    tail.next = l1 ?? l2;
    while (tail.next) tail = tail.next;
    return [dummy.next, tail];
}
```

---

## Dry Run — Top-Down

```
4→2→1→3

sortList(4→2→1→3):
  mid=2, split: [4→2] and [1→3]
  sortList(4→2) = merge([4],[2]) = 2→4
  sortList(1→3) = merge([1],[3]) = 1→3
  merge(2→4, 1→3) = 1→2→3→4 ✅
```

---

## Bottom-Up Walkthrough

```
4→2→1→3, length=4

size=1: merge pairs of 1
  [4]∪[2]=2→4, [1]∪[3]=1→3 → 2→4→1→3

size=2: merge pairs of 2
  [2→4]∪[1→3]=1→2→3→4 ✅

size=4 ≥ length → exit
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Top-Down | O(n log n) | O(log n) |
| **Bottom-Up** | **O(n log n)** | **O(1)** |

---

## Key Patterns & Takeaways

1. **Merge Sort for linked lists** — natural fit. Split with slow/fast (P24), merge with dummy (P25). No random access needed unlike QuickSort.
2. **Top-down = direct application of P24 + P25** — find middle, cut, recurse, merge. Lead with this in interviews.
3. **Bottom-up for O(1) space** — merge sublists of doubling sizes. No recursion. Answer for "can you do constant space?"
4. **`split` helper** — advances size nodes, cuts, returns second part. Key building block for bottom-up.
5. **Synthesis problem** — explicitly state "Sort List = Find Middle + Merge Two Sorted Lists + divide and conquer" before coding. Senior signal.