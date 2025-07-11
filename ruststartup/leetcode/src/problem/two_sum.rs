use std::collections::HashMap;
use super::Solution;

impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        let mut number_map = HashMap::new();
        let mut ans = Vec::new();
        for (i,&item) in nums.iter().enumerate() {
            number_map.insert(target - item,i);
        }
        println!("{:?}",number_map);
        for (i,item) in nums.iter().enumerate() {
           if let Some(prev_index) = number_map.remove(&item) {
                if prev_index != i {
                    //println!("Found duplicate at {} and {}", prev_index, i);
                    ans.push(i as  i32);
                    ans.push(prev_index as  i32);
                    break;
                }
            }
        }
        return ans;
    }
}