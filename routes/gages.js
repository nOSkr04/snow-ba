import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getGages,
  getGage,
  createGage,
  deleteGage,
  updateGage,
} from "../controller/gages.js";

const router = Router();

//"/api/v1/gages"
router
  .route("/")
  .get(protect, getGages)
  .post(protect, authorize("admin", "operator", "user"), createGage);

router
  .route("/:id")
  .get(getGage)
  .delete(protect, authorize("admin", "operator"), deleteGage)
  .put(protect, authorize("admin", "operator"), updateGage);

export default router;
