import BusinessModel from "../model/business.model";
import UserModel from "../model/user.model";
import AdminModel from "../model/admin.model ";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const verifyToken = async (req: Request, res: Response) => {
  const { token } = req.query;
  const secret = process.env.SECRET as string;
  try {
    const decode: any = jwt.verify(token as string, secret);
    const role = decode.role;
    let verify;
    if (decode.role === "user") {
      const user = await UserModel.findById(decode.userId);
      verify = user;
    } else if (decode.role === "business") {
      const business = await BusinessModel.findById(decode.userId);
      verify = business;
    } else if (decode.role === "admin") {
      const admin = await AdminModel.findById(decode.userId);
      verify = admin;
    }
    if (!verify) {
      res.status(400).json(decode);
    }

    verify.isVerified = true;
    const saveverify = await verify.save();
    res.redirect("http://localhost:5173/verifySuccess");
  } catch {
    res.errored;
  }
};

export default verifyToken;