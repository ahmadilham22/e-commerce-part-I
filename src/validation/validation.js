import { ResponseError } from '../error/response-error.js';

const validate = (schema, request) => {
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (result.error) {
    const validationError = result.error.details.map((detail) =>
      detail.message.replace(/"/g, '')
    );

    throw new ResponseError(400, validationError[0]);
  } else {
    return result.value;
  }
};

export { validate };
