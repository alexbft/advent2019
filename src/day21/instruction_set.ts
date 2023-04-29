export type InstructionParamType = 'x' | 'target' | 'addr';
export type InstructionName = 'add' | 'multiply' | 'input' | 'output' | 'jump' | 'jump_false' | 'less_than' | 'equals' | 'base_ptr' | 'halt';

export interface InstructionBlueprint {
  name: InstructionName;
  opCode: number;
  paramTypes: InstructionParamType[];
}

export type InstructionSet = Map<number, InstructionBlueprint>;

const instructionSetText = {
  1: 'add x,x,target',
  2: 'multiply x,x,target',
  3: 'input target',
  4: 'output x',
  5: 'jump x,addr',
  6: 'jump_false x,addr',
  7: 'less_than x,x,target',
  8: 'equals x,x,target',
  9: 'base_ptr x',
  99: 'halt',
};
export const instructionSet = parseInstructionSet(instructionSetText);

function parseInstructionSet(text: typeof instructionSetText): InstructionSet {
  const result: InstructionSet = new Map();
  for (const [k, s] of Object.entries(text)) {
    const opCode = Number(k);
    const [name, params] = s.split(' ');
    const paramTypes = (params == null ? [] : params.split(',')) as InstructionParamType[];
    result.set(opCode, { name: name as InstructionName, opCode, paramTypes });
  }
  return result;
}
