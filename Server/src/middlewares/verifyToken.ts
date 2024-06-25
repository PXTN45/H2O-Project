import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  decode?: string | JwtPayload;
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): Response | void => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Unauthorized Access1" });
  }

  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decode) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized Access2" });
    }
    req.decode = decode;
    next();
  });
};

export default verifyToken;
