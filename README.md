# 🛒 E-Commerce REST API

A scalable, secure, and production-ready backend RESTful API for an modern e-commerce platform built with **Node.js**, **Express.js**, **MongoDB (Mongoose)**, **JWT Authentication**, and **Stripe Payment Gateway** integration.

---

## 🚀 Features

- **🔐 Authentication & Authorization (RBAC)**
  - User registration and login with encrypted passwords (`bcrypt`).
  - Role-based access control with distinct privileges (`admin` and `customer`).
  - Secure session management via JWT stored in HTTP cookies.

- **📦 Product Management**
  - Admin-only product creation (`name`, `description`, `price`, `category`).
  - Flexible product catalog query engine featuring:
    - Text search by name (case-insensitive regex).
    - Category filtering.
    - Upper-bound price filtering (`$lte`).
    - Paginated responses (`page`, `limit`, `totalPages`, `totalProducts`).
  - Detailed product lookup by ID.

- **🛍️ Cart Management**
  - Add items to cart with dynamic quantity incrementation.
  - View user cart populated with full product details (`name`, `price`, `category`).
  - Remove specific line items or clear the entire cart.

- **💳 Stripe Payment & Orders**
  - Create orders directly from current cart contents.
  - Automatically calculates itemized totals and order summaries.
  - Generates hosted **Stripe Checkout Sessions** with line-item detail.
  - Robust **Stripe Webhook** handler verifying cryptographic signatures (`stripe-signature`).
  - Automatic order status updates to `Paid` and cart clearance upon checkout completion.

- **🐳 Docker Ready**
  - Fully containerized with Node.js 20 base image and configured `.dockerignore`.

---

## 🛠️ Tech Stack

| Technology | Role |
| :--- | :--- |
| **Node.js** (v20+) | JavaScript runtime environment |
| **Express.js** (v5) | Web server framework |
| **MongoDB & Mongoose** | NoSQL database and object data modeling (ODM) |
| **Stripe SDK** | Online payments and checkout session lifecycle |
| **JSON Web Tokens (JWT)** | Token-based stateless authentication |
| **Bcrypt** | Password hashing (salt rounds: 10) |
| **Cookie-Parser** | HTTP cookie extraction middleware |
| **Docker** | Containerization for consistent deployments |

---

## 📂 Project Structure

```text
E-commerce/
├── src/
│   ├── app.js                   # Express application setup & middleware mounts
│   ├── controllers/
│   │   ├── auth.controller.js   # User registration & login handlers
│   │   ├── cart.controller.js   # Cart CRUD business logic
│   │   ├── order.controller.js  # Order creation & Stripe session generator
│   │   └── product.controller.js# Product CRUD, search & pagination logic
│   ├── db/
│   │   └── db.js                # MongoDB connection handler via Mongoose
│   ├── middleware/
│   │   └── auth.middleware.js   # JWT verification & RBAC (admin/customer)
│   ├── models/
│   │   ├── cart.model.js        # Cart Mongoose schema
│   │   ├── order.model.js       # Order Mongoose schema
│   │   ├── product.model.js     # Product Mongoose schema
│   │   └── user.model.js        # User Mongoose schema (roles: admin, customer)
│   └── routes/
│       ├── auth.routes.js       # Routes for auth, products, cart & orders
│       └── stripe.routes.js     # Stripe raw webhook listener
├── .dockerignore                # Files excluded from Docker builds
├── .env.example                 # Template for required environment variables
├── Dockerfile                   # Docker build instructions
├── package.json                 # Project dependencies & scripts
├── server.js                    # Application entry point ( port 3000)
└── README.md                    # Project documentation
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory following `.env.example`:

```env
# Server
PORT=3000

# MongoDB Database URI
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Stripe Integration
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🏁 Getting Started

### 1. Prerequisites
- **Node.js** (v20 or higher)
- **MongoDB** instance (Local or MongoDB Atlas)
- **Stripe Account** (for test API keys and webhook secret)
- **Docker** *(optional, if running inside a container)*

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/asad218/E-Commerce-App.git
cd E-Commerce-App
npm install
```

### 3. Running the Server

#### Development Mode (with file watcher):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

The server will start at `http://localhost:3000`.

---

## 🐳 Running with Docker

You can build and run the application container using Docker:

```bash
# Build the Docker image
docker build -t ecommerce-api .

# Run the container
docker run -p 3000:3000 --env-file .env ecommerce-api
```

---

## 📡 API Reference

Base URL: `http://localhost:3000/api`

### 1. Authentication

#### Register a User
- **Endpoint:** `POST /api/auth/register` (or `POST /api/register`)
- **Access:** Public
- **Request Body:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "strongpassword123",
    "role": "customer" // "customer" or "admin" (default: "customer")
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "user created successfully",
    "user": {
      "id": "66d8...",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
  ```

#### Login
- **Endpoint:** `POST /api/auth/log-in` (or `POST /api/log-in`)
- **Access:** Public
- **Request Body:**
  ```json
  {
    "username": "john_doe", // or email
    "password": "strongpassword123"
  }
  ```
- **Response (200 OK):** Sets HTTP cookie `token=<jwt>`
  ```json
  {
    "message": "Login successfull",
    "user": {
      "id": "66d8...",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
  ```

---

### 2. Products

#### Create Product
- **Endpoint:** `POST /api/create-product`
- **Access:** Protected (`admin` role required)
- **Request Body:**
  ```json
  {
    "name": "Wireless Bluetooth Headphones",
    "description": "Noise-cancelling over-ear headphones",
    "price": 4999,
    "category": "Electronics"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "product created successfully",
    "product": {
      "_id": "66d8...",
      "name": "Wireless Bluetooth Headphones",
      "description": "Noise-cancelling over-ear headphones",
      "price": 4999,
      "category": "Electronics",
      "rating": 0
    }
  }
  ```

#### Get All Products
- **Endpoint:** `GET /api/get-all-products`
- **Access:** Protected (`customer` or `admin`)
- **Query Parameters:**
  | Parameter | Type | Description |
  | :--- | :--- | :--- |
  | `category` | String | Filter products by category |
  | `price` | Number | Filter products with price $\le$ value |
  | `search` | String | Case-insensitive regex search on product name |
  | `page` | Number | Page number (default: `1`) |
  | `limit` | Number | Items per page (default: `5`) |
- **Example:** `GET /api/get-all-products?category=Electronics&price=5000&page=1&limit=10`
- **Response (200 OK):**
  ```json
  {
    "message": "products fetched successfully",
    "currentPage": 1,
    "limit": 10,
    "totalProducts": 1,
    "totalPages": 1,
    "products": [...]
  }
  ```

#### Get Product by ID
- **Endpoint:** `GET /api/get-product/:id`
- **Access:** Protected (`customer` or `admin`)
- **Response (200 OK):**
  ```json
  {
    "message": "product fetched successfully",
    "product": { ... }
  }
  ```

---

### 3. Shopping Cart

#### Add to Cart
- **Endpoint:** `POST /api/add/cart`
- **Access:** Protected (`customer` or `admin`)
- **Request Body:**
  ```json
  {
    "productId": "66d8a1b2...",
    "quantity": 2
  }
  ```
- **Response (200 OK):** Returns updated cart document.

#### Get Current User Cart
- **Endpoint:** `GET /api/cart`
- **Access:** Protected (`customer` or `admin`)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "cart": {
      "_id": "66d8...",
      "user": "66d8...",
      "items": [
        {
          "product": {
            "_id": "66d8...",
            "name": "Wireless Bluetooth Headphones",
            "price": 4999,
            "category": "Electronics"
          },
          "quantity": 2
        }
      ]
    }
  }
  ```

#### Remove Single Item from Cart
- **Endpoint:** `DELETE /api/remove/:productId`
- **Access:** Protected (`customer` or `admin`)
- **Response (200 OK):** Returns cart with item removed.

#### Clear Entire Cart
- **Endpoint:** `DELETE /api/clear`
- **Access:** Protected (`customer` or `admin`)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Cart cleared"
  }
  ```

---

### 4. Orders & Stripe Payments

#### Create Order & Initiate Checkout
- **Endpoint:** `POST /api/create-order`
- **Access:** Protected
- **Request Body:**
  ```json
  {
    "paymentMethod": "Stripe"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Order created successfully",
    "order": {
      "_id": "66d8...",
      "user": "66d8...",
      "items": [...],
      "totalAmount": 9998,
      "totalProducts": 2,
      "paymentMethod": "Stripe",
      "paymentStatus": "Pending",
      "orderStatus": "Pending"
    },
    "url": "https://checkout.stripe.com/c/pay/cs_test_..."
  }
  ```

#### Stripe Webhook
- **Endpoint:** `POST /api/stripe/webhook`
- **Access:** Public (Called by Stripe servers)
- **Headers:** `Stripe-Signature: <signature>`
- **Payload:** Raw binary JSON
- **Behavior:**
  1. Validates signature with `STRIPE_WEBHOOK_SECRET`.
  2. On `checkout.session.completed`:
     - Sets order `paymentStatus` to `Paid`.
     - Automatically clears the user's active cart.

---

## 🧪 Testing Stripe Webhooks Locally

Use the official [Stripe CLI](https://docs.stripe.com/stripe-cli) to forward webhook events to your local server:

```bash
# 1. Login to your Stripe account
stripe login

# 2. Forward events to local webhook route
stripe listen --forward-to localhost:3000/api/stripe/webhook

# 3. Copy the webhook signing secret from the CLI output and set it in your .env:
# STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🛡️ License

This project is licensed under the [ISC License](LICENSE).
