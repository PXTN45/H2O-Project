import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import UserModel from "../model/user.model";

dotenv.config();

const Register = async (req: Request, res: Response): Promise<void> => {
  const salt = bcrypt.genSaltSync(10);
  const { username, password } = req.body;
  try {
    const user = await UserModel.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const Login = async (req: Request, res: Response): Promise<void> => {
  const secret = process.env.SECRET as string;
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  
  if (!user) {
    res.status(400).json("Wrong credentials");
    return;
  }

  const isMatchedPassword = bcrypt.compareSync(password, user.password);
  if (isMatchedPassword) {
    jwt.sign({ username, id: user._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: user._id,
        username,
      });
    });
  } else {
    res.status(400).json("Wrong credentials");
  }
};

const Logout = (req: Request, res: Response): void => {
  res.cookie("token", "").json("ok");
};

export {
  Register,
  Login,
  Logout,
};
