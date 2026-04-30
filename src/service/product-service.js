import { prismaClient } from '../app/database.js';
import { ResponseError } from '../error/response-error.js';
import {
  createProductValidation,
  searchProductValidation,
  updateProductValidation,
} from '../validation/product-validation.js';
import { validate } from '../validation/validation.js';

const get = async (req) => {
  const validated = validate(searchProductValidation, req.query)
  const {name, category_id, min_price, max_price, page, limit} = validated
  const where = {};

  if (name) {
    where.name = {contains: name, mode: "insensitive"}
  }

  if (category_id) {
    where.category_id = category_id
  }

  if (min_price || max_price) {
    where.price = {}
    if (min_price) where.price.gte = min_price
    if (max_price) where.price.lte = max_price
  }

  let skip = (page - 1) * limit
  let take = limit

  const [data, total] = await prismaClient.$transaction([
    prismaClient.product.findMany({
      where,
      skip,
      take,
    }),
    prismaClient.product.count({
      where: where
    })
  ])

  return {
    data: data,
    paging: {
      current_page: page,
      total_pages: Math.ceil(total/take),
      total_items: total,
      size: take
    }
  };
};

const create = async (req) => {
  const productValidated = validate(createProductValidation, req.body);

  productValidated.user_id = req.user.id;
  const result = await prismaClient.product.create({
    data: productValidated,
  });

  return result;
};

const getOne = async (req) => {
  const productId = parseInt(req.params.id);

  const result = await prismaClient.product.findUnique({
    where: {
      id: productId,
    },
  });

  return result;
};

const update = async (req) => {
  const productId = parseInt(req.params.id);
  const productValidated = validate(updateProductValidation, req.body);

  const productExist = await prismaClient.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!productExist) {
    throw new ResponseError(404, 'Product not found');
  }

  return prismaClient.product.update({
    where: {
      id: productExist.id,
    },
    data: productValidated,
  });
};

const remove = async (req) => {
  const productId = parseInt(req.params.id);

  const productExist = await prismaClient.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!productExist) {
    throw new ResponseError(404, 'Product not found');
  }

  return prismaClient.product.delete({
    where: {
      id: productExist.id,
    },
  });
};

export default {
  get,
  create,
  getOne,
  update,
  remove,
};
