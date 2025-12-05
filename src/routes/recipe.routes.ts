import { Router } from "express";
import { RecipeController } from "../controllers/recipe.controller";

const router = Router();
const recipeController = new RecipeController();

router.get("/", recipeController.getRecipes);
router.get("/:slug", recipeController.getRecipeBySlug);

export default router;
