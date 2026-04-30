# E-Commerce API

REST API untuk aplikasi e-commerce yang dibangun dengan Express.js, Prisma ORM, dan PostgreSQL. Dilengkapi dengan payment gateway Midtrans, upload gambar via Cloudinary, dan notifikasi Telegram.

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

## Fitur

- **Authentication** - Register & login dengan JWT
- **Product Management** - CRUD produk dengan kategori
- **Product Images** - Upload & kelola gambar produk (Cloudinary)
- **Category Management** - CRUD kategori produk
- **Shopping Cart** - Tambah, update, hapus item di keranjang
- **Order & Checkout** - Buat pesanan langsung atau dari keranjang
- **Payment Gateway** - Integrasi Midtrans untuk pembayaran
- **Telegram Notification** - Notifikasi otomatis saat ada pesanan baru
- **User Management** - Kelola data user

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

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/signup` | Register user baru |
| POST | `/api/auth/signin` | Login user |
| GET | `/api/products/:id/images` | Ambil gambar produk |
| POST | `/api/notification` | Webhook notifikasi Midtrans |

### Private Routes (Butuh Authentication)

**Products**
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/products` | Ambil semua produk |
| POST | `/api/products` | Buat produk baru |
| GET | `/api/products/:id` | Ambil detail produk |
| PUT | `/api/products/:id` | Update produk |
| DELETE | `/api/products/:id` | Hapus produk |

**Categories**
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/category` | Ambil semua kategori |
| POST | `/api/category` | Buat kategori baru |
| PUT | `/api/category/:id` | Update kategori |
| DELETE | `/api/category/:id` | Hapus kategori |

**Orders**
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/order` | Buat pesanan baru |
| GET | `/api/order` | Ambil daftar pesanan |
| POST | `/api/orders/carts` | Checkout dari keranjang |

**Cart**
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/carts/items` | Tambah item ke keranjang |
| GET | `/api/carts/items` | Ambil isi keranjang |
| PUT | `/api/carts/items/:item_id` | Update jumlah item |
| DELETE | `/api/carts/items/:item_id` | Hapus item dari keranjang |

**Images**
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/products/:id/images` | Upload gambar produk |
| PUT | `/api/products/:id/images/:image_id` | Update gambar produk |
| DELETE | `/api/products/:id/images/:image_id` | Hapus gambar produk |

**Users**
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/users` | Ambil semua user |
| GET | `/api/users/:id` | Ambil detail user |
| DELETE | `/api/users/:id` | Hapus user |

## Instalasi

### Prerequisites

- Node.js v18+
- PostgreSQL

### Setup

1. Clone repository
   ```bash
   git clone https://github.com/username/e-commerce.git
   cd e-commerce
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Buat file `.env`
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

4. Jalankan migrasi database
   ```bash
   npx prisma migrate dev
   ```

5. Jalankan server
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
├── middleware/      # Auth & error middleware
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
