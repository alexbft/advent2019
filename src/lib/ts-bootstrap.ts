import { open } from 'node:fs/promises';
import path from 'path';

export function openInputFile() {
  let fName = process.argv[2];
  if (fName == null) {
    fName = path.basename(process.argv[1], '.ts');
    fName = fName.replace(/part(1|2)/, '') + '.txt';
  }
  const fullName = path.resolve(path.dirname(process.argv[1]), '../resources', fName);
  return open(fullName);
}

export async function readAllLines() {
  const fInput = await openInputFile();
  try {
    return (await fInput.readFile('utf8')).trimEnd().split(/\r?\n/);
  } finally {
    await fInput.close();
  }
}
