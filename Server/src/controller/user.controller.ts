import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../model/user.model";
import { sendEmail } from "../utils/sendEmail";
import BusinessModel from "../model/business.model";
import AdminModel from "../model/admin.model ";

dotenv.config();

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = await UserModel.find();
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userRegister = async (req: Request, res: Response): Promise<void> => {
  const salt = bcrypt.genSaltSync(10);
  const secret = process.env.SECRET as string;
  const { name, lastName, email, password, phone, role } = req.body;
  try {
    const user = await UserModel.create({
      name,
      lastName,
      email,
      password: bcrypt.hashSync(password, salt),
      phone,
      role,
    });
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user },
      secret,
      {
        expiresIn: "1h",
      }
    );
    await sendEmail(user.email, token);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
const adminRegister = async (req: Request, res: Response): Promise<void> => {
  const salt = bcrypt.genSaltSync(10);
  const secret = process.env.SECRET as string;
  const { name, lastname, email, password, phone, role } = req.body;
  try {
    const user = await AdminModel.create({
      name,
      lastname,
      email,
      password: bcrypt.hashSync(password, salt),
      phone,
      role,
    });
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secret,
      {
        expiresIn: "1h",
      }
    );
    await sendEmail(user.email, token);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
const businessRegister = async (req: Request, res: Response): Promise<void> => {
  const salt = bcrypt.genSaltSync(10);
  const secret = process.env.SECRET as string;
  const { businessName, email, password, phone, role } = req.body;
  try {
    const user = await BusinessModel.create({
      businessName,
      email,
      password: bcrypt.hashSync(password, salt),
      phone,
      role,
    });
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secret,
      {
        expiresIn: "1h",
      }
    );
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
    const role = decode.role;
    let verify : any;
    if (decode.role === "user") {
      const user = await UserModel.findById(decode.userId);
      verify = user;
    } else if (decode.role === "business") {
      const business = await BusinessModel.findById(decode.userId);
      verify = business;
    } else if (decode.role === "admin") {
      const admin = await AdminModel.findById(decode.userId);
      verify = admin;
    } else {
      null;
    }
    if (!verify) {
      res.status(400).json(role);
    }

    verify.isVerified = true;
    const saveverify = await verify.save();
    res.redirect("http://localhost:5173/verifySuccess");
  } catch {
    res.errored;
  }
};

export {
  userRegister,
  businessRegister,
  adminRegister,
  Login,
  Logout,
  getAll,
  verifyToken,
};
