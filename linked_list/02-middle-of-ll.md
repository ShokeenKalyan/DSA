# 24 - Find Middle Element in a Linked List

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/find-middle-element-in-a-linked-list) | [LeetCode #876](https://leetcode.com/problems/middle-of-the-linked-list/)  
**Difficulty:** Easy  
**Topic:** Linked List, Slow/Fast Pointer

### Statement
Return the middle node of a linked list. For even-length lists, return the **second middle** (LeetCode default).

```
1→2→3→4→5     →  Node(3)   (odd — one middle)
1→2→3→4→5→6  →  Node(4)   (even — second middle)
1→2           →  Node(2)
```

---

## The "Which Middle?" Nuance — Critical for Follow-ups

Two stopping conditions, two different middles:

```
Condition A: while (fast !== null && fast.next !== null)
  → SECOND middle for even-length (LeetCode default)
  → [1,2,3,4]: stops at 3

Condition B: while (fast.next !== null && fast.next.next !== null)
  → FIRST middle for even-length
  → [1,2,3,4]: stops at 2
```

**When does this matter?**
In Palindrome LL and Reorder List, you split at the middle and reverse the second half. Use **first middle** (Condition B) so `slow` is at the last node of the first half. Then: `secondHalf = slow.next; slow.next = null`.

---

## Intuition — Slow/Fast Pointer

```
Slow moves 1 step, Fast moves 2 steps.
When Fast reaches the end (n steps), Slow has traveled n/2 steps → middle.
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Two Pass — O(n), 2 traversals
// ─────────────────────────────────────────────────────────
function middleNodeTwoPass(head) {
    let length = 0, curr = head;
    while (curr) { length++; curr = curr.next; }

    let steps = Math.floor(length / 2);
    curr = head;
    while (steps-- > 0) curr = curr.next;
    return curr;
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Slow/Fast Pointer — O(n), 1 traversal ✅
// Returns SECOND middle for even (Condition A)
// ─────────────────────────────────────────────────────────
function middleNode(head) {
    let slow = head, fast = head;

    while (fast !== null && fast.next !== null) {
        slow = slow.next;       // 1 step
        fast = fast.next.next;  // 2 steps
    }

    return slow; // second middle for even, only middle for odd
}


// ─────────────────────────────────────────────────────────
// VARIANT: Returns FIRST middle for even (Condition B)
// Use this when splitting the list: slow will be the last node
// of the first half → secondHalf = slow.next; slow.next = null
// ─────────────────────────────────────────────────────────
function middleNodeFirst(head) {
    let slow = head, fast = head;

    while (fast.next !== null && fast.next.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow; // first middle for even
}

// Tests
console.log(middleNode(buildList([1,2,3,4,5])).val);      // 3 ✅
console.log(middleNode(buildList([1,2,3,4,5,6])).val);    // 4 ✅ (second middle)
console.log(middleNodeFirst(buildList([1,2,3,4,5,6])).val); // 3 ✅ (first middle)
console.log(middleNode(buildList([1])).val);               // 1 ✅
console.log(middleNode(buildList([1,2])).val);             // 2 ✅
```

---

## Dry Run

```
List: 1→2→3→4→5   (odd)

slow=1,fast=1
slow=2,fast=3
slow=3,fast=5 → fast.next=null → STOP
→ slow=3 ✅

List: 1→2→3→4→5→6   (even)

slow=1,fast=1
slow=2,fast=3
slow=3,fast=5
slow=4,fast=null → STOP  (fast.next.next goes past end)
→ slow=4 ✅ (second middle)
```

---

## Complexity

| Approach | Time | Space | Passes |
|---|---|---|---|
| Two Pass | O(n) | O(1) | 2 |
| **Slow/Fast Pointer** | **O(n)** | **O(1)** | **1** |

---

## The Slow/Fast Pointer Family

| Problem | What slow finds | LeetCode |
|---|---|---|
| **Find Middle** | Middle node | #876 |
| **Detect Cycle** | Whether cycle exists | #141 |
| **Find Cycle Start** | Where cycle begins | #142 |
| **Find Duplicate** | Duplicate (array as LL) | #287 |
| **Nth Node from End** | Nth from end | #19 |
| **Palindrome LL** | Split + reverse second half | #234 |

---

## Key Patterns & Takeaways

1. **Slow/Fast = distance halving** — slow covers half the distance of fast in the same time. When fast finishes (n steps), slow is at n/2. Works for any 2:1 traversal ratio.
2. **Two stopping conditions — know both:**
   - `fast !== null && fast.next !== null` → second middle (LeetCode default)
   - `fast.next !== null && fast.next.next !== null` → first middle (use for splitting)
3. **"First middle" for splitting** — gives `slow` as last node of first half. Split cleanly: `secondHalf = slow.next; slow.next = null`.
4. **One pass > two pass** — no need to know list length. Single traversal is strictly cleaner and faster in practice.
5. **Floyd's connection** — same slow/fast principle as Problem 10 (Find Duplicate, virtual LL) and Problem 10's cycle detection. The mathematical 2:1 ratio is the unifying idea.