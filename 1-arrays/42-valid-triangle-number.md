# 60 - Valid Triangle Number

## Problem
**LeetCode:** [#611 Valid Triangle Number](https://leetcode.com/problems/valid-triangle-number/)  
**Difficulty:** Medium  
**Topic:** Arrays, Two Pointers, Sorting, Greedy

### Statement
Count triplets that can form valid triangle sides.  
For sorted `a ≤ b ≤ c`: only check `a + b > c`.

```
[2,2,3,4]  →  3   (2,3,4),(2,3,4),(2,2,3)
[4,2,3,4]  →  4
[0,0,0]    →  0
```

---

## Intuition — Sort + Fix Largest + Two Pointer Count

Sort ascending. Fix `nums[k]` as the largest side. For each `k`, count pairs `(left, right)` in `[0..k-1]` where `nums[left]+nums[right] > nums[k]`.

**When `nums[left]+nums[right] > nums[k]`:**  
Since array is sorted, ALL indices between `left` and `right-1` also form valid pairs with `right`.  
→ `count += right - left` (bulk count), then `right--`

**When `nums[left]+nums[right] <= nums[k]`:**  
Sum too small → `left++`

---

## Solution (JavaScript)

```javascript
/**
 * Valid Triangle Number — LeetCode #611
 * Time: O(n²) | Space: O(1)
 */
function triangleNumber(nums) {
    nums.sort((a, b) => a - b);
    const n = nums.length;
    let count = 0;

    for (let k = n - 1; k >= 2; k--) {
        let left = 0, right = k - 1;

        while (left < right) {
            if (nums[left] + nums[right] > nums[k]) {
                // All pairs (left..right-1, right) are valid
                // because nums is sorted → nums[x] ≥ nums[left] for x in [left,right-1]
                count += right - left; // Bulk count
                right--;
            } else {
                left++; // Sum too small
            }
        }
    }

    return count;
}

console.log(triangleNumber([2,2,3,4])); // 3 ✅
console.log(triangleNumber([4,2,3,4])); // 4 ✅
console.log(triangleNumber([0,0,0]));   // 0 ✅
console.log(triangleNumber([2,2,2]));   // 1 ✅
console.log(triangleNumber([1,1,1,1])); // 4 ✅
```

---

## Dry Run

```
[2,2,3,4] sorted [2,2,3,4]

k=3 (c=4), l=0, r=2:
  2+3=5>4 → count+=2-0=2, r=1
  2+2=4>4? NO → l=1. l>=r → stop

k=2 (c=3), l=0, r=1:
  2+2=4>3 → count+=1-0=1, r=0. l>=r → stop

Total count = 3 ✅
```

---

## Why `count += right - left`?

```
nums (sorted): [..., left, left+1, ..., right-1, right, ...]

If nums[left] + nums[right] > c:
  Since nums[left] ≤ nums[left+1] ≤ ... ≤ nums[right-1]:
  nums[left+1]+nums[right] > c ✅
  nums[left+2]+nums[right] > c ✅
  ...
  nums[right-1]+nums[right] > c ✅

Valid pairs with this right = (right-1) - left + 1 = right - left ✅
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute Force | O(n³) | O(1) |
| **Sort + Two Pointer** | **O(n²)** | **O(1)** |

---

## Comparison with k-Sum Pattern

| Problem | Fix | Two Pointer | Output |
|---|---|---|---|
| **3Sum (P18)** | 1 element | Find pairs = -target | Collect |
| **Triangle (P60)** | Largest side | Count pairs > c | Count |
| **4Sum (P19)** | 2 elements | Find pairs = target | Collect |

Sort → fix outer → two pointer. Condition and output type differ.

---

## Key Patterns & Takeaways

1. **Fix largest side** — sorted `(a,b,c)`: only need `a+b>c`. Fix `c`, count `(a,b)` pairs. Reduces O(n³)→O(n²).
2. **`count += right - left` bulk count** — sorted array means all indices `[left..right-1]` paired with `right` are also valid. Count in bulk rather than one by one.
3. **Sort first** — triangle inequality: 3 checks → 1 check only when sorted.
4. **3Sum connection** — same skeleton: sort, fix one, two pointer. Different condition (sum > c vs sum = target) and different output (count vs collect).
5. **Zero sides** — `0+0>0` is false → count=0. `>` not `>=` handles this correctly.