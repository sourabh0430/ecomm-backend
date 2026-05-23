# Technology Stack Rules

## 1. Core Stack
- **Backend:** Node.js, Express / NestJS (for enterprise scalability), TypeScript.
- **Database:** 
  - **MySQL:** using Sequelize, TypeORM, or Prisma (for transactional data).
  - **MongoDB:** using Mongoose or native driver (for flexible/unstructured data).
- **API:** Apollo GraphQL Server, REST (for webhooks).

## 2. Search & Caching
- **Search Engine:** Elasticsearch (for full-text search, filtering).
- **Caching:** Redis / AWS ElastiCache.

## 3. Infrastructure & Deployment
- **Containerization:** Docker & Docker Compose (for local development and deployment).
- **CI/CD:** GitHub Actions or GitLab CI (free for learning).
- **Cloud Provider (AWS):**
  - Compute: ECS or EC2 (free tier available).
  - Storage: S3 (for product images, user uploads).
  - Database: AWS RDS (MySQL Free Tier) and MongoDB Atlas (free tier) or self-hosted on EC2.
  - Caching: ElastiCache (Redis).
  - Notifications: AWS SNS / SES.

## 4. Third-Party Integrations (Free/Test mode options)
- **Payment Gateway:** Stripe (Test mode).
- **Shipping Services:** Shippo or EasyPost (Test mode).
- **Live Chat:** Socket.io (custom implementation for learning) or Tawk.to.
- **Emails:** Nodemailer with AWS SES or SendGrid (free tier).
