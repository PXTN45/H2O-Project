import { Request, Response, Router } from "express";
import { Register, Login, Logout , getAll, verifyToken } from "../controller/user.controller";

const router = Router();

router.get("/userData", getAll);

router.post("/register" , Register);

router.post("/login", Login);

router.post("/logout", Logout);

router.get("/verify" , verifyToken)

export default router;
