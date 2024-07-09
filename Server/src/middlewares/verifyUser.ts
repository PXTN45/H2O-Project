import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "./verifyToken";

const verifyUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const role = req.decoded.role;
  const isUser = role === "user";

  if (!isUser) {
    return res.status(403).send({ message: "Forbidden Access" });
  }

  next();
};

export default verifyUser;
