
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function analyzeRefinement() {
    console.log("--- Categories starting with P ---");
    const pCategories = await prisma.recipe.groupBy({
        by: ['category'],
        where: {
            category: {
                startsWith: 'P'
            }
        },
        _count: { category: true }
    });
    console.log(pCategories);

    console.log("\n--- Ingredients containing 'Carne' or 'Pollo' or 'Res' ---");
    const proteins = await prisma.ingredient.groupBy({
        by: ['name'],
        where: {
            OR: [
                { name: { contains: 'Carne' } },
                { name: { contains: 'Pollo' } },
                { name: { contains: 'Res' } },
                { name: { contains: 'Pescado' } },
                { name: { contains: 'Atún' } }
            ]
        },
        _count: { name: true },
        orderBy: { _count: { name: 'desc' } }
    });
    console.log(proteins);
}

analyzeRefinement()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
