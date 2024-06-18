import { Request, Response, Router } from "express";
import { Register, Login, Logout } from "../controller/user.controller";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  await Register(req, res);
});

router.post("/login", async (req: Request, res: Response) => {
  await Login(req, res);
});

router.post("/logout", (req: Request, res: Response) => {
  Logout(req, res);
});

export default router;
