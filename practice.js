

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


