import { Request, Response, Router } from "express";
import {
  userRegister,
  businessRegister,
  adminRegister,
  Login,
  Logout,
  getAllUser,
  getAllBusiness,
  getAllAdmin,
  updateUser,
} from "../controller/user.controller";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.get("/userData", getAllUser);

router.get("/businessData", getAllBusiness);

router.get("/adminData", getAllAdmin);

router.post("/userRegister", userRegister);

router.post("/businessRegister", businessRegister);

router.post("/adminRegister", adminRegister);

router.put("/updateUser/:id", updateUser);

router.post("/login", Login);

router.post("/logout", Logout);

router.get("/verify", verifyToken);

export default router;
