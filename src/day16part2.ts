import { fft } from './day16part2.shared';
import { readAllText } from './lib/ts-bootstrap';

function input(s: string): number[] {
    const part = s.split('').map(Number);
    const result: number[] = [];
    for (let i = 0; i < 10000; ++i) {
        result.push(...part);
    }
    return result;
}

async function main() {
    const digitsRaw = await readAllText();
    const digits = input(digitsRaw);
    const result = fft(digits, 100);
    console.log(result.join(''));
}

main();
