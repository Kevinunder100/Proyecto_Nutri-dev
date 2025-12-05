import { Request, Response } from "express";
import { RecipeService } from "../services/recipe.service";

const recipeService = new RecipeService();

export class RecipeController {
    /**
     * Handler for getting all recipes.
     * Supports optional query param 'category'.
     */
    public getRecipes = async (req: Request, res: Response): Promise<void> => {
        try {
            const category = req.query.category as string;
            const search = req.query.search as string;
            const ingredients = req.query.ingredients ? (req.query.ingredients as string).split(',') : [];

            if (search || ingredients.length > 0 || (category && category !== "Todas")) {
                const results = await recipeService.searchRecipes(search, ingredients, category);
                res.json(results);
            } else {
                const all = await recipeService.getAllRecipes();
                res.json(all);
            }
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch recipes" });
        }
    };

    /**
     * Handler for getting a single recipe by slug.
     */
    public getRecipeBySlug = async (req: Request, res: Response): Promise<void> => {
        try {
            const { slug } = req.params;
            const recipe = await recipeService.getRecipeBySlug(slug);

            if (!recipe) {
                res.status(404).json({ error: "Recipe not found" });
                return;
            }

            res.json(recipe);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch recipe" });
        }
    };
}
