# 22 - Longest Substring Without Repeating Characters

## Problem
**Source:** [Striver's SDE Sheet](https://takeuforward.org/data-structure/length-of-longest-substring-without-any-repeating-character) | [LeetCode #3](https://leetcode.com/problems/longest-substring-without-repeating-characters/)  
**Difficulty:** Medium  
**Topic:** Strings, Sliding Window, Hashing

### Statement
Find the length of the **longest substring without repeating characters**.

```
"abcabcbb"  →  3  ("abc")
"bbbbb"     →  1  ("b")
"pwwkew"    →  3  ("wke")
"abba"      →  2  (tricky case!)
```

---

## Intuition — Variable-Size Sliding Window

Maintain a window `[left, right]` that always contains unique characters.
- Expand `right` one step at a time
- When duplicate found inside window → shrink `left` until window is valid again

**Two implementations:**
- **Set approach**: shrink left one by one until duplicate removed → correct, O(n)
- **HashMap approach**: jump left directly to `lastSeen[char] + 1` → optimal O(n)

---

## The Critical Subtlety — Never Move Left Backwards

```javascript
// WRONG — can move left pointer backwards!
left = lastSeen.get(char) + 1;

// CORRECT — only advance left, never retreat
left = Math.max(left, lastSeen.get(char) + 1);
```

**The "abba" trap:**
```
s = "abba"
right=3(a): last seen at index 0, but left is already at 2.
            Index 0 is OUTSIDE the current window [2..3].
            'a' is not actually a duplicate in the current window!
            Moving left to 0+1=1 would go BACKWARDS and re-include 'b'.
            Math.max(2, 0+1) = 2 → left stays at 2 ✅
```

---

## Solution (JavaScript)

```javascript
// ─────────────────────────────────────────────────────────
// APPROACH 2: Sliding Window + Set — O(n) time, O(k) space
// Shrinks one step at a time — simpler but slower constant
// ─────────────────────────────────────────────────────────
function lengthOfLongestSubstringSet(s) {
    const charSet = new Set();
    let left = 0, maxLen = 0;

    for (let right = 0; right < s.length; right++) {
        // Shrink window until current char is not a duplicate
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        charSet.add(s[right]);
        maxLen = Math.max(maxLen, right - left + 1);
    }

    return maxLen;
}


// ─────────────────────────────────────────────────────────
// APPROACH 3: Sliding Window + HashMap — O(n) time ✅
// Jump left directly — no one-by-one shrinking
// MUST use Math.max to never move left backwards
// ─────────────────────────────────────────────────────────
function lengthOfLongestSubstring(s) {
    const lastSeen = new Map(); // char → most recent index
    let left = 0, maxLen = 0;

    for (let right = 0; right < s.length; right++) {
        const char = s[right];

        // If char seen and its last occurrence is WITHIN current window
        if (lastSeen.has(char) && lastSeen.get(char) >= left) {
            // Jump left to just after the previous occurrence
            left = lastSeen.get(char) + 1;
        }

        lastSeen.set(char, right); // Always update last seen index
        maxLen = Math.max(maxLen, right - left + 1);
    }

    return maxLen;
}


// ─────────────────────────────────────────────────────────
// APPROACH 3B: Array instead of Map — O(n), O(1) space
// For ASCII strings — no hashing overhead, faster in practice
// ─────────────────────────────────────────────────────────
function lengthOfLongestSubstringArray(s) {
    const lastSeen = new Array(128).fill(-1); // ASCII size
    let left = 0, maxLen = 0;

    for (let right = 0; right < s.length; right++) {
        const code = s.charCodeAt(right);
        if (lastSeen[code] >= left) {
            left = lastSeen[code] + 1;
        }
        lastSeen[code] = right;
        maxLen = Math.max(maxLen, right - left + 1);
    }

    return maxLen;
}

console.log(lengthOfLongestSubstring("abcabcbb")); // 3 ✅
console.log(lengthOfLongestSubstring("bbbbb"));    // 1 ✅
console.log(lengthOfLongestSubstring("pwwkew"));   // 3 ✅
console.log(lengthOfLongestSubstring(""));         // 0 ✅
console.log(lengthOfLongestSubstring("abba"));     // 2 ✅ (tricky!)
console.log(lengthOfLongestSubstring("dvdf"));     // 3 ✅
```

---

## Dry Run

```
s = "abcabcbb"

right=0(a): new → lastSeen={a:0}, left=0, len=1
right=1(b): new → lastSeen={b:1}, left=0, len=2
right=2(c): new → lastSeen={c:2}, left=0, len=3, maxLen=3
right=3(a): seen at 0, 0>=0 → left=1, lastSeen={a:3}, len=3
right=4(b): seen at 1, 1>=1 → left=2, lastSeen={b:4}, len=3
right=5(c): seen at 2, 2>=2 → left=3, lastSeen={c:5}, len=3
right=6(b): seen at 4, 4>=3 → left=5, lastSeen={b:6}, len=2
right=7(b): seen at 6, 6>=5 → left=7, lastSeen={b:7}, len=1

Answer: 3 ✅ ("abc")
```

```
s = "abba"  ← the tricky case

right=0(a): lastSeen={a:0}, left=0, len=1
right=1(b): lastSeen={b:1}, left=0, len=2
right=2(b): seen at 1, 1>=0 → left=2, lastSeen={b:2}, len=1
right=3(a): seen at 0, 0 < left(2) → DON'T move! left stays 2
            lastSeen={a:3}, len=2, maxLen=2

Answer: 2 ✅
```

---

## Complexity

| Approach | Time | Space | Notes |
|---|---|---|---|
| Brute | O(n³) | O(k) | Too slow |
| Set sliding window | O(n) | O(k) | One-by-one shrinking |
| **HashMap sliding window** | **O(n)** | **O(k)** | Direct jump — optimal |
| Array (ASCII) | O(n) | O(1) | Fastest in practice |

> `k` = character set size (26 lowercase / 128 ASCII / 65536 Unicode)

---

## The Sliding Window Family

| Problem | Window Condition | LeetCode |
|---|---|---|
| **Longest substring no repeat** | all chars unique | #3 |
| **Longest ≤ K distinct chars** | at most K distinct | #340 |
| **Minimum window substring** | contains all of T | #76 |
| **Longest repeating char replacement** | ≤ K replacements | #424 |
| **Permutation in string** | fixed-size anagram | #567 |
| **Max consecutive ones III** | ≤ K zero-flips | #1004 |

---

## Key Patterns & Takeaways

1. **Sliding window template** — expand right always, shrink left only when invalid. Each element enters and exits the window at most once → O(n). The universal variable-size window template.
2. **`Math.max(left, lastSeen+1)`** — never move left backwards. The #1 bug in interview implementations. Without this, "abba"-style inputs break the solution.
3. **HashMap stores last seen INDEX** — not just presence (Set). Allows direct jump instead of one-by-one shrinking. Both O(n) but HashMap has better constant.
4. **Array instead of Map for ASCII** — 128-element array, no hashing overhead. Mention this for systems-level awareness.
5. **"abba" is the canonical tricky test** — when last occurrence of a char is already outside the window, don't move left backwards. Test this explicitly.