import { Computer } from './day9/intcode';
import { readAllText } from './lib/ts-bootstrap';

async function main() {
  const programRaw = await readAllText();
  const program = programRaw.split(',').map(Number);
  const output = new Computer(program).run([2]);
  console.log(output);
}

main();
