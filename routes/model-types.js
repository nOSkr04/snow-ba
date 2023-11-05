import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getModelTypes,
  getModelType,
  createModelType,
  deleteModelType,
  updateModelType,
} from "../controller/model-types.js";

const router = Router();

//"/api/v1/modelTypes"
router
  .route("/")
  .get(protect, getModelTypes)
  .post(protect, authorize("admin", "operator", "user"), createModelType);

router
  .route("/:id")
  .get(getModelType)
  .delete(protect, authorize("admin", "operator"), deleteModelType)
  .put(protect, authorize("admin", "operator"), updateModelType);

export default router;
