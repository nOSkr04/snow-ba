import ModelType from "../models/ModelType.js";
import path from "path";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";

// api/v1/modelTypes
export const getModelTypes = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, ModelType);

  const modelTypes = await ModelType.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: modelTypes.length,
    data: modelTypes,
    pagination,
  });
});

export const getModelType = asyncHandler(async (req, res, next) => {
  const modelType = await ModelType.findById(req.params.id);

  if (!modelType) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  modelType.seen += 1;
  modelType.save();

  res.status(200).json({
    success: true,
    data: modelType,
  });
});

export const createModelType = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const modelType = await ModelType.create(req.body);

  res.status(200).json({
    success: true,
    data: modelType,
  });
});

export const deleteModelType = asyncHandler(async (req, res, next) => {
  const modelType = await ModelType.findById(req.params.id);

  if (!modelType) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    modelType.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  modelType.remove();

  res.status(200).json({
    success: true,
    data: modelType,
    whoDeleted: user.name,
  });
});

export const updateModelType = asyncHandler(async (req, res, next) => {
  const modelType = await ModelType.findById(req.params.id);

  if (!modelType) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (
    modelType.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    modelType[attr] = req.body[attr];
  }

  modelType.save();

  res.status(200).json({
    success: true,
    data: modelType,
  });
});
