import { readAllLines } from './lib/ts-bootstrap';
import { List, Map } from 'immutable';

interface Instruction {
  dir: string;
  steps: number;
}

const instructionRe = /^([LRUD])(\d+)$/;
function parseInstruction(s: string): Instruction {
  const match = s.match(instructionRe)!;
  return { dir: match[1], steps: Number(match[2]) };
}

async function main() {
  const lines = await readAllLines();
  const instructions = lines.map(line => line.split(',').map(parseInstruction));
  let pointSteps = Map<List<number>, number>();
  let x = 0;
  let y = 0;
  let totalSteps = 0;
  const dirs = {
    'R': [1, 0],
    'L': [-1, 0],
    'U': [0, 1],
    'D': [0, -1],
  };
  for (const { dir, steps } of instructions[0]) {
    const [dx, dy] = dirs[dir as keyof typeof dirs];
    for (let step = 0; step < steps; ++step) {
      x += dx;
      y += dy;
      totalSteps += 1;
      pointSteps = pointSteps.set(List([x, y]), totalSteps);
    }
  }
  x = 0;
  y = 0;
  totalSteps = 0;
  let minDist = Number.MAX_SAFE_INTEGER;
  for (const { dir, steps } of instructions[1]) {
    const [dx, dy] = dirs[dir as keyof typeof dirs];
    for (let step = 0; step < steps; ++step) {
      x += dx;
      y += dy;
      totalSteps += 1;
      if (pointSteps.has(List([x, y]))) {
        const dist = totalSteps + pointSteps.get(List([x, y]))!;
        console.log(`${x} ${y} ${dist}`);
        if (dist < minDist) {
          minDist = dist;
        }
      }
    }
  }
  console.log(minDist);
}

main();
