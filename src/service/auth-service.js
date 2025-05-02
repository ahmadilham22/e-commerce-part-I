import jwt from 'jsonwebtoken';
import { prismaClient } from '../app/database.js';
import { ResponseError } from '../error/response-error.js';
import { loginValidation, register } from '../validation/user-validation.js';
import { validate } from '../validation/validation.js';
import bcrypt from 'bcrypt';

const login = async (req) => {
  const user = validate(loginValidation, req.body);

  const findUser = await prismaClient.user.findFirst({
    where: {
      email: user.email,
    },
  });

  if (!findUser) {
    throw new ResponseError(404, `User not found`);
  }

  const isPasswordValid = await bcrypt.compare(
    user.password,
    findUser.password
  );

  if (!isPasswordValid) {
    throw new ResponseError(400, `Email or password mismatch`);
  }

  const payload = {
    id: findUser.id,
    email: findUser.email,
    password: findUser.password,
  };

  const token = jwt.sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: '72h',
  });

  return token;
};

const create = async (req) => {
  const data = req.body;
  const registerValidation = validate(register, data);

  const countEmail = await prismaClient.user.count({
    where: {
      email: registerValidation.email,
    },
  });

  if (countEmail >= 1) {
    throw new ResponseError(400, 'Email already exists');
  }

  const hashPssword = await bcrypt.hash(registerValidation.password, 10);
  registerValidation.password = hashPssword;

  const result = await prismaClient.user.create({
    data: registerValidation,
  });

  return result;
};

export default { login, create };
