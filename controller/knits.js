import Knit from "../models/Knit.js";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
// api/v1/knits
export const getKnits = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Knit);

  const knits = await Knit.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit)
    .populate(["gage", "modelType", "ply", "material", "size"]);
  res.status(200).json({
    success: true,
    count: knits.length,
    data: knits,
    pagination,
  });
});

export const getKnit = asyncHandler(async (req, res, next) => {
  const knit = await Knit.findById(req.params.id);

  if (!knit) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  knit.seen += 1;
  knit.save();

  res.status(200).json({
    success: true,
    data: knit,
  });
});

export const createKnit = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const knit = await Knit.create(req.body);

  res.status(200).json({
    success: true,
    data: knit,
  });
});

export const deleteKnit = asyncHandler(async (req, res, next) => {
  const knit = await Knit.findById(req.params.id);

  if (!knit) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (knit.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  knit.remove();

  res.status(200).json({
    success: true,
    data: knit,
    whoDeleted: user.name,
  });
});

export const updateKnit = asyncHandler(async (req, res, next) => {
  const knit = await Knit.findById(req.params.id);

  if (!knit) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (knit.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    knit[attr] = req.body[attr];
  }

  knit.save();

  res.status(200).json({
    success: true,
    data: knit,
  });
});
