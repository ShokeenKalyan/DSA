# 30 - Detect a Cycle in a Linked List

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/detect-a-cycle-in-a-linked-list) | [LeetCode #141](https://leetcode.com/problems/linked-list-cycle/) & [#142](https://leetcode.com/problems/linked-list-cycle-ii/)  
**Difficulty:** Easy / Medium  
**Topic:** Linked List, Floyd's Cycle Detection

### Statement
- **Part 1 (LC #141):** Does the list have a cycle? Return `true`/`false`.
- **Part 2 (LC #142):** If yes, return the **node where the cycle begins**.

```
3→2→0→-4→(back to 2)
  ↑ cycle start
hasCycle → true,  detectCycle → node(2)
```

---

## Approaches

| Approach | Time | Space |
|---|---|---|
| HashSet | O(n) | O(n) |
| **Floyd's (Part 1)** | **O(n)** | **O(1)** |
| **Floyd's (Part 2)** | **O(n)** | **O(1)** |

---

## Floyd's Algorithm — Two Phases

### Phase 1: Detect Cycle
Slow moves 1 step, fast moves 2 steps. If cycle exists, fast laps slow → they meet inside the cycle. If no cycle, fast reaches null.

**Why they must meet:** once inside the cycle, fast gains 1 position on slow per step. After at most C steps (cycle length), gap is 0.

### Phase 2: Find Cycle Start (LC #142)
After meeting point found: reset slow to head, keep fast at meeting point. Move **both 1 step** at a time. Where they meet = cycle start.

**Mathematical proof:**
```
Let F = distance from head to cycle start
    a = distance from cycle start to meeting point
    C = cycle length

Phase 1: slow traveled F+a, fast traveled 2(F+a)
         fast also did n full cycles: 2(F+a) = F+a + nC
         → F = nC - a

Phase 2: slow from head travels F steps → reaches cycle start
         fast from meeting point travels F = nC-a steps
         → starts a into cycle, goes nC-a more → lands at cycle start ✅
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// PART 1: Detect Cycle — LC #141
// Time: O(n) | Space: O(1)
// ─────────────────────────────────────────────────────────
function hasCycle(head) {
    if (!head || !head.next) return false;

    let slow = head, fast = head;

    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) return true; // Met inside cycle
    }

    return false; // fast reached null → no cycle
}


// ─────────────────────────────────────────────────────────
// PART 2: Find Cycle Start — LC #142
// Time: O(n) | Space: O(1)
// Phase 1: find meeting point
// Phase 2: reset slow to head, both move 1 step → meet at cycle start
// ─────────────────────────────────────────────────────────
function detectCycle(head) {
    if (!head || !head.next) return null;

    let slow = head, fast = head;

    // Phase 1: Detect
    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow === fast) {
            // Phase 2: Find start
            slow = head; // Reset to head, fast stays at meeting point

            while (slow !== fast) {
                slow = slow.next; // 1 step
                fast = fast.next; // 1 step (NOT 2!)
            }

            return slow; // Cycle start
        }
    }

    return null; // No cycle
}

// Demo: 3→2→0→-4→(back to 2)
const n1=new ListNode(3), n2=new ListNode(2),
      n3=new ListNode(0), n4=new ListNode(-4);
n1.next=n2; n2.next=n3; n3.next=n4; n4.next=n2; // cycle

console.log(hasCycle(n1));          // true  ✅
console.log(detectCycle(n1)?.val);  // 2     ✅
console.log(hasCycle(buildList([1,2,3]))); // false ✅
```

---

## Dry Run

```
List: 3→2→0→-4→(back to 2).  F=1, C=3

Phase 1:
slow=3,fast=3
slow=2,fast=0      (fast: 3→2→0... no: fast.next.next = 2.next.next = 0.next = -4? )

Let me redo carefully:
slow=n1,fast=n1
Step1: slow=n2, fast=n3       (fast: n1.next=n2, n2.next=n3)
Step2: slow=n3, fast=n2       (fast: n3.next=n4, n4.next=n2)
Step3: slow=n4, fast=n4       (fast: n2.next=n3, n3.next=n4) → MEET at n4!

Meeting point: n4(-4), a=2 (two steps into cycle from n2)

Phase 2:
slow=n1(head), fast=n4
Step1: slow=n2, fast=n2 (n4.next=n2) → MEET!

Cycle start: n2(2) ✅   F=1=1×3-2=1 ✅
```

---

## ⚠️ Implementation Details

```
1. fast !== null AND fast.next !== null — both needed.
   Fast moves 2 steps; either could land on null.

2. Check slow===fast AFTER moving, not before.
   Both start at head (equal). Checking before moving = false positive.

3. Phase 2: both move 1 step (not 2).
   The math only works with equal speeds in Phase 2.

4. Phase 2 reset: slow → head. fast STAYS at meeting point.
   Don't reset fast. Don't go to head.next.
```

---

## Floyd's Algorithm Family

| Problem | Application |
|---|---|
| **Detect Cycle (LC #141)** | Phase 1 only |
| **Find Cycle Start (LC #142)** | Phase 1 + Phase 2 |
| **Find Duplicate (LC #287)** | Array as virtual LL, same math |
| **Find Middle (LC #876)** | Same 2:1 ratio, different goal |
| **Happy Number (LC #202)** | Detect cycle in number sequence |

---

## Key Patterns & Takeaways

1. **Tortoise and Hare** — slow:1 step, fast:2 steps. Cycle → they meet. No cycle → fast hits null. Memorise both phases cold.
2. **Phase 2 math: F = nC - a** — derive this in the interview rather than just stating the trick. Shows deep understanding vs. memorization.
3. **Both conditions in while** — `fast !== null && fast.next !== null`. Fast skips nodes; either step could be null.
4. **Check AFTER moving** — meeting check inside loop, after advancing. Both start equal; checking before = instant false positive.
5. **One algorithm, five problems** — Find Duplicate, Find Middle, Detect Cycle, Find Cycle Start, Happy Number all use Floyd's 2:1 ratio. Understanding the math unlocks all of them.