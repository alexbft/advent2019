import { Computer, ComputerInstance } from './day21/intcode';
import { readAllText } from './lib/ts-bootstrap';

interface NetworkMember {
    ip: number;
    cpu: ComputerInstance;
    inputBuffer: number[];
    outputBuffer: number[];
}

function inputFunc(buffer: number[]) {
    return () => buffer.length === 0 ? -1 : buffer.shift()!;
}

async function main() {
    const program = (await readAllText()).split(',').map(Number);
    const computer = new Computer(program);
    const network: NetworkMember[] = [];
    for (let i = 0; i < 50; ++i) {
        const member: NetworkMember = {
            ip: i,
            cpu: computer.getInstance(),
            inputBuffer: [i],
            outputBuffer: [],
        };
        member.cpu.inputs = inputFunc(member.inputBuffer);
        network.push(member);
    }
    let result: number;
    outer: while (true) {
        for (let i = 0; i < 50; ++i) {
            const executeResult = network[i].cpu.executeNextInstruction();
            if (executeResult.output != null) {
                const outputBuffer = network[i].outputBuffer;
                outputBuffer.push(executeResult.output);
                if (outputBuffer.length == 3) {
                    const [addr, x, y] = outputBuffer;
                    if (addr === 255) {
                        result = y;
                        break outer;
                    }
                    network[addr].inputBuffer.push(x, y);
                    network[i].outputBuffer = [];
                }
            }
        }
    }
    console.log(result);
}

main();
