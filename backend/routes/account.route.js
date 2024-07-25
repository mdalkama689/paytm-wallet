import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  allTransactions,
  checkBalance,
  transfer,
} from "../controllers/account.controller.js";

const router = express.Router();

router.get("/balance", authMiddleware, checkBalance);
router.post("/transfer/:to", authMiddleware, transfer);
router.get("/transactions", authMiddleware, allTransactions);
export default router;
