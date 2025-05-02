import { prismaClient } from '../app/database.js';
import { ResponseError } from '../error/response-error.js';
import {
  createCategoryValidation,
  updateCategoryValidation,
} from '../validation/category-validation.js';
import { validate } from '../validation/validation.js';

const create = async (req) => {
  const category = validate(createCategoryValidation, req.body);

  const countCategory = await prismaClient.category.count({
    where: {
      name: category.name,
    },
  });

  if (countCategory >= 1) {
    throw new ResponseError(400, 'Category has been exist');
  }

  const result = await prismaClient.category.create({
    data: category,
  });

  return result;
};

const get = async () => {
  const result = await prismaClient.category.findMany();

  return result;
};

const update = async (req) => {
  const categoryId = parseInt(req.params.id);
  const category = validate(updateCategoryValidation, req.body);

  const categoryExist = await prismaClient.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (categoryExist.name === category.name) {
    throw new ResponseError(400, 'Category exist');
  }

  return prismaClient.category.update({
    where: {
      id: categoryId,
    },
    data: category,
  });
};

const remove = async (req) => {
  const categoryId = parseInt(req.params.id);

  const result = await prismaClient.category.delete({
    where: {
      id: categoryId,
    },
  });

  return result;
};

export default {
  create,
  get,
  update,
  remove,
};
