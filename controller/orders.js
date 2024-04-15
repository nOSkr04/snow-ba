import Order from "../models/Order.js";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import Client from "../models/Client.js";
import Style from "../models/Style.js";
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
    .populate([
      "client",
      {
        path: "style",
        populate: ["gage", "modelType", "ply", "material", "size"],
      },
    ]);
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
    pagination,
  });
});

export const createOrderDetail = asyncHandler(async (req, res, next) => {
  const clients = await Client.find();
  const styles = await Style.find().populate([
    "gage",
    "modelType",
    "ply",
    "material",
    "size",
  ]);
  res.status(200).json({
    success: true,
    styles: styles,
    clients: clients,
  });
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

export const uploadOrderPhoto = asyncHandler(async (req, res, next) => {
  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    throw new MyError("Та зураг upload хийнэ үү.", 400);
  }

  file.name = `order_${uuidv4()}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/order/${file.name}`, (err) => {
    if (err) {
      throw new MyError(
        "Файлыг хуулах явцад алдаа гарлаа. Алдаа : " + err.message,
        400
      );
    }

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
