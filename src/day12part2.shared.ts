import { HashIndex } from 'scl';

export type Coordinates = [number, number, number];

export class MoonProjection {
    constructor(
        public position: number,
        public velocity: number,
    ) { }

    toString() {
        return `pos: ${this.position} vel: ${this.velocity}`;
    }
}

function keyOf(moons: MoonProjection[]): number[] {
    return moons.flatMap(moon => [moon.position, moon.velocity]);
}

function solveProjection(moonPos: number[]): number {
    const moons = moonPos.map(pos => new MoonProjection(pos, 0));
    const states = new HashIndex<number[]>();
    const key = keyOf(moons);
    states.add(key);
    for (let step = 0; ; ++step) {
        for (const moon of moons) {
            for (const other of moons) {
                if (moon === other) {
                    continue;
                }
                moon.velocity += Math.sign(other.position - moon.position);
            }
        }
        for (const moon of moons) {
            moon.position += moon.velocity;
        }
        const key = keyOf(moons);
        if (states.has(key)) {
            return step + 1;
        }
    }
}

function gcd(x: number, y: number): number {
    while (x > 0) {
        [x, y] = [y % x, x];
    }
    return y;
}

function lcm(x: number, y: number): number {
    return x * y / gcd(x, y);
}

export function solve(moonPos: Coordinates[]): number {
    const results: number[] = [];
    for (let i = 0; i < 3; ++i) {
        results.push(solveProjection(moonPos.map(pos => pos[i])));
    }
    console.log(results);
    return lcm(lcm(results[0], results[1]), results[2]);
}
