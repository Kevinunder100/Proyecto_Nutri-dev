
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function analyzeData() {
    console.log("--- Categories ---");
    const categories = await prisma.recipe.groupBy({
        by: ['category'],
        _count: {
            category: true,
        },
    });
    console.log(categories);

    console.log("\n--- Top Ingredients ---");
    const ingredients = await prisma.ingredient.groupBy({
        by: ['name'],
        _count: {
            name: true,
        },
        orderBy: {
            _count: {
                name: 'desc',
            },
        },
        take: 20,
    });
    console.log(ingredients);
}

analyzeData()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
