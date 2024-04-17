import Accompaniment from "../models/Accompaniment.js";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

// api/v1/accompaniments
export const getAccompaniments = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Accompaniment);

  const accompaniments = await Accompaniment.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit)
    .populate(["gage", "modelType", "ply", "material", "size"]);
  res.status(200).json({
    success: true,
    count: accompaniments.length,
    data: accompaniments,
    pagination,
  });
});

export const getOrderAccompaniments = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;
  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Order);

  const orders = await Order.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit)
    .populate([
      "client",
      "size",
      {
        path: "style",
        populate: ["gage", "modelType", "ply", "material", "size"],
      },
    ]);
  res.status(200).json({
    success: true,
    count: orders.length,
    order: orders,
    pagination,
  });
});

export const getAccompaniment = asyncHandler(async (req, res, next) => {
  const accompaniment = await Accompaniment.findById(req.params.id);

  if (!accompaniment) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  accompaniment.seen += 1;
  accompaniment.save();

  res.status(200).json({
    success: true,
    data: accompaniment,
  });
});

export const createAccompaniment = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const accompaniment = await Accompaniment.create(req.body);

  res.status(200).json({
    success: true,
    data: accompaniment,
  });
});

export const deleteAccompaniment = asyncHandler(async (req, res, next) => {
  const accompaniment = await Accompaniment.findById(req.params.id);

  if (!accompaniment) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (accompaniment.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  accompaniment.remove();

  res.status(200).json({
    success: true,
    data: accompaniment,
    whoDeleted: user.name,
  });
});

export const updateAccompaniment = asyncHandler(async (req, res, next) => {
  const accompaniment = await Accompaniment.findById(req.params.id);

  if (!accompaniment) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (accompaniment.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    accompaniment[attr] = req.body[attr];
  }

  accompaniment.save();

  res.status(200).json({
    success: true,
    data: accompaniment,
  });
});
