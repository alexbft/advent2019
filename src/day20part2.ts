import { readAllLines } from './lib/ts-bootstrap';

type Point = [number, number];
type Point3d = [number, number, number];

interface Cell {
    isPassable: boolean;
    portalId?: string;
}

interface Cell2 {
    isPassable: boolean;
    portal?: Point;
}

interface QueueItem {
    point: Point3d;
    dist: number;
}

class Grid<T> {
    public readonly width: number;
    public readonly height: number;

    constructor(public readonly cells: ReadonlyArray<ReadonlyArray<T>>) {
        this.width = this.cells[0].length;
        this.height = this.cells.length;
    }

    get([x, y]: Point): T | undefined {
        if (this.isInside(x, y)) {
            return this.cells[y][x];
        }
    }

    isInside(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    map<U>(mapFn: (p: Point, value: T) => U): Grid<U> {
        const result: U[][] = [];
        for (let y = 0; y < this.height; ++y) {
            const row: U[] = [];
            for (let x = 0; x < this.width; ++x) {
                const mapped = mapFn([x, y], this.cells[y][x]);
                row.push(mapped);
            }
            result.push(row);
        }
        return new Grid(result);
    }

    forEach(forEachFn: (p: Point, value: T) => void) {
        this.map(forEachFn);
    }
}

function isLetter(c: string) {
    return c >= 'A' && c <= 'Z';
}

function pEqual([x1, y1]: Point, [x2, y2]: Point): boolean {
    return x1 === x2 && y1 === y2;
}

function keyOf(p: Point3d): string {
    return `${p[0]},${p[1]},${p[2]}`;
}

const dirs: Point[] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

async function main() {
    const rows = await readAllLines();
    const rawGrid = new Grid(rows.map(row => row.split('')));
    const grid = rawGrid.map<Cell>(([x, y], c) => {
        if (c !== '.') {
            return {
                isPassable: false,
            };
        }
        let portal: string | undefined;
        if (isLetter(rawGrid.get([x, y - 1])!)) {
            portal = `${rawGrid.get([x, y - 2])}${rawGrid.get([x, y - 1])}`;
        } else if (isLetter(rawGrid.get([x + 1, y])!)) {
            portal = `${rawGrid.get([x + 1, y])}${rawGrid.get([x + 2, y])}`;
        } else if (isLetter(rawGrid.get([x, y + 1])!)) {
            portal = `${rawGrid.get([x, y + 1])}${rawGrid.get([x, y + 2])}`;
        } else if (isLetter(rawGrid.get([x - 1, y])!)) {
            portal = `${rawGrid.get([x - 2, y])}${rawGrid.get([x - 1, y])}`;
        }
        return {
            isPassable: true,
            portalId: portal,
        };
    });
    const portalMap = new Map<string, Point[]>();
    grid.forEach((p, c) => {
        if (c.portalId != null) {
            portalMap.set(c.portalId, [...(portalMap.get(c.portalId) ?? []), p]);
        }
    });
    const grid2 = grid.map<Cell2>((p, c) => {
        if (c.portalId == null) {
            return { isPassable: c.isPassable };
        }
        const portalAllPoints = portalMap.get(c.portalId)!;
        const maybePortalOther = portalAllPoints.find(p2 => !pEqual(p, p2));
        return { isPassable: c.isPassable, portal: maybePortalOther };
    });
    const aa = portalMap.get('AA')!;
    if (aa.length !== 1) {
        throw new Error(`Invalid input (AA)`);
    }
    const [ax, ay] = aa[0];
    const zz = portalMap.get('ZZ')!;
    if (zz.length !== 1) {
        throw new Error(`Invalid input (ZZ)`);
    }
    const [zx, zy] = zz[0];
    const queue: QueueItem[] = [{ point: [ax, ay, 0], dist: 0 }];
    const visited = new Set<string>();
    visited.add(keyOf(queue[0].point));
    const maxZ = 100;
    let result = -1;
    while (queue.length > 0) {
        const { point: curP, dist: curDist } = queue.shift()!;
        const [curX, curY, curZ] = curP;
        if (curX === zx && curY === zy && curZ === 0) {
            result = curDist;
            break;
        }
        const curCell = grid2.get([curX, curY])!;
        const moves: Point3d[] = dirs.map(([dx, dy]) => [curX + dx, curY + dy, curZ]);
        if (curCell.portal != null) {
            const isOuter = curX === 2 || curX === grid2.width - 3 || curY === 2 || curY === grid2.height - 3;
            const portalZ = isOuter ? curZ - 1 : curZ + 1;
            if (portalZ >= 0 && portalZ <= maxZ) {
                moves.push([curCell.portal[0], curCell.portal[1], portalZ]);
            }
        }
        for (const [nx, ny, nz] of moves) {
            const nCell = grid2.get([nx, ny]);
            if (nCell == null || !nCell.isPassable) {
                continue;
            }
            const nKey = keyOf([nx, ny, nz]);
            if (visited.has(nKey)) {
                continue;
            }
            queue.push({ point: [nx, ny, nz], dist: curDist + 1 });
            visited.add(nKey);
        }
    }
    console.log(result);
}

main();
