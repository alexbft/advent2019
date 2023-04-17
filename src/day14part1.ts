import { readAllLines } from './lib/ts-bootstrap';

interface Item {
    name: string;
    quantity: number;
}

interface Recipe {
    product: Item;
    ingredients: Item[];
}

function parseItem(s: string): Item {
    const [qRaw, name] = s.split(' ');
    return { name, quantity: Number(qRaw) };
}

function fillRec(allIngredients: Map<string, Set<string>>, recipes: Map<string, Recipe>) {
    function getAll(product: string): Set<string> {
        let result = allIngredients.get(product);
        if (result != null) {
            return result;
        }
        result = new Set<string>();
        const recipe = recipes.get(product)!;
        for (const ingredient of recipe.ingredients) {
            result.add(ingredient.name);
            for (const subIngredient of getAll(ingredient.name)) {
                result.add(subIngredient);
            }
        }
        allIngredients.set(product, result);
        return result;
    }
    allIngredients.set('ORE', new Set());
    for (const product of recipes.keys()) {
        getAll(product);
    }
}

async function main() {
    const recipes = new Map<string, Recipe>();
    for (const line of await readAllLines()) {
        const [ingredientsRaw, productRaw] = line.split(' => ');
        const ingredients = ingredientsRaw.split(', ').map(parseItem);
        const product = parseItem(productRaw);
        recipes.set(product.name, { product, ingredients });
    }
    const allIngredients = new Map<string, Set<string>>();
    fillRec(allIngredients, recipes);
    const itemsToMake: Item[] = [{ name: 'FUEL', quantity: 1 }];
    while (true) {
        let selectedItem: Item | undefined;
        for (const item of itemsToMake) {
            if (itemsToMake.every(otherItem => {
                if (item === otherItem) {
                    return true;
                }
                const ingredients = allIngredients.get(otherItem.name)!;
                return !ingredients.has(item.name);
            })) {
                selectedItem = item;
                break;
            }
        }
        if (selectedItem == null) {
            throw new Error('can`t find next item');
        }
        if (selectedItem.name === 'ORE') {
            break;
        }
        const recipe = recipes.get(selectedItem.name)!;
        const portions = Math.ceil(selectedItem.quantity / recipe.product.quantity);
        itemsToMake.splice(itemsToMake.indexOf(selectedItem), 1);
        for (const ingredient of recipe.ingredients) {
            let added = false;
            for (const item of itemsToMake) {
                if (item.name === ingredient.name) {
                    item.quantity += ingredient.quantity * portions;
                    added = true;
                    break;
                }
            }
            if (!added) {
                itemsToMake.push({ name: ingredient.name, quantity: ingredient.quantity * portions });
            }
        }
    }
    if (itemsToMake.length !== 1) {
        throw new Error(`Can't make items: ${itemsToMake}`);
    }
    console.log(itemsToMake[0].quantity);
}

main();
