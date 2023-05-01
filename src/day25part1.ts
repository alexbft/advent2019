import { stdin, stdout } from 'process';
import * as readline from 'node:readline/promises';
import { Computer } from './day21/intcode';
import { readAllText } from './lib/ts-bootstrap';

const preset = [
    // 'south',
    // 'take fixed point',
    // 'north',
    'north',
    // 'take spool of cat6',
    'north',
    'take monolith',
    // 'west',
    // 'take planetoid',
    // 'east',
    'north',
    'take hypercube',
    'south',
    'south',
    'east',
    // 'north',
    // 'take candy cane',
    // 'south',
    'east',
    'take easter egg',
    'east',
    'south',
    'take ornament',
    'west',
    'south',
    'west',
];

function outputToStr(x: number[]): string {
    return x.map(c => String.fromCharCode(c)).join('');
}

async function question(rl: readline.Interface, prompt: number[]): Promise<number[]> {
    const promptStr = outputToStr(prompt);
    let inputStr: string;
    if (preset.length === 0) {
        inputStr = (await rl.question(promptStr)) + '\n';
    } else {
        rl.write(promptStr);
        inputStr = preset.shift()! + '\n';
        rl.write(inputStr);
    }
    return [...Buffer.from(inputStr, 'utf-8')];
}

async function* startRepl(rl: readline.Interface): AsyncGenerator<number, void, number[]> {
    let output = yield 0;
    while (true) {
        const input = await question(rl, output);
        output = [];
        for (const num of input) {
            output.push(...(yield num));
        }
    }
}

async function main() {
    const program = (await readAllText()).split(',').map(Number);
    const instance = new Computer(program).getInstance();
    const rl = readline.createInterface({ input: stdin, output: stdout });
    const inputGen = startRepl(rl);
    await inputGen.next();
    rl.write('Started!\n');
    rl.write(outputToStr(await instance.runWithInputGenerator(inputGen)));
    rl.write('Done!');
    rl.close();
}

main();
