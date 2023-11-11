import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getKnitUsers,
  getKnitUser,
  createKnitUser,
  deleteKnitUser,
  updateKnitUser,
} from "../controller/knitUsers.js";

const router = Router();

//"/api/v1/knitUsers"
router
  .route("/")
  .get(protect, getKnitUsers)
  .post(protect, authorize("admin", "operator", "user"), createKnitUser);

router
  .route("/:id")
  .get(getKnitUser)
  .delete(protect, authorize("admin", "operator"), deleteKnitUser)
  .put(protect, authorize("admin", "operator"), updateKnitUser);

export default router;
