import { readAllLines } from './lib/ts-bootstrap';

interface StateKey {
    pos: Point[];
    keyMask: number;
}

interface State extends StateKey {
    steps: number;
}

type Point = [number, number];
const dirs: Point[] = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const charCodeKeyA = 'a'.charCodeAt(0);
const charCodeDoorA = 'A'.charCodeAt(0);

function keyOf(stateKey: StateKey): string {
    return stateKey.pos.map(([x, y]) => `${x},${y}`).join(';') + ';' + stateKey.keyMask;
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
    const charMap = rows.map(row => row.split(''));
    charMap[sy - 1][sx] = '#';
    charMap[sy + 1][sx] = '#';
    charMap[sy][sx - 1] = '#';
    charMap[sy][sx + 1] = '#';
    let states: State[] = [{ pos: [[sx - 1, sy - 1], [sx - 1, sy + 1], [sx + 1, sy - 1], [sx + 1, sy + 1]], keyMask: 0, steps: 0 }];
    const allKeys = (1 << 26) - 1;
    let minSteps = Number.MAX_SAFE_INTEGER;
    let cycle = 0;
    while (states.length > 0) {
        console.log(`Cycle ${cycle++}. States in queue: ${states.length}`);
        const newStateMap = new Map<string, State>();
        for (const state of states) {
            const { pos, keyMask, steps } = state;
            if (keyMask === allKeys) {
                if (steps < minSteps) {
                    minSteps = steps;
                }
                continue;
            }
            for (let robotIndex = 0; robotIndex < pos.length; ++robotIndex) {
                const [x0, y0] = pos[robotIndex];
                const newPos = [...pos];
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
                        const c = charMap[newY][newX];
                        if (c === '#') {
                            continue;
                        }
                        if (c >= 'a' && c <= 'z') {
                            const keyBit = 1 << (c.charCodeAt(0) - charCodeKeyA);
                            if ((keyMask & keyBit) === 0) {
                                // can collect a new key, save this state for later
                                newPos[robotIndex] = [newX, newY];
                                const stateKey = keyOf({ pos: newPos, keyMask: (keyMask | keyBit) });
                                const stateSteps = steps + dist;
                                const prev = newStateMap.get(stateKey);
                                if (prev == null || stateSteps < prev.steps) {
                                    newStateMap.set(stateKey, { pos: [...newPos], keyMask: (keyMask | keyBit), steps: stateSteps });
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
        }
        states = [...newStateMap.values()];
    }
    console.log(minSteps);
}

main();
