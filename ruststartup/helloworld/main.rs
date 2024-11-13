const TIME_IN_DAY:u32 = 1000*60*60*24;
fn main(){
    println!("hello world!");
    let mut x = 6;
    let y = "    ";
    println!("x is {}",x);
    x = 7;
    println!("x is {}",x);
    println!("constant is {}",TIME_IN_DAY);
    println!("len is {}",y.len());
}