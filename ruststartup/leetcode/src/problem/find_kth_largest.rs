use super::Solution;
use crate::tool::heap::{Heap,HeapNode,MaxHeap};


impl Solution {
    pub fn find_kth_largest(nums: Vec<i32>, k: i32) -> i32 {
        let mut heap = Heap::new(Box::new(MaxHeap::<i32>{ _marker: std::marker::PhantomData }));
        nums.into_iter().for_each(|x| {
            heap.offer(HeapNode { value: x, index: x });
        });
        let mut t = k;
        while t>1 {
            heap.poll();
            t-=1;
        }
        // println!("{:?}",heap.data);
        heap.poll().unwrap().value
    }
}