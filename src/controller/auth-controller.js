import authService from '../service/auth-service.js';
import { sendCreateResponse } from '../utils/response-handler.js';

const signin = async (req, res, next) => {
  try {
    const result = await authService.login(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const result = await authService.create(req);
    sendCreateResponse(res, 'Successfully registered');
  } catch (error) {
    next(error);
  }
};

export default { signin, register };
