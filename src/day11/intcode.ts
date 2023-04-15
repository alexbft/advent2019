import { InstructionBlueprint, instructionSet } from './instruction_set';

const MAX_ADDR = 1000000;

export type InputGenerator = () => number;
export type InputGeneratorProvider = () => InputGenerator;

export function inputFromArray(a: number[]): InputGeneratorProvider {
  return () => {
    const aIter = a.values();
    return () => aIter.next().value;
  };
}

function emptyInput(): InputGenerator {
  return () => {
    throw new Error('Empty input');
  }
}

export class Computer {
  private readonly memory: number[];

  constructor(memory: number[]) {
    this.memory = [...memory];
  }

  run(inputs: InputGeneratorProvider): number[] {
    return new ComputerInstance(this.memory, inputs()).run();
  }

  getInstance() {
    return new ComputerInstance(this.memory, emptyInput());
  }
}

export class ComputerInstance {
  private memory: number[];
  public inputs: InputGenerator;
  private iptr: number = 0;
  private basePtr: number = 0;
  public isHalted: boolean = false;

  constructor(memory: number[], inputs: InputGenerator) {
    this.memory = [...memory];
    this.inputs = inputs;
  }

  executeNextInstruction(): number | null {
    if (this.isHalted) {
      throw new Error('halted');
    }
    let output: number | null = null;
    const instruction = this.readInstruction(this.iptr);
    //console.log(`Executing: ${this.iptr}@${instruction.name} ${instruction.params.join(', ')}`);
    this.iptr += instruction.length;
    const params = instruction.params;
    switch (instruction.name) {
      case 'add': { // addition
        this.writeMemory(params[2], params[0] + params[1]);
        break;
      }
      case 'multiply': { // multiplication
        this.writeMemory(params[2], params[0] * params[1]);
        break;
      }
      case 'input': { // store input value
        this.writeMemory(params[0], this.inputs());
        break;
      }
      case 'output': { // output
        output = params[0];
        break;
      }
      case 'jump': { // jump if true
        if (params[0] !== 0) {
          this.jump(params[1]);
        }
        break;
      }
      case 'jump_false': { // jump if false
        if (params[0] === 0) {
          this.jump(params[1]);
        }
        break;
      }
      case 'less_than': { // less than
        const result = params[0] < params[1] ? 1 : 0;
        this.writeMemory(params[2], result);
        break;
      }
      case 'equals': { // equals
        const result = params[0] === params[1] ? 1 : 0;
        this.writeMemory(params[2], result);
        break;
      }
      case 'base_ptr': { // modify base pointer
        this.modifyBasePtr(params[0]);
        break;
      }
      case 'halt': { // halt
        this.isHalted = true;
        break;
      }
      default:
        throw new Error(`Unknown instruction: ${instruction.name}`);
    }
    return output;
  }

  readMemory(ptr: number): number {
    if (!this.validatePtr(ptr)) {
      throw new Error(`Invalid memory address to read`);
    }
    const result = this.memory[ptr];
    return result == null ? 0 : result;
  }

  writeMemory(ptr: number, value: number) {
    if (!this.validatePtr(ptr)) {
      throw new Error(`Invalid memory address to write`);
    }
    this.memory[ptr] = value;
  }

  jump(ptr: number) {
    if (!this.validatePtr(ptr)) {
      throw new Error(`Invalid jump address`);
    }
    this.iptr = ptr;
  }

  modifyBasePtr(relativePtr: number) {
    const newPtr = this.basePtr + relativePtr;
    if (!this.validatePtr(newPtr)) {
      throw new Error(`Invalid base pointer`);
    }
    this.basePtr = newPtr;
  }

  validatePtr(ptr: number): boolean {
    return ptr >= 0 && ptr < MAX_ADDR;
  }

  readInstruction(ptr: number): Instruction {
    if (!this.validatePtr(ptr)) {
      throw new Error(`Invalid instruction pointer`);
    }
    const instructionWord = this.readMemory(ptr);
    const opCode = instructionWord % 100;
    const blueprint = instructionSet.get(opCode);
    if (blueprint == null) {
      throw new Error(`Unknown opcode: ${opCode}`);
    }
    let flags = Math.floor(instructionWord / 100);
    const params: number[] = [];
    for (let i = 0; i < blueprint.paramTypes.length; ++i) {
      const flag = flags % 10;
      flags = Math.floor(flags / 10);
      const paramRaw = this.readMemory(ptr + 1 + i);
      let param: number;
      const isTarget = blueprint.paramTypes[i] === 'target';
      switch (flag) {
        case 0: // position
          param = isTarget ? paramRaw : this.readMemory(paramRaw);
          break;
        case 1: // immediate
          param = paramRaw;
          break;
        case 2: // relative
          param = isTarget ? (this.basePtr + paramRaw) : this.readMemory(this.basePtr + paramRaw);
          break;
        default:
          throw new Error(`Invalid flag in instruction: ${instructionWord}`);
      }
      params.push(param);
    }
    return new Instruction(blueprint, params);
  }

  run(): number[] {
    const output: number[] = [];
    while (!this.isHalted) {
      const maybeOutput = this.executeNextInstruction();
      if (maybeOutput != null) {
        output.push(maybeOutput);
      }
    }
    return output;
  }

  runUntilOutput(): number | null {
    while (!this.isHalted) {
      const maybeOutput = this.executeNextInstruction();
      if (maybeOutput != null) {
        return maybeOutput;
      }
    }
    return null;
  }
}

class Instruction {
  constructor(
    readonly blueprint: InstructionBlueprint,
    readonly params: number[],
  ) { }

  get name() {
    return this.blueprint.name;
  }

  get length() {
    return 1 + this.blueprint.paramTypes.length;
  }
}
