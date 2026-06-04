import express from 'express';
import userController from '../controller/user-controller.js';
import authController from '../controller/auth-controller.js';
import orderController from '../controller/order-controller.js';
import imageController from '../controller/image-controller.js';
import productController from '../controller/product-controller.js';
import categoryController from '../controller/category-controller.js';

const publicRoute = express.Router();

// auth routes
publicRoute.post('/api/auth/signup', authController.register);
publicRoute.post('/api/auth/signin', authController.signin);

// notification routes
publicRoute.post('/api/notification', orderController.notification);

// get images
publicRoute.get("/api/products/:id/images", imageController.get)

// get products
publicRoute.get('/api/products', productController.getProduct);
publicRoute.get(
    '/api/products/:id',
    productController.getOneProduct
);

// category routes
publicRoute.get(
  '/api/category',
  categoryController.getAllCategory
);

export { publicRoute };
