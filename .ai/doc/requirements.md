# Scalable E-Commerce Backend API (Amazon/Flipkart Replica)
## Project Requirements Document (PRD)

This document outlines the architectural design, backend tech stack, database models, API modules, and scaling strategies for a highly scalable e-commerce backend platform built in Node.js, capable of handling **100,000 (1 Lakh) concurrent order requests** during peak load.

---

## 1. Executive Summary & Goals

### 1.1 Objective
To design and implement a production-grade, highly concurrent, and distributed e-commerce backend API. The system will support multi-tenancy (Super Admins, Sellers, and Buyers/Normal Users), rich product catalog management (categories and product variants), orders, transactions, wishlists, shipping, and refunds.

### 1.2 Key Performance Indicator (KPI) - High Scale
*   **Scale Target**: Handle **100,000 (1 Lakh) concurrent order requests** at a time.
*   **System Availability**: 99.99% uptime.
*   **Latency**: Order placement response time (acknowledgement) < 150ms.
*   **Data Integrity**: Zero double-selling of items; strict consistency for stock levels.

---

## 2. High-Concurrency & System Architecture Strategy

To handle 100k concurrent order requests, a traditional monolithic API that writes directly to a SQL database synchronously will fail due to database lock contention, connection pooling exhaustion, and disk I/O bottlenecks. We will employ the following architectural patterns:

### 2.1 Asynchronous Order Processing (Event-Driven Architecture)
*   **Ingress & Queuing**: Order creation requests are validated, stock is checked via Redis, and if available, the order is immediately pushed to a high-throughput message broker (e.g., **RabbitMQ** or **Apache Kafka**).
*   **Immediate Client Response**: The API server immediately returns a `202 Accepted` status with an `order_id` and a tracking token, releasing the HTTP connection.
*   **Background Workers**: A pool of decoupled Node.js worker processes consume messages from the queue, execute database transactions (create order record, deduct database inventory, create payment/transaction ledger), and update the order state.
*   **Notification**: Once the order is processed, the client is notified via WebSockets (Socket.io) or Web Push, or the frontend polls a status endpoint.

### 2.2 Redis-Based Inventory Reservation (Pre-allocation)
*   To prevent database locks on the `inventory` table during flash sales:
    *   Active product stock levels are cached in **Redis** keys.
    *   When an order is requested, the API server executes an atomic Redis command (e.g., `DECRBY` or a Lua script) to reserve inventory.
    *   If the Redis stock is decremented below zero, the request is immediately rejected with "Out of Stock" without hitting the database.
    *   If stock is reserved successfully, the order is queued for DB persistence.

### 2.3 Horizontal Scaling & Load Balancing
*   **API Gateways & Load Balancing**: Nginx or AWS Application Load Balancer (ALB) distributes incoming HTTP requests across a cluster of API nodes.
*   **Node.js Cluster / PM2**: Run multiple Node.js instances matching the CPU cores on each server instance.
*   **Docker & Kubernetes (K8s)**: Containerize the backend and auto-scale pods horizontally based on CPU/Memory thresholds.

---

## 3. Backend Technology Stack

The stack is strictly selected for backend scalability, performance, and developer efficiency.

*   **Runtime Environment**: Node.js (v20+ LTS)
*   **Programming Language**: TypeScript (strict mode for type-safety and robust enterprise code)
*   **Application Framework**: Express.js (v5+) with TypeScript
*   **Database (Primary Relational)**: MySQL (v8.0+)
    *   Supports structured transactional operations with ACID compliance.
    *   Drizzle ORM for type-safe query building and migrations.
    *   Configured in a **Primary-Replica** setup (writes go to Primary, reads are balanced across Replicas).
*   **Caching & Fast Stores**: Redis (v7.0+)
    *   Utilized for API response caching, rate limiting, user session storage, shopping carts, and atomic inventory reservation.
*   **Message Broker**: RabbitMQ or Apache Kafka
    *   For decoupling HTTP ingestion from core order writes.
*   **Task Queue / Background Jobs**: BullMQ (Redis-backed)
    *   For scheduled tasks, email notifications, transaction retries, and shipping status updates.
*   **Input Validation & Type Checking**: Zod (v3+)
*   **Security & Encryption**:
    *   JSON Web Token (JWT) for stateless authentication.
    *   Bcrypt.js for secure password hashing.
    *   Helmet for securing HTTP headers.
    *   CORS configured with strict origin whitelisting.

---

## 4. User Roles & Permission Matrix (RBAC)

The system supports four user roles, managed through Role-Based Access Control (RBAC):

1.  **Super Admin**:
    *   Full system visibility.
    *   Approve and onboard Sellers.
    *   Define global system commissions, view platform analytics, handle disputes, and manage categories.
2.  **Seller**:
    *   Create, update, and manage their own products, variants, and inventory.
    *   View orders containing their products.
    *   Initiate shipments for their orders.
    *   View earnings and manage store settings.
3.  **Buyer (Normal User)**:
    *   Browse catalog, filter categories, search products.
    *   Manage addresses, wishlist, and cart.
    *   Place orders, perform payment transactions, and request refunds.
4.  **Support/Operator (Optional)**:
    *   View order statuses and assist in customer refunds and shipping issues.

---

## 5. Functional Core Modules

### 5.1 Authentication & Authorization Module
*   Secure signup, login, password reset, and verification.
*   Token management (JWT in HttpOnly, secure cookies).
*   Middleware for Role-based routing: `checkRole(['super_admin', 'seller'])`.

### 5.2 Catalog Management (Products & Variants)
*   **Seller API**: Create products with attributes like colors, sizes, and pricing structures.
*   **Search & Filters**: Highly efficient query endpoint for buyers. Optimized with indices on categories, price ranges, ratings, and tags. Support for Elasticsearch / Algolia integration plan.

### 5.3 Wishlist & Address Management
*   Fast endpoints to manage favorites and multiple shipping locations.

### 5.4 High-Performance Order Processing Workflow
To fulfill the 100k concurrent order requests:
1.  **Step 1 (Ingestion)**: Client requests order checkout `POST /api/v1/orders`.
2.  **Step 2 (Redis Check & Deduct)**:
    *   API server runs a Redis Lua Script to check availability of all items in the payload.
    *   If items are available, decrement stock atomically and add client to the "active orders list" key.
3.  **Step 3 (Queue Entry)**: Push order payload to RabbitMQ/Kafka queue (`orders.create`).
4.  **Step 4 (Ack)**: Respond to the client with `202 Accepted` + tracking ID.
5.  **Step 5 (Worker Processing)**:
    *   Worker picks up order message.
    *   Starts a MySQL ACID Transaction:
        *   Inserts Order & Order Items records.
        *   Deducts database inventory (synchronized with Redis state).
        *   Creates a pending Transaction record.
    *   If database constraint fails (e.g. out of stock in DB due to discrepancy), worker publishes a rollback message, updates Redis, and logs failure.
    *   Worker commits MySQL transaction.

### 5.5 Transaction & Refund Module
*   Integrate third-party payment APIs (Stripe, Razorpay) asynchronously via Webhooks.
*   **Idempotency Key Verification**: Every transaction creation request must pass a unique `Idempotency-Key` header to prevent double payments.
*   Refund operations: Trigger refund requests to the gateway API, update payment ledger, release reserved stocks if cancelled prior to shipping.

### 5.6 Shipping & Tracking Module
*   Generate tracking numbers, create shipping slips.
*   Update delivery status based on mock tracking endpoints or third-party webhooks.

---

## 6. Scaling Architecture Diagram (Conceptual)

```
                            [ Client App / Web ]
                                     |
                         [ DNS / Cloudflare CDN ]
                                     |
                      [ Application Load Balancer ]
                                     |
         +---------------------------+---------------------------+
         |                           |                           |
   [ API Node 1 ]              [ API Node 2 ]              [ API Node 3 ]
         |                           |                           |
         +-------------+-------------+-------------+-------------+
                       |                           |
               [ Redis Cluster ]           [ Message Broker ]
               - Inventory Reserve         - RabbitMQ / Kafka
               - Carts / Sessions          - Order Creation Queue
               - Rate Limiting                     |
                       |                           v
               [ MySQL DB ]                 [ Worker Nodes ]
               - Primary (Writes)           - Consume Queue
               - Replicas (Reads)           - Commit DB Transactions
```

---

## 7. Development & Implementation Phases

1.  **Phase 1**: Database Design, Drizzle ORM mapping, Migrations setup, User Authentication module.
2.  **Phase 2**: Category, Product, and Variant CRUD. Search implementation.
3.  **Phase 3**: Cart, Wishlist, Address management.
4.  **Phase 4**: Basic Order & Transaction processing (Synchronous fallback for verification).
5.  **Phase 5**: High scale integration (Redis Pre-allocation + RabbitMQ queuing worker processes).
6.  **Phase 6**: Shipping & Refund module completion.
7.  **Phase 7**: Load testing (JMeter / k6) to simulate 100k concurrent requests, tuning pool sizes, and deployment.

