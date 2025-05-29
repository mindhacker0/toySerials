use std::collections::HashMap;
impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        let mut numberMap = HashMap::new();
        let mut ans = Vec::new();
        for (i,&item) in nums.iter().enumerate() {
            println!("{}",item);
            numberMap.insert(target - item,i);
        }
        for (i,item) in nums.iter().enumerate() {
            println!("{} {}",i,item);
           if let Some(prev_index) = numberMap.remove(&item) {
                if prev_index != i {
                    println!("Found duplicate at {} and {}", prev_index, i);
                    if !numberMap.contains_key(i) { ans.push(i as i32); }
                    //ans.push(prev_index as i32);
                }
            }
        }
        return ans;
    }
}