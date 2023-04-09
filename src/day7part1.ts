import { openInputFile } from './lib/ts-bootstrap';

class Instruction {
    constructor(
        public code: number,
        public immediateMode: boolean[]) { }

    readParams(program: number[], startAddr: number): number[] {
        let numParams: number;
        const immediateMode = [...this.immediateMode];
        const needCheckAddress = immediateMode.map(_ => false);
        if (this.code === 1 || this.code === 2 || this.code === 7 || this.code === 8) {
            numParams = 3;
            // We need to return the address directly, so I need to disable the indirection.
            immediateMode[2] = true;
            needCheckAddress[2] = true;
        } else if (this.code === 3 || this.code === 4) {
            numParams = 1;
            if (this.code === 3) {
                // Same, this is an address which is returned without indirection.
                immediateMode[0] = true;
                needCheckAddress[0] = true;
            }
        } else if (this.code === 5 || this.code === 6) {
            numParams = 2;
            needCheckAddress[1] = true;
        } else {
            throw new Error(`Can't read params for instruction ${this.code}`);
        }
        //console.log(`Executing@${startAddr - 1}: ${JSON.stringify(program.slice(startAddr - 1, startAddr + numParams))}`);
        const result: number[] = [];
        for (let i = 0; i < numParams; ++i) {
            if (startAddr + i >= program.length) {
                throw new Error(`Expected a parameter, got EOF`);
            }
            const valueOrAddr = program[startAddr + i];
            let value: number;
            if (immediateMode[i]) {
                value = valueOrAddr;
            } else {
                if (valueOrAddr < 0 || valueOrAddr >= program.length) {
                    throw new Error(`Invalid position`);
                }
                value = program[valueOrAddr];
            }
            if (needCheckAddress[i]) {
                if (value < 0 || value >= program.length) {
                    console.warn(`Invalid address at ${startAddr + i}: ${value}`);
                }
            }
            result.push(value);
        }
        return result;
    }
}

function parseInstruction(x: number): Instruction {
    const code = x % 100;
    x = x / 100 | 0;
    const immediateMode: boolean[] = [];
    for (let i = 0; i < 3; ++i) {
        const digit = x % 10;
        if (digit !== 0 && digit !== 1) {
            throw new Error(`Can't parse instruction: ${x}`);
        }
        immediateMode.push(digit === 1);
        x = x / 10 | 0;
    }
    return new Instruction(code, immediateMode);
}

class Computer {
    constructor(private program: number[]) { }

    run(inputs: number[]): number[] {
        return new ComputerInstance(this.program, inputs).run();
    }
}

class ComputerInstance {
    private program: number[];
    private inputs: number[];
    private iptr: number = 0;

    constructor(program: number[], inputs: number[]) {
        this.program = [...program];
        this.inputs = [...inputs];
    }

    run(): number[] {
        let isHalted = false;
        const output: number[] = [];
        while (!isHalted) {
            const instruction = parseInstruction(this.program[this.iptr]);
            let params: number[] = [];
            if (instruction.code !== 99) {
                params = instruction.readParams(this.program, this.iptr + 1);
            }
            switch (instruction.code) {
                case 1: { // addition
                    this.program[params[2]] = params[0] + params[1];
                    this.iptr += 4;
                    break;
                }
                case 2: { // multiplication
                    this.program[params[2]] = params[0] * params[1];
                    this.iptr += 4;
                    break;
                }
                case 3: { // store input value
                    if (this.inputs.length === 0) {
                        throw new Error(`Empty input queue`);
                    }
                    this.program[params[0]] = this.inputs.shift()!;
                    this.iptr += 2;
                    break;
                }
                case 4: { // output
                    //console.log(`Output: ${params[0]}`);
                    output.push(params[0]);
                    this.iptr += 2;
                    break;
                }
                case 5: { // jump if true
                    if (params[0] !== 0) {
                        this.iptr = params[1];
                    } else {
                        this.iptr += 3;
                    }
                    break;
                }
                case 6: { // jump if false
                    if (params[0] === 0) {
                        this.iptr = params[1];
                    } else {
                        this.iptr += 3;
                    }
                    break;
                }
                case 7: { // less than
                    const result = params[0] < params[1] ? 1 : 0;
                    this.program[params[2]] = result;
                    this.iptr += 4;
                    break;
                }
                case 8: { // equals
                    const result = params[0] === params[1] ? 1 : 0;
                    this.program[params[2]] = result;
                    this.iptr += 4;
                    break;
                }
                case 99: { // halt
                    isHalted = true;
                    break;
                }
                default:
                    throw new Error(`Unknown opcode: ${instruction.code}`);
            }
        }
        return output;
    }
}

function permute(permutation: number[]) {
    var length = permutation.length,
        result = [permutation.slice()],
        c: number[] = new Array(length).fill(0),
        i = 1,
        k: number,
        p: number;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}

async function main() {
    const f = await openInputFile();
    let programNum = 0;
    const phasePermutations = permute([0, 1, 2, 3, 4]);
    for await (const programRaw of f.readLines()) {
        const program = programRaw.split(',').map(Number);
        console.log(`Program ${programNum++}`);
        const computer = new Computer(program);
        let maxOutput = 0;
        for (const phases of phasePermutations) {
            let lastOutput = 0;
            for (const phase of phases) {
                const output = computer.run([phase, lastOutput]);
                lastOutput = output[0];
            }
            if (maxOutput < lastOutput) {
                maxOutput = lastOutput;
            }
        }
        console.log(`max output: ${maxOutput}`);
    }
}

main();
