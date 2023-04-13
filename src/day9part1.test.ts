import 'jest';
import { Computer } from './day9/intcode';

function run(memory: number[], input: number[]) {
  return new Computer(memory).run(input);
}

function parse(s: string): number[] {
  return s.split(',').map(Number);
}

describe('day 9.1 tests', () => {
  test('quine', () => {
    const output = run(parse('109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99'), []);
    expect(output).toStrictEqual(parse('109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99'));
  });

  test('big ints', () => {
    const output = run(parse('1102,34915192,34915192,7,4,7,99,0'), []);
    expect(output).toHaveLength(1);
    expect(output[0].toString()).toHaveLength(16);
  });

  test('big ints 2', () => {
    const output = run(parse('104,1125899906842624,99'), []);
    expect(output).toStrictEqual([1125899906842624]);
  });
});
