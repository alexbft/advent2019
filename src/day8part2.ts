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
  const result: number[] = [];
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      let pixel = 2;
      const pos = y * width + x;
      for (let layer = 0; layer < layers.length; ++layer) {
        if (pixel === 2 && layers[layer][pos] !== 2) {
          pixel = layers[layer][pos];
        }
      }
      result.push(pixel);
    }
  }
  let outputS = '';
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const pos = y * width + x;
      outputS += result[pos] === 1 ? 'O' : '.';
    }
    outputS += '\n';
  }
  console.log(outputS);
}

main();
