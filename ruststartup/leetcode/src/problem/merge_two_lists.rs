use super::Solution;
use crate::ListNode;
//Merge Two Sorted Lists
impl Solution {
    pub fn merge_two_lists(list1: Option<Box<ListNode>>, list2: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        let mut head:Option<Box<ListNode>> = Some(Box::new(ListNode::new(0)));
        let mut cur = head.as_mut().unwrap();
        let mut p1 = list1;
        let mut p2 = list2;
        while p1.is_some() || p2.is_some() {
            if p2.is_none() || (p1.is_some() && p1.as_ref().unwrap().val < p2.as_ref().unwrap().val) { // take node from p1
                cur.next = Some(Box::new(ListNode::new(p1.as_ref().unwrap().val)));
                p1 =  p1.unwrap().next.take();
            } else { // take node from p2
                cur.next = Some(Box::new(ListNode::new(p2.as_ref().unwrap().val)));
                p2 = p2.unwrap().next.take();
            }
            //println!("{:?}",cur);
            cur = cur.next.as_mut().unwrap();
            // println!("{:?}",&head);
        }
        //println!("{:?}",head);
        head.unwrap().next
    }
    // recursive
    // pub fn merge_two_lists(list1: Option<Box<ListNode>>, list2: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    //     match (list1, list2) {
    //         (Some(l1), Some(l2)) => {
    //              if l1.val < l2.val {
    //               Some(Box::new(ListNode {
    //                 val: l1.val,
    //                 next: Solution::merge_two_lists(l1.next, Some(l2)),
    //               }))
    //             } else {
    //                 Some(Box::new(ListNode {
    //                     val: l2.val,
    //                     next: Solution::merge_two_lists(l2.next, Some(l1)),
    //                 }))
    //             }
    //         },
    //         (Some(l), None) | (None, Some(l)) => Some(l),
    //         (None, None) => None  
    //     }
    // }
}