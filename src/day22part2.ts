import { readAllLines } from './lib/ts-bootstrap';

const maxCard = 119315717514047n;
const applyTimes = 101741582076661;

interface EuclidResult {
    x: bigint;
    y: bigint;
    gcd: bigint;
}

// Returns GCD(A, B) and also X, Y that: A * X + B * Y = GCD(A, B)
function extendedGcd(a: bigint, b: bigint): EuclidResult {
    // magic
    let oldR = a;
    let r = b;
    let oldX = 1n;
    let x = 0n;
    let oldY = 0n;
    let y = 1n;
    while (r !== 0n) {
        const q = oldR / r;
        [oldR, r] = [r, oldR - q * r];
        [oldX, x] = [x, oldX - q * x];
        [oldY, y] = [y, oldY - q * y];
    }
    return {
        x: oldX,
        y: oldY,
        gcd: oldR,
    };
}

// Solve a * x = b (mod n), if GCD(a, n) == 1
function linearCongruence(a: bigint, b: bigint, n: bigint): bigint {
    const euclid = extendedGcd(a, n);
    if (euclid.gcd !== 1n) {
        throw new Error(`Unexpected GCD`);
    }
    // now we have a * x0 + n * y0 = 1 (mod n)
    // n mod n = 0, so we can get rid of the second addend: a * x0 = 1 (mod n)
    // multiply both parts by b, it becomes a * b * x0 = b (mod n)
    // then x = b * x0
    let result = euclid.x * b % n;
    if (result < 0) {
        result += n;
    }
    return result;
}

async function main() {
    const lines = await readAllLines();
    const reNewStack = /^deal into new stack$/;
    const reCut = /^cut (-?\d+)$/;
    const reIncrement = /^deal with increment (\d+)$/;
    let mult = 1n;
    let add = 0n;
    for (const line of lines) {
        if (reNewStack.test(line)) {
            mult = mult * -1n;
            add = add * -1n - 1n;
            continue;
        }
        let match = reCut.exec(line);
        if (match != null) {
            const cut = BigInt(match[1]);
            add = add - cut;
            continue;
        }
        match = reIncrement.exec(line);
        if (match != null) {
            const incr = BigInt(match[1]);
            mult = mult * incr % maxCard;
            add = add * incr % maxCard;
            continue;
        }
        throw new Error(`Unparsed: ${line}`);
    }

    let resMult = 1n;
    let resAdd = 0n;
    let times = applyTimes;
    while (times > 0) {
        if (times % 2 === 1) {
            resMult = resMult * mult % maxCard;
            resAdd = (resAdd * mult + add) % maxCard;
        }
        const newMult = mult * mult % maxCard;
        const newAdd = (add * mult + add) % maxCard;
        mult = newMult;
        add = newAdd;
        times = Math.floor(times / 2);
    }
    // resMult * x + resAdd = 2020 (mod maxCard)
    // resMult * x = 2020 - resAdd (mod maxCard)
    let a = resMult % maxCard;
    if (a < 0) {
        a += maxCard;
    }
    let b = (2020n - resAdd) % maxCard;
    if (b < 0) {
        b += maxCard;
    }
    console.log(`${a}x = ${b} mod ${maxCard}`);
    const result = linearCongruence(a, b, maxCard);
    console.log(`x = ${result}`);
}

main();
