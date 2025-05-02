import express from 'express';
import userController from '../controller/user-controller.js';
import authController from '../controller/auth-controller.js';

const publicRoute = express.Router();

// auth routes
publicRoute.post('/api/auth/signup', authController.register);
publicRoute.post('/api/auth/signin', authController.signin);

export { publicRoute };
