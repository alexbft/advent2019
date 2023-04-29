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

export async function readAllText() {
    const fInput = await openInputFile();
    try {
        let result = await fInput.readFile('utf-8');
        if (result.endsWith('\r\n')) {
            result = result.substring(0, result.length - 2);
        } else if (result.endsWith('\n')) {
            result = result.substring(0, result.length - 1);
        }
        return result;
    } finally {
        await fInput.close();
    }
}

export async function readAllLines() {
    const text = await readAllText();
    return text.split(/\r?\n/);
}
