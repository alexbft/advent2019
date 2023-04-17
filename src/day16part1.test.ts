import 'jest';
import { fft } from './day16part1.shared';

function digits(s: string): number[] {
    return s.split('').map(Number);
}

describe('day 16.1 tests', () => {
    test('test1 iter1', () => {
        expect(fft(digits('12345678'), 1)).toEqual(digits('48226158'));
    });

    test('test1 iter2', () => {
        expect(fft(digits('12345678'), 2)).toEqual(digits('34040438'));
    });

    test('test1 iter3', () => {
        expect(fft(digits('12345678'), 3)).toEqual(digits('03415518'));
    });

    test('test1 iter4', () => {
        expect(fft(digits('12345678'), 4)).toEqual(digits('01029498'));
    });

    test('test2', () => {
        const result = fft(digits('80871224585914546619083218645595'), 100).slice(0, 8);
        expect(result).toEqual(digits('24176176'));
    });

    test('test3', () => {
        const result = fft(digits('19617804207202209144916044189917'), 100).slice(0, 8);
        expect(result).toEqual(digits('73745418'));
    });

    test('test4', () => {
        const result = fft(digits('69317163492948606335995924319873'), 100).slice(0, 8);
        expect(result).toEqual(digits('52432133'));
    });
});
