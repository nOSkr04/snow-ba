import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getSews,
  getSew,
  createSew,
  deleteSew,
  updateSew,
} from "../controller/sews.js";

const router = Router();

//"/api/v1/sews"
router
  .route("/")
  .get(protect, getSews)
  .post(protect, authorize("admin", "operator", "user"), createSew);

router
  .route("/:id")
  .get(getSew)
  .delete(protect, authorize("admin", "operator"), deleteSew)
  .put(protect, authorize("admin", "operator"), updateSew);

export default router;
