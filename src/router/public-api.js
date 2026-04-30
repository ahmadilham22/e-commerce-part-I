import express from 'express';
import userController from '../controller/user-controller.js';
import authController from '../controller/auth-controller.js';
import orderController from '../controller/order-controller.js';
import imageController from '../controller/image-controller.js';

const publicRoute = express.Router();

// auth routes
publicRoute.post('/api/auth/signup', authController.register);
publicRoute.post('/api/auth/signin', authController.signin);

// notification routes
publicRoute.post('/api/notification', orderController.notification);

// get images
publicRoute.get("/api/products/:id/images", imageController.get)


export { publicRoute };
