fn main() {
    let mut x = 5;
    println!("x is {}",x);
    x = 6;
    println!("x then is {}",x);
    #[warn(dead_code)]
    const THREE:u32 =  3;
}
