import Client from "../models/Client.js";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
// api/v1/clients
export const getClients = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Client);

  const clients = await Client.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);
  res.status(200).json({
    success: true,
    count: clients.length,
    data: clients,
    pagination,
  });
});

export const getClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  client.seen += 1;
  client.save();

  res.status(200).json({
    success: true,
    data: client,
  });
});

export const createClient = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const client = await Client.create(req.body);

  res.status(200).json({
    success: true,
    data: client,
  });
});

export const deleteClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  const user = await User.findById(req.userId);

  client.remove();

  res.status(200).json({
    success: true,
    data: client,
    whoDeleted: user.name,
  });
});

export const updateClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (client.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    client[attr] = req.body[attr];
  }

  client.save();

  res.status(200).json({
    success: true,
    data: client,
  });
});

export const uploadClientPhoto = asyncHandler(async (req, res, next) => {
  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    throw new MyError("Та зураг upload хийнэ үү.", 400);
  }

  file.name = `client_${uuidv4()}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/user/${file.name}`, (err) => {
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
