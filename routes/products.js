import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getOrders,
  getOrder,
  createOrder,
  deleteOrder,
  updateOrder,
  orderDetails,
  getKnitOrders,
  createKnitTask,
  getKnitProcess,
} from "../controller/orders.js";

const router = Router();
router.route("/knit").get(getKnitOrders);
router.route("/knit/:id").get(getKnitProcess).post(createKnitTask);
router.route("/detail").get(orderDetails);
//"/api/v1/orders"
router
  .route("/")
  .get(protect, getOrders)
  .post(protect, authorize("admin", "operator", "user"), createOrder);

router
  .route("/:id")
  .get(getOrder)
  .delete(protect, authorize("admin", "operator", "user"), deleteOrder)
  .put(protect, authorize("admin", "operator", "user"), updateOrder);

export default router;
