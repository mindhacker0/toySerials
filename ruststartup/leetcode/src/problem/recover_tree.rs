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
        let mut prev:Option<Rc<RefCell<TreeNode>>> = None;
        let mut first:Option<Rc<RefCell<TreeNode>>> = None;
        let mut second:Option<Rc<RefCell<TreeNode>>> = None;
        let tranverse: Rc<RefCell<Box<dyn FnMut(&mut Option<Rc<RefCell<TreeNode>>>)>>> = Rc::new(RefCell::new(Box::new(|node: &mut Option<Rc<RefCell<TreeNode>>>| {})));
        let tranverse_clone = Rc::clone(&tranverse);
        *tranverse.borrow_mut() = Box::new(move |node: &mut Option<Rc<RefCell<TreeNode>>>| {
            if node.is_none() { return; }
            if let Some(ref left_node) = node.as_ref().unwrap().borrow().left {
                let mut left_option = Some(left_node.clone());
                tranverse_clone.borrow_mut()(&mut left_option);
            }
            if let Some(prev_node) = &prev {
                // Add logic here for comparison or assignment
                if prev_node.borrow().val > node.as_ref().unwrap().borrow().val {
                    if first.is_none() { first = Some(prev_node.clone()); }
                    second = node.clone();
                }
            }
            prev = node.clone();
            if let Some(ref right_node) = node.as_ref().unwrap().borrow().right {
                let mut right_option = Some(right_node.clone());
                tranverse_clone.borrow_mut()(&mut right_option);
            }
        });
        tranverse.borrow_mut()(root);
        if let (Some(first_node), Some(second_node)) = (first, second) {
            let first_val = first_node.borrow().val;
            let second_val = second_node.borrow().val;
            first_node.borrow_mut().val = second_val;
            second_node.borrow_mut().val = first_val;
        }
    }
}  