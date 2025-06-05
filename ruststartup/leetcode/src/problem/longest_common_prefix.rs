use super::Solution;

#[derive(Debug)]
struct Trie {
    children: [Option<Box<Trie>>; 26],
    is_end: bool,
    count: i32,
}

impl Solution {
    pub fn longest_common_prefix(strs: Vec<String>) -> String {
        let len = strs.len();
        let mut _trie  = Trie { children: [const { None }; 26], is_end: false, count: 0 };
        for item in strs.iter() {
            Solution::insert(&mut _trie, item);
        }
        //println!("insert {:?}",_trie);
        let mut max_len = 0;
        fn search(trie: &Trie,pre: &mut i32,len: usize,max_len:&mut i32) {
            //println!("sub tree {:?}",trie);       
            for item in trie.children.iter() {
                if let Some(t) = item {
                    if t.count == len as i32 {
                        *pre += 1;
                        *max_len = (*max_len).max(*pre);
                        search(&t,pre,len,max_len);
                        *pre -= 1;
                    }
                }
            }
        }
        search(&_trie,&mut 0,len,&mut max_len);
        let prefix = &strs[0][0..max_len as usize];
        //println!("pre is {:?}",prefix);
        prefix.to_string()
    }
    fn insert<'a>(trie: &'a mut Trie, word: &'a str) {
        let mut node = trie;
        for c in word.chars() {
            let index = c as usize - 'a' as usize;
            if node.children[index].is_none() {
                node.children[index] = Some(Box::new(Trie { children: [const { None }; 26], is_end: false, count: 0 }));
            }
            node.children[index].as_mut().unwrap().count += 1;
            node = node.children[index].as_mut().unwrap();
        }
        node.is_end = true;   
    }
}