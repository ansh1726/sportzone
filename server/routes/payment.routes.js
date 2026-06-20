import express from "express";
import {
  createPaymentIntent,
  createOrder,
} from "../controllers/payment.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-intent", verifyToken, createPaymentIntent);
router.post("/create-order", verifyToken, createOrder);

export default router;