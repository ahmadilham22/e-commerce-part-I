import { prismaClient } from '../app/database.js';
import { ResponseError } from '../error/response-error.js';
import {
  createProductValidation,
  updateProductValidation,
} from '../validation/product-validation.js';
import { validate } from '../validation/validation.js';

const get = async (req) => {
  const { category, startPrice, endPrice } = req.query;
  const filter = {};

  if (category) {
    filter.category_id = parseInt(category);
  }

  if (startPrice || endPrice) {
    filter.price = {
      ...(startPrice && { gte: parseInt(startPrice) }),
      ...(endPrice && { gte: parseInt(endPrice) }),
    };
  }

  const result = await prismaClient.product.findMany({
    where: filter,
  });

  return result;
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
