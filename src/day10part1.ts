import { readAllLines } from "./lib/ts-bootstrap";

const eps = 1e-8;

function solve(grid: string[]): [number, number, number] {
    const w = grid[0].length;
    const h = grid.length;
    let resX = 0;
    let resY = 0;
    let maxUniq = 0;
    for (let y0 = 0; y0 < h; ++y0) {
        for (let x0 = 0; x0 < w; ++x0) {
            if (grid[y0][x0] !== '#') {
                continue;
            }
            const angles: number[] = [];
            for (let y = 0; y < h; ++y) {
                for (let x = 0; x < w; ++x) {
                    if (x === x0 && y === y0 || grid[y][x] !== '#') {
                        continue;
                    }
                    const angle = Math.atan2(y - y0, x - x0);
                    angles.push(angle);
                }
            }
            angles.sort();
            let prev = -9999;
            let uniq = 0;
            for (const angle of angles) {
                if (Math.abs(prev - angle) > eps) {
                    uniq += 1;
                }
                prev = angle;
            }
            if (uniq > maxUniq) {
                maxUniq = uniq;
                resX = x0;
                resY = y0;
            }
        }
    }
    return [resX, resY, maxUniq];
}

async function main() {
    const lines = await readAllLines();
    const cases = lines.join('\n').split('\n\n').map(block => block.split('\n'));
    for (const c of cases) {
        const result = solve(c);
        console.log(c.join('\n'));
        console.log(result);
    }
}

main();
