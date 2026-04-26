# 49 - Contains Duplicate II

## Problem
**LeetCode:** [#219 Contains Duplicate II](https://leetcode.com/problems/contains-duplicate-ii/)  
**Difficulty:** Easy  
**Topic:** Arrays, Hashing, Sliding Window

### Statement
Return `true` if `nums[i] === nums[j]` AND `|i - j| <= k` for some distinct `i`, `j`.

```
[1,2,3,1],    k=3  →  true   (indices 0,3: |0-3|=3 ≤ 3)
[1,0,1,1],    k=1  →  true   (indices 2,3: |2-3|=1 ≤ 1)
[1,2,3,1,2,3], k=2 →  false  (duplicates too far apart)
```

---

## Intuition

**Distance constraint → sliding window of size k.** Maintain a Set of the last `k` elements. If the new element is already in the window → duplicate within k distance. Evict oldest when window exceeds k.

Better than HashMap approach (O(n) space) — sliding window only needs O(k) space.

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: HashMap — O(n) time, O(n) space
// ─────────────────────────────────────────────────────────
function containsNearbyDuplicateMap(nums, k) {
    const lastSeen = new Map();
    for (let i = 0; i < nums.length; i++) {
        if (lastSeen.has(nums[i]) && i - lastSeen.get(nums[i]) <= k)
            return true;
        lastSeen.set(nums[i], i); // Always update to most recent index
    }
    return false;
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: Sliding Window Set — O(n) time, O(k) space ✅
// Window contains exactly last k elements
// ─────────────────────────────────────────────────────────
function containsNearbyDuplicate(nums, k) {
    const window = new Set();

    for (let i = 0; i < nums.length; i++) {
        if (window.has(nums[i])) return true; // Duplicate in window

        window.add(nums[i]);

        // Evict oldest element when window exceeds size k
        if (window.size > k) window.delete(nums[i - k]);
    }

    return false;
}

console.log(containsNearbyDuplicate([1,2,3,1], 3));      // true  ✅
console.log(containsNearbyDuplicate([1,0,1,1], 1));      // true  ✅
console.log(containsNearbyDuplicate([1,2,3,1,2,3], 2));  // false ✅
console.log(containsNearbyDuplicate([1,2,1], 0));         // false ✅
```

---

## Dry Run

```
nums=[1,2,3,1], k=3

i=0: 1 not in {} → add.   window={1}
i=1: 2 not in {1} → add.  window={1,2}
i=2: 3 not in {1,2} → add. window={1,2,3}
i=3: 1 IN {1,2,3} → return true ✅

nums=[1,2,3,1,2,3], k=2

i=0: add 1. {1}
i=1: add 2. {1,2}
i=2: add 3. {1,2,3}, size>2 → delete nums[0]=1 → {2,3}
i=3: add 1. {2,3,1}, size>2 → delete nums[1]=2 → {3,1}
i=4: add 2. {3,1,2}, size>2 → delete nums[2]=3 → {1,2}
i=5: add 3. {1,2,3}, size>2 → delete nums[3]=1 → {2,3}
Return false ✅
```

---

## Complexity

| Approach | Time | Space | Notes |
|---|---|---|---|
| HashMap | O(n) | O(n) | All distinct values stored |
| **Sliding Window Set** | **O(n)** | **O(min(n,k))** | Only k elements at a time |

---

## Key Patterns & Takeaways

1. **Distance constraint → sliding window** — "within k indices" always means window of size k. Maintain by evicting `nums[i - k]` when size exceeds k.
2. **Evict at `nums[i - k]`** — exactly k steps back. No extra pointer or queue needed.
3. **HashMap stores last seen index** — always update even on a miss. More recent = better for future checks.
4. **k=0 → always false** — window is empty, nothing to match. Handled naturally.
5. **Contains Duplicate III (LC #220)** — adds a value constraint `|nums[i]-nums[j]| <= t`. Requires a sorted window (TreeMap/BST) to find values within range t efficiently.