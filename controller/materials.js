import Material from "../models/Material.js";
import path from "path";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";

// api/v1/materials
export const getMaterials = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Material);

  const materials = await Material.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: materials.length,
    data: materials,
    pagination,
  });
});

export const getMaterial = asyncHandler(async (req, res, next) => {
  const material = await Material.findById(req.params.id);

  if (!material) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  material.seen += 1;
  material.save();

  res.status(200).json({
    success: true,
    data: material,
  });
});

export const createMaterial = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const material = await Material.create(req.body);

  res.status(200).json({
    success: true,
    data: material,
  });
});

export const deleteMaterial = asyncHandler(async (req, res, next) => {
  const material = await Material.findById(req.params.id);

  if (!material) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    material.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  material.remove();

  res.status(200).json({
    success: true,
    data: material,
    whoDeleted: user.name,
  });
});

export const updateMaterial = asyncHandler(async (req, res, next) => {
  const material = await Material.findById(req.params.id);

  if (!material) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (
    material.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    material[attr] = req.body[attr];
  }

  material.save();

  res.status(200).json({
    success: true,
    data: material,
  });
});
