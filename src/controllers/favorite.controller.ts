import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add a favorite
export const addFavorite = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId; // From auth middleware
        const { recipeId } = req.body;

        if (!userId || !recipeId) {
            res.status(400).json({ error: 'Missing userId or recipeId' });
            return;
        }

        // Check if already exists
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_recipeId: {
                    userId,
                    recipeId,
                },
            },
        });

        if (existing) {
            res.status(200).json({ message: 'Recipe already in favorites' });
            return;
        }

        const favorite = await prisma.favorite.create({
            data: {
                userId,
                recipeId,
            },
        });

        res.status(201).json(favorite);
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Remove a favorite
export const removeFavorite = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { recipeId } = req.params;

        if (!userId || !recipeId) {
            res.status(400).json({ error: 'Missing userId or recipeId' });
            return;
        }

        await prisma.favorite.deleteMany({
            where: {
                userId,
                recipeId,
            },
        });

        res.status(200).json({ message: 'Favorite removed' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get user favorites
export const getFavorites = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: {
                recipe: true, // Include recipe details
            },
            orderBy: { createdAt: 'desc' },
        });

        // Map to return just the recipes (or keep the structure)
        const recipes = favorites.map(f => f.recipe);

        res.json(recipes);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Check if a specific recipe is favorited
export const checkFavorite = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { recipeId } = req.params;

        if (!userId) {
            res.json({ isFavorite: false });
            return;
        }

        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_recipeId: {
                    userId,
                    recipeId,
                },
            },
        });

        res.json({ isFavorite: !!favorite });
    } catch (error) {
        console.error('Error checking favorite:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
