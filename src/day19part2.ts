import { Computer, inputFromArray } from "./day11/intcode";
import { readAllText } from "./lib/ts-bootstrap";

interface Bounds {
    // Start is inclusive
    start: number;
    // End is exclusive
    end: number;
}

const rowBoundsCache = new Map<number, Bounds>();

function getRowBounds(computer: Computer, y: number): Bounds {
    if (rowBoundsCache.has(y)) {
        return rowBoundsCache.get(y)!;
    }
    let start = -1;
    for (let x = 0; ; ++x) {
        const output = computer.run(inputFromArray([x, y]));
        if (output.length !== 1) {
            throw new Error(`Unexpected output: [${output}]`);
        }
        const value = output[0];
        if (value !== 0 && value !== 1) {
            throw new Error(`Unexpected value: ${value}`);
        }
        if (start === -1) {
            if (value === 1) {
                start = x;
            }
        } else {
            if (value === 0) {
                const result: Bounds = { start, end: x };
                rowBoundsCache.set(y, result);
                return result;
            }
        }
    }
}

async function main() {
    const program = (await readAllText()).split(',').map(Number);
    const computer = new Computer(program);
    let l = 0;
    let r = 5000;
    while (l < r) {
        const mid = Math.floor((l + r) / 2);
        if (mid === l) {
            break;
        }
        const bounds = getRowBounds(computer, mid);
        const left = bounds.end - 100;
        const fits = getRowBounds(computer, mid + 99).start <= left;
        if (fits) {
            r = mid;
        } else {
            l = mid;
        }
    }
    const resY = r;
    const resX = getRowBounds(computer, resY + 99).start;
    console.log(resX, resY, resX * 10000 + resY);
}

main();
