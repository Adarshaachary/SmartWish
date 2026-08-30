import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is not defined in .env"
  );
}

export interface AuthRequest
  extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const token =
      authHeader.substring(7).trim();

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      ) as {
        id: number;
        email: string;
      };

    if (
      !decoded ||
      !decoded.id ||
      !decoded.email
    ) {
      res.status(401).json({
        success: false,
        message:
          "Invalid authentication token",
      });

      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();

  } catch (error) {
    console.error(
      "Authentication error:",
      error
    );

    res.status(401).json({
      success: false,
      message:
        "Invalid or expired authentication token",
    });
  }
};