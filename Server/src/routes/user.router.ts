import { Request, Response, Router } from "express";
import { userRegister,businessRegister, adminRegister, Login, Logout , getAll } from "../controller/user.controller";
import verifyToken from "../middlewares/verifyToken"

const router = Router();

router.get("/userData", getAll);

router.post("/userRegister" , userRegister);

router.post("/businessRegister" , businessRegister);

router.post("/adminRegister" , adminRegister);

router.post("/login", Login);

router.post("/logout", Logout);

router.get("/verify" , verifyToken)

export default router;
