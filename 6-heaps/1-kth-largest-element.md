# 100 - Kth Largest Element in an Array

## Problem
**LeetCode:** [#215 Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)  
**Difficulty:** Medium  
**Topic:** Arrays, Sorting, Heap, QuickSelect

### Statement
Return the kth largest element (not kth distinct).

```
[3,2,1,5,6,4], k=2       →  5
[3,2,3,1,2,4,5,5,6], k=4 →  4
```

---

## Approaches

| Approach | Time | Space | Notes |
|---|---|---|---|
| Sort | O(n log n) | O(1) | Simplest |
| Min-Heap size k | O(n log k) | O(k) | Best for streaming / small k |
| **QuickSelect** | **O(n) avg** | **O(1)** | Best overall average |

---

## Approach 1 — Sort

Sort descending, return index `k-1`. Simple and always correct.

```javascript
function findKthLargestSort(nums, k) {
    nums.sort((a, b) => b - a);
    return nums[k - 1];
}
```

**When to use:** small input, quick implementation needed, or when the full sorted order is also needed.

---

## Approach 2 — Min-Heap of Size k

Maintain a min-heap of the k largest elements seen so far. When heap exceeds size k, evict the minimum. After all elements, the heap's minimum = kth largest.

**Why min-heap (not max-heap)?** We want to efficiently evict the smallest among the k largest candidates. The min-heap's root is always that candidate.

```javascript
// ─────────────────────────────────────────────────────────
// Min-Heap implementation for the heap approach
// ─────────────────────────────────────────────────────────
class MinHeap {
    constructor() { this.heap = []; }

    push(val) {
        this.heap.push(val);
        this._bubbleUp(this.heap.length - 1);
    }

    pop() {
        const min = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._sinkDown(0);
        }
        return min;
    }

    peek() { return this.heap[0]; }
    size() { return this.heap.length; }

    _bubbleUp(i) {
        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            if (this.heap[parent] <= this.heap[i]) break;
            [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
            i = parent;
        }
    }

    _sinkDown(i) {
        const n = this.heap.length;
        while (true) {
            let smallest = i;
            const left = 2*i+1, right = 2*i+2;
            if (left < n && this.heap[left] < this.heap[smallest]) smallest = left;
            if (right < n && this.heap[right] < this.heap[smallest]) smallest = right;
            if (smallest === i) break;
            [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
            i = smallest;
        }
    }
}

function findKthLargestHeap(nums, k) {
    const heap = new MinHeap();

    for (const num of nums) {
        heap.push(num);
        if (heap.size() > k) heap.pop(); // Evict smallest — not in top k
    }

    return heap.peek(); // Root = kth largest
}
```

**When to use:** streaming/online data (process one element at a time), or when k << n (only O(k) space needed).

---

## Approach 3 — QuickSelect (Optimal Average) ✅

QuickSort partitions and recurses **both** halves. QuickSelect partitions and recurses **one** half only — the one containing the target index.

```
target = n - k   (kth largest = element at index n-k in ascending sorted order)

After partition at pivotIdx:
  pivotIdx === target → found! return nums[pivotIdx]
  pivotIdx <  target → target in right half → recurse right
  pivotIdx >  target → target in left  half → recurse left

Work: O(n) + O(n/2) + O(n/4) + ... = O(n) average
```

```javascript
function findKthLargest(nums, k) {
    const n = nums.length;
    const target = n - k; // kth largest is at this index when sorted ascending

    // Lomuto partition — pivot placed in final sorted position
    function partition(left, right) {
        // Randomised pivot prevents O(n²) on sorted input
        const randIdx = left + Math.floor(Math.random() * (right - left + 1));
        [nums[randIdx], nums[right]] = [nums[right], nums[randIdx]];

        const pivot = nums[right];
        let i = left; // Boundary: everything left of i is ≤ pivot

        for (let j = left; j < right; j++) {
            if (nums[j] <= pivot) {
                [nums[i], nums[j]] = [nums[j], nums[i]];
                i++;
            }
        }

        // Place pivot in its correct sorted position
        [nums[i], nums[right]] = [nums[right], nums[i]];
        return i; // Pivot's final index
    }

    function quickSelect(left, right) {
        if (left === right) return nums[left];

        const pivotIdx = partition(left, right);

        if (pivotIdx === target) return nums[pivotIdx]; // Found!
        if (pivotIdx < target)  return quickSelect(pivotIdx + 1, right); // Go right
        else                    return quickSelect(left, pivotIdx - 1);  // Go left
    }

    return quickSelect(0, n - 1);
}
```

**When to use:** general case, best average-case performance, in-place with O(1) extra space.

---

## Full Solution File

```javascript
// ── All three approaches ─────────────────────────────────────

// 1. Sort — O(n log n), O(1)
function findKthLargestSort(nums, k) {
    return nums.sort((a, b) => b - a)[k - 1];
}

// 2. Min-Heap — O(n log k), O(k)
function findKthLargestHeap(nums, k) {
    // (MinHeap class as above)
    const heap = new MinHeap();
    for (const num of nums) {
        heap.push(num);
        if (heap.size() > k) heap.pop();
    }
    return heap.peek();
}

// 3. QuickSelect — O(n) avg, O(1)
function findKthLargest(nums, k) {
    const target = nums.length - k;

    function partition(l, r) {
        const ri = l + Math.floor(Math.random() * (r-l+1));
        [nums[ri], nums[r]] = [nums[r], nums[ri]];
        const pivot = nums[r];
        let i = l;
        for (let j = l; j < r; j++)
            if (nums[j] <= pivot) { [nums[i], nums[j]]=[nums[j],nums[i]]; i++; }
        [nums[i], nums[r]] = [nums[r], nums[i]];
        return i;
    }

    function qs(l, r) {
        if (l === r) return nums[l];
        const p = partition(l, r);
        if (p === target) return nums[p];
        return p < target ? qs(p+1, r) : qs(l, p-1);
    }

    return qs(0, nums.length - 1);
}

// ── Tests ────────────────────────────────────────────────────
console.log(findKthLargest([3,2,1,5,6,4], 2));          // 5 ✅
console.log(findKthLargest([3,2,3,1,2,4,5,5,6], 4));    // 4 ✅
console.log(findKthLargest([1], 1));                      // 1 ✅
console.log(findKthLargest([2,1], 2));                    // 1 ✅
```

---

## Dry Run — QuickSelect

```
nums=[3,2,1,5,6,4], k=2, target=4

Step 1: partition(0,5), say pivot=4
  [3,2,1] ≤ 4 → left side. [5,6] > 4 → right side
  pivot placed at index 3: [3,2,1,4,6,5]
  pivotIdx=3 < target=4 → quickSelect(4,5)

Step 2: partition(4,5), say pivot=5
  [6] > 5 → skip
  pivot placed at index 4: [3,2,1,4,5,6]
  pivotIdx=4 === target=4 → return nums[4]=5 ✅
```

---

## Complexity Summary

| Approach | Time | Space | Best for |
|---|---|---|---|
| Sort | O(n log n) | O(1) | Simplicity |
| Min-Heap | O(n log k) | O(k) | Streaming, k << n |
| **QuickSelect** | **O(n) avg** | **O(1)** | General case |

---

## QuickSelect vs QuickSort

```
QuickSort:    partition → recurse BOTH halves → O(n log n)
QuickSelect:  partition → recurse ONE  half   → O(n) average

After each partition, pivot is at final sorted position.
If it matches target: done in O(n) total work.
If not: recurse into one half of shrinking size.
```

---

## Min-Heap: Why Min Not Max?

```
We track the k LARGEST elements seen so far.
The heap's root is the SMALLEST of those k largest.

When a new element arrives:
  push it → if size > k → pop the min (weakest candidate)

After all elements:
  heap contains exactly the k largest
  heap's root (min) = kth largest ✅

Max-heap would give us the overall maximum at root,
not the kth largest — wrong for this problem.
```

---

## When to Use Which

```
k << n (k much smaller)  → Heap: O(n log k) << O(n log n)
Streaming/online data    → Heap: process one element at a time
General/interview        → QuickSelect: O(n) average, in-place
Need full sorted order   → Sort: clean and simple
```

---

## Key Patterns & Takeaways

1. **QuickSelect = QuickSort one half** — after partition, pivot is at final position. Recurse one half only. O(n) average vs O(n log n) for sort.
2. **`target = n - k`** — kth largest in ascending order is at index `n-k`. Converts problem to order statistic.
3. **Randomised pivot** — prevents O(n²) on sorted/reverse-sorted input. One random swap before partitioning is all it takes. Always include this.
4. **Min-heap for streaming** — maintain heap of size k. Evict minimum when exceeding k. O(log k) per element, O(k) space. Ideal when n is unknown or data streams in.
5. **Lomuto partition** — `i` tracks boundary of elements ≤ pivot. After loop, swap pivot to position `i`. Clean and consistent with QuickSort's standard form.