import express from 'express';
import productController from '../controller/product-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';
import userController from '../controller/user-controller.js';
import categoryController from '../controller/category-controller.js';

const privateRoute = express.Router();

// product routes
privateRoute.get('/api/products', authMiddleware, productController.getProduct);
privateRoute.post(
  '/api/products',
  authMiddleware,
  productController.createProduct
);
privateRoute.get(
  '/api/products/:id',
  authMiddleware,
  productController.getOneProduct
);
privateRoute.put(
  '/api/products/:id',
  authMiddleware,
  productController.updateProduct
);
privateRoute.delete(
  '/api/products/:id',
  authMiddleware,
  productController.deleteProduct
);

// user routes
privateRoute.get('/api/users', authMiddleware, userController.get);
privateRoute.get('/api/users/:id', authMiddleware, userController.getOneUser);
privateRoute.delete(
  '/api/users/:id',
  authMiddleware,
  userController.deleteUser
);

// category routes
privateRoute.post(
  '/api/category',
  authMiddleware,
  categoryController.createCategory
);
privateRoute.get(
  '/api/category',
  authMiddleware,
  categoryController.getAllCategory
);
privateRoute.put(
  '/api/category/:id',
  authMiddleware,
  categoryController.updateCategory
);
privateRoute.delete(
  '/api/category/:id',
  authMiddleware,
  categoryController.removecategory
);

export { privateRoute };
