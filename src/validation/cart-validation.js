import Joi from "joi";

const createCartValidation = Joi.object({
    product_id: Joi.number().required(),
    quantity: Joi.number().min(1).required(),
})

const updateCartValidation = Joi.object({
    quantity: Joi.number().min(1).optional(),
})

export {
  createCartValidation,
  updateCartValidation
}