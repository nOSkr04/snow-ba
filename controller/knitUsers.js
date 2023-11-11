import KnitUser from "../models/KnitUser.js";
import path from "path";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";

// api/v1/knitUsers
export const getKnitUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, KnitUser);

  const knitUsers = await KnitUser.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: knitUsers.length,
    data: knitUsers,
    pagination,
  });
});

export const getKnitUser = asyncHandler(async (req, res, next) => {
  const knitUser = await KnitUser.findById(req.params.id);

  if (!knitUser) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  knitUser.seen += 1;
  knitUser.save();

  res.status(200).json({
    success: true,
    data: knitUser,
  });
});

export const createKnitUser = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const knitUser = await KnitUser.create(req.body);

  res.status(200).json({
    success: true,
    data: knitUser,
  });
});

export const deleteKnitUser = asyncHandler(async (req, res, next) => {
  const knitUser = await KnitUser.findById(req.params.id);

  if (!knitUser) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    knitUser.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  knitUser.remove();

  res.status(200).json({
    success: true,
    data: knitUser,
    whoDeleted: user.name,
  });
});

export const updateKnitUser = asyncHandler(async (req, res, next) => {
  const knitUser = await KnitUser.findById(req.params.id);

  if (!knitUser) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (
    knitUser.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    knitUser[attr] = req.body[attr];
  }

  knitUser.save();

  res.status(200).json({
    success: true,
    data: knitUser,
  });
});
