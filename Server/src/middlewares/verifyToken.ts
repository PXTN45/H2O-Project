import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

interface CustomRequest extends Request {
  decoded?: any; // or type according to your decoded object structure
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;
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
      req.decoded = decoded;
      // console.log(req.decoded);
      next();
    }
  });
};

export { verifyToken, CustomRequest };
