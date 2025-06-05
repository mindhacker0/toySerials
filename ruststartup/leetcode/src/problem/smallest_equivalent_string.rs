use super::Solution;
use crate::DisJointSet;
impl Solution {
    // better idea:when union we can choose the small one as root in dis_set
    pub fn smallest_equivalent_string(s1: String, s2: String, base_str: String) -> String {
        let mut s1 = s1.chars().collect::<Vec<char>>();
        let mut s2 = s2.chars().collect::<Vec<char>>();
        let mut base_str = base_str.chars().collect::<Vec<char>>();
        let mut dis_set = DisJointSet::new(26);
        for i in 0..s1.len() {
            let x = s1[i] as i32 - 'a' as i32;
            let y = s2[i] as i32 - 'a' as i32;
            dis_set.union(x,y);
        }
        let mut ans = String::from("");
        for i in 0..base_str.len() {
            for j in 0..26  {
                let x = base_str[i] as i32 - 'a' as i32;
                if dis_set.is_connected(j as i32,x) {
                    ans.push(('a' as i32 + j as i32) as u8 as char);
                    break;
                }
            }
        }
        println!("ans is {:?}",ans);
        ans
    }
}