mod front_of_house {
    pub mod hosting {
       pub fn add_to_waitlist() {

       }
    }
    pub struct Breakfast {
        pub toast:String,
        seasonal_fruit:String,
    }
    impl Breakfast {
        pub fn summer(toast:&str)->Breakfast {
            Breakfast {
                toast: String::from(toast),
                seasonal_fruit: String::from("xxx")
            }
        }
    }
}
use front_of_house::hosting;
pub fn eat_at_restaurant() {
    //Absolute path
    crate::front_of_house::hosting::add_to_waitlist();

    // Relative path
    hosting::add_to_waitlist();
    let mut bf = crate::front_of_house::Breakfast::summer("xxx");
    bf.toast = String::from("ttt");
    println!("I'd like {} toast please", bf.toast);
}