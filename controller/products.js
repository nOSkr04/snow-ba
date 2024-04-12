import Order from "../models/Order.js";
import path from "path";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";
import Ply from "../models/Ply.js";
import Gage from "../models/Gage.js";
import ModelType from "../models/ModelType.js";
import Customer from "../models/Customer.js";
import Material from "../models/Material.js";
import Size from "../models/Size.js";
import KnitUser from "../models/KnitUser.js";
import Knit from "../models/Knit.js";
import KnitHistory from "../models/KnitHistory.js";
import Sew from "../models/Sew.js";
import moment from "moment";
// api/v1/orders
export const getOrders = asyncHandler(async (req, res, next) => {
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
    .populate(["gage", "modelType", "ply", "customers", "material", "size"]);
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
    pagination,
  });
});

export const getKnitOrders = asyncHandler(async (req, res, next) => {
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
      "size",
      "knitUsers",
      "modelType",
      "gage",
      "ply",
      "knit",
      "customers",
      "material",
      { path: "knit", populate: { path: "user" } },
    ]);
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
    pagination,
  });
});

export const getKnitProcess = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate([
    "knit",
    { path: "knit", populate: { path: "user" } },
  ]);

  if (!order) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  const typeOrder = ["accept", "done" /* add other values as needed */];

  // Sort the knit array based on the 'type' property and createdAt
  order.knit.sort((a, b) => {
    const aIndex = typeOrder.indexOf(a.type);
    const bIndex = typeOrder.indexOf(b.type);

    // Compare type indices first
    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }

    // If types are equal, sort by createdAt (latest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  res.status(200).json({
    success: true,
    data: order,
  });
});

export const createKnitTask = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new MyError(req.params.id + " ID-тэй захиалга байхгүй.", 400);
  }
  if (order.knitResidualCount < req.body.quantity) {
    throw new MyError("Оруулсан тоо хэт өндөр байна", 400);
  }
  const knitUser = await KnitUser.findById(req.body.knitUsers);
  const knitHistory = await KnitHistory.create({
    order: order._id,
    count: req.body.quantity,
    user: knitUser._id,
  });

  const counts = await Sew.countDocuments({
    createdAt: {
      $gte: moment().startOf("month"),
      $lte: moment().endOf("month"),
    },
  });
  const date = new Date();
  const year = date.getFullYear().toString().slice(-1);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const generate = year + month + `${counts}`.padStart(5, "0");

  const knit = await Knit.create({
    type: "accept",
    createUser: req.userId,
    quantity: req.body.quantity,
    user: req.body.knitUsers,
    order: req.params.id,
    knitLink: knitHistory._id,
  });
  const sewsCreate = await Sew.create({
    order: order._id,
    knitStatus: knitHistory._id,
    barCode: generate,
    daimond: order.daimond,
    knit: knit._id,
  });
  knitUser.workHistory = [...knitUser.workHistory, knitHistory._id];
  knitUser.accept = req.body.quantity + knitUser.accept;
  order.knitGrantedCount = req.body.quantity + order.knitGrantedCount;
  order.knitResidualCount = order.knitResidualCount - req.body.quantity;
  order.status = "Processing";
  order.knitStatus = "Processing";
  order.knitUsers = [...order.knitUsers, req.body.knitUsers];
  order.knit = [...order.knit, knit._id];
  order.save();
  knitUser.save();
  res.status(200).json({
    success: true,
    data: order,
    sew: sewsCreate,
  });
});

export const getUserOrders = asyncHandler(async (req, res, next) => {
  req.query.createUser = req.userId;
  return this.getOrders(req, res, next);
});

export const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  order.seen += 1;
  order.save();

  res.status(200).json({
    success: true,
    data: order,
  });
});

export const createOrder = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const order = await Order.create(req.body);

  res.status(200).json({
    success: true,
    data: order,
  });
});

export const deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (order.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  order.remove();

  res.status(200).json({
    success: true,
    data: order,
    whoDeleted: user.name,
  });
});

export const updateOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (order.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    order[attr] = req.body[attr];
  }

  order.save();

  res.status(200).json({
    success: true,
    data: order,
  });
});

export const orderDetails = asyncHandler(async (req, res, next) => {
  const plys = await Ply.find(req.query);
  const gages = await Gage.find(req.query);
  const models = await ModelType.find(req.query);
  const customers = await Customer.find(req.query);
  const materials = await Material.find(req.query);
  const sizes = await Size.find(req.query);

  res.status(200).json({
    ply: plys,
    gages,
    models,
    customers,
    materials,
    sizes,
  });
});
