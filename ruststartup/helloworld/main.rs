//关键字 let const static 变量声明
const TIME_IN_DAY:u32 = 1000*60*60*24;
static mut COUNTER:i32 = 0;
static COUNTER1:i32 = 0;
// let x:i32 = 5; //let 不能作为全局变量的声明
//fn函数声明 where 子句通常用于泛型函数或方法的上下文中，以简化泛型约束的表达
fn add<T>(a:T,b:T)  -> T where T:std::ops::Add<Output=T>{
    a+b
}
//struct 定义结构体
struct Point<T>{
    x:T,
    y:T,
}
//enum 枚举类型
enum Message<T>{
    Quit,
    Move{x:T,y:T},
    Write(String),
    ChangeColor(i32,i32,i32),
}
//impl 类型实现方法
impl<T> Point<T>{
    fn x(&self)->&T{
        &self.x
    }
}
// trait 是定义不同类型共享的公共行为，类似于其他语言的interface
trait Messager<T>{
    fn print(&self)->String {//默认的行为
        return "test".to_string();
    }
}
// impl 实现trait
impl<T: std::fmt::Display> Messager<T> for Point<T>{
    fn print(&self)->String{
        return format!("x is {},y is {}",self.x,self.y);
    }
}
// 控制流
// if/else
// if  true {
//     println!("true");
// }else{
//     println!("false");
// }
// match
// match x{
//     1=>println!("one"),
//     2=>println!("two"),
//     _=>println!("other"),
// }
// 循环
// loop{
//     println!("loop");
//     break;
// }
// while x<10{
//     println!("while");
//     x+=1;
// }
// for i in 0..10{
//     println!("for {}",i);
//     continue;
// }
// 定义模块
mod hello_world {
    pub fn hello(){
        println!("hello world!");
    }
}
//使用模块
use hello_world::hello;
//pub 控制模块的访问权限
//super 父模块 self  当前模块
// let x = 5 as i64; as 显式转换
// type 创建类型别名
// where 泛型约束
// dyn 主要用于与动态分发和多态性相关的场景，尤其是在涉及 trait 对象的时候。
// 定义 宏
macro_rules! say_hello {
    () => {
        println!("Hello!");
    };
}
//生命周期标注
// 引用是否总是有效
// 引用是否比它指向的数据存活时间更长
// 多个引用之间的存活关系
// <'a> 声明生命周期参数
// x: &'a str 和 y: &'a str 表示两个参数必须有相同或兼容的生命周期
// -> &'a str 表示返回值至少和 'a 活得一样长
// 必须显式标注生命周期的情况

// 函数返回引用且依赖输入引用
//  结构体/枚举包含引用字段
// trait 对象包含引用
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
//'ident	Named lifetime or loop label
//使用模块
fn main(){
    println!("hello world!");
    let mut x = 6;
    let y = "    ";
    println!("x is {}",x);  
    x = 7;
    println!("x is {}",x);
    println!("constant is {}",TIME_IN_DAY);
    println!("len is {}",y.len());
    unsafe {
        COUNTER += 1;
    }
    say_hello!();
    *const COUNTER6 = 5;
}
//main();