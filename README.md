# E-Commerce REST API

A robust, production-ready RESTful API for an E-Commerce platform built with Express.js, Prisma ORM, and PostgreSQL. This backend service handles everything from user authentication and product catalogs to secure payment processing and asynchronous background tasks.

## Key Features

- **Authentication & Authorization:** Secure JWT-based user login and registration.
- **Product Management:** Full CRUD operations for products and hierarchical categories.
- **Shopping Cart:** Cart state management with dynamic quantity updates.
- **Checkout & Orders:** Transaction processing and order state management (PENDING, SUCCESS, CANCEL).
- **Payment Gateway (Midtrans):** Integrated with Midtrans Snap API for secure checkout, including automated server-to-server webhook validation.
- **Asynchronous Notifications:** Implements **RabbitMQ** as a message broker to process webhook events and send Telegram notifications via background workers, preventing thread-blocking on the main server.
- **Request Validation:** Strict payload validation using Joi.

---

## Technology Stack

- **Node.js & Express.js** - Server framework
- **Prisma ORM** - Database access and migrations
- **PostgreSQL** - Relational Database
- **RabbitMQ** - Message Broker for background tasks
- **Joi** - Request payload validation
- **Winston** - Logging

### Third-Party Services
- **Midtrans API** - Payment processing
- **Telegram Bot API** - Real-time order notifications
- **Cloudinary** - Image Storage

---

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- RabbitMQ Server (Running locally or via Docker)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/e-commerce-backend.git
cd e-commerce-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add the following variables:
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

### 4. Database Setup
Run the Prisma migrations to set up your PostgreSQL database schema:
```bash
npx prisma migrate dev
```

### 5. Running the Application

To start the main Express server (API):
```bash
npm run dev
```

To start the background worker for Telegram notifications (Run this in a separate terminal):
```bash
node src/worker/telegramWorker.js
```

---

## Project Structure

```text
src/
├── app/            # Application config (Express, DB connection, logging)
├── controller/     # Request handlers
├── error/          # Custom error classes
├── middleware/     # JWT Auth & Error middlewares
├── router/         # Public and Private API route definitions
├── service/        # Business logic (Checkout, Webhooks)
├── utils/          # Utilities (Midtrans, Multer, RabbitMQ connection)
├── worker/         # RabbitMQ consumers/workers
└── validation/     # Joi validation schemas
prisma/
├── schema.prisma   # Database schema
└── migrations/     # Database migration history
```

---

## Database Architecture
- `Users` - Stores authentication and user details.
- `Products` & `Categories` - Product catalog management.
- `Carts` & `CartItems` - Shopping cart state.
- `Orders` & `OrderItems` - Transaction history and statuses.
