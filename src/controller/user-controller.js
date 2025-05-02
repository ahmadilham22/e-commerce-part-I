import userService from '../service/user-service.js';
import {
  sendDeleteResponse,
  sendGetResponse,
} from '../utils/response-handler.js';

const get = async (req, res, next) => {
  try {
    const result = await userService.get();
    sendGetResponse(res, result);
  } catch (error) {
    next(error);
  }
};

const getOneUser = async (req, res, next) => {
  try {
    const result = await userService.getOne(req);
    sendGetResponse(res, result);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.remove(req);
    sendDeleteResponse(res);
  } catch (error) {
    next(error);
  }
};

export default {
  getOneUser,
  deleteUser,
  get,
};
