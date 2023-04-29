import { Computer, inputFromArray } from './day21/intcode';
import { readAllText } from './lib/ts-bootstrap';

async function main() {
    const program = (await readAllText()).split(',').map(Number);
    const scriptStr = `
        OR A T
        AND B T
        AND C T
        NOT T J
        AND D J
        WALK`.trim().split('\n').map(line => line.trim()).join('\n') + '\n';
    const script = [...Buffer.from(scriptStr, 'ascii')];
    const output = new Computer(program).run(inputFromArray(script));
    console.log(output[output.length - 1]);
}

main();
