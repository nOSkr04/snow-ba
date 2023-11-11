import Product from "../models/Product.js";
import path from "path";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";
import Ply from "../models/Ply.js";
import Gage from "../models/Gage.js";
import ModelType from "../models/ModelType.js";
import Customer from "../models/Customer.js";
import Material from "../models/Material.js";
import Size from "../models/Size.js";
import KnitUser from "../models/KnitUser.js";

// api/v1/products
export const getProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Product);

  const products = await Product.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit)
    .populate(["gage", "modelType", "ply", "customers", "material", "size"]);
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
    pagination,
  });
});

export const getKnitProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Product);

  const products = await Product.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit)
    .populate(["size", "knitUsers", "material", "modelType", "gage", "ply"]);
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
    pagination,
  });
});

export const createKnitTask = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  const knitUser = await KnitUser.findById(req.body.knitUsers);

  if (!product) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  knitUser.accept = req.body.quantity + knitUser.accept;
  product.knitGrantedCount = req.body.quantity + product.knitGrantedCount;
  product.status = "Processing";
  product.knitStatus = "Processing";
  product.knitUsers = [...product.knitUsers, req.body.knitUsers];
  product.save();
  knitUser.save();
  res.status(200).json({
    success: true,
    data: product,
  });
});

export const getUserProducts = asyncHandler(async (req, res, next) => {
  req.query.createUser = req.userId;
  return this.getProducts(req, res, next);
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  product.seen += 1;
  product.save();

  res.status(200).json({
    success: true,
    data: product,
  });
});

export const createProduct = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    data: product,
  });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    product.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  product.remove();

  res.status(200).json({
    success: true,
    data: product,
    whoDeleted: user.name,
  });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (
    product.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    product[attr] = req.body[attr];
  }

  product.save();

  res.status(200).json({
    success: true,
    data: product,
  });
});

export const productDetails = asyncHandler(async (req, res, next) => {
  const plys = await Ply.find(req.query);
  const gages = await Gage.find(req.query);
  const models = await ModelType.find(req.query);
  const customers = await Customer.find(req.query);
  const materials = await Material.find(req.query);
  const sizes = await Size.find(req.query);

  res.status(200).json({
    ply: plys,
    gages,
    models,
    customers,
    materials,
    sizes,
  });
});
