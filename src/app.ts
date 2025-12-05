import express from "express";
import path from "path";
import recipeRoutes from "./routes/recipe.routes";
import authRoutes from "./routes/auth.routes";
import ingredientRoutes from "./routes/ingredient.routes";
import favoriteRoutes from "./routes/favorite.routes";
import { requestLogger } from "./middlewares/logger.middleware";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// Global Middlewares
app.use(express.json());
app.use(requestLogger);

// Static files
app.use(express.static(path.join(__dirname, "..", "public")));

// Routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/favorites", favoriteRoutes);

// Error Handling
app.use(errorHandler);

export default app;
