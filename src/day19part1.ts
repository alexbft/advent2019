import { Computer, inputFromArray } from "./day11/intcode";
import { readAllText } from "./lib/ts-bootstrap";

async function main() {
    const program = (await readAllText()).split(',').map(Number);
    const computer = new Computer(program);
    let buf = '';
    let result = 0;
    for (let y = 0; y < 50; ++y) {
        for (let x = 0; x < 50; ++x) {
            const output = computer.run(inputFromArray([x, y]));
            if (output.length !== 1) {
                throw new Error(`Unexpected output: [${output}]`);
            }
            switch (output[0]) {
                case 1:
                    buf += '#';
                    result += 1;
                    break;
                case 0:
                    buf += '.';
                    break;
                default:
                    throw new Error(`Unexpected value: ${output[0]}`);
            }
        }
        buf += '\n';
    }
    console.log(`${buf}`);
    console.log(result);
}

main();
