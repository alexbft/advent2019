import { Coordinates, Moon, solve } from "./day12part1.shared";

function totalEnergy(moons: Moon[]): number {
    return moons.reduce((acc, x) => acc + x.energy(), 0);
}

const data: Coordinates[] = [[-7, -8, 9], [-12, -3, -4], [6, -17, -9], [4, -10, -6]];
const result = solve(data, 1000);
console.log(result);
console.log(totalEnergy(result));
