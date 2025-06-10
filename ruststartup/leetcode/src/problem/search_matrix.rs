use super::Solution;

impl Solution {
    pub fn search_matrix(matrix: Vec<Vec<i32>>, target: i32) -> bool {
        //find row index
        let mut left: i32 = -1;
        let mut right: i32 = matrix.len() as i32;
        while left!= right-1 {
            let mid: usize = ((left + right) / 2) as usize;
            if matrix[mid][0] <= target {
                left = mid as i32;
            } else {
                right = mid as i32;
            }
        }
        if left < 0 { return false }
        println!("left: {}, right: {}", left, right);
        let row_num = left as usize;
        let mut l: usize = 0;
        let mut r: usize = matrix[row_num].len() - 1;
        while l <= r {
            let mid = (l + r) / 2;
            println!("row_num: {}, l: {}, r: {}, mid: {}", row_num, l, r, mid);
            if matrix[row_num][mid] == target {
                return true;
            } else if matrix[row_num][mid] < target {
                l = mid + 1;
            } else {
                r = mid-1;
            }
        }
        false
    }
}