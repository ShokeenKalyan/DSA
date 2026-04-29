# 🔴 Minimum Window Substring — LeetCode #76 (Hard)

---

## 📋 Problem Statement

Given two strings `s` and `t`, return the **minimum window substring** of `s` such that every character in `t` (including duplicates) is present in the window. If no such window exists, return `""`.

```
Input:  s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"

Input:  s = "a", t = "a"
Output: "a"

Input:  s = "a", t = "aa"
Output: ""  (only one 'a' in s, but need two)
```

**Constraints:**
- `1 <= s.length, t.length <= 10^5`
- `s` and `t` consist of uppercase and lowercase English letters
- Answer is **unique** if it exists

---

## 🧠 Intuition

The brute force is O(n²) — check every substring of `s` and see if it contains all chars of `t`. Too slow for 10^5.

The key insight is **Sliding Window with two pointers** (`left`, `right`):

1. Expand `right` until the window is **valid** (contains all chars of `t`)
2. Once valid, try to **shrink from `left`** to minimize the window
3. Record the minimum window seen so far
4. Repeat

Track validity efficiently using a **need/have counter** pattern — avoids comparing full maps on every step.

---

## ✅ Optimal Solution (TypeScript)

```typescript
function minWindow(s: string, t: string): string {
    if (t.length > s.length) return "";

    // Frequency map of characters needed from t
    const need = new Map<string, number>();
    for (const ch of t) {
        need.set(ch, (need.get(ch) ?? 0) + 1);
    }

    // 'have' = how many unique chars satisfy their required frequency
    // 'required' = total unique chars we need to satisfy
    let have = 0;
    const required = need.size;

    // Window frequency map
    const window = new Map<string, number>();

    let left = 0;
    let minLen = Infinity;
    let result = "";

    for (let right = 0; right < s.length; right++) {
        // Expand window by adding s[right]
        const ch = s[right];
        window.set(ch, (window.get(ch) ?? 0) + 1);

        // Check if this char's frequency now satisfies the need
        if (need.has(ch) && window.get(ch) === need.get(ch)) {
            have++;
        }

        // Shrink from left while window is valid
        while (have === required) {
            // Update result if this window is smaller
            const windowLen = right - left + 1;
            if (windowLen < minLen) {
                minLen = windowLen;
                result = s.slice(left, right + 1);
            }

            // Remove leftmost char from window
            const leftCh = s[left];
            window.set(leftCh, window.get(leftCh)! - 1);
            if (need.has(leftCh) && window.get(leftCh)! < need.get(leftCh)!) {
                have--;
            }
            left++;
        }
    }

    return result;
}
```

---

## 🔍 Dry Run — `s = "ADOBECODEBANC"`, `t = "ABC"`

```
need = { A:1, B:1, C:1 },  required = 3

right=0  ch=A  window={A:1}          have=1
right=1  ch=D  window={A:1,D:1}      have=1
right=2  ch=O  ...                   have=1
right=3  ch=B  window={...B:1}       have=2
right=4  ch=E  ...                   have=2
right=5  ch=C  window={...C:1}       have=3  ✅ VALID

  → window = "ADOBEC" (len 6), result = "ADOBEC"
  → shrink: remove A → have=2, left=1

right=6  ch=O  ...                   have=2
right=7  ch=D  ...                   have=2
right=8  ch=E  ...                   have=2
right=9  ch=B  window={B:2}          have=2
right=10 ch=A  window={A:1}          have=3  ✅ VALID

  → shrink left until window invalid...
  → best window so far still "ADOBEC" until we isolate "BANC"

right=11 ch=N  ...                   have=2
right=12 ch=C  window={C:1}          have=3  ✅ VALID

  → window = s[9..12] = "BANC" (len 4) ✅ NEW MINIMUM
  → shrink: remove B → have=2, left=10

End of string.

Final result = "BANC" ✅
```

---

## ⏱️ Complexity

| | |
|---|---|
| **Time** | O(s + t) — each character is added and removed from the window at most once |
| **Space** | O(s + t) — for the two frequency maps |

---

## ⚠️ Edge Cases

```typescript
minWindow("a", "aa")    // → ""     can't satisfy need of 2 A's
minWindow("a", "b")     // → ""     char not in s at all
minWindow("abc", "abc") // → "abc"  entire string is the answer
minWindow("abc", "b")   // → "b"    single char target
```

---

## 💡 Key Patterns to Remember

- **`have === required`** is the validity check — comparing unique char counts, not full maps
- Use `need.size` (unique chars in `t`) as `required` — this is the O(n) insight
- **Shrink greedily** from the left inside the `while` loop — all minimization happens here
- Only increment `have` when `window.get(ch) === need.get(ch)` (exact match, not over-satisfied)
- Only decrement `have` when `window.get(leftCh) < need.get(leftCh)` (drops below requirement)

---

## 🔗 Related Problems

| Problem | Pattern |
|---|---|
| LeetCode #3 — Longest Substring Without Repeating Characters | Sliding Window |
| LeetCode #438 — Find All Anagrams in a String | Sliding Window + Frequency Map |
| LeetCode #567 — Permutation in String | Fixed-size Sliding Window |
| LeetCode #239 — Sliding Window Maximum | Sliding Window + Deque |