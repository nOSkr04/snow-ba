import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getKnits,
  getKnit,
  createKnit,
  deleteKnit,
  updateKnit,
  acceptKnit,
} from "../controller/knits.js";

const router = Router();

//"/api/v1/knits"
router
  .route("/")
  .get(protect, getKnits)
  .post(protect, authorize("admin", "operator", "user"), createKnit);

router
  .route("/:id")
  .get(getKnit)
  .post(acceptKnit)
  .delete(protect, authorize("admin", "operator"), deleteKnit)
  .put(protect, authorize("admin", "operator"), updateKnit);

export default router;
