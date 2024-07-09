import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;
  console.log(token);
  const secret = process.env.SECRET as string;

  if (!token) {
    res.status(401).json("No token provided");
    return;
  }

  jwt.verify(token, secret, (err: VerifyErrors | null, decoded: any) => {
    if (err) {
      console.error("Error verifying token:", err);
      res.status(401).json("Unauthorized");
    } else {
      res.status(200).json("Verify success");
      next();
    }
  });
};

export default verifyToken;
