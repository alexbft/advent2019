import 'jest';
import { fft } from './day16part2.shared';

function digits(s: string): number[] {
    return s.split('').map(Number);
}

function input(s: string): number[] {
    const part = digits(s);
    const result: number[] = [];
    for (let i = 0; i < 10000; ++i) {
        result.push(...part);
    }
    return result;
}

describe('day 16.2 tests', () => {
    test('test1', () => {
        expect(fft(input('03036732577212944063491565474664'), 100)).toEqual(digits('84462026'));
    });

    test('test2', () => {
        expect(fft(input('02935109699940807407585447034323'), 100)).toEqual(digits('78725270'));
    });

    test('test3', () => {
        expect(fft(input('03081770884921959731165446850517'), 100)).toEqual(digits('53553731'));
    });
});
