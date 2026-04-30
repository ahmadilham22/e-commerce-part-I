import productService from '../service/product-service.js';
import {
  sendCreateResponse,
  sendDeleteResponse,
  sendGetResponse,
  sendUpdateResponse,
} from '../utils/response-handler.js';

const getProduct = async (req, res, next) => {
  try {
    const result = await productService.get(req);
    res.status(200).json({
      data: result.data,
      paging: result.paging
    })
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const result = await productService.create(req);
    sendCreateResponse(res, 'Successfully created product');
  } catch (error) {
    next(error);
  }
};

const getOneProduct = async (req, res, next) => {
  try {
    const result = await productService.getOne(req);
    sendGetResponse(res, result);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const result = await productService.update(req);
    sendUpdateResponse(res, result);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const result = await productService.remove(req);
    sendDeleteResponse(res);
  } catch (error) {
    next(error);
  }
};

export default {
  getProduct,
  createProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
};
