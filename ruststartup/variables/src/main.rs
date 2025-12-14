use std::collections::HashMap;

fn main() {
    let mut x = "a".to_string();
    println!("x is {}",x);
    x.push_str("6");
    let k = x.clone();
    //x.push_str("7");
    // borrow
    let br = &mut x;
    br.push_str(" 999");
    println!("x then is {k},{br}");
    #[warn(dead_code)]
    const THREE:u32 =  3;
    let mut vec1:Vec<i32> = Vec::new();
    let vec2:Vec<u32> = vec![];
    vec1.push(2);
    vec1.push(4);
    println!("vec1 is {:?}",vec1);
    println!("vec2 is {:?}",vec2);
    println!("vec1 idx 1 is {},{}",vec1.get(0).unwrap(),&vec1[0+1]);
    let str = "xxxx";
    let mut iStr = str.to_string();
    {
        let t = iStr.as_str();
        println!("const str is {}",t);
    }
    iStr.push_str(" iiii");
    let y = {
        let t = 0;
        t + 99
    };
    println!("y is {y}");
    unsafe {
        fn hoc()->Box<dyn Fn(i32) -> i32>{
            let mut y = 888;
            // fn get(a:&str)->i32{
            //    5
            // }
            let brFn= move |i| i+y;
            println!("call in hoc");
            return Box::new(brFn);
        }
       let rfn = hoc();
       println!("call return hoc is {}",rfn(2));
    }
    for number in (1..4).rev() {
        println!("{number}!");
    }
    // 不可变借用
    let x:i32 = 5;
    let x1 = &x;
    let x2 = &x;
    let x3 = &x1;
    println!("x is {}, x1 is {}, x2 is {}, x3 is {}", x, x1, x2, x3);
    // 可变借用
    let mut t:i32 = 10;//可变借用只能借用mut变量
    let t1 = &mut t;
    let t2 = &t1; // 这里 t2 是不可变借用
    *t1+= 5; // 修改 y 的值
    println!("t1 is {}",t1);//不能同时存在可变借用和不可变借用
    let mut map:HashMap<String,i32> = HashMap::new();
    //遍历方法
    let arr = [1,2,3];
    for i in arr {
        println!("i is {}",i);
    }
    //遍历向量
    let mut vec3 = vec![1, 2, 3];
    // 会获取vec的所有权，遍历后vec将不能再被使用
    // 每次迭代时item获得元素的所有权
    // 适用于需要消费(consume)向量的场景
    // for i in vec3 {
    //     println!("i is {}", i);
    // }
    // 使用不可变借用(&vec)遍历，不会转移所有权
    // vec在遍历后仍然可用
    // item是对元素的不可变引用(&i32)
    // 适用于只需要读取数据的场景
    for i in &vec3 {
        println!("i is {}", i);
    }
    //可以修改元素
    for item in &mut vec3 {
        *item += 1; // 可变借用
    }
    //使用迭代器进行遍历，不会获取所有权
    for i in vec3.iter() {
        println!("i is {}", i);
    }
    //可变引用的遍历
    for i in vec3.iter_mut() {
        *i += 1;
    }
    //获取所有权并消费集合的遍历
    // for i in vec3.into_iter() {
    //     println!("i is {}", i);
    // }
    //适用于需要条件判断的遍历
    let mut stack = vec![1, 2, 3];
    while let Some(top) = stack.pop() {
        println!("Popped: {}", top);
    }
    vec3.iter().for_each(|i| println!("3i is {}", i)); 
}
