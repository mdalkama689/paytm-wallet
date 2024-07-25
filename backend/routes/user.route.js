import express from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  searchUser,
  updateProfile,
  userProfile,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/search", authMiddleware, searchUser);
router.get("/me", authMiddleware, userProfile);
router.put("/update/profile", authMiddleware, updateProfile);
router.post("/forgot/password", forgotPassword);
router.post("/reset/password/:token", resetPassword);
export default router;
