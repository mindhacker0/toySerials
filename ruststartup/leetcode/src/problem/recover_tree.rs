use super::Solution;
use crate::tool::bin_tree::TreeNode;
// borrow() 方法的作用：
// 获取 RefCell 内部数据的不可变引用（Ref<T>）
// 运行时检查：如果已有可变借用会 panic
// 返回的 Ref<T> 会自动解引用为 &T
use std::rc::Rc;
use std::cell::RefCell;
// 三种可能
// 头和某个左节点交换
// 头和某个右节点交换
// 左右节点互换
impl Solution {
    pub fn recover_tree(root: &mut Option<Rc<RefCell<TreeNode>>>) {
        let mut points:Vec<Rc<RefCell<TreeNode>>> = vec![];
        fn tranverse(node: &mut Option<Rc<RefCell<TreeNode>>>,arr:&mut Vec<Rc<RefCell<TreeNode>>>) {
            if node.is_none() { return; }
            let val:i32 = node.as_ref().unwrap().borrow().val;
            if node.as_ref().unwrap().borrow().left.is_some() {
                let left_val:i32 = node.as_ref().unwrap().borrow().left.as_ref().unwrap().borrow().val;
                if val > left_val { arr.push(node.as_ref().unwrap().clone()); } //非法的节点
                if node.as_ref().unwrap().borrow().right.is_some() {
                    let right_val:i32 = node.as_ref().unwrap().borrow().right.as_ref().unwrap().borrow().val;
                    if val > right_val { arr.push(node.as_ref().unwrap().clone()); } //非法的节点
                    if left_val > right_val { arr.push(node.as_ref().unwrap().clone()); } //非法的节点
                }
            }
        }
        tranverse(root,&mut points);
        println!("points: {:?}", points);
    }
}