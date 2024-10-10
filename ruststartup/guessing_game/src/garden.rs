

pub mod flower;
pub fn add_number<T: std::ops::Add<Output = T>>(a: T, b: T) -> T {  
    a + b  
} 

pub fn dec_number(x:i32,y:i32)->i32{
    return x-y;
}