# 87 - String Compression

## Problem
**LeetCode:** [#443 String Compression](https://leetcode.com/problems/string-compression/)  
**Difficulty:** Medium  
**Topic:** Two Pointers, Strings

### Statement
Compress a char array in-place. For each group of consecutive repeating characters, write the char + count (if count > 1). Return new length. O(1) extra space.

```
["a","a","b","b","c","c","c"]  →  6,  ["a","2","b","2","c","3"]
["a"]                           →  1,  ["a"]
["a","b"×12]                   →  4,  ["a","b","1","2"]  (12 b's)
```

---

## Intuition — Read/Write Two Pointer on Groups

`read` scans groups of consecutive characters.  
`write` compacts result in-place.

For each group:
1. Write the character at `write++`
2. If `count > 1`: write each digit of count separately

**Write pointer never overtakes read** — compressed ≤ original always → O(1) space guaranteed.

---

## Solution (JavaScript)

```javascript
/**
 * LeetCode #443 — String Compression
 * Time: O(n) | Space: O(1)
 */
function compress(chars) {
    let write = 0, read = 0;

    while (read < chars.length) {
        const ch = chars[read];
        let count = 0;

        // Count entire group of consecutive ch
        while (read < chars.length && chars[read] === ch) {
            read++;
            count++;
        }

        // Write character
        chars[write++] = ch;

        // Write count digits separately (only if count > 1)
        if (count > 1) {
            for (const digit of String(count)) {
                chars[write++] = digit;
            }
        }
    }

    return write; // New length
}

const t1 = ["a","a","b","b","c","c","c"];
console.log(compress(t1));    // 6 ✅
console.log(t1.slice(0,6));   // ["a","2","b","2","c","3"] ✅

const t2 = ["a","b","b","b","b","b","b","b","b","b","b","b","b"];
console.log(compress(t2));    // 4 ✅
console.log(t2.slice(0,4));   // ["a","b","1","2"] ✅
```

---

## Dry Run

```
chars=["a","a","b","b","c","c","c"]

Group 'a': count=2 → write 'a','2'. write=2
Group 'b': count=2 → write 'b','2'. write=4
Group 'c': count=3 → write 'c','3'. write=6

return 6 ✅  chars=["a","2","b","2","c","3",...]

chars=["a","b"×12]
Group 'a': count=1 → write 'a'. write=1 (no count)
Group 'b': count=12 → write 'b','1','2'. write=4

return 4 ✅
```

---

## Complexity

| | Value |
|---|---|
| Time | O(n) |
| Space | O(1) |

---

## Key Details

```
1. Write digits SEPARATELY: for (const digit of String(count))
   count=12 → '1' then '2' in two positions. Most common mistake.

2. count > 1 only — single chars write no count ("a" not "a1")

3. Write never overtakes read — compressed ≤ original always.

4. return write — write pointer IS the new length.
```

---

## Read/Write Family

| Problem | What's written per step |
|---|---|
| Remove Duplicates (P35) | Single element |
| Move Zeroes (P40) | Single element |
| Remove Element (P43) | Single element |
| **String Compression (P87)** | **Char + variable digits** |

Most complex member — writes a variable number of elements per group.

---

## Key Patterns & Takeaways

1. **Read/write on groups** — read consumes entire groups, write compacts. Write never overtakes read → O(1) space.
2. **Digits separately** — `for (digit of String(count))` handles multi-digit counts (12 → '1','2'). Most common bug.
3. **Skip count=1** — single occurrence: write char only, not "char+1".
4. **`return write`** — the write pointer equals the new compressed length directly.
5. **Most complex read/write variant** — variable output per group vs. one element per step in simpler problems.