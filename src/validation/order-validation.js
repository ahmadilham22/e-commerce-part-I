import Joi from "joi";

const createOrderValidation = Joi.object({
  items: Joi.array().items(
    Joi.object({
      product_id: Joi.number().required(),
      quantity: Joi.number().required(),
    })
  ).required(),
  
})

export {
  createOrderValidation
}