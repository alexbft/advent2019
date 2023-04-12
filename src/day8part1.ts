import { openInputFile } from './lib/ts-bootstrap';

const width = 25;
const height = 6;

async function main() {
  const inputF = await openInputFile();
  const content = (await inputF.readFile('utf8')).trim();
  const layers: number[][] = [];
  const size = width * height;
  for (let i = 0; i < content.length; i += size) {
    layers.push(content.substring(i, i + size).split('').map(Number));
  }
  let minZeroes = 99999;
  let minLayer: number[] | undefined;
  for (const layer of layers) {
    const zeroes = layer.reduce((acc, x) => x === 0 ? acc + 1 : acc, 0);
    if (zeroes < minZeroes) {
      minZeroes = zeroes;
      minLayer = layer;
    }
  }
  const ones = minLayer!.reduce((acc, x) => x === 1 ? acc + 1 : acc, 0);
  const twos = minLayer!.reduce((acc, x) => x === 2 ? acc + 1 : acc, 0);
  console.log(ones, twos, ones * twos);
}

main();
