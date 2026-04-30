import Joi from "joi";

const uploadImageValidation = Joi.object({
  is_primary: Joi.boolean().optional().truthy("true").falsy("false")
})

const updateImageValidation = Joi.object({
  is_primary: Joi.boolean().required()
})

export {
  uploadImageValidation,
  updateImageValidation
}