import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import db from "../config/db";

const JWT_SECRET =
  process.env.JWT_SECRET || "smartwish_secret_key";

// ==================================================
// REGISTER USER
// POST /api/auth/register
// ==================================================

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // ==================================================
    // VALIDATE INPUT
    // ==================================================

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
      return;
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password);

    if (!cleanName || !cleanEmail || !cleanPassword) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    if (cleanPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
      return;
    }

    // ==================================================
    // CHECK EXISTING USER
    // ==================================================

    const [existingUsers]: any = await db.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [cleanEmail]
    );

    if (existingUsers.length > 0) {
      res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
      return;
    }

    // ==================================================
    // HASH PASSWORD
    // ==================================================

    const hashedPassword = await bcrypt.hash(
      cleanPassword,
      10
    );

    // ==================================================
    // INSERT USER
    // ==================================================

    const [result]: any = await db.execute(
      `
      INSERT INTO users
      (name, email, password)
      VALUES (?, ?, ?)
      `,
      [
        cleanName,
        cleanEmail,
        hashedPassword,
      ]
    );

    // ==================================================
    // SUCCESS
    // ==================================================

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: result.insertId,
        name: cleanName,
        email: cleanEmail,
      },
    });
  } catch (error: any) {
    console.error("==========================================");
    console.error("REGISTER ERROR");
    console.error("==========================================");
    console.error(error);
    console.error("==========================================");

    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error?.message || "Unknown error",
      code: error?.code || null,
    });
  }
};

// ==================================================
// LOGIN USER
// POST /api/auth/login
// ==================================================

export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // ==================================================
    // VALIDATE INPUT
    // ==================================================

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    const cleanPassword = String(password);

    // ==================================================
    // FIND USER
    // ==================================================

    const [users]: any = await db.execute(
      `
      SELECT
        id,
        name,
        email,
        password
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [cleanEmail]
    );

    if (users.length === 0) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const user = users[0];

    // ==================================================
    // CHECK PASSWORD
    // ==================================================

    const passwordMatch = await bcrypt.compare(
      cleanPassword,
      user.password
    );

    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // ==================================================
    // CREATE JWT
    // ==================================================

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ==================================================
    // SUCCESS
    // ==================================================

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("==========================================");
    console.error("LOGIN ERROR");
    console.error("==========================================");
    console.error(error);
    console.error("==========================================");

    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error?.message || "Unknown error",
      code: error?.code || null,
    });
  }
};