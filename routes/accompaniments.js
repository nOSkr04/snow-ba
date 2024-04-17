import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";
import {
  getAccompaniment,
  createAccompaniment,
  getOrderAccompaniments,
  getAccompaniments,
  deleteAccompaniment,
  updateAccompaniment,
} from "../controller/accompaniments.js";
const router = Router();

//"/api/v1/accompaniments"
router
  .route("/")
  .get(protect, getAccompaniments)
  .post(protect, authorize("admin", "order-manager"), createAccompaniment);

router.route("/orders").get(protect, getOrderAccompaniments);

router
  .route("/:id")
  .get(getAccompaniment)
  .delete(protect, authorize("admin", "knit-manager"), deleteAccompaniment)
  .put(protect, authorize("admin", "knit-manager"), updateAccompaniment);

export default router;
