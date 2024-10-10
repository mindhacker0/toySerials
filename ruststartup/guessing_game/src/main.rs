use std::io;
use std::cmp::Ordering;
use rand::Rng;
use crate::garden::{add_number,dec_number};
use crate::garden::flower::Asparagus;

pub mod garden;
macro_rules! my_macro {
    ($var:expr)=>{
        println!("xxxxx macro {}!",$var);
    };
}
#[derive(Debug)]
struct User {
    id: u32,
    name: String
}
fn main() {
    println!("Guess the number!");
    let secret_number = rand::thread_rng().gen_range(1..=100); 
    // test_trait();
    // println!("guess number is {secret_number}");
    let plant = Asparagus {};
    println!("I'm growing {plant:?}!");
    my_macro!(add_number(secret_number,2));
    loop {
        println!("please enter your guess!");
        let mut guess: String = String::new();
        io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line");
        let guess: u32 =match guess.trim().parse() {
            Ok(num)=>num,
            Err(_)=>continue,
        };
        println!("you guesed: {guess}");
        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal =>{
                println!("You win!");
                break;
            }
        }
    }
}
