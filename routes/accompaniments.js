import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";
import {
  getAccompaniment,
  createAccompaniment,
  getOrderAccompaniments,
  getAccompaniments,
  getBarcode,
  knitAccompaniment,
  sewAccompaniment,
  executiveAccompaniment,
} from "../controller/accompaniments.js";
const router = Router();

//"/api/v1/accompaniments"
router
  .route("/")
  .get(protect, getAccompaniments)
  .post(protect, authorize("admin", "order-manager"), createAccompaniment);

router.route("/orders").get(protect, getOrderAccompaniments);

router.route("/barcode/:barcode").get(protect, getBarcode);
router
  .route("/:id/sew")
  .post(protect, authorize("admin", "sew-manager"), sewAccompaniment);
router
  .route("/:id/executive")
  .post(
    protect,
    authorize("admin", "executive-manager"),
    executiveAccompaniment
  );

router
  .route("/:id")
  .get(getAccompaniment)
  .post(protect, authorize("admin", "knit-manager"), knitAccompaniment);

export default router;
