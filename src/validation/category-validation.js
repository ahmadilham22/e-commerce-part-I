import Joi from 'joi';

const createCategoryValidation = Joi.object({
  name: Joi.string().required(),
});

const updateCategoryValidation = Joi.object({
  name: Joi.string().optional(),
});

export { createCategoryValidation, updateCategoryValidation };
