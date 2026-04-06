# 27 - Add Two Numbers Represented as Linked Lists

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/add-two-numbers-represented-as-linked-lists) | [LeetCode #2](https://leetcode.com/problems/add-two-numbers/)  
**Difficulty:** Medium  
**Topic:** Linked List, Math, Carry Propagation

### Statement
Two linked lists represent non-negative integers stored in **reverse order** (head = least significant digit). Add them, return result as a linked list in reverse order.

```
l1=2→4→3 (342) + l2=5→6→4 (465) = 7→0→8 (807) ✅
l1=9→9→9→9→9→9→9 + l2=9→9→9 = 8→9→9→0→0→0→0→1 ✅
```

---

## Intuition — Elementary Addition with Carry

Lists are already in reverse order → just traverse head-to-tail (= right-to-left addition). At each position:

```
sum   = d1 + d2 + carry
carry = Math.floor(sum / 10)   → carry to next position
digit = sum % 10               → current position digit
```

**The three-condition loop:** `while (l1 || l2 || carry !== 0)`
- Handles different-length lists (treat exhausted digits as 0)
- Handles final carry after both lists exhausted (creates extra node)

---

## The Most Common Bug

```
9→9→9 + 1 = 0→0→0→1  (999 + 1 = 1000)

After all digits processed, carry=1 remains.
The while condition `carry !== 0` catches this and creates the extra '1' node.
Without it: result is 0→0→0 (missing the leading 1). ❌
```

---

## Solution (JavaScript)

```javascript
/**
 * Add Two Numbers — LeetCode #2
 * Time: O(max(m,n)) | Space: O(max(m,n))
 */
function addTwoNumbers(l1, l2) {
    const dummy = new ListNode(0); // Anchor for result list
    let curr = dummy;
    let carry = 0;

    // Continue while either list has digits OR carry remains
    while (l1 !== null || l2 !== null || carry !== 0) {
        const d1 = l1 !== null ? l1.val : 0; // 0 if list exhausted
        const d2 = l2 !== null ? l2.val : 0;

        const sum   = d1 + d2 + carry;
        carry       = Math.floor(sum / 10);
        const digit = sum % 10;

        curr.next = new ListNode(digit);
        curr = curr.next;

        if (l1 !== null) l1 = l1.next;
        if (l2 !== null) l2 = l2.next;
    }

    return dummy.next;
}

console.log(printList(addTwoNumbers(buildList([2,4,3]), buildList([5,6,4]))));
// 7→0→8 ✅ (342+465=807)

console.log(printList(addTwoNumbers(buildList([9,9,9,9,9,9,9]), buildList([9,9,9]))));
// 8→9→9→0→0→0→0→1 ✅ (9999999+999=10000998)

console.log(printList(addTwoNumbers(buildList([9]), buildList([1]))));
// 0→1 ✅ (9+1=10)
```

---

## Dry Run

```
l1=2→4→3, l2=5→6→4, carry=0

Iter 1: d1=2,d2=5, sum=7,  carry=0, digit=7 → node(7)
Iter 2: d1=4,d2=6, sum=10, carry=1, digit=0 → node(0)
Iter 3: d1=3,d2=4, sum=8,  carry=0, digit=8 → node(8)
        (sum=3+4+1carry=8)
l1=null, l2=null, carry=0 → EXIT

Result: 7→0→8 ✅ (807)
```

---

## Complexity

| | Value |
|---|---|
| Time | O(max(m, n)) |
| Space | O(max(m, n)) — result list (at most max(m,n)+1 nodes) |

---

## BONUS — Add Two Numbers II: Forward Order (LC #445)

Digits stored in forward order (head = most significant). Use stacks to process from right to left, then prepend nodes to build result.

```javascript
// Time: O(m+n) | Space: O(m+n) for stacks
function addTwoNumbersII(l1, l2) {
    const s1 = [], s2 = [];
    while (l1) { s1.push(l1.val); l1 = l1.next; }
    while (l2) { s2.push(l2.val); l2 = l2.next; }

    let carry = 0, head = null;

    while (s1.length || s2.length || carry) {
        const sum   = (s1.length ? s1.pop() : 0) + (s2.length ? s2.pop() : 0) + carry;
        carry       = Math.floor(sum / 10);
        const node  = new ListNode(sum % 10);
        node.next   = head;    // PREPEND (build from right to left)
        head        = node;
    }

    return head;
}

// 7→2→4→3 (7243) + 5→6→4 (564) = 7→8→0→7 (7807)
console.log(printList(addTwoNumbersII(buildList([7,2,4,3]), buildList([5,6,4])))); // ✅
```

---

## Edge Cases

| Case | Input | Output | Note |
|---|---|---|---|
| Both zero | `[0],[0]` | `0` | sum=0, carry=0 |
| Final carry | `[9,9],[1]` | `0→0→1` | carry drives extra iteration |
| Different lengths | `[1],[9,9]` | `0→0→1` | d1=0 when l1 exhausted |
| All 9s + 1 | `[9,9,9],[1]` | `0→0→0→1` | carry propagates all the way |

---

## Key Patterns & Takeaways

1. **Three-condition loop** — `while (l1 || l2 || carry !== 0)`. Handles different lengths AND final carry naturally. No post-loop carry check needed.
2. **`d = list ? list.val : 0`** — treat exhausted lists as providing 0. Eliminates all length-mismatch edge cases cleanly.
3. **Dummy node for result** — clean list construction, no first-node special case. Same pattern as Merge Two Lists.
4. **Carry propagation formula** — `carry = Math.floor(sum/10)`, `digit = sum%10`. This exact logic appears in Multiply Strings, Plus One, and all arithmetic simulation problems.
5. **Forward-order variant** — use stacks (pop from top = least significant) and prepend nodes to build result from right to left. Alternative: reverse both lists, apply original algorithm, reverse result.