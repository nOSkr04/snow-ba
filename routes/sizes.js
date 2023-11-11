import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getSizes,
  getSize,
  createSize,
  deleteSize,
  updateSize,
} from "../controller/sizes.js";

const router = Router();

//"/api/v1/sizes"
router
  .route("/")
  .get(protect, getSizes)
  .post(protect, authorize("admin", "operator", "user"), createSize);

router
  .route("/:id")
  .get(getSize)
  .delete(protect, authorize("admin", "operator"), deleteSize)
  .put(protect, authorize("admin", "operator"), updateSize);

export default router;
