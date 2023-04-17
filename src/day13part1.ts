import { HashDict } from 'scl';
import { Computer, inputFromArray } from './day11/intcode';
import { readAllText } from './lib/ts-bootstrap';

type Point = [number, number];

async function main() {
    const programRaw = await readAllText();
    const program = programRaw.split(',').map(Number);
    const output = new Computer(program).run(inputFromArray([]));
    const grid = new HashDict<Point, number>();
    for (let i = 0; i < output.length; i += 3) {
        const [x, y, value] = output.slice(i, i + 3);
        grid.add([[x, y], value]);
    }
    let blocks = 0;
    for (const [_, value] of grid) {
        if (value === 2) {
            ++blocks;
        }
    }
    console.log(blocks);
}

main();
