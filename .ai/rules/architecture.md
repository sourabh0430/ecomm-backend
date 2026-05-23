# Architecture Rules for Enterprise E-Commerce CRM

## 1. Scalability
- **Design Pattern:** Modular Monolith or Microservices architecture to allow independent scaling.
- **Stateless Services:** Ensure API servers are stateless. Store sessions in Redis (ElastiCache).
- **Caching:** Aggressively cache product catalogs and read-heavy endpoints using Redis and CDN.

## 2. Security Compliance
- **Authentication & Authorization:** Use JWT with short expiration and secure HTTP-only cookies for refresh tokens. Implement Role-Based Access Control (RBAC) for Admin, User, Support roles.
- **Data Protection:** Encrypt sensitive user data (PII) at rest and in transit (TLS 1.3).
- **Payment Security:** Do not store full credit card details. Use tokenization via payment gateways (e.g., Stripe) to maintain PCI-DSS compliance.
- **Rate Limiting:** Protect all endpoints using Redis-based rate limiting to prevent DDoS.

## 3. Database Strategy
- **MySQL:** Primary relational database for transactional data requiring strict ACID compliance (Users, Roles, Orders, Payments, Shipping, and Invoices).
- **MongoDB:** Primary NoSQL database for unstructured or flexible data (Product Catalogs, Variants, User Reviews, Wishlists, and Carts).
- **ElasticSearch:** Use for advanced product search, filtering, faceted search, and analytics.
- **Redis (ElastiCache):** Use for caching, session management, and pub/sub for real-time notifications.

## 4. API Layer
- **GraphQL:** Primary API interface for client applications to prevent over-fetching/under-fetching.
- **REST:** Expose specific REST endpoints for webhooks (payment gateways, shipping providers).

## 5. Development Standards
- TypeScript for strong typing across the entire stack.
- Comprehensive logging and monitoring (e.g., Winston, ELK stack).
- Minimum 80% test coverage using Jest/Mocha.
