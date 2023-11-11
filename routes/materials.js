import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getMaterials,
  getMaterial,
  createMaterial,
  deleteMaterial,
  updateMaterial,
} from "../controller/materials.js";

const router = Router();

//"/api/v1/materials"
router
  .route("/")
  .get(protect, getMaterials)
  .post(protect, authorize("admin", "operator", "user"), createMaterial);

router
  .route("/:id")
  .get(getMaterial)
  .delete(protect, authorize("admin", "operator"), deleteMaterial)
  .put(protect, authorize("admin", "operator"), updateMaterial);

export default router;
