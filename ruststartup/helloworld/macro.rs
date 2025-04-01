macro_rules! macroName {
    ()=>{
        println!("no name!");
    };
    ($name:expr)=>{
        println!("hell哦，{}!",$name);
    };
}
fn main(){
    macroName!();
}