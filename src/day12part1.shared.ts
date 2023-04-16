export type Coordinates = [number, number, number];

function sumAbs(c: Coordinates) {
    return Math.abs(c[0]) + Math.abs(c[1]) + Math.abs(c[2]);
}

export class Moon {
    constructor(
        public position: Coordinates,
        public velocity: Coordinates,
    ) { }

    energy() {
        return sumAbs(this.position) * sumAbs(this.velocity);
    }

    toString() {
        return `pos: ${this.position} vel: ${this.velocity}`;
    }
}

export function solve(moonPos: Coordinates[], steps: number): Moon[] {
    const moons = moonPos.map(pos => new Moon(pos, [0, 0, 0]));
    for (let step = 0; step < steps; ++step) {
        for (const moon of moons) {
            for (const other of moons) {
                if (moon === other) {
                    continue;
                }
                for (let i = 0; i < 3; ++i) {
                    moon.velocity[i] += Math.sign(other.position[i] - moon.position[i]);
                }
            }
        }
        for (const moon of moons) {
            for (let i = 0; i < 3; ++i) {
                moon.position[i] += moon.velocity[i];
            }
        }
    }
    return moons;
}
