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
// 默认情况下，闭包会按以下优先级捕获变量，**自动实现**Fn FnMut FnOnce Traits：
// 不可变借用（&T）
// 可变借用（&mut T）
// 所有权（T）
// 闭包可以通过 mut 修饰变量，可以修改参数为可变借用
// 闭包可以通过move 关键字，将参数所有权移动到闭包中，无论是否有必要，但是对实现的Trait没有任何影响
impl Solution {
    pub fn recover_tree(root: &mut Option<Rc<RefCell<TreeNode>>>) {
        // let mut prev:Option<Rc<RefCell<TreeNode>>> = None;
        // let first: Rc<RefCell<Option<TreeNode>>> = Rc::new(RefCell::new(None));
        // let second: Rc<RefCell<Option<TreeNode>>> = Rc::new(RefCell::new(None)); //: <Box<dyn FnMut(&mut Option<Rc<RefCell<TreeNode>>>)>>

        fn y_combinator<A, R, F>(f: F) -> impl Fn(A) -> R
        where
            F: Fn(&dyn Fn(A) -> R, A) -> R,
        {
            move |a| f(&y_combinator(&f), a)
        }

        let factorial = y_combinator(|f, n| {
            if n == 0 { 1 } else { n * f(n - 1) }
        });
        println!("{}", factorial(5));  // 输出 120
    }
}