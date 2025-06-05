use super::Solution;
use crate::ListNode;

impl Solution {
    pub fn merge_two_lists(list1: Option<Box<ListNode>>, list2: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        let mut ordered_list:Option<Box<ListNode>> = Some(Box::new(ListNode::new(0)));
        let mut ans = ordered_list.();
        let mut p1 = list1;
        let mut p2 = list2;
        while p1.is_some() || p2.is_some() {
            if p2.is_none() || (p1.is_some() && p1.as_ref().unwrap().val < p2.as_ref().unwrap().val) { // take node from p1
                let next = p1.as_mut().unwrap().next.take();
                //ans.unwrap().next = p1;
                p1 = next;
                println!("{:?}",p1);
            } else { // take node from p2
                let next = p2.as_mut().unwrap().next.take();
                //ans.unwrap().next = p2;
                p2 = next;
                println!("{:?}",p2);
            }
        }
        println!("{:?}",ordered_list);
        ordered_list.next
    }
}