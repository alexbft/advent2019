use std::fs::File;
use std::io::{BufRead, BufReader};

pub fn day1part1(filename: String) {
    let f_input = File::open(filename).unwrap();
    let nums: Vec<i32> = BufReader::new(f_input).lines().map(|line| line.unwrap().parse::<i32>().unwrap()).collect();
    let mut sum = 0;
    for num in nums {
        sum += num / 3 - 2;
    }
    println!("{}", sum);
}
