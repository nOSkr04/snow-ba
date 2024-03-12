import Sew from "../models/Sew.js";
import path from "path";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";

// api/v1/sews
export const getSews = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Sew);

  const sews = await Sew.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: sews.length,
    data: sews,
    pagination,
  });
});

export const getSew = asyncHandler(async (req, res, next) => {
  const sew = await Sew.findById(req.params.id);

  if (!sew) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  sew.seen += 1;
  sew.save();

  res.status(200).json({
    success: true,
    data: sew,
  });
});

export const createSew = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const sew = await Sew.create(req.body);

  res.status(200).json({
    success: true,
    data: sew,
  });
});

export const deleteSew = asyncHandler(async (req, res, next) => {
  const sew = await Sew.findById(req.params.id);

  if (!sew) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (sew.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  sew.remove();

  res.status(200).json({
    success: true,
    data: sew,
    whoDeleted: user.name,
  });
});

export const updateSew = asyncHandler(async (req, res, next) => {
  const sew = await Sew.findById(req.params.id);

  if (!sew) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (sew.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    sew[attr] = req.body[attr];
  }

  sew.save();

  res.status(200).json({
    success: true,
    data: sew,
  });
});
