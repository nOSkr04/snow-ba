import Ply from "../models/Ply.js";
import path from "path";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";

// api/v1/plys
export const getPlys = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Ply);

  const plys = await Ply.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: plys.length,
    data: plys,
    pagination,
  });
});

export const getPly = asyncHandler(async (req, res, next) => {
  const ply = await Ply.findById(req.params.id);

  if (!ply) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  ply.seen += 1;
  ply.save();

  res.status(200).json({
    success: true,
    data: ply,
  });
});

export const createPly = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const ply = await Ply.create(req.body);

  res.status(200).json({
    success: true,
    data: ply,
  });
});

export const deletePly = asyncHandler(async (req, res, next) => {
  const ply = await Ply.findById(req.params.id);

  if (!ply) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (ply.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  ply.remove();

  res.status(200).json({
    success: true,
    data: ply,
    whoDeleted: user.name,
  });
});

export const updatePly = asyncHandler(async (req, res, next) => {
  const ply = await Ply.findById(req.params.id);

  if (!ply) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (ply.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    ply[attr] = req.body[attr];
  }

  ply.save();

  res.status(200).json({
    success: true,
    data: ply,
  });
});
