import 'jest';
import { Moon, solve } from './day12part1.shared';

function totalEnergy(moons: Moon[]): number {
    return moons.reduce((acc, x) => acc + x.energy(), 0);
}

describe('day 12.1 tests', () => {
    test('test1', () => {
        const result = solve([[-1, 0, 2], [2, -10, -7], [4, -8, 8], [3, 5, -1]], 10);
        expect(totalEnergy(result), `${result}`).toBe(179);
    });

    test('test2', () => {
        const result = solve([[-8, -10, 0], [5, 5, 10], [2, -7, 3], [9, -8, -3]], 100);
        expect(totalEnergy(result), `${result}`).toBe(1940);
    });
});
