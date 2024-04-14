import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getStyleSettings,
  getStyleSetting,
  createStyleSetting,
  deleteStyleSetting,
  updateStyleSetting,
} from "../controller/style-settings.js";

const router = Router();

//"/api/v1/style-settings"
router
  .route("/")
  .get(protect, getStyleSettings)
  .post(protect, authorize("admin", "operator", "user"), createStyleSetting);

router
  .route("/:id")
  .get(getStyleSetting)
  .delete(protect, authorize("admin", "operator"), deleteStyleSetting)
  .put(protect, authorize("admin", "operator"), updateStyleSetting);

export default router;
