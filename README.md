# Fullstack E-Commerce Application

A complete, production-ready E-Commerce application featuring a modern React frontend and a robust Node.js backend. This project implements seamless checkout flows, real-time cart updates, message broker notifications, and payment gateway integration.

## Key Features

- **Dynamic Shopping Experience:** Browse products with categories, search, and pagination.
- **Real-time Cart:** Add to cart and update quantities with instant UI synchronization (Custom Events API).
- **Secure Checkout (Midtrans):** Integrated with Midtrans Payment Gateway (Snap API) for seamless transactions.
- **Asynchronous Notifications:** Uses **RabbitMQ** as a message broker to process Midtrans webhooks and send instant Telegram notifications to the store owner without blocking the main server thread.
- **Authentication & Authorization:** Secure JWT-based login and registration.
- **Admin Dashboard:** Manage products, categories, and track recent orders.

---

## Technology Stack

### Frontend (Client)
- **React.js** (Vite)
- **Tailwind CSS** (for rapid, modern styling)
- **Lucide React** (icons)
- **Swiper JS** (interactive carousels)
- **Axios** (API requests)

### Backend (API)
- **Node.js & Express.js**
- **Prisma ORM** (Database access)
- **PostgreSQL** (Relational Database)
- **RabbitMQ** (Message Broker for background tasks)
- **Joi** (Request validation)
- **Winston** (Logging)

### Third-Party Integrations
- **Midtrans API** - Payment Gateway
- **Telegram Bot API** - Order Notifications
- **Cloudinary** - Image Storage

---

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- RabbitMQ Server (Running locally or via Docker)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/e-commerce.git
cd e-commerce
```

### 2. Backend Setup
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start the Express server (Runs on port 5000)
npm run dev

# (Optional) In a new terminal, start the RabbitMQ Telegram Worker
node src/worker/telegramWorker.js
```
*Note: Make sure to fill in your `DATABASE_URL`, `JWT_SECRET`, `MIDTRANS_SERVER_KEY`, and `TELEGRAM_BOT_TOKEN` in the `.env` file.*

### 3. Frontend Setup
```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

---

## Project Structure

```text
e-commerce/
├── frontend/           # React + Vite application
│   ├── src/
│   │   ├── components/ # Reusable UI components (Navbar, Cart, etc.)
│   │   ├── pages/      # Route pages (Home, Products, Admin, etc.)
│   │   └── utils/      # Axios API configuration
│
├── src/                # Express Backend
│   ├── controller/     # Request handlers
│   ├── middleware/     # JWT Auth & Error handlers
│   ├── router/         # Public and Private API routes
│   ├── service/        # Business logic (Order processing, Checkout)
│   ├── worker/         # RabbitMQ workers (Telegram notifications)
│   └── validation/     # Joi validation schemas
│
└── prisma/
    └── schema.prisma   # Database schema
```

---

## Database Architecture
- `Users` - Stores authentication and user details.
- `Products` & `Categories` - Product catalog management.
- `Carts` & `CartItems` - Shopping cart state.
- `Orders` & `OrderItems` - Transaction history and statuses (`PENDING`, `SUCCESS`, `CANCEL`).
