# 37 - Rotate a Linked List

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/rotate-a-linked-list) | [LeetCode #61](https://leetcode.com/problems/rotate-list/)  
**Difficulty:** Medium  
**Topic:** Linked List, Two Pointers

### Statement
Rotate a linked list **right** by `k` places.

```
1→2→3→4→5, k=2  →  4→5→1→2→3
0→1→2,     k=4  →  2→0→1   (4%3=1 effective rotation)
1→2→3→4→5, k=5  →  1→2→3→4→5  (no change)
```

---

## Intuition — Make Circular, Then Cut

"Rotate right by k" = move last k nodes to the front.

```
[1,2,3,4,5], k=2:  last 2 = [4,5], first 3 = [1,2,3]
After: [4,5,1,2,3] ✅
```

**Algorithm:**
1. Find length `n` and tail in one pass
2. Normalise `k = k % n` — essential!
3. Connect `tail.next = head` (make circular)
4. Walk `n - k - 1` steps to find new tail
5. `newHead = newTail.next`, `newTail.next = null`

**Why `n - k - 1` steps?**
New head is at position `n - k` (1-indexed).
New tail is one before it → `n - k - 1` steps from index 0.

---

## Solution (JavaScript)

```javascript
/**
 * Rotate Linked List Right by k — LeetCode #61
 * Time: O(n) | Space: O(1)
 */
function rotateRight(head, k) {
    if (!head || !head.next || k === 0) return head;

    // Step 1: Find length AND tail in one pass
    let length = 1;
    let tail = head;
    while (tail.next !== null) { tail = tail.next; length++; }

    // Step 2: Normalise k — MANDATORY
    k = k % length;
    if (k === 0) return head; // Full rotations = no change

    // Step 3: Make circular
    tail.next = head;

    // Step 4: Find new tail (n-k-1 steps from original head)
    let newTail = head;
    for (let i = 0; i < length - k - 1; i++) {
        newTail = newTail.next;
    }

    // Step 5: Extract new head, break circle
    const newHead = newTail.next;
    newTail.next = null;

    return newHead;
}

console.log(printList(rotateRight(buildList([1,2,3,4,5]), 2))); // 4→5→1→2→3 ✅
console.log(printList(rotateRight(buildList([0,1,2]), 4)));     // 2→0→1 ✅
console.log(printList(rotateRight(buildList([1,2,3,4,5]), 5))); // 1→2→3→4→5 ✅
console.log(printList(rotateRight(buildList([1,2]), 1)));       // 2→1 ✅
```

---

## Dry Run

```
head=1→2→3→4→5, k=2

Step 1: length=5, tail=node(5)
Step 2: k=2%5=2
Step 3: 5.next=1 → circular: 1→2→3→4→5→1→...
Step 4: steps=5-2-1=2, walk: 1→2→3 → newTail=node(3)
Step 5: newHead=node(4), node(3).next=null

Result: 4→5→1→2→3 ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(n) — one pass for length, one for cut point |
| Space | O(1) |

---

## Edge Cases

| Case | Input | Output | Note |
|---|---|---|---|
| k=0 | any, k=0 | unchanged | Early return |
| k=n | 5 nodes, k=5 | unchanged | k%n=0 |
| k>n | 3 nodes, k=7 | k=7%3=1 | Normalise |
| Single node | `[1]`, k=100 | `[1]` | head.next=null → early |
| Two nodes | `[1,2]`, k=1 | `[2,1]` | ✅ |

---

## Key Patterns & Takeaways

1. **"Make circular, then cut"** — cleanest mental model for rotation. Connect tail to head in O(1), find cut point, break circle. No complex pointer shuffling.
2. **`k % n` normalisation is mandatory** — without it, k>n cases break. Always normalise before any pointer work.
3. **New tail = `n-k-1` steps from head** — derive: new head at position `n-k` (1-indexed), new tail one before = `n-k-1` steps from index 0.
4. **Find length and tail in same pass** — when `tail.next=null`, you have both. Don't make two passes.
5. **Circular list trick** — making a list circular (tail.next=head) and then cutting at the right point is a reusable technique. Appears in circular buffer problems, Josephus problem variations, and round-robin scheduling simulations.