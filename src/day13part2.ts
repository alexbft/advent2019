import { HashDict } from 'scl';
import { HashDictOptions } from 'scl/lib/HashDict';
import { ResolveAction } from 'scl/lib/util';
import { Computer } from './day11/intcode';
import { readAllText } from './lib/ts-bootstrap';

type Point = [number, number];

const blocks = new Map<number, string>([[0, '.'], [1, '#'], [2, '$'], [3, '-'], [4, '*']]);

const maxX = 43;
const maxY = 22;

interface GameState {
    grid: HashDict<Point, number>;
    score: number;
    ballPosX: number;
    paddlePosX: number;
}

function getInput(state: GameState): number {
    const display: string[][] = [];
    for (let y = 0; y < maxY; ++y) {
        display.push(Array(maxX).fill(' '));
    }
    for (const [[x, y], v] of state.grid) {
        display[y][x] = blocks.get(v) ?? `${v}`;
    }
    console.log(display.map(row => row.join('')).join('\n'));
    console.log(state.score);
    return Math.sign(state.ballPosX - state.paddlePosX);
}

async function main() {
    const programRaw = await readAllText();
    const program = programRaw.split(',').map(Number);
    const instance = new Computer(program).getInstance();
    instance.writeMemory(0, 2);
    const dictOptions: HashDictOptions<Point, number> = { onDuplicateKeys: ResolveAction.Replace };
    const state: GameState = {
        grid: new HashDict<Point, number>(dictOptions),
        score: 0,
        ballPosX: 0,
        paddlePosX: 0,
    };
    instance.inputs = () => {
        return getInput(state);
    }
    let buf: number[] = [];
    while (true) {
        const maybeOutput = instance.runUntilOutput();
        if (maybeOutput == null) {
            break;
        }
        buf.push(maybeOutput);
        if (buf.length === 3) {
            const [x, y, value] = buf;
            if (x === -1 && y === 0) {
                state.score = value;
            } else {
                state.grid.add([[x, y], value]);
                if (value === 3) {
                    state.paddlePosX = x;
                } else if (value === 4) {
                    state.ballPosX = x;
                }
            }
            buf = [];
        }
    }
    console.log(`Game over! Final score = ${state.score}`);
}

main();
