import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  productDetails,
  getKnitProducts,
  createKnitTask,
  getKnitProcess,
} from "../controller/products.js";

const router = Router();
router.route("/knit").get(getKnitProducts);
router.route("/knit/:id").get(getKnitProcess).post(createKnitTask);
router.route("/detail").get(productDetails);
//"/api/v1/products"
router
  .route("/")
  .get(protect, getProducts)
  .post(protect, authorize("admin", "operator", "user"), createProduct);

router
  .route("/:id")
  .get(getProduct)
  .delete(protect, authorize("admin", "operator", "user"), deleteProduct)
  .put(protect, authorize("admin", "operator", "user"), updateProduct);

export default router;
