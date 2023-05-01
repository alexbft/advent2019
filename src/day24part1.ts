import { readAllLines } from './lib/ts-bootstrap';

function nextState(state: number): number {
    function getBug(x: number, y: number): number {
        if (x < 0 || y < 0 || x >= 5 || y >= 5) {
            return 0;
        }
        return (state & (1 << (y * 5 + x))) !== 0 ? 1 : 0;
    }
    let result = 0;
    for (let i = 0; i < 25; ++i) {
        const x = i % 5;
        const y = Math.floor(i / 5);
        const adjacentSum = getBug(x - 1, y) + getBug(x + 1, y) + getBug(x, y - 1) + getBug(x, y + 1);
        const hasBug = (state & (1 << i)) !== 0;
        const newBug = hasBug ? adjacentSum === 1 : adjacentSum === 1 || adjacentSum === 2;
        if (newBug) {
            result += (1 << i);
        }
    }
    return result;
}

async function main() {
    const input = (await readAllLines()).join('');
    if (input.length !== 25) {
        throw new Error(`Invalid input`);
    }
    let state = 0;
    for (let i = 0; i < 25; ++i) {
        if (input[i] === '#') {
            state += (1 << i);
        }
    }
    const states = new Set<number>();
    while (!states.has(state)) {
        states.add(state);
        state = nextState(state);
    }
    console.log(state);
}

main();
