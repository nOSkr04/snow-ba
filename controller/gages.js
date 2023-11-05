import Gage from "../models/Gage.js";
import path from "path";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";

// api/v1/gages
export const getGages = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Gage);

  const gages = await Gage.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: gages.length,
    data: gages,
    pagination,
  });
});

export const getGage = asyncHandler(async (req, res, next) => {
  const gage = await Gage.findById(req.params.id);

  if (!gage) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  gage.seen += 1;
  gage.save();

  res.status(200).json({
    success: true,
    data: gage,
  });
});

export const createGage = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const gage = await Gage.create(req.body);

  res.status(200).json({
    success: true,
    data: gage,
  });
});

export const deleteGage = asyncHandler(async (req, res, next) => {
  const gage = await Gage.findById(req.params.id);

  if (!gage) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (gage.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  gage.remove();

  res.status(200).json({
    success: true,
    data: gage,
    whoDeleted: user.name,
  });
});

export const updateGage = asyncHandler(async (req, res, next) => {
  const gage = await Gage.findById(req.params.id);

  if (!gage) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (gage.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    gage[attr] = req.body[attr];
  }

  gage.save();

  res.status(200).json({
    success: true,
    data: gage,
  });
});
