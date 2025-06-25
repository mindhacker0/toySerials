use std::{cell::RefCell, rc::Rc};
use crate::tool::link::ListNode;
use crate::tool::bin_tree::TreeNode;
// 默认该文件为入口文件
pub struct Solution;
mod two_sum;
mod search_insert;
mod longest_common_prefix;
mod smallest_equivalent_string;
mod merge_two_lists;
mod max_difference;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          mod  search_matrix;
mod find_kth_largest;
mod level_order;
mod recover_tree;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
pub fn public_fn() {
    println!("public_fn problem");
}
pub fn run_test(){
    // Solution::two_sum(vec![2,7,11,15],9);
    // Solution::search_insert(vec![1,3,5,6],5);
    // Solution::longest_common_prefix(vec!["flower".to_string(),"flow".to_string(),"flight".to_string()]);
    // Solution::smallest_equivalent_string("parker".to_string(),"morris".to_string(),"parser".to_string());
    // Solution::merge_two_lists(Some(Box::new(ListNode::new(1))), Some(Box::new(ListNode::new(2))));
    // Solution::max_difference("aaaaabbc".to_string());
    // Solution::search_matrix(vec![vec![1,3,5,7],vec![10,11,16,20],vec![23,30,34,60]], 100);
    // Solution::find_kth_largest(vec![-1, 2, 0], 1);
    // Solution::level_order(Some(Rc::new(RefCell::new(TreeNode::new(3)))));
    let mut root = Some(Rc::new(RefCell::new(TreeNode::new(3))));
    root.as_ref().unwrap().borrow_mut().left = Some(Rc::new(RefCell::new(TreeNode::new(1))));
    root.as_ref().unwrap().borrow_mut().right = Some(Rc::new(RefCell::new(TreeNode::new(2))));
    Solution::recover_tree(&mut root);
}

