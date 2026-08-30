import { Router } from "express";

import {
  registerUser,
  loginUser,
} from "../controllers/authController";

const router = Router();

// ==================================================
// REGISTER
// POST /api/auth/register
// ==================================================

router.post("/register", registerUser);

// ==================================================
// LOGIN
// POST /api/auth/login
// ==================================================

router.post("/login", loginUser);

export default router;