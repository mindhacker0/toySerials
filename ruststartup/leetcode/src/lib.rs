// 一个package只能有零个或一个库crate
pub mod problem;//声明 problem模块

pub fn public_fn() {
    println!("public_fn");
    problem::run_test();
}

pub struct DisJointSet {
    root: Vec<i32>,
}
//并查集
impl DisJointSet {
    pub fn new(n: i32) -> Self {
        let mut root = vec![];
        for i in 0..n {
            root.push(i);
        }
        DisJointSet { root}
    }
    pub fn find(&mut self, x: i32) -> i32 {
        if self.root[x as usize] != x {
            self.root[x  as usize] = self.find(self.root[x  as usize]);
            self.root[x  as usize]
        } else {
            x
        }
    }
    pub fn union(&mut self, x: i32, y: i32) {
        let root_x = self.find(x);
        let root_y = self.find(y);
        if root_x != root_y {
            self.root[root_x as usize] = root_y;
        }
    }
    pub fn is_connected(&mut self, x: i32, y: i32) -> bool {
        self.find(x) == self.find(y)
    }
}
// Definition for singly-linked list.（单链表）
#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
  pub val: i32,
  pub next: Option<Box<ListNode>>
}

impl ListNode {
  #[inline]
  fn new(val: i32) -> Self {
    ListNode {
      next: None,
      val
    }
  }
}