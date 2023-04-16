import 'jest';
import { solve } from './day12part2.shared';

describe('day 12.2 tests', () => {
    test('test1', () => {
        const result = solve([[-1, 0, 2], [2, -10, -7], [4, -8, 8], [3, 5, -1]]);
        expect(result).toBe(2772);
    });

    test('test2', () => {
        const result = solve([[-8, -10, 0], [5, 5, 10], [2, -7, 3], [9, -8, -3]]);
        expect(result).toBe(4686774924);
    });
});
