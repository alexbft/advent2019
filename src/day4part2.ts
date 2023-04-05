const inputRaw = '134792-675810';

function isValid(x: number): boolean {
  const digits: number[] = [];
  while (x > 0) {
    digits.push(x % 10);
    x = (x / 10) | 0;
  }
  digits.reverse();
  let hasDouble = false;
  for (let i = 0; i < digits.length - 1; ++i) {
    if (digits[i + 1] < digits[i]) {
      return false;
    }
    if (digits[i + 1] === digits[i] && (i === 0 || digits[i] !== digits[i - 1]) && (i + 2 === digits.length || digits[i] !== digits[i + 2])) {
      hasDouble = true;
    }
  }
  return hasDouble;
}

const [rangeMin, rangeMax] = inputRaw.split('-').map(Number);

let result = 0;
for (let i = rangeMin; i <= rangeMax; ++i) {
  if (isValid(i)) {
    ++result;
  }
}

console.log(result);
