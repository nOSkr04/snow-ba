import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getKnits,
  getKnit,
  createKnit,
  deleteKnit,
  updateKnit,
  getOrderKnits,
} from "../controller/knits.js";

const router = Router();

//"/api/v1/knits"
router
  .route("/")
  .get(protect, getKnits)
  .post(protect, authorize("admin", "order-manager"), createKnit);

router.route("/orders").get(protect, getOrderKnits);

router
  .route("/:id")
  .get(getKnit)
  .delete(protect, authorize("admin", "order-manager"), deleteKnit)
  .put(protect, authorize("admin", "order-manager"), updateKnit);

export default router;
