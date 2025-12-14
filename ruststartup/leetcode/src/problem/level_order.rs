use crate::tool::bin_tree::TreeNode;
use super::Solution;

use std::rc::Rc;
use std::cell::RefCell;
impl Solution {
    pub fn level_order(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<Vec<i32>> {
        let mut ans:Vec<Vec<i32>> = vec![];
        fn tranverse(node: Option<Rc<RefCell<TreeNode>>>, level: usize, ans: &mut Vec<Vec<i32>>){
            if node.is_none() { return; }
            if ans.len() <= level { ans.push(vec![]); }
            ans[level].push(node.as_ref().unwrap().borrow().val);
            tranverse(node.as_ref().unwrap().borrow().left.clone(), level+1, ans);
            tranverse(node.as_ref().unwrap().borrow().right.clone(), level+1, ans);
        }
        tranverse(root, 0, &mut ans);
        println!("{:?}",ans);
        ans
    }
}