import { PrismaClient } from "@prisma/client";
import { Recipe } from "../types/recipe.types";

const prisma = new PrismaClient();

export class RecipeService {
    private mapToRecipe(r: any): Recipe {
        return {
            ...r,
            method: JSON.parse(r.method),
            plating: JSON.parse(r.plating),
            nutrition_notes: JSON.parse(r.nutritionNotes),
            safety_criteria: JSON.parse(r.safetyCriteria),
            servings: {
                children: r.servingsChildren,
                adults: r.servingsAdults,
            },
            ingredients: r.ingredients.map((i: any) => ({
                index: i.index,
                name: i.name,
                quantity_children: i.quantityChildren,
                quantity_adults: i.quantityAdults,
                unit: i.unit,
            })),
        };
    }

    public async getAllRecipes(): Promise<Recipe[]> {
        const recipes = await prisma.recipe.findMany({
            include: { ingredients: true },
        });
        return recipes.map(this.mapToRecipe);
    }

    public async getRecipeBySlug(slug: string): Promise<Recipe | undefined> {
        const recipe = await prisma.recipe.findUnique({
            where: { slug },
            include: { ingredients: true },
        });

        if (!recipe) return undefined;
        return this.mapToRecipe(recipe);
    }

    public async getRecipesByCategory(category: string): Promise<Recipe[]> {
        const recipes = await prisma.recipe.findMany({
            where: { category },
            include: { ingredients: true },
        });
        return recipes.map(this.mapToRecipe);
    }

    public async searchRecipes(query: string, ingredients: string[] = [], category: string = ""): Promise<Recipe[]> {
        const whereClause: any = {
            AND: [],
        };

        if (query) {
            whereClause.AND.push({
                OR: [
                    { name: { contains: query } },
                    { ingredients: { some: { name: { contains: query } } } },
                ],
            });
        }

        if (category && category !== "Todas") {
            if (category === "P") {
                // Special case for Postres: Starts with P but NOT PF
                whereClause.AND.push({
                    category: {
                        startsWith: "P",
                        not: { startsWith: "PF" }
                    }
                });
            } else {
                whereClause.AND.push({ category: { contains: category } });
            }
        }

        if (ingredients.length > 0) {
            whereClause.AND.push({
                ingredients: {
                    some: {
                        name: { in: ingredients },
                    },
                },
            });
        }

        const recipes = await prisma.recipe.findMany({
            where: whereClause,
            include: { ingredients: true },
        });
        return recipes.map(this.mapToRecipe);
    }
}
