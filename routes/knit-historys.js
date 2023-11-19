import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getKnitHistorys,
  getKnitHistory,
  createKnitHistory,
  deleteKnitHistory,
  updateKnitHistory,
} from "../controller/knit-historys.js";

const router = Router();

//"/api/v1/knitHistorys"
router
  .route("/")
  .get(protect, getKnitHistorys)
  .post(protect, authorize("admin", "operator", "user"), createKnitHistory);

router
  .route("/:id")
  .get(getKnitHistory)
  .delete(protect, authorize("admin", "operator"), deleteKnitHistory)
  .put(protect, authorize("admin", "operator"), updateKnitHistory);

export default router;
