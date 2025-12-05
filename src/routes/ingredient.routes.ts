import { Router } from "express";
import { IngredientController } from "../controllers/ingredient.controller";

const router = Router();
const ingredientController = new IngredientController();

router.get("/", ingredientController.getTopIngredients);

export default router;
