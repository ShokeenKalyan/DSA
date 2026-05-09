# 111 - Reorder List

## Problem
**LeetCode:** [#143 Reorder List](https://leetcode.com/problems/reorder-list/)  
**Difficulty:** Medium  
**Topic:** Linked List

### Statement
Reorder `L0→L1→...→Ln` to `L0→Ln→L1→Ln-1→L2→Ln-2→...` in-place.

```
1→2→3→4    →  1→4→2→3
1→2→3→4→5  →  1→5→2→4→3
```

---

## Intuition — Three-Step Synthesis

```
Step 1: Find middle (P24 — first middle variant)
Step 2: Reverse second half (P23)
Step 3: Merge alternately (P25 style)

1→2→3→4→5
  mid=3 → [1→2→3] and [4→5]
  reverse [4→5] → [5→4]
  merge: 1→5→2→4→3 ✅
```

Same setup as Palindrome LL (P31), plus Step 3 (merge instead of compare).

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #143 — Reorder List
 * Time: O(n) | Space: O(1)
 */
function reorderList(head) {
    if (!head || !head.next) return;

    // Step 1: Find last node of first half (first middle)
    let slow = head, fast = head;
    while (fast.next !== null && fast.next.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // Step 2: Reverse second half
    let secondHalf = slow.next;
    slow.next = null; // Cut — MUST happen before reverse

    let prev = null, curr = secondHalf;
    while (curr !== null) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    secondHalf = prev;

    // Step 3: Merge alternately
    let first = head, second = secondHalf;

    while (second !== null) {
        const firstNext  = first.next;
        const secondNext = second.next;

        first.next  = second;    // first → second
        second.next = firstNext; // second → next first

        first  = firstNext;
        second = secondNext;
    }
}

// 1→2→3→4   → 1→4→2→3 ✅
// 1→2→3→4→5 → 1→5→2→4→3 ✅
```

---

## Dry Run

```
1→2→3→4→5:

Step 1: slow=3 (first middle), fast=5
  Cut: [1→2→3] | [4→5]

Step 2: Reverse [4→5] → [5→4]

Step 3: Merge
  1,5: 1→5→2→...
  2,4: ...→2→4→3→...
  3,null: 3 already at end
  → 1→5→2→4→3 ✅

1→2→3→4 (even):

Step 1: slow=2. First:[1→2], Second:[3→4]
Step 2: Reverse [3→4] → [4→3]
Step 3: 1→4→2→3 ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(n) — three O(n) passes |
| Space | O(1) |

---

## Three-Problem Synthesis

| Step | Technique | Problem |
|---|---|---|
| 1 | Find middle (first middle) | P24 |
| 2 | Reverse linked list | P23 |
| 3 | Merge alternately | P25 style |

---

## Key Details

```
"First middle" variant: fast.next AND fast.next.next ≠ null
  → slow stops at LAST node of first half
  → clean cut for both even and odd lists

Cut before reversing: slow.next = null
  Without this, reverse would corrupt the first half.

while (second !== null) for merge:
  Second half ≤ first half length. When second runs out,
  remaining first-half nodes are already in place.
```

---

## Key Patterns & Takeaways

1. **Three-step synthesis** — Find Middle + Reverse + Merge Alternately. State the decomposition before coding.
2. **"First middle"** — `fast.next && fast.next.next` stops slow at last node of first half. Clean even/odd cut.
3. **Cut before reversing** — `slow.next = null` required. Prevents reverse from corrupting first half.
4. **`while (second)`** — second half is shorter or equal. Remaining first-half nodes auto-placed at end.
5. **Palindrome LL (P31) connection** — Steps 1+2 are identical. P31 then compares; P111 then merges.