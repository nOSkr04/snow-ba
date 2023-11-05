import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getPlys,
  getPly,
  createPly,
  deletePly,
  updatePly,
} from "../controller/plys.js";

const router = Router();

//"/api/v1/plys"
router
  .route("/")
  .get(protect, getPlys)
  .post(protect, authorize("admin", "operator", "user"), createPly);

router
  .route("/:id")
  .get(getPly)
  .delete(protect, authorize("admin", "operator"), deletePly)
  .put(protect, authorize("admin", "operator"), updatePly);

export default router;
