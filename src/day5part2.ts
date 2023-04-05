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
    console.log(`Executing@${startAddr - 1}: ${JSON.stringify(program.slice(startAddr - 1, startAddr + numParams))}`);
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

async function main() {
  const f = await openInputFile();
  let programNum = 0;
  for await (const programRaw of f.readLines()) {
    const program = programRaw.split(',').map(Number);
    console.log(`Program ${programNum++}`);
    let iptr = 0;
    const inputQueue = [5];
    let isHalted = false;
    while (!isHalted) {
      const instruction = parseInstruction(program[iptr]);
      switch (instruction.code) {
        case 1: { // addition
          const params = instruction.readParams(program, iptr + 1);
          program[params[2]] = params[0] + params[1];
          iptr += 4;
          break;
        }
        case 2: { // multiplication
          const params = instruction.readParams(program, iptr + 1);
          program[params[2]] = params[0] * params[1];
          iptr += 4;
          break;
        }
        case 3: { // store input value
          const params = instruction.readParams(program, iptr + 1);
          if (inputQueue.length === 0) {
            throw new Error(`Empty input queue`);
          }
          program[params[0]] = inputQueue.shift()!;
          iptr += 2;
          break;
        }
        case 4: { // output
          const params = instruction.readParams(program, iptr + 1);
          console.log(`Output: ${params[0]}`);
          iptr += 2;
          break;
        }
        case 5: { // jump if true
          const params = instruction.readParams(program, iptr + 1);
          if (params[0] !== 0) {
            iptr = params[1];
          } else {
            iptr += 3;
          }
          break;
        }
        case 6: { // jump if false
          const params = instruction.readParams(program, iptr + 1);
          if (params[0] === 0) {
            iptr = params[1];
          } else {
            iptr += 3;
          }
          break;
        }
        case 7: { // less than
          const params = instruction.readParams(program, iptr + 1);
          const result = params[0] < params[1] ? 1 : 0;
          program[params[2]] = result;
          iptr += 4;
          break;
        }
        case 8: { // equals
          const params = instruction.readParams(program, iptr + 1);
          const result = params[0] === params[1] ? 1 : 0;
          program[params[2]] = result;
          iptr += 4;
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
  }
}

main();
