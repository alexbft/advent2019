import { Computer, inputFromArray } from './day11/intcode';
import { readAllText } from './lib/ts-bootstrap';

type Vector = [number, number]

const DIRS = new Map<number, Vector>([
    [0, [0, -1]],
    [1, [1, 0]],
    [2, [0, 1]],
    [3, [-1, 0]],
]);
const ROBOT_CHARS = new Map<string, number>([
    ['^', 0],
    ['>', 1],
    ['v', 2],
    ['<', 3],
]);

class FloorMap {
    public readonly width: number;
    public readonly height: number;
    private readonly cells: string[];

    constructor(charMap: string[]) {
        this.cells = charMap;
        this.width = charMap[0].length;
        this.height = charMap.length;
    }

    get([x, y]: Vector): string {
        if (this.isInside(x, y)) {
            return this.cells[y][x];
        }
        return '?';
    }

    isInside(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    dump(): string {
        return this.cells.join('\n');
    }
}

interface Command {
    turn: string;
    steps: number;
}

interface Solution {
    main: number[];
    procs: Command[][];
}

function turn(dir: number, side: number): number {
    let newDir = (dir + side) % DIRS.size;
    if (newDir < 0) {
        newDir += DIRS.size;
    }
    return newDir;
}

function leftAndRight(dir: number): [Vector, Vector] {
    const dirLeft = turn(dir, -1);
    const dirRight = turn(dir, 1);
    return [DIRS.get(dirLeft)!, DIRS.get(dirRight)!];
}

function add([x0, y0]: Vector, [x1, y1]: Vector): Vector {
    return [x0 + x1, y0 + y1];
}

function emptySolution(): Solution {
    return { main: [], procs: [] };
}

function procEq(a: Command[], b: Command[]): boolean {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; ++i) {
        if (a[i].steps !== b[i].steps || a[i].turn !== b[i].turn) {
            return false;
        }
    }
    return true;
}

function procToString(proc: Command[]): string {
    return proc.map(command => `${command.turn},${command.steps}`).join(',');
}

function solveRec(commands: Command[], index: number, solution: Solution): Solution | null {
    if (index >= commands.length) {
        return solution;
    }
    for (let procIndex = 0; procIndex < solution.procs.length; ++procIndex) {
        const proc = solution.procs[procIndex];
        const rangeEnd = index + proc.length;
        if (rangeEnd > commands.length) {
            continue;
        }
        const nextChunk = commands.slice(index, rangeEnd);
        if (procEq(proc, nextChunk)) {
            const maybeSolution = solveRec(commands, rangeEnd, { main: [...solution.main, procIndex], procs: solution.procs });
            if (maybeSolution != null) {
                return maybeSolution;
            }
        }
    }
    if (solution.procs.length < 3) {
        let rangeEnd = index;
        const procBuf: Command[] = [];
        while (rangeEnd < commands.length) {
            procBuf.push(commands[rangeEnd]);
            ++rangeEnd;
            if (procToString(procBuf).length > 20) {
                break;
            }
            const maybeSolution = solveRec(commands, rangeEnd, { main: [...solution.main, solution.procs.length], procs: [...solution.procs, procBuf] });
            if (maybeSolution != null) {
                return maybeSolution;
            }
        }
    }
    return null;
}

async function main() {
    const programRaw = await readAllText();
    const program = programRaw.split(',').map(Number);
    const computer = new Computer(program);
    const output = computer.run(inputFromArray([]));
    const mapChars = output.map(x => String.fromCharCode(x)).join('');
    //console.log(mapChars);
    const map = new FloorMap(mapChars.split('\n'));
    let startX = 0;
    let startY = 0;
    let startDir = 0;
    for (let y = 0; y < map.height; ++y) {
        for (let x = 0; x < map.width; ++x) {
            const c = map.get([x, y]);
            if (ROBOT_CHARS.has(c)) {
                startX = x;
                startY = y;
                startDir = ROBOT_CHARS.get(c)!;
            }
        }
    }
    let cur: Vector = [startX, startY];
    let curDir = startDir;
    const commands: Command[] = [];
    while (true) {
        const [leftPos, rightPos] = leftAndRight(curDir).map(vec => add(cur, vec));
        let turnLeft: boolean;
        if (map.get(leftPos) === '#') {
            turnLeft = true;
        } else if (map.get(rightPos) === '#') {
            turnLeft = false;
        } else {
            // probably end of path
            break;
        }
        curDir = turn(curDir, turnLeft ? -1 : 1);
        const dirVec = DIRS.get(curDir)!;
        let steps = 0;
        while (map.get(add(cur, dirVec)) === '#') {
            ++steps;
            cur = add(cur, dirVec);
        }
        commands.push({ turn: (turnLeft ? 'L' : 'R'), steps });
    }
    console.log(procToString(commands));
    //console.log(cur, curDir);
    const solution = solveRec(commands, 0, emptySolution());
    if (solution == null) {
        throw new Error(`No solution`);
    }
    let input = solution.main.map(procIndex => 'ABC'[procIndex]).join(',') + '\n';
    for (const proc of solution.procs) {
        input += procToString(proc) + '\n';
    }
    // no video feed
    input += 'n\n';
    console.log(input);
    const inputNum = input.split('').map(c => c.charCodeAt(0));
    const instance = computer.getInstance();
    instance.writeMemory(0, 2);
    instance.inputs = inputFromArray(inputNum);
    const output2 = instance.run();
    const mapChars2 = output2.map(x => String.fromCharCode(x)).join('');
    console.log(mapChars2);
    console.log(output2[output2.length - 1]);
}

main();
