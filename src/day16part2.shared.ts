function fft_internal(digits: number[]): number[] {
    const sums: number[] = [0];
    let sum = 0;
    for (const digit of digits) {
        sum += digit;
        sums.push(sum);
    }
    const result: number[] = [];
    const len = digits.length;
    for (let i = 0; i < len; ++i) {
        let elem = 0;
        const scale = i + 1;
        let index = -1;
        while (true) {
            // 0
            {
                index += scale;
                if (index >= len) {
                    break;
                }
            }
            // 1
            {
                const rangeEnd = Math.min(index + scale, len);
                elem += (sums[rangeEnd] - sums[index]);
                index += scale;
                if (index >= len) {
                    break;
                }
            }
            // 0
            {
                index += scale;
                if (index >= len) {
                    break;
                }
            }
            // -1
            {
                const rangeEnd = Math.min(index + scale, len);
                elem -= (sums[rangeEnd] - sums[index]);
                index += scale;
                if (index >= len) {
                    break;
                }
            }
        }
        result.push(Math.abs(elem % 10));
    }
    return result;
}

export function fft(digits: number[], times: number): number[] {
    let result = digits;
    for (let i = 0; i < times; ++i) {
        console.log(`Iter ${i}`);
        result = fft_internal(result);
    }
    const targetIndex = Number(digits.slice(0, 7).join(''));
    return result.slice(targetIndex, targetIndex + 8);
}
