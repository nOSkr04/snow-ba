import Style from "../models/Style.js";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
// api/v1/styles
export const getStyles = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Style);

  const styles = await Style.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit)
    .populate(["gage", "modelType", "ply", "material", "size"]);
  res.status(200).json({
    success: true,
    count: styles.length,
    data: styles,
    pagination,
  });
});

export const getStyle = asyncHandler(async (req, res, next) => {
  const style = await Style.findById(req.params.id);

  if (!style) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  style.seen += 1;
  style.save();

  res.status(200).json({
    success: true,
    data: style,
  });
});

export const createStyle = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const style = await Style.create(req.body);

  res.status(200).json({
    success: true,
    data: style,
  });
});

export const deleteStyle = asyncHandler(async (req, res, next) => {
  const style = await Style.findById(req.params.id);

  if (!style) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (style.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  style.remove();

  res.status(200).json({
    success: true,
    data: style,
    whoDeleted: user.name,
  });
});

export const updateStyle = asyncHandler(async (req, res, next) => {
  const style = await Style.findById(req.params.id);

  if (!style) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (style.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    style[attr] = req.body[attr];
  }

  style.save();

  res.status(200).json({
    success: true,
    data: style,
  });
});

export const uploadStylePhoto = asyncHandler(async (req, res, next) => {
  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    throw new MyError("Та зураг upload хийнэ үү.", 400);
  }

  file.name = `style_${uuidv4()}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/style/${file.name}`, (err) => {
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
