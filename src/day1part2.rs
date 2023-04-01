use std::fs::File;
use std::io::{BufRead, BufReader};

pub fn day1part2(filename: String) {
    let f_input = File::open(filename).unwrap();
    let nums: Vec<i32> = BufReader::new(f_input).lines().map(|line| line.unwrap().parse::<i32>().unwrap()).collect();
    let mut sum = 0;
    for num in nums {
        let mut item = num / 3 - 2;
        while item > 0 {
            sum += item;
            item = item / 3 - 2;
        }
    }
    println!("{}", sum);
}
