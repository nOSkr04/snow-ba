import StyleSetting from "../models/StyleSetting.js";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";

// api/v1/styleSettings
export const getStyleSettings = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 1000;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, StyleSetting);

  const styleSettings = await StyleSetting.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: styleSettings.length,
    data: styleSettings,
    pagination,
  });
});

export const getStyleSetting = asyncHandler(async (req, res, next) => {
  const styleSetting = await StyleSetting.findById(req.params.id);

  if (!styleSetting) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  styleSetting.seen += 1;
  styleSetting.save();

  res.status(200).json({
    success: true,
    data: styleSetting,
  });
});

export const createStyleSetting = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const styleSetting = await StyleSetting.create(req.body);

  res.status(200).json({
    success: true,
    data: styleSetting,
  });
});

export const deleteStyleSetting = asyncHandler(async (req, res, next) => {
  const styleSetting = await StyleSetting.findById(req.params.id);

  if (!styleSetting) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  const user = await User.findById(req.userId);

  styleSetting.remove();

  res.status(200).json({
    success: true,
    data: styleSetting,
    whoDeleted: user.name,
  });
});

export const updateStyleSetting = asyncHandler(async (req, res, next) => {
  const styleSetting = await StyleSetting.findById(req.params.id);

  if (!styleSetting) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (
    styleSetting.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    styleSetting[attr] = req.body[attr];
  }

  styleSetting.save();

  res.status(200).json({
    success: true,
    data: styleSetting,
  });
});


