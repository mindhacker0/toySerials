trait Printable {
    fn print(&self);
}

impl Printable for String {
    fn print(&self){
        println!("{}",self);
    }
}

impl Printable for i32 {
    fn print(&self){
        println!("{}",self);
    }
}

fn print_it<T:Printable>(x:T){
    x.print();
}

pub fn test_trait(){
    print_it("sfssfsf".to_string());
    print_it(42);
}