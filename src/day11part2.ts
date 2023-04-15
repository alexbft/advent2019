import { Computer } from "./day11/intcode";
import { readAllText } from "./lib/ts-bootstrap";

const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function fromKey(key: string): [number, number] {
    const [x, y] = key.split(',').map(Number);
    return [x, y];
}

async function main() {
    const programRaw = await readAllText();
    const program = programRaw.split(',').map(Number);
    let x: number = 0;
    let y: number = 0;
    let dir: number = 0;
    const whiteCells = new Set<string>();
    whiteCells.add('0,0');
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
        //console.log(`${maybeColor} ${x} ${y}`);
        const key = `${x},${y}`;
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
    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    for (const key of whiteCells) {
        const [x, y] = fromKey(key);
        if (x < minX) {
            minX = x;
        }
        if (x > maxX) {
            maxX = x;
        }
        if (y < minY) {
            minY = y;
        }
        if (y > maxY) {
            maxY = y;
        }
    }
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    const grid = Array<number>(w * h).fill(0);
    for (const key of whiteCells) {
        const [x, y] = fromKey(key);
        grid[(y - minY) * w + (x - minX)] = 1;
    }
    for (let y = 0; y < h; ++y) {
        let buf = '';
        for (let x = 0; x < w; ++x) {
            buf += grid[y * w + x] === 1 ? '#' : '.';
        }
        console.log(buf);
    }
}

main();
