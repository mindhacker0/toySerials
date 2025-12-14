// Rust 宏使用以下元变量类型：
// ident: 标识符（函数名、变量名等）
// expr: 表达式
// block: 代码块
// item: 项（函数、结构体等）
// pat: 模式
// path: 路径（如 std::collections::HashMap）
// tt: 标记树（单个标记或括号内的标记）
// ty: 类型
// literal: 字面量（如 "string", 5, 3.14）
macro_rules! macroName {
    ()=>{
        println!("no name!");
    };
    // ($name:expr)=>{
    //     println!("hell哦，{}!",$name);
    // };
    ($code:block)=>{ $code };
    // 加法规则
    (add $a:expr, $b:expr) => { $a + $b };
    // 乘法规则
    (mul $a:expr, $b:expr) => { $a * $b };
    // 默认规则
    ($op:ident $($rest:expr),+) => { "Unknown operation" };
    // 规则3：匹配多个表达式参数
    ($($x:expr),*) => { $( println!("Multi: {}", $x); )* };
}
//要在模块间使用宏，需要使用 #[macro_use] 属性
//要导出宏给其他 crate 使用 #[macro_export]
//派生宏
// use proc_macro::TokenStream;
// use quote::quote;
// use syn::{parse_macro_input, DeriveInput};
//Crate 类型声明‌：必须在 Cargo.toml 中明确指定 proc-macro = true，否则编译器会拒绝 #[proc_macro_derive] 的使用
//过程宏必须定义在独立的库中，不能直接在主项目或普通库中定义
// #[proc_macro_derive(HelloMacro)]
// pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
//     let ast = parse_macro_input!(input as DeriveInput);
//     let name = &ast.ident;
    
//     let gen = quote! {
//         impl HelloMacro for #name {
//             fn hello_macro() {
//                 println!("Hello, Macro! My name is {}!", stringify!(#name));
//             }
//         }
//     };
    
//     gen.into()
// }
// #[derive(HelloMacro)]
// struct Pancakes;
//属性宏
// #[proc_macro_attribute]
// pub fn route(attr: TokenStream, item: TokenStream) -> TokenStream {
//     // 处理 attr 和 item
//     // 返回修改后的 TokenStream
//     item
// }
// 函数式宏
// #[proc_macro]
// pub fn sql(input: TokenStream) -> TokenStream {
//     // 解析和处理输入
//     // 返回生成的代码
//     quote! {
//         // 生成的代码
//     }.into()
// }
fn main(){
    macroName!();
    //macroName!("ttt".to_string());
    macroName!({
        println!("block hello world!");
    });
    //Pancakes::hello_macro(); // 输出: Hello, Macro! My name is Pancakes!
    // #[route(GET, "/")]
    // fn index() {
    //     // ...
    // }
    // let query = sql!(SELECT * FROM users WHERE age > 10);
}