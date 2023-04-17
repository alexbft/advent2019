import { fft } from './day16part1.shared';
import { readAllText } from './lib/ts-bootstrap';

async function main() {
    const digitsRaw = await readAllText();
    const digits = digitsRaw.split('').map(Number);
    const result = fft(digits, 100).slice(0, 8);
    console.log(result.join(''));
}

main();
