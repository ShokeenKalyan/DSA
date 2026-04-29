

// 1-arrays\29-remove-element.md
function removeElement(nums, val) {
    let slow = 0; // Write pointer

    for (let fast = 0; fast < nums.length; i++) {
        if (nums[fast] !== val) {
            nums[slow] = nums[fast]; // Write non-val element to wrap
            slow++
        }
        // Skip if val encountered
    }

    return slow;
}


// coding, fundamental thinking, structure, code correctness, failure, concurrency
// design order apis for customer website, api signature, request response
// data model for online stores
// lru cache, space time complexity, thread safety, concurrency
// ask clarifying questions sla, scale, constraints
// how to prevent uplicates