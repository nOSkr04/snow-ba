import Accompaniment from "../models/Accompaniment.js";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import Order from "../models/Order.js";
import moment from "moment";
import AccompHtml from "../utils/accomp-html.js";
import Pdf from "../models/Pdf.js";
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
    order: order._id,
    status: "working",
    knitStatus: "working",
    pdf: "<div><h1>HTML</h1></div>",
    availableKnit: true,
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
  const pdf = await Pdf.create({
    content: await AccompHtml({
      order: order._id,
      accompaniment: accompaniment._id,
    }),
    accompaniment: accompaniment._id,
  });
  order.pdfs = [pdf._id, ...order.pdfs];
  order.save();
  res.status(200).json({
    success: true,
    data: accompaniment,
    pdf: pdf.content,
  });
});

export const knitAccompaniment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const accompaniment = await Accompaniment.findById(id);

  if (!accompaniment) {
    throw new MyError(id + " ID-тэй дагалдах байхгүй байна.", 404);
  }
  if (accompaniment.status === "done" || accompaniment.knitStatus === "done") {
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
  accompaniment.sewStatus = "working";
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

  if (accompaniment.status === "done" || accompaniment.sewStatus === "done") {
    throw new MyError("Хүлээн авсан байна", 400);
  }

  if (!accompaniment.order) {
    throw new MyError("Дагалдахад захиалга олдсонгүй", 400);
  }

  const order = await Order.findById(accompaniment.order);
  order.sewGrantedCount =
    Number(order.sewGrantedCount) - Number(accompaniment.quantity);
  order.sewCompletedCount =
    Number(order.sewCompletedCount) + Number(accompaniment.quantity);
  order.sewWeight = Number(order.sewWeight) + Number(sewWeight);
  order.executiveGrantedCount =
    Number(order.executiveGrantedCount) + Number(accompaniment.quantity);
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
  accompaniment.executiveStatus = "working";
  accompaniment.save();
  order.save();

  res.status(200).json({
    success: true,
    data: accompaniment,
  });
});

export const executiveAccompaniment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { executiveWeight } = req.body;
  const accompaniment = await Accompaniment.findById(id);

  if (!accompaniment) {
    throw new MyError(id + " ID-тэй дагалдах байхгүй байна.", 404);
  }

  if (
    accompaniment.status === "done" ||
    accompaniment.executiveStatus === "done"
  ) {
    throw new MyError("Хүлээн авсан байна", 400);
  }

  if (!accompaniment.order) {
    throw new MyError("Дагалдахад захиалга олдсонгүй", 400);
  }

  const order = await Order.findById(accompaniment.order);
  order.executiveGrantedCount =
    Number(order.executiveGrantedCount) - Number(accompaniment.quantity);
  order.executiveCompletedCount =
    Number(order.executiveCompletedCount) + Number(accompaniment.quantity);
  order.executiveWeight =
    Number(order.executiveWeight) + Number(executiveWeight);
  order.completed = Number(order.completed) + Number(accompaniment.quantity);

  accompaniment.executiveStatus = "done";
  accompaniment.executiveWeight = executiveWeight;
  accompaniment.executiveDoneStatus = "working";
  accompaniment.availableDoneExecutive = true;
  accompaniment.save();
  order.save();

  res.status(200).json({
    success: true,
    data: accompaniment,
  });
});

export const executiveDoneAccompaniment = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const { executiveDoneWeight } = req.body;
    const accompaniment = await Accompaniment.findById(id);

    if (!accompaniment) {
      throw new MyError(id + " ID-тэй дагалдах байхгүй байна.", 404);
    }

    if (
      accompaniment.status === "done" ||
      accompaniment.executiveDoneStatus === "done"
    ) {
      throw new MyError("Хүлээн авсан байна", 400);
    }

    if (!accompaniment.order) {
      throw new MyError("Дагалдахад захиалга олдсонгүй", 400);
    }

    const order = await Order.findById(accompaniment.order);
    order.executiveDoneGrantedCount =
      Number(order.executiveDoneGrantedCount) - Number(accompaniment.quantity);
    order.executiveDoneCompletedCount =
      Number(order.executiveDoneCompletedCount) +
      Number(accompaniment.quantity);
    order.executiveDoneWeight =
      Number(order.executiveDoneWeight) + Number(executiveDoneWeight);
    order.completed = Number(order.completed) + Number(accompaniment.quantity);

    // accompaniment.status = "done";
    order.status = "done";
    accompaniment.executiveDoneStatus = "done";
    accompaniment.executiveDoneWeight = executiveDoneWeight;
    accompaniment.save();
    order.save();

    res.status(200).json({
      success: true,
      data: accompaniment,
    });
  }
);
