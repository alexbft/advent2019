import { Computer, ComputerInstance } from './day21/intcode';
import { readAllText } from './lib/ts-bootstrap';

interface NetworkMember {
    ip: number;
    cpu: ComputerInstance;
    inputBuffer: number[];
    outputBuffer: number[];
    isIdle: boolean;
}

function inputFunc(member: NetworkMember) {
    return () => {
        member.isIdle = member.outputBuffer.length === 0 && member.inputBuffer.length === 0;
        return member.inputBuffer.length === 0 ? -1 : member.inputBuffer.shift()!;
    }
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
            isIdle: false,
        };
        member.cpu.inputs = inputFunc(member);
        network.push(member);
    }
    let savedX: number = -1;
    let savedY: number = -1;
    let lastSentY: number = -1;
    while (true) {
        for (let i = 0; i < 50; ++i) {
            const executeResult = network[i].cpu.executeNextInstruction();
            if (executeResult.output != null) {
                const outputBuffer = network[i].outputBuffer;
                outputBuffer.push(executeResult.output);
                if (outputBuffer.length == 3) {
                    const [addr, x, y] = outputBuffer;
                    //console.log(`${i} -> ${addr}: ${x} ${y}`);
                    if (addr === 255) {
                        savedX = x;
                        savedY = y;
                    } else {
                        network[addr].inputBuffer.push(x, y);
                        network[addr].isIdle = false;
                    }
                    network[i].outputBuffer = [];
                }
            }
        }
        if (savedY !== -1 && network.every(member => member.isIdle)) {
            //console.log(`ALL IDLE! Sending ${savedX} ${savedY} to {0}`);
            network[0].inputBuffer.push(savedX, savedY);
            network[0].isIdle = false;
            if (savedY === lastSentY) {
                break;
            }
            lastSentY = savedY;
        }
    }
    console.log(lastSentY);
}

main();
