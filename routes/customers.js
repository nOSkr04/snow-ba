import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getCustomers,
  getCustomer,
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "../controller/customers.js";

const router = Router();

//"/api/v1/customers"
router
  .route("/")
  .get(protect, getCustomers)
  .post(protect, authorize("admin", "operator", "user"), createCustomer);

router
  .route("/:id")
  .get(getCustomer)
  .delete(protect, authorize("admin", "operator"), deleteCustomer)
  .put(protect, authorize("admin", "operator"), updateCustomer);

export default router;
