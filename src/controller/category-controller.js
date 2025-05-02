import categoryService from '../service/category-service.js';
import {
  sendCreateResponse,
  sendDeleteResponse,
  sendGetResponse,
  sendUpdateResponse,
} from '../utils/response-handler.js';

const createCategory = async (req, res, next) => {
  try {
    const result = await categoryService.create(req);
    sendCreateResponse(res, result);
  } catch (error) {
    next(error);
  }
};

const getAllCategory = async (req, res, next) => {
  try {
    const result = await categoryService.get();
    sendGetResponse(res, result);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const result = await categoryService.update(req);
    sendUpdateResponse(res, result);
  } catch (error) {
    next(error);
  }
};

const removecategory = async (req, res, next) => {
  try {
    const result = await categoryService.remove(req);
    sendDeleteResponse(res);
  } catch (error) {
    next(error);
  }
};

export default {
  createCategory,
  getAllCategory,
  updateCategory,
  removecategory,
};
