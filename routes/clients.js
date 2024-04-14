import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getClients,
  getClient,
  createClient,
  deleteClient,
  updateClient,
  uploadClientPhoto,
} from "../controller/clients.js";

const router = Router();

router.route("/image").post(uploadClientPhoto);
//"/api/v1/clients"
router
  .route("/")
  .get(protect, getClients)
  .post(protect, authorize("admin", "order-manager"), createClient);

router
  .route("/:id")
  .get(getClient)
  .delete(protect, authorize("admin", "order-manager"), deleteClient)
  .put(protect, authorize("admin", "order-manager"), updateClient);

export default router;
