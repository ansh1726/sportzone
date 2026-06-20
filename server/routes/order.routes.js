import express from "express";
import {
  getMyOrders,
  getOrderById,
} from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/my", verifyToken, getMyOrders);
router.get("/:id", verifyToken, getOrderById);

export default router;