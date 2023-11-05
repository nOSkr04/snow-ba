import Customer from "../models/Customer.js";
import path from "path";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";

// api/v1/customers
export const getCustomers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Customer);

  const customers = await Customer.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: customers.length,
    data: customers,
    pagination,
  });
});

export const getCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  customer.seen += 1;
  customer.save();

  res.status(200).json({
    success: true,
    data: customer,
  });
});

export const createCustomer = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const customer = await Customer.create(req.body);

  res.status(200).json({
    success: true,
    data: customer,
  });
});

export const deleteCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    customer.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  customer.remove();

  res.status(200).json({
    success: true,
    data: customer,
    whoDeleted: user.name,
  });
});

export const updateCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (
    customer.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    customer[attr] = req.body[attr];
  }

  customer.save();

  res.status(200).json({
    success: true,
    data: customer,
  });
});
