import { getInputFileName, readAllLines } from './lib/ts-bootstrap';

const isTest = getInputFileName().includes('test');
const maxCard = isTest ? 10 : 10007;

async function main() {
    const lines = await readAllLines();
    const reNewStack = /^deal into new stack$/;
    const reCut = /^cut (-?\d+)$/;
    const reIncrement = /^deal with increment (\d+)$/;
    let cards: number[] = [];
    for (let i = 0; i < maxCard; ++i) {
        cards.push(i);
    }
    for (const line of lines) {
        if (reNewStack.test(line)) {
            cards.reverse();
            continue;
        }
        let match = reCut.exec(line);
        if (match != null) {
            const cut = Number(match[1]);
            cards = [...cards.slice(cut), ...cards.slice(0, cut)];
            continue;
        }
        match = reIncrement.exec(line);
        if (match != null) {
            const incr = Number(match[1]);
            const newCards = Array<number>(maxCard);
            let index = 0;
            for (const card of cards) {
                newCards[index % maxCard] = card;
                index += incr;
            }
            cards = newCards;
            continue;
        }
        throw new Error(`Unparsed: ${line}`);
    }
    if (isTest) {
        console.log(cards.join(' '));
    } else {
        console.log(cards.indexOf(2019));
    }
}

main();
