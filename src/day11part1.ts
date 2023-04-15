import { Computer } from "./day11/intcode";
import { readAllText } from "./lib/ts-bootstrap";

const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

async function main() {
    const programRaw = await readAllText();
    const program = programRaw.split(',').map(Number);
    let x: number = 0;
    let y: number = 0;
    let dir: number = 0;
    const whiteCells = new Set<string>();
    const changes = new Set<string>();
    const inputCamera = () => {
        return whiteCells.has(`${x},${y}`) ? 1 : 0;
    }
    const cpu = new Computer(program).getInstance();
    cpu.inputs = inputCamera;
    while (true) {
        const maybeColor = cpu.runUntilOutput();
        if (maybeColor == null) {
            break;
        }
        console.log(`${maybeColor} ${x} ${y}`);
        const key = `${x},${y}`;
        changes.add(key);
        if (maybeColor === 1) {
            whiteCells.add(key);
        } else {
            whiteCells.delete(key);
        }
        const maybeDir = cpu.runUntilOutput();
        if (maybeDir == null) {
            break;
        }
        const turn = maybeDir === 1 ? 1 : -1;
        dir = (dir + turn) % 4;
        if (dir < 0) {
            dir += 4;
        }
        const [dx, dy] = dirs[dir];
        x += dx;
        y += dy;
    }
    console.log(changes.size);
}

main();
