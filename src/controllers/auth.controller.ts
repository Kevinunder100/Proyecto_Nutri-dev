import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
    public register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                res.status(400).json({ error: "Missing required fields" });
                return;
            }

            const user = await authService.register(name, email, password);
            res.status(201).json({ message: "User created successfully", userId: user.id });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ error: "Missing required fields" });
                return;
            }

            const token = await authService.login(email, password);
            res.json({ token });
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    };
}
