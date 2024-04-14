import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getStyles,
  getStyle,
  createStyle,
  deleteStyle,
  updateStyle,
  uploadStylePhoto,
} from "../controller/styles.js";

const router = Router();

router.route("/image").post(uploadStylePhoto);
//"/api/v1/styles"
router
  .route("/")
  .get(protect, getStyles)
  .post(protect, authorize("admin", "order-manager"), createStyle);

router
  .route("/:id")
  .get(getStyle)
  .delete(protect, authorize("admin", "order-manager"), deleteStyle)
  .put(protect, authorize("admin", "order-manager"), updateStyle);

export default router;
