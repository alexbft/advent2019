const factors = [0, 1, 0, -1];

function fft_internal(digits: number[]): number[] {
    const result: number[] = [];
    for (let i = 0; i < digits.length; ++i) {
        let elem = 0;
        for (let j = 0; j < digits.length; ++j) {
            const digit = digits[j];
            const factorIndex = Math.floor((j + 1) / (i + 1));
            const factor = factors[factorIndex % factors.length];
            elem += digit * factor;
        }
        result.push(Math.abs(elem % 10));
    }
    return result;
}

export function fft(digits: number[], times: number): number[] {
    let result = digits;
    for (let i = 0; i < times; ++i) {
        result = fft_internal(result);
    }
    return result;
}
