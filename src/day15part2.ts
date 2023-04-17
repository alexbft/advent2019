import { Computer } from './day11/intcode';
import { readAllText } from './lib/ts-bootstrap';

type Point = [number, number];

interface Direction {
    id: number;
    opposite: number;
    vector: Point;
}

const directions = new Map<number, Direction>([
    [1, { id: 1, opposite: 2, vector: [0, -1] }],
    [2, { id: 2, opposite: 1, vector: [0, 1] }],
    [3, { id: 3, opposite: 4, vector: [-1, 0] }],
    [4, { id: 4, opposite: 3, vector: [1, 0] }],
]);

function keyOf(p: Point): string {
    return `${p[0]},${p[1]}`;
}

function add([x, y]: Point, [dx, dy]: Point): Point {
    return [x + dx, y + dy];
}

async function main() {
    const programRaw = await readAllText();
    const program = programRaw.split(',').map(Number);
    const instance = new Computer(program).getInstance();
    const inputQueue: number[] = [];
    instance.inputs = () => {
        if (inputQueue.length === 0) {
            throw new Error('no input');
        }
        return inputQueue.shift()!;
    }
    const map = new Map<string, number>();
    map.set(keyOf([0, 0]), 1);
    let destination: Point | undefined;
    function dfs(pos: Point, enteredFrom: number) {
        for (const direction of directions.values()) {
            const newPos = add(pos, direction.vector);
            const newKey = keyOf(newPos);
            if (map.has(newKey)) {
                continue;
            }
            inputQueue.push(direction.id);
            const output = instance.runUntilOutput();
            switch (output) {
                case 0: // wall
                    map.set(newKey, output);
                    break;
                case 1: // passage
                case 2: // destination
                    map.set(newKey, output);
                    if (output === 2) {
                        destination = newPos;
                    }
                    dfs(newPos, direction.id);
                    break;
                default: // null?
                    throw new Error(`invalid output: ${output}`);
            }
        }
        if (enteredFrom !== 0) {
            inputQueue.push(directions.get(enteredFrom)!.opposite);
            const output = instance.runUntilOutput();
            if (output !== 1 && output !== 2) {
                throw new Error(`Invalid output on backtracking: ${output}`);
            }
        }
    }
    dfs([0, 0], 0);
    console.log(destination);
    // now to run the BFS to find the longest shortest path
    const queue: [Point, number][] = [[destination!, 0]];
    const visited = new Set<string>([keyOf(destination!)]);
    let maxDistance = 0;
    while (queue.length > 0) {
        const [cur, dist] = queue.shift()!;
        if (dist > maxDistance) {
            maxDistance = dist;
        }
        for (const direction of directions.values()) {
            const newPos = add(cur, direction.vector);
            const newKey = keyOf(newPos);
            if (visited.has(newKey)) {
                continue;
            }
            const cell = map.get(newKey);
            if (cell == null || cell === 0) {
                continue;
            }
            visited.add(newKey);
            queue.push([newPos, dist + 1]);
        }
    }
    console.log(maxDistance);
}

main();
