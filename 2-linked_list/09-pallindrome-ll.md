# 31 - Check if a Linked List is a Palindrome

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/check-if-given-linked-list-is-plaindrome) | [LeetCode #234](https://leetcode.com/problems/palindrome-linked-list/)  
**Difficulty:** Easy  
**Topic:** Linked List, Two Pointers, Slow/Fast Pointer

### Statement
Return `true` if the linked list is a palindrome, `false` otherwise.

```
1→2→2→1     →  true
1→2→3→2→1   →  true
1→2          →  false
```

---

## Approaches

| Approach | Time | Space | Notes |
|---|---|---|---|
| Array | O(n) | O(n) | Simple |
| Recursive | O(n) | O(n) | Stack space |
| **Find Middle + Reverse** | **O(n)** | **O(1)** | Optimal — synthesis of Problems 23 & 24 |

---

## Optimal Strategy: Find Middle + Reverse + Compare

```
Step 1: Find FIRST middle (end of first half) — Condition B
Step 2: Reverse second half (starting from slow.next)
Step 3: Compare both halves node by node (while p2 !== null)
Step 4: Restore the list (reverse second half back)
```

**Why "first middle" (Condition B)?**
```
Even list [1,2,2,1]: first middle = node(2) [index 1]
  second half = [2,1], reversed = [1,2]
  halves: [1,2] vs [1,2] → correct ✅

Using "second middle" → second half = [1] only → wrong comparison ❌
```

---

## Solution (JavaScript)

```javascript
// Helper from Problem 23
function reverseList(head) {
    let prev = null, curr = head;
    while (curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

// ─────────────────────────────────────────────────────────
// APPROACH 1: Array — O(n) time, O(n) space
// ─────────────────────────────────────────────────────────
function isPalindromeArray(head) {
    const vals = [];
    let curr = head;
    while (curr) { vals.push(curr.val); curr = curr.next; }
    let l = 0, r = vals.length - 1;
    while (l < r) { if (vals[l++] !== vals[r--]) return false; }
    return true;
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Recursive — O(n) time, O(n) stack
// Clever closure: front advances forward as recursion unwinds backward
// ─────────────────────────────────────────────────────────
function isPalindromeRecursive(head) {
    let front = head;
    function check(curr) {
        if (!curr) return true;
        if (!check(curr.next)) return false; // recurse to end first
        if (curr.val !== front.val) return false; // compare on the way back
        front = front.next;
        return true;
    }
    return check(head);
}


// ─────────────────────────────────────────────────────────
// APPROACH 3: Find Middle + Reverse + Compare — O(n), O(1) ✅
// Synthesis of Problem 23 (Reverse) and Problem 24 (Find Middle)
// ─────────────────────────────────────────────────────────
function isPalindrome(head) {
    if (!head || !head.next) return true;

    // Step 1: Find FIRST middle — Condition B
    // slow ends at last node of first half (critical for correct split)
    let slow = head, fast = head;
    while (fast.next !== null && fast.next.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // Step 2: Reverse second half
    let secondHalfHead = reverseList(slow.next);
    slow.next = null; // Cut first half

    // Step 3: Compare
    let p1 = head, p2 = secondHalfHead, isPalin = true;
    while (p2 !== null) { // p2 never longer than p1 — terminates correctly
        if (p1.val !== p2.val) { isPalin = false; break; }
        p1 = p1.next;
        p2 = p2.next;
    }

    // Step 4: Restore (good engineering practice)
    slow.next = reverseList(secondHalfHead);

    return isPalin;
}

console.log(isPalindrome(buildList([1,2,2,1])));     // true  ✅
console.log(isPalindrome(buildList([1,2,3,2,1])));   // true  ✅
console.log(isPalindrome(buildList([1,2])));          // false ✅
console.log(isPalindrome(buildList([1])));            // true  ✅
```

---

## Dry Run

```
List: 1→2→2→1 (even)

Step 1 (first middle, Condition B):
  slow=1,fast=1 → fast.next=2(ok),fast.next.next=2(ok) → slow=2,fast=2(3rd)
  fast.next=1(ok),fast.next.next=null → STOP
  slow = node(2) [index 1, first of two 2s] ✅

Step 2: reverseList(2→1) = 1→2.  slow.next=null → [1→2] | [1→2]

Step 3: p1=1,p2=1 → ✅; p1=2,p2=2 → ✅; p2=null → STOP. isPalin=true ✅

Step 4: slow.next = reverseList(1→2) = 2→1. List restored: 1→2→2→1 ✅
```

---

## ⚠️ Critical Details

```
1. FIRST middle (Condition B), not second — gives correct even split.
   Fast.next===null && fast.next.next===null is the stopping condition.

2. Compare while p2 !== null — second half ≤ first half always.
   p2 terminates first (odd) or simultaneously (even). Correct.

3. Restore after comparing — shows engineering discipline in interviews.
   slow.next = reverseList(secondHalfHead)

4. slow.next = null after finding middle — clean cut of first half,
   prevents p1 from walking into the reversed section.
```

---

## Key Patterns & Takeaways

1. **Synthesis of Problems 23 + 24** — palindrome = Find Middle + Reverse Second Half + Compare. Stating this decomposition immediately is the senior response.
2. **Always use "first middle" here** — Condition B gives slow at end of first half. Correct split for both even and odd length lists.
3. **Compare while p2, not p1** — second half never exceeds first half. p2 terminates the comparison loop correctly.
4. **Restore the list** — reverse second half back and reattach. Good practice and expected in interviews.
5. **Recursive closure trick** — `front` captured in closure advances forward while recursion unwinds backward. Elegant alternative worth understanding even if not the optimal solution.