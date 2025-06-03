use super::Solution;

struct Trie {
    children: [Option<Box<Trie>>; 26],
    is_end: bool,
    count: i32,
}

impl Solution {
    pub fn longest_common_prefix(strs: Vec<String>) -> String {
        let _trie  = Trie { children: [const { None }; 26], is_end: false, count: 0 };
        for item in strs.iter() {
            println!("{:?}",item);
            for c in item.chars() {
                println!("{}",c);
            }
        }
        "t".to_string()
    }
    pub fn insert(trie: &mut Trie, word: &str) {
        let mut node = trie;
        for c in word.chars() {
            let index = c as usize - 'a' as usize;
            if node.children[index].is_none() {
                node.children[index] = Some(Box::new(Trie { children: [const { None }; 26], is_end: false, count: 0 }));
            }else {
                node.children[index].as_mut().unwrap().count += 1;
            }
            node = node.children[index].as_mut().unwrap();
        }
        node.is_end = true;
        println!("insert {:?}",trie);
    }
}