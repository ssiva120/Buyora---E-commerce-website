# BUYOra - Full-Stack E-Commerce Application
**Tech Stack:** React 18, Spring Boot 3, Hibernate / JPA, Spring Security 6, JWT, H2 Database

---

## ?? Project Overview
**BUYOra** is a complete full-stack e-commerce web application designed with a decoupled 3-tier architecture. It allows customers to browse categorized products, search with real-time filters, manage a shopping cart, place orders with stock decrementing, and track order statuses. Administrators can manage product inventory and update order fulfillment statuses.

---

## ?? Key Features

1. **User Authentication & Role-Based Authorization**
   - User Registration & Login with **Spring Security 6** and **JWT (JSON Web Tokens)**.
   - Password encryption using **BCrypt**.
   - Distinct roles: `ROLE_CUSTOMER` and `ROLE_ADMIN`.

2. **Product Catalog & Browsing**
   - Multi-category filtering (Electronics, Fashion, Home & Kitchen, Books).
   - Instant search keyword query endpoint.
   - Rich product details page with rating, reviews, stock availability, and specs.

3. **Shopping Cart Management**
   - Synchronized cart with database persistence.
   - Add to cart, adjust item quantities, remove items, calculate tax, and compute real-time order subtotal.

4. **Order Processing & Concurrency Protection**
   - Multi-item checkout workflow with address capture.
   - Atomic database transactions with `@Transactional`.
   - Automatic inventory deduction upon successful order placement.
   - Live order history with status badges (`PROCESSING`, `SHIPPED`, `DELIVERED`).

5. **Admin Dashboard**
   - Add new products and manage inventory counts.
   - Delete products.
   - View all customer orders and update delivery lifecycle status in real time.

---

## ?? Project Architecture & Directory Structure

```
buyora-ecommerce/
+-- backend/                             # Spring Boot 3 REST API
¦   +-- pom.xml                          # Maven dependencies
¦   +-- src/main/
¦       +-- java/com/buyora/
¦       ¦   +-- config/                  # SecurityConfig, JWTFilter, CORS, JwtUtils
¦       ¦   +-- controller/              # Auth, Product, Category, Cart, Order, Admin REST Controllers
¦       ¦   +-- dto/                     # Request and Response DTOs
¦       ¦   +-- exception/               # GlobalExceptionHandler and Custom Exceptions
¦       ¦   +-- model/                   # User, Product, Category, Cart, CartItem, Order, OrderItem
¦       ¦   +-- repository/              # Spring Data JPA Repositories
¦       ¦   +-- service/                 # Business logic and transaction management
¦       ¦   +-- BuyoraApplication.java   # App entrypoint + database seed data
¦       +-- resources/
¦           +-- application.yml          # Database configuration & JWT properties
¦
+-- frontend/                            # React 18 Single Page Application
    +-- package.json                     # Frontend dependencies (React, Vite, Axios, Lucide)
    +-- vite.config.js                   # Vite dev server configuration
    +-- src/
        +-- api/                         # Axios client with JWT interceptor
        +-- components/                  # Navbar, Footer, ProductCard, ProtectedRoute
        +-- context/                     # AuthContext, CartContext (Global state)
        +-- pages/                       # Home, ProductDetail, Cart, Checkout, Orders, Login, Admin
```

---

## ?? Pre-Configured Test Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@buyora.com` | `admin123` | Full access, product creation, order status updates |
| **Customer** | `john@example.com` | `password123` | Browse catalog, add to cart, checkout, view order history |

---

## ?? How to Run the Project Locally

### 1. Prerequisites
- **Java JDK 17+**
- **Maven** (or Maven wrapper)
- **Node.js (v18+) & npm**

### 2. Running the Backend (Spring Boot)
1. Open a terminal in the `backend/` folder:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
2. The backend REST API will start at: `http://localhost:8080`
3. H2 In-Memory Database Web Console: `http://localhost:8080/h2-console`
   - **JDBC URL:** `jdbc:h2:mem:buyoradb`
   - **Username:** `sa`
   - **Password:** *(leave blank)*

### 3. Running the Frontend (React)
1. Open a second terminal in the `frontend/` folder:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser at: `http://localhost:3000` (or the URL displayed by Vite).
