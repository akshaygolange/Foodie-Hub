const express = require("express");

const router = express.Router();

const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const protect = require("../middlewares/authMiddleware");

const admin = require("../middlewares/adminMiddleware");
const authorizeRoles =require("../middlewares/roleMiddleware")

router.post("/", protect, createOrder);

router.get("/", protect, getOrders);



router.put("/:id/status", protect, authorizeRoles("admin"),updateOrderStatus);

module.exports = router;