# E-Commerce API

REST API for an e-commerce application built with Express.js, Prisma ORM, and PostgreSQL. Includes Midtrans payment gateway, image upload via Cloudinary, and Telegram notifications.

## Tech Stack

- Node.js & Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Joi (request validation)
- Winston (logging)
- Vitest & Supertest (testing)

**Third-Party Services:**
- Midtrans - Payment Gateway
- Cloudinary - Image Upload & Storage
- Telegram Bot API - Order Notification

## Features

- **Authentication** - Register & login with JWT
- **Product Management** - CRUD products with categories
- **Product Images** - Upload & manage product images (Cloudinary)
- **Category Management** - CRUD product categories
- **Shopping Cart** - Add, update, and remove items in the cart
- **Order & Checkout** - Create orders directly or from the cart
- **Payment Gateway** - Midtrans integration for payments
- **Telegram Notification** - Automatic notification when a new order arrives
- **User Management** - Manage user data

## Database Schema

```
Users ──< Products ──< Images
  │          │
  │          ├──< CartItems >── Carts >── Users
  │          │
  │          └──< OrderItems >── Orders >── Users
  │
  └──< Orders
  └──< Carts

Categories ──< Products
```

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/signin` | User login |
| GET | `/api/products/:id/images` | Get product images |
| POST | `/api/notification` | Midtrans notification webhook |

### Private Routes (Authentication Required)

**Products**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Create a new product |
| GET | `/api/products/:id` | Get product details |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

**Categories**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/category` | Get all categories |
| POST | `/api/category` | Create a new category |
| PUT | `/api/category/:id` | Update a category |
| DELETE | `/api/category/:id` | Delete a category |

**Orders**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/order` | Create a new order |
| GET | `/api/order` | Get the list of orders |
| POST | `/api/orders/carts` | Checkout from the cart |

**Cart**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/carts/items` | Add an item to the cart |
| GET | `/api/carts/items` | Get cart contents |
| PUT | `/api/carts/items/:item_id` | Update item quantity |
| DELETE | `/api/carts/items/:item_id` | Remove an item from the cart |

**Images**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/products/:id/images` | Upload a product image |
| PUT | `/api/products/:id/images/:image_id` | Update a product image |
| DELETE | `/api/products/:id/images/:image_id` | Delete a product image |

**Users**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user details |
| DELETE | `/api/users/:id` | Delete a user |

## Installation

### Prerequisites

- Node.js v18+
- PostgreSQL

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/username/e-commerce.git
   cd e-commerce
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
   JWT_SECRET="your_jwt_secret"
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   MIDTRANS_SERVER_KEY="your_midtrans_server_key"
   TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
   TELEGRAM_CHAT_ID="your_chat_id"
   ```

4. Run database migrations
   ```bash
   npx prisma migrate dev
   ```

5. Start the server
   ```bash
   npm start
   ```

## Testing

```bash
npm test
```

## Project Structure

```
src/
├── app/            # App config (Express, database, logging)
├── controller/     # Request handlers
├── error/          # Custom error classes
├── middleware/     # Auth & error middleware
├── router/         # Route definitions
├── service/        # Business logic
├── utils/          # Utilities (Cloudinary, Midtrans, Multer, Telegram)
└── validation/     # Request validation schemas
prisma/
├── schema.prisma   # Database schema
├── migrations/     # Database migrations
└── seeders/        # Database seeders
test/               # Integration tests
```
