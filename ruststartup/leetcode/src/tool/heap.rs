use std::marker::PhantomData;

#[derive(Copy, Clone, PartialEq,Debug)]
pub struct HeapNode<T> {
   pub value: T,
   pub index: i32,
}
pub trait Heapify<T> {
    fn heapify_up(&self, data: &mut Vec<Option<HeapNode<T>>>);
    fn heapify_down(&self, data: &mut Vec<Option<HeapNode<T>>>);
}
pub struct Heap<T> {
    data: Vec<Option<HeapNode<T>>>,
    child: Box<dyn Heapify<T>>
}
impl<T> Heap<T>{
    pub fn new(child: Box<dyn Heapify<T>>) -> Self {
        Heap { data: vec![None],child }
    }
    pub fn offer(&mut self,elem: HeapNode<T>) {
        // 添加元素到堆中
        self.data.push(Some(elem));
        self.child.heapify_up(&mut self.data);
    }
    pub fn poll(&mut self)->Option<HeapNode<T>> {
        // 删除堆顶元素
        if self.data.len() <= 1 {
            return None; // 堆为空
        }
        let len = self.data.len();
        self.data.swap(1,len-1);
        let removed = self.data.pop(); // 移除最后一个元素
        match removed {
            None => None,
            Some(node) => {
                self.child.heapify_down(&mut self.data); // 调整堆结构
                node
            }
        }
    }
}

pub struct MinHeap<T> {
    pub _marker: PhantomData<T>,
}
impl<T> Heapify<T> for MinHeap<T> {
    fn heapify_up(&self, data: &mut Vec<Option<HeapNode<T>>>) {//向上调整
        let len = data.len();
        let mut start = len - 1;
        while start > 1 {
            let parent = start / 2;
            if data[start].as_ref().unwrap().index < data[parent].as_ref().unwrap().index {
                data.swap(start, parent);
                start = parent;
            } else {
                break;
            }
        }
    }
    fn heapify_down(&self, data: &mut Vec<Option<HeapNode<T>>>) {//向下调整
        let mut start = 1;
        let len = data.len();
        while start*2 < len {
            let left = start * 2;
            let right = start * 2 + 1;
            let mut next = left;
            if right < len && data[right].as_ref().unwrap().index < data[left].as_ref().unwrap().index {
               next = right;
            }
            if data[start].as_ref().unwrap().index > data[next].as_ref().unwrap().index {
                data.swap(start, next);
                start = next;
            } else {
                break;
            }
       }
    }
}
pub struct MaxHeap<T> {
    pub _marker: PhantomData<T>,
}
impl<T> Heapify<T> for MaxHeap<T> {
    fn heapify_up(&self, data: &mut Vec<Option<HeapNode<T>>>) {//向上调整
        let len = data.len();
        let mut start = len - 1;
        while start > 1 {
            let parent = start / 2;
            if data[start].as_ref().unwrap().index > data[parent].as_ref().unwrap().index {
                data.swap(start, parent);
                start = parent;
            } else {
                break;
            }
        }
    }
    fn heapify_down(&self, data: &mut Vec<Option<HeapNode<T>>>) {//向下调整
        let mut start = 1;
        let len = data.len();
        while start*2 < len {
            let left = start * 2;
            let right = start * 2 + 1;
            let mut next = left;
            if right < len && data[right].as_ref().unwrap().index > data[left].as_ref().unwrap().index {
               next = right;
            }
            if data[start].as_ref().unwrap().index < data[next].as_ref().unwrap().index {
                data.swap(start, next);
                start = next;
            } else {
                break;
            }
       }
    }

}