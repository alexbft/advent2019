use std::fs::File;
use std::io::{Read};

pub fn day2part1(filename: String) {
    let mut f_input = File::open(filename).unwrap();
    let mut text = String::new();
    f_input.read_to_string(&mut text).unwrap();
    text = text.trim().to_string();
    let mut nums: Vec<i32> = text.split(",").map(|s| s.parse().unwrap()).collect();
    nums[1] = 12;
    nums[2] = 2;
    let mut ptr = 0;
    loop {
        match nums[ptr] {
            1 => {
                // addition
                let op1_addr: usize = nums[ptr + 1].try_into().unwrap();
                let op2_addr: usize = nums[ptr + 2].try_into().unwrap();
                let dest_addr: usize = nums[ptr + 3].try_into().unwrap();
                nums[dest_addr] = nums[op1_addr] + nums[op2_addr];
                ptr += 4;
            }
            2 => {
                // mult
                let op1_addr: usize = nums[ptr + 1].try_into().unwrap();
                let op2_addr: usize = nums[ptr + 2].try_into().unwrap();
                let dest_addr: usize = nums[ptr + 3].try_into().unwrap();
                nums[dest_addr] = nums[op1_addr] * nums[op2_addr];
                ptr += 4;
            }
            99 => {
                // halt
                break;
            }
            _ => {
                panic!("unknown op: {}", nums[ptr]);
            }
        }
    }
    println!("{}", nums[0]);
}
