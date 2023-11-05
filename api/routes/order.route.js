import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getOrder,
  intent,
  confirm,
  noOfOrder,
  compareIncome,
  cancelOrder,
  deliveredBySeller,
  getSingleOrder,
  createBuyerRequirement,
  approvedByBuyer,
  getTotalIncome,
  getRemaningOrder,
} from "../controller/order.controller.js";
const router = express.Router();

// router.post("/order/:gigId",verifyToken,createOrder)

router.get("/orders", verifyToken, getOrder);

router.get("/order/:id", verifyToken, getSingleOrder);

router.post("/orders/create-payment-intent/:id", verifyToken, intent);

router.put("/orders", verifyToken, confirm);

router.put("/orders/:orderId/cancel", verifyToken, cancelOrder);

router.put("/order/delivered/:orderId", verifyToken, deliveredBySeller);

router.put("/order/requirement/:orderId", verifyToken, createBuyerRequirement);

router.put("/order/approvable/:orderId", verifyToken, approvedByBuyer);

router.get("/noOfOrder", verifyToken, noOfOrder);

router.get("/compareincome", verifyToken, compareIncome);

router.get("/totalincome", verifyToken, getTotalIncome);

router.get("/remaningorders",verifyToken,getRemaningOrder)

export default router;
