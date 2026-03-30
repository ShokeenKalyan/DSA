# 23 - Reverse a Linked List

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/reverse-a-linked-list) | [LeetCode #206](https://leetcode.com/problems/reverse-linked-list/)  
**Difficulty:** Easy  
**Topic:** Linked List, Two Pointers

### Statement
Reverse a singly linked list. Return the new head.

```
1 → 2 → 3 → 4 → 5 → null   →   5 → 4 → 3 → 2 → 1 → null
```

---

## Node Structure & Helpers

```javascript
class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

function buildList(arr) {
    if (!arr.length) return null;
    const head = new ListNode(arr[0]);
    let curr = head;
    for (let i = 1; i < arr.length; i++) {
        curr.next = new ListNode(arr[i]);
        curr = curr.next;
    }
    return head;
}

function printList(head) {
    const vals = [];
    while (head) { vals.push(head.val); head = head.next; }
    return vals.join(' → ');
}
```

---

## Complexity

| Approach | Time | Space | Notes |
|---|---|---|---|
| **Iterative** | **O(n)** | **O(1)** | Preferred |
| Recursive | O(n) | O(n) | O(n) call stack — risk for long lists |

---

## Iterative Approach — Three-Pointer Dance

```
Maintain: prev=null, curr=head

At each step:
  1. Save next = curr.next   (don't lose the rest)
  2. Flip: curr.next = prev  (redirect this arrow)
  3. prev = curr             (advance prev)
  4. curr = next             (advance curr)

Stop when curr is null. New head = prev.
```

```
Initial: prev=null, curr=1→2→3→4→5

null←1  curr=2→3→4→5
null←1←2  curr=3→4→5
null←1←2←3  curr=4→5
null←1←2←3←4  curr=5
null←1←2←3←4←5  curr=null → STOP

New head: 5 ✅
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Iterative — O(n) time, O(1) space ✅
// ─────────────────────────────────────────────────────────
function reverseList(head) {
    let prev = null;
    let curr = head;

    while (curr !== null) {
        const next = curr.next; // Save before flipping
        curr.next = prev;       // Flip the arrow
        prev = curr;            // Advance prev
        curr = next;            // Advance curr
    }

    return prev; // New head
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Recursive — O(n) time, O(n) stack space
// ─────────────────────────────────────────────────────────
function reverseListRecursive(head) {
    if (head === null || head.next === null) return head;

    const newHead = reverseListRecursive(head.next);

    // head.next still points to second node (not yet updated)
    // Flip: make second node point back to head
    head.next.next = head;
    head.next = null; // head becomes new tail

    return newHead; // Bubble up the true new head
}

// Tests
console.log(printList(reverseList(buildList([1,2,3,4,5])))); // 5→4→3→2→1 ✅
console.log(printList(reverseList(buildList([1,2]))));       // 2→1 ✅
console.log(printList(reverseList(buildList([1]))));         // 1 ✅
console.log(printList(reverseList(null)));                   // (empty) ✅
```

---

## Variant 1 — Reverse Sublist [left, right] (LC #92)

**"Insert at front" trick:** take `curr.next` and insert it right after `prev`, (right-left) times.

```javascript
// Time: O(n) | Space: O(1)
function reverseBetween(head, left, right) {
    const dummy = new ListNode(0);
    dummy.next = head;

    // Move prev to node just before position `left`
    let prev = dummy;
    for (let i = 1; i < left; i++) prev = prev.next;

    let curr = prev.next; // First node to reverse

    for (let i = 0; i < right - left; i++) {
        const nextNode = curr.next;      // Node to be moved to front
        curr.next = nextNode.next;       // Remove nextNode
        nextNode.next = prev.next;       // nextNode → current front
        prev.next = nextNode;            // Insert nextNode at front
    }

    return dummy.next;
}

// 1→2→3→4→5, left=2, right=4 → 1→4→3→2→5
console.log(printList(reverseBetween(buildList([1,2,3,4,5]), 2, 4))); // ✅
```

---

## Variant 2 — Reverse in K-Groups (LC #25)

```javascript
// Time: O(n) | Space: O(n/k) recursive stack
function reverseKGroup(head, k) {
    // Check if k nodes remain
    let check = head;
    for (let i = 0; i < k; i++) {
        if (!check) return head; // < k nodes left — leave as-is
        check = check.next;
    }

    // Reverse k nodes
    let prev = null, curr = head;
    for (let i = 0; i < k; i++) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }

    // head is now the tail of this reversed group
    // Connect it to the recursively reversed remainder
    head.next = reverseKGroup(curr, k);

    return prev; // New head of this group
}

// 1→2→3→4→5, k=2 → 2→1→4→3→5
console.log(printList(reverseKGroup(buildList([1,2,3,4,5]), 2))); // ✅
```

---

## Key Patterns & Takeaways

1. **Three-pointer dance: `prev`, `curr`, `next`** — save next, flip arrow, advance both. Stop when curr is null. New head is prev. Foundational for all linked list manipulation.
2. **Iterative > Recursive** — both O(n), but iterative is O(1) space. For long lists, recursive risks stack overflow. Always prefer iterative unless asked.
3. **Dummy node pattern** — when head might change position (sublist/k-group reversal), use `dummy.next = head` as an anchor. Return `dummy.next`. Eliminates edge case handling for `left=1`.
4. **"Insert at front" for sublist** — for Reverse Sublist, repeatedly move `curr.next` to after `prev`. Cleaner than re-implementing full reversal with boundary tracking.
5. **Reversal is the building block** — Palindrome LL, Reorder List, Merge Sort LL all use partial reversal. Master this cold and the rest follow.