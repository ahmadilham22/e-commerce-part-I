import { prismaClient } from '../app/database.js';
import { validate } from '../validation/validation.js';
import {
  register,
  updateUserValidation,
} from '../validation/user-validation.js';
import { ResponseError } from '../error/response-error.js';
import bcrypt from 'bcrypt';

const get = async () => {
  const result = await prismaClient.user.findMany();

  return result;
};

const getMe = async (req) => {
  const userId = parseInt(req.user.id);
  if (!userId) {
    throw new ResponseError(404, 'user is not found');
  }

  const result = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true, name: true, email: true, phone_number: true
    }
  });

  return result
};

const getOne = async (req) => {
  const userId = parseInt(req.params.id);
  const result = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  return result;
};

const remove = async (req) => {
  const userId = parseInt(req.params.id);
  const result = await prismaClient.user.delete({
    where: {
      id: userId,
    },
  });

  return result;
};

const update = async (req) => {
  const userValidated = validate(updateUserValidation, req.body);
};

export default {
  get,
  getOne,
  remove,
  getMe
};
