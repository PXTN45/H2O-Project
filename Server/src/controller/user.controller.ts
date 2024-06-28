import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../model/user.model";
import { sendEmail } from "../utils/sendEmail";
import Token, { ITokenDocument } from "../model/token.model";

dotenv.config();

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = await UserModel.find();
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Register = async (req: Request, res: Response): Promise<void> => {
  const salt = bcrypt.genSaltSync(10);
  const secret = process.env.SECRET as string;
  const { name, lastname, email, password, phone, role } = req.body;
  try {
    const user = await UserModel.create({
      name,
      lastname,
      email,
      password: bcrypt.hashSync(password, salt),
      phone,
      role,
    });
    const token = jwt.sign({ userId: user.id, email: user.email }, secret, {
      expiresIn: "1h",
    });
    await sendEmail(user.email, token);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const Login = async (req: Request, res: Response): Promise<void> => {
  const secret = process.env.SECRET as string;
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    res.status(400).json("Wrong credentials");
    return;
  }

  const isMatchedPassword = bcrypt.compareSync(password, user.password);
  if (isMatchedPassword) {
    jwt.sign({ email, id: user._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({ id: user._id, email });
    });
  } else {
    res.status(400).json("Wrong credentials");
  }
};

const Logout = (req: Request, res: Response): void => {
  res.cookie("token", "").json("ok");
};

const verifyToken = async (req: Request, res: Response) => {
  const { token } = req.query;
  const secret = process.env.SECRET as string;
  try {
    const decode: any = jwt.verify(token as string, secret);
    const user = await UserModel.findById(decode.userId);
    if (!user) {
      res.status(400).json("invalid token");
    }

    user.isVerified = true;
    const saveUser = await user.save();
    res.redirect("http://localhost:5173/verifySuccess");
  } catch {
    res.errored;
  }
};

export { Register, Login, Logout, getAll, verifyToken };
