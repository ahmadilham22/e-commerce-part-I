import Joi from 'joi';

const createProductValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().precision(2).required(),
  stock: Joi.number().integer().required(),
  category_id: Joi.number().integer().required(),
});

const updateProductValidation = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().precision(2).optional(),
  stock: Joi.number().integer().optional(),
  category_id: Joi.number().integer().optional(),
});

const searchProductValidation = Joi.object({
  name: Joi.string().optional(),
  category_id: Joi.number().integer().optional(),
  min_price: Joi.number().min(0).optional(),
  max_price: Joi.number().min(0).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
})

export { searchProductValidation,createProductValidation, updateProductValidation };
