# 42 - Flipping an Image

## Problem
**LeetCode:** [#832 Flipping an Image](https://leetcode.com/problems/flipping-an-image/)  
**Difficulty:** Easy  
**Topic:** Arrays, Two Pointers, Bit Manipulation

### Statement
Flip each row of a binary matrix horizontally, then invert it (0↔1).

```
[1,1,0] → flip → [0,1,1] → invert → [1,0,0]

[[1,1,0],[1,0,1],[0,0,0]]  →  [[1,0,0],[0,1,0],[1,1,1]]
```

---

## Intuition — Combine Both Steps in One Pass

Two-pointer from both ends of each row. For each pair `(left, right)`:

```
Same values (0,0 or 1,1):
  Flip: swap (no visible change since equal)
  Invert: both bits flip
  Net result: XOR both with 1 → row[left] ^= 1, row[right] ^= 1

Different values (0,1 or 1,0):
  Flip: swap them
  Invert: flip both
  Net result: 0,1 → swap → 1,0 → invert → 0,1 = ORIGINAL → no change!
  → Skip these pairs entirely
```

Middle element of odd-length row: only one XOR (not two).

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 1: Naive — reverse then invert, 2 passes per row
// ─────────────────────────────────────────────────────────
function flipAndInvertImageNaive(image) {
    return image.map(row => row.reverse().map(x => x ^ 1));
}


// ─────────────────────────────────────────────────────────
// APPROACH 2: XOR Two Pointer — O(n²), O(1), 1 pass ✅
// ─────────────────────────────────────────────────────────
function flipAndInvertImage(image) {
    const n = image[0].length;

    for (const row of image) {
        let left = 0, right = n - 1;

        while (left <= right) {
            if (row[left] === row[right]) {
                // Same: flip is no-op, both bits invert
                row[left] ^= 1;
                if (left !== right) row[right] ^= 1; // skip if middle
            }
            // Different: flip+invert cancel out → no change
            left++;
            right--;
        }
    }

    return image;
}

console.log(flipAndInvertImage([[1,1,0],[1,0,1],[0,0,0]]));
// [[1,0,0],[0,1,0],[1,1,1]] ✅

console.log(flipAndInvertImage([[1,1,0,0],[1,0,0,1],[0,1,1,1],[1,0,1,0]]));
// [[1,1,0,0],[0,1,1,0],[0,0,0,1],[1,0,1,0]] ✅
```

---

## Dry Run

```
Row [1,1,0]: left=0,right=2
  (1,0) different → skip. left=1,right=1
  (1) middle, same → 1^1=0. Row=[1,0,0] ✅

Row [0,0,0]: left=0,right=2
  (0,0) same → 0^1=1 both → [1,0,1]. left=1,right=1
  (0) middle → 0^1=1. Row=[1,1,1] ✅
```

---

## Complexity

| Approach | Time | Space | Passes/row |
|---|---|---|---|
| Naive | O(n²) | O(n) | 2 |
| **XOR Two Pointer** | **O(n²)** | **O(1)** | **1** |

---

## Key Patterns & Takeaways

1. **`x ^ 1` = bit flip** — cleaner than `1 - x` or ternary. Standard binary array idiom.
2. **Same → XOR both; Different → skip** — the core of the one-pass trick. Different values cancel through flip+invert; same values both need flipping.
3. **Handle middle separately** — odd-length rows: `left === right` at center. One XOR only, not two.
4. **Combine sequential operations** — when two operations on symmetric pairs have predictable interaction, merge into a single sweep. A general technique worth recognising.