# 34 - Trapping Rainwater

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/trapping-rainwater) | [LeetCode #42](https://leetcode.com/problems/trapping-rain-water/)  
**Difficulty:** Hard  
**Topic:** Arrays, Two Pointers, Prefix Arrays

### Statement
Given an elevation map as an array of heights, compute how much water can be trapped after raining.

```
[0,1,0,2,1,0,1,3,2,1,2,1]  →  6
[4,2,0,3,2,5]               →  9
[1,0,1]                     →  1
```

---

## The Core Formula

```
water[i] = min(maxLeft[i], maxRight[i]) - height[i]

maxLeft[i]  = max height from 0 to i (including i)
maxRight[i] = max height from i to n-1 (including i)

Why min? Water can only fill to the SHORTER wall — it spills over the shorter side.
Total = sum of max(0, water[i]) for all i
```

---

## Approaches

| Approach | Time | Space | Notes |
|---|---|---|---|
| Brute Force | O(n²) | O(1) | Scan left & right for each i |
| Prefix Arrays | O(n) | O(n) | Precompute leftMax & rightMax |
| **Two Pointer** | **O(n)** | **O(1)** | Space-optimal — preferred |

---

## The Two-Pointer Insight

When `leftMax ≤ rightMax`: the right side has a wall at least as tall as leftMax. Water at `left` is bounded by `leftMax` — not limited by the right (which is at least as tall). Process left, advance `left++`.

When `rightMax < leftMax`: symmetric. Process right, advance `right--`.

**Key:** we always process the side with the smaller max — it's the binding constraint. The other side is already guaranteed to be at least as tall.

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 2: Prefix Arrays — O(n) time, O(n) space
// Three passes: leftMax[], rightMax[], compute water
// ─────────────────────────────────────────────────────────
function trapPrefixArrays(height) {
    const n = height.length;
    if (n === 0) return 0;

    const leftMax = new Array(n);
    leftMax[0] = height[0];
    for (let i = 1; i < n; i++)
        leftMax[i] = Math.max(leftMax[i-1], height[i]);

    const rightMax = new Array(n);
    rightMax[n-1] = height[n-1];
    for (let i = n-2; i >= 0; i--)
        rightMax[i] = Math.max(rightMax[i+1], height[i]);

    let total = 0;
    for (let i = 0; i < n; i++)
        total += Math.max(0, Math.min(leftMax[i], rightMax[i]) - height[i]);

    return total;
}


// ─────────────────────────────────────────────────────────
// APPROACH 3: Two Pointer — O(n) time, O(1) space ✅
// Process the side with the smaller max — it's the binding constraint
// ─────────────────────────────────────────────────────────
function trap(height) {
    const n = height.length;
    if (n === 0) return 0;

    let left = 0, right = n - 1;
    let leftMax = 0, rightMax = 0;
    let totalWater = 0;

    while (left <= right) {
        if (leftMax <= rightMax) {
            // Right wall ≥ leftMax → left side is the binding constraint
            if (height[left] >= leftMax) {
                leftMax = height[left]; // New left max — no water here
            } else {
                totalWater += leftMax - height[left]; // Water trapped
            }
            left++;
        } else {
            // Left wall > rightMax → right side is the binding constraint
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                totalWater += rightMax - height[right];
            }
            right--;
        }
    }

    return totalWater;
}

console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // 6  ✅
console.log(trap([4,2,0,3,2,5]));              // 9  ✅
console.log(trap([1,0,1]));                    // 1  ✅
console.log(trap([3,0,0,2,0,4]));             // 10 ✅
console.log(trap([]));                         // 0  ✅
console.log(trap([1,2,3,4,5]));               // 0  ✅ (monotonic)
```

---

## Dry Run — Prefix Arrays

```
height = [4, 2, 0, 3, 2, 5]

leftMax:  [4, 4, 4, 4, 4, 5]
rightMax: [5, 5, 5, 5, 5, 5]

i=0: min(4,5)-4=0
i=1: min(4,5)-2=2
i=2: min(4,5)-0=4
i=3: min(4,5)-3=1
i=4: min(4,5)-2=2
i=5: min(5,5)-5=0
Total = 9 ✅
```

---

## Dry Run — Two Pointer

```
height=[4,2,0,3,2,5], left=0,right=5,leftMax=0,rightMax=0,water=0

lM(0)<=rM(0): h[0]=4>=lM→lM=4, left=1
lM(4)>rM(0):  h[5]=5>=rM→rM=5, right=4
lM(4)<=rM(5): h[1]=2<lM→water+=2, left=2      water=2
lM(4)<=rM(5): h[2]=0<lM→water+=4, left=3      water=6
lM(4)<=rM(5): h[3]=3<lM→water+=1, left=4      water=7
lM(4)<=rM(5): h[4]=2<lM→water+=2, left=5      water=9
left>right → STOP. Answer: 9 ✅
```

---

## Edge Cases

| Input | Output | Note |
|---|---|---|
| `[]` | `0` | Guard |
| `[5]` | `0` | No water at single bar |
| `[1,2,3,4]` | `0` | Monotonic — no right wall |
| `[4,3,2,1]` | `0` | Monotonic — no left wall |
| `[3,0,3]` | `3` | Classic single valley |

---

## Key Patterns & Takeaways

1. **Formula: `min(maxLeft, maxRight) - height[i]`** — derive by thinking about what limits water at each position: the shorter surrounding wall. Derivation shows understanding.
2. **Two-pointer correctness** — when `leftMax ≤ rightMax`, the right side guarantees a wall at least as tall as `leftMax`. Water at left is bounded by `leftMax` alone. Process the binding constraint side.
3. **Prefix arrays as stepping stone** — present this first. The two-pointer is a space-optimised version: instead of precomputing arrays, track running maxes with two pointers.
4. **"Running max" pattern** — connects to Stock Buy & Sell (Problem 6). Tracking a running aggregate (min/max) as you scan is a recurring array pattern.
5. **Monotonic stack alternative** — O(n) time, O(n) space. Stack tracks indices in decreasing order; when a taller bar found, calculate water for the valley. Worth knowing for stack-focused interviews.