import { getInputFileName, readAllLines } from './lib/ts-bootstrap';

interface State {
    plus: number[];
    minus: number[];
}

function getBug(state: State, x: number, y: number, z: number): number {
    let plane: number;
    if (z >= 0) {
        if (z >= state.plus.length) {
            return 0;
        }
        plane = state.plus[z];
    } else {
        let zz = (-z) - 1;
        if (zz >= state.minus.length) {
            return 0;
        }
        plane = state.minus[zz];
    }
    const pos = y * 5 + x;
    return (plane & (1 << pos)) !== 0 ? 1 : 0;
}

function calcPlane(state: State, z: number): number {
    let result = 0;
    for (let i = 0; i < 25; ++i) {
        const x = i % 5;
        const y = Math.floor(i / 5);
        if (x === 2 && y === 2) {
            continue;
        }
        let sum = 0;
        // left
        if (x === 0) {
            sum += getBug(state, 1, 2, z - 1);
        } else if (x === 3 && y === 2) {
            for (let i = 0; i < 5; ++i) {
                sum += getBug(state, 4, i, z + 1);
            }
        } else {
            sum += getBug(state, x - 1, y, z);
        }
        // right
        if (x === 4) {
            sum += getBug(state, 3, 2, z - 1);
        } else if (x === 1 && y === 2) {
            for (let i = 0; i < 5; ++i) {
                sum += getBug(state, 0, i, z + 1);
            }
        } else {
            sum += getBug(state, x + 1, y, z);
        }
        // up
        if (y === 0) {
            sum += getBug(state, 2, 1, z - 1);
        } else if (y === 3 && x === 2) {
            for (let i = 0; i < 5; ++i) {
                sum += getBug(state, i, 4, z + 1);
            }
        } else {
            sum += getBug(state, x, y - 1, z);
        }
        // down
        if (y === 4) {
            sum += getBug(state, 2, 3, z - 1);
        } else if (y === 1 && x === 2) {
            for (let i = 0; i < 5; ++i) {
                sum += getBug(state, i, 0, z + 1);
            }
        } else {
            sum += getBug(state, x, y + 1, z);
        }
        const hasBug = getBug(state, x, y, z) === 1;
        const newBug = hasBug ? sum === 1 : sum === 1 || sum === 2;
        if (newBug) {
            result += (1 << i);
        }
    }
    return result;
}

function nextState(state: State): State {
    const minZ = -(state.minus.length + 1);
    const maxZ = state.plus.length;
    let nextMinus: number[] = [];
    let nextPlus: number[] = [];
    for (let z = -1; z >= minZ; --z) {
        nextMinus.push(calcPlane(state, z));
    }
    for (let z = 0; z <= maxZ; ++z) {
        nextPlus.push(calcPlane(state, z));
    }
    while (nextMinus.length > 0 && nextMinus[nextMinus.length - 1] === 0) {
        nextMinus = nextMinus.slice(0, nextMinus.length - 1);
    }
    while (nextPlus.length > 0 && nextPlus[nextPlus.length - 1] === 0) {
        nextPlus = nextPlus.slice(0, nextPlus.length - 1);
    }
    return { plus: nextPlus, minus: nextMinus };
}

function countBits(x: number): number {
    let result = 0;
    while (x > 0) {
        if ((x & 1) === 1) {
            result += 1;
        }
        x = x >> 1;
    }
    return result;
}

async function main() {
    const input = (await readAllLines()).join('');
    if (input.length !== 25) {
        throw new Error(`Invalid input`);
    }
    let plane = 0;
    for (let i = 0; i < 25; ++i) {
        if (input[i] === '#') {
            plane += (1 << i);
        }
    }
    let state: State = { plus: [plane], minus: [] };
    const turns = getInputFileName().includes('test') ? 10 : 200;
    for (let turn = 0; turn < turns; ++turn) {
        state = nextState(state);
    }
    //console.log(state);
    let count = 0;
    for (const plane of state.plus) {
        count += countBits(plane);
    }
    for (const plane of state.minus) {
        count += countBits(plane);
    }
    console.log(count);
}

main();
