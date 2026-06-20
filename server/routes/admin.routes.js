import express from "express";
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/admin.controller.js";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(verifyToken, isAdmin);

router.get("/stats", getDashboardStats);

router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);

router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

router.post("/products", upload.array("images", 5), createProduct);
router.put("/products/:id", upload.array("images", 5), updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;