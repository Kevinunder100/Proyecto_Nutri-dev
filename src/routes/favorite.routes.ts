import { Router } from 'express';
import { addFavorite, removeFavorite, getFavorites, checkFavorite } from '../controllers/favorite.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', addFavorite);
router.delete('/:recipeId', removeFavorite);
router.get('/', getFavorites);
router.get('/:recipeId/check', checkFavorite);

export default router;
