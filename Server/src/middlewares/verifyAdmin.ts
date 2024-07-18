import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "./verifyToken";

const verifyAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const role = req.decoded.role;
  const isAdmin = role === "admin";

  if (!isAdmin) {
    return res.status(403).send({ message: "Forbidden Access" });
  }

  next();
};

export default verifyAdmin;
