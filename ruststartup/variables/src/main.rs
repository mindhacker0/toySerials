




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
}
