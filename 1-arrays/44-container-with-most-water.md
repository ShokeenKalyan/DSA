# 58 - Container with Most Water

## Problem
**LeetCode:** [#11 Container with Most Water](https://leetcode.com/problems/container-with-most-water/)  
**Difficulty:** Medium  
**Topic:** Arrays, Two Pointers, Greedy

### Statement
Find two lines forming a container with the most water.  
Area = `min(height[left], height[right]) × (right - left)`

```
[1,8,6,2,5,4,8,3,7]  →  49
[1,1]                  →  1
[4,3,2,1,4]           →  16
```

---

## Intuition — Move the Shorter Pointer

Start widest (left=0, right=n-1). At each step: area is bounded by the **shorter** line. Moving the taller pointer inward keeps the same height ceiling but reduces width → area can only decrease. Moving the **shorter** pointer gives a chance to find a taller line.

**Greedy proof:**
```
h[left] < h[right]:
  Moving right-- → width shrinks, height bound ≤ h[left] → area ≤ current
  Moving left++  → chance to find h[left'] > h[left] → area may increase

∴ Always move the shorter pointer. ✅
```

---

## Solution (JavaScript)

```javascript
/**
 * Container with Most Water — LeetCode #11
 * Time: O(n) | Space: O(1)
 */
function maxArea(height) {
    let left = 0, right = height.length - 1;
    let maxWater = 0;

    while (left < right) {
        const area = Math.min(height[left], height[right]) * (right - left);
        maxWater = Math.max(maxWater, area);

        // Move the shorter pointer — moving taller is provably suboptimal
        if (height[left] <= height[right]) left++;
        else right--;
    }

    return maxWater;
}

console.log(maxArea([1,8,6,2,5,4,8,3,7])); // 49 ✅
console.log(maxArea([1,1]));                // 1  ✅
console.log(maxArea([4,3,2,1,4]));          // 16 ✅
console.log(maxArea([1,2,1]));              // 2  ✅
```

---

## Dry Run

```
height=[1,8,6,2,5,4,8,3,7]

l=0,r=8: min(1,7)×8=8,  max=8.  1<7 → l++
l=1,r=8: min(8,7)×7=49, max=49. 8>7 → r--
l=1,r=7: min(8,3)×6=18, max=49. 8>3 → r--
l=1,r=6: min(8,8)×5=40, max=49. 8=8 → l++
...

Answer: 49 ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute | O(n²) | O(1) |
| **Two Pointer** | **O(n)** | **O(1)** |

---

## Container vs Trapping Rainwater (P34)

| | Container (P58) | Trapping Rain (P34) |
|---|---|---|
| Lines | 2 lines only | All bars |
| Goal | Maximise one rectangle | Sum all trapped water |
| Formula | `min(h[l],h[r]) × (r-l)` | `min(maxL,maxR) - h[i]` |

Both use two pointers + min of heights — but different problems entirely.

---

## Key Patterns & Takeaways

1. **Move the shorter pointer** — greedy choice. Moving the taller is provably suboptimal (height ceiling stays same or shrinks, width always decreases).
2. **Start at widest** — `left=0, right=n-1` gives max width. We trade width for hopefully taller heights.
3. **`<=` on equal heights** — moving either is correct when equal. `<=` moves left consistently.
4. **Know the greedy proof** — be ready to explain *why* moving the shorter pointer is correct under interview pressure. That's the senior signal here.
5. **Confusion with Trapping Rain** — similar structure, completely different problem. Container = maximise one pair; Trapping = sum water across all positions.