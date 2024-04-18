import Accompaniment from "../models/Accompaniment.js";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import Order from "../models/Order.js";
import moment from "moment";
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
    .populate([
      "knitter",
      {
        path: "order",
        populate: ["style"],
      },
    ]);
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

export const getBarcode = asyncHandler(async (req, res, next) => {
  const accompaniment = await Accompaniment.findOne({
    barcode: req.params.barcode,
  }).populate([
    "knitter",
    {
      path: "order",
      populate: ["style"],
    },
  ]);

  if (!accompaniment) {
    throw new MyError(req.params.barcode + " баркод байхгүй байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: accompaniment,
  });
});

export const createAccompaniment = asyncHandler(async (req, res, next) => {
  const { knitQuantity, knitter, orderId } = req.body;
  if (!knitter) {
    throw new MyError(orderId + " ID-тэй сүлжигч байхгүй байна.", 400);
  }
  const order = await Order.findById(orderId);
  if (!order) {
    throw new MyError(orderId + " ID-тэй захиалга байхгүй.", 400);
  }

  if (order.knitResidualCount < Number(knitQuantity)) {
    throw new MyError("Оруулсан тоо хэт өндөр байна", 400);
  }

  order.knitResidualCount = order.knitResidualCount - Number(knitQuantity);
  order.knitGrantedCount = order.knitGrantedCount + Number(knitQuantity);
  order.order = "working";

  const accompaniment = await Accompaniment.create({
    quantity: Number(knitQuantity),
    knitter: knitter,
    order: order,
    status: "working",
    knitStatus: "working",
    pdf: "<div><h1>HTML</h1></div>",
    excel:
      "batnaa end excel ee butsaah heregtei baina URL butsaah bh public dotroo upload hiicheh bolhiin",
  });
  const counts = await Accompaniment.countDocuments({
    createdAt: {
      $gte: moment().startOf("month"),
      $lte: moment().endOf("month"),
    },
  });
  const date = new Date();
  const year = date.getFullYear().toString().slice(-1);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const barcode = year + month + `${counts}`.padStart(5, "0");
  accompaniment.barcode = barcode;

  accompaniment.save();
  order.knitProcessUser = [
    ...order.knitProcessUser,
    {
      user: knitter,
      quantity: Number(knitQuantity),
      accompaniment: accompaniment._id,
    },
  ];
  order.accompaniments = [...order.accompaniments, accompaniment._id];
  order.save();
  res.status(200).json({
    success: true,
    data: accompaniment,
    pdf: accompaniment.pdf,
  });
});

export const knitAccompaniment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const accompaniment = await Accompaniment.findById(id);

  if (!accompaniment) {
    throw new MyError(id + " ID-тэй дагалдах байхгүй байна.", 404);
  }

  if (accompaniment.status || accompaniment.knitStatus === "done") {
    throw new MyError("Хүлээн авсан байна", 400);
  }

  if (!accompaniment.order) {
    throw new MyError("Дагалдахад захиалга олдсонгүй", 400);
  }

  const order = await Order.findById(accompaniment.order);
  order.knitGrantedCount = order.knitGrantedCount - accompaniment.quantity;
  order.knitCompletedCount = order.knitCompletedCount + accompaniment.quantity;
  order.knitWeight = order.knitWeight + req.body.knitWeight;
  order.sewGrantedCount = order.sewGrantedCount + accompaniment.quantity;
  const removeProcessKnitter = order.knitProcessUser.filter(
    (knitter) => knitter.accompaniment !== id
  );

  order.knitProcessUser = removeProcessKnitter;
  order.knitCompleteUser = [
    ...order.knitCompleteUser,
    {
      user: accompaniment.knitter,
      quantity: accompaniment.quantity,
      accompaniment: accompaniment._id,
    },
  ];

  accompaniment.knitStatus = "done";
  accompaniment.knitWeight = req.body.knitWeight;
  accompaniment.availableSew = true;
  accompaniment.save();
  order.save();

  res.status(200).json({
    success: true,
    data: accompaniment,
  });
});

export const sewAccompaniment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { sewWeight, sewUser } = req.body;
  const accompaniment = await Accompaniment.findById(id);

  if (!accompaniment) {
    throw new MyError(id + " ID-тэй дагалдах байхгүй байна.", 404);
  }

  if (accompaniment.status || accompaniment.sewStatus === "done") {
    throw new MyError("Хүлээн авсан байна", 400);
  }

  if (!accompaniment.order) {
    throw new MyError("Дагалдахад захиалга олдсонгүй", 400);
  }

  const order = await Order.findById(accompaniment.order);
  order.sewGrantedCount = order.sewGrantedCount - accompaniment.quantity;
  order.sewCompletedCount = order.sewCompletedCount + accompaniment.quantity;
  order.sewWeight = order.sewWeight + sewWeight;
  order.executiveGrantedCount =
    order.executiveGrantedCount + accompaniment.quantity;
  const removeProcessSewer = order.sewProcessUser.filter(
    (sewing) => sewing.accompaniment !== id
  );

  order.sewProcessUser = removeProcessSewer;
  order.sewCompleteUser = [
    ...order.sewCompleteUser,
    {
      user: sewUser,
      quantity: accompaniment.quantity,
      accompaniment: accompaniment._id,
    },
  ];

  accompaniment.sewStatus = "done";
  accompaniment.sewWeight = sewWeight;
  accompaniment.sewer = sewUser;
  accompaniment.availableExecutive = true;
  accompaniment.save();
  order.save();

  res.status(200).json({
    success: true,
    data: accompaniment,
  });
});

export const executiveAccompaniment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { executiveWeight, executive } = req.body;
  const accompaniment = await Accompaniment.findById(id);

  if (!accompaniment) {
    throw new MyError(id + " ID-тэй дагалдах байхгүй байна.", 404);
  }

  if (accompaniment.status || accompaniment.executiveStatus === "done") {
    throw new MyError("Хүлээн авсан байна", 400);
  }

  if (!accompaniment.order) {
    throw new MyError("Дагалдахад захиалга олдсонгүй", 400);
  }

  const order = await Order.findById(accompaniment.order);
  order.executiveGrantedCount =
    order.executiveGrantedCount - accompaniment.quantity;
  order.executiveCompletedCount =
    order.executiveCompletedCount + accompaniment.quantity;
  order.executiveWeight = order.executiveWeight + executiveWeight;
  order.completed = order.completed + accompaniment.quantity;
  const removeProcessExecutive = order.executiveProcessUser.filter(
    (executive) => executive.accompaniment !== id
  );

  order.executiveProcessUser = removeProcessExecutive;
  order.executiveCompleteUser = [
    ...order.executiveCompleteUser,
    {
      user: executive,
      quantity: accompaniment.quantity,
      accompaniment: accompaniment._id,
    },
  ];

  accompaniment.status = "done";
  accompaniment.executiveStatus = "done";
  accompaniment.executiveWeight = executiveWeight;
  accompaniment.save();
  order.save();

  res.status(200).json({
    success: true,
    data: accompaniment,
  });
});
