import { openInputFile } from './lib/ts-bootstrap';

function addEdge(map: Map<string, string[]>, vFrom: string, vTo: string) {
  let edgeList = map.get(vFrom);
  if (edgeList == null) {
    edgeList = [];
    map.set(vFrom, edgeList);
  }
  edgeList.push(vTo);
}

async function main() {
  const f = await openInputFile();
  const edges = new Map<string, string[]>();
  for await (const line of f.readLines()) {
    const [vFrom, vTo] = line.split(')');
    addEdge(edges, vFrom, vTo);
    addEdge(edges, vTo, vFrom);
  }
  const dist = new Map<string, number>();
  const queue = ['YOU'];
  dist.set(queue[0], 0);
  while (queue.length > 0) {
    const cur = queue.shift()!;
    const curDist = dist.get(cur)!;
    for (const edge of edges.get(cur)!) {
      if (dist.has(edge)) {
        continue;
      }
      dist.set(edge, curDist + 1);
      queue.push(edge);
    }
  }
  const result = dist.get('SAN')! - 2;
  console.log(result);
}

main();
