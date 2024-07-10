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
  checkEmailExists,
} from "../controller/user.controller";
import verifyEmailToken from "../middlewares/verifyEmailToken";
import { verifyToken } from "../middlewares/verifyToken";
import verifyUser from "../middlewares/verifyUser";

const router = Router();

router.get("/userData", getAllUser);

router.get("/businessData", getAllBusiness);

router.get("/adminData", getAllAdmin);

router.post("/userRegister", userRegister);

router.post("/businessRegister", businessRegister);

router.post("/adminRegister", adminRegister);

router.post("/checkEmailExists", checkEmailExists);

router.put("/updateUser/:id", updateUser);

router.post("/login", Login);

router.post("/logout", Logout);

router.get("/verify", verifyEmailToken);

export default router;
