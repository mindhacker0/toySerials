use super::Solution;

impl Solution {
    pub fn search_insert(nums: Vec<i32>, target: i32) -> i32 {
        if target <= nums[0] { return 0; }
        if target > nums[nums.len()-1] { return nums.len() as i32; }
        let mut left:i32 = 0;
        let mut right = nums.len() as i32 - 1;
        while left < right {
            let mid = (left + right) / 2;
            if nums[mid as usize] < target {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        // println!("left is {}, right is {}", left, right);
        left
    }
}