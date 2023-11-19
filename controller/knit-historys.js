import KnitHistory from "../models/KnitHistory.js";
import path from "path";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";

// api/v1/knitHistorys
export const getKnitHistorys = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, KnitHistory);

  const knitHistorys = await KnitHistory.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: knitHistorys.length,
    data: knitHistorys,
    pagination,
  });
});

export const getKnitHistory = asyncHandler(async (req, res, next) => {
  const knitHistory = await KnitHistory.findById(req.params.id);

  if (!knitHistory) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  knitHistory.seen += 1;
  knitHistory.save();

  res.status(200).json({
    success: true,
    data: knitHistory,
  });
});

export const createKnitHistory = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const knitHistory = await KnitHistory.create(req.body);

  res.status(200).json({
    success: true,
    data: knitHistory,
  });
});

export const deleteKnitHistory = asyncHandler(async (req, res, next) => {
  const knitHistory = await KnitHistory.findById(req.params.id);

  if (!knitHistory) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    knitHistory.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  knitHistory.remove();

  res.status(200).json({
    success: true,
    data: knitHistory,
    whoDeleted: user.name,
  });
});

export const updateKnitHistory = asyncHandler(async (req, res, next) => {
  const knitHistory = await KnitHistory.findById(req.params.id);

  if (!knitHistory) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (
    knitHistory.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    knitHistory[attr] = req.body[attr];
  }

  knitHistory.save();

  res.status(200).json({
    success: true,
    data: knitHistory,
  });
});
