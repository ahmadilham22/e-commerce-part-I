import express from 'express';
import productController from '../controller/product-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';
import userController from '../controller/user-controller.js';
import categoryController from '../controller/category-controller.js';
import orderController from '../controller/order-controller.js';
import imageController from '../controller/image-controller.js';
import { upload } from '../utils/multer.js';
import cartController from '../controller/cart-controller.js';

const privateRoute = express.Router();

// product routes
privateRoute.get(
  '/api/me/products',
  authMiddleware,
  productController.getByUserID
);
privateRoute.post(
  '/api/products',
  authMiddleware,
  productController.createProduct
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
privateRoute.get('/api/users/me', authMiddleware, userController.getMe);
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

// order routes
privateRoute.post(
  '/api/order',
  authMiddleware,
  orderController.created
);

privateRoute.get(
  '/api/order',
  authMiddleware,
  orderController.getOrder
)

privateRoute.post("/api/orders/carts", authMiddleware, orderController.checkoutCart)

privateRoute.get(
  '/api/orders',
  authMiddleware,
  orderController.getOrderByUserId
)

// Image routes
privateRoute.post("/api/products/:id/images", authMiddleware, upload.single("image"), imageController.upload)
privateRoute.put("/api/products/:id/images/:image_id", authMiddleware, imageController.update)
privateRoute.delete("/api/products/:id/images/:image_id", authMiddleware, imageController.remove)


// Cart routes
privateRoute.post("/api/carts/items", authMiddleware, cartController.create)
privateRoute.get("/api/carts/items", authMiddleware, cartController.get)
privateRoute.put("/api/carts/items/:item_id", authMiddleware, cartController.update)
privateRoute.delete("/api/carts/items/:item_id", authMiddleware, cartController.remove)

export { privateRoute };
