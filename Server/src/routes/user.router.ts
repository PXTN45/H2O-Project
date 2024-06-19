import { Request, Response, Router } from "express";
import { Register, Login, Logout } from "../controller/user.controller";

const router = Router();

router.post("/register", Register);

router.post("/login", Login);

router.post("/logout", Logout);

export default router;
