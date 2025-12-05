import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class IngredientController {
    public getTopIngredients = async (_req: Request, res: Response): Promise<void> => {
        try {
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
                take: 60,
            });

            // Return just the names
            const names = ingredients.map(i => i.name);
            res.json(names);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch ingredients" });
        }
    };
}
