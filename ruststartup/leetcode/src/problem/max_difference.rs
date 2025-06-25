use super::Solution;
use std::collections::HashMap;

impl Solution {
    pub fn max_difference(s: String) -> i32 {
        let mut char_map: HashMap<char, usize> = HashMap::new();
        for c in s.chars().into_iter() {
            if let Some(count) = char_map.get_mut(&c) {
                *count += 1;
            } else {
                char_map.insert(c, 1);
            }
        }
        print!("{:?}", char_map);
        let mut max_odd = 0;
        let mut min_even = usize::MAX;
        for (_c, count) in char_map.iter() {
            if count % 2 == 0 {
                min_even = min_even.min(*count);
            } else {
                max_odd = max_odd.max(*count);
            }
        }
        max_odd as i32 - min_even as i32
    }
}