import { PrismaClient } from "@prisma/client";
import recipesData from "../data/recipes_structured.json";

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding...");

    for (const r of recipesData) {
        // Parse quantities which might be strings/dates in the JSON
        const ingredients = r.ingredients.map((ing: any) => {
            let qChild = parseFloat(ing.quantity_children);
            let qAdult = parseFloat(ing.quantity_adults);

            if (isNaN(qChild)) qChild = 0;
            if (isNaN(qAdult)) qAdult = 0;

            return {
                index: ing.index,
                name: ing.name,
                quantityChildren: qChild,
                quantityAdults: qAdult,
                unit: ing.unit || "",
            };
        });

        await prisma.recipe.upsert({
            where: { slug: r.slug },
            update: {},
            create: {
                id: r.id,
                slug: r.slug,
                name: r.name,
                category: r.category,
                group: r.group,
                sheet: r.sheet,
                code: r.code,
                servingsChildren: r.servings?.children || 1,
                servingsAdults: r.servings?.adults || 1,
                method: JSON.stringify(r.method || []),
                plating: JSON.stringify(r.plating || []),
                nutritionNotes: JSON.stringify(r.nutrition_notes || []),
                safetyCriteria: JSON.stringify(r.safety_criteria || []),
                ingredients: {
                    create: ingredients,
                },
            },
        });
    }

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
