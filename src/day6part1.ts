import { openInputFile } from './lib/ts-bootstrap';

function rec(map: Map<string, string[]>, vCur: string, orbitsCur: number): number {
  const edgeList = map.get(vCur) ?? [];
  let result = orbitsCur;
  for (const edge of edgeList) {
    result += rec(map, edge, orbitsCur + 1);
  }
  return result;
}

async function main() {
  const f = await openInputFile();
  const edges = new Map<string, string[]>();
  for await (const line of f.readLines()) {
    const [vFrom, vTo] = line.split(')');
    const edgeList = edges.get(vFrom) ?? [];
    edgeList.push(vTo);
    edges.set(vFrom, edgeList);
  }
  const result = rec(edges, 'COM', 0);
  console.log(result);
}

main();
