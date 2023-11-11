import Size from "../models/Size.js";
import path from "path";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";

// api/v1/sizes
export const getSizes = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Size);

  const sizes = await Size.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: sizes.length,
    data: sizes,
    pagination,
  });
});

export const getSize = asyncHandler(async (req, res, next) => {
  const size = await Size.findById(req.params.id);

  if (!size) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  size.seen += 1;
  size.save();

  res.status(200).json({
    success: true,
    data: size,
  });
});

export const createSize = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const size = await Size.create(req.body);

  res.status(200).json({
    success: true,
    data: size,
  });
});

export const deleteSize = asyncHandler(async (req, res, next) => {
  const size = await Size.findById(req.params.id);

  if (!size) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (size.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  size.remove();

  res.status(200).json({
    success: true,
    data: size,
    whoDeleted: user.name,
  });
});

export const updateSize = asyncHandler(async (req, res, next) => {
  const size = await Size.findById(req.params.id);

  if (!size) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (size.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    size[attr] = req.body[attr];
  }

  size.save();

  res.status(200).json({
    success: true,
    data: size,
  });
});
