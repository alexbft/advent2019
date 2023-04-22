import { readAllLines } from './lib/ts-bootstrap';

interface State {
    x: number;
    y: number;
    keyMask: number;
    steps: number;
}

type Point = [number, number];
const dirs: Point[] = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const charCodeKeyA = 'a'.charCodeAt(0);
const charCodeDoorA = 'A'.charCodeAt(0);

function keyOf(x: number, y: number, keyMask: number): number {
    return x + y * 100 + keyMask * 10000;
}

async function main() {
    const rows = await readAllLines();
    const maxX = rows[0].length;
    const maxY = rows.length;
    let sx = 0;
    let sy = 0;
    for (let y = 0; y < maxY; ++y) {
        for (let x = 0; x < maxX; ++x) {
            if (rows[y][x] === '@') {
                sx = x;
                sy = y;
            }
        }
    }
    let states: State[] = [{ x: sx, y: sy, keyMask: 0, steps: 0 }];
    const allKeys = (1 << 26) - 1;
    let minSteps = Number.MAX_SAFE_INTEGER;
    let cycle = 0;
    while (states.length > 0) {
        console.log(`Cycle ${cycle++}. States in queue: ${states.length}`);
        const newStateMap = new Map<number, number>();
        for (const state of states) {
            const { x: x0, y: y0, keyMask, steps } = state;
            if (keyMask === allKeys) {
                if (steps < minSteps) {
                    minSteps = steps;
                }
                continue;
            }
            const distGrid = Array<number>(maxX * maxY).fill(0);
            distGrid[y0 * maxX + x0] = 1;
            const queue: Point[] = [[x0, y0]];
            while (queue.length > 0) {
                const [curX, curY] = queue.shift()!;
                const dist = distGrid[curY * maxX + curX];
                for (const [dx, dy] of dirs) {
                    const newX = curX + dx;
                    const newY = curY + dy;
                    const newIndex = newY * maxX + newX;
                    if (distGrid[newIndex] !== 0) {
                        continue;
                    }
                    const c = rows[newY][newX];
                    if (c === '#') {
                        continue;
                    }
                    if (c >= 'a' && c <= 'z') {
                        const keyBit = 1 << (c.charCodeAt(0) - charCodeKeyA);
                        if ((keyMask & keyBit) === 0) {
                            // can collect a new key, save this state for later
                            const stateKey = keyOf(newX, newY, keyMask | keyBit);
                            const stateSteps = steps + dist;
                            const prev = newStateMap.get(stateKey);
                            if (prev == null || stateSteps < prev) {
                                newStateMap.set(stateKey, stateSteps);
                            }
                        }
                    } else if (c >= 'A' && c <= 'Z') {
                        const doorBit = 1 << (c.charCodeAt(0) - charCodeDoorA);
                        if ((keyMask & doorBit) === 0) {
                            continue;
                        }
                    }
                    distGrid[newIndex] = dist + 1;
                    queue.push([newX, newY]);
                }
            }
        }
        const newStates: State[] = [];
        for (const [k, steps] of newStateMap.entries()) {
            const x = k % 100;
            const y = Math.floor(k / 100) % 100;
            const keyMask = Math.floor(k / 10000);
            newStates.push({ x, y, keyMask, steps });
        }
        states = newStates;
    }
    console.log(minSteps);
}

main();
