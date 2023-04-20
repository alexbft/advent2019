import { Computer, inputFromArray } from './day11/intcode';
import { readAllText } from './lib/ts-bootstrap';

const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

class FloorMap {
    public readonly width: number;
    public readonly height: number;
    private readonly cells: string[][];

    constructor(charMap: string[]) {
        this.cells = charMap.map(row => row.split(''));
        this.width = charMap[0].length;
        this.height = charMap.length;
    }

    get(x: number, y: number): string {
        if (this.isInside(x, y)) {
            return this.cells[y][x];
        }
        return '?';
    }

    set(x: number, y: number, v: string) {
        this.cells[y][x] = v;
    }

    isInside(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    scaffoldNeighborsCount(x: number, y: number): number {
        let result = 0;
        for (const [dx, dy] of dirs) {
            if (this.get(x + dx, y + dy) === '#') {
                ++result;
            }
        }
        return result;
    }

    dump(): string {
        return this.cells.map(row => row.join('')).join('\n');
    }
}

async function main() {
    const programRaw = await readAllText();
    const program = programRaw.split(',').map(Number);
    const output = new Computer(program).run(inputFromArray([]));
    const mapChars = output.map(x => String.fromCharCode(x)).join('').split('\n');
    const map = new FloorMap(mapChars);
    let result = 0;
    for (let y = 0; y < map.height; ++y) {
        for (let x = 0; x < map.width; ++x) {
            if (map.get(x, y) === '#' && map.scaffoldNeighborsCount(x, y) >= 3) {
                map.set(x, y, 'O');
                result += x * y;
            }
        }
    }
    console.log(map.dump());
    console.log(result);
}

main();
