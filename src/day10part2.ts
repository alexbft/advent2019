import { readAllLines } from "./lib/ts-bootstrap";

const eps = 1e-8;
const startAngle = -Math.PI / 2;

type Ray = { x: number, y: number, angle: number, dist: number };

function solve(grid: string[]): Ray {
    const w = grid[0].length;
    const h = grid.length;
    let resX = 0;
    let resY = 0;
    let maxUniq = 0;
    let resRays: Ray[] = [];
    for (let y0 = 0; y0 < h; ++y0) {
        for (let x0 = 0; x0 < w; ++x0) {
            if (grid[y0][x0] !== '#') {
                continue;
            }
            const rays: Ray[] = [];
            for (let y = 0; y < h; ++y) {
                for (let x = 0; x < w; ++x) {
                    if (x === x0 && y === y0 || grid[y][x] !== '#') {
                        continue;
                    }
                    const dx = x - x0;
                    const dy = y - y0;
                    let angle = Math.atan2(dy, dx) - startAngle;
                    if (angle < 0) {
                        angle += 2 * Math.PI;
                    }
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    rays.push({ x, y, angle, dist });
                }
            }
            rays.sort(({ angle: angle1, dist: dist1 }, { angle: angle2, dist: dist2 }) => {
                if (Math.abs(angle1 - angle2) < eps) {
                    return dist1 - dist2;
                }
                return angle1 - angle2;
            });
            let prev = -9999;
            let uniq = 0;
            for (const { angle } of rays) {
                if (Math.abs(prev - angle) >= eps) {
                    uniq += 1;
                }
                prev = angle;
            }
            if (uniq > maxUniq) {
                maxUniq = uniq;
                resX = x0;
                resY = y0;
                resRays = rays;
            }
        }
    }
    console.log(`Station at ${resX} ${resY}`);
    let prev = -9999;
    let index = 0;
    let ctr = 0;
    let thisRound = [...resRays];
    let nextRound: Ray[] = [];
    while (true) {
        const ray = thisRound[index];
        if (Math.abs(prev - ray.angle) < eps) {
            nextRound.push(ray);
        } else {
            ++ctr;
            //console.log(ctr, ray.x, ray.y);
            if (ctr === 200) {
                return ray;
            }
        }
        prev = ray.angle;
        ++index;
        if (index >= thisRound.length) {
            index = 0;
            thisRound = nextRound;
            nextRound = [];
            prev = -9999;
        }
    }
}

async function main() {
    const lines = await readAllLines();
    const cases = lines.join('\n').split('\n\n').map(block => block.split('\n'));
    for (const c of cases) {
        const result = solve(c);
        console.log(c.join('\n'));
        console.log(result);
        console.log(result.x * 100 + result.y);
    }
}

main();
