import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "./verifyToken";

const verifyBusiness = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const role = req.decoded.role;
  const isBusiness = role === "business";

  if (!isBusiness) {
    return res.status(403).send({ message: "Forbidden Access" });
  }

  next();
};

export default verifyBusiness;
