import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getOrders,
  getOrder,
  createOrder,
  deleteOrder,
  updateOrder,
  createOrderDetail,
  dashboardOrder,
} from "../controller/orders.js";

const router = Router();

//"/api/v1/orders"
router.route("/detail").get(createOrderDetail);
router
  .route("/")
  .get(protect, getOrders, dashboardOrder)
  .post(protect, authorize("admin", "order-manager"), createOrder);

router
  .route("/:id")
  .get(getOrder)
  .delete(protect, authorize("admin", "order-manager"), deleteOrder)
  .put(protect, authorize("admin", "order-manager"), updateOrder);

export default router;
