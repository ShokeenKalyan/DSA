# 104 - Find Peak Element

## Problem
**LeetCode:** [#162 Find Peak Element](https://leetcode.com/problems/find-peak-element/)  
**Difficulty:** Medium  
**Topic:** Binary Search

### Statement
Find any peak element (strictly greater than neighbours). `nums[-1] = nums[n] = -∞`. Return any valid peak index. O(log n) required.

```
[1,2,3,1]       →  2   (nums[2]=3)
[1,2,1,3,5,6,4] →  1 or 5  (any valid peak)
[1,2]           →  1
```

---

## Intuition — Move Toward Ascending Slope

At any `mid`:
- `nums[mid] < nums[mid+1]` → ascending → peak exists to the **right** → `left = mid+1`
- `nums[mid] > nums[mid+1]` → descending → peak exists at **mid or left** → `right = mid`

Boundary conditions `nums[-1] = nums[n] = -∞` guarantee a peak always exists in the chosen direction.

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #162 — Find Peak Element
 * Time: O(log n) | Space: O(1)
 */
function findPeakElement(nums) {
    let left = 0, right = nums.length - 1;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);

        if (nums[mid] < nums[mid+1]) {
            left = mid + 1;  // Ascending → peak to the right
        } else {
            right = mid;     // Descending → peak at mid or left
        }
    }

    return left; // left === right === peak index
}

// Linear scan — O(n) for reference
function findPeakLinear(nums) {
    for (let i = 0; i < nums.length; i++) {
        const leftOk  = i === 0 || nums[i] > nums[i-1];
        const rightOk = i === nums.length-1 || nums[i] > nums[i+1];
        if (leftOk && rightOk) return i;
    }
}

console.log(findPeakElement([1,2,3,1]));       // 2 ✅
console.log(findPeakElement([1,2,1,3,5,6,4])); // 5 ✅
console.log(findPeakElement([1,2]));            // 1 ✅
console.log(findPeakElement([2,1]));            // 0 ✅
console.log(findPeakElement([1,2,3]));          // 2 ✅ (monotone)
```

---

## Dry Run

```
[1,2,3,1]: l=0, r=3

mid=1: 2<3 → ascending → l=2
mid=2: 3>1 → descending → r=2
l===r=2 → return 2 ✅

[1,2,1,3,5,6,4]: l=0, r=6

mid=3: 3<5 → l=4
mid=5: 6>4 → r=5
mid=4: 5<6 → l=5
l===r=5 → return 5 ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Linear | O(n) | O(1) |
| **Binary Search** | **O(log n)** | **O(1)** |

---

## Why Correct — Invariant Proof

```
Invariant: a peak always exists in [left, right]

Ascending (nums[mid] < nums[mid+1]):
  mid is NOT a peak. But going right from mid+1,
  nums[n]=-∞ guarantees we must descend → peak in [mid+1,right] ✅

Descending (nums[mid] > nums[mid+1]):
  Peak in [left,mid]: going left from mid,
  nums[-1]=-∞ guarantees we must descend → peak in [left,mid] ✅

Termination: left===right → that index satisfies invariant → peak ✅
```

---

## P69 vs P104

| | Peak Index (P69) | Find Peak (P104) |
|---|---|---|
| Array | Guaranteed one peak | Any array |
| Answer | That one peak | Any valid peak |
| Code | Identical | Identical |

Same binary search — P69 has unique peak guarantee, P104 may have multiple. Algorithm doesn't care — converges to a peak either way.

---

## Key Patterns & Takeaways

1. **Move toward ascending slope** — `nums[mid] < nums[mid+1]` → go right. Else → go left (including mid). Boundary conditions guarantee a peak exists in chosen direction.
2. **Template 2 (`left < right`, `right = mid`)** — same as P67/P69. Exits at `left===right`. `right=mid` (not `mid-1`) because mid could be the peak.
3. **Any peak is valid** — no need to find global max. Algorithm converges to whatever peak binary search reaches.
4. **Identical to P69** — same code, different guarantee. Know one, know both.
5. **`nums[-1]=nums[n]=-∞`** — the implicit boundary that makes the invariant hold. Without it, the algorithm could fail for monotone arrays.